/*
 * TEMPLATE: Stack: matching, monotonic next-greater, iterative DFS
 *
 * The monotonic stack is the one worth memorising. Read the loop as: "while
 * the thing I am holding is smaller than what just arrived, the answer for the
 * thing I am holding IS what just arrived." Push indexes, not values, whenever
 * the answer is positional.
 *
 * Generated from data/templates/stack.js.
 */
package lct.templates.stack;

import java.util.*;

class StackTemplate {

    /** Shape 1 - MATCHING. Push openers, pop and verify on closers. */
    boolean validParentheses(String s) {
        Deque<Character> st = new ArrayDeque<>();
        Map<Character, Character> closeToOpen = Map.of(')', '(', ']', '[', '}', '{');
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                st.push(c);
            } else {
                if (st.isEmpty()) return false;          // a closer with nothing to close
                char open = st.pop();                    // unbox to char BEFORE comparing:
                if (open != closeToOpen.get(c)) return false;   // != on two Characters would
            }                                            // compare references, not values
        }
        return st.isEmpty();          // leftovers mean unclosed openers
    }

    /**
     * Shape 2 - MONOTONIC (decreasing). For each element, the next strictly
     * greater element to its right, or -1.
     */
    int[] nextGreater(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n];
        Arrays.fill(answer, -1);           // default for "nothing bigger to the right"
        Deque<Integer> st = new ArrayDeque<>();   // holds INDEXES, values decreasing

        for (int i = 0; i < n; i++) {
            // everything smaller than nums[i] has just found its answer
            while (!st.isEmpty() && nums[st.peek()] < nums[i]) {
                answer[st.pop()] = nums[i];
            }
            st.push(i);
        }
        // whatever is still on the stack keeps its -1
        return answer;
    }

    /** Shape 3 - MONOTONIC (increasing), the histogram / span shape. */
    int largestRectangle(int[] heights) {
        Deque<Integer> st = new ArrayDeque<>();    // indexes, heights increasing
        int best = 0;
        for (int i = 0; i <= heights.length; i++) {
            int cur = (i == heights.length) ? 0 : heights[i];   // sentinel flushes the stack
            while (!st.isEmpty() && heights[st.peek()] >= cur) {
                int h = heights[st.pop()];
                int leftBoundary = st.isEmpty() ? -1 : st.peek();
                int width = i - leftBoundary - 1;
                best = Math.max(best, h * width);
            }
            st.push(i);
        }
        return best;
    }

    /** Shape 4 - ITERATIVE DFS. The stack replaces the call stack. */
    List<Integer> preorderIterative(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        if (root == null) return out;
        Deque<TreeNode> st = new ArrayDeque<>();
        st.push(root);
        while (!st.isEmpty()) {
            TreeNode node = st.pop();
            out.add(node.val);
            // push right first so left is processed first
            if (node.right != null) st.push(node.right);
            if (node.left != null) st.push(node.left);
        }
        return out;
    }

    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }
}
