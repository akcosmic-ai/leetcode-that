/*
 * 234. Palindrome Linked List   [Easy]
 * https://leetcode.com/problems/palindrome-linked-list/
 *
 * PATTERN: Linked List
 *
 * Decide whether the list reads the same forwards and backwards, in O(n) time
 * and O(1) extra space.
 *
 * SIGNALS THAT POINT HERE
 * - Palindrome means comparing the ends inward, and a singly linked list
 *   cannot walk backwards. So make it able to.
 * - O(1) space forbids copying the values into an array, which is the easy
 *   answer.
 * - Two techniques from earlier in this pattern combine here. Recognising that
 *   a problem is a composition of known pieces is the skill.
 *
 * COMPLEXITY
 *   time  O(n)   three linear passes: find the middle, reverse half, compare half
 *   space O(1)   a handful of references. Copying the values out would be O(n).
 *
 * COMMON MISTAKES
 * - Looping while BOTH halves are non-null in a way that overruns the
 *   odd-length case. Loop on the reversed half only.
 * - Reversing the whole list instead of half of it. Then you are comparing a
 *   list against itself node for node, which is always true.
 * - Assuming a cycle is created. It is not: reversing from slow sets slow.next
 *   to null.
 * - Not mentioning that this MUTATES the caller's list. LeetCode does not
 *   check, and in real code you would reverse the half back before returning.
 *
 * FOLLOW-UPS
 * - Restore the list before returning by reversing the second half again. Real
 *   code should; interview answers usually mention it.
 * - Reorder List (later) is the same three steps with a weave instead of a
 *   comparison.
 *
 * Generated from data/problems/linked-list.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.linkedlist.palindromelinkedlist;

class Solution {
    public boolean isPalindrome(ListNode head) {
        // Step 1: find the middle (Middle of the Linked List).
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }

        // Step 2: reverse from the middle onward (Reverse Linked List).
        // This also sets the middle node's next to null, which terminates the
        // first half cleanly, so no cycle is created.
        ListNode second = reverse(slow);

        // Step 3: walk both halves together.
        ListNode a = head;
        ListNode b = second;
        while (b != null) {   // b is the shorter or equal side, so it decides
            if (a.val != b.val) {
                return false;
            }
            a = a.next;
            b = b.next;
        }

        return true;
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
