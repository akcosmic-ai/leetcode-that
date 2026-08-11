/*
 * Runnable driver for 71. Simplify Path.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) "/home/foo"
 *   2) "/c"
 *   3) "/"
 */
package lct.stack.simplifypath;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println("\"" + s.simplifyPath("/home//foo/") + "\"");
        System.out.println("\"" + s.simplifyPath("/a/./b/../../c/") + "\"");
        System.out.println("\"" + s.simplifyPath("/../") + "\"");
    }
}
