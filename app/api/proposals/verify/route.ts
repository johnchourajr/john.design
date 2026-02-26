import { NextRequest, NextResponse } from 'next/server';

const PROPOSALS_PASSWORD = process.env.PROPOSALS_PASSWORD || 'proposals2026';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password === PROPOSALS_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('proposals_access', 'granted', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/proposals',
    });
    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
