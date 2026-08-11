/*
 * 242. Valid Anagram   [Easy]
 * https://leetcode.com/problems/valid-anagram/
 *
 * PATTERN: Arrays & Hashing
 *
 * Two strings are anagrams when one is a rearrangement of the other, using
 * every letter exactly as often. Return whether t is an anagram of s.
 *
 * SIGNALS THAT POINT HERE
 * - The word anagram, or any question about rearranging.
 * - "Same letters, same counts" is literally a frequency comparison.
 * - The constraints say lowercase English letters, which is 26 possible keys.
 *   That is an array, not a map.
 *
 * COMPLEXITY
 *   time  O(n)   one pass over both strings, then a fixed 26-slot check that does not depend on n
 *   space O(1)   exactly 26 ints, no matter how long the strings are
 *
 * COMMON MISTAKES
 * - Forgetting the length guard. Without it the shared loop reads past the end
 *   of the shorter string.
 * - Sorting both strings and comparing. Correct, and a fine one-liner, but O(n
 *   log n) instead of O(n).
 * - Using s.charAt(i) == t.charAt(i) anywhere. Anagrams are about counts, not
 *   positions.
 * - Hard-coding int[26] when the problem allows Unicode. Then you need a
 *   HashMap<Character, Integer>.
 *
 * FOLLOW-UPS
 * - What if the input could be any Unicode string? Swap the array for a
 *   HashMap<Character, Integer>.
 * - Group Anagrams (later in this pattern) reuses exactly this idea as a map
 *   KEY instead of a boolean.
 *
 * Generated from data/problems/arrays-hashing.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.arrayshashing.validanagram;

class Solution {
    public boolean isAnagram(String s, String t) {
        // Different lengths can never be anagrams, and this guard also lets the
        // single loop below index both strings safely.
        if (s.length() != t.length()) {
            return false;
        }

        // 26 counters, one per lowercase letter. 'a' maps to 0, 'z' maps to 25.
        int[] counts = new int[26];

        for (int i = 0; i < s.length(); i++) {
            counts[s.charAt(i) - 'a']++;    // s pushes counts up
            counts[t.charAt(i) - 'a']--;    // t pulls them back down
        }

        // Anything left over means one string used a letter the other did not.
        for (int c : counts) {
            if (c != 0) return false;
        }

        return true;
    }
}
