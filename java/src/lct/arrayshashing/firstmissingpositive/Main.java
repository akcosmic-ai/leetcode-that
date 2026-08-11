/*
 * Runnable driver for 41. First Missing Positive.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 3
 *   2) 2
 *   3) 1
 *   4) 2
 */
package lct.arrayshashing.firstmissingpositive;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.firstMissingPositive(new int[]{1, 2, 0}));
        System.out.println(s.firstMissingPositive(new int[]{3, 4, -1, 1}));
        System.out.println(s.firstMissingPositive(new int[]{7, 8, 9, 11, 12}));
        System.out.println(s.firstMissingPositive(new int[]{1}));
    }
}
