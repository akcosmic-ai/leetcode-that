/*
 * 21. Merge Two Sorted Lists   [Easy]
 * https://leetcode.com/problems/merge-two-sorted-lists/
 *
 * PATTERN: Linked List
 *
 * Two sorted lists are given. Splice their nodes together into one sorted list
 * and return its head. Reuse the existing nodes.
 *
 * SIGNALS THAT POINT HERE
 * - Two sorted inputs to combine, so one pointer per input.
 * - You are building a list and do not know which node will end up first. That
 *   is precisely what a dummy head is for.
 * - The tail can be attached wholesale once one list runs out, because
 *   whatever is left is already sorted.
 *
 * COMPLEXITY
 *   time  O(n + m)   each node is visited and spliced at most once
 *   space O(1)   one dummy node and two references. No nodes are copied.
 *
 * COMMON MISTAKES
 * - Returning dummy instead of dummy.next, which prefixes a stray 0.
 * - Forgetting the leftover line, which silently truncates the longer list.
 * - Allocating new nodes with new ListNode(value) for each step. It works, and
 *   the problem asks you to splice the existing nodes.
 * - Handling the empty cases with special branches at the top. The dummy plus
 *   the leftover line already covers them.
 *
 * FOLLOW-UPS
 * - Merge k Sorted Lists (the Hard problem in this pattern) heaps the heads
 *   instead of comparing two.
 * - This is the merge step of merge sort, which is how Sort List (LeetCode
 *   148) works.
 *
 * Generated from data/problems/linked-list.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.linkedlist.mergetwosortedlists;

class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // One throwaway node so that appending the FIRST result node looks
        // exactly like appending any other.
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;

        while (list1 != null && list2 != null) {
            // <= rather than < keeps equal values in their original order,
            // which makes the merge stable.
            if (list1.val <= list2.val) {
                tail.next = list1;
                list1 = list1.next;
            } else {
                tail.next = list2;
                list2 = list2.next;
            }
            tail = tail.next;
        }

        // Whatever remains is already sorted and already linked, so one line
        // finishes the job. No second loop.
        tail.next = (list1 != null) ? list1 : list2;

        return dummy.next;   // NOT dummy, and NOT the original head
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
