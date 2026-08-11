/*
 * Runnable driver for 84. Largest Rectangle in Histogram.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 10
 *   2) 4
 *   3) 1
 */
package lct.stack.largestrectangleinhistogram;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.largestRectangleArea(new int[]{2, 1, 5, 6, 2, 3}));
        System.out.println(s.largestRectangleArea(new int[]{2, 4}));
        System.out.println(s.largestRectangleArea(new int[]{1}));
    }
}
