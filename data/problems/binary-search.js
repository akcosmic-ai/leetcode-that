/* data/problems/binary-search.js
 *
 * Problems for the "binary-search" pattern. Schema: data/problems/_SCHEMA.md
 *
 * Target mix: 8 Easy, 3 Medium, 1 Hard.
 * Sequenced so the two loop idioms are separated before they are mixed:
 * exact-match [lo, hi] first, then boundary-finding [lo, hi), then searching a
 * predicate rather than an array, then searching the ANSWER, then rotation.
 */
(window.LC_PROBLEMS = window.LC_PROBLEMS || []).push(

{
  id: 'binary-search',
  leetcodeNumber: 704,
  title: 'Binary Search',
  url: 'https://leetcode.com/problems/binary-search/',
  pattern: 'binary-search',
  difficulty: 'Easy',
  order: 1,
  tags: ['exact-match', 'closed-interval'],
  problemSummary: 'The array is sorted in ascending order with no duplicates. Return the index of `target`, or -1 if it is absent. It must run in O(log n).',
  examples: [
    { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', note: '9 is at index 4.' },
    { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', note: 'Not present.' }
  ],
  constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4', 'All values are unique and sorted in ascending order'],
  techniqueNote: 'the exact-match idiom on a **closed interval** `[lo, hi]`. Both ends are real candidates, so the loop condition is `lo <= hi`.',
  signals: [
    'Sorted input plus a search. That is the whole signal, and it never gets more subtle than this.',
    'O(log n) is demanded outright.',
    'You only need "is it here, and where", not a boundary, so the exact-match form is enough.'
  ],
  intuition: {
    input: 'nums = [-1,0,3,5,9,12], target = 9',
    visual:
      'index    0   1   2   3   4   5\n' +
      'value   -1   0   3   5   9  12\n' +
      '\n' +
      'lo=0 hi=5  mid=2 -> 3 < 9, so 9 is to the RIGHT. lo = 3\n' +
      'lo=3 hi=5  mid=4 -> 9 == 9  FOUND at index 4\n' +
      '\n' +
      'two comparisons for six elements. log2(10^4) is about 14.',
    steps: [
      { state: 'lo=0, hi=5', say: 'The invariant to hold in your head: **if the target is anywhere, it is inside `[lo, hi]`**. Every iteration must shrink that range without ever excluding the answer.' },
      { state: 'mid=2, value 3', say: 'Look at the middle. `3 < 9`, and the array is sorted, so everything at index 2 or below is also too small. Discard all of it: `lo = mid + 1`.' },
      { state: 'lo=3, hi=5', say: 'Half the array is gone after one comparison. That is where the logarithm comes from.' },
      { state: 'mid=4, found', say: '`mid = 4` holds 9. Return the index.' },
      { state: '', say: 'Write `mid = lo + (hi - lo) / 2`, not `(lo + hi) / 2`. When both are near `Integer.MAX_VALUE` the sum overflows and goes negative, and the array index throws. It is a real bug that shipped in the JDK for nine years.' },
      { state: '', say: 'The loop is `lo <= hi` because `hi` is a real candidate. When `lo` passes `hi` the range is empty and the target is absent.' }
    ],
    takeaway: 'Two lines matter more than the rest: `mid = lo + (hi - lo) / 2` for overflow, and `lo <= hi` paired with `mid ± 1` so the range always shrinks.'
  },
  hints: [
    'The array is sorted. If you look at the middle element and it is too small, what do you know about everything to its left?',
    'Keep a range `[lo, hi]` that must contain the answer. Compare the middle, then discard the half that cannot contain the target by moving `lo` or `hi` past `mid`.',
    'Pseudo-code: `lo=0; hi=n-1; while lo <= hi: mid = lo + (hi-lo)/2; if nums[mid]==target return mid; if nums[mid] < target: lo = mid+1 else hi = mid-1; return -1`'
  ],
  methodSignature: 'public int search(int[] nums, int target)',
  javaTemplate: 'binary-search',
  javaSolution: `class Solution {
    public int search(int[] nums, int target) {
        // Closed interval: both lo and hi are real candidates.
        int lo = 0;
        int hi = nums.length - 1;

        while (lo <= hi) {
            // NOT (lo + hi) / 2, which overflows when both are large. This form
            // cannot overflow because hi - lo fits comfortably in an int.
            int mid = lo + (hi - lo) / 2;

            if (nums[mid] == target) {
                return mid;
            }

            if (nums[mid] < target) {
                lo = mid + 1;    // mid is too small, and so is everything left of it
            } else {
                hi = mid - 1;    // mid is too big, and so is everything right of it
            }
        }

        // lo passed hi, so the range is empty and the target is not here.
        return -1;
    }
}
`,
  complexity: {
    time: 'O(log n)', timeWhy: 'the candidate range halves on every iteration, so at most log2(n) iterations run',
    space: 'O(1)', spaceWhy: 'three integers. A recursive version would cost O(log n) stack.'
  },
  testCases: [
    { input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 }, expected: '4' },
    { input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 }, expected: '-1' },
    { input: { nums: [5], target: 5 }, expected: '0' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.search(new int[]{-1, 0, 3, 5, 9, 12}, 9));
        System.out.println(s.search(new int[]{-1, 0, 3, 5, 9, 12}, 2));
        System.out.println(s.search(new int[]{5}, 5));
    }
}`,
  commonMistakes: [
    'Writing `mid = (lo + hi) / 2`. Correct for small arrays, and an overflow bug waiting to happen.',
    'Using `lo < hi` with `hi = mid - 1`. That mixes the two idioms and can skip the answer.',
    'Assigning `lo = mid` or `hi = mid` in the exact-match form, which stops the range shrinking and loops forever.',
    'Forgetting to return -1, or returning `mid` after the loop where `mid` is meaningless.'
  ],
  followUps: [
    'Search Insert Position (next) is the same problem when the target is absent, which needs the OTHER loop idiom.',
    '`Arrays.binarySearch` does this, and returns `-(insertionPoint) - 1` when absent. Worth knowing, and worth being able to write by hand.'
  ]
},

{
  id: 'search-insert-position',
  leetcodeNumber: 35,
  title: 'Search Insert Position',
  url: 'https://leetcode.com/problems/search-insert-position/',
  pattern: 'binary-search',
  difficulty: 'Easy',
  order: 2,
  tags: ['lower-bound', 'half-open-interval', 'boundary'],
  problemSummary: 'The array is sorted with distinct values. Return the index of `target`, or the index where it would need to be inserted to keep the array sorted. O(log n) required.',
  examples: [
    { input: 'nums = [1,3,5,6], target = 5', output: '2', note: 'Present at index 2.' },
    { input: 'nums = [1,3,5,6], target = 2', output: '1', note: 'It would go between 1 and 3.' },
    { input: 'nums = [1,3,5,6], target = 7', output: '4', note: 'It would go on the end, one past the last index.' }
  ],
  constraints: ['1 <= nums.length <= 10^4', '-10^4 <= nums[i], target <= 10^4', 'nums contains distinct values sorted in ascending order'],
  techniqueNote: 'the **boundary** idiom on a half-open interval `[lo, hi)`. This is lower_bound: the first index whose value is at least `target`.',
  signals: [
    'The answer is a **position**, not a hit or a miss. That is the tell for the boundary form.',
    'The answer can be `n`, one past the end, which a closed interval `[0, n-1]` cannot represent. So `hi` starts at `n`.',
    '"First index such that ..." in any wording is lower_bound, and this loop shape is worth memorising as a unit.'
  ],
  intuition: {
    input: 'nums = [1,3,5,6], target = 2',
    visual:
      'index   0  1  2  3   (4)\n' +
      'value   1  3  5  6\n' +
      '\n' +
      'we want the FIRST index whose value is >= 2, which is index 1\n' +
      '\n' +
      'lo=0 hi=4   mid=2 -> 5 >= 2, so the answer is at 2 or LEFT.  hi = 2\n' +
      'lo=0 hi=2   mid=1 -> 3 >= 2, so the answer is at 1 or LEFT.  hi = 1\n' +
      'lo=0 hi=1   mid=0 -> 1 <  2, so the answer is strictly RIGHT. lo = 1\n' +
      'lo == hi == 1, and that is the answer',
    steps: [
      { state: '', say: 'Rephrase the question first: the insertion point is the FIRST index whose value is at least `target`. That single sentence is what makes this a boundary search.' },
      { state: 'hi = 4', say: '`hi` starts at `n`, not `n - 1`, because the answer can legitimately be 4, past the end. The interval is half-open, `[lo, hi)`, so `hi` is a bound and not a candidate.' },
      { state: 'hi = 2', say: 'When `nums[mid] >= target`, `mid` itself might BE the answer, so it must not be excluded: `hi = mid`, not `mid - 1`.' },
      { state: 'lo = 1', say: 'When `nums[mid] < target`, `mid` definitely is not the answer, so `lo = mid + 1`.' },
      { state: 'lo == hi', say: 'The loop is `while (lo < hi)`. It ends when the two meet, and that meeting point is the boundary. Return `lo`, never `mid`.' },
      { state: '', say: 'This form never checks for equality and never returns early. It always runs the full log n steps and always produces a position.' }
    ],
    takeaway: 'Two idioms, and mixing them is the number one binary-search bug. `lo <= hi` pairs with `mid ± 1` and returns from inside. `lo < hi` pairs with `hi = mid` and returns `lo` at the end.'
  },
  hints: [
    'Both answers, "found at index i" and "insert at index i", are the same number. What single question about the array does that number answer?',
    'Find the first index whose value is >= target. Use `hi = n` so that "insert at the end" is representable, `while (lo < hi)`, and `hi = mid` when `mid` could be the answer.',
    'Pseudo-code: `lo=0; hi=n; while lo < hi: mid = lo + (hi-lo)/2; if nums[mid] < target: lo = mid+1 else hi = mid; return lo`'
  ],
  methodSignature: 'public int searchInsert(int[] nums, int target)',
  javaTemplate: 'binary-search',
  javaSolution: `class Solution {
    public int searchInsert(int[] nums, int target) {
        // Half-open interval [lo, hi). hi starts at length, not length - 1,
        // because "insert at the very end" is a valid answer.
        int lo = 0;
        int hi = nums.length;

        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;

            if (nums[mid] < target) {
                lo = mid + 1;    // mid is too small, so it cannot be the answer
            } else {
                hi = mid;        // mid might BE the answer, so do not exclude it
            }
        }

        // lo == hi, and that is the first index whose value is >= target.
        return lo;
    }
}
`,
  complexity: {
    time: 'O(log n)', timeWhy: 'the range halves every iteration and the loop always runs to completion',
    space: 'O(1)', spaceWhy: 'three integers'
  },
  testCases: [
    { input: { nums: [1, 3, 5, 6], target: 5 }, expected: '2' },
    { input: { nums: [1, 3, 5, 6], target: 2 }, expected: '1' },
    { input: { nums: [1, 3, 5, 6], target: 7 }, expected: '4' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.searchInsert(new int[]{1, 3, 5, 6}, 5));
        System.out.println(s.searchInsert(new int[]{1, 3, 5, 6}, 2));
        System.out.println(s.searchInsert(new int[]{1, 3, 5, 6}, 7));
    }
}`,
  commonMistakes: [
    'Starting `hi = nums.length - 1`, which makes the answer 4 unreachable and returns 3 for target 7.',
    'Writing `hi = mid - 1` in this form, which can skip past the boundary.',
    'Returning `mid` after the loop. `mid` is whatever the last iteration happened to compute; `lo` is the answer.',
    'Adding an early `return mid` on equality. It is not wrong for distinct values, and it stops the loop being a clean boundary search, which breaks once duplicates appear.'
  ],
  followUps: [
    'With duplicates, this exact loop gives the FIRST occurrence. Flipping `<` to `<=` gives one past the LAST occurrence, which is how you count occurrences in O(log n).',
    'Find First and Last Position of Element in Sorted Array is two calls to this loop.'
  ]
},

