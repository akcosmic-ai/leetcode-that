/*
 * Runnable driver for 1984. Minimum Difference Between Highest and Lowest of K Scores.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 0
 *   2) 2
 *   3) 74560
 */
package lct.slidingwindow.minimumdifferencekscores;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.minimumDifference(new int[]{90}, 1));
        System.out.println(s.minimumDifference(new int[]{9, 4, 1, 7}, 2));
        System.out.println(s.minimumDifference(new int[]{87063, 61094, 44530, 21297, 95857, 93551, 9918}, 6));
    }
}
