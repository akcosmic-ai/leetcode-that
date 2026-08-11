/*
 * 567. Permutation in String   [Medium]
 * https://leetcode.com/problems/permutation-in-string/
 *
 * PATTERN: Sliding Window
 *
 * Decide whether any contiguous stretch of s2 is a rearrangement of s1.
 *
 * SIGNALS THAT POINT HERE
 * - Permutation or anagram of a fixed pattern, found inside a longer string.
 *   The pattern length fixes the window size.
 * - You already know how to compare two strings for anagram-ness: compare
 *   letter counts. Now do it once per window.
 * - Fixed size, so no shrink loop: one letter in on the right, one out on the
 *   left.
 *
 * COMPLEXITY
 *   time  O(n)   one pass over s2, with a fixed 26-element comparison at each position
 *   space O(1)   two 26-slot arrays
 *
 * COMMON MISTAKES
 * - Evicting with if (r >= len - 1), which shrinks the window below the
 *   pattern length.
 * - Forgetting the guard for s1 longer than s2, which makes the eviction index
 *   negative.
 * - Sorting every window and comparing strings. Correct, and O(n · k log k)
 *   instead of O(n).
 * - Generating all permutations of s1 and searching for each. That is
 *   factorial, for a problem with a linear answer.
 *
 * FOLLOW-UPS
 * - Find All Anagrams in a String (next) is this exact code that collects
 *   every match instead of returning on the first.
 * - Tracking a single "how many letters are still wrong" counter avoids the
 *   26-element comparison, though it is more fiddly.
 *
 * Generated from data/problems/sliding-window.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.slidingwindow.permutationinstring;

import java.util.*;

class Solution {
    public boolean checkInclusion(String s1, String s2) {
        int len = s1.length();
        if (len > s2.length()) {
            return false;
        }

        int[] need = new int[26];
        int[] window = new int[26];

        for (char c : s1.toCharArray()) {
            need[c - 'a']++;
        }

        for (int r = 0; r < s2.length(); r++) {
            window[s2.charAt(r) - 'a']++;

            // Once the window is longer than the pattern, evict on the left so
            // the length stays fixed at len.
            if (r >= len) {
                window[s2.charAt(r - len) - 'a']--;
            }

            // Comparing 26 ints is constant work, so this stays O(n) overall.
            if (Arrays.equals(need, window)) {
                return true;
            }
        }

        return false;
    }
}
