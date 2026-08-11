/* data/problems/arrays-hashing.js
 *
 * Problems for the "arrays-hashing" pattern. Schema: data/problems/_SCHEMA.md
 * Adding a problem here is the ONLY thing needed to make it appear in the app:
 * dashboard counts, pattern page, filters, search, SRS and routing all derive
 * from this array. Never edit a view to add a problem.
 *
 * Target mix for this pattern: 10 Easy, 4 Medium, 1 Hard.
 * Every javaSolution here compiles under JDK 11 and every judgeDriver output is
 * checked by `node tools/verify-java.mjs --run`.
 */
(window.LC_PROBLEMS = window.LC_PROBLEMS || []).push(

{
  id: 'two-sum',
  leetcodeNumber: 1,
  title: 'Two Sum',
  url: 'https://leetcode.com/problems/two-sum/',
  pattern: 'arrays-hashing',
  difficulty: 'Easy',
  order: 1,
  tags: ['hash-map', 'array', 'complement'],
  problemSummary: 'Given an array of integers and a target, return the **indexes** of the two numbers that add up to the target. Exactly one valid answer exists, and you may not use the same element twice.',
  examples: [
    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', note: 'nums[0] + nums[1] = 2 + 7 = 9' },
    { input: 'nums = [3,2,4], target = 6', output: '[1,2]', note: 'Not [0,0]: you cannot reuse index 0.' },
    { input: 'nums = [3,3], target = 6', output: '[0,1]', note: 'Duplicate values are fine, duplicate indexes are not.' }
  ],
  constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Exactly one valid answer exists.'],
  techniqueNote: 'the complement shape. Instead of comparing every pair, ask "have I already seen the number that completes this one".',
  signals: [
    'Asked for a **pair** that hits a target.',
    'Your first idea is a nested loop where the inner loop only searches. That is the loop a map deletes.',
    'You need `target - x` in O(1), which is exactly what a hash map gives you.',
    'The answer must be **indexes**, so you cannot sort the array. That rules out two pointers.'
  ],
  intuition: {
    input: 'nums = [2,7,11,15], target = 9',
    visual:
      'i=0   [ 2 ] 7  11  15      need 9-2 = 7    map {}          not there -> remember 2\n' +
      '        ^\n' +
      'i=1     2 [ 7 ] 11  15     need 9-7 = 2    map {2:0}       FOUND at index 0\n' +
      '              ^                                            answer [0, 1]',
    steps: [
      { state: 'seen = {}', say: 'Look at `2`. To reach 9 I need `7`. The map is empty, so no. Write down that I saw `2` at index 0.' },
      { state: 'seen = {2:0}', say: 'Look at `7`. To reach 9 I need `2`. The map has `2`, at index 0. That is the pair: return `[0, 1]`.' },
      { state: '', say: 'Notice I never looked forward. The map holds the past, and the number I need is always in the past by the time I need it.' }
    ],
    takeaway: 'One pass. The map remembers what a future element will ask for. That is why O(n²) collapses to O(n).'
  },
  hints: [
    'You are searching the array again from inside a loop. What structure answers "is this value here?" in one step instead of n steps?',
    'One pass. At each element compute `target - nums[i]`, look THAT up in a map of value to index, and only then store the current value. Checking before storing is what prevents pairing an element with itself.',
    'Pseudo-code: `for i in 0..n-1: need = target - nums[i]; if seen has need: return {seen[need], i}; seen[nums[i]] = i`'
  ],
  methodSignature: 'public int[] twoSum(int[] nums, int target)',
  javaTemplate: 'hashmap-count',
  javaSolution: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // value -> the index where we saw it
        Map<Integer, Integer> seen = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];

            // Ask BEFORE storing. If we stored first, an element whose value is
            // exactly half the target would match itself.
            if (seen.containsKey(need)) {
                return new int[] { seen.get(need), i };
            }

            seen.put(nums[i], i);
        }

        return new int[0];   // the problem promises this is unreachable
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'one pass over the array; each map put and get is O(1) on average',
    space: 'O(n)', spaceWhy: 'the map holds up to n entries, one per element seen so far'
  },
  testCases: [
    { input: { nums: [2, 7, 11, 15], target: 9 }, expected: '[0, 1]' },
    { input: { nums: [3, 2, 4], target: 6 }, expected: '[1, 2]' },
    { input: { nums: [3, 3], target: 6 }, expected: '[0, 1]' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(java.util.Arrays.toString(s.twoSum(new int[]{2, 7, 11, 15}, 9)));
        System.out.println(java.util.Arrays.toString(s.twoSum(new int[]{3, 2, 4}, 6)));
        System.out.println(java.util.Arrays.toString(s.twoSum(new int[]{3, 3}, 6)));
    }
}`,
  commonMistakes: [
    'Filling the map completely first, then searching it. On `[3,3]` with target 6 that returns `[1,1]`, because index 1 overwrote index 0 and then matched itself.',
    'Returning the **values** instead of the indexes.',
    'Storing before checking, which lets an element pair with itself when `nums[i] * 2 == target`.',
    'Assigning `map.get(need)` to an `int` without checking presence first. Absent means `null`, and unboxing `null` throws a NullPointerException.'
  ],
  followUps: [
    'What if the array were sorted? Two pointers from both ends, O(n) time and O(1) space, no map at all.',
    'What if you had to return every pair, not just one? Careful with duplicates, and the answer is no longer a single early return.'
  ]
},

{
  id: 'contains-duplicate',
  leetcodeNumber: 217,
  title: 'Contains Duplicate',
  url: 'https://leetcode.com/problems/contains-duplicate/',
  pattern: 'arrays-hashing',
  difficulty: 'Easy',
  order: 2,
  tags: ['hash-set', 'array'],
  problemSummary: 'Return `true` if any value appears at least twice in the array, and `false` if every element is distinct.',
  examples: [
    { input: 'nums = [1,2,3,1]', output: 'true', note: '1 appears at index 0 and index 3.' },
    { input: 'nums = [1,2,3,4]', output: 'false', note: 'All distinct.' }
  ],
  constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
  techniqueNote: 'the seen-set shape, and the smallest possible version of it.',
  signals: [
    'The word **duplicate**. That is a set, essentially every time.',
    'You only need to know "have I seen this", not how many times or where.',
    'You want to bail out the instant you find one, so you do not want to count everything first.'
  ],
  intuition: {
    input: 'nums = [1,2,3,1]',
    steps: [
      { state: 'seen = {}', say: 'Add `1`. It was not there, so nothing is wrong yet.' },
      { state: 'seen = {1}', say: 'Add `2`. New again.' },
      { state: 'seen = {1,2}', say: 'Add `3`. New again.' },
      { state: 'seen = {1,2,3}', say: 'Try to add `1`. The set already has it, so `add` returns false. Answer: `true`, there is a duplicate.' }
    ],
    takeaway: '`HashSet.add` returns `false` when the element was already present. That return value IS the duplicate check, so you never need a separate `contains` call.'
  },
  hints: [
    'You do not need to know where the duplicate is or how many there are. What is the cheapest structure that answers "have I seen this before"?',
    'Walk the array once, adding each value to a `HashSet`. If an add fails, you have your answer immediately.',
    'Pseudo-code: `seen = new HashSet(); for x in nums: if (!seen.add(x)) return true; return false`'
  ],
  methodSignature: 'public boolean containsDuplicate(int[] nums)',
  javaTemplate: 'hashmap-count',
  javaSolution: `import java.util.*;

