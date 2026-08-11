/*
 * 682. Baseball Game   [Easy]
 * https://leetcode.com/problems/baseball-game/
 *
 * PATTERN: Stack & Monotonic Stack
 *
 * You are given a list of operations. A number records that score. "C" cancels
 * the previous score. "D" records double the previous score. "+" records the
 * sum of the previous two scores. Return the total of all recorded scores at
 * the end.
 *
 * SIGNALS THAT POINT HERE
 * - The word cancel, undo, or the previous one. Anything that reaches
 *   backwards into recent history.
 * - Every operation touches only the last one or two records, never the
 *   middle. That is exactly what a stack exposes.
 * - A List would also work here, and the stack vocabulary (push, pop, peek)
 *   says what you mean.
 *
 * COMPLEXITY
 *   time  O(n)   each operation does a constant amount of stack work, plus one final pass to sum
 *   space O(n)   the stack can hold every recorded score
 *
 * COMMON MISTAKES
 * - Forgetting to push the borrowed top back during "+", which silently
 *   deletes a score.
 * - Comparing the operation with == instead of .equals(). Interning makes it
 *   appear to work for literals and it is not reliable.
 * - Using Integer.parseInt on "C", "D" or "+" by testing in the wrong order.
 *   Check the three special cases first.
 * - Assuming numbers are non-negative, so a "-2" token breaks a hand-rolled
 *   parser. Integer.parseInt handles the sign.
 *
 * FOLLOW-UPS
 * - Evaluate Reverse Polish Notation (later in this pattern) is the same shape
 *   with real operators and operand order that matters.
 * - A text editor undo buffer is this exact data structure.
 *
 * Generated from data/problems/stack.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.stack.baseballgame;

import java.util.*;

class Solution {
    public int calPoints(String[] operations) {
        Deque<Integer> stack = new ArrayDeque<>();

        for (String op : operations) {
            if (op.equals("C")) {
                // Cancel the previous score: the stack IS the undo history.
                stack.pop();
            } else if (op.equals("D")) {
                stack.push(stack.peek() * 2);
            } else if (op.equals("+")) {
                // No peekSecond() exists, so borrow the top, look underneath,
                // then put the top back before pushing the new score.
                int top = stack.pop();
                int second = stack.peek();
                stack.push(top);
                stack.push(top + second);
            } else {
                stack.push(Integer.parseInt(op));
            }
        }

        int total = 0;
        for (int score : stack) {
            total += score;
        }
        return total;
    }
}
