/*
 * Runnable driver for 42. Trapping Rain Water.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 6
 *   2) 9
 *   3) 0
 */
package lct.twopointers.trappingrainwater;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.trap(new int[]{0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1}));
        System.out.println(s.trap(new int[]{4, 2, 0, 3, 2, 5}));
        System.out.println(s.trap(new int[]{3}));
    }
}
