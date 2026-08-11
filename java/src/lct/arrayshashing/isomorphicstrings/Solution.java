/*
 * 205. Isomorphic Strings   [Easy]
 * https://leetcode.com/problems/isomorphic-strings/
 *
 * PATTERN: Arrays & Hashing
 *
 * Two strings are isomorphic when you can replace every character of the first
 * with a character of the second consistently: the same source character
 * always maps to the same target, and no two source characters share a target.
 * Order and length are preserved.
 *
 * SIGNALS THAT POINT HERE
 * - A consistent replacement or renaming rule, character for character.
 * - The pairing is one-to-one, which is the tell that one map is not enough.
 * - Same shape as Word Pattern (next problem) and as "are these two strings
 *   structurally identical".
 *
 * COMPLEXITY
 *   time  O(n)   one pass, with O(1) average map operations
 *   space O(k)   k distinct characters, bounded by the alphabet, so effectively O(1)
 *
 * COMMON MISTAKES
 * - Using only one map. It passes the obvious examples and fails on "badc" /
 *   "baba", which is exactly why that case is in the test list.
 * - Comparing two boxed Character objects with !=. It happens to work for
 *   ASCII because of the Character cache, then breaks for values outside it.
 *   Unbox one side first.
 * - Assuming lowercase only and indexing int[26]. The constraints allow any
 *   ASCII, so use int[128] or a map.
 * - Forgetting the length guard.
 *
 * FOLLOW-UPS
 * - The same problem can be solved by comparing "index of last occurrence"
 *   signatures for both strings, with no maps at all.
 * - Word Pattern (next) is this problem with words instead of characters on
 *   one side.
 *
 * Generated from data/problems/arrays-hashing.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.arrayshashing.isomorphicstrings;

import java.util.*;

class Solution {
    public boolean isIsomorphic(String s, String t) {
        if (s.length() != t.length()) {
            return false;
        }

        Map<Character, Character> forward = new HashMap<>();   // s char -> t char
        Map<Character, Character> backward = new HashMap<>();  // t char -> s char

        for (int i = 0; i < s.length(); i++) {
            char a = s.charAt(i);
            char b = t.charAt(i);

            Character mappedTo = forward.get(a);

            if (mappedTo == null) {
                // 'a' is unmapped. It may only claim 'b' if nobody else has.
                if (backward.containsKey(b)) {
                    return false;
                }
                forward.put(a, b);
                backward.put(b, a);
            } else if (mappedTo.charValue() != b) {
                // 'a' already promised a different character.
                // charValue() is explicit on purpose: != between two Character
                // objects would compare references, not values.
                return false;
            }
        }

        return true;
    }
}
