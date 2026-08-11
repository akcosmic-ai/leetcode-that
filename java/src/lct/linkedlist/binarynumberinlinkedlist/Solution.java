/*
 * 1290. Convert Binary Number in a Linked List to Integer   [Easy]
 * https://leetcode.com/problems/convert-binary-number-in-a-linked-list-to-integer/
 *
 * PATTERN: Linked List
 *
 * Each node holds 0 or 1, most significant bit first. Return the number they
 * represent in base ten.
 *
 * SIGNALS THAT POINT HERE
 * - One pass, one running value, no rewiring. Not every linked-list problem is
 *   pointer surgery.
 * - The bits arrive most significant first, which is the easy direction: shift
 *   what you have and add the new bit.
 * - If you find yourself reversing the list or counting its length first, stop
 *   and reconsider.
 *
 * COMPLEXITY
 *   time  O(n)   one pass, constant work per node
 *   space O(1)   one integer. At most 30 bits, so no overflow.
 *
 * COMMON MISTAKES
 * - Counting the nodes first to find the starting power of two. It works and
 *   needs two passes and an extra variable.
 * - Reversing the list so the bits arrive least significant first. Also works,
 *   also unnecessary, and it mutates the input.
 * - Building a String of bits and calling Integer.parseInt(s, 2). Correct, and
 *   it allocates for no reason.
 * - Using value << 1 | cur.val, which is the same thing and slightly less
 *   readable for someone learning the idea.
 *
 * FOLLOW-UPS
 * - Add Two Numbers (later in this pattern) has the digits in the opposite
 *   order, which is why it can add them without reversing anything.
 * - The same accumulator shape parses any base, and value 10 + digit is how
 *   Integer.parseInt works internally.
 *
 * Generated from data/problems/linked-list.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.linkedlist.binarynumberinlinkedlist;

class Solution {
    public int getDecimalValue(ListNode head) {
        int value = 0;

        for (ListNode cur = head; cur != null; cur = cur.next) {
            // Horner's method. Doubling shifts the existing bits left one place,
            // and adding cur.val fills the slot that just opened up.
            // The same shape parses decimal: value * 10 + digit.
            value = value * 2 + cur.val;
        }

        return value;
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
