/*
 * Runnable driver for 2. Add Two Numbers.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) [7, 0, 8]
 *   2) [0]
 *   3) [8, 9, 9, 9, 0, 0, 0, 1]
 */
package lct.linkedlist.addtwonumbers;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(show(s.addTwoNumbers(build(2, 4, 3), build(5, 6, 4))));
        System.out.println(show(s.addTwoNumbers(build(0), build(0))));
        System.out.println(show(s.addTwoNumbers(build(9, 9, 9, 9, 9, 9, 9), build(9, 9, 9, 9))));
    }

    /* ---- test helpers ---- */

    static ListNode build(int... vals) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        for (int v : vals) {
            tail.next = new ListNode(v);
            tail = tail.next;
        }
        return dummy.next;
    }

    /** Builds a list whose tail points back at index pos. pos < 0 means no cycle. */
    static ListNode buildCycle(int[] vals, int pos) {
        ListNode head = build(vals);
        if (head == null || pos < 0) {
            return head;
        }
        ListNode tail = head;
        while (tail.next != null) {
            tail = tail.next;
        }
        ListNode target = head;
        for (int i = 0; i < pos; i++) {
            target = target.next;
        }
        tail.next = target;
        return head;
    }

    static String show(ListNode head) {
        StringBuilder sb = new StringBuilder("[");
        for (ListNode cur = head; cur != null; cur = cur.next) {
            if (sb.length() > 1) {
                sb.append(", ");
            }
            sb.append(cur.val);
        }
        return sb.append(']').toString();
    }

    static String showNode(ListNode node) {
        return node == null ? "null" : String.valueOf(node.val);
    }
}
