/*
 * Runnable driver for 121. Best Time to Buy and Sell Stock.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 5
 *   2) 0
 *   3) 2
 */
package lct.slidingwindow.besttimetobuyandsellstock;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.maxProfit(new int[]{7, 1, 5, 3, 6, 4}));
        System.out.println(s.maxProfit(new int[]{7, 6, 4, 3, 1}));
        System.out.println(s.maxProfit(new int[]{2, 4, 1}));
    }
}
