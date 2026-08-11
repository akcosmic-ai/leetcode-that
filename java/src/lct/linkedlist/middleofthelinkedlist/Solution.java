/*
 * 876. Middle of the Linked List   [Easy]
 * https://leetcode.com/problems/middle-of-the-linked-list/
 *
 * PATTERN: Linked List
 *
 * Return the middle node. If the list has an even number of nodes, return the
 * second of the two middle ones.
 *
 * SIGNALS THAT POINT HERE
 * - You need the middle without knowing the length, and you want one pass.
 * - Same two pointers as cycle detection. Recognising that one mechanism
 *   serves two purposes is the point of putting these problems next to each
 *   other.
 * - Which middle node you get for an even length is decided entirely by the
 *   loop condition, so read the problem statement carefully.
 *
 * COMPLEXITY
 *   time  O(n)   one pass; fast does n/2 iterations
 *   space O(1)   two references
 *
 * COMMON MISTAKES
 * - Using the condition that lands on the FIRST middle, which returns
 *   [3,4,5,6] for the six-node case.
 * - Counting the nodes and then walking length / 2. Correct, two passes, and
 *   it misses the point of the exercise.
 * - Returning slow.val instead of slow. The problem asks for the node, and
 *   printing it shows the rest of the list too.
 * - Forgetting that fast != null must be tested before fast.next.
 *
 * FOLLOW-UPS
 * - Palindrome Linked List and Reorder List both start by finding the middle,
 *   and they want the FIRST middle. Note the different condition.
 * - A gap of k instead of a factor of two gives you "k-th node from the end",
 *   which is Remove Nth Node From End.
 *
 * Generated from data/problems/linked-list.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.linkedlist.middleofthelinkedlist;

class Solution {
    public ListNode middleNode(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;

        // This condition lands slow on the SECOND middle node for even lengths,
        // which is what this problem asks for. Using
        //   while (fast.next != null && fast.next.next != null)
        // would land on the FIRST middle instead, which is what Reorder List needs.
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }

        return slow;
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
