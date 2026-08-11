/* diff.js :: side-by-side line diff, yours vs the reference.
 *
 * Plain LCS dynamic programming over lines. Solutions here are tens of lines,
 * so an O(n*m) table is free. No library.
 *
 * Comparison is done on NORMALISED lines (whitespace collapsed, comments and
 * blank lines optionally dropped) so that indentation differences and your own
 * comments do not drown the real differences. The text shown is the original.
 */
(function (LC) {
  'use strict';

  function normalise(line, opts) {
    var s = line;
    if (opts.ignoreComments) s = s.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '');
    s = s.replace(/\s+/g, ' ').trim();
    if (opts.ignoreCase) s = s.toLowerCase();
    return s;
  }

  function split(text, opts) {
    var raw = String(text == null ? '' : text).replace(/\r\n?/g, '\n').split('\n');
    var out = [];
    for (var i = 0; i < raw.length; i++) {
      var n = normalise(raw[i], opts);
      if (opts.ignoreBlank && n === '') continue;
      out.push({ text: raw[i], key: n, no: i + 1 });
    }
    return out;
  }

  /* Returns { rows, same, added, removed, changed, similarity } */
  function compare(mine, reference, options) {
    var opts = {
      ignoreComments: true,
      ignoreBlank: true,
      ignoreCase: false
    };
    for (var k in (options || {})) opts[k] = options[k];

    var A = split(mine, opts);          // left  = yours
    var B = split(reference, opts);      // right = reference
    var n = A.length, m = B.length, i, j;

    // LCS table
    var dp = new Array(n + 1);
    for (i = 0; i <= n; i++) { dp[i] = new Int32Array(m + 1); }
    for (i = n - 1; i >= 0; i--) {
      for (j = m - 1; j >= 0; j--) {
        dp[i][j] = A[i].key === B[j].key ? dp[i + 1][j + 1] + 1
                                         : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }

    // walk to build an op list
    var ops = [];
    i = 0; j = 0;
    while (i < n && j < m) {
      if (A[i].key === B[j].key) { ops.push({ t: 'same', a: A[i], b: B[j] }); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push({ t: 'del', a: A[i] }); i++; }
      else { ops.push({ t: 'add', b: B[j] }); j++; }
    }
    while (i < n) { ops.push({ t: 'del', a: A[i] }); i++; }
    while (j < m) { ops.push({ t: 'add', b: B[j] }); j++; }

    // pair a run of deletions with the run of additions that follows it, so a
    // rewritten line shows opposite each other instead of on separate rows
    var rows = [], p = 0;
    while (p < ops.length) {
      if (ops[p].t === 'same') { rows.push({ type: 'same', left: ops[p].a, right: ops[p].b }); p++; continue; }
      var dels = [], adds = [];
      while (p < ops.length && ops[p].t === 'del') { dels.push(ops[p].a); p++; }
      while (p < ops.length && ops[p].t === 'add') { adds.push(ops[p].b); p++; }
      var len = Math.max(dels.length, adds.length);
      for (var q = 0; q < len; q++) {
        var L = dels[q] || null, R = adds[q] || null;
        rows.push({ type: L && R ? 'chg' : (L ? 'del' : 'add'), left: L, right: R });
      }
    }

    var same = 0, added = 0, removed = 0, changed = 0;
    rows.forEach(function (r) {
      if (r.type === 'same') same++;
      else if (r.type === 'add') added++;
      else if (r.type === 'del') removed++;
      else changed++;
    });
    var total = n + m;
    var similarity = total === 0 ? 0 : Math.round((2 * same * 100) / total);

    return { rows: rows, same: same, added: added, removed: removed, changed: changed,
             similarity: similarity, leftLines: n, rightLines: m };
  }

  LC.diff = { compare: compare, normalise: normalise };
})(window.LC = window.LC || {});
