/*
 * Runnable driver for 69. Sqrt(x).
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 2
 *   2) 2
 *   3) 0
 *   4) 46340
 */
package lct.binarysearch.sqrtx;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.mySqrt(4));
        System.out.println(s.mySqrt(8));
        System.out.println(s.mySqrt(0));
        // The overflow case: wrong answers here mean mid * mid was computed in int.
        System.out.println(s.mySqrt(2147483647));
    }
}