{
  id: 'first-bad-version',
  leetcodeNumber: 278,
  title: 'First Bad Version',
  url: 'https://leetcode.com/problems/first-bad-version/',
  pattern: 'binary-search',
  difficulty: 'Easy',
  order: 3,
  tags: ['boundary', 'predicate', 'api-calls'],
  problemSummary: 'Versions 1 through n were released in order. From some version onward every version is bad. You can call `isBadVersion(v)` to test one. Find the first bad version using as few calls as possible.',
  examples: [
    { input: 'n = 5, the first bad version is 4', output: '4', note: 'Versions 1, 2, 3 are good and 4, 5 are bad.' },
    { input: 'n = 1, the first bad version is 1', output: '1', note: 'Only one version, and it is bad.' }
  ],
  constraints: ['1 <= bad <= n <= 2^31 - 1'],
  techniqueNote: 'the boundary idiom with **no array at all**. You are searching a monotone predicate: good, good, …, good, bad, bad, …, bad.',
  signals: [
    'A **monotone** boolean: once it becomes true it never goes back to false. That is the only thing binary search needs.',
    'You are told to minimise API calls, which is a request for a logarithmic number of them.',
    'There is no array. This is the problem that shows binary search was never really about arrays.'
  ],
  intuition: {
    input: 'n = 5, first bad is 4',
    visual:
      'version   1     2     3     4     5\n' +
      'isBad     F     F     F     T     T\n' +
      '                            ^ the boundary we want\n' +
      '\n' +
      'lo=1 hi=5   mid=3  isBad(3)=F  ->  boundary is strictly RIGHT.  lo = 4\n' +
      'lo=4 hi=5   mid=4  isBad(4)=T  ->  boundary is 4 or LEFT.       hi = 4\n' +
      'lo == hi == 4',
    steps: [
      { state: '', say: 'There is no array here, and it does not matter. All binary search needs is a range and a question whose answer flips exactly once as you move right.' },
      { state: 'lo=1, hi=n', say: 'The range is version numbers `[1, n]`. Note that a version is 1-based, so `lo` starts at 1.' },
      { state: 'isBad(3) = false', say: 'A good version means the first bad one is strictly to the right, so `lo = mid + 1`.' },
      { state: 'isBad(4) = true', say: 'A bad version means `mid` might itself be the first bad one, so `hi = mid`. Never `mid - 1`, or you can discard the answer.' },
      { state: 'lo == hi == 4', say: 'The pointers converge on the boundary. Return `lo`.' },
      { state: '', say: 'On `mid`: with `n` up to 2^31 - 1, `(lo + hi) / 2` overflows into a negative number and `isBadVersion` gets nonsense. This is the problem where that bug actually bites.' }
    ],
    takeaway: 'Binary search needs a monotone predicate, not a sorted array. Once you see that, "binary search on the answer" is the obvious next step rather than a trick.'
  },
  hints: [
    'You cannot see the versions, only ask about them. What is special about the sequence of answers you would get if you asked about every version in order?',
    'Binary search the version numbers. A good version pushes `lo` past `mid`; a bad version pulls `hi` down to `mid`, because `mid` could be the first bad one.',
    'Pseudo-code: `lo=1; hi=n; while lo < hi: mid = lo + (hi-lo)/2; if isBadVersion(mid): hi = mid else lo = mid+1; return lo`'
  ],
  methodSignature: 'public int firstBadVersion(int n)',
  starterExtras: `/* Stand-in for the API LeetCode injects. Not part of your answer: it exists
 * so that this file compiles and runs on your own machine. */
class VersionControl {
    private int firstBad = Integer.MAX_VALUE;

    void setFirstBad(int v) {
        firstBad = v;
    }

    boolean isBadVersion(int version) {
        return version >= firstBad;
    }
}`,
  javaTemplate: 'binary-search',
  javaSolution: `class Solution extends VersionControl {
    public int firstBadVersion(int n) {
        // Versions are 1-based, so the range is [1, n].
        int lo = 1;
        int hi = n;

        while (lo < hi) {
            // n can be 2^31 - 1, so (lo + hi) / 2 would overflow to a negative
            // number here. This is the problem where that bug really bites.
            int mid = lo + (hi - lo) / 2;

            if (isBadVersion(mid)) {
                hi = mid;        // mid might BE the first bad version
            } else {
                lo = mid + 1;    // mid is good, so the answer is strictly right
            }
        }

        return lo;   // lo == hi, the boundary
    }
}

/* Stand-in for the API LeetCode injects. Not part of your answer. */
class VersionControl {
    private int firstBad = Integer.MAX_VALUE;

    void setFirstBad(int v) {
        firstBad = v;
    }

    boolean isBadVersion(int version) {
        return version >= firstBad;
    }
}
`,
  complexity: {
    time: 'O(log n)', timeWhy: 'one API call per halving, so about 31 calls at the maximum n',
    space: 'O(1)', spaceWhy: 'three integers'
  },
  testCases: [
    { input: 'n = 5, first bad = 4', expected: '4' },
    { input: 'n = 1, first bad = 1', expected: '1' },
    { input: 'n = 2126753390, first bad = 1702766719', expected: '1702766719' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        System.out.println(run(5, 4));
        System.out.println(run(1, 1));
        // Large n: this case fails outright if mid is computed as (lo + hi) / 2.
        System.out.println(run(2126753390, 1702766719));
    }

    static int run(int n, int firstBad) {
        Solution s = new Solution();
        s.setFirstBad(firstBad);
        return s.firstBadVersion(n);
    }
}`,
  commonMistakes: [
    'Computing `mid = (lo + hi) / 2`. With n near 2^31 - 1 this overflows negative, and the third test case above is exactly that case.',
    'Writing `hi = mid - 1` when the version is bad, which can discard the answer.',
    'Starting `lo = 0`. Versions are 1-based.',
    'Calling `isBadVersion` more than once per iteration. Store the result if you need it twice; the problem is scored on call count.'
  ],
  followUps: [
    'Koko Eating Bananas (later in this pattern) is this same predicate search where you write `isBadVersion` yourself.',
    'Any monotone yes/no question over a range is binary-searchable, which is the single most transferable idea in this pattern.'
  ]
},

{
  id: 'sqrtx',
  leetcodeNumber: 69,
  title: 'Sqrt(x)',
  url: 'https://leetcode.com/problems/sqrtx/',
  pattern: 'binary-search',
  difficulty: 'Easy',
  order: 4,
  tags: ['search-the-answer', 'overflow'],
  problemSummary: 'Return the integer square root of a non-negative integer, that is the square root rounded down. No built-in exponent or square-root function.',
  examples: [
    { input: 'x = 4', output: '2', note: 'Exactly 2.' },
    { input: 'x = 8', output: '2', note: 'The real root is about 2.83, rounded down to 2.' },
    { input: 'x = 0', output: '0', note: 'Edge case.' }
  ],
  constraints: ['0 <= x <= 2^31 - 1', 'You may not use any built-in exponent function or operator'],
  techniqueNote: 'the first real **binary search on the answer**. There is no array: the search space is the candidate answers `0..x`, and the predicate is `mid * mid <= x`.',
  signals: [
    'No array anywhere, and the answer is a number in a known range. Search that range.',
    'The predicate `mid * mid <= x` is monotone: true for every candidate up to the root and false after it. Monotone is all binary search needs.',
    '"Rounded down" means you want the LARGEST candidate that satisfies the predicate, so keep a running best.'
  ],
  intuition: {
    input: 'x = 8',
    visual:
      'candidate  0  1  2  3  4  ...  8\n' +
      'sq <= 8    T  T  T  F  F       F\n' +
      '                 ^ largest true, so the answer is 2\n' +
      '\n' +
      'lo=0 hi=8  mid=4  16 <= 8? no   -> hi = 3\n' +
      'lo=0 hi=3  mid=1   1 <= 8? yes  -> best=1, lo = 2\n' +
      'lo=2 hi=3  mid=2   4 <= 8? yes  -> best=2, lo = 3\n' +
      'lo=3 hi=3  mid=3   9 <= 8? no   -> hi = 2\n' +
      'lo > hi, stop. best = 2',
    steps: [
      { state: '', say: 'There is no array to search, so search the answers. The integer root of `x` is somewhere in `[0, x]`, and the question "is `mid` small enough" flips from true to false exactly once. That is enough.' },
      { state: 'mid=4, too big', say: '`4 * 4 = 16` exceeds 8, so 4 and everything above it is out: `hi = mid - 1`.' },
      { state: 'best=2', say: 'When `mid * mid <= x`, `mid` is a valid answer, so RECORD it and try for something bigger: `lo = mid + 1`. The recorded best is what "rounded down" means.' },
      { state: '', say: 'The overflow trap: at `x = 2147483647`, `mid` gets close to 46341, and `46341 * 46341` is 2147488281, which does not fit in an `int` and wraps negative. Then `mid * mid <= x` is wrongly true.' },
      { state: '', say: 'Cast to `long` before multiplying: `(long) mid * mid <= x`. Note the cast must be on an operand, not on the result, because the multiplication happens in `int` first otherwise.' },
      { state: 'answer 2', say: 'The loop ends with `best` holding the largest candidate that passed.' }
    ],
    takeaway: 'Recording a running `best` when the predicate passes is how you turn a boundary search into "the largest value that works". It is easier to reason about than an upper-mid loop.'
  },
  hints: [
    'You cannot use `Math.sqrt`. But you can check a guess: given a candidate `m`, how do you know whether it is too big?',
    'Binary search the candidate answers in `[0, x]`. When `mid * mid <= x`, record `mid` as the best so far and search higher. Otherwise search lower.',
    'Pseudo-code: `lo=0; hi=x; best=0; while lo <= hi: mid = lo + (hi-lo)/2; if (long) mid*mid <= x: best = mid; lo = mid+1 else hi = mid-1; return best`'
  ],
  methodSignature: 'public int mySqrt(int x)',
  javaTemplate: 'binary-search',
  javaSolution: `class Solution {
    public int mySqrt(int x) {
        int lo = 0;
        int hi = x;
        int best = 0;   // largest candidate whose square fits under x

        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;

            // (long) applies to mid FIRST, so the multiplication happens in long.
            // Writing (long)(mid * mid) would overflow before the cast and is the
            // classic version of this bug. At x = 2147483647, mid reaches 46341
            // and 46341 * 46341 wraps negative in int.
            if ((long) mid * mid <= x) {
                best = mid;      // valid, so remember it and reach higher
                lo = mid + 1;
            } else {
                hi = mid - 1;    // too big
            }
        }

        return best;
    }
}
`,
  complexity: {
    time: 'O(log x)', timeWhy: 'the candidate range halves each iteration, about 31 steps at the maximum x',
    space: 'O(1)', spaceWhy: 'four integers'
  },
  testCases: [
    { input: { x: 4 }, expected: '2' },
    { input: { x: 8 }, expected: '2' },
    { input: { x: 0 }, expected: '0' },
    { input: { x: 2147483647 }, expected: '46340' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.mySqrt(4));
        System.out.println(s.mySqrt(8));
        System.out.println(s.mySqrt(0));
        // The overflow case: wrong answers here mean mid * mid was computed in int.
        System.out.println(s.mySqrt(2147483647));
    }
}`,
  commonMistakes: [
    'Computing `mid * mid` in `int`. It wraps negative near the top of the range, and the last test case above catches it.',
    'Writing `(long) (mid * mid)`, which overflows in `int` before the cast does anything.',
    'Using `mid <= x / mid` instead. It works and it is a division per iteration and harder to read.',
    'Not tracking `best` and instead returning `lo` or `hi` after the loop. `hi` happens to hold the answer in this form, and relying on that without knowing why is how the next problem breaks.'
  ],
  followUps: [
    'Valid Perfect Square (next) is this loop asking for exact equality instead of a floor.',
    'Newton\'s method converges faster, and binary search is the one that generalises to any monotone predicate.',
    'The same search-the-answer shape solves Koko Eating Bananas and Capacity To Ship Packages.'
  ]
},

