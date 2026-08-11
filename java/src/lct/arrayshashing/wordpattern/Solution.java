/*
 * 290. Word Pattern   [Easy]
 * https://leetcode.com/problems/word-pattern/
 *
 * PATTERN: Arrays & Hashing
 *
 * Given a pattern of single letters and a sentence of space-separated words,
 * decide whether the letters map one-to-one onto the words: each letter always
 * means the same word, and no two letters mean the same word.
 *
 * SIGNALS THAT POINT HERE
 * - A one-to-one correspondence between two sequences.
 * - You have already seen this shape in Isomorphic Strings. Recognising that
 *   is the point of putting them next to each other.
 * - The lengths must match after splitting, and that check is easy to forget.
 *
 * COMPLEXITY
 *   time  O(n)   one pass over the words; the split itself is linear in the sentence length
 *   space O(n)   the split array plus two maps holding one entry per distinct letter
 *
 * COMMON MISTAKES
 * - Skipping the length check. pattern = "a" with s = "dog cat" then reads
 *   only the first word and wrongly returns true.
 * - Comparing words with == instead of .equals(). It appears to work for short
 *   literals because of string interning, and breaks for strings built at
 *   runtime.
 * - Using one map only, which fails on "abba" / "dog dog dog dog".
 * - Assuming split(" ") handles multiple spaces. It does not. These
 *   constraints promise single spaces; a messier input needs split("\\s+").
 *
 * FOLLOW-UPS
 * - Word Pattern II allows the words to be split however you like, which turns
 *   it into backtracking.
 * - Both this and Isomorphic Strings can be solved by comparing "first index
 *   of each token" signatures.
 *
 * Generated from data/problems/arrays-hashing.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.arrayshashing.wordpattern;

import java.util.*;

class Solution {
    public boolean wordPattern(String pattern, String s) {
        String[] words = s.split(" ");

        // One letter per word, so the counts must agree before anything else.
        if (pattern.length() != words.length) {
            return false;
        }

        Map<Character, String> charToWord = new HashMap<>();
        Map<String, Character> wordToChar = new HashMap<>();

        for (int i = 0; i < words.length; i++) {
            char c = pattern.charAt(i);
            String w = words[i];

            String boundWord = charToWord.get(c);
            Character boundChar = wordToChar.get(w);

            if (boundWord == null && boundChar == null) {
                // Neither side is taken, so this pairing is allowed.
                charToWord.put(c, w);
                wordToChar.put(w, c);
            } else if (boundWord == null || boundChar == null) {
                // Exactly one side is already spoken for: not one-to-one.
                return false;
            } else if (!boundWord.equals(w) || boundChar.charValue() != c) {
                // Both sides are bound, but not to each other.
                return false;
            }
        }

        return true;
    }
}
