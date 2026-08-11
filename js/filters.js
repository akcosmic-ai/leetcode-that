/* filters.js :: the pattern / difficulty / status / tag / search controls.
 * State is remembered in localStorage so a reload does not dump you back to
 * "everything".
 */
(function (LC) {
  'use strict';

  var KEY = 'filters';
  var DEFAULTS = { pattern: '', difficulty: '', status: '', tag: '', q: '' };

  function get() {
    var f = LC.store.get(KEY, {}), out = {};
    for (var k in DEFAULTS) out[k] = (k in f) ? f[k] : DEFAULTS[k];
    return out;
  }
  function set(patch) {
    var f = get();
    for (var k in patch) f[k] = patch[k];
    LC.store.set(KEY, f);
    return f;
  }
  function clear() { LC.store.set(KEY, {}); return get(); }

  function allTags() {
    var seen = {};
    LC.allProblems().forEach(function (p) {
      (p.tags || []).forEach(function (t) { seen[t] = (seen[t] || 0) + 1; });
    });
    return Object.keys(seen).sort();
  }

  function match(p, f) {
    if (f.pattern && p.pattern !== f.pattern) return false;
    if (f.difficulty && String(p.difficulty).toLowerCase() !== f.difficulty.toLowerCase()) return false;
    if (f.tag && (p.tags || []).indexOf(f.tag) < 0) return false;
    if (f.status) {
      var st = LC.srs.stateOf(p.id).status;
      if (f.status === 'due') { if (!LC.srs.isDue(p.id)) return false; }
      else if (st !== f.status) return false;
    }
    if (f.q) {
      var q = f.q.toLowerCase();
      var hay = [p.title, p.leetcodeNumber, p.pattern, (p.tags || []).join(' '),
                 p.problemSummary, (p.signals || []).join(' ')].join(' ').toLowerCase();
      if (hay.indexOf(q) < 0) return false;
    }
    return true;
  }

  function apply(list) {
    var f = get();
    return (list || LC.allProblems()).filter(function (p) { return match(p, f); });
  }

  /* Renders the control bar and calls onChange() after every edit. */
  function render(container, onChange, opts) {
    opts = opts || {};
    var f = get(), esc = LC.ui.esc;

    function optionList(items, current, blankLabel) {
      var h = '<option value="">' + esc(blankLabel) + '</option>';
      items.forEach(function (it) {
        var v = it.value === undefined ? it : it.value;
        var l = it.label === undefined ? it : it.label;
        h += '<option value="' + esc(v) + '"' + (String(current) === String(v) ? ' selected' : '') + '>' + esc(l) + '</option>';
      });
      return h;
    }

    var patternOpts = LC.allPatterns().map(function (p) {
      return { value: p.id, label: p.name + ' (' + LC.problemsOf(p.id).length + ')' };
    });

    container.innerHTML =
      '<div class="filters">' +
        (opts.hidePattern ? '' :
        '<select id="fPattern" aria-label="Filter by pattern">' + optionList(patternOpts, f.pattern, 'All patterns') + '</select>') +
        '<select id="fDiff" aria-label="Filter by difficulty">' +
          optionList([{ value: 'Easy', label: 'Easy' }, { value: 'Medium', label: 'Medium' }, { value: 'Hard', label: 'Hard' }], f.difficulty, 'Any difficulty') +
        '</select>' +
        '<select id="fStatus" aria-label="Filter by status">' +
          optionList([{ value: 'new', label: 'New' }, { value: 'learning', label: 'Learning' },
                      { value: 'solved', label: 'Solved' }, { value: 'review', label: 'Needs review' },
                      { value: 'due', label: 'Due now' }], f.status, 'Any status') +
        '</select>' +
        '<select id="fTag" aria-label="Filter by tag">' + optionList(allTags(), f.tag, 'Any tag') + '</select>' +
        '<input id="fQ" type="search" placeholder="Search title, tag, summary…" value="' + esc(f.q) + '" aria-label="Search">' +
      '</div>';

    var sel = {
      fPattern: 'pattern', fDiff: 'difficulty', fStatus: 'status', fTag: 'tag'
    };
    Object.keys(sel).forEach(function (id) {
      var el = container.querySelector('#' + id);
      if (!el) return;
      el.addEventListener('change', function () {
        var patch = {}; patch[sel[id]] = el.value; set(patch); onChange(get());
      });
    });
    var q = container.querySelector('#fQ');
    if (q) {
      var t = null;
      q.addEventListener('input', function () {
        clearTimeout(t);
        t = setTimeout(function () { set({ q: q.value }); onChange(get()); }, 180);
      });
    }
  }

  LC.filters = { get: get, set: set, clear: clear, apply: apply, match: match, render: render, allTags: allTags, DEFAULTS: DEFAULTS };
})(window.LC = window.LC || {});
