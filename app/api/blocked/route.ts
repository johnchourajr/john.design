/**
 * Internal route for blocked bot traffic.
 * Middleware rewrites (proxies) malicious/aggressive bots here instead of 403.
 * Returns 200 with minimal body so bots don't retry or flag the site.
 */
export function GET() {
  return new Response('', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}
