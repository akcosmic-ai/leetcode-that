/*
 * Runnable driver for 20. Valid Parentheses.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) true
 *   2) false
 *   3) true
 *   4) false
 */
package lct.stack.validparentheses;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.isValid("()[]{}"));
        System.out.println(s.isValid("([)]"));
        System.out.println(s.isValid("{[]}"));
        System.out.println(s.isValid("("));
    }
}
