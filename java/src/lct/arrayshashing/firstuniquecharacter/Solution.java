/*
 * 387. First Unique Character in a String   [Easy]
 * https://leetcode.com/problems/first-unique-character-in-a-string/
 *
 * PATTERN: Arrays & Hashing
 *
 * Return the index of the first character in the string that appears exactly
 * once. Return -1 if every character repeats.
 *
 * SIGNALS THAT POINT HERE
 * - First something, plus a property that depends on the WHOLE string. You
 *   cannot know "unique" until you have seen everything, so one pass is
 *   impossible.
 * - The word frequency or appears exactly once.
 * - You need the index, so the second pass must walk the string in order, not
 *   the map.
 *
 * COMPLEXITY
 *   time  O(n)   two passes over the string is still linear; the 26-slot array is constant work
 *   space O(1)   26 counters no matter how long the string is
 *
 * COMMON MISTAKES
 * - Iterating the map in the second pass. A HashMap has no order, so you get a
 *   unique character but not the FIRST one. A LinkedHashMap would fix it, but
 *   walking the string is simpler.
 * - Trying to answer in a single pass. Impossible: uniqueness is a property of
 *   the whole string.
 * - Using s.indexOf(c) == s.lastIndexOf(c) per character. It is a neat
 *   one-liner and it is O(n²).
 * - Forgetting to return -1 when nothing is unique.
 *
 * FOLLOW-UPS
 * - What if the string were a stream you could only read once? You would need
 *   a queue of candidates alongside the counts.
 * - A LinkedHashMap<Character, Integer> lets you answer from the map itself,
 *   since it preserves insertion order.
 *
 * Generated from data/problems/arrays-hashing.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.arrayshashing.firstuniquecharacter;

class Solution {
    public int firstUniqChar(String s) {
        // Pass 1: how often does each letter appear? We cannot decide anything
        // until this is complete, which is why one pass will not do.
        int[] counts = new int[26];
        for (char c : s.toCharArray()) {
            counts[c - 'a']++;
        }

        // Pass 2: walk the STRING (not the counts) so that "first" means first
        // by position.
        for (int i = 0; i < s.length(); i++) {
            if (counts[s.charAt(i) - 'a'] == 1) {
                return i;
            }
        }

        return -1;
    }
}
