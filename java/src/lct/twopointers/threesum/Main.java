/*
 * Runnable driver for 15. 3Sum.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) [[-1, -1, 2], [-1, 0, 1]]
 *   2) []
 *   3) [[0, 0, 0]]
 */
package lct.twopointers.threesum;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        // Sorting the input makes the output order deterministic, so the driver
        // can print the list directly.
        System.out.println(s.threeSum(new int[]{-1, 0, 1, 2, -1, -4}));
        System.out.println(s.threeSum(new int[]{0, 1, 1}));
        System.out.println(s.threeSum(new int[]{0, 0, 0}));
    }
}
