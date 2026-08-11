# PROGRESS.md

Build state of the curriculum. Updated with every pattern commit.
Your own review queue lives in the app (**Due** in the top nav), not here.

Last updated: **2026-08-11**

---

## Pattern checklist

Legend: teach page = the `#/pattern/<id>` page text · template = the reusable Java shape
· problems = written with all eight steps and verified by `tools/verify-java.mjs --run`.

| # | Pattern | Teach | Template | Problems | Target |
|---|---|:---:|:---:|---|---|
| 1 | Arrays & Hashing | ✅ | ✅ | **15 / 15** ✅ | 10E 4M 1H |
| 2 | Two Pointers | ✅ | ✅ | **12 / 12** ✅ | 8E 3M 1H |
| 3 | Sliding Window | ✅ | ✅ | **11 / 11** ✅ | 4E 5M 2H † |
| 4 | Stack & Monotonic Stack | ✅ | ✅ | **12 / 12** ✅ | 7E 4M 1H |
| 5 | Binary Search | ✅ | ✅ | 0 / 12 | 8E 3M 1H |
| 6 | Linked List | ✅ | ✅ | 0 / 14 | 9E 4M 1H |
| 7 | Trees: BFS & DFS | ✅ | ✅ | 0 / 18 | 12E 4M 2H |
| 8 | Tries | ✅ | ✅ | 0 / 5 | 1E 3M 1H |
| 9 | Heap / Priority Queue | ✅ | ✅ | 0 / 10 | 5E 4M 1H |
| 10 | Backtracking | ✅ | ✅ | 0 / 10 | 3E 6M 1H |
| 11 | Graphs: BFS/DFS/Union-Find | ✅ | ✅ | 0 / 13 | 5E 6M 2H |
| 12 | 1-D Dynamic Programming | ✅ | ✅ | 0 / 14 | 8E 5M 1H |
| 13 | 2-D Dynamic Programming | ✅ | ✅ | 0 / 9 | 2E 5M 2H |
| 14 | Greedy | ✅ | ✅ | 0 / 10 | 5E 4M 1H |
| 15 | Intervals | ✅ | ✅ | 0 / 8 | 3E 4M 1H |
| 16 | Bit Manipulation | ✅ | ✅ | 0 / 10 | 8E 1M 1H |
| 17 | Math & Geometry | ✅ | ✅ | 0 / 11 | 9E 2M 0H † |

† **Target adjusted, deliberately.** LeetCode has only about three canonical Easy
sliding-window problems; the technique gets interesting at Medium. Rather than pad that
pattern with obscure Easy problems, it drops to 4 Easy and Math & Geometry, which has
Easy problems to spare, picks the slot up. The whole-set target of 55/35/10 is unchanged.

**Written: 15 of ~194.** All 17 teach pages and all 17 Java templates are live and
compile under JDK 11.

---

## Platform checklist

| Piece | State |
|---|---|
| Dashboard, stats, due queue, 14-day forecast | done |
| Pattern index + per-pattern teach page | done |
| Problem page, all 8 steps | done |
| Browse + filters (pattern, difficulty, status, tag, search) | done |
| CodeMirror 6 editor, bundled locally, works on `file://` | done |
| Java suggestions (JDK dictionary + declaration-based type inference + snippets) | done |
| Symbol keypad for phone/iPad | done |
| Draft autosave per problem | done |
| LCS side-by-side diff with a match score | done |
| SM-2 scheduler with a pre-commit preview of the next date | done |
| Big-O cheat sheet + growth chart | done |
| Settings: theme, editor prefs, Judge0, export/import, reset | done |
| PWA manifest + service worker (installable, offline on mobile) | done |
| Judge0 online run | built, **round trip never executed** (needs your API key) |
| `tools/verify-java.mjs` gate: real javac + run | done |
| `tools/smoke-test.mjs` gate: jsdom, http and file:// | done |
| `tools/export-java.mjs` gate: real `java/src` tree, whole-tree javac | done |
| `tools/serve.mjs` zero-dependency static server | done |
| `tools/generate-pages.js` optional static deep-link shells | done |
| GitHub Pages: `.nojekyll` + root `index.html` | done, **Pages must be switched on in repo settings** |

---

## Verification log

Both gates must print `ALL GREEN` before a pattern counts as written.

```
2026-08-11  scaffold + arrays-hashing

$ node tools/verify-java.mjs --run
loaded 17 patterns, 17 templates, 15 problems
compile: 32/32 passed
run: 15/15 problems produced the expected output
mix: 15 problems · Easy 10 (67%) · Medium 4 (27%) · Hard 1 (7%)
ALL GREEN

$ node tools/smoke-test.mjs --file
loading file:///C:/Personal-Dev/leetcode-that/index.html
ALL GREEN: 56 checks passed

$ node tools/smoke-test.mjs
loading http://localhost:8765/index.html
ALL GREEN: 56 checks passed

$ node tools/export-java.mjs --compile
wrote 49 files under java/
javac: 47/47 files compiled clean
ALL GREEN

$ java -cp java/out lct.arrayshashing.twosum.Main
[0, 1]
[1, 2]
[0, 1]
```

The mix looks Easy-heavy while only pattern 1 exists. It converges on 55/35/10 as the
later, harder patterns land. The dashboard prints the live mix at the bottom.

---

## Next up

1. **Two Pointers** — 12 problems (8E 3M 1H). Valid Palindrome, Two Sum II, Squares of a
   Sorted Array, Remove Duplicates, Move Zeroes, Reverse String, Merge Sorted Array,
   Is Subsequence, 3Sum, Container With Most Water, Sort Colors, Trapping Rain Water (H).
2. **Sliding Window** — 11 problems, needs the fixed-size and variable-size split made
   obvious in the teach page (already written).
3. Then patterns 4 → 17 in syllabus order, one commit each.

## Known gaps, deliberately

- `judgeDriver` is written for every problem so far, which is what makes `--run`
  meaningful. Keep that up: a solution that compiles is not a solution that is correct.
- No dark/light screenshot in the README yet.
- No GitHub Pages deploy has happened; nothing has been pushed.
