/*
 * 153. Find Minimum in Rotated Sorted Array   [Medium]
 * https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/
 *
 * PATTERN: Binary Search
 *
 * A sorted array of distinct values was rotated some number of times. Find the
 * smallest element in O(log n).
 *
 * SIGNALS THAT POINT HERE
 * - Rotated sorted array. The array is not globally sorted and it is still
 *   binary-searchable, because one half is always properly sorted.
 * - You are looking for the rotation point, and the minimum is exactly the
 *   rotation point.
 * - There is no target to compare against, so you compare against an endpoint
 *   instead.
 *
 * COMPLEXITY
 *   time  O(log n)   the range halves each iteration
 *   space O(1)   three integers
 *
 * COMMON MISTAKES
 * - Comparing against nums[lo], which is ambiguous on the un-rotated array
 *   [11,13,15,17].
 * - Using hi = mid - 1, which can discard the minimum when mid IS the minimum.
 * - Using the lo <= hi idiom with no early return, so the loop has nothing to
 *   converge on.
 * - Scanning linearly. O(n) is correct and not what was asked.
 *
 * FOLLOW-UPS
 * - With duplicates allowed (LeetCode 154) the worst case degrades to O(n),
 *   because [1,1,1,0,1] gives no information at mid.
 * - Search in Rotated Sorted Array (next) can be solved as "find the rotation
 *   point with this, then binary search the right run".
 *
 * Generated from data/problems/binary-search.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.binarysearch.findminimuminrotatedsortedarray;

class Solution {
    public int findMin(int[] nums) {
        int lo = 0;
        int hi = nums.length - 1;

        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;

            // Compare against the RIGHT end, deliberately. Comparing against
            // nums[lo] cannot distinguish "in the high run" from "not rotated
            // at all", and this comparison has no such blind spot.
            if (nums[mid] > nums[hi]) {
                lo = mid + 1;   // mid is in the high run, minimum is to the right
            } else {
                hi = mid;       // mid is in the low run, so it may BE the minimum
            }
        }

        return nums[lo];
    }
}
