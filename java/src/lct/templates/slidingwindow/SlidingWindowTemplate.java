/*
 * TEMPLATE: Sliding window: fixed k, longest valid, shortest valid
 *
 * Three variants, and the difference is only WHERE you record the answer.
 * Longest: record after the shrink loop, when the window is legal again.
 * Shortest: record inside the shrink loop, while it is still legal. Fixed k:
 * no shrink loop at all, just add one and drop one.
 *
 * Generated from data/templates/sliding-window.js.
 */
package lct.templates.slidingwindow;

import java.util.*;

class SlidingWindowTemplate {

    /** Shape 1 - FIXED SIZE k. Add the incoming, drop the outgoing. */
    int maxSumOfSizeK(int[] nums, int k) {
        int sum = 0;
        for (int i = 0; i < k; i++) sum += nums[i];
        int best = sum;
        for (int r = k; r < nums.length; r++) {
            sum += nums[r] - nums[r - k];       // one in, one out
            best = Math.max(best, sum);
        }
        return best;
    }

    /** Shape 2 - LONGEST VALID. Grow right, shrink left only while the rule is broken. */
    int longestWithoutRepeats(String s) {
        Map<Character, Integer> countInWindow = new HashMap<>();
        int l = 0, best = 0;
        for (int r = 0; r < s.length(); r++) {
            char in = s.charAt(r);
            countInWindow.put(in, countInWindow.getOrDefault(in, 0) + 1);

            // while the invariant is broken, pull the left edge forward
            while (countInWindow.get(in) > 1) {
                char out = s.charAt(l);
                countInWindow.put(out, countInWindow.get(out) - 1);
                if (countInWindow.get(out) == 0) countInWindow.remove(out);
                l++;
            }

            // record AFTER shrinking: the window is legal here
            best = Math.max(best, r - l + 1);
        }
        return best;
    }

    /** Shape 3 - SHORTEST VALID. Record INSIDE the shrink loop, while still legal. */
    int shortestSumAtLeast(int[] nums, int target) {
        int l = 0, sum = 0, best = Integer.MAX_VALUE;
        for (int r = 0; r < nums.length; r++) {
            sum += nums[r];
            while (sum >= target) {
                best = Math.min(best, r - l + 1);   // still legal, so measure now
                sum -= nums[l];
                l++;
            }
        }
        return best == Integer.MAX_VALUE ? 0 : best;
    }

    /** Shape 4 - AT MOST k DISTINCT. map.size() is the distinct count, so remove zero entries. */
    int longestWithAtMostKDistinct(String s, int k) {
        Map<Character, Integer> counts = new HashMap<>();
        int l = 0, best = 0;
        for (int r = 0; r < s.length(); r++) {
            char in = s.charAt(r);
            counts.put(in, counts.getOrDefault(in, 0) + 1);
            while (counts.size() > k) {
                char out = s.charAt(l);
                int left = counts.get(out) - 1;
                if (left == 0) counts.remove(out);   // must remove, or size() lies
                else counts.put(out, left);
                l++;
            }
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
}
