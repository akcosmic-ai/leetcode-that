/*
 * 49. Group Anagrams   [Medium]
 * https://leetcode.com/problems/group-anagrams/
 *
 * PATTERN: Arrays & Hashing
 *
 * Given a list of words, group together the ones that are anagrams of each
 * other. Return the groups in any order.
 *
 * SIGNALS THAT POINT HERE
 * - The word group, bucket, partition by, or "collect the ones that share
 *   ...".
 * - Two items belong together when some derived value matches, not when the
 *   items themselves match.
 * - You need a Map<Key, List<Item>>, which is what computeIfAbsent exists for.
 *
 * COMPLEXITY
 *   time  O(n · k log k)   n words, each sorted in k log k where k is the word length. The count-key variant in the follow-ups is O(n · k).
 *   space O(n · k)   every word is stored once in a bucket, plus one key per group
 *
 * COMMON MISTAKES
 * - Comparing every word against every other word to test anagram-ness. That
 *   is O(n²·k) and the map removes the outer comparison entirely.
 * - Using the word itself as the key, which groups nothing.
 * - Arrays.sort(word.toCharArray()) on its own throws the sorted array away,
 *   because toCharArray() returns a fresh copy. Assign it to a variable first.
 * - Assuming the output order is stable. HashMap gives no ordering guarantee,
 *   which is why the test driver sorts before comparing.
 *
 * FOLLOW-UPS
 * - Faster key: build a 26-length count array per word and turn it into a
 *   string like "1#0#0#...". That is O(k) per word instead of O(k log k), and
 *   it is Valid Anagram's counting idea reused as a key.
 * - What if the words were Unicode? Sorting still works; the fixed 26-slot
 *   count key does not.
 *
 * Generated from data/problems/arrays-hashing.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.arrayshashing.groupanagrams;

import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        // key = a canonical form shared by all anagrams of each other
        Map<String, List<String>> buckets = new HashMap<>();

        for (String word : strs) {
            char[] chars = word.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);

            // computeIfAbsent creates the list on first use, so there is no
            // "if the bucket does not exist yet" branch to get wrong.
            buckets.computeIfAbsent(key, k -> new ArrayList<>()).add(word);
        }

        return new ArrayList<>(buckets.values());
    }
}
