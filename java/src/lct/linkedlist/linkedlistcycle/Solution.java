/*
 * 141. Linked List Cycle   [Easy]
 * https://leetcode.com/problems/linked-list-cycle/
 *
 * PATTERN: Linked List
 *
 * Decide whether the list loops back on itself. It does if following next
 * repeatedly can revisit a node.
 *
 * SIGNALS THAT POINT HERE
 * - Cycle, loop, or "does it ever end". Fast and slow pointers.
 * - A HashSet of visited nodes also works and costs O(n) memory. The fast/slow
 *   version is O(1), and that is the reason this problem is famous.
 * - The same fast/slow machinery finds the middle of a list, so learning it
 *   pays twice.
 *
 * COMPLEXITY
 *   time  O(n)   without a cycle, fast reaches the end in n/2 steps. With one, they meet within a further n steps.
 *   space O(1)   two references. The HashSet version is O(n).
 *
 * COMMON MISTAKES
 * - Writing the guard as while (fast.next != null && fast != null), which
 *   throws a NullPointerException on an empty or single-node list.
 * - Comparing slow.val == fast.val. Values repeat; node identity does not.
 * - Advancing fast by one and slow by one, which never closes any gap.
 * - Counting iterations and declaring a cycle after some threshold. It works
 *   on the test data and is not an algorithm.
 *
 * FOLLOW-UPS
 * - Linked List Cycle II (later in this pattern) finds where the loop begins,
 *   which needs one more insight on top of this.
 * - Happy Number is this same cycle detection on a sequence of numbers rather
 *   than nodes.
 *
 * Generated from data/problems/linked-list.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.linkedlist.linkedlistcycle;

class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;

        // Order matters: checking fast.next first would throw when fast is null.
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;

            // Reference identity, not value equality. Two distinct nodes can
            // hold the same number.
            if (slow == fast) {
                return true;
            }
        }

        // fast ran off the end, so the list terminates.
        return false;
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
