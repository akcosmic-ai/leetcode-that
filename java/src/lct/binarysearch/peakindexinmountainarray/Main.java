/*
 * Runnable driver for 852. Peak Index in a Mountain Array.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 1
 *   2) 1
 *   3) 2
 */
package lct.binarysearch.peakindexinmountainarray;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.peakIndexInMountainArray(new int[]{0, 1, 0}));
        System.out.println(s.peakIndexInMountainArray(new int[]{0, 2, 1, 0}));
        System.out.println(s.peakIndexInMountainArray(new int[]{3, 4, 5, 1}));
    }
}
