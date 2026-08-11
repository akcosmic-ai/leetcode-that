/*
 * Runnable driver for 875. Koko Eating Bananas.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 4
 *   2) 30
 *   3) 23
 */
package lct.binarysearch.kokoeatingbananas;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.minEatingSpeed(new int[]{3, 6, 7, 11}, 8));
        System.out.println(s.minEatingSpeed(new int[]{30, 11, 23, 4, 20}, 5));
        System.out.println(s.minEatingSpeed(new int[]{30, 11, 23, 4, 20}, 6));
    }
}
