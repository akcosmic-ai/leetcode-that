/*
 * Runnable driver for 643. Maximum Average Subarray I.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 12.75
 *   2) 5.0
 *   3) 2.0
 */
package lct.slidingwindow.maximumaveragesubarray;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.findMaxAverage(new int[]{1, 12, -5, -6, 50, 3}, 4));
        System.out.println(s.findMaxAverage(new int[]{5}, 1));
        System.out.println(s.findMaxAverage(new int[]{0, 1, 1, 3, 3}, 4));
    }
}
