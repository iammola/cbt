import { NextRequest, NextResponse } from "next/server";

export function middleware({ cookies, nextUrl: { pathname } }: NextRequest) {
    if (["/api/login/", "/api/ping/"].includes(pathname) === false && cookies.account === undefined) return NextResponse.redirect('/');
}
