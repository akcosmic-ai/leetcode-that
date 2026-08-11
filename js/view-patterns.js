/* view-patterns.js :: the pattern index and the per-pattern "teach" page.
 * The teach page always comes before its problems: technique first, then reps.
 */
(function (LC) {
  'use strict';
  var views = LC.views = LC.views || {};
  var esc = function (s) { return LC.ui.esc(s); };
  var rich = function (s) { return LC.ui.rich(s); };

  views.patterns = function (host) {
    var t = LC.progress.overall();
    host.innerHTML =
      '<div class="crumbs"><a href="#/">Dashboard</a> › Patterns</div>' +
      '<h1>17 techniques</h1>' +
      '<p class="muted">Worked in this order. Each one is taught first, then drilled easy to hard. ' +
      esc(t.total) + ' problems loaded.</p>' +
      LC.allPatterns().map(function (pat) {
        var s = LC.progress.forPattern(pat.id);
        return '<a class="pcard ' + (s.total === 0 ? '' : (s.solved === s.total ? 'done' : 'built')) +
          '" style="margin-bottom:10px" href="#/pattern/' + esc(pat.id) + '">' +
          '<div class="row" style="align-items:flex-start">' +
            '<span class="num">' + (pat.order || '') + '</span>' +
            '<span class="grow"><h3>' + esc(pat.name) + '</h3>' +
            '<p class="blurb">' + esc(pat.blurb || '') + '</p>' +
            '<div class="meta">' + (s.total === 0 ? '<span class="tag">not built yet</span>' :
              '<span>' + s.total + ' problems · ' + s.easy + 'E / ' + s.medium + 'M / ' + s.hard + 'H</span>' +
              '<span>· ' + s.solved + ' solved</span>' +
              (s.due ? '<span class="pill due">' + s.due + ' due</span>' : '')) +
            '</div></span>' +
          '</div></a>';
      }).join('');
  };

  views.pattern = function (host, params) {
    var pat = LC.getPattern(params.id);
    if (!pat) {
      host.innerHTML = '<h1>Unknown pattern</h1><p class="muted">No pattern with id <code>' +
        esc(params.id) + '</code>.</p><p><a href="#/patterns">All patterns →</a></p>';
      return;
    }
    var problems = LC.problemsOf(pat.id);
    var s = LC.progress.forPattern(pat.id);
    var tpl = pat.templateId ? LC.getTemplate(pat.templateId) : null;

    var html = '';
    html += '<div class="crumbs"><a href="#/">Dashboard</a> › <a href="#/patterns">Patterns</a> › ' + esc(pat.name) + '</div>';
    html += '<h1>' + esc(pat.name) + '</h1>';
    html += '<p class="muted">' + esc(pat.blurb || '') + '</p>';

    if (s.total) {
      html += '<div class="card" style="margin:0 0 18px">' +
        '<div class="spread" style="margin-bottom:7px"><b>' + s.solved + ' of ' + s.total + ' solved</b>' +
        '<span class="dim">' + s.easy + ' easy · ' + s.medium + ' medium · ' + s.hard + ' hard</span></div>' +
        '<div class="bar"><i class="' + (s.solved === s.total ? 'full' : '') + '" style="width:' +
        LC.ui.pct(s.solved, s.total) + '%"></i></div></div>';
    } else {
      html += '<div class="warn-box">This pattern is scaffolded but its problems are not written yet. ' +
              'The teach text below is real; the problem list is empty.</div>';
    }

    /* 1. what it is */
    html += '<div class="step"><header><span class="sn">1</span><h2>What it is</h2></header><div class="body">' +
            (pat.whatItIs || []).map(function (p) { return '<p>' + rich(p) + '</p>'; }).join('') +
            '</div></div>';

    /* 2. when to reach for it */
    html += '<div class="step"><header><span class="sn">2</span><h2>When to reach for it</h2></header><div class="body">' +
            '<ul class="signals">' + (pat.whenToReach || []).map(function (x) {
              return '<li>' + rich(x) + '</li>'; }).join('') + '</ul>' +
            (pat.notWhen ? '<p class="dim" style="margin-top:10px"><b>Not this pattern when:</b> ' + rich(pat.notWhen) + '</p>' : '') +
            '</div></div>';

    /* 3. the shape (template) */
    if (tpl) {
      html += '<div class="step"><header><span class="sn">3</span><h2>The shape</h2>' +
              '<span class="hdr-tail"><button class="sm" id="copyTpl">Copy</button></span></header>' +
              '<div class="body">' +
              (tpl.notes ? '<p class="muted">' + rich(tpl.notes) + '</p>' : '') +
              '<div id="tplCode"></div>' +
              '<p class="dim" style="margin-top:8px">This same template is pre-loaded into the editor on every ' +
              'problem in this pattern, and is available from the Templates dropdown everywhere.</p>' +
              '</div></div>';
    }

    /* 4. complexity */
    if (pat.typicalComplexity) {
      html += '<div class="step"><header><span class="sn">' + (tpl ? 4 : 3) + '</span><h2>Typical complexity</h2></header>' +
              '<div class="body"><div class="cplx">' +
              '<div>Time <b>' + esc(pat.typicalComplexity.time) + '</b><br><span class="dim">' +
                esc(pat.typicalComplexity.timeWhy || '') + '</span></div>' +
              '<div>Space <b>' + esc(pat.typicalComplexity.space) + '</b><br><span class="dim">' +
                esc(pat.typicalComplexity.spaceWhy || '') + '</span></div>' +
              '</div></div></div>';
    }

    /* 5. pitfalls */
    if ((pat.pitfalls || []).length) {
      html += '<div class="step"><header><span class="sn">' + (tpl ? 5 : 4) + '</span><h2>Where this goes wrong</h2></header>' +
              '<div class="body"><ul>' + pat.pitfalls.map(function (p) { return '<li>' + rich(p) + '</li>'; }).join('') +
              '</ul></div></div>';
    }

    /* 6. the problems */
    html += '<div class="step"><header><span class="sn">' + (tpl ? 6 : 5) + '</span><h2>Problems, easy first</h2></header>' +
            '<div class="body" style="padding:0">';
    if (problems.length) {
      html += '<div class="plist" style="border:0;border-radius:0">' +
              problems.map(function (p) { return LC.views.problemRow(p); }).join('') + '</div>';
    } else {
      html += '<div class="empty">Not written yet.</div>';
    }
    html += '</div></div>';

    if ((pat.related || []).length) {
      html += '<p class="dim">Related: ' + pat.related.map(function (rid) {
        var r = LC.getPattern(rid);
        return r ? '<a href="#/pattern/' + esc(r.id) + '">' + esc(r.name) + '</a>' : esc(rid);
      }).join(' · ') + '</p>';
    }

    var prev = null, next = null, all = LC.allPatterns();
    all.forEach(function (p, i) { if (p.id === pat.id) { prev = all[i - 1]; next = all[i + 1]; } });
    html += '<div class="pager">' +
      (prev ? '<a class="btn ghost" href="#/pattern/' + esc(prev.id) + '">‹ ' + esc(prev.name) + '</a>' : '<span></span>') +
      (next ? '<a class="btn ghost" href="#/pattern/' + esc(next.id) + '">' + esc(next.name) + ' ›</a>' : '<span></span>') +
      '</div>';

    host.innerHTML = html;

    if (tpl) {
      LC.ui.codeBlock(host.querySelector('#tplCode'), tpl.code);
      host.querySelector('#copyTpl').addEventListener('click', function () {
        navigator.clipboard && navigator.clipboard.writeText(tpl.code)
          .then(function () { LC.ui.toast('Template copied'); })
          .catch(function () { LC.ui.toast('Clipboard blocked. Select the code and copy manually.'); });
      });
    }
  };
})(window.LC = window.LC || {});
