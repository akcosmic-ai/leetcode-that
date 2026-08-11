/* export-java.mjs :: turn the problem data into a real, compilable Java source
 * tree under java/, so every solution and template exists as an actual .java
 * file you can open in IntelliJ, read, edit and run.
 *
 *   node tools/export-java.mjs             write the tree
 *   node tools/export-java.mjs --compile   write it, then compile the whole tree
 *
 * Layout (one package per problem, so that every problem can keep the LeetCode
 * class name `Solution` without any of them colliding):
 *
 *   java/src/lct/<patternpkg>/<problempkg>/Solution.java   the annotated solution
 *   java/src/lct/<patternpkg>/<problempkg>/Main.java       a runnable driver
 *   java/src/lct/templates/<patternpkg>/*.java             the pattern templates
 *
 * The data files in data/ stay the single source of truth. This directory is
 * GENERATED: re-running the script overwrites it, so never hand-edit java/.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const OUT = join(ROOT, 'java');
const SRC = join(OUT, 'src', 'lct');
const COMPILE = process.argv.includes('--compile');

/* ---- load the data in a bare window shim ---- */
const sandbox = { window: {}, console };
sandbox.window.window = sandbox.window;
const ctx = vm.createContext(sandbox);
function load(rel) {
  const f = join(ROOT, rel);
  if (existsSync(f)) vm.runInContext(readFileSync(f, 'utf8'), ctx, { filename: rel });
}
load('data/patterns.js');
for (const dir of ['data/templates', 'data/problems']) {
  for (const f of readdirSync(join(ROOT, dir)).filter((x) => x.endsWith('.js'))) load(`${dir}/${f}`);
}
const patterns = sandbox.window.LC_PATTERNS || [];
const templates = sandbox.window.LC_TEMPLATES || {};
const problems = sandbox.window.LC_PROBLEMS || [];

/* ---- naming ---- */
const pkgOf = (id) => String(id).replace(/[^a-z0-9]/gi, '').toLowerCase();

/* A package declaration must come before any import, so it goes at position 0. */
function withPackage(pkg, code) {
  return 'package ' + pkg + ';\n\n' + code.replace(/^\s*\n/, '');
}

/* Word wrap for javadoc-style comments. Continuation lines of a bullet get a
 * hanging indent so the list stays readable in an IDE. */
function wrap(text, width, prefix) {
  const body = String(text || '');
  const hanging = /^- /.test(body) ? '  ' : '';
  const words = body.split(/\s+/);
  const lines = [];
  let line = '';
  for (const wd of words) {
    const room = width - (lines.length ? hanging.length : 0);
    if (line && (line + ' ' + wd).length > room) { lines.push(line); line = wd; }
    else line = line ? line + ' ' + wd : wd;
  }
  if (line) lines.push(line);
  return lines.map((l, i) => prefix + (i ? hanging : '') + l).join('\n');
}

/* Everything the problem page shows that is worth having in the file itself, so
 * the .java is useful on its own in an IDE with no browser open. */
function headerFor(p) {
  const out = [];
  out.push('/*');
  out.push(' * ' + p.leetcodeNumber + '. ' + p.title + '   [' + p.difficulty + ']');
  out.push(' * ' + p.url);
  out.push(' *');
  out.push(' * PATTERN: ' + ((patterns.find((x) => x.id === p.pattern) || {}).name || p.pattern));
  out.push(' *');
  out.push(wrap(p.problemSummary.replace(/[`*]/g, ''), 76, ' * '));
  out.push(' *');
  out.push(' * SIGNALS THAT POINT HERE');
  (p.signals || []).forEach((s) => out.push(wrap('- ' + s.replace(/[`*]/g, ''), 76, ' * ')));
  out.push(' *');
  out.push(' * COMPLEXITY');
  out.push(' *   time  ' + p.complexity.time + '   ' + (p.complexity.timeWhy || ''));
  out.push(' *   space ' + p.complexity.space + '   ' + (p.complexity.spaceWhy || ''));
  out.push(' *');
  out.push(' * COMMON MISTAKES');
  (p.commonMistakes || []).forEach((c) => out.push(wrap('- ' + c.replace(/[`*]/g, ''), 76, ' * ')));
  if ((p.followUps || []).length) {
    out.push(' *');
    out.push(' * FOLLOW-UPS');
    (p.followUps || []).forEach((c) => out.push(wrap('- ' + c.replace(/[`*]/g, ''), 76, ' * ')));
  }
  out.push(' *');
  out.push(' * Generated from data/problems/' + p.pattern + '.js by tools/export-java.mjs.');
  out.push(' * Do not hand-edit: edit the data file and re-run the script.');
  out.push(' */');
  return out.join('\n');
}

/* ---- write ---- */
if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
mkdirSync(SRC, { recursive: true });

let files = 0;
const written = [];
function put(dir, name, body) {
  mkdirSync(dir, { recursive: true });
  const f = join(dir, name);
  writeFileSync(f, body.endsWith('\n') ? body : body + '\n', 'utf8');
  written.push(f);
  files++;
}

