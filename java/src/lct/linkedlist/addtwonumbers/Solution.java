/*
 * 2. Add Two Numbers   [Medium]
 * https://leetcode.com/problems/add-two-numbers/
 *
 * PATTERN: Linked List
 *
 * Two non-negative numbers are stored one digit per node, least significant
 * digit first. Add them and return the sum in the same form.
 *
 * SIGNALS THAT POINT HERE
 * - Two lists walked together while building a third. Dummy head, and a tail
 *   pointer.
 * - The digits are stored least significant first, which is the order you add
 *   by hand. No reversing needed.
 * - The lists can differ in length and the carry can outlive both, so the loop
 *   condition needs all three parts.
 *
 * COMPLEXITY
 *   time  O(max(m, n))   one pass over the longer list, plus at most one extra node for a final carry
 *   space O(max(m, n))   the result list, which the problem requires. No other allocation.
 *
 * COMMON MISTAKES
 * - Leaving carry != 0 out of the loop condition, so [9,9,9] plus [1] loses
 *   the leading 1.
 * - Stopping when EITHER list ends rather than when both do, which truncates
 *   the longer number.
 * - Converting each list to an int or long, adding, then rebuilding. With up
 *   to 100 digits that overflows every primitive type.
 * - Handling the carry with an if after the loop. It works, and folding it
 *   into the condition is one fewer place to be wrong.
 *
 * FOLLOW-UPS
 * - Add Two Numbers II stores the digits most significant first, which needs a
 *   reverse, a stack, or recursion.
 * - Multiply Strings is the same carry bookkeeping with a second dimension.
 *
 * Generated from data/problems/linked-list.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.linkedlist.addtwonumbers;

class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        int carry = 0;

        // All three conditions are required. The lists may differ in length, and
        // 999 + 1 still has a carry after both have run out.
        while (l1 != null || l2 != null || carry != 0) {
            int sum = carry;

            if (l1 != null) {
                sum += l1.val;
                l1 = l1.next;
            }
            if (l2 != null) {
                sum += l2.val;
                l2 = l2.next;
            }

            // Digits are at most 9 each, so sum is at most 19 and carry is 0 or 1.
            carry = sum / 10;

            tail.next = new ListNode(sum % 10);
            tail = tail.next;
        }

        return dummy.next;
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
