(window.LC_TEMPLATES = window.LC_TEMPLATES || {})['dp-2d'] = {
  id: 'dp-2d',
  name: '2-D DP: two-sequence table, grid paths, knapsack, row compression',
  pattern: 'dp-2d',
  order: 13,
  notes: 'The padded row 0 and column 0 mean "empty prefix" and must be initialised on purpose. Fill top-left ' +
         'to bottom-right and each cell only reads neighbours that are already done. When a row depends only on ' +
         'the row above, collapse to two rows.',
  code: `class Dp2dTemplate {

    /**
     * Shape 1 - TWO SEQUENCES. dp[i][j] = LCS length of a's first i chars and
     * b's first j chars. Row 0 and column 0 stay 0: an empty prefix shares nothing.
     */
    int longestCommonSubsequence(String a, String b) {
        int m = a.length(), n = b.length();
        int[][] dp = new int[m + 1][n + 1];        // +1 for the empty-prefix padding

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;              // characters match: extend
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);  // drop one, keep the best
                }
            }
        }
        return dp[m][n];
    }

    /** Shape 2 - EDIT DISTANCE. The padding is a real cost here, not zero. */
    int editDistance(String a, String b) {
        int m = a.length(), n = b.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 0; i <= m; i++) dp[i][0] = i;   // delete every char of a
        for (int j = 0; j <= n; j++) dp[0][j] = j;   // insert every char of b

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];              // free
                } else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],  // replace
                               Math.min(dp[i - 1][j],          // delete
                                        dp[i][j - 1]));        // insert
                }
            }
        }
        return dp[m][n];
    }

    /** Shape 3 - GRID PATHS. Each cell sums the ways in from above and from the left. */
    int uniquePaths(int m, int n) {
        int[][] dp = new int[m][n];
        for (int i = 0; i < m; i++) dp[i][0] = 1;    // only one way down the first column
        for (int j = 0; j < n; j++) dp[0][j] = 1;    // only one way along the first row
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            }
        }
        return dp[m - 1][n - 1];
    }

    /** Shape 4 - 0/1 KNAPSACK. dp[i][c] = best using the first i items, capacity c. */
    int knapsack(int[] weights, int[] values, int capacity) {
        int n = weights.length;
        int[][] dp = new int[n + 1][capacity + 1];
        for (int i = 1; i <= n; i++) {
            for (int c = 0; c <= capacity; c++) {
                dp[i][c] = dp[i - 1][c];                       // skip item i
                if (weights[i - 1] <= c) {                     // or take it, if it fits
                    dp[i][c] = Math.max(dp[i][c],
                                        dp[i - 1][c - weights[i - 1]] + values[i - 1]);
                }
            }
        }
        return dp[n][capacity];
    }

    /** Shape 5 - ROW COMPRESSION. Only the previous row is ever read, so keep two. */
    int lcsTwoRows(String a, String b) {
        int m = a.length(), n = b.length();
        int[] prev = new int[n + 1];
        int[] cur = new int[n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                cur[j] = a.charAt(i - 1) == b.charAt(j - 1)
                       ? prev[j - 1] + 1
                       : Math.max(prev[j], cur[j - 1]);
            }
            int[] swap = prev; prev = cur; cur = swap;   // reuse the array, no allocation
        }
        return prev[n];
    }
}
`
};
