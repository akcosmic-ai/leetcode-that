/*
 * 977. Squares of a Sorted Array   [Easy]
 * https://leetcode.com/problems/squares-of-a-sorted-array/
 *
 * PATTERN: Two Pointers
 *
 * Given an array sorted in non-decreasing order that may contain negatives,
 * return an array of the squares of each number, sorted in non-decreasing
 * order.
 *
 * SIGNALS THAT POINT HERE
 * - Sorted input whose order is broken by a transformation. Ask where the
 *   extremes went, not where the middle went.
 * - The biggest value is at one of the two ends, so you can produce the output
 *   back to front.
 * - You wanted to square everything and sort. That is O(n log n) when O(n) is
 *   available.
 *
 * COMPLEXITY
 *   time  O(n)   exactly n comparisons, one per output slot. Squaring then sorting would be O(n log n).
 *   space O(n)   the output array, which the problem requires. No other allocation.
 *
 * COMMON MISTAKES
 * - Filling the output front to back. You cannot identify the SMALLEST square
 *   from the ends, only the largest.
 * - Comparing nums[l] with nums[r] instead of their squares. -4 < 10 but 16 >
 *   100 is false, and using the raw values gets the ordering wrong.
 * - Using while (l < r), which stops one element early. Every slot needs
 *   filling, so loop until l > r or drive the loop from write.
 * - Squaring into the input array and calling Arrays.sort. Correct, and it
 *   gives up the linear time this problem exists to teach.
 *
 * FOLLOW-UPS
 * - You could binary search for the first non-negative index and then merge
 *   the two halves outwards. Same complexity, more code.
 * - The backwards-write idea is the same one that makes Merge Sorted Array
 *   work in place.
 *
 * Generated from data/problems/two-pointers.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.twopointers.squaresofsortedarray;

class Solution {
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
