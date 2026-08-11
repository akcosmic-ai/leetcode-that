/*
 * 19. Remove Nth Node From End of List   [Medium]
 * https://leetcode.com/problems/remove-nth-node-from-end-of-list/
 *
 * PATTERN: Linked List
 *
 * Remove the node that is n positions from the end and return the head. Do it
 * in one pass.
 *
 * SIGNALS THAT POINT HERE
 * - "k-th from the end" without knowing the length. A gap of k between two
 *   pointers measures it.
 * - One pass is demanded, which rules out counting the length first.
 * - The node to remove can be the head, as in n = sz. That is a dummy head,
 *   again.
 *
 * COMPLEXITY
 *   time  O(sz)   one pass; the leader walks the list once and the trailer follows
 *   space O(1)   one dummy and two references
 *
 * COMMON MISTAKES
 * - Starting both pointers at head instead of at the dummy. Then trail lands
 *   ON the target and you cannot unlink it.
 * - Advancing the leader n + 1 times, or walking until lead == null instead of
 *   lead.next == null. Both are off-by-one variants of the same slip.
 * - No dummy, so n == size needs a special case for removing the head.
 * - Counting the length first and then walking size - n. Correct, two passes,
 *   and the problem asks for one.
 *
 * FOLLOW-UPS
 * - The same gap technique returns the n-th node from the end without deleting
 *   it.
 * - Middle of the Linked List is the ratio version of this idea (a factor of
 *   two) rather than the fixed-gap version.
 *
 * Generated from data/problems/linked-list.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.linkedlist.removenthnodefromend;

class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        // BOTH start at the dummy, not at the head. That offset is what leaves
        // trail one node BEFORE the target, which is what deleting requires.
        ListNode lead = dummy;
        ListNode trail = dummy;

        // Open a gap of exactly n.
        for (int i = 0; i < n; i++) {
            lead = lead.next;
        }

        // Walk both until lead is on the last node.
        while (lead.next != null) {
            lead = lead.next;
            trail = trail.next;
        }

        // trail.next is the n-th node from the end.
        trail.next = trail.next.next;

        return dummy.next;   // handles n == size, where the head is removed
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
