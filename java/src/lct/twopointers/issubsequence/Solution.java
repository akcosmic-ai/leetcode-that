/*
 * 392. Is Subsequence   [Easy]
 * https://leetcode.com/problems/is-subsequence/
 *
 * PATTERN: Two Pointers
 *
 * Decide whether s can be formed from t by deleting some characters without
 * reordering the rest.
 *
 * SIGNALS THAT POINT HERE
 * - The word subsequence: order preserved, gaps allowed. Not substring, which
 *   would be contiguous and a sliding window.
 * - You are matching one sequence against another, so one pointer per
 *   sequence.
 * - Greedy is provably safe here: taking the earliest possible match never
 *   hurts, because it leaves the most of t for the rest of s.
 *
 * COMPLEXITY
 *   time  O(n + m)   each pointer only moves forward, so the loop runs at most m times
 *   space O(1)   two indexes
 *
 * COMMON MISTAKES
 * - Returning j == t.length() instead of i == s.length(). That asks whether
 *   all of t was used, which is a different question.
 * - Advancing i unconditionally, which is no longer a subsequence test.
 * - Confusing subsequence with substring. A substring must be contiguous, and
 *   that is a sliding window instead.
 * - Reaching for indexOf in a loop over s. It works if you pass the running
 *   offset, and it is easy to get wrong and slower.
 *
 * FOLLOW-UPS
 * - The stated follow-up: many s values against one fixed t. Precompute, for
 *   every position of t and every letter, the next occurrence. Then each query
 *   is O(len(s)).
 * - Longest Common Subsequence is the DP generalisation, when you no longer
 *   just need yes or no.
 *
 * Generated from data/problems/two-pointers.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.twopointers.issubsequence;

class Solution {
    public boolean isSubsequence(String s, String t) {
        int i = 0;   // position in s, the string we are trying to match
        int j = 0;   // position in t, the string we are scanning

        while (i < s.length() && j < t.length()) {
            // Take the earliest match available. Greedy is safe: matching early
            // leaves the most of t for the characters of s that remain.
            if (s.charAt(i) == t.charAt(j)) {
                i++;
            }
            j++;    // j always advances, matched or not
        }

        // Success is "s was fully consumed", not "t was fully consumed".
        return i == s.length();
    }
}
