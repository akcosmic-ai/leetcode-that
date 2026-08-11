/*
 * 155. Min Stack   [Medium]
 * https://leetcode.com/problems/min-stack/
 *
 * PATTERN: Stack & Monotonic Stack
 *
 * Build a stack that also reports its minimum element. All four operations,
 * push, pop, top and getMin, must be O(1).
 *
 * SIGNALS THAT POINT HERE
 * - O(1) for a query that would normally need a scan. That means the answer
 *   must be maintained, not computed.
 * - Popping has to RESTORE an older minimum, which rules out a single min
 *   variable.
 * - "For every state of the stack, remember an extra fact about that state" is
 *   what a parallel stack is for.
 *
 * COMPLEXITY
 *   time  O(1)   every operation is a constant number of stack operations, with no scanning
 *   space O(n)   two stacks of n elements. That is the price of an O(1) getMin.
 *
 * COMMON MISTAKES
 * - Using a single min field, which cannot recover the previous minimum after
 *   the minimum is popped.
 * - Pushing to mins only when a new minimum appears. It saves space and now
 *   the two stacks have different heights, so pop() needs a comparison and it
 *   is easy to get wrong.
 * - Scanning the stack inside getMin(), which is O(n) and violates the
 *   requirement.
 * - Using java.util.Stack and relying on search or indexing. ArrayDeque is
 *   faster, and neither should be indexed here.
 *
 * FOLLOW-UPS
 * - The space-optimised variant pushes to mins only on a new minimum, and on
 *   pop compares the popped value against mins.peek() before popping that too.
 *   Same O(1) time, less memory, more care needed.
 * - Max Stack is the mirror image. Min Queue is genuinely harder and needs a
 *   monotonic deque, which is Sliding Window Maximum.
 *
 * Generated from data/problems/stack.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.stack.minstack;

import java.util.*;

class MinStack {

    private final Deque<Integer> values = new ArrayDeque<>();
    // mins.peek() is always the minimum of everything currently in values.
    private final Deque<Integer> mins = new ArrayDeque<>();

    public MinStack() {
        // Both stacks are initialised above.
    }

    public void push(int val) {
        values.push(val);

        // Push on EVERY call, even when val is not a new minimum. Keeping the
        // two stacks the same height is what makes pop() a two-liner.
        mins.push(mins.isEmpty() ? val : Math.min(val, mins.peek()));
    }

    public void pop() {
        values.pop();
        mins.pop();   // popping both together restores the previous minimum
    }

    public int top() {
        return values.peek();
    }

    public int getMin() {
        return mins.peek();
    }
}
