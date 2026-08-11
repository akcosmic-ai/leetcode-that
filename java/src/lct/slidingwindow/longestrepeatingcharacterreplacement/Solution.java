/*
 * 424. Longest Repeating Character Replacement   [Medium]
 * https://leetcode.com/problems/longest-repeating-character-replacement/
 *
 * PATTERN: Sliding Window
 *
 * You may change at most k characters of the string to any letter you like.
 * Return the length of the longest stretch that can be made up of a single
 * repeated letter.
 *
 * SIGNALS THAT POINT HERE
 * - Longest contiguous stretch, plus a budget of edits. Window with a cost
 *   invariant.
 * - The hard part is not the loop, it is naming the invariant. Say it out
 *   loud: how many characters would I have to change to make this window
 *   uniform?
 * - Uppercase only, so a 26-slot count array is enough.
 *
 * COMPLEXITY
 *   time  O(n)   each index enters and leaves once; the 26-slot max scan is a constant factor, not a term
 *   space O(1)   26 counters
 *
 * COMMON MISTAKES
 * - Getting the invariant wrong, usually as "number of distinct letters minus
 *   one". The cost is about counts, not about how many different letters
 *   appear.
 * - Trying each of the 26 letters as "the letter to keep" with a separate
 *   pass. It works and is 26 times more code than needed.
 * - Using if instead of while for the shrink.
 * - Indexing with c - 'a' when the input is uppercase, which produces negative
 *   indexes.
 *
 * FOLLOW-UPS
 * - The well-known optimisation never decreases maxCount, replacing the
 *   26-slot scan with a single variable. It still yields the correct MAXIMUM
 *   even though intermediate windows can be invalid, which is a genuinely
 *   subtle argument. The version above avoids needing it.
 * - Max Consecutive Ones III is the same problem with two symbols, where the
 *   cost is simply the number of zeros in the window.
 *
 * Generated from data/problems/sliding-window.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.slidingwindow.longestrepeatingcharacterreplacement;

class Solution {
    public int characterReplacement(String s, int k) {
        int[] count = new int[26];   // uppercase A..Z only

        int l = 0;
        int best = 0;

        for (int r = 0; r < s.length(); r++) {
            count[s.charAt(r) - 'A']++;

            // Cost of making this window uniform: keep the most common letter,
            // change everything else. Shrink while that exceeds the budget.
            while ((r - l + 1) - maxCount(count) > k) {
                count[s.charAt(l) - 'A']--;
                l++;
            }

            best = Math.max(best, r - l + 1);
        }

        return best;
    }

    /** Scanning 26 slots is constant work, so this does not change the O(n). */
    private int maxCount(int[] count) {
        int m = 0;
        for (int c : count) {
            m = Math.max(m, c);
        }
        return m;
    }
}
