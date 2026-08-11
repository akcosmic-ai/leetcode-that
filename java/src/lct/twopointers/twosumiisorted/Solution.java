/*
 * 167. Two Sum II - Input Array Is Sorted   [Easy]
 * https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/
 *
 * PATTERN: Two Pointers
 *
 * The array is sorted in non-decreasing order. Find the two values that add up
 * to the target and return their 1-based positions. Exactly one solution
 * exists, and you must use O(1) extra space.
 *
 * SIGNALS THAT POINT HERE
 * - Sorted array plus find a pair. This is the single loudest two-pointers
 *   signal there is.
 * - O(1) extra space is demanded, which rules out the hash map you used in Two
 *   Sum.
 * - Sortedness turns a comparison into a direction: too small means raise the
 *   low end, too big means lower the high end.
 *
 * COMPLEXITY
 *   time  O(n)   the pointers only move toward each other, so together they take at most n steps
 *   space O(1)   two indexes, which is why this beats the hash-map version of Two Sum
 *
 * COMMON MISTAKES
 * - Returning 0-based indexes. This problem is 1-based, unlike Two Sum.
 * - Moving both pointers on a mismatch. Only one of them is justified, and
 *   moving both can step over the answer.
 * - Using l <= r, which lets an element pair with itself.
 * - Reusing the hash map from Two Sum. It gives the right answer and violates
 *   the stated O(1) space constraint.
 *
 * FOLLOW-UPS
 * - Binary search the complement for each element: O(n log n), still O(1)
 *   space, and strictly worse than two pointers.
 * - 3Sum (next) is this exact loop wrapped in an outer anchor loop.
 *
 * Generated from data/problems/two-pointers.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.twopointers.twosumiisorted;

class Solution {
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
