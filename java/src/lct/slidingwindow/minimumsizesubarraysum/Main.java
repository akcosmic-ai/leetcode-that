/*
 * Runnable driver for 209. Minimum Size Subarray Sum.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 2
 *   2) 1
 *   3) 0
 */
package lct.slidingwindow.minimumsizesubarraysum;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.minSubArrayLen(7, new int[]{2, 3, 1, 2, 4, 3}));
        System.out.println(s.minSubArrayLen(4, new int[]{1, 4, 4}));
        System.out.println(s.minSubArrayLen(11, new int[]{1, 1, 1, 1, 1, 1, 1, 1}));
    }
}
