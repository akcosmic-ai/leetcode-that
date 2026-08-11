/*
 * 42. Trapping Rain Water   [Hard]
 * https://leetcode.com/problems/trapping-rain-water/
 *
 * PATTERN: Two Pointers
 *
 * Each value is the height of a bar of width one. After rain, water settles in
 * the dips. Return the total units of water trapped.
 *
 * SIGNALS THAT POINT HERE
 * - Water, dips, or "how much is held between the peaks". Per-index
 *   accumulation, not a single best pair.
 * - The water above index i is min(tallestToTheLeft, tallestToTheRight) -
 *   height[i]. Two independent quantities again.
 * - The obvious solution precomputes two arrays of running maxima. Two
 *   pointers collapses that to two variables.
 *
 * COMPLEXITY
 *   time  O(n)   one pointer moves per iteration and neither ever goes back
 *   space O(1)   four integers. The two-array version of the same idea is O(n) space.
 *
 * COMMON MISTAKES
 * - Updating the running max AFTER adding the water. Then maxLeft can be below
 *   height[l] and you add a negative amount.
 * - Comparing the running maxima (maxLeft < maxRight) rather than the current
 *   bars (height[l] < height[r]). Both formulations can be made to work, and
 *   mixing them is a classic silent bug.
 * - Confusing this with Container With Most Water. There you pick the single
 *   best pair; here you accumulate over every index.
 * - Trying to compute per-dip areas by finding the peaks. It is possible and
 *   it is far more code than this loop.
 *
 * FOLLOW-UPS
 * - The monotonic stack solution processes each dip as it closes, and it is
 *   the version that generalises to Largest Rectangle in Histogram.
 * - Trapping Rain Water II is the 2-D version, and it needs a min-heap
 *   sweeping inwards from the border.
 * - Write the O(n) space two-array version first if the pointer argument does
 *   not click. It is a correct answer, and the O(1) version is an optimisation
 *   of it.
 *
 * Generated from data/problems/two-pointers.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.twopointers.trappingrainwater;

class Solution {
    public int trap(int[] height) {
        int l = 0;
        int r = height.length - 1;

        int maxLeft = 0;    // tallest bar seen from the left, up to l
        int maxRight = 0;   // tallest bar seen from the right, down to r
        int water = 0;

        while (l < r) {
            // Whichever side is SHORTER is the side whose running max is the
            // binding constraint, so that side can be settled now.
            if (height[l] < height[r]) {
                // There is a bar at least height[r] tall somewhere to the right,
                // and height[r] > height[l], so maxLeft alone decides the depth.
                maxLeft = Math.max(maxLeft, height[l]);
                water += maxLeft - height[l];   // never negative: maxLeft >= height[l]
                l++;
            } else {
                maxRight = Math.max(maxRight, height[r]);
                water += maxRight - height[r];
                r--;
            }
        }

        return water;
    }
}
