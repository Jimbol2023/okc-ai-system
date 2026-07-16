import { NextResponse, type NextRequest } from "next/server";

import { isAuthenticatedRequest } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const isAuthenticated = await isAuthenticatedRequest(request);
  const { pathname, search } = request.nextUrl;
  const method = request.method.toUpperCase();
  const isGbpDiscoveryCallback =
    pathname === "/api/admin/google-business-profile-discovery" &&
    method === "GET" &&
    request.nextUrl.searchParams.has("code") &&
    request.nextUrl.searchParams.has("state");

  const isPublicLeadIntakeRoute =
    pathname === "/api/leads" && method === "POST";
  const isPublicReferralTrackRoute = pathname === "/api/referrals/track" && method === "POST";
  const isPublicAuthRoute = pathname === "/api/auth/login" || pathname === "/api/auth/logout";
  const isPublicTwilioInboundRoute = pathname === "/api/twilio/inbound-sms" && method === "POST";

  if (isGbpDiscoveryCallback) {
    console.info("GBP discovery callback proxy pass-through", {
      pathname,
      method,
      hasCode: true,
      hasState: true,
      host: request.nextUrl.host,
    });

    return NextResponse.next();
  }

  if (isAuthenticated || isPublicLeadIntakeRoute || isPublicReferralTrackRoute || isPublicAuthRoute || isPublicTwilioInboundRoute) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized",
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
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
  ],
};
