/*
 * Runnable driver for 977. Squares of a Sorted Array.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) [0, 1, 9, 16, 100]
 *   2) [4, 9, 9, 49, 121]
 *   3) [1]
 */
package lct.twopointers.squaresofsortedarray;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(java.util.Arrays.toString(s.sortedSquares(new int[]{-4, -1, 0, 3, 10})));
        System.out.println(java.util.Arrays.toString(s.sortedSquares(new int[]{-7, -3, 2, 3, 11})));
        System.out.println(java.util.Arrays.toString(s.sortedSquares(new int[]{-1})));
    }
}
