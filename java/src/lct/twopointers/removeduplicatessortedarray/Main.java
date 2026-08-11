/*
 * Runnable driver for 26. Remove Duplicates from Sorted Array.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 2 [1, 2]
 *   2) 5 [0, 1, 2, 3, 4]
 *   3) 1 [7]
 */
package lct.twopointers.removeduplicatessortedarray;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(run(s, new int[]{1, 1, 2}));
        System.out.println(run(s, new int[]{0, 0, 1, 1, 1, 2, 2, 3, 3, 4}));
        System.out.println(run(s, new int[]{7}));
    }

    static String run(Solution s, int[] nums) {
        int k = s.removeDuplicates(nums);
        int[] prefix = java.util.Arrays.copyOf(nums, k);
        return k + " " + java.util.Arrays.toString(prefix);
    }
}
