/*
 * 739. Daily Temperatures   [Medium]
 * https://leetcode.com/problems/daily-temperatures/
 *
 * PATTERN: Stack & Monotonic Stack
 *
 * For each day, report how many days you must wait until a warmer day. Put 0
 * where no warmer day ever comes.
 *
 * SIGNALS THAT POINT HERE
 * - "How long until something bigger" is the next-greater question with a
 *   distance attached.
 * - The answer needs positions, which is the signal to push indexes and read
 *   the values through them.
 * - n is 10^5, so the O(n²) forward scan will time out. That rules out the
 *   obvious solution.
 *
 * COMPLEXITY
 *   time  O(n)   each index is pushed once and popped at most once, so the inner while is amortised O(1)
 *   space O(n)   the stack, worst case every day on a strictly cooling run
 *
 * COMMON MISTAKES
 * - Pushing temperatures instead of indexes, which makes the distance
 *   impossible to compute.
 * - Using if instead of while, so only one waiting day is resolved per warm
 *   day.
 * - Writing out[day] = i instead of i - day. The answer is a wait, not a date.
 * - Explicitly filling the leftovers with 0. Harmless, and unnecessary in
 *   Java.
 * - The O(n²) forward scan, which times out on a strictly decreasing array of
 *   length 10^5.
 *
 * FOLLOW-UPS
 * - Next Greater Element II makes the array circular, solved by running the
 *   same loop twice over indexes modulo n.
 * - Stock Span and Online Stock Span are the same problem looking backwards.
 * - Largest Rectangle in Histogram (next) uses this to find, for every bar,
 *   the nearest shorter bar on each side.
 *
 * Generated from data/problems/stack.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.stack.dailytemperatures;

import java.util.*;

class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;

        // Java zero-fills, and 0 is exactly the answer for days that never warm up.
        int[] out = new int[n];

        // INDEXES of days still waiting. Their temperatures decrease bottom to top.
        Deque<Integer> waiting = new ArrayDeque<>();

        for (int i = 0; i < n; i++) {
            // Today resolves every waiting day that was colder. A while, not an
            // if: one warm day can answer several at once.
            while (!waiting.isEmpty() && temperatures[waiting.peek()] < temperatures[i]) {
                int day = waiting.pop();
                out[day] = i - day;   // the DISTANCE, which needs the index
            }
            waiting.push(i);
        }

        return out;
    }
}
