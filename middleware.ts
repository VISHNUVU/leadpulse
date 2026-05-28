import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSessionCookieName, hasDatabaseConfig } from "@/lib/env";

const protectedPrefixes = ["/dashboard", "/leads", "/pipeline", "/follow-ups", "/reports", "/settings", "/workspaces"];

export function middleware(request: NextRequest) {
  if (!hasDatabaseConfig()) {
    return NextResponse.next();
  }

  const needsAuth = protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix));
  const sessionToken = request.cookies.get(getSessionCookieName())?.value;

  if (needsAuth && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/leads/:path*", "/pipeline/:path*", "/follow-ups/:path*", "/reports/:path*", "/settings/:path*", "/workspaces/:path*"]
};
