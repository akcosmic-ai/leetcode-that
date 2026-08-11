/*
 * 219. Contains Duplicate II   [Easy]
 * https://leetcode.com/problems/contains-duplicate-ii/
 *
 * PATTERN: Sliding Window
 *
 * Return true if the array holds two equal values whose positions are at most
 * k apart.
 *
 * SIGNALS THAT POINT HERE
 * - A duplicate question you already know how to answer, plus a distance
 *   limit. The limit is the window.
 * - "Within k of each other" means the set must forget things, not just
 *   remember them.
 * - Fixed-size window, so there is no shrink loop: one element enters, one
 *   element leaves.
 *
 * COMPLEXITY
 *   time  O(n)   one pass, with O(1) average set add and remove
 *   space O(min(n, k))   the set never holds more than k elements
 *
 * COMMON MISTAKES
 * - Evicting nums[r - k] instead of nums[r - k - 1], which shrinks the window
 *   by one and reports false on [1,2,3,1], k=3.
 * - Using if (r >= k) for the eviction, which is the same off-by-one.
 * - Storing value to last-index in a map and comparing distances. It works,
 *   and the set is simpler, because a window makes the distance check
 *   unnecessary.
 * - Nested loops comparing every pair within k. That is O(n·k) and times out.
 *
 * FOLLOW-UPS
 * - Contains Duplicate III adds a value tolerance as well as an index one,
 *   which needs a TreeSet for nearest-value queries.
 * - Same skeleton as Find All Anagrams: a fixed window with a summary that is
 *   updated on entry and exit.
 *
 * Generated from data/problems/sliding-window.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.slidingwindow.containsduplicateii;

import java.util.*;

class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        // Holds only the previous k values, so any hit is automatically in range.
        Set<Integer> window = new HashSet<>();

        for (int r = 0; r < nums.length; r++) {
            // At index r the allowed range is [r-k, r], so the element that has
            // just fallen out is the one at r-k-1.
            if (r > k) {
                window.remove(nums[r - k - 1]);
            }

            // add() returns false when the value is already inside the window.
            if (!window.add(nums[r])) {
                return true;
            }
        }

        return false;
    }
}