class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();

        for (int x : nums) {
            // add() returns false when the element was ALREADY in the set,
            // so this single call both tests and inserts.
            if (!seen.add(x)) {
                return true;
            }
        }

        return false;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'one pass, and each set add is O(1) on average. It exits early on the first duplicate.',
    space: 'O(n)', spaceWhy: 'worst case (all distinct) the set holds every element'
  },
  testCases: [
    { input: { nums: [1, 2, 3, 1] }, expected: 'true' },
    { input: { nums: [1, 2, 3, 4] }, expected: 'false' },
    { input: { nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] }, expected: 'true' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.containsDuplicate(new int[]{1, 2, 3, 1}));
        System.out.println(s.containsDuplicate(new int[]{1, 2, 3, 4}));
        System.out.println(s.containsDuplicate(new int[]{1, 1, 1, 3, 3, 4, 3, 2, 4, 2}));
    }
}`,
  commonMistakes: [
    'Sorting first and comparing neighbours. It works and uses O(1) extra space, but it is O(n log n) and it destroys the input order.',
    'Calling `seen.contains(x)` and then `seen.add(x)`. Two hash lookups where one would do.',
    'Building the whole set and comparing `set.size() != nums.length`. Correct, but it never exits early and always allocates the full set.'
  ],
  followUps: [
    'What if you were told O(1) extra space is mandatory? Then sorting is the answer, and you accept O(n log n).',
    'Contains Duplicate II adds "within k indexes of each other", which turns this into a sliding window over a set.'
  ]
},

{
  id: 'valid-anagram',
  leetcodeNumber: 242,
  title: 'Valid Anagram',
  url: 'https://leetcode.com/problems/valid-anagram/',
  pattern: 'arrays-hashing',
  difficulty: 'Easy',
  order: 3,
  tags: ['counting', 'string', 'frequency-array'],
  problemSummary: 'Two strings are anagrams when one is a rearrangement of the other, using every letter exactly as often. Return whether `t` is an anagram of `s`.',
  examples: [
    { input: 's = "anagram", t = "nagaram"', output: 'true', note: 'Same letters, same counts.' },
    { input: 's = "rat", t = "car"', output: 'false', note: 'Different letters.' }
  ],
  constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters'],
  techniqueNote: 'counting, with the alphabet small enough that an `int[26]` beats a `HashMap`.',
  signals: [
    'The word **anagram**, or any question about rearranging.',
    '"Same letters, same counts" is literally a frequency comparison.',
    'The constraints say **lowercase English letters**, which is 26 possible keys. That is an array, not a map.'
  ],
  intuition: {
    input: 's = "aab", t = "aba"',
    visual:
      "index  0    1    2\n" +
      "s      a    a    b        counts after each step, showing only a and b\n" +
      "t      a    b    a\n" +
      "       a:0  a:0  a:0      s adds 1, t subtracts 1, so a matching pair\n" +
      "       b:0  b:-1 b:0      cancels to zero immediately",
    steps: [
      { state: 'counts = all zero', say: 'One array of 26 counters, one slot per letter.' },
      { state: "i=0: s 'a' +1, t 'a' -1", say: "Add for `s`, subtract for `t`, in the same loop. `a` goes to +1 then back to 0." },
      { state: "i=1: s 'a' +1, t 'b' -1", say: "`a` is now +1 and `b` is -1. Not balanced yet, and that is fine mid-way." },
      { state: "i=2: s 'b' +1, t 'a' -1", say: "`b` returns to 0 and `a` returns to 0. Every counter is zero." },
      { state: 'all zero', say: 'All zero means every letter was used the same number of times on both sides. Answer: `true`.' }
    ],
    takeaway: 'You do not need two count arrays. Add for one string and subtract for the other, then "all zero" is the whole answer.'
  },
  hints: [
    'If the lengths differ they cannot be anagrams. After that, what do you actually need to compare? Not order, so what is left?',
    'Count how often each letter appears. The alphabet has 26 letters, so `int[26]` indexed by `c - \'a\'` is faster and simpler than a map.',
    'Pseudo-code: `if lengths differ return false; for i: counts[s[i]-\'a\']++; counts[t[i]-\'a\']--; then return every counter == 0`'
  ],
  methodSignature: 'public boolean isAnagram(String s, String t)',
  javaTemplate: 'hashmap-count',
  javaSolution: `class Solution {
    public boolean isAnagram(String s, String t) {
        // Different lengths can never be anagrams, and this guard also lets the
        // single loop below index both strings safely.
        if (s.length() != t.length()) {
            return false;
        }

        // 26 counters, one per lowercase letter. 'a' maps to 0, 'z' maps to 25.
        int[] counts = new int[26];

        for (int i = 0; i < s.length(); i++) {
            counts[s.charAt(i) - 'a']++;    // s pushes counts up
            counts[t.charAt(i) - 'a']--;    // t pulls them back down
        }

        // Anything left over means one string used a letter the other did not.
        for (int c : counts) {
            if (c != 0) return false;
        }

        return true;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'one pass over both strings, then a fixed 26-slot check that does not depend on n',
    space: 'O(1)', spaceWhy: 'exactly 26 ints, no matter how long the strings are'
  },
  testCases: [
    { input: { s: 'anagram', t: 'nagaram' }, expected: 'true' },
    { input: { s: 'rat', t: 'car' }, expected: 'false' },
    { input: { s: 'a', t: 'ab' }, expected: 'false' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.isAnagram("anagram", "nagaram"));
        System.out.println(s.isAnagram("rat", "car"));
        System.out.println(s.isAnagram("a", "ab"));
    }
}`,
  commonMistakes: [
    'Forgetting the length guard. Without it the shared loop reads past the end of the shorter string.',
    'Sorting both strings and comparing. Correct, and a fine one-liner, but O(n log n) instead of O(n).',
    'Using `s.charAt(i) == t.charAt(i)` anywhere. Anagrams are about counts, not positions.',
    'Hard-coding `int[26]` when the problem allows Unicode. Then you need a `HashMap<Character, Integer>`.'
  ],
  followUps: [
    'What if the input could be any Unicode string? Swap the array for a `HashMap<Character, Integer>`.',
    'Group Anagrams (later in this pattern) reuses exactly this idea as a map KEY instead of a boolean.'
  ]
},

{
  id: 'majority-element',
  leetcodeNumber: 169,
  title: 'Majority Element',
  url: 'https://leetcode.com/problems/majority-element/',
  pattern: 'arrays-hashing',
  difficulty: 'Easy',
  order: 4,
  tags: ['counting', 'hash-map'],
  problemSummary: 'One value appears more than `n/2` times in the array. Return it. You may assume it always exists.',
  examples: [
    { input: 'nums = [3,2,3]', output: '3', note: '3 appears twice out of three elements.' },
    { input: 'nums = [2,2,1,1,1,2,2]', output: '2', note: '2 appears four times out of seven.' }
  ],
  constraints: ['n == nums.length', '1 <= n <= 5 * 10^4', '-10^9 <= nums[i] <= 10^9', 'The majority element always exists.'],
  techniqueNote: 'counting, then reading the maximum straight off the tally.',
  signals: [
    'The words **most frequent**, **majority**, **appears more than**. A count map answers all of them.',
    'Values are unbounded (up to 10^9), so a frequency ARRAY is impossible. This one needs a map.',
    'You can track the running best while counting, so no second pass over the map is required.'
  ],
  intuition: {
    input: 'nums = [2,2,1,1,1,2,2]',
    steps: [
      { state: 'counts = {}, best = 2 (count 0)', say: 'Tally as you walk, and remember the best-so-far while you go.' },
      { state: 'counts = {2:2}', say: 'Two 2s. Best is `2` with 2.' },
      { state: 'counts = {2:2, 1:3}', say: 'Three 1s. Best flips to `1` with 3.' },
      { state: 'counts = {2:4, 1:3}', say: 'Two more 2s take 2 up to 4. Best flips back to `2`.' },
      { state: 'best = 2', say: '4 out of 7 is more than half, so `2` is the answer. Tracking the max as you count avoids a second loop over the map.' }
    ],
    takeaway: 'Counting is the whole solution. `merge(x, 1, Integer::sum)` is the tidiest way to write "add one to this key" in Java.'
  },
  hints: [
    'The values are up to 10^9, so you cannot index an array by value. What else gives you a counter per distinct value?',
    'Tally every value in a `HashMap`, and while you tally, keep the value whose count is currently highest. One pass, no second scan.',
    'Pseudo-code: `for x in nums: c = counts.merge(x, 1, sum); if c > bestCount: bestCount = c, best = x; return best`'
  ],
  methodSignature: 'public int majorityElement(int[] nums)',
  javaTemplate: 'hashmap-count',
  javaSolution: `import java.util.*;

class Solution {
    public int majorityElement(int[] nums) {
        Map<Integer, Integer> counts = new HashMap<>();

        int best = nums[0];
        int bestCount = 0;

        for (int x : nums) {
            // merge(key, 1, Integer::sum) means "put 1 if absent, else add 1".
            // It returns the NEW count, which is what we want to compare.
            int c = counts.merge(x, 1, Integer::sum);

            if (c > bestCount) {
                bestCount = c;
                best = x;
            }
        }

        return best;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'one pass; each map operation is O(1) on average and the max is tracked inline',
    space: 'O(n)', spaceWhy: 'up to n distinct keys in the map. Boyer-Moore (see follow-ups) gets this to O(1).'
  },
  testCases: [
    { input: { nums: [3, 2, 3] }, expected: '3' },
    { input: { nums: [2, 2, 1, 1, 1, 2, 2] }, expected: '2' },
    { input: { nums: [1] }, expected: '1' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.majorityElement(new int[]{3, 2, 3}));
        System.out.println(s.majorityElement(new int[]{2, 2, 1, 1, 1, 2, 2}));
        System.out.println(s.majorityElement(new int[]{1}));
    }
}`,
  commonMistakes: [
    'Initialising `best` to 0 instead of `nums[0]`. On an array of negative numbers that returns a value that is not even in the array.',
    'Using `counts.get(x) + 1` without `getOrDefault`, which throws a NullPointerException on the first occurrence of each value.',
    'Sorting and returning `nums[n/2]`. It is correct because a majority element must cover the middle, but it is O(n log n).'
  ],
  followUps: [
    'Boyer-Moore voting: keep one candidate and one counter, increment on a match and decrement otherwise, and reset the candidate when the counter hits zero. O(n) time and **O(1) space**. It only works because a strict majority is guaranteed.',
    'Majority Element II asks for everything appearing more than n/3 times. There can be at most two, and Boyer-Moore extends to two candidates.'
  ]
},

