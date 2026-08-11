/*
 * Runnable driver for 150. Evaluate Reverse Polish Notation.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 9
 *   2) 6
 *   3) 22
 */
package lct.stack.evaluatereversepolishnotation;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.evalRPN(new String[]{"2", "1", "+", "3", "*"}));
        System.out.println(s.evalRPN(new String[]{"4", "13", "5", "/", "+"}));
        System.out.println(s.evalRPN(new String[]{"10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"}));
    }
}
