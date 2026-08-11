/*
 * 35. Search Insert Position   [Easy]
 * https://leetcode.com/problems/search-insert-position/
 *
 * PATTERN: Binary Search
 *
 * The array is sorted with distinct values. Return the index of target, or the
 * index where it would need to be inserted to keep the array sorted. O(log n)
 * required.
 *
 * SIGNALS THAT POINT HERE
 * - The answer is a position, not a hit or a miss. That is the tell for the
 *   boundary form.
 * - The answer can be n, one past the end, which a closed interval [0, n-1]
 *   cannot represent. So hi starts at n.
 * - "First index such that ..." in any wording is lower_bound, and this loop
 *   shape is worth memorising as a unit.
 *
 * COMPLEXITY
 *   time  O(log n)   the range halves every iteration and the loop always runs to completion
 *   space O(1)   three integers
 *
 * COMMON MISTAKES
 * - Starting hi = nums.length - 1, which makes the answer 4 unreachable and
 *   returns 3 for target 7.
 * - Writing hi = mid - 1 in this form, which can skip past the boundary.
 * - Returning mid after the loop. mid is whatever the last iteration happened
 *   to compute; lo is the answer.
 * - Adding an early return mid on equality. It is not wrong for distinct
 *   values, and it stops the loop being a clean boundary search, which breaks
 *   once duplicates appear.
 *
 * FOLLOW-UPS
 * - With duplicates, this exact loop gives the FIRST occurrence. Flipping < to
 *   <= gives one past the LAST occurrence, which is how you count occurrences
 *   in O(log n).
 * - Find First and Last Position of Element in Sorted Array is two calls to
 *   this loop.
 *
 * Generated from data/problems/binary-search.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.binarysearch.searchinsertposition;

class Solution {
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
