/*
 * Runnable driver for 283. Move Zeroes.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) [1, 3, 12, 0, 0]
 *   2) [0]
 *   3) [1, 2, 3]
 */
package lct.twopointers.movezeroes;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(run(s, new int[]{0, 1, 0, 3, 12}));
        System.out.println(run(s, new int[]{0}));
        System.out.println(run(s, new int[]{1, 2, 3}));
    }

    static String run(Solution s, int[] nums) {
        s.moveZeroes(nums);
        return java.util.Arrays.toString(nums);
    }
}
