/* data/problems/stack.js
 *
 * Problems for the "stack" pattern. Schema: data/problems/_SCHEMA.md
 *
 * Target mix: 7 Easy, 4 Medium, 1 Hard.
 * Sequenced: matching first (the intuitive use), then the stack as a builder,
 * then two design problems, then the monotonic stack, which is the payload of
 * this whole pattern and the reason it is worth its own chapter.
 */
(window.LC_PROBLEMS = window.LC_PROBLEMS || []).push(

{
  id: 'valid-parentheses',
  leetcodeNumber: 20,
  title: 'Valid Parentheses',
  url: 'https://leetcode.com/problems/valid-parentheses/',
  pattern: 'stack',
  difficulty: 'Easy',
  order: 1,
  tags: ['matching', 'nesting'],
  problemSummary: 'A string contains only the six bracket characters. It is valid when every bracket is closed by the matching kind, in the right order, and nothing is left unclosed.',
  examples: [
    { input: 's = "()[]{}"', output: 'true', note: 'Three independent pairs.' },
    { input: 's = "([)]"', output: 'false', note: 'Correct counts, wrong nesting.' },
    { input: 's = "{[]}"', output: 'true', note: 'Properly nested.' }
  ],
  constraints: ['1 <= s.length <= 10^4', "s consists only of the characters ()[]{}"],
  techniqueNote: 'the archetypal stack use: the most recently opened bracket is the first one that has to close, which is last-in-first-out by definition.',
  signals: [
    'Brackets, nesting, or any open/close structure.',
    '"Most recent unfinished thing must be dealt with first" is the definition of a stack.',
    'Counting alone is not enough. `"([)]"` has the right counts and the wrong order, which is what rules out a counter-based solution.'
  ],
  intuition: {
    input: 's = "([)]"',
    visual:
      'push the closer we EXPECT, so comparison is a single equality test\n' +
      '\n' +
      'char   action                       stack (top on the left)\n' +
      '(      expect )                     )\n' +
      '[      expect ]                     ] )\n' +
      ')      pop -> ] but we got )        MISMATCH -> false',
    steps: [
      { state: 'stack empty', say: 'Walk the string. On an opener, remember what must eventually close it.' },
      { state: 'stack: ) ', say: 'A neat trick: instead of pushing the opener `(`, push the closer you expect, `)`. Then checking a closer is one equality test with no lookup table.' },
      { state: 'stack: ] )', say: '`[` pushes `]`. The top of the stack is always the next closer required.' },
      { state: 'mismatch', say: 'A `)` arrives, but the top says `]` is required. Wrong order, so return false immediately.' },
      { state: '', say: 'Two failure modes besides a mismatch: a closer arriving when the stack is empty (nothing to close), and a non-empty stack at the end (unclosed openers). Both must be handled.' }
    ],
    takeaway: 'Three checks, not one: mismatch, closer with an empty stack, and leftovers at the end. Forgetting the third is the classic bug.'
  },
  hints: [
    'When you meet a closing bracket, which opening bracket does it have to match? Where is that one in the string relative to everything else still open?',
    'Push openers onto a stack. On a closer, pop and check they correspond. Return false if the stack is empty when you need to pop, and check the stack is empty at the very end.',
    'Pseudo-code: `for c: if opener: push(matching closer) else: if empty return false; if pop() != c return false; return stack.isEmpty()`'
  ],
  methodSignature: 'public boolean isValid(String s)',
  javaTemplate: 'monotonic-stack',
  javaSolution: `import java.util.*;

class Solution {
    public boolean isValid(String s) {
        // ArrayDeque is the right stack in Java: java.util.Stack works but is a
        // synchronised legacy class.
        Deque<Character> stack = new ArrayDeque<>();

        for (char c : s.toCharArray()) {
            // Push the closer we EXPECT rather than the opener itself. Then the
            // check below is one equality test with no lookup table.
            if (c == '(') {
                stack.push(')');
            } else if (c == '[') {
                stack.push(']');
            } else if (c == '{') {
                stack.push('}');
            } else {
                // A closer with nothing open.
                if (stack.isEmpty()) {
                    return false;
                }
                // Unbox to char before comparing: != on two Character objects
                // would compare references, not values.
                char expected = stack.pop();
                if (expected != c) {
                    return false;
                }
            }
        }

        // Anything left over is an unclosed opener.
        return stack.isEmpty();
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'one pass, and each character is pushed at most once and popped at most once',
    space: 'O(n)', spaceWhy: 'worst case every character is an opener, as in "((((("'
  },
  testCases: [
    { input: { s: '()[]{}' }, expected: 'true' },
    { input: { s: '([)]' }, expected: 'false' },
    { input: { s: '{[]}' }, expected: 'true' },
    { input: { s: '(' }, expected: 'false' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.isValid("()[]{}"));
        System.out.println(s.isValid("([)]"));
        System.out.println(s.isValid("{[]}"));
        System.out.println(s.isValid("("));
    }
}`,
  commonMistakes: [
    'Returning `true` at the end instead of `stack.isEmpty()`. `"("` is the input that catches it.',
    'Calling `pop()` without checking `isEmpty()` first. On `")"` an `ArrayDeque` throws `NoSuchElementException`.',
    'Counting brackets instead of stacking them, which accepts `"([)]"`.',
    'Comparing two boxed `Character` values with `!=`. It works for ASCII because of the Character cache, then breaks outside it.'
  ],
  followUps: [
    'Minimum Remove to Make Valid Parentheses asks which characters to delete, so the stack holds indexes rather than characters.',
    'Longest Valid Parentheses is the same structure with a length calculation, and it is Hard.'
  ]
},

{
  id: 'baseball-game',
  leetcodeNumber: 682,
  title: 'Baseball Game',
  url: 'https://leetcode.com/problems/baseball-game/',
  pattern: 'stack',
  difficulty: 'Easy',
  order: 2,
  tags: ['undo', 'simulation'],
  problemSummary: 'You are given a list of operations. A number records that score. `"C"` cancels the previous score. `"D"` records double the previous score. `"+"` records the sum of the previous two scores. Return the total of all recorded scores at the end.',
  examples: [
    { input: 'operations = ["5","2","C","D","+"]', output: '30', note: '5, then 2, then C removes the 2, then D records 10, then + records 5+10=15. Total 5+10+15 = 30.' },
    { input: 'operations = ["5","-2","4","C","D","9","+","+"]', output: '27', note: 'Records end up as 5, -2, -4, 9, 5, 14.' }
  ],
  constraints: ['1 <= operations.length <= 1000', 'operations[i] is "C", "D", "+", or a string representing an integer in [-3*10^4, 3*10^4]'],
  techniqueNote: 'the stack as an **undo history**. `"C"` is literally a pop, and every other operation reads the most recent entries.',
  signals: [
    'The word **cancel**, **undo**, or **the previous one**. Anything that reaches backwards into recent history.',
    'Every operation touches only the last one or two records, never the middle. That is exactly what a stack exposes.',
    'A `List` would also work here, and the stack vocabulary (`push`, `pop`, `peek`) says what you mean.'
  ],
  intuition: {
    input: 'operations = ["5","2","C","D","+"]',
    visual:
      'op   action                                stack (bottom to top)\n' +
      '5    push 5                                5\n' +
      '2    push 2                                5 2\n' +
      'C    pop                                   5\n' +
      'D    push top * 2 = 10                     5 10\n' +
      '+    push top + second = 10 + 5 = 15       5 10 15\n' +
      '\n' +
      'total = 5 + 10 + 15 = 30',
    steps: [
      { state: 'stack: 5 2', say: 'A plain number is a push. Nothing clever.' },
      { state: 'stack: 5', say: '`"C"` cancels the previous score, which is exactly `pop()`. The stack is the undo history.' },
      { state: 'stack: 5 10', say: '`"D"` needs the top without removing it, so `peek()`, double it, push the result.' },
      { state: 'stack: 5 10 15', say: '`"+"` needs the top TWO. There is no `peekSecond()`, so pop the first, peek the second, and push the first back before pushing the sum. Order matters.' },
      { state: 'total 30', say: 'Finally sum everything still on the stack. Iterating an `ArrayDeque` is fine here because you only need the total, not an order.' }
    ],
    takeaway: 'When you need the second element from the top, pop-peek-push-back is the standard move. Forgetting to push back is the bug.'
  },
  hints: [
    'Which of the four operations is literally a stack operation with no extra work?',
    'Push numbers. `"C"` pops. `"D"` pushes twice the peek. `"+"` needs the top two, so pop one, peek the next, then push the first back and push the sum.',
    'Pseudo-code: `for op: C -> pop; D -> push(peek*2); + -> a=pop, b=peek, push(a), push(a+b); else push(parseInt(op)); return sum(stack)`'
  ],
  methodSignature: 'public int calPoints(String[] operations)',
  javaTemplate: 'monotonic-stack',
  javaSolution: `import java.util.*;

class Solution {
    public int calPoints(String[] operations) {
        Deque<Integer> stack = new ArrayDeque<>();

        for (String op : operations) {
            if (op.equals("C")) {
                // Cancel the previous score: the stack IS the undo history.
                stack.pop();
            } else if (op.equals("D")) {
                stack.push(stack.peek() * 2);
            } else if (op.equals("+")) {
                // No peekSecond() exists, so borrow the top, look underneath,
                // then put the top back before pushing the new score.
                int top = stack.pop();
                int second = stack.peek();
                stack.push(top);
                stack.push(top + second);
            } else {
                stack.push(Integer.parseInt(op));
            }
        }

        int total = 0;
        for (int score : stack) {
            total += score;
        }
        return total;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'each operation does a constant amount of stack work, plus one final pass to sum',
    space: 'O(n)', spaceWhy: 'the stack can hold every recorded score'
  },
  testCases: [
    { input: { operations: ['5', '2', 'C', 'D', '+'] }, expected: '30' },
    { input: { operations: ['5', '-2', '4', 'C', 'D', '9', '+', '+'] }, expected: '27' },
    { input: { operations: ['1'] }, expected: '1' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.calPoints(new String[]{"5", "2", "C", "D", "+"}));
        System.out.println(s.calPoints(new String[]{"5", "-2", "4", "C", "D", "9", "+", "+"}));
        System.out.println(s.calPoints(new String[]{"1"}));
    }
}`,
  commonMistakes: [
    'Forgetting to push the borrowed top back during `"+"`, which silently deletes a score.',
    'Comparing the operation with `==` instead of `.equals()`. Interning makes it appear to work for literals and it is not reliable.',
    'Using `Integer.parseInt` on `"C"`, `"D"` or `"+"` by testing in the wrong order. Check the three special cases first.',
    'Assuming numbers are non-negative, so a `"-2"` token breaks a hand-rolled parser. `Integer.parseInt` handles the sign.'
  ],
  followUps: [
    'Evaluate Reverse Polish Notation (later in this pattern) is the same shape with real operators and operand order that matters.',
    'A text editor undo buffer is this exact data structure.'
  ]
},

{
  id: 'remove-adjacent-duplicates',
  leetcodeNumber: 1047,
  title: 'Remove All Adjacent Duplicates In String',
  url: 'https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/',
  pattern: 'stack',
  difficulty: 'Easy',
  order: 3,
  tags: ['builder', 'cancellation'],
  problemSummary: 'Repeatedly delete any two adjacent equal characters until no such pair remains. Return the resulting string. The answer is unique regardless of the order you delete in.',
  examples: [
    { input: 's = "abbaca"', output: '"ca"', note: 'Remove "bb" to get "aaca", then remove "aa" to get "ca".' },
    { input: 's = "azxxzy"', output: '"ay"', note: 'Remove "xx" to get "azzy", then "zz" to get "ay".' }
  ],
  constraints: ['1 <= s.length <= 10^5', 's consists of lowercase English letters'],
  techniqueNote: 'the stack as a **builder**. Rather than deleting from a string repeatedly, build the answer once and let each new character cancel the top when it matches.',
  signals: [
    '**Repeatedly remove adjacent pairs** until stable. The cascading removals are the tell.',
    'Deleting `"bb"` can create a brand new adjacency between characters that were not neighbours before. Only a stack notices that for free.',
    'The result is built left to right and you only ever inspect its last character, which is exactly a stack.'
  ],
  intuition: {
    input: 's = "abbaca"',
    visual:
      'char   top of build   action              build so far\n' +
      'a      -              append             a\n' +
      'b      a              differs, append    ab\n' +
      'b      b              MATCH, delete top  a\n' +
      'a      a              MATCH, delete top  (empty)\n' +
      'c      -              append             c\n' +
      'a      c              differs, append    ca',
    steps: [
      { state: 'build = "ab"', say: 'Walk the input once, appending to a result you are building.' },
      { state: 'build = "a"', say: 'The incoming `b` equals the last character of the build, so they cancel: delete the last character and do not append.' },
      { state: 'build = ""', say: 'Here is the cascade. After removing `"bb"`, the next input `a` now sits next to the `a` that used to be two positions away. The stack surfaces that automatically, with no rescanning.' },
      { state: 'build = "ca"', say: 'Continue to the end. One pass, and the build is the answer.' },
      { state: '', say: 'A `StringBuilder` is the natural stack here: `charAt(length-1)` is peek, `deleteCharAt(length-1)` is pop, `append` is push, and `toString()` is free at the end.' }
    ],
    takeaway: 'Repeated-removal problems are one-pass builder problems. The cascade you would have to rescan for is exactly what the top of the stack already tells you.'
  },
  hints: [
    'The obvious approach scans the string, deletes a pair, and starts over. What is the cost of that, and what did deleting a pair just create?',
    'Build the answer left to right. For each incoming character, if it equals the last character of what you have built, delete that instead of appending.',
    'Pseudo-code: `sb = new StringBuilder(); for c in s: if sb not empty and sb.last == c: sb.deleteCharAt(last) else sb.append(c); return sb.toString()`'
  ],
  methodSignature: 'public String removeDuplicates(String s)',
  javaTemplate: 'monotonic-stack',
  javaSolution: `class Solution {
    public String removeDuplicates(String s) {
        // StringBuilder used as a stack: append is push, charAt(len-1) is peek,
        // deleteCharAt(len-1) is pop. It also avoids converting at the end.
        StringBuilder build = new StringBuilder();

        for (char c : s.toCharArray()) {
            int last = build.length() - 1;

            if (last >= 0 && build.charAt(last) == c) {
                // The pair cancels. Removing it may expose a NEW adjacency, and
                // the next iteration sees that automatically.
                build.deleteCharAt(last);
            } else {
                build.append(c);
            }
        }

        return build.toString();
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'each character is appended at most once and deleted at most once',
    space: 'O(n)', spaceWhy: 'the builder, which is also the output'
  },
  testCases: [
    { input: { s: 'abbaca' }, expected: '"ca"' },
    { input: { s: 'azxxzy' }, expected: '"ay"' },
    { input: { s: 'aa' }, expected: '""' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        // Quoted so the empty answer is visible.
        System.out.println("\\"" + s.removeDuplicates("abbaca") + "\\"");
        System.out.println("\\"" + s.removeDuplicates("azxxzy") + "\\"");
        System.out.println("\\"" + s.removeDuplicates("aa") + "\\"");
    }
}`,
  commonMistakes: [
    'Repeatedly calling `replace` or restarting the scan after each deletion. That is O(n²) and times out at n = 10^5.',
    'Forgetting the `last >= 0` guard, so `charAt(-1)` throws on the very first character.',
    'Using a `Deque<Character>` and then having to reverse it to build the string. A `StringBuilder` is already in the right order.',
    'Removing only the pairs present in the original string, missing the cascade in `"abba"`.'
  ],
  followUps: [
    'Remove All Adjacent Duplicates II removes runs of exactly k, so the stack holds character-and-count pairs.',
    'Make The String Great (next) is the same builder with a different cancellation rule.'
  ]
},

{
  id: 'backspace-string-compare',
  leetcodeNumber: 844,
  title: 'Backspace String Compare',
  url: 'https://leetcode.com/problems/backspace-string-compare/',
  pattern: 'stack',
  difficulty: 'Easy',
  order: 4,
  tags: ['builder', 'undo'],
  problemSummary: 'Both strings are what someone typed into a text editor, where `#` means backspace. Decide whether the two finished texts are equal. A backspace on empty text does nothing.',
  examples: [
    { input: 's = "ab#c", t = "ad#c"', output: 'true', note: 'Both become "ac".' },
    { input: 's = "ab##", t = "c#d#"', output: 'true', note: 'Both become the empty string.' },
    { input: 's = "a#c", t = "b"', output: 'false', note: '"c" against "b".' }
  ],
  constraints: ['1 <= s.length, t.length <= 200', 's and t contain only lowercase letters and the character #'],
  techniqueNote: 'the stack as an undo buffer, applied twice. Reduce each string to what it actually says, then compare.',
  signals: [
    '**Backspace**, **undo**, or **delete the previous character**. That is a pop.',
    'Two inputs that both need the same normalisation. Write one helper and call it twice.',
    'The empty-buffer case is a real edge case, not a technicality: `"a###"` must not throw.'
  ],
  intuition: {
    input: 's = "ab#c"',
    visual:
      'char   action                build\n' +
      'a      append                a\n' +
      'b      append                ab\n' +
      '#      pop                   a\n' +
      'c      append                ac\n' +
      '\n' +
      'do the same to t, then compare the two finished strings',
    steps: [
      { state: 'build = "ab"', say: 'A normal character is a push.' },
      { state: 'build = "a"', say: 'A `#` is a pop. Guard it: popping an empty buffer must do nothing rather than throw.' },
      { state: 'build = "ac"', say: 'Finish the string. The build is what the text actually says.' },
      { state: '', say: 'Reduce both strings the same way and compare with `.equals()`. Two calls to one helper.' },
      { state: '', say: 'The much harder O(1)-space version walks both strings backwards, skipping characters as it counts pending backspaces. Get this version right first.' }
    ],
    takeaway: 'When two inputs need the same normalisation, write one helper. The temptation to compare while simultaneously processing both strings is what makes this problem buggy.'
  },
  hints: [
    'What does a `#` do to the text typed before it? What data structure does "remove the most recent thing" describe?',
    'Write a helper that turns a typed string into its finished text using a `StringBuilder` as a stack. Call it on both inputs and compare.',
    'Pseudo-code: `build(x) { sb; for c in x: if c == \'#\': if sb not empty: delete last; else sb.append(c); return sb.toString() }` then `return build(s).equals(build(t))`'
  ],
  methodSignature: 'public boolean backspaceCompare(String s, String t)',
  javaTemplate: 'monotonic-stack',
  javaSolution: `class Solution {
    public boolean backspaceCompare(String s, String t) {
        // Same normalisation on both sides, then a plain comparison.
        return build(s).equals(build(t));
    }

    /** Turns typed input into the text it actually produces. */
    private String build(String typed) {
        StringBuilder sb = new StringBuilder();

        for (char c : typed.toCharArray()) {
            if (c == '#') {
                // A backspace on empty text does nothing, so guard the pop.
                if (sb.length() > 0) {
                    sb.deleteCharAt(sb.length() - 1);
                }
            } else {
                sb.append(c);
            }
        }

        return sb.toString();
    }
}
`,
  complexity: {
    time: 'O(n + m)', timeWhy: 'one pass over each string',
    space: 'O(n + m)', spaceWhy: 'the two builders. The two-pointer version below is O(1).'
  },
  testCases: [
    { input: { s: 'ab#c', t: 'ad#c' }, expected: 'true' },
    { input: { s: 'ab##', t: 'c#d#' }, expected: 'true' },
    { input: { s: 'a#c', t: 'b' }, expected: 'false' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.backspaceCompare("ab#c", "ad#c"));
        System.out.println(s.backspaceCompare("ab##", "c#d#"));
        System.out.println(s.backspaceCompare("a#c", "b"));
    }
}`,
  commonMistakes: [
    'Popping without the empty guard, so `"a###"` throws.',
    'Comparing the finished strings with `==` instead of `.equals()`.',
    'Trying to walk both strings forwards in one loop. The backspaces do not line up, and the code becomes far harder than two calls to one helper.',
    'Deleting from a `String` with `substring` inside the loop, which is O(n²) because strings are immutable.'
  ],
  followUps: [
    'The stated follow-up is O(n) time and **O(1) space**: walk both strings from the right, and at each step skip forward over characters cancelled by pending backspaces. It is genuinely fiddly, and worth writing once.',
    'Same builder shape as Remove All Adjacent Duplicates, with a different cancel condition.'
  ]
},

{
  id: 'make-the-string-great',
  leetcodeNumber: 1544,
  title: 'Make The String Great',
  url: 'https://leetcode.com/problems/make-the-string-great/',
  pattern: 'stack',
  difficulty: 'Easy',
  order: 5,
  tags: ['builder', 'cancellation'],
  problemSummary: 'Repeatedly remove any two adjacent characters that are the same letter in opposite cases, such as `aA` or `Bb`, until none remain. Return the result, which is unique.',
  examples: [
    { input: 's = "leEeetcode"', output: '"leetcode"', note: 'Remove "eE" to get "leetcode", which has no bad pair left.' },
    { input: 's = "abBAcC"', output: '""', note: '"bB" goes, then "aA", then "cC". Everything cancels.' },
    { input: 's = "s"', output: '"s"', note: 'Nothing to remove.' }
  ],
  constraints: ['1 <= s.length <= 100', 's contains only lowercase and uppercase English letters'],
  techniqueNote: 'the same builder as Remove All Adjacent Duplicates, with the cancellation rule swapped. Recognising that is the whole exercise.',
  signals: [
    'Repeated removal of adjacent pairs, with a cascade after each removal.',
    'You have seen this shape twice already in this pattern. The only thing that changes is the predicate.',
    'The rule is "same letter, different case", which is two conditions: not identical, and equal when lower-cased.'
  ],
  intuition: {
    input: 's = "abBAcC"',
    visual:
      'char   top   bad pair?                     build\n' +
      'a      -     no                            a\n' +
      'b      a     different letters, no         ab\n' +
      'B      b     same letter, diff case  YES   a\n' +
      'A      a     same letter, diff case  YES   (empty)\n' +
      'c      -     no                            c\n' +
      'C      c     same letter, diff case  YES   (empty)',
    steps: [
      { state: 'build = "ab"', say: 'Identical skeleton to Remove All Adjacent Duplicates: append, and cancel against the last built character.' },
      { state: 'build = "a"', say: 'The rule: `top != c` (not the same character) **and** `toLowerCase(top) == toLowerCase(c)` (the same letter). Both conditions are needed.' },
      { state: 'build = ""', say: 'Removing `"bB"` puts `A` next to `a`, which then cancels too. The cascade again, handled for free.' },
      { state: 'build = ""', say: '`"cC"` cancels as well, so the answer is the empty string.' },
      { state: '', say: 'Note that `top != c` matters. Without it, `"aa"` would wrongly cancel, since both lower-case to `a`.' }
    ],
    takeaway: 'This is the third builder problem in a row on purpose. Once you can name the shape, only the cancellation predicate is new, and that is what pattern recognition buys you.'
  },
  hints: [
    'You have already written this loop twice in this pattern. What is the only part that changes?',
    'Build left to right. Cancel when the incoming character and the last built one are the same letter in different cases: `top != c && toLowerCase(top) == toLowerCase(c)`.',
    'Pseudo-code: `for c in s: if build nonempty and isBadPair(build.last, c): delete last else append c`'
  ],
  methodSignature: 'public String makeGood(String s)',
  javaTemplate: 'monotonic-stack',
  javaSolution: `class Solution {
    public String makeGood(String s) {
        StringBuilder build = new StringBuilder();

        for (char c : s.toCharArray()) {
            int last = build.length() - 1;

            if (last >= 0 && isBadPair(build.charAt(last), c)) {
                build.deleteCharAt(last);
            } else {
                build.append(c);
            }
        }

        return build.toString();
    }

    /** Same letter, opposite case. Both halves of this test are required. */
    private boolean isBadPair(char a, char b) {
        // a != b rules out "aa", which would otherwise pass the second test.
        return a != b && Character.toLowerCase(a) == Character.toLowerCase(b);
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'each character is appended at most once and deleted at most once',
    space: 'O(n)', spaceWhy: 'the builder, which is also the output'
  },
  testCases: [
    { input: { s: 'leEeetcode' }, expected: '"leetcode"' },
    { input: { s: 'abBAcC' }, expected: '""' },
    { input: { s: 's' }, expected: '"s"' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println("\\"" + s.makeGood("leEeetcode") + "\\"");
        System.out.println("\\"" + s.makeGood("abBAcC") + "\\"");
        System.out.println("\\"" + s.makeGood("s") + "\\"");
    }
}`,
  commonMistakes: [
    'Dropping the `a != b` test, which makes `"aa"` cancel when it should not.',
    'Testing the case difference with `Math.abs(a - b) == 32`. It happens to be true for ASCII letters and it is a magic number that does not say what it means.',
    'Rescanning the string after each removal, which is O(n²) and misses nothing but wastes time.',
    'Forgetting the `last >= 0` guard on the first character.'
  ],
  followUps: [
    'All three builder problems in this pattern (this, Remove All Adjacent Duplicates, Backspace String Compare) are one loop with three different predicates. Try writing that loop once with the predicate passed in.',
    'Score of Parentheses uses the same stack shape but accumulates a value rather than characters.'
  ]
},

{
  id: 'implement-queue-using-stacks',
  leetcodeNumber: 232,
  title: 'Implement Queue using Stacks',
  url: 'https://leetcode.com/problems/implement-queue-using-stacks/',
  pattern: 'stack',
  difficulty: 'Easy',
  order: 6,
  tags: ['design', 'amortised'],
  problemSummary: 'Build a first-in-first-out queue using only two last-in-first-out stacks. Support push, pop, peek and empty, and each operation should be O(1) on average.',
  examples: [
    { input: 'push(1), push(2), peek()', output: '1', note: 'FIFO, so the first pushed value comes out first.' },
    { input: 'pop()', output: '1', note: 'Removes the front.' },
    { input: 'empty()', output: 'false', note: 'The 2 is still queued.' }
  ],
  constraints: ['1 <= x <= 9', 'At most 100 calls in total', 'All calls to pop and peek are valid', 'Each operation must be amortised O(1)'],
  techniqueNote: 'two stacks facing each other. Pouring one into the other reverses the order, and FIFO is just LIFO reversed.',
  signals: [
    'A design problem where the allowed primitive is the opposite of what you need.',
    'Reversing a stack is what turns LIFO into FIFO, and pouring one stack into another does exactly that.',
    '**Amortised** O(1) is the hint that you may occasionally do expensive work, as long as it is rare.'
  ],
  intuition: {
    input: 'push(1), push(2), push(3), then pop()',
    visual:
      'inbox  (newest on top)      outbox (front of queue on top)\n' +
      '\n' +
      'push 1,2,3      inbox: 3 2 1        outbox: empty\n' +
      '\n' +
      'pop() and outbox is empty, so POUR everything across.\n' +
      'Popping inbox gives 3,2,1 and pushing that onto outbox reverses it:\n' +
      '\n' +
      '                inbox: empty        outbox: 1 2 3\n' +
      '\n' +
      'now outbox.pop() gives 1, which is the front of the queue. Correct.',
    steps: [
      { state: 'inbox: 3 2 1', say: 'Pushes always go to the `inbox`. That is O(1) and needs no thought.' },
      { state: '', say: 'The problem is that `inbox.pop()` gives 3, the newest, and a queue must return 1.' },
      { state: 'outbox: 1 2 3', say: 'Pour the `inbox` into the `outbox` one pop-push at a time. That reverses the order, so the `outbox` now has the queue front on top.' },
      { state: '', say: 'The rule that makes it correct: only pour when the `outbox` is **empty**. Pouring while it still holds items would interleave old and new and break FIFO.' },
      { state: '', say: 'Why it is amortised O(1): each element is poured across exactly once in its lifetime. n operations do at most n pours, so the average cost per operation is constant even though one individual `pop` can cost O(n).' }
    ],
    takeaway: 'Amortised analysis is the point of this problem. A single operation may be expensive as long as each element can only trigger that expense once.'
  },
  hints: [
    'A stack hands back the newest item. A queue needs the oldest. What does pouring one stack into another do to the order?',
    'Keep an `inbox` for pushes and an `outbox` for pops. When you need to read and the `outbox` is empty, pour the whole `inbox` across. Only ever pour when the `outbox` is empty.',
    'Pseudo-code: `push(x): inbox.push(x)`. `shift(): if outbox.isEmpty(): while inbox not empty: outbox.push(inbox.pop())`. `pop(): shift(); return outbox.pop()`.'
  ],
  methodSignature: 'public void push(int x) · public int pop() · public int peek() · public boolean empty()',
  starter: `import java.util.*;

class MyQueue {

    public MyQueue() {

    }

    public void push(int x) {

    }

    public int pop() {
        return 0;
    }

    public int peek() {
        return 0;
    }

    public boolean empty() {
        return false;
    }
}
`,
  javaTemplate: 'monotonic-stack',
  javaSolution: `import java.util.*;

class MyQueue {

    // Newest items land here.
    private final Deque<Integer> inbox = new ArrayDeque<>();
    // Reversed items live here, so the queue FRONT is on top.
    private final Deque<Integer> outbox = new ArrayDeque<>();

    public MyQueue() {
        // Both stacks are initialised above.
    }

    public void push(int x) {
        inbox.push(x);   // always O(1)
    }

    public int pop() {
        shift();
        return outbox.pop();
    }

    public int peek() {
        shift();
        return outbox.peek();
    }

    public boolean empty() {
        return inbox.isEmpty() && outbox.isEmpty();
    }

    /**
     * Move everything across, but ONLY when the outbox is empty. Pouring while
     * items remain would interleave newer values in front of older ones and
     * break FIFO. Each element is poured at most once in its life, which is
     * what makes every operation amortised O(1).
     */
    private void shift() {
        if (outbox.isEmpty()) {
            while (!inbox.isEmpty()) {
                outbox.push(inbox.pop());
            }
        }
    }
}
`,
  complexity: {
    time: 'O(1) amortised', timeWhy: 'push is always O(1). A single pop can cost O(n) when it triggers a pour, but each element is poured exactly once, so n operations cost O(n) in total.',
    space: 'O(n)', spaceWhy: 'the n queued elements, split between the two stacks'
  },
  testCases: [
    { input: 'push(1), push(2), peek()', expected: '1' },
    { input: 'pop()', expected: '1' },
    { input: 'empty()', expected: 'false' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        MyQueue q = new MyQueue();
        q.push(1);
        q.push(2);
        System.out.println(q.peek());    // 1
        System.out.println(q.pop());     // 1
        System.out.println(q.empty());   // false, the 2 is still queued
    }
}`,
  commonMistakes: [
    'Pouring on every read instead of only when the `outbox` is empty. That is O(n) per operation, not amortised O(1).',
    'Pouring when the `outbox` still has items, which interleaves and breaks FIFO.',
    'Implementing `empty()` as `outbox.isEmpty()`. Both stacks have to be empty.',
    'Reversing the `inbox` on every `push` instead, which makes pushes O(n) and is the mirror-image mistake.'
  ],
  followUps: [
    'Implement Stack using Queues is the reverse exercise, and it is harder to make amortised O(1).',
    'The amortised argument here is the same one behind `ArrayList` doubling its backing array.'
  ]
},

{
  id: 'next-greater-element-i',
  leetcodeNumber: 496,
  title: 'Next Greater Element I',
  url: 'https://leetcode.com/problems/next-greater-element-i/',
  pattern: 'stack',
  difficulty: 'Easy',
  order: 7,
  tags: ['monotonic-stack', 'next-greater'],
  problemSummary: 'Every value in the first array also appears in the second, and all values are distinct. For each value in the first array, find the first value to its right in the second array that is larger than it, or -1 if there is none.',
  examples: [
    { input: 'nums1 = [4,1,2], nums2 = [1,3,4,2]', output: '[-1,3,-1]', note: 'Nothing right of 4 is bigger. Right of 1 comes 3. Nothing right of 2 is bigger.' },
    { input: 'nums1 = [2,4], nums2 = [1,2,3,4]', output: '[3,-1]', note: 'Right of 2 comes 3. Nothing is right of 4.' }
  ],
  constraints: ['1 <= nums1.length <= nums2.length <= 1000', '0 <= nums1[i], nums2[i] <= 10^4', 'All integers in each array are unique', 'Every value in nums1 also appears in nums2'],
  techniqueNote: 'the **monotonic stack**, and this is the gentlest possible introduction to it. Answer the question for all of `nums2` in one pass, then look answers up.',
  signals: [
    '**Next greater** or **next smaller** element, in any wording. This is a monotonic stack, essentially always.',
    'You were about to write a nested loop scanning rightwards. The stack replaces that inner scan.',
    'The two-array wrapper is a distraction. Solve it for `nums2`, store answers in a map, then read them off.'
  ],
  intuition: {
    input: 'nums2 = [1,3,4,2]',
    visual:
      'the stack holds values still WAITING for their next greater element,\n' +
      'and they are always in decreasing order from bottom to top\n' +
      '\n' +
      'x=1   stack empty          push 1              stack: 1\n' +
      'x=3   3 > 1, so 1 is answered: 1 -> 3          stack: 3\n' +
      'x=4   4 > 3, so 3 is answered: 3 -> 4          stack: 4\n' +
      'x=2   2 < 4, nobody is answered, push 2        stack: 4 2\n' +
      '\n' +
      'leftovers 4 and 2 never found anything bigger  ->  -1',
    steps: [
      { state: 'stack: 1', say: 'Walk `nums2` left to right. The stack holds values that are still waiting to learn their answer.' },
      { state: 'stack: 3, answered 1 -> 3', say: 'When `3` arrives, it is bigger than the waiting `1`. So `3` IS the answer for `1`. Pop `1` and record it.' },
      { state: 'stack: 4', say: 'Read the loop as a sentence: "while the thing I am holding is smaller than what just arrived, the answer for the thing I am holding is what just arrived."' },
      { state: 'stack: 4 2', say: '`2` answers nobody, because `4` is bigger. Push it and wait.' },
      { state: '', say: 'Why the stack stays decreasing: anything smaller than the incoming value gets popped, so what remains is always larger than what sits above it.' },
      { state: 'leftovers -> -1', say: 'Whatever is still on the stack at the end never found a bigger value. Those get -1.' },
      { state: '', say: 'Each value is pushed once and popped at most once, so the whole scan is O(n) even though the code looks nested.' }
    ],
    takeaway: 'A pop is not a deletion, it is an ANSWER being resolved. Once you read the loop that way, every monotonic-stack problem reads the same.'
  },
  hints: [
    'Ignore `nums1` at first. If you had to answer "next greater" for every position of `nums2`, what would the brute force be, and what is the inner loop doing?',
    'Walk `nums2` once with a stack of values still waiting for an answer. When a new value beats the top of the stack, pop it and record that the new value is its answer. Store the answers in a map, then read `nums1` off it.',
    'Pseudo-code: `for x in nums2: while stack not empty and stack.peek() < x: answer[stack.pop()] = x; stack.push(x)`. Then `out[i] = answer.getOrDefault(nums1[i], -1)`.'
  ],
  methodSignature: 'public int[] nextGreaterElement(int[] nums1, int[] nums2)',
  javaTemplate: 'monotonic-stack',
  javaSolution: `import java.util.*;

class Solution {
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        // value -> its next greater element in nums2
        Map<Integer, Integer> nextGreater = new HashMap<>();

        // Values still waiting for an answer. Decreasing from bottom to top.
        Deque<Integer> waiting = new ArrayDeque<>();

        for (int x : nums2) {
            // Everything smaller than x has just found its answer: x itself.
            while (!waiting.isEmpty() && waiting.peek() < x) {
                nextGreater.put(waiting.pop(), x);
            }
            waiting.push(x);
        }
        // Whatever is still waiting never found anything bigger, and the
        // getOrDefault below turns that into -1.

        int[] out = new int[nums1.length];
        for (int i = 0; i < nums1.length; i++) {
            out[i] = nextGreater.getOrDefault(nums1[i], -1);
        }
        return out;
    }
}
`,
  complexity: {
    time: 'O(n + m)', timeWhy: 'each value of nums2 is pushed once and popped at most once, then one pass over nums1',
    space: 'O(n)', spaceWhy: 'the stack plus the answer map'
  },
  testCases: [
    { input: { nums1: [4, 1, 2], nums2: [1, 3, 4, 2] }, expected: '[-1, 3, -1]' },
    { input: { nums1: [2, 4], nums2: [1, 2, 3, 4] }, expected: '[3, -1]' },
    { input: { nums1: [1], nums2: [1] }, expected: '[-1]' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(java.util.Arrays.toString(s.nextGreaterElement(new int[]{4, 1, 2}, new int[]{1, 3, 4, 2})));
        System.out.println(java.util.Arrays.toString(s.nextGreaterElement(new int[]{2, 4}, new int[]{1, 2, 3, 4})));
        System.out.println(java.util.Arrays.toString(s.nextGreaterElement(new int[]{1}, new int[]{1})));
    }
}`,
  commonMistakes: [
    'Using `if` instead of `while`. One incoming value can resolve several waiting values at once.',
    'Forgetting the leftovers on the stack, which must default to -1.',
    'Storing values here and then trying the same approach on a problem that needs positions. When the answer is a distance or an index, push INDEXES instead.',
    'The O(n·m) nested search. It passes at n = 1000 and teaches nothing, and it will not pass Daily Temperatures.'
  ],
  followUps: [
    'Daily Temperatures (later in this pattern) is this problem asking for the DISTANCE, which is why it pushes indexes.',
    'Next Greater Element II makes the array circular: run the same loop twice, or over indexes modulo n.'
  ]
},

{
  id: 'min-stack',
  leetcodeNumber: 155,
  title: 'Min Stack',
  url: 'https://leetcode.com/problems/min-stack/',
  pattern: 'stack',
  difficulty: 'Medium',
  order: 8,
  tags: ['design', 'auxiliary-stack'],
  problemSummary: 'Build a stack that also reports its minimum element. All four operations, push, pop, top and getMin, must be O(1).',
  examples: [
    { input: 'push(-2), push(0), push(-3), getMin()', output: '-3', note: 'The smallest of the three.' },
    { input: 'pop(), top()', output: '0', note: 'After removing -3 the top is 0.' },
    { input: 'getMin()', output: '-2', note: 'With -3 gone the minimum is -2 again, so the old minimum must be recoverable.' }
  ],
  constraints: ['-2^31 <= val <= 2^31 - 1', 'pop, top and getMin are only called on a non-empty stack', 'At most 3 * 10^4 calls', 'All four operations must be O(1)'],
  techniqueNote: 'a second stack that holds the minimum **as of each push**. The history of minima has exactly the same shape as the history of values, so a stack is the right container for it.',
  signals: [
    'O(1) for a query that would normally need a scan. That means the answer must be maintained, not computed.',
    'Popping has to RESTORE an older minimum, which rules out a single `min` variable.',
    '"For every state of the stack, remember an extra fact about that state" is what a parallel stack is for.'
  ],
  intuition: {
    input: 'push(-2), push(0), push(-3), then pop()',
    visual:
      'values      mins        note\n' +
      '-2          -2          first value is its own minimum\n' +
      '-2 0        -2 -2       0 is not smaller, so carry -2 forward\n' +
      '-2 0 -3     -2 -2 -3    -3 is smaller, so record it\n' +
      '\n' +
      'pop both stacks together:\n' +
      '-2 0        -2 -2       getMin() is -2 again, restored for free',
    steps: [
      { state: '', say: 'The tempting answer is one `int min` field. It works until you pop the minimum, at which point you have no idea what the previous minimum was.' },
      { state: 'mins: -2 -2', say: 'Instead keep a second stack in lockstep. On every push, record the minimum of the incoming value and the current minimum.' },
      { state: 'mins: -2 -2 -3', say: 'Note that a value is pushed onto `mins` on EVERY push, even when it is not a new minimum. Keeping the two stacks the same height is what makes popping trivial.' },
      { state: 'pop both', say: 'On pop, pop both stacks. The old minimum is exposed automatically, with no recomputation.' },
      { state: '', say: '`getMin()` is `mins.peek()`, which is O(1). The cost is O(n) extra space, which the problem is happy to pay.' }
    ],
    takeaway: 'You cannot recompute the minimum on pop in O(1), so you must have stored it. A parallel stack stores one extra fact per state, and states come and go in stack order.'
  },
  hints: [
    'Try it with a single `min` field. Push -2, then -3, then pop. What is the minimum now, and how would you know?',
    'Keep a second stack whose top is always the minimum of everything currently in the main stack. Push to it on every push, and pop it on every pop.',
    'Pseudo-code: `push(v): values.push(v); mins.push(mins.isEmpty() ? v : Math.min(v, mins.peek()))`. `pop(): values.pop(); mins.pop()`. `getMin(): return mins.peek()`.'
  ],
  methodSignature: 'public void push(int val) · public void pop() · public int top() · public int getMin()',
  starter: `import java.util.*;

class MinStack {

    public MinStack() {

    }

    public void push(int val) {

    }

    public void pop() {

    }

    public int top() {
        return 0;
    }

    public int getMin() {
        return 0;
    }
}
`,
  javaTemplate: 'monotonic-stack',
  javaSolution: `import java.util.*;

class MinStack {

    private final Deque<Integer> values = new ArrayDeque<>();
    // mins.peek() is always the minimum of everything currently in values.
    private final Deque<Integer> mins = new ArrayDeque<>();

    public MinStack() {
        // Both stacks are initialised above.
    }

    public void push(int val) {
        values.push(val);

        // Push on EVERY call, even when val is not a new minimum. Keeping the
        // two stacks the same height is what makes pop() a two-liner.
        mins.push(mins.isEmpty() ? val : Math.min(val, mins.peek()));
    }

    public void pop() {
        values.pop();
        mins.pop();   // popping both together restores the previous minimum
    }

    public int top() {
        return values.peek();
    }

    public int getMin() {
        return mins.peek();
    }
}
`,
  complexity: {
    time: 'O(1)', timeWhy: 'every operation is a constant number of stack operations, with no scanning',
    space: 'O(n)', spaceWhy: 'two stacks of n elements. That is the price of an O(1) getMin.'
  },
  testCases: [
    { input: 'push(-2), push(0), push(-3), getMin()', expected: '-3' },
    { input: 'pop(), top()', expected: '0' },
    { input: 'getMin()', expected: '-2' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        MinStack st = new MinStack();
        st.push(-2);
        st.push(0);
        st.push(-3);
        System.out.println(st.getMin());   // -3
        st.pop();
        System.out.println(st.top());      // 0
        System.out.println(st.getMin());   // -2
    }
}`,
  commonMistakes: [
    'Using a single `min` field, which cannot recover the previous minimum after the minimum is popped.',
    'Pushing to `mins` only when a new minimum appears. It saves space and now the two stacks have different heights, so `pop()` needs a comparison and it is easy to get wrong.',
    'Scanning the stack inside `getMin()`, which is O(n) and violates the requirement.',
    'Using `java.util.Stack` and relying on `search` or indexing. `ArrayDeque` is faster, and neither should be indexed here.'
  ],
  followUps: [
    'The space-optimised variant pushes to `mins` only on a new minimum, and on pop compares the popped value against `mins.peek()` before popping that too. Same O(1) time, less memory, more care needed.',
    'Max Stack is the mirror image. Min Queue is genuinely harder and needs a monotonic deque, which is Sliding Window Maximum.'
  ]
},

{
  id: 'evaluate-reverse-polish-notation',
  leetcodeNumber: 150,
  title: 'Evaluate Reverse Polish Notation',
  url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
  pattern: 'stack',
  difficulty: 'Medium',
  order: 9,
  tags: ['expression', 'postfix'],
  problemSummary: 'Evaluate an arithmetic expression written in postfix form, where each operator comes after its two operands. Division truncates toward zero and the expression is always valid.',
  examples: [
    { input: 'tokens = ["2","1","+","3","*"]', output: '9', note: '(2 + 1) * 3.' },
    { input: 'tokens = ["4","13","5","/","+"]', output: '6', note: '4 + (13 / 5) = 4 + 2, since division truncates.' }
  ],
  constraints: ['1 <= tokens.length <= 10^4', 'Each token is an operator (+ - * /) or an integer in [-200, 200]', 'The expression is always valid and division never divides by zero'],
  techniqueNote: 'the stack of pending operands. Postfix exists precisely because it can be evaluated with a stack and no parentheses.',
  signals: [
    'Postfix, prefix, or any expression evaluation. Stack, always.',
    'Operators consume the most recent operands, which is last-in-first-out.',
    'The whole reason postfix notation exists is that it needs no brackets and no precedence rules, only a stack.'
  ],
  intuition: {
    input: 'tokens = ["4","13","5","/","+"]',
    visual:
      'token   action                          stack (bottom to top)\n' +
      '4       push                            4\n' +
      '13      push                            4 13\n' +
      '5       push                            4 13 5\n' +
      '/       b=pop()=5, a=pop()=13           4\n' +
      '        push a / b = 13 / 5 = 2         4 2\n' +
      '+       b=pop()=2, a=pop()=4            (empty)\n' +
      '        push 4 + 2 = 6                  6\n' +
      '\n' +
      'the single remaining value is the answer',
    steps: [
      { state: 'stack: 4 13 5', say: 'Numbers are pushed and wait to be used.' },
      { state: '', say: 'An operator pops its two operands. Here is the trap: the FIRST value you pop is the RIGHT-hand operand, because it was pushed last.' },
      { state: 'stack: 4 2', say: 'So for `/`, `b = pop()` then `a = pop()`, and the result is `a / b`. Getting this backwards gives `5 / 13 = 0` instead of `2`.' },
      { state: '', say: '`+` and `*` are commutative, so the order does not matter for them. `-` and `/` are not, and those are where this bug hides.' },
      { state: 'stack: 6', say: 'Push the result back so it can be an operand for the next operator. When the tokens run out, exactly one value remains: the answer.' },
      { state: '', say: 'Java\'s integer division already truncates toward zero, which is what the problem asks for. `13 / 5` is 2 and `-13 / 5` is -2.' }
    ],
    takeaway: 'Pop order is reversed relative to reading order. `b = pop(); a = pop(); result = a OP b` is worth memorising as one unit.'
  },
  hints: [
    'When you meet an operator, which two numbers does it apply to? Where are they relative to everything else you have read?',
    'Push numbers. On an operator, pop twice, apply, push the result. Be careful which popped value is the left operand.',
    'Pseudo-code: `for t in tokens: if operator: b = pop(); a = pop(); push(apply(a, t, b)) else: push(parseInt(t)); return pop()`'
  ],
  methodSignature: 'public int evalRPN(String[] tokens)',
  javaTemplate: 'monotonic-stack',
  javaSolution: `import java.util.*;

class Solution {
    public int evalRPN(String[] tokens) {
        Deque<Integer> stack = new ArrayDeque<>();

        for (String token : tokens) {
            switch (token) {
                // Commutative, so pop order does not matter.
                case "+":
                    stack.push(stack.pop() + stack.pop());
                    break;
                case "*":
                    stack.push(stack.pop() * stack.pop());
                    break;

                // NOT commutative. The first pop is the RIGHT operand, because
                // it was pushed most recently.
                case "-": {
                    int b = stack.pop();
                    int a = stack.pop();
                    stack.push(a - b);
                    break;
                }
                case "/": {
                    int b = stack.pop();
                    int a = stack.pop();
                    // Java integer division already truncates toward zero,
                    // which is exactly what the problem specifies.
                    stack.push(a / b);
                    break;
                }
                default:
                    stack.push(Integer.parseInt(token));
            }
        }

        // A valid expression leaves exactly one value behind.
        return stack.pop();
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'one pass; each token does a constant amount of stack work',
    space: 'O(n)', spaceWhy: 'the stack of pending operands'
  },
  testCases: [
    { input: { tokens: ['2', '1', '+', '3', '*'] }, expected: '9' },
    { input: { tokens: ['4', '13', '5', '/', '+'] }, expected: '6' },
    { input: { tokens: ['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+'] }, expected: '22' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.evalRPN(new String[]{"2", "1", "+", "3", "*"}));
        System.out.println(s.evalRPN(new String[]{"4", "13", "5", "/", "+"}));
        System.out.println(s.evalRPN(new String[]{"10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"}));
    }
}`,
  commonMistakes: [
    'Getting the operand order backwards for `-` and `/`. `["4","13","5","/","+"]` returns 4 instead of 6 when you do.',
    'Detecting numbers with a length check, so `"-11"` is treated as an operator. Test for the four operators explicitly and treat everything else as a number.',
    'Writing `stack.push(stack.pop() - stack.pop())`. Java evaluates left to right so this is `right - left`, which is wrong, and it reads as if it should work.',
    'Trying to handle operator precedence. Postfix has none; that is the entire point of the notation.'
  ],
  followUps: [
    'Basic Calculator II handles infix with precedence, which needs either two stacks or a precedence-aware scan.',
    'The shunting-yard algorithm converts infix to postfix using a stack, and it is the other half of this story.'
  ]
},

{
  id: 'daily-temperatures',
  leetcodeNumber: 739,
  title: 'Daily Temperatures',
  url: 'https://leetcode.com/problems/daily-temperatures/',
  pattern: 'stack',
  difficulty: 'Medium',
  order: 10,
  tags: ['monotonic-stack', 'next-greater', 'indexes'],
  problemSummary: 'For each day, report how many days you must wait until a warmer day. Put 0 where no warmer day ever comes.',
  examples: [
    { input: 'temperatures = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]', note: 'Day 2 has 75 and must wait until day 6 with 76, which is 4 days.' },
    { input: 'temperatures = [30,40,50,60]', output: '[1,1,1,0]', note: 'Warmer every day until the last.' }
  ],
  constraints: ['1 <= temperatures.length <= 10^5', '30 <= temperatures[i] <= 100'],
  techniqueNote: 'the same monotonic stack as Next Greater Element, except the answer is a **distance**, so the stack must hold indexes rather than values.',
  signals: [
    '"How long until something bigger" is the next-greater question with a distance attached.',
    'The answer needs positions, which is the signal to push **indexes** and read the values through them.',
    'n is 10^5, so the O(n²) forward scan will time out. That rules out the obvious solution.'
  ],
  intuition: {
    input: 'temperatures = [73,74,75,71,69,72,76,73]',
    visual:
      'stack holds INDEXES of days still waiting, temperatures decreasing\n' +
      '\n' +
      'i=0 (73)  stack: [0]\n' +
      'i=1 (74)  74 > 73  -> day 0 answered: 1 - 0 = 1      stack: [1]\n' +
      'i=2 (75)  75 > 74  -> day 1 answered: 2 - 1 = 1      stack: [2]\n' +
      'i=3 (71)  colder, wait                               stack: [2,3]\n' +
      'i=4 (69)  colder, wait                               stack: [2,3,4]\n' +
      'i=5 (72)  72 > 69 -> day 4: 5-4 = 1\n' +
      '          72 > 71 -> day 3: 5-3 = 2                  stack: [2,5]\n' +
      'i=6 (76)  76 > 72 -> day 5: 6-5 = 1\n' +
      '          76 > 75 -> day 2: 6-2 = 4                  stack: [6]\n' +
      'i=7 (73)  colder, wait                               stack: [6,7]\n' +
      '\n' +
      'days 6 and 7 never warm up  ->  0, which int[] already holds',
    steps: [
      { state: 'stack: [0]', say: 'Same sentence as Next Greater Element: the stack holds days still waiting to learn their answer.' },
      { state: 'day 0 answered', say: 'When a warmer day arrives, every waiting day colder than it is resolved at once. The answer is the index DIFFERENCE, which is why indexes are on the stack.' },
      { state: 'stack: [2,3,4]', say: 'A run of colder days piles up, in decreasing temperature order.' },
      { state: 'two answers at i=5', say: 'One warm day can resolve several waiting days in a single iteration, which is why this is a `while` and not an `if`.' },
      { state: 'leftovers stay 0', say: 'Whatever is still waiting at the end never warms up. A fresh Java `int[]` is already all zeros, so nothing extra is needed.' },
      { state: '', say: 'The amortised argument once more: each index is pushed exactly once and popped at most once, so the total work is O(n) despite the nesting.' }
    ],
    takeaway: 'Push values when the answer is a value. Push indexes when the answer is a position or a distance. That one decision is most of what makes monotonic-stack problems feel different from each other.'
  },
  hints: [
    'The brute force looks forward from each day until it finds a warmer one. What is its worst case, on input like `[100, 99, 98, ..., 30]`?',
    'Keep a stack of days that have not yet found a warmer day. When day `i` is warmer than the day on top, pop it and record `i - poppedIndex`.',
    'Pseudo-code: `for i: while stack not empty and temps[stack.peek()] < temps[i]: day = stack.pop(); out[day] = i - day; stack.push(i)`'
  ],
  methodSignature: 'public int[] dailyTemperatures(int[] temperatures)',
  javaTemplate: 'monotonic-stack',
  javaSolution: `import java.util.*;

class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;

        // Java zero-fills, and 0 is exactly the answer for days that never warm up.
        int[] out = new int[n];

        // INDEXES of days still waiting. Their temperatures decrease bottom to top.
        Deque<Integer> waiting = new ArrayDeque<>();

        for (int i = 0; i < n; i++) {
            // Today resolves every waiting day that was colder. A while, not an
            // if: one warm day can answer several at once.
            while (!waiting.isEmpty() && temperatures[waiting.peek()] < temperatures[i]) {
                int day = waiting.pop();
                out[day] = i - day;   // the DISTANCE, which needs the index
            }
            waiting.push(i);
        }

        return out;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'each index is pushed once and popped at most once, so the inner while is amortised O(1)',
    space: 'O(n)', spaceWhy: 'the stack, worst case every day on a strictly cooling run'
  },
  testCases: [
    { input: { temperatures: [73, 74, 75, 71, 69, 72, 76, 73] }, expected: '[1, 1, 4, 2, 1, 1, 0, 0]' },
    { input: { temperatures: [30, 40, 50, 60] }, expected: '[1, 1, 1, 0]' },
    { input: { temperatures: [30, 60, 90] }, expected: '[1, 1, 0]' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(java.util.Arrays.toString(s.dailyTemperatures(new int[]{73, 74, 75, 71, 69, 72, 76, 73})));
        System.out.println(java.util.Arrays.toString(s.dailyTemperatures(new int[]{30, 40, 50, 60})));
        System.out.println(java.util.Arrays.toString(s.dailyTemperatures(new int[]{30, 60, 90})));
    }
}`,
  commonMistakes: [
    'Pushing temperatures instead of indexes, which makes the distance impossible to compute.',
    'Using `if` instead of `while`, so only one waiting day is resolved per warm day.',
    'Writing `out[day] = i` instead of `i - day`. The answer is a wait, not a date.',
    'Explicitly filling the leftovers with 0. Harmless, and unnecessary in Java.',
    'The O(n²) forward scan, which times out on a strictly decreasing array of length 10^5.'
  ],
  followUps: [
    'Next Greater Element II makes the array circular, solved by running the same loop twice over indexes modulo n.',
    'Stock Span and Online Stock Span are the same problem looking backwards.',
    'Largest Rectangle in Histogram (next) uses this to find, for every bar, the nearest shorter bar on each side.'
  ]
},

{
  id: 'simplify-path',
  leetcodeNumber: 71,
  title: 'Simplify Path',
  url: 'https://leetcode.com/problems/simplify-path/',
  pattern: 'stack',
  difficulty: 'Medium',
  order: 11,
  tags: ['parsing', 'undo', 'string'],
  problemSummary: 'Turn a Unix-style absolute path into its canonical form: a single leading slash, no trailing slash, no repeated slashes, `.` removed, and each `..` cancelling the directory before it.',
  examples: [
    { input: 'path = "/home//foo/"', output: '"/home/foo"', note: 'Repeated and trailing slashes collapse.' },
    { input: 'path = "/a/./b/../../c/"', output: '"/c"', note: '`.` is a no-op, and the two `..` remove b and then a.' },
    { input: 'path = "/../"', output: '"/"', note: 'Going above the root does nothing.' }
  ],
  constraints: ['1 <= path.length <= 3000', 'path consists of English letters, digits, periods, slashes and underscores', 'path is a valid absolute Unix path starting with a single slash'],
  techniqueNote: 'a stack of directory names. `..` is a pop, `.` is a no-op, and anything else is a push.',
  signals: [
    '**Cancel the previous one** appears again, this time as `..`.',
    'The result is a sequence built by pushing and popping, which is a stack even though the output is read front to back.',
    'Splitting on the delimiter first turns a fiddly character-by-character parse into a clean loop over tokens.'
  ],
  intuition: {
    input: 'path = "/a/./b/../../c/"',
    visual:
      'split on "/" gives  ["", "a", ".", "b", "..", "..", "c", ""]\n' +
      '\n' +
      'token   meaning                stack\n' +
      '""      artefact, skip         -\n' +
      'a       directory, push        a\n' +
      '.       stay here, skip        a\n' +
      'b       push                   a b\n' +
      '..      pop                    a\n' +
      '..      pop                    (empty)\n' +
      'c       push                   c\n' +
      '""      skip                   c\n' +
      '\n' +
      'join with slashes  ->  "/c"',
    steps: [
      { state: '', say: 'Split on `"/"` first. `String.split` produces empty tokens for leading and repeated slashes, and skipping empties handles both cases at once.' },
      { state: 'stack: a', say: 'A real directory name is a push.' },
      { state: 'stack: a', say: '`.` means "this directory", so skip it entirely.' },
      { state: 'stack: a', say: '`..` means "go up", which is a pop. Guard it: popping at the root must do nothing, because `/..` is still `/`.' },
      { state: 'stack: c', say: 'Continue to the end. The stack now holds the canonical directories in order.' },
      { state: '"/c"', say: 'Join with a leading slash before each name. That gives the single leading slash and no trailing slash for free. An empty stack means the root, `"/"`.' }
    ],
    takeaway: 'Split on the delimiter before you start. Most of the "hard" cases in this problem, leading, trailing and repeated slashes, become one `isEmpty()` check.'
  },
  hints: [
    'What does `..` do to the directory before it? What structure is "remove the most recent thing"?',
    'Split the path on `"/"`. Skip empty tokens and `"."`. On `".."` pop if anything is there. Otherwise push. Then join with slashes, and remember the root case.',
    'Pseudo-code: `for part in path.split("/"): if part empty or ".": continue; if "..": if stack not empty: pop; else: push(part). Then join "/" + each, or "/" if empty.`'
  ],
  methodSignature: 'public String simplifyPath(String path)',
  javaTemplate: 'monotonic-stack',
  javaSolution: `import java.util.*;

class Solution {
    public String simplifyPath(String path) {
        // Using a Deque from the tail so that iteration comes out in path order.
        Deque<String> dirs = new ArrayDeque<>();

        // split("/") yields empty tokens for the leading slash and for any
        // repeated slashes, so skipping empties handles both cases.
        for (String part : path.split("/")) {
            if (part.isEmpty() || part.equals(".")) {
                continue;                       // "." means stay here
            }
            if (part.equals("..")) {
                if (!dirs.isEmpty()) {          // "/.." at the root is still "/"
                    dirs.pollLast();
                }
            } else {
                dirs.offerLast(part);
            }
        }

        // A leading slash before every name gives the single leading slash and
        // no trailing slash automatically.
        StringBuilder sb = new StringBuilder();
        for (String dir : dirs) {
            sb.append('/').append(dir);
        }

        return sb.length() == 0 ? "/" : sb.toString();
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'the split is linear, and each token is pushed or popped at most once',
    space: 'O(n)', spaceWhy: 'the token list plus the stack of surviving directory names'
  },
  testCases: [
    { input: { path: '/home//foo/' }, expected: '"/home/foo"' },
    { input: { path: '/a/./b/../../c/' }, expected: '"/c"' },
    { input: { path: '/../' }, expected: '"/"' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println("\\"" + s.simplifyPath("/home//foo/") + "\\"");
        System.out.println("\\"" + s.simplifyPath("/a/./b/../../c/") + "\\"");
        System.out.println("\\"" + s.simplifyPath("/../") + "\\"");
    }
}`,
  commonMistakes: [
    'Popping on `".."` without checking the stack is non-empty, which throws on `"/../"`.',
    'Forgetting the empty-stack case at the end and returning `""` rather than `"/"`.',
    'Treating any token starting with a dot as special. `"..."` and `"...a"` are ordinary directory names.',
    'Joining with a separator BETWEEN names and then prepending a slash. Appending `"/" + name` each time is simpler and cannot produce a trailing slash.',
    'Using `push`/`pop` on the Deque and then iterating, which yields the directories in reverse order.'
  ],
  followUps: [
    'The same stack handles relative paths if you allow leftover `..` tokens to remain in the output.',
    'Score of Parentheses and Decode String are the other classic "parse with a stack" problems.'
  ]
},

{
  id: 'largest-rectangle-in-histogram',
  leetcodeNumber: 84,
  title: 'Largest Rectangle in Histogram',
  url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
  pattern: 'stack',
  difficulty: 'Hard',
  order: 12,
  tags: ['monotonic-stack', 'spans', 'geometry'],
  problemSummary: 'Each value is the height of a bar of width one, standing side by side. Find the area of the largest rectangle that fits entirely inside the histogram.',
  examples: [
    { input: 'heights = [2,1,5,6,2,3]', output: '10', note: 'The bars of height 5 and 6 give a rectangle 5 tall and 2 wide.' },
    { input: 'heights = [2,4]', output: '4', note: 'The single bar of height 4.' }
  ],
  constraints: ['1 <= heights.length <= 10^5', '0 <= heights[i] <= 10^4'],
  techniqueNote: 'a monotonic increasing stack. Each bar is popped exactly when its rectangle is forced to end, and at that moment the width is fully known.',
  signals: [
    'Largest area under a skyline, or spans bounded by the nearest smaller element on each side.',
    'For each bar, the rectangle at that HEIGHT extends left and right until it meets a shorter bar. That is the next-smaller question on both sides.',
    'n is 10^5, so O(n²) is out and the answer must be a single amortised pass.'
  ],
  intuition: {
    input: 'heights = [2,1,5,6,2,3]',
    visual:
      'for each bar, its rectangle spans until a SHORTER bar blocks it\n' +
      '\n' +
      'the stack holds indexes with INCREASING heights, so the bar below any\n' +
      'index is the nearest shorter bar to its left\n' +
      '\n' +
      'i=0 h=2   push                              stack: [0]           (2)\n' +
      'i=1 h=1   1 <= 2, pop 0: h=2, left=-1,\n' +
      '          width = 1-(-1)-1 = 1, area 2      stack: [1]           (1)\n' +
      'i=2 h=5   push                              stack: [1,2]         (1,5)\n' +
      'i=3 h=6   push                              stack: [1,2,3]       (1,5,6)\n' +
      'i=4 h=2   pop 3: h=6, left=2, w=4-2-1=1, area 6\n' +
      '          pop 2: h=5, left=1, w=4-1-1=2, area 10   <- answer\n' +
      '          push                              stack: [1,4]         (1,2)\n' +
      'i=5 h=3   push                              stack: [1,4,5]       (1,2,3)\n' +
      'i=6 SENTINEL h=0, flushes everything:\n' +
      '          pop 5: h=3, left=4, w=6-4-1=1, area 3\n' +
      '          pop 4: h=2, left=1, w=6-1-1=4, area 8\n' +
      '          pop 1: h=1, left=-1, w=6-(-1)-1=6, area 6',
    steps: [
      { state: '', say: 'Start from the right question. For a rectangle of exactly the height of bar `i`, how wide can it be? It extends left and right until it hits a bar SHORTER than `heights[i]`. So you need the nearest shorter bar on each side.' },
      { state: 'stack increasing', say: 'Keep a stack of indexes whose heights increase. That gives the left boundary for free: for the index on top, the one beneath it is the nearest shorter bar to its left.' },
      { state: 'i=1 pops index 0', say: 'When a bar shorter than the top arrives, the top bar can go no further right. So `i` is its right boundary, and this is the exact moment its width becomes known.' },
      { state: 'width = i - left - 1', say: 'Width is `i - leftBoundary - 1`, where `leftBoundary` is the new stack top after popping, or `-1` if the stack is empty (nothing shorter to the left, so the rectangle reaches the very start).' },
      { state: 'area 10', say: 'At `i = 4` the bar of height 5 is popped, with left boundary 1 and right boundary 4, giving width 2 and area 10. That is the answer.' },
      { state: 'sentinel', say: 'The loop runs to `i == n` with a virtual bar of height 0. That sentinel is shorter than everything, so it flushes the stack and no leftover case is needed.' },
      { state: '', say: 'Each index is pushed once and popped once, so the whole thing is O(n).' }
    ],
    takeaway: 'A pop is the moment a rectangle is forced to end, so it is the moment both its boundaries are known. Add a height-0 sentinel and the "leftovers on the stack" case disappears.'
  },
  hints: [
    'Fix one bar. The rectangle whose height equals that bar extends sideways until what happens? Which two facts about position do you need?',
    'You need the nearest shorter bar to the left and to the right of every bar. Keep a stack of indexes with increasing heights: when a shorter bar arrives, the popped bar has found its right boundary, and the new stack top is its left boundary.',
    'Pseudo-code: `for i in 0..n (inclusive): cur = (i == n) ? 0 : heights[i]; while stack not empty and heights[peek] >= cur: h = heights[pop()]; left = stack.isEmpty() ? -1 : peek; best = max(best, h * (i - left - 1)); push(i)`'
  ],
  methodSignature: 'public int largestRectangleArea(int[] heights)',
  javaTemplate: 'monotonic-stack',
  javaSolution: `import java.util.*;

class Solution {
    public int largestRectangleArea(int[] heights) {
        // INDEXES, with heights increasing from bottom to top. That ordering is
        // what makes "the entry below me is my nearest shorter bar on the left"
        // true at all times.
        Deque<Integer> stack = new ArrayDeque<>();
        int best = 0;

        // Note i <= heights.length. The extra step is a virtual bar of height 0,
        // shorter than everything, which flushes the stack so there is no
        // separate leftover pass to write.
        for (int i = 0; i <= heights.length; i++) {
            int cur = (i == heights.length) ? 0 : heights[i];

            while (!stack.isEmpty() && heights[stack.peek()] >= cur) {
                int height = heights[stack.pop()];

                // After popping, the new top is the nearest SHORTER bar to the
                // left. Empty means nothing shorter exists, so the rectangle
                // reaches index 0, which -1 encodes.
                int leftBoundary = stack.isEmpty() ? -1 : stack.peek();

                // Right boundary is i, left boundary is exclusive on both sides.
                int width = i - leftBoundary - 1;

                best = Math.max(best, height * width);
            }

            stack.push(i);
        }

        return best;
    }
}
`,
  complexity: {
    time: 'O(n)', timeWhy: 'each index is pushed exactly once and popped exactly once across the whole run',
    space: 'O(n)', spaceWhy: 'the stack, worst case every bar on a strictly increasing histogram'
  },
  testCases: [
    { input: { heights: [2, 1, 5, 6, 2, 3] }, expected: '10' },
    { input: { heights: [2, 4] }, expected: '4' },
    { input: { heights: [1] }, expected: '1' }
  ],
  judgeDriver: `public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(s.largestRectangleArea(new int[]{2, 1, 5, 6, 2, 3}));
        System.out.println(s.largestRectangleArea(new int[]{2, 4}));
        System.out.println(s.largestRectangleArea(new int[]{1}));
    }
}`,
  commonMistakes: [
    'Computing the width as `i - stack.peek()` before popping, or forgetting the `- 1`. The boundaries are exclusive on both sides, so it is `i - leftBoundary - 1`.',
    'Looping only to `n - 1` and then forgetting to drain the stack. The height-0 sentinel exists to make that impossible.',
    'Using `-1` as the left boundary only sometimes. An empty stack always means "nothing shorter to the left", so the rectangle starts at index 0.',
    'Popping with `>` instead of `>=`. Equal heights must also be popped, or a flat region is measured too narrow.',
    'The O(n²) approach that expands left and right from every bar. It is a good way to understand the problem and it times out at n = 10^5.'
  ],
  followUps: [
    'Maximal Rectangle in a binary matrix runs this per row over running column heights, turning a 2-D problem into n calls of this one.',
    'Trapping Rain Water can also be solved with a monotonic stack, and it is worth writing both ways to see the difference between accumulating and measuring.',
    'The same nearest-smaller-on-both-sides idea gives Sum of Subarray Minimums.'
  ]
}

);
