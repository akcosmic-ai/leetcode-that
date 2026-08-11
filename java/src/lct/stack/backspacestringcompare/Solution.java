/*
 * 844. Backspace String Compare   [Easy]
 * https://leetcode.com/problems/backspace-string-compare/
 *
 * PATTERN: Stack & Monotonic Stack
 *
 * Both strings are what someone typed into a text editor, where # means
 * backspace. Decide whether the two finished texts are equal. A backspace on
 * empty text does nothing.
 *
 * SIGNALS THAT POINT HERE
 * - Backspace, undo, or delete the previous character. That is a pop.
 * - Two inputs that both need the same normalisation. Write one helper and
 *   call it twice.
 * - The empty-buffer case is a real edge case, not a technicality: "a###" must
 *   not throw.
 *
 * COMPLEXITY
 *   time  O(n + m)   one pass over each string
 *   space O(n + m)   the two builders. The two-pointer version below is O(1).
 *
 * COMMON MISTAKES
 * - Popping without the empty guard, so "a###" throws.
 * - Comparing the finished strings with == instead of .equals().
 * - Trying to walk both strings forwards in one loop. The backspaces do not
 *   line up, and the code becomes far harder than two calls to one helper.
 * - Deleting from a String with substring inside the loop, which is O(n²)
 *   because strings are immutable.
 *
 * FOLLOW-UPS
 * - The stated follow-up is O(n) time and O(1) space: walk both strings from
 *   the right, and at each step skip forward over characters cancelled by
 *   pending backspaces. It is genuinely fiddly, and worth writing once.
 * - Same builder shape as Remove All Adjacent Duplicates, with a different
 *   cancel condition.
 *
 * Generated from data/problems/stack.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.stack.backspacestringcompare;

class Solution {
    public boolean backspaceCompare(String s, String t) {
        // Same normalisation on both sides, then a plain comparison.
        return build(s).equals(build(t));
    }

    /** Turns typed input into the text it actually produces. */
    private String build(String typed) {
        StringBuilder sb = new StringBuilder();

        for (char c : typed.toCharArray()) {
            if (c == '#') {
                // A backspace on empty text does nothing, so guard the pop.
                if (sb.length() > 0) {
                    sb.deleteCharAt(sb.length() - 1);
                }
            } else {
                sb.append(c);
            }
        }

        return sb.toString();
    }
}
