/*
 * Runnable driver for 217. Contains Duplicate.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) true
 *   2) false
 *   3) true
 */
package lct.arrayshashing.containsduplicate;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.containsDuplicate(new int[]{1, 2, 3, 1}));
        System.out.println(s.containsDuplicate(new int[]{1, 2, 3, 4}));
        System.out.println(s.containsDuplicate(new int[]{1, 1, 1, 3, 3, 4, 3, 2, 4, 2}));
    }
}
