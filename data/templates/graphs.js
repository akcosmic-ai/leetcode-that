(window.LC_TEMPLATES = window.LC_TEMPLATES || {})['graph-bfs-grid'] = {
  id: 'graph-bfs-grid',
  name: 'Graphs: grid DFS/BFS, adjacency BFS, topological sort, union-find',
  pattern: 'graphs',
  order: 11,
  notes: 'Mark visited when you ENQUEUE, not when you dequeue, or the same cell enters the queue many times. ' +
         'BFS gives shortest path in an unweighted graph; DFS does not. Union-Find with path compression is ' +
         'effectively O(1) per query.',
  code: `import java.util.*;

class GraphsTemplate {

    private static final int[][] DIRS = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    /** Shape 1 - GRID DFS. Flood fill one region, counting cells. */
    int floodFill(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return 0;  // bounds first
        if (grid[r][c] != '1') return 0;                                          // wall or seen

        grid[r][c] = '#';                     // mark visited IN PLACE, no extra array needed
        int size = 1;
        for (int[] d : DIRS) size += floodFill(grid, r + d[0], c + d[1]);
        return size;
    }

    /** Shape 2 - GRID BFS. Layer by layer, so the layer number IS the distance. */
    int shortestPathInGrid(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        boolean[][] visited = new boolean[m][n];
        Deque<int[]> q = new ArrayDeque<>();
        q.offer(new int[] { 0, 0 });
        visited[0][0] = true;                 // mark on ENQUEUE, not on dequeue

        int steps = 0;
        while (!q.isEmpty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                int[] cell = q.poll();
                if (cell[0] == m - 1 && cell[1] == n - 1) return steps;
                for (int[] d : DIRS) {
                    int nr = cell[0] + d[0], nc = cell[1] + d[1];
                    if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
                    if (visited[nr][nc] || grid[nr][nc] == 1) continue;
                    visited[nr][nc] = true;
                    q.offer(new int[] { nr, nc });
                }
            }
            steps++;
        }
        return -1;
    }

    /** Shape 3 - ADJACENCY LIST from an edge array. */
    Map<Integer, List<Integer>> buildGraph(int n, int[][] edges) {
        Map<Integer, List<Integer>> adj = new HashMap<>();
        for (int i = 0; i < n; i++) adj.put(i, new ArrayList<>());
        for (int[] e : edges) {
            adj.get(e[0]).add(e[1]);
            adj.get(e[1]).add(e[0]);          // drop this line for a directed graph
        }
        return adj;
    }

    /** Shape 4 - TOPOLOGICAL SORT (Kahn). An incomplete result means a cycle. */
    List<Integer> topoSort(int n, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        int[] inDegree = new int[n];
        for (int[] p : prerequisites) {
            adj.get(p[1]).add(p[0]);          // p[1] must come before p[0]
            inDegree[p[0]]++;
        }

        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) if (inDegree[i] == 0) q.offer(i);

        List<Integer> order = new ArrayList<>();
        while (!q.isEmpty()) {
            int node = q.poll();
            order.add(node);
            for (int next : adj.get(node)) {
                if (--inDegree[next] == 0) q.offer(next);
            }
        }
        return order.size() == n ? order : new ArrayList<>();   // short means cyclic
    }

    /** Shape 5 - UNION-FIND with path compression and union by size. */
    static class DisjointSet {
        private final int[] parent;
        private final int[] size;
        int components;

        DisjointSet(int n) {
            parent = new int[n];
            size = new int[n];
            components = n;
            for (int i = 0; i < n; i++) { parent[i] = i; size[i] = 1; }
        }

        int find(int x) {
            while (parent[x] != x) {
                parent[x] = parent[parent[x]];   // path compression, halving as we climb
                x = parent[x];
            }
            return x;
        }

        /** false when they were already connected, which is how you detect a cycle. */
        boolean union(int a, int b) {
            int ra = find(a), rb = find(b);
            if (ra == rb) return false;
            if (size[ra] < size[rb]) { int t = ra; ra = rb; rb = t; }
            parent[rb] = ra;
            size[ra] += size[rb];
            components--;
            return true;
        }
    }
}
`
};
