/*
 * 150. Evaluate Reverse Polish Notation   [Medium]
 * https://leetcode.com/problems/evaluate-reverse-polish-notation/
 *
 * PATTERN: Stack & Monotonic Stack
 *
 * Evaluate an arithmetic expression written in postfix form, where each
 * operator comes after its two operands. Division truncates toward zero and
 * the expression is always valid.
 *
 * SIGNALS THAT POINT HERE
 * - Postfix, prefix, or any expression evaluation. Stack, always.
 * - Operators consume the most recent operands, which is last-in-first-out.
 * - The whole reason postfix notation exists is that it needs no brackets and
 *   no precedence rules, only a stack.
 *
 * COMPLEXITY
 *   time  O(n)   one pass; each token does a constant amount of stack work
 *   space O(n)   the stack of pending operands
 *
 * COMMON MISTAKES
 * - Getting the operand order backwards for - and /. ["4","13","5","/","+"]
 *   returns 4 instead of 6 when you do.
 * - Detecting numbers with a length check, so "-11" is treated as an operator.
 *   Test for the four operators explicitly and treat everything else as a
 *   number.
 * - Writing stack.push(stack.pop() - stack.pop()). Java evaluates left to
 *   right so this is right - left, which is wrong, and it reads as if it
 *   should work.
 * - Trying to handle operator precedence. Postfix has none; that is the entire
 *   point of the notation.
 *
 * FOLLOW-UPS
 * - Basic Calculator II handles infix with precedence, which needs either two
 *   stacks or a precedence-aware scan.
 * - The shunting-yard algorithm converts infix to postfix using a stack, and
 *   it is the other half of this story.
 *
 * Generated from data/problems/stack.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.stack.evaluatereversepolishnotation;

import java.util.*;

class Solution {
    public int evalRPN(String[] tokens) {
        Deque<Integer> stack = new ArrayDeque<>();

        for (String token : tokens) {
            switch (token) {
                // Commutative, so pop order does not matter.
                case "+":
                    stack.push(stack.pop() + stack.pop());
                    break;
                case "*":
                    stack.push(stack.pop() * stack.pop());
                    break;

                // NOT commutative. The first pop is the RIGHT operand, because
                // it was pushed most recently.
                case "-": {
                    int b = stack.pop();
                    int a = stack.pop();
                    stack.push(a - b);
                    break;
                }
                case "/": {
                    int b = stack.pop();
                    int a = stack.pop();
                    // Java integer division already truncates toward zero,
                    // which is exactly what the problem specifies.
                    stack.push(a / b);
                    break;
                }
                default:
                    stack.push(Integer.parseInt(token));
            }
        }

        // A valid expression leaves exactly one value behind.
        return stack.pop();
    }
}
