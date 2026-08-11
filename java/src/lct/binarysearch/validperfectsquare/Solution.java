/*
 * 367. Valid Perfect Square   [Easy]
 * https://leetcode.com/problems/valid-perfect-square/
 *
 * PATTERN: Binary Search
 *
 * Decide whether a positive integer is the square of some integer, without
 * using any built-in square-root function.
 *
 * SIGNALS THAT POINT HERE
 * - Same shape as Sqrt(x), and that is the point of putting them next to each
 *   other.
 * - You want exact equality, not a floor, so the exact-match loop with an
 *   early return fits.
 * - The same long cast is required, for the same reason.
 *
 * COMPLEXITY
 *   time  O(log num)   the candidate range halves each iteration
 *   space O(1)   three integers and a long
 *
 * COMMON MISTAKES
 * - Multiplying in int, which reports false for large genuine squares such as
 *   2147395600.
 * - Calling Math.sqrt and checking the result is a whole number. Disallowed,
 *   and floating point makes it unreliable near the top of the range anyway.
 * - Starting hi = num / 2, which is a valid optimisation for num >= 4 and
 *   wrong for num = 1.
 * - Looping i from 1 upwards squaring each value. O(sqrt(num)) is about 46,000
 *   iterations, which passes here and is not the point.
 *
 * FOLLOW-UPS
 * - The odd-number trick: subtract 1, 3, 5, 7, … and check whether you land
 *   exactly on zero. O(sqrt(n)) with no multiplication at all.
 * - Sum of Square Numbers uses two pointers over the same candidate space.
 *
 * Generated from data/problems/binary-search.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.binarysearch.validperfectsquare;

class Solution {
    public boolean isPerfectSquare(int num) {
        int lo = 1;
        int hi = num;

        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;

            // long, for the same reason as Sqrt(x): mid can reach 46341 and
            // 46341 * 46341 does not fit in an int.
            long square = (long) mid * mid;

            if (square == num) {
                return true;
            }

            if (square < num) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }

        // The range emptied without an exact hit.
        return false;
    }
}
