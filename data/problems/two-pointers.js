/* data/problems/two-pointers.js
 *
 * Problems for the "two-pointers" pattern. Schema: data/problems/_SCHEMA.md
 * Adding a problem here is the ONLY thing needed to make it appear in the app.
 *
 * Target mix: 8 Easy, 3 Medium, 1 Hard.
 * Sequenced so the ideas stack: inward walking, then slow/fast writing, then
 * two arrays at once, then an anchor plus an inward pair, then the two-max trick.
 */
(window.LC_PROBLEMS = window.LC_PROBLEMS || []).push(

{
  id: 'valid-palindrome',
  leetcodeNumber: 125,
  title: 'Valid Palindrome',
  url: 'https://leetcode.com/problems/valid-palindrome/',
  pattern: 'two-pointers',
  difficulty: 'Easy',
  order: 1,
  tags: ['inward', 'string', 'filtering'],
  problemSummary: 'Ignoring case and skipping anything that is not a letter or digit, decide whether the string reads the same forwards and backwards.',
  examples: [
    { input: 's = "A man, a plan, a canal: Panama"', output: 'true', note: 'Reduces to "amanaplanacanalpanama".' },
    { input: 's = "race a car"', output: 'false', note: 'Reduces to "raceacar", which is not a palindrome.' },
    { input: 's = " "', output: 'true', note: 'Nothing survives the filter, and an empty string is a palindrome.' }
  ],
  constraints: ['1 <= s.length <= 2 * 10^5', 's consists of printable ASCII characters'],
  techniqueNote: 'inward walking. Compare the ends, step inward, and skip junk on the way.',
  signals: [
    'The word **palindrome**, or any "compare the ends and work inwards".',
    'You were about to build a cleaned copy of the string and reverse it. Two pointers does it without allocating anything.',
    'O(1) extra space is achievable, which a reversed copy is not.'
  ],
  intuition: {
    input: 's = "a,b a"',
    visual:
      'a  ,  b     a\n' +
      '^           ^      l=0 (a), r=4 (a)  ->  match, step both inward\n' +
      '   ^     ^         l=1 is a comma: skip it, l++\n' +
      '      ^  ^         l=2 (b), r=3 (space): skip the space, r--\n' +
      '      ^^           l=2, r=2, so l is no longer < r. Done: true',
    steps: [
      { state: 'l=0, r=4', say: 'Both ends hold `a`. They match, so step both inward.' },
      { state: 'l=1, r=3', say: '`l` is on a comma. That is not a letter or digit, so advance `l` without comparing anything.' },
      { state: 'l=2, r=3', say: '`r` is on a space. Same treatment: pull `r` back.' },
      { state: 'l=2, r=2', say: 'The pointers have met. Everything compared matched, so the answer is `true`.' },
      { state: '', say: 'The skipping happens in inner `while` loops, not `if`s, because there can be several junk characters in a row.' }
    ],
    takeaway: 'Two pointers plus a skip rule handles "compare the ends, but only the characters that count" with no extra memory.'
  },
  hints: [
    'A palindrome means position 0 matches the last position, 1 matches the second last, and so on. What two variables does that suggest?',
    'Walk `l` up from the start and `r` down from the end. Before comparing, advance each past anything that is not a letter or digit, and lower-case both before the comparison.',
    'Pseudo-code: `while l < r: while l < r and not alnum(s[l]): l++; while l < r and not alnum(s[r]): r--; if lower(s[l]) != lower(s[r]) return false; l++; r--`'
  ],
  methodSignature: 'public boolean isPalindrome(String s)',
  javaTemplate: 'two-pointers-inward',
  javaSolution: `class Solution {
    public boolean isPalindrome(String s) {
        int l = 0;
        int r = s.length() - 1;

        while (l < r) {
            // Skip junk on the left. A while, not an if: ", , ," is possible.
            // The l < r guard stops these loops running off the end.
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) {
                l++;
            }
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) {
                r--;
            }

            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) {
                return false;
            }

            l++;
            r--;
        }

        return true;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'each pointer only ever moves toward the other, so together they cover the string once',
    space: 'O(1)', spaceWhy: 'two integers. Building a cleaned copy would be O(n).'
  },
  testCases: [
    { input: { s: 'A man, a plan, a canal: Panama' }, expected: 'true' },
    { input: { s: 'race a car' }, expected: 'false' },
    { input: { s: ' ' }, expected: 'true' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.isPalindrome("A man, a plan, a canal: Panama"));
        System.out.println(s.isPalindrome("race a car"));
        System.out.println(s.isPalindrome(" "));
    }
}`,
  commonMistakes: [
    'Using `if` instead of `while` for the skips, which fails on two punctuation marks in a row.',
    'Omitting the `l < r` guard inside the skip loops. On a string of pure punctuation, `l` runs past the end and `charAt` throws.',
    'Forgetting to lower-case, so `"Aa"` reports false.',
    'Building `s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase()` and comparing to its reverse. It is correct and short, and it costs O(n) memory plus two extra passes.'
  ],
  followUps: [
    'Valid Palindrome II allows deleting exactly one character. On the first mismatch, try skipping the left one or the right one and check whether either remainder is a palindrome.',
    'Palindrome Linked List is this idea with no random access, so you find the middle and reverse half the list.'
  ]
},

{
  id: 'reverse-string',
  leetcodeNumber: 344,
  title: 'Reverse String',
  url: 'https://leetcode.com/problems/reverse-string/',
  pattern: 'two-pointers',
  difficulty: 'Easy',
  order: 2,
  tags: ['inward', 'in-place', 'swap'],
  problemSummary: 'Reverse a character array **in place**, using O(1) extra memory. Nothing is returned; the caller sees the array you mutated.',
  examples: [
    { input: 's = [\'h\',\'e\',\'l\',\'l\',\'o\']', output: '[\'o\',\'l\',\'l\',\'e\',\'h\']', note: 'The same array object, rearranged.' },
    { input: 's = [\'H\',\'a\',\'n\',\'n\',\'a\',\'h\']', output: '[\'h\',\'a\',\'n\',\'n\',\'a\',\'H\']', note: 'Case is preserved, so this is not a palindrome after reversal.' }
  ],
  constraints: ['1 <= s.length <= 10^5', 's[i] is a printable ASCII character', 'You must do this in place with O(1) extra memory'],
  techniqueNote: 'inward walking again, but swapping instead of comparing. Same skeleton, different body.',
  signals: [
    '**In place** plus **O(1) extra memory** rules out building a second array.',
    'Reverse, mirror, or swap the ends. Two pointers walking inward is the whole answer.',
    'You only need to run until the pointers meet, because past the middle you would undo your own swaps.'
  ],
  intuition: {
    input: "s = ['a','b','c','d']",
    visual:
      "a  b  c  d\n" +
      "^        ^      swap a and d  ->  d  b  c  a\n" +
      "   ^  ^         swap b and c  ->  d  c  b  a\n" +
      "     ><         l passed r, stop",
    steps: [
      { state: 'l=0, r=3', say: 'Swap the outermost pair. That places two characters correctly in one move.' },
      { state: 'l=1, r=2', say: 'Swap the next pair inward. Now everything is placed.' },
      { state: 'l=2, r=1', say: '`l` is no longer less than `r`, so stop. Continuing would swap the same pairs back.' }
    ],
    takeaway: 'One swap fixes two positions, so the loop only runs n/2 times, and it must stop at the middle.'
  },
  hints: [
    'Which character ends up at index 0? Which ends up at the last index? Can you place both in a single operation?',
    'Two pointers at the ends. Swap, then move both inward. Stop as soon as they meet or cross.',
    'Pseudo-code: `l = 0; r = n - 1; while l < r: swap(s[l], s[r]); l++; r--`'
  ],
  methodSignature: 'public void reverseString(char[] s)',
  javaTemplate: 'two-pointers-inward',
  javaSolution: `class Solution {
    public void reverseString(char[] s) {
        int l = 0;
        int r = s.length - 1;

        while (l < r) {
            // Java has no tuple swap, so a temporary is required.
            char tmp = s[l];
            s[l] = s[r];
            s[r] = tmp;

            l++;
            r--;
        }
        // Nothing is returned: arrays are objects, so the caller sees the change.
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'n/2 swaps, and constants are dropped',
    space: 'O(1)', spaceWhy: 'two indexes and one char of scratch space'
  },
  testCases: [
    { input: { s: 'hello' }, expected: 'olleh' },
    { input: { s: 'Hannah' }, expected: 'hannaH' },
    { input: { s: 'a' }, expected: 'a' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(reversed(sol, "hello"));
        System.out.println(reversed(sol, "Hannah"));
        System.out.println(reversed(sol, "a"));
    }

    static String reversed(Solution sol, String text) {
        char[] arr = text.toCharArray();
        sol.reverseString(arr);
        return new String(arr);
    }
}`,
  commonMistakes: [
    'Looping `l <= r` or all the way to `n - 1`, which reverses the array and then reverses it back.',
    'Trying `s[l] = s[r]; s[r] = s[l];` without a temporary. The first line has already destroyed `s[l]`.',
    'Returning a new array. The signature is `void` for a reason: the test checks the array you were handed.',
    'Reaching for `new StringBuilder(new String(s)).reverse()`, which allocates and breaks the O(1) requirement.'
  ],
  followUps: [
    'Reverse Words in a String III applies this per word, using the space positions as boundaries.',
    'The same swap loop reverses a sub-range, which is how in-place array rotation works.'
  ]
},

{
  id: 'merge-sorted-array',
  leetcodeNumber: 88,
  title: 'Merge Sorted Array',
  url: 'https://leetcode.com/problems/merge-sorted-array/',
  pattern: 'two-pointers',
  difficulty: 'Easy',
  order: 3,
  tags: ['two-arrays', 'in-place', 'backwards'],
  problemSummary: 'Two sorted arrays. The first has `m` real values followed by exactly `n` empty slots. Merge the second array into the first, in place, keeping everything sorted.',
  examples: [
    { input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', output: '[1,2,2,3,5,6]', note: 'The three zeros were placeholders.' },
    { input: 'nums1 = [1], m = 1, nums2 = [], n = 0', output: '[1]', note: 'Nothing to merge.' },
    { input: 'nums1 = [0], m = 0, nums2 = [1], n = 1', output: '[1]', note: 'nums1 has no real values at all.' }
  ],
  constraints: ['nums1.length == m + n', 'nums2.length == n', '0 <= m, n <= 200', '-10^9 <= nums1[i], nums2[j] <= 10^9'],
  techniqueNote: 'two pointers over two arrays, walking **backwards**. Writing from the front would overwrite values you still need.',
  signals: [
    'Two already-sorted inputs to combine. One pointer per input.',
    '**In place** with spare room at the END of the destination. That spare room is a hint about direction.',
    'You tried it front to front and had to shift elements. Reversing the direction removes the shifting.'
  ],
  intuition: {
    input: 'nums1 = [1,2,3,_,_,_], m = 3, nums2 = [2,5,6], n = 3',
    visual:
      'i points at the last real value in nums1, j at the last in nums2,\n' +
      'write at the last slot overall.\n' +
      '\n' +
      'nums1  1  2  3  _  _  _        i=2 (3), j=2 (6), write=5\n' +
      '6 > 3, so take 6              1  2  3  _  _  6     j=1, write=4\n' +
      '5 > 3, so take 5              1  2  3  _  5  6     j=0, write=3\n' +
      '3 > 2, so take 3              1  2  3  3  5  6     i=1, write=2\n' +
      '2 vs 2, take from nums2       1  2  2  3  5  6     j<0, done',
    steps: [
      { state: '', say: 'Front to front looks natural and then hurts: writing to `nums1[0]` would clobber a value you have not merged yet.' },
      { state: 'i=2, j=2, write=5', say: 'Go backwards instead. The largest remaining value goes in the last free slot, and that slot is always beyond anything still unread.' },
      { state: 'write=4', say: '`6` beats `3`, so `6` is written and `j` moves back.' },
      { state: 'write=2', say: 'Continue taking the larger of the two tails. Ties can go either way; the result is still sorted.' },
      { state: 'j < 0', say: 'Stop when `nums2` is exhausted. Anything left in `nums1` is already in the right place, so there is nothing more to do.' }
    ],
    takeaway: 'When merging into the array that also holds one of the inputs, fill from the back. The write pointer can never catch the read pointers.'
  },
  hints: [
    'If you write the smallest value into `nums1[0]`, what happens to the value that was already there?',
    'Start all three pointers at the end: the last real value of each input, and the last slot of `nums1`. Copy the larger of the two, and step that pointer back.',
    'Pseudo-code: `i = m-1; j = n-1; write = m+n-1; while j >= 0: if i >= 0 and nums1[i] > nums2[j]: nums1[write--] = nums1[i--] else nums1[write--] = nums2[j--]`'
  ],
  methodSignature: 'public void merge(int[] nums1, int m, int[] nums2, int n)',
  javaTemplate: 'two-pointers-inward',
  javaSolution: `class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1;              // last real value in nums1
        int j = n - 1;              // last value in nums2
        int write = m + n - 1;      // last slot overall

        // Loop on j only. Once nums2 is exhausted, whatever is left in nums1 is
        // already sorted and already sitting in the correct place.
        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j]) {
                nums1[write] = nums1[i];
                i--;
            } else {
                nums1[write] = nums2[j];
                j--;
            }
            write--;
        }
    }
}
`,
  complexity: {
    time: 'O(m + n)', timeWhy: 'every value is written exactly once, and nothing is ever shifted',
    space: 'O(1)', spaceWhy: 'three indexes; the merge happens inside the array you were given'
  },
  testCases: [
    { input: { nums1: [1, 2, 3, 0, 0, 0], m: 3, nums2: [2, 5, 6], n: 3 }, expected: '[1, 2, 2, 3, 5, 6]' },
    { input: { nums1: [1], m: 1, nums2: [], n: 0 }, expected: '[1]' },
    { input: { nums1: [0], m: 0, nums2: [1], n: 1 }, expected: '[1]' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(merged(s, new int[]{1, 2, 3, 0, 0, 0}, 3, new int[]{2, 5, 6}, 3));
        System.out.println(merged(s, new int[]{1}, 1, new int[]{}, 0));
        System.out.println(merged(s, new int[]{0}, 0, new int[]{1}, 1));
    }

    static String merged(Solution s, int[] a, int m, int[] b, int n) {
        s.merge(a, m, b, n);
        return java.util.Arrays.toString(a);
    }
}`,
  commonMistakes: [
    'Merging front to front, which overwrites unread values in `nums1`.',
    'Forgetting the `i >= 0` guard. When `nums1` has no real values (`m = 0`), `nums1[-1]` throws.',
    'Looping while `i >= 0 || j >= 0`. Harmless but pointless: leftover `nums1` values are already positioned.',
    'Copying `nums2` in and calling `Arrays.sort`. It passes, and it is O((m+n) log(m+n)) instead of linear.'
  ],
  followUps: [
    'Merge Two Sorted Lists is the same merge on linked lists, where a dummy head replaces the write index.',
    'This backwards-write trick reappears in any in-place merge, including the merge step of merge sort done in place.'
  ]
},

{
  id: 'remove-duplicates-sorted-array',
  leetcodeNumber: 26,
  title: 'Remove Duplicates from Sorted Array',
  url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
  pattern: 'two-pointers',
  difficulty: 'Easy',
  order: 4,
  tags: ['slow-fast', 'in-place', 'sorted'],
  problemSummary: 'The array is sorted. Remove duplicates in place so each value appears once, keeping the relative order, and return the number of unique values `k`. Only the first `k` positions are checked.',
  examples: [
    { input: 'nums = [1,1,2]', output: 'k = 2, nums starts [1,2]', note: 'Whatever sits past index 1 is ignored.' },
    { input: 'nums = [0,0,1,1,1,2,2,3,3,4]', output: 'k = 5, nums starts [0,1,2,3,4]', note: 'Five distinct values.' }
  ],
  constraints: ['1 <= nums.length <= 3 * 10^4', '-100 <= nums[i] <= 100', 'nums is sorted in non-decreasing order'],
  techniqueNote: 'the slow/fast shape: `write` marks where the next kept value goes, `read` scans ahead.',
  signals: [
    '**In place** removal or compaction, with the tail allowed to be garbage.',
    'The input is **sorted**, so duplicates are adjacent. That is what makes a single comparison enough.',
    'You return a length rather than a new array. The caller only looks at the prefix you built.'
  ],
  intuition: {
    input: 'nums = [1,1,2]',
    visual:
      'write is the size of the answer so far. read scans.\n' +
      '\n' +
      '  1  1  2      write=1, read=1: nums[1]==nums[0], duplicate, skip\n' +
      '  1  1  2      write=1, read=2: nums[2]=2 differs from nums[0]=1, keep it\n' +
      '  1  2  2      write becomes 2. Answer: k=2, prefix [1,2]',
    steps: [
      { state: 'write=1, read=1', say: 'The first element is always unique, so start `write` at 1 and `read` at 1.' },
      { state: '', say: 'Compare `nums[read]` with `nums[write - 1]`, the last value you decided to keep. Equal means duplicate, so just move `read`.' },
      { state: 'read=2', say: '`2` differs from the last kept value, so copy it to position `write` and increase `write`.' },
      { state: 'write=2', say: '`write` is now both the next free slot and the count of unique values, which is why it is the return value.' }
    ],
    takeaway: 'Compare against the last value you KEPT, not against `nums[read - 1]`. Those are different once you start overwriting.'
  },
  hints: [
    'The array is sorted, so where are the duplicates relative to each other?',
    'Keep two indexes. `read` looks at every element; `write` is where the next kept value goes. Copy only when `nums[read]` differs from the last value you kept.',
    'Pseudo-code: `write = 1; for read in 1..n-1: if nums[read] != nums[write-1]: nums[write] = nums[read]; write++; return write`'
  ],
  methodSignature: 'public int removeDuplicates(int[] nums)',
  javaTemplate: 'two-pointers-inward',
  javaSolution: `class Solution {
    public int removeDuplicates(int[] nums) {
        if (nums.length == 0) {
            return 0;
        }

        // nums[0] is always kept, so the answer already has one element.
        int write = 1;

        for (int read = 1; read < nums.length; read++) {
            // Compare against the last value we KEPT, which lives at write-1.
            // Comparing with nums[read-1] breaks once we start overwriting.
            if (nums[read] != nums[write - 1]) {
                nums[write] = nums[read];
                write++;
            }
        }

        return write;   // also the count of unique values
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'one pass; `read` never goes backwards',
    space: 'O(1)', spaceWhy: 'two indexes, and the array is compacted in place'
  },
  testCases: [
    { input: { nums: [1, 1, 2] }, expected: '2 [1, 2]' },
    { input: { nums: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4] }, expected: '5 [0, 1, 2, 3, 4]' },
    { input: { nums: [7] }, expected: '1 [7]' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(run(s, new int[]{1, 1, 2}));
        System.out.println(run(s, new int[]{0, 0, 1, 1, 1, 2, 2, 3, 3, 4}));
        System.out.println(run(s, new int[]{7}));
    }

    static String run(Solution s, int[] nums) {
        int k = s.removeDuplicates(nums);
        int[] prefix = java.util.Arrays.copyOf(nums, k);
        return k + " " + java.util.Arrays.toString(prefix);
    }
}`,
  commonMistakes: [
    'Comparing `nums[read]` with `nums[read - 1]`. It works here by luck on some inputs and is the wrong mental model: once you overwrite, `read - 1` is not necessarily a kept value.',
    'Starting `write` at 0, which drops the first element or compares against `nums[-1]`.',
    'Trying to actually delete elements, or to fix up the tail. The problem only inspects the first `k` slots.',
    'Using a `LinkedHashSet` and copying back. Correct, and it throws away the O(1) space that being sorted buys you.'
  ],
  followUps: [
    'Remove Duplicates II allows each value at most twice: compare against `nums[write - 2]` instead.',
    'Remove Element (LeetCode 27) is the same skeleton with a value test rather than a neighbour test.'
  ]
},

{
  id: 'move-zeroes',
  leetcodeNumber: 283,
  title: 'Move Zeroes',
  url: 'https://leetcode.com/problems/move-zeroes/',
  pattern: 'two-pointers',
  difficulty: 'Easy',
  order: 5,
  tags: ['slow-fast', 'in-place', 'stable'],
  problemSummary: 'Move every zero to the end of the array while keeping the non-zero values in their original relative order. Do it in place.',
  examples: [
    { input: 'nums = [0,1,0,3,12]', output: '[1,3,12,0,0]', note: '1, 3, 12 keep their order.' },
    { input: 'nums = [0]', output: '[0]', note: 'Nothing to do.' }
  ],
  constraints: ['1 <= nums.length <= 10^4', '-2^31 <= nums[i] <= 2^31 - 1', 'You must do this in place without copying the array'],
  techniqueNote: 'slow/fast again, but **swapping** rather than copying, which pushes the zeros backwards for free.',
  signals: [
    'Partition into "keep these" and "shove those to the end", with the order of the kept ones preserved.',
    '**In place**, so no output array.',
    'Same skeleton as Remove Duplicates: one pointer decides where kept values land, the other scans.'
  ],
  intuition: {
    input: 'nums = [0,1,0,3,12]',
    visual:
      'write = next slot for a non-zero value\n' +
      '\n' +
      '  0  1  0  3 12    read=0: zero, skip. write stays 0\n' +
      '  1  0  0  3 12    read=1: nonzero, swap with slot 0. write=1\n' +
      '  1  0  0  3 12    read=2: zero, skip\n' +
      '  1  3  0  0 12    read=3: nonzero, swap with slot 1. write=2\n' +
      '  1  3 12  0  0    read=4: nonzero, swap with slot 2. write=3',
    steps: [
      { state: 'write=0, read=0', say: 'A zero at `read`, so nothing is kept and `write` does not move.' },
      { state: 'write=0, read=1', say: 'A non-zero. Swap it into slot `write`. The swap sends the zero that was there out to where `read` is, which is exactly where zeros should be heading.' },
      { state: 'write=1', say: 'Advance `write` only when something was kept.' },
      { state: '', say: 'Because you always swap forwards and never reorder the non-zeros among themselves, their relative order survives.' },
      { state: '[1,3,12,0,0]', say: 'When `read` reaches the end, every non-zero is packed at the front and every zero has been pushed behind them.' }
    ],
    takeaway: 'Copying would need a second pass to fill zeros. Swapping does both jobs at once, because the value you displace is always a zero.'
  },
  hints: [
    'Ignore the zeros for a second. If you only had to pack the non-zero values at the front, what would you write?',
    'Slow pointer `write` for the next non-zero slot, fast pointer `read` scanning. On a non-zero, swap `nums[write]` with `nums[read]` and advance `write`.',
    'Pseudo-code: `write = 0; for read in 0..n-1: if nums[read] != 0: swap(nums[write], nums[read]); write++`'
  ],
  methodSignature: 'public void moveZeroes(int[] nums)',
  javaTemplate: 'two-pointers-inward',
  javaSolution: `class Solution {
    public void moveZeroes(int[] nums) {
        int write = 0;   // next slot that should hold a non-zero value

        for (int read = 0; read < nums.length; read++) {
            if (nums[read] != 0) {
                // Swap rather than copy. Whatever sits at write is either a zero
                // or read itself, so the zeros drift to the back with no second pass.
                int tmp = nums[write];
                nums[write] = nums[read];
                nums[read] = tmp;

                write++;
            }
        }
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'one pass, with at most one swap per element',
    space: 'O(1)', spaceWhy: 'two indexes and a temporary'
  },
  testCases: [
    { input: { nums: [0, 1, 0, 3, 12] }, expected: '[1, 3, 12, 0, 0]' },
    { input: { nums: [0] }, expected: '[0]' },
    { input: { nums: [1, 2, 3] }, expected: '[1, 2, 3]' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(run(s, new int[]{0, 1, 0, 3, 12}));
        System.out.println(run(s, new int[]{0}));
        System.out.println(run(s, new int[]{1, 2, 3}));
    }

    static String run(Solution s, int[] nums) {
        s.moveZeroes(nums);
        return java.util.Arrays.toString(nums);
    }
}`,
  commonMistakes: [
    'Advancing `write` on every iteration instead of only when a value is kept. Then it just tracks `read` and nothing moves.',
    'Swapping the non-zero values with each other and destroying the required stable order, usually by pairing a front pointer with a back pointer.',
    'Copying forwards and forgetting the second loop that zero-fills the tail. Swapping avoids needing that loop at all.',
    'Removing and re-adding elements in a `List`, which is O(n²) because of the shifting.'
  ],
  followUps: [
    'Sort Colors (later in this pattern) is the three-way version of this partition.',
    'If order did not matter, you could swap from both ends and finish in fewer writes.'
  ]
},

{
  id: 'two-sum-ii-sorted',
  leetcodeNumber: 167,
  title: 'Two Sum II - Input Array Is Sorted',
  url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
  pattern: 'two-pointers',
  difficulty: 'Easy',
  order: 6,
  tags: ['inward', 'sorted', 'pair-sum'],
  problemSummary: 'The array is sorted in non-decreasing order. Find the two values that add up to the target and return their **1-based** positions. Exactly one solution exists, and you must use O(1) extra space.',
  examples: [
    { input: 'numbers = [2,7,11,15], target = 9', output: '[1,2]', note: '2 + 7 = 9, at positions 1 and 2 counting from one.' },
    { input: 'numbers = [2,3,4], target = 6', output: '[1,3]', note: '2 + 4 = 6.' },
    { input: 'numbers = [-1,0], target = -1', output: '[1,2]', note: 'Negative values work the same way.' }
  ],
  constraints: ['2 <= numbers.length <= 3 * 10^4', '-1000 <= numbers[i] <= 1000', 'numbers is sorted in non-decreasing order', 'Exactly one solution exists', 'Your solution must use only O(1) extra space'],
  techniqueNote: 'this is Two Sum with the array sorted, which replaces the hash map with two pointers and drops the memory to O(1).',
  signals: [
    '**Sorted array plus find a pair.** This is the single loudest two-pointers signal there is.',
    'O(1) extra space is demanded, which rules out the hash map you used in Two Sum.',
    'Sortedness turns a comparison into a direction: too small means raise the low end, too big means lower the high end.'
  ],
  intuition: {
    input: 'numbers = [2,3,4], target = 6',
    visual:
      'consider the sum of the two ends and nothing else\n' +
      '\n' +
      '  2  3  4       l=0, r=2: 2 + 4 = 6 == target  ->  answer [1, 3]\n' +
      '\n' +
      'had it been target = 5:\n' +
      '  2  3  4       2 + 4 = 6, too big. The only way DOWN is r--\n' +
      '  2  3  4       2 + 3 = 5  ->  found\n' +
      '     ^  x',
    steps: [
      { state: 'l=0, r=2', say: 'Add the two ends: `2 + 4 = 6`. That equals the target, so the answer is positions 1 and 3.' },
      { state: '', say: 'Now the part worth understanding. Suppose the sum had been too small. `numbers[r]` is already the largest value available, so pairing anything with it and going smaller is hopeless. The only way to increase the sum is `l++`.' },
      { state: '', say: 'Symmetrically, if the sum is too big, `numbers[l]` is already the smallest, so the only way down is `r--`.' },
      { state: '', say: 'Each step therefore eliminates an entire row or column of the brute-force pair table, which is why this is O(n) and not O(n²).' }
    ],
    takeaway: 'On a sorted array, one comparison tells you which pointer to move. That is what makes two pointers a proof and not a guess.'
  },
  hints: [
    'You solved Two Sum with a hash map. Here the memory budget is O(1). What does being sorted let you do instead?',
    'Point at both ends and add them. If the sum is too small the low value must grow, so `l++`. If it is too big the high value must shrink, so `r--`.',
    'Pseudo-code: `l = 0; r = n-1; while l < r: sum = a[l] + a[r]; if sum == t return {l+1, r+1}; if sum < t: l++ else: r--`'
  ],
  methodSignature: 'public int[] twoSum(int[] numbers, int target)',
  javaTemplate: 'two-pointers-inward',
  javaSolution: `class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int l = 0;
        int r = numbers.length - 1;

        while (l < r) {
            int sum = numbers[l] + numbers[r];

            if (sum == target) {
                // The problem is 1-indexed, so add one to both.
                return new int[] { l + 1, r + 1 };
            }

            if (sum < target) {
                l++;    // numbers[r] is already the largest option, so raise the low end
            } else {
                r--;    // numbers[l] is already the smallest option, so lower the high end
            }
        }

        return new int[0];   // the problem promises this is unreachable
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'the pointers only move toward each other, so together they take at most n steps',
    space: 'O(1)', spaceWhy: 'two indexes, which is why this beats the hash-map version of Two Sum'
  },
  testCases: [
    { input: { numbers: [2, 7, 11, 15], target: 9 }, expected: '[1, 2]' },
    { input: { numbers: [2, 3, 4], target: 6 }, expected: '[1, 3]' },
    { input: { numbers: [-1, 0], target: -1 }, expected: '[1, 2]' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(java.util.Arrays.toString(s.twoSum(new int[]{2, 7, 11, 15}, 9)));
        System.out.println(java.util.Arrays.toString(s.twoSum(new int[]{2, 3, 4}, 6)));
        System.out.println(java.util.Arrays.toString(s.twoSum(new int[]{-1, 0}, -1)));
    }
}`,
  commonMistakes: [
    'Returning 0-based indexes. This problem is 1-based, unlike Two Sum.',
    'Moving both pointers on a mismatch. Only one of them is justified, and moving both can step over the answer.',
    'Using `l <= r`, which lets an element pair with itself.',
    'Reusing the hash map from Two Sum. It gives the right answer and violates the stated O(1) space constraint.'
  ],
  followUps: [
    'Binary search the complement for each element: O(n log n), still O(1) space, and strictly worse than two pointers.',
    '3Sum (next) is this exact loop wrapped in an outer anchor loop.'
  ]
},

{
  id: 'squares-of-sorted-array',
  leetcodeNumber: 977,
  title: 'Squares of a Sorted Array',
  url: 'https://leetcode.com/problems/squares-of-a-sorted-array/',
  pattern: 'two-pointers',
  difficulty: 'Easy',
  order: 7,
  tags: ['inward', 'sorted', 'backwards-write'],
  problemSummary: 'Given an array sorted in non-decreasing order that may contain negatives, return an array of the squares of each number, sorted in non-decreasing order.',
  examples: [
    { input: 'nums = [-4,-1,0,3,10]', output: '[0,1,9,16,100]', note: 'Squaring destroys the ordering, because -4 squares to 16.' },
    { input: 'nums = [-7,-3,2,3,11]', output: '[4,9,9,49,121]', note: 'Duplicates in the output are fine.' }
  ],
  constraints: ['1 <= nums.length <= 10^4', '-10^4 <= nums[i] <= 10^4', 'nums is sorted in non-decreasing order'],
  techniqueNote: 'inward pointers plus a backwards write. The largest square is always at one END, never in the middle.',
  signals: [
    'Sorted input whose order is broken by a transformation. Ask where the extremes went, not where the middle went.',
    'The **biggest** value is at one of the two ends, so you can produce the output back to front.',
    'You wanted to square everything and sort. That is O(n log n) when O(n) is available.'
  ],
  intuition: {
    input: 'nums = [-4,-1,0,3,10]',
    visual:
      'squares:  16  1  0  9  100     sorted input, unsorted squares\n' +
      '           ^              ^     the LARGEST square is at one end\n' +
      '\n' +
      'compare 16 vs 100 -> 100 is bigger, write it last          [_,_,_,_,100]\n' +
      'compare 16 vs 9   -> 16                                    [_,_,_,16,100]\n' +
      'compare 1  vs 9   -> 9                                     [_,_,9,16,100]\n' +
      'compare 1  vs 0   -> 1                                     [_,1,9,16,100]\n' +
      'only 0 remains                                             [0,1,9,16,100]',
    steps: [
      { state: '', say: 'Squaring makes the negatives large, so the sorted order is destroyed in the middle. But the extremes are still at the ends: the biggest square comes from either the most negative or the most positive value.' },
      { state: 'l=0, r=4', say: 'Compare `(-4)² = 16` against `10² = 100`. The bigger one is the largest square overall, so it goes in the LAST output slot.' },
      { state: 'write=3', say: 'Move the pointer you consumed inward and repeat. Each comparison places exactly one output value.' },
      { state: 'write=0', say: 'Fill the output from the back to the front. When the pointers meet, the array is full.' }
    ],
    takeaway: 'Whenever the largest remaining value is guaranteed to be at one of two ends, you can fill the output backwards in one pass.'
  },
  hints: [
    'Where in the SQUARED array is the largest value? It is not in the middle. Why not?',
    'Two pointers at the ends. Compare the two squares, put the larger one at the end of the output, and step that pointer inward. Fill the output right to left.',
    'Pseudo-code: `l = 0; r = n-1; for write = n-1 down to 0: if a[l]² > a[r]²: out[write] = a[l]²; l++ else out[write] = a[r]²; r--`'
  ],
  methodSignature: 'public int[] sortedSquares(int[] nums)',
  javaTemplate: 'two-pointers-inward',
  javaSolution: `class Solution {
    public int[] sortedSquares(int[] nums) {
        int n = nums.length;
        int[] out = new int[n];

        int l = 0;
        int r = n - 1;

        // Fill from the back, because the value we can identify with certainty
        // on each step is the LARGEST remaining one.
        for (int write = n - 1; write >= 0; write--) {
            int leftSquare = nums[l] * nums[l];
            int rightSquare = nums[r] * nums[r];

            if (leftSquare > rightSquare) {
                out[write] = leftSquare;
                l++;
            } else {
                out[write] = rightSquare;
                r--;
            }
        }

        return out;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'exactly n comparisons, one per output slot. Squaring then sorting would be O(n log n).',
    space: 'O(n)', spaceWhy: 'the output array, which the problem requires. No other allocation.'
  },
  testCases: [
    { input: { nums: [-4, -1, 0, 3, 10] }, expected: '[0, 1, 9, 16, 100]' },
    { input: { nums: [-7, -3, 2, 3, 11] }, expected: '[4, 9, 9, 49, 121]' },
    { input: { nums: [-1] }, expected: '[1]' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(java.util.Arrays.toString(s.sortedSquares(new int[]{-4, -1, 0, 3, 10})));
        System.out.println(java.util.Arrays.toString(s.sortedSquares(new int[]{-7, -3, 2, 3, 11})));
        System.out.println(java.util.Arrays.toString(s.sortedSquares(new int[]{-1})));
    }
}`,
  commonMistakes: [
    'Filling the output front to back. You cannot identify the SMALLEST square from the ends, only the largest.',
    'Comparing `nums[l]` with `nums[r]` instead of their squares. `-4 < 10` but `16 > 100` is false, and using the raw values gets the ordering wrong.',
    'Using `while (l < r)`, which stops one element early. Every slot needs filling, so loop until `l > r` or drive the loop from `write`.',
    'Squaring into the input array and calling `Arrays.sort`. Correct, and it gives up the linear time this problem exists to teach.'
  ],
  followUps: [
    'You could binary search for the first non-negative index and then merge the two halves outwards. Same complexity, more code.',
    'The backwards-write idea is the same one that makes Merge Sorted Array work in place.'
  ]
},

{
  id: 'is-subsequence',
  leetcodeNumber: 392,
  title: 'Is Subsequence',
  url: 'https://leetcode.com/problems/is-subsequence/',
  pattern: 'two-pointers',
  difficulty: 'Easy',
  order: 8,
  tags: ['two-sequences', 'same-direction', 'string'],
  problemSummary: 'Decide whether `s` can be formed from `t` by deleting some characters without reordering the rest.',
  examples: [
    { input: 's = "abc", t = "ahbgdc"', output: 'true', note: 'Delete h, g and d.' },
    { input: 's = "axc", t = "ahbgdc"', output: 'false', note: 'There is no x in t.' },
    { input: 's = "", t = "abc"', output: 'true', note: 'The empty string is a subsequence of anything.' }
  ],
  constraints: ['0 <= s.length <= 100', '0 <= t.length <= 10^4', 'Both consist only of lowercase English letters'],
  techniqueNote: 'two pointers moving in the SAME direction over two different strings. One advances conditionally, the other always.',
  signals: [
    'The word **subsequence**: order preserved, gaps allowed. Not *substring*, which would be contiguous and a sliding window.',
    'You are matching one sequence against another, so one pointer per sequence.',
    'Greedy is provably safe here: taking the earliest possible match never hurts, because it leaves the most of `t` for the rest of `s`.'
  ],
  intuition: {
    input: 's = "abc", t = "ahbgdc"',
    visual:
      't:  a  h  b  g  d  c\n' +
      's:  a     b        c\n' +
      '    ^     ^        ^\n' +
      '\n' +
      'j walks every character of t. i only advances when t[j] matches s[i].\n' +
      'i reached the end of s, so the answer is true.',
    steps: [
      { state: 'i=0 (a), j=0 (a)', say: 'They match, so advance both. One character of `s` is accounted for.' },
      { state: 'i=1 (b), j=1 (h)', say: 'No match. Advance only `j`: that is the "delete this character from `t`" move.' },
      { state: 'i=1 (b), j=2 (b)', say: 'Match again, advance both.' },
      { state: 'i=2 (c), j=3,4 then 5', say: '`g` and `d` do not match, so `j` walks past them. `c` matches at the end.' },
      { state: 'i=3 == s.length()', say: '`i` reached the end of `s`, meaning every character was matched in order. Answer `true`. If `j` had run out first, the answer would be `false`.' },
      { state: '', say: 'Why greedy is safe: matching `s[i]` at the earliest possible position in `t` leaves the largest possible remainder of `t` for the rest of `s`. Waiting can never help.' }
    ],
    takeaway: 'Check `i == s.length()` at the end, not `j`. Running out of `t` is failure, running out of `s` is success.'
  },
  hints: [
    'You are walking two strings at once. Which pointer should move on every step, and which one only sometimes?',
    'Advance `j` through `t` on every iteration. Advance `i` through `s` only when the characters match. At the end, you succeeded if `i` consumed all of `s`.',
    'Pseudo-code: `i = j = 0; while i < s.len and j < t.len: if s[i] == t[j]: i++; j++; return i == s.len`'
  ],
  methodSignature: 'public boolean isSubsequence(String s, String t)',
  javaTemplate: 'two-pointers-inward',
  javaSolution: `class Solution {
    public boolean isSubsequence(String s, String t) {
        int i = 0;   // position in s, the string we are trying to match
        int j = 0;   // position in t, the string we are scanning

        while (i < s.length() && j < t.length()) {
            // Take the earliest match available. Greedy is safe: matching early
            // leaves the most of t for the characters of s that remain.
            if (s.charAt(i) == t.charAt(j)) {
                i++;
            }
            j++;    // j always advances, matched or not
        }

        // Success is "s was fully consumed", not "t was fully consumed".
        return i == s.length();
    }
}
`,
  complexity: {
    time: 'O(n + m)', timeWhy: 'each pointer only moves forward, so the loop runs at most m times',
    space: 'O(1)', spaceWhy: 'two indexes'
  },
  testCases: [
    { input: { s: 'abc', t: 'ahbgdc' }, expected: 'true' },
    { input: { s: 'axc', t: 'ahbgdc' }, expected: 'false' },
    { input: { s: '', t: 'abc' }, expected: 'true' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.isSubsequence("abc", "ahbgdc"));
        System.out.println(s.isSubsequence("axc", "ahbgdc"));
        System.out.println(s.isSubsequence("", "abc"));
    }
}`,
  commonMistakes: [
    'Returning `j == t.length()` instead of `i == s.length()`. That asks whether all of `t` was used, which is a different question.',
    'Advancing `i` unconditionally, which is no longer a subsequence test.',
    'Confusing subsequence with substring. A substring must be contiguous, and that is a sliding window instead.',
    'Reaching for `indexOf` in a loop over `s`. It works if you pass the running offset, and it is easy to get wrong and slower.'
  ],
  followUps: [
    'The stated follow-up: many `s` values against one fixed `t`. Precompute, for every position of `t` and every letter, the next occurrence. Then each query is O(len(s)).',
    'Longest Common Subsequence is the DP generalisation, when you no longer just need yes or no.'
  ]
},

{
  id: 'three-sum',
  leetcodeNumber: 15,
  title: '3Sum',
  url: 'https://leetcode.com/problems/3sum/',
  pattern: 'two-pointers',
  difficulty: 'Medium',
  order: 9,
  tags: ['inward', 'sorted', 'deduplication', 'anchor'],
  problemSummary: 'Find every unique triple of values in the array that sums to zero. Triples that contain the same values in a different order count as the same triple, and the result must not repeat any of them.',
  examples: [
    { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', note: 'Two distinct triples. The second -1 matters for the first triple but must not create a duplicate.' },
    { input: 'nums = [0,1,1]', output: '[]', note: 'No triple sums to zero.' },
    { input: 'nums = [0,0,0]', output: '[[0,0,0]]', note: 'One triple, reported once even though there are three zeros.' }
  ],
  constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
  techniqueNote: 'sort, then fix one value as an **anchor** and run the Two Sum II inward loop on the rest. Sorting also makes de-duplication a simple neighbour check.',
  signals: [
    'A pair problem with one extra element bolted on. Fix the extra one and the rest is a pair problem you already know.',
    '**Unique** triples, and sorting is what makes duplicates adjacent and therefore easy to skip.',
    'n is 3000, so O(n²) is fine and O(n³) is not.'
  ],
  intuition: {
    input: 'nums = [-1,0,1,2,-1,-4]',
    visual:
      'sorted:  -4  -1  -1   0   1   2\n' +
      '\n' +
      'anchor -4:   need pair summing to 4 from [-1,-1,0,1,2]  -> none\n' +
      'anchor -1:   need pair summing to 1 from [-1,0,1,2]\n' +
      '              l=-1, r=2  -> -1+2 = 1  FOUND  [-1,-1,2]\n' +
      '              l=0,  r=1  ->  0+1 = 1  FOUND  [-1,0,1]\n' +
      'anchor -1:   SAME value as the previous anchor -> skip, or we duplicate\n' +
      'anchor  0:   0 > 0 is false, but need pair summing to 0 from [1,2] -> none',
    steps: [
      { state: '', say: 'Sort first. That costs O(n log n), which is free next to the O(n²) main loop, and it buys two things: the inward pointer logic, and adjacency of duplicates.' },
      { state: 'anchor = -4', say: 'Fix the first value. The remaining question is "find a pair in the rest that sums to `+4`", which is exactly Two Sum II.' },
      { state: 'anchor = -1, l, r inward', say: 'For the anchor `-1` the inward loop finds `-1 + 2 = 1` and then `0 + 1 = 1`. Two triples.' },
      { state: '', say: 'After a hit, skip duplicate values on BOTH sides: `while (l < r && nums[l] == nums[l+1]) l++`. Otherwise the same triple is reported again.' },
      { state: 'anchor = second -1', say: 'The next anchor has the same value as the last one. Skipping it is mandatory, or every triple it finds is a repeat.' },
      { state: '', say: 'One optimisation worth having: once the anchor is positive, the smallest possible sum is already above zero, so you can break out entirely.' }
    ],
    takeaway: 'One anchor loop times one linear inward scan is O(n²). Three separate de-duplication skips are needed: one on the anchor, one on `l`, one on `r`.'
  },
  hints: [
    'If someone handed you the first number of the triple, what would be left to solve? Have you solved that already in this pattern?',
    'Sort the array. Loop an anchor index `i`, then run the inward two-pointer loop on `i+1 .. n-1` looking for `-nums[i]`. Skip duplicate anchors, and after every hit skip duplicate values at both pointers.',
    'Pseudo-code: `sort; for i: if i>0 and nums[i]==nums[i-1] continue; l=i+1; r=n-1; while l<r: sum=nums[i]+nums[l]+nums[r]; if sum<0 l++ elif sum>0 r-- else: record; skip dups at l and r; l++; r--`'
  ],
  methodSignature: 'public List<List<Integer>> threeSum(int[] nums)',
  javaTemplate: 'two-pointers-inward',
  javaSolution: `import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Sorting is what makes both the pointer logic and the de-duplication work.
        Arrays.sort(nums);

        List<List<Integer>> out = new ArrayList<>();

        for (int i = 0; i < nums.length - 2; i++) {
            // Everything from here on is >= 0, so the smallest possible sum is
            // already above zero. Nothing left to find.
            if (nums[i] > 0) {
                break;
            }
            // Duplicate anchor: any triple it could find was already found.
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }

            int l = i + 1;
            int r = nums.length - 1;

            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];

                if (sum < 0) {
                    l++;
                } else if (sum > 0) {
                    r--;
                } else {
                    out.add(Arrays.asList(nums[i], nums[l], nums[r]));

                    // Walk both pointers past their duplicates before stepping,
                    // or the very next iteration reports the same triple.
                    while (l < r && nums[l] == nums[l + 1]) {
                        l++;
                    }
                    while (l < r && nums[r] == nums[r - 1]) {
                        r--;
                    }

                    l++;
                    r--;
                }
            }
        }

        return out;
    }
}
`,
  complexity: {
    time: 'O(n²)', timeWhy: 'an O(n) inward scan for each of n anchors. The O(n log n) sort is dominated by it.',
    space: 'O(1)', spaceWhy: 'excluding the output, only indexes. Note that sorting mutates the input.'
  },
  testCases: [
    { input: { nums: [-1, 0, 1, 2, -1, -4] }, expected: '[[-1, -1, 2], [-1, 0, 1]]' },
    { input: { nums: [0, 1, 1] }, expected: '[]' },
    { input: { nums: [0, 0, 0] }, expected: '[[0, 0, 0]]' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        // Sorting the input makes the output order deterministic, so the driver
        // can print the list directly.
        System.out.println(s.threeSum(new int[]{-1, 0, 1, 2, -1, -4}));
        System.out.println(s.threeSum(new int[]{0, 1, 1}));
        System.out.println(s.threeSum(new int[]{0, 0, 0}));
    }
}`,
  commonMistakes: [
    'Forgetting to skip duplicate anchors, which reports `[-1,-1,2]` twice on the first example.',
    'Forgetting to skip duplicates after a hit at `l` and `r`. The inner pointers then land on equal values and report the same triple.',
    'De-duplicating by dumping everything into a `Set<List<Integer>>`. It works, and it hides the fact that you do not understand where the duplicates come from.',
    'Looping `i < nums.length` instead of `nums.length - 2`, so `l` and `r` cross before the pair loop can do anything useful.',
    'Skipping the sort and trying to use two pointers anyway. Without sortedness there is no direction to move in.'
  ],
  followUps: [
    '3Sum Closest keeps a running best distance to the target instead of testing for equality.',
    '4Sum adds a second anchor loop, giving O(n³). The general kSum is a recursion around this same inward core.'
  ]
},

{
  id: 'container-with-most-water',
  leetcodeNumber: 11,
  title: 'Container With Most Water',
  url: 'https://leetcode.com/problems/container-with-most-water/',
  pattern: 'two-pointers',
  difficulty: 'Medium',
  order: 10,
  tags: ['inward', 'greedy-proof', 'geometry'],
  problemSummary: 'Each array value is the height of a vertical line at that index. Pick two lines so that the rectangle they form with the x-axis holds the most water. Return that area. The shorter line sets the height, and the index distance sets the width.',
  examples: [
    { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', note: 'The lines at index 1 and index 8: height min(8,7) = 7, width 7, area 49.' },
    { input: 'height = [1,1]', output: '1', note: 'Height 1, width 1.' }
  ],
  constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
  techniqueNote: 'inward pointers with a proof attached: always move the SHORTER side, because that side cannot possibly do better where it is.',
  signals: [
    'Pick two positions to maximise something that depends on their distance AND on a min or max between them.',
    'n is 10^5, so the O(n²) double loop is too slow and the answer must be linear.',
    'Starting at the widest possible pair and narrowing is the natural move, because width can only shrink from there.'
  ],
  intuition: {
    input: 'height = [1,8,6,2,5,4,8,3,7]',
    visual:
      'index   0  1  2  3  4  5  6  7  8\n' +
      'height  1  8  6  2  5  4  8  3  7\n' +
      '        ^                       ^     min(1,7)=1, width 8, area 8\n' +
      '\n' +
      'the left line is height 1. Any partner it keeps still caps the height at 1,\n' +
      'and the width can only get SMALLER from here. So index 0 is finished.\n' +
      '\n' +
      '           ^                    ^     min(8,7)=7, width 7, area 49',
    steps: [
      { state: 'l=0, r=8', say: 'Start as wide as possible: `min(1, 7) = 1` times width `8`, so area `8`.' },
      { state: '', say: 'Now the key argument. The left line has height 1, the shorter of the two. Whatever partner you give it next, the height is still capped at 1 and the width is strictly smaller than 8. So no pair involving index 0 can ever beat what you just measured. Discard it.' },
      { state: 'l=1, r=8', say: '`min(8, 7) = 7` times width `7` gives `49`. That is the answer for this input.' },
      { state: '', say: 'The symmetric argument applies when the right side is shorter. So on every step, move the shorter side, and if they are equal it does not matter which.' },
      { state: '', say: 'Each step permanently eliminates one line, so the loop runs n times.' }
    ],
    takeaway: 'The reason to move the shorter pointer is a proof, not a heuristic: that line is height-limited and its width can only decrease, so it can never be part of a better pair.'
  },
  hints: [
    'Area is `min(height[l], height[r]) * (r - l)`. If you start at the widest pair, what can happen to the width from then on?',
    'Start at both ends. Measure, then move the pointer at the SHORTER line inward. Argue to yourself why the taller one is not the one to discard.',
    'Pseudo-code: `l=0; r=n-1; best=0; while l<r: best = max(best, min(h[l],h[r]) * (r-l)); if h[l] < h[r]: l++ else r--`'
  ],
  methodSignature: 'public int maxArea(int[] height)',
  javaTemplate: 'two-pointers-inward',
  javaSolution: `class Solution {
    public int maxArea(int[] height) {
        int l = 0;
        int r = height.length - 1;
        int best = 0;

        while (l < r) {
            // The shorter line decides the height; the index gap decides the width.
            int h = Math.min(height[l], height[r]);
            best = Math.max(best, h * (r - l));

            // Move the SHORTER side. That line is already height-limited, and any
            // future partner is strictly closer, so it can never do better.
            // Keeping it and moving the taller line could only lose area.
            if (height[l] < height[r]) {
                l++;
            } else {
                r--;
            }
        }

        return best;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'one pointer moves on every iteration and neither ever goes back',
    space: 'O(1)', spaceWhy: 'three integers'
  },
  testCases: [
    { input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, expected: '49' },
    { input: { height: [1, 1] }, expected: '1' },
    { input: { height: [4, 3, 2, 1, 4] }, expected: '16' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.maxArea(new int[]{1, 8, 6, 2, 5, 4, 8, 3, 7}));
        System.out.println(s.maxArea(new int[]{1, 1}));
        System.out.println(s.maxArea(new int[]{4, 3, 2, 1, 4}));
    }
}`,
  commonMistakes: [
    'Moving the TALLER pointer, which can step over the answer. `[4,3,2,1,4]` is the case that exposes it.',
    'Using `r - l + 1` for the width. The lines are at the indexes, so the gap between them is `r - l`.',
    'Measuring after moving instead of before, which skips the very first and widest pair.',
    'Sorting the heights. Sorting destroys the indexes, and the indexes ARE the width.'
  ],
  followUps: [
    'Trapping Rain Water (next) looks similar and is a different problem: there you accumulate water over every index rather than picking one pair.',
    'Largest Rectangle in Histogram is the version where the bars are solid, and that one needs a monotonic stack.'
  ]
},

{
  id: 'sort-colors',
  leetcodeNumber: 75,
  title: 'Sort Colors',
  url: 'https://leetcode.com/problems/sort-colors/',
  pattern: 'two-pointers',
  difficulty: 'Medium',
  order: 11,
  tags: ['three-way-partition', 'in-place', 'dutch-flag'],
  problemSummary: 'The array contains only the values 0, 1 and 2. Sort it in place in a single pass, without using a library sort.',
  examples: [
    { input: 'nums = [2,0,2,1,1,0]', output: '[0,0,1,1,2,2]', note: 'All zeros, then ones, then twos.' },
    { input: 'nums = [2,0,1]', output: '[0,1,2]', note: 'Three elements, one pass.' }
  ],
  constraints: ['n == nums.length', '1 <= n <= 300', 'nums[i] is 0, 1 or 2', 'You must solve this without using the library sort, in one pass and O(1) space'],
  techniqueNote: 'the Dutch national flag partition: three pointers carving the array into "known 0s", "known 1s", "unexamined", "known 2s".',
  signals: [
    'Only a **small fixed set of values**, and they must end up grouped. That is a partition, not a sort.',
    'One pass plus O(1) space plus no library sort. Counting would need two passes; this needs one.',
    'It is Move Zeroes with three buckets instead of two.'
  ],
  intuition: {
    input: 'nums = [2,0,1]',
    visual:
      'four regions, and the invariant is what makes this work:\n' +
      '\n' +
      '  [ 0 0 0 | 1 1 1 | ? ? ? ? | 2 2 2 ]\n' +
      '           ^low     ^mid    ^high\n' +
      '  before low: all 0     low..mid-1: all 1\n' +
      '  mid..high: unknown    after high: all 2\n' +
      '\n' +
      'start  [2, 0, 1]   low=0 mid=0 high=2\n' +
      'nums[mid]=2 -> swap mid,high   [1, 0, 2]  high=1, mid STAYS 0\n' +
      'nums[mid]=1 -> mid++           [1, 0, 2]  mid=1\n' +
      'nums[mid]=0 -> swap low,mid    [0, 1, 2]  low=1 mid=2\n' +
      'mid > high, stop',
    steps: [
      { state: 'low=0, mid=0, high=2', say: 'Three pointers. `low` is the boundary of the known zeros, `high` the boundary of the known twos, and `mid` is what you are currently examining.' },
      { state: 'nums[mid] = 2', say: 'A two belongs at the back. Swap it with `high` and decrease `high`. **Do not advance `mid`**: the value you just swapped in from the back has never been examined.' },
      { state: 'nums[mid] = 1', say: 'A one is already in the right region, so just advance `mid`.' },
      { state: 'nums[mid] = 0', say: 'A zero belongs at the front. Swap with `low`, then advance BOTH `low` and `mid`, because the value coming back from `low` can only be a 1, which is already correct.' },
      { state: 'mid > high', say: 'Stop when `mid` passes `high`. Everything has been classified.' },
      { state: '', say: 'That asymmetry (advance `mid` on a 0 but not on a 2) is the entire trick, and it follows directly from what each region is known to contain.' }
    ],
    takeaway: 'Write the four regions down before you write the code. Every decision, including which pointers advance, falls out of the invariant.'
  },
  hints: [
    'Counting the 0s, 1s and 2s and rewriting the array works and takes two passes. The one-pass version needs you to define regions. What are they?',
    'Three pointers: `low`, `mid`, `high`. Everything before `low` is 0, everything after `high` is 2, and `mid` scans the unknown middle. Think carefully about whether `mid` should advance after each kind of swap.',
    'Pseudo-code: `low=mid=0; high=n-1; while mid<=high: if nums[mid]==0: swap(low,mid); low++; mid++ elif nums[mid]==2: swap(mid,high); high-- else: mid++`'
  ],
  methodSignature: 'public void sortColors(int[] nums)',
  javaTemplate: 'two-pointers-inward',
  javaSolution: `class Solution {
    public void sortColors(int[] nums) {
        // Invariant, held at all times:
        //   [0, low)        all 0
        //   [low, mid)      all 1
        //   [mid, high]     not yet examined
        //   (high, n-1]     all 2
        int low = 0;
        int mid = 0;
        int high = nums.length - 1;

        while (mid <= high) {
            if (nums[mid] == 0) {
                swap(nums, low, mid);
                low++;
                mid++;   // safe: whatever came back from low was a 1, already correct
            } else if (nums[mid] == 2) {
                swap(nums, mid, high);
                high--;
                // mid does NOT advance: the value swapped in from the back has
                // never been looked at.
            } else {
                mid++;   // a 1 is already in the right region
            }
        }
    }

    private void swap(int[] a, int i, int j) {
        int tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'each iteration either advances `mid` or decreases `high`, so the unknown region always shrinks',
    space: 'O(1)', spaceWhy: 'three indexes and a temporary'
  },
  testCases: [
    { input: { nums: [2, 0, 2, 1, 1, 0] }, expected: '[0, 0, 1, 1, 2, 2]' },
    { input: { nums: [2, 0, 1] }, expected: '[0, 1, 2]' },
    { input: { nums: [0] }, expected: '[0]' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(run(s, new int[]{2, 0, 2, 1, 1, 0}));
        System.out.println(run(s, new int[]{2, 0, 1}));
        System.out.println(run(s, new int[]{0}));
    }

    static String run(Solution s, int[] nums) {
        s.sortColors(nums);
        return java.util.Arrays.toString(nums);
    }
}`,
  commonMistakes: [
    'Advancing `mid` after swapping with `high`. That leaves an unexamined value behind and the array comes out wrong.',
    'Using `mid < high` instead of `mid <= high`, which leaves the final unknown element unclassified.',
    'Counting the three values and rewriting the array. It is correct and simple, and it is the two-pass answer the problem asks you to beat.',
    'Calling `Arrays.sort`. Explicitly disallowed, and it is O(n log n) for data that can be partitioned in O(n).'
  ],
  followUps: [
    'This is the partition step of quicksort with three regions, which is why it handles duplicates so well.',
    'With k distinct values instead of 3, counting sort in two passes is the right answer; the one-pass trick does not generalise.'
  ]
},

{
  id: 'trapping-rain-water',
  leetcodeNumber: 42,
  title: 'Trapping Rain Water',
  url: 'https://leetcode.com/problems/trapping-rain-water/',
  pattern: 'two-pointers',
  difficulty: 'Hard',
  order: 12,
  tags: ['inward', 'running-max', 'geometry'],
  problemSummary: 'Each value is the height of a bar of width one. After rain, water settles in the dips. Return the total units of water trapped.',
  examples: [
    { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', note: 'Six separate units of water across several dips.' },
    { input: 'height = [4,2,0,3,2,5]', output: '9', note: 'The big dip between the 4 and the 5 holds most of it.' }
  ],
  constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
  techniqueNote: 'inward pointers carrying a running max from each side. The trick is realising you only need to know the smaller of the two maxima.',
  signals: [
    'Water, dips, or "how much is held between the peaks". Per-index accumulation, not a single best pair.',
    'The water above index `i` is `min(tallestToTheLeft, tallestToTheRight) - height[i]`. Two independent quantities again.',
    'The obvious solution precomputes two arrays of running maxima. Two pointers collapses that to two variables.'
  ],
  intuition: {
    input: 'height = [4,2,0,3,2,5]',
    visual:
      'water above index i = min(maxLeft, maxRight) - height[i], floored at 0\n' +
      '\n' +
      'index   0  1  2  3  4  5\n' +
      'height  4  2  0  3  2  5\n' +
      '        ^              ^   height[l]=4 < height[r]=5\n' +
      '\n' +
      'Because 5 sits to the right, the left side is the binding constraint for\n' +
      'index l. maxLeft is enough on its own: we do not need the exact maxRight,\n' +
      'only the knowledge that something at least as tall is over there.\n' +
      '\n' +
      'l=0 h=4: maxLeft=4, water += 0        l=1\n' +
      'l=1 h=2: maxLeft=4, water += 4-2 = 2  l=2\n' +
      'l=2 h=0: maxLeft=4, water += 4-0 = 4  l=3   (total 6)\n' +
      'l=3 h=3: maxLeft=4, water += 4-3 = 1  l=4   (total 7)\n' +
      'l=4 h=2: maxLeft=4, water += 4-2 = 2  l=5   (total 9)',
    steps: [
      { state: '', say: 'First get the formula right. The water sitting on top of index `i` is bounded by the tallest bar to its left and the tallest to its right. Whichever is shorter is what holds the water in: `min(maxLeft, maxRight) - height[i]`.' },
      { state: '', say: 'The straightforward solution builds two arrays, one of running maxima from the left and one from the right, then applies the formula per index. That is O(n) time and O(n) space, and it is a perfectly good answer.' },
      { state: 'l=0, r=5', say: 'To get to O(1) space, notice you never need both maxima exactly. If `height[l] < height[r]`, then there is definitely something at least `height[r]` tall on the right, so the LEFT max is the binding constraint at `l`.' },
      { state: 'water = 2', say: 'So process the left side while it is the shorter one: update `maxLeft`, add `maxLeft - height[l]`, and step `l` forward.' },
      { state: 'water = 9', say: 'When the right side is the shorter one, do the mirror image. Each index is settled exactly once, using only two running maxima.' }
    ],
    takeaway: 'You never need the exact opposite maximum, only the guarantee that it is at least as large. That is what turns two precomputed arrays into two integers.'
  },
  hints: [
    'For one specific index, how deep is the water on top of it? Write that as a formula involving the bars to its left and to its right.',
    'That formula needs the tallest bar on each side. Precomputing both as arrays is O(n) space. Now: if the left bar is shorter than the right bar, do you actually need the exact value of the right maximum?',
    'Pseudo-code: `l=0; r=n-1; maxL=maxR=water=0; while l<r: if h[l] < h[r]: maxL = max(maxL, h[l]); water += maxL - h[l]; l++ else: maxR = max(maxR, h[r]); water += maxR - h[r]; r--`'
  ],
  methodSignature: 'public int trap(int[] height)',
  javaTemplate: 'two-pointers-inward',
  javaSolution: `class Solution {
    public int trap(int[] height) {
        int l = 0;
        int r = height.length - 1;

        int maxLeft = 0;    // tallest bar seen from the left, up to l
        int maxRight = 0;   // tallest bar seen from the right, down to r
        int water = 0;

        while (l < r) {
            // Whichever side is SHORTER is the side whose running max is the
            // binding constraint, so that side can be settled now.
            if (height[l] < height[r]) {
                // There is a bar at least height[r] tall somewhere to the right,
                // and height[r] > height[l], so maxLeft alone decides the depth.
                maxLeft = Math.max(maxLeft, height[l]);
                water += maxLeft - height[l];   // never negative: maxLeft >= height[l]
                l++;
            } else {
                maxRight = Math.max(maxRight, height[r]);
                water += maxRight - height[r];
                r--;
            }
        }

        return water;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'one pointer moves per iteration and neither ever goes back',
    space: 'O(1)', spaceWhy: 'four integers. The two-array version of the same idea is O(n) space.'
  },
  testCases: [
    { input: { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] }, expected: '6' },
    { input: { height: [4, 2, 0, 3, 2, 5] }, expected: '9' },
    { input: { height: [3] }, expected: '0' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.trap(new int[]{0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1}));
        System.out.println(s.trap(new int[]{4, 2, 0, 3, 2, 5}));
        System.out.println(s.trap(new int[]{3}));
    }
}`,
  commonMistakes: [
    'Updating the running max AFTER adding the water. Then `maxLeft` can be below `height[l]` and you add a negative amount.',
    'Comparing the running maxima (`maxLeft < maxRight`) rather than the current bars (`height[l] < height[r]`). Both formulations can be made to work, and mixing them is a classic silent bug.',
    'Confusing this with Container With Most Water. There you pick the single best pair; here you accumulate over every index.',
    'Trying to compute per-dip areas by finding the peaks. It is possible and it is far more code than this loop.'
  ],
  followUps: [
    'The monotonic stack solution processes each dip as it closes, and it is the version that generalises to Largest Rectangle in Histogram.',
    'Trapping Rain Water II is the 2-D version, and it needs a min-heap sweeping inwards from the border.',
    'Write the O(n) space two-array version first if the pointer argument does not click. It is a correct answer, and the O(1) version is an optimisation of it.'
  ]
}

);
