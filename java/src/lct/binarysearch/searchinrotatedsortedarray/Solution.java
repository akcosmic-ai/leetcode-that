/*
 * 33. Search in Rotated Sorted Array   [Medium]
 * https://leetcode.com/problems/search-in-rotated-sorted-array/
 *
 * PATTERN: Binary Search
 *
 * A sorted array of distinct values was rotated. Return the index of target,
 * or -1. O(log n) required.
 *
 * SIGNALS THAT POINT HERE
 * - Rotated sorted array plus a target. The two halves are the whole trick.
 * - The array is not globally sorted, so you cannot compare with the target
 *   directly and know which way to go.
 * - One half is always ordered. In that half a simple range check answers "is
 *   the target in here"; in the other half you recurse.
 *
 * COMPLEXITY
 *   time  O(log n)   every iteration discards half the range; the case analysis is O(1)
 *   space O(1)   three integers
 *
 * COMMON MISTAKES
 * - Using nums[lo] < nums[mid] instead of <=. When lo == mid, which happens
 *   for a two-element range, the strict version takes the wrong branch.
 * - Getting the range-check bounds inclusive on the wrong side, which either
 *   misses nums[lo] or re-tests nums[mid].
 * - Comparing the target with nums[mid] and moving as if the array were
 *   sorted. That fails the moment the target and mid straddle the rotation.
 * - Finding the rotation point first and then searching. That is correct and
 *   needs two loops, and this version needs one.
 *
 * FOLLOW-UPS
 * - The two-pass alternative: find the minimum with the previous problem, then
 *   binary search the appropriate run. Easier to reason about, more code.
 * - Search in Rotated Sorted Array II allows duplicates, which forces an O(n)
 *   worst case.
 *
 * Generated from data/problems/binary-search.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.binarysearch.searchinrotatedsortedarray;

class Solution {
    public int search(int[] nums, int target) {
        int lo = 0;
        int hi = nums.length - 1;

        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;

            if (nums[mid] == target) {
                return mid;
            }

            // A rotation has one break point, so it cannot be in both halves.
            // At least one of them is therefore a properly sorted run.
            if (nums[lo] <= nums[mid]) {
                // Left half [lo, mid] is sorted, so a range check settles it.
                // Strict < on nums[mid] because equality was handled above.
                if (target >= nums[lo] && target < nums[mid]) {
                    hi = mid - 1;
                } else {
                    lo = mid + 1;
                }
            } else {
                // Right half [mid, hi] is the sorted one.
                if (target > nums[mid] && target <= nums[hi]) {
                    lo = mid + 1;
                } else {
                    hi = mid - 1;
                }
            }
        }

        return -1;
    }
}
