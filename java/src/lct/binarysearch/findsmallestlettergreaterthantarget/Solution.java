/*
 * 744. Find Smallest Letter Greater Than Target   [Easy]
 * https://leetcode.com/problems/find-smallest-letter-greater-than-target/
 *
 * PATTERN: Binary Search
 *
 * The array of letters is sorted and may contain duplicates. Return the
 * smallest letter strictly greater than target. If none exists, wrap around
 * and return the first letter.
 *
 * SIGNALS THAT POINT HERE
 * - "Smallest thing strictly greater than x" is upper_bound, and it is one
 *   character different from lower_bound.
 * - Duplicates are allowed, which is exactly where the difference between the
 *   two bounds matters.
 * - The wraparound is not a binary-search problem at all, it is one modulo at
 *   the end.
 *
 * COMPLEXITY
 *   time  O(log n)   the range halves each iteration
 *   space O(1)   three integers
 *
 * COMMON MISTAKES
 * - Using < instead of <=, which returns the target itself when it is present.
 * - Indexing letters[lo] without the modulo, which throws when nothing is
 *   greater.
 * - Starting hi = n - 1, which makes the "past the end" state unrepresentable
 *   and breaks the wraparound.
 * - Special-casing the wraparound with an if. The modulo already does it.
 *
 * FOLLOW-UPS
 * - The TreeSet methods higher, ceiling, lower and floor are these four bounds
 *   with names. Worth memorising which is which.
 * - Find First and Last Position of Element in Sorted Array is lower_bound and
 *   upper_bound side by side.
 *
 * Generated from data/problems/binary-search.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.binarysearch.findsmallestlettergreaterthantarget;

class Solution {
    public char nextGreatestLetter(char[] letters, char target) {
        int lo = 0;
        int hi = letters.length;   // half-open, so "past the end" is representable

        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;

            // <= rather than < is what makes this STRICTLY greater. Letters equal
            // to the target count as too small, so the boundary lands past every
            // copy of them.
            if (letters[mid] <= target) {
                lo = mid + 1;
            } else {
                hi = mid;          // mid might be the answer
            }
        }

        // If nothing was greater, lo == letters.length and the modulo wraps to 0.
        return letters[lo % letters.length];
    }
}
