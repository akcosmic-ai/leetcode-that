/*
 * Runnable driver for 219. Contains Duplicate II.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) true
 *   2) true
 *   3) false
 */
package lct.slidingwindow.containsduplicateii;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.containsNearbyDuplicate(new int[]{1, 2, 3, 1}, 3));
        System.out.println(s.containsNearbyDuplicate(new int[]{1, 0, 1, 1}, 1));
        System.out.println(s.containsNearbyDuplicate(new int[]{1, 2, 3, 1, 2, 3}, 2));
    }
}
