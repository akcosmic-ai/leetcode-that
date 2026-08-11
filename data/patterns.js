/* data/patterns.js :: the syllabus.
 *
 * SCHEMA (one object per technique):
 *   id                kebab-case, matches problem.pattern and the URL #/pattern/<id>
 *   order             position in the syllabus, 1..n
 *   name              display name
 *   blurb             one line, shown on cards
 *   templateId        key into window.LC_TEMPLATES (data/templates/<id>.js)
 *   whatItIs[]        paragraphs. Plain words first, jargon second.
 *   whenToReach[]     the recognition signals. This is the skill that transfers.
 *   notWhen           one line on the classic misapplication
 *   typicalComplexity { time, timeWhy, space, spaceWhy }
 *   pitfalls[]        what actually breaks in practice
 *   related[]         other pattern ids
 *
 * Inline `code` and **bold** are rendered in whatItIs / whenToReach / pitfalls.
 */
window.LC_PATTERNS = [
{
  id: 'arrays-hashing', order: 1, name: 'Arrays & Hashing',
  blurb: 'Trade memory for time: remember what you have seen so you never look twice.',
  templateId: 'hashmap-count',
  whatItIs: [
    'A hash map (`HashMap`) and a hash set (`HashSet`) both answer one question in constant time: **have I seen this before, and what was attached to it?** That is nearly the whole pattern.',
    'The move is always the same. A brute-force solution scans the array again from the inside of a loop, giving O(n²). You replace that inner scan with a lookup in a structure you built as you went, giving O(n). You paid O(n) memory to delete a whole loop.',
    'Two shapes cover most problems. **Counting**: map each value to how many times it appeared. **Indexing**: map each value to where it appeared, so you can return positions or measure distance.'
  ],
  whenToReach: [
    'The words *duplicate*, *unique*, *anagram*, *frequency*, *how many times*, *seen before*.',
    'Your first instinct is a nested loop where the inner loop only searches. That inner search is what a map removes.',
    'You need to group things that share a computed key (sorted letters, a character count, a remainder).',
    'You need "does the complement exist" rather than "compare every pair".',
    'Values are bounded and small (lowercase letters, digits 0-9): use an `int[26]` or `int[10]` instead of a map. Same idea, less overhead.'
  ],
  notWhen: 'the array is sorted and you need pairs or ordering. That is two pointers, and it needs no extra memory.',
  typicalComplexity: { time: 'O(n)', timeWhy: 'one pass, each map operation O(1) on average', space: 'O(n)', spaceWhy: 'the map can hold every element' },
  pitfalls: [
    '`map.get(k)` returns `null` when the key is absent. Assigning it to an `int` throws a NullPointerException. Use `getOrDefault(k, 0)`.',
    'Comparing boxed `Integer` with `==` compares references. It appears to work for values -128..127 because of the integer cache, then breaks. Always `.equals()` or compare `int`.',
    '`set.add(x)` returns `false` when the element was already present. That return value IS your duplicate check, no `contains` call needed.',
    'Iterating a `HashMap` gives no guaranteed order. If order matters, use `LinkedHashMap` or `TreeMap`.'
  ],
  related: ['two-pointers', 'sliding-window']
},
{
  id: 'two-pointers', order: 2, name: 'Two Pointers',
  blurb: 'Two indexes moving with purpose beat one index moving twice.',
  templateId: 'two-pointers-inward',
  whatItIs: [
    'Keep two indexes into the same sequence and move them under a rule. Because each index only ever moves in one direction, the total work is O(n) even though there are two of them.',
    'Two flavours. **Inward**: `l` at the start, `r` at the end, walking toward each other. Used for palindromes, and for pair-sum on a sorted array. **Same direction**: a slow index writing results and a fast index scanning ahead. Used for in-place removal and de-duplication.',
    'The magic is that sortedness turns a comparison into a *direction*. If `nums[l] + nums[r]` is too small, the only way to grow it is `l++`. You just eliminated an entire column of the brute-force table in one step.'
  ],
  whenToReach: [
    '**Sorted array + find a pair or triple** is the loudest signal there is.',
    'Palindrome, reverse, or any "compare the ends and work inwards".',
    'Remove or move elements *in place* with O(1) extra space, keeping relative order.',
    'The problem says O(1) extra space and you were about to reach for a set.',
    'Two separate sorted lists to merge or intersect: one pointer per list.'
  ],
  notWhen: 'the array is unsorted and sorting would destroy the indexes you must return. Use a hash map instead.',
  typicalComplexity: { time: 'O(n)', timeWhy: 'each pointer traverses the array at most once', space: 'O(1)', spaceWhy: 'two integers, nothing else' },
  pitfalls: [
    'Choosing `while (l < r)` versus `while (l <= r)`. Inward-walking pairs want `l < r`; a single-element midpoint usually wants `<=`.',
    'Forgetting to skip duplicates after a match in 3Sum, which produces duplicate triples.',
    'Sorting first when the answer must be the ORIGINAL indexes. Sort a copy of index pairs, or use a map.',
    'Moving both pointers when the rule only justifies moving one. Move one per iteration unless you have proven both are safe.'
  ],
  related: ['sliding-window', 'binary-search', 'arrays-hashing']
},
{
  id: 'sliding-window', order: 3, name: 'Sliding Window',
  blurb: 'One contiguous stretch that grows on the right and shrinks on the left.',
  templateId: 'sliding-window-variable',
  whatItIs: [
    'A window is a contiguous run `[l, r]`. You extend `r` one step at a time, and whenever the window breaks a rule you pull `l` forward until it is legal again. Every index enters once and leaves once, so it is O(n) despite the nested `while`.',
    'Two variants. **Fixed size k**: add the incoming element, remove the outgoing one, done. **Variable size**: grow greedily, shrink only while an invariant is violated, and record the best legal window as you go.',
    'The reason this beats recomputing is that a window is *incremental*. Moving from `[l, r]` to `[l, r+1]` changes one element, so any summary you keep (sum, counts, distinct count) can be updated in O(1) rather than rebuilt in O(k).'
  ],
  whenToReach: [
    'The words **contiguous**, **substring**, **subarray**, **consecutive**. Not *subsequence*: that is DP.',
    '"Longest / shortest / max / min ... such that <some condition>" over a contiguous run.',
    'Fixed length k, and you were about to recompute a sum for every start position.',
    'Character or element counts must stay within a limit ("at most 2 distinct", "no repeats").'
  ],
  notWhen: 'elements may be skipped. The moment the answer is allowed to be non-contiguous, the window breaks and you want DP or a heap.',
  typicalComplexity: { time: 'O(n)', timeWhy: 'each index is added once and removed once, even with the inner while', space: 'O(k)', spaceWhy: 'the counts of whatever is currently inside the window' },
  pitfalls: [
    'Shrinking with `if` instead of `while`. One removal is often not enough to restore the invariant.',
    'Recording the answer at the wrong moment. For "longest valid", record AFTER shrinking. For "shortest valid", record INSIDE the shrink loop.',
    'Window length is `r - l + 1`. Off-by-one here is the single most common bug in this pattern.',
    'Leaving zero counts in the map so that `map.size()` overstates the distinct count. Remove the key when its count hits 0.'
  ],
  related: ['two-pointers', 'arrays-hashing', 'heap']
},
{
  id: 'stack', order: 4, name: 'Stack & Monotonic Stack',
  blurb: 'Park work you cannot finish yet, and finish it when the answer arrives.',
  templateId: 'monotonic-stack',
  whatItIs: [
    'A stack is last-in-first-out. In Java use `Deque<T> st = new ArrayDeque<>()` with `push`/`pop`/`peek`. `java.util.Stack` works but is a synchronised legacy class.',
    'The plain use is matching and undo: brackets, nested structures, evaluating expressions.',
    'The powerful use is the **monotonic stack**: keep the stack sorted (all increasing or all decreasing) by popping anything that would break the order before you push. Each pop is the moment you learn the answer for the popped element: "the next element greater than you is the one I am holding right now". Every index is pushed once and popped once, so the whole scan is O(n) even though it looks nested.'
  ],
  whenToReach: [
    'Brackets, parentheses, nesting, or anything with an open/close structure.',
    '**"Next greater"** or **"previous smaller"** element, in any wording. That is a monotonic stack, always.',
    'Histogram areas, trapping water, spans, stock spans, temperatures until warmer.',
    'You need to undo or backtrack over recent decisions in reverse order.',
    'A recursive solution you want to write iteratively: the stack IS the call stack.'
  ],
  notWhen: 'you need the smallest element overall rather than the nearest one. That is a heap.',
  typicalComplexity: { time: 'O(n)', timeWhy: 'each element is pushed at most once and popped at most once', space: 'O(n)', spaceWhy: 'worst case every element sits on the stack' },
  pitfalls: [
    '`pop()` and `peek()` on an empty `ArrayDeque` throw. Guard with `!st.isEmpty()` or use `poll`/`peek` and null-check.',
    'Never put `null` in an `ArrayDeque`: it throws, because `null` is its "empty" signal.',
    'Storing values when you need indexes. For "next greater element" problems you almost always want to push the INDEX.',
    'Forgetting the leftovers. Whatever is still on the stack at the end has no next-greater element, and usually needs a default answer.'
  ],
  related: ['arrays-hashing', 'trees', 'heap']
},
{
  id: 'binary-search', order: 5, name: 'Binary Search',
  blurb: 'Halve the search space every step. Twenty steps covers a million.',
  templateId: 'binary-search',
  whatItIs: [
    'On a sorted array: look at the middle, and because it is sorted you can throw away half. log₂(1,000,000) is about 20, so a million elements cost twenty comparisons.',
    'The bigger idea is **binary search on the answer**. If you can write a `boolean isFeasible(x)` that is false for every x below some threshold and true for every x above it, you can binary search over the *answer range* instead of over an array. "Minimum capacity to ship in D days", "smallest divisor", "minimum eating speed" are all this.',
    'The invariant to hold in your head: the answer is always inside `[lo, hi]`. Every iteration must shrink that range and must never exclude the answer.'
  ],
  whenToReach: [
    'Sorted input plus a search. Immediate.',
    'The constraints are enormous (n up to 10⁹) so the intended solution has to be logarithmic.',
    '**"Minimum / maximum value such that a condition holds"** and the condition is monotone. Binary search the answer.',
    'You need an insertion position, a floor, or a ceiling.',
    'A rotated sorted array: still sorted enough that one half is always ordered.'
  ],
  notWhen: 'the predicate is not monotone. If feasible/infeasible alternates, halving is unsound and you need a scan.',
  typicalComplexity: { time: 'O(log n)', timeWhy: 'the range halves each iteration', space: 'O(1)', spaceWhy: 'iterative version keeps three integers' },
  pitfalls: [
    '`(lo + hi) / 2` overflows when both are near `Integer.MAX_VALUE`. Write `lo + (hi - lo) / 2`.',
    'Mixing the two idioms. `while (lo <= hi)` pairs with `hi = mid - 1`; `while (lo < hi)` pairs with `hi = mid`. Mixing them gives an infinite loop.',
    'On the `while (lo < hi)` form, `lo` and `hi` converge on the answer, so return `lo`, not `mid`.',
    'Not moving a bound at all in some branch. Every branch must shrink the range.'
  ],
  related: ['two-pointers', 'greedy', 'math-geometry']
},
{
  id: 'linked-list', order: 6, name: 'Linked List',
  blurb: 'Pointer surgery. Draw the boxes and arrows before you type anything.',
  templateId: 'linked-list-reverse',
  whatItIs: [
    'A chain of nodes, each holding a value and a reference to the next. No indexing, no length: you only ever know the node you are standing on. Everything is done by rewiring `next` references.',
    'Three techniques cover almost every problem. **Dummy head**: allocate a throwaway node in front so that inserting or deleting the real first node needs no special case. **Reverse with three pointers**: `prev`, `curr`, `next`, walking once. **Fast and slow**: one pointer moves two steps per one step of the other, which finds the middle in one pass and detects a cycle (Floyd).',
    'When stuck, draw four boxes on paper and write the order of assignments. Almost every bug in this pattern is doing them in the wrong order and losing the rest of the list.'
  ],
  whenToReach: [
    'The input is a `ListNode`. That is the whole signal.',
    'Reverse, merge, reorder, or remove nodes, with O(1) extra memory demanded.',
    'You need the middle, the k-th from the end, or the start of a cycle, in one pass without knowing the length.',
    'Insertion or deletion at the head or in the middle, where an array would have to shift everything.'
  ],
  notWhen: 'you need random access or to sort by index. Copy into an `ArrayList` if the problem permits it.',
  typicalComplexity: { time: 'O(n)', timeWhy: 'one or two traversals', space: 'O(1)', spaceWhy: 'a fixed number of node references, if you avoid recursion' },
  pitfalls: [
    'Losing the rest of the list. Save `ListNode next = curr.next;` BEFORE you overwrite `curr.next`.',
    'Dereferencing null. Guard `while (fast != null && fast.next != null)`, and mind that order: the second test would NPE if written first.',
    'Forgetting to terminate. After reordering, the new tail must have `next = null` or you have built a cycle.',
    'Returning `head` after using a dummy node. Return `dummy.next`, since the original head may no longer be first.'
  ],
  related: ['two-pointers', 'trees']
},
{
  id: 'trees', order: 7, name: 'Trees: BFS & DFS',
  blurb: 'Recursion is the natural language of trees. Learn both traversals cold.',
  templateId: 'tree-dfs',
  whatItIs: [
    'A binary tree node holds a value and two children. Every subtree is itself a tree, which is why recursion fits so well: solve it for the children, then combine.',
    '**DFS** goes deep first and is written recursively in three or four lines. The three orders differ only in where you touch the node relative to its children: **preorder** (node, left, right) copies or serialises, **inorder** (left, node, right) visits a BST in sorted order, **postorder** (left, right, node) computes something about children before the parent, which is what height, diameter and deletion need.',
    '**BFS** goes level by level using a queue. The trick that makes level problems easy: record `int size = q.size()` before the inner loop, so you process exactly one level per outer iteration.',
    'A **BST** adds an ordering rule: everything left is smaller, everything right is larger. That turns search into binary search, and makes inorder traversal produce sorted output.'
  ],
  whenToReach: [
    'The input is a `TreeNode`. Decide only DFS or BFS.',
    '**Level, depth, row, width, or "nearest"** in an unweighted structure: BFS.',
    'Height, diameter, sum, path, subtree property, validation: DFS, usually postorder.',
    'A BST plus search, k-th smallest, or a range query: use the ordering, do not scan everything.',
    'Sorted output from a BST: inorder traversal, no sorting needed.'
  ],
  notWhen: 'the structure has cycles or multiple parents. That is a graph, and it needs a visited set.',
  typicalComplexity: { time: 'O(n)', timeWhy: 'every node is visited once', space: 'O(h)', spaceWhy: 'recursion depth: O(log n) balanced, O(n) for a degenerate chain' },
  pitfalls: [
    'No null base case. `if (node == null) return ...;` is the first line of nearly every tree recursion.',
    'Validating a BST by comparing only against the parent. The constraint is a RANGE inherited down the tree, not a local comparison.',
    'BFS without capturing `q.size()` first, which mixes two levels together.',
    'Assuming the tree is balanced. A 10,000-node chain will StackOverflow a naive recursion.'
  ],
  related: ['graphs', 'stack', 'heap', 'tries']
},
{
  id: 'tries', order: 8, name: 'Tries (Prefix Trees)',
  blurb: 'Spell words down a tree so shared prefixes are stored once.',
  templateId: 'trie',
  whatItIs: [
    'A trie stores strings by character, one level per position. Every node has up to 26 children and a boolean saying "a word ends here". Words sharing a prefix share the path, so "car", "card" and "care" are one branch.',
    'Cost is driven by word LENGTH, not by how many words are stored. Looking up a 5-letter word is 5 steps whether the trie holds ten words or ten million. A `HashSet<String>` can match exact lookups, but it cannot answer "which stored words start with `ca`" without scanning everything.',
    'The standard node is just `TrieNode[] children = new TrieNode[26]` plus `boolean isWord`, indexed by `c - \'a\'`.'
  ],
  whenToReach: [
    'The word **prefix** appears, in any form: autocomplete, "starts with", shared prefixes.',
    'Many words must be matched against the same text, or against a grid (word search).',
    'You need wildcard or fuzzy matching where a `HashSet` cannot help.',
    'Repeated prefix queries on a fixed dictionary: build once, query many times.'
  ],
  notWhen: 'you only ever do exact whole-word lookups. A `HashSet<String>` is simpler and uses less memory.',
  typicalComplexity: { time: 'O(L)', timeWhy: 'L is the length of the word, independent of dictionary size', space: 'O(total characters × 26)', spaceWhy: 'a child array per node; a HashMap per node trades speed for space' },
  pitfalls: [
    'Confusing "this prefix exists" with "a word ends here". Two different questions, and you need the `isWord` flag for the second.',
    'Indexing with `c - \'a\'` when the input can contain uppercase, digits or spaces. Either normalise or use a `Map<Character, TrieNode>`.',
    'Forgetting to mark `isWord` at the end of insert, so nothing is ever found.',
    'In word-search-on-a-grid, forgetting to un-mark visited cells when backtracking out.'
  ],
  related: ['trees', 'backtracking', 'arrays-hashing']
},
{
  id: 'heap', order: 9, name: 'Heap / Priority Queue',
  blurb: 'You do not need everything sorted. You need the extreme, repeatedly.',
  templateId: 'heap-top-k',
  whatItIs: [
    'A binary heap gives O(1) access to the smallest element and O(log n) insert and remove. In Java, `PriorityQueue` is a **min**-heap by default. For a max-heap, pass `Comparator.reverseOrder()`.',
    'The key insight for "top k": sorting everything is O(n log n), but a heap of size **k** is O(n log k). Keep a MIN-heap of size k for the k LARGEST elements. That looks backwards until you see why: the smallest of your current best k sits at the top, so it is the cheapest one to evict.',
    'A heap is not sorted when you iterate it. Only the head is guaranteed. Polling repeatedly is what gives sorted order.'
  ],
  whenToReach: [
    '**Top k**, k-th largest, k closest, k most frequent. Any k.',
    'A **stream** where you cannot hold or re-sort everything, but must always answer "what is the current best".',
    'Merging several sorted lists: heap the heads.',
    '"Always process the currently smallest/cheapest next": Dijkstra, task scheduling.',
    'A running median: two heaps, a max-heap for the lower half and a min-heap for the upper half.'
  ],
  notWhen: 'you need the whole thing in order anyway. Then just sort. Also not when you need the NEAREST value rather than the smallest: that is a TreeMap.',
  typicalComplexity: { time: 'O(n log k)', timeWhy: 'n insertions into a heap capped at size k', space: 'O(k)', spaceWhy: 'the heap holds at most k elements' },
  pitfalls: [
    '`PriorityQueue` is a min-heap. Half of all heap bugs are forgetting that and expecting the maximum.',
    'For k largest use a MIN-heap and evict the head when size exceeds k. For k smallest use a max-heap. It reads backwards; it is correct.',
    'Iterating a `PriorityQueue` expecting sorted order. Only `peek()` is meaningful; use repeated `poll()`.',
    'A comparator written as `a - b` on values that can overflow. Use `Integer.compare(a, b)`.',
    '`pq.remove(x)` for an arbitrary element is O(n), not O(log n): it has to find it first.'
  ],
  related: ['sliding-window', 'graphs', 'greedy']
},
{
  id: 'backtracking', order: 10, name: 'Backtracking',
  blurb: 'Try a choice, recurse, then undo the choice. Exhaustive but pruned.',
  templateId: 'backtracking',
  whatItIs: [
    'Backtracking is DFS over the tree of decisions. At each level you pick an option, recurse on the smaller problem, then **undo the pick** so the next option starts from a clean state. Choose, explore, un-choose.',
    'The undo is the whole pattern. `path.add(x); backtrack(...); path.remove(path.size() - 1);` Skip that last line and every branch contaminates the next.',
    'It is exponential by nature, so the constraints are always tiny: n ≤ 20 or so. Pruning (stop early when the partial answer is already invalid) is what makes it usable, and it often turns an impossible problem into an instant one.'
  ],
  whenToReach: [
    '**"All possible", "every combination", "enumerate", "generate all"**: subsets, permutations, partitions.',
    'n is suspiciously small (≤ 20) while the output is large. That is a licence to be exponential.',
    'The answer is a *sequence of choices*, not a single number.',
    'Constraint satisfaction: N-Queens, Sudoku, word search on a grid.'
  ],
  notWhen: 'you only need a count or an optimum rather than the list itself, and subproblems repeat. That is DP.',
  typicalComplexity: { time: 'O(n · 2ⁿ) or O(n · n!)', timeWhy: 'one node per partial choice, times the cost of copying each answer out', space: 'O(n)', spaceWhy: 'recursion depth plus the current path, excluding the output list' },
  pitfalls: [
    'Adding the path itself to the results. `out.add(path)` stores a reference that you then mutate. Use `out.add(new ArrayList<>(path))`.',
    'Forgetting the un-choose, so state leaks between branches.',
    'Duplicate results with duplicate inputs. Sort first, then skip `i > start && nums[i] == nums[i-1]`.',
    'Confusing "start index" recursion (combinations, order does not matter) with "used[] flags" recursion (permutations, order matters).'
  ],
  related: ['graphs', 'dp-1d', 'tries']
},
{
  id: 'graphs', order: 11, name: 'Graphs: BFS, DFS, Union-Find',
  blurb: 'Trees with cycles. The visited set is not optional.',
  templateId: 'graph-bfs-grid',
  whatItIs: [
    'Nodes and edges. Grids are graphs where each cell has up to four neighbours, which is why so many "island" problems live here. Represent an explicit graph as `Map<Integer, List<Integer>>` or an array of lists (an adjacency list).',
    '**DFS** (recursion or a stack) is for reachability, connected components, cycle detection and topological order. **BFS** (a queue) is for shortest path in an UNWEIGHTED graph, because it reaches every node in order of distance. **Union-Find** (disjoint set union) answers "are these two in the same component" and merges components in near-O(1), which is what Kruskal and most connectivity problems want.',
    'The one non-negotiable difference from trees: a graph can revisit. Without a `visited` set, a cycle is an infinite loop.'
  ],
  whenToReach: [
    'A grid plus the words **island, region, area, flood fill, surrounded**: DFS or BFS from each unvisited cell.',
    '**Shortest path, fewest steps, minimum moves** with all edges equal: BFS, and never DFS.',
    'Prerequisites, dependencies, ordering, "can this be finished": topological sort, or cycle detection.',
    '**Connected components, "are they connected", merging groups, accounts to merge**: Union-Find.',
    'Weighted shortest path: BFS with a priority queue, which is Dijkstra.'
  ],
  notWhen: 'the structure is guaranteed acyclic with one parent per node. That is a tree, and you can skip the visited set.',
  typicalComplexity: { time: 'O(V + E)', timeWhy: 'each node and each edge is examined once; a grid is O(rows × cols)', space: 'O(V)', spaceWhy: 'the visited set plus the queue or recursion stack' },
  pitfalls: [
    'No visited set, or marking visited when you POP instead of when you PUSH. The second one lets duplicates into the queue and quietly turns O(V+E) into something much worse.',
    'Using DFS for shortest path. DFS finds *a* path, not the shortest one.',
    'Grid bounds. Check `r >= 0 && r < m && c >= 0 && c < n` before touching `grid[r][c]`.',
    'Recursing on a 10⁶-cell grid and blowing the stack. Switch to an explicit stack or BFS.',
    'Union-Find without path compression and union by rank, which degrades toward O(n) per query.'
  ],
  related: ['trees', 'backtracking', 'heap']
},
{
  id: 'dp-1d', order: 12, name: '1-D Dynamic Programming',
  blurb: 'Recursion plus a memo. Same subproblem, computed once.',
  templateId: 'dp-1d',
  whatItIs: [
    'DP applies when a problem has **overlapping subproblems** (the same smaller question comes up again and again) and **optimal substructure** (the best answer is built from best answers to smaller versions). Naive recursion recomputes; DP remembers.',
    'Two directions, same maths. **Top-down**: write the recursion, add a `memo` array, return early if already computed. **Bottom-up**: define `dp[i]` in words, write the base cases, then fill forward with a loop.',
    'The only hard part is defining the state. Say it as a sentence first: "`dp[i]` is the maximum I can take from the first i houses." If you cannot say it in a sentence, you do not have the state yet, and no amount of code will fix that.',
    'When `dp[i]` depends only on `dp[i-1]` and `dp[i-2]`, you can throw the array away and keep two variables. That is the O(n) time, O(1) space version of Fibonacci-shaped problems.'
  ],
  whenToReach: [
    '**"Maximum / minimum / how many ways"** and greedy gives a wrong answer on some case.',
    'You wrote a recursion and noticed it recomputes the same argument. Add a memo, you are done.',
    'The answer at position i clearly depends on a few earlier positions.',
    'Climbing stairs, house robber, coin change, decode ways, longest increasing subsequence, word break: these are the canonical shapes and they repeat forever.'
  ],
  notWhen: 'a local rule provably gives the global best. That is greedy, and it is simpler and faster.',
  typicalComplexity: { time: 'O(n) or O(n·k)', timeWhy: 'one pass over the states, times the work per state', space: 'O(n)', spaceWhy: 'the dp array, often reducible to O(1) with rolling variables' },
  pitfalls: [
    'Off-by-one on the array size. If `dp[i]` means "using the first i items", you need `n + 1` slots and `dp[0]` is the empty case.',
    'Wrong base cases. Everything after them is wrong, and the loop looks fine.',
    'Memoising with 0 as "not computed" when 0 is a legitimate answer. Seed with `Arrays.fill(memo, -1)`.',
    'Iterating in the wrong direction. Coin change with unlimited coins and with one-of-each differ ONLY in loop order.'
  ],
  related: ['dp-2d', 'greedy', 'backtracking']
},
{
  id: 'dp-2d', order: 13, name: '2-D Dynamic Programming',
  blurb: 'Two things vary, so the memo becomes a grid.',
  templateId: 'dp-2d',
  whatItIs: [
    'When the state needs two independent indexes, `dp` becomes a 2-D table. The classic shape is two sequences being compared: `dp[i][j]` is the answer for the first i characters of one string and the first j of the other.',
    'Fill order matters. Each cell usually depends on its top, left and top-left neighbours, so a plain row-by-row, left-to-right double loop works. Draw the small grid by hand once and the recurrence becomes obvious.',
    'The other common shape is a knapsack: `dp[i][c]` = the best using the first i items with capacity c. Almost every "pick a subset to hit a target" problem is this in disguise.',
    'Because each row typically depends only on the previous row, you can usually collapse to two rows, or even one row updated in the right direction, for O(n) space.'
  ],
  whenToReach: [
    'Two strings or two arrays compared: edit distance, longest common subsequence, matching.',
    'A grid with movement rules: unique paths, minimum path sum.',
    'Subset-sum, partition, knapsack: an item index and a remaining capacity.',
    'One index plus a second small piece of state (a count, a flag, "how many transactions left").'
  ],
  notWhen: 'the second dimension is unbounded. Rethink the state, or find a greedy or maths shortcut.',
  typicalComplexity: { time: 'O(m·n)', timeWhy: 'one constant-time computation per table cell', space: 'O(m·n)', spaceWhy: 'the full table, usually reducible to O(min(m, n))' },
  pitfalls: [
    'Padding. `dp[0][*]` and `dp[*][0]` represent empty prefixes and must be initialised deliberately, not left at 0 by accident.',
    'Mixing up which index belongs to which string when reading `dp[i-1][j-1]`. Write the meaning above the loop.',
    'Collapsing to one row while still reading the value you just overwrote. Either keep two rows or iterate backwards.',
    'Building the table but forgetting the answer may not be at `dp[m][n]`. For longest-substring problems it is the maximum anywhere in the table.'
  ],
  related: ['dp-1d', 'greedy']
},
{
  id: 'greedy', order: 14, name: 'Greedy',
  blurb: 'Take the locally best option and never look back. When it works, it is unbeatable.',
  templateId: 'greedy-scan',
  whatItIs: [
    'A greedy algorithm makes the choice that looks best right now and never reconsiders. When that is valid it is O(n) or O(n log n) with O(1) space, beating any DP.',
    'The catch is that it is only valid when the greedy choice is *provably* safe. Coin change with the US coin set works greedily; with coins {1, 3, 4} and target 6 it fails (4+1+1 instead of 3+3). So the real skill is testing your rule against an adversarial example before you trust it.',
    'Kadane\'s maximum subarray is the archetype: at each element, either extend the current run or start fresh, whichever is larger. One pass, one variable, provably optimal.',
    'A sort is very often the enabler. Once the input is in the right order the greedy rule becomes obvious.'
  ],
  whenToReach: [
    'Maximum or minimum where a simple local rule seems to work, and you can argue why it cannot be beaten.',
    'Sorting first makes the problem look trivial. That is usually greedy.',
    'Intervals, scheduling, jumping, buying and selling once, assigning resources.',
    '"Can you reach / cover / partition" reachability questions, where you track the furthest point reached so far.'
  ],
  notWhen: 'a locally worse choice can enable a much better future. Find the counter-example, then switch to DP.',
  typicalComplexity: { time: 'O(n) or O(n log n)', timeWhy: 'one pass, plus a sort when order is the enabler', space: 'O(1)', spaceWhy: 'a couple of running variables' },
  pitfalls: [
    'Assuming greedy works because it passes the examples. Actively hunt for a counter-example first.',
    'Sorting by the wrong key. Interval scheduling wants END times; merging wants START times. Same data, different answers.',
    'Resetting a running maximum at the wrong point in Kadane, which breaks on all-negative input.',
    'Overflow in a running sum. Use `long` when the constraints allow big totals.'
  ],
  related: ['intervals', 'dp-1d', 'binary-search']
},
{
  id: 'intervals', order: 15, name: 'Intervals',
  blurb: 'Sort by one endpoint, then sweep. Almost every interval problem is that.',
  templateId: 'intervals-merge',
  whatItIs: [
    'An interval is `[start, end]`. The workflow is nearly always: sort by start (or by end), then walk left to right keeping one piece of state, typically the end of the interval you are currently building.',
    'Two intervals overlap when `a.start <= b.end && b.start <= a.end`. Once sorted by start, that collapses to the single test `current.start <= lastEnd`.',
    'Which key you sort by decides the problem. **By start**: merging and inserting. **By end**: choosing the maximum number of non-overlapping intervals, which is the classic greedy. **Both, separately**: a sweep line that counts concurrent intervals, which is how "minimum meeting rooms" works.'
  ],
  whenToReach: [
    'The input is pairs of start and end: meetings, bookings, ranges, tasks.',
    'The words **overlap, merge, conflict, room, schedule, insert a range**.',
    'You need the maximum number of concurrent things: sweep the starts and ends separately, or use a min-heap of end times.',
    'The minimum number of removals to make the rest non-overlapping: sort by END, greedily keep.'
  ],
  notWhen: 'order is irrelevant to the question. If sorting cannot help, it probably is not an interval problem.',
  typicalComplexity: { time: 'O(n log n)', timeWhy: 'the sort dominates; the sweep itself is O(n)', space: 'O(n)', spaceWhy: 'the output list, or a heap of active end times' },
  pitfalls: [
    'Deciding whether touching counts as overlapping. Is `[1,2]` and `[2,3]` an overlap? Read the problem; both conventions appear.',
    'Sorting by the wrong endpoint. This silently produces a plausible but wrong answer.',
    'Mutating the input array when the caller still needs it, or when the expected output order is the original one.',
    'Comparators written as `a[0] - b[0]` on values near `Integer.MAX_VALUE`. Use `Integer.compare`.'
  ],
  related: ['greedy', 'heap', 'two-pointers']
},
{
  id: 'bit-manipulation', order: 16, name: 'Bit Manipulation',
  blurb: 'Integers as 32 switches. XOR is the one that shows up everywhere.',
  templateId: 'bit-tricks',
  whatItIs: [
    'An `int` is 32 bits. `&` keeps bits set in both, `|` keeps bits set in either, `^` (XOR) keeps bits set in exactly one, `~` flips all of them, `<<` and `>>` slide them.',
    'XOR has two properties that solve a whole family of problems: `x ^ x == 0` and `x ^ 0 == x`. So XOR-ing a list where everything appears twice except one leaves exactly the loner, in O(n) time and O(1) space.',
    'The idioms worth memorising: `x & 1` tests odd, `x >> 1` halves, `x & (x-1)` clears the lowest set bit (loop that to count bits), `x & -x` isolates the lowest set bit, `mask | (1 << i)` sets bit i, `mask & (1 << i)` tests it.',
    'A bitmask also lets a small set live in one integer, which is what makes subset enumeration and bitmask DP possible for n ≤ 20.'
  ],
  whenToReach: [
    '**"Appears once / twice / single number"** with O(1) space required: XOR.',
    'Counting set bits, powers of two, complements, bit reversal.',
    'Add, subtract or multiply without using arithmetic operators.',
    'Enumerating all subsets of a set of at most about 20 elements: `for (int mask = 0; mask < (1 << n); mask++)`.'
  ],
  notWhen: 'a hash map is clear and the constraints permit it. Bit tricks are fast but easy to get subtly wrong.',
  typicalComplexity: { time: 'O(n) or O(32)', timeWhy: 'one pass, or a fixed 32 iterations per number', space: 'O(1)', spaceWhy: 'a few integers, no auxiliary structure' },
  pitfalls: [
    'Java has no unsigned int. Use `>>>` (logical shift) when the sign bit must not be dragged along; `>>` preserves it.',
    'Operator precedence. `a & b == c` parses as `a & (b == c)` and will not compile as intended. Parenthesise.',
    '`1 << 31` is negative, and `1 << 32` is `1`, because the shift is taken mod 32. Use `1L << i` for anything past 31.',
    '`Math.abs(Integer.MIN_VALUE)` is still `Integer.MIN_VALUE`. Overflow does not throw in Java, it wraps silently.'
  ],
  related: ['math-geometry', 'arrays-hashing', 'backtracking']
},
{
  id: 'math-geometry', order: 17, name: 'Math & Geometry',
  blurb: 'Index arithmetic, digit tricks, and rotating a matrix in place.',
  templateId: 'matrix-walk',
  whatItIs: [
    'A grab-bag with three recurring themes. **Digits**: peel a number apart with `n % 10` and `n / 10`, which is how palindrome-number, reverse-integer and happy-number all work.',
    '**Matrix index arithmetic**: rotating 90° clockwise is transpose then reverse each row. Spiral order is four moving boundaries. Setting a row and column to zero in place uses the first row and column as your own bookkeeping.',
    '**Number theory**: GCD by Euclid (`gcd(a,b) = gcd(b, a%b)`), primes by the Sieve of Eratosthenes, modular arithmetic to keep results inside an `int`.',
    'The common thread is that the trick, once seen, is short. These problems reward having seen them before, which is exactly what spaced repetition is for.'
  ],
  whenToReach: [
    'The input is a number and the question is about its digits or divisors.',
    'A matrix must be transformed in place: rotate, transpose, spiral, set zeroes.',
    'Overflow is clearly the point of the problem ("without using 64-bit integers").',
    'The answer is a formula, and n is far too large for any loop.'
  ],
  notWhen: 'you are pattern-matching to a formula you have not verified. Test tiny inputs, including 0, 1 and negatives.',
  typicalComplexity: { time: 'varies', timeWhy: 'O(log n) for digit walks, O(m·n) for matrix passes, O(n log log n) for the sieve', space: 'O(1)', spaceWhy: 'in-place is usually the whole challenge' },
  pitfalls: [
    'Integer overflow, especially when reversing digits. Check before multiplying, or use `long`.',
    'Java\'s `%` returns a negative result for negative operands. `-7 % 3` is `-1`, not `2`. Use `Math.floorMod`.',
    'Rotating a matrix layer by layer and mixing up which corner goes where. Transpose-then-reverse is far easier to get right.',
    'Integer division truncating toward zero. `-7 / 2` is `-3` in Java, not `-4`.'
  ],
  related: ['bit-manipulation', 'binary-search']
}
];
