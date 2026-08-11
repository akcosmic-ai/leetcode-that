/*
 * 217. Contains Duplicate   [Easy]
 * https://leetcode.com/problems/contains-duplicate/
 *
 * PATTERN: Arrays & Hashing
 *
 * Return true if any value appears at least twice in the array, and false if
 * every element is distinct.
 *
 * SIGNALS THAT POINT HERE
 * - The word duplicate. That is a set, essentially every time.
 * - You only need to know "have I seen this", not how many times or where.
 * - You want to bail out the instant you find one, so you do not want to count
 *   everything first.
 *
 * COMPLEXITY
 *   time  O(n)   one pass, and each set add is O(1) on average. It exits early on the first duplicate.
 *   space O(n)   worst case (all distinct) the set holds every element
 *
 * COMMON MISTAKES
 * - Sorting first and comparing neighbours. It works and uses O(1) extra
 *   space, but it is O(n log n) and it destroys the input order.
 * - Calling seen.contains(x) and then seen.add(x). Two hash lookups where one
 *   would do.
 * - Building the whole set and comparing set.size() != nums.length. Correct,
 *   but it never exits early and always allocates the full set.
 *
 * FOLLOW-UPS
 * - What if you were told O(1) extra space is mandatory? Then sorting is the
 *   answer, and you accept O(n log n).
 * - Contains Duplicate II adds "within k indexes of each other", which turns
 *   this into a sliding window over a set.
 *
 * Generated from data/problems/arrays-hashing.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.arrayshashing.containsduplicate;

import java.util.*;

class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();

        for (int x : nums) {
            // add() returns false when the element was ALREADY in the set,
            // so this single call both tests and inserts.
            if (!seen.add(x)) {
                return true;
            }
        }

        return false;
    }
}
