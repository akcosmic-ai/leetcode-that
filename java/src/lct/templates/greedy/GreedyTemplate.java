/*
 * TEMPLATE: Greedy: Kadane, reach, sort-then-take
 *
 * Every one of these is a single pass with one or two running variables.
 * Before you trust a greedy rule, try to break it with a small adversarial
 * input. If you cannot break it, and you can say why, use it.
 *
 * Generated from data/templates/greedy.js.
 */
package lct.templates.greedy;

import java.util.*;

class GreedyTemplate {

    /** Shape 1 - KADANE. At each element: extend the run, or start fresh here. */
    int maxSubarraySum(int[] nums) {
        int best = nums[0];
        int current = nums[0];
        for (int i = 1; i < nums.length; i++) {
            // starting fresh is better whenever the run so far is a liability
            current = Math.max(nums[i], current + nums[i]);
            best = Math.max(best, current);
        }
        return best;                    // seeded from nums[0], so all-negative input works
    }

    /** Shape 2 - BUY LOW, SELL HIGH ONCE. Track the cheapest price seen so far. */
    int maxProfit(int[] prices) {
        int cheapest = Integer.MAX_VALUE;
        int best = 0;
        for (int p : prices) {
            cheapest = Math.min(cheapest, p);
            best = Math.max(best, p - cheapest);
        }
        return best;
    }

    /** Shape 3 - REACHABILITY. Track the furthest index reachable so far. */
    boolean canReachEnd(int[] jumps) {
        int furthest = 0;
        for (int i = 0; i < jumps.length; i++) {
            if (i > furthest) return false;         // there is a gap we cannot cross
            furthest = Math.max(furthest, i + jumps[i]);
        }
        return true;
    }

    /** Shape 4 - SORT THEN TAKE. The sort is what makes the local rule safe. */
    int maxPairsUnderLimit(int[] nums, int limit) {
        Arrays.sort(nums);
        int l = 0, r = nums.length - 1, pairs = 0;
        while (l < r) {
            if (nums[l] + nums[r] <= limit) { pairs++; l++; r--; }
            else r--;                                // the biggest cannot pair with anything
        }
        return pairs;
    }

    /** Shape 5 - RUNNING TOTAL WITH A RESET. Gas station: which start survives. */
    int startIndexThatSurvives(int[] gain) {
        int total = 0, tank = 0, start = 0;
        for (int i = 0; i < gain.length; i++) {
            total += gain[i];
            tank += gain[i];
            if (tank < 0) {                          // this start fails at i
                start = i + 1;                       // so the answer must be after i
                tank = 0;
            }
        }
        return total < 0 ? -1 : start;               // negative total means impossible
    }
}
