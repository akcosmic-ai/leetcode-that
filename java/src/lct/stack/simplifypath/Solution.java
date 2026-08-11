/*
 * 71. Simplify Path   [Medium]
 * https://leetcode.com/problems/simplify-path/
 *
 * PATTERN: Stack & Monotonic Stack
 *
 * Turn a Unix-style absolute path into its canonical form: a single leading
 * slash, no trailing slash, no repeated slashes, . removed, and each ..
 * cancelling the directory before it.
 *
 * SIGNALS THAT POINT HERE
 * - Cancel the previous one appears again, this time as ...
 * - The result is a sequence built by pushing and popping, which is a stack
 *   even though the output is read front to back.
 * - Splitting on the delimiter first turns a fiddly character-by-character
 *   parse into a clean loop over tokens.
 *
 * COMPLEXITY
 *   time  O(n)   the split is linear, and each token is pushed or popped at most once
 *   space O(n)   the token list plus the stack of surviving directory names
 *
 * COMMON MISTAKES
 * - Popping on ".." without checking the stack is non-empty, which throws on
 *   "/../".
 * - Forgetting the empty-stack case at the end and returning "" rather than
 *   "/".
 * - Treating any token starting with a dot as special. "..." and "...a" are
 *   ordinary directory names.
 * - Joining with a separator BETWEEN names and then prepending a slash.
 *   Appending "/" + name each time is simpler and cannot produce a trailing
 *   slash.
 * - Using push/pop on the Deque and then iterating, which yields the
 *   directories in reverse order.
 *
 * FOLLOW-UPS
 * - The same stack handles relative paths if you allow leftover .. tokens to
 *   remain in the output.
 * - Score of Parentheses and Decode String are the other classic "parse with a
 *   stack" problems.
 *
 * Generated from data/problems/stack.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.stack.simplifypath;

import java.util.*;

class Solution {
    public String simplifyPath(String path) {
        // Using a Deque from the tail so that iteration comes out in path order.
        Deque<String> dirs = new ArrayDeque<>();

        // split("/") yields empty tokens for the leading slash and for any
        // repeated slashes, so skipping empties handles both cases.
        for (String part : path.split("/")) {
            if (part.isEmpty() || part.equals(".")) {
                continue;                       // "." means stay here
            }
            if (part.equals("..")) {
                if (!dirs.isEmpty()) {          // "/.." at the root is still "/"
                    dirs.pollLast();
                }
            } else {
                dirs.offerLast(part);
            }
        }

        // A leading slash before every name gives the single leading slash and
        // no trailing slash automatically.
        StringBuilder sb = new StringBuilder();
        for (String dir : dirs) {
            sb.append('/').append(dir);
        }

        return sb.length() == 0 ? "/" : sb.toString();
    }
}
