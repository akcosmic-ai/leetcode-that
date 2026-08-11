/*
 * TEMPLATE: Backtracking: subsets, combinations, permutations
 *
 * Choose, explore, un-choose. The un-choose line is the pattern. Combinations
 * pass a start index so each element is considered once; permutations use a
 * used[] flag so order matters. Always copy the path when you store it.
 *
 * Generated from data/templates/backtracking.js.
 */
package lct.templates.backtracking;

import java.util.*;

class BacktrackingTemplate {

    /** Shape 1 - SUBSETS. Every node of the recursion tree is an answer. */
    List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> out = new ArrayList<>();
        subsetsFrom(nums, 0, new ArrayList<>(), out);
        return out;
    }

    private void subsetsFrom(int[] nums, int start, List<Integer> path, List<List<Integer>> out) {
        out.add(new ArrayList<>(path));          // COPY: path keeps mutating underneath us
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);                   // choose
            subsetsFrom(nums, i + 1, path, out); // explore, from i+1 so nothing repeats
            path.remove(path.size() - 1);        // un-choose  <- the whole pattern
        }
    }

    /** Shape 2 - COMBINATIONS of a fixed size k. Only complete paths count. */
    List<List<Integer>> combinations(int n, int k) {
        List<List<Integer>> out = new ArrayList<>();
        combineFrom(1, n, k, new ArrayList<>(), out);
        return out;
    }

    private void combineFrom(int start, int n, int k, List<Integer> path, List<List<Integer>> out) {
        if (path.size() == k) {                  // base case: a full answer
            out.add(new ArrayList<>(path));
            return;
        }
        // PRUNE: stop when not enough numbers remain to ever reach size k
        for (int i = start; i <= n - (k - path.size()) + 1; i++) {
            path.add(i);
            combineFrom(i + 1, n, k, path, out);
            path.remove(path.size() - 1);
        }
    }

    /** Shape 3 - PERMUTATIONS. Order matters, so track what is already used. */
    List<List<Integer>> permutations(int[] nums) {
        List<List<Integer>> out = new ArrayList<>();
        permute(nums, new boolean[nums.length], new ArrayList<>(), out);
        return out;
    }

    private void permute(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> out) {
        if (path.size() == nums.length) {
            out.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < nums.length; i++) {  // start at 0 every time, no start index
            if (used[i]) continue;
            used[i] = true;
            path.add(nums[i]);
            permute(nums, used, path, out);
            path.remove(path.size() - 1);
            used[i] = false;                     // un-choose BOTH pieces of state
        }
    }

    /** Shape 4 - DUPLICATE INPUT. Sort, then skip repeats at the same depth. */
    List<List<Integer>> subsetsWithDuplicates(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> out = new ArrayList<>();
        dedupFrom(nums, 0, new ArrayList<>(), out);
        return out;
    }

    private void dedupFrom(int[] nums, int start, List<Integer> path, List<List<Integer>> out) {
        out.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            if (i > start && nums[i] == nums[i - 1]) continue;   // same value, same level: skip
            path.add(nums[i]);
            dedupFrom(nums, i + 1, path, out);
            path.remove(path.size() - 1);
        }
    }
}
