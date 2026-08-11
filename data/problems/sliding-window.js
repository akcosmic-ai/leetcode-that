/* data/problems/sliding-window.js
 *
 * Problems for the "sliding-window" pattern. Schema: data/problems/_SCHEMA.md
 *
 * Target mix: 4 Easy, 5 Medium, 2 Hard.
 * NOTE the deviation from the original 5E/4M/2H plan. LeetCode simply does not
 * have five canonical Easy sliding-window problems; the technique starts being
 * interesting at Medium. Rather than pad this pattern with obscure Easy problems,
 * the extra Easy slot is taken up elsewhere. See PROGRESS.md.
 *
 * Sequenced: fixed-size window first (no shrink loop at all), then variable-size
 * "longest valid", then "shortest valid", then the two hard ones that need an
 * extra idea on top of the window.
 */
(window.LC_PROBLEMS = window.LC_PROBLEMS || []).push(

{
  id: 'maximum-average-subarray',
  leetcodeNumber: 643,
  title: 'Maximum Average Subarray I',
  url: 'https://leetcode.com/problems/maximum-average-subarray-i/',
  pattern: 'sliding-window',
  difficulty: 'Easy',
  order: 1,
  tags: ['fixed-window', 'running-sum'],
  problemSummary: 'Find the contiguous block of exactly `k` elements with the largest average, and return that average.',
  examples: [
    { input: 'nums = [1,12,-5,-6,50,3], k = 4', output: '12.75', note: 'The block [12,-5,-6,50] sums to 51, and 51/4 = 12.75.' },
    { input: 'nums = [5], k = 1', output: '5.0', note: 'Only one window exists.' }
  ],
  constraints: ['n == nums.length', '1 <= k <= n <= 10^5', '-10^4 <= nums[i] <= 10^4'],
  techniqueNote: 'the fixed-size window, which is the whole pattern with the hard part removed: no shrink loop, just one in and one out.',
  signals: [
    '**Exactly k contiguous elements**. Fixed size is stated outright.',
    'You were about to recompute the sum for every starting position, which is O(n·k).',
    'Largest average over a fixed length is the same as largest SUM over that length, because dividing by `k` does not change the ordering.'
  ],
  intuition: {
    input: 'nums = [1,12,-5,-6,50,3], k = 4',
    visual:
      'window       [ 1 12 -5 -6 ] 50  3        sum 2\n' +
      'slide right    1 [12 -5 -6 50 ] 3        sum 2 - 1 + 50 = 51   <- best\n' +
      'slide right    1  12 [-5 -6 50  3 ]      sum 51 - 12 + 3 = 42\n' +
      '\n' +
      'each slide is ONE addition and ONE subtraction, not k additions',
    steps: [
      { state: 'sum = 1+12-5-6 = 2', say: 'Build the very first window the slow way, adding all `k` elements. That happens once.' },
      { state: 'sum = 51', say: 'To slide right by one, add the element entering on the right and subtract the one leaving on the left. Two operations, not `k`.' },
      { state: 'sum = 42', say: 'Slide again. Keep the largest sum seen.' },
      { state: '', say: 'Compare SUMS, not averages, and divide only once at the end. It avoids `k` divisions and any floating-point drift in the comparison.' }
    ],
    takeaway: 'A window is incremental. Moving it changes two elements, so any summary you keep can be updated in O(1) instead of rebuilt in O(k).'
  },
  hints: [
    'Computing the sum of every k-length block separately does a lot of repeated addition. What do two neighbouring blocks have in common?',
    'Build the first window once. Then slide: `sum += nums[r] - nums[r - k]`. Track the best sum and divide by `k` at the very end.',
    'Pseudo-code: `sum = sum of first k; best = sum; for r in k..n-1: sum += nums[r] - nums[r-k]; best = max(best, sum); return best / (double) k`'
  ],
  methodSignature: 'public double findMaxAverage(int[] nums, int k)',
  javaTemplate: 'sliding-window-variable',
  javaSolution: `class Solution {
    public double findMaxAverage(int[] nums, int k) {
        // Build the first window the slow way, exactly once.
        int sum = 0;
        for (int i = 0; i < k; i++) {
            sum += nums[i];
        }

        int best = sum;

        // Each slide is one element in and one element out.
        for (int r = k; r < nums.length; r++) {
            sum += nums[r] - nums[r - k];
            best = Math.max(best, sum);
        }

        // Compare sums, divide once. Dividing inside the loop would cost k
        // divisions and invite floating-point noise in the comparison.
        return (double) best / k;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'k additions to build the first window, then one add and one subtract per slide',
    space: 'O(1)', spaceWhy: 'two integers'
  },
  testCases: [
    { input: { nums: [1, 12, -5, -6, 50, 3], k: 4 }, expected: '12.75' },
    { input: { nums: [5], k: 1 }, expected: '5.0' },
    { input: { nums: [0, 1, 1, 3, 3], k: 4 }, expected: '2.0' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.findMaxAverage(new int[]{1, 12, -5, -6, 50, 3}, 4));
        System.out.println(s.findMaxAverage(new int[]{5}, 1));
        System.out.println(s.findMaxAverage(new int[]{0, 1, 1, 3, 3}, 4));
    }
}`,
  commonMistakes: [
    'Writing `sum / k` with two ints, which does integer division and truncates. Cast to `double` first.',
    'Initialising `best` to 0. With all-negative input the answer is negative, and 0 is not a real window.',
    'Recomputing the whole window sum on every slide, which is O(n·k) and times out at n = 10^5.',
    'Comparing averages instead of sums. It is not wrong, just slower and less precise.'
  ],
  followUps: [
    'Maximum Number of Vowels in a Substring of Given Length is the same fixed window with a different summary.',
    'Once the window length stops being fixed, you need the shrink loop, which is the next few problems.'
  ]
},

{
  id: 'contains-duplicate-ii',
  leetcodeNumber: 219,
  title: 'Contains Duplicate II',
  url: 'https://leetcode.com/problems/contains-duplicate-ii/',
  pattern: 'sliding-window',
  difficulty: 'Easy',
  order: 2,
  tags: ['fixed-window', 'hash-set'],
  problemSummary: 'Return true if the array holds two equal values whose positions are at most `k` apart.',
  examples: [
    { input: 'nums = [1,2,3,1], k = 3', output: 'true', note: 'The two 1s are at index 0 and 3, a distance of 3.' },
    { input: 'nums = [1,0,1,1], k = 1', output: 'true', note: 'The 1s at index 2 and 3 are adjacent.' },
    { input: 'nums = [1,2,3,1,2,3], k = 2', output: 'false', note: 'Every repeat is 3 apart, which is more than k.' }
  ],
  constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9', '0 <= k <= 10^5'],
  techniqueNote: 'Contains Duplicate with a window bolted on. The set only remembers the last `k` elements instead of all of them.',
  signals: [
    'A duplicate question you already know how to answer, plus a **distance limit**. The limit is the window.',
    '"Within k of each other" means the set must forget things, not just remember them.',
    'Fixed-size window, so there is no shrink loop: one element enters, one element leaves.'
  ],
  intuition: {
    input: 'nums = [1,2,3,1], k = 3',
    visual:
      'the set holds only the previous k elements\n' +
      '\n' +
      'r=0  add 1        window {1}\n' +
      'r=1  add 2        window {1,2}\n' +
      'r=2  add 3        window {1,2,3}\n' +
      'r=3  r > k? 3 > 3 is false, so nothing is evicted yet\n' +
      '     add 1 -> already present  ->  true',
    steps: [
      { state: 'window = {}', say: 'Same idea as Contains Duplicate: a set, and `add` returning false is the duplicate test.' },
      { state: 'window = {1,2,3}', say: 'The difference is that the set must only ever hold the last `k` values, so a match is guaranteed to be within range.' },
      { state: '', say: 'Before adding `nums[r]`, evict `nums[r - k - 1]` if it exists. That is the element that has just fallen out of range.' },
      { state: 'add 1 fails', say: 'Adding `1` fails because `1` is still in the window, so the answer is `true`.' },
      { state: '', say: 'The eviction index is the fiddly bit. When you are at `r`, the allowed window is `[r-k, r]`, so the one to drop is `r-k-1`.' }
    ],
    takeaway: 'A set that forgets is a window. The only real work is getting the eviction index right: at `r`, drop `r - k - 1`.'
  },
  hints: [
    'You already know how to answer "is there a duplicate anywhere". What has to change so that only nearby duplicates count?',
    'Keep a `HashSet` holding only the last `k` elements. Before inserting `nums[r]`, remove `nums[r - k - 1]` if that index exists.',
    'Pseudo-code: `for r in 0..n-1: if r > k: window.remove(nums[r-k-1]); if !window.add(nums[r]) return true; return false`'
  ],
  methodSignature: 'public boolean containsNearbyDuplicate(int[] nums, int k)',
  javaTemplate: 'sliding-window-variable',
  javaSolution: `import java.util.*;

class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        // Holds only the previous k values, so any hit is automatically in range.
        Set<Integer> window = new HashSet<>();

        for (int r = 0; r < nums.length; r++) {
            // At index r the allowed range is [r-k, r], so the element that has
            // just fallen out is the one at r-k-1.
            if (r > k) {
                window.remove(nums[r - k - 1]);
            }

            // add() returns false when the value is already inside the window.
            if (!window.add(nums[r])) {
                return true;
            }
        }

        return false;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'one pass, with O(1) average set add and remove',
    space: 'O(min(n, k))', spaceWhy: 'the set never holds more than k elements'
  },
  testCases: [
    { input: { nums: [1, 2, 3, 1], k: 3 }, expected: 'true' },
    { input: { nums: [1, 0, 1, 1], k: 1 }, expected: 'true' },
    { input: { nums: [1, 2, 3, 1, 2, 3], k: 2 }, expected: 'false' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.containsNearbyDuplicate(new int[]{1, 2, 3, 1}, 3));
        System.out.println(s.containsNearbyDuplicate(new int[]{1, 0, 1, 1}, 1));
        System.out.println(s.containsNearbyDuplicate(new int[]{1, 2, 3, 1, 2, 3}, 2));
    }
}`,
  commonMistakes: [
    'Evicting `nums[r - k]` instead of `nums[r - k - 1]`, which shrinks the window by one and reports false on `[1,2,3,1], k=3`.',
    'Using `if (r >= k)` for the eviction, which is the same off-by-one.',
    'Storing value to last-index in a map and comparing distances. It works, and the set is simpler, because a window makes the distance check unnecessary.',
    'Nested loops comparing every pair within k. That is O(n·k) and times out.'
  ],
  followUps: [
    'Contains Duplicate III adds a value tolerance as well as an index one, which needs a `TreeSet` for nearest-value queries.',
    'Same skeleton as Find All Anagrams: a fixed window with a summary that is updated on entry and exit.'
  ]
},

{
  id: 'best-time-to-buy-and-sell-stock',
  leetcodeNumber: 121,
  title: 'Best Time to Buy and Sell Stock',
  url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
  pattern: 'sliding-window',
  difficulty: 'Easy',
  order: 3,
  tags: ['running-min', 'one-pass'],
  problemSummary: 'Each value is the price on one day. Buy on one day and sell on a later day, at most once. Return the largest profit possible, or 0 if no profitable trade exists.',
  examples: [
    { input: 'prices = [7,1,5,3,6,4]', output: '5', note: 'Buy at 1 on day 2, sell at 6 on day 5.' },
    { input: 'prices = [7,6,4,3,1]', output: '0', note: 'Prices only fall, so the best move is not to trade.' }
  ],
  constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
  techniqueNote: 'a window whose left edge only ever jumps to a new cheapest day. Keeping the running minimum is all the state you need.',
  signals: [
    'Buy before sell, so the pair must respect order. That is a left edge and a right edge.',
    'For each possible selling day, the best buying day is simply the cheapest day so far. One variable holds that.',
    'The O(n²) version tries every pair. Notice that the inner loop only ever wants a minimum.'
  ],
  intuition: {
    input: 'prices = [7,1,5,3,6,4]',
    visual:
      'day      0   1   2   3   4   5\n' +
      'price    7   1   5   3   6   4\n' +
      'cheapest 7   1   1   1   1   1\n' +
      'profit   0   0   4   2   5   3     <- best is 5\n' +
      '\n' +
      'the cheapest-so-far is the only thing the past needs to tell the future',
    steps: [
      { state: 'cheapest = 7, best = 0', say: 'Day 0. Nothing to sell into yet, so no profit.' },
      { state: 'cheapest = 1', say: 'Day 1, price 1. That is a new cheapest, so the buying day moves here. Selling today would lose money, so profit stays 0.' },
      { state: 'best = 4', say: 'Day 2, price 5. Selling today after buying at 1 gives 4. Record it.' },
      { state: 'best = 5', say: 'Day 4, price 6. Selling today gives 5, the best so far.' },
      { state: '', say: 'The important realisation: for any selling day, the best buying day is always the cheapest day before it. So the entire past collapses into one number.' }
    ],
    takeaway: 'When the left edge of a window only ever wants the minimum seen so far, you do not need a window at all. One variable replaces it.'
  },
  hints: [
    'The brute force tries every buy day against every sell day. In that inner loop, what are you really looking for?',
    'Walk forward once. Keep the cheapest price seen so far, and at each day compute "sell today at this price after buying at the cheapest". Keep the largest such value.',
    'Pseudo-code: `cheapest = +inf; best = 0; for p in prices: cheapest = min(cheapest, p); best = max(best, p - cheapest); return best`'
  ],
  methodSignature: 'public int maxProfit(int[] prices)',
  javaTemplate: 'sliding-window-variable',
  javaSolution: `class Solution {
    public int maxProfit(int[] prices) {
        int cheapest = Integer.MAX_VALUE;   // best buying day so far
        int best = 0;                        // 0 because doing nothing is allowed

        for (int p : prices) {
            // Update the buy price BEFORE measuring, so that selling on the same
            // day gives 0 rather than a negative number.
            cheapest = Math.min(cheapest, p);
            best = Math.max(best, p - cheapest);
        }

        return best;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'one pass, constant work per day',
    space: 'O(1)', spaceWhy: 'two integers, no array of running minima needed'
  },
  testCases: [
    { input: { prices: [7, 1, 5, 3, 6, 4] }, expected: '5' },
    { input: { prices: [7, 6, 4, 3, 1] }, expected: '0' },
    { input: { prices: [2, 4, 1] }, expected: '2' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.maxProfit(new int[]{7, 1, 5, 3, 6, 4}));
        System.out.println(s.maxProfit(new int[]{7, 6, 4, 3, 1}));
        System.out.println(s.maxProfit(new int[]{2, 4, 1}));
    }
}`,
  commonMistakes: [
    'Returning a negative profit on a falling market. Seed `best` to 0, because not trading is permitted.',
    'Tracking the maximum price as well and returning `max - min`. That breaks when the maximum comes BEFORE the minimum, as in `[2,4,1]`.',
    'Updating `cheapest` after computing the profit, which allows buying and selling on the same day at a loss.',
    'The O(n²) double loop, which times out at n = 10^5.'
  ],
  followUps: [
    'Best Time to Buy and Sell Stock II allows unlimited trades, and the answer becomes "sum every upward step", which is greedy.',
    'Versions III and IV cap the number of transactions and become 2-D DP.'
  ]
},

{
  id: 'minimum-difference-k-scores',
  leetcodeNumber: 1984,
  title: 'Minimum Difference Between Highest and Lowest of K Scores',
  url: 'https://leetcode.com/problems/minimum-difference-between-highest-and-lowest-of-k-scores/',
  pattern: 'sliding-window',
  difficulty: 'Easy',
  order: 4,
  tags: ['fixed-window', 'sort-first'],
  problemSummary: 'Choose exactly `k` of the numbers so that the gap between the largest and smallest chosen value is as small as possible. Return that gap.',
  examples: [
    { input: 'nums = [90], k = 1', output: '0', note: 'One number, so the highest and lowest are the same.' },
    { input: 'nums = [9,4,1,7], k = 2', output: '2', note: 'Choosing 7 and 9 gives a gap of 2, the smallest available.' }
  ],
  constraints: ['1 <= k <= nums.length <= 1000', '0 <= nums[i] <= 10^5'],
  techniqueNote: 'sorting first makes the answer a fixed-size window. The `k` closest values must be adjacent once the array is sorted.',
  signals: [
    'You may **choose any k**, and order in the input is irrelevant. That is permission to sort.',
    'After sorting, "k values that are close together" can only mean k CONSECUTIVE values. That turns choice into a window.',
    'Fixed window size k, so it is the simplest window shape: no shrink loop.'
  ],
  intuition: {
    input: 'nums = [9,4,1,7], k = 2',
    visual:
      'sorted:  1  4  7  9\n' +
      '\n' +
      '        [1  4] 7  9      gap 4 - 1 = 3\n' +
      '         1 [4  7] 9      gap 7 - 4 = 3\n' +
      '         1  4 [7  9]     gap 9 - 7 = 2   <- best',
    steps: [
      { state: '', say: 'The key argument first. Suppose you picked `k` values that were not consecutive in sorted order. Then some value sits between your smallest and largest but was not chosen. Swapping it in for one of your extremes can only narrow the gap. So the best group is always consecutive.' },
      { state: 'sorted = [1,4,7,9]', say: 'Sort. Now the only candidates are the windows of length `k`.' },
      { state: 'window [1,4]', say: 'Because the array is sorted, the gap of a window is just `last - first`. No scanning inside it.' },
      { state: 'window [7,9] gives 2', say: 'Slide across all `n - k + 1` windows and keep the smallest gap.' }
    ],
    takeaway: 'Sorting converts "choose any k" into "choose a contiguous k", which is the move that makes a window applicable at all.'
  },
  hints: [
    'The input order does not matter, since you may choose any k. What does that let you do to the array first?',
    'After sorting, argue to yourself that the best k must be consecutive. Then every candidate is a window of length k, and its gap is `nums[l + k - 1] - nums[l]`.',
    'Pseudo-code: `if k == 1 return 0; sort(nums); best = +inf; for l in 0..n-k: best = min(best, nums[l+k-1] - nums[l]); return best`'
  ],
  methodSignature: 'public int minimumDifference(int[] nums, int k)',
  javaTemplate: 'sliding-window-variable',
  javaSolution: `import java.util.*;

class Solution {
    public int minimumDifference(int[] nums, int k) {
        // One score means the highest and the lowest are the same score.
        if (k == 1) {
            return 0;
        }

        // Sorting is what makes the best group contiguous.
        Arrays.sort(nums);

        int best = Integer.MAX_VALUE;

        // l + k - 1 is the last index of the window, so stop before it runs off.
        for (int l = 0; l + k - 1 < nums.length; l++) {
            best = Math.min(best, nums[l + k - 1] - nums[l]);
        }

        return best;
    }
}
`,
  complexity: {
    time: 'O(n log n)', timeWhy: 'the sort dominates; sliding the window is a single O(n) pass',
    space: 'O(1)', spaceWhy: 'sorting in place plus one running best'
  },
  testCases: [
    { input: { nums: [90], k: 1 }, expected: '0' },
    { input: { nums: [9, 4, 1, 7], k: 2 }, expected: '2' },
    { input: { nums: [87063, 61094, 44530, 21297, 95857, 93551, 9918], k: 6 }, expected: '74560' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.minimumDifference(new int[]{90}, 1));
        System.out.println(s.minimumDifference(new int[]{9, 4, 1, 7}, 2));
        System.out.println(s.minimumDifference(new int[]{87063, 61094, 44530, 21297, 95857, 93551, 9918}, 6));
    }
}`,
  commonMistakes: [
    'Forgetting to sort, which makes the window meaningless.',
    'Looping `l < nums.length - k` instead of `l + k - 1 < nums.length`, which drops the last valid window.',
    'Missing the `k == 1` case, though the general loop happens to return 0 for it anyway. Handling it explicitly documents the intent.',
    'Trying every combination of k values. That is exponential for no reason.'
  ],
  followUps: [
    'K Closest Elements is the same "sorted plus a window of size k" idea, found with binary search on the window start.',
    'Once the window size depends on the data rather than being given, you need the shrink loop, which the next problems use.'
  ]
},

{
  id: 'longest-substring-without-repeating',
  leetcodeNumber: 3,
  title: 'Longest Substring Without Repeating Characters',
  url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
  pattern: 'sliding-window',
  difficulty: 'Medium',
  order: 5,
  tags: ['variable-window', 'longest-valid', 'counting'],
  problemSummary: 'Find the length of the longest contiguous stretch of the string in which no character repeats.',
  examples: [
    { input: 's = "abcabcbb"', output: '3', note: '"abc" is the longest, and it happens more than once.' },
    { input: 's = "bbbbb"', output: '1', note: 'Only a single character can ever be valid.' },
    { input: 's = "pwwkew"', output: '3', note: '"wke". Note that "pwke" is a subsequence, not a substring, so it does not count.' }
  ],
  constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces'],
  techniqueNote: 'the canonical **longest valid** window: grow right always, shrink left only while the rule is broken, and measure after shrinking.',
  signals: [
    '**Longest contiguous** stretch satisfying a condition. That word pair is the sliding-window signature.',
    '**Substring**, not subsequence. Substrings are contiguous, which is what a window models.',
    'The condition ("no repeats") can be checked from a running count, so it is cheap to maintain as the window moves.'
  ],
  intuition: {
    input: 's = "abba"',
    visual:
      'r  char  window     action                              best\n' +
      '0  a     a          count[a]=1, legal                   1\n' +
      '1  b     ab         count[b]=1, legal                   2\n' +
      '2  b     abb        count[b]=2, ILLEGAL -> shrink\n' +
      '         bb         dropped a, count[b] still 2, again\n' +
      '         b          dropped a b, now legal              2\n' +
      '3  a     ba         count[a]=1, legal                   2',
    steps: [
      { state: 'window "ab", best 2', say: 'Extend `r` one character at a time and add it to a count table.' },
      { state: 'window "abb" is illegal', say: 'The incoming `b` makes its count 2, so the window is invalid. Pull `l` forward, decrementing counts as characters leave.' },
      { state: '', say: 'This is a `while`, not an `if`. In `"abba"` you have to drop both `a` and the first `b` before the window is legal again. One removal would not be enough.' },
      { state: 'window "b", best still 2', say: 'Once legal, measure `r - l + 1` and keep the maximum. Measuring here, AFTER shrinking, is what makes this the "longest valid" shape.' },
      { state: '', say: 'Total work is linear even with the nested `while`, because `l` only ever moves forward: every index enters once and leaves once.' }
    ],
    takeaway: 'For "longest valid", record AFTER the shrink loop. For "shortest valid", record INSIDE it. That single difference distinguishes the two window shapes.'
  },
  hints: [
    'You want the longest contiguous stretch with a property. What two indexes describe a stretch, and which one should you move first?',
    'Push `r` forward and count the character entering. While the count of that character is above 1, pull `l` forward and decrement what leaves. Then record `r - l + 1`.',
    'Pseudo-code: `l=0; best=0; for r: count[s[r]]++; while count[s[r]] > 1: count[s[l]]--; l++; best = max(best, r-l+1)`'
  ],
  methodSignature: 'public int lengthOfLongestSubstring(String s)',
  javaTemplate: 'sliding-window-variable',
  javaSolution: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // The constraints allow letters, digits, symbols and spaces, so index by
        // the raw ASCII value rather than assuming lowercase a..z.
        int[] count = new int[128];

        int l = 0;
        int best = 0;

        for (int r = 0; r < s.length(); r++) {
            char in = s.charAt(r);
            count[in]++;

            // A while, not an if: on "abba" the incoming 'b' needs BOTH the 'a'
            // and the first 'b' removed before the window is legal again.
            while (count[in] > 1) {
                char out = s.charAt(l);
                count[out]--;
                l++;
            }

            // Measure only once the window is valid again. This is the
            // "longest valid" shape.
            best = Math.max(best, r - l + 1);
        }

        return best;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'l never moves backwards, so across the whole run each index is added once and removed once',
    space: 'O(1)', spaceWhy: '128 counters, fixed regardless of input length'
  },
  testCases: [
    { input: { s: 'abcabcbb' }, expected: '3' },
    { input: { s: 'bbbbb' }, expected: '1' },
    { input: { s: 'pwwkew' }, expected: '3' },
    { input: { s: '' }, expected: '0' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.lengthOfLongestSubstring("abcabcbb"));
        System.out.println(s.lengthOfLongestSubstring("bbbbb"));
        System.out.println(s.lengthOfLongestSubstring("pwwkew"));
        System.out.println(s.lengthOfLongestSubstring(""));
    }
}`,
  commonMistakes: [
    'Using `if` instead of `while` for the shrink. `"abba"` is the input that exposes it.',
    'Measuring before shrinking, which counts an invalid window.',
    'Getting the length wrong: it is `r - l + 1`, not `r - l`.',
    'Assuming lowercase and using `int[26]`, which throws on digits, spaces or symbols.',
    'Answering `"pwke"` for `"pwwkew"`. That is a subsequence; substrings must be contiguous.'
  ],
  followUps: [
    'A faster variant stores the last index of each character and JUMPS `l` straight to `lastSeen + 1` instead of stepping. Same complexity, fewer operations, slightly trickier to get right.',
    'Longest Substring with At Most K Distinct Characters is the same loop with `map.size() > k` as the invariant.'
  ]
},

