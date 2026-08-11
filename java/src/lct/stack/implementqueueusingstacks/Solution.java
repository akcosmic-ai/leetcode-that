/*
 * 232. Implement Queue using Stacks   [Easy]
 * https://leetcode.com/problems/implement-queue-using-stacks/
 *
 * PATTERN: Stack & Monotonic Stack
 *
 * Build a first-in-first-out queue using only two last-in-first-out stacks.
 * Support push, pop, peek and empty, and each operation should be O(1) on
 * average.
 *
 * SIGNALS THAT POINT HERE
 * - A design problem where the allowed primitive is the opposite of what you
 *   need.
 * - Reversing a stack is what turns LIFO into FIFO, and pouring one stack into
 *   another does exactly that.
 * - Amortised O(1) is the hint that you may occasionally do expensive work, as
 *   long as it is rare.
 *
 * COMPLEXITY
 *   time  O(1) amortised   push is always O(1). A single pop can cost O(n) when it triggers a pour, but each element is poured exactly once, so n operations cost O(n) in total.
 *   space O(n)   the n queued elements, split between the two stacks
 *
 * COMMON MISTAKES
 * - Pouring on every read instead of only when the outbox is empty. That is
 *   O(n) per operation, not amortised O(1).
 * - Pouring when the outbox still has items, which interleaves and breaks
 *   FIFO.
 * - Implementing empty() as outbox.isEmpty(). Both stacks have to be empty.
 * - Reversing the inbox on every push instead, which makes pushes O(n) and is
 *   the mirror-image mistake.
 *
 * FOLLOW-UPS
 * - Implement Stack using Queues is the reverse exercise, and it is harder to
 *   make amortised O(1).
 * - The amortised argument here is the same one behind ArrayList doubling its
 *   backing array.
 *
 * Generated from data/problems/stack.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.stack.implementqueueusingstacks;

import java.util.*;

class MyQueue {

    // Newest items land here.
    private final Deque<Integer> inbox = new ArrayDeque<>();
    // Reversed items live here, so the queue FRONT is on top.
    private final Deque<Integer> outbox = new ArrayDeque<>();

    public MyQueue() {
        // Both stacks are initialised above.
    }

    public void push(int x) {
        inbox.push(x);   // always O(1)
    }

    public int pop() {
        shift();
        return outbox.pop();
    }

    public int peek() {
        shift();
        return outbox.peek();
    }

    public boolean empty() {
        return inbox.isEmpty() && outbox.isEmpty();
    }

    /**
     * Move everything across, but ONLY when the outbox is empty. Pouring while
     * items remain would interleave newer values in front of older ones and
     * break FIFO. Each element is poured at most once in its life, which is
     * what makes every operation amortised O(1).
     */
    private void shift() {
        if (outbox.isEmpty()) {
            while (!inbox.isEmpty()) {
                outbox.push(inbox.pop());
            }
        }
    }
}
