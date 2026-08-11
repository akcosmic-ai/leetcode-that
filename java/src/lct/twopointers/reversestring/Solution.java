/*
 * 344. Reverse String   [Easy]
 * https://leetcode.com/problems/reverse-string/
 *
 * PATTERN: Two Pointers
 *
 * Reverse a character array in place, using O(1) extra memory. Nothing is
 * returned; the caller sees the array you mutated.
 *
 * SIGNALS THAT POINT HERE
 * - In place plus O(1) extra memory rules out building a second array.
 * - Reverse, mirror, or swap the ends. Two pointers walking inward is the
 *   whole answer.
 * - You only need to run until the pointers meet, because past the middle you
 *   would undo your own swaps.
 *
 * COMPLEXITY
 *   time  O(n)   n/2 swaps, and constants are dropped
 *   space O(1)   two indexes and one char of scratch space
 *
 * COMMON MISTAKES
 * - Looping l <= r or all the way to n - 1, which reverses the array and then
 *   reverses it back.
 * - Trying s[l] = s[r]; s[r] = s[l]; without a temporary. The first line has
 *   already destroyed s[l].
 * - Returning a new array. The signature is void for a reason: the test checks
 *   the array you were handed.
 * - Reaching for new StringBuilder(new String(s)).reverse(), which allocates
 *   and breaks the O(1) requirement.
 *
 * FOLLOW-UPS
 * - Reverse Words in a String III applies this per word, using the space
 *   positions as boundaries.
 * - The same swap loop reverses a sub-range, which is how in-place array
 *   rotation works.
 *
 * Generated from data/problems/two-pointers.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.twopointers.reversestring;

class Solution {
    public void reverseString(char[] s) {
        int l = 0;
        int r = s.length - 1;

        while (l < r) {
            // Java has no tuple swap, so a temporary is required.
            char tmp = s[l];
            s[l] = s[r];
            s[r] = tmp;

            l++;
            r--;
        }
        // Nothing is returned: arrays are objects, so the caller sees the change.
    }
}
