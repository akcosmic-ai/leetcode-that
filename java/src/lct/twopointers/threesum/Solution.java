/*
 * 15. 3Sum   [Medium]
 * https://leetcode.com/problems/3sum/
 *
 * PATTERN: Two Pointers
 *
 * Find every unique triple of values in the array that sums to zero. Triples
 * that contain the same values in a different order count as the same triple,
 * and the result must not repeat any of them.
 *
 * SIGNALS THAT POINT HERE
 * - A pair problem with one extra element bolted on. Fix the extra one and the
 *   rest is a pair problem you already know.
 * - Unique triples, and sorting is what makes duplicates adjacent and
 *   therefore easy to skip.
 * - n is 3000, so O(n²) is fine and O(n³) is not.
 *
 * COMPLEXITY
 *   time  O(n²)   an O(n) inward scan for each of n anchors. The O(n log n) sort is dominated by it.
 *   space O(1)   excluding the output, only indexes. Note that sorting mutates the input.
 *
 * COMMON MISTAKES
 * - Forgetting to skip duplicate anchors, which reports [-1,-1,2] twice on the
 *   first example.
 * - Forgetting to skip duplicates after a hit at l and r. The inner pointers
 *   then land on equal values and report the same triple.
 * - De-duplicating by dumping everything into a Set<List<Integer>>. It works,
 *   and it hides the fact that you do not understand where the duplicates come
 *   from.
 * - Looping i < nums.length instead of nums.length - 2, so l and r cross
 *   before the pair loop can do anything useful.
 * - Skipping the sort and trying to use two pointers anyway. Without
 *   sortedness there is no direction to move in.
 *
 * FOLLOW-UPS
 * - 3Sum Closest keeps a running best distance to the target instead of
 *   testing for equality.
 * - 4Sum adds a second anchor loop, giving O(n³). The general kSum is a
 *   recursion around this same inward core.
 *
 * Generated from data/problems/two-pointers.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.twopointers.threesum;

import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Sorting is what makes both the pointer logic and the de-duplication work.
        Arrays.sort(nums);

        List<List<Integer>> out = new ArrayList<>();

        for (int i = 0; i < nums.length - 2; i++) {
            // Everything from here on is >= 0, so the smallest possible sum is
            // already above zero. Nothing left to find.
            if (nums[i] > 0) {
                break;
            }
            // Duplicate anchor: any triple it could find was already found.
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }

            int l = i + 1;
            int r = nums.length - 1;

            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];

                if (sum < 0) {
                    l++;
                } else if (sum > 0) {
                    r--;
                } else {
                    out.add(Arrays.asList(nums[i], nums[l], nums[r]));

                    // Walk both pointers past their duplicates before stepping,
                    // or the very next iteration reports the same triple.
                    while (l < r && nums[l] == nums[l + 1]) {
                        l++;
                    }
                    while (l < r && nums[r] == nums[r - 1]) {
                        r--;
                    }

                    l++;
                    r--;
                }
            }
        }

        return out;
    }
}
