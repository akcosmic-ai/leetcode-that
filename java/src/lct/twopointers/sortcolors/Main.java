/*
 * Runnable driver for 75. Sort Colors.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) [0, 0, 1, 1, 2, 2]
 *   2) [0, 1, 2]
 *   3) [0]
 */
package lct.twopointers.sortcolors;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(run(s, new int[]{2, 0, 2, 1, 1, 0}));
        System.out.println(run(s, new int[]{2, 0, 1}));
        System.out.println(run(s, new int[]{0}));
    }

    static String run(Solution s, int[] nums) {
        s.sortColors(nums);
        return java.util.Arrays.toString(nums);
    }
}
