/*
 * Runnable driver for 424. Longest Repeating Character Replacement.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 4
 *   2) 4
 *   3) 4
 */
package lct.slidingwindow.longestrepeatingcharacterreplacement;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.characterReplacement("ABAB", 2));
        System.out.println(s.characterReplacement("AABABBA", 1));
        System.out.println(s.characterReplacement("AAAA", 0));
    }
}
