/*
 * 209. Minimum Size Subarray Sum   [Medium]
 * https://leetcode.com/problems/minimum-size-subarray-sum/
 *
 * PATTERN: Sliding Window
 *
 * All values are positive. Find the length of the shortest contiguous block
 * whose sum is at least target, or 0 if no such block exists.
 *
 * SIGNALS THAT POINT HERE
 * - Shortest or minimum length contiguous block satisfying a condition.
 * - All values are positive, which is what guarantees the sum grows as you
 *   extend and shrinks as you contract. Without that the window is unsound.
 * - You want to shrink aggressively while still legal, because a shorter legal
 *   window is a better answer.
 *
 * COMPLEXITY
 *   time  O(n)   l only moves forward, so each index is added once and subtracted once
 *   space O(1)   three integers
 *
 * COMMON MISTAKES
 * - Recording the length after the shrink loop, which measures a window that
 *   no longer meets the target.
 * - Returning Integer.MAX_VALUE when nothing qualifies. The problem asks for
 *   0.
 * - Applying this window to input that may contain negatives. Extending would
 *   no longer monotonically increase the sum, and the window logic breaks.
 * - Initialising best to 0, which then never gets beaten by a real length.
 *
 * FOLLOW-UPS
 * - With negative values allowed, the answer needs prefix sums plus a
 *   monotonic deque or a TreeMap, not a plain window.
 * - The stated O(n log n) follow-up: prefix sums plus a binary search for each
 *   start position.
 *
 * Generated from data/problems/sliding-window.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.slidingwindow.minimumsizesubarraysum;

class Solution {
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
