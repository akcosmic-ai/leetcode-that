/*
 * Runnable driver for 349. Intersection of Two Arrays.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) [2]
 *   2) [9, 4]
 *   3) []
 */
package lct.arrayshashing.intersectionoftwoarrays;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(java.util.Arrays.toString(s.intersection(new int[]{1, 2, 2, 1}, new int[]{2, 2})));
        System.out.println(java.util.Arrays.toString(s.intersection(new int[]{4, 9, 5}, new int[]{9, 4, 9, 8, 4})));
        System.out.println(java.util.Arrays.toString(s.intersection(new int[]{1, 2, 3}, new int[]{4, 5, 6})));
    }
}
