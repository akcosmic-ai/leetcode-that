/*
 * Runnable driver for 3. Longest Substring Without Repeating Characters.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 3
 *   2) 1
 *   3) 3
 *   4) 0
 */
package lct.slidingwindow.longestsubstringwithoutrepeating;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.lengthOfLongestSubstring("abcabcbb"));
        System.out.println(s.lengthOfLongestSubstring("bbbbb"));
        System.out.println(s.lengthOfLongestSubstring("pwwkew"));
        System.out.println(s.lengthOfLongestSubstring(""));
    }
}
