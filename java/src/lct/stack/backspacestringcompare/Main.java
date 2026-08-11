/*
 * Runnable driver for 844. Backspace String Compare.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) true
 *   2) true
 *   3) false
 */
package lct.stack.backspacestringcompare;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.backspaceCompare("ab#c", "ad#c"));
        System.out.println(s.backspaceCompare("ab##", "c#d#"));
        System.out.println(s.backspaceCompare("a#c", "b"));
    }
}