// templates
for (const key of Object.keys(templates)) {
  const t = templates[key];
  const pkg = 'lct.templates.' + pkgOf(t.pattern);
  const dir = join(SRC, 'templates', pkgOf(t.pattern));
  const m = /(?:class|interface|enum)\s+(\w+)/.exec(t.code);
  const cls = m ? m[1] : 'Template';
  const notes = '/*\n * TEMPLATE: ' + t.name + '\n *\n' +
                wrap(String(t.notes || '').replace(/[`*]/g, ''), 76, ' * ') +
                '\n *\n * Generated from data/templates/' + t.pattern + '.js.\n */\n';
  put(dir, cls + '.java', notes + withPackage(pkg, t.code));
}

// problems: Solution.java plus a runnable Main.java
for (const p of problems) {
  const pkg = 'lct.' + pkgOf(p.pattern) + '.' + pkgOf(p.id);
  const dir = join(SRC, pkgOf(p.pattern), pkgOf(p.id));

  put(dir, 'Solution.java', headerFor(p) + '\n' + withPackage(pkg, p.javaSolution));

  if (p.judgeDriver) {
    const expected = (p.testCases || []).map((t, i) => ' *   ' + (i + 1) + ') ' + t.expected).join('\n');
    const note = '/*\n * Runnable driver for ' + p.leetcodeNumber + '. ' + p.title + '.\n *\n' +
                 ' * Run this class. It prints one line per test case, and correct output is\n' +
                 ' * exactly:\n' + expected + '\n */\n';
    put(dir, 'Main.java', note + withPackage(pkg, p.judgeDriver));
  }
}

/* per-pattern index so the tree is navigable without the website */
for (const pat of patterns) {
  const list = problems.filter((p) => p.pattern === pat.id).sort((a, b) => a.order - b.order);
  if (!list.length) continue;
  const md = ['# ' + pat.name, '', pat.blurb || '', '',
    '| # | Problem | Difficulty | Package |', '|---|---|---|---|',
    ...list.map((p) => '| ' + p.leetcodeNumber + ' | [' + p.title + '](' + p.url + ') | ' +
      p.difficulty + ' | `lct.' + pkgOf(p.pattern) + '.' + pkgOf(p.id) + '` |'),
    '', 'Generated by `tools/export-java.mjs`. Do not hand-edit.', ''].join('\n');
  put(join(SRC, pkgOf(pat.id)), 'README.md', md);
}

const readme = `# java/ — generated Java source tree

**Generated. Do not hand-edit.** The single source of truth is \`data/problems/*.js\` and
\`data/templates/*.js\`. Regenerate with:

\`\`\`bash
node tools/export-java.mjs --compile
\`\`\`

## What is here

Every solution and every pattern template as a real \`.java\` file, one package per
problem so that each can keep the LeetCode class name \`Solution\` without colliding.

\`\`\`
java/src/lct/<pattern>/<problem>/Solution.java   annotated solution + full write-up in the header
java/src/lct/<pattern>/<problem>/Main.java       runnable driver, prints one line per test case
java/src/lct/templates/<pattern>/*.java          the reusable pattern templates
\`\`\`

## Open it in IntelliJ

*File → Open* this repo, then mark \`java/src\` as a **Sources Root** (right-click the
folder → *Mark Directory as → Sources Root*). Every \`Main\` becomes a green run button.

## Compile and run everything from the command line

\`\`\`bash
javac -d java/out $(find java/src -name "*.java")
java -cp java/out lct.arrayshashing.twosum.Main
\`\`\`

On Windows PowerShell:

\`\`\`powershell
javac -d java\\out (Get-ChildItem -Recurse java\\src -Filter *.java | ForEach-Object FullName)
java -cp java\\out lct.arrayshashing.twosum.Main
\`\`\`
`;
put(OUT, 'README.md', readme);

console.log('wrote ' + files + ' files under java/');

/* ---- optional: compile the whole tree ---- */
if (COMPILE) {
  const javaFiles = written.filter((f) => f.endsWith('.java'));
  const outDir = join(OUT, 'out');
  mkdirSync(outDir, { recursive: true });
  const listFile = join(OUT, 'sources.txt');
  writeFileSync(listFile, javaFiles.join('\n'), 'utf8');
  try {
    execFileSync('javac', ['-nowarn', '-d', outDir, '@' + listFile], { stdio: 'pipe' });
    console.log('javac: ' + javaFiles.length + '/' + javaFiles.length + ' files compiled clean');
  } catch (e) {
    console.log('javac FAILED\n' + (e.stderr || e.stdout || '').toString());
    rmSync(listFile, { force: true });
    process.exit(1);
  }
  rmSync(listFile, { force: true });
  rmSync(outDir, { recursive: true, force: true });   // class files are not committed
  console.log('ALL GREEN');
}
