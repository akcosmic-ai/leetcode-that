/*
 * 852. Peak Index in a Mountain Array   [Easy]
 * https://leetcode.com/problems/peak-index-in-a-mountain-array/
 *
 * PATTERN: Binary Search
 *
 * The array strictly increases to a single peak and then strictly decreases.
 * Return the index of the peak, in O(log n).
 *
 * SIGNALS THAT POINT HERE
 * - The input is not sorted, and it still has a monotone structure: "am I
 *   still climbing" is true then false, exactly once.
 * - O(log n) is required, so the linear scan is off the table.
 * - The test compares mid with mid + 1 rather than with a target. That is the
 *   shape of every peak-finding binary search.
 *
 * COMPLEXITY
 *   time  O(log n)   the range halves each iteration
 *   space O(1)   three integers
 *
 * COMMON MISTAKES
 * - Starting hi = arr.length, which makes arr[mid + 1] read past the end.
 * - Using the lo <= hi idiom here. Without a target there is nothing to return
 *   early on, and the boundary form is the right fit.
 * - Comparing against arr[mid - 1] as well, which is unnecessary and
 *   introduces a bounds check at mid == 0.
 * - Scanning linearly for the maximum. Correct, O(n), and it does not satisfy
 *   the stated requirement.
 *
 * FOLLOW-UPS
 * - Find Peak Element drops the guarantee of a single peak and the exact same
 *   code still works, which is worth thinking about.
 * - Find in Mountain Array combines this with two ordinary binary searches on
 *   the two slopes.
 *
 * Generated from data/problems/binary-search.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.binarysearch.peakindexinmountainarray;

class Solution {
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
