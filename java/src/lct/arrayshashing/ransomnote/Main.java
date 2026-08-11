/*
 * Runnable driver for 383. Ransom Note.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) false
 *   2) false
 *   3) true
 */
package lct.arrayshashing.ransomnote;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.canConstruct("a", "b"));
        System.out.println(s.canConstruct("aa", "ab"));
        System.out.println(s.canConstruct("aa", "aab"));
    }
}