{
  id: 'intersection-of-two-arrays',
  leetcodeNumber: 349,
  title: 'Intersection of Two Arrays',
  url: 'https://leetcode.com/problems/intersection-of-two-arrays/',
  pattern: 'arrays-hashing',
  difficulty: 'Easy',
  order: 5,
  tags: ['hash-set', 'array'],
  problemSummary: 'Return the values that appear in both arrays. Each value must appear only once in the result, and the order does not matter.',
  examples: [
    { input: 'nums1 = [1,2,2,1], nums2 = [2,2]', output: '[2]', note: '2 is in both. It appears once in the output even though it repeats in the inputs.' },
    { input: 'nums1 = [4,9,5], nums2 = [9,4,9,8,4]', output: '[9,4]', note: 'Any order is accepted.' }
  ],
  constraints: ['1 <= nums1.length, nums2.length <= 1000', '0 <= nums1[i], nums2[i] <= 1000'],
  techniqueNote: 'two sets: one to remember the first array, one to de-duplicate the answer.',
  signals: [
    'The words **common to both**, **intersection**, **appears in both**.',
    '"Each element in the result must be unique" is a set asking to be used.',
    'You were about to write a nested loop comparing every pair. That inner loop is a set lookup.'
  ],
  intuition: {
    input: 'nums1 = [1,2,2,1], nums2 = [2,2]',
    steps: [
      { state: 'first = {}', say: 'Pour the whole of `nums1` into a set. Duplicates collapse on their own.' },
      { state: 'first = {1,2}', say: 'Now walk `nums2` and ask the set about each value.' },
      { state: 'both = {}', say: 'First `2`: yes, it is in `first`. Put it in the answer set.' },
      { state: 'both = {2}', say: 'Second `2`: it is in `first` again, but the answer set already holds it, so nothing changes. That is the de-duplication, free.' },
      { state: 'answer = [2]', say: 'Copy the answer set into an array and return it.' }
    ],
    takeaway: 'Two sets do two different jobs: the first is a membership oracle, the second enforces uniqueness in the output. Trying to do both with one set is where this gets messy.'
  },
  hints: [
    'You are comparing every element of one array against every element of the other. Which of those two loops is only searching?',
    'Put all of `nums1` into a `HashSet`. Walk `nums2` and collect anything the set contains, into a SECOND set so repeats do not pile up.',
    'Pseudo-code: `first = set(nums1); both = new LinkedHashSet(); for x in nums2: if first.contains(x): both.add(x); return both as int[]`'
  ],
  methodSignature: 'public int[] intersection(int[] nums1, int[] nums2)',
  javaTemplate: 'hashmap-count',
  javaSolution: `import java.util.*;

class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        // Set 1: everything in the first array. Duplicates disappear for free.
        Set<Integer> first = new HashSet<>();
        for (int x : nums1) {
            first.add(x);
        }

        // Set 2: the answer. LinkedHashSet keeps discovery order, which is not
        // required here but makes the output stable and easy to test.
        Set<Integer> both = new LinkedHashSet<>();
        for (int x : nums2) {
            if (first.contains(x)) {
                both.add(x);
            }
        }

        // Java will not unbox a Set<Integer> into an int[] for you.
        int[] out = new int[both.size()];
        int i = 0;
        for (int x : both) {
            out[i] = x;
            i++;
        }
        return out;
    }
}
`,
  complexity: {
    time: 'O(n + m)', timeWhy: 'one pass over each array, with O(1) average set operations',
    space: 'O(n)', spaceWhy: 'the first set holds up to n distinct values, plus the output'
  },
  testCases: [
    { input: { nums1: [1, 2, 2, 1], nums2: [2, 2] }, expected: '[2]' },
    { input: { nums1: [4, 9, 5], nums2: [9, 4, 9, 8, 4] }, expected: '[9, 4]' },
    { input: { nums1: [1, 2, 3], nums2: [4, 5, 6] }, expected: '[]' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(java.util.Arrays.toString(s.intersection(new int[]{1, 2, 2, 1}, new int[]{2, 2})));
        System.out.println(java.util.Arrays.toString(s.intersection(new int[]{4, 9, 5}, new int[]{9, 4, 9, 8, 4})));
        System.out.println(java.util.Arrays.toString(s.intersection(new int[]{1, 2, 3}, new int[]{4, 5, 6})));
    }
}`,
  commonMistakes: [
    'Collecting into a `List` instead of a set, which repeats a value once per occurrence in `nums2`.',
    'Trying `both.toArray(new int[0])`. That does not compile: `Set<Integer>` gives you `Integer[]`, and you must copy element by element (or use a stream).',
    'Removing matches from the first set as you go. That works too, but then you cannot tell "already reported" from "never present" if the logic grows.'
  ],
  followUps: [
    'Intersection of Two Arrays II keeps duplicates, so the set becomes a **count** map that you decrement.',
    'If both arrays were already sorted, two pointers would do it in O(n + m) with O(1) extra space.'
  ]
},

{
  id: 'ransom-note',
  leetcodeNumber: 383,
  title: 'Ransom Note',
  url: 'https://leetcode.com/problems/ransom-note/',
  pattern: 'arrays-hashing',
  difficulty: 'Easy',
  order: 6,
  tags: ['counting', 'string', 'frequency-array'],
  problemSummary: 'Can you build the first string using only the letters available in the second, where each letter in the second string may be used at most once?',
  examples: [
    { input: 'ransomNote = "a", magazine = "b"', output: 'false', note: 'No `a` available.' },
    { input: 'ransomNote = "aa", magazine = "ab"', output: 'false', note: 'Only one `a` available, two are needed.' },
    { input: 'ransomNote = "aa", magazine = "aab"', output: 'true', note: 'Two `a`s available, the spare `b` does not matter.' }
  ],
  constraints: ['1 <= ransomNote.length, magazine.length <= 10^5', 'Both consist of lowercase English letters'],
  techniqueNote: 'counting with a budget. Build the supply, then spend it and watch for going negative.',
  signals: [
    '"Can I build X out of Y" where letters are consumed. That is a supply-and-demand count.',
    'Lowercase English letters only, so `int[26]` again.',
    'You need "at least as many of each", not "exactly as many". So it is a one-sided comparison, unlike Valid Anagram.'
  ],
  intuition: {
    input: 'ransomNote = "aa", magazine = "ab"',
    steps: [
      { state: 'have: a=1, b=1', say: 'Count the magazine first. That is your budget.' },
      { state: 'have: a=0, b=1', say: 'Spend the first `a`. The budget for `a` drops to 0, which is still fine.' },
      { state: 'have: a=-1', say: 'Spend the second `a`. The budget goes to -1, which means you needed a letter you did not have. Return `false` immediately.' }
    ],
    takeaway: 'Decrement and test in one move. The moment any counter goes below zero, the answer is settled and you can stop.'
  },
  hints: [
    'Which string is the supply and which is the demand? Count one of them first, and it is not the note.',
    'Count the magazine into `int[26]`. Then walk the note and decrement. If any counter drops below zero you ran out of that letter.',
    'Pseudo-code: `for c in magazine: have[c]++; for c in note: if (--have[c] < 0) return false; return true`'
  ],
  methodSignature: 'public boolean canConstruct(String ransomNote, String magazine)',
  javaTemplate: 'hashmap-count',
  javaSolution: `class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        // The magazine is the supply, so it gets counted first.
        int[] have = new int[26];
        for (char c : magazine.toCharArray()) {
            have[c - 'a']++;
        }

        // Spend the supply on the note. Pre-decrement so the test sees the
        // value AFTER spending: going below zero means we ran out.
        for (char c : ransomNote.toCharArray()) {
            if (--have[c - 'a'] < 0) {
                return false;
            }
        }

        return true;
    }
}
`,
  complexity: {
    time: 'O(n + m)', timeWhy: 'one pass over each string, and it exits early on the first shortfall',
    space: 'O(1)', spaceWhy: '26 ints regardless of input size'
  },
  testCases: [
    { input: { ransomNote: 'a', magazine: 'b' }, expected: 'false' },
    { input: { ransomNote: 'aa', magazine: 'ab' }, expected: 'false' },
    { input: { ransomNote: 'aa', magazine: 'aab' }, expected: 'true' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.canConstruct("a", "b"));
        System.out.println(s.canConstruct("aa", "ab"));
        System.out.println(s.canConstruct("aa", "aab"));
    }
}`,
  commonMistakes: [
    'Counting the note instead of the magazine and then getting the comparison direction backwards.',
    'Using `have[c] -= 1` and then testing `have[c] < 0` as two statements. Fine, but the pre-decrement is the idiom worth recognising.',
    'Requiring the counts to be EQUAL. The magazine is allowed to have leftovers. That is the one difference from Valid Anagram.',
    'Using `contains` or `indexOf` on the magazine string per character, which is O(n·m).'
  ],
  followUps: [
    'This is Valid Anagram with a one-sided comparison. Once you see that, both are the same problem.',
    'If letters could be reused without limit, the counts collapse to a set membership test.'
  ]
},

