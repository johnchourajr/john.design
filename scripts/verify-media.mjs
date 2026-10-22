// Checks that every file in data/media-manifest.json is live on the media
// origin with the recorded size (see #88).
//
//   pnpm media:verify

import { readFileSync } from 'node:fs';

const ORIGIN = 'https://media.john.design';
const manifest = JSON.parse(readFileSync('data/media-manifest.json', 'utf8'));
const failures = [];

await Promise.all(
  Object.entries(manifest).map(async ([path, { bytes }]) => {
    // Compressed responses (e.g. SVG) drop Content-Length, so ask for identity.
    const res = await fetch(ORIGIN + encodeURI(path), {
      method: 'HEAD',
      headers: { 'accept-encoding': 'identity' },
    });
    const length = Number(res.headers.get('content-length'));
    if (res.status !== 200) failures.push(`${path}: HTTP ${res.status}`);
    else if (length !== bytes) failures.push(`${path}: ${length} bytes, expected ${bytes}`);
  }),
);

if (failures.length) {
  console.error(`${failures.length} of ${Object.keys(manifest).length} media files are missing or wrong:`);
  for (const failure of failures.sort()) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`All ${Object.keys(manifest).length} media files are live on ${ORIGIN}.`);
