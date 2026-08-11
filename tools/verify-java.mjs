/* verify-java.mjs :: compile every Java string in the data with a real JDK.
 *
 *   node tools/verify-java.mjs
 *
 * It loads data/patterns.js, data/templates/*.js and data/problems/*.js in a
 * bare VM context (they only assign to window globals, so no DOM is needed),
 * extracts every template `code` and every problem `javaSolution`, writes them
 * to a temp directory and runs javac over the lot.
 *
 * This is the gate behind any claim that "the solutions compile". If it prints
 * FAIL, the data is wrong, not the JDK.
 *
 * Optional: pass --run to also execute each problem's judgeDriver against its
 * testCases locally, which checks the solutions are CORRECT and not merely
 * syntactically valid.
 */
import { readFileSync, readdirSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import os from 'node:os';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const RUN = process.argv.includes('--run');

/* ---- load the data files in a fake browser global ---- */
const sandbox = { window: {}, console };
sandbox.window.window = sandbox.window;
const ctx = vm.createContext(sandbox);

function load(rel) {
  const file = join(ROOT, rel);
  if (!existsSync(file)) return;
  vm.runInContext(readFileSync(file, 'utf8'), ctx, { filename: rel });
}

load('data/patterns.js');
for (const dir of ['data/templates', 'data/problems']) {
  for (const f of readdirSync(join(ROOT, dir)).filter((f) => f.endsWith('.js'))) {
    load(`${dir}/${f}`);
  }
}

const patterns = sandbox.window.LC_PATTERNS || [];
const templates = sandbox.window.LC_TEMPLATES || {};
const problems = sandbox.window.LC_PROBLEMS || [];

console.log(`loaded ${patterns.length} patterns, ${Object.keys(templates).length} templates, ${problems.length} problems`);

/* ---- write each snippet to its own directory and compile ---- */
const tmp = join(os.tmpdir(), 'lct-verify-' + Date.now());
mkdirSync(tmp, { recursive: true });

const units = [];
for (const key of Object.keys(templates)) {
  const t = templates[key];
  units.push({ kind: 'template', name: key, code: t.code });
}
for (const p of problems) {
  if (p.javaSolution) units.push({ kind: 'solution', name: p.id, code: p.javaSolution, problem: p });
}

/* javac needs the file name to match any PUBLIC top-level class. Our snippets
 * use package-private classes, so any file name works. Pick the first declared
 * type so the output is readable. */
function fileNameFor(code, fallback) {
  const m = /(?:^|\n)\s*(?:public\s+|final\s+|abstract\s+)*(?:class|interface|enum)\s+(\w+)/.exec(code);
  return (m ? m[1] : fallback.replace(/[^\w]/g, '_')) + '.java';
}

let pass = 0;
const failures = [];

for (const u of units) {
  const dir = join(tmp, u.kind + '__' + u.name.replace(/[^\w-]/g, '_'));
  mkdirSync(dir, { recursive: true });
  const file = join(dir, fileNameFor(u.code, u.name));
  writeFileSync(file, u.code, 'utf8');
  try {
    execFileSync('javac', ['-nowarn', '-d', dir, file], { stdio: 'pipe' });
    pass++;
  } catch (e) {
    failures.push({ ...u, error: (e.stderr || e.stdout || Buffer.from(String(e))).toString() });
  }
}

console.log(`\ncompile: ${pass}/${units.length} passed`);
for (const f of failures) {
  console.log(`\nFAIL [${f.kind}] ${f.name}\n${f.error.trim()}`);
}

/* ---- optional: run the drivers and check the expected output ---- */
let ranOk = 0, ranTotal = 0;
const runFailures = [];
if (RUN) {
  for (const p of problems) {
    if (!p.javaSolution || !p.judgeDriver) continue;
    ranTotal++;
    const dir = join(tmp, 'run__' + p.id.replace(/[^\w-]/g, '_'));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'Main.java'), p.javaSolution + '\n\n' + p.judgeDriver + '\n', 'utf8');
    try {
      execFileSync('javac', ['-nowarn', '-d', dir, join(dir, 'Main.java')], { stdio: 'pipe' });
      const out = execFileSync('java', ['-cp', dir, 'Main'], { stdio: 'pipe' }).toString();
      const got = out.replace(/\r/g, '').replace(/\s+$/, '').split('\n').map((s) => s.trim());
      const want = (p.testCases || []).map((t) => String(t.expected).trim());
      const bad = want.map((w, i) => (got[i] === w ? null : { i, want: w, got: got[i] })).filter(Boolean);
      if (bad.length) runFailures.push({ id: p.id, bad, raw: out });
      else ranOk++;
    } catch (e) {
      runFailures.push({ id: p.id, error: (e.stderr || e.stdout || Buffer.from(String(e))).toString() });
    }
  }
  console.log(`\nrun: ${ranOk}/${ranTotal} problems produced the expected output`);
  for (const f of runFailures) {
    console.log(`\nFAIL(run) ${f.id}`);
    if (f.error) console.log(f.error.trim());
    else f.bad.forEach((b) => console.log(`  test ${b.i}: expected "${b.want}" got "${b.got}"`));
  }
}

/* ---- data sanity, cheap to check and easy to get wrong by hand ---- */
const problemsErrors = [];
const ids = new Set();
const patternIds = new Set(patterns.map((p) => p.id));
for (const p of problems) {
  if (ids.has(p.id)) problemsErrors.push(`duplicate id: ${p.id}`);
  ids.add(p.id);
  if (!patternIds.has(p.pattern)) problemsErrors.push(`${p.id}: unknown pattern "${p.pattern}"`);
  if (!['Easy', 'Medium', 'Hard'].includes(p.difficulty)) problemsErrors.push(`${p.id}: bad difficulty`);
  if (!p.url || !/^https:\/\/leetcode\.com\//.test(p.url)) problemsErrors.push(`${p.id}: missing or odd url`);
  for (const f of ['problemSummary', 'signals', 'intuition', 'hints', 'javaSolution', 'complexity',
                   'methodSignature', 'testCases', 'commonMistakes', 'examples', 'constraints']) {
    if (!p[f] || (Array.isArray(p[f]) && !p[f].length)) problemsErrors.push(`${p.id}: missing ${f}`);
  }
  if (p.hints && p.hints.length !== 3) problemsErrors.push(`${p.id}: ${p.hints.length} hints, want 3`);
}
for (const pat of patterns) {
  if (pat.templateId && !templates[pat.templateId]) problemsErrors.push(`pattern ${pat.id}: template "${pat.templateId}" not found`);
}

const mix = { Easy: 0, Medium: 0, Hard: 0 };
problems.forEach((p) => { mix[p.difficulty] = (mix[p.difficulty] || 0) + 1; });
const total = problems.length || 1;
console.log(`\nmix: ${problems.length} problems · Easy ${mix.Easy} (${Math.round(mix.Easy * 100 / total)}%) · ` +
            `Medium ${mix.Medium} (${Math.round(mix.Medium * 100 / total)}%) · Hard ${mix.Hard} (${Math.round(mix.Hard * 100 / total)}%)`);

if (problemsErrors.length) {
  console.log('\ndata problems:');
  problemsErrors.forEach((e) => console.log('  - ' + e));
}

rmSync(tmp, { recursive: true, force: true });

const ok = failures.length === 0 && problemsErrors.length === 0 && runFailures.length === 0;
console.log('\n' + (ok ? 'ALL GREEN' : 'NOT CLEAN — see above'));
process.exit(ok ? 0 : 1);
