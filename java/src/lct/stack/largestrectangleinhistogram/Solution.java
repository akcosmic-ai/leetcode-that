/*
 * 84. Largest Rectangle in Histogram   [Hard]
 * https://leetcode.com/problems/largest-rectangle-in-histogram/
 *
 * PATTERN: Stack & Monotonic Stack
 *
 * Each value is the height of a bar of width one, standing side by side. Find
 * the area of the largest rectangle that fits entirely inside the histogram.
 *
 * SIGNALS THAT POINT HERE
 * - Largest area under a skyline, or spans bounded by the nearest smaller
 *   element on each side.
 * - For each bar, the rectangle at that HEIGHT extends left and right until it
 *   meets a shorter bar. That is the next-smaller question on both sides.
 * - n is 10^5, so O(n²) is out and the answer must be a single amortised pass.
 *
 * COMPLEXITY
 *   time  O(n)   each index is pushed exactly once and popped exactly once across the whole run
 *   space O(n)   the stack, worst case every bar on a strictly increasing histogram
 *
 * COMMON MISTAKES
 * - Computing the width as i - stack.peek() before popping, or forgetting the
 *   - 1. The boundaries are exclusive on both sides, so it is i - leftBoundary
 *   - 1.
 * - Looping only to n - 1 and then forgetting to drain the stack. The height-0
 *   sentinel exists to make that impossible.
 * - Using -1 as the left boundary only sometimes. An empty stack always means
 *   "nothing shorter to the left", so the rectangle starts at index 0.
 * - Popping with > instead of >=. Equal heights must also be popped, or a flat
 *   region is measured too narrow.
 * - The O(n²) approach that expands left and right from every bar. It is a
 *   good way to understand the problem and it times out at n = 10^5.
 *
 * FOLLOW-UPS
 * - Maximal Rectangle in a binary matrix runs this per row over running column
 *   heights, turning a 2-D problem into n calls of this one.
 * - Trapping Rain Water can also be solved with a monotonic stack, and it is
 *   worth writing both ways to see the difference between accumulating and
 *   measuring.
 * - The same nearest-smaller-on-both-sides idea gives Sum of Subarray
 *   Minimums.
 *
 * Generated from data/problems/stack.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.stack.largestrectangleinhistogram;

import java.util.*;

class Solution {
    public int largestRectangleArea(int[] heights) {
        // INDEXES, with heights increasing from bottom to top. That ordering is
        // what makes "the entry below me is my nearest shorter bar on the left"
        // true at all times.
        Deque<Integer> stack = new ArrayDeque<>();
        int best = 0;

        // Note i <= heights.length. The extra step is a virtual bar of height 0,
        // shorter than everything, which flushes the stack so there is no
        // separate leftover pass to write.
        for (int i = 0; i <= heights.length; i++) {
            int cur = (i == heights.length) ? 0 : heights[i];

            while (!stack.isEmpty() && heights[stack.peek()] >= cur) {
                int height = heights[stack.pop()];

                // After popping, the new top is the nearest SHORTER bar to the
                // left. Empty means nothing shorter exists, so the rectangle
                // reaches index 0, which -1 encodes.
                int leftBoundary = stack.isEmpty() ? -1 : stack.peek();

                // Right boundary is i, left boundary is exclusive on both sides.
                int width = i - leftBoundary - 1;

                best = Math.max(best, height * width);
            }

            stack.push(i);
        }

        return best;
    }
}
