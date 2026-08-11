/*
 * 83. Remove Duplicates from Sorted List   [Easy]
 * https://leetcode.com/problems/remove-duplicates-from-sorted-list/
 *
 * PATTERN: Linked List
 *
 * The list is sorted. Delete duplicates so that each value appears once,
 * keeping the list sorted, and return the head.
 *
 * SIGNALS THAT POINT HERE
 * - The list is sorted, so duplicates are adjacent and one comparison with the
 *   next node is enough.
 * - The first occurrence of every value survives, and the head is always a
 *   first occurrence. That is what makes the dummy unnecessary.
 * - Same walk-and-splice shape as the previous problem with a different test.
 *
 * COMPLEXITY
 *   time  O(n)   one pass, and each node is unlinked at most once
 *   space O(1)   a single reference
 *
 * COMMON MISTAKES
 * - Advancing after a splice, which fails on three or more equal values in a
 *   row such as [1,1,1].
 * - Comparing cur.val with a saved "previous value" variable instead of with
 *   cur.next.val. It works, and it is more state than the problem needs.
 * - Forgetting the cur != null half of the guard, which throws on an empty
 *   list.
 * - Using a HashSet. The list is sorted, so O(1) space is available and a set
 *   throws that away.
 *
 * FOLLOW-UPS
 * - Remove Duplicates from Sorted List II removes EVERY copy of any duplicated
 *   value. That one does need a dummy head, because the head may be a
 *   duplicate.
 * - If the list were not sorted, you would need a set and O(n) memory.
 *
 * Generated from data/problems/linked-list.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.linkedlist.removeduplicatesfromsortedlist;

class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode cur = head;

        while (cur != null && cur.next != null) {
            if (cur.next.val == cur.val) {
                cur.next = cur.next.next;   // drop the duplicate, stay put
            } else {
                cur = cur.next;             // keeper, so move on
            }
        }

        // No dummy head is needed: the head is the first occurrence of its own
        // value, so it is never the node being deleted.
        return head;
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
