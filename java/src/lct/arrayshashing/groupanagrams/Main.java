/*
 * Runnable driver for 49. Group Anagrams.
 *
 * Run this class. It prints one line per test case, and correct output is
 * exactly:
 *   1) [[ate, eat, tea], [bat], [nat, tan]]
 *   2) [[]]
 *   3) [[a]]
 */
package lct.arrayshashing.groupanagrams;

public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        print(s.groupAnagrams(new String[]{"eat", "tea", "tan", "ate", "nat", "bat"}));
        print(s.groupAnagrams(new String[]{""}));
        print(s.groupAnagrams(new String[]{"a"}));
    }

    // HashMap iteration order is not defined, so the driver normalises: sort
    // inside each group, then sort the groups. The SOLUTION stays untouched.
    static void print(java.util.List<java.util.List<String>> groups) {
        java.util.List<java.util.List<String>> copy = new java.util.ArrayList<>();
        for (java.util.List<String> g : groups) {
            java.util.List<String> one = new java.util.ArrayList<>(g);
            java.util.Collections.sort(one);
            copy.add(one);
        }
        copy.sort((a, b) -> String.join(",", a).compareTo(String.join(",", b)));
        System.out.println(copy);
    }
}
