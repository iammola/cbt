import { NextRequest, NextResponse } from "next/server";

export function middleware({ cookies, nextUrl: { pathname } }: NextRequest) {
    if (cookies.account === undefined && pathname !== '/') return NextResponse.redirect(`/?to=${encodeURIComponent(pathname)}`);
}
