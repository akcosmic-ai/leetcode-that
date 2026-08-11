/* view-settings.js :: theme, editor prefs, the optional Judge0 run mode, and
 * backup/restore so progress is not trapped in one browser's localStorage.
 */
(function (LC) {
  'use strict';
  var views = LC.views = LC.views || {};
  var esc = function (s) { return LC.ui.esc(s); };

  function sel(id, label, value, options, help) {
    return '<label class="fld"><span>' + esc(label) + '</span><select id="' + id + '">' +
      options.map(function (o) {
        return '<option value="' + esc(o[0]) + '"' + (String(value) === String(o[0]) ? ' selected' : '') + '>' +
               esc(o[1]) + '</option>';
      }).join('') + '</select>' + (help ? '<span class="dim">' + esc(help) + '</span>' : '') + '</label>';
  }

  views.settings = function (host) {
    var s = LC.settings();
    var srsCount = Object.keys(LC.srs.all()).length;
    var draftCount = LC.store.keys().filter(function (k) { return k.indexOf('draft:') === 0; }).length;

    host.innerHTML =
      '<div class="crumbs"><a href="#/">Dashboard</a> › Settings</div><h1>Settings</h1>' +

      '<div class="step"><header><span class="sn">1</span><h2>Look and feel</h2></header><div class="body">' +
        sel('setTheme', 'Theme', s.theme, [['auto', 'Follow the device'], ['dark', 'Dark'], ['light', 'Light']]) +
        sel('setKeypad', 'Symbol keypad under the editor', s.showKeypad,
            [['auto', 'Only on touch devices'], ['always', 'Always show it']],
            'The row of { } [ ] ; keys. Essential on an iPad, redundant with a real keyboard.') +
        sel('setAc', 'Editor suggestions', s.autocomplete ? 'on' : 'off',
            [['on', 'On (Ctrl-Space, and as you type)'], ['off', 'Off']],
            'A curated JDK dictionary plus your own identifiers. Not a compiler: it will not catch type errors.') +
        '<label class="fld"><span>Daily rep goal</span><input id="setGoal" type="number" min="1" max="50" value="' +
          esc(s.dailyGoal) + '"><span class="dim">Just the denominator on the dashboard counter.</span></label>' +
      '</div></div>' +

      '<div class="step"><header><span class="sn">2</span><h2>Online run (optional)</h2></header><div class="body">' +
        '<div class="warn-box"><b>Everything else here works offline. This does not.</b> Java cannot compile in a ' +
        'browser, so real execution is delegated to Judge0 CE over the internet. Leave it off and the check step is ' +
        'reveal + diff + hand-traced tests, which is the intended default.</div>' +
        '<div class="check"><input type="checkbox" id="setJudge"' + (s.judgeEnabled ? ' checked' : '') + '>' +
          '<label for="setJudge">Enable compile &amp; run through Judge0</label></div>' +
        '<label class="fld"><span>Judge0 base URL</span><input id="setJudgeUrl" type="url" value="' + esc(s.judgeUrl) +
          '" placeholder="https://judge0-ce.p.rapidapi.com"></label>' +
        '<label class="fld"><span>API key (stored only in this browser)</span><input id="setJudgeKey" type="password" ' +
          'value="' + esc(s.judgeKey) + '" placeholder="RapidAPI key" autocomplete="off"></label>' +
        '<label class="fld"><span>RapidAPI host header</span><input id="setJudgeHost" type="text" value="' +
          esc(s.judgeHost) + '" placeholder="judge0-ce.p.rapidapi.com"><span class="dim">Leave blank for a ' +
          'self-hosted Judge0 that does not need it.</span></label>' +
        sel('setLang', 'Java language id', s.judgeLanguageId,
            [['62', '62 — Java (OpenJDK 13)'], ['91', '91 — Java (JDK 17)']],
            'Judge0 CE ids. If a submission fails with "language not found", try the other one.') +
        '<div class="row"><button id="btnJudgeTest">Test the connection</button></div>' +
        '<div id="judgeTestOut"></div>' +
        '<p class="dim" style="margin-top:10px">Two honest caveats. (1) I have never executed this round trip, ' +
        'because it needs your key. (2) RapidAPI often rejects requests whose Origin is <code>null</code>, which is ' +
        'what a page opened as <code>file://</code> sends. If you see a CORS or 403 error, serve the folder first:<br>' +
        '<code>python -m http.server 8000</code> then open <code>http://localhost:8000</code>.</p>' +
      '</div></div>' +

      '<div class="step"><header><span class="sn">3</span><h2>Your data</h2></header><div class="body">' +
        '<p class="muted">Everything lives in this browser\'s localStorage: ' + srsCount + ' scheduled problems, ' +
        draftCount + ' saved drafts. Clearing site data wipes it, and it does not follow you to your phone. ' +
        'Export before you clear, import on the other device.</p>' +
        '<div class="row"><button id="btnExport">Export a backup (.json)</button>' +
        '<button id="btnImport" class="ghost">Import a backup</button>' +
        '<input type="file" id="fileImport" accept="application/json,.json" style="display:none"></div>' +
        '<hr><p class="dim">Irreversible:</p>' +
        '<div class="row"><button id="btnWipeDrafts" class="ghost">Delete all saved code drafts</button>' +
        '<button id="btnWipeAll" class="ghost" style="border-color:var(--bad);color:var(--bad)">Reset all progress</button></div>' +
      '</div></div>' +

      '<div class="step"><header><span class="sn">4</span><h2>How the schedule works</h2></header><div class="body">' +
        '<p>SM-2, the SuperMemo/Anki algorithm. Each problem carries an <b>ease</b> (starts 2.5) and an ' +
        '<b>interval</b> in days.</p>' +
        '<ul><li>Rate <b>1</b> or <b>2</b>: failed. Interval resets to 1 day, status becomes Needs review, ease drops.</li>' +
        '<li>Rate <b>3</b>, <b>4</b> or <b>5</b>: passed. Interval walks 1 day → 3 days → previous × ease. ' +
        'A 5 nudges ease up, a 3 nudges it down.</li>' +
        '<li>Ease is clamped to 1.3–2.8 and the interval caps at a year.</li></ul>' +
        '<p class="dim">So a problem you keep fumbling comes back tomorrow, and one you nail three times in a row ' +
        'drifts out past a month. That is the intended behaviour, not a bug.</p>' +
      '</div></div>';

    function onChange(id, fn, ev) {
      var el = host.querySelector('#' + id);
      if (el) el.addEventListener(ev || 'change', function () { fn(el); });
    }
    onChange('setTheme', function (el) { LC.saveSettings({ theme: el.value }); LC.ui.applyTheme(); LC.ui.toast('Theme: ' + el.value); });
    onChange('setKeypad', function (el) { LC.saveSettings({ showKeypad: el.value }); LC.ui.toast('Saved'); });
    onChange('setAc', function (el) { LC.saveSettings({ autocomplete: el.value === 'on' }); LC.ui.toast('Saved. Reopen a problem to apply.'); });
    onChange('setGoal', function (el) { LC.saveSettings({ dailyGoal: Math.max(1, parseInt(el.value, 10) || 3) }); });
    onChange('setJudge', function (el) { LC.saveSettings({ judgeEnabled: el.checked }); LC.ui.toast(el.checked ? 'Online run enabled' : 'Online run off'); });
    onChange('setJudgeUrl', function (el) { LC.saveSettings({ judgeUrl: el.value.trim() }); }, 'input');
    onChange('setJudgeKey', function (el) { LC.saveSettings({ judgeKey: el.value.trim() }); }, 'input');
    onChange('setJudgeHost', function (el) { LC.saveSettings({ judgeHost: el.value.trim() }); }, 'input');
    onChange('setLang', function (el) { LC.saveSettings({ judgeLanguageId: parseInt(el.value, 10) }); });

    var out = host.querySelector('#judgeTestOut');
    host.querySelector('#btnJudgeTest').addEventListener('click', function () {
      out.innerHTML = '<p class="dim">Compiling a hello-world on Judge0…</p>';
      var src = 'public class Main { public static void main(String[] a) { System.out.println("ok"); } }';
      LC.judge.submit(src, '', 'ok')
        .then(function (r) {
          out.innerHTML = r.accepted
            ? '<div class="card" style="border-color:var(--ok);margin-top:10px"><b>Working.</b> Judge0 said ' +
              esc(r.status) + ' in ' + esc(r.time || '?') + 's.</div>'
            : '<div class="warn-box"><b>Reached Judge0 but the run was not accepted:</b> ' + esc(r.status) +
              (r.compileOutput ? '<pre>' + esc(r.compileOutput) + '</pre>' : '') + '</div>';
        })
        .catch(function (e) { out.innerHTML = '<div class="warn-box"><b>Failed.</b><br>' + esc(e.message) + '</div>'; });
    });

    host.querySelector('#btnExport').addEventListener('click', function () {
      var blob = new Blob([JSON.stringify(LC.exportAll(), null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'leetcode-that-backup-' + LC.srs.todayISO() + '.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
      LC.ui.toast('Backup downloaded');
    });
    var fileIn = host.querySelector('#fileImport');
    host.querySelector('#btnImport').addEventListener('click', function () { fileIn.click(); });
    fileIn.addEventListener('change', function () {
      var f = fileIn.files && fileIn.files[0];
      if (!f) return;
      var fr = new FileReader();
      fr.onload = function () {
        try {
          var n = LC.importAll(JSON.parse(fr.result));
          LC.ui.toast('Imported ' + n + ' keys');
          LC.router.reload();
        } catch (e) { alert('Import failed: ' + e.message); }
      };
      fr.readAsText(f);
    });

    host.querySelector('#btnWipeDrafts').addEventListener('click', function () {
      if (!confirm('Delete every saved code draft? Your review schedule is kept.')) return;
      LC.store.keys().forEach(function (k) { if (k.indexOf('draft:') === 0) LC.store.del(k); });
      LC.ui.toast('Drafts deleted');
      LC.router.reload();
    });
    host.querySelector('#btnWipeAll').addEventListener('click', function () {
      if (!confirm('Reset EVERYTHING: schedules, drafts, notes and settings. This cannot be undone.')) return;
      if (!confirm('Really? Export a backup first if you are not sure.')) return;
      LC.store.keys().forEach(function (k) { LC.store.del(k); });
      LC.ui.applyTheme();
      LC.ui.toast('Everything reset');
      LC.router.go('#/');
      LC.router.reload();
    });
  };
})(window.LC = window.LC || {});