{
  id: 'first-unique-character',
  leetcodeNumber: 387,
  title: 'First Unique Character in a String',
  url: 'https://leetcode.com/problems/first-unique-character-in-a-string/',
  pattern: 'arrays-hashing',
  difficulty: 'Easy',
  order: 7,
  tags: ['counting', 'string', 'two-pass'],
  problemSummary: 'Return the index of the first character in the string that appears exactly once. Return `-1` if every character repeats.',
  examples: [
    { input: 's = "leetcode"', output: '0', note: '`l` appears once and is first.' },
    { input: 's = "loveleetcode"', output: '2', note: '`l` and `o` both repeat; `v` at index 2 is the first that does not.' },
    { input: 's = "aabb"', output: '-1', note: 'Everything repeats.' }
  ],
  constraints: ['1 <= s.length <= 10^5', 's consists of lowercase English letters'],
  techniqueNote: 'two passes over the same string. The first builds knowledge, the second uses it.',
  signals: [
    '**First** something, plus a property that depends on the WHOLE string. You cannot know "unique" until you have seen everything, so one pass is impossible.',
    'The word **frequency** or **appears exactly once**.',
    'You need the index, so the second pass must walk the string in order, not the map.'
  ],
  intuition: {
    input: 's = "loveleetcode"',
    visual:
      'pass 1   count every letter:   l:2  o:3  v:1  e:4  t:1  c:1  d:1\n' +
      'pass 2   walk in order:        l(2) no,  o(3) no,  v(1) YES -> index 2',
    steps: [
      { state: '', say: 'You cannot answer during a single pass: at index 0 you do not yet know whether `l` comes back later. So the first pass only counts.' },
      { state: 'counts = {l:2, o:3, v:1, e:4, t:1, c:1, d:1}', say: 'Now every count is final.' },
      { state: 'i=0', say: '`l` has count 2. Not unique, keep going.' },
      { state: 'i=1', say: '`o` has count 3. Keep going.' },
      { state: 'i=2', say: '`v` has count 1. First unique, so return index 2. Because the second pass walks the STRING, "first" is guaranteed.' }
    ],
    takeaway: 'Two passes are still O(n). Reaching for two passes is the right instinct whenever the answer depends on information from the end of the input.'
  },
  hints: [
    'At index 0, can you tell whether that character reappears later? What does that force you to do first?',
    'Pass one counts every character. Pass two walks the string in index order and returns the first index whose count is 1.',
    'Pseudo-code: `for c in s: counts[c]++; for i in 0..n-1: if counts[s[i]] == 1 return i; return -1`'
  ],
  methodSignature: 'public int firstUniqChar(String s)',
  javaTemplate: 'hashmap-count',
  javaSolution: `class Solution {
    public int firstUniqChar(String s) {
        // Pass 1: how often does each letter appear? We cannot decide anything
        // until this is complete, which is why one pass will not do.
        int[] counts = new int[26];
        for (char c : s.toCharArray()) {
            counts[c - 'a']++;
        }

        // Pass 2: walk the STRING (not the counts) so that "first" means first
        // by position.
        for (int i = 0; i < s.length(); i++) {
            if (counts[s.charAt(i) - 'a'] == 1) {
                return i;
            }
        }

        return -1;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'two passes over the string is still linear; the 26-slot array is constant work',
    space: 'O(1)', spaceWhy: '26 counters no matter how long the string is'
  },
  testCases: [
    { input: { s: 'leetcode' }, expected: '0' },
    { input: { s: 'loveleetcode' }, expected: '2' },
    { input: { s: 'aabb' }, expected: '-1' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.firstUniqChar("leetcode"));
        System.out.println(s.firstUniqChar("loveleetcode"));
        System.out.println(s.firstUniqChar("aabb"));
    }
}`,
  commonMistakes: [
    'Iterating the map in the second pass. A `HashMap` has no order, so you get a unique character but not the FIRST one. A `LinkedHashMap` would fix it, but walking the string is simpler.',
    'Trying to answer in a single pass. Impossible: uniqueness is a property of the whole string.',
    'Using `s.indexOf(c) == s.lastIndexOf(c)` per character. It is a neat one-liner and it is O(n²).',
    'Forgetting to return `-1` when nothing is unique.'
  ],
  followUps: [
    'What if the string were a stream you could only read once? You would need a queue of candidates alongside the counts.',
    'A `LinkedHashMap<Character, Integer>` lets you answer from the map itself, since it preserves insertion order.'
  ]
},

{
  id: 'isomorphic-strings',
  leetcodeNumber: 205,
  title: 'Isomorphic Strings',
  url: 'https://leetcode.com/problems/isomorphic-strings/',
  pattern: 'arrays-hashing',
  difficulty: 'Easy',
  order: 8,
  tags: ['hash-map', 'string', 'bijection'],
  problemSummary: 'Two strings are isomorphic when you can replace every character of the first with a character of the second consistently: the same source character always maps to the same target, and no two source characters share a target. Order and length are preserved.',
  examples: [
    { input: 's = "egg", t = "add"', output: 'true', note: 'e→a and g→d, applied consistently.' },
    { input: 's = "foo", t = "bar"', output: 'false', note: 'o would have to map to both a and r.' },
    { input: 's = "badc", t = "baba"', output: 'false', note: 'Consistent one way, but d and c would both map to a.' }
  ],
  constraints: ['1 <= s.length <= 5 * 10^4', 't.length == s.length', 's and t consist of any ASCII characters'],
  techniqueNote: 'two maps, because the rule is a **bijection**: consistent in both directions, not just one.',
  signals: [
    'A **consistent replacement** or renaming rule, character for character.',
    'The pairing is one-to-one, which is the tell that one map is not enough.',
    'Same shape as Word Pattern (next problem) and as "are these two strings structurally identical".'
  ],
  intuition: {
    input: 's = "badc", t = "baba"',
    visual:
      'i   s   t     forward (s->t)      backward (t->s)\n' +
      '0   b   b     b->b                b->b\n' +
      '1   a   a     a->a                a->a\n' +
      '2   d   b     d->b  new...        but b is ALREADY taken by b  -> false',
    steps: [
      { state: 'forward {}, backward {}', say: 'Two maps: one for "what does this s-character become", one for "which s-character claimed this t-character".' },
      { state: 'forward {b:b}, backward {b:b}', say: 'Index 0: `b`→`b`. Neither map had an entry, so record both directions.' },
      { state: 'forward {b:b, a:a}, backward {b:b, a:a}', say: 'Index 1: `a`→`a`. Also new, also fine.' },
      { state: 'index 2: d and b', say: 'Index 2: `d` has no forward mapping yet, so it looks free. But `backward` shows `b` was already claimed by `b`. Two different source characters cannot share a target, so the answer is `false`.' },
      { state: '', say: 'A single forward map would have said "true" here. That is the bug the second map exists to catch.' }
    ],
    takeaway: 'One map checks consistency in one direction. A bijection needs both. Whenever the words "one to one" appear, expect two maps.'
  },
  hints: [
    'Try `s = "badc"`, `t = "baba"` with a single map from `s` to `t`. What answer do you get, and is it right?',
    'Keep two maps: `s`-char to `t`-char, and `t`-char back to `s`-char. Any character pair must be either brand new to BOTH maps, or already agreed by both.',
    'Pseudo-code: `for i: a = s[i], b = t[i]; if forward has a: check forward[a] == b else if backward has b: return false; then set forward[a] = b, backward[b] = a`'
  ],
  methodSignature: 'public boolean isIsomorphic(String s, String t)',
  javaTemplate: 'hashmap-count',
  javaSolution: `import java.util.*;

class Solution {
    public boolean isIsomorphic(String s, String t) {
        if (s.length() != t.length()) {
            return false;
        }

        Map<Character, Character> forward = new HashMap<>();   // s char -> t char
        Map<Character, Character> backward = new HashMap<>();  // t char -> s char

        for (int i = 0; i < s.length(); i++) {
            char a = s.charAt(i);
            char b = t.charAt(i);

            Character mappedTo = forward.get(a);

            if (mappedTo == null) {
                // 'a' is unmapped. It may only claim 'b' if nobody else has.
                if (backward.containsKey(b)) {
                    return false;
                }
                forward.put(a, b);
                backward.put(b, a);
            } else if (mappedTo.charValue() != b) {
                // 'a' already promised a different character.
                // charValue() is explicit on purpose: != between two Character
                // objects would compare references, not values.
                return false;
            }
        }

        return true;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'one pass, with O(1) average map operations',
    space: 'O(k)', spaceWhy: 'k distinct characters, bounded by the alphabet, so effectively O(1)'
  },
  testCases: [
    { input: { s: 'egg', t: 'add' }, expected: 'true' },
    { input: { s: 'foo', t: 'bar' }, expected: 'false' },
    { input: { s: 'badc', t: 'baba' }, expected: 'false' },
    { input: { s: 'paper', t: 'title' }, expected: 'true' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.isIsomorphic("egg", "add"));
        System.out.println(s.isIsomorphic("foo", "bar"));
        System.out.println(s.isIsomorphic("badc", "baba"));
        System.out.println(s.isIsomorphic("paper", "title"));
    }
}`,
  commonMistakes: [
    'Using only one map. It passes the obvious examples and fails on `"badc"` / `"baba"`, which is exactly why that case is in the test list.',
    'Comparing two boxed `Character` objects with `!=`. It happens to work for ASCII because of the Character cache, then breaks for values outside it. Unbox one side first.',
    'Assuming lowercase only and indexing `int[26]`. The constraints allow any ASCII, so use `int[128]` or a map.',
    'Forgetting the length guard.'
  ],
  followUps: [
    'The same problem can be solved by comparing "index of last occurrence" signatures for both strings, with no maps at all.',
    'Word Pattern (next) is this problem with words instead of characters on one side.'
  ]
},

