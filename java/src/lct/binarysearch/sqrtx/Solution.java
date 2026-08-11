/*
 * 69. Sqrt(x)   [Easy]
 * https://leetcode.com/problems/sqrtx/
 *
 * PATTERN: Binary Search
 *
 * Return the integer square root of a non-negative integer, that is the square
 * root rounded down. No built-in exponent or square-root function.
 *
 * SIGNALS THAT POINT HERE
 * - No array anywhere, and the answer is a number in a known range. Search
 *   that range.
 * - The predicate mid mid <= x is monotone: true for every candidate up to the
 *   root and false after it. Monotone is all binary search needs.
 * - "Rounded down" means you want the LARGEST candidate that satisfies the
 *   predicate, so keep a running best.
 *
 * COMPLEXITY
 *   time  O(log x)   the candidate range halves each iteration, about 31 steps at the maximum x
 *   space O(1)   four integers
 *
 * COMMON MISTAKES
 * - Computing mid mid in int. It wraps negative near the top of the range, and
 *   the last test case above catches it.
 * - Writing (long) (mid mid), which overflows in int before the cast does
 *   anything.
 * - Using mid <= x / mid instead. It works and it is a division per iteration
 *   and harder to read.
 * - Not tracking best and instead returning lo or hi after the loop. hi
 *   happens to hold the answer in this form, and relying on that without
 *   knowing why is how the next problem breaks.
 *
 * FOLLOW-UPS
 * - Valid Perfect Square (next) is this loop asking for exact equality instead
 *   of a floor.
 * - Newton's method converges faster, and binary search is the one that
 *   generalises to any monotone predicate.
 * - The same search-the-answer shape solves Koko Eating Bananas and Capacity
 *   To Ship Packages.
 *
 * Generated from data/problems/binary-search.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.binarysearch.sqrtx;

class Solution {
    public int mySqrt(int x) {
        int lo = 0;
        int hi = x;
        int best = 0;   // largest candidate whose square fits under x

        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;

            // (long) applies to mid FIRST, so the multiplication happens in long.
            // Writing (long)(mid * mid) would overflow before the cast and is the
            // classic version of this bug. At x = 2147483647, mid reaches 46341
            // and 46341 * 46341 wraps negative in int.
            if ((long) mid * mid <= x) {
                best = mid;      // valid, so remember it and reach higher
                lo = mid + 1;
            } else {
                hi = mid - 1;    // too big
            }
        }

        return best;
    }
}
