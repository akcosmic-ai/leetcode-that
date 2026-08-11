/*
 * 438. Find All Anagrams in a String   [Medium]
 * https://leetcode.com/problems/find-all-anagrams-in-a-string/
 *
 * PATTERN: Sliding Window
 *
 * Return the starting index of every contiguous stretch of s that is a
 * rearrangement of p.
 *
 * SIGNALS THAT POINT HERE
 * - Same signals as Permutation in String: anagram of a fixed pattern,
 *   fixed-size window.
 * - All occurrences rather than a yes or no, so you collect instead of
 *   returning early.
 * - Overlapping matches are allowed, which a sliding window handles naturally
 *   because it advances one position at a time.
 *
 * COMPLEXITY
 *   time  O(n)   one pass, with a constant 26-element comparison per position
 *   space O(1)   two 26-slot arrays, excluding the output list
 *
 * COMMON MISTAKES
 * - Reporting r instead of r - len + 1. The answer is where the window starts.
 * - Skipping the r >= len - 1 guard, so partial windows at the very start get
 *   compared.
 * - Jumping r forward by len after a match, which misses the overlapping
 *   matches in "abab".
 * - Rebuilding the window count from scratch at every position, which is O(n ·
 *   k).
 *
 * FOLLOW-UPS
 * - A "how many letters are still wrong" counter replaces the 26-element
 *   comparison with an O(1) check.
 * - Minimum Window Substring uses exactly that counter, because there the
 *   window size is not fixed.
 *
 * Generated from data/problems/sliding-window.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.slidingwindow.findallanagrams;

import java.util.*;

class Solution {
    public List<Integer> findAnagrams(String s, String p) {
        List<Integer> out = new ArrayList<>();

        int len = p.length();
        if (len > s.length()) {
            return out;
        }

        int[] need = new int[26];
        int[] window = new int[26];

        for (char c : p.toCharArray()) {
            need[c - 'a']++;
        }

        for (int r = 0; r < s.length(); r++) {
            window[s.charAt(r) - 'a']++;

            if (r >= len) {
                window[s.charAt(r - len) - 'a']--;
            }

            // Only check once the window has reached full size, and report the
            // START index rather than the right edge.
            if (r >= len - 1 && Arrays.equals(need, window)) {
                out.add(r - len + 1);
            }
        }

        return out;
    }
}
