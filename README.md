# leetcode-that

A static site that teaches data structures and algorithms **by technique**, then makes
you reproduce the Java from memory and schedules the problem to come back when you are
about to forget it.

No build step. No server required. No account. Your progress lives in your browser.

---

## Open it

**Desktop:** double-click `index.html`. That is the whole install.

**Or serve it** (needed only for the optional online-run mode and for the offline phone
install). There is a zero-dependency server in the repo:

```bash
node tools/serve.mjs
```

then open <http://localhost:8000>. If you would rather use Python:

```bash
python -m http.server 8000
```

**Phone / iPad:** push the repo to GitHub Pages and open the Pages URL, then use
*Share → Add to Home Screen* (iOS) or *Install app* (Android). A service worker caches
everything, so after the first load it works with no signal. Progress is stored per
device: use **Settings → Export a backup** to move it.

---

## Why it is built this way

Reading solutions does not work. It feels like learning and produces nothing you can
recall under pressure. Six ideas are baked into the page layout, not bolted on:

| Idea | How the site does it |
|---|---|
| **Retrieval practice** | You re-type the solution in an editor with the reference hidden. Reading is never the last step. |
| **Spaced repetition** | Every rating schedules the next cold attempt (SM-2). The dashboard shows what is due. |
| **Worked example first** | Step 3 is a hand-traced dry-run on a tiny input, in plain words, before any code. |
| **Pattern recognition** | Every problem lists the *signals* that point at its technique, because spotting the pattern on a new problem is the actual skill. |
| **Desirable difficulty** | Hints ladder from nudge → approach → pseudo-code, each behind a click. The solution is collapsed by default. |
| **Metacognition** | You rate 1–5 after each attempt and can note what tripped you up. The dashboard turns that into visible movement. |

## The eight-step loop

Every problem page is the same sequence, in this order, on purpose:

1. **The problem** — my paraphrase, examples, constraints, link to the official text.
2. **Key technique** — which pattern, and the signals that point to it.
3. **Intuition** — a step-by-step dry-run on one small input. No code yet.
4. **Hints** — three levels, revealed on click.
5. **Solution** — the full annotated Java, complexity explained, common mistakes listed.
6. **Now you type it** — an editor pre-loaded with the signature, solution hidden.
7. **Check yourself** — reveal the reference, see a side-by-side diff, trace the tests.
8. **Rate & schedule** — 1–5, and the SRS books the next cold attempt.

---

## Honest limitations

**Java does not compile in a browser.** There is no JVM in JavaScript that is worth
shipping, so the offline check in step 7 is: reveal the reference, diff it against what
you wrote, and hand-trace the visible test cases. That is deliberate, not a shortcut:
tracing by hand is a better retention exercise than watching a green tick.

