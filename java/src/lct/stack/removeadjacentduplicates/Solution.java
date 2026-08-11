/*
 * 1047. Remove All Adjacent Duplicates In String   [Easy]
 * https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/
 *
 * PATTERN: Stack & Monotonic Stack
 *
 * Repeatedly delete any two adjacent equal characters until no such pair
 * remains. Return the resulting string. The answer is unique regardless of the
 * order you delete in.
 *
 * SIGNALS THAT POINT HERE
 * - Repeatedly remove adjacent pairs until stable. The cascading removals are
 *   the tell.
 * - Deleting "bb" can create a brand new adjacency between characters that
 *   were not neighbours before. Only a stack notices that for free.
 * - The result is built left to right and you only ever inspect its last
 *   character, which is exactly a stack.
 *
 * COMPLEXITY
 *   time  O(n)   each character is appended at most once and deleted at most once
 *   space O(n)   the builder, which is also the output
 *
 * COMMON MISTAKES
 * - Repeatedly calling replace or restarting the scan after each deletion.
 *   That is O(n²) and times out at n = 10^5.
 * - Forgetting the last >= 0 guard, so charAt(-1) throws on the very first
 *   character.
 * - Using a Deque<Character> and then having to reverse it to build the
 *   string. A StringBuilder is already in the right order.
 * - Removing only the pairs present in the original string, missing the
 *   cascade in "abba".
 *
 * FOLLOW-UPS
 * - Remove All Adjacent Duplicates II removes runs of exactly k, so the stack
 *   holds character-and-count pairs.
 * - Make The String Great (next) is the same builder with a different
 *   cancellation rule.
 *
 * Generated from data/problems/stack.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.stack.removeadjacentduplicates;

class Solution {
    public String removeDuplicates(String s) {
        // StringBuilder used as a stack: append is push, charAt(len-1) is peek,
        // deleteCharAt(len-1) is pop. It also avoids converting at the end.
        StringBuilder build = new StringBuilder();

        for (char c : s.toCharArray()) {
            int last = build.length() - 1;

            if (last >= 0 && build.charAt(last) == c) {
                // The pair cancels. Removing it may expose a NEW adjacency, and
                // the next iteration sees that automatically.
                build.deleteCharAt(last);
            } else {
                build.append(c);
            }
        }

        return build.toString();
    }
}
