/*
 * Runnable driver for 232. Implement Queue using Stacks.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) 1
 *   2) 1
 *   3) false
 */
package lct.stack.implementqueueusingstacks;

public class Main {
    public static void main(String[] args) {
        MyQueue q = new MyQueue();
        q.push(1);
        q.push(2);
        System.out.println(q.peek());    // 1
        System.out.println(q.pop());     // 1
        System.out.println(q.empty());   // false, the 2 is still queued
    }
}
