(window.LC_TEMPLATES = window.LC_TEMPLATES || {})['two-pointers-inward'] = {
  id: 'two-pointers-inward',
  name: 'Two pointers: inward, same-direction, two-array',
  pattern: 'two-pointers',
  order: 2,
  notes: 'Inward walking is for palindromes and sorted pair-sums. Same-direction (slow writes, fast scans) is ' +
         'for in-place removal. The third shape walks two sorted arrays at once. Note that `l` and `r` each move ' +
         'only one way, which is why two pointers is still O(n).',
  code: `import java.util.*;

class TwoPointersTemplate {

    /** Shape 1 - INWARD. Compare the ends, then step inward. */
    boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            if (s.charAt(l) != s.charAt(r)) return false;
            l++;
            r--;
        }
        return true;
    }

    /** Shape 2 - INWARD ON A SORTED ARRAY. Sortedness turns a comparison into a direction. */
    int[] twoSumSorted(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l < r) {
            int sum = nums[l] + nums[r];
            if (sum == target) return new int[] { l, r };
            if (sum < target) l++;      // too small: the only way up is to raise the left value
            else r--;                   // too big: the only way down is to lower the right value
        }
        return new int[0];
    }

    /** Shape 3 - SAME DIRECTION. slow is where to write, fast is what to read. */
    int removeValue(int[] nums, int val) {
        int slow = 0;
        for (int fast = 0; fast < nums.length; fast++) {
            if (nums[fast] != val) {
                nums[slow] = nums[fast];
                slow++;
            }
        }
        return slow;                    // nums[0..slow-1] is the kept prefix
    }

    /** Shape 4 - TWO SORTED ARRAYS. One pointer each. */
    List<Integer> intersectSorted(int[] a, int[] b) {
        List<Integer> out = new ArrayList<>();
        int i = 0, j = 0;
        while (i < a.length && j < b.length) {
            if (a[i] == b[j]) {
                out.add(a[i]);
                i++;
                j++;
            } else if (a[i] < b[j]) {
                i++;
            } else {
                j++;
            }
        }
        return out;
    }

    /** Shape 5 - FIXED ONE, TWO MOVING. The 3Sum outer loop plus an inward pair. */
    List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> out = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;      // skip duplicate anchors
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    out.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    while (l < r && nums[l] == nums[l + 1]) l++;   // skip duplicate partners
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++;
                    r--;
                } else if (sum < 0) {
                    l++;
                } else {
                    r--;
                }
            }
        }
        return out;
    }
}
`
};
