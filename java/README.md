# java/ — generated Java source tree

**Generated. Do not hand-edit.** The single source of truth is `data/problems/*.js` and
`data/templates/*.js`. Regenerate with:

```bash
node tools/export-java.mjs --compile
```

## What is here

Every solution and every pattern template as a real `.java` file, one package per
problem so that each can keep the LeetCode class name `Solution` without colliding.

```
java/src/lct/<pattern>/<problem>/Solution.java   annotated solution + full write-up in the header
java/src/lct/<pattern>/<problem>/Main.java       runnable driver, prints one line per test case
java/src/lct/templates/<pattern>/*.java          the reusable pattern templates
```

## Open it in IntelliJ

*File → Open* this repo, then mark `java/src` as a **Sources Root** (right-click the
folder → *Mark Directory as → Sources Root*). Every `Main` becomes a green run button.

## Compile and run everything from the command line

```bash
javac -d java/out $(find java/src -name "*.java")
java -cp java/out lct.arrayshashing.twosum.Main
```

On Windows PowerShell:

```powershell
javac -d java\out (Get-ChildItem -Recurse java\src -Filter *.java | ForEach-Object FullName)
java -cp java\out lct.arrayshashing.twosum.Main
```
