/*
 * Runnable driver for 238. Product of Array Except Self.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) [24, 12, 8, 6]
 *   2) [0, 0, 9, 0, 0]
 *   3) [3, 2]
 */
package lct.arrayshashing.productofarrayexceptself;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(java.util.Arrays.toString(s.productExceptSelf(new int[]{1, 2, 3, 4})));
        System.out.println(java.util.Arrays.toString(s.productExceptSelf(new int[]{-1, 1, 0, -3, 3})));
        System.out.println(java.util.Arrays.toString(s.productExceptSelf(new int[]{2, 3})));
    }
}
