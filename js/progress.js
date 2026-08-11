/* progress.js :: turns raw SRS state into the numbers the dashboard shows.
 * Read-only. Nothing here writes to storage.
 */
(function (LC) {
  'use strict';

  function tally(problems) {
    var out = { total: problems.length, 'new': 0, learning: 0, solved: 0, review: 0,
                due: 0, attempted: 0, easy: 0, medium: 0, hard: 0,
                easySolved: 0, mediumSolved: 0, hardSolved: 0 };
    problems.forEach(function (p) {
      var st = LC.srs.stateOf(p.id);
      out[st.status] = (out[st.status] || 0) + 1;
      if (st.status !== 'new') out.attempted++;
      if (LC.srs.isDue(p.id)) out.due++;
      var d = String(p.difficulty || '').toLowerCase();
      if (out[d] !== undefined) out[d]++;
      if (st.status === 'solved') {
        if (d === 'easy') out.easySolved++;
        else if (d === 'medium') out.mediumSolved++;
        else if (d === 'hard') out.hardSolved++;
      }
    });
    out.done = out.solved;
    out.pct = out.total ? Math.round(out.solved * 100 / out.total) : 0;
    out.touchedPct = out.total ? Math.round(out.attempted * 100 / out.total) : 0;
    return out;
  }

  var progress = {
    forPattern: function (patternId) { return tally(LC.problemsOf(patternId)); },
    overall: function () { return tally(LC.allProblems()); },

    /* Consecutive days, ending today or yesterday, on which you rated at least
     * one problem. Yesterday still counts so an evening habit is not punished
     * by looking at the dashboard in the morning. */
    streak: function () {
      var map = LC.srs.all(), days = {};
      for (var id in map) {
        (map[id].history || []).forEach(function (h) { days[h.d] = 1; });
      }
      var today = LC.srs.todayISO();
      var cursor = days[today] ? today : LC.srs.addDays(today, -1);
      if (!days[cursor]) return 0;
      var n = 0;
      while (days[cursor]) { n++; cursor = LC.srs.addDays(cursor, -1); }
      return n;
    },

    ratedOn: function (iso) {
      var map = LC.srs.all(), n = 0;
      for (var id in map) {
        (map[id].history || []).forEach(function (h) { if (h.d === iso) n++; });
      }
      return n;
    },
    ratedToday: function () { return progress.ratedOn(LC.srs.todayISO()); },

    /* Patterns with at least one problem, ordered as the syllabus is. */
    patternRows: function () {
      return LC.allPatterns().map(function (pat) {
        var t = progress.forPattern(pat.id);
        return { pattern: pat, stats: t };
      });
    },

    /* Difficulty mix of the whole curated set, so the README claim is checkable
     * from inside the app. */
    mix: function () {
      var t = progress.overall();
      return {
        total: t.total,
        easy: t.easy, medium: t.medium, hard: t.hard,
        easyPct: LC.ui.pct(t.easy, t.total),
        mediumPct: LC.ui.pct(t.medium, t.total),
        hardPct: LC.ui.pct(t.hard, t.total)
      };
    }
  };

  LC.progress = progress;
})(window.LC = window.LC || {});
