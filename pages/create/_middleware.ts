import { NextRequest, NextResponse } from "next/server";

export function middleware({ cookies }: NextRequest) {
    if (JSON.parse(cookies.account ?? '{}')?.access !== "Teacher") return NextResponse.redirect('/');
}
