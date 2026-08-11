/*
 * 125. Valid Palindrome   [Easy]
 * https://leetcode.com/problems/valid-palindrome/
 *
 * PATTERN: Two Pointers
 *
 * Ignoring case and skipping anything that is not a letter or digit, decide
 * whether the string reads the same forwards and backwards.
 *
 * SIGNALS THAT POINT HERE
 * - The word palindrome, or any "compare the ends and work inwards".
 * - You were about to build a cleaned copy of the string and reverse it. Two
 *   pointers does it without allocating anything.
 * - O(1) extra space is achievable, which a reversed copy is not.
 *
 * COMPLEXITY
 *   time  O(n)   each pointer only ever moves toward the other, so together they cover the string once
 *   space O(1)   two integers. Building a cleaned copy would be O(n).
 *
 * COMMON MISTAKES
 * - Using if instead of while for the skips, which fails on two punctuation
 *   marks in a row.
 * - Omitting the l < r guard inside the skip loops. On a string of pure
 *   punctuation, l runs past the end and charAt throws.
 * - Forgetting to lower-case, so "Aa" reports false.
 * - Building s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase() and comparing to
 *   its reverse. It is correct and short, and it costs O(n) memory plus two
 *   extra passes.
 *
 * FOLLOW-UPS
 * - Valid Palindrome II allows deleting exactly one character. On the first
 *   mismatch, try skipping the left one or the right one and check whether
 *   either remainder is a palindrome.
 * - Palindrome Linked List is this idea with no random access, so you find the
 *   middle and reverse half the list.
 *
 * Generated from data/problems/two-pointers.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.twopointers.validpalindrome;

class Solution {
    public boolean isPalindrome(String s) {
        int l = 0;
        int r = s.length() - 1;

        while (l < r) {
            // Skip junk on the left. A while, not an if: ", , ," is possible.
            // The l < r guard stops these loops running off the end.
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) {
                l++;
            }
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) {
                r--;
            }

            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) {
                return false;
            }

            l++;
            r--;
        }

        return true;
    }
}
