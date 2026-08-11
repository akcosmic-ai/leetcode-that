/*
 * Runnable driver for 128. Longest Consecutive Sequence.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 4
 *   2) 9
 *   3) 0
 */
package lct.arrayshashing.longestconsecutivesequence;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.longestConsecutive(new int[]{100, 4, 200, 1, 3, 2}));
        System.out.println(s.longestConsecutive(new int[]{0, 3, 7, 2, 5, 8, 4, 6, 0, 1}));
        System.out.println(s.longestConsecutive(new int[]{}));
    }
}
