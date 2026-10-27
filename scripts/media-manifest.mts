// Records the size of every hosted media file in data/media-manifest.json, so
// pages know each asset's dimensions without the file being in public/ (#88).
//
//   node --experimental-strip-types scripts/media-manifest.mts [sourceRoot]
//
// sourceRoot defaults to `public`; keys are paths relative to it, e.g.
// `/journal-images/images/x.jpg`. Existing journal entries for files that
// aren't in sourceRoot are kept, so adding new media only needs the new files
// locally. Work images are kept whole in `.media/work-images/` (#128), so
// that folder is the source of truth: frames deleted or set aside drop out.

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

import { readImageSize, readVideoSize } from '../lib/media/read-size.ts';

const PREFIXES = ['journal-images', 'work-images'];
const MIRRORED = ['work-images'];
const MANIFEST = 'data/media-manifest.json';
const root = process.argv[2] ?? 'public';

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    // `exclude/` (any case) holds media set aside by hand, which is never uploaded.
    if (name.startsWith('.') || /^exclude$/i.test(name)) continue;
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
  if (MIRRORED.includes(prefix)) {
    for (const key of Object.keys(entries)) {
      if (key.startsWith(`/${prefix}/`)) delete entries[key];
    }
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
