/* editor.js :: the embedded Java editor and its suggestion engine.
 *
 * Wraps the CodeMirror 6 facade in assets/vendor/cm6.bundle.js (window.CM6).
 * Adds three things CodeMirror does not give you for Java:
 *   1. inferTypes()  - reads YOUR declarations out of the buffer so that
 *                      "seen." knows seen is a Map.
 *   2. completions   - keywords, types, JDK members from js/java-api.js,
 *                      multi-line snippets, and every identifier you have typed.
 *   3. a symbol keypad for phones and iPads, where { } [ ] and Ctrl-Space are
 *      either buried or impossible.
 *
 * Limits, stated plainly: this is a dictionary, not a compiler. It cannot know
 * the type of a chained call like map.get(k).something, and it will not flag a
 * type error. Real compilation only happens in the optional Judge0 run mode.
 */
(function (LC) {
  'use strict';

  var JAVA = function () { return window.LC_JAVA || { classes: {}, statics: {}, keywords: [], snippets: [], topLevelTypes: [] }; };

  /* ---------------------------------------------------------------- types --- */

  /* Declared-type scan. Deliberately regex-based and forgiving: it is looking
   * for "SomeType someName" in declarations, params and enhanced-for headers. */
  var DECL = /\b([A-Z][\w.]*\s*(?:<[^<>;=(){}]*>)?|int|long|double|float|char|boolean|byte|short)((?:\s*\[\s*\])*)\s+([a-z_$][\w$]*)\s*(?==|;|\)|,|:|\))/g;
  var VAR_NEW = /\bvar\s+([a-z_$][\w$]*)\s*=\s*new\s+([A-Z][\w.]*)/g;

  /* Last-resort naming conventions, used only when no declaration was found. */
  var CONVENTION = {
    sb: 'StringBuilder', pq: 'PriorityQueue', heap: 'PriorityQueue',
    map: 'Map', counts: 'Map', count: 'Map', freq: 'Map', seen: 'Map', memo: 'Map', cache: 'Map', adj: 'Map', graph: 'Map',
    set: 'Set', visited: 'Set', dq: 'Deque', deque: 'Deque', stack: 'Deque', st: 'Deque', q: 'Deque', queue: 'Deque',
    list: 'List', res: 'List', out: 'List', ans: 'List', path: 'List', result: 'List',
    s: 'String', t: 'String', str: 'String', word: 'String', text: 'String',
    root: 'TreeNode', node: 'TreeNode', cur: 'TreeNode', curr: 'TreeNode', left: 'TreeNode', right: 'TreeNode',
    head: 'ListNode', tail: 'ListNode', dummy: 'ListNode', slow: 'ListNode', fast: 'ListNode', prev: 'ListNode',
    e: 'Entry', entry: 'Entry', it: 'Iterator'
  };

  function inferTypes(text) {
    var types = {}, mm;
    DECL.lastIndex = 0;
    while ((mm = DECL.exec(text)) !== null) {
      var base = mm[1].replace(/\s+/g, '').replace(/<.*$/, '');
      var dims = (mm[2] || '').replace(/\s+/g, '');
      if (base === 'return' || base === 'new') continue;
      types[mm[3]] = dims ? base + '[]' : base;
    }
    VAR_NEW.lastIndex = 0;
    while ((mm = VAR_NEW.exec(text)) !== null) types[mm[1]] = mm[2];
    return types;
  }

  function typeOf(name, text) {
    var t = inferTypes(text);
    if (t[name]) return t[name];
    var low = name.replace(/[0-9_]+$/, '').toLowerCase();
    return CONVENTION[low] || CONVENTION[name] || null;
  }

  /* ---------------------------------------------------------- completions --- */

  function applyCall(name, hasArgs) {
    return function (view, completion, from, to) {
      var insert = name + '()';
      view.dispatch({
        changes: { from: from, to: to, insert: insert },
        selection: { anchor: from + name.length + (hasArgs ? 1 : 2) },
        scrollIntoView: true
      });
    };
  }

  function applySnippet(body) {
    return function (view, completion, from, to) {
      var line = view.state.doc.lineAt(from);
      var indent = /^[ \t]*/.exec(line.text)[0];
      var parts = body.split('|CURSOR|');
      var head = parts[0].split('\n').join('\n' + indent);
      var tail = (parts[1] || '').split('\n').join('\n' + indent);
      view.dispatch({
        changes: { from: from, to: to, insert: head + tail },
        selection: { anchor: from + head.length },
        scrollIntoView: true
      });
    };
  }

  function memberOptions(members, ownerLabel) {
    return members.map(function (mm) {
      var isMethod = mm.kind === 'method';
      var hasArgs = isMethod && !/\(\s*\)$/.test(mm.sig);
      return {
        label: mm.name,
        type: isMethod ? 'method' : 'property',
        detail: mm.ret + (ownerLabel ? '  ·  ' + ownerLabel : ''),
        info: mm.sig + '\n\n' + mm.doc,
        boost: 2,
        apply: isMethod ? applyCall(mm.name, hasArgs) : undefined
      };
    });
  }

  /* Union of every member we know, for when the receiver type is a mystery.
   * Still better than nothing: it is at least a list of real JDK methods. */
  var unionCache = null;
  function unionMembers() {
    if (unionCache) return unionCache;
    var byName = {}, classes = JAVA().classes;
    Object.keys(classes).forEach(function (cn) {
      classes[cn].members.forEach(function (mm) {
        if (!byName[mm.name]) byName[mm.name] = { m: mm, owners: [] };
        if (byName[mm.name].owners.indexOf(cn) < 0) byName[mm.name].owners.push(cn);
      });
    });
    unionCache = Object.keys(byName).sort().map(function (n) {
      var e = byName[n], mm = e.m;
      var hasArgs = mm.kind === 'method' && !/\(\s*\)$/.test(mm.sig);
      return {
        label: mm.name,
        type: mm.kind === 'method' ? 'method' : 'property',
        detail: mm.ret + '  ·  ' + e.owners.join('/'),
        info: mm.sig + '\n\n' + mm.doc + '\n\n(Type of the receiver is unknown here, so this list spans every class.)',
        boost: 0,
        apply: mm.kind === 'method' ? applyCall(mm.name, hasArgs) : undefined
      };
    });
    return unionCache;
  }

  function identifiersIn(text, exclude) {
    var out = [], seen = {}, mm;
    var re = /[A-Za-z_$][\w$]*/g;
    var kw = {};
    JAVA().keywords.forEach(function (k) { kw[k] = 1; });
    while ((mm = re.exec(text)) !== null) {
      var w = mm[0];
      if (w.length < 2 || kw[w] || seen[w] || w === exclude) continue;
      seen[w] = 1;
      out.push(w);
    }
    return out;
  }

  function javaCompletionSource(env) {
    var before = env.textBefore;
    var J = JAVA();

    /* --- member access: something.partial --- */
    var mem = /([A-Za-z_$][\w$]*)\s*\.\s*([A-Za-z_$][\w$]*)?$/.exec(before);
    if (mem) {
      var recv = mem[1], partial = mem[2] || '';
      var from = env.pos - partial.length;
      var opts = [];

      var st = J.staticsFor && J.staticsFor(recv);
      if (st) {
        opts = opts.concat(memberOptions(st, recv + ' (static)'));
        if (recv === 'Map') {
          opts.push({ label: 'Entry', type: 'interface', detail: 'Map.Entry<K,V>',
                      info: 'One key/value pair. Loop with for (Map.Entry<K,V> e : map.entrySet()).', boost: 2 });
        }
      }
      var t = typeOf(recv, env.fullText);
      if (t) {
        var inst = J.membersFor(t);
        if (inst.length) opts = opts.concat(memberOptions(inst, t));
      }
      if (!opts.length) opts = unionMembers();
      return { from: from, options: opts };
    }

    /* --- plain word --- */
    var word = /([A-Za-z_$][\w$]*)$/.exec(before);
    var wordText = word ? word[1] : '';
    if (!wordText && !env.explicit) return null;
    var wfrom = env.pos - wordText.length;
    var options = [];

    J.snippets.forEach(function (sn) {
      options.push({
        label: sn.label, type: 'text', detail: sn.detail, boost: 3,
        info: sn.body.replace(/\|CURSOR\|/g, '│'),
        apply: applySnippet(sn.body)
      });
    });
    J.keywords.forEach(function (k) { options.push({ label: k, type: 'keyword', boost: 1 }); });
    J.topLevelTypes.forEach(function (c) {
      var doc = J.docFor ? J.docFor(c) : '';
      options.push({ label: c, type: 'class', detail: 'type', info: doc || undefined, boost: 1 });
    });
    Object.keys(J.statics).forEach(function (c) {
      options.push({ label: c, type: 'class', detail: 'static utils', boost: 1 });
    });
    identifiersIn(env.fullText, wordText).forEach(function (id) {
      var t = inferTypes(env.fullText)[id];
      options.push({ label: id, type: 'variable', detail: t || 'in this file', boost: 4 });
    });

    /* de-duplicate by label, keeping the highest boost */
    var best = {};
    options.forEach(function (o) {
      if (!best[o.label] || (best[o.label].boost || 0) < (o.boost || 0)) best[o.label] = o;
    });
    return { from: wfrom, options: Object.keys(best).map(function (k) { return best[k]; }) };
  }

  /* --------------------------------------------------------------- mount --- */

  var KEYPAD = ['{', '}', '(', ')', '[', ']', ';', '<', '>', '=', '!', '&', '|', '+', '-', '*', '/', '"', "'", ':', '.', ','];

  function mount(host, opts) {
    opts = opts || {};
    if (!window.CM6) {
      host.innerHTML = '<div class="warn-box">Editor bundle did not load. Expected <code>assets/vendor/cm6.bundle.js</code>. ' +
                       'Rebuild it with <code>cd tools &amp;&amp; npm install &amp;&amp; npm run build</code>.</div>' +
                       '<textarea style="width:100%;height:300px;font-family:var(--mono)"></textarea>';
      var ta = host.querySelector('textarea');
      ta.value = opts.doc || '';
      if (opts.onChange) ta.addEventListener('input', function () { opts.onChange(ta.value); });
      return { getDoc: function () { return ta.value; }, setDoc: function (v) { ta.value = v; },
               insert: function (t) { ta.value += t.replace('|CURSOR|', ''); }, suggest: function () {},
               focus: function () { ta.focus(); }, setDark: function () {}, destroy: function () {},
               focusLineContaining: function () {}, fallback: true };
    }
    var useAc = LC.settings().autocomplete !== false;
    return window.CM6.create(host, {
      doc: opts.doc || '',
      dark: opts.dark,
      readOnly: opts.readOnly,
      onChange: opts.onChange,
      placeholder: opts.placeholder,
      completionSource: useAc ? javaCompletionSource : null
    });
  }

  /* Symbol row for touch keyboards. Hidden by CSS on mouse+fine-pointer devices
   * unless the setting forces it on. */
  function buildKeypad(handle) {
    var wrap = document.createElement('div');
    var forced = LC.settings().showKeypad === 'always';
    wrap.className = 'keys' + (forced ? '' : ' touch-only');
    KEYPAD.forEach(function (k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = k;
      b.setAttribute('aria-label', 'insert ' + k);
      b.addEventListener('click', function (ev) { ev.preventDefault(); handle.insert(k); });
      wrap.appendChild(b);
    });
    var tab = document.createElement('button');
    tab.type = 'button'; tab.textContent = '⇥'; tab.setAttribute('aria-label', 'insert four spaces');
    tab.addEventListener('click', function (ev) { ev.preventDefault(); handle.insert('    '); });
    wrap.appendChild(tab);
    var sug = document.createElement('button');
    sug.type = 'button'; sug.textContent = '💡'; sug.title = 'Suggest (Ctrl-Space)';
    sug.setAttribute('aria-label', 'show suggestions');
    sug.addEventListener('click', function (ev) { ev.preventDefault(); handle.suggest(); });
    wrap.appendChild(sug);
    return wrap;
  }

  LC.editor = {
    mount: mount,
    buildKeypad: buildKeypad,
    javaCompletionSource: javaCompletionSource,
    inferTypes: inferTypes,
    typeOf: typeOf
  };
})(window.LC = window.LC || {});
