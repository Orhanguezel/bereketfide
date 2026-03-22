import { NextRequest, NextResponse } from 'next/server';

const SOCIAL_BOT_RE =
  /whatsapp|facebookexternalhit|facebot|twitterbot|telegrambot|linkedinbot|slackbot|discordbot|pinterest|googlebot/i;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Root path: social/SEO botları için rewrite, normal kullanıcılar için redirect
  if (pathname === '/') {
    const ua = request.headers.get('user-agent') || '';
    if (SOCIAL_BOT_RE.test(ua)) {
      const url = request.nextUrl.clone();
      url.pathname = '/tr';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
