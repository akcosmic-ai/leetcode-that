/*
 * Runnable driver for 88. Merge Sorted Array.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) [1, 2, 2, 3, 5, 6]
 *   2) [1]
 *   3) [1]
 */
package lct.twopointers.mergesortedarray;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(merged(s, new int[]{1, 2, 3, 0, 0, 0}, 3, new int[]{2, 5, 6}, 3));
        System.out.println(merged(s, new int[]{1}, 1, new int[]{}, 0));
        System.out.println(merged(s, new int[]{0}, 0, new int[]{1}, 1));
    }

    static String merged(Solution s, int[] a, int m, int[] b, int n) {
        s.merge(a, m, b, n);
        return java.util.Arrays.toString(a);
    }
}