{
  id: 'valid-perfect-square',
  leetcodeNumber: 367,
  title: 'Valid Perfect Square',
  url: 'https://leetcode.com/problems/valid-perfect-square/',
  pattern: 'binary-search',
  difficulty: 'Easy',
  order: 5,
  tags: ['search-the-answer', 'exact-match', 'overflow'],
  problemSummary: 'Decide whether a positive integer is the square of some integer, without using any built-in square-root function.',
  examples: [
    { input: 'num = 16', output: 'true', note: '4 * 4.' },
    { input: 'num = 14', output: 'false', note: 'Between 3² and 4².' },
    { input: 'num = 1', output: 'true', note: '1 * 1.' }
  ],
  constraints: ['1 <= num <= 2^31 - 1', 'You must not use any built-in library function such as sqrt'],
  techniqueNote: 'the exact-match idiom applied to the answer space rather than to an array. Same range as Sqrt(x), different question.',
  signals: [
    'Same shape as Sqrt(x), and that is the point of putting them next to each other.',
    'You want exact equality, not a floor, so the exact-match loop with an early return fits.',
    'The same `long` cast is required, for the same reason.'
  ],
  intuition: {
    input: 'num = 14',
    visual:
      'candidate  1  2  3  4  ...\n' +
      'square     1  4  9 16\n' +
      '                 ^  ^ 14 falls between them, so it is not a square\n' +
      '\n' +
      'lo=1 hi=14  mid=7   49 > 14  -> hi = 6\n' +
      'lo=1 hi=6   mid=3    9 < 14  -> lo = 4\n' +
      'lo=4 hi=6   mid=5   25 > 14  -> hi = 4\n' +
      'lo=4 hi=4   mid=4   16 > 14  -> hi = 3\n' +
      'lo > hi, so no candidate squared to exactly 14  ->  false',
    steps: [
      { state: '', say: 'The search space is again the candidate roots, `[1, num]`. Squaring is increasing, so the squares are sorted even though no array exists.' },
      { state: 'mid=7, 49 > 14', say: 'Too big, so discard `mid` and everything above: `hi = mid - 1`.' },
      { state: 'mid=3, 9 < 14', say: 'Too small, so discard `mid` and everything below: `lo = mid + 1`.' },
      { state: 'lo > hi', say: 'This is the exact-match idiom, so a hit returns immediately and the loop running out means "not present". Here it runs out, so 14 is not a perfect square.' },
      { state: '', say: 'Same overflow trap as Sqrt(x). At `num = 2147395600`, which IS a perfect square (46340²), the product must be computed in `long` or the comparison is nonsense.' }
    ],
    takeaway: 'The same loop answers two different questions depending on the idiom you pick: exact-match for "is it exactly here", boundary or best-tracking for "how far can I go".'
  },
  hints: [
    'You cannot call `sqrt`. What can you do with a guess `m` to find out whether it is too big, too small, or exactly right?',
    'Binary search the candidate roots in `[1, num]` with the exact-match loop. Compare `mid * mid` against `num`, computed in `long`.',
    'Pseudo-code: `lo=1; hi=num; while lo <= hi: mid = lo + (hi-lo)/2; sq = (long) mid*mid; if sq == num return true; if sq < num: lo = mid+1 else hi = mid-1; return false`'
  ],
  methodSignature: 'public boolean isPerfectSquare(int num)',
  javaTemplate: 'binary-search',
  javaSolution: `class Solution {
    public boolean isPerfectSquare(int num) {
        int lo = 1;
        int hi = num;

        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;

            // long, for the same reason as Sqrt(x): mid can reach 46341 and
            // 46341 * 46341 does not fit in an int.
            long square = (long) mid * mid;

            if (square == num) {
                return true;
            }

            if (square < num) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }

        // The range emptied without an exact hit.
        return false;
    }
}
`,
  complexity: {
    time: 'O(log num)', timeWhy: 'the candidate range halves each iteration',
    space: 'O(1)', spaceWhy: 'three integers and a long'
  },
  testCases: [
    { input: { num: 16 }, expected: 'true' },
    { input: { num: 14 }, expected: 'false' },
    { input: { num: 1 }, expected: 'true' },
    { input: { num: 2147395600 }, expected: 'true' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.isPerfectSquare(16));
        System.out.println(s.isPerfectSquare(14));
        System.out.println(s.isPerfectSquare(1));
        // 46340 squared. Overflow in int makes this report false.
        System.out.println(s.isPerfectSquare(2147395600));
    }
}`,
  commonMistakes: [
    'Multiplying in `int`, which reports false for large genuine squares such as 2147395600.',
    'Calling `Math.sqrt` and checking the result is a whole number. Disallowed, and floating point makes it unreliable near the top of the range anyway.',
    'Starting `hi = num / 2`, which is a valid optimisation for `num >= 4` and wrong for `num = 1`.',
    'Looping `i` from 1 upwards squaring each value. O(sqrt(num)) is about 46,000 iterations, which passes here and is not the point.'
  ],
  followUps: [
    'The odd-number trick: subtract 1, 3, 5, 7, … and check whether you land exactly on zero. O(sqrt(n)) with no multiplication at all.',
    'Sum of Square Numbers uses two pointers over the same candidate space.'
  ]
},

{
  id: 'find-smallest-letter-greater-than-target',
  leetcodeNumber: 744,
  title: 'Find Smallest Letter Greater Than Target',
  url: 'https://leetcode.com/problems/find-smallest-letter-greater-than-target/',
  pattern: 'binary-search',
  difficulty: 'Easy',
  order: 6,
  tags: ['upper-bound', 'boundary', 'wraparound'],
  problemSummary: 'The array of letters is sorted and may contain duplicates. Return the smallest letter strictly greater than `target`. If none exists, wrap around and return the first letter.',
  examples: [
    { input: "letters = ['c','f','j'], target = 'a'", output: "'c'", note: 'c is the smallest letter above a.' },
    { input: "letters = ['c','f','j'], target = 'c'", output: "'f'", note: 'Strictly greater, so c itself does not count.' },
    { input: "letters = ['x','x','y','y'], target = 'z'", output: "'x'", note: 'Nothing is above z, so wrap to the first letter.' }
  ],
  constraints: ['2 <= letters.length <= 10^4', 'letters consists of lowercase English letters, sorted in non-decreasing order', 'letters contains at least two different characters', 'target is a lowercase English letter'],
  techniqueNote: 'upper_bound: the first index whose value is **strictly** greater than the target. The only change from lower_bound is `<=` instead of `<`.',
  signals: [
    '"Smallest thing strictly greater than x" is upper_bound, and it is one character different from lower_bound.',
    'Duplicates are allowed, which is exactly where the difference between the two bounds matters.',
    'The wraparound is not a binary-search problem at all, it is one modulo at the end.'
  ],
  intuition: {
    input: "letters = ['c','f','j'], target = 'c'",
    visual:
      "index    0    1    2   (3)\n" +
      "letter   c    f    j\n" +
      "\n" +
      "we want the first index whose letter is STRICTLY greater than 'c' -> index 1\n" +
      "\n" +
      "lo=0 hi=3  mid=1  'f' <= 'c'? no   -> answer is 1 or left.  hi = 1\n" +
      "lo=0 hi=1  mid=0  'c' <= 'c'? YES  -> answer is right.      lo = 1\n" +
      "lo == hi == 1  ->  letters[1] = 'f'\n" +
      "\n" +
      "if lo had ended at 3 (past the end), 3 % 3 = 0 wraps to letters[0]",
    steps: [
      { state: '', say: 'Same boundary loop as Search Insert Position, with one character changed. There the test was `nums[mid] < target`; here it is `letters[mid] <= target`.' },
      { state: '', say: 'That `<=` is what makes it STRICTLY greater. Any letter equal to the target is treated as "too small", so the boundary lands past all copies of it.' },
      { state: 'hi = 1', say: '`f` is above `c`, so index 1 might be the answer: `hi = mid`.' },
      { state: 'lo = 1', say: '`c` is not above `c`, so the answer is strictly right: `lo = mid + 1`.' },
      { state: 'lo = 1', say: 'The pointers meet at 1, and `letters[1]` is `f`.' },
      { state: '', say: 'The wraparound: if every letter is at or below the target, `lo` ends at `letters.length`, past the end. `letters[lo % letters.length]` turns that into index 0 with no special case.' }
    ],
    takeaway: 'lower_bound uses `<`, upper_bound uses `<=`. That one character is the whole difference, and with duplicates it decides whether you land before or after the run of equal values.'
  },
  hints: [
    'This is Search Insert Position with one word changed in the question. Which word, and what does it change in the comparison?',
    'Find the first index whose letter is strictly greater than the target, so treat equal letters as too small. If the boundary lands past the end, wrap with a modulo.',
    'Pseudo-code: `lo=0; hi=n; while lo < hi: mid = lo + (hi-lo)/2; if letters[mid] <= target: lo = mid+1 else hi = mid; return letters[lo % n]`'
  ],
  methodSignature: 'public char nextGreatestLetter(char[] letters, char target)',
  javaTemplate: 'binary-search',
  javaSolution: `class Solution {
    public char nextGreatestLetter(char[] letters, char target) {
        int lo = 0;
        int hi = letters.length;   // half-open, so "past the end" is representable

        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;

            // <= rather than < is what makes this STRICTLY greater. Letters equal
            // to the target count as too small, so the boundary lands past every
            // copy of them.
            if (letters[mid] <= target) {
                lo = mid + 1;
            } else {
                hi = mid;          // mid might be the answer
            }
        }

        // If nothing was greater, lo == letters.length and the modulo wraps to 0.
        return letters[lo % letters.length];
    }
}
`,
  complexity: {
    time: 'O(log n)', timeWhy: 'the range halves each iteration',
    space: 'O(1)', spaceWhy: 'three integers'
  },
  testCases: [
    { input: { letters: ['c', 'f', 'j'], target: 'a' }, expected: 'c' },
    { input: { letters: ['c', 'f', 'j'], target: 'c' }, expected: 'f' },
    { input: { letters: ['x', 'x', 'y', 'y'], target: 'z' }, expected: 'x' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.nextGreatestLetter(new char[]{'c', 'f', 'j'}, 'a'));
        System.out.println(s.nextGreatestLetter(new char[]{'c', 'f', 'j'}, 'c'));
        System.out.println(s.nextGreatestLetter(new char[]{'x', 'x', 'y', 'y'}, 'z'));
    }
}`,
  commonMistakes: [
    'Using `<` instead of `<=`, which returns the target itself when it is present.',
    'Indexing `letters[lo]` without the modulo, which throws when nothing is greater.',
    'Starting `hi = n - 1`, which makes the "past the end" state unrepresentable and breaks the wraparound.',
    'Special-casing the wraparound with an `if`. The modulo already does it.'
  ],
  followUps: [
    'The `TreeSet` methods `higher`, `ceiling`, `lower` and `floor` are these four bounds with names. Worth memorising which is which.',
    'Find First and Last Position of Element in Sorted Array is lower_bound and upper_bound side by side.'
  ]
},

