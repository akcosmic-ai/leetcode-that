(window.LC_TEMPLATES = window.LC_TEMPLATES || {})['trie'] = {
  id: 'trie',
  name: 'Trie: insert, search, startsWith',
  pattern: 'tries',
  order: 8,
  notes: 'The node is the whole idea: 26 child slots plus a boolean saying a word ENDS here. `search` and ' +
         '`startsWith` differ by exactly that boolean. Cost depends on word length, never on how many words ' +
         'are stored.',
  code: `class TrieTemplate {

    static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isWord = false;              // "a complete word ends at this node"
    }

    private final TrieNode root = new TrieNode();

    /** Walk down, creating nodes as needed, then mark the end. */
    void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) node.children[i] = new TrieNode();
            node = node.children[i];
        }
        node.isWord = true;                  // forget this line and nothing is ever found
    }

    /** The path exists AND a word ends there. */
    boolean search(String word) {
        TrieNode node = walk(word);
        return node != null && node.isWord;
    }

    /** The path exists. Whether a word ends there is irrelevant. */
    boolean startsWith(String prefix) {
        return walk(prefix) != null;
    }

    /** Shared descent. Returns null the moment the path breaks. */
    private TrieNode walk(String s) {
        TrieNode node = root;
        for (char c : s.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) return null;
            node = node.children[i];
        }
        return node;
    }

    /**
     * Recursive variant, which is what wildcard matching and grid word-search
     * build on: at a '.' you must try every child.
     */
    boolean matchWithDots(String pattern) {
        return match(root, pattern, 0);
    }

    private boolean match(TrieNode node, String p, int idx) {
        if (node == null) return false;
        if (idx == p.length()) return node.isWord;

        char c = p.charAt(idx);
        if (c == '.') {
            for (TrieNode child : node.children) {
                if (match(child, p, idx + 1)) return true;
            }
            return false;
        }
        return match(node.children[c - 'a'], p, idx + 1);
    }
}
`
};
