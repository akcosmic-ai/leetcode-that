/*
 * TEMPLATE: Linked list: dummy head, reverse, fast & slow
 *
 * Three moves cover nearly every linked-list problem. Dummy head removes the
 * "what if it is the first node" special case. Three-pointer reverse walks
 * once. Fast and slow finds the middle and detects a cycle in one pass. Save
 * next BEFORE you overwrite it, every time.
 *
 * Generated from data/templates/linked-list.js.
 */
package lct.templates.linkedlist;

class LinkedListTemplate {

    /** Shape 1 - REVERSE. prev trails, curr walks, next is the lifeline. */
    ListNode reverse(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode next = curr.next;   // save it FIRST, we are about to destroy it
            curr.next = prev;            // flip the arrow
            prev = curr;                 // shuffle both pointers forward
            curr = next;
        }
        return prev;                     // curr is null, prev is the new head
    }

    /** Shape 2 - DUMMY HEAD. No special case for the first node. */
    ListNode mergeTwoSorted(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { tail.next = a; a = a.next; }
            else               { tail.next = b; b = b.next; }
            tail = tail.next;
        }
        tail.next = (a != null) ? a : b;   // attach whatever is left, already sorted
        return dummy.next;                 // NOT dummy, and NOT the original head
    }

    /** Shape 2b - DUMMY HEAD for deletion. */
    ListNode removeValue(ListNode head, int val) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode prev = dummy;
        while (prev.next != null) {
            if (prev.next.val == val) prev.next = prev.next.next;  // skip over it
            else prev = prev.next;
        }
        return dummy.next;
    }

    /** Shape 3 - FAST AND SLOW. Finds the middle in one pass. */
    ListNode middle(ListNode head) {
        ListNode slow = head, fast = head;
        // order matters: testing fast.next first would NPE when fast is null
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;                    // for even length this is the SECOND middle
    }

    /** Shape 3b - FLOYD CYCLE DETECTION. If they ever meet, there is a loop. */
    boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;   // reference identity, which is correct here
        }
        return false;
    }

    /** Shape 3c - Nth FROM THE END. Gap of n, then walk both to the end. */
    ListNode nthFromEnd(ListNode head, int n) {
        ListNode lead = head;
        for (int i = 0; i < n; i++) {
            if (lead == null) return null;
            lead = lead.next;
        }
        ListNode trail = head;
        while (lead != null) {
            lead = lead.next;
            trail = trail.next;
        }
        return trail;
    }

    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val) { this.val = val; }
    }
}
