import { NextResponse, type NextRequest } from "next/server";

import { isAuthenticatedRequest } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const isAuthenticated = await isAuthenticatedRequest(request);
  const { pathname, search } = request.nextUrl;

  if (isAuthenticated) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/leads") || pathname === "/api/security-review") {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized"
      },
      { status: 401 }
    );
  }

  const loginUrl = new URL("/login", request.url);
  const nextPath = `${pathname}${search}`;
  loginUrl.searchParams.set("next", nextPath);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/leads/:path*", "/api/security-review"]
};
