/*
 * Runnable driver for 268. Missing Number.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 2
 *   2) 2
 *   3) 8
 */
package lct.arrayshashing.missingnumber;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.missingNumber(new int[]{3, 0, 1}));
        System.out.println(s.missingNumber(new int[]{0, 1}));
        System.out.println(s.missingNumber(new int[]{9, 6, 4, 2, 3, 5, 7, 0, 1}));
    }
}