{
  id: 'longest-repeating-character-replacement',
  leetcodeNumber: 424,
  title: 'Longest Repeating Character Replacement',
  url: 'https://leetcode.com/problems/longest-repeating-character-replacement/',
  pattern: 'sliding-window',
  difficulty: 'Medium',
  order: 6,
  tags: ['variable-window', 'longest-valid', 'counting'],
  problemSummary: 'You may change at most `k` characters of the string to any letter you like. Return the length of the longest stretch that can be made up of a single repeated letter.',
  examples: [
    { input: 's = "ABAB", k = 2', output: '4', note: 'Change both As to Bs, or both Bs to As.' },
    { input: 's = "AABABBA", k = 1', output: '4', note: 'Change the middle A to a B to get "AABBBBA", whose best stretch is "BBBB".' }
  ],
  constraints: ['1 <= s.length <= 10^5', 's consists of only uppercase English letters', '0 <= k <= s.length'],
  techniqueNote: 'the same "longest valid" window, but the invariant needs deriving: **window length minus the most common letter in it** is how many changes the window costs.',
  signals: [
    '**Longest contiguous** stretch, plus a budget of edits. Window with a cost invariant.',
    'The hard part is not the loop, it is naming the invariant. Say it out loud: how many characters would I have to change to make this window uniform?',
    'Uppercase only, so a 26-slot count array is enough.'
  ],
  intuition: {
    input: 's = "AABABBA", k = 1',
    visual:
      'cost of a window = length - count of its most common letter\n' +
      '\n' +
      'window "AABA"    length 4, most common A appears 3   cost 1  <= k, legal\n' +
      'window "AABAB"   length 5, most common A appears 3   cost 2  >  k, shrink\n' +
      'window  "ABAB"   length 4, most common A appears 2   cost 2  >  k, shrink\n' +
      'window   "BAB"   length 3, most common B appears 2   cost 1  <= k, legal',
    steps: [
      { state: '', say: 'Start with the invariant, not the code. To make a window all one letter, you keep the letter that already appears most often and change everything else. So the cost is `length - maxCount`.' },
      { state: 'window "AABA", cost 1', say: 'Length 4, `A` appears 3 times, so one change is needed. With `k = 1` that is legal.' },
      { state: 'window "AABAB", cost 2', say: 'Extending makes the cost 2, which is over budget. Shrink from the left until it is legal again.' },
      { state: 'window "BAB", cost 1', say: 'Legal again. Record the length, keeping the maximum.' },
      { state: '', say: 'The answer for this input is 4, from `"AABA"`, which was recorded before the shrinking happened.' }
    ],
    takeaway: 'Every window problem reduces to one sentence: what makes a window legal? Write that sentence, and the loop writes itself.'
  },
  hints: [
    'Forget the loop. For one fixed window, how many characters would you have to change to make it a single repeated letter? Which letter would you keep?',
    'Cost is `windowLength - countOfMostCommonLetter`. Grow `r`, and while the cost exceeds `k`, shrink from `l`. Record the length once legal.',
    'Pseudo-code: `l=0; best=0; for r: count[s[r]]++; while (r-l+1) - max(count) > k: count[s[l]]--; l++; best = max(best, r-l+1)`'
  ],
  methodSignature: 'public int characterReplacement(String s, int k)',
  javaTemplate: 'sliding-window-variable',
  javaSolution: `class Solution {
    public int characterReplacement(String s, int k) {
        int[] count = new int[26];   // uppercase A..Z only

        int l = 0;
        int best = 0;

        for (int r = 0; r < s.length(); r++) {
            count[s.charAt(r) - 'A']++;

            // Cost of making this window uniform: keep the most common letter,
            // change everything else. Shrink while that exceeds the budget.
            while ((r - l + 1) - maxCount(count) > k) {
                count[s.charAt(l) - 'A']--;
                l++;
            }

            best = Math.max(best, r - l + 1);
        }

        return best;
    }

    /** Scanning 26 slots is constant work, so this does not change the O(n). */
    private int maxCount(int[] count) {
        int m = 0;
        for (int c : count) {
            m = Math.max(m, c);
        }
        return m;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'each index enters and leaves once; the 26-slot max scan is a constant factor, not a term',
    space: 'O(1)', spaceWhy: '26 counters'
  },
  testCases: [
    { input: { s: 'ABAB', k: 2 }, expected: '4' },
    { input: { s: 'AABABBA', k: 1 }, expected: '4' },
    { input: { s: 'AAAA', k: 0 }, expected: '4' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.characterReplacement("ABAB", 2));
        System.out.println(s.characterReplacement("AABABBA", 1));
        System.out.println(s.characterReplacement("AAAA", 0));
    }
}`,
  commonMistakes: [
    'Getting the invariant wrong, usually as "number of distinct letters minus one". The cost is about counts, not about how many different letters appear.',
    'Trying each of the 26 letters as "the letter to keep" with a separate pass. It works and is 26 times more code than needed.',
    'Using `if` instead of `while` for the shrink.',
    'Indexing with `c - \'a\'` when the input is uppercase, which produces negative indexes.'
  ],
  followUps: [
    'The well-known optimisation never decreases `maxCount`, replacing the 26-slot scan with a single variable. It still yields the correct MAXIMUM even though intermediate windows can be invalid, which is a genuinely subtle argument. The version above avoids needing it.',
    'Max Consecutive Ones III is the same problem with two symbols, where the cost is simply the number of zeros in the window.'
  ]
},

