/*
 * Runnable driver for 744. Find Smallest Letter Greater Than Target.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) c
 *   2) f
 *   3) x
 */
package lct.binarysearch.findsmallestlettergreaterthantarget;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.nextGreatestLetter(new char[]{'c', 'f', 'j'}, 'a'));
        System.out.println(s.nextGreatestLetter(new char[]{'c', 'f', 'j'}, 'c'));
        System.out.println(s.nextGreatestLetter(new char[]{'x', 'x', 'y', 'y'}, 'z'));
    }
}