If you want real `javac`, turn on **Settings → Online run**. It sends your code to
[Judge0 CE](https://judge0.com/) and needs an API key plus an internet connection. Two
caveats stated up front:

* The round trip has never been executed here, because it needs *your* key. If it
  misbehaves, the raw response is logged to the browser console.
* RapidAPI often rejects requests whose `Origin` is `null`, which is what a page opened
  as `file://` sends. If you get a CORS or 403 error, serve over http first.

**The editor suggestions are a dictionary, not a compiler.** `js/java-api.js` holds a
curated JDK surface (the collections, `Arrays`, `Math`, `Character`, `TreeNode`, …) with
signatures and one-line docs, and `js/editor.js` guesses a variable's type by reading
your own declarations out of the buffer. So typing `seen.` after
`Map<Integer,Integer> seen = new HashMap<>();` offers `put`, `getOrDefault`,
`containsKey` and the rest. It will **not** flag a type error, and it does not know the
type of a chained call like `map.get(k).`.

**Progress is per browser.** localStorage, not a server. Export before you clear site
data.

---

## The curriculum

17 techniques, taught in this order, each easy → hard inside itself. Target ~195
problems at roughly **55% Easy / 35% Medium / 10% Hard** — lots of easy to build
confidence, a solid medium layer, a few hard.

| # | Pattern | Problems | E / M / H |
|---|---|---|---|
| 1 | Arrays & Hashing | 15 | 10 / 4 / 1 |
| 2 | Two Pointers | 12 | 8 / 3 / 1 |
| 3 | Sliding Window | 11 | 5 / 4 / 2 |
| 4 | Stack & Monotonic Stack | 12 | 7 / 4 / 1 |
| 5 | Binary Search | 12 | 8 / 3 / 1 |
| 6 | Linked List | 14 | 9 / 4 / 1 |
| 7 | Trees: BFS & DFS | 18 | 12 / 4 / 2 |
| 8 | Tries | 5 | 1 / 3 / 1 |
| 9 | Heap / Priority Queue | 10 | 5 / 4 / 1 |
| 10 | Backtracking | 10 | 3 / 6 / 1 |
| 11 | Graphs: BFS/DFS/Union-Find | 13 | 5 / 6 / 2 |
| 12 | 1-D Dynamic Programming | 14 | 8 / 5 / 1 |
| 13 | 2-D Dynamic Programming | 9 | 2 / 5 / 2 |
| 14 | Greedy | 10 | 5 / 4 / 1 |
| 15 | Intervals | 8 | 3 / 4 / 1 |
| 16 | Bit Manipulation | 10 | 8 / 1 / 1 |
| 17 | Math & Geometry | 11 | 8 / 3 / 0 |

Live counts are on the dashboard, and `PROGRESS.md` tracks which patterns are written.

---

## How the schedule works

SM-2, the algorithm behind SuperMemo and Anki. Each problem carries an **ease** (starts
at 2.5, clamped to 1.3–2.8) and an **interval** in days.

* Rate **1** or **2** → failed. Interval resets to 1 day, status becomes *Needs review*,
  ease drops.
* Rate **3**, **4** or **5** → passed. The interval walks `1 day → 3 days → previous ×
  ease`. A 5 nudges ease up, a 3 nudges it down. Capped at a year.

So a problem you keep fumbling comes back tomorrow, and one you nail three times running
drifts out past a month. Hovering a rating button previews the exact date before you
commit.

---

## Adding a problem

Pure data. Open `data/problems/<pattern>.js`, push one more object, reload the page. The
dashboard counts, pattern ordering, filters, search, routing and the SRS all derive from
that array — **no layout file is ever touched.**

The schema is documented field by field in
[`data/problems/_SCHEMA.md`](data/problems/_SCHEMA.md).

Then check it. There are two gates, and nothing is called "done" without both printing
`ALL GREEN`.

```bash
node tools/verify-java.mjs --run
```

Loads every data file, compiles every `javaSolution` and every pattern template with your
real `javac`, executes any problem that has a `judgeDriver` and compares the output to its
`testCases`, and reports the difficulty mix plus schema violations.

```bash
node tools/smoke-test.mjs --file
```

Loads `index.html` in a real DOM (jsdom) from a `file://` URL and exercises the app: every
route renders, the editor mounts, the SM-2 maths advances as the README describes, the
diff scores correctly, the suggestion engine infers types, drafts persist, and the problem
page has all eight steps wired. Drop `--file` to run the same suite over `http://`. Both
paths must pass, because the `file://` run is what proves the no-server claim.

Both exit non-zero on failure.

---

## Layout

```
index.html                 the only page; everything is a #/hash route
assets/css/app.css         one stylesheet, mobile-first
assets/vendor/cm6.bundle.js CodeMirror 6, pre-built and committed (426 KB)
js/
  store.js                 the only file that touches localStorage
  srs.js                   SM-2
  editor.js                editor mount + Java suggestion engine + touch keypad
  java-api.js              the JDK dictionary the suggestions come from
  diff.js                  LCS line diff, no library
  judge.js                 optional Judge0 adapter, off by default
  progress.js filters.js ui.js router.js app.js
  view-*.js                one file per screen
data/
  patterns.js              the 17 techniques and their teach text
  templates/<pattern>.js   one reusable Java template per pattern
  problems/<pattern>.js    the problems
tools/
  editor-src.mjs           CodeMirror entry point (build once, never at runtime)
  verify-java.mjs          gate 1: real javac over every solution and template
  smoke-test.mjs           gate 2: loads the page in jsdom and drives it
  serve.mjs                zero-dependency static server
  make-icons.mjs           writes the PWA icons
  generate-pages.js        optional static problems/*.html shells for deep links
```

### Rebuilding the editor bundle

Only needed if you change `tools/editor-src.mjs`:

```bash
cd tools && npm install && npm run build
```

The output is committed so that a fresh clone works by double-clicking `index.html`.

---

## Keyboard

| Key | Does |
|---|---|
| <kbd>Ctrl</kbd>+<kbd>Space</kbd> | Show suggestions |
| <kbd>Tab</kbd> | Accept the highlighted suggestion, or indent |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Y</kbd> | Undo / redo |
| <kbd>Ctrl</kbd>+<kbd>F</kbd> | Search inside the editor |

On a phone or iPad there is no <kbd>Ctrl</kbd>, so the row under the editor has the
symbols iOS buries plus a **💡** button for suggestions.
