/*
 * 238. Product of Array Except Self   [Medium]
 * https://leetcode.com/problems/product-of-array-except-self/
 *
 * PATTERN: Arrays & Hashing
 *
 * For each position, return the product of every other element in the array.
 * You must not use division, and it must run in O(n).
 *
 * SIGNALS THAT POINT HERE
 * - "Everything except me" for every position, which smells like O(n²) until
 *   you split it in two.
 * - Division is explicitly banned, which is a hint that the intended solution
 *   never needed it.
 * - The answer at index i is (everything to the left) × (everything to the
 *   right). Two independent quantities, each computable in one sweep.
 *
 * COMPLEXITY
 *   time  O(n)   two sweeps over the array, no nesting and no sorting
 *   space O(1)   excluding the required output array, only one integer of extra state
 *
 * COMMON MISTAKES
 * - Computing the total product and dividing by nums[i]. Banned, and it breaks
 *   on zeros anyway: one zero makes every division either wrong or undefined.
 * - Updating suffix before using it, which includes nums[i] in its own answer.
 * - Allocating separate prefix and suffix arrays. It is correct and easier to
 *   read, but it gives up the O(1) extra space that this problem is famous
 *   for.
 * - Forgetting that out[0] must be seeded to 1 rather than left at Java's
 *   default 0, which would zero the entire result.
 *
 * FOLLOW-UPS
 * - Handle zeros with division after all: count them. Zero zeros means plain
 *   division works, one zero means only that index is non-zero, two or more
 *   means everything is zero.
 * - The same prefix/suffix split powers range-sum queries, which you will see
 *   again in DP.
 *
 * Generated from data/problems/arrays-hashing.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.arrayshashing.productofarrayexceptself;

class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] out = new int[n];

        // Pass 1, left to right: out[i] = product of everything BEFORE i.
        // Nothing sits to the left of index 0, so that product is 1.
        out[0] = 1;
        for (int i = 1; i < n; i++) {
            out[i] = out[i - 1] * nums[i - 1];
        }

        // Pass 2, right to left: fold in the product of everything AFTER i.
        // One variable is enough, so no second array is needed.
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            out[i] = out[i] * suffix;
            suffix = suffix * nums[i];   // AFTER using it, so suffix never
        }                                // includes nums[i] for index i

        return out;
    }
}
