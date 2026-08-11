/*
 * Runnable driver for 239. Sliding Window Maximum.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) [3, 3, 5, 5, 6, 7]
 *   2) [1]
 *   3) [11]
 */
package lct.slidingwindow.slidingwindowmaximum;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(java.util.Arrays.toString(s.maxSlidingWindow(new int[]{1, 3, -1, -3, 5, 3, 6, 7}, 3)));
        System.out.println(java.util.Arrays.toString(s.maxSlidingWindow(new int[]{1}, 1)));
        System.out.println(java.util.Arrays.toString(s.maxSlidingWindow(new int[]{9, 11}, 2)));
    }
}