{
  id: 'permutation-in-string',
  leetcodeNumber: 567,
  title: 'Permutation in String',
  url: 'https://leetcode.com/problems/permutation-in-string/',
  pattern: 'sliding-window',
  difficulty: 'Medium',
  order: 7,
  tags: ['fixed-window', 'counting', 'anagram'],
  problemSummary: 'Decide whether any contiguous stretch of `s2` is a rearrangement of `s1`.',
  examples: [
    { input: 's1 = "ab", s2 = "eidbaooo"', output: 'true', note: '"ba" is a rearrangement of "ab".' },
    { input: 's1 = "ab", s2 = "eidboaoo"', output: 'false', note: 'The a and b are never adjacent.' },
    { input: 's1 = "adc", s2 = "dcda"', output: 'true', note: '"dca" at index 1.' }
  ],
  constraints: ['1 <= s1.length, s2.length <= 10^4', 'Both consist of lowercase English letters'],
  techniqueNote: 'Valid Anagram inside a fixed-size window. The window length is fixed at `s1.length()`, because a rearrangement has the same length as the original.',
  signals: [
    '**Permutation** or **anagram** of a fixed pattern, found inside a longer string. The pattern length fixes the window size.',
    'You already know how to compare two strings for anagram-ness: compare letter counts. Now do it once per window.',
    'Fixed size, so no shrink loop: one letter in on the right, one out on the left.'
  ],
  intuition: {
    input: 's1 = "ab", s2 = "eidbaooo"',
    visual:
      'need = {a:1, b:1}, window length fixed at 2\n' +
      '\n' +
      'window  ei   window={e:1,i:1}   no\n' +
      'window  id   window={i:1,d:1}   no\n' +
      'window  db   window={d:1,b:1}   no\n' +
      'window  ba   window={b:1,a:1}   MATCHES need  ->  true',
    steps: [
      { state: 'need = {a:1, b:1}', say: 'A rearrangement has exactly the same letters with the same counts, so count `s1` once into a 26-slot array.' },
      { state: '', say: 'A rearrangement also has the same LENGTH, so only windows of exactly `s1.length()` can match. The window size is fixed.' },
      { state: 'window "ei"', say: 'Slide a window of that size across `s2`, keeping its own count array. Add the entering letter, remove the leaving one.' },
      { state: 'window "ba" matches', say: 'After each slide, compare the two arrays. When they are equal, some rearrangement is present.' },
      { state: '', say: 'Comparing 26 ints per position is constant work, so the whole scan stays linear.' }
    ],
    takeaway: 'A fixed-length pattern gives you a fixed-length window for free. The only decision left is what summary to keep, and for anagrams it is always letter counts.'
  },
  hints: [
    'What is always true about the LENGTH of a rearrangement of `s1`? What does that tell you about the windows worth checking?',
    'Count `s1` into `int[26]`. Slide a window of the same length across `s2`, maintaining its own `int[26]`, and compare the two arrays after each slide.',
    'Pseudo-code: `count s1 into need; for r in 0..n-1: window[s2[r]]++; if r >= len: window[s2[r-len]]--; if Arrays.equals(need, window) return true`'
  ],
  methodSignature: 'public boolean checkInclusion(String s1, String s2)',
  javaTemplate: 'sliding-window-variable',
  javaSolution: `import java.util.*;

class Solution {
    public boolean checkInclusion(String s1, String s2) {
        int len = s1.length();
        if (len > s2.length()) {
            return false;
        }

        int[] need = new int[26];
        int[] window = new int[26];

        for (char c : s1.toCharArray()) {
            need[c - 'a']++;
        }

        for (int r = 0; r < s2.length(); r++) {
            window[s2.charAt(r) - 'a']++;

            // Once the window is longer than the pattern, evict on the left so
            // the length stays fixed at len.
            if (r >= len) {
                window[s2.charAt(r - len) - 'a']--;
            }

            // Comparing 26 ints is constant work, so this stays O(n) overall.
            if (Arrays.equals(need, window)) {
                return true;
            }
        }

        return false;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'one pass over s2, with a fixed 26-element comparison at each position',
    space: 'O(1)', spaceWhy: 'two 26-slot arrays'
  },
  testCases: [
    { input: { s1: 'ab', s2: 'eidbaooo' }, expected: 'true' },
    { input: { s1: 'ab', s2: 'eidboaoo' }, expected: 'false' },
    { input: { s1: 'adc', s2: 'dcda' }, expected: 'true' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.checkInclusion("ab", "eidbaooo"));
        System.out.println(s.checkInclusion("ab", "eidboaoo"));
        System.out.println(s.checkInclusion("adc", "dcda"));
    }
}`,
  commonMistakes: [
    'Evicting with `if (r >= len - 1)`, which shrinks the window below the pattern length.',
    'Forgetting the guard for `s1` longer than `s2`, which makes the eviction index negative.',
    'Sorting every window and comparing strings. Correct, and O(n · k log k) instead of O(n).',
    'Generating all permutations of `s1` and searching for each. That is factorial, for a problem with a linear answer.'
  ],
  followUps: [
    'Find All Anagrams in a String (next) is this exact code that collects every match instead of returning on the first.',
    'Tracking a single "how many letters are still wrong" counter avoids the 26-element comparison, though it is more fiddly.'
  ]
},

