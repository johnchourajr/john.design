// Records the size of every hosted media file in data/media-manifest.json, so
// pages know each asset's dimensions without the file being in public/ (#88).
//
//   node --experimental-strip-types scripts/media-manifest.mts [sourceRoot]
//
// sourceRoot defaults to `public`; keys are paths relative to it, e.g.
// `/journal-images/images/x.jpg`. Existing entries for files that aren't in
// sourceRoot are kept, so adding new media only needs the new files locally.

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

import { readImageSize, readVideoSize } from '../lib/media/read-size.ts';

const PREFIXES = ['journal-images'];
const MANIFEST = 'data/media-manifest.json';
const root = process.argv[2] ?? 'public';

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else yield path;
  }
}

let existing: Record<string, unknown> = {};
try {
  existing = JSON.parse(readFileSync(MANIFEST, 'utf8'));
} catch {
  existing = {};
}

const entries: Record<string, unknown> = { ...existing };
let scanned = 0;

for (const prefix of PREFIXES) {
  let files: string[];
  try {
    files = [...walk(join(root, prefix))];
  } catch {
    continue;
  }
  for (const file of files) {
    const key = '/' + relative(root, file).split(sep).join('/');
    const buffer = readFileSync(file);
    const size = /\.(mp4|mov|webm)$/i.test(file)
      ? readVideoSize(buffer)
      : readImageSize(buffer);
    entries[key] = size ? { ...size, bytes: buffer.length } : { bytes: buffer.length };
    scanned++;
  }
}

const sorted = Object.fromEntries(
  Object.entries(entries).sort(([a], [b]) => a.localeCompare(b)),
);
writeFileSync(MANIFEST, JSON.stringify(sorted, null, 2) + '\n');
console.log(`Scanned ${scanned} files; ${MANIFEST} has ${Object.keys(sorted).length} entries.`);
