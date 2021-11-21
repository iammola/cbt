import { NextRequest, NextResponse } from "next/server";

export function middleware({ cookies }: NextRequest) {
    if (["Teacher", "Mola"].includes(JSON.parse(cookies.account ?? '{}')?.access) === false) return NextResponse.redirect('/');
}
