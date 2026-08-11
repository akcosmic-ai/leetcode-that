/*
 * 643. Maximum Average Subarray I   [Easy]
 * https://leetcode.com/problems/maximum-average-subarray-i/
 *
 * PATTERN: Sliding Window
 *
 * Find the contiguous block of exactly k elements with the largest average,
 * and return that average.
 *
 * SIGNALS THAT POINT HERE
 * - Exactly k contiguous elements. Fixed size is stated outright.
 * - You were about to recompute the sum for every starting position, which is
 *   O(n·k).
 * - Largest average over a fixed length is the same as largest SUM over that
 *   length, because dividing by k does not change the ordering.
 *
 * COMPLEXITY
 *   time  O(n)   k additions to build the first window, then one add and one subtract per slide
 *   space O(1)   two integers
 *
 * COMMON MISTAKES
 * - Writing sum / k with two ints, which does integer division and truncates.
 *   Cast to double first.
 * - Initialising best to 0. With all-negative input the answer is negative,
 *   and 0 is not a real window.
 * - Recomputing the whole window sum on every slide, which is O(n·k) and times
 *   out at n = 10^5.
 * - Comparing averages instead of sums. It is not wrong, just slower and less
 *   precise.
 *
 * FOLLOW-UPS
 * - Maximum Number of Vowels in a Substring of Given Length is the same fixed
 *   window with a different summary.
 * - Once the window length stops being fixed, you need the shrink loop, which
 *   is the next few problems.
 *
 * Generated from data/problems/sliding-window.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.slidingwindow.maximumaveragesubarray;

class Solution {
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
