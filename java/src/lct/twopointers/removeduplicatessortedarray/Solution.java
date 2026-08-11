/*
 * 26. Remove Duplicates from Sorted Array   [Easy]
 * https://leetcode.com/problems/remove-duplicates-from-sorted-array/
 *
 * PATTERN: Two Pointers
 *
 * The array is sorted. Remove duplicates in place so each value appears once,
 * keeping the relative order, and return the number of unique values k. Only
 * the first k positions are checked.
 *
 * SIGNALS THAT POINT HERE
 * - In place removal or compaction, with the tail allowed to be garbage.
 * - The input is sorted, so duplicates are adjacent. That is what makes a
 *   single comparison enough.
 * - You return a length rather than a new array. The caller only looks at the
 *   prefix you built.
 *
 * COMPLEXITY
 *   time  O(n)   one pass; `read` never goes backwards
 *   space O(1)   two indexes, and the array is compacted in place
 *
 * COMMON MISTAKES
 * - Comparing nums[read] with nums[read - 1]. It works here by luck on some
 *   inputs and is the wrong mental model: once you overwrite, read - 1 is not
 *   necessarily a kept value.
 * - Starting write at 0, which drops the first element or compares against
 *   nums[-1].
 * - Trying to actually delete elements, or to fix up the tail. The problem
 *   only inspects the first k slots.
 * - Using a LinkedHashSet and copying back. Correct, and it throws away the
 *   O(1) space that being sorted buys you.
 *
 * FOLLOW-UPS
 * - Remove Duplicates II allows each value at most twice: compare against
 *   nums[write - 2] instead.
 * - Remove Element (LeetCode 27) is the same skeleton with a value test rather
 *   than a neighbour test.
 *
 * Generated from data/problems/two-pointers.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.twopointers.removeduplicatessortedarray;

class Solution {
    public int removeDuplicates(int[] nums) {
        if (nums.length == 0) {
            return 0;
        }

        // nums[0] is always kept, so the answer already has one element.
        int write = 1;

        for (int read = 1; read < nums.length; read++) {
            // Compare against the last value we KEPT, which lives at write-1.
            // Comparing with nums[read-1] breaks once we start overwriting.
            if (nums[read] != nums[write - 1]) {
                nums[write] = nums[read];
                write++;
            }
        }

        return write;   // also the count of unique values
    }
}
