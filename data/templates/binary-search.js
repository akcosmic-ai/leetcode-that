(window.LC_TEMPLATES = window.LC_TEMPLATES || {})['binary-search'] = {
  id: 'binary-search',
  name: 'Binary search: exact, leftmost, on the answer',
  pattern: 'binary-search',
  order: 5,
  notes: 'Two loop idioms, and mixing them is the classic bug. `while (lo <= hi)` pairs with `hi = mid - 1` and ' +
         'returns from inside. `while (lo < hi)` pairs with `hi = mid` and returns `lo` at the end. The third ' +
         'shape is the one that unlocks hard problems: search the ANSWER range, not an array.',
  code: `class BinarySearchTemplate {

    /** Shape 1 - EXACT MATCH. Closed interval [lo, hi], answer returned from inside. */
    int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;      // never (lo + hi) / 2: that can overflow
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }

    /**
     * Shape 2 - LEFTMOST / LOWER BOUND. Half-open interval [lo, hi).
     * Returns the first index whose value is >= target, which is also the
     * correct insertion position when target is absent.
     */
    int lowerBound(int[] nums, int target) {
        int lo = 0, hi = nums.length;         // hi is one PAST the end here
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid;                    // mid might BE the answer, so do not exclude it
        }
        return lo;                            // lo == hi, and that is the boundary
    }

    /**
     * Shape 3 - BINARY SEARCH ON THE ANSWER. Works whenever feasible(x) is
     * false for every x below a threshold and true for every x above it.
     * Returns the smallest feasible x.
     */
    int smallestFeasible(int loGuess, int hiGuess) {
        int lo = loGuess, hi = hiGuess;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (feasible(mid)) hi = mid;      // mid works, so the answer is mid or smaller
            else lo = mid + 1;                // mid fails, so the answer is strictly bigger
        }
        return lo;
    }

    /** Replace with the problem's own check. Must be monotone in x. */
    boolean feasible(int x) {
        return x >= 42;
    }

    /** Shape 4 - ROTATED SORTED ARRAY. One half is always properly sorted. */
    int searchRotated(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;

            if (nums[lo] <= nums[mid]) {           // left half is sorted
                if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;
                else lo = mid + 1;
            } else {                               // right half is sorted
                if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return -1;
    }
}
`
};
