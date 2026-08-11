/* view-problem.js :: the eight-step loop. This page IS the product.
 *
 *   1 problem   2 technique   3 intuition   4 hints
 *   5 solution  6 you type it 7 check       8 rate and schedule
 *
 * Order is deliberate and fixed: see the mechanism on a tiny input before any
 * code, struggle against hints before the answer, then reproduce from memory.
 */
(function (LC) {
  'use strict';
  var views = LC.views = LC.views || {};
  var esc = function (s) { return LC.ui.esc(s); };
  var rich = function (s) { return LC.ui.rich(s); };

  /* ---------- starter code ---------- */
  var DEFAULT_RETURN = {
    'void': null, 'boolean': 'false', 'int': '0', 'long': '0', 'short': '0', 'byte': '0',
    'double': '0', 'float': '0', 'char': "' '"
  };
  function starterFor(p) {
    if (p.starter) return p.starter;
    var sig = p.methodSignature || 'public void solve()';
    var m = /(?:public|private|protected)?\s*(?:static\s+)?([\w<>\[\],\s.]+?)\s+\w+\s*\(/.exec(sig);
    var ret = m ? m[1].trim() : 'void';
    var body = '        // TODO: write it from memory\n';
    if (ret !== 'void') {
      var dflt = DEFAULT_RETURN.hasOwnProperty(ret) ? DEFAULT_RETURN[ret] : 'null';
      if (dflt !== null) body += '        return ' + dflt + ';\n';
    }
    var extra = p.starterExtras ? '\n' + p.starterExtras + '\n' : '';
    return 'class Solution {\n    ' + sig + ' {\n' + body + '    }\n}' + extra + '\n';
  }

  function templateCodeFor(p) {
    if (!p.javaTemplate) return null;
    var t = LC.getTemplate(p.javaTemplate);
    return t ? t.code : p.javaTemplate;   // unknown key means it is inline code
  }

  /* ---------- step 1 ---------- */
  function stepProblem(p) {
    var ex = (p.examples || []).map(function (e, i) {
      return '<div class="ex"><div class="lbl">Example ' + (i + 1) + '</div>' +
             '<div class="io">in&nbsp; ' + esc(e.input) + '</div>' +
             '<div class="io">out ' + esc(e.output) + '</div>' +
             (e.note ? '<div class="note">' + rich(e.note) + '</div>' : '') + '</div>';
    }).join('');
    var cons = (p.constraints || []).length
      ? '<div class="lbl dim" style="margin-top:4px">Constraints</div><ul class="dim" style="font-family:var(--mono);font-size:.78rem">' +
        p.constraints.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>'
      : '';
    return '<div class="step"><header><span class="sn">1</span><h2>The problem</h2>' +
      '<span class="hdr-tail"><a class="btn sm ghost" href="' + esc(p.url) + '" target="_blank" rel="noopener">' +
      'Official text ↗</a></span></header><div class="body">' +
      '<p>' + rich(p.problemSummary) + '</p>' + ex + cons +
      '<p class="dim">Paraphrased on purpose. LeetCode owns the original wording, so read it there if you want it verbatim.</p>' +
      '</div></div>';
  }

  /* ---------- step 2 ---------- */
  function stepTechnique(p) {
    var pat = LC.getPattern(p.pattern);
    return '<div class="step"><header><span class="sn">2</span><h2>Key technique</h2>' +
      '<span class="hdr-tail"><a class="btn sm ghost" href="#/pattern/' + esc(p.pattern) + '">Teach page →</a></span>' +
      '</header><div class="body">' +
      '<p style="font-size:1.05rem"><b>' + esc(pat ? pat.name : p.pattern) + '</b>' +
      (p.techniqueNote ? ' — ' + rich(p.techniqueNote) : '') + '</p>' +
      '<div class="lbl dim" style="text-transform:uppercase;letter-spacing:.06em;font-size:.7rem;font-weight:750;margin-bottom:4px">' +
      'Signals that point here</div>' +
      '<ul class="signals">' + (p.signals || []).map(function (s) { return '<li>' + rich(s) + '</li>'; }).join('') + '</ul>' +
      '</div></div>';
  }

  /* ---------- step 3 ---------- */
  function stepIntuition(p) {
    var it = p.intuition || {};
    var steps = (it.steps || []).map(function (s, i) {
      return '<div class="trace-step"><span class="i">' + (i + 1) + '</span><div>' +
        (s.state ? '<div class="state">' + esc(s.state) + '</div>' : '') +
        '<div class="say">' + rich(s.say) + '</div></div></div>';
    }).join('');
    return '<div class="step"><header><span class="sn">3</span><h2>Intuition — watch it run first</h2></header><div class="body">' +
      (it.input ? '<p class="muted">Tiny input: <code>' + esc(it.input) + '</code>. No code yet, just the mechanism.</p>' : '') +
      (it.visual ? '<pre>' + esc(it.visual) + '</pre>' : '') +
      '<div class="trace">' + steps + '</div>' +
      (it.takeaway ? '<div class="takeaway"><b>Takeaway:</b> ' + rich(it.takeaway) + '</div>' : '') +
      '</div></div>';
  }

  /* ---------- step 4 ---------- */
  function stepHints(p) {
    var labels = ['Hint 1 — a nudge', 'Hint 2 — the approach', 'Hint 3 — pseudo-code'];
    var body = (p.hints || []).map(function (h, i) {
      return LC.ui.reveal(labels[i] || ('Hint ' + (i + 1)), '<p>' + rich(h) + '</p>', 'hint' + (i + 1));
    }).join('');
    return '<div class="step"><header><span class="sn">4</span><h2>Hints</h2></header><div class="body">' +
      '<p class="muted">Open one at a time. A minute of being stuck is what makes it stick.</p>' + body +
      '</div></div>';
  }

  /* ---------- step 5 ---------- */
  function stepSolution(p) {
    var inner =
      '<div id="solCode"></div>' +
      '<div class="cplx">' +
      '<div>Time <b>' + esc(p.complexity ? p.complexity.time : '?') + '</b><br><span class="dim">' +
        esc(p.complexity ? (p.complexity.timeWhy || '') : '') + '</span></div>' +
      '<div>Space <b>' + esc(p.complexity ? p.complexity.space : '?') + '</b><br><span class="dim">' +
        esc(p.complexity ? (p.complexity.spaceWhy || '') : '') + '</span></div>' +
      '</div>' +
      ((p.commonMistakes || []).length
        ? '<h3 style="margin-top:14px">Common mistakes</h3><ul>' +
          p.commonMistakes.map(function (c) { return '<li>' + rich(c) + '</li>'; }).join('') + '</ul>'
        : '') +
      ((p.followUps || []).length
        ? '<h3 style="margin-top:12px">Follow-ups</h3><ul class="dim">' +
          p.followUps.map(function (c) { return '<li>' + rich(c) + '</li>'; }).join('') + '</ul>'
        : '');
    return '<div class="step"><header><span class="sn">5</span><h2>Solution — learn by seeing</h2></header><div class="body">' +
      '<p class="muted">First time on this problem: read it line by line. Coming back for a review: do not open it.</p>' +
      LC.ui.reveal('<b>Reveal the annotated Java</b>', inner, 'solution') +
      '</div></div>';
  }

  /* ---------- step 6 ---------- */
  function stepEditor(p) {
    var tplOpts = LC.allTemplates().map(function (t) {
      return '<option value="' + esc(t.id) + '">' + esc(t.name) + '</option>';
    }).join('');
    return '<div class="step" id="stepEditor"><header><span class="sn">6</span><h2>Now you type it</h2>' +
      '<span class="hdr-tail"><span class="saved" id="savedFlag">saved locally</span></span></header>' +
      '<div class="body">' +
      '<p class="muted">Signature is given. Everything inside the method is yours. ' +
      '<kbd>Ctrl</kbd>+<kbd>Space</kbd> for suggestions, <kbd>Tab</kbd> to accept.</p>' +
      '<div class="ed-wrap">' +
        '<div class="ed-bar">' +
          '<select id="tplPick" aria-label="Insert a pattern template"><option value="">Insert template…</option>' + tplOpts + '</select>' +
          '<button class="sm" id="btnSuggest" title="Ctrl-Space">💡 Suggest</button>' +
          '<button class="sm ghost" id="btnReset" title="Back to the empty signature">⟲ Reset</button>' +
        '</div>' +
        '<div class="ed-host" id="edHost"></div>' +
      '</div>' +
      '</div></div>';
  }

  /* ---------- step 7 ---------- */
  function stepCheck(p) {
    var tests = (p.testCases || []).map(function (t, i) {
      var inp = typeof t.input === 'string' ? t.input : JSON.stringify(t.input);
      return '<tr data-test="' + i + '"><td class="io">' + esc(inp) + '</td><td class="io">' + esc(t.expected) +
             '</td><td class="io actual dim">—</td></tr>';
    }).join('');
    var judgeReady = LC.judge.ready();
    return '<div class="step"><header><span class="sn">7</span><h2>Check yourself</h2></header><div class="body">' +
      '<div class="row" style="margin-bottom:12px">' +
        '<button class="primary" id="btnCompare">Compare to reference</button>' +
        '<button id="btnRunTests"' + (judgeReady ? '' : ' disabled') + ' title="' +
          (judgeReady ? 'Compile and run on Judge0' : 'Online run is off. Enable it in Settings.') + '">▸ Run tests</button>' +
        '<button class="ghost sm" id="btnCompile"' + (judgeReady ? '' : ' disabled') + '>Compile only</button>' +
      '</div>' +
      (judgeReady ? '' : '<p class="dim">Offline check = reveal, diff and trace the tests by hand. ' +
        'Java cannot compile in a browser. Real execution needs the optional Judge0 mode in ' +
        '<a href="#/settings">Settings</a> and an internet connection.</p>') +
      '<div id="diffOut"></div>' +
      '<h3 style="margin-top:16px">Trace these by hand</h3>' +
      '<table class="tests"><thead><tr><th>Input</th><th>Expected</th><th>Your run</th></tr></thead>' +
      '<tbody id="testBody">' + (tests || '<tr><td colspan="3" class="dim">No test cases in the data for this problem.</td></tr>') + '</tbody></table>' +
      '<div id="runOut"></div>' +
      '</div></div>';
  }

  /* ---------- step 8 ---------- */
  var RATINGS = [
    { q: 1, label: 'blank' }, { q: 2, label: 'rough' }, { q: 3, label: 'got there' },
    { q: 4, label: 'smooth' }, { q: 5, label: 'instant' }
  ];
  function stepRate(p) {
    var st = LC.srs.stateOf(p.id);
    return '<div class="step"><header><span class="sn">8</span><h2>Rate &amp; schedule</h2>' +
      '<span class="hdr-tail" id="statusHolder">' + LC.ui.statusPill(st.status) + '</span></header><div class="body">' +
      '<p class="muted">How did that attempt actually go? Rate honestly, the schedule only works if you do.</p>' +
      '<div class="rate">' + RATINGS.map(function (r) {
        return '<button data-q="' + r.q + '"><span class="num">' + r.q + '</span>' + esc(r.label) + '</button>';
      }).join('') + '</div>' +
      '<div class="sched" id="schedBox">' + esc(LC.srs.describe(st)) + '</div>' +
      '<label class="fld" style="margin-top:14px"><span>What tripped you up? (kept locally)</span>' +
      '<textarea id="noteBox" rows="3" style="width:100%" placeholder="e.g. forgot that remove(int) is by index">' +
      esc(LC.notes(p.id)) + '</textarea></label>' +
      '<div class="row"><button class="sm ghost" id="btnResetSrs">Reset this problem\'s schedule</button></div>' +
      '</div></div>';
  }

  /* ---------------------------------------------------------------- view --- */
  views.problem = function (host, params) {
    var p = LC.getProblem(params.id);
    if (!p) {
      host.innerHTML = '<h1>Unknown problem</h1><p class="muted">No problem with id <code>' + esc(params.id) +
        '</code>. It may not be written yet.</p><p><a href="#/patterns">All patterns →</a></p>';
      return;
    }
    var pat = LC.getPattern(p.pattern);
    var nb = LC.neighbours(p.id);
    var st = LC.srs.stateOf(p.id);

    host.innerHTML =
      '<div class="crumbs"><a href="#/">Dashboard</a> › <a href="#/pattern/' + esc(p.pattern) + '">' +
        esc(pat ? pat.name : p.pattern) + '</a> › ' + esc(p.title) + '</div>' +
      '<div class="spread" style="margin-bottom:4px">' +
        '<h1 style="margin:0">' + esc(p.leetcodeNumber) + '. ' + esc(p.title) + '</h1>' +
        '<span class="row">' + LC.ui.duePill(p.id) + LC.ui.diffPill(p.difficulty) + '</span>' +
      '</div>' +
      '<p class="dim" style="margin-bottom:18px">' + (p.tags || []).map(function (t) {
        return '<span class="tag">' + esc(t) + '</span>'; }).join(' ') + '</p>' +
      stepProblem(p) + stepTechnique(p) + stepIntuition(p) + stepHints(p) +
      stepSolution(p) + stepEditor(p) + stepCheck(p) + stepRate(p) +
      '<div class="pager">' +
        (nb.prev ? '<a class="btn ghost" href="#/problem/' + esc(nb.prev.id) + '">‹ ' + esc(nb.prev.title) + '</a>' : '<span></span>') +
        (nb.next ? '<a class="btn ghost" href="#/problem/' + esc(nb.next.id) + '">' + esc(nb.next.title) + ' ›</a>' : '<span></span>') +
      '</div>';

    LC.ui.wireReveals(host, p.id);

    /* ---- reference solution, highlighted, inside the reveal ---- */
    var solHost = host.querySelector('#solCode');
    var solMounted = false;
    function mountSolution() {
      if (solMounted || !solHost) return;
      LC.ui.codeBlock(solHost, p.javaSolution || '// no solution in the data for this problem yet');
      solMounted = true;
    }
    // The reveal button is the trigger; mount lazily so 200 CodeMirrors never exist at once.
    var solReveal = solHost && solHost.closest('.reveal');
    if (solReveal) solReveal.querySelector('button').addEventListener('click', function () {
      setTimeout(mountSolution, 0);
    });

    /* ---- editor ---- */
    var starter = starterFor(p);
    var saved = LC.draft(p.id);
    var edHost = host.querySelector('#edHost');
    var savedFlag = host.querySelector('#savedFlag');
    var saveTimer = null;

    var ed = LC.editor.mount(edHost, {
      doc: saved == null ? starter : saved,
      dark: LC.ui.isDark(),
      onChange: function (text) {
        savedFlag.textContent = 'saving…';
        savedFlag.classList.remove('on');
        clearTimeout(saveTimer);
        saveTimer = setTimeout(function () {
          LC.saveDraft(p.id, text);
          savedFlag.textContent = 'saved locally';
          savedFlag.classList.add('on');
        }, 500);
      }
    });
    LC.ui.onThemeChange(function (dark) { try { ed.setDark(dark); } catch (e) {} });
    host.querySelector('.ed-wrap').appendChild(LC.editor.buildKeypad(ed));

    host.querySelector('#btnSuggest').addEventListener('click', function () { ed.suggest(); });
    host.querySelector('#btnReset').addEventListener('click', function () {
      if (!confirm('Replace what is in the editor with the empty signature? Your current attempt is lost.')) return;
      ed.setDoc(starter);
      LC.saveDraft(p.id, starter);
      ed.focusLineContaining('TODO');
      LC.ui.toast('Editor reset');
    });
    var tplPick = host.querySelector('#tplPick');
    tplPick.addEventListener('change', function () {
      var t = LC.getTemplate(tplPick.value);
      if (t) { ed.insert('\n' + t.code + '\n'); LC.ui.toast('Inserted: ' + t.name); }
      tplPick.value = '';
    });

    /* ---- check yourself ---- */
    var diffOut = host.querySelector('#diffOut');
    host.querySelector('#btnCompare').addEventListener('click', function () {
      var ref = p.javaSolution || '';
      if (!ref) { diffOut.innerHTML = '<div class="warn-box">No reference solution in the data yet.</div>'; return; }
      var res = LC.diff.compare(ed.getDoc(), ref);
      diffOut.innerHTML =
        '<div class="spread" style="margin:6px 0 8px"><b>Line match <span class="simscore">' + res.similarity + '%</span></b>' +
        '<span class="dim">' + res.same + ' identical · ' + res.changed + ' different · ' +
        res.added + ' missing · ' + res.removed + ' extra</span></div>' +
        LC.ui.diffHtml(res) +
        '<p class="dim" style="margin-top:6px">Whitespace and comments are ignored when matching, so only real ' +
        'differences show. A low score is not automatically wrong: there is more than one correct solution. ' +
        'Read the differences and decide.</p>';
      LC.markSeen(p.id, 'compared');
      mountSolution();
      if (solReveal && !solReveal.classList.contains('open')) {
        solReveal.classList.add('open');
        var c = solReveal.querySelector('.caret'); if (c) c.textContent = '▾';
      }
    });

    /* ---- optional Judge0 run ---- */
    var runOut = host.querySelector('#runOut');
    function showRun(html) { runOut.innerHTML = html; }
    function judgeError(err) {
      showRun('<div class="warn-box"><b>Run failed.</b><br>' + esc(err.message) + '</div>');
    }
    function renderJudge(res) {
      var head = '<div class="row" style="margin-top:12px"><b>' + esc(res.status) + '</b>' +
        (res.time ? '<span class="dim">' + esc(res.time) + 's</span>' : '') +
        (res.memory ? '<span class="dim">' + esc(res.memory) + ' KB</span>' : '') + '</div>';
      var blocks = '';
      if (res.compileOutput) blocks += '<h3>Compiler said</h3><pre>' + esc(res.compileOutput) + '</pre>';
      if (res.stderr) blocks += '<h3>stderr</h3><pre>' + esc(res.stderr) + '</pre>';
      if (res.stdout) blocks += '<h3>stdout</h3><pre>' + esc(res.stdout) + '</pre>';
      if (res.hint) blocks += '<div class="warn-box">' + esc(res.hint) + '</div>';
      showRun(head + blocks);
      if (res.perTest) {
        res.perTest.forEach(function (t) {
          var tr = host.querySelector('tr[data-test="' + t.index + '"]');
          if (!tr) return;
          tr.classList.remove('pass', 'fail');
          tr.classList.add(t.pass ? 'pass' : 'fail');
          var cell = tr.querySelector('.actual');
          cell.classList.remove('dim');
          cell.textContent = (t.pass ? '✓ ' : '✗ ') + (t.actual || '(nothing)');
        });
      }
    }
    var btnRun = host.querySelector('#btnRunTests');
    var btnCompile = host.querySelector('#btnCompile');
    btnRun.addEventListener('click', function () {
      btnRun.disabled = true;
      showRun('<p class="dim">Sending to Judge0…</p>');
      LC.judge.runAgainstTests(p, ed.getDoc())
        .then(renderJudge).catch(judgeError)
        .then(function () { btnRun.disabled = false; });
    });
    btnCompile.addEventListener('click', function () {
      btnCompile.disabled = true;
      showRun('<p class="dim">Compiling on Judge0…</p>');
      LC.judge.compileAndRun(ed.getDoc(), '')
        .then(renderJudge).catch(judgeError)
        .then(function () { btnCompile.disabled = false; });
    });

    /* ---- rate & schedule ---- */
    var schedBox = host.querySelector('#schedBox');
    var statusHolder = host.querySelector('#statusHolder');
    Array.prototype.forEach.call(host.querySelectorAll('.rate button'), function (b) {
      var q = parseInt(b.dataset.q, 10);
      function preview() {
        var nx = LC.srs.preview(p.id, q);
        schedBox.textContent = 'Rating ' + q + ' → next cold attempt ' + nx.due +
          ' (' + LC.ui.dateHuman(nx.due) + '), in ' + LC.ui.plural(nx.interval, 'day') +
          '. Status becomes ' + LC.ui.statusMeta(nx.status).label + '.';
      }
      b.addEventListener('mouseenter', preview);
      b.addEventListener('focus', preview);
      b.addEventListener('click', function () {
        var nx = LC.srs.rate(p.id, q);
        statusHolder.innerHTML = LC.ui.statusPill(nx.status);
        schedBox.textContent = LC.srs.describe(nx);
        LC.ui.toast('Scheduled for ' + LC.ui.dateHuman(nx.due));
        LC.refreshDueBadge();
      });
    });
    host.querySelector('.rate').addEventListener('mouseleave', function () {
      schedBox.textContent = LC.srs.describe(LC.srs.stateOf(p.id));
    });

    var noteBox = host.querySelector('#noteBox');
    var noteTimer = null;
    noteBox.addEventListener('input', function () {
      clearTimeout(noteTimer);
      noteTimer = setTimeout(function () { LC.saveNotes(p.id, noteBox.value); }, 500);
    });

    host.querySelector('#btnResetSrs').addEventListener('click', function () {
      if (!confirm('Forget the review schedule and history for this problem?')) return;
      var f = LC.srs.reset(p.id);
      statusHolder.innerHTML = LC.ui.statusPill(f.status);
      schedBox.textContent = LC.srs.describe(f);
      LC.refreshDueBadge();
      LC.ui.toast('Schedule reset');
    });

    /* teardown: the router calls this before rendering the next view */
    return function () {
      clearTimeout(saveTimer);
      clearTimeout(noteTimer);
      try { LC.saveDraft(p.id, ed.getDoc()); } catch (e) {}
      try { ed.destroy(); } catch (e) {}
    };
  };
})(window.LC = window.LC || {});
