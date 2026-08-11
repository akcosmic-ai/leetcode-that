/* java-api.js :: the dictionary behind the editor's suggestions.
 *
 * HONEST SCOPE: there is no Java compiler in the browser. This is a curated
 * dictionary of the JDK surface you actually touch in DSA work, plus a type
 * guesser that reads your own declarations out of the buffer. It will suggest
 * methods that exist and (usually) the right ones for the receiver. It will NOT
 * catch type errors, and it does not know about anything not listed here.
 *
 * Adding a method = adding one line. sig is what you see in the popup.
 */
(function (w) {
  'use strict';

  function m(name, sig, ret, doc) { return { name: name, sig: sig, ret: ret, doc: doc, kind: 'method' }; }
  function f(name, ret, doc) { return { name: name, sig: name, ret: ret, doc: doc, kind: 'field' }; }

  var ITERABLE = [
    m('iterator', 'iterator()', 'Iterator<E>', 'Explicit iterator, needed for remove-while-looping.'),
    m('forEach', 'forEach(Consumer<E> action)', 'void', 'Loop with a lambda.'),
    m('stream', 'stream()', 'Stream<E>', 'Start a stream pipeline.')
  ];
  var COLLECTION = [
    m('size', 'size()', 'int', 'Number of elements.'),
    m('isEmpty', 'isEmpty()', 'boolean', 'True when size() == 0. Prefer this over size() == 0.'),
    m('contains', 'contains(Object o)', 'boolean', 'Membership test. O(1) for HashSet, O(n) for a List.'),
    m('clear', 'clear()', 'void', 'Remove everything.'),
    m('addAll', 'addAll(Collection<E> c)', 'boolean', 'Append everything from c.'),
    m('toArray', 'toArray(new T[0])', 'T[]', 'Copy into a typed array.')
  ].concat(ITERABLE);

  var classes = {

    Map: { doc: 'Key to value. HashMap = O(1) average, TreeMap = O(log n) and sorted by key.', members: [
      m('put', 'put(K key, V value)', 'V', 'Insert or overwrite. Returns the OLD value, or null.'),
      m('get', 'get(Object key)', 'V', 'Value or null. Null is the classic NPE source when you unbox to int.'),
      m('getOrDefault', 'getOrDefault(Object key, V dflt)', 'V', 'The counting idiom: map.getOrDefault(c, 0) + 1.'),
      m('containsKey', 'containsKey(Object key)', 'boolean', 'Key present? O(1) for HashMap.'),
      m('containsValue', 'containsValue(Object v)', 'boolean', 'Scans every value. O(n).'),
      m('putIfAbsent', 'putIfAbsent(K key, V value)', 'V', 'Only writes when the key is missing.'),
      m('computeIfAbsent', 'computeIfAbsent(K key, k -> new ArrayList<>())', 'V', 'Build-a-bucket idiom for grouping and adjacency lists.'),
      m('merge', 'merge(K key, V value, (a,b) -> a+b)', 'V', 'Counting without getOrDefault: merge(c, 1, Integer::sum).'),
      m('remove', 'remove(Object key)', 'V', 'Delete the entry, return what was there.'),
      m('keySet', 'keySet()', 'Set<K>', 'Live view of the keys.'),
      m('values', 'values()', 'Collection<V>', 'Live view of the values.'),
      m('entrySet', 'entrySet()', 'Set<Map.Entry<K,V>>', 'Loop keys and values together: for (Map.Entry<K,V> e : map.entrySet()).'),
      m('size', 'size()', 'int', 'Number of entries.'),
      m('isEmpty', 'isEmpty()', 'boolean', 'True when there are no entries.'),
      m('clear', 'clear()', 'void', 'Remove everything.'),
      m('forEach', 'forEach((k,v) -> ...)', 'void', 'Loop with a lambda.')
    ]},

    TreeMap: { extends: 'Map', doc: 'Sorted map, O(log n). Use it when you need nearest-key queries.', members: [
      m('firstKey', 'firstKey()', 'K', 'Smallest key. Throws if empty.'),
      m('lastKey', 'lastKey()', 'K', 'Largest key.'),
      m('firstEntry', 'firstEntry()', 'Map.Entry<K,V>', 'Smallest entry, or null when empty.'),
      m('lastEntry', 'lastEntry()', 'Map.Entry<K,V>', 'Largest entry, or null when empty.'),
      m('floorKey', 'floorKey(K k)', 'K', 'Greatest key <= k. The interval-search workhorse.'),
      m('ceilingKey', 'ceilingKey(K k)', 'K', 'Least key >= k.'),
      m('lowerKey', 'lowerKey(K k)', 'K', 'Greatest key strictly < k.'),
      m('higherKey', 'higherKey(K k)', 'K', 'Least key strictly > k.'),
      m('floorEntry', 'floorEntry(K k)', 'Map.Entry<K,V>', 'Entry for floorKey.'),
      m('ceilingEntry', 'ceilingEntry(K k)', 'Map.Entry<K,V>', 'Entry for ceilingKey.'),
      m('pollFirstEntry', 'pollFirstEntry()', 'Map.Entry<K,V>', 'Remove and return the smallest entry.'),
      m('headMap', 'headMap(K to)', 'SortedMap<K,V>', 'View of keys < to.'),
      m('tailMap', 'tailMap(K from)', 'SortedMap<K,V>', 'View of keys >= from.'),
      m('subMap', 'subMap(K from, K to)', 'SortedMap<K,V>', 'View of [from, to).'),
      m('descendingMap', 'descendingMap()', 'NavigableMap<K,V>', 'Reversed view.')
    ]},

    Set: { doc: 'Unique elements. HashSet = O(1) average, TreeSet = O(log n) and sorted.', members: [
      m('add', 'add(E e)', 'boolean', 'Returns FALSE when it was already there. That return value is the duplicate check.'),
      m('remove', 'remove(Object o)', 'boolean', 'Delete, true when it was present.'),
      m('retainAll', 'retainAll(Collection<?> c)', 'boolean', 'Intersection, in place.'),
      m('removeAll', 'removeAll(Collection<?> c)', 'boolean', 'Difference, in place.')
    ].concat(COLLECTION)},

    TreeSet: { extends: 'Set', doc: 'Sorted set, O(log n). Nearest-value queries.', members: [
      m('first', 'first()', 'E', 'Smallest. Throws if empty.'),
      m('last', 'last()', 'E', 'Largest.'),
      m('floor', 'floor(E e)', 'E', 'Greatest element <= e, else null.'),
      m('ceiling', 'ceiling(E e)', 'E', 'Least element >= e, else null.'),
      m('lower', 'lower(E e)', 'E', 'Greatest element strictly < e.'),
      m('higher', 'higher(E e)', 'E', 'Least element strictly > e.'),
      m('pollFirst', 'pollFirst()', 'E', 'Remove and return the smallest.'),
      m('pollLast', 'pollLast()', 'E', 'Remove and return the largest.'),
      m('headSet', 'headSet(E to)', 'SortedSet<E>', 'View of elements < to.'),
      m('tailSet', 'tailSet(E from)', 'SortedSet<E>', 'View of elements >= from.'),
      m('descendingSet', 'descendingSet()', 'NavigableSet<E>', 'Reversed view.')
    ]},

    List: { doc: 'Ordered, indexable, duplicates allowed. ArrayList is the default choice.', members: [
      m('add', 'add(E e)', 'boolean', 'Append. Amortised O(1).'),
      m('get', 'get(int index)', 'E', 'Random access, O(1) on ArrayList.'),
      m('set', 'set(int index, E e)', 'E', 'Overwrite at index, returns the old value.'),
      m('remove', 'remove(int index)', 'E', 'Careful: remove(int) is by INDEX, remove(Object) is by value.'),
      m('indexOf', 'indexOf(Object o)', 'int', 'First position, or -1. O(n).'),
      m('subList', 'subList(int from, int to)', 'List<E>', 'View of [from, to). Backed by the original.'),
      m('sort', 'sort(Comparator<E> c)', 'void', 'In-place sort. Pass null for natural order.'),
      m('add', 'add(int index, E e)', 'void', 'Insert, shifting the rest right. O(n).')
    ].concat(COLLECTION)},

    Deque: { doc: 'Double-ended queue. ArrayDeque is the right stack AND the right queue in Java.', members: [
      m('push', 'push(E e)', 'void', 'Stack push = addFirst.'),
      m('pop', 'pop()', 'E', 'Stack pop = removeFirst. THROWS when empty.'),
      m('peek', 'peek()', 'E', 'Look at the head without removing. null when empty.'),
      m('offer', 'offer(E e)', 'boolean', 'Queue enqueue = addLast.'),
      m('poll', 'poll()', 'E', 'Queue dequeue = removeFirst. null when empty.'),
      m('addFirst', 'addFirst(E e)', 'void', 'Push onto the front.'),
      m('addLast', 'addLast(E e)', 'void', 'Append to the back.'),
      m('offerFirst', 'offerFirst(E e)', 'boolean', 'addFirst that returns a flag instead of throwing.'),
      m('offerLast', 'offerLast(E e)', 'boolean', 'addLast that returns a flag instead of throwing.'),
      m('pollFirst', 'pollFirst()', 'E', 'Remove from the front, null when empty.'),
      m('pollLast', 'pollLast()', 'E', 'Remove from the back, null when empty. The monotonic-deque move.'),
      m('peekFirst', 'peekFirst()', 'E', 'Front element, null when empty.'),
      m('peekLast', 'peekLast()', 'E', 'Back element, null when empty. The monotonic-deque compare.'),
      m('descendingIterator', 'descendingIterator()', 'Iterator<E>', 'Walk back to front.')
    ].concat(COLLECTION)},

    Queue: { doc: 'FIFO. In practice: Deque q = new ArrayDeque<>().', members: [
      m('offer', 'offer(E e)', 'boolean', 'Enqueue.'),
      m('poll', 'poll()', 'E', 'Dequeue, null when empty.'),
      m('peek', 'peek()', 'E', 'Head without removing, null when empty.')
    ].concat(COLLECTION)},

    PriorityQueue: { doc: 'Binary heap. Min-heap by default. offer/poll are O(log n), peek is O(1).', members: [
      m('offer', 'offer(E e)', 'boolean', 'Insert, O(log n).'),
      m('poll', 'poll()', 'E', 'Remove and return the smallest (or the comparator-first), null when empty.'),
      m('peek', 'peek()', 'E', 'Smallest without removing, O(1).'),
      m('remove', 'remove(Object o)', 'boolean', 'Delete an arbitrary element. O(n), it has to search.'),
      m('size', 'size()', 'int', 'Element count. Your "keep only k" check.'),
      m('isEmpty', 'isEmpty()', 'boolean', 'Empty test.'),
      m('clear', 'clear()', 'void', 'Remove everything.')
    ]},

    Stack: { doc: 'Legacy synchronised class. Works, but ArrayDeque is faster and preferred.', members: [
      m('push', 'push(E e)', 'E', 'Add on top.'),
      m('pop', 'pop()', 'E', 'Remove the top. Throws EmptyStackException when empty.'),
      m('peek', 'peek()', 'E', 'Top without removing. Throws when empty.'),
      m('isEmpty', 'isEmpty()', 'boolean', 'Always guard pop/peek with this.'),
      m('size', 'size()', 'int', 'Element count.'),
      m('search', 'search(Object o)', 'int', '1-based distance from the top, or -1.')
    ]},

    StringBuilder: { doc: 'Mutable string. Build with append, never with += in a loop.', members: [
      m('append', 'append(x)', 'StringBuilder', 'Chainable. Takes any type.'),
      m('toString', 'toString()', 'String', 'Materialise the result.'),
      m('reverse', 'reverse()', 'StringBuilder', 'In-place reverse. Chainable.'),
      m('length', 'length()', 'int', 'Current character count.'),
      m('charAt', 'charAt(int i)', 'char', 'Character at i.'),
      m('setCharAt', 'setCharAt(int i, char c)', 'void', 'Overwrite one character.'),
      m('deleteCharAt', 'deleteCharAt(int i)', 'StringBuilder', 'The backtracking undo: deleteCharAt(sb.length()-1).'),
      m('setLength', 'setLength(int n)', 'void', 'Truncate. Cheap undo for backtracking.'),
      m('insert', 'insert(int i, x)', 'StringBuilder', 'Insert at position i.'),
      m('indexOf', 'indexOf(String s)', 'int', 'First occurrence, or -1.')
    ]},

    String: { doc: 'Immutable. Every "modification" allocates a new String.', members: [
      m('length', 'length()', 'int', 'Character count. Note: a method, not a field, unlike arrays.'),
      m('charAt', 'charAt(int i)', 'char', 'Character at i. Throws on out of range.'),
      m('substring', 'substring(int from, int to)', 'String', '[from, to). One arg = to the end.'),
      m('indexOf', 'indexOf(String s)', 'int', 'First position, or -1.'),
      m('lastIndexOf', 'lastIndexOf(String s)', 'int', 'Last position, or -1.'),
      m('contains', 'contains(CharSequence s)', 'boolean', 'Substring test.'),
      m('equals', 'equals(Object o)', 'boolean', 'Content comparison. NEVER use == on Strings.'),
      m('equalsIgnoreCase', 'equalsIgnoreCase(String s)', 'boolean', 'Case-insensitive comparison.'),
      m('compareTo', 'compareTo(String s)', 'int', 'Lexicographic order, negative/zero/positive.'),
      m('toCharArray', 'toCharArray()', 'char[]', 'Copy to a mutable array. Sort it for anagram keys.'),
      m('split', 'split(String regex)', 'String[]', 'Regex split. split(" ") vs split("\\\\s+") matter.'),
      m('trim', 'trim()', 'String', 'Strip leading/trailing whitespace.'),
      m('strip', 'strip()', 'String', 'Unicode-aware trim (Java 11+).'),
      m('toLowerCase', 'toLowerCase()', 'String', 'Lowercase copy.'),
      m('toUpperCase', 'toUpperCase()', 'String', 'Uppercase copy.'),
      m('startsWith', 'startsWith(String p)', 'boolean', 'Prefix test.'),
      m('endsWith', 'endsWith(String s)', 'boolean', 'Suffix test.'),
      m('isEmpty', 'isEmpty()', 'boolean', 'length() == 0.'),
      m('isBlank', 'isBlank()', 'boolean', 'Empty or whitespace only (Java 11+).'),
      m('replace', 'replace(CharSequence a, CharSequence b)', 'String', 'Literal replace, returns a copy.'),
      m('repeat', 'repeat(int n)', 'String', 'Java 11+.'),
      m('chars', 'chars()', 'IntStream', 'Stream of code points.')
    ]},

    Iterator: { doc: 'Cursor over a collection. The only safe way to remove while looping.', members: [
      m('hasNext', 'hasNext()', 'boolean', 'More elements?'),
      m('next', 'next()', 'E', 'Advance and return.'),
      m('remove', 'remove()', 'void', 'Delete the element next() just returned.')
    ]},

    Entry: { doc: 'One key/value pair from map.entrySet().', members: [
      m('getKey', 'getKey()', 'K', 'The key.'),
      m('getValue', 'getValue()', 'V', 'The value.'),
      m('setValue', 'setValue(V v)', 'V', 'Write through to the map.')
    ]},

    Comparator: { doc: 'Ordering rule. Lambdas everywhere: (a,b) -> a - b.', members: [
      m('reversed', 'reversed()', 'Comparator<T>', 'Flip the order. Max-heap in one call.'),
      m('thenComparing', 'thenComparing(keyExtractor)', 'Comparator<T>', 'Tie-breaker.'),
      m('compare', 'compare(T a, T b)', 'int', 'Negative when a comes first.')
    ]},

    TreeNode: { doc: 'LeetCode binary tree node.', members: [
      f('val', 'int', 'Value at this node.'),
      f('left', 'TreeNode', 'Left child, null when absent.'),
      f('right', 'TreeNode', 'Right child, null when absent.')
    ]},

    ListNode: { doc: 'LeetCode singly linked list node.', members: [
      f('val', 'int', 'Value at this node.'),
      f('next', 'ListNode', 'Next node, null at the tail.')
    ]},

    array: { doc: 'Java array. Fixed length, and length is a FIELD not a method.', members: [
      f('length', 'int', 'Element count. No parentheses: nums.length, not nums.length().'),
      m('clone', 'clone()', 'T[]', 'Shallow copy.')
    ]}
  };

  /* Concrete class -> the entry in `classes` that describes it. */
  var aliases = {
    HashMap: 'Map', LinkedHashMap: 'Map', Hashtable: 'Map', NavigableMap: 'TreeMap', SortedMap: 'TreeMap',
    HashSet: 'Set', LinkedHashSet: 'Set', NavigableSet: 'TreeSet', SortedSet: 'TreeSet',
    ArrayList: 'List', LinkedList: 'Deque', Vector: 'List',
    ArrayDeque: 'Deque',
    'Map.Entry': 'Entry',
    CharSequence: 'String', StringBuffer: 'StringBuilder'
  };

  /* Static members, keyed by the class you type before the dot. */
  var statics = {
    Math: [
      m('max', 'max(a, b)', 'T', 'Larger of two. Overloaded for int/long/double.'),
      m('min', 'min(a, b)', 'T', 'Smaller of two.'),
      m('abs', 'abs(x)', 'T', 'Absolute value. Watch Math.abs(Integer.MIN_VALUE) staying negative.'),
      m('pow', 'pow(double a, double b)', 'double', 'a^b as a double. Cast carefully.'),
      m('sqrt', 'sqrt(double x)', 'double', 'Square root.'),
      m('floor', 'floor(double x)', 'double', 'Round down.'),
      m('ceil', 'ceil(double x)', 'double', 'Round up.'),
      m('round', 'round(double x)', 'long', 'Nearest, half up.'),
      m('floorDiv', 'floorDiv(int a, int b)', 'int', 'Division that rounds toward negative infinity.'),
      m('floorMod', 'floorMod(int a, int b)', 'int', 'Modulo that is never negative. Use for circular indexes.'),
      m('hypot', 'hypot(double a, double b)', 'double', 'sqrt(a*a + b*b) without overflow.')
    ],
    Arrays: [
      m('sort', 'sort(int[] a)', 'void', 'Dual-pivot quicksort for primitives, O(n log n).'),
      m('sort', 'sort(T[] a, Comparator<T> c)', 'void', 'Comparator sort. Needs a boxed array, e.g. Integer[].'),
      m('fill', 'fill(int[] a, int v)', 'void', 'Set every slot. Arrays.fill(dp, -1) for memoisation.'),
      m('copyOf', 'copyOf(int[] a, int newLen)', 'int[]', 'Padded or truncated copy.'),
      m('copyOfRange', 'copyOfRange(int[] a, int from, int to)', 'int[]', 'Copy of [from, to).'),
      m('asList', 'asList(T... a)', 'List<T>', 'Fixed-size List view. add() throws.'),
      m('toString', 'toString(int[] a)', 'String', 'Printable 1-D array. Debugging staple.'),
      m('deepToString', 'deepToString(Object[] a)', 'String', 'Printable 2-D array.'),
      m('binarySearch', 'binarySearch(int[] a, int key)', 'int', 'Index, or -(insertionPoint)-1 when absent.'),
      m('equals', 'equals(int[] a, int[] b)', 'boolean', 'Element-wise comparison. == compares references.'),
      m('stream', 'stream(int[] a)', 'IntStream', 'For sum(), max(), boxed().'),
      m('setAll', 'setAll(int[] a, i -> i)', 'void', 'Fill from a function of the index.')
    ],
    Collections: [
      m('sort', 'sort(List<T> list)', 'void', 'Natural order, in place.'),
      m('reverse', 'reverse(List<?> list)', 'void', 'Flip in place.'),
      m('swap', 'swap(List<?> l, int i, int j)', 'void', 'Exchange two positions.'),
      m('max', 'max(Collection<T> c)', 'T', 'Largest element.'),
      m('min', 'min(Collection<T> c)', 'T', 'Smallest element.'),
      m('nCopies', 'nCopies(int n, T o)', 'List<T>', 'Immutable list of n identical items.'),
      m('emptyList', 'emptyList()', 'List<T>', 'Immutable empty list.'),
      m('singletonList', 'singletonList(T o)', 'List<T>', 'Immutable one-element list.'),
      m('frequency', 'frequency(Collection<?> c, Object o)', 'int', 'How many times o appears.'),
      m('unmodifiableList', 'unmodifiableList(List<T> l)', 'List<T>', 'Read-only view.')
    ],
    Integer: [
      f('MAX_VALUE', 'int', '2147483647. Your "infinity" for minimisation.'),
      f('MIN_VALUE', 'int', '-2147483648. Your "negative infinity". Note abs() of it overflows.'),
      m('parseInt', 'parseInt(String s)', 'int', 'Throws NumberFormatException on junk.'),
      m('valueOf', 'valueOf(int i)', 'Integer', 'Boxing. Caches -128..127, which is why == sometimes "works".'),
      m('toBinaryString', 'toBinaryString(int i)', 'String', 'Bit-manipulation debugging.'),
      m('bitCount', 'bitCount(int i)', 'int', 'Number of set bits. Population count.'),
      m('compare', 'compare(int a, int b)', 'int', 'Overflow-safe comparison. Use in comparators instead of a - b.'),
      m('highestOneBit', 'highestOneBit(int i)', 'int', 'Largest power of two <= i.'),
      m('numberOfTrailingZeros', 'numberOfTrailingZeros(int i)', 'int', 'Index of the lowest set bit.'),
      m('reverse', 'reverse(int i)', 'int', 'Reverse the 32 bits.'),
      m('max', 'max(int a, int b)', 'int', 'Same as Math.max, handy as a method reference Integer::max.'),
      m('sum', 'sum(int a, int b)', 'int', 'Method reference for merge: Integer::sum.')
    ],
    Character: [
      m('isDigit', 'isDigit(char c)', 'boolean', '0-9.'),
      m('isLetter', 'isLetter(char c)', 'boolean', 'Unicode letter.'),
      m('isLetterOrDigit', 'isLetterOrDigit(char c)', 'boolean', 'The valid-palindrome filter.'),
      m('isWhitespace', 'isWhitespace(char c)', 'boolean', 'Spaces, tabs, newlines.'),
      m('isUpperCase', 'isUpperCase(char c)', 'boolean', 'Uppercase test.'),
      m('isLowerCase', 'isLowerCase(char c)', 'boolean', 'Lowercase test.'),
      m('toLowerCase', 'toLowerCase(char c)', 'char', 'Lowercased character.'),
      m('toUpperCase', 'toUpperCase(char c)', 'char', 'Uppercased character.'),
      m('getNumericValue', 'getNumericValue(char c)', 'int', "Digit value. Or just c - '0'.")
    ],
    Long: [
      f('MAX_VALUE', 'long', '9223372036854775807. Use when int would overflow.'),
      f('MIN_VALUE', 'long', 'Smallest long.'),
      m('parseLong', 'parseLong(String s)', 'long', 'String to long.')
    ],
    Comparator: [
      m('comparingInt', 'comparingInt(x -> x.field)', 'Comparator<T>', 'Sort by an int key. No boxing.'),
      m('comparing', 'comparing(x -> x.field)', 'Comparator<T>', 'Sort by any Comparable key.'),
      m('comparingDouble', 'comparingDouble(x -> x.d)', 'Comparator<T>', 'Sort by a double key.'),
      m('naturalOrder', 'naturalOrder()', 'Comparator<T>', 'Ascending.'),
      m('reverseOrder', 'reverseOrder()', 'Comparator<T>', 'Descending. Max-heap in one call.')
    ],
    List: [ m('of', 'of(E... e)', 'List<E>', 'Immutable list literal (Java 9+).') ],
    Set:  [ m('of', 'of(E... e)', 'Set<E>', 'Immutable set literal (Java 9+).') ],
    Map:  [ m('of', 'of(k1,v1, k2,v2)', 'Map<K,V>', 'Immutable map literal (Java 9+).'),
            m('entry', 'entry(K k, V v)', 'Map.Entry<K,V>', 'One immutable pair.') ],
    String: [ m('valueOf', 'valueOf(x)', 'String', 'Anything to String, null-safe.'),
              m('join', 'join(CharSequence sep, Iterable<CharSequence> parts)', 'String', 'Glue with a separator.'),
              m('format', 'format(String fmt, Object... args)', 'String', 'printf-style formatting.') ],
    Objects: [ m('equals', 'equals(Object a, Object b)', 'boolean', 'Null-safe equality.'),
               m('hash', 'hash(Object... values)', 'int', 'Combine fields into a hash code.') ]
  };

  var keywords = ('abstract assert boolean break byte case catch char class continue default do double else ' +
    'enum extends final finally float for if implements import instanceof int interface long new package ' +
    'private protected public return short static super switch this throw throws try void while ' +
    'true false null var').split(' ');

  var topLevelTypes = ('String StringBuilder Integer Long Double Character Boolean Math Arrays Collections ' +
    'Comparator Objects List ArrayList LinkedList Map HashMap TreeMap LinkedHashMap Set HashSet TreeSet ' +
    'LinkedHashSet Deque ArrayDeque Queue PriorityQueue Stack Iterator Optional TreeNode ListNode Node ' +
    'Solution Object Exception').split(' ');

  /* Multi-line skeletons. |CURSOR| marks where the caret lands. */
  var snippets = [
    { label: 'fori', detail: 'index loop', body: 'for (int i = 0; i < |CURSOR|; i++) {\n    \n}' },
    { label: 'forr', detail: 'reverse index loop', body: 'for (int i = |CURSOR| - 1; i >= 0; i--) {\n    \n}' },
    { label: 'foreach', detail: 'enhanced for', body: 'for (int x : |CURSOR|) {\n    \n}' },
    { label: 'forentry', detail: 'loop a map', body: 'for (Map.Entry<Integer, Integer> e : |CURSOR|.entrySet()) {\n    \n}' },
    { label: 'forchar', detail: 'loop a string', body: 'for (char c : s.toCharArray()) {\n    |CURSOR|\n}' },
    { label: 'while', detail: 'while loop', body: 'while (|CURSOR|) {\n    \n}' },
    { label: 'ifelse', detail: 'if / else', body: 'if (|CURSOR|) {\n    \n} else {\n    \n}' },
    { label: 'sout', detail: 'print (debugging)', body: 'System.out.println(|CURSOR|);' },
    { label: 'main', detail: 'main method for local testing', body: 'public static void main(String[] args) {\n    |CURSOR|\n}' },
    { label: 'map', detail: 'HashMap declaration', body: 'Map<Integer, Integer> |CURSOR| = new HashMap<>();' },
    { label: 'set', detail: 'HashSet declaration', body: 'Set<Integer> |CURSOR| = new HashSet<>();' },
    { label: 'list', detail: 'ArrayList declaration', body: 'List<Integer> |CURSOR| = new ArrayList<>();' },
    { label: 'deque', detail: 'ArrayDeque (stack or queue)', body: 'Deque<Integer> |CURSOR| = new ArrayDeque<>();' },
    { label: 'minheap', detail: 'min-heap', body: 'PriorityQueue<Integer> pq = new PriorityQueue<>();|CURSOR|' },
    { label: 'maxheap', detail: 'max-heap', body: 'PriorityQueue<Integer> pq = new PriorityQueue<>(Comparator.reverseOrder());|CURSOR|' },
    { label: 'sb', detail: 'StringBuilder', body: 'StringBuilder sb = new StringBuilder();|CURSOR|' },
    { label: 'bsearch', detail: 'binary search skeleton', body: 'int lo = 0, hi = nums.length - 1;\nwhile (lo <= hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (nums[mid] == target) return mid;\n    if (nums[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n}\nreturn -1;|CURSOR|' },
    { label: 'twoptr', detail: 'two pointers inward', body: 'int l = 0, r = nums.length - 1;\nwhile (l < r) {\n    |CURSOR|\n}' },
    { label: 'window', detail: 'sliding window skeleton', body: 'int l = 0;\nfor (int r = 0; r < nums.length; r++) {\n    // include nums[r]\n    while (/* invariant broken */) {\n        // drop nums[l]\n        l++;\n    }\n    |CURSOR|\n}' },
    { label: 'dfs', detail: 'recursive tree dfs', body: 'private int dfs(TreeNode node) {\n    if (node == null) return 0;\n    int left = dfs(node.left);\n    int right = dfs(node.right);\n    return |CURSOR|;\n}' },
    { label: 'bfs', detail: 'level-order bfs', body: 'Deque<TreeNode> q = new ArrayDeque<>();\nq.offer(root);\nwhile (!q.isEmpty()) {\n    int size = q.size();\n    for (int i = 0; i < size; i++) {\n        TreeNode node = q.poll();\n        |CURSOR|\n        if (node.left != null) q.offer(node.left);\n        if (node.right != null) q.offer(node.right);\n    }\n}' },
    { label: 'dirs', detail: '4-direction grid moves', body: 'int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};|CURSOR|' },
    { label: 'visited', detail: '2-D visited grid', body: 'boolean[][] visited = new boolean[grid.length][grid[0].length];|CURSOR|' },
    { label: 'memo', detail: 'memo array seeded to -1', body: 'int[] memo = new int[n + 1];\nArrays.fill(memo, -1);|CURSOR|' },
    { label: 'backtrack', detail: 'backtracking skeleton', body: 'private void backtrack(int start, List<Integer> path, List<List<Integer>> out) {\n    out.add(new ArrayList<>(path));\n    for (int i = start; i < nums.length; i++) {\n        path.add(nums[i]);\n        backtrack(i + 1, path, out);\n        path.remove(path.size() - 1);\n    }\n}|CURSOR|' },
    { label: 'solution', detail: 'class Solution shell', body: 'class Solution {\n    public |CURSOR| {\n        \n    }\n}' }
  ];

  w.LC_JAVA = {
    classes: classes,
    aliases: aliases,
    statics: statics,
    keywords: keywords,
    topLevelTypes: topLevelTypes,
    snippets: snippets,

    /* Resolve a declared type string to the dictionary entry, following
     * `extends` so TreeMap also offers everything Map has. */
    membersFor: function (typeName) {
      if (!typeName) return [];
      var base = String(typeName).replace(/<.*$/, '').replace(/\s+/g, '');
      if (/\[\]$/.test(base)) return classes.array.members.slice();
      var key = aliases[base] || base;
      var seen = {}, out = [], guard = 0;
      while (key && classes[key] && guard++ < 5) {
        classes[key].members.forEach(function (mm) {
          var sk = mm.name + '|' + mm.sig;
          if (!seen[sk]) { seen[sk] = 1; out.push(mm); }
        });
        key = classes[key].extends;
      }
      return out;
    },
    docFor: function (typeName) {
      var base = String(typeName || '').replace(/<.*$/, '');
      var key = aliases[base] || base;
      return (classes[key] && classes[key].doc) || '';
    },
    staticsFor: function (name) { return statics[name] || null; }
  };
})(window);
