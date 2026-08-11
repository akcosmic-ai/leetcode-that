/*
 * 283. Move Zeroes   [Easy]
 * https://leetcode.com/problems/move-zeroes/
 *
 * PATTERN: Two Pointers
 *
 * Move every zero to the end of the array while keeping the non-zero values in
 * their original relative order. Do it in place.
 *
 * SIGNALS THAT POINT HERE
 * - Partition into "keep these" and "shove those to the end", with the order
 *   of the kept ones preserved.
 * - In place, so no output array.
 * - Same skeleton as Remove Duplicates: one pointer decides where kept values
 *   land, the other scans.
 *
 * COMPLEXITY
 *   time  O(n)   one pass, with at most one swap per element
 *   space O(1)   two indexes and a temporary
 *
 * COMMON MISTAKES
 * - Advancing write on every iteration instead of only when a value is kept.
 *   Then it just tracks read and nothing moves.
 * - Swapping the non-zero values with each other and destroying the required
 *   stable order, usually by pairing a front pointer with a back pointer.
 * - Copying forwards and forgetting the second loop that zero-fills the tail.
 *   Swapping avoids needing that loop at all.
 * - Removing and re-adding elements in a List, which is O(n²) because of the
 *   shifting.
 *
 * FOLLOW-UPS
 * - Sort Colors (later in this pattern) is the three-way version of this
 *   partition.
 * - If order did not matter, you could swap from both ends and finish in fewer
 *   writes.
 *
 * Generated from data/problems/two-pointers.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.twopointers.movezeroes;

class Solution {
    public void moveZeroes(int[] nums) {
        int write = 0;   // next slot that should hold a non-zero value

        for (int read = 0; read < nums.length; read++) {
            if (nums[read] != 0) {
                // Swap rather than copy. Whatever sits at write is either a zero
                // or read itself, so the zeros drift to the back with no second pass.
                int tmp = nums[write];
                nums[write] = nums[read];
                nums[read] = tmp;

                write++;
            }
        }
    }
}
