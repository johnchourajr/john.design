// Route smoke test against a running production server (`pnpm build && pnpm start`).
// Checks every sitemap URL renders statically, and unknown slugs 404 instead of 500.
//
//   BASE_URL=http://localhost:3000 pnpm smoke

const BASE_URL = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
// Vercel Firewall denies short or bot user agents in production (#90).
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

const failures = [];

async function get(path) {
  const res = await fetch(BASE_URL + path, {
    headers: { 'user-agent': USER_AGENT },
    redirect: 'manual',
  });
  return { status: res.status, body: await res.text() };
}

function expect(ok, message) {
  if (!ok) failures.push(message);
}

const sitemap = await get('/sitemap.xml');
expect(sitemap.status === 200, `/sitemap.xml returned ${sitemap.status}`);

const paths = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  ([, loc]) => new URL(loc).pathname,
);
expect(paths.length > 0, 'sitemap.xml lists no URLs');

for (const path of paths) {
  const { status, body } = await get(path);
  expect(status === 200, `${path} returned ${status}`);
  expect(
    !body.includes('BAILOUT_TO_CLIENT_SIDE_RENDERING'),
    `${path} bails out to client-side rendering`,
  );
}

for (const path of ['/journal/does-not-exist', '/proposals/does-not-exist', '/does-not-exist']) {
  const { status } = await get(path);
  expect(status === 404, `${path} returned ${status}, expected 404`);
}

if (failures.length) {
  console.error(`Smoke test failed (${failures.length}):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`Smoke test passed: ${paths.length} sitemap URLs and 3 missing routes.`);
