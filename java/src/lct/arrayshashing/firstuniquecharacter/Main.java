/*
 * Runnable driver for 387. First Unique Character in a String.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 0
 *   2) 2
 *   3) -1
 */
package lct.arrayshashing.firstuniquecharacter;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.firstUniqChar("leetcode"));
        System.out.println(s.firstUniqChar("loveleetcode"));
        System.out.println(s.firstUniqChar("aabb"));
    }
}
