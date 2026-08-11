/*
 * 239. Sliding Window Maximum   [Hard]
 * https://leetcode.com/problems/sliding-window-maximum/
 *
 * PATTERN: Sliding Window
 *
 * A window of size k slides one position at a time from the left of the array
 * to the right. Return the maximum value inside the window at every position.
 *
 * SIGNALS THAT POINT HERE
 * - Fixed-size window, but the summary you need is a maximum rather than a
 *   sum.
 * - This is the problem that shows why sliding window alone is not enough:
 *   when the maximum leaves the window, you have no idea what the new maximum
 *   is.
 * - n is 10^5 and k can be large, so re-scanning each window at O(n·k) will
 *   time out.
 *
 * COMPLEXITY
 *   time  O(n)   every index is pushed exactly once and popped at most once, so the inner whiles are amortised O(1)
 *   space O(k)   the deque never holds more than k indexes
 *
 * COMMON MISTAKES
 * - Storing values instead of indexes, which leaves you unable to tell when
 *   something has slid out of the window.
 * - Using dq.peekFirst() < r - k instead of <=, which keeps one stale index
 *   alive.
 * - Comparing with < rather than <= when popping the back. Equal values are
 *   also dead, and keeping them wastes space without being wrong.
 * - Reaching for a PriorityQueue. It gives O(n log k) and needs lazy deletion,
 *   because removing an arbitrary element from a heap is O(n).
 * - Re-scanning the window for its maximum, which is O(n·k) and times out.
 *
 * FOLLOW-UPS
 * - The Stack pattern (next) is built entirely on this monotonic idea, and
 *   Daily Temperatures is the same trick without the window.
 * - Sliding Window Minimum is the identical code with the comparison flipped.
 * - Shortest Subarray with Sum at Least K needs this deque over prefix sums,
 *   which is what makes Minimum Size Subarray Sum work with negative values.
 *
 * Generated from data/problems/sliding-window.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.slidingwindow.slidingwindowmaximum;

import java.util.*;

class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] out = new int[n - k + 1];

        // Holds INDEXES. Their values are strictly decreasing front to back,
        // so the front index is always the maximum of the live candidates.
        Deque<Integer> dq = new ArrayDeque<>();

        for (int r = 0; r < n; r++) {
            // 1. The front may have slid out of the window.
            while (!dq.isEmpty() && dq.peekFirst() <= r - k) {
                dq.pollFirst();
            }

            // 2. Anything at the back that is <= nums[r] is dead: it is both
            //    smaller and older, so nums[r] beats it in every future window.
            while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[r]) {
                dq.pollLast();
            }

            dq.offerLast(r);

            // 3. Once the window is full, the front is its maximum.
            if (r >= k - 1) {
                out[r - k + 1] = nums[dq.peekFirst()];
            }
        }

        return out;
    }
}