{
  id: 'find-all-anagrams',
  leetcodeNumber: 438,
  title: 'Find All Anagrams in a String',
  url: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/',
  pattern: 'sliding-window',
  difficulty: 'Medium',
  order: 8,
  tags: ['fixed-window', 'counting', 'anagram'],
  problemSummary: 'Return the starting index of every contiguous stretch of `s` that is a rearrangement of `p`.',
  examples: [
    { input: 's = "cbaebabacd", p = "abc"', output: '[0,6]', note: '"cba" starts at 0 and "bac" starts at 6.' },
    { input: 's = "abab", p = "ab"', output: '[0,1,2]', note: '"ab", "ba" and "ab" all qualify, and they overlap.' }
  ],
  constraints: ['1 <= s.length, p.length <= 3 * 10^4', 'Both consist of lowercase English letters'],
  techniqueNote: 'the previous problem, except it collects every match. The only new thing is converting the right edge into a start index.',
  signals: [
    'Same signals as Permutation in String: **anagram of a fixed pattern**, fixed-size window.',
    '**All** occurrences rather than a yes or no, so you collect instead of returning early.',
    'Overlapping matches are allowed, which a sliding window handles naturally because it advances one position at a time.'
  ],
  intuition: {
    input: 's = "abab", p = "ab"',
    visual:
      'need = {a:1, b:1}, window length 2\n' +
      '\n' +
      'r=0  window "a"    too short, no check yet\n' +
      'r=1  window "ab"   matches  ->  start index = 1 - 2 + 1 = 0\n' +
      'r=2  window "ba"   matches  ->  start index = 2 - 2 + 1 = 1\n' +
      'r=3  window "ab"   matches  ->  start index = 3 - 2 + 1 = 2\n' +
      '\n' +
      'answer [0, 1, 2] - overlapping matches are fine',
    steps: [
      { state: '', say: 'Everything is identical to Permutation in String: count `p`, slide a window of that length, compare count arrays.' },
      { state: 'r=0', say: 'Do not check until the window has actually reached full size, which first happens at `r == p.length() - 1`.' },
      { state: 'r=1, start 0', say: 'On a match, the answer is the START index. The window occupies `[r - len + 1, r]`, so the start is `r - len + 1`.' },
      { state: '[0,1,2]', say: 'Do not stop at the first hit, and do not skip forward past a match. Overlaps count, and advancing by one is what finds them.' }
    ],
    takeaway: 'Converting a right edge into a start index is `r - windowLength + 1`. That arithmetic appears in every fixed-window problem that reports positions.'
  },
  hints: [
    'This is the previous problem with one change. What do you do differently when you find a match?',
    'Same fixed window and count comparison. On a match, add `r - p.length() + 1` to the output list and keep going.',
    'Pseudo-code: `for r: window[s[r]]++; if r >= len: window[s[r-len]]--; if r >= len-1 and equals(need, window): out.add(r - len + 1)`'
  ],
  methodSignature: 'public List<Integer> findAnagrams(String s, String p)',
  javaTemplate: 'sliding-window-variable',
  javaSolution: `import java.util.*;

class Solution {
    public List<Integer> findAnagrams(String s, String p) {
        List<Integer> out = new ArrayList<>();

        int len = p.length();
        if (len > s.length()) {
            return out;
        }

        int[] need = new int[26];
        int[] window = new int[26];

        for (char c : p.toCharArray()) {
            need[c - 'a']++;
        }

        for (int r = 0; r < s.length(); r++) {
            window[s.charAt(r) - 'a']++;

            if (r >= len) {
                window[s.charAt(r - len) - 'a']--;
            }

            // Only check once the window has reached full size, and report the
            // START index rather than the right edge.
            if (r >= len - 1 && Arrays.equals(need, window)) {
                out.add(r - len + 1);
            }
        }

        return out;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'one pass, with a constant 26-element comparison per position',
    space: 'O(1)', spaceWhy: 'two 26-slot arrays, excluding the output list'
  },
  testCases: [
    { input: { s: 'cbaebabacd', p: 'abc' }, expected: '[0, 6]' },
    { input: { s: 'abab', p: 'ab' }, expected: '[0, 1, 2]' },
    { input: { s: 'a', p: 'ab' }, expected: '[]' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.findAnagrams("cbaebabacd", "abc"));
        System.out.println(s.findAnagrams("abab", "ab"));
        System.out.println(s.findAnagrams("a", "ab"));
    }
}`,
  commonMistakes: [
    'Reporting `r` instead of `r - len + 1`. The answer is where the window starts.',
    'Skipping the `r >= len - 1` guard, so partial windows at the very start get compared.',
    'Jumping `r` forward by `len` after a match, which misses the overlapping matches in `"abab"`.',
    'Rebuilding the window count from scratch at every position, which is O(n · k).'
  ],
  followUps: [
    'A "how many letters are still wrong" counter replaces the 26-element comparison with an O(1) check.',
    'Minimum Window Substring uses exactly that counter, because there the window size is not fixed.'
  ]
},

