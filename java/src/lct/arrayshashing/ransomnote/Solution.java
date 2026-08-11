/*
 * 383. Ransom Note   [Easy]
 * https://leetcode.com/problems/ransom-note/
 *
 * PATTERN: Arrays & Hashing
 *
 * Can you build the first string using only the letters available in the
 * second, where each letter in the second string may be used at most once?
 *
 * SIGNALS THAT POINT HERE
 * - "Can I build X out of Y" where letters are consumed. That is a
 *   supply-and-demand count.
 * - Lowercase English letters only, so int[26] again.
 * - You need "at least as many of each", not "exactly as many". So it is a
 *   one-sided comparison, unlike Valid Anagram.
 *
 * COMPLEXITY
 *   time  O(n + m)   one pass over each string, and it exits early on the first shortfall
 *   space O(1)   26 ints regardless of input size
 *
 * COMMON MISTAKES
 * - Counting the note instead of the magazine and then getting the comparison
 *   direction backwards.
 * - Using have[c] -= 1 and then testing have[c] < 0 as two statements. Fine,
 *   but the pre-decrement is the idiom worth recognising.
 * - Requiring the counts to be EQUAL. The magazine is allowed to have
 *   leftovers. That is the one difference from Valid Anagram.
 * - Using contains or indexOf on the magazine string per character, which is
 *   O(n·m).
 *
 * FOLLOW-UPS
 * - This is Valid Anagram with a one-sided comparison. Once you see that, both
 *   are the same problem.
 * - If letters could be reused without limit, the counts collapse to a set
 *   membership test.
 *
 * Generated from data/problems/arrays-hashing.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.arrayshashing.ransomnote;

class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        // The magazine is the supply, so it gets counted first.
        int[] have = new int[26];
        for (char c : magazine.toCharArray()) {
            have[c - 'a']++;
        }

        // Spend the supply on the note. Pre-decrement so the test sees the
        // value AFTER spending: going below zero means we ran out.
        for (char c : ransomNote.toCharArray()) {
            if (--have[c - 'a'] < 0) {
                return false;
            }
        }

        return true;
    }
}
