/*
 * 3. Longest Substring Without Repeating Characters   [Medium]
 * https://leetcode.com/problems/longest-substring-without-repeating-characters/
 *
 * PATTERN: Sliding Window
 *
 * Find the length of the longest contiguous stretch of the string in which no
 * character repeats.
 *
 * SIGNALS THAT POINT HERE
 * - Longest contiguous stretch satisfying a condition. That word pair is the
 *   sliding-window signature.
 * - Substring, not subsequence. Substrings are contiguous, which is what a
 *   window models.
 * - The condition ("no repeats") can be checked from a running count, so it is
 *   cheap to maintain as the window moves.
 *
 * COMPLEXITY
 *   time  O(n)   l never moves backwards, so across the whole run each index is added once and removed once
 *   space O(1)   128 counters, fixed regardless of input length
 *
 * COMMON MISTAKES
 * - Using if instead of while for the shrink. "abba" is the input that exposes
 *   it.
 * - Measuring before shrinking, which counts an invalid window.
 * - Getting the length wrong: it is r - l + 1, not r - l.
 * - Assuming lowercase and using int[26], which throws on digits, spaces or
 *   symbols.
 * - Answering "pwke" for "pwwkew". That is a subsequence; substrings must be
 *   contiguous.
 *
 * FOLLOW-UPS
 * - A faster variant stores the last index of each character and JUMPS l
 *   straight to lastSeen + 1 instead of stepping. Same complexity, fewer
 *   operations, slightly trickier to get right.
 * - Longest Substring with At Most K Distinct Characters is the same loop with
 *   map.size() > k as the invariant.
 *
 * Generated from data/problems/sliding-window.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.slidingwindow.longestsubstringwithoutrepeating;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        // The constraints allow letters, digits, symbols and spaces, so index by
        // the raw ASCII value rather than assuming lowercase a..z.
        int[] count = new int[128];

        int l = 0;
        int best = 0;

        for (int r = 0; r < s.length(); r++) {
            char in = s.charAt(r);
            count[in]++;

            // A while, not an if: on "abba" the incoming 'b' needs BOTH the 'a'
            // and the first 'b' removed before the window is legal again.
            while (count[in] > 1) {
                char out = s.charAt(l);
                count[out]--;
                l++;
            }

            // Measure only once the window is valid again. This is the
            // "longest valid" shape.
            best = Math.max(best, r - l + 1);
        }

        return best;
    }
}
