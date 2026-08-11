/*
 * Runnable driver for 169. Majority Element.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 3
 *   2) 2
 *   3) 1
 */
package lct.arrayshashing.majorityelement;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.majorityElement(new int[]{3, 2, 3}));
        System.out.println(s.majorityElement(new int[]{2, 2, 1, 1, 1, 2, 2}));
        System.out.println(s.majorityElement(new int[]{1}));
    }
}