{
  id: 'peak-index-in-mountain-array',
  leetcodeNumber: 852,
  title: 'Peak Index in a Mountain Array',
  url: 'https://leetcode.com/problems/peak-index-in-a-mountain-array/',
  pattern: 'binary-search',
  difficulty: 'Easy',
  order: 7,
  tags: ['boundary', 'unsorted-input', 'local-comparison'],
  problemSummary: 'The array strictly increases to a single peak and then strictly decreases. Return the index of the peak, in O(log n).',
  examples: [
    { input: 'arr = [0,1,0]', output: '1', note: 'The peak is 1 at index 1.' },
    { input: 'arr = [0,2,1,0]', output: '1', note: 'Peak value 2.' },
    { input: 'arr = [3,4,5,1]', output: '2', note: 'Peak value 5.' }
  ],
  constraints: ['3 <= arr.length <= 10^5', '0 <= arr[i] <= 10^6', 'arr is guaranteed to be a mountain array'],
  techniqueNote: 'binary search on an array that is **not sorted**. What matters is that comparing `arr[mid]` with its neighbour tells you which side the peak is on.',
  signals: [
    'The input is not sorted, and it still has a monotone structure: "am I still climbing" is true then false, exactly once.',
    'O(log n) is required, so the linear scan is off the table.',
    'The test compares `mid` with `mid + 1` rather than with a target. That is the shape of every peak-finding binary search.'
  ],
  intuition: {
    input: 'arr = [3,4,5,1]',
    visual:
      'index   0  1  2  3\n' +
      'value   3  4  5  1\n' +
      '\n' +
      'still climbing?  arr[i] < arr[i+1]\n' +
      'i=0  3 < 4  T\n' +
      'i=1  4 < 5  T\n' +
      'i=2  5 < 1  F      <- flips exactly once, and the peak is the first F\n' +
      '\n' +
      'lo=0 hi=3  mid=1  arr[1] < arr[2]  climbing  -> peak is right.  lo = 2\n' +
      'lo=2 hi=3  mid=2  arr[2] < arr[3]? 5 < 1 no  -> peak is 2 or left. hi = 2\n' +
      'lo == hi == 2',
    steps: [
      { state: '', say: 'Sortedness was never the requirement. The requirement is a question whose answer flips exactly once, and here it is "is the array still going up at this index".' },
      { state: 'mid=1, climbing', say: '`arr[mid] < arr[mid + 1]` means you are on the way up, so the peak is strictly to the right: `lo = mid + 1`.' },
      { state: 'mid=2, descending', say: 'Otherwise you are at or past the peak, so `mid` might BE the peak: `hi = mid`.' },
      { state: 'lo == hi', say: 'Boundary idiom, so the pointers converge on the answer and you return `lo`.' },
      { state: '', say: 'Why `mid + 1` is always safe: the loop only runs while `lo < hi`, so `mid` is at most `hi - 1` and `mid + 1` is at most `hi`, which is in bounds. Starting `hi` at `n - 1` matters for that.' }
    ],
    takeaway: 'Binary search needs a monotone predicate, not a sorted array. Comparing an element with its neighbour is often the predicate you are looking for.'
  },
  hints: [
    'The array is not sorted, so you cannot compare against a target. What could you compare `arr[mid]` against that tells you which half the peak is in?',
    'Compare `arr[mid]` with `arr[mid + 1]`. If it is smaller you are still climbing, so the peak is to the right. Otherwise `mid` could be the peak.',
    'Pseudo-code: `lo=0; hi=n-1; while lo < hi: mid = lo + (hi-lo)/2; if arr[mid] < arr[mid+1]: lo = mid+1 else hi = mid; return lo`'
  ],
  methodSignature: 'public int peakIndexInMountainArray(int[] arr)',
  javaTemplate: 'binary-search',
  javaSolution: `class Solution {
    public int peakIndexInMountainArray(int[] arr) {
        int lo = 0;
        int hi = arr.length - 1;

        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;

            // The loop only runs while lo < hi, so mid <= hi - 1 and mid + 1 is
            // always a valid index. That is why hi starts at n - 1 here.
            if (arr[mid] < arr[mid + 1]) {
                lo = mid + 1;    // still climbing, so the peak is to the right
            } else {
                hi = mid;        // descending, so mid might BE the peak
            }
        }

        return lo;
    }
}
`,
  complexity: {
    time: 'O(log n)', timeWhy: 'the range halves each iteration',
    space: 'O(1)', spaceWhy: 'three integers'
  },
  testCases: [
    { input: { arr: [0, 1, 0] }, expected: '1' },
    { input: { arr: [0, 2, 1, 0] }, expected: '1' },
    { input: { arr: [3, 4, 5, 1] }, expected: '2' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.peakIndexInMountainArray(new int[]{0, 1, 0}));
        System.out.println(s.peakIndexInMountainArray(new int[]{0, 2, 1, 0}));
        System.out.println(s.peakIndexInMountainArray(new int[]{3, 4, 5, 1}));
    }
}`,
  commonMistakes: [
    'Starting `hi = arr.length`, which makes `arr[mid + 1]` read past the end.',
    'Using the `lo <= hi` idiom here. Without a target there is nothing to return early on, and the boundary form is the right fit.',
    'Comparing against `arr[mid - 1]` as well, which is unnecessary and introduces a bounds check at `mid == 0`.',
    'Scanning linearly for the maximum. Correct, O(n), and it does not satisfy the stated requirement.'
  ],
  followUps: [
    'Find Peak Element drops the guarantee of a single peak and the exact same code still works, which is worth thinking about.',
    'Find in Mountain Array combines this with two ordinary binary searches on the two slopes.'
  ]
},

{
  id: 'kth-missing-positive-number',
  leetcodeNumber: 1539,
  title: 'Kth Missing Positive Number',
  url: 'https://leetcode.com/problems/kth-missing-positive-number/',
  pattern: 'binary-search',
  difficulty: 'Easy',
  order: 8,
  tags: ['boundary', 'derived-predicate', 'counting'],
  problemSummary: 'The array is strictly increasing and contains positive integers. Considering the positive integers that are absent from it, return the `k`-th smallest such number.',
  examples: [
    { input: 'arr = [2,3,4,7,11], k = 5', output: '9', note: 'The missing numbers are 1,5,6,8,9,10,… and the fifth is 9.' },
    { input: 'arr = [1,2,3,4], k = 2', output: '6', note: 'Nothing below 5 is missing, so the missing list is 5,6,7,… and the second is 6.' }
  ],
  constraints: ['1 <= arr.length <= 1000', '1 <= arr[i] <= 1000', '1 <= k <= 1000', 'arr is sorted in strictly increasing order'],
  techniqueNote: 'binary search on a **derived** quantity. Nothing in the array is what you are searching for, so you compute the thing that is monotone: how many numbers are missing before each index.',
  signals: [
    'The answer is not in the array at all, so a plain search cannot work.',
    'You can compute a monotone function of the index: "missing numbers before index i" never decreases as `i` grows. Binary search that.',
    'This is the problem that teaches you to look for a monotone quantity rather than a monotone array.'
  ],
  intuition: {
    input: 'arr = [2,3,4,7,11], k = 5',
    visual:
      'index        0   1   2   3   4\n' +
      'arr          2   3   4   7  11\n' +
      'if nothing were missing, arr[i] would be i+1:\n' +
      'expected     1   2   3   4   5\n' +
      'missing so far = arr[i] - (i+1):\n' +
      'missing      1   1   1   3   6\n' +
      '                             ^ first index with missing >= k = 5\n' +
      '\n' +
      'the boundary lands at index 4, so 4 real numbers sit below the answer,\n' +
      'and the answer is 4 + k = 9',
    steps: [
      { state: '', say: 'Start with the key formula. If no positive integers were missing, `arr[i]` would equal `i + 1`. So the count of missing numbers below `arr[i]` is exactly `arr[i] - (i + 1)`.' },
      { state: 'missing = [1,1,1,3,6]', say: 'That count never decreases as `i` grows, because the array is strictly increasing. Monotone, so binary-searchable.' },
      { state: '', say: 'Find the first index where the missing count reaches `k`. That is the standard boundary loop, with the predicate computed rather than read.' },
      { state: 'lo = 4', say: 'Here the boundary is index 4. Everything before it, four real numbers, sits below the answer.' },
      { state: 'answer = lo + k', say: 'So the answer is `lo + k`. Reason it through: `lo` real numbers are below the answer, and the answer is the `k`-th missing one, so it is the `(lo + k)`-th positive integer.' },
      { state: '', say: 'Check it against example two: nothing is ever missing, so the boundary runs off the end to `lo = 4`, and `4 + 2 = 6`. Correct.' }
    ],
    takeaway: 'When the answer is not in the input, look for a monotone quantity you can compute from the input. `arr[i] - (i + 1)` is that quantity here.'
  },
  hints: [
    'If no numbers were missing at all, what would `arr[i]` be? What does the gap between that and the real `arr[i]` tell you?',
    'The count of missing numbers before index `i` is `arr[i] - (i + 1)`, and it never decreases. Binary search for the first index where it reaches `k`, then work out the answer from that index.',
    'Pseudo-code: `lo=0; hi=n; while lo < hi: mid = lo + (hi-lo)/2; if arr[mid] - (mid+1) < k: lo = mid+1 else hi = mid; return lo + k`'
  ],
  methodSignature: 'public int findKthPositive(int[] arr, int k)',
  javaTemplate: 'binary-search',
  javaSolution: `class Solution {
    public int findKthPositive(int[] arr, int k) {
        int lo = 0;
        int hi = arr.length;   // half-open: the boundary may run past the end

        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;

            // With nothing missing, arr[mid] would be mid + 1. The shortfall IS
            // the count of positive integers missing below arr[mid], and it never
            // decreases as mid grows.
            int missingBefore = arr[mid] - (mid + 1);

            if (missingBefore < k) {
                lo = mid + 1;   // not enough missing yet, look further right
            } else {
                hi = mid;       // mid might be the first index that reaches k
            }
        }

        // lo real numbers sit below the answer, and the answer is the k-th
        // missing one, so it is the (lo + k)-th positive integer.
        return lo + k;
    }
}
`,
  complexity: {
    time: 'O(log n)', timeWhy: 'one boundary search over the indexes; the predicate is computed in O(1)',
    space: 'O(1)', spaceWhy: 'three integers'
  },
  testCases: [
    { input: { arr: [2, 3, 4, 7, 11], k: 5 }, expected: '9' },
    { input: { arr: [1, 2, 3, 4], k: 2 }, expected: '6' },
    { input: { arr: [2], k: 1 }, expected: '1' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.findKthPositive(new int[]{2, 3, 4, 7, 11}, 5));
        System.out.println(s.findKthPositive(new int[]{1, 2, 3, 4}, 2));
        System.out.println(s.findKthPositive(new int[]{2}, 1));
    }
}`,
  commonMistakes: [
    'Getting the formula wrong as `arr[i] - i`. It is `arr[i] - (i + 1)`, because indexes are 0-based and positive integers start at 1.',
    'Starting `hi = n - 1`, which cannot express "the boundary is past the end" and breaks the case where nothing is missing.',
    'Returning `arr[lo] - something` instead of `lo + k`. The answer is not in the array, so it must be derived from the count.',
    'Walking the missing numbers one at a time. It is O(n + k), it passes at these constraints, and it misses the transferable idea.'
  ],
  followUps: [
    'Missing Number in Arrays & Hashing is the dense version of this, where a set or a sum formula is enough.',
    'The same "binary search a derived monotone count" trick solves Kth Smallest Element in a Sorted Matrix.'
  ]
},