{
  id: 'minimum-size-subarray-sum',
  leetcodeNumber: 209,
  title: 'Minimum Size Subarray Sum',
  url: 'https://leetcode.com/problems/minimum-size-subarray-sum/',
  pattern: 'sliding-window',
  difficulty: 'Medium',
  order: 9,
  tags: ['variable-window', 'shortest-valid', 'running-sum'],
  problemSummary: 'All values are positive. Find the length of the shortest contiguous block whose sum is at least `target`, or 0 if no such block exists.',
  examples: [
    { input: 'target = 7, nums = [2,3,1,2,4,3]', output: '2', note: '[4,3] sums to 7 with only two elements.' },
    { input: 'target = 4, nums = [1,4,4]', output: '1', note: 'A single 4 is enough.' },
    { input: 'target = 11, nums = [1,1,1,1,1,1,1,1]', output: '0', note: 'The whole array sums to 8, so it is impossible.' }
  ],
  constraints: ['1 <= target <= 10^9', '1 <= nums.length <= 10^5', '1 <= nums[i] <= 10^4'],
  techniqueNote: 'the **shortest valid** window, which is the mirror image of the longest-valid shape: record INSIDE the shrink loop, while the window is still legal.',
  signals: [
    '**Shortest** or **minimum length** contiguous block satisfying a condition.',
    'All values are **positive**, which is what guarantees the sum grows as you extend and shrinks as you contract. Without that the window is unsound.',
    'You want to shrink aggressively while still legal, because a shorter legal window is a better answer.'
  ],
  intuition: {
    input: 'target = 7, nums = [2,3,1,2,4,3]',
    visual:
      'r  window        sum  action\n' +
      '0  [2]            2   below target, grow\n' +
      '1  [2,3]          5   below, grow\n' +
      '2  [2,3,1]        6   below, grow\n' +
      '3  [2,3,1,2]      8   >= 7, RECORD length 4, then drop the 2 -> sum 6\n' +
      '4  [3,1,2,4]     10   >= 7, RECORD 4, drop 3 -> 7, RECORD 3, drop 1 -> 6\n' +
      '5  [1,2,4,3]     10   >= 7, RECORD 4, drop 1 -> 9, RECORD 3,\n' +
      '                      drop 2 -> 7, RECORD 2, drop 4 -> 3\n' +
      '\n' +
      'best 2',
    steps: [
      { state: 'sum = 8 at r=3', say: 'Grow until the window is legal for the first time. Now the window qualifies, so measure it.' },
      { state: '', say: 'Here is the mirror image. In the longest-valid shape you shrink because the window is ILLEGAL. Here you shrink because a shorter window would be BETTER, and you must measure before each removal, while it is still legal.' },
      { state: 'sum = 7, length 3 recorded', say: 'Keep dropping from the left, measuring each time, until dropping again would push the sum below the target.' },
      { state: 'best = 2', say: 'At `r = 5` the window shrinks all the way down to `[4,3]`, length 2, which is the answer.' },
      { state: '', say: 'All values being positive is what makes this valid. With negatives, dropping an element could INCREASE the sum, and shrinking would no longer be monotone.' }
    ],
    takeaway: 'Longest valid: measure after the shrink loop. Shortest valid: measure inside it. Same skeleton, one line moved.'
  },
  hints: [
    'Grow the window until its sum reaches the target. Now that it qualifies, is it as short as it could be?',
    'While the window still satisfies the condition, record its length and then shrink from the left. Stop shrinking when it no longer qualifies, and grow again.',
    'Pseudo-code: `l=0; sum=0; best=+inf; for r: sum += nums[r]; while sum >= target: best = min(best, r-l+1); sum -= nums[l]; l++; return best == inf ? 0 : best`'
  ],
  methodSignature: 'public int minSubArrayLen(int target, int[] nums)',
  javaTemplate: 'sliding-window-variable',
  javaSolution: `class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int l = 0;
        int sum = 0;
        int best = Integer.MAX_VALUE;

        for (int r = 0; r < nums.length; r++) {
            sum += nums[r];

            // Shrink while the window is STILL VALID, measuring before each
            // removal. That is what makes this the "shortest valid" shape.
            while (sum >= target) {
                best = Math.min(best, r - l + 1);
                sum -= nums[l];
                l++;
            }
        }

        // Never satisfied means no such subarray exists.
        return best == Integer.MAX_VALUE ? 0 : best;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'l only moves forward, so each index is added once and subtracted once',
    space: 'O(1)', spaceWhy: 'three integers'
  },
  testCases: [
    { input: { target: 7, nums: [2, 3, 1, 2, 4, 3] }, expected: '2' },
    { input: { target: 4, nums: [1, 4, 4] }, expected: '1' },
    { input: { target: 11, nums: [1, 1, 1, 1, 1, 1, 1, 1] }, expected: '0' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.minSubArrayLen(7, new int[]{2, 3, 1, 2, 4, 3}));
        System.out.println(s.minSubArrayLen(4, new int[]{1, 4, 4}));
        System.out.println(s.minSubArrayLen(11, new int[]{1, 1, 1, 1, 1, 1, 1, 1}));
    }
}`,
  commonMistakes: [
    'Recording the length after the shrink loop, which measures a window that no longer meets the target.',
    'Returning `Integer.MAX_VALUE` when nothing qualifies. The problem asks for 0.',
    'Applying this window to input that may contain negatives. Extending would no longer monotonically increase the sum, and the window logic breaks.',
    'Initialising `best` to 0, which then never gets beaten by a real length.'
  ],
  followUps: [
    'With negative values allowed, the answer needs prefix sums plus a monotonic deque or a `TreeMap`, not a plain window.',
    'The stated O(n log n) follow-up: prefix sums plus a binary search for each start position.'
  ]
},

