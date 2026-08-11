/*
 * Runnable driver for 242. Valid Anagram.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) true
 *   2) false
 *   3) false
 */
package lct.arrayshashing.validanagram;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.isAnagram("anagram", "nagaram"));
        System.out.println(s.isAnagram("rat", "car"));
        System.out.println(s.isAnagram("a", "ab"));
    }
}
