/*
 * TEMPLATE: Bit manipulation: XOR, popcount, masks, subset enumeration
 *
 * Two XOR facts do most of the work: x ^ x == 0 and x ^ 0 == x. Memorise x &
 * (x - 1) (clears the lowest set bit) and x & -x (isolates it). Parenthesise
 * everything: & binds looser than ==.
 *
 * Generated from data/templates/bit-manipulation.js.
 */
package lct.templates.bitmanipulation;

class BitTemplate {

    /** Shape 1 - XOR CANCELS PAIRS. Everything twice except one loner. */
    int singleNumber(int[] nums) {
        int acc = 0;
        for (int x : nums) acc ^= x;      // pairs annihilate, the loner survives
        return acc;
    }

    /** Shape 2 - POPCOUNT by clearing the lowest set bit each time. */
    int countBits(int x) {
        int count = 0;
        while (x != 0) {
            x &= (x - 1);                 // removes exactly one set bit
            count++;
        }
        return count;                     // or just Integer.bitCount(x)
    }

    /** Shape 3 - THE MASK IDIOMS. Test, set, clear, toggle bit i. */
    boolean isBitSet(int mask, int i) { return (mask & (1 << i)) != 0; }   // parentheses matter
    int setBit(int mask, int i)       { return mask | (1 << i); }
    int clearBit(int mask, int i)     { return mask & ~(1 << i); }
    int toggleBit(int mask, int i)    { return mask ^ (1 << i); }
    int lowestSetBit(int x)           { return x & -x; }

    /** Shape 4 - POWER OF TWO. Exactly one bit set, and positive. */
    boolean isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }

    /** Shape 5 - BIT BY BIT over all 32 positions. Reversal, counting, building. */
    int reverseBits(int n) {
        int out = 0;
        for (int i = 0; i < 32; i++) {
            out <<= 1;                    // make room
            out |= (n & 1);               // take n's lowest bit
            n >>>= 1;                     // LOGICAL shift: >> would drag the sign bit along
        }
        return out;
    }

    /** Shape 6 - ENUMERATE EVERY SUBSET of n elements as a bitmask. n <= 20 or so. */
    int countSubsetsSummingTo(int[] nums, int target) {
        int n = nums.length, found = 0;
        for (int mask = 0; mask < (1 << n); mask++) {     // 2^n masks
            int sum = 0;
            for (int i = 0; i < n; i++) {
                if ((mask & (1 << i)) != 0) sum += nums[i];   // bit i means "take nums[i]"
            }
            if (sum == target) found++;
        }
        return found;
    }

    /** Shape 7 - ADD WITHOUT +. Carry is the AND, sum is the XOR. */
    int addWithoutPlus(int a, int b) {
        while (b != 0) {
            int carry = (a & b) << 1;
            a = a ^ b;
            b = carry;
        }
        return a;
    }
}
