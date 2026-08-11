/*
 * Runnable driver for 1. Two Sum.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) [0, 1]
 *   2) [1, 2]
 *   3) [0, 1]
 */
package lct.arrayshashing.twosum;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(java.util.Arrays.toString(s.twoSum(new int[]{2, 7, 11, 15}, 9)));
        System.out.println(java.util.Arrays.toString(s.twoSum(new int[]{3, 2, 4}, 6)));
        System.out.println(java.util.Arrays.toString(s.twoSum(new int[]{3, 3}, 6)));
    }
}
