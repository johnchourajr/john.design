import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * User-Agent patterns for known malicious or aggressive bots.
 * Blocked: vulnerability scanners, aggressive scrapers, empty/fake UAs.
 * Allowed: Googlebot, Bingbot, and other well-behaved crawlers that respect robots.txt.
 */
const BLOCKED_BOT_PATTERNS = [
  // Vulnerability / security scanners
  /\bsqlmap\b/i,
  /\bnikto\b/i,
  /\bmasscan\b/i,
  /\bnmap\b/i,
  /\bzgrab\b/i,
  /\bnessus\b/i,
  /\bacunetix\b/i,
  /\bnetsparker\b/i,
  /\bdirbuster\b/i,
  /\bgobuster\b/i,
  // Aggressive SEO / scraping bots (often ignore rate limits)
  /\bbytespider\b/i,
  /\bmj12bot\b/i,
  /\bdotbot\b/i,
  /\bblexbot\b/i,
  /\bdataforseo\b/i,
  /\bpetalbot\b/i,
  /\bserpstatbot\b/i,
  /\bahrefsbot\b/i,
  /\bsemrushbot\b/i,
  // Empty or placeholder agents (many bad bots send these)
  /^$/,
  /^-$/,
  /^unknown$/i,
  /^bot$/i,
];

const MIN_UA_LENGTH = 12;

export function proxy(request: NextRequest) {
  const ua = request.headers.get('user-agent') ?? '';

  if (ua.length < MIN_UA_LENGTH) {
    return NextResponse.rewrite(new URL('/api/blocked', request.url));
  }

  const isBlocked = BLOCKED_BOT_PATTERNS.some((pattern) => pattern.test(ua));
  if (isBlocked) {
    return NextResponse.rewrite(new URL('/api/blocked', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all pathnames except _next/static, _next/image, favicon, and
     * static media. Next's image optimizer fetches public images internally
     * with a short user agent, so those must not be blocked.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/blocked|.*\\.(?:png|jpe?g|gif|webp|avif|svg|ico|mp4|webm|woff2?)$).*)',
  ],
};
