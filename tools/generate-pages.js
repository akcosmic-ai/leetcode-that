/* generate-pages.js :: OPTIONAL. Emits patterns/<id>.html and problems/<id>.html
 * shells that redirect into the hash route.
 *
 *   node tools/generate-pages.js
 *
 * You never need this to use the site. It exists so that a link like
 * .../problems/two-sum.html works when the site is served over http (GitHub
 * Pages), which is nicer to share and better for search engines than a #/hash.
 *
 * Each generated file is a tiny redirect, not a copy of the app, so the data
 * stays in exactly one place.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

const sandbox = { window: {}, console };
sandbox.window.window = sandbox.window;
const ctx = vm.createContext(sandbox);

function load(rel) {
  const f = path.join(ROOT, rel);
  if (fs.existsSync(f)) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: rel });
}
load('data/patterns.js');
for (const dir of ['data/templates', 'data/problems']) {
  for (const f of fs.readdirSync(path.join(ROOT, dir)).filter((x) => x.endsWith('.js'))) {
    load(dir + '/' + f);
  }
}
const patterns = sandbox.window.LC_PATTERNS || [];
const problems = sandbox.window.LC_PROBLEMS || [];

function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function shell(title, description, hash) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · leetcode-that</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="../index.html#${esc(hash)}">
<meta http-equiv="refresh" content="0; url=../index.html#${esc(hash)}">
<script>location.replace('../index.html#${hash}');</script>
</head>
<body>
<p>Redirecting to <a href="../index.html#${esc(hash)}">${esc(title)}</a>.</p>
<noscript><p>JavaScript is off. <a href="../index.html#${esc(hash)}">Open ${esc(title)}</a>.</p></noscript>
</body>
</html>
`;
}

let n = 0;
for (const p of patterns) {
  fs.writeFileSync(path.join(ROOT, 'patterns', p.id + '.html'),
    shell(p.name, p.blurb || '', '/pattern/' + p.id), 'utf8');
  n++;
}
for (const p of problems) {
  fs.writeFileSync(path.join(ROOT, 'problems', p.id + '.html'),
    shell(p.leetcodeNumber + '. ' + p.title, p.problemSummary || '', '/problem/' + p.id), 'utf8');
  n++;
}
console.log('wrote ' + n + ' redirect shells (' + patterns.length + ' patterns, ' + problems.length + ' problems)');
console.log('These are optional. The app itself only needs index.html.');
