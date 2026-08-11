/*
 * Runnable driver for 347. Top K Frequent Elements.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) [1, 2]
 *   2) [1]
 *   3) [4, 6]
 */
package lct.arrayshashing.topkfrequentelements;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        // The problem allows any order, so the driver sorts before printing.
        print(s.topKFrequent(new int[]{1, 1, 1, 2, 2, 3}, 2));
        print(s.topKFrequent(new int[]{1}, 1));
        print(s.topKFrequent(new int[]{4, 4, 4, 5, 5, 6, 6, 6, 6}, 2));
    }

    static void print(int[] a) {
        int[] copy = a.clone();
        java.util.Arrays.sort(copy);
        System.out.println(java.util.Arrays.toString(copy));
    }
}
