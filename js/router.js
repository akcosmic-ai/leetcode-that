/* router.js :: hash router.
 *
 * Why hash routing and not one HTML file per problem: this app has to work when
 * you double-click index.html. On file:// there is no server to resolve clean
 * paths, and fetch() of a sibling file is blocked. One page plus #/routes works
 * everywhere: file://, python -m http.server, and GitHub Pages.
 *
 * tools/generate-pages.js can additionally emit real problems/*.html shells for
 * deep links, but running it is never required.
 */
(function (LC) {
  'use strict';

  var ROUTES = [
    { re: /^\/?$/,                     name: 'dashboard',  params: [] },
    { re: /^\/patterns\/?$/,           name: 'patterns',   params: [] },
    { re: /^\/pattern\/([\w-]+)\/?$/,  name: 'pattern',    params: ['id'] },
    { re: /^\/problem\/([\w-]+)\/?$/,  name: 'problem',    params: ['id'] },
    { re: /^\/due\/?$/,                name: 'due',        params: [] },
    { re: /^\/browse\/?$/,             name: 'browse',     params: [] },
    { re: /^\/cheatsheet\/?$/,         name: 'cheatsheet', params: [] },
    { re: /^\/settings\/?$/,           name: 'settings',   params: [] }
  ];

  var current = null;
  var teardown = null;

  function parse() {
    var h = location.hash.replace(/^#/, '') || '/';
    for (var i = 0; i < ROUTES.length; i++) {
      var m = ROUTES[i].re.exec(h);
      if (m) {
        var p = {};
        ROUTES[i].params.forEach(function (k, idx) { p[k] = decodeURIComponent(m[idx + 1]); });
        return { name: ROUTES[i].name, params: p, hash: h };
      }
    }
    return { name: 'notfound', params: {}, hash: h };
  }

  function highlightNav(name) {
    var map = { dashboard: 'dashboard', patterns: 'patterns', pattern: 'patterns',
                browse: 'patterns', problem: '', due: 'due',
                cheatsheet: 'cheatsheet', settings: 'settings' };
    var want = map[name] || '';
    Array.prototype.forEach.call(document.querySelectorAll('#nav a'), function (a) {
      a.classList.toggle('on', a.dataset.route === want);
    });
  }

  function render() {
    var r = parse();
    current = r;

    if (typeof teardown === 'function') { try { teardown(); } catch (e) {} }
    teardown = null;

    var host = document.getElementById('view');
    var view = (LC.views || {})[r.name];
    if (!view) {
      host.innerHTML = '<h1>Nothing here</h1><p class="muted">No route matches <code>' +
        LC.ui.esc(r.hash) + '</code>.</p><p><a href="#/">Back to the dashboard</a></p>';
    } else {
      host.innerHTML = '';
      try {
        teardown = view(host, r.params) || null;
      } catch (err) {
        console.error(err);
        host.innerHTML = '<h1>That view crashed</h1><div class="warn-box">' + LC.ui.esc(err.message) +
          '</div><pre>' + LC.ui.esc(err.stack || '') + '</pre>';
      }
    }
    highlightNav(r.name);
    LC.refreshDueBadge();
    window.scrollTo(0, 0);
    host.focus({ preventScroll: true });
  }

  LC.router = {
    start: function () {
      window.addEventListener('hashchange', render);
      render();
    },
    go: function (hash) {
      if (location.hash === hash) render();
      else location.hash = hash;
    },
    reload: render,
    current: function () { return current; }
  };
})(window.LC = window.LC || {});
