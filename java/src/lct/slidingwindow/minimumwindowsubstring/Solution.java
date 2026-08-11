/*
 * 76. Minimum Window Substring   [Hard]
 * https://leetcode.com/problems/minimum-window-substring/
 *
 * PATTERN: Sliding Window
 *
 * Return the shortest contiguous stretch of s that contains every character of
 * t, counting duplicates. Return the empty string if no such stretch exists.
 *
 * SIGNALS THAT POINT HERE
 * - Shortest stretch containing a required multiset. Shortest-valid window.
 * - Duplicates in t matter, so it is counts and not a set.
 * - Checking validity by comparing whole count tables would be O(52) per step.
 *   One integer does it instead, and that is what makes this Hard rather than
 *   Medium.
 *
 * COMPLEXITY
 *   time  O(n + m)   each index of s enters once and leaves once, and validity is an O(1) integer test
 *   space O(1)   128 counters plus a few integers, independent of input size
 *
 * COMMON MISTAKES
 * - Checking need[in] > 0 after decrementing instead of before. The test is
 *   about whether the character was still required.
 * - Clamping counts at zero. Surplus copies must be recorded as negative
 *   numbers, or the exit logic increments missing too early.
 * - Recording the answer after the shrink loop rather than inside it.
 * - Storing the best substring itself instead of a start and a length, which
 *   allocates a new string on every improvement.
 * - Assuming lowercase only. The constraints allow both cases, so int[26] is
 *   not enough.
 *
 * FOLLOW-UPS
 * - Substring with Concatenation of All Words is the fixed-size cousin, where
 *   the window advances a whole word at a time.
 * - The same missing-counter device simplifies Permutation in String and Find
 *   All Anagrams, replacing their 26-element comparison with an O(1) check.
 *
 * Generated from data/problems/sliding-window.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.slidingwindow.minimumwindowsubstring;

class Solution {
    public String minWindow(String s, String t) {
        if (s.length() < t.length() || t.isEmpty()) {
            return "";
        }

        // Upper and lower case, so index by raw ASCII rather than assuming a..z.
        int[] need = new int[128];
        for (char c : t.toCharArray()) {
            need[c]++;
        }

        // How many REQUIRED character slots are still unfilled.
        int missing = t.length();

        int bestLen = Integer.MAX_VALUE;
        int bestStart = 0;
        int l = 0;

        for (int r = 0; r < s.length(); r++) {
            char in = s.charAt(r);

            // Check BEFORE decrementing. A count above zero means this character
            // was genuinely still needed. Counts are allowed to go negative, and
            // a negative count is exactly "surplus copies in the window".
            if (need[in] > 0) {
                missing--;
            }
            need[in]--;

            // missing == 0 means the window covers all of t. O(1) test, which is
            // the whole point of maintaining the counter.
            while (missing == 0) {
                if (r - l + 1 < bestLen) {
                    bestLen = r - l + 1;
                    bestStart = l;
                }

                char out = s.charAt(l);
                need[out]++;
                // Now positive means we just gave up a character we needed.
                if (need[out] > 0) {
                    missing++;
                }
                l++;
            }
        }

        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
    }
}
