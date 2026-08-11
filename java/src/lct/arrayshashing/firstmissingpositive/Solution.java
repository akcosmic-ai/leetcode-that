/*
 * 41. First Missing Positive   [Hard]
 * https://leetcode.com/problems/first-missing-positive/
 *
 * PATTERN: Arrays & Hashing
 *
 * Find the smallest positive integer that is absent from the array. It must
 * run in O(n) time and use O(1) extra space, so no hash set is allowed.
 *
 * SIGNALS THAT POINT HERE
 * - O(1) extra space is demanded while the problem is clearly about
 *   membership. That combination means the array itself must become the lookup
 *   structure.
 * - The answer is bounded: with n slots the answer is somewhere in 1..n+1, so
 *   only values in 1..n are worth caring about.
 * - The words "smallest missing positive" plus O(1) space is the signature of
 *   cyclic sort.
 *
 * COMPLEXITY
 *   time  O(n)   every swap places at least one value in its final slot, and there are only n slots, so there are at most n swaps in total across the whole nested loop
 *   space O(1)   the array is rearranged in place; only a temporary for swapping
 *
 * COMMON MISTAKES
 * - Dropping the nums[nums[i] - 1] != nums[i] guard. On duplicates such as
 *   [1,1] the swap becomes a no-op and the while loop spins forever.
 * - Writing if instead of while. A swap can deliver another misplaced in-range
 *   value into position i, and it must be dealt with before moving on.
 * - Swapping with a stale index. nums[i] changes during the swap, so capture
 *   target = nums[i] - 1 before touching anything.
 * - Forgetting to return n + 1. If the array is exactly 1..n, phase 2 finds
 *   nothing wrong.
 * - Using a HashSet, which is O(n) space and fails the stated constraint even
 *   though it produces the right number.
 *
 * FOLLOW-UPS
 * - A sign-marking variant exists: clean the array, then use the SIGN of
 *   nums[v-1] as the "v is present" bit, with no swapping at all.
 * - Missing Number (earlier in this pattern) is the easy cousin: a known dense
 *   range, so a sum or an XOR is enough.
 * - The same "value v belongs at index v-1" idea solves Find All Duplicates in
 *   an Array and Find the Duplicate Number.
 *
 * Generated from data/problems/arrays-hashing.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.arrayshashing.firstmissingpositive;

class Solution {
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
