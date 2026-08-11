/*
 * 121. Best Time to Buy and Sell Stock   [Easy]
 * https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
 *
 * PATTERN: Sliding Window
 *
 * Each value is the price on one day. Buy on one day and sell on a later day,
 * at most once. Return the largest profit possible, or 0 if no profitable
 * trade exists.
 *
 * SIGNALS THAT POINT HERE
 * - Buy before sell, so the pair must respect order. That is a left edge and a
 *   right edge.
 * - For each possible selling day, the best buying day is simply the cheapest
 *   day so far. One variable holds that.
 * - The O(n²) version tries every pair. Notice that the inner loop only ever
 *   wants a minimum.
 *
 * COMPLEXITY
 *   time  O(n)   one pass, constant work per day
 *   space O(1)   two integers, no array of running minima needed
 *
 * COMMON MISTAKES
 * - Returning a negative profit on a falling market. Seed best to 0, because
 *   not trading is permitted.
 * - Tracking the maximum price as well and returning max - min. That breaks
 *   when the maximum comes BEFORE the minimum, as in [2,4,1].
 * - Updating cheapest after computing the profit, which allows buying and
 *   selling on the same day at a loss.
 * - The O(n²) double loop, which times out at n = 10^5.
 *
 * FOLLOW-UPS
 * - Best Time to Buy and Sell Stock II allows unlimited trades, and the answer
 *   becomes "sum every upward step", which is greedy.
 * - Versions III and IV cap the number of transactions and become 2-D DP.
 *
 * Generated from data/problems/sliding-window.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.slidingwindow.besttimetobuyandsellstock;

class Solution {
    public int maxProfit(int[] prices) {
        int cheapest = Integer.MAX_VALUE;   // best buying day so far
        int best = 0;                        // 0 because doing nothing is allowed

        for (int p : prices) {
            // Update the buy price BEFORE measuring, so that selling on the same
            // day gives 0 rather than a negative number.
            cheapest = Math.min(cheapest, p);
            best = Math.max(best, p - cheapest);
        }

        return best;
    }
}
