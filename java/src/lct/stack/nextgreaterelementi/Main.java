/*
 * Runnable driver for 496. Next Greater Element I.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) [-1, 3, -1]
 *   2) [3, -1]
 *   3) [-1]
 */
package lct.stack.nextgreaterelementi;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(java.util.Arrays.toString(s.nextGreaterElement(new int[]{4, 1, 2}, new int[]{1, 3, 4, 2})));
        System.out.println(java.util.Arrays.toString(s.nextGreaterElement(new int[]{2, 4}, new int[]{1, 2, 3, 4})));
        System.out.println(java.util.Arrays.toString(s.nextGreaterElement(new int[]{1}, new int[]{1})));
    }
}
