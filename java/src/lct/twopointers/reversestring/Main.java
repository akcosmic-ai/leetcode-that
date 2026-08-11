/*
 * Runnable driver for 344. Reverse String.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) olleh
 *   2) hannaH
 *   3) a
 */
package lct.twopointers.reversestring;

public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(reversed(sol, "hello"));
        System.out.println(reversed(sol, "Hannah"));
        System.out.println(reversed(sol, "a"));
    }

    static String reversed(Solution sol, String text) {
        char[] arr = text.toCharArray();
        sol.reverseString(arr);
        return new String(arr);
    }
}
