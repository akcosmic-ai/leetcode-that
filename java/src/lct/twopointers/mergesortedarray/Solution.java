/*
 * 88. Merge Sorted Array   [Easy]
 * https://leetcode.com/problems/merge-sorted-array/
 *
 * PATTERN: Two Pointers
 *
 * Two sorted arrays. The first has m real values followed by exactly n empty
 * slots. Merge the second array into the first, in place, keeping everything
 * sorted.
 *
 * SIGNALS THAT POINT HERE
 * - Two already-sorted inputs to combine. One pointer per input.
 * - In place with spare room at the END of the destination. That spare room is
 *   a hint about direction.
 * - You tried it front to front and had to shift elements. Reversing the
 *   direction removes the shifting.
 *
 * COMPLEXITY
 *   time  O(m + n)   every value is written exactly once, and nothing is ever shifted
 *   space O(1)   three indexes; the merge happens inside the array you were given
 *
 * COMMON MISTAKES
 * - Merging front to front, which overwrites unread values in nums1.
 * - Forgetting the i >= 0 guard. When nums1 has no real values (m = 0),
 *   nums1[-1] throws.
 * - Looping while i >= 0 || j >= 0. Harmless but pointless: leftover nums1
 *   values are already positioned.
 * - Copying nums2 in and calling Arrays.sort. It passes, and it is O((m+n)
 *   log(m+n)) instead of linear.
 *
 * FOLLOW-UPS
 * - Merge Two Sorted Lists is the same merge on linked lists, where a dummy
 *   head replaces the write index.
 * - This backwards-write trick reappears in any in-place merge, including the
 *   merge step of merge sort done in place.
 *
 * Generated from data/problems/two-pointers.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.twopointers.mergesortedarray;

class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1;              // last real value in nums1
        int j = n - 1;              // last value in nums2
        int write = m + n - 1;      // last slot overall

        // Loop on j only. Once nums2 is exhausted, whatever is left in nums1 is
        // already sorted and already sitting in the correct place.
        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j]) {
                nums1[write] = nums1[i];
                i--;
            } else {
                nums1[write] = nums2[j];
                j--;
            }
            write--;
        }
    }
}
