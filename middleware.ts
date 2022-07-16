import { NextRequest, NextResponse } from "next/server";

export function middleware({ cookies, nextUrl: { pathname, origin } }: NextRequest) {
  /**
   * Allow requests to the
   * - index route - `/`
   * - Next.js internals - `/_next/
   * - API calls to ping and login - `/api/(login|ping)`
   * - Public files - `\.(.+)`
   */
  if (/(^\/$|^\/(_next\/|api\/(login|ping))|\.(.+)$)/.test(pathname)) return NextResponse.next();

  if (!cookies.get("account")) return NextResponse.redirect(`${origin}/?to=${encodeURIComponent(pathname)}`);
}
