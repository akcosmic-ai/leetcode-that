/* view-dashboard.js :: the landing page, plus the "due today" queue.
 * Its whole job is to make progress visible, because the reason passive reading
 * failed is that nothing ever showed movement.
 */
(function (LC) {
  'use strict';
  var views = LC.views = LC.views || {};
  var esc = function (s) { return LC.ui.esc(s); };

  function problemRow(p) {
    var st = LC.srs.stateOf(p.id);
    var pat = LC.getPattern(p.pattern);
    return '<a class="prow" href="#/problem/' + esc(p.id) + '">' +
             '<span class="no">' + esc(p.leetcodeNumber) + '</span>' +
             '<span><span class="ttl">' + esc(p.title) + '</span><br>' +
               '<span class="sub">' + esc(pat ? pat.name : p.pattern) +
               (st.status !== 'new' ? ' · ' + LC.ui.statusMeta(st.status).label : '') + '</span></span>' +
             '<span class="tail">' + LC.ui.duePill(p.id) + LC.ui.diffPill(p.difficulty) + '</span>' +
           '</a>';
  }

  function statsBlock(t, streak, ratedToday, goal) {
    return '<div class="stats">' +
      '<div class="stat"><div class="n">' + t.solved + '<span class="dim" style="font-size:.9rem"> / ' + t.total + '</span></div><div class="k">Solved</div></div>' +
      '<div class="stat"><div class="n">' + t.due + '</div><div class="k">Due today</div></div>' +
      '<div class="stat"><div class="n">' + streak + '</div><div class="k">Day streak</div></div>' +
      '<div class="stat"><div class="n">' + ratedToday + '<span class="dim" style="font-size:.9rem"> / ' + goal + '</span></div><div class="k">Reps today</div></div>' +
    '</div>';
  }

  function patternCards() {
    return '<div class="pgrid">' + LC.progress.patternRows().map(function (row) {
      var pat = row.pattern, s = row.stats;
      var cls = s.total === 0 ? '' : (s.solved === s.total ? 'done' : 'built');
      return '<a class="pcard ' + cls + '" href="#/pattern/' + esc(pat.id) + '">' +
        '<div class="row" style="align-items:flex-start">' +
          '<span class="num">' + (pat.order || '') + '</span>' +
          '<span class="grow"><h3>' + esc(pat.name) + '</h3>' +
          '<p class="blurb">' + esc(pat.blurb || '') + '</p></span>' +
        '</div>' +
        '<div class="bar"><i class="' + (s.total && s.solved === s.total ? 'full' : '') +
          '" style="width:' + (s.total ? LC.ui.pct(s.solved, s.total) : 0) + '%"></i></div>' +
        '<div class="meta" style="margin-top:7px">' +
          (s.total === 0
            ? '<span class="tag">not built yet</span>'
            : '<span>' + s.solved + ' / ' + s.total + ' solved</span>' +
              (s.due ? '<span class="pill due">' + s.due + ' due</span>' : '') +
              (s.review ? '<span class="pill review">' + s.review + '</span>' : '')) +
        '</div>' +
      '</a>';
    }).join('') + '</div>';
  }

  function forecastBlock() {
    var f = LC.srs.forecast(14);
    var max = Math.max.apply(null, f.map(function (b) { return b.n; }).concat([1]));
    if (!f.some(function (b) { return b.n > 0; })) return '';
    return '<div class="card" style="margin-bottom:18px">' +
      '<div class="spread" style="margin-bottom:8px"><h3 style="margin:0">Next 14 days</h3>' +
      '<span class="dim">reviews scheduled</span></div>' +
      '<div class="spark">' + f.map(function (b) {
        return '<i title="' + esc(b.date) + ': ' + b.n + '" style="height:' +
               Math.max(2, Math.round(b.n * 100 / max)) + '%"></i>';
      }).join('') + '</div></div>';
  }

  views.dashboard = function (host) {
    var t = LC.progress.overall();
    var mix = LC.progress.mix();
    var due = LC.srs.due();
    var streak = LC.progress.streak();
    var goal = LC.settings().dailyGoal;
    var ratedToday = LC.progress.ratedToday();

    var nextUp = null;
    if (due.length) nextUp = due[0].problem;
    else {
      var all = LC.allProblems();
      for (var i = 0; i < all.length; i++) {
        if (LC.srs.stateOf(all[i].id).status === 'new') { nextUp = all[i]; break; }
      }
    }

    var html = '';
    html += '<h1>Learn the technique, then reproduce it.</h1>';
    html += '<p class="muted" style="margin-bottom:16px">Read the pattern. See the dry-run. Type the Java from memory. ' +
            'Get it back on a schedule that assumes you will forget.</p>';

    html += statsBlock(t, streak, ratedToday, goal);

    if (nextUp) {
      var isReview = due.length > 0;
      html += '<div class="card" style="margin-bottom:18px;border-color:var(--accent)">' +
        '<div class="spread">' +
          '<div class="grow"><div class="k dim" style="text-transform:uppercase;letter-spacing:.06em;font-weight:700">' +
            (isReview ? 'Cold re-attempt due' : 'Start here') + '</div>' +
            '<div style="font-weight:650;font-size:1.05rem">' + esc(nextUp.title) + '</div>' +
            '<div class="dim">' + esc((LC.getPattern(nextUp.pattern) || {}).name || nextUp.pattern) +
            ' · ' + esc(nextUp.difficulty) + '</div></div>' +
          '<a class="btn primary" href="#/problem/' + esc(nextUp.id) + '">' + (isReview ? 'Re-attempt' : 'Open') + ' →</a>' +
        '</div></div>';
    }

    if (due.length) {
      html += '<div class="spread" style="margin:22px 0 10px"><h2 style="margin:0">Due for review</h2>' +
              '<a href="#/due">see all ' + due.length + ' →</a></div>' +
              '<div class="plist">' + due.slice(0, 5).map(function (d) { return problemRow(d.problem); }).join('') + '</div>';
    }

    html += forecastBlock();

    html += '<div class="spread" style="margin:22px 0 10px"><h2 style="margin:0">Patterns</h2>' +
            '<a href="#/browse">browse all problems →</a></div>';
    html += patternCards();

    if (t.total) {
      html += '<p class="dim" style="margin-top:16px">' + t.total + ' problems loaded · ' +
        mix.easy + ' easy (' + mix.easyPct + '%) · ' + mix.medium + ' medium (' + mix.mediumPct + '%) · ' +
        mix.hard + ' hard (' + mix.hardPct + '%)</p>';
    }
    if (!LC.store.available) {
      html += '<div class="warn-box" style="margin-top:16px">This browser is blocking localStorage ' +
        '(private window?). The app still runs, but your progress will vanish when you close the tab.</div>';
    }

    host.innerHTML = html;
  };

  views.due = function (host) {
    var due = LC.srs.due();
    var html = '<div class="crumbs"><a href="#/">Dashboard</a> › Due</div>' +
               '<h1>Due for a cold re-attempt</h1>';
    if (!due.length) {
      html += '<div class="card empty">Nothing is due. That is the schedule working, not a bug.<br><br>' +
              '<a class="btn" href="#/patterns">Learn a new pattern →</a></div>';
    } else {
      html += '<p class="muted">Oldest and shakiest first. Open one, do NOT reveal the solution, ' +
              'type it from memory, then rate honestly.</p>' +
              '<div class="plist">' + due.map(function (d) { return problemRow(d.problem); }).join('') + '</div>';
    }
    host.innerHTML = html;
  };

  views.browse = function (host) {
    host.innerHTML = '<div class="crumbs"><a href="#/">Dashboard</a> › Browse</div>' +
                     '<h1>All problems</h1><div id="fbar"></div><div id="plist"></div>' +
                     '<p style="margin-top:12px"><button id="fclear" class="sm ghost">Clear filters</button></p>';
    function paint() {
      var list = LC.filters.apply();
      var el = host.querySelector('#plist');
      el.innerHTML = list.length
        ? '<div class="plist">' + list.map(problemRow).join('') + '</div>' +
          '<p class="dim" style="margin-top:8px">' + list.length + ' of ' + LC.allProblems().length + ' shown</p>'
        : '<div class="card empty">No problem matches those filters.</div>';
    }
    LC.filters.render(host.querySelector('#fbar'), paint);
    host.querySelector('#fclear').addEventListener('click', function () {
      LC.filters.clear();
      LC.router.reload();
    });
    paint();
  };

  views.problemRow = problemRow;   // reused by the pattern page
})(window.LC = window.LC || {});
