/* sw.js :: service worker, so the site installs to a phone or iPad home screen
 * and keeps working with no signal.
 *
 * Only registered over http(s) (see js/app.js). Opening index.html as a file
 * needs no service worker: it is already local.
 *
 * Strategy: stale-while-revalidate. Serve from cache instantly, then refresh the
 * cache in the background. That means new problem data lands on the next visit
 * without me having to remember to bump CACHE_VERSION for every content change.
 */
const CACHE_VERSION = 'lct-v1';

const PATTERN_IDS = [
  'arrays-hashing', 'two-pointers', 'sliding-window', 'stack', 'binary-search',
  'linked-list', 'trees', 'tries', 'heap', 'backtracking', 'graphs',
  'dp-1d', 'dp-2d', 'greedy', 'intervals', 'bit-manipulation', 'math-geometry'
];

const APP_JS = [
  'java-api', 'store', 'srs', 'diff', 'judge', 'editor', 'filters', 'progress',
  'ui', 'view-dashboard', 'view-patterns', 'view-problem', 'view-cheatsheet',
  'view-settings', 'router', 'app'
].map((n) => `js/${n}.js`);

const ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'assets/css/app.css',
  'assets/vendor/cm6.bundle.js',
  'assets/icons/icon.svg',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'data/patterns.js',
  ...PATTERN_IDS.map((id) => `data/templates/${id}.js`),
  ...PATTERN_IDS.map((id) => `data/problems/${id}.js`),
  ...APP_JS
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      // addAll fails the whole install if any single file 404s, so add
      // individually and tolerate gaps.
      Promise.all(ASSETS.map((url) =>
        cache.add(new Request(url, { cache: 'reload' })).catch((e) => {
          console.warn('[sw] could not cache', url, e.message);
        })
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // never touch Judge0 traffic

  event.respondWith(
    caches.open(CACHE_VERSION).then((cache) =>
      cache.match(req).then((hit) => {
        const network = fetch(req).then((res) => {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        }).catch(() => hit);           // offline: whatever we have is the answer

        return hit || network;
      })
    )
  );
});
