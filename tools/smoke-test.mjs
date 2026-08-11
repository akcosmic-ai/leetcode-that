/* smoke-test.mjs :: load index.html in a real DOM (jsdom) and exercise the app.
 *
 *   node tools/smoke-test.mjs
 *
 * This is the browser-side half of the quality gate. verify-java.mjs proves the
 * Java is right; this proves the page actually runs: data loads, every route
 * renders without throwing, the editor mounts, drafts persist, the diff works,
 * and the SM-2 schedule advances the way the README claims.
 *
 * jsdom has no layout engine, so this cannot prove the page LOOKS right. It
 * proves nothing is broken.
 */
import { JSDOM, VirtualConsole } from 'jsdom';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

let failures = 0, checks = 0;
function ok(label, cond, detail) {
  checks++;
  if (cond) { console.log('  PASS  ' + label); }
  else { failures++; console.log('  FAIL  ' + label + (detail ? '  ->  ' + detail : '')); }
}
function section(t) { console.log('\n' + t); }

/* jsdom does not implement matchMedia or localStorage quota behaviour we care
 * about, and CodeMirror pokes at a few layout APIs. Patch the minimum. */
const consoleErrors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', (e) => consoleErrors.push('jsdomError: ' + e.message));
vc.on('error', (...a) => consoleErrors.push('console.error: ' + a.join(' ')));
vc.on('warn', () => {});
vc.on('log', () => {});
vc.on('info', () => {});
vc.on('debug', () => {});

const dom = new JSDOM(readFileSync(join(ROOT, 'index.html'), 'utf8'), {
  url: 'http://localhost:8765/index.html',
  runScripts: 'dangerously',
  resources: 'usable',
  pretendToBeVisual: true,
  virtualConsole: vc
});
const w = dom.window;

/* jsdom has no layout engine, so Range.getClientRects does not exist.
 * CodeMirror measures text with it. Stub it out: without this the console fills
 * with noise that hides real errors. Patched immediately after construction, so
 * it is in place before the async <script> tags execute. */
const EMPTY_RECT = { x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, toJSON() { return this; } };
const EMPTY_LIST = { length: 0, item: () => null, [Symbol.iterator]: function* () {} };
for (const proto of [w.Range && w.Range.prototype, w.Element && w.Element.prototype]) {
  if (!proto) continue;
  if (typeof proto.getClientRects !== 'function') proto.getClientRects = () => EMPTY_LIST;
  if (typeof proto.getBoundingClientRect !== 'function') proto.getBoundingClientRect = () => EMPTY_RECT;
}

if (!w.matchMedia) {
  w.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
}

/* resources:'usable' loads the <script src> files asynchronously. Wait for the
 * app to announce itself by looking for the router being installed. */
await new Promise((resolve, reject) => {
  const started = Date.now();
  const tick = setInterval(() => {
    if (w.LC && w.LC.router && w.LC_PATTERNS) { clearInterval(tick); resolve(); }
    else if (Date.now() - started > 20000) { clearInterval(tick); reject(new Error('scripts never finished loading')); }
  }, 50);
});
await new Promise((r) => setTimeout(r, 300));   // let DOMContentLoaded handlers settle

const LC = w.LC;

section('1. data');
ok('17 patterns loaded', (w.LC_PATTERNS || []).length === 17, 'got ' + (w.LC_PATTERNS || []).length);
ok('17 templates loaded', Object.keys(w.LC_TEMPLATES || {}).length === 17, 'got ' + Object.keys(w.LC_TEMPLATES || {}).length);
ok('problems array exists', Array.isArray(w.LC_PROBLEMS));
ok('every pattern has a template that resolves',
   LC.allPatterns().every((p) => !p.templateId || !!LC.getTemplate(p.templateId)));
ok('every problem points at a real pattern',
   LC.allProblems().every((p) => !!LC.getPattern(p.pattern)));

section('2. editor bundle');
ok('window.CM6 present', typeof w.CM6 === 'object' && typeof w.CM6.create === 'function');

