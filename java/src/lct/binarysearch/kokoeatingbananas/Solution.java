/*
 * 875. Koko Eating Bananas   [Medium]
 * https://leetcode.com/problems/koko-eating-bananas/
 *
 * PATTERN: Binary Search
 *
 * There are piles of bananas and h hours available. Each hour you pick one
 * pile and eat up to speed bananas from it; if the pile has fewer left, you
 * finish it and the hour is still used up. Find the smallest speed that clears
 * every pile within h hours.
 *
 * SIGNALS THAT POINT HERE
 * - Minimum value such that a condition holds. That phrasing is
 *   binary-search-the-answer, essentially always.
 * - The condition is monotone: if a speed is fast enough, every faster speed
 *   is too. That is the licence, and it is worth stating explicitly before you
 *   code.
 * - The answer range is huge (up to 10^9) and there is no array of candidates
 *   to scan.
 *
 * COMPLEXITY
 *   time  O(n log m)   n piles summed per feasibility check, times log(max pile) checks
 *   space O(1)   a few numbers
 *
 * COMMON MISTAKES
 * - Using floor division for the hours, pile / speed, which under-counts every
 *   partial pile.
 * - Summing hours in an int. With 10^4 piles of 10^9 at speed 1 the total
 *   exceeds Integer.MAX_VALUE.
 * - Starting lo = 0, which divides by zero.
 * - Using Math.ceil((double) pile / speed). It usually works and it is a
 *   precision risk you do not need to take.
 * - Not checking monotonicity before searching. If the predicate is not
 *   monotone, binary search is silently wrong rather than slow.
 *
 * FOLLOW-UPS
 * - Capacity To Ship Packages Within D Days, Split Array Largest Sum and
 *   Minimum Number of Days to Make m Bouquets are the same three steps with a
 *   different feasible.
 * - The hardest part is always deciding what to binary search over. Practise
 *   stating the answer range out loud before writing anything.
 *
 * Generated from data/problems/binary-search.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.binarysearch.kokoeatingbananas;

class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        // Speed 1 is the slowest that makes progress. Going faster than the
        // largest pile cannot save an hour, so that is the useful upper bound.
        int lo = 1;
        int hi = 0;
        for (int p : piles) {
            hi = Math.max(hi, p);
        }

        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;

            if (hoursNeeded(piles, mid) <= h) {
                hi = mid;        // fast enough, so mid might be the smallest
            } else {
                lo = mid + 1;    // too slow
            }
        }

        return lo;
    }

    /**
     * A partial pile still costs a whole hour, so each pile takes
     * ceil(pile / speed). Monotone: a larger speed never needs more hours,
     * which is what makes the binary search above valid.
     */
    private long hoursNeeded(int[] piles, int speed) {
        long hours = 0;
        for (int p : piles) {
            // Integer ceiling division. Math.ceil with doubles risks precision
            // trouble at these magnitudes.
            hours += (p + speed - 1) / speed;
        }
        return hours;   // long: 10^4 piles of 10^9 at speed 1 overflows an int
    }
}
