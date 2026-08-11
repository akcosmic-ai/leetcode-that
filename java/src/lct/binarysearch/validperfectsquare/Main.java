/*
 * Runnable driver for 367. Valid Perfect Square.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) true
 *   2) false
 *   3) true
 *   4) true
 */
package lct.binarysearch.validperfectsquare;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.isPerfectSquare(16));
        System.out.println(s.isPerfectSquare(14));
        System.out.println(s.isPerfectSquare(1));
        // 46340 squared. Overflow in int makes this report false.
        System.out.println(s.isPerfectSquare(2147395600));
    }
}