section('3. routes render without throwing');
const routes = ['#/', '#/patterns', '#/due', '#/browse', '#/cheatsheet', '#/settings'];
for (const p of LC.allPatterns()) routes.push('#/pattern/' + p.id);
for (const pr of LC.allProblems().slice(0, 3)) routes.push('#/problem/' + pr.id);
routes.push('#/problem/does-not-exist', '#/nonsense');

let rendered = 0, crashed = [];
for (const r of routes) {
  w.location.hash = r;
  LC.router.reload();
  await new Promise((res) => setTimeout(res, 30));
  const html = w.document.getElementById('view').innerHTML;
  if (/That view crashed/.test(html)) crashed.push(r);
  else if (html.length > 40) rendered++;
  else crashed.push(r + ' (empty)');
}
ok(rendered + '/' + routes.length + ' routes rendered', crashed.length === 0, crashed.join(', '));

section('4. SM-2 schedule');
LC.srs.reset('smoke-test-id');
const s1 = LC.srs.rate('smoke-test-id', 4);
ok('first pass gives a 1-day interval', s1.interval === 1, 'interval ' + s1.interval);
ok('status becomes learning after one pass', s1.status === 'learning', s1.status);
const s2 = LC.srs.rate('smoke-test-id', 4);
ok('second pass gives a 3-day interval', s2.interval === 3, 'interval ' + s2.interval);
ok('status becomes solved after two 4s', s2.status === 'solved', s2.status);
const s3 = LC.srs.rate('smoke-test-id', 5);
ok('third pass multiplies by ease (>3 days)', s3.interval > 3, 'interval ' + s3.interval);
ok('ease rose on a 5', s3.ease > s2.ease, s2.ease + ' -> ' + s3.ease);
const s4 = LC.srs.rate('smoke-test-id', 1);
ok('a failure resets the interval to 1 day', s4.interval === 1, 'interval ' + s4.interval);
ok('a failure sets status to needs-review', s4.status === 'review', s4.status);
ok('a failure counts a lapse', s4.lapses === 1, 'lapses ' + s4.lapses);
ok('ease is clamped at 1.3 or above', s4.ease >= 1.3, String(s4.ease));
ok('preview does not persist', (function () {
  const before = LC.srs.stateOf('smoke-test-id').interval;
  LC.srs.preview('smoke-test-id', 5);
  return LC.srs.stateOf('smoke-test-id').interval === before;
})());
LC.srs.reset('smoke-test-id');

section('5. diff');
const d1 = LC.diff.compare('int a = 1;\nint b = 2;', 'int a = 1;\nint b = 2;');
ok('identical code scores 100%', d1.similarity === 100, String(d1.similarity));
const d2 = LC.diff.compare('   int a = 1;   // mine\n', 'int a = 1;');
ok('whitespace and comments are ignored', d2.similarity === 100, String(d2.similarity));
const d3 = LC.diff.compare('int a = 1;\nint b = 9;', 'int a = 1;\nint b = 2;');
ok('one differing line is reported as a change', d3.changed === 1 && d3.same === 1,
   'same ' + d3.same + ' changed ' + d3.changed);
ok('completely different code scores 0%', LC.diff.compare('foo();', 'bar();').similarity === 0);

section('6. java suggestion engine');
const src = 'class Solution {\n  public int[] twoSum(int[] nums, int target) {\n' +
            '    Map<Integer, Integer> seen = new HashMap<>();\n    StringBuilder sb = new StringBuilder();\n' +
            '    for (int x : nums) { }\n    return null;\n  }\n}';
const types = LC.editor.inferTypes(src);
ok('infers Map from the declaration', types.seen === 'Map', String(types.seen));
ok('infers int[] for a parameter', types.nums === 'int[]', String(types.nums));
ok('infers StringBuilder', types.sb === 'StringBuilder', String(types.sb));
ok('infers int for an enhanced-for variable', types.x === 'int', String(types.x));

