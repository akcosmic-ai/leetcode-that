/*
 * 11. Container With Most Water   [Medium]
 * https://leetcode.com/problems/container-with-most-water/
 *
 * PATTERN: Two Pointers
 *
 * Each array value is the height of a vertical line at that index. Pick two
 * lines so that the rectangle they form with the x-axis holds the most water.
 * Return that area. The shorter line sets the height, and the index distance
 * sets the width.
 *
 * SIGNALS THAT POINT HERE
 * - Pick two positions to maximise something that depends on their distance
 *   AND on a min or max between them.
 * - n is 10^5, so the O(n²) double loop is too slow and the answer must be
 *   linear.
 * - Starting at the widest possible pair and narrowing is the natural move,
 *   because width can only shrink from there.
 *
 * COMPLEXITY
 *   time  O(n)   one pointer moves on every iteration and neither ever goes back
 *   space O(1)   three integers
 *
 * COMMON MISTAKES
 * - Moving the TALLER pointer, which can step over the answer. [4,3,2,1,4] is
 *   the case that exposes it.
 * - Using r - l + 1 for the width. The lines are at the indexes, so the gap
 *   between them is r - l.
 * - Measuring after moving instead of before, which skips the very first and
 *   widest pair.
 * - Sorting the heights. Sorting destroys the indexes, and the indexes ARE the
 *   width.
 *
 * FOLLOW-UPS
 * - Trapping Rain Water (next) looks similar and is a different problem: there
 *   you accumulate water over every index rather than picking one pair.
 * - Largest Rectangle in Histogram is the version where the bars are solid,
 *   and that one needs a monotonic stack.
 *
 * Generated from data/problems/two-pointers.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.twopointers.containerwithmostwater;

class Solution {
    public int maxArea(int[] height) {
        int l = 0;
        int r = height.length - 1;
        int best = 0;

        while (l < r) {
            // The shorter line decides the height; the index gap decides the width.
            int h = Math.min(height[l], height[r]);
            best = Math.max(best, h * (r - l));

            // Move the SHORTER side. That line is already height-limited, and any
            // future partner is strictly closer, so it can never do better.
            // Keeping it and moving the taller line could only lose area.
            if (height[l] < height[r]) {
                l++;
            } else {
                r--;
            }
        }

        return best;
    }
}
