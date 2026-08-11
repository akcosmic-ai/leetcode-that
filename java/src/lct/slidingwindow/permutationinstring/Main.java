/*
 * Runnable driver for 567. Permutation in String.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) true
 *   2) false
 *   3) true
 */
package lct.slidingwindow.permutationinstring;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.checkInclusion("ab", "eidbaooo"));
        System.out.println(s.checkInclusion("ab", "eidboaoo"));
        System.out.println(s.checkInclusion("adc", "dcda"));
    }
}
