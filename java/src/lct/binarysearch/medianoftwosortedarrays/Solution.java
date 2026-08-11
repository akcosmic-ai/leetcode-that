/*
 * 4. Median of Two Sorted Arrays   [Hard]
 * https://leetcode.com/problems/median-of-two-sorted-arrays/
 *
 * PATTERN: Binary Search
 *
 * Two sorted arrays are given. Return the median of the combined collection,
 * without actually merging them. The required complexity is O(log(m+n)).
 *
 * SIGNALS THAT POINT HERE
 * - O(log(m+n)) is demanded on two sorted inputs, which rules out merging them
 *   (that is O(m+n)).
 * - A median is defined purely by a SPLIT: half the values below, half above.
 *   So search for the split rather than for a value.
 * - One binary search over the shorter array is enough, because the count
 *   taken from the other array is then forced.
 *
 * COMPLEXITY
 *   time  O(log(min(m, n)))   one binary search over the shorter array, with O(1) work per step. Better than the required O(log(m+n)).
 *   space O(1)   a handful of integers. Note the recursive swap at the top recurses at most once.
 *
 * COMMON MISTAKES
 * - Not swapping so that nums1 is the shorter array. Then take2 can fall
 *   outside nums2 and the indexing throws.
 * - Using (m + n) / 2 for half instead of (m + n + 1) / 2. Without the +1 the
 *   odd case no longer reads off the left half.
 * - Writing the boundary checks as if statements instead of sentinels. It is
 *   possible and it is roughly four extra branches, all of which are easy to
 *   get wrong.
 * - Dividing by 2 instead of 2.0, which does integer division and drops the
 *   .5.
 * - Merging the arrays. That is O(m+n) and, at these constraints, it passes.
 *   It also does not answer the question that was asked.
 *
 * FOLLOW-UPS
 * - Kth Smallest Element in Two Sorted Arrays is the general form; the median
 *   is k = (m+n)/2.
 * - Median of a stream needs two heaps instead, which is in the Heap pattern.
 * - Write the O(m+n) merge version first if the partition argument does not
 *   land. Getting a correct answer and then optimising is a legitimate route.
 *
 * Generated from data/problems/binary-search.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.binarysearch.medianoftwosortedarrays;

class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Always search the SHORTER array. That guarantees the count taken from
        // the longer one stays inside its own bounds, which removes a whole class
        // of edge case.
        if (nums1.length > nums2.length) {
            return findMedianSortedArrays(nums2, nums1);
        }

        int m = nums1.length;
        int n = nums2.length;

        // Size of the left half. The +1 makes the left half the bigger one when
        // the total is odd, so the median is simply its largest value.
        int half = (m + n + 1) / 2;

        int lo = 0;
        int hi = m;

        while (lo <= hi) {
            int take1 = lo + (hi - lo) / 2;   // from nums1 into the left half
            int take2 = half - take1;          // forced

            // The four values around the cut. Sentinels stand in for "nothing
            // there", which removes four boundary checks.
            int left1  = (take1 == 0) ? Integer.MIN_VALUE : nums1[take1 - 1];
            int right1 = (take1 == m) ? Integer.MAX_VALUE : nums1[take1];
            int left2  = (take2 == 0) ? Integer.MIN_VALUE : nums2[take2 - 1];
            int right2 = (take2 == n) ? Integer.MAX_VALUE : nums2[take2];

            if (left1 > right2) {
                hi = take1 - 1;        // took too many from nums1
            } else if (left2 > right1) {
                lo = take1 + 1;        // took too few from nums1
            } else {
                // Valid split: everything on the left is <= everything on the right.
                if ((m + n) % 2 == 1) {
                    return Math.max(left1, left2);
                }
                return (Math.max(left1, left2) + Math.min(right1, right2)) / 2.0;
            }
        }

        return 0.0;   // unreachable for valid input
    }
}
