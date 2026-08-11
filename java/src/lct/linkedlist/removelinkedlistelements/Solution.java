/*
 * 203. Remove Linked List Elements   [Easy]
 * https://leetcode.com/problems/remove-linked-list-elements/
 *
 * PATTERN: Linked List
 *
 * Delete every node whose value equals val and return the head of the result.
 *
 * SIGNALS THAT POINT HERE
 * - Deletion from a linked list, where the head itself might be deleted.
 * - To unlink a node you need the one BEFORE it, so you always walk with a
 *   prev pointer.
 * - [7,7,7,7] deleting 7 is the case that breaks every solution which
 *   special-cases the head just once.
 *
 * COMPLEXITY
 *   time  O(n)   each node is examined once and unlinked at most once
 *   space O(1)   one dummy and one reference
 *
 * COMMON MISTAKES
 * - Advancing prev after a deletion, which skips consecutive matches.
 *   [7,7,7,7] returns [7,7].
 * - Handling the head with a single if (head.val == val) head = head.next;
 *   before the loop, which only strips one leading match.
 * - Returning head rather than dummy.next. The original head may itself have
 *   been deleted.
 * - Reading prev.next.next without first knowing prev.next is non-null. The
 *   loop condition guarantees it; reordering the checks does not.
 *
 * FOLLOW-UPS
 * - Remove Duplicates from Sorted List (next) is the same walk with a
 *   neighbour comparison instead of a value test.
 * - Remove Duplicates from Sorted List II deletes every copy of any duplicated
 *   value, and that one genuinely needs the dummy plus a lookahead.
 *
 * Generated from data/problems/linked-list.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.linkedlist.removelinkedlistelements;

class Solution {
    public ListNode removeElements(ListNode head, int val) {
        // A dummy in front gives the real head a predecessor, so deleting the
        // head needs no special case even when it happens several times.
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        ListNode prev = dummy;

        while (prev.next != null) {
            if (prev.next.val == val) {
                prev.next = prev.next.next;   // splice it out
                // prev deliberately does NOT advance: the node that just became
                // prev.next has not been checked yet.
            } else {
                prev = prev.next;             // advance only when we keep one
            }
        }

        return dummy.next;   // null when everything was removed
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
