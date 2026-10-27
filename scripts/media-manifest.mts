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
//
// Work images (and video posters) also get a blurred placeholder, a 16px WebP
// as a data URL, in data/media-placeholders.json. It's kept apart from the
// manifest, which client code imports, and only the work page reads it.

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

import sharp from 'sharp';

import { readImageSize, readVideoSize } from '../lib/media/read-size.ts';

const PREFIXES = ['journal-images', 'work-images'];
const MIRRORED = ['work-images'];
const MANIFEST = 'data/media-manifest.json';
const PLACEHOLDERS = 'data/media-placeholders.json';
const PLACEHOLDER_PREFIX = 'work-images';
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
let placeholders: Record<string, string> | null = null;

/** A 16px-wide WebP of the image, as a data URL, for `next/image`'s blur. */
async function placeholderOf(buffer: Buffer) {
  const tiny = await sharp(buffer, { animated: false })
    .resize(16)
    .webp({ quality: 40 })
    .toBuffer();
  return `data:image/webp;base64,${tiny.toString('base64')}`;
}
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
    if (prefix === PLACEHOLDER_PREFIX && /\.(png|jpe?g|webp|gif)$/i.test(file)) {
      placeholders ??= {};
      placeholders[key] = await placeholderOf(buffer);
    }
    scanned++;
  }
}

const sorted = Object.fromEntries(
  Object.entries(entries).sort(([a], [b]) => a.localeCompare(b)),
);
writeFileSync(MANIFEST, JSON.stringify(sorted, null, 2) + '\n');
// Rebuilt whole from the work images, like their manifest entries.
if (placeholders) {
  const sortedPlaceholders = Object.fromEntries(
    Object.entries(placeholders).sort(([a], [b]) => a.localeCompare(b)),
  );
  writeFileSync(PLACEHOLDERS, JSON.stringify(sortedPlaceholders, null, 2) + '\n');
}
console.log(`Scanned ${scanned} files; ${MANIFEST} has ${Object.keys(sorted).length} entries.`);
