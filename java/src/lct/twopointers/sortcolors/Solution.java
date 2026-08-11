/*
 * 75. Sort Colors   [Medium]
 * https://leetcode.com/problems/sort-colors/
 *
 * PATTERN: Two Pointers
 *
 * The array contains only the values 0, 1 and 2. Sort it in place in a single
 * pass, without using a library sort.
 *
 * SIGNALS THAT POINT HERE
 * - Only a small fixed set of values, and they must end up grouped. That is a
 *   partition, not a sort.
 * - One pass plus O(1) space plus no library sort. Counting would need two
 *   passes; this needs one.
 * - It is Move Zeroes with three buckets instead of two.
 *
 * COMPLEXITY
 *   time  O(n)   each iteration either advances `mid` or decreases `high`, so the unknown region always shrinks
 *   space O(1)   three indexes and a temporary
 *
 * COMMON MISTAKES
 * - Advancing mid after swapping with high. That leaves an unexamined value
 *   behind and the array comes out wrong.
 * - Using mid < high instead of mid <= high, which leaves the final unknown
 *   element unclassified.
 * - Counting the three values and rewriting the array. It is correct and
 *   simple, and it is the two-pass answer the problem asks you to beat.
 * - Calling Arrays.sort. Explicitly disallowed, and it is O(n log n) for data
 *   that can be partitioned in O(n).
 *
 * FOLLOW-UPS
 * - This is the partition step of quicksort with three regions, which is why
 *   it handles duplicates so well.
 * - With k distinct values instead of 3, counting sort in two passes is the
 *   right answer; the one-pass trick does not generalise.
 *
 * Generated from data/problems/two-pointers.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.twopointers.sortcolors;

class Solution {
    public void sortColors(int[] nums) {
        // Invariant, held at all times:
        //   [0, low)        all 0
        //   [low, mid)      all 1
        //   [mid, high]     not yet examined
        //   (high, n-1]     all 2
        int low = 0;
        int mid = 0;
        int high = nums.length - 1;

        while (mid <= high) {
            if (nums[mid] == 0) {
                swap(nums, low, mid);
                low++;
                mid++;   // safe: whatever came back from low was a 1, already correct
            } else if (nums[mid] == 2) {
                swap(nums, mid, high);
                high--;
                // mid does NOT advance: the value swapped in from the back has
                // never been looked at.
            } else {
                mid++;   // a 1 is already in the right region
            }
        }
    }

    private void swap(int[] a, int i, int j) {
        int tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
}
