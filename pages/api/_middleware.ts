import { NextRequest, NextResponse } from "next/server";

export function middleware({ cookies, nextUrl: { pathname } }: NextRequest) {
    if (pathname !== "/api/login/" && cookies.account === undefined) return NextResponse.redirect('/');
}
