/*
 * 20. Valid Parentheses   [Easy]
 * https://leetcode.com/problems/valid-parentheses/
 *
 * PATTERN: Stack & Monotonic Stack
 *
 * A string contains only the six bracket characters. It is valid when every
 * bracket is closed by the matching kind, in the right order, and nothing is
 * left unclosed.
 *
 * SIGNALS THAT POINT HERE
 * - Brackets, nesting, or any open/close structure.
 * - "Most recent unfinished thing must be dealt with first" is the definition
 *   of a stack.
 * - Counting alone is not enough. "([)]" has the right counts and the wrong
 *   order, which is what rules out a counter-based solution.
 *
 * COMPLEXITY
 *   time  O(n)   one pass, and each character is pushed at most once and popped at most once
 *   space O(n)   worst case every character is an opener, as in "((((("
 *
 * COMMON MISTAKES
 * - Returning true at the end instead of stack.isEmpty(). "(" is the input
 *   that catches it.
 * - Calling pop() without checking isEmpty() first. On ")" an ArrayDeque
 *   throws NoSuchElementException.
 * - Counting brackets instead of stacking them, which accepts "([)]".
 * - Comparing two boxed Character values with !=. It works for ASCII because
 *   of the Character cache, then breaks outside it.
 *
 * FOLLOW-UPS
 * - Minimum Remove to Make Valid Parentheses asks which characters to delete,
 *   so the stack holds indexes rather than characters.
 * - Longest Valid Parentheses is the same structure with a length calculation,
 *   and it is Hard.
 *
 * Generated from data/problems/stack.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.stack.validparentheses;

import java.util.*;

class Solution {
    public boolean isValid(String s) {
        // ArrayDeque is the right stack in Java: java.util.Stack works but is a
        // synchronised legacy class.
        Deque<Character> stack = new ArrayDeque<>();

        for (char c : s.toCharArray()) {
            // Push the closer we EXPECT rather than the opener itself. Then the
            // check below is one equality test with no lookup table.
            if (c == '(') {
                stack.push(')');
            } else if (c == '[') {
                stack.push(']');
            } else if (c == '{') {
                stack.push('}');
            } else {
                // A closer with nothing open.
                if (stack.isEmpty()) {
                    return false;
                }
                // Unbox to char before comparing: != on two Character objects
                // would compare references, not values.
                char expected = stack.pop();
                if (expected != c) {
                    return false;
                }
            }
        }

        // Anything left over is an unclosed opener.
        return stack.isEmpty();
    }
}
