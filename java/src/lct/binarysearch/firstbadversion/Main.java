/*
 * Runnable driver for 278. First Bad Version.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 4
 *   2) 1
 *   3) 1702766719
 */
package lct.binarysearch.firstbadversion;

public class Main {
    public static void main(String[] args) {
        System.out.println(run(5, 4));
        System.out.println(run(1, 1));
        // Large n: this case fails outright if mid is computed as (lo + hi) / 2.
        System.out.println(run(2126753390, 1702766719));
    }

    static int run(int n, int firstBad) {
        Solution s = new Solution();
        s.setFirstBad(firstBad);
        return s.firstBadVersion(n);
    }
}
