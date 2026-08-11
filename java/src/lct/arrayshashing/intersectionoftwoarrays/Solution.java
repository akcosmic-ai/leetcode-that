/*
 * 349. Intersection of Two Arrays   [Easy]
 * https://leetcode.com/problems/intersection-of-two-arrays/
 *
 * PATTERN: Arrays & Hashing
 *
 * Return the values that appear in both arrays. Each value must appear only
 * once in the result, and the order does not matter.
 *
 * SIGNALS THAT POINT HERE
 * - The words common to both, intersection, appears in both.
 * - "Each element in the result must be unique" is a set asking to be used.
 * - You were about to write a nested loop comparing every pair. That inner
 *   loop is a set lookup.
 *
 * COMPLEXITY
 *   time  O(n + m)   one pass over each array, with O(1) average set operations
 *   space O(n)   the first set holds up to n distinct values, plus the output
 *
 * COMMON MISTAKES
 * - Collecting into a List instead of a set, which repeats a value once per
 *   occurrence in nums2.
 * - Trying both.toArray(new int[0]). That does not compile: Set<Integer> gives
 *   you Integer[], and you must copy element by element (or use a stream).
 * - Removing matches from the first set as you go. That works too, but then
 *   you cannot tell "already reported" from "never present" if the logic
 *   grows.
 *
 * FOLLOW-UPS
 * - Intersection of Two Arrays II keeps duplicates, so the set becomes a count
 *   map that you decrement.
 * - If both arrays were already sorted, two pointers would do it in O(n + m)
 *   with O(1) extra space.
 *
 * Generated from data/problems/arrays-hashing.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.arrayshashing.intersectionoftwoarrays;

import java.util.*;

class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        // Set 1: everything in the first array. Duplicates disappear for free.
        Set<Integer> first = new HashSet<>();
        for (int x : nums1) {
            first.add(x);
        }

        // Set 2: the answer. LinkedHashSet keeps discovery order, which is not
        // required here but makes the output stable and easy to test.
        Set<Integer> both = new LinkedHashSet<>();
        for (int x : nums2) {
            if (first.contains(x)) {
                both.add(x);
            }
        }

        // Java will not unbox a Set<Integer> into an int[] for you.
        int[] out = new int[both.size()];
        int i = 0;
        for (int x : both) {
            out[i] = x;
            i++;
        }
        return out;
    }
}
