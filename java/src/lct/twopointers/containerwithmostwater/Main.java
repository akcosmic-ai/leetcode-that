/*
 * Runnable driver for 11. Container With Most Water.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 49
 *   2) 1
 *   3) 16
 */
package lct.twopointers.containerwithmostwater;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.maxArea(new int[]{1, 8, 6, 2, 5, 4, 8, 3, 7}));
        System.out.println(s.maxArea(new int[]{1, 1}));
        System.out.println(s.maxArea(new int[]{4, 3, 2, 1, 4}));
    }
}
