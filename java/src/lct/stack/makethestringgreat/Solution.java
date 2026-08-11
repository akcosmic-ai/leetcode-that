/*
 * 1544. Make The String Great   [Easy]
 * https://leetcode.com/problems/make-the-string-great/
 *
 * PATTERN: Stack & Monotonic Stack
 *
 * Repeatedly remove any two adjacent characters that are the same letter in
 * opposite cases, such as aA or Bb, until none remain. Return the result,
 * which is unique.
 *
 * SIGNALS THAT POINT HERE
 * - Repeated removal of adjacent pairs, with a cascade after each removal.
 * - You have seen this shape twice already in this pattern. The only thing
 *   that changes is the predicate.
 * - The rule is "same letter, different case", which is two conditions: not
 *   identical, and equal when lower-cased.
 *
 * COMPLEXITY
 *   time  O(n)   each character is appended at most once and deleted at most once
 *   space O(n)   the builder, which is also the output
 *
 * COMMON MISTAKES
 * - Dropping the a != b test, which makes "aa" cancel when it should not.
 * - Testing the case difference with Math.abs(a - b) == 32. It happens to be
 *   true for ASCII letters and it is a magic number that does not say what it
 *   means.
 * - Rescanning the string after each removal, which is O(n²) and misses
 *   nothing but wastes time.
 * - Forgetting the last >= 0 guard on the first character.
 *
 * FOLLOW-UPS
 * - All three builder problems in this pattern (this, Remove All Adjacent
 *   Duplicates, Backspace String Compare) are one loop with three different
 *   predicates. Try writing that loop once with the predicate passed in.
 * - Score of Parentheses uses the same stack shape but accumulates a value
 *   rather than characters.
 *
 * Generated from data/problems/stack.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.stack.makethestringgreat;

class Solution {
    public String makeGood(String s) {
        StringBuilder build = new StringBuilder();

        for (char c : s.toCharArray()) {
            int last = build.length() - 1;

            if (last >= 0 && isBadPair(build.charAt(last), c)) {
                build.deleteCharAt(last);
            } else {
                build.append(c);
            }
        }

        return build.toString();
    }

    /** Same letter, opposite case. Both halves of this test are required. */
    private boolean isBadPair(char a, char b) {
        // a != b rules out "aa", which would otherwise pass the second test.
        return a != b && Character.toLowerCase(a) == Character.toLowerCase(b);
    }
}
