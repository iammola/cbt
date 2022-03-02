import { NextRequest, NextResponse } from "next/server";

export function middleware({ cookies, nextUrl: { pathname } }: NextRequest) {
  if (
    cookies.account !== undefined ||
    pathname === "/" ||
    pathname.startsWith("/api/") ||
    !pathname.endsWith("/")
  )
    return NextResponse.next();
  return NextResponse.redirect(`/?to=${encodeURIComponent(pathname)}`);
}
