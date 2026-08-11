# Problem data schema

One object per problem, pushed into `window.LC_PROBLEMS` from
`data/problems/<pattern-id>.js`. **Adding a problem is a pure data edit.** The
dashboard counts, pattern page ordering, filters, search, routing and the SRS all
read from this array. Never touch a view file to add a problem.

Inline `` `code` `` and `**bold**` render in every prose field.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | kebab-case, globally unique. Becomes `#/problem/<id>` and the localStorage key. |
| `leetcodeNumber` | number | yes | The official problem number. |
| `title` | string | yes | The official title. |
| `url` | string | yes | Link to the official LeetCode page. |
| `pattern` | string | yes | Must equal a `data/patterns.js` `id`. |
| `difficulty` | `'Easy' \| 'Medium' \| 'Hard'` | yes | Drives the mix report and the filter. |
| `order` | number | yes | Position within the pattern. Keep easy → hard. |
| `tags` | string[] | yes | Free-form, feeds the tag filter. |
| `problemSummary` | string | yes | **Your own paraphrase.** Never LeetCode's wording. |
| `examples` | `{input, output, note?}[]` | yes | At least one. |
| `constraints` | string[] | yes | Shown in monospace. |
| `techniqueNote` | string | no | One line on how the pattern applies *here*. |
| `signals` | string[] | yes | The tells that point at this technique. This is the transferable skill. |
| `intuition` | `{input, visual?, steps[], takeaway}` | yes | Step 3. `steps` is `{state?, say}[]`. No code. |
| `hints` | string[3] | yes | Ladder: nudge → approach → pseudo-code. |
| `javaSolution` | string | yes | Full annotated class. Must compile under JDK 11. |
| `complexity` | `{time, timeWhy, space, spaceWhy}` | yes | |
| `commonMistakes` | string[] | yes | |
| `followUps` | string[] | no | |
| `methodSignature` | string | yes | Used to generate the editor starter. |
| `starter` | string | no | Overrides the generated starter completely. |
| `starterExtras` | string | no | Appended after the `Solution` class, e.g. a `ListNode` definition. |
| `javaTemplate` | string | no | A `LC_TEMPLATES` key, or inline Java. |
| `testCases` | `{input, expected}[]` | yes | `input` may be an object or a string. `expected` is compared as a trimmed string. |
| `judgeDriver` | string | no | A `public class Main` that prints one line per test case. Enables **Run tests** in Judge0 mode. Without it, only **Compile only** is offered. |

## Minimum viable entry

```js
{
  id: 'contains-duplicate',
  leetcodeNumber: 217,
  title: 'Contains Duplicate',
  url: 'https://leetcode.com/problems/contains-duplicate/',
  pattern: 'arrays-hashing',
  difficulty: 'Easy',
  order: 2,
  tags: ['hash-set'],
  problemSummary: 'Return true if any value appears more than once.',
  examples: [{ input: 'nums = [1,2,3,1]', output: 'true', note: '1 repeats' }],
  constraints: ['1 <= nums.length <= 10^5'],
  signals: ['The word "duplicate"'],
  intuition: { input: '[1,2,3,1]', steps: [{ state: 'seen = {}', say: 'Add 1.' }], takeaway: 'A set remembers.' },
  hints: ['nudge', 'approach', 'pseudo-code'],
  methodSignature: 'public boolean containsDuplicate(int[] nums)',
  javaSolution: 'class Solution { ... }',
  complexity: { time: 'O(n)', timeWhy: 'one pass', space: 'O(n)', spaceWhy: 'the set' },
  testCases: [{ input: { nums: [1,2,3,1] }, expected: 'true' }],
  commonMistakes: ['Sorting when a set is O(n).']
}
```

## The `judgeDriver` contract

It must be a `public class Main` (Judge0 compiles Java from `Main.java`), it must
print **exactly one line per entry in `testCases`, in the same order**, and each
line must match that entry's `expected` string after trimming.

```java
public class Main {
    public static void main(String[] args) {
        Solution s = new Solution();
        System.out.println(java.util.Arrays.toString(s.twoSum(new int[]{2,7,11,15}, 9)));
        System.out.println(java.util.Arrays.toString(s.twoSum(new int[]{3,3}, 6)));
    }
}
```

## Legal

`problemSummary`, `examples` and `constraints` must be written in your own words.
LeetCode owns the original statements. Always link `url` so the original is one
click away.
