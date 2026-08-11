/*
 * Runnable driver for 153. Find Minimum in Rotated Sorted Array.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 1
 *   2) 0
 *   3) 11
 */
package lct.binarysearch.findminimuminrotatedsortedarray;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.findMin(new int[]{3, 4, 5, 1, 2}));
        System.out.println(s.findMin(new int[]{4, 5, 6, 7, 0, 1, 2}));
        System.out.println(s.findMin(new int[]{11, 13, 15, 17}));
    }
}
