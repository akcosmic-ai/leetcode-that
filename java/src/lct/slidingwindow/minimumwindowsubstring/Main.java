/*
 * Runnable driver for 76. Minimum Window Substring.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) "BANC"
 *   2) "a"
 *   3) ""
 */
package lct.slidingwindow.minimumwindowsubstring;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        // Quoted so the empty-string answer is visible in the output.
        System.out.println("\"" + s.minWindow("ADOBECODEBANC", "ABC") + "\"");
        System.out.println("\"" + s.minWindow("a", "a") + "\"");
        System.out.println("\"" + s.minWindow("a", "aa") + "\"");
    }
}
