/*
 * Runnable driver for 739. Daily Temperatures.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) [1, 1, 4, 2, 1, 1, 0, 0]
 *   2) [1, 1, 1, 0]
 *   3) [1, 1, 0]
 */
package lct.stack.dailytemperatures;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(java.util.Arrays.toString(s.dailyTemperatures(new int[]{73, 74, 75, 71, 69, 72, 76, 73})));
        System.out.println(java.util.Arrays.toString(s.dailyTemperatures(new int[]{30, 40, 50, 60})));
        System.out.println(java.util.Arrays.toString(s.dailyTemperatures(new int[]{30, 60, 90})));
    }
}
