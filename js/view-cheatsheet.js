/* view-cheatsheet.js :: complexity reference plus a growth picture.
 * The "guess the target complexity from n" table is the single most useful thing
 * on this page: constraints tell you the intended solution before you start.
 */
(function (LC) {
  'use strict';
  var views = LC.views = LC.views || {};
  var esc = function (s) { return LC.ui.esc(s); };

  var CURVES = [
    { name: 'O(1)',        cls: 'o-good', f: function () { return 1; } },
    { name: 'O(log n)',    cls: 'o-good', f: function (n) { return Math.log2(n + 1); } },
    { name: 'O(n)',        cls: 'o-good', f: function (n) { return n; } },
    { name: 'O(n log n)',  cls: 'o-mid',  f: function (n) { return n * Math.log2(n + 1); } },
    { name: 'O(n²)',       cls: 'o-bad',  f: function (n) { return n * n; } },
    { name: 'O(2ⁿ)',       cls: 'o-bad',  f: function (n) { return Math.pow(2, n); } }
  ];
  var COLORS = ['#3fd68c', '#4fd1c5', '#7cc4ff', '#ffc247', '#ff9f45', '#ff6b6b'];

  function growthSvg() {
    var W = 640, H = 300, PAD = 34, N = 24, CAP = 220;
    var lines = CURVES.map(function (c, i) {
      var pts = [];
      for (var n = 1; n <= N; n++) {
        var v = Math.min(c.f(n), CAP);
        var x = PAD + (n - 1) / (N - 1) * (W - PAD * 2);
        var y = H - PAD - (v / CAP) * (H - PAD * 2);
        pts.push(x.toFixed(1) + ',' + Math.max(PAD - 6, y).toFixed(1));
      }
      return '<polyline fill="none" stroke="' + COLORS[i] + '" stroke-width="2.2" stroke-linejoin="round" points="' +
             pts.join(' ') + '"/>';
    }).join('');
    var labels = CURVES.map(function (c, i) {
      return '<g transform="translate(' + (PAD + 4) + ',' + (PAD + 2 + i * 16) + ')">' +
        '<rect width="9" height="9" y="-8" fill="' + COLORS[i] + '" rx="2"/>' +
        '<text x="14" y="0" font-size="11" fill="currentColor">' + c.name + '</text></g>';
    }).join('');
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="Growth of common complexity classes" ' +
      'style="max-width:100%;color:var(--text-2)">' +
      '<line x1="' + PAD + '" y1="' + (H - PAD) + '" x2="' + (W - PAD) + '" y2="' + (H - PAD) + '" stroke="currentColor" stroke-width="1" opacity=".4"/>' +
      '<line x1="' + PAD + '" y1="' + PAD + '" x2="' + PAD + '" y2="' + (H - PAD) + '" stroke="currentColor" stroke-width="1" opacity=".4"/>' +
      '<text x="' + (W / 2) + '" y="' + (H - 8) + '" font-size="11" text-anchor="middle" fill="currentColor">input size n →</text>' +
      '<text x="10" y="' + (H / 2) + '" font-size="11" fill="currentColor" transform="rotate(-90 12 ' + (H / 2) + ')">work done →</text>' +
      lines + labels + '</svg>';
  }

  var STRUCTS = [
    ['ArrayList / int[]', 'O(1)', 'O(n)', 'O(1)*', 'O(n)', 'Random access is the whole point. Insert/remove in the middle shifts everything.'],
    ['LinkedList', 'O(n)', 'O(n)', 'O(1) at ends', 'O(1) at ends', 'Almost never the right answer in Java. Use ArrayDeque.'],
    ['HashMap / HashSet', '—', 'O(1) avg', 'O(1) avg', 'O(1) avg', 'Worst case O(n) on pathological hashing. Unordered.'],
    ['TreeMap / TreeSet', '—', 'O(log n)', 'O(log n)', 'O(log n)', 'Sorted, and gives you floor/ceiling/higher/lower.'],
    ['ArrayDeque', '—', 'O(n)', 'O(1) at ends', 'O(1) at ends', 'The correct Java stack AND queue.'],
    ['PriorityQueue', '—', 'O(n)', 'O(log n)', 'O(log n)', 'peek() is O(1). Not sorted when you iterate it.'],
    ['StringBuilder', 'O(1)', 'O(n)', 'O(1) append', 'O(1) at end', 'Building a String with += in a loop is O(n²).'],
    ['Trie (26-way)', '—', 'O(len)', 'O(len)', 'O(len)', 'Independent of how many words are stored.']
  ];

  var TARGETS = [
    ['n ≤ 10',        'O(n!) or O(n·n!)',  'Permutations. Backtracking with no pruning is fine.'],
    ['n ≤ 20',        'O(2ⁿ)',             'Subsets, bitmask DP.'],
    ['n ≤ 100',       'O(n³)',             'Triple loop, Floyd-Warshall, interval DP.'],
    ['n ≤ 1 000',     'O(n²)',             'Nested loop, 2-D DP over the whole grid.'],
    ['n ≤ 100 000',   'O(n log n)',        'Sort, heap, binary search per element, TreeMap.'],
    ['n ≤ 1 000 000', 'O(n) or O(n log n)','One pass, hash map, sliding window, prefix sums.'],
    ['n ≥ 10⁹',       'O(log n) or O(1)',  'Binary search on the ANSWER, maths, bit tricks.']
  ];

  views.cheatsheet = function (host) {
    var html = '<div class="crumbs"><a href="#/">Dashboard</a> › Big-O</div><h1>Complexity cheat sheet</h1>';

    html += '<div class="card" style="margin-bottom:18px">' + growthSvg() +
      '<p class="dim" style="margin-top:6px">Same axes for all six. The point is not the exact curve, it is that ' +
      'O(n²) and O(2ⁿ) leave the screen while O(log n) barely moves.</p></div>';

    html += '<h2>Read the constraints, then pick the technique</h2>' +
      '<p class="muted">This table is the most useful thing on the page. The problem tells you what solution it wants.</p>' +
      '<div class="card" style="padding:0;overflow-x:auto;margin-bottom:22px"><table class="bigo">' +
      '<thead><tr><th>If n is</th><th>Aim for</th><th>Which usually means</th></tr></thead><tbody>' +
      TARGETS.map(function (r) {
        return '<tr><td class="o">' + esc(r[0]) + '</td><td class="o">' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>';
      }).join('') + '</tbody></table></div>';

    html += '<h2>Java data structures</h2>' +
      '<div class="card" style="padding:0;overflow-x:auto;margin-bottom:22px"><table class="bigo">' +
      '<thead><tr><th>Structure</th><th>Access</th><th>Search</th><th>Insert</th><th>Delete</th><th>Notes</th></tr></thead><tbody>' +
      STRUCTS.map(function (r) {
        return '<tr><td><b>' + esc(r[0]) + '</b></td>' +
          r.slice(1, 5).map(function (c) { return '<td class="o">' + esc(c) + '</td>'; }).join('') +
          '<td class="dim">' + esc(r[5]) + '</td></tr>';
      }).join('') + '</tbody></table>' +
      '<p class="dim" style="padding:10px 12px;margin:0">* Amortised: an ArrayList doubles its backing array when full.</p></div>';

    html += '<h2>Per-pattern typical cost</h2>' +
      '<div class="card" style="padding:0;overflow-x:auto"><table class="bigo">' +
      '<thead><tr><th>Pattern</th><th>Time</th><th>Space</th></tr></thead><tbody>' +
      LC.allPatterns().map(function (p) {
        var c = p.typicalComplexity || {};
        return '<tr><td><a href="#/pattern/' + esc(p.id) + '">' + esc(p.name) + '</a></td>' +
          '<td class="o">' + esc(c.time || '—') + '</td><td class="o">' + esc(c.space || '—') + '</td></tr>';
      }).join('') + '</tbody></table></div>';

    html += '<h2 style="margin-top:22px">Three rules that cover most mistakes</h2><ol>' +
      '<li><b>Drop constants and lower terms.</b> O(3n + 5) is O(n). O(n² + n) is O(n²).</li>' +
      '<li><b>Nested loops multiply, sequential loops add.</b> Two separate passes is still O(n).</li>' +
      '<li><b>Recursion cost = number of calls × work per call.</b> Memoisation turns exponential call counts into ' +
      'one call per distinct state, which is why DP works.</li></ol>';

    host.innerHTML = html;
  };
})(window.LC = window.LC || {});
