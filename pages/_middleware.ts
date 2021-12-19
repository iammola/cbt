import { NextRequest, NextResponse } from "next/server";

export function middleware({ cookies, nextUrl: { pathname } }: NextRequest) {
    if (cookies.account === undefined && pathname.endsWith('/') === true && ['/', '/api/ping/', '/api/login/'].includes(pathname) === false) return NextResponse.redirect(`/?to=${encodeURIComponent(pathname)}`);
}
