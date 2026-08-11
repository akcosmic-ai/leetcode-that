/* leetcode-that :: CodeMirror 6 bundle entry point.
 *
 * This is compiled ONCE into ../assets/vendor/cm6.bundle.js and committed.
 * The site loads that single file with a plain <script> tag, so it works from
 * file:// with no workers, no XHR and no network.
 *
 * It exposes a deliberately small facade on window.CM6 so that the app code in
 * js/editor.js never imports CodeMirror internals. If we ever swap editors,
 * only this file and the facade change.
 */
import { EditorView, keymap, lineNumbers, highlightActiveLine,
         highlightActiveLineGutter, drawSelection, dropCursor,
         rectangularSelection, crosshairCursor, placeholder as cmPlaceholder } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { java } from "@codemirror/lang-java";
import { autocompletion, completionKeymap, acceptCompletion, startCompletion,
         closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { syntaxHighlighting, defaultHighlightStyle, indentOnInput,
         bracketMatching, foldGutter, foldKeymap, indentUnit } from "@codemirror/language";
import { oneDark } from "@codemirror/theme-one-dark";

const themeConf = new Compartment();
const readOnlyConf = new Compartment();

const baseTheme = EditorView.theme({
  /* No height here on purpose: the host element decides. .ed-host pins a
   * scrollable box, .ed-static lets read-only code blocks grow naturally. */
  "&": { fontSize: "13.5px", backgroundColor: "transparent" },
  ".cm-scroller": {
    fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
    lineHeight: "1.6"
  },
  ".cm-content": { padding: "10px 0" },
  ".cm-gutters": { userSelect: "none" },
  ".cm-tooltip.cm-tooltip-autocomplete": { fontSize: "13px" },
  ".cm-tooltip.cm-tooltip-autocomplete > ul > li": { padding: "4px 8px", minHeight: "1.6em" },
  ".cm-completionDetail": { fontStyle: "normal", opacity: 0.65, marginLeft: "1em" }
});

/* Adapts our plain-object completion source (see js/editor.js) into a
 * CodeMirror CompletionSource. The app side never sees CM types: it gets a
 * snapshot of the document and returns { from, options }.
 */
function adaptSource(simpleFn) {
  return (ctx) => {
    const line = ctx.state.doc.lineAt(ctx.pos);
    const res = simpleFn({
      textBefore: ctx.state.sliceDoc(0, ctx.pos),
      fullText: ctx.state.doc.toString(),
      pos: ctx.pos,
      lineText: line.text,
      lineFrom: line.from,
      colBefore: ctx.pos - line.from,
      explicit: ctx.explicit
    });
    if (!res || !res.options || !res.options.length) return null;
    return {
      from: res.from,
      options: res.options,
      validFor: res.validFor === false ? undefined : /^[\w$]*$/
    };
  };
}

function create(parent, opts) {
  opts = opts || {};
  const listeners = [];
  if (typeof opts.onChange === "function") {
    listeners.push(EditorView.updateListener.of((u) => {
      if (u.docChanged) opts.onChange(u.state.doc.toString());
    }));
  }

  const extensions = [
    lineNumbers(),
    highlightActiveLineGutter(),
    foldGutter(),
    history(),
    drawSelection(),
    dropCursor(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    indentUnit.of("    "),
    EditorState.allowMultipleSelections.of(true),
    EditorView.lineWrapping,
    java(),
    autocompletion({
      activateOnTyping: true,
      closeOnBlur: true,
      maxRenderedOptions: 40,
      icons: true,
      override: opts.completionSource ? [adaptSource(opts.completionSource)] : undefined
    }),
    keymap.of([
      { key: "Tab", run: acceptCompletion },
      { key: "Ctrl-Space", run: startCompletion },
      { key: "Alt-/", run: startCompletion },
      indentWithTab,
      ...closeBracketsKeymap,
      ...completionKeymap,
      ...defaultKeymap,
      ...historyKeymap,
      ...searchKeymap,
      ...foldKeymap
    ]),
    baseTheme,
    themeConf.of(opts.dark ? [oneDark] : [syntaxHighlighting(defaultHighlightStyle)]),
    readOnlyConf.of(EditorState.readOnly.of(!!opts.readOnly)),
    ...listeners
  ];
  if (opts.placeholder) extensions.push(cmPlaceholder(opts.placeholder));

  const view = new EditorView({
    state: EditorState.create({ doc: opts.doc || "", extensions }),
    parent
  });

  return {
    view,
    getDoc: () => view.state.doc.toString(),
    setDoc(text) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: text },
        selection: { anchor: Math.min(text.length, view.state.doc.length) }
      });
    },
    /* Inserts text at the cursor. If the text contains the marker |CURSOR|
     * the caret lands there instead of at the end. */
    insert(text) {
      const markerAt = text.indexOf("|CURSOR|");
      const clean = text.replace("|CURSOR|", "");
      const at = view.state.selection.main;
      view.dispatch({
        changes: { from: at.from, to: at.to, insert: clean },
        selection: { anchor: at.from + (markerAt < 0 ? clean.length : markerAt) },
        scrollIntoView: true
      });
      view.focus();
    },
    /* Moves the caret to the first line whose text contains `needle`. */
    focusLineContaining(needle) {
      const lines = view.state.doc.toString().split("\n");
      let off = 0;
      for (const l of lines) {
        if (l.indexOf(needle) >= 0) {
          view.dispatch({ selection: { anchor: off + l.length }, scrollIntoView: true });
          break;
        }
        off += l.length + 1;
      }
      view.focus();
    },
    suggest() { view.focus(); startCompletion(view); },
    setDark(dark) {
      view.dispatch({
        effects: themeConf.reconfigure(dark ? [oneDark] : [syntaxHighlighting(defaultHighlightStyle)])
      });
    },
    setReadOnly(ro) {
      view.dispatch({ effects: readOnlyConf.reconfigure(EditorState.readOnly.of(!!ro)) });
    },
    focus: () => view.focus(),
    lineCount: () => view.state.doc.lines,
    destroy: () => view.destroy()
  };
}

window.CM6 = { create, version: "cm6-bundled" };
