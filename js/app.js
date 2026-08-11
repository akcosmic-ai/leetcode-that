/* app.js :: bootstrap. Loaded last, so every LC.* namespace already exists. */
(function (LC) {
  'use strict';

  LC.refreshDueBadge = function () {
    var el = document.getElementById('dueCount');
    if (!el) return;
    var n = LC.srs.dueCount();
    el.textContent = n;
    el.classList.toggle('zero', n === 0);
  };

  function bannerIfNoData() {
    if ((window.LC_PATTERNS || []).length) return;
    document.getElementById('view').innerHTML =
      '<h1>Data did not load</h1>' +
      '<div class="warn-box">No patterns were found, which means the <code>data/</code> scripts did not run.<br><br>' +
      'On <code>file://</code> that is almost always a missing file rather than a browser restriction, because the ' +
      'data files are plain <code>&lt;script&gt;</code> tags, not <code>fetch()</code> calls. Open the browser ' +
      'console and look for a 404.</div>';
  }

  function start() {
    LC.ui.applyTheme();

    // follow the OS when theme is on auto
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onMq = function () { if (LC.settings().theme === 'auto') LC.ui.applyTheme(); };
      if (mq.addEventListener) mq.addEventListener('change', onMq);
      else if (mq.addListener) mq.addListener(onMq);
    }

    if (!(window.LC_PATTERNS || []).length) { bannerIfNoData(); return; }

    LC.refreshDueBadge();
    LC.router.start();

    /* Offline install on a phone or iPad. Service workers only exist on
     * http(s), so this is skipped entirely when the page is opened as a file,
     * where you are already offline by definition. */
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function (e) {
          console.debug('[sw] not registered:', e.message);
        });
      });
    }

    console.info('leetcode-that ready · ' + (window.LC_PROBLEMS || []).length + ' problems · ' +
                 (window.LC_PATTERNS || []).length + ' patterns · editor ' +
                 (window.CM6 ? 'CodeMirror 6' : 'MISSING (textarea fallback)'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})(window.LC = window.LC || {});
