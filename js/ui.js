/* ui.js :: small shared helpers. No framework: views build HTML strings and
 * then wire behaviour with querySelector. That keeps the whole app readable
 * with no build step, which is the point.
 */
(function (LC) {
  'use strict';

  var ui = {};

  ui.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  /* Inline code and *emphasis* inside authored prose, without a markdown lib. */
  ui.rich = function (s) {
    return ui.esc(s)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  };

  var toastTimer = null;
  ui.toast = function (msg, ms) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, ms || 2200);
  };

  /* ---------------- theme ---------------- */
  ui.prefersDark = function () {
    return !window.matchMedia || window.matchMedia('(prefers-color-scheme: dark)').matches;
  };
  ui.isDark = function () {
    var t = LC.settings().theme;
    return t === 'dark' || (t === 'auto' && ui.prefersDark());
  };
  ui.applyTheme = function () {
    var dark = ui.isDark();
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0f1218' : '#f7f8fa');
    (ui._themeWatchers || []).forEach(function (fn) { try { fn(dark); } catch (e) {} });
  };
  ui._themeWatchers = [];
  ui.onThemeChange = function (fn) { ui._themeWatchers.push(fn); };

  /* ---------------- labels ---------------- */
  var STATUS = {
    'new':      { label: 'New',          cls: 'new' },
    'learning': { label: 'Learning',     cls: 'learning' },
    'solved':   { label: 'Solved',       cls: 'solved' },
    'review':   { label: 'Needs review', cls: 'review' }
  };
  ui.statusMeta = function (s) { return STATUS[s] || STATUS['new']; };
  ui.statusPill = function (s) {
    var m = ui.statusMeta(s);
    return '<span class="pill ' + m.cls + '">' + m.label + '</span>';
  };
  ui.diffPill = function (d) {
    var c = String(d || '').toLowerCase();
    return '<span class="pill ' + c + '">' + ui.esc(d) + '</span>';
  };
  ui.duePill = function (id) {
    if (!LC.srs.isDue(id)) return '';
    var st = LC.srs.stateOf(id);
    var over = LC.srs.daysBetween(st.due, LC.srs.todayISO());
    return '<span class="pill due">Due' + (over > 0 ? ' +' + over + 'd' : ' today') + '</span>';
  };

  /* ---------------- progressive reveal ---------------- */
  /* Any <div class="reveal"><button>..</button><div class="inner">..</div></div>
   * becomes click-to-open. Opening is recorded per problem so the dashboard can
   * tell "I peeked at the solution" from "I did it cold". */
  ui.wireReveals = function (root, problemId) {
    Array.prototype.forEach.call(root.querySelectorAll('.reveal'), function (rv) {
      var btn = rv.querySelector('button');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var open = rv.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        var caret = btn.querySelector('.caret');
        if (caret) caret.textContent = open ? '▾' : '▸';
        if (open && problemId && rv.dataset.track) LC.markSeen(problemId, rv.dataset.track);
      });
    });
  };
  ui.reveal = function (label, innerHtml, track) {
    return '<div class="reveal"' + (track ? ' data-track="' + ui.esc(track) + '"' : '') + '>' +
             '<button type="button" aria-expanded="false"><span class="caret">▸</span>&nbsp;' + label + '</button>' +
             '<div class="inner">' + innerHtml + '</div>' +
           '</div>';
  };

  /* ---------------- read-only syntax-highlighted code ---------------- */
  /* Uses the same CodeMirror bundle in read-only mode, so the reference solution
   * gets real Java highlighting with zero extra dependencies. */
  ui.codeBlock = function (container, code) {
    container.innerHTML = '';
    container.classList.add('ed-static');
    if (!window.CM6) {
      var pre = document.createElement('pre');
      pre.textContent = code;
      container.appendChild(pre);
      return null;
    }
    var h = window.CM6.create(container, { doc: code, readOnly: true, dark: ui.isDark() });
    ui.onThemeChange(function (dark) { try { h.setDark(dark); } catch (e) {} });
    return h;
  };

  /* ---------------- diff rendering ---------------- */
  ui.diffHtml = function (res) {
    var body = res.rows.map(function (r) {
      var l = r.left ? '<span class="gut">' + r.left.no + '</span> ' + ui.esc(r.left.text) : '';
      var rt = r.right ? '<span class="gut">' + r.right.no + '</span> ' + ui.esc(r.right.text) : '';
      return '<div class="dl ' + r.type + '"><div>' + l + '</div><div>' + rt + '</div></div>';
    }).join('');
    return '<div class="diff">' +
             '<div class="diff-head"><div>Yours</div><div>Reference</div></div>' +
             '<div class="diff-body">' + body + '</div>' +
           '</div>';
  };

  /* ---------------- misc ---------------- */
  ui.plural = function (n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); };
  ui.pct = function (a, b) { return b ? Math.round(a * 100 / b) : 0; };
  ui.dateHuman = function (iso) {
    if (!iso) return '';
    var d = new Date(iso + 'T12:00:00');
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };
  ui.scrollToTop = function () { window.scrollTo(0, 0); };

  LC.ui = ui;
})(window.LC = window.LC || {});
