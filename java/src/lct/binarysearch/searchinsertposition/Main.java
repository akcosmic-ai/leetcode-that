/*
 * Runnable driver for 35. Search Insert Position.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 2
 *   2) 1
 *   3) 4
 */
package lct.binarysearch.searchinsertposition;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.searchInsert(new int[]{1, 3, 5, 6}, 5));
        System.out.println(s.searchInsert(new int[]{1, 3, 5, 6}, 2));
        System.out.println(s.searchInsert(new int[]{1, 3, 5, 6}, 7));
    }
}
