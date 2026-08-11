/*
 * 206. Reverse Linked List   [Easy]
 * https://leetcode.com/problems/reverse-linked-list/
 *
 * PATTERN: Linked List
 *
 * Reverse a singly linked list and return the new head. Do it by rewiring the
 * existing nodes, not by building a new list.
 *
 * SIGNALS THAT POINT HERE
 * - The input is a ListNode. That is most of the signal in this whole pattern.
 * - Reverse, in place, O(1) extra space. No array copy.
 * - This is the single most reused subroutine in linked lists. Palindrome
 *   Linked List and Reorder List both call it.
 *
 * COMPLEXITY
 *   time  O(n)   one pass, constant work per node
 *   space O(1)   three references. The recursive version is O(n) stack.
 *
 * COMMON MISTAKES
 * - Writing curr.next = prev before saving curr.next. The remainder of the
 *   list is lost and you return a one-node list.
 * - Returning head instead of prev. head is now the tail and its next is null,
 *   so you return a single node.
 * - Advancing as curr = next; prev = curr; which sets prev to the wrong node.
 * - Initialising prev = head, which builds a two-node cycle immediately.
 *
 * FOLLOW-UPS
 * - The recursive version is four lines and costs O(n) stack. Worth writing
 *   once to see it, and the iterative one is what you want in an interview.
 * - Reverse Linked List II reverses only positions left to right, which is
 *   this loop plus careful stitching at both boundaries.
 * - Reorder List and Palindrome Linked List both call this as a subroutine.
 *
 * Generated from data/problems/linked-list.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.linkedlist.reverselinkedlist;

class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;   // the old head becomes the new tail
        ListNode curr = head;

        while (curr != null) {
            // Save it BEFORE the next line destroys it. Without this, the rest
            // of the list becomes unreachable.
            ListNode next = curr.next;

            curr.next = prev;   // flip the arrow

            prev = curr;        // shuffle both forward, in this order
            curr = next;
        }

        // curr is null, so prev is the last node we touched: the new head.
        return prev;
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
