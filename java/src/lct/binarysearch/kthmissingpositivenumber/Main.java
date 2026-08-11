/*
 * Runnable driver for 1539. Kth Missing Positive Number.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 9
 *   2) 6
 *   3) 1
 */
package lct.binarysearch.kthmissingpositivenumber;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.findKthPositive(new int[]{2, 3, 4, 7, 11}, 5));
        System.out.println(s.findKthPositive(new int[]{1, 2, 3, 4}, 2));
        System.out.println(s.findKthPositive(new int[]{2}, 1));
    }
}
