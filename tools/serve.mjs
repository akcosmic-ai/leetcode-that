/* serve.mjs :: zero-dependency static server, for when you need a real http
 * origin instead of file://.
 *
 *   node tools/serve.mjs          -> http://localhost:8000
 *   node tools/serve.mjs 9000     -> a different port
 *
 * You only need this for:
 *   - the service worker / installing to a phone home screen,
 *   - the optional Judge0 run mode, which RapidAPI often blocks from file://.
 * Normal desktop use is just double-clicking index.html.
 */
import { createServer } from 'node:http';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = parseInt(process.argv[2], 10) || 8000;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.md': 'text/markdown; charset=utf-8',
  '.ico': 'image/x-icon'
};

createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/' || rel === '') rel = '/index.html';

  // keep the request inside ROOT
  const target = join(ROOT, normalize(rel).replace(/^(\.\.[/\\])+/, ''));
  if (!target.startsWith(ROOT)) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  if (!existsSync(target) || statSync(target).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('404 ' + rel);
    return;
  }

  res.writeHead(200, {
    'Content-Type': TYPES[extname(target).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-cache'
  });
  createReadStream(target).pipe(res);
}).listen(PORT, () => {
  console.log(`leetcode-that on http://localhost:${PORT}`);
  console.log('Ctrl-C to stop.');
});
