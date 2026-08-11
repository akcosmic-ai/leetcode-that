/*
 * 704. Binary Search   [Easy]
 * https://leetcode.com/problems/binary-search/
 *
 * PATTERN: Binary Search
 *
 * The array is sorted in ascending order with no duplicates. Return the index
 * of target, or -1 if it is absent. It must run in O(log n).
 *
 * SIGNALS THAT POINT HERE
 * - Sorted input plus a search. That is the whole signal, and it never gets
 *   more subtle than this.
 * - O(log n) is demanded outright.
 * - You only need "is it here, and where", not a boundary, so the exact-match
 *   form is enough.
 *
 * COMPLEXITY
 *   time  O(log n)   the candidate range halves on every iteration, so at most log2(n) iterations run
 *   space O(1)   three integers. A recursive version would cost O(log n) stack.
 *
 * COMMON MISTAKES
 * - Writing mid = (lo + hi) / 2. Correct for small arrays, and an overflow bug
 *   waiting to happen.
 * - Using lo < hi with hi = mid - 1. That mixes the two idioms and can skip
 *   the answer.
 * - Assigning lo = mid or hi = mid in the exact-match form, which stops the
 *   range shrinking and loops forever.
 * - Forgetting to return -1, or returning mid after the loop where mid is
 *   meaningless.
 *
 * FOLLOW-UPS
 * - Search Insert Position (next) is the same problem when the target is
 *   absent, which needs the OTHER loop idiom.
 * - Arrays.binarySearch does this, and returns -(insertionPoint) - 1 when
 *   absent. Worth knowing, and worth being able to write by hand.
 *
 * Generated from data/problems/binary-search.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.binarysearch.binarysearch;

class Solution {
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
