/*
 * 1539. Kth Missing Positive Number   [Easy]
 * https://leetcode.com/problems/kth-missing-positive-number/
 *
 * PATTERN: Binary Search
 *
 * The array is strictly increasing and contains positive integers. Considering
 * the positive integers that are absent from it, return the k-th smallest such
 * number.
 *
 * SIGNALS THAT POINT HERE
 * - The answer is not in the array at all, so a plain search cannot work.
 * - You can compute a monotone function of the index: "missing numbers before
 *   index i" never decreases as i grows. Binary search that.
 * - This is the problem that teaches you to look for a monotone quantity
 *   rather than a monotone array.
 *
 * COMPLEXITY
 *   time  O(log n)   one boundary search over the indexes; the predicate is computed in O(1)
 *   space O(1)   three integers
 *
 * COMMON MISTAKES
 * - Getting the formula wrong as arr[i] - i. It is arr[i] - (i + 1), because
 *   indexes are 0-based and positive integers start at 1.
 * - Starting hi = n - 1, which cannot express "the boundary is past the end"
 *   and breaks the case where nothing is missing.
 * - Returning arr[lo] - something instead of lo + k. The answer is not in the
 *   array, so it must be derived from the count.
 * - Walking the missing numbers one at a time. It is O(n + k), it passes at
 *   these constraints, and it misses the transferable idea.
 *
 * FOLLOW-UPS
 * - Missing Number in Arrays & Hashing is the dense version of this, where a
 *   set or a sum formula is enough.
 * - The same "binary search a derived monotone count" trick solves Kth
 *   Smallest Element in a Sorted Matrix.
 *
 * Generated from data/problems/binary-search.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.binarysearch.kthmissingpositivenumber;

class Solution {
    public int findKthPositive(int[] arr, int k) {
        int lo = 0;
        int hi = arr.length;   // half-open: the boundary may run past the end

        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;

            // With nothing missing, arr[mid] would be mid + 1. The shortfall IS
            // the count of positive integers missing below arr[mid], and it never
            // decreases as mid grows.
            int missingBefore = arr[mid] - (mid + 1);

            if (missingBefore < k) {
                lo = mid + 1;   // not enough missing yet, look further right
            } else {
                hi = mid;       // mid might be the first index that reaches k
            }
        }

        // lo real numbers sit below the answer, and the answer is the k-th
        // missing one, so it is the (lo + k)-th positive integer.
        return lo + k;
    }
}
