/*
 * Runnable driver for 4. Median of Two Sorted Arrays.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 2.0
 *   2) 2.5
 *   3) 1.0
 */
package lct.binarysearch.medianoftwosortedarrays;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.findMedianSortedArrays(new int[]{1, 3}, new int[]{2}));
        System.out.println(s.findMedianSortedArrays(new int[]{1, 2}, new int[]{3, 4}));
        System.out.println(s.findMedianSortedArrays(new int[]{}, new int[]{1}));
    }
}
