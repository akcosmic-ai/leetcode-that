/*
 * 143. Reorder List   [Medium]
 * https://leetcode.com/problems/reorder-list/
 *
 * PATTERN: Linked List
 *
 * Rearrange the list so it alternates first node, last node, second node,
 * second last, and so on. Do it in place, without changing any node values.
 *
 * SIGNALS THAT POINT HERE
 * - You need to interleave the front with the back, and a singly linked list
 *   cannot walk backwards.
 * - In place with no value changes, so it is pure rewiring.
 * - If Palindrome Linked List is familiar, the first two steps here are
 *   identical. Only the third changes.
 *
 * COMPLEXITY
 *   time  O(n)   three linear passes: middle, reverse, weave
 *   space O(1)   a handful of references. Copying nodes into an ArrayList would be O(n).
 *
 * COMMON MISTAKES
 * - Forgetting slow.next = null, which leaves the two halves joined and the
 *   weave produces a cycle. Printing the result then never terminates.
 * - Using the SECOND-middle condition. For odd lengths the halves come out
 *   unbalanced and a node is left dangling.
 * - Overwriting first.next before saving it, which loses the rest of the first
 *   half.
 * - Looping while first != null instead of second != null, which walks off the
 *   end on odd lengths.
 * - Copying all the nodes into an ArrayList and re-linking by index. Correct,
 *   O(n) space, and much easier, which is exactly why the O(1) version is the
 *   exercise.
 *
 * FOLLOW-UPS
 * - Palindrome Linked List is steps 1 and 2 with a comparison instead of a
 *   weave. Writing both back to back makes the shared recipe obvious.
 * - Odd Even Linked List is a different split of the same weaving idea.
 *
 * Generated from data/problems/linked-list.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.linkedlist.reorderlist;

class Solution {
    public void reorderList(ListNode head) {
        if (head == null || head.next == null) {
            return;
        }

        // Step 1: find the FIRST middle. Note the condition: it differs from
        // Middle of the Linked List, which deliberately lands on the SECOND
        // middle. Here an odd-length list must leave the extra node on the left.
        ListNode slow = head;
        ListNode fast = head;
        while (fast.next != null && fast.next.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }

        // Step 2: cut, then reverse the second half. The cut is essential:
        // without it the weave below closes a cycle.
        ListNode second = slow.next;
        slow.next = null;
        second = reverse(second);

        // Step 3: weave. Save BOTH next pointers before rewiring either.
        ListNode first = head;
        while (second != null) {
            ListNode nextFirst = first.next;
            ListNode nextSecond = second.next;

            first.next = second;
            second.next = nextFirst;

            first = nextFirst;
            second = nextSecond;
        }
    }

    private ListNode reverse(ListNode node) {
        ListNode prev = null;
        while (node != null) {
            ListNode next = node.next;
            node.next = prev;
            prev = node;
            node = next;
        }
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
