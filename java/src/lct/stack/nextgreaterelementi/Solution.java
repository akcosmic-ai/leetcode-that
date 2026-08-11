/*
 * 496. Next Greater Element I   [Easy]
 * https://leetcode.com/problems/next-greater-element-i/
 *
 * PATTERN: Stack & Monotonic Stack
 *
 * Every value in the first array also appears in the second, and all values
 * are distinct. For each value in the first array, find the first value to its
 * right in the second array that is larger than it, or -1 if there is none.
 *
 * SIGNALS THAT POINT HERE
 * - Next greater or next smaller element, in any wording. This is a monotonic
 *   stack, essentially always.
 * - You were about to write a nested loop scanning rightwards. The stack
 *   replaces that inner scan.
 * - The two-array wrapper is a distraction. Solve it for nums2, store answers
 *   in a map, then read them off.
 *
 * COMPLEXITY
 *   time  O(n + m)   each value of nums2 is pushed once and popped at most once, then one pass over nums1
 *   space O(n)   the stack plus the answer map
 *
 * COMMON MISTAKES
 * - Using if instead of while. One incoming value can resolve several waiting
 *   values at once.
 * - Forgetting the leftovers on the stack, which must default to -1.
 * - Storing values here and then trying the same approach on a problem that
 *   needs positions. When the answer is a distance or an index, push INDEXES
 *   instead.
 * - The O(n·m) nested search. It passes at n = 1000 and teaches nothing, and
 *   it will not pass Daily Temperatures.
 *
 * FOLLOW-UPS
 * - Daily Temperatures (later in this pattern) is this problem asking for the
 *   DISTANCE, which is why it pushes indexes.
 * - Next Greater Element II makes the array circular: run the same loop twice,
 *   or over indexes modulo n.
 *
 * Generated from data/problems/stack.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.stack.nextgreaterelementi;

import java.util.*;

class Solution {
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        // value -> its next greater element in nums2
        Map<Integer, Integer> nextGreater = new HashMap<>();

        // Values still waiting for an answer. Decreasing from bottom to top.
        Deque<Integer> waiting = new ArrayDeque<>();

        for (int x : nums2) {
            // Everything smaller than x has just found its answer: x itself.
            while (!waiting.isEmpty() && waiting.peek() < x) {
                nextGreater.put(waiting.pop(), x);
            }
            waiting.push(x);
        }
        // Whatever is still waiting never found anything bigger, and the
        // getOrDefault below turns that into -1.

        int[] out = new int[nums1.length];
        for (int i = 0; i < nums1.length; i++) {
            out[i] = nextGreater.getOrDefault(nums1[i], -1);
        }
        return out;
    }
}
