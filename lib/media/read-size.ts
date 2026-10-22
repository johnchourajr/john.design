/**
 * Intrinsic size of an image or video from its bytes, without decoding it.
 * Pure (no fs or path imports) so `scripts/media-manifest.mts` can run it
 * under plain Node as well as the Next build. See #87 and #88.
 */

export type MediaSize = { width: number; height: number };

export function readImageSize(b: Buffer): MediaSize | null {
  // PNG: IHDR is always the first chunk.
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) {
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  }
  // GIF: logical screen size.
  if (b.length > 10 && b.toString('ascii', 0, 3) === 'GIF') {
    return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
  }
  // WebP: VP8 / VP8L / VP8X.
  if (
    b.length > 30 &&
    b.toString('ascii', 0, 4) === 'RIFF' &&
    b.toString('ascii', 8, 12) === 'WEBP'
  ) {
    const chunk = b.toString('ascii', 12, 16);
    if (chunk === 'VP8X') {
      return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    }
    if (chunk === 'VP8L') {
      const bits = b.readUInt32LE(21);
      return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
    }
    if (chunk === 'VP8 ') {
      return {
        width: b.readUInt16LE(26) & 0x3fff,
        height: b.readUInt16LE(28) & 0x3fff,
      };
    }
  }
  // JPEG: walk the markers to the first SOFn, honouring EXIF orientation.
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let offset = 2;
    let rotated = false;
    while (offset + 9 < b.length) {
      if (b[offset] !== 0xff) return null;
      const marker = b[offset + 1];
      const length = b.readUInt16BE(offset + 2);
      if (marker === 0xe1) rotated = rotated || exifSwapsAxes(b, offset + 4);
      const isSof =
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc;
      if (isSof) {
        const height = b.readUInt16BE(offset + 5);
        const width = b.readUInt16BE(offset + 7);
        return rotated ? { width: height, height: width } : { width, height };
      }
      offset += 2 + length;
    }
  }
  return null;
}

/** True when an EXIF orientation of 5 to 8 turns the image on its side. */
function exifSwapsAxes(b: Buffer, start: number): boolean {
  if (b.toString('ascii', start, start + 4) !== 'Exif') return false;
  const tiff = start + 6;
  const little = b.toString('ascii', tiff, tiff + 2) === 'II';
  const u16 = (o: number) => (little ? b.readUInt16LE(o) : b.readUInt16BE(o));
  const u32 = (o: number) => (little ? b.readUInt32LE(o) : b.readUInt32BE(o));
  try {
    const ifd = tiff + u32(tiff + 4);
    const entries = u16(ifd);
    for (let i = 0; i < entries; i++) {
      const entry = ifd + 2 + i * 12;
      if (u16(entry) === 0x0112) return u16(entry + 8) >= 5;
    }
  } catch {
    return false;
  }
  return false;
}

/** MP4/MOV: the first track header (`tkhd`) with a non-zero size. */
export function readVideoSize(b: Buffer): MediaSize | null {
  let index = b.indexOf('tkhd');
  while (index !== -1) {
    const version = b[index + 4];
    // After version/flags: times, track id, duration, then 52 fixed bytes.
    const sizeOffset = index + 8 + (version === 1 ? 32 : 20) + 52;
    if (sizeOffset + 8 <= b.length) {
      const width = Math.round(b.readUInt32BE(sizeOffset) / 65536);
      const height = Math.round(b.readUInt32BE(sizeOffset + 4) / 65536);
      if (width > 0 && height > 0) return { width, height };
    }
    index = b.indexOf('tkhd', index + 4);
  }
  return null;
}