{
  id: 'find-minimum-in-rotated-sorted-array',
  leetcodeNumber: 153,
  title: 'Find Minimum in Rotated Sorted Array',
  url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
  pattern: 'binary-search',
  difficulty: 'Medium',
  order: 9,
  tags: ['rotation', 'boundary'],
  problemSummary: 'A sorted array of distinct values was rotated some number of times. Find the smallest element in O(log n).',
  examples: [
    { input: 'nums = [3,4,5,1,2]', output: '1', note: 'Originally [1,2,3,4,5], rotated three times.' },
    { input: 'nums = [4,5,6,7,0,1,2]', output: '0', note: 'The rotation point is where the minimum lives.' },
    { input: 'nums = [11,13,15,17]', output: '11', note: 'Not rotated at all, so the minimum is at index 0.' }
  ],
  constraints: ['n == nums.length', '1 <= n <= 5000', '-5000 <= nums[i] <= 5000', 'All values are unique and the array is a rotation of a sorted array'],
  techniqueNote: 'compare `mid` against the RIGHT end, not against a target. That one comparison tells you which side of the rotation point you are on.',
  signals: [
    '**Rotated sorted array**. The array is not globally sorted and it is still binary-searchable, because one half is always properly sorted.',
    'You are looking for the rotation point, and the minimum is exactly the rotation point.',
    'There is no target to compare against, so you compare against an endpoint instead.'
  ],
  intuition: {
    input: 'nums = [4,5,6,7,0,1,2]',
    visual:
      'index   0  1  2  3  4  5  6\n' +
      'value   4  5  6  7  0  1  2\n' +
      '                    ^ minimum, and also the rotation point\n' +
      '\n' +
      'compare mid against the RIGHT END, nums[hi]:\n' +
      '\n' +
      'lo=0 hi=6  mid=3  7 > 2  -> mid is in the HIGH part, minimum is right. lo = 4\n' +
      'lo=4 hi=6  mid=5  1 < 2  -> mid is in the LOW part, minimum is 5 or left. hi = 5\n' +
      'lo=4 hi=5  mid=4  0 < 2  -> low part again. hi = 4\n' +
      'lo == hi == 4  ->  nums[4] = 0',
    steps: [
      { state: '', say: 'Picture the array as two sorted runs: a high run then a low run. The minimum is the first element of the low run.' },
      { state: 'mid=3, 7 > 2', say: 'Compare `nums[mid]` with `nums[hi]`. If `nums[mid] > nums[hi]`, then `mid` is in the HIGH run, so the minimum must be strictly to its right: `lo = mid + 1`.' },
      { state: 'mid=5, 1 < 2', say: 'If `nums[mid] < nums[hi]`, then `mid` is already in the low run, so the minimum is at `mid` or to its left: `hi = mid`.' },
      { state: 'lo == hi', say: 'The boundary form converges on the minimum. Return `nums[lo]`.' },
      { state: '', say: 'Why compare against `nums[hi]` and not `nums[lo]`? With `nums[lo]` the un-rotated case `[11,13,15,17]` is ambiguous: `nums[mid] >= nums[lo]` holds, and you cannot tell whether you are in the high run or in a fully sorted array. Comparing against the right end has no such blind spot.' }
    ],
    takeaway: 'When there is no target, compare against an endpoint. Which endpoint you choose is not arbitrary: `nums[hi]` avoids the ambiguity that `nums[lo]` has on an un-rotated array.'
  },
  hints: [
    'Draw a rotated array as two sorted runs. Where does the minimum sit relative to those runs?',
    'There is no target, so compare `nums[mid]` with `nums[hi]`. Bigger means you are in the high run and the answer is to the right. Smaller means you are in the low run and `mid` may be the answer.',
    'Pseudo-code: `lo=0; hi=n-1; while lo < hi: mid = lo + (hi-lo)/2; if nums[mid] > nums[hi]: lo = mid+1 else hi = mid; return nums[lo]`'
  ],
  methodSignature: 'public int findMin(int[] nums)',
  javaTemplate: 'binary-search',
  javaSolution: `class Solution {
    public int findMin(int[] nums) {
        int lo = 0;
        int hi = nums.length - 1;

        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;

            // Compare against the RIGHT end, deliberately. Comparing against
            // nums[lo] cannot distinguish "in the high run" from "not rotated
            // at all", and this comparison has no such blind spot.
            if (nums[mid] > nums[hi]) {
                lo = mid + 1;   // mid is in the high run, minimum is to the right
            } else {
                hi = mid;       // mid is in the low run, so it may BE the minimum
            }
        }

        return nums[lo];
    }
}
`,
  complexity: {
    time: 'O(log n)', timeWhy: 'the range halves each iteration',
    space: 'O(1)', spaceWhy: 'three integers'
  },
  testCases: [
    { input: { nums: [3, 4, 5, 1, 2] }, expected: '1' },
    { input: { nums: [4, 5, 6, 7, 0, 1, 2] }, expected: '0' },
    { input: { nums: [11, 13, 15, 17] }, expected: '11' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.findMin(new int[]{3, 4, 5, 1, 2}));
        System.out.println(s.findMin(new int[]{4, 5, 6, 7, 0, 1, 2}));
        System.out.println(s.findMin(new int[]{11, 13, 15, 17}));
    }
}`,
  commonMistakes: [
    'Comparing against `nums[lo]`, which is ambiguous on the un-rotated array `[11,13,15,17]`.',
    'Using `hi = mid - 1`, which can discard the minimum when `mid` IS the minimum.',
    'Using the `lo <= hi` idiom with no early return, so the loop has nothing to converge on.',
    'Scanning linearly. O(n) is correct and not what was asked.'
  ],
  followUps: [
    'With duplicates allowed (LeetCode 154) the worst case degrades to O(n), because `[1,1,1,0,1]` gives no information at `mid`.',
    'Search in Rotated Sorted Array (next) can be solved as "find the rotation point with this, then binary search the right run".'
  ]
},

{
  id: 'search-in-rotated-sorted-array',
  leetcodeNumber: 33,
  title: 'Search in Rotated Sorted Array',
  url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
  pattern: 'binary-search',
  difficulty: 'Medium',
  order: 10,
  tags: ['rotation', 'exact-match', 'case-analysis'],
  problemSummary: 'A sorted array of distinct values was rotated. Return the index of `target`, or -1. O(log n) required.',
  examples: [
    { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4', note: 'Found at index 4.' },
    { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1', note: 'Not present.' },
    { input: 'nums = [1], target = 0', output: '-1', note: 'Single element, not a match.' }
  ],
  constraints: ['1 <= nums.length <= 5000', '-10^4 <= nums[i] <= 10^4', 'All values are unique', 'nums is a rotation of a sorted array', '-10^4 <= target <= 10^4'],
  techniqueNote: 'the key fact: after splitting at `mid`, **at least one half is always properly sorted**. Identify which, and you can decide in O(1) whether the target lives there.',
  signals: [
    'Rotated sorted array plus a target. The two halves are the whole trick.',
    'The array is not globally sorted, so you cannot compare with the target directly and know which way to go.',
    'One half is always ordered. In that half a simple range check answers "is the target in here"; in the other half you recurse.'
  ],
  intuition: {
    input: 'nums = [4,5,6,7,0,1,2], target = 0',
    visual:
      'index   0  1  2  3  4  5  6\n' +
      'value   4  5  6  7  0  1  2\n' +
      '\n' +
      'lo=0 hi=6  mid=3 (7)\n' +
      '  is the LEFT half sorted?  nums[0]=4 <= nums[3]=7  yes, [4,5,6,7]\n' +
      '  is target 0 inside [4, 7)?  no  ->  it must be in the right half. lo = 4\n' +
      '\n' +
      'lo=4 hi=6  mid=5 (1)\n' +
      '  is the left half sorted?  nums[4]=0 <= nums[5]=1  yes, [0,1]\n' +
      '  is target 0 inside [0, 1)?  YES  ->  search left. hi = 4\n' +
      '\n' +
      'lo=4 hi=4  mid=4  nums[4] == 0  FOUND',
    steps: [
      { state: '', say: 'The insight to hold onto: cut anywhere and at least one of the two halves is a properly sorted run. A rotation only has one break point, so it cannot land in both halves.' },
      { state: 'mid=3', say: 'Test which half is sorted with `nums[lo] <= nums[mid]`. If that holds, the left half is clean.' },
      { state: '', say: 'In the clean half you can decide membership with a plain range check: `target >= nums[lo] && target < nums[mid]`. If yes, search there; if no, the target can only be in the messy half.' },
      { state: 'lo = 4', say: 'Here `0` is not in `[4, 7)`, so discard the whole left half in one step.' },
      { state: 'hi = 4', say: 'Repeat. Each iteration still halves the range, so it is O(log n) despite the case analysis.' },
      { state: 'found at 4', say: 'The equality check at the top of the loop catches the hit. This is the exact-match idiom, so it returns from inside the loop.' },
      { state: '', say: 'The bounds matter: `target < nums[mid]` uses strict less-than because `nums[mid]` was already tested for equality, and `target <= nums[hi]` in the mirror case is inclusive for the same reason.' }
    ],
    takeaway: 'One property does all the work: at least one half is always sorted. Test which, use a range check there, and recurse into the other half otherwise.'
  },
  hints: [
    'A rotated sorted array has exactly one place where the order breaks. If you cut the array in half, how many of the halves can contain that break?',
    'Find which half is sorted with `nums[lo] <= nums[mid]`. In the sorted half, a range check tells you whether the target is inside. If it is not, the target must be in the other half.',
    'Pseudo-code: `while lo <= hi: mid = ...; if nums[mid] == target return mid; if nums[lo] <= nums[mid]: if target >= nums[lo] and target < nums[mid]: hi = mid-1 else lo = mid+1; else: if target > nums[mid] and target <= nums[hi]: lo = mid+1 else hi = mid-1`'
  ],
  methodSignature: 'public int search(int[] nums, int target)',
  javaTemplate: 'binary-search',
  javaSolution: `class Solution {
    public int search(int[] nums, int target) {
        int lo = 0;
        int hi = nums.length - 1;

        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;

            if (nums[mid] == target) {
                return mid;
            }

            // A rotation has one break point, so it cannot be in both halves.
            // At least one of them is therefore a properly sorted run.
            if (nums[lo] <= nums[mid]) {
                // Left half [lo, mid] is sorted, so a range check settles it.
                // Strict < on nums[mid] because equality was handled above.
                if (target >= nums[lo] && target < nums[mid]) {
                    hi = mid - 1;
                } else {
                    lo = mid + 1;
                }
            } else {
                // Right half [mid, hi] is the sorted one.
                if (target > nums[mid] && target <= nums[hi]) {
                    lo = mid + 1;
                } else {
                    hi = mid - 1;
                }
            }
        }

        return -1;
    }
}
`,
  complexity: {
    time: 'O(log n)', timeWhy: 'every iteration discards half the range; the case analysis is O(1)',
    space: 'O(1)', spaceWhy: 'three integers'
  },
  testCases: [
    { input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 0 }, expected: '4' },
    { input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 3 }, expected: '-1' },
    { input: { nums: [1], target: 0 }, expected: '-1' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.search(new int[]{4, 5, 6, 7, 0, 1, 2}, 0));
        System.out.println(s.search(new int[]{4, 5, 6, 7, 0, 1, 2}, 3));
        System.out.println(s.search(new int[]{1}, 0));
    }
}`,
  commonMistakes: [
    'Using `nums[lo] < nums[mid]` instead of `<=`. When `lo == mid`, which happens for a two-element range, the strict version takes the wrong branch.',
    'Getting the range-check bounds inclusive on the wrong side, which either misses `nums[lo]` or re-tests `nums[mid]`.',
    'Comparing the target with `nums[mid]` and moving as if the array were sorted. That fails the moment the target and mid straddle the rotation.',
    'Finding the rotation point first and then searching. That is correct and needs two loops, and this version needs one.'
  ],
  followUps: [
    'The two-pass alternative: find the minimum with the previous problem, then binary search the appropriate run. Easier to reason about, more code.',
    'Search in Rotated Sorted Array II allows duplicates, which forces an O(n) worst case.'
  ]
},

