/*
 * 23. Merge k Sorted Lists   [Hard]
 * https://leetcode.com/problems/merge-k-sorted-lists/
 *
 * PATTERN: Linked List
 *
 * An array of k sorted lists is given, some possibly empty. Merge them all
 * into one sorted list and return its head.
 *
 * SIGNALS THAT POINT HERE
 * - "Always take the smallest of k candidates, repeatedly" is a min-heap,
 *   essentially by definition.
 * - You already know the two-list merge. The only question is how to pick the
 *   smallest of k heads efficiently.
 * - Scanning all k heads on every step is O(nk). A heap makes each pick O(log
 *   k).
 *
 * COMPLEXITY
 *   time  O(n log k)   each of the n nodes is pushed and polled once, and the heap never exceeds k entries
 *   space O(k)   the heap holds at most one node per list. The output reuses the existing nodes.
 *
 * COMMON MISTAKES
 * - Offering null heads to the heap. PriorityQueue throws a
 *   NullPointerException, and empty input lists are explicitly allowed.
 * - Forgetting tail.next = null, which can leave a stale suffix attached to
 *   the result.
 * - Writing the comparator as a.val - b.val, which overflows for values at the
 *   extremes of int.
 * - Merging the lists one after another into an accumulator. That is O(nk):
 *   the accumulated list is re-walked every time.
 * - Collecting every value into a list, sorting it, and rebuilding. Correct,
 *   O(n log n) rather than O(n log k), and it throws away the sortedness you
 *   were given.
 *
 * FOLLOW-UPS
 * - Divide and conquer gives the same O(n log k) with no heap: pair the lists
 *   up and merge two at a time, halving the count each round.
 * - This is the k-way merge at the heart of external sorting, where the lists
 *   are files too large for memory.
 * - The Heap pattern later in the syllabus builds on exactly this shape.
 *
 * Generated from data/problems/linked-list.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.linkedlist.mergeksortedlists;

import java.util.*;

class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        // Integer.compare, not a.val - b.val, which can overflow.
        PriorityQueue<ListNode> pq =
                new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));

        // Seed with the head of every non-empty list. ArrayDeque and
        // PriorityQueue both reject nulls, so the check is required.
        for (ListNode head : lists) {
            if (head != null) {
                pq.offer(head);
            }
        }

        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;

        while (!pq.isEmpty()) {
            ListNode smallest = pq.poll();

            tail.next = smallest;
            tail = smallest;

            // Keep the heap holding exactly the current head of each list that
            // still has nodes left.
            if (smallest.next != null) {
                pq.offer(smallest.next);
            }
        }

        // The last node spliced on still carries its original next pointer,
        // which would leave a stale tail hanging off the result.
        tail.next = null;

        return dummy.next;
    }
}

/* LeetCode injects this class. It is included here so the file compiles and
 * runs on your own machine with no editing. */
class ListNode {
    int val;
    ListNode next;

    ListNode() {
    }

    ListNode(int val) {
        this.val = val;
    }

    ListNode(int val, ListNode next) {
        this.val = val;
        this.next = next;
    }
}
