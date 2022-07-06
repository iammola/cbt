import { NextRequest, NextResponse } from "next/server";

export function middleware({ cookies, nextUrl: { pathname, origin } }: NextRequest) {
  if (
    cookies.get("account") !== undefined ||
    pathname === "/" ||
    pathname.startsWith("/api/") ||
    !pathname.endsWith("/")
  )
    return NextResponse.next();
  return NextResponse.redirect(`${origin}/?to=${encodeURIComponent(pathname)}`);
}
