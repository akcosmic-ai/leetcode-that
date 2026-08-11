/*
 * Runnable driver for 160. Intersection of Two Linked Lists.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 8
 *   2) 2
 *   3) null
 */
package lct.linkedlist.intersectionoftwolinkedlists;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();

        ListNode shared1 = build(8, 4, 5);
        System.out.println(showNode(s.getIntersectionNode(
                concat(build(4, 1), shared1), concat(build(5, 6, 1), shared1))));

        ListNode shared2 = build(2, 4);
        System.out.println(showNode(s.getIntersectionNode(
                concat(build(1, 9, 1), shared2), concat(build(3), shared2))));

        System.out.println(showNode(s.getIntersectionNode(build(2, 6, 4), build(1, 5))));
    }

    /* ---- test helpers ---- */

    /** Attaches tail to the end of head, so both lists share real nodes. */
    static ListNode concat(ListNode head, ListNode tail) {
        if (head == null) {
            return tail;
        }
        ListNode cur = head;
        while (cur.next != null) {
            cur = cur.next;
        }
        cur.next = tail;
        return head;
    }


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