{
  id: 'word-pattern',
  leetcodeNumber: 290,
  title: 'Word Pattern',
  url: 'https://leetcode.com/problems/word-pattern/',
  pattern: 'arrays-hashing',
  difficulty: 'Easy',
  order: 9,
  tags: ['hash-map', 'string', 'bijection'],
  problemSummary: 'Given a pattern of single letters and a sentence of space-separated words, decide whether the letters map one-to-one onto the words: each letter always means the same word, and no two letters mean the same word.',
  examples: [
    { input: 'pattern = "abba", s = "dog cat cat dog"', output: 'true', note: 'a↔dog, b↔cat.' },
    { input: 'pattern = "abba", s = "dog cat cat fish"', output: 'false', note: 'a would mean both dog and fish.' },
    { input: 'pattern = "aaaa", s = "dog cat cat dog"', output: 'false', note: 'a cannot mean four different words.' },
    { input: 'pattern = "abba", s = "dog dog dog dog"', output: 'false', note: 'a and b would both mean dog, which breaks one-to-one.' }
  ],
  constraints: ['1 <= pattern.length <= 300', 'pattern contains only lowercase English letters', '1 <= s.length <= 3000', 's contains lowercase words separated by single spaces'],
  techniqueNote: 'the same bijection as Isomorphic Strings, with `String` on one side instead of `char`.',
  signals: [
    'A **one-to-one correspondence** between two sequences.',
    'You have already seen this shape in Isomorphic Strings. Recognising that is the point of putting them next to each other.',
    'The lengths must match after splitting, and that check is easy to forget.'
  ],
  intuition: {
    input: 'pattern = "abba", s = "dog dog dog dog"',
    steps: [
      { state: 'split first', say: 'Split the sentence into `["dog","dog","dog","dog"]`. Four letters, four words, so the lengths agree.' },
      { state: 'charToWord {a:dog}, wordToChar {dog:a}', say: 'Index 0: `a`↔`dog`. New both ways, record it.' },
      { state: 'index 1: b and dog', say: 'Index 1: `b` has no word yet, so a one-way check would happily bind `b`→`dog`.' },
      { state: '', say: 'But `wordToChar` already says `dog` belongs to `a`. Two letters cannot share a word, so return `false`.' }
    ],
    takeaway: 'Identical structure to Isomorphic Strings. Once you can name a problem as "bijection", you already know it needs two maps and a length check.'
  },
  hints: [
    'Split the sentence into words first. What is the very first thing you can now check for free?',
    'This is Isomorphic Strings with words on one side. Two maps: `Character` to `String` and `String` to `Character`.',
    'Pseudo-code: `words = s.split(" "); if lengths differ return false; for i: c = pattern[i], w = words[i]; both unseen -> bind; otherwise both must already agree`'
  ],
  methodSignature: 'public boolean wordPattern(String pattern, String s)',
  javaTemplate: 'hashmap-count',
  javaSolution: `import java.util.*;

class Solution {
    public boolean wordPattern(String pattern, String s) {
        String[] words = s.split(" ");

        // One letter per word, so the counts must agree before anything else.
        if (pattern.length() != words.length) {
            return false;
        }

        Map<Character, String> charToWord = new HashMap<>();
        Map<String, Character> wordToChar = new HashMap<>();

        for (int i = 0; i < words.length; i++) {
            char c = pattern.charAt(i);
            String w = words[i];

            String boundWord = charToWord.get(c);
            Character boundChar = wordToChar.get(w);

            if (boundWord == null && boundChar == null) {
                // Neither side is taken, so this pairing is allowed.
                charToWord.put(c, w);
                wordToChar.put(w, c);
            } else if (boundWord == null || boundChar == null) {
                // Exactly one side is already spoken for: not one-to-one.
                return false;
            } else if (!boundWord.equals(w) || boundChar.charValue() != c) {
                // Both sides are bound, but not to each other.
                return false;
            }
        }

        return true;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'one pass over the words; the split itself is linear in the sentence length',
    space: 'O(n)', spaceWhy: 'the split array plus two maps holding one entry per distinct letter'
  },
  testCases: [
    { input: { pattern: 'abba', s: 'dog cat cat dog' }, expected: 'true' },
    { input: { pattern: 'abba', s: 'dog cat cat fish' }, expected: 'false' },
    { input: { pattern: 'aaaa', s: 'dog cat cat dog' }, expected: 'false' },
    { input: { pattern: 'abba', s: 'dog dog dog dog' }, expected: 'false' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.wordPattern("abba", "dog cat cat dog"));
        System.out.println(s.wordPattern("abba", "dog cat cat fish"));
        System.out.println(s.wordPattern("aaaa", "dog cat cat dog"));
        System.out.println(s.wordPattern("abba", "dog dog dog dog"));
    }
}`,
  commonMistakes: [
    'Skipping the length check. `pattern = "a"` with `s = "dog cat"` then reads only the first word and wrongly returns `true`.',
    'Comparing words with `==` instead of `.equals()`. It appears to work for short literals because of string interning, and breaks for strings built at runtime.',
    'Using one map only, which fails on `"abba"` / `"dog dog dog dog"`.',
    'Assuming `split(" ")` handles multiple spaces. It does not. These constraints promise single spaces; a messier input needs `split("\\\\s+")`.'
  ],
  followUps: [
    'Word Pattern II allows the words to be split however you like, which turns it into backtracking.',
    'Both this and Isomorphic Strings can be solved by comparing "first index of each token" signatures.'
  ]
},

{
  id: 'missing-number',
  leetcodeNumber: 268,
  title: 'Missing Number',
  url: 'https://leetcode.com/problems/missing-number/',
  pattern: 'arrays-hashing',
  difficulty: 'Easy',
  order: 10,
  tags: ['hash-set', 'array', 'math'],
  problemSummary: 'An array holds `n` distinct numbers taken from the range `0..n`. Exactly one value from that range is absent. Return it.',
  examples: [
    { input: 'nums = [3,0,1]', output: '2', note: 'n = 3, so the range is 0..3. 2 is absent.' },
    { input: 'nums = [0,1]', output: '2', note: 'n = 2, range 0..2, and 2 is the one missing.' },
    { input: 'nums = [9,6,4,2,3,5,7,0,1]', output: '8', note: 'n = 9, range 0..9.' }
  ],
  constraints: ['n == nums.length', '1 <= n <= 10^4', '0 <= nums[i] <= n', 'All numbers are distinct'],
  techniqueNote: 'a set as a presence oracle, then walk the range rather than the array.',
  signals: [
    '"Which value from a known range is absent" is a membership question.',
    'The range `0..n` is given, so you can enumerate what SHOULD be there and check each one.',
    'A hash set is the obvious first answer here; the O(1)-space answers in the follow-ups are the interesting part.'
  ],
  intuition: {
    input: 'nums = [3,0,1]',
    visual:
      'array   3  0  1          present = {3, 0, 1}\n' +
      'range   0  1  2  3       0 there, 1 there, 2 MISSING -> answer 2',
    steps: [
      { state: 'present = {3,0,1}', say: 'Pour the array into a set. Now membership is one step.' },
      { state: 'i = 0', say: 'Is `0` present? Yes.' },
      { state: 'i = 1', say: 'Is `1` present? Yes.' },
      { state: 'i = 2', say: 'Is `2` present? No. That is the answer.' },
      { state: '', say: 'Note the loop runs `0..n` INCLUSIVE, which is `n + 1` values for an array of length `n`. The missing number might be `n` itself.' }
    ],
    takeaway: 'When the valid range is known, iterate the RANGE and ask the set, rather than iterating the array and trying to spot a gap.'
  },
  hints: [
    'You know exactly which numbers should be present: `0` through `n`. How would you check each one cheaply?',
    'Put every element into a `HashSet`, then loop `i` from `0` to `n` inclusive and return the first `i` the set does not contain.',
    'Pseudo-code: `present = set(nums); for i in 0..nums.length: if !present.contains(i) return i`'
  ],
  methodSignature: 'public int missingNumber(int[] nums)',
  javaTemplate: 'hashmap-count',
  javaSolution: `import java.util.*;

class Solution {
    public int missingNumber(int[] nums) {
        Set<Integer> present = new HashSet<>();
        for (int x : nums) {
            present.add(x);
        }

        // <= nums.length, not <. An array of length n covers the range 0..n,
        // which is n+1 candidate values, and n itself can be the missing one.
        for (int i = 0; i <= nums.length; i++) {
            if (!present.contains(i)) {
                return i;
            }
        }

        return -1;   // unreachable: exactly one value is guaranteed missing
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'one pass to build the set, at most n+1 constant-time lookups to find the gap',
    space: 'O(n)', spaceWhy: 'the set holds all n elements. The follow-ups get this to O(1).'
  },
  testCases: [
    { input: { nums: [3, 0, 1] }, expected: '2' },
    { input: { nums: [0, 1] }, expected: '2' },
    { input: { nums: [9, 6, 4, 2, 3, 5, 7, 0, 1] }, expected: '8' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.missingNumber(new int[]{3, 0, 1}));
        System.out.println(s.missingNumber(new int[]{0, 1}));
        System.out.println(s.missingNumber(new int[]{9, 6, 4, 2, 3, 5, 7, 0, 1}));
    }
}`,
  commonMistakes: [
    'Looping `i < nums.length` instead of `i <= nums.length`, which misses the case where `n` itself is the absent value. `[0,1]` catches this.',
    'Sorting and scanning for a gap. Correct, but O(n log n) and it mutates the input.',
    'Summing with `int` on very large inputs. Not a problem at n = 10^4, but the habit matters: `n(n+1)/2` overflows an `int` around n = 65,000.'
  ],
  followUps: [
    'Sum formula: the range `0..n` sums to `n(n+1)/2`. Subtract the actual array sum and the difference is the missing number. O(n) time, **O(1) space**.',
    'XOR: XOR together every index `0..n` and every value. Pairs cancel and the loner is the answer. Also O(1) space, and immune to overflow. You will meet this again in Bit Manipulation.'
  ]
},

