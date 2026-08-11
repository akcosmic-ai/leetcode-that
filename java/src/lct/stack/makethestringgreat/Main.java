/*
 * Runnable driver for 1544. Make The String Great.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) "leetcode"
 *   2) ""
 *   3) "s"
 */
package lct.stack.makethestringgreat;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println("\"" + s.makeGood("leEeetcode") + "\"");
        System.out.println("\"" + s.makeGood("abBAcC") + "\"");
        System.out.println("\"" + s.makeGood("s") + "\"");
    }
}
