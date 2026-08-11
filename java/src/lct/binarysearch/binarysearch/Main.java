/*
 * Runnable driver for 704. Binary Search.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 4
 *   2) -1
 *   3) 0
 */
package lct.binarysearch.binarysearch;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.search(new int[]{-1, 0, 3, 5, 9, 12}, 9));
        System.out.println(s.search(new int[]{-1, 0, 3, 5, 9, 12}, 2));
        System.out.println(s.search(new int[]{5}, 5));
    }
}
