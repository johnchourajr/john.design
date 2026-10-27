// Sends a Wayback Machine page's image requests to the images' live CDNs, for
// scripts/capture-work-screenshots.sh (#128). The archive never stored most
// images at the sizes a page asks for, and its page script rewrites any URL
// set from the page back to the archive, so this works a level below: it
// holds the browser's requests over the DevTools protocol and swaps the URL.
//
//   node scripts/unarchive-images.mjs <browser-cdp-url>
//
// Runs until killed. Needs Node 22 (global WebSocket).

const LIVE_HOSTS = ['images.prismic.io', 'cdn.sanity.io'];
const ARCHIVE_PREFIX = /^https?:\/\/web\.archive\.org\/web\/\d+[a-z_]*\//;

/** The live URL for an archived image request, or null to leave it alone. */
function liveUrl(url) {
  let target = url.replace(ARCHIVE_PREFIX, '');
  // Next's image optimizer: `/_next/image?url=<source>&w=<width>&q=<quality>`.
  const optimizer = target.match(/\/_next\/image\?(.*)$/);
  if (optimizer) {
    const params = new URLSearchParams(optimizer[1]);
    const source = params.get('url');
    if (!source) return null;
    const live = new URL(source.replace(ARCHIVE_PREFIX, ''));
    if (params.get('w')) live.searchParams.set('w', params.get('w'));
    live.searchParams.set('auto', 'format');
    target = live.href;
  }
  try {
    return LIVE_HOSTS.includes(new URL(target).hostname) ? target : null;
  } catch {
    return null;
  }
}

const socket = new WebSocket(process.argv[2]);
let nextId = 0;
const send = (method, params = {}, sessionId) =>
  socket.send(JSON.stringify({ id: ++nextId, method, params, sessionId }));

socket.addEventListener('open', () => {
  // Every page, including ones opened later, pauses on archive requests.
  send('Target.setDiscoverTargets', { discover: true });
  send('Target.setAutoAttach', {
    autoAttach: true,
    waitForDebuggerOnStart: false,
    flatten: true,
  });
  send('Target.getTargets');
});

const attached = new Set();
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  const attach = (info) => {
    if (info.type === 'page' && !attached.has(info.targetId)) {
      attached.add(info.targetId);
      send('Target.attachToTarget', { targetId: info.targetId, flatten: true });
    }
  };
  if (message.result?.targetInfos) message.result.targetInfos.forEach(attach);
  if (message.method === 'Target.targetCreated') attach(message.params.targetInfo);
  if (message.method === 'Target.attachedToTarget') {
    send(
      'Fetch.enable',
      { patterns: [{ urlPattern: '*web.archive.org*', requestStage: 'Request' }] },
      message.params.sessionId,
    );
  }
  if (message.method === 'Fetch.requestPaused') {
    const { requestId, request } = message.params;
    const url = liveUrl(request.url);
    send(
      'Fetch.continueRequest',
      url ? { requestId, url } : { requestId },
      message.sessionId,
    );
  }
});

socket.addEventListener('close', () => process.exit(0));