function complete(text) {
  return LC.editor.javaCompletionSource({
    textBefore: text, fullText: src + '\n' + text, pos: text.length,
    lineText: text.split('\n').pop(), lineFrom: 0, colBefore: 0, explicit: true
  });
}
const memberRes = complete(src.slice(0, src.indexOf('StringBuilder')) + 'seen.');
const memberLabels = (memberRes ? memberRes.options : []).map((o) => o.label);
ok('"seen." suggests getOrDefault', memberLabels.indexOf('getOrDefault') >= 0);
ok('"seen." suggests containsKey', memberLabels.indexOf('containsKey') >= 0);
ok('"seen." does NOT suggest append', memberLabels.indexOf('append') < 0);
const staticRes = complete('Arrays.');
const staticLabels = (staticRes ? staticRes.options : []).map((o) => o.label);
ok('"Arrays." suggests sort and fill',
   staticLabels.indexOf('sort') >= 0 && staticLabels.indexOf('fill') >= 0);
const wordRes = complete('for');
const wordLabels = (wordRes ? wordRes.options : []).map((o) => o.label);
ok('"for" offers the fori snippet', wordLabels.indexOf('fori') >= 0);
ok('word completion offers identifiers from the buffer', (function () {
  const r = complete('num');
  return r && r.options.some((o) => o.label === 'nums');
})());

section('7. persistence');
LC.saveDraft('smoke-draft', 'class Solution { }');
ok('a draft round-trips', LC.draft('smoke-draft') === 'class Solution { }');
LC.saveNotes('smoke-draft', 'forgot the null check');
ok('a note round-trips', LC.notes('smoke-draft') === 'forgot the null check');
const dump = LC.exportAll();
ok('export produces a versioned payload', dump._format === 'leetcode-that/v1');
ok('export contains the draft', !!dump.data['draft:smoke-draft']);
LC.store.del('draft:smoke-draft');
LC.store.del('notes:smoke-draft');
ok('delete removes the key', LC.draft('smoke-draft') === null);

section('8. problem page wiring');
if (LC.allProblems().length) {
  const first = LC.allProblems()[0];
  w.location.hash = '#/problem/' + first.id;
  LC.router.reload();
  await new Promise((r) => setTimeout(r, 200));
  const view = w.document.getElementById('view');
  const text = view.textContent;
  for (const step of ['The problem', 'Key technique', 'Intuition', 'Hints',
                      'Solution', 'Now you type it', 'Check yourself', 'Rate']) {
    ok('step present: ' + step, text.indexOf(step) >= 0);
  }
  ok('editor host exists', !!view.querySelector('#edHost'));
  ok('editor produced a CodeMirror instance', !!view.querySelector('.cm-editor'),
     'falls back to a textarea if the bundle is missing');
  ok('symbol keypad rendered', !!view.querySelector('.keys'));
  ok('five rating buttons', view.querySelectorAll('.rate button').length === 5);
  ok('solution is collapsed by default',
     !!view.querySelector('.reveal') && !view.querySelector('.reveal.open'));
  ok('official LeetCode link present',
     !!view.querySelector('a[href^="https://leetcode.com/"]'));

  // click Compare and confirm a diff appears
  const btn = view.querySelector('#btnCompare');
  btn.dispatchEvent(new w.Event('click', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 80));
  ok('Compare renders a diff table', !!view.querySelector('.diff'));
  ok('Compare reveals the reference solution', !!view.querySelector('.reveal.open'));

  // click a rating and confirm the schedule box updates
  LC.srs.reset(first.id);
  const r3 = view.querySelector('.rate button[data-q="3"]');
  r3.dispatchEvent(new w.Event('click', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 50));
  ok('rating persists to storage', LC.srs.stateOf(first.id).status !== 'new',
     LC.srs.stateOf(first.id).status);
  ok('schedule box shows a date', /\d{4}-\d{2}-\d{2}/.test(view.querySelector('#schedBox').textContent),
     view.querySelector('#schedBox').textContent);
  LC.srs.reset(first.id);
  LC.store.del('draft:' + first.id);
} else {
  console.log('  SKIP  no problems written yet');
}

section('9. no console errors during any of that');
const realErrors = consoleErrors.filter((e) => !/Could not parse CSS|Not implemented/.test(e));
ok('clean console', realErrors.length === 0, realErrors.slice(0, 5).join(' | '));

console.log('\n' + (failures ? 'NOT CLEAN: ' + failures + ' of ' + checks + ' checks failed'
                             : 'ALL GREEN: ' + checks + ' checks passed'));
dom.window.close();
process.exit(failures ? 1 : 0);
