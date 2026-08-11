/*
 * 160. Intersection of Two Linked Lists   [Easy]
 * https://leetcode.com/problems/intersection-of-two-linked-lists/
 *
 * PATTERN: Linked List
 *
 * Two lists may merge and share a common tail. Return the first shared node,
 * or null if they never meet. The shared part must be the same nodes, not
 * merely equal values.
 *
 * SIGNALS THAT POINT HERE
 * - Two lists that share a suffix. The lengths differ, and that difference is
 *   the whole problem.
 * - O(1) memory rules out a set of visited nodes, which is the easy answer.
 * - "Same node" not "same value", so every comparison is == on references.
 *
 * COMPLEXITY
 *   time  O(m + n)   each pointer traverses at most both lists once
 *   space O(1)   two references. A visited-set solution is O(m).
 *
 * COMMON MISTAKES
 * - Comparing a.val == b.val, which reports a false intersection whenever the
 *   two lists happen to contain the same number.
 * - Writing the switch as a = a.next == null ? headB : a.next, which never
 *   lets a be null and so breaks the no-intersection termination.
 * - Using while (a != null && b != null), which exits before the pointers can
 *   meet.
 * - Storing every node of A in a HashSet. Correct, O(m) memory, and it gives
 *   up the property this problem is teaching.
 *
 * FOLLOW-UPS
 * - The three-pass version measures both lengths, advances the longer list by
 *   the difference, then walks in step. Easier to explain, more code.
 * - The same distance-equalising idea underlies the second phase of Floyd's
 *   cycle-finding algorithm, which is Linked List Cycle II.
 *
 * Generated from data/problems/linked-list.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.linkedlist.intersectionoftwolinkedlists;

class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        if (headA == null || headB == null) {
            return null;
        }

        ListNode a = headA;
        ListNode b = headB;

        // != on references, because the question is "the same node", not
        // "the same value". This also terminates when both reach null together,
        // which is precisely the no-intersection case.
        while (a != b) {
            // Each pointer walks A-unique + B-unique + shared. Those totals are
            // equal, so the two arrive at the meeting point on the same step.
            a = (a == null) ? headB : a.next;
            b = (b == null) ? headA : b.next;
        }

        return a;   // the shared node, or null
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
