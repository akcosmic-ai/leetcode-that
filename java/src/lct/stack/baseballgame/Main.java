/*
 * Runnable driver for 682. Baseball Game.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 30
 *   2) 27
 *   3) 1
 */
package lct.stack.baseballgame;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.calPoints(new String[]{"5", "2", "C", "D", "+"}));
        System.out.println(s.calPoints(new String[]{"5", "-2", "4", "C", "D", "9", "+", "+"}));
        System.out.println(s.calPoints(new String[]{"1"}));
    }
}
