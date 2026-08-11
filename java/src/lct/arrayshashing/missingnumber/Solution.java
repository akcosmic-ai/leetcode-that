/*
 * 268. Missing Number   [Easy]
 * https://leetcode.com/problems/missing-number/
 *
 * PATTERN: Arrays & Hashing
 *
 * An array holds n distinct numbers taken from the range 0..n. Exactly one
 * value from that range is absent. Return it.
 *
 * SIGNALS THAT POINT HERE
 * - "Which value from a known range is absent" is a membership question.
 * - The range 0..n is given, so you can enumerate what SHOULD be there and
 *   check each one.
 * - A hash set is the obvious first answer here; the O(1)-space answers in the
 *   follow-ups are the interesting part.
 *
 * COMPLEXITY
 *   time  O(n)   one pass to build the set, at most n+1 constant-time lookups to find the gap
 *   space O(n)   the set holds all n elements. The follow-ups get this to O(1).
 *
 * COMMON MISTAKES
 * - Looping i < nums.length instead of i <= nums.length, which misses the case
 *   where n itself is the absent value. [0,1] catches this.
 * - Sorting and scanning for a gap. Correct, but O(n log n) and it mutates the
 *   input.
 * - Summing with int on very large inputs. Not a problem at n = 10^4, but the
 *   habit matters: n(n+1)/2 overflows an int around n = 65,000.
 *
 * FOLLOW-UPS
 * - Sum formula: the range 0..n sums to n(n+1)/2. Subtract the actual array
 *   sum and the difference is the missing number. O(n) time, O(1) space.
 * - XOR: XOR together every index 0..n and every value. Pairs cancel and the
 *   loner is the answer. Also O(1) space, and immune to overflow. You will
 *   meet this again in Bit Manipulation.
 *
 * Generated from data/problems/arrays-hashing.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.arrayshashing.missingnumber;

import java.util.*;

class Solution {
    public int missingNumber(int[] nums) {
        Set<Integer> present = new HashSet<>();
        for (int x : nums) {
            present.add(x);
        }

        // <= nums.length, not <. An array of length n covers the range 0..n,
        // which is n+1 candidate values, and n itself can be the missing one.
        for (int i = 0; i <= nums.length; i++) {
            if (!present.contains(i)) {
                return i;
            }
        }

        return -1;   // unreachable: exactly one value is guaranteed missing
    }
}
