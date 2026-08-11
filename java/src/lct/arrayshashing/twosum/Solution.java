/*
 * 1. Two Sum   [Easy]
 * https://leetcode.com/problems/two-sum/
 *
 * PATTERN: Arrays & Hashing
 *
 * Given an array of integers and a target, return the indexes of the two
 * numbers that add up to the target. Exactly one valid answer exists, and you
 * may not use the same element twice.
 *
 * SIGNALS THAT POINT HERE
 * - Asked for a pair that hits a target.
 * - Your first idea is a nested loop where the inner loop only searches. That
 *   is the loop a map deletes.
 * - You need target - x in O(1), which is exactly what a hash map gives you.
 * - The answer must be indexes, so you cannot sort the array. That rules out
 *   two pointers.
 *
 * COMPLEXITY
 *   time  O(n)   one pass over the array; each map put and get is O(1) on average
 *   space O(n)   the map holds up to n entries, one per element seen so far
 *
 * COMMON MISTAKES
 * - Filling the map completely first, then searching it. On [3,3] with target
 *   6 that returns [1,1], because index 1 overwrote index 0 and then matched
 *   itself.
 * - Returning the values instead of the indexes.
 * - Storing before checking, which lets an element pair with itself when
 *   nums[i] 2 == target.
 * - Assigning map.get(need) to an int without checking presence first. Absent
 *   means null, and unboxing null throws a NullPointerException.
 *
 * FOLLOW-UPS
 * - What if the array were sorted? Two pointers from both ends, O(n) time and
 *   O(1) space, no map at all.
 * - What if you had to return every pair, not just one? Careful with
 *   duplicates, and the answer is no longer a single early return.
 *
 * Generated from data/problems/arrays-hashing.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.arrayshashing.twosum;

import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // value -> the index where we saw it
        Map<Integer, Integer> seen = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];

            // Ask BEFORE storing. If we stored first, an element whose value is
            // exactly half the target would match itself.
            if (seen.containsKey(need)) {
                return new int[] { seen.get(need), i };
            }

            seen.put(nums[i], i);
        }

        return new int[0];   // the problem promises this is unreachable
    }
}
