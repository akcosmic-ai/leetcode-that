/* judge.js :: OPTIONAL online compile-and-run through Judge0 CE.
 *
 * OFF BY DEFAULT. Everything else in this app works with no network. Turn this
 * on in Settings and paste a Judge0 (RapidAPI) key to get a real javac + java
 * run of what you typed.
 *
 * Two things I cannot verify from here, stated plainly:
 *  1. The round trip needs YOUR api key, so I have never executed it. If it
 *     misbehaves, open the browser console: the raw response is logged.
 *  2. Judge0 on RapidAPI often rejects requests whose Origin is "null", which
 *     is what a page opened as file:// sends. If you get a CORS or 403 error,
 *     serve the folder over http first:  python -m http.server 8000
 *
 * Judge0 requires the Java entry class to be called Main, so a submission is
 * built as:   <your code>  +  <the problem's judgeDriver, a public class Main>
 */
(function (LC) {
  'use strict';

  function b64encode(str) {
    var bytes = new TextEncoder().encode(str), bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  function b64decode(b64) {
    if (b64 == null) return '';
    try {
      var bin = atob(b64), bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return new TextDecoder().decode(bytes);
    } catch (e) { return String(b64); }
  }

  function cfg() {
    var s = LC.settings();
    return {
      enabled: !!s.judgeEnabled,
      url: (s.judgeUrl || '').replace(/\/+$/, ''),
      key: s.judgeKey || '',
      host: s.judgeHost || '',
      languageId: s.judgeLanguageId || 62
    };
  }

  function ready() {
    var c = cfg();
    return c.enabled && !!c.url && !!c.key;
  }

  /* Expected stdout for a driver run: one line per visible test case. */
  function expectedFor(problem) {
    return (problem.testCases || []).map(function (t) { return String(t.expected); }).join('\n');
  }

  function submit(source, stdin, expected) {
    var c = cfg();
    if (!c.enabled) return Promise.reject(new Error('Online run is switched off. Turn it on in Settings.'));
    if (!c.url || !c.key) return Promise.reject(new Error('Judge0 URL and API key are both required. See Settings.'));

    var headers = { 'Content-Type': 'application/json' };
    if (c.key) { headers['X-RapidAPI-Key'] = c.key; headers['x-rapidapi-key'] = c.key; }
    if (c.host) { headers['X-RapidAPI-Host'] = c.host; headers['x-rapidapi-host'] = c.host; }

    var body = {
      language_id: c.languageId,
      source_code: b64encode(source),
      stdin: b64encode(stdin || '')
    };
    if (expected != null) body.expected_output = b64encode(expected);

    var url = c.url + '/submissions?base64_encoded=true&wait=true&fields=*';
    return fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(body) })
      .then(function (r) {
        return r.text().then(function (txt) {
          var json = null;
          try { json = JSON.parse(txt); } catch (e) {}
          if (!r.ok) {
            console.warn('[judge0] HTTP ' + r.status, txt);
            throw new Error('Judge0 returned HTTP ' + r.status + '. ' +
              (json && (json.message || json.error) ? (json.message || json.error) : txt.slice(0, 200)));
          }
          return json;
        });
      })
      .then(function (j) {
        console.debug('[judge0] response', j);
        return {
          statusId: j.status ? j.status.id : 0,
          status: j.status ? j.status.description : 'unknown',
          stdout: b64decode(j.stdout),
          stderr: b64decode(j.stderr),
          compileOutput: b64decode(j.compile_output),
          message: b64decode(j.message),
          time: j.time,
          memory: j.memory,
          accepted: j.status && j.status.id === 3
        };
      })
      .catch(function (err) {
        if (err instanceof TypeError) {
          throw new Error('Network or CORS failure reaching Judge0. If this page is open as file://, ' +
                          'serve it over http first: python -m http.server 8000. Original: ' + err.message);
        }
        throw err;
      });
  }

  var judge = {
    ready: ready,
    config: cfg,
    expectedFor: expectedFor,

    /* Does this problem have a driver, i.e. can we assert against the tests? */
    hasDriver: function (problem) { return !!(problem && problem.judgeDriver); },

    /* Full check: your Solution plus the problem's Main driver, compared to the
     * expected output of the visible test cases. */
    runAgainstTests: function (problem, userCode) {
      if (!problem.judgeDriver) {
        return Promise.reject(new Error('This problem has no test driver yet, so there is nothing to assert ' +
          'against. Use "Compile only" to check that it builds, or add a judgeDriver to its data entry.'));
      }
      var source = userCode + '\n\n' + problem.judgeDriver + '\n';
      return submit(source, '', expectedFor(problem)).then(function (res) {
        res.expected = expectedFor(problem);
        res.perTest = comparePerLine(res.stdout, res.expected, problem.testCases || []);
        return res;
      });
    },

    /* No driver needed: just compile and run whatever is in the editor. Catches
     * real javac errors, which is most of the value. */
    compileAndRun: function (userCode, stdin) {
      var hasMain = /\bpublic\s+static\s+void\s+main\s*\(/.test(userCode);
      var source = userCode;
      if (!hasMain) {
        source = userCode + '\n\npublic class Main {\n    public static void main(String[] args) {\n' +
                 '        System.out.println("Compiled. No main() of your own, so nothing ran.");\n    }\n}\n';
      } else if (!/\bpublic\s+class\s+Main\b/.test(userCode)) {
        // Judge0 needs the entry class to be Main; warn rather than silently fail.
        return submit(source, stdin, null).then(function (r) {
          if (r.compileOutput && /class .* is public, should be declared in a file named/.test(r.compileOutput)) {
            r.hint = 'Judge0 runs Java from a file called Main.java, so your public class must be named Main.';
          }
          return r;
        });
      }
      return submit(source, stdin, null);
    },

    submit: submit
  };

  function comparePerLine(stdout, expected, testCases) {
    var got = String(stdout || '').replace(/\s+$/, '').split('\n');
    var want = String(expected || '').replace(/\s+$/, '').split('\n');
    return testCases.map(function (tc, i) {
      var g = (got[i] === undefined ? '' : got[i]).trim();
      var w = (want[i] === undefined ? '' : want[i]).trim();
      return { index: i, expected: w, actual: g, pass: g === w };
    });
  }

  LC.judge = judge;
})(window.LC = window.LC || {});
