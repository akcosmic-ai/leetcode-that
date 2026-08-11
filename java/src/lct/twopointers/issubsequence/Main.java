/*
 * Runnable driver for 392. Is Subsequence.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) true
 *   2) false
 *   3) true
 */
package lct.twopointers.issubsequence;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.isSubsequence("abc", "ahbgdc"));
        System.out.println(s.isSubsequence("axc", "ahbgdc"));
        System.out.println(s.isSubsequence("", "abc"));
    }
}
