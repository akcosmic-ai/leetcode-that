(window.LC_TEMPLATES = window.LC_TEMPLATES || {})['dp-1d'] = {
  id: 'dp-1d',
  name: '1-D DP: top-down memo, bottom-up table, rolling variables',
  pattern: 'dp-1d',
  order: 12,
  notes: 'Write the meaning of `dp[i]` as an English sentence above the loop, every time. The three shapes here ' +
         'are the same algorithm at three levels of polish: memoised recursion, a table, then two variables. ' +
         'Seed a memo with -1, never 0, unless 0 can never be a real answer.',
  code: `import java.util.*;

class Dp1dTemplate {

    /** Shape 1 - TOP-DOWN. Write the recursion, then bolt a memo onto it. */
    int climbTopDown(int n) {
        int[] memo = new int[n + 1];
        Arrays.fill(memo, -1);            // -1 means "not computed", 0 is a real answer
        return climb(n, memo);
    }

    private int climb(int n, int[] memo) {
        if (n <= 2) return n;                       // base cases
        if (memo[n] != -1) return memo[n];          // already solved this exact subproblem
        memo[n] = climb(n - 1, memo) + climb(n - 2, memo);
        return memo[n];
    }

    /** Shape 2 - BOTTOM-UP TABLE. dp[i] = number of ways to reach step i. */
    int climbBottomUp(int n) {
        if (n <= 2) return n;
        int[] dp = new int[n + 1];        // n+1 slots because dp[0] is the empty case
        dp[1] = 1;
        dp[2] = 2;
        for (int i = 3; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }

    /** Shape 3 - ROLLING VARIABLES. Same maths, O(1) space. */
    int climbRolling(int n) {
        if (n <= 2) return n;
        int twoBack = 1, oneBack = 2;
        for (int i = 3; i <= n; i++) {
            int cur = oneBack + twoBack;
            twoBack = oneBack;
            oneBack = cur;
        }
        return oneBack;
    }

    /** Shape 4 - PICK OR SKIP. dp[i] = best using houses 0..i. House Robber. */
    int maxNonAdjacent(int[] nums) {
        int skip = 0;     // best if I do NOT take the previous house
        int take = 0;     // best if I DO
        for (int x : nums) {
            int newTake = skip + x;                  // taking means skipping the previous
            int newSkip = Math.max(skip, take);      // skipping keeps the better of the two
            take = newTake;
            skip = newSkip;
        }
        return Math.max(take, skip);
    }

    /** Shape 5 - UNBOUNDED CHOICE. dp[amount] = fewest coins to make amount. */
    int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);      // amount+1 acts as "impossible", and never overflows
        dp[0] = 0;
        for (int a = 1; a <= amount; a++) {
            for (int coin : coins) {
                if (coin <= a) dp[a] = Math.min(dp[a], dp[a - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }

    /** Shape 6 - BEST OVER ALL PAIRS. Longest increasing subsequence, O(n^2). */
    int lengthOfLis(int[] nums) {
        int[] dp = new int[nums.length];
        Arrays.fill(dp, 1);              // every element alone is a length-1 sequence
        int best = nums.length == 0 ? 0 : 1;
        for (int i = 1; i < nums.length; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
            }
            best = Math.max(best, dp[i]);
        }
        return best;
    }
}
`
};
