/*
 * Runnable driver for 438. Find All Anagrams in a String.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) [0, 6]
 *   2) [0, 1, 2]
 *   3) []
 */
package lct.slidingwindow.findallanagrams;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.findAnagrams("cbaebabacd", "abc"));
        System.out.println(s.findAnagrams("abab", "ab"));
        System.out.println(s.findAnagrams("a", "ab"));
    }
}