{
  id: 'minimum-window-substring',
  leetcodeNumber: 76,
  title: 'Minimum Window Substring',
  url: 'https://leetcode.com/problems/minimum-window-substring/',
  pattern: 'sliding-window',
  difficulty: 'Hard',
  order: 10,
  tags: ['variable-window', 'shortest-valid', 'counting', 'missing-counter'],
  problemSummary: 'Return the shortest contiguous stretch of `s` that contains every character of `t`, counting duplicates. Return the empty string if no such stretch exists.',
  examples: [
    { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"', note: 'The shortest stretch holding an A, a B and a C.' },
    { input: 's = "a", t = "a"', output: '"a"', note: 'The whole string.' },
    { input: 's = "a", t = "aa"', output: '""', note: 'Two As are needed and only one exists.' }
  ],
  constraints: ['1 <= s.length, t.length <= 10^5', 's and t consist of uppercase and lowercase English letters'],
  techniqueNote: 'the shortest-valid window again, with one new device: a single **missing** counter so that "is the window valid" is an O(1) test instead of a scan.',
  signals: [
    '**Shortest** stretch containing a required multiset. Shortest-valid window.',
    'Duplicates in `t` matter, so it is counts and not a set.',
    'Checking validity by comparing whole count tables would be O(52) per step. One integer does it instead, and that is what makes this Hard rather than Medium.'
  ],
  intuition: {
    input: 's = "ADOBECODEBANC", t = "ABC"',
    visual:
      'need = {A:1, B:1, C:1},  missing = 3\n' +
      '\n' +
      'grow to "ADOBEC"    missing hits 0  ->  valid, length 6, record\n' +
      '  shrink: drop A    missing back to 1, stop shrinking\n' +
      'grow to "ADOBECODEBA"  missing 0 again  ->  shrink to "BECODEBA", length 8\n' +
      'grow to "...BANC"   ->  shrink down to "BANC", length 4  <- best\n' +
      '\n' +
      'the counts go NEGATIVE for surplus characters, which is the trick',
    steps: [
      { state: 'need = {A:1,B:1,C:1}, missing = 3', say: 'Count what `t` requires. `missing` starts at `t.length()`: that many required slots are unfilled.' },
      { state: '', say: 'Now the device. When a character enters, decrement its count. If the count was **positive before** decrementing, that character was genuinely required, so `missing--`. If it was zero or negative, the character is surplus and `missing` does not move.' },
      { state: 'missing = 0', say: 'Letting counts go negative is what tracks surplus. `missing == 0` now means "the window contains everything required", checkable in O(1).' },
      { state: 'record "ADOBEC"', say: 'Once valid, this is the shortest-valid shape: record, then shrink from the left.' },
      { state: 'missing = 1', say: 'When a character leaves, increment its count. If it becomes positive, you have just given up something required, so `missing++` and stop shrinking.' },
      { state: 'best = "BANC"', say: 'Keep growing and shrinking. The smallest valid window recorded is `"BANC"`.' }
    ],
    takeaway: 'A single "how many required slots are still unfilled" integer replaces comparing whole tables. Negative counts represent surplus, and that is what makes the two updates symmetrical.'
  },
  hints: [
    'You know the shortest-valid skeleton from Minimum Size Subarray Sum. The only question here is what "valid" means and how to test it cheaply.',
    'Count `t` into a table. Keep one integer `missing`, starting at `t.length()`. On entry, decrement the count and decrement `missing` only if the count was positive first. On exit, increment the count and increment `missing` only if it becomes positive. Valid means `missing == 0`.',
    'Pseudo-code: `for r: if need[s[r]] > 0: missing--; need[s[r]]--; while missing == 0: record if shorter; need[s[l]]++; if need[s[l]] > 0: missing++; l++`'
  ],
  methodSignature: 'public String minWindow(String s, String t)',
  javaTemplate: 'sliding-window-variable',
  javaSolution: `class Solution {
    public String minWindow(String s, String t) {
        if (s.length() < t.length() || t.isEmpty()) {
            return "";
        }

        // Upper and lower case, so index by raw ASCII rather than assuming a..z.
        int[] need = new int[128];
        for (char c : t.toCharArray()) {
            need[c]++;
        }

        // How many REQUIRED character slots are still unfilled.
        int missing = t.length();

        int bestLen = Integer.MAX_VALUE;
        int bestStart = 0;
        int l = 0;

        for (int r = 0; r < s.length(); r++) {
            char in = s.charAt(r);

            // Check BEFORE decrementing. A count above zero means this character
            // was genuinely still needed. Counts are allowed to go negative, and
            // a negative count is exactly "surplus copies in the window".
            if (need[in] > 0) {
                missing--;
            }
            need[in]--;

            // missing == 0 means the window covers all of t. O(1) test, which is
            // the whole point of maintaining the counter.
            while (missing == 0) {
                if (r - l + 1 < bestLen) {
                    bestLen = r - l + 1;
                    bestStart = l;
                }

                char out = s.charAt(l);
                need[out]++;
                // Now positive means we just gave up a character we needed.
                if (need[out] > 0) {
                    missing++;
                }
                l++;
            }
        }

        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
    }
}
`,
  complexity: {
    time: 'O(n + m)', timeWhy: 'each index of s enters once and leaves once, and validity is an O(1) integer test',
    space: 'O(1)', spaceWhy: '128 counters plus a few integers, independent of input size'
  },
  testCases: [
    { input: { s: 'ADOBECODEBANC', t: 'ABC' }, expected: '"BANC"' },
    { input: { s: 'a', t: 'a' }, expected: '"a"' },
    { input: { s: 'a', t: 'aa' }, expected: '""' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        // Quoted so the empty-string answer is visible in the output.
        System.out.println("\\"" + s.minWindow("ADOBECODEBANC", "ABC") + "\\"");
        System.out.println("\\"" + s.minWindow("a", "a") + "\\"");
        System.out.println("\\"" + s.minWindow("a", "aa") + "\\"");
    }
}`,
  commonMistakes: [
    'Checking `need[in] > 0` after decrementing instead of before. The test is about whether the character was still required.',
    'Clamping counts at zero. Surplus copies must be recorded as negative numbers, or the exit logic increments `missing` too early.',
    'Recording the answer after the shrink loop rather than inside it.',
    'Storing the best substring itself instead of a start and a length, which allocates a new string on every improvement.',
    'Assuming lowercase only. The constraints allow both cases, so `int[26]` is not enough.'
  ],
  followUps: [
    'Substring with Concatenation of All Words is the fixed-size cousin, where the window advances a whole word at a time.',
    'The same missing-counter device simplifies Permutation in String and Find All Anagrams, replacing their 26-element comparison with an O(1) check.'
  ]
},

{
  id: 'sliding-window-maximum',
  leetcodeNumber: 239,
  title: 'Sliding Window Maximum',
  url: 'https://leetcode.com/problems/sliding-window-maximum/',
  pattern: 'sliding-window',
  difficulty: 'Hard',
  order: 11,
  tags: ['fixed-window', 'monotonic-deque'],
  problemSummary: 'A window of size `k` slides one position at a time from the left of the array to the right. Return the maximum value inside the window at every position.',
  examples: [
    { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]', note: 'One maximum per window position, and there are n - k + 1 of them.' },
    { input: 'nums = [1], k = 1', output: '[1]', note: 'A single window.' }
  ],
  constraints: ['1 <= nums.length <= 10^5', '1 <= k <= nums.length', '-10^4 <= nums[i] <= 10^4'],
  techniqueNote: 'a fixed window plus a **monotonic deque**. A running sum is easy to update incrementally; a running maximum is not, and the deque is what fixes that.',
  signals: [
    'Fixed-size window, but the summary you need is a **maximum** rather than a sum.',
    'This is the problem that shows why sliding window alone is not enough: when the maximum leaves the window, you have no idea what the new maximum is.',
    'n is 10^5 and k can be large, so re-scanning each window at O(n·k) will time out.'
  ],
  intuition: {
    input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
    visual:
      'the deque holds INDEXES, and their values are strictly decreasing,\n' +
      'so the front is always the maximum of the current window\n' +
      '\n' +
      'r=0  1            deque [0]           values (1)\n' +
      'r=1  3 > 1        deque [1]           1 is dead: 3 is bigger AND newer\n' +
      'r=2  -1           deque [1,2]         values (3,-1)      window max 3\n' +
      'r=3  -3           deque [1,2,3]       values (3,-1,-3)   window max 3\n' +
      'r=4  5 kills all  deque [4]           values (5)         window max 5\n' +
      'r=5  3            deque [4,5]         values (5,3)       window max 5\n' +
      'r=6  6 kills all  deque [6]           values (6)         window max 6\n' +
      'r=7  7 kills 6    deque [7]           values (7)         window max 7',
    steps: [
      { state: '', say: 'First see the problem. A running sum survives an element leaving, because you just subtract it. A running maximum does not: when the biggest value slides out, the next biggest could be anywhere.' },
      { state: '', say: 'The insight: if `nums[j]` is smaller than `nums[r]` and `j < r`, then `nums[j]` can NEVER be a window maximum again. It is both smaller and older, so anything it could win, `nums[r]` wins too. It is dead. Discard it.' },
      { state: 'deque [1]', say: 'So before pushing `r`, pop everything off the back whose value is less than or equal to `nums[r]`. What remains is a strictly decreasing sequence of indexes.' },
      { state: 'front = max', say: 'Because the values decrease from front to back, the FRONT is the maximum of everything still alive.' },
      { state: '', say: 'Also drop the front when its index falls out of the window, `dq.peekFirst() <= r - k`. That is the only reason the front ever leaves without being beaten.' },
      { state: '[3,3,5,5,6,7]', say: 'Every index is pushed once and popped once, so despite the two inner while loops the whole thing is O(n).' }
    ],
    takeaway: 'A monotonic deque keeps exactly the candidates that could still win, and nothing else. "Smaller and older" is always safe to throw away.'
  },
  hints: [
    'A sum is easy to slide: add one, subtract one. Try that with a maximum. What goes wrong when the maximum is the element leaving?',
    'Keep a deque of INDEXES whose values decrease from front to back. Before pushing `r`, pop from the back any index whose value is <= `nums[r]`, because it can never win again. Also pop from the front any index that has fallen out of the window. The front is your answer.',
    'Pseudo-code: `for r: while front <= r-k: pollFirst; while !empty and nums[peekLast] <= nums[r]: pollLast; offerLast(r); if r >= k-1: out[r-k+1] = nums[peekFirst]`'
  ],
  methodSignature: 'public int[] maxSlidingWindow(int[] nums, int k)',
  javaTemplate: 'sliding-window-variable',
  javaSolution: `import java.util.*;

class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] out = new int[n - k + 1];

        // Holds INDEXES. Their values are strictly decreasing front to back,
        // so the front index is always the maximum of the live candidates.
        Deque<Integer> dq = new ArrayDeque<>();

        for (int r = 0; r < n; r++) {
            // 1. The front may have slid out of the window.
            while (!dq.isEmpty() && dq.peekFirst() <= r - k) {
                dq.pollFirst();
            }

            // 2. Anything at the back that is <= nums[r] is dead: it is both
            //    smaller and older, so nums[r] beats it in every future window.
            while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[r]) {
                dq.pollLast();
            }

            dq.offerLast(r);

            // 3. Once the window is full, the front is its maximum.
            if (r >= k - 1) {
                out[r - k + 1] = nums[dq.peekFirst()];
            }
        }

        return out;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'every index is pushed exactly once and popped at most once, so the inner whiles are amortised O(1)',
    space: 'O(k)', spaceWhy: 'the deque never holds more than k indexes'
  },
  testCases: [
    { input: { nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 }, expected: '[3, 3, 5, 5, 6, 7]' },
    { input: { nums: [1], k: 1 }, expected: '[1]' },
    { input: { nums: [9, 11], k: 2 }, expected: '[11]' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(java.util.Arrays.toString(s.maxSlidingWindow(new int[]{1, 3, -1, -3, 5, 3, 6, 7}, 3)));
        System.out.println(java.util.Arrays.toString(s.maxSlidingWindow(new int[]{1}, 1)));
        System.out.println(java.util.Arrays.toString(s.maxSlidingWindow(new int[]{9, 11}, 2)));
    }
}`,
  commonMistakes: [
    'Storing values instead of indexes, which leaves you unable to tell when something has slid out of the window.',
    'Using `dq.peekFirst() < r - k` instead of `<=`, which keeps one stale index alive.',
    'Comparing with `<` rather than `<=` when popping the back. Equal values are also dead, and keeping them wastes space without being wrong.',
    'Reaching for a `PriorityQueue`. It gives O(n log k) and needs lazy deletion, because removing an arbitrary element from a heap is O(n).',
    'Re-scanning the window for its maximum, which is O(n·k) and times out.'
  ],
  followUps: [
    'The Stack pattern (next) is built entirely on this monotonic idea, and Daily Temperatures is the same trick without the window.',
    'Sliding Window Minimum is the identical code with the comparison flipped.',
    'Shortest Subarray with Sum at Least K needs this deque over prefix sums, which is what makes Minimum Size Subarray Sum work with negative values.'
  ]
}

);
