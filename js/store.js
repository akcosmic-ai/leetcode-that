/* store.js :: the only place that touches localStorage, plus the read-only
 * accessors over the data files. Everything is namespaced under LC.
 *
 * Key layout (all prefixed lct.v1 so a future schema change can coexist):
 *   lct.v1.settings        {}          theme, judge config, editor prefs
 *   lct.v1.srs             {id: st}    spaced-repetition state per problem
 *   lct.v1.draft:<id>      "..."       your in-progress Java for that problem
 *   lct.v1.notes:<id>      "..."       free-text notes per problem
 *   lct.v1.seen:<id>       {}          which reveal panels you have opened
 */
(function (LC) {
  'use strict';

  var P = 'lct.v1.';

  /* ---------- raw localStorage, defensive: private mode can throw ---------- */
  var mem = {};            // fallback so the app still works if storage is blocked
  var ok = (function () {
    try { localStorage.setItem(P + 'probe', '1'); localStorage.removeItem(P + 'probe'); return true; }
    catch (e) { return false; }
  })();

  var store = {
    available: ok,
    get: function (key, dflt) {
      var raw;
      try { raw = ok ? localStorage.getItem(P + key) : mem[key]; }
      catch (e) { raw = mem[key]; }
      if (raw === null || raw === undefined) return dflt;
      try { return JSON.parse(raw); } catch (e) { return dflt; }
    },
    set: function (key, val) {
      var raw = JSON.stringify(val);
      mem[key] = raw;
      try { if (ok) localStorage.setItem(P + key, raw); } catch (e) { /* quota or private mode */ }
      return val;
    },
    del: function (key) {
      delete mem[key];
      try { if (ok) localStorage.removeItem(P + key); } catch (e) {}
    },
    keys: function () {
      var out = [];
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && k.indexOf(P) === 0) out.push(k.slice(P.length));
        }
      } catch (e) { out = Object.keys(mem); }
      return out;
    }
  };
  LC.store = store;

  /* ---------- settings ---------- */
  var SETTINGS_DEFAULTS = {
    theme: 'auto',              // 'auto' | 'dark' | 'light'
    autocomplete: true,
    showKeypad: 'auto',         // 'auto' shows it on touch devices only
    judgeEnabled: false,
    judgeUrl: 'https://judge0-ce.p.rapidapi.com',
    judgeKey: '',
    judgeHost: 'judge0-ce.p.rapidapi.com',
    judgeLanguageId: 62,        // Judge0 CE: 62 = Java (OpenJDK 13). 91 = JDK 17.
    dailyGoal: 3
  };
  LC.settings = function () {
    var s = store.get('settings', {});
    var out = {};
    for (var k in SETTINGS_DEFAULTS) out[k] = (k in s) ? s[k] : SETTINGS_DEFAULTS[k];
    return out;
  };
  LC.saveSettings = function (patch) {
    var s = LC.settings();
    for (var k in patch) s[k] = patch[k];
    store.set('settings', s);
    return s;
  };
  LC.settingsDefaults = SETTINGS_DEFAULTS;

  /* ---------- per-problem scratch state ---------- */
  LC.draft      = function (id) { return store.get('draft:' + id, null); };
  LC.saveDraft  = function (id, code) { return store.set('draft:' + id, code); };
  LC.clearDraft = function (id) { store.del('draft:' + id); };
  LC.notes      = function (id) { return store.get('notes:' + id, ''); };
  LC.saveNotes  = function (id, txt) { return store.set('notes:' + id, txt); };
  LC.seen       = function (id) { return store.get('seen:' + id, {}); };
  LC.markSeen   = function (id, what) {
    var s = LC.seen(id); s[what] = Date.now(); return store.set('seen:' + id, s);
  };

  /* ---------- data accessors (read-only view over the data/ files) ---------- */
  function byOrder(a, b) { return (a.order || 0) - (b.order || 0); }

  LC.allPatterns = function () {
    return (window.LC_PATTERNS || []).slice().sort(byOrder);
  };
  LC.getPattern = function (id) {
    var all = window.LC_PATTERNS || [];
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  };
  LC.allProblems = function () {
    var pats = LC.allPatterns(), rank = {}, i;
    for (i = 0; i < pats.length; i++) rank[pats[i].id] = i;
    return (window.LC_PROBLEMS || []).slice().sort(function (a, b) {
      var ra = rank[a.pattern], rb = rank[b.pattern];
      if (ra === undefined) ra = 999;
      if (rb === undefined) rb = 999;
      return ra !== rb ? ra - rb : byOrder(a, b);
    });
  };
  LC.problemsOf = function (patternId) {
    return (window.LC_PROBLEMS || []).filter(function (p) { return p.pattern === patternId; }).sort(byOrder);
  };
  LC.getProblem = function (id) {
    var all = window.LC_PROBLEMS || [];
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  };
  LC.getTemplate = function (id) {
    return (window.LC_TEMPLATES || {})[id] || null;
  };
  LC.allTemplates = function () {
    var t = window.LC_TEMPLATES || {}, out = [];
    for (var k in t) out.push(t[k]);
    return out.sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
  };
  /* Neighbours inside the whole curriculum, so prev/next walks the syllabus. */
  LC.neighbours = function (id) {
    var all = LC.allProblems(), i;
    for (i = 0; i < all.length; i++) if (all[i].id === id) {
      return { prev: all[i - 1] || null, next: all[i + 1] || null };
    }
    return { prev: null, next: null };
  };

  /* ---------- backup / restore (progress must not be trapped on one device) -- */
  LC.exportAll = function () {
    var dump = { _format: 'leetcode-that/v1', _exported: new Date().toISOString(), data: {} };
    store.keys().forEach(function (k) { dump.data[k] = store.get(k, null); });
    return dump;
  };
  LC.importAll = function (dump) {
    if (!dump || dump._format !== 'leetcode-that/v1' || !dump.data) {
      throw new Error('Not a leetcode-that backup file.');
    }
    var n = 0;
    for (var k in dump.data) { store.set(k, dump.data[k]); n++; }
    return n;
  };
})(window.LC = window.LC || {});
