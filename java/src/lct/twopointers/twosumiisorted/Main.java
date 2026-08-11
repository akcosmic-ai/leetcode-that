/*
 * Runnable driver for 167. Two Sum II - Input Array Is Sorted.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) [1, 2]
 *   2) [1, 3]
 *   3) [1, 2]
 */
package lct.twopointers.twosumiisorted;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(java.util.Arrays.toString(s.twoSum(new int[]{2, 7, 11, 15}, 9)));
        System.out.println(java.util.Arrays.toString(s.twoSum(new int[]{2, 3, 4}, 6)));
        System.out.println(java.util.Arrays.toString(s.twoSum(new int[]{-1, 0}, -1)));
    }
}
