/*
 * 278. First Bad Version   [Easy]
 * https://leetcode.com/problems/first-bad-version/
 *
 * PATTERN: Binary Search
 *
 * Versions 1 through n were released in order. From some version onward every
 * version is bad. You can call isBadVersion(v) to test one. Find the first bad
 * version using as few calls as possible.
 *
 * SIGNALS THAT POINT HERE
 * - A monotone boolean: once it becomes true it never goes back to false. That
 *   is the only thing binary search needs.
 * - You are told to minimise API calls, which is a request for a logarithmic
 *   number of them.
 * - There is no array. This is the problem that shows binary search was never
 *   really about arrays.
 *
 * COMPLEXITY
 *   time  O(log n)   one API call per halving, so about 31 calls at the maximum n
 *   space O(1)   three integers
 *
 * COMMON MISTAKES
 * - Computing mid = (lo + hi) / 2. With n near 2^31 - 1 this overflows
 *   negative, and the third test case above is exactly that case.
 * - Writing hi = mid - 1 when the version is bad, which can discard the
 *   answer.
 * - Starting lo = 0. Versions are 1-based.
 * - Calling isBadVersion more than once per iteration. Store the result if you
 *   need it twice; the problem is scored on call count.
 *
 * FOLLOW-UPS
 * - Koko Eating Bananas (later in this pattern) is this same predicate search
 *   where you write isBadVersion yourself.
 * - Any monotone yes/no question over a range is binary-searchable, which is
 *   the single most transferable idea in this pattern.
 *
 * Generated from data/problems/binary-search.js by tools/export-java.mjs.
 * Do not hand-edit: edit the data file and re-run the script.
 */
package lct.binarysearch.firstbadversion;

class Solution extends VersionControl {
    public int firstBadVersion(int n) {
        // Versions are 1-based, so the range is [1, n].
        int lo = 1;
        int hi = n;

        while (lo < hi) {
            // n can be 2^31 - 1, so (lo + hi) / 2 would overflow to a negative
            // number here. This is the problem where that bug really bites.
            int mid = lo + (hi - lo) / 2;

            if (isBadVersion(mid)) {
                hi = mid;        // mid might BE the first bad version
            } else {
                lo = mid + 1;    // mid is good, so the answer is strictly right
            }
        }

        return lo;   // lo == hi, the boundary
    }
}

/* Stand-in for the API LeetCode injects. Not part of your answer. */
class VersionControl {
    private int firstBad = Integer.MAX_VALUE;

    void setFirstBad(int v) {
        firstBad = v;
    }

    boolean isBadVersion(int version) {
        return version >= firstBad;
    }
}
