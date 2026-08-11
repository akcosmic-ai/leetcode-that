/*
 * Runnable driver for 205. Isomorphic Strings.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) true
 *   2) false
 *   3) false
 *   4) true
 */
package lct.arrayshashing.isomorphicstrings;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.isIsomorphic("egg", "add"));
        System.out.println(s.isIsomorphic("foo", "bar"));
        System.out.println(s.isIsomorphic("badc", "baba"));
        System.out.println(s.isIsomorphic("paper", "title"));
    }
}
