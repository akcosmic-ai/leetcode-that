/*
 * 1984. Minimum Difference Between Highest and Lowest of K Scores   [Easy]
 * https://leetcode.com/problems/minimum-difference-between-highest-and-lowest-of-k-scores/
 *
 * PATTERN: Sliding Window
 *
 * Choose exactly k of the numbers so that the gap between the largest and
 * smallest chosen value is as small as possible. Return that gap.
 *
 * SIGNALS THAT POINT HERE
 * - You may choose any k, and order in the input is irrelevant. That is
 *   permission to sort.
 * - After sorting, "k values that are close together" can only mean k
 *   CONSECUTIVE values. That turns choice into a window.
 * - Fixed window size k, so it is the simplest window shape: no shrink loop.
 *
 * COMPLEXITY
 *   time  O(n log n)   the sort dominates; sliding the window is a single O(n) pass
 *   space O(1)   sorting in place plus one running best
 *
 * COMMON MISTAKES
 * - Forgetting to sort, which makes the window meaningless.
 * - Looping l < nums.length - k instead of l + k - 1 < nums.length, which
 *   drops the last valid window.
 * - Missing the k == 1 case, though the general loop happens to return 0 for
 *   it anyway. Handling it explicitly documents the intent.
 * - Trying every combination of k values. That is exponential for no reason.
 *
 * FOLLOW-UPS
 * - K Closest Elements is the same "sorted plus a window of size k" idea,
 *   found with binary search on the window start.
 * - Once the window size depends on the data rather than being given, you need
 *   the shrink loop, which the next problems use.
 *
 * Generated from data/problems/sliding-window.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.slidingwindow.minimumdifferencekscores;

import java.util.*;

class Solution {
    public int minimumDifference(int[] nums, int k) {
        // One score means the highest and the lowest are the same score.
        if (k == 1) {
            return 0;
        }

        // Sorting is what makes the best group contiguous.
        Arrays.sort(nums);

        int best = Integer.MAX_VALUE;

        // l + k - 1 is the last index of the window, so stop before it runs off.
        for (int l = 0; l + k - 1 < nums.length; l++) {
            best = Math.min(best, nums[l + k - 1] - nums[l]);
        }

        return best;
    }
}
