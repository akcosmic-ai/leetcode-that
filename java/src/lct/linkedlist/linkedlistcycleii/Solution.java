/*
 * 142. Linked List Cycle II   [Medium]
 * https://leetcode.com/problems/linked-list-cycle-ii/
 *
 * PATTERN: Linked List
 *
 * If the list contains a cycle, return the node where the cycle begins.
 * Otherwise return null. Use O(1) memory.
 *
 * SIGNALS THAT POINT HERE
 * - Cycle detection you already know, now asking WHERE.
 * - O(1) memory again rules out a visited set, which would make this trivial.
 * - The second phase looks like magic until you write out the distances. It is
 *   worth doing that once.
 *
 * COMPLEXITY
 *   time  O(n)   phase 1 is at most n steps for each pointer, and phase 2 is at most n more
 *   space O(1)   three references
 *
 * COMMON MISTAKES
 * - Keeping the 2x speed in phase two. Both pointers must move one step at a
 *   time there.
 * - Restarting fast at the head instead of leaving one pointer at the meeting
 *   point. Only one moves back.
 * - Returning the MEETING node rather than the entry. They coincide only when
 *   the cycle happens to start at the head.
 * - Running phase two even when there is no cycle. It belongs inside the slow
 *   == fast branch.
 * - A HashSet of visited nodes. Trivially correct, O(n) memory, and it fails
 *   the stated constraint.
 *
 * FOLLOW-UPS
 * - Find the Duplicate Number applies this exact algorithm to an array treated
 *   as a linked list, which is genuinely surprising the first time.
 * - The cycle LENGTH is a third phase: keep one pointer still at the meeting
 *   point and walk the other until it comes back.
 *
 * Generated from data/problems/linked-list.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.linkedlist.linkedlistcycleii;

class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;

        // Phase 1: exactly Linked List Cycle.
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;

            if (slow == fast) {
                // Phase 2. With a = head-to-entry, b = entry-to-meeting and
                // c = meeting-back-to-entry, "fast went twice as far" gives
                // a + b = k(b + c), so a = c plus some whole laps. Laps do not
                // change where you land inside a cycle, so walking a steps from
                // the head and a steps from the meeting point both arrive at
                // the entry.
                ListNode probe = head;
                while (probe != slow) {
                    probe = probe.next;   // ONE step each here, not two
                    slow = slow.next;
                }
                return probe;
            }
        }

        // fast ran off the end: no cycle.
        return null;
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
