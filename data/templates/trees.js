(window.LC_TEMPLATES = window.LC_TEMPLATES || {})['tree-dfs'] = {
  id: 'tree-dfs',
  name: 'Trees: DFS orders, level-order BFS, BST range check',
  pattern: 'trees',
  order: 7,
  notes: 'Every recursion here starts with the null base case. The three DFS orders differ only in WHERE you ' +
         'touch the node. The BFS trick is capturing `q.size()` before the inner loop so one outer iteration ' +
         'equals exactly one level. Validating a BST needs an inherited RANGE, not a parent comparison.',
  code: `import java.util.*;

class TreesTemplate {

    /** Shape 1 - POSTORDER DFS. Children first, then combine. Height, sums, diameter. */
    int height(TreeNode node) {
        if (node == null) return 0;                 // the base case, always line one
        int left = height(node.left);
        int right = height(node.right);
        return 1 + Math.max(left, right);           // combine AFTER both children
    }

    /** Shape 1b - PREORDER DFS. Touch the node before descending. Copy, serialise. */
    void preorder(TreeNode node, List<Integer> out) {
        if (node == null) return;
        out.add(node.val);                          // node first
        preorder(node.left, out);
        preorder(node.right, out);
    }

    /** Shape 1c - INORDER DFS. On a BST this emits values in sorted order. */
    void inorder(TreeNode node, List<Integer> out) {
        if (node == null) return;
        inorder(node.left, out);
        out.add(node.val);                          // node in the middle
        inorder(node.right, out);
    }

    /** Shape 2 - LEVEL-ORDER BFS. size() is captured first so levels stay separate. */
    List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> out = new ArrayList<>();
        if (root == null) return out;

        Deque<TreeNode> q = new ArrayDeque<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();                    // exactly this level, nothing more
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                level.add(node.val);
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            out.add(level);
        }
        return out;
    }

    /**
     * Shape 3 - BST VALIDATION. The constraint is a range handed down the tree.
     * Long bounds so that a node holding Integer.MIN_VALUE still works.
     */
    boolean isValidBst(TreeNode node, long min, long max) {
        if (node == null) return true;
        if (node.val <= min || node.val >= max) return false;
        return isValidBst(node.left, min, node.val)
            && isValidBst(node.right, node.val, max);
    }

    /** Shape 4 - BST SEARCH. Use the ordering; never scan the whole tree. */
    TreeNode searchBst(TreeNode node, int target) {
        while (node != null && node.val != target) {
            node = target < node.val ? node.left : node.right;
        }
        return node;
    }

    /** Shape 5 - GLOBAL ANSWER, LOCAL RETURN. Diameter is the classic example. */
    private int best = 0;

    int diameter(TreeNode root) {
        best = 0;
        depth(root);
        return best;
    }

    private int depth(TreeNode node) {
        if (node == null) return 0;
        int l = depth(node.left);
        int r = depth(node.right);
        best = Math.max(best, l + r);      // the answer THROUGH this node
        return 1 + Math.max(l, r);         // what the parent needs to hear
    }

    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }
}
`
};
