/*
 * 347. Top K Frequent Elements   [Medium]
 * https://leetcode.com/problems/top-k-frequent-elements/
 *
 * PATTERN: Arrays & Hashing
 *
 * Return the k values that appear most often in the array, in any order. The
 * answer is guaranteed to be unique.
 *
 * SIGNALS THAT POINT HERE
 * - Top k or k most frequent. A heap is the usual answer, and buckets are the
 *   O(n) answer.
 * - You need counts first, so a map is step one regardless.
 * - The key realisation: a count is bounded by n, so you can use the count
 *   itself as an array index and skip sorting entirely.
 *
 * COMPLEXITY
 *   time  O(n)   counting is O(n), filling the buckets is O(distinct), and the downward walk touches each bucket slot once. No sort anywhere.
 *   space O(n)   the count map plus n+1 bucket lists
 *
 * COMMON MISTAKES
 * - Sizing the bucket array as nums.length instead of nums.length + 1. A value
 *   that appears in every position has count n, and that index must exist.
 * - Iterating the buckets upwards, which returns the k LEAST frequent values.
 * - Forgetting to stop at k inside the inner loop. A single bucket can hold
 *   several values and you will write past the end of the output array.
 * - Sorting the entries of the count map. It works and is O(m log m), but it
 *   throws away the whole point of this problem.
 *
 * FOLLOW-UPS
 * - The heap solution: keep a min-heap of size k ordered by count, for O(n log
 *   k). That is the version you will build again in the Heap pattern.
 * - Quickselect on the counts gives O(n) average without buckets, at the cost
 *   of much fiddlier code.
 *
 * Generated from data/problems/arrays-hashing.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.arrayshashing.topkfrequentelements;

import java.util.*;

class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // Step 1: how often does each value appear?
        Map<Integer, Integer> counts = new HashMap<>();
        for (int x : nums) {
            counts.merge(x, 1, Integer::sum);
        }

        // Step 2: bucket by frequency. A frequency is between 1 and nums.length,
        // so it is a legal index into an array of size nums.length + 1.
        List<List<Integer>> buckets = new ArrayList<>();
        for (int i = 0; i <= nums.length; i++) {
            buckets.add(new ArrayList<>());
        }
        for (Map.Entry<Integer, Integer> e : counts.entrySet()) {
            buckets.get(e.getValue()).add(e.getKey());
        }

        // Step 3: read from the highest frequency downwards until we have k.
        int[] out = new int[k];
        int filled = 0;
        for (int freq = nums.length; freq >= 1 && filled < k; freq--) {
            for (int value : buckets.get(freq)) {
                out[filled] = value;
                filled++;
                if (filled == k) break;
            }
        }

        return out;
    }
}
