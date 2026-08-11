/*
 * Runnable driver for 1047. Remove All Adjacent Duplicates In String.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) "ca"
 *   2) "ay"
 *   3) ""
 */
package lct.stack.removeadjacentduplicates;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        // Quoted so the empty answer is visible.
        System.out.println("\"" + s.removeDuplicates("abbaca") + "\"");
        System.out.println("\"" + s.removeDuplicates("azxxzy") + "\"");
        System.out.println("\"" + s.removeDuplicates("aa") + "\"");
    }
}
