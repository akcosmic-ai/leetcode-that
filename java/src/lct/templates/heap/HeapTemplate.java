/*
 * TEMPLATE: Heap: top k, k-th largest, merge, two-heap median
 *
 * For the k LARGEST, keep a MIN-heap of size k. It reads backwards and it is
 * correct: the weakest of your current best k sits on top, so it is the
 * cheapest to evict. That is what makes it O(n log k) instead of O(n log n).
 *
 * Generated from data/templates/heap.js.
 */
package lct.templates.heap;

import java.util.*;

class HeapTemplate {

    /** Shape 1 - K LARGEST with a MIN-heap capped at k. O(n log k). */
    List<Integer> kLargest(int[] nums, int k) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();   // min-heap by default
        for (int x : nums) {
            pq.offer(x);
            if (pq.size() > k) pq.poll();      // evict the smallest of the current best k
        }
        return new ArrayList<>(pq);            // note: NOT in sorted order
    }

    /** Shape 1b - K-TH LARGEST is just the head of that same heap. */
    int kthLargest(int[] nums, int k) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int x : nums) {
            pq.offer(x);
            if (pq.size() > k) pq.poll();
        }
        return pq.peek();
    }

    /** Shape 2 - MAX-HEAP. Pass a reversed comparator. */
    int[] threeLargestDescending(int[] nums) {
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());
        for (int x : nums) maxHeap.offer(x);
        return new int[] { maxHeap.poll(), maxHeap.poll(), maxHeap.poll() };
    }

    /** Shape 3 - CUSTOM ORDER. Integer.compare, never a - b, to dodge overflow. */
    List<int[]> kClosestToOrigin(int[][] points, int k) {
        PriorityQueue<int[]> pq = new PriorityQueue<>(
            (a, b) -> Integer.compare(b[0] * b[0] + b[1] * b[1], a[0] * a[0] + a[1] * a[1]));
        for (int[] p : points) {
            pq.offer(p);
            if (pq.size() > k) pq.poll();      // drop the farthest
        }
        return new ArrayList<>(pq);
    }

    /** Shape 4 - MERGE K SORTED. Heap the current head of every list. */
    List<Integer> mergeSortedLists(List<List<Integer>> lists) {
        // each entry: {value, whichList, indexInThatList}
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        for (int i = 0; i < lists.size(); i++) {
            if (!lists.get(i).isEmpty()) pq.offer(new int[] { lists.get(i).get(0), i, 0 });
        }
        List<Integer> out = new ArrayList<>();
        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            out.add(top[0]);
            int next = top[2] + 1;
            if (next < lists.get(top[1]).size()) {
                pq.offer(new int[] { lists.get(top[1]).get(next), top[1], next });
            }
        }
        return out;
    }

    /**
     * Shape 5 - TWO HEAPS for a running median. Low half is a max-heap, high
     * half is a min-heap, and low never holds more than one extra element.
     */
    private final PriorityQueue<Integer> low = new PriorityQueue<>(Comparator.reverseOrder());
    private final PriorityQueue<Integer> high = new PriorityQueue<>();

    void addNumber(int x) {
        low.offer(x);
        high.offer(low.poll());                 // funnel through so the split stays correct
        if (high.size() > low.size()) low.offer(high.poll());
    }

    double median() {
        if (low.isEmpty()) return 0;
        if (low.size() > high.size()) return low.peek();
        return (low.peek() + high.peek()) / 2.0;
    }
}
