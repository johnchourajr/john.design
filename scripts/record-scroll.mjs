// Records a page scrolling, for the work page's strips (#128): holds on the
// first screen, then pushes down the page a section at a time, easing into
// each stop and resting there, the way a person reads a page. Chrome's
// screencast streams the frames, encoded at a steady 30fps from their own
// timestamps (so a slow frame is held, not skipped over).
//
//   node scripts/record-scroll.mjs <browser-cdp-url> <out.mp4> [hold-s] [max-s]
//
// Drive it from scripts/capture-work-videos.sh, which opens the page first.
// Needs Node 22 (global WebSocket) and ffmpeg.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [cdpUrl, out, holdArg = '3', maxArg = '24'] = process.argv.slice(2);
const HOLD = Number(holdArg);
const MAX = Number(maxArg);
const FPS = 30;
/** Seconds to rest at each stop. */
const REST = 1.4;

/** Ease in and out (cubic), 0 to 1. */
const ease = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

// Where the page scrolls (the window, or the tallest scrolling element when it
// scrolls an inner container), how far it has scrolled, and the section tops
// worth stopping at, all in that scroller's coordinates.
const LAYOUT_JS = `(() => {
  let scroller = document.scrollingElement;
  let best = scroller.scrollHeight - innerHeight;
  for (const el of document.querySelectorAll('*')) {
    const range = el.scrollHeight - el.clientHeight;
    if (/(auto|scroll)/.test(getComputedStyle(el).overflowY) && range > best) {
      scroller = el;
      best = range;
    }
  }
  const origin = scroller === document.scrollingElement ? 0 : scroller.getBoundingClientRect().top;
  const tops = [...document.querySelectorAll('section, main > *, body > div > *, [class*=section i], [class*=slice i]')]
    .map((el) => el.getBoundingClientRect())
    .filter((box) => box.height > innerHeight * 0.3)
    .map((box) => Math.round(box.top - origin + scroller.scrollTop));
  return JSON.stringify({ at: scroller.scrollTop, max: best, tops: [...new Set(tops)].sort((a, b) => a - b) });
})()`;

const socket = new WebSocket(cdpUrl);
let nextId = 0;
const pending = new Map();
const listeners = [];
function send(method, params = {}, sessionId) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params, sessionId }));
  return new Promise((resolve) => pending.set(id, resolve));
}
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message.result ?? {});
    pending.delete(message.id);
  }
  for (const listener of listeners) listener(message);
});
await new Promise((resolve) => socket.addEventListener('open', resolve));

const { targetInfos } = await send('Target.getTargets');
// The web page agent-browser is driving, not a blank new-tab page beside it.
const pages = targetInfos.filter((t) => t.type === 'page' && /^https?:/.test(t.url));
const page = pages.find((t) => t.attached) ?? pages[0];
if (!page) throw new Error('No page open to record.');
const { sessionId } = await send('Target.attachToTarget', {
  targetId: page.targetId,
  flatten: true,
});
const { result } = await send(
  'Runtime.evaluate',
  { expression: 'JSON.stringify([innerWidth, innerHeight])', returnByValue: true },
  sessionId,
);
const [width, height] = JSON.parse(result.value);

const dir = mkdtempSync(join(tmpdir(), 'record-scroll-'));
const frames = [];
listeners.push((message) => {
  if (message.method !== 'Page.screencastFrame' || message.sessionId !== sessionId) return;
  const { data, metadata, sessionId: frameId } = message.params;
  const file = join(dir, `${String(frames.length).padStart(5, '0')}.jpg`);
  writeFileSync(file, Buffer.from(data, 'base64'));
  frames.push({ file, time: metadata.timestamp ?? Date.now() / 1000 });
  send('Page.screencastFrameAck', { sessionId: frameId }, sessionId);
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// Headless Chrome's screencast sends the view at CSS pixels whatever the
// pixel ratio, so a 1440x900 window records at 1440x900.
await send(
  'Page.startScreencast',
  { format: 'jpeg', quality: 92, everyNthFrame: 1 },
  sessionId,
);
await sleep(HOLD * 1000);

const layout = async () => {
  const { result: value } = await send(
    'Runtime.evaluate',
    { expression: LAYOUT_JS, returnByValue: true },
    sessionId,
  );
  return JSON.parse(value.value);
};

/** The next stop: a section top a comfortable push away, or most of a screen. */
function nextStop({ at, max, tops }) {
  const near = at + height * 0.4;
  const far = at + height * 1.3;
  const top = tops.find((t) => t > near && t <= far);
  return Math.min(top ?? at + height * 0.85, max);
}

// Each push is wheel input eased over its duration, so sites that smooth the
// wheel themselves (Lenis and the like) still see real input, and plain pages
// ease too. Longer pushes take a little longer.
const start = Date.now();
let state = await layout();
let stalls = 0;
const wheel = (deltaY) =>
  send(
    'Input.dispatchMouseEvent',
    { type: 'mouseWheel', x: width / 2, y: height / 2, deltaX: 0, deltaY },
    sessionId,
  );
while (state.at < state.max - 4 && Date.now() - start < MAX * 1000) {
  const distance = nextStop(state) - state.at;
  const duration = 0.9 + distance / 1800;
  const began = Date.now();
  let sent = 0;
  for (;;) {
    const t = Math.min((Date.now() - began) / (duration * 1000), 1);
    const target = distance * ease(t);
    if (target - sent >= 1 || t === 1) {
      await wheel(target - sent);
      sent = target;
    }
    if (t === 1) break;
    await sleep(1000 / 60);
  }
  await sleep(REST * 1000);
  const before = state.at;
  state = await layout();
  // A pinned section (a slider that turns the wheel into slides) holds the
  // page still for a few pushes; a page that ignores the wheel stops here.
  stalls = state.at <= before + 4 ? stalls + 1 : 0;
  if (stalls >= 6) break;
}
await sleep(1000);
await send('Page.stopScreencast', {}, sessionId);
socket.close();

if (frames.length < 2) throw new Error(`Only ${frames.length} frames arrived.`);
// Each frame lasts until the next one arrived; ffmpeg resamples to FPS.
frames.sort((a, b) => a.time - b.time);
const list = frames
  .map((frame, i) => {
    const next = frames[i + 1]?.time ?? frame.time + 1 / FPS;
    const duration = Math.max(next - frame.time, 0.001);
    return `file '${frame.file}'\nduration ${duration.toFixed(4)}`;
  })
  .join('\n');
writeFileSync(join(dir, 'frames.txt'), `${list}\nfile '${frames.at(-1).file}'\n`);
execFileSync('ffmpeg', [
  '-v', 'error', '-y',
  '-f', 'concat', '-safe', '0', '-i', join(dir, 'frames.txt'),
  '-vf', `fps=${FPS},scale=trunc(iw/2)*2:trunc(ih/2)*2`,
  '-an', '-c:v', 'libx264', '-crf', '20', '-preset', 'slow',
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
  out,
]);
const seconds = frames.at(-1).time - frames[0].time;
console.log(`${out}: ${frames.length} frames over ${seconds.toFixed(1)}s (${(frames.length / seconds).toFixed(0)}fps captured)`);
rmSync(dir, { recursive: true });
