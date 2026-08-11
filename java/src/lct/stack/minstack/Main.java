/*
 * Runnable driver for 155. Min Stack.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) -3
 *   2) 0
 *   3) -2
 */
package lct.stack.minstack;

public class Main {
    public static void main(String[] args) {
        MinStack st = new MinStack();
        st.push(-2);
        st.push(0);
        st.push(-3);
        System.out.println(st.getMin());   // -3
        st.pop();
        System.out.println(st.top());      // 0
        System.out.println(st.getMin());   // -2
    }
}
