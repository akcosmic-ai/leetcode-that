/*
 * Runnable driver for 290. Word Pattern.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) true
 *   2) false
 *   3) false
 *   4) false
 */
package lct.arrayshashing.wordpattern;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.wordPattern("abba", "dog cat cat dog"));
        System.out.println(s.wordPattern("abba", "dog cat cat fish"));
        System.out.println(s.wordPattern("aaaa", "dog cat cat dog"));
        System.out.println(s.wordPattern("abba", "dog dog dog dog"));
    }
}
