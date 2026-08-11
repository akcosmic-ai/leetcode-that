/*
 * TEMPLATE: Hash map: count / index / complement
 *
 * Five shapes on one page. count tallies frequencies, firstIndex remembers
 * where things were, complement is the Two Sum move, groupByKey buckets by a
 * computed key, and the seen-set trick uses the return value of add. Whichever
 * one a problem needs, the skeleton is identical: build the map as you go so a
 * lookup replaces the inner loop.
 *
 * Generated from data/templates/arrays-hashing.js.
 */
package lct.templates.arrayshashing;

import java.util.*;

class ArraysHashingTemplate {

    /** Shape 1 - COUNT. How many times does each value appear? */
    Map<Integer, Integer> count(int[] nums) {
        Map<Integer, Integer> counts = new HashMap<>();
        for (int x : nums) {
            // getOrDefault avoids the null that plain get() would return
            counts.put(x, counts.getOrDefault(x, 0) + 1);
        }
        return counts;
    }

    /** Shape 1b - COUNT over a small fixed alphabet. Cheaper than a map. */
    int[] countLetters(String s) {
        int[] freq = new int[26];
        for (char c : s.toCharArray()) {
            freq[c - 'a']++;
        }
        return freq;
    }

    /** Shape 2 - INDEX. Where did I first see each value? */
    Map<Integer, Integer> firstIndex(int[] nums) {
        Map<Integer, Integer> where = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            where.putIfAbsent(nums[i], i);   // keep the FIRST position
        }
        return where;
    }

    /** Shape 3 - COMPLEMENT. One pass: ask for the partner before storing yourself. */
    int[] complement(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];
            if (seen.containsKey(need)) {
                return new int[] { seen.get(need), i };
            }
            seen.put(nums[i], i);
        }
        return new int[0];
    }

    /** Shape 4 - GROUP. Bucket items under a computed key. */
    List<List<String>> groupByKey(String[] words) {
        Map<String, List<String>> buckets = new HashMap<>();
        for (String w : words) {
            char[] chars = w.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            buckets.computeIfAbsent(key, k -> new ArrayList<>()).add(w);
        }
        return new ArrayList<>(buckets.values());
    }

    /** Shape 5 - SEEN SET. add() returns false when it was already there. */
    boolean hasDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int x : nums) {
            if (!seen.add(x)) return true;
        }
        return false;
    }
}
