/*
 * 128. Longest Consecutive Sequence   [Medium]
 * https://leetcode.com/problems/longest-consecutive-sequence/
 *
 * PATTERN: Arrays & Hashing
 *
 * Find the length of the longest run of consecutive integers present in the
 * array. The elements need not be adjacent in the array, and it must run in
 * O(n).
 *
 * SIGNALS THAT POINT HERE
 * - Consecutive integers, but their order in the array is irrelevant. That
 *   rules out sliding window.
 * - O(n) is demanded, which rules out sorting even though sorting makes the
 *   problem trivial.
 * - You need repeated "is x + 1 present" lookups. That is a set.
 *
 * COMPLEXITY
 *   time  O(n)   the inner while only runs for numbers that start a run, and across all runs it advances at most n times in total
 *   space O(n)   the set holds every distinct value
 *
 * COMMON MISTAKES
 * - Leaving out the contains(x - 1) guard. The code still gives the right
 *   answer and quietly becomes O(n²), which times out on 1..100000.
 * - Iterating nums instead of the set. Correct, but duplicates make you redo
 *   the same run repeatedly.
 * - Returning 1 for an empty array. Seed best to 0, not 1.
 * - Sorting first. It works in O(n log n), and it is the wrong answer to the
 *   question that was asked.
 *
 * FOLLOW-UPS
 * - Union-Find also solves this by merging x with x+1, which you will meet in
 *   the Graphs pattern.
 * - If duplicates had to be counted, or the run had to be contiguous in the
 *   array, this becomes a completely different problem. Reread the
 *   constraints.
 *
 * Generated from data/problems/arrays-hashing.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.arrayshashing.longestconsecutivesequence;

import java.util.*;

class Solution {
    public int longestConsecutive(int[] nums) {
        // The set does two jobs: O(1) membership, and duplicates disappear.
        Set<Integer> all = new HashSet<>();
        for (int x : nums) {
            all.add(x);
        }

        int best = 0;

        for (int x : all) {
            // THE key line. If x-1 exists then x sits inside some run, and that
            // run will be counted from its own first element. Skipping here is
            // what keeps the whole method O(n) instead of O(n^2).
            if (all.contains(x - 1)) {
                continue;
            }

            // x begins a run. Walk up as far as the set allows.
            int length = 1;
            while (all.contains(x + length)) {
                length++;
            }

            best = Math.max(best, length);
        }

        return best;
    }
}