{
  id: 'group-anagrams',
  leetcodeNumber: 49,
  title: 'Group Anagrams',
  url: 'https://leetcode.com/problems/group-anagrams/',
  pattern: 'arrays-hashing',
  difficulty: 'Medium',
  order: 11,
  tags: ['hash-map', 'grouping', 'string', 'computed-key'],
  problemSummary: 'Given a list of words, group together the ones that are anagrams of each other. Return the groups in any order.',
  examples: [
    { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["eat","tea","ate"],["tan","nat"],["bat"]]', note: 'Group order and order within a group do not matter.' },
    { input: 'strs = [""]', output: '[[""]]', note: 'The empty string is its own group.' }
  ],
  constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters'],
  techniqueNote: 'grouping by a **computed key**. Anagrams are not equal, but they can be made to produce the same key.',
  signals: [
    'The word **group**, **bucket**, **partition by**, or "collect the ones that share ...".',
    'Two items belong together when some derived value matches, not when the items themselves match.',
    'You need a `Map<Key, List<Item>>`, which is what `computeIfAbsent` exists for.'
  ],
  intuition: {
    input: 'strs = ["eat","tea","tan"]',
    visual:
      'word   sorted letters = KEY     buckets\n' +
      'eat    aet                      {aet: [eat]}\n' +
      'tea    aet                      {aet: [eat, tea]}\n' +
      'tan    ant                      {aet: [eat, tea], ant: [tan]}',
    steps: [
      { state: '', say: 'Anagrams are not equal as strings, so a map keyed on the word itself groups nothing. You need a key that is IDENTICAL for anagrams.' },
      { state: 'key("eat") = "aet"', say: 'Sort the letters. `eat`, `tea` and `ate` all sort to `aet`.' },
      { state: 'buckets = {aet: [eat]}', say: 'Put `eat` in the bucket named `aet`.' },
      { state: 'buckets = {aet: [eat, tea]}', say: '`tea` also sorts to `aet`, so it lands in the same bucket. That is the grouping, done.' },
      { state: 'buckets = {aet: [...], ant: [tan]}', say: '`tan` sorts to `ant`, a new bucket. At the end, the answer is just the map values.' }
    ],
    takeaway: 'The insight is choosing the key, not writing the loop. "Sorted letters" is one valid canonical form; a 26-length count string is another and is faster.'
  },
  hints: [
    'A map groups things that share a key. Two anagrams are different strings, so what value could you compute from each word that comes out identical for anagrams?',
    'Sort each word\'s characters and use the sorted string as the map key. `computeIfAbsent(key, k -> new ArrayList<>()).add(word)` builds the bucket in one line.',
    'Pseudo-code: `for w in strs: key = sorted(w); buckets.computeIfAbsent(key, new list).add(w); return buckets.values()`'
  ],
  methodSignature: 'public List<List<String>> groupAnagrams(String[] strs)',
  javaTemplate: 'hashmap-count',
  javaSolution: `import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        // key = a canonical form shared by all anagrams of each other
        Map<String, List<String>> buckets = new HashMap<>();

        for (String word : strs) {
            char[] chars = word.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);

            // computeIfAbsent creates the list on first use, so there is no
            // "if the bucket does not exist yet" branch to get wrong.
            buckets.computeIfAbsent(key, k -> new ArrayList<>()).add(word);
        }

        return new ArrayList<>(buckets.values());
    }
}
`,
  complexity: {
    time: 'O(n · k log k)', timeWhy: 'n words, each sorted in k log k where k is the word length. The count-key variant in the follow-ups is O(n · k).',
    space: 'O(n · k)', spaceWhy: 'every word is stored once in a bucket, plus one key per group'
  },
  testCases: [
    { input: { strs: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'] }, expected: '[[ate, eat, tea], [bat], [nat, tan]]' },
    { input: { strs: [''] }, expected: '[[]]' },
    { input: { strs: ['a'] }, expected: '[[a]]' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        print(s.groupAnagrams(new String[]{"eat", "tea", "tan", "ate", "nat", "bat"}));
        print(s.groupAnagrams(new String[]{""}));
        print(s.groupAnagrams(new String[]{"a"}));
    }

    // HashMap iteration order is not defined, so the driver normalises: sort
    // inside each group, then sort the groups. The SOLUTION stays untouched.
    static void print(java.util.List<java.util.List<String>> groups) {
        java.util.List<java.util.List<String>> copy = new java.util.ArrayList<>();
        for (java.util.List<String> g : groups) {
            java.util.List<String> one = new java.util.ArrayList<>(g);
            java.util.Collections.sort(one);
            copy.add(one);
        }
        copy.sort((a, b) -> String.join(",", a).compareTo(String.join(",", b)));
        System.out.println(copy);
    }
}`,
  commonMistakes: [
    'Comparing every word against every other word to test anagram-ness. That is O(n²·k) and the map removes the outer comparison entirely.',
    'Using the word itself as the key, which groups nothing.',
    '`Arrays.sort(word.toCharArray())` on its own throws the sorted array away, because `toCharArray()` returns a fresh copy. Assign it to a variable first.',
    'Assuming the output order is stable. `HashMap` gives no ordering guarantee, which is why the test driver sorts before comparing.'
  ],
  followUps: [
    'Faster key: build a 26-length count array per word and turn it into a string like `"1#0#0#..."`. That is O(k) per word instead of O(k log k), and it is Valid Anagram\'s counting idea reused as a key.',
    'What if the words were Unicode? Sorting still works; the fixed 26-slot count key does not.'
  ]
},

{
  id: 'top-k-frequent-elements',
  leetcodeNumber: 347,
  title: 'Top K Frequent Elements',
  url: 'https://leetcode.com/problems/top-k-frequent-elements/',
  pattern: 'arrays-hashing',
  difficulty: 'Medium',
  order: 12,
  tags: ['counting', 'bucket-sort', 'hash-map'],
  problemSummary: 'Return the `k` values that appear most often in the array, in any order. The answer is guaranteed to be unique.',
  examples: [
    { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]', note: '1 appears three times, 2 appears twice.' },
    { input: 'nums = [1], k = 1', output: '[1]', note: 'Only one value exists.' }
  ],
  constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', 'k is in the range [1, number of distinct values]', 'The answer is unique'],
  techniqueNote: 'count, then **bucket by frequency**. A frequency can never exceed `n`, so frequencies make legal array indexes.',
  signals: [
    '**Top k** or **k most frequent**. A heap is the usual answer, and buckets are the O(n) answer.',
    'You need counts first, so a map is step one regardless.',
    'The key realisation: a count is bounded by `n`, so you can use the count itself as an array index and skip sorting entirely.'
  ],
  intuition: {
    input: 'nums = [1,1,1,2,2,3], k = 2',
    visual:
      'counts       1 -> 3     2 -> 2     3 -> 1\n' +
      '\n' +
      'buckets   index:  0    1     2     3     4     5     6\n' +
      '          holds:  []   [3]   [2]   [1]   []    []    []\n' +
      '                        ^     ^     ^\n' +
      'walk from the highest index down, taking values until k are collected: 1, then 2',
      steps: [
      { state: 'counts = {1:3, 2:2, 3:1}', say: 'First, count everything. Nothing clever yet.' },
      { state: '', say: 'Now the trick. Sorting the counts would cost O(n log n). But a count can never be larger than `n`, so build an array of `n + 1` lists and put each VALUE into the slot named by its COUNT.' },
      { state: 'buckets[3] = [1], buckets[2] = [2], buckets[1] = [3]', say: 'Value `1` had count 3 so it goes in slot 3. Value `2` had count 2 so slot 2. Value `3` had count 1 so slot 1.' },
      { state: 'walk down from index 6', say: 'Walk the buckets from the highest index downwards. The first non-empty slot holds the most frequent values.' },
      { state: 'answer = [1, 2]', say: 'Slot 3 gives `1`, slot 2 gives `2`. That is k = 2 values, so stop.' }
    ],
    takeaway: 'Bucket sort is what you reach for when the thing you are sorting by is a small bounded integer. Here that thing is a frequency, and it is bounded by `n`.'
  },
  hints: [
    'Step one is obvious: count the values. The question is how to get the k biggest counts without paying O(n log n) to sort them.',
    'A count is at least 1 and at most `n`. That means a count can be used as an ARRAY INDEX. Make `n + 1` buckets, drop each value into the bucket matching its count, then read the buckets from the top down.',
    'Pseudo-code: `counts = tally(nums); buckets = list of n+1 empty lists; for (value, c) in counts: buckets[c].add(value); for freq = n down to 1: for v in buckets[freq]: take v until k taken`'
  ],
  methodSignature: 'public int[] topKFrequent(int[] nums, int k)',
  javaTemplate: 'hashmap-count',
  javaSolution: `import java.util.*;

class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // Step 1: how often does each value appear?
        Map<Integer, Integer> counts = new HashMap<>();
        for (int x : nums) {
            counts.merge(x, 1, Integer::sum);
        }

        // Step 2: bucket by frequency. A frequency is between 1 and nums.length,
        // so it is a legal index into an array of size nums.length + 1.
        List<List<Integer>> buckets = new ArrayList<>();
        for (int i = 0; i <= nums.length; i++) {
            buckets.add(new ArrayList<>());
        }
        for (Map.Entry<Integer, Integer> e : counts.entrySet()) {
            buckets.get(e.getValue()).add(e.getKey());
        }

        // Step 3: read from the highest frequency downwards until we have k.
        int[] out = new int[k];
        int filled = 0;
        for (int freq = nums.length; freq >= 1 && filled < k; freq--) {
            for (int value : buckets.get(freq)) {
                out[filled] = value;
                filled++;
                if (filled == k) break;
            }
        }

        return out;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'counting is O(n), filling the buckets is O(distinct), and the downward walk touches each bucket slot once. No sort anywhere.',
    space: 'O(n)', spaceWhy: 'the count map plus n+1 bucket lists'
  },
  testCases: [
    { input: { nums: [1, 1, 1, 2, 2, 3], k: 2 }, expected: '[1, 2]' },
    { input: { nums: [1], k: 1 }, expected: '[1]' },
    { input: { nums: [4, 4, 4, 5, 5, 6, 6, 6, 6], k: 2 }, expected: '[4, 6]' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        // The problem allows any order, so the driver sorts before printing.
        print(s.topKFrequent(new int[]{1, 1, 1, 2, 2, 3}, 2));
        print(s.topKFrequent(new int[]{1}, 1));
        print(s.topKFrequent(new int[]{4, 4, 4, 5, 5, 6, 6, 6, 6}, 2));
    }

    static void print(int[] a) {
        int[] copy = a.clone();
        java.util.Arrays.sort(copy);
        System.out.println(java.util.Arrays.toString(copy));
    }
}`,
  commonMistakes: [
    'Sizing the bucket array as `nums.length` instead of `nums.length + 1`. A value that appears in every position has count `n`, and that index must exist.',
    'Iterating the buckets upwards, which returns the k LEAST frequent values.',
    'Forgetting to stop at k inside the inner loop. A single bucket can hold several values and you will write past the end of the output array.',
    'Sorting the entries of the count map. It works and is O(m log m), but it throws away the whole point of this problem.'
  ],
  followUps: [
    'The heap solution: keep a min-heap of size k ordered by count, for O(n log k). That is the version you will build again in the Heap pattern.',
    'Quickselect on the counts gives O(n) average without buckets, at the cost of much fiddlier code.'
  ]
},

{
  id: 'product-of-array-except-self',
  leetcodeNumber: 238,
  title: 'Product of Array Except Self',
  url: 'https://leetcode.com/problems/product-of-array-except-self/',
  pattern: 'arrays-hashing',
  difficulty: 'Medium',
  order: 13,
  tags: ['prefix-product', 'array', 'two-pass'],
  problemSummary: 'For each position, return the product of every other element in the array. You must not use division, and it must run in O(n).',
  examples: [
    { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]', note: 'At index 0: 2·3·4 = 24. At index 3: 1·2·3 = 6.' },
    { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]', note: 'The zero forces most outputs to zero, which is why division is banned.' }
  ],
  constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30', 'The product of any prefix or suffix fits in a 32-bit integer'],
  techniqueNote: 'prefix and suffix products. Not hashing, but the same instinct: precompute in one pass so the second pass is O(1) per element.',
  signals: [
    '"Everything except me" for every position, which smells like O(n²) until you split it in two.',
    'Division is explicitly banned, which is a hint that the intended solution never needed it.',
    'The answer at index `i` is (everything to the left) × (everything to the right). Two independent quantities, each computable in one sweep.'
  ],
  intuition: {
    input: 'nums = [1,2,3,4]',
    visual:
      'nums                 1     2     3     4\n' +
      'prefix (left of i)   1     1     2     6      <- running product, shifted right\n' +
      'suffix (right of i)  24    12    4     1      <- running product from the end\n' +
      'answer = product     24    12    8     6',
    steps: [
      { state: '', say: 'The answer at index `i` is everything to its left multiplied by everything to its right. Handle those two halves separately.' },
      { state: 'out = [1, 1, 2, 6]', say: 'Left-to-right pass. `out[i]` becomes the product of everything strictly BEFORE `i`. `out[0]` is 1, because there is nothing to the left of the first element.' },
      { state: 'suffix = 1', say: 'Now sweep right-to-left with a single running variable holding the product of everything strictly AFTER `i`.' },
      { state: 'i=3: out[3] = 6 × 1 = 6, suffix becomes 4', say: 'Multiply in place, then fold `nums[i]` into the suffix so the next step is correct.' },
      { state: 'i=2: out[2] = 2 × 4 = 8, suffix becomes 12', say: 'Same move again.' },
      { state: 'out = [24, 12, 8, 6]', say: 'Two passes, one output array, no division, no extra storage.' }
    ],
    takeaway: 'Split a "for each i, look at everything else" question into left-of-i and right-of-i. Each side is a running product, so each side is one sweep.'
  },
  hints: [
    'The answer at index `i` is the product of two things. What are they, and does either depend on `i` in a complicated way?',
    'First pass left to right: fill `out[i]` with the product of everything before `i`. Second pass right to left: keep one running `suffix` variable and multiply it into `out[i]`, updating `suffix` afterwards.',
    'Pseudo-code: `out[0] = 1; for i in 1..n-1: out[i] = out[i-1] * nums[i-1]; suffix = 1; for i in n-1..0: out[i] *= suffix; suffix *= nums[i]`'
  ],
  methodSignature: 'public int[] productExceptSelf(int[] nums)',
  javaTemplate: 'hashmap-count',
  javaSolution: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] out = new int[n];

        // Pass 1, left to right: out[i] = product of everything BEFORE i.
        // Nothing sits to the left of index 0, so that product is 1.
        out[0] = 1;
        for (int i = 1; i < n; i++) {
            out[i] = out[i - 1] * nums[i - 1];
        }

        // Pass 2, right to left: fold in the product of everything AFTER i.
        // One variable is enough, so no second array is needed.
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            out[i] = out[i] * suffix;
            suffix = suffix * nums[i];   // AFTER using it, so suffix never
        }                                // includes nums[i] for index i

        return out;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'two sweeps over the array, no nesting and no sorting',
    space: 'O(1)', spaceWhy: 'excluding the required output array, only one integer of extra state'
  },
  testCases: [
    { input: { nums: [1, 2, 3, 4] }, expected: '[24, 12, 8, 6]' },
    { input: { nums: [-1, 1, 0, -3, 3] }, expected: '[0, 0, 9, 0, 0]' },
    { input: { nums: [2, 3] }, expected: '[3, 2]' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(java.util.Arrays.toString(s.productExceptSelf(new int[]{1, 2, 3, 4})));
        System.out.println(java.util.Arrays.toString(s.productExceptSelf(new int[]{-1, 1, 0, -3, 3})));
        System.out.println(java.util.Arrays.toString(s.productExceptSelf(new int[]{2, 3})));
    }
}`,
  commonMistakes: [
    'Computing the total product and dividing by `nums[i]`. Banned, and it breaks on zeros anyway: one zero makes every division either wrong or undefined.',
    'Updating `suffix` before using it, which includes `nums[i]` in its own answer.',
    'Allocating separate prefix and suffix arrays. It is correct and easier to read, but it gives up the O(1) extra space that this problem is famous for.',
    'Forgetting that `out[0]` must be seeded to 1 rather than left at Java\'s default 0, which would zero the entire result.'
  ],
  followUps: [
    'Handle zeros with division after all: count them. Zero zeros means plain division works, one zero means only that index is non-zero, two or more means everything is zero.',
    'The same prefix/suffix split powers range-sum queries, which you will see again in DP.'
  ]
},

{
  id: 'longest-consecutive-sequence',
  leetcodeNumber: 128,
  title: 'Longest Consecutive Sequence',
  url: 'https://leetcode.com/problems/longest-consecutive-sequence/',
  pattern: 'arrays-hashing',
  difficulty: 'Medium',
  order: 14,
  tags: ['hash-set', 'array', 'sequence'],
  problemSummary: 'Find the length of the longest run of consecutive integers present in the array. The elements need not be adjacent in the array, and it must run in O(n).',
  examples: [
    { input: 'nums = [100,4,200,1,3,2]', output: '4', note: '1,2,3,4 are all present, so the run has length 4.' },
    { input: 'nums = [0,3,7,2,5,8,4,6,0,1]', output: '9', note: '0 through 8, and the duplicate 0 changes nothing.' },
    { input: 'nums = []', output: '0', note: 'Nothing present.' }
  ],
  constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
  techniqueNote: 'a set for O(1) "does this number exist", plus one crucial pruning rule that keeps the whole thing linear.',
  signals: [
    '**Consecutive** integers, but their order in the array is irrelevant. That rules out sliding window.',
    'O(n) is demanded, which rules out sorting even though sorting makes the problem trivial.',
    'You need repeated "is `x + 1` present" lookups. That is a set.'
  ],
  intuition: {
    input: 'nums = [100,4,200,1,3,2]',
    visual:
      'set = {100, 4, 200, 1, 3, 2}\n' +
      '\n' +
      'x=1    is 0 present? no  -> 1 STARTS a run. walk up: 2 yes, 3 yes, 4 yes, 5 no. length 4\n' +
      'x=2    is 1 present? YES -> skip entirely, 2 is in the middle of a run\n' +
      'x=3    is 2 present? YES -> skip\n' +
      'x=4    is 3 present? YES -> skip\n' +
      'x=100  is 99 present? no -> starts a run of length 1\n' +
      'x=200  is 199 present? no -> starts a run of length 1',
    steps: [
      { state: 'set = {100,4,200,1,3,2}', say: 'Put everything in a set. Duplicates vanish, and membership is now free.' },
      { state: '', say: 'The naive idea is: for every number, walk upwards counting. That is O(n²) on input like `1,2,3,...,n`, because you re-walk the same run from every starting point.' },
      { state: 'x = 1', say: 'The fix: only start walking from a number that BEGINS a run. `1` begins a run because `0` is not in the set. Walk up: 2, 3, 4 are present, 5 is not. Length 4.' },
      { state: 'x = 2', say: '`2` does not begin a run, because `1` is present. Skip it immediately without walking.' },
      { state: '', say: 'Each run is now walked exactly once, from its own first element. Total work across all runs is at most n, so the whole thing is O(n) despite the inner while loop.' }
    ],
    takeaway: 'The set makes lookups free; the "only start at a run start" rule is what makes it linear. Without that rule the same code is O(n²).'
  },
  hints: [
    'Sorting would make this easy. You are not allowed to. What does a hash set let you ask that an array does not?',
    'For each number you could walk upwards while `x+1` is in the set. That is O(n²) as written. Which numbers are worth starting from?',
    'Pseudo-code: `all = set(nums); best = 0; for x in all: if all.contains(x-1) continue; len = 1; while all.contains(x+len) len++; best = max(best, len)`'
  ],
  methodSignature: 'public int longestConsecutive(int[] nums)',
  javaTemplate: 'hashmap-count',
  javaSolution: `import java.util.*;

class Solution {
    public int longestConsecutive(int[] nums) {
        // The set does two jobs: O(1) membership, and duplicates disappear.
        Set<Integer> all = new HashSet<>();
        for (int x : nums) {
            all.add(x);
        }

        int best = 0;

        for (int x : all) {
            // THE key line. If x-1 exists then x sits inside some run, and that
            // run will be counted from its own first element. Skipping here is
            // what keeps the whole method O(n) instead of O(n^2).
            if (all.contains(x - 1)) {
                continue;
            }

            // x begins a run. Walk up as far as the set allows.
            int length = 1;
            while (all.contains(x + length)) {
                length++;
            }

            best = Math.max(best, length);
        }

        return best;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'the inner while only runs for numbers that start a run, and across all runs it advances at most n times in total',
    space: 'O(n)', spaceWhy: 'the set holds every distinct value'
  },
  testCases: [
    { input: { nums: [100, 4, 200, 1, 3, 2] }, expected: '4' },
    { input: { nums: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1] }, expected: '9' },
    { input: { nums: [] }, expected: '0' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.longestConsecutive(new int[]{100, 4, 200, 1, 3, 2}));
        System.out.println(s.longestConsecutive(new int[]{0, 3, 7, 2, 5, 8, 4, 6, 0, 1}));
        System.out.println(s.longestConsecutive(new int[]{}));
    }
}`,
  commonMistakes: [
    'Leaving out the `contains(x - 1)` guard. The code still gives the right answer and quietly becomes O(n²), which times out on `1..100000`.',
    'Iterating `nums` instead of the set. Correct, but duplicates make you redo the same run repeatedly.',
    'Returning 1 for an empty array. Seed `best` to 0, not 1.',
    'Sorting first. It works in O(n log n), and it is the wrong answer to the question that was asked.'
  ],
  followUps: [
    'Union-Find also solves this by merging `x` with `x+1`, which you will meet in the Graphs pattern.',
    'If duplicates had to be counted, or the run had to be contiguous in the array, this becomes a completely different problem. Reread the constraints.'
  ]
},

{
  id: 'first-missing-positive',
  leetcodeNumber: 41,
  title: 'First Missing Positive',
  url: 'https://leetcode.com/problems/first-missing-positive/',
  pattern: 'arrays-hashing',
  difficulty: 'Hard',
  order: 15,
  tags: ['cyclic-sort', 'in-place-hashing', 'array'],
  problemSummary: 'Find the smallest positive integer that is absent from the array. It must run in O(n) time and use O(1) extra space, so no hash set is allowed.',
  examples: [
    { input: 'nums = [1,2,0]', output: '3', note: '1 and 2 are present, 3 is not.' },
    { input: 'nums = [3,4,-1,1]', output: '2', note: '1 is present, 2 is not.' },
    { input: 'nums = [7,8,9,11,12]', output: '1', note: 'Nothing small is present, so the answer is 1.' }
  ],
  constraints: ['1 <= nums.length <= 10^5', '-2^31 <= nums[i] <= 2^31 - 1'],
  techniqueNote: '**in-place hashing**. The array becomes its own hash table: the value `v` belongs at index `v - 1`.',
  signals: [
    'O(1) extra space is demanded while the problem is clearly about membership. That combination means the array itself must become the lookup structure.',
    'The answer is bounded: with `n` slots the answer is somewhere in `1..n+1`, so only values in `1..n` are worth caring about.',
    'The words "smallest missing positive" plus O(1) space is the signature of cyclic sort.'
  ],
  intuition: {
    input: 'nums = [3,4,-1,1]',
    visual:
      'goal: value v lives at index v-1, so a correct array looks like [1,2,3,4,...]\n' +
      '\n' +
      'start        [ 3,  4, -1,  1 ]\n' +
      'i=0: 3 -> index 2, swap with -1     [-1,  4,  3,  1 ]   now nums[0] = -1, out of range, stop\n' +
      'i=1: 4 -> index 3, swap with 1      [-1,  1,  3,  4 ]   now nums[1] = 1, keep going\n' +
      '     1 -> index 0, swap with -1     [ 1, -1,  3,  4 ]   now nums[1] = -1, out of range, stop\n' +
      'i=2: 3 already at index 2, done\n' +
      'i=3: 4 already at index 3, done\n' +
      '\n' +
      'scan  index 0 holds 1 (ok), index 1 holds -1 (should be 2)  ->  answer 2',
    steps: [
      { state: '', say: 'First narrow the problem. With `n` slots, the answer cannot be bigger than `n + 1`: if `1..n` are all present the answer is `n + 1`, otherwise it is one of `1..n`. So anything negative, zero, or greater than `n` is noise.' },
      { state: '', say: 'Now the trick that replaces the hash set. Decide that value `v` belongs at index `v - 1`. Then "is `v` present" becomes "does `nums[v-1]` equal `v`", which is a plain array read and costs no extra memory.' },
      { state: '[3,4,-1,1]', say: 'Walk the array putting each in-range value where it belongs, by swapping. `3` belongs at index 2, so swap it there.' },
      { state: '[-1,4,3,1]', say: 'Index 0 now holds `-1`, which is out of range, so stop swapping at this position and move on.' },
      { state: '[1,-1,3,4]', say: 'Index 1 held `4`, which belongs at index 3. Swapping brings `1` to index 1, and `1` belongs at index 0, so swap again. That is why this is a `while`, not an `if`.' },
      { state: '[1,-1,3,4]', say: 'Second scan: index 0 holds `1`, correct. Index 1 holds `-1` but should hold `2`. So `2` is the answer.' },
      { state: '', say: 'Each swap puts at least one value permanently in its correct slot, and there are only `n` slots, so the total number of swaps is at most `n`. The nested while does not make it quadratic.' }
    ],
    takeaway: 'When O(1) space is demanded for a membership problem over a bounded range, the array IS the hash table. Index `v - 1` is the bucket for value `v`.'
  },
  hints: [
    'How large can the answer possibly be, given an array of length `n`? That bound tells you which values you can ignore completely.',
    'You are not allowed a set, but you are allowed to rearrange the array. If you could guarantee that value `v` sits at index `v - 1`, how would you then find the answer in one scan?',
    'Pseudo-code: `for i in 0..n-1: while nums[i] is in 1..n and nums[nums[i]-1] != nums[i]: swap nums[i] with nums[nums[i]-1]; then for i: if nums[i] != i+1 return i+1; return n+1`'
  ],
  methodSignature: 'public int firstMissingPositive(int[] nums)',
  javaSolution: `class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;

        // Phase 1: put every value v in the range 1..n at index v-1.
        // Values outside that range cannot be the answer and are left alone.
        for (int i = 0; i < n; i++) {
            // A while, not an if: one swap can drop another in-range value into
            // position i, and that one needs relocating too.
            //
            // The third test is the loop guard. Without "target already correct"
            // two equal values would swap back and forth forever.
            while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                int target = nums[i] - 1;
                int tmp = nums[target];
                nums[target] = nums[i];
                nums[i] = tmp;
            }
        }

        // Phase 2: the first slot that does not hold its own index+1 names the
        // smallest missing positive.
        for (int i = 0; i < n; i++) {
            if (nums[i] != i + 1) {
                return i + 1;
            }
        }

        // Every slot was correct, so 1..n are all present.
        return n + 1;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'every swap places at least one value in its final slot, and there are only n slots, so there are at most n swaps in total across the whole nested loop',
    space: 'O(1)', spaceWhy: 'the array is rearranged in place; only a temporary for swapping'
  },
  testCases: [
    { input: { nums: [1, 2, 0] }, expected: '3' },
    { input: { nums: [3, 4, -1, 1] }, expected: '2' },
    { input: { nums: [7, 8, 9, 11, 12] }, expected: '1' },
    { input: { nums: [1] }, expected: '2' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.firstMissingPositive(new int[]{1, 2, 0}));
        System.out.println(s.firstMissingPositive(new int[]{3, 4, -1, 1}));
        System.out.println(s.firstMissingPositive(new int[]{7, 8, 9, 11, 12}));
        System.out.println(s.firstMissingPositive(new int[]{1}));
    }
}`,
  commonMistakes: [
    'Dropping the `nums[nums[i] - 1] != nums[i]` guard. On duplicates such as `[1,1]` the swap becomes a no-op and the while loop spins forever.',
    'Writing `if` instead of `while`. A swap can deliver another misplaced in-range value into position `i`, and it must be dealt with before moving on.',
    'Swapping with a stale index. `nums[i]` changes during the swap, so capture `target = nums[i] - 1` before touching anything.',
    'Forgetting to return `n + 1`. If the array is exactly `1..n`, phase 2 finds nothing wrong.',
    'Using a `HashSet`, which is O(n) space and fails the stated constraint even though it produces the right number.'
  ],
  followUps: [
    'A sign-marking variant exists: clean the array, then use the SIGN of `nums[v-1]` as the "v is present" bit, with no swapping at all.',
    'Missing Number (earlier in this pattern) is the easy cousin: a known dense range, so a sum or an XOR is enough.',
    'The same "value v belongs at index v-1" idea solves Find All Duplicates in an Array and Find the Duplicate Number.'
  ]
}

);
