/*
 * 169. Majority Element   [Easy]
 * https://leetcode.com/problems/majority-element/
 *
 * PATTERN: Arrays & Hashing
 *
 * One value appears more than n/2 times in the array. Return it. You may
 * assume it always exists.
 *
 * SIGNALS THAT POINT HERE
 * - The words most frequent, majority, appears more than. A count map answers
 *   all of them.
 * - Values are unbounded (up to 10^9), so a frequency ARRAY is impossible.
 *   This one needs a map.
 * - You can track the running best while counting, so no second pass over the
 *   map is required.
 *
 * COMPLEXITY
 *   time  O(n)   one pass; each map operation is O(1) on average and the max is tracked inline
 *   space O(n)   up to n distinct keys in the map. Boyer-Moore (see follow-ups) gets this to O(1).
 *
 * COMMON MISTAKES
 * - Initialising best to 0 instead of nums[0]. On an array of negative numbers
 *   that returns a value that is not even in the array.
 * - Using counts.get(x) + 1 without getOrDefault, which throws a
 *   NullPointerException on the first occurrence of each value.
 * - Sorting and returning nums[n/2]. It is correct because a majority element
 *   must cover the middle, but it is O(n log n).
 *
 * FOLLOW-UPS
 * - Boyer-Moore voting: keep one candidate and one counter, increment on a
 *   match and decrement otherwise, and reset the candidate when the counter
 *   hits zero. O(n) time and O(1) space. It only works because a strict
 *   majority is guaranteed.
 * - Majority Element II asks for everything appearing more than n/3 times.
 *   There can be at most two, and Boyer-Moore extends to two candidates.
 *
 * Generated from data/problems/arrays-hashing.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.arrayshashing.majorityelement;

import java.util.*;

class Solution {
    public int majorityElement(int[] nums) {
        Map<Integer, Integer> counts = new HashMap<>();

        int best = nums[0];
        int bestCount = 0;

        for (int x : nums) {
            // merge(key, 1, Integer::sum) means "put 1 if absent, else add 1".
            // It returns the NEW count, which is what we want to compare.
            int c = counts.merge(x, 1, Integer::sum);

            if (c > bestCount) {
                bestCount = c;
                best = x;
            }
        }

        return best;
    }
}
