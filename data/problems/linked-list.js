/* data/problems/linked-list.js
 *
 * Problems for the "linked-list" pattern. Schema: data/problems/_SCHEMA.md
 *
 * Target mix: 9 Easy, 4 Medium, 1 Hard.
 * Sequenced around the three moves that cover almost every linked-list problem:
 * three-pointer reverse, dummy head, and fast/slow. Everything after that is a
 * combination of those three.
 *
 * Wrapped in an IIFE so the shared ListNode and driver-helper strings do not
 * leak onto window. Every javaSolution ships its own ListNode so that each
 * generated file under java/src compiles and runs on its own.
 */
(function () {
  'use strict';

  var LISTNODE = `
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
`;

  var HELPERS = `
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
`;

  /** Builds a complete `public class Main` around the given main() body. */
  function driver(body) {
    return 'public class Main {\n    public static void main(String[] args) {\n' +
           body + '    }\n' + HELPERS + '}';
  }

  window.LC_PROBLEMS = window.LC_PROBLEMS || [];
  window.LC_PROBLEMS.push(

{
  id: 'reverse-linked-list',
  leetcodeNumber: 206,
  title: 'Reverse Linked List',
  url: 'https://leetcode.com/problems/reverse-linked-list/',
  pattern: 'linked-list',
  difficulty: 'Easy',
  order: 1,
  tags: ['three-pointer', 'in-place', 'rewiring'],
  problemSummary: 'Reverse a singly linked list and return the new head. Do it by rewiring the existing nodes, not by building a new list.',
  examples: [
    { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', note: 'Same five nodes, arrows flipped.' },
    { input: 'head = [1,2]', output: '[2,1]', note: 'Two nodes.' },
    { input: 'head = []', output: '[]', note: 'An empty list reverses to an empty list.' }
  ],
  constraints: ['The number of nodes is in the range [0, 5000]', '-5000 <= Node.val <= 5000'],
  techniqueNote: 'the three-pointer walk. `prev` trails, `curr` walks, and `next` is the lifeline you save before destroying the link you are standing on.',
  signals: [
    'The input is a `ListNode`. That is most of the signal in this whole pattern.',
    'Reverse, in place, O(1) extra space. No array copy.',
    'This is the single most reused subroutine in linked lists. Palindrome Linked List and Reorder List both call it.'
  ],
  intuition: {
    input: 'head = [1,2,3]',
    visual:
      'start        null    1 -> 2 -> 3 -> null\n' +
      '             prev   curr\n' +
      '\n' +
      'save next=2, flip 1 -> null, advance both:\n' +
      '             null <- 1     2 -> 3 -> null\n' +
      '                    prev  curr\n' +
      '\n' +
      'save next=3, flip 2 -> 1, advance both:\n' +
      '             null <- 1 <- 2     3 -> null\n' +
      '                         prev  curr\n' +
      '\n' +
      'save next=null, flip 3 -> 2, advance both:\n' +
      '             null <- 1 <- 2 <- 3     null\n' +
      '                              prev  curr\n' +
      '\n' +
      'curr is null, so prev is the new head',
    steps: [
      { state: 'prev = null, curr = head', say: '`prev` starts as `null` because the old head becomes the new tail, and a tail points at nothing.' },
      { state: 'next = curr.next', say: 'Save `curr.next` FIRST. The very next line overwrites it, and without the save the rest of the list is unreachable and gone.' },
      { state: 'curr.next = prev', say: 'Flip the arrow backwards. This one node is now correctly wired.' },
      { state: 'prev = curr; curr = next', say: 'Shuffle both pointers one step forward. The order matters: `prev = curr` before `curr = next`.' },
      { state: 'curr == null', say: 'When `curr` runs off the end, `prev` is sitting on the last node processed, which is the new head. Return `prev`, not `curr`, and not `head`.' },
      { state: '', say: 'Draw this once on paper with three boxes. Almost every bug in this pattern is doing these four assignments in the wrong order.' }
    ],
    takeaway: 'Save, flip, advance, advance. Four lines in that order, and returning `prev` rather than `head`, which now points at nothing.'
  },
  hints: [
    'Take the first node. In the reversed list, what should its `next` be? What do you need to have kept hold of before you overwrite it?',
    'Three references: `prev` (initially null), `curr` (initially head), and a temporary `next`. Each iteration: save next, point curr back at prev, then move prev and curr forward.',
    'Pseudo-code: `prev = null; curr = head; while curr != null: next = curr.next; curr.next = prev; prev = curr; curr = next; return prev`'
  ],
  methodSignature: 'public ListNode reverseList(ListNode head)',
  starterExtras: LISTNODE,
  javaTemplate: 'linked-list-reverse',
  javaSolution: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;   // the old head becomes the new tail
        ListNode curr = head;

        while (curr != null) {
            // Save it BEFORE the next line destroys it. Without this, the rest
            // of the list becomes unreachable.
            ListNode next = curr.next;

            curr.next = prev;   // flip the arrow

            prev = curr;        // shuffle both forward, in this order
            curr = next;
        }

        // curr is null, so prev is the last node we touched: the new head.
        return prev;
    }
}
` + LISTNODE,
  complexity: {
    time: 'O(n)', timeWhy: 'one pass, constant work per node',
    space: 'O(1)', spaceWhy: 'three references. The recursive version is O(n) stack.'
  },
  testCases: [
    { input: { head: [1, 2, 3, 4, 5] }, expected: '[5, 4, 3, 2, 1]' },
    { input: { head: [1, 2] }, expected: '[2, 1]' },
    { input: { head: [] }, expected: '[]' }
  ],
  judgeDriver: driver(
`        Solution s = new Solution();
        System.out.println(show(s.reverseList(build(1, 2, 3, 4, 5))));
        System.out.println(show(s.reverseList(build(1, 2))));
        System.out.println(show(s.reverseList(build())));
`),
  commonMistakes: [
    'Writing `curr.next = prev` before saving `curr.next`. The remainder of the list is lost and you return a one-node list.',
    'Returning `head` instead of `prev`. `head` is now the tail and its `next` is null, so you return a single node.',
    'Advancing as `curr = next; prev = curr;` which sets `prev` to the wrong node.',
    'Initialising `prev = head`, which builds a two-node cycle immediately.'
  ],
  followUps: [
    'The recursive version is four lines and costs O(n) stack. Worth writing once to see it, and the iterative one is what you want in an interview.',
    'Reverse Linked List II reverses only positions `left` to `right`, which is this loop plus careful stitching at both boundaries.',
    'Reorder List and Palindrome Linked List both call this as a subroutine.'
  ]
},

{
  id: 'merge-two-sorted-lists',
  leetcodeNumber: 21,
  title: 'Merge Two Sorted Lists',
  url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
  pattern: 'linked-list',
  difficulty: 'Easy',
  order: 2,
  tags: ['dummy-head', 'two-lists', 'merge'],
  problemSummary: 'Two sorted lists are given. Splice their nodes together into one sorted list and return its head. Reuse the existing nodes.',
  examples: [
    { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]', note: 'Interleaved by value.' },
    { input: 'list1 = [], list2 = []', output: '[]', note: 'Both empty.' },
    { input: 'list1 = [], list2 = [0]', output: '[0]', note: 'One side empty.' }
  ],
  constraints: ['The number of nodes in both lists is in the range [0, 50]', '-100 <= Node.val <= 100', 'Both lists are sorted in non-decreasing order'],
  techniqueNote: 'the **dummy head**. Allocating one throwaway node in front means there is no "what if this is the first node" special case anywhere.',
  signals: [
    'Two sorted inputs to combine, so one pointer per input.',
    'You are building a list and do not know which node will end up first. That is precisely what a dummy head is for.',
    'The tail can be attached wholesale once one list runs out, because whatever is left is already sorted.'
  ],
  intuition: {
    input: 'list1 = [1,2,4], list2 = [1,3,4]',
    visual:
      'dummy -> ?                l1: 1 2 4      l2: 1 3 4\n' +
      '\n' +
      '1 <= 1, take from l1      dummy -> 1     l1: 2 4    l2: 1 3 4\n' +
      '2 >  1, take from l2      dummy -> 1 1   l1: 2 4    l2: 3 4\n' +
      '2 <= 3, take from l1      ... 1 1 2      l1: 4      l2: 3 4\n' +
      '4 >  3, take from l2      ... 1 1 2 3    l1: 4      l2: 4\n' +
      '4 <= 4, take from l1      ... 1 1 2 3 4  l1: -      l2: 4\n' +
      '\n' +
      'l1 is exhausted, so attach the WHOLE remainder of l2 in one line\n' +
      'return dummy.next, not dummy',
    steps: [
      { state: 'dummy created', say: 'Without a dummy, the first node needs its own branch: "is the result still empty? then this becomes the head". The dummy makes every step identical.' },
      { state: 'tail = dummy', say: 'Keep a `tail` pointer at the end of what you have built so far. Appending is `tail.next = node; tail = tail.next`.' },
      { state: 'take the smaller head', say: 'Compare the two heads and splice the smaller one on. Use `<=` rather than `<` so that equal values keep their original relative order, which makes the merge stable.' },
      { state: 'one list empties', say: 'When either list runs out, the other is already sorted and already linked together. Attach it in one line: `tail.next = (l1 != null) ? l1 : l2`. No loop needed.' },
      { state: 'return dummy.next', say: 'Return `dummy.next`. Returning `dummy` gives an extra leading node, and returning the original `head` is wrong because it may not be first any more.' }
    ],
    takeaway: 'A dummy head costs one node and deletes an entire class of special case. Use one whenever the head of the result is not known in advance.'
  },
  hints: [
    'You are building a new chain. What is awkward about the very first node, and how could you make it not be first?',
    'Create a dummy node, keep a `tail` pointer, and repeatedly splice on whichever list has the smaller head. When one list empties, attach the other wholesale.',
    'Pseudo-code: `dummy = new node; tail = dummy; while both non-null: attach smaller, advance it, advance tail; tail.next = leftover; return dummy.next`'
  ],
  methodSignature: 'public ListNode mergeTwoLists(ListNode list1, ListNode list2)',
  starterExtras: LISTNODE,
  javaTemplate: 'linked-list-reverse',
  javaSolution: `class Solution {
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
` + LISTNODE,
  complexity: {
    time: 'O(n + m)', timeWhy: 'each node is visited and spliced at most once',
    space: 'O(1)', spaceWhy: 'one dummy node and two references. No nodes are copied.'
  },
  testCases: [
    { input: { list1: [1, 2, 4], list2: [1, 3, 4] }, expected: '[1, 1, 2, 3, 4, 4]' },
    { input: { list1: [], list2: [] }, expected: '[]' },
    { input: { list1: [], list2: [0] }, expected: '[0]' }
  ],
  judgeDriver: driver(
`        Solution s = new Solution();
        System.out.println(show(s.mergeTwoLists(build(1, 2, 4), build(1, 3, 4))));
        System.out.println(show(s.mergeTwoLists(build(), build())));
        System.out.println(show(s.mergeTwoLists(build(), build(0))));
`),
  commonMistakes: [
    'Returning `dummy` instead of `dummy.next`, which prefixes a stray 0.',
    'Forgetting the leftover line, which silently truncates the longer list.',
    'Allocating new nodes with `new ListNode(value)` for each step. It works, and the problem asks you to splice the existing nodes.',
    'Handling the empty cases with special branches at the top. The dummy plus the leftover line already covers them.'
  ],
  followUps: [
    'Merge k Sorted Lists (the Hard problem in this pattern) heaps the heads instead of comparing two.',
    'This is the merge step of merge sort, which is how Sort List (LeetCode 148) works.'
  ]
},

{
  id: 'linked-list-cycle',
  leetcodeNumber: 141,
  title: 'Linked List Cycle',
  url: 'https://leetcode.com/problems/linked-list-cycle/',
  pattern: 'linked-list',
  difficulty: 'Easy',
  order: 3,
  tags: ['fast-slow', 'floyd', 'cycle'],
  problemSummary: 'Decide whether the list loops back on itself. It does if following `next` repeatedly can revisit a node.',
  examples: [
    { input: 'head = [3,2,0,-4], tail connects to index 1', output: 'true', note: 'The last node points back at the 2.' },
    { input: 'head = [1,2], tail connects to index 0', output: 'true', note: 'A two-node loop.' },
    { input: 'head = [1], no cycle', output: 'false', note: 'A single node pointing at null.' }
  ],
  constraints: ['The number of nodes is in the range [0, 10^4]', '-10^5 <= Node.val <= 10^5', 'pos is -1 or a valid index'],
  techniqueNote: 'Floyd\'s tortoise and hare. Two pointers at different speeds on a loop must eventually collide, and that costs O(1) memory.',
  signals: [
    '**Cycle**, **loop**, or "does it ever end". Fast and slow pointers.',
    'A `HashSet` of visited nodes also works and costs O(n) memory. The fast/slow version is O(1), and that is the reason this problem is famous.',
    'The same fast/slow machinery finds the middle of a list, so learning it pays twice.'
  ],
  intuition: {
    input: 'head = [3,2,0,-4] with the tail pointing back at the 2',
    visual:
      '    3 -> 2 -> 0 -> -4\n' +
      '         ^          |\n' +
      '         +----------+\n' +
      '\n' +
      'step   slow   fast\n' +
      '0      3      3\n' +
      '1      2      0\n' +
      '2      0      2      (fast wrapped around)\n' +
      '3      -4     -4     MET  ->  cycle\n' +
      '\n' +
      'on a straight list, fast simply runs off the end and finds null',
    steps: [
      { state: 'slow = fast = head', say: 'Move `slow` one node per step and `fast` two.' },
      { state: '', say: 'If the list ends, `fast` reaches `null` first and you are done: no cycle.' },
      { state: '', say: 'If there is a loop, both pointers end up inside it and `fast` gains exactly one position on `slow` every step. A gap that shrinks by one each time inside a finite loop must reach zero, so they must meet. It cannot skip past, precisely because the gap changes by one.' },
      { state: 'slow == fast', say: 'A meeting is proof of a cycle. Compare with `==`, which is reference identity: two different nodes can hold the same value.' },
      { state: '', say: 'Guard order matters: `while (fast != null && fast.next != null)`. Testing `fast.next` first would throw when `fast` is already null.' }
    ],
    takeaway: 'Two speeds on a loop must collide because the gap changes by exactly one per step. That is the whole proof, and it is why no memory is needed.'
  },
  hints: [
    'The obvious answer keeps a set of nodes you have already seen. That is O(n) memory. Can two pointers moving at different speeds tell you the same thing?',
    'Move one pointer one step and another two steps per iteration. If they ever land on the same node there is a cycle; if the fast one falls off the end there is not.',
    'Pseudo-code: `slow = fast = head; while fast != null and fast.next != null: slow = slow.next; fast = fast.next.next; if slow == fast return true; return false`'
  ],
  methodSignature: 'public boolean hasCycle(ListNode head)',
  starterExtras: LISTNODE,
  javaTemplate: 'linked-list-reverse',
  javaSolution: `class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;

        // Order matters: checking fast.next first would throw when fast is null.
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;

            // Reference identity, not value equality. Two distinct nodes can
            // hold the same number.
            if (slow == fast) {
                return true;
            }
        }

        // fast ran off the end, so the list terminates.
        return false;
    }
}
` + LISTNODE,
  complexity: {
    time: 'O(n)', timeWhy: 'without a cycle, fast reaches the end in n/2 steps. With one, they meet within a further n steps.',
    space: 'O(1)', spaceWhy: 'two references. The HashSet version is O(n).'
  },
  testCases: [
    { input: 'head = [3,2,0,-4], pos = 1', expected: 'true' },
    { input: 'head = [1,2], pos = 0', expected: 'true' },
    { input: 'head = [1], pos = -1', expected: 'false' }
  ],
  judgeDriver: driver(
`        Solution s = new Solution();
        System.out.println(s.hasCycle(buildCycle(new int[]{3, 2, 0, -4}, 1)));
        System.out.println(s.hasCycle(buildCycle(new int[]{1, 2}, 0)));
        System.out.println(s.hasCycle(buildCycle(new int[]{1}, -1)));
`),
  commonMistakes: [
    'Writing the guard as `while (fast.next != null && fast != null)`, which throws a NullPointerException on an empty or single-node list.',
    'Comparing `slow.val == fast.val`. Values repeat; node identity does not.',
    'Advancing `fast` by one and `slow` by one, which never closes any gap.',
    'Counting iterations and declaring a cycle after some threshold. It works on the test data and is not an algorithm.'
  ],
  followUps: [
    'Linked List Cycle II (later in this pattern) finds where the loop begins, which needs one more insight on top of this.',
    'Happy Number is this same cycle detection on a sequence of numbers rather than nodes.'
  ]
},

{
  id: 'middle-of-the-linked-list',
  leetcodeNumber: 876,
  title: 'Middle of the Linked List',
  url: 'https://leetcode.com/problems/middle-of-the-linked-list/',
  pattern: 'linked-list',
  difficulty: 'Easy',
  order: 4,
  tags: ['fast-slow', 'one-pass'],
  problemSummary: 'Return the middle node. If the list has an even number of nodes, return the second of the two middle ones.',
  examples: [
    { input: 'head = [1,2,3,4,5]', output: '[3,4,5]', note: 'The node holding 3, and everything after it.' },
    { input: 'head = [1,2,3,4,5,6]', output: '[4,5,6]', note: 'Even length, so the SECOND middle node.' }
  ],
  constraints: ['The number of nodes is in the range [1, 100]', '1 <= Node.val <= 100'],
  techniqueNote: 'the same fast/slow pair, used for its other purpose: when `fast` has gone twice as far, `slow` is halfway.',
  signals: [
    'You need the middle without knowing the length, and you want one pass.',
    'Same two pointers as cycle detection. Recognising that one mechanism serves two purposes is the point of putting these problems next to each other.',
    'Which middle node you get for an even length is decided entirely by the loop condition, so read the problem statement carefully.'
  ],
  intuition: {
    input: 'head = [1,2,3,4,5,6]',
    visual:
      'slow moves 1, fast moves 2, so when fast finishes slow is halfway\n' +
      '\n' +
      'step   slow   fast\n' +
      '0      1      1\n' +
      '1      2      3\n' +
      '2      3      5\n' +
      '3      4      null    <- fast fell off, slow is at 4\n' +
      '\n' +
      'even length 6, and the answer is the SECOND middle, node 4. Correct.',
    steps: [
      { state: 'slow = fast = head', say: 'The naive approach counts the nodes, then walks half of them. Two passes, and it works.' },
      { state: '', say: 'One pass instead: `fast` covers ground twice as quickly, so when it reaches the end `slow` has covered exactly half.' },
      { state: 'slow = 4, fast = null', say: 'With `while (fast != null && fast.next != null)`, an even-length list leaves `slow` on the SECOND middle node, which is what this problem asks for.' },
      { state: '', say: 'If you wanted the FIRST middle instead, the condition becomes `while (fast.next != null && fast.next.next != null)`. Reorder List needs that version, and this one does not. One character of difference, entirely different answer.' }
    ],
    takeaway: 'The loop condition decides which middle you land on. Decide which one the problem wants before writing the `while`.'
  },
  hints: [
    'You do not know the length. Counting first works and takes two passes. Can two pointers moving at different speeds do it in one?',
    'Advance `slow` one node and `fast` two per step. When `fast` cannot advance any further, `slow` is at the middle.',
    'Pseudo-code: `slow = fast = head; while fast != null and fast.next != null: slow = slow.next; fast = fast.next.next; return slow`'
  ],
  methodSignature: 'public ListNode middleNode(ListNode head)',
  starterExtras: LISTNODE,
  javaTemplate: 'linked-list-reverse',
  javaSolution: `class Solution {
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
` + LISTNODE,
  complexity: {
    time: 'O(n)', timeWhy: 'one pass; fast does n/2 iterations',
    space: 'O(1)', spaceWhy: 'two references'
  },
  testCases: [
    { input: { head: [1, 2, 3, 4, 5] }, expected: '[3, 4, 5]' },
    { input: { head: [1, 2, 3, 4, 5, 6] }, expected: '[4, 5, 6]' },
    { input: { head: [1] }, expected: '[1]' }
  ],
  judgeDriver: driver(
`        Solution s = new Solution();
        System.out.println(show(s.middleNode(build(1, 2, 3, 4, 5))));
        System.out.println(show(s.middleNode(build(1, 2, 3, 4, 5, 6))));
        System.out.println(show(s.middleNode(build(1))));
`),
  commonMistakes: [
    'Using the condition that lands on the FIRST middle, which returns `[3,4,5,6]` for the six-node case.',
    'Counting the nodes and then walking `length / 2`. Correct, two passes, and it misses the point of the exercise.',
    'Returning `slow.val` instead of `slow`. The problem asks for the node, and printing it shows the rest of the list too.',
    'Forgetting that `fast != null` must be tested before `fast.next`.'
  ],
  followUps: [
    'Palindrome Linked List and Reorder List both start by finding the middle, and they want the FIRST middle. Note the different condition.',
    'A gap of k instead of a factor of two gives you "k-th node from the end", which is Remove Nth Node From End.'
  ]
},

{
  id: 'remove-linked-list-elements',
  leetcodeNumber: 203,
  title: 'Remove Linked List Elements',
  url: 'https://leetcode.com/problems/remove-linked-list-elements/',
  pattern: 'linked-list',
  difficulty: 'Easy',
  order: 5,
  tags: ['dummy-head', 'deletion'],
  problemSummary: 'Delete every node whose value equals `val` and return the head of the result.',
  examples: [
    { input: 'head = [1,2,6,3,4,5,6], val = 6', output: '[1,2,3,4,5]', note: 'Both 6s go.' },
    { input: 'head = [], val = 1', output: '[]', note: 'Nothing to do.' },
    { input: 'head = [7,7,7,7], val = 7', output: '[]', note: 'Everything goes, including the head, several times over.' }
  ],
  constraints: ['The number of nodes is in the range [0, 10^4]', '1 <= Node.val <= 50', '0 <= val <= 50'],
  techniqueNote: 'the dummy head again, and this is the case that proves why it is worth it: the node to delete can be the head, repeatedly.',
  signals: [
    'Deletion from a linked list, where the head itself might be deleted.',
    'To unlink a node you need the one BEFORE it, so you always walk with a `prev` pointer.',
    '`[7,7,7,7]` deleting 7 is the case that breaks every solution which special-cases the head just once.'
  ],
  intuition: {
    input: 'head = [7,7,7,7], val = 7',
    visual:
      'dummy -> 7 -> 7 -> 7 -> 7 -> null\n' +
      'prev\n' +
      '\n' +
      'prev.next is 7, so skip it:   dummy -> 7 -> 7 -> 7\n' +
      'prev.next is 7, skip:         dummy -> 7 -> 7\n' +
      'prev.next is 7, skip:         dummy -> 7\n' +
      'prev.next is 7, skip:         dummy -> null\n' +
      '\n' +
      'return dummy.next, which is null. Correct, and no head special case anywhere.',
    steps: [
      { state: '', say: 'To delete a node you must change the `next` of the node before it. The head has no node before it, which is the whole difficulty.' },
      { state: 'dummy -> head', say: 'So invent one. A dummy in front means every real node, head included, has a predecessor.' },
      { state: 'prev.next matches', say: 'Walk with `prev`. When `prev.next` should go, splice it out with `prev.next = prev.next.next`, and do NOT advance `prev`.' },
      { state: '', say: 'Not advancing is essential. After removing one node, the new `prev.next` has not been examined yet, and on `[7,7,7,7]` it also needs removing.' },
      { state: 'prev.next does not match', say: 'Only advance `prev` when you keep a node.' },
      { state: 'return dummy.next', say: 'Return `dummy.next`, which correctly gives `null` when everything was deleted.' }
    ],
    takeaway: 'Advance the cursor only when you KEEP a node. Advancing after a deletion skips the replacement, and consecutive matches are what expose it.'
  },
  hints: [
    'To unlink a node, whose `next` do you have to change? What happens when the node you want gone is the very first one?',
    'Put a dummy node in front of the head and walk a `prev` pointer. When `prev.next` matches, skip it and do not move `prev`.',
    'Pseudo-code: `dummy.next = head; prev = dummy; while prev.next != null: if prev.next.val == val: prev.next = prev.next.next else: prev = prev.next; return dummy.next`'
  ],
  methodSignature: 'public ListNode removeElements(ListNode head, int val)',
  starterExtras: LISTNODE,
  javaTemplate: 'linked-list-reverse',
  javaSolution: `class Solution {
    public ListNode removeElements(ListNode head, int val) {
        // A dummy in front gives the real head a predecessor, so deleting the
        // head needs no special case even when it happens several times.
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        ListNode prev = dummy;

        while (prev.next != null) {
            if (prev.next.val == val) {
                prev.next = prev.next.next;   // splice it out
                // prev deliberately does NOT advance: the node that just became
                // prev.next has not been checked yet.
            } else {
                prev = prev.next;             // advance only when we keep one
            }
        }

        return dummy.next;   // null when everything was removed
    }
}
` + LISTNODE,
  complexity: {
    time: 'O(n)', timeWhy: 'each node is examined once and unlinked at most once',
    space: 'O(1)', spaceWhy: 'one dummy and one reference'
  },
  testCases: [
    { input: { head: [1, 2, 6, 3, 4, 5, 6], val: 6 }, expected: '[1, 2, 3, 4, 5]' },
    { input: { head: [], val: 1 }, expected: '[]' },
    { input: { head: [7, 7, 7, 7], val: 7 }, expected: '[]' }
  ],
  judgeDriver: driver(
`        Solution s = new Solution();
        System.out.println(show(s.removeElements(build(1, 2, 6, 3, 4, 5, 6), 6)));
        System.out.println(show(s.removeElements(build(), 1)));
        System.out.println(show(s.removeElements(build(7, 7, 7, 7), 7)));
`),
  commonMistakes: [
    'Advancing `prev` after a deletion, which skips consecutive matches. `[7,7,7,7]` returns `[7,7]`.',
    'Handling the head with a single `if (head.val == val) head = head.next;` before the loop, which only strips one leading match.',
    'Returning `head` rather than `dummy.next`. The original head may itself have been deleted.',
    'Reading `prev.next.next` without first knowing `prev.next` is non-null. The loop condition guarantees it; reordering the checks does not.'
  ],
  followUps: [
    'Remove Duplicates from Sorted List (next) is the same walk with a neighbour comparison instead of a value test.',
    'Remove Duplicates from Sorted List II deletes every copy of any duplicated value, and that one genuinely needs the dummy plus a lookahead.'
  ]
},

{
  id: 'remove-duplicates-from-sorted-list',
  leetcodeNumber: 83,
  title: 'Remove Duplicates from Sorted List',
  url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-list/',
  pattern: 'linked-list',
  difficulty: 'Easy',
  order: 6,
  tags: ['deletion', 'sorted', 'neighbour-compare'],
  problemSummary: 'The list is sorted. Delete duplicates so that each value appears once, keeping the list sorted, and return the head.',
  examples: [
    { input: 'head = [1,1,2]', output: '[1,2]', note: 'One of the 1s goes.' },
    { input: 'head = [1,1,2,3,3]', output: '[1,2,3]', note: 'One 1 and one 3 go.' },
    { input: 'head = []', output: '[]', note: 'Nothing to do.' }
  ],
  constraints: ['The number of nodes is in the range [0, 300]', '-100 <= Node.val <= 100', 'The list is sorted in non-decreasing order'],
  techniqueNote: 'no dummy needed here, and it is worth understanding why: the head is always kept, so it never needs a predecessor.',
  signals: [
    'The list is **sorted**, so duplicates are adjacent and one comparison with the next node is enough.',
    'The first occurrence of every value survives, and the head is always a first occurrence. That is what makes the dummy unnecessary.',
    'Same walk-and-splice shape as the previous problem with a different test.'
  ],
  intuition: {
    input: 'head = [1,1,2,3,3]',
    visual:
      'cur\n' +
      ' 1 -> 1 -> 2 -> 3 -> 3      cur.next.val == cur.val, splice\n' +
      ' 1 -> 2 -> 3 -> 3           now differs, so advance cur\n' +
      '      cur\n' +
      ' 1 -> 2 -> 3 -> 3           differs, advance\n' +
      '           cur\n' +
      ' 1 -> 2 -> 3 -> 3           equal, splice\n' +
      ' 1 -> 2 -> 3                cur.next is null, stop',
    steps: [
      { state: '', say: 'Because the list is sorted, every group of equal values is contiguous. So comparing a node with the one after it is all the information you need.' },
      { state: 'cur.next.val == cur.val', say: 'Equal means the next node is a duplicate: `cur.next = cur.next.next`, and stay on `cur`.' },
      { state: '', say: 'Staying put matters. A run of three or more equal values needs several removals from the same position.' },
      { state: 'values differ', say: 'Different means `cur.next` is a keeper, so advance.' },
      { state: '', say: 'No dummy head is needed, unlike the previous problem, because the head is the first occurrence of its value and is therefore always kept. Notice the difference rather than reaching for a dummy reflexively.' },
      { state: 'return head', say: 'The head never changes, so return it directly.' }
    ],
    takeaway: 'A dummy head is for when the head might be deleted. Here it never is, so returning `head` is correct and the extra node would be noise.'
  },
  hints: [
    'The list is sorted. Where are the duplicates of any given value?',
    'Walk with one pointer. If the next node has the same value, splice it out and stay where you are. Otherwise advance.',
    'Pseudo-code: `cur = head; while cur != null and cur.next != null: if cur.next.val == cur.val: cur.next = cur.next.next else: cur = cur.next; return head`'
  ],
  methodSignature: 'public ListNode deleteDuplicates(ListNode head)',
  starterExtras: LISTNODE,
  javaTemplate: 'linked-list-reverse',
  javaSolution: `class Solution {
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
` + LISTNODE,
  complexity: {
    time: 'O(n)', timeWhy: 'one pass, and each node is unlinked at most once',
    space: 'O(1)', spaceWhy: 'a single reference'
  },
  testCases: [
    { input: { head: [1, 1, 2] }, expected: '[1, 2]' },
    { input: { head: [1, 1, 2, 3, 3] }, expected: '[1, 2, 3]' },
    { input: { head: [] }, expected: '[]' }
  ],
  judgeDriver: driver(
`        Solution s = new Solution();
        System.out.println(show(s.deleteDuplicates(build(1, 1, 2))));
        System.out.println(show(s.deleteDuplicates(build(1, 1, 2, 3, 3))));
        System.out.println(show(s.deleteDuplicates(build())));
`),
  commonMistakes: [
    'Advancing after a splice, which fails on three or more equal values in a row such as `[1,1,1]`.',
    'Comparing `cur.val` with a saved "previous value" variable instead of with `cur.next.val`. It works, and it is more state than the problem needs.',
    'Forgetting the `cur != null` half of the guard, which throws on an empty list.',
    'Using a `HashSet`. The list is sorted, so O(1) space is available and a set throws that away.'
  ],
  followUps: [
    'Remove Duplicates from Sorted List II removes EVERY copy of any duplicated value. That one does need a dummy head, because the head may be a duplicate.',
    'If the list were not sorted, you would need a set and O(n) memory.'
  ]
},

{
  id: 'palindrome-linked-list',
  leetcodeNumber: 234,
  title: 'Palindrome Linked List',
  url: 'https://leetcode.com/problems/palindrome-linked-list/',
  pattern: 'linked-list',
  difficulty: 'Easy',
  order: 7,
  tags: ['fast-slow', 'reverse', 'composition'],
  problemSummary: 'Decide whether the list reads the same forwards and backwards, in O(n) time and O(1) extra space.',
  examples: [
    { input: 'head = [1,2,2,1]', output: 'true', note: 'Symmetric.' },
    { input: 'head = [1,2]', output: 'false', note: 'Not symmetric.' },
    { input: 'head = [1]', output: 'true', note: 'One node is trivially a palindrome.' }
  ],
  constraints: ['The number of nodes is in the range [1, 10^5]', '0 <= Node.val <= 9'],
  techniqueNote: 'the first **composition** in this pattern. Find the middle with fast/slow, reverse the second half, then walk the two halves together. Three subroutines you already have.',
  signals: [
    'Palindrome means comparing the ends inward, and a singly linked list cannot walk backwards. So make it able to.',
    'O(1) space forbids copying the values into an array, which is the easy answer.',
    'Two techniques from earlier in this pattern combine here. Recognising that a problem is a composition of known pieces is the skill.'
  ],
  intuition: {
    input: 'head = [1,2,2,1]',
    visual:
      'step 1, find the middle with fast/slow:\n' +
      '  1 -> 2 -> 2 -> 1        slow ends on the third node\n' +
      '            ^\n' +
      '\n' +
      'step 2, reverse from there:\n' +
      '  1 -> 2 -> null          1 -> 2 -> null\n' +
      '  (first half)            (reversed second half)\n' +
      '\n' +
      'step 3, walk both together until the SHORTER one ends:\n' +
      '  1 vs 1  match\n' +
      '  2 vs 2  match           -> true',
    steps: [
      { state: '', say: 'The easy answer copies every value into an `ArrayList` and does a two-pointer check. That is correct, O(n) time, and O(n) space.' },
      { state: 'slow at the middle', say: 'For O(1) space, first find the middle with fast/slow, exactly as in Middle of the Linked List.' },
      { state: 'second half reversed', say: 'Then reverse from the middle onward, using the three-pointer loop from Reverse Linked List. That side can now be walked "backwards".' },
      { state: '', say: 'Note that the reverse sets the middle node\'s `next` to null, which cleanly terminates the first half. No cycle is created.' },
      { state: 'compare', say: 'Walk one pointer from `head` and one from the reversed head. Loop until the reversed side runs out: for odd lengths the first half is one node longer, and the extra middle node does not need checking.' },
      { state: 'true', say: 'Any mismatch is an immediate false.' }
    ],
    takeaway: 'This problem is two earlier problems glued together. When something looks hard, ask which pieces you already own.'
  },
  hints: [
    'A palindrome check compares the front against the back. A singly linked list cannot go backwards. What could you do to half of it?',
    'Find the middle with fast/slow. Reverse the second half. Then walk one pointer from the head and one from the reversed half, comparing values.',
    'Pseudo-code: `slow = middle(head); second = reverse(slow); a = head; b = second; while b != null: if a.val != b.val return false; a = a.next; b = b.next; return true`'
  ],
  methodSignature: 'public boolean isPalindrome(ListNode head)',
  starterExtras: LISTNODE,
  javaTemplate: 'linked-list-reverse',
  javaSolution: `class Solution {
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
` + LISTNODE,
  complexity: {
    time: 'O(n)', timeWhy: 'three linear passes: find the middle, reverse half, compare half',
    space: 'O(1)', spaceWhy: 'a handful of references. Copying the values out would be O(n).'
  },
  testCases: [
    { input: { head: [1, 2, 2, 1] }, expected: 'true' },
    { input: { head: [1, 2] }, expected: 'false' },
    { input: { head: [1] }, expected: 'true' }
  ],
  judgeDriver: driver(
`        Solution s = new Solution();
        System.out.println(s.isPalindrome(build(1, 2, 2, 1)));
        System.out.println(s.isPalindrome(build(1, 2)));
        System.out.println(s.isPalindrome(build(1)));
`),
  commonMistakes: [
    'Looping while BOTH halves are non-null in a way that overruns the odd-length case. Loop on the reversed half only.',
    'Reversing the whole list instead of half of it. Then you are comparing a list against itself node for node, which is always true.',
    'Assuming a cycle is created. It is not: reversing from `slow` sets `slow.next` to null.',
    'Not mentioning that this MUTATES the caller\'s list. LeetCode does not check, and in real code you would reverse the half back before returning.'
  ],
  followUps: [
    'Restore the list before returning by reversing the second half again. Real code should; interview answers usually mention it.',
    'Reorder List (later) is the same three steps with a weave instead of a comparison.'
  ]
},

{
  id: 'intersection-of-two-linked-lists',
  leetcodeNumber: 160,
  title: 'Intersection of Two Linked Lists',
  url: 'https://leetcode.com/problems/intersection-of-two-linked-lists/',
  pattern: 'linked-list',
  difficulty: 'Easy',
  order: 8,
  tags: ['two-lists', 'length-alignment', 'pointer-identity'],
  problemSummary: 'Two lists may merge and share a common tail. Return the first shared node, or null if they never meet. The shared part must be the same nodes, not merely equal values.',
  examples: [
    { input: 'listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], sharing from the node holding 8', output: '8', note: 'They share the last three nodes.' },
    { input: 'listA = [1,9,1,2,4], listB = [3,2,4], sharing from the node holding 2', output: '2', note: 'Different lengths before the merge.' },
    { input: 'listA = [2,6,4], listB = [1,5], no shared nodes', output: 'null', note: 'They never meet.' }
  ],
  constraints: ['1 <= m, n <= 3 * 10^4', '1 <= Node.val <= 10^5', 'The lists have no cycles', 'Aim for O(m + n) time and O(1) memory'],
  techniqueNote: 'the two-pointer switch. When a pointer falls off one list, restart it on the other. Both then travel `m + n` nodes in total and arrive at the meeting point together.',
  signals: [
    'Two lists that share a suffix. The lengths differ, and that difference is the whole problem.',
    'O(1) memory rules out a set of visited nodes, which is the easy answer.',
    '"Same node" not "same value", so every comparison is `==` on references.'
  ],
  intuition: {
    input: 'listA = [1,9,1,2,4] and listB = [3,2,4], merging at the node holding 2',
    visual:
      'A:  1  9  1  2  4        length 5, three before the merge\n' +
      'B:        3  2  4        length 3, one before the merge\n' +
      '\n' +
      'the lengths differ by 2, so plain lockstep walking never lines up\n' +
      '\n' +
      'the fix: when a walks off A it restarts on B, and vice versa.\n' +
      'Both then cover exactly (unique A) + (unique B) + (shared tail),\n' +
      'which is the same total for both, so they arrive together.\n' +
      '\n' +
      'a: 1 9 1 2 4 | 3 2 4      total 8 nodes\n' +
      'b: 3 2 4 | 1 9 1 2 4      total 8 nodes\n' +
      '           ^ they land on the same node here',
    steps: [
      { state: '', say: 'The obvious idea is to walk both lists in lockstep, and it fails: because the pre-merge sections have different lengths, the pointers are never at the same distance from the end.' },
      { state: '', say: 'The fix everyone thinks of second is to measure both lengths and skip the extra nodes off the longer one. That works, is easy to reason about, and takes three passes.' },
      { state: 'a switches to B', say: 'The elegant version: when `a` reaches the end of A, restart it at the head of B. When `b` reaches the end of B, restart it at the head of A.' },
      { state: '', say: 'Why it works: each pointer now walks (unique part of A) + (unique part of B) + (shared tail). That total is identical for both, so after that many steps they are on the same node.' },
      { state: 'a == b', say: 'The loop condition is `while (a != b)`, so it also terminates when both become `null` at the same time, which is exactly the no-intersection case. No special handling required.' }
    ],
    takeaway: 'Equalising the distance travelled is the trick. Switching lists does it without measuring anything, and it makes the no-intersection case fall out for free.'
  },
  hints: [
    'Walking both lists in step does not work. What is different about the two lists that stops it working?',
    'Make both pointers travel the same total distance: when one runs off the end of its list, restart it at the head of the OTHER list. Loop until the two references are equal.',
    'Pseudo-code: `a = headA; b = headB; while a != b: a = (a == null) ? headB : a.next; b = (b == null) ? headA : b.next; return a`'
  ],
  methodSignature: 'public ListNode getIntersectionNode(ListNode headA, ListNode headB)',
  starterExtras: LISTNODE,
  javaTemplate: 'linked-list-reverse',
  javaSolution: `class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        if (headA == null || headB == null) {
            return null;
        }

        ListNode a = headA;
        ListNode b = headB;

        // != on references, because the question is "the same node", not
        // "the same value". This also terminates when both reach null together,
        // which is precisely the no-intersection case.
        while (a != b) {
            // Each pointer walks A-unique + B-unique + shared. Those totals are
            // equal, so the two arrive at the meeting point on the same step.
            a = (a == null) ? headB : a.next;
            b = (b == null) ? headA : b.next;
        }

        return a;   // the shared node, or null
    }
}
` + LISTNODE,
  complexity: {
    time: 'O(m + n)', timeWhy: 'each pointer traverses at most both lists once',
    space: 'O(1)', spaceWhy: 'two references. A visited-set solution is O(m).'
  },
  testCases: [
    { input: 'listA = [4,1] + shared [8,4,5], listB = [5,6,1] + shared', expected: '8' },
    { input: 'listA = [1,9,1] + shared [2,4], listB = [3] + shared', expected: '2' },
    { input: 'listA = [2,6,4], listB = [1,5], no shared nodes', expected: 'null' }
  ],
  judgeDriver: driver(
`        Solution s = new Solution();

        ListNode shared1 = build(8, 4, 5);
        System.out.println(showNode(s.getIntersectionNode(
                concat(build(4, 1), shared1), concat(build(5, 6, 1), shared1))));

        ListNode shared2 = build(2, 4);
        System.out.println(showNode(s.getIntersectionNode(
                concat(build(1, 9, 1), shared2), concat(build(3), shared2))));

        System.out.println(showNode(s.getIntersectionNode(build(2, 6, 4), build(1, 5))));
`).replace('    /* ---- test helpers ---- */', `    /* ---- test helpers ---- */

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
`),
  commonMistakes: [
    'Comparing `a.val == b.val`, which reports a false intersection whenever the two lists happen to contain the same number.',
    'Writing the switch as `a = a.next == null ? headB : a.next`, which never lets `a` be null and so breaks the no-intersection termination.',
    'Using `while (a != null && b != null)`, which exits before the pointers can meet.',
    'Storing every node of A in a `HashSet`. Correct, O(m) memory, and it gives up the property this problem is teaching.'
  ],
  followUps: [
    'The three-pass version measures both lengths, advances the longer list by the difference, then walks in step. Easier to explain, more code.',
    'The same distance-equalising idea underlies the second phase of Floyd\'s cycle-finding algorithm, which is Linked List Cycle II.'
  ]
},

{
  id: 'binary-number-in-linked-list',
  leetcodeNumber: 1290,
  title: 'Convert Binary Number in a Linked List to Integer',
  url: 'https://leetcode.com/problems/convert-binary-number-in-a-linked-list-to-integer/',
  pattern: 'linked-list',
  difficulty: 'Easy',
  order: 9,
  tags: ['traversal', 'accumulate'],
  problemSummary: 'Each node holds 0 or 1, most significant bit first. Return the number they represent in base ten.',
  examples: [
    { input: 'head = [1,0,1]', output: '5', note: 'Binary 101.' },
    { input: 'head = [0]', output: '0', note: 'A single zero bit.' },
    { input: 'head = [1,0,0,1,0,0,1,1,1,0,0,0,0,0,0]', output: '18880', note: 'Fifteen bits, still comfortably inside an int.' }
  ],
  constraints: ['The number of nodes is in the range [1, 30]', 'Node.val is 0 or 1'],
  techniqueNote: 'plain traversal with an accumulator. Reading the bits most significant first is what makes the one-line update work.',
  signals: [
    'One pass, one running value, no rewiring. Not every linked-list problem is pointer surgery.',
    'The bits arrive most significant first, which is the easy direction: shift what you have and add the new bit.',
    'If you find yourself reversing the list or counting its length first, stop and reconsider.'
  ],
  intuition: {
    input: 'head = [1,0,1]',
    visual:
      'node   value so far\n' +
      '-      0\n' +
      '1      0 * 2 + 1 = 1        binary 1\n' +
      '0      1 * 2 + 0 = 2        binary 10\n' +
      '1      2 * 2 + 1 = 5        binary 101\n' +
      '\n' +
      'multiplying by 2 shifts everything left one place, which is exactly\n' +
      'what reading one more bit means',
    steps: [
      { state: 'value = 0', say: 'Start at zero.' },
      { state: 'value = 1', say: 'For each node, `value = value * 2 + node.val`. Multiplying by 2 shifts the digits you already have left by one, and adding the bit fills the new slot.' },
      { state: 'value = 2', say: 'This is Horner\'s method, the same trick that parses a decimal string with `value * 10 + digit`.' },
      { state: 'value = 5', say: 'One pass, one variable, and no need to know the length in advance. That is the payoff for the bits arriving most significant first.' },
      { state: '', say: 'The tempting alternative is to reverse the list, or count the nodes to know the starting power of two. Both work and neither is necessary.' }
    ],
    takeaway: '`value = value * 2 + bit` reads a binary number in one forward pass. The base-10 equivalent, `value * 10 + digit`, is how `Integer.parseInt` works.'
  },
  hints: [
    'The bits come most significant first. If you have read `101` so far and the next bit is `1`, what is the new value in terms of the old one?',
    'Keep a running total. For each node, double it and add the bit.',
    'Pseudo-code: `value = 0; for cur = head; cur != null; cur = cur.next: value = value * 2 + cur.val; return value`'
  ],
  methodSignature: 'public int getDecimalValue(ListNode head)',
  starterExtras: LISTNODE,
  javaTemplate: 'linked-list-reverse',
  javaSolution: `class Solution {
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
` + LISTNODE,
  complexity: {
    time: 'O(n)', timeWhy: 'one pass, constant work per node',
    space: 'O(1)', spaceWhy: 'one integer. At most 30 bits, so no overflow.'
  },
  testCases: [
    { input: { head: [1, 0, 1] }, expected: '5' },
    { input: { head: [0] }, expected: '0' },
    { input: { head: [1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0] }, expected: '18880' }
  ],
  judgeDriver: driver(
`        Solution s = new Solution();
        System.out.println(s.getDecimalValue(build(1, 0, 1)));
        System.out.println(s.getDecimalValue(build(0)));
        System.out.println(s.getDecimalValue(build(1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0)));
`),
  commonMistakes: [
    'Counting the nodes first to find the starting power of two. It works and needs two passes and an extra variable.',
    'Reversing the list so the bits arrive least significant first. Also works, also unnecessary, and it mutates the input.',
    'Building a `String` of bits and calling `Integer.parseInt(s, 2)`. Correct, and it allocates for no reason.',
    'Using `value << 1 | cur.val`, which is the same thing and slightly less readable for someone learning the idea.'
  ],
  followUps: [
    'Add Two Numbers (later in this pattern) has the digits in the opposite order, which is why it can add them without reversing anything.',
    'The same accumulator shape parses any base, and `value * 10 + digit` is how `Integer.parseInt` works internally.'
  ]
},

{
  id: 'remove-nth-node-from-end',
  leetcodeNumber: 19,
  title: 'Remove Nth Node From End of List',
  url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
  pattern: 'linked-list',
  difficulty: 'Medium',
  order: 10,
  tags: ['dummy-head', 'gap-pointers', 'one-pass'],
  problemSummary: 'Remove the node that is `n` positions from the end and return the head. Do it in one pass.',
  examples: [
    { input: 'head = [1,2,3,4,5], n = 2', output: '[1,2,3,5]', note: 'The 4 is second from the end.' },
    { input: 'head = [1], n = 1', output: '[]', note: 'The only node is also the head.' },
    { input: 'head = [1,2], n = 1', output: '[1]', note: 'Removing the tail.' }
  ],
  constraints: ['The number of nodes is 1 <= sz <= 30', '0 <= Node.val <= 100', '1 <= n <= sz'],
  techniqueNote: 'a fixed **gap** between two pointers. Open a gap of `n`, then walk both until the leader hits the end; the trailer is now `n` from the end.',
  signals: [
    '"k-th from the end" without knowing the length. A gap of k between two pointers measures it.',
    'One pass is demanded, which rules out counting the length first.',
    'The node to remove can be the head, as in `n = sz`. That is a dummy head, again.'
  ],
  intuition: {
    input: 'head = [1,2,3,4,5], n = 2',
    visual:
      'dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> null\n' +
      '\n' +
      'advance lead by n = 2 from the dummy:\n' +
      'trail=dummy                lead=2\n' +
      '\n' +
      'walk both until lead.next is null:\n' +
      'trail=1   lead=3\n' +
      'trail=2   lead=4\n' +
      'trail=3   lead=5   lead.next is null, stop\n' +
      '\n' +
      'trail sits just BEFORE the node to remove. Splice out trail.next (the 4).',
    steps: [
      { state: '', say: 'You cannot count to `sz - n` without knowing `sz`, and counting costs a pass. So measure from the end instead, using a gap.' },
      { state: 'lead is n ahead', say: 'Move `lead` forward `n` steps. Now the two pointers are exactly `n` apart, permanently.' },
      { state: 'walk together', say: 'Walk both until `lead.next` is null, meaning `lead` is on the last node. `trail` is then `n` nodes behind the end.' },
      { state: '', say: 'Both pointers start at the DUMMY, not at the head. That is what leaves `trail` one node BEFORE the target rather than on it, and you need the predecessor to unlink anything.' },
      { state: 'splice', say: '`trail.next = trail.next.next` removes the node.' },
      { state: 'return dummy.next', say: 'The dummy also handles `n = sz`, where the head itself is removed. Return `dummy.next`.' }
    ],
    takeaway: 'Starting both pointers at the dummy is the detail that matters. It buys you the predecessor, which is the only thing you actually need in order to delete.'
  },
  hints: [
    'You do not know the length, and you need the n-th node from the end. If two pointers were exactly n apart, what would be true when the front one reached the end?',
    'Use a dummy head and start both pointers there. Advance the leader `n` steps, then walk both until the leader is on the last node. The trailer is now just before the target.',
    'Pseudo-code: `dummy.next = head; lead = trail = dummy; repeat n times: lead = lead.next; while lead.next != null: lead = lead.next; trail = trail.next; trail.next = trail.next.next; return dummy.next`'
  ],
  methodSignature: 'public ListNode removeNthFromEnd(ListNode head, int n)',
  starterExtras: LISTNODE,
  javaTemplate: 'linked-list-reverse',
  javaSolution: `class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        // BOTH start at the dummy, not at the head. That offset is what leaves
        // trail one node BEFORE the target, which is what deleting requires.
        ListNode lead = dummy;
        ListNode trail = dummy;

        // Open a gap of exactly n.
        for (int i = 0; i < n; i++) {
            lead = lead.next;
        }

        // Walk both until lead is on the last node.
        while (lead.next != null) {
            lead = lead.next;
            trail = trail.next;
        }

        // trail.next is the n-th node from the end.
        trail.next = trail.next.next;

        return dummy.next;   // handles n == size, where the head is removed
    }
}
` + LISTNODE,
  complexity: {
    time: 'O(sz)', timeWhy: 'one pass; the leader walks the list once and the trailer follows',
    space: 'O(1)', spaceWhy: 'one dummy and two references'
  },
  testCases: [
    { input: { head: [1, 2, 3, 4, 5], n: 2 }, expected: '[1, 2, 3, 5]' },
    { input: { head: [1], n: 1 }, expected: '[]' },
    { input: { head: [1, 2], n: 1 }, expected: '[1]' }
  ],
  judgeDriver: driver(
`        Solution s = new Solution();
        System.out.println(show(s.removeNthFromEnd(build(1, 2, 3, 4, 5), 2)));
        System.out.println(show(s.removeNthFromEnd(build(1), 1)));
        System.out.println(show(s.removeNthFromEnd(build(1, 2), 1)));
`),
  commonMistakes: [
    'Starting both pointers at `head` instead of at the dummy. Then `trail` lands ON the target and you cannot unlink it.',
    'Advancing the leader `n + 1` times, or walking until `lead == null` instead of `lead.next == null`. Both are off-by-one variants of the same slip.',
    'No dummy, so `n == size` needs a special case for removing the head.',
    'Counting the length first and then walking `size - n`. Correct, two passes, and the problem asks for one.'
  ],
  followUps: [
    'The same gap technique returns the n-th node from the end without deleting it.',
    'Middle of the Linked List is the ratio version of this idea (a factor of two) rather than the fixed-gap version.'
  ]
},

{
  id: 'add-two-numbers',
  leetcodeNumber: 2,
  title: 'Add Two Numbers',
  url: 'https://leetcode.com/problems/add-two-numbers/',
  pattern: 'linked-list',
  difficulty: 'Medium',
  order: 11,
  tags: ['dummy-head', 'carry', 'two-lists'],
  problemSummary: 'Two non-negative numbers are stored one digit per node, least significant digit first. Add them and return the sum in the same form.',
  examples: [
    { input: 'l1 = [2,4,3], l2 = [5,6,4]', output: '[7,0,8]', note: '342 + 465 = 807, stored backwards.' },
    { input: 'l1 = [0], l2 = [0]', output: '[0]', note: 'Zero plus zero.' },
    { input: 'l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]', output: '[8,9,9,9,0,0,0,1]', note: 'The carry ripples all the way and adds a digit.' }
  ],
  constraints: ['The number of nodes in each list is in the range [1, 100]', '0 <= Node.val <= 9', 'The numbers have no leading zeros except the number 0 itself'],
  techniqueNote: 'digit-by-digit addition with a carry, built onto a dummy head. The digits being reversed is a gift: least significant first is exactly the order addition needs.',
  signals: [
    'Two lists walked together while building a third. Dummy head, and a `tail` pointer.',
    'The digits are stored least significant first, which is the order you add by hand. No reversing needed.',
    'The lists can differ in length and the carry can outlive both, so the loop condition needs all three parts.'
  ],
  intuition: {
    input: 'l1 = [2,4,3] (342), l2 = [5,6,4] (465)',
    visual:
      'least significant first, so just add left to right like school arithmetic\n' +
      '\n' +
      'l1   2   4   3\n' +
      'l2   5   6   4\n' +
      '    ---------\n' +
      '     7  10  7      with carry:\n' +
      '     7   0   8     10 becomes 0 carry 1, then 7 + 1 = 8\n' +
      '\n' +
      'result [7,0,8] = 807 = 342 + 465\n' +
      '\n' +
      'and 999 + 1 shows why the loop must keep going after both lists end:\n' +
      '  9 + 1 = 10 -> 0 carry 1\n' +
      '  9 + 0 + 1  -> 0 carry 1\n' +
      '  9 + 0 + 1  -> 0 carry 1\n' +
      '  both lists empty, carry is 1  ->  emit a final 1',
    steps: [
      { state: '', say: 'The reversed storage is not an obstacle, it is the point. Addition starts from the least significant digit, and that is the head.' },
      { state: 'sum = carry + digits', say: 'Each step: add the carry plus whichever digits are still available. A list that has run out contributes nothing.' },
      { state: 'carry = sum / 10', say: 'The new digit is `sum % 10` and the carry is `sum / 10`. Since each digit is at most 9, `sum` is at most 19, so the carry is always 0 or 1.' },
      { state: '', say: 'The loop condition is `l1 != null || l2 != null || carry != 0`. All three matter: the lists can be different lengths, and `999 + 1` leaves a carry after both are exhausted.' },
      { state: 'append', say: 'Append each digit to the result with a dummy head and a `tail` pointer, exactly as in Merge Two Sorted Lists.' },
      { state: 'return dummy.next', say: 'The result comes out least significant first as well, which is what the problem wants.' }
    ],
    takeaway: 'Fold the carry into the loop condition. Treating it as a special case after the loop is how the `[9,9,9]` plus `[1]` case gets missed.'
  },
  hints: [
    'The digits are stored backwards. Is that a problem for addition, or is it convenient?',
    'Walk both lists together with a running carry. Each step, sum the carry and any available digits, append `sum % 10`, and keep `sum / 10` as the new carry. Keep looping while either list has nodes OR the carry is non-zero.',
    'Pseudo-code: `dummy; tail = dummy; carry = 0; while l1 != null or l2 != null or carry != 0: sum = carry + (l1?l1.val:0) + (l2?l2.val:0); carry = sum/10; tail.next = new node(sum%10); advance everything; return dummy.next`'
  ],
  methodSignature: 'public ListNode addTwoNumbers(ListNode l1, ListNode l2)',
  starterExtras: LISTNODE,
  javaTemplate: 'linked-list-reverse',
  javaSolution: `class Solution {
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
` + LISTNODE,
  complexity: {
    time: 'O(max(m, n))', timeWhy: 'one pass over the longer list, plus at most one extra node for a final carry',
    space: 'O(max(m, n))', spaceWhy: 'the result list, which the problem requires. No other allocation.'
  },
  testCases: [
    { input: { l1: [2, 4, 3], l2: [5, 6, 4] }, expected: '[7, 0, 8]' },
    { input: { l1: [0], l2: [0] }, expected: '[0]' },
    { input: { l1: [9, 9, 9, 9, 9, 9, 9], l2: [9, 9, 9, 9] }, expected: '[8, 9, 9, 9, 0, 0, 0, 1]' }
  ],
  judgeDriver: driver(
`        Solution s = new Solution();
        System.out.println(show(s.addTwoNumbers(build(2, 4, 3), build(5, 6, 4))));
        System.out.println(show(s.addTwoNumbers(build(0), build(0))));
        System.out.println(show(s.addTwoNumbers(build(9, 9, 9, 9, 9, 9, 9), build(9, 9, 9, 9))));
`),
  commonMistakes: [
    'Leaving `carry != 0` out of the loop condition, so `[9,9,9]` plus `[1]` loses the leading 1.',
    'Stopping when EITHER list ends rather than when both do, which truncates the longer number.',
    'Converting each list to an `int` or `long`, adding, then rebuilding. With up to 100 digits that overflows every primitive type.',
    'Handling the carry with an `if` after the loop. It works, and folding it into the condition is one fewer place to be wrong.'
  ],
  followUps: [
    'Add Two Numbers II stores the digits most significant first, which needs a reverse, a stack, or recursion.',
    'Multiply Strings is the same carry bookkeeping with a second dimension.'
  ]
},

{
  id: 'reorder-list',
  leetcodeNumber: 143,
  title: 'Reorder List',
  url: 'https://leetcode.com/problems/reorder-list/',
  pattern: 'linked-list',
  difficulty: 'Medium',
  order: 12,
  tags: ['composition', 'fast-slow', 'reverse', 'weave'],
  problemSummary: 'Rearrange the list so it alternates first node, last node, second node, second last, and so on. Do it in place, without changing any node values.',
  examples: [
    { input: 'head = [1,2,3,4]', output: '[1,4,2,3]', note: 'First, last, second, second last.' },
    { input: 'head = [1,2,3,4,5]', output: '[1,5,2,4,3]', note: 'Odd length, so the middle node ends up last.' },
    { input: 'head = [1]', output: '[1]', note: 'Nothing to do.' }
  ],
  constraints: ['The number of nodes is in the range [1, 5 * 10^4]', '1 <= Node.val <= 1000'],
  techniqueNote: 'the three-step composition again: find the middle, reverse the second half, weave the two halves. Same recipe as Palindrome Linked List with a different final step.',
  signals: [
    'You need to interleave the front with the back, and a singly linked list cannot walk backwards.',
    'In place with no value changes, so it is pure rewiring.',
    'If Palindrome Linked List is familiar, the first two steps here are identical. Only the third changes.'
  ],
  intuition: {
    input: 'head = [1,2,3,4,5]',
    visual:
      'step 1, find the FIRST middle:            1 2 3 | 4 5\n' +
      '        (note: first, not second)\n' +
      '\n' +
      'step 2, cut and reverse the second half:  first  1 -> 2 -> 3 -> null\n' +
      '                                          second 5 -> 4 -> null\n' +
      '\n' +
      'step 3, weave one from each:\n' +
      '  take 1, then 5, then 2, then 4, then 3\n' +
      '  ->  1 -> 5 -> 2 -> 4 -> 3 -> null',
    steps: [
      { state: '', say: 'Step 1: find the middle, but here you want the FIRST middle, not the second. The condition is `while (fast.next != null && fast.next.next != null)`, which differs from Middle of the Linked List by exactly one shift.' },
      { state: 'slow.next = null', say: 'Cut the list in two by setting `slow.next = null`. Without that cut the weave builds a cycle.' },
      { state: 'second reversed', say: 'Step 2: reverse the second half with the usual three-pointer loop. It is now walkable backwards.' },
      { state: 'weave', say: 'Step 3: alternate. Each iteration takes one node from each side. Save both `next` pointers BEFORE rewiring, because both are about to be overwritten.' },
      { state: '', say: 'Loop on the SECOND half. With an odd total the first half is one node longer, and the leftover node is already correctly at the end.' },
      { state: '[1,5,2,4,3]', say: 'The result alternates as required, with no values touched.' }
    ],
    takeaway: 'The first-middle versus second-middle distinction is not pedantry: with the wrong one the halves are unbalanced and the weave leaves a dangling node.'
  },
  hints: [
    'You need to pair the first node with the last, the second with the second last. A singly linked list only goes forwards. What could you do to the back half?',
    'Three steps: find the first middle with fast/slow, cut and reverse the second half, then weave the two halves together one node at a time.',
    'Pseudo-code: `find first middle; second = slow.next; slow.next = null; second = reverse(second); while second != null: n1 = first.next; n2 = second.next; first.next = second; second.next = n1; first = n1; second = n2`'
  ],
  methodSignature: 'public void reorderList(ListNode head)',
  starterExtras: LISTNODE,
  javaTemplate: 'linked-list-reverse',
  javaSolution: `class Solution {
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
` + LISTNODE,
  complexity: {
    time: 'O(n)', timeWhy: 'three linear passes: middle, reverse, weave',
    space: 'O(1)', spaceWhy: 'a handful of references. Copying nodes into an ArrayList would be O(n).'
  },
  testCases: [
    { input: { head: [1, 2, 3, 4] }, expected: '[1, 4, 2, 3]' },
    { input: { head: [1, 2, 3, 4, 5] }, expected: '[1, 5, 2, 4, 3]' },
    { input: { head: [1] }, expected: '[1]' }
  ],
  judgeDriver: driver(
`        Solution s = new Solution();
        System.out.println(run(s, build(1, 2, 3, 4)));
        System.out.println(run(s, build(1, 2, 3, 4, 5)));
        System.out.println(run(s, build(1)));
`).replace('    /* ---- test helpers ---- */', `    /* ---- test helpers ---- */

    static String run(Solution s, ListNode head) {
        s.reorderList(head);
        return show(head);
    }
`),
  commonMistakes: [
    'Forgetting `slow.next = null`, which leaves the two halves joined and the weave produces a cycle. Printing the result then never terminates.',
    'Using the SECOND-middle condition. For odd lengths the halves come out unbalanced and a node is left dangling.',
    'Overwriting `first.next` before saving it, which loses the rest of the first half.',
    'Looping while `first != null` instead of `second != null`, which walks off the end on odd lengths.',
    'Copying all the nodes into an `ArrayList` and re-linking by index. Correct, O(n) space, and much easier, which is exactly why the O(1) version is the exercise.'
  ],
  followUps: [
    'Palindrome Linked List is steps 1 and 2 with a comparison instead of a weave. Writing both back to back makes the shared recipe obvious.',
    'Odd Even Linked List is a different split of the same weaving idea.'
  ]
},

{
  id: 'linked-list-cycle-ii',
  leetcodeNumber: 142,
  title: 'Linked List Cycle II',
  url: 'https://leetcode.com/problems/linked-list-cycle-ii/',
  pattern: 'linked-list',
  difficulty: 'Medium',
  order: 13,
  tags: ['fast-slow', 'floyd', 'cycle-entry'],
  problemSummary: 'If the list contains a cycle, return the node where the cycle begins. Otherwise return null. Use O(1) memory.',
  examples: [
    { input: 'head = [3,2,0,-4], tail connects to index 1', output: '2', note: 'The cycle starts at the node holding 2.' },
    { input: 'head = [1,2], tail connects to index 0', output: '1', note: 'The cycle starts at the head.' },
    { input: 'head = [1], no cycle', output: 'null', note: 'No cycle at all.' }
  ],
  constraints: ['The number of nodes is in the range [0, 10^4]', '-10^5 <= Node.val <= 10^5', 'pos is -1 or a valid index', 'Solve it using O(1) memory'],
  techniqueNote: 'Floyd\'s algorithm, phase two. After the pointers meet, restart one at the head and walk both **one step at a time**; they meet at the cycle entry.',
  signals: [
    'Cycle detection you already know, now asking WHERE.',
    'O(1) memory again rules out a visited set, which would make this trivial.',
    'The second phase looks like magic until you write out the distances. It is worth doing that once.'
  ],
  intuition: {
    input: 'head = [3,2,0,-4] with the tail pointing back at the 2',
    visual:
      'let  a = steps from head to the cycle entry\n' +
      '     b = steps from the entry to the meeting point\n' +
      '     c = remaining steps from the meeting point back to the entry\n' +
      'so the cycle length is b + c\n' +
      '\n' +
      '  head --- a ---> ENTRY --- b ---> MEET\n' +
      '                    ^                |\n' +
      '                    +------- c ------+\n' +
      '\n' +
      'when they meet:  slow walked a + b\n' +
      '                 fast walked a + b + k(b + c) for some k >= 1\n' +
      'fast walked exactly twice as far, so:\n' +
      '                 2(a + b) = a + b + k(b + c)\n' +
      '                 a + b = k(b + c)\n' +
      '                 a = k(b + c) - b = (k-1)(b+c) + c\n' +
      '\n' +
      'so walking a steps from the head, and c steps from the meeting point\n' +
      '(plus whole laps, which change nothing), both arrive at the ENTRY',
    steps: [
      { state: 'phase 1', say: 'Phase one is Linked List Cycle unchanged: fast/slow until they meet, or until `fast` falls off the end and you return null.' },
      { state: 'they meet', say: 'Now name three distances: `a` from the head to the entry, `b` from the entry to the meeting point, and `c` from the meeting point round to the entry.' },
      { state: '', say: '`slow` has walked `a + b`. `fast` has walked the same plus some whole number of laps, and also exactly twice as far. Setting those equal gives `a + b = k(b + c)`.' },
      { state: 'a = (k-1)(b+c) + c', say: 'Rearranged: `a` equals `c` plus some whole laps. Laps do not change where you end up inside a cycle.' },
      { state: 'phase 2', say: 'So put one pointer back at the head and leave the other at the meeting point, then advance both ONE step at a time. After `a` steps the first is at the entry, and the second has walked `a`, which is `c` plus laps, so it is at the entry too.' },
      { state: 'they meet at the entry', say: 'The node where they meet is the answer. Note that phase two walks both at the same speed; keeping the 2x speed here is the classic bug.' }
    ],
    takeaway: 'Phase two is not a trick to memorise, it is the algebra `a = c + laps`. Write those three distances down once and it stops being mysterious.'
  },
  hints: [
    'Start with Linked List Cycle to find out whether there is a cycle at all. Once the two pointers have met, what do you know about how far each has travelled?',
    'Label the distance head-to-entry as `a` and entry-to-meeting as `b`, with `c` completing the loop. Use "fast walked twice as far" to relate them, and see what that says about `a` and `c`.',
    'Pseudo-code: phase 1 as usual; on meeting, `probe = head; while probe != slow: probe = probe.next; slow = slow.next; return probe`. Both move ONE step in phase 2.'
  ],
  methodSignature: 'public ListNode detectCycle(ListNode head)',
  starterExtras: LISTNODE,
  javaTemplate: 'linked-list-reverse',
  javaSolution: `class Solution {
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
` + LISTNODE,
  complexity: {
    time: 'O(n)', timeWhy: 'phase 1 is at most n steps for each pointer, and phase 2 is at most n more',
    space: 'O(1)', spaceWhy: 'three references'
  },
  testCases: [
    { input: 'head = [3,2,0,-4], pos = 1', expected: '2' },
    { input: 'head = [1,2], pos = 0', expected: '1' },
    { input: 'head = [1], pos = -1', expected: 'null' }
  ],
  judgeDriver: driver(
`        Solution s = new Solution();
        System.out.println(showNode(s.detectCycle(buildCycle(new int[]{3, 2, 0, -4}, 1))));
        System.out.println(showNode(s.detectCycle(buildCycle(new int[]{1, 2}, 0))));
        System.out.println(showNode(s.detectCycle(buildCycle(new int[]{1}, -1))));
`),
  commonMistakes: [
    'Keeping the 2x speed in phase two. Both pointers must move one step at a time there.',
    'Restarting `fast` at the head instead of leaving one pointer at the meeting point. Only one moves back.',
    'Returning the MEETING node rather than the entry. They coincide only when the cycle happens to start at the head.',
    'Running phase two even when there is no cycle. It belongs inside the `slow == fast` branch.',
    'A `HashSet` of visited nodes. Trivially correct, O(n) memory, and it fails the stated constraint.'
  ],
  followUps: [
    'Find the Duplicate Number applies this exact algorithm to an array treated as a linked list, which is genuinely surprising the first time.',
    'The cycle LENGTH is a third phase: keep one pointer still at the meeting point and walk the other until it comes back.'
  ]
},

{
  id: 'merge-k-sorted-lists',
  leetcodeNumber: 23,
  title: 'Merge k Sorted Lists',
  url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
  pattern: 'linked-list',
  difficulty: 'Hard',
  order: 14,
  tags: ['heap', 'merge', 'dummy-head'],
  problemSummary: 'An array of `k` sorted lists is given, some possibly empty. Merge them all into one sorted list and return its head.',
  examples: [
    { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]', note: 'All eight nodes in order.' },
    { input: 'lists = []', output: '[]', note: 'No lists at all.' },
    { input: 'lists = [[]]', output: '[]', note: 'One list, and it is empty.' }
  ],
  constraints: ['k == lists.length', '0 <= k <= 10^4', '0 <= lists[i].length <= 500', '-10^4 <= lists[i][j] <= 10^4', 'Each list is sorted in ascending order', 'The total number of nodes will not exceed 10^4'],
  techniqueNote: 'Merge Two Sorted Lists generalised. With two lists you compare two heads; with `k`, put the heads in a **min-heap** so the smallest is always O(1) away.',
  signals: [
    '"Always take the smallest of k candidates, repeatedly" is a min-heap, essentially by definition.',
    'You already know the two-list merge. The only question is how to pick the smallest of `k` heads efficiently.',
    'Scanning all `k` heads on every step is O(nk). A heap makes each pick O(log k).'
  ],
  intuition: {
    input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
    visual:
      'the heap holds the current HEAD of each list, ordered by value\n' +
      '\n' +
      'heap: 1(A) 1(B) 2(C)      poll 1(A), append it, push A.next = 4\n' +
      'heap: 1(B) 2(C) 4(A)      poll 1(B), append,    push B.next = 3\n' +
      'heap: 2(C) 3(B) 4(A)      poll 2(C), append,    push C.next = 6\n' +
      'heap: 3(B) 4(A) 6(C)      poll 3(B), append,    push 4(B)\n' +
      'heap: 4(A) 4(B) 6(C)      ... and so on\n' +
      '\n' +
      'the heap never holds more than k nodes, so each poll is O(log k)',
    steps: [
      { state: '', say: 'The smallest remaining value overall must be at the head of one of the lists, because each list is sorted. So there are only `k` candidates at any moment.' },
      { state: 'heap of k heads', say: 'Put those heads in a min-heap ordered by value, skipping empty lists so no null ever enters.' },
      { state: 'poll the smallest', say: 'Poll the smallest, splice it onto the result with a dummy head and `tail` pointer, then push its `next` if there is one. That keeps the heap holding exactly the current head of every non-exhausted list.' },
      { state: '', say: 'Each of the `n` nodes is pushed and polled once, at O(log k) each, so the total is O(n log k). Comparing all `k` heads every time would be O(nk), and a naive "merge them one at a time" is O(nk) as well.' },
      { state: 'tail.next = null', say: 'Set `tail.next = null` at the end. The last node you spliced still carries its old `next` from its original list, and leaving it in place can produce a stale tail.' },
      { state: '', say: 'Use `Integer.compare(a.val, b.val)` in the comparator rather than `a.val - b.val`, which can overflow for values at the extremes of int.' }
    ],
    takeaway: 'Two lists means comparing two heads; k lists means a heap of heads. That is the whole generalisation, and O(n log k) beats O(nk) whenever k is large.'
  },
  hints: [
    'You can merge two lists already. Where must the smallest remaining value be, given that every list is sorted?',
    'There are only k candidates at any moment: the heads. Keep them in a `PriorityQueue` ordered by value. Poll the smallest, append it, and push its successor.',
    'Pseudo-code: `pq = min-heap by val; for each non-null head: pq.offer(head); dummy; tail = dummy; while pq not empty: node = pq.poll(); tail.next = node; tail = node; if node.next != null: pq.offer(node.next); tail.next = null; return dummy.next`'
  ],
  methodSignature: 'public ListNode mergeKLists(ListNode[] lists)',
  starterExtras: LISTNODE,
  javaTemplate: 'linked-list-reverse',
  javaSolution: `import java.util.*;

class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        // Integer.compare, not a.val - b.val, which can overflow.
        PriorityQueue<ListNode> pq =
                new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));

        // Seed with the head of every non-empty list. ArrayDeque and
        // PriorityQueue both reject nulls, so the check is required.
        for (ListNode head : lists) {
            if (head != null) {
                pq.offer(head);
            }
        }

        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;

        while (!pq.isEmpty()) {
            ListNode smallest = pq.poll();

            tail.next = smallest;
            tail = smallest;

            // Keep the heap holding exactly the current head of each list that
            // still has nodes left.
            if (smallest.next != null) {
                pq.offer(smallest.next);
            }
        }

        // The last node spliced on still carries its original next pointer,
        // which would leave a stale tail hanging off the result.
        tail.next = null;

        return dummy.next;
    }
}
` + LISTNODE,
  complexity: {
    time: 'O(n log k)', timeWhy: 'each of the n nodes is pushed and polled once, and the heap never exceeds k entries',
    space: 'O(k)', spaceWhy: 'the heap holds at most one node per list. The output reuses the existing nodes.'
  },
  testCases: [
    { input: { lists: [[1, 4, 5], [1, 3, 4], [2, 6]] }, expected: '[1, 1, 2, 3, 4, 4, 5, 6]' },
    { input: { lists: [] }, expected: '[]' },
    { input: { lists: [[]] }, expected: '[]' }
  ],
  judgeDriver: driver(
`        Solution s = new Solution();
        System.out.println(show(s.mergeKLists(new ListNode[]{
                build(1, 4, 5), build(1, 3, 4), build(2, 6)})));
        System.out.println(show(s.mergeKLists(new ListNode[]{})));
        System.out.println(show(s.mergeKLists(new ListNode[]{build()})));
`),
  commonMistakes: [
    'Offering null heads to the heap. `PriorityQueue` throws a NullPointerException, and empty input lists are explicitly allowed.',
    'Forgetting `tail.next = null`, which can leave a stale suffix attached to the result.',
    'Writing the comparator as `a.val - b.val`, which overflows for values at the extremes of int.',
    'Merging the lists one after another into an accumulator. That is O(nk): the accumulated list is re-walked every time.',
    'Collecting every value into a list, sorting it, and rebuilding. Correct, O(n log n) rather than O(n log k), and it throws away the sortedness you were given.'
  ],
  followUps: [
    'Divide and conquer gives the same O(n log k) with no heap: pair the lists up and merge two at a time, halving the count each round.',
    'This is the k-way merge at the heart of external sorting, where the lists are files too large for memory.',
    'The Heap pattern later in the syllabus builds on exactly this shape.'
  ]
}

  );
})();
