/* srs.js :: spaced repetition, SM-2.
 *
 * Why SM-2: it is the algorithm behind Anki/SuperMemo, it needs one number from
 * you (how well did that go, 1-5), and it self-tunes per problem. Problems you
 * find hard come back fast; problems you nail drift out to weeks.
 *
 * The numbers:
 *   ease (EF)  starts at 2.5, clamped to [1.3, 2.8]. It is the multiplier.
 *   interval   days until the next cold attempt.
 *   reps       consecutive successful reviews (q >= 3).
 *
 * Rating -> what happens
 *   1 blank      fail: reps 0, interval 1 day,  status needs-review
 *   2 rough      fail: reps 0, interval 1 day,  status needs-review
 *   3 got there  pass: 1 day -> 3 days -> x ease, ease drops a little
 *   4 smooth     pass: same ladder, ease holds
 *   5 instant    pass: same ladder, ease rises
 *
 * Everything is stored per problem id under lct.v1.srs.
 */
(function (LC) {
  'use strict';

  var MIN_EF = 1.3, MAX_EF = 2.8, MAX_INTERVAL = 365;

  function todayISO(d) {
    d = d || new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }
  function addDays(iso, n) {
    var d = new Date(iso + 'T12:00:00');
    d.setDate(d.getDate() + n);
    return todayISO(d);
  }
  function daysBetween(fromISO, toISO) {
    var a = new Date(fromISO + 'T12:00:00'), b = new Date(toISO + 'T12:00:00');
    return Math.round((b - a) / 86400000);
  }

  function fresh() {
    return { status: 'new', ease: 2.5, interval: 0, reps: 0, lapses: 0,
             due: null, lastRated: null, history: [] };
  }

  function all() { return LC.store.get('srs', {}); }
  function saveAll(map) { return LC.store.set('srs', map); }

  function stateOf(id) {
    var st = all()[id];
    if (!st) return fresh();
    var f = fresh();
    for (var k in st) f[k] = st[k];
    return f;
  }

  /* Pure: given a state and a rating, what would the next state be?
   * Used both to actually rate and to preview ("picking 3 schedules this for..."). */
  function next(st, q, todayOverride) {
    var today = todayOverride || todayISO();
    var n = { status: st.status, ease: st.ease, interval: st.interval, reps: st.reps,
              lapses: st.lapses, due: st.due, lastRated: st.lastRated,
              history: (st.history || []).slice(-49) };

    if (q < 3) {
      n.reps = 0;
      n.interval = 1;
      n.lapses = st.lapses + 1;
      n.status = 'review';                       // needs-review
      // A lapse still nudges ease down, same as SM-2's quality curve.
      n.ease = Math.max(MIN_EF, st.ease - (q === 1 ? 0.25 : 0.15));
    } else {
      var delta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);   // SM-2 ease update
      n.ease = Math.min(MAX_EF, Math.max(MIN_EF, st.ease + delta));
      if (st.reps === 0)      n.interval = 1;
      else if (st.reps === 1) n.interval = 3;
      else                    n.interval = Math.min(MAX_INTERVAL, Math.round(st.interval * n.ease));
      n.reps = st.reps + 1;
      n.status = (q >= 4 && n.reps >= 2) ? 'solved' : 'learning';
    }

    n.due = addDays(today, n.interval);
    n.lastRated = today;
    n.history.push({ d: today, q: q });
    return n;
  }

  var srs = {
    /* ---- reads ---- */
    todayISO: todayISO,
    addDays: addDays,
    daysBetween: daysBetween,
    fresh: fresh,
    all: all,
    stateOf: stateOf,
    statusOf: function (id) { return stateOf(id).status; },

    isDue: function (id) {
      var st = stateOf(id);
      if (st.status === 'new' || !st.due) return false;
      return st.due <= todayISO();
    },

    /* Problems whose next cold attempt has come round, hardest-overdue first. */
    due: function () {
      var t = todayISO(), map = all(), out = [];
      LC.allProblems().forEach(function (p) {
        var st = map[p.id];
        if (st && st.due && st.due <= t) out.push({ problem: p, state: stateOf(p.id) });
      });
      out.sort(function (a, b) {
        if (a.state.due !== b.state.due) return a.state.due < b.state.due ? -1 : 1;
        return a.state.ease - b.state.ease;          // shakier problems first
      });
      return out;
    },
    dueCount: function () { return srs.due().length; },

    /* Next 14 days of scheduled reviews, for the dashboard forecast bars. */
    forecast: function (days) {
      days = days || 14;
      var t = todayISO(), map = all(), buckets = [], i;
      for (i = 0; i < days; i++) buckets.push({ date: addDays(t, i), n: 0 });
      for (var id in map) {
        var d = map[id].due;
        if (!d) continue;
        var k = daysBetween(t, d);
        if (k < 0) k = 0;
        if (k < days) buckets[k].n++;
      }
      return buckets;
    },

    /* ---- writes ---- */
    preview: function (id, q) { return next(stateOf(id), q); },

    rate: function (id, q) {
      q = Math.max(1, Math.min(5, q | 0));
      var map = all();
      map[id] = next(stateOf(id), q);
      saveAll(map);
      return map[id];
    },

    /* Manual status override from the UI (does not touch the schedule maths). */
    setStatus: function (id, status) {
      var map = all();
      var st = stateOf(id);
      st.status = status;
      if (status === 'new') { map[id] && delete map[id]; saveAll(map); return fresh(); }
      map[id] = st; saveAll(map); return st;
    },

    reset: function (id) {
      var map = all();
      delete map[id];
      saveAll(map);
      return fresh();
    },

    /* Plain-English sentence for the schedule box. */
    describe: function (st) {
      if (!st || st.status === 'new') return 'Not scheduled yet. Rate it once to put it in the rotation.';
      var when = st.interval === 1 ? 'tomorrow'
               : st.interval < 7 ? 'in ' + st.interval + ' days'
               : st.interval < 30 ? 'in ' + Math.round(st.interval / 7) + ' week' + (st.interval >= 14 ? 's' : '')
               : 'in ' + Math.round(st.interval / 30) + ' month' + (st.interval >= 60 ? 's' : '');
      return 'Back ' + when + ' (' + st.due + '). Ease ' + st.ease.toFixed(2) +
             ', streak ' + st.reps + (st.lapses ? ', ' + st.lapses + ' lapse' + (st.lapses > 1 ? 's' : '') : '') + '.';
    }
  };

  LC.srs = srs;
})(window.LC = window.LC || {});