{
  id: 'koko-eating-bananas',
  leetcodeNumber: 875,
  title: 'Koko Eating Bananas',
  url: 'https://leetcode.com/problems/koko-eating-bananas/',
  pattern: 'binary-search',
  difficulty: 'Medium',
  order: 11,
  tags: ['search-the-answer', 'feasibility', 'ceiling-division'],
  problemSummary: 'There are piles of bananas and `h` hours available. Each hour you pick one pile and eat up to `speed` bananas from it; if the pile has fewer left, you finish it and the hour is still used up. Find the smallest `speed` that clears every pile within `h` hours.',
  examples: [
    { input: 'piles = [3,6,7,11], h = 8', output: '4', note: 'At speed 4 the hours are 1+2+2+3 = 8, which just fits.' },
    { input: 'piles = [30,11,23,4,20], h = 5', output: '30', note: 'Five piles and five hours, so each pile must be finished in one hour.' },
    { input: 'piles = [30,11,23,4,20], h = 6', output: '23', note: 'One spare hour allows a slower speed.' }
  ],
  constraints: ['1 <= piles.length <= 10^4', 'piles.length <= h <= 10^9', '1 <= piles[i] <= 10^9'],
  techniqueNote: 'the full **binary search on the answer**. You write your own feasibility test, and the fact that it is monotone in `speed` is what licenses the search.',
  signals: [
    '**Minimum value such that a condition holds.** That phrasing is binary-search-the-answer, essentially always.',
    'The condition is monotone: if a speed is fast enough, every faster speed is too. That is the licence, and it is worth stating explicitly before you code.',
    'The answer range is huge (up to 10^9) and there is no array of candidates to scan.'
  ],
  intuition: {
    input: 'piles = [3,6,7,11], h = 8',
    visual:
      'hours needed at a given speed = sum of ceil(pile / speed)\n' +
      '\n' +
      'speed   1   2   3   4   5   6  ...  11\n' +
      'hours  27  15  10   8   7   6        4\n' +
      'fits 8? N   N   N   Y   Y   Y        Y\n' +
      '                    ^ smallest yes, so the answer is 4\n' +
      '\n' +
      'the feasible column is N...N Y...Y, which is exactly the monotone\n' +
      'predicate binary search requires\n' +
      '\n' +
      'lo=1 hi=11  mid=6   hours 6 <= 8  feasible -> hi = 6\n' +
      'lo=1 hi=6   mid=3   hours 10 > 8  no       -> lo = 4\n' +
      'lo=4 hi=6   mid=5   hours 7 <= 8  feasible -> hi = 5\n' +
      'lo=4 hi=5   mid=4   hours 8 <= 8  feasible -> hi = 4\n' +
      'lo == hi == 4',
    steps: [
      { state: '', say: 'First, the search space. Speed 1 is the slowest that makes any progress, and the largest pile is the fastest speed worth considering, since going faster cannot save an hour on the biggest pile. So the answer is in `[1, max(piles)]`.' },
      { state: '', say: 'Second, the feasibility test. At a given speed, each pile takes `ceil(pile / speed)` hours, because a partial pile still costs a whole hour. Sum those and compare with `h`.' },
      { state: '', say: 'Third, and this is the step people skip: check the predicate is monotone. If speed `s` works, then `s + 1` finishes each pile in no more hours, so it also works. Feasible speeds form a suffix, which is exactly what binary search needs.' },
      { state: 'mid=6, feasible', say: 'Now it is just the boundary loop. Feasible means `mid` might be the smallest such speed, so `hi = mid`.' },
      { state: 'lo=4', say: 'Infeasible means the answer is strictly faster, so `lo = mid + 1`.' },
      { state: 'answer 4', say: 'The pointers converge on the smallest feasible speed.' },
      { state: '', say: 'Ceiling division without floating point: `(pile + speed - 1) / speed`. Using `Math.ceil` with doubles invites precision bugs at 10^9.' }
    ],
    takeaway: 'Three steps every time: name the answer range, write `feasible(x)`, then check it is monotone. The binary search itself is the boilerplate you already know.'
  },
  hints: [
    'You cannot search the piles, because the answer is not a pile. What IS the answer, and what is the smallest and largest it could possibly be?',
    'Write `hoursNeeded(speed)` as the sum of `ceil(pile / speed)`. Convince yourself that a faster speed never needs more hours. Then binary search the smallest speed whose hours fit in `h`.',
    'Pseudo-code: `lo=1; hi=max(piles); while lo < hi: mid=...; if hoursNeeded(mid) <= h: hi = mid else lo = mid+1; return lo`'
  ],
  methodSignature: 'public int minEatingSpeed(int[] piles, int h)',
  javaTemplate: 'binary-search',
  javaSolution: `class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        // Speed 1 is the slowest that makes progress. Going faster than the
        // largest pile cannot save an hour, so that is the useful upper bound.
        int lo = 1;
        int hi = 0;
        for (int p : piles) {
            hi = Math.max(hi, p);
        }

        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;

            if (hoursNeeded(piles, mid) <= h) {
                hi = mid;        // fast enough, so mid might be the smallest
            } else {
                lo = mid + 1;    // too slow
            }
        }

        return lo;
    }

    /**
     * A partial pile still costs a whole hour, so each pile takes
     * ceil(pile / speed). Monotone: a larger speed never needs more hours,
     * which is what makes the binary search above valid.
     */
    private long hoursNeeded(int[] piles, int speed) {
        long hours = 0;
        for (int p : piles) {
            // Integer ceiling division. Math.ceil with doubles risks precision
            // trouble at these magnitudes.
            hours += (p + speed - 1) / speed;
        }
        return hours;   // long: 10^4 piles of 10^9 at speed 1 overflows an int
    }
}
`,
  complexity: {
    time: 'O(n log m)', timeWhy: 'n piles summed per feasibility check, times log(max pile) checks',
    space: 'O(1)', spaceWhy: 'a few numbers'
  },
  testCases: [
    { input: { piles: [3, 6, 7, 11], h: 8 }, expected: '4' },
    { input: { piles: [30, 11, 23, 4, 20], h: 5 }, expected: '30' },
    { input: { piles: [30, 11, 23, 4, 20], h: 6 }, expected: '23' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.minEatingSpeed(new int[]{3, 6, 7, 11}, 8));
        System.out.println(s.minEatingSpeed(new int[]{30, 11, 23, 4, 20}, 5));
        System.out.println(s.minEatingSpeed(new int[]{30, 11, 23, 4, 20}, 6));
    }
}`,
  commonMistakes: [
    'Using floor division for the hours, `pile / speed`, which under-counts every partial pile.',
    'Summing hours in an `int`. With 10^4 piles of 10^9 at speed 1 the total exceeds `Integer.MAX_VALUE`.',
    'Starting `lo = 0`, which divides by zero.',
    'Using `Math.ceil((double) pile / speed)`. It usually works and it is a precision risk you do not need to take.',
    'Not checking monotonicity before searching. If the predicate is not monotone, binary search is silently wrong rather than slow.'
  ],
  followUps: [
    'Capacity To Ship Packages Within D Days, Split Array Largest Sum and Minimum Number of Days to Make m Bouquets are the same three steps with a different `feasible`.',
    'The hardest part is always deciding what to binary search over. Practise stating the answer range out loud before writing anything.'
  ]
},

{
  id: 'median-of-two-sorted-arrays',
  leetcodeNumber: 4,
  title: 'Median of Two Sorted Arrays',
  url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
  pattern: 'binary-search',
  difficulty: 'Hard',
  order: 12,
  tags: ['partition', 'two-arrays', 'sentinels'],
  problemSummary: 'Two sorted arrays are given. Return the median of the combined collection, without actually merging them. The required complexity is O(log(m+n)).',
  examples: [
    { input: 'nums1 = [1,3], nums2 = [2]', output: '2.0', note: 'Combined [1,2,3], odd length, so the median is the middle value.' },
    { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.5', note: 'Combined [1,2,3,4], even length, so the median is the average of the two middle values.' }
  ],
  constraints: ['nums1.length == m, nums2.length == n', '0 <= m, n <= 1000', '1 <= m + n <= 2000', '-10^6 <= nums1[i], nums2[i] <= 10^6'],
  techniqueNote: 'binary search on the **partition point**, not on a value. You are choosing how many elements to take from the first array; everything else follows.',
  signals: [
    'O(log(m+n)) is demanded on two sorted inputs, which rules out merging them (that is O(m+n)).',
    'A median is defined purely by a SPLIT: half the values below, half above. So search for the split rather than for a value.',
    'One binary search over the shorter array is enough, because the count taken from the other array is then forced.'
  ],
  intuition: {
    input: 'nums1 = [1,3], nums2 = [2]',
    visual:
      'a median splits the combined data into a left half and a right half of\n' +
      'equal size, where every left value <= every right value\n' +
      '\n' +
      'take k1 from nums1 and k2 from nums2 into the left half, with\n' +
      'k1 + k2 = (m + n + 1) / 2 = 2\n' +
      '\n' +
      'try k1 = 1, so k2 = 1:\n' +
      '  nums1:  1 | 3        left1 = 1   right1 = 3\n' +
      '  nums2:  2 |          left2 = 2   right2 = +inf\n' +
      '  left1 <= right2?  1 <= inf  yes\n' +
      '  left2 <= right1?  2 <= 3    yes    ->  a valid split\n' +
      '\n' +
      'combined length 3 is odd, so the median is max(left1, left2) = 2',
    steps: [
      { state: '', say: 'Reframe the question. A median is not really a value you search for, it is a SPLIT: cut the combined data so both sides are the same size and everything on the left is at most everything on the right.' },
      { state: '', say: 'Say you take `k1` elements from `nums1` into the left half. Then `k2` is forced: `k1 + k2 = (m + n + 1) / 2`. So there is only one unknown, and it lives in `[0, m]`. Binary search it.' },
      { state: 'k1 = 1, k2 = 1', say: 'For a candidate split, look at four values: the last taken from each array (`left1`, `left2`) and the first not taken (`right1`, `right2`).' },
      { state: '', say: 'The split is valid when `left1 <= right2` and `left2 <= right1`. Those two conditions together say every left value is at most every right value.' },
      { state: '', say: 'If `left1 > right2`, you took too much from `nums1`, so search lower. If `left2 > right1`, you took too little, so search higher. That is the binary search.' },
      { state: 'median = 2', say: 'Once valid: for an odd total the median is `max(left1, left2)`, the largest value on the left. For an even total it is the average of `max(left1, left2)` and `min(right1, right2)`.' },
      { state: '', say: 'Two devices make the code short. First, always binary search the SHORTER array, so `k2` can never fall outside its own array. Second, use `Integer.MIN_VALUE` and `MAX_VALUE` as sentinels when a side is empty, which removes every boundary `if`.' }
    ],
    takeaway: 'Search the partition, not the value. The sentinels are not a cosmetic trick: they replace four edge cases that are where this problem is normally got wrong.'
  },
  hints: [
    'Merging is O(m+n) and you are asked for O(log(m+n)). What does a median actually tell you about how the combined data is divided?',
    'Decide how many elements to take from `nums1` into the left half. That forces how many come from `nums2`. Binary search that count over the SHORTER array, and check the split with the two boundary values on each side.',
    'Pseudo-code: `ensure m <= n; half = (m+n+1)/2; lo=0; hi=m; loop: k1 = mid; k2 = half-k1; left1/right1/left2/right2 with ±infinity sentinels; if left1 > right2: hi = k1-1 elif left2 > right1: lo = k1+1 else: odd ? max(left1,left2) : (max(left1,left2)+min(right1,right2))/2.0`'
  ],
  methodSignature: 'public double findMedianSortedArrays(int[] nums1, int[] nums2)',
  javaTemplate: 'binary-search',
  javaSolution: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Always search the SHORTER array. That guarantees the count taken from
        // the longer one stays inside its own bounds, which removes a whole class
        // of edge case.
        if (nums1.length > nums2.length) {
            return findMedianSortedArrays(nums2, nums1);
        }

        int m = nums1.length;
        int n = nums2.length;

        // Size of the left half. The +1 makes the left half the bigger one when
        // the total is odd, so the median is simply its largest value.
        int half = (m + n + 1) / 2;

        int lo = 0;
        int hi = m;

        while (lo <= hi) {
            int take1 = lo + (hi - lo) / 2;   // from nums1 into the left half
            int take2 = half - take1;          // forced

            // The four values around the cut. Sentinels stand in for "nothing
            // there", which removes four boundary checks.
            int left1  = (take1 == 0) ? Integer.MIN_VALUE : nums1[take1 - 1];
            int right1 = (take1 == m) ? Integer.MAX_VALUE : nums1[take1];
            int left2  = (take2 == 0) ? Integer.MIN_VALUE : nums2[take2 - 1];
            int right2 = (take2 == n) ? Integer.MAX_VALUE : nums2[take2];

            if (left1 > right2) {
                hi = take1 - 1;        // took too many from nums1
            } else if (left2 > right1) {
                lo = take1 + 1;        // took too few from nums1
            } else {
                // Valid split: everything on the left is <= everything on the right.
                if ((m + n) % 2 == 1) {
                    return Math.max(left1, left2);
                }
                return (Math.max(left1, left2) + Math.min(right1, right2)) / 2.0;
            }
        }

        return 0.0;   // unreachable for valid input
    }
}
`,
  complexity: {
    time: 'O(log(min(m, n)))', timeWhy: 'one binary search over the shorter array, with O(1) work per step. Better than the required O(log(m+n)).',
    space: 'O(1)', spaceWhy: 'a handful of integers. Note the recursive swap at the top recurses at most once.'
  },
  testCases: [
    { input: { nums1: [1, 3], nums2: [2] }, expected: '2.0' },
    { input: { nums1: [1, 2], nums2: [3, 4] }, expected: '2.5' },
    { input: { nums1: [], nums2: [1] }, expected: '1.0' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.findMedianSortedArrays(new int[]{1, 3}, new int[]{2}));
        System.out.println(s.findMedianSortedArrays(new int[]{1, 2}, new int[]{3, 4}));
        System.out.println(s.findMedianSortedArrays(new int[]{}, new int[]{1}));
    }
}`,
  commonMistakes: [
    'Not swapping so that `nums1` is the shorter array. Then `take2` can fall outside `nums2` and the indexing throws.',
    'Using `(m + n) / 2` for `half` instead of `(m + n + 1) / 2`. Without the `+1` the odd case no longer reads off the left half.',
    'Writing the boundary checks as `if` statements instead of sentinels. It is possible and it is roughly four extra branches, all of which are easy to get wrong.',
    'Dividing by `2` instead of `2.0`, which does integer division and drops the `.5`.',
    'Merging the arrays. That is O(m+n) and, at these constraints, it passes. It also does not answer the question that was asked.'
  ],
  followUps: [
    'Kth Smallest Element in Two Sorted Arrays is the general form; the median is `k = (m+n)/2`.',
    'Median of a stream needs two heaps instead, which is in the Heap pattern.',
    'Write the O(m+n) merge version first if the partition argument does not land. Getting a correct answer and then optimising is a legitimate route.'
  ]
}

);
