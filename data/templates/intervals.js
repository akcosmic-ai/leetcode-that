(window.LC_TEMPLATES = window.LC_TEMPLATES || {})['intervals-merge'] = {
  id: 'intervals-merge',
  name: 'Intervals: merge, non-overlapping greedy, sweep line',
  pattern: 'intervals',
  order: 15,
  notes: 'Which endpoint you sort by decides the problem. Sort by START to merge. Sort by END to keep the most ' +
         'non-overlapping intervals. Split starts and ends into two sorted arrays to count concurrency.',
  code: `import java.util.*;

class IntervalsTemplate {

    /** Shape 1 - MERGE. Sort by start, then extend or emit. */
    int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));   // by START
        List<int[]> out = new ArrayList<>();
        for (int[] cur : intervals) {
            int[] last = out.isEmpty() ? null : out.get(out.size() - 1);
            if (last != null && cur[0] <= last[1]) {
                last[1] = Math.max(last[1], cur[1]);   // overlap: stretch the open interval
            } else {
                out.add(new int[] { cur[0], cur[1] }); // gap: start a new one
            }
        }
        return out.toArray(new int[0][]);
    }

    /**
     * Shape 2 - MAXIMUM NON-OVERLAPPING. Sort by END and take greedily.
     * Finishing earliest leaves the most room for everything after it.
     */
    int maxNonOverlapping(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));   // by END
        int kept = 0;
        int lastEnd = Integer.MIN_VALUE;
        for (int[] iv : intervals) {
            if (iv[0] >= lastEnd) {        // starts after the last kept one finished
                kept++;
                lastEnd = iv[1];
            }
        }
        return kept;
    }

    /** Shape 3 - SWEEP LINE. Sort starts and ends separately, walk both. */
    int maxConcurrent(int[][] intervals) {
        int n = intervals.length;
        int[] starts = new int[n], ends = new int[n];
        for (int i = 0; i < n; i++) { starts[i] = intervals[i][0]; ends[i] = intervals[i][1]; }
        Arrays.sort(starts);
        Arrays.sort(ends);

        int active = 0, best = 0, e = 0;
        for (int s = 0; s < n; s++) {
            while (e < n && ends[e] <= starts[s]) { active--; e++; }   // everything finished
            active++;
            best = Math.max(best, active);
        }
        return best;
    }

    /** Shape 3b - SAME ANSWER WITH A MIN-HEAP OF END TIMES. Often easier to remember. */
    int maxConcurrentWithHeap(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        PriorityQueue<Integer> endTimes = new PriorityQueue<>();
        int best = 0;
        for (int[] iv : intervals) {
            while (!endTimes.isEmpty() && endTimes.peek() <= iv[0]) endTimes.poll();
            endTimes.offer(iv[1]);
            best = Math.max(best, endTimes.size());
        }
        return best;
    }

    /** Shape 4 - INSERT ONE INTERVAL into an already sorted, disjoint list. */
    int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> out = new ArrayList<>();
        int i = 0, n = intervals.length;
        int[] add = new int[] { newInterval[0], newInterval[1] };

        while (i < n && intervals[i][1] < add[0]) out.add(intervals[i++]);   // entirely before
        while (i < n && intervals[i][0] <= add[1]) {                         // overlapping run
            add[0] = Math.min(add[0], intervals[i][0]);
            add[1] = Math.max(add[1], intervals[i][1]);
            i++;
        }
        out.add(add);
        while (i < n) out.add(intervals[i++]);                               // entirely after
        return out.toArray(new int[0][]);
    }
}
`
};
