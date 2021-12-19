import { NextRequest, NextResponse } from "next/server";

export function middleware({ cookies, nextUrl: { pathname } }: NextRequest) {
    if (cookies.account !== undefined || pathname.endsWith('/login/') || pathname.endsWith('/ping/')) return NextResponse.next();
    return NextResponse.error();
}
