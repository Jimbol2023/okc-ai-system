import { NextResponse, type NextRequest } from "next/server";

import { getRequestAuthToken, isCronAuthorizedRequest, verifySessionTokenClaims } from "@/lib/auth-token";
import { isSameOriginBrowserRequest } from "@/lib/request-security";

async function hasActiveSession(request: NextRequest) {
  if (!(await verifySessionTokenClaims(getRequestAuthToken(request)))) return false;
  try {
    const response = await fetch(new URL("/api/auth/session/validate", request.url), {
      headers: { cookie: request.headers.get("cookie") ?? "" },
      cache: "no-store",
    });
    return response.status === 204;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const method = request.method.toUpperCase();
  if (pathname === "/api/auth/session/validate") return NextResponse.next();
  const isAuthenticated = await hasActiveSession(request);
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
  const isScheduledInternalRoute =
    pathname === "/api/operations/read-only-sync" ||
    pathname === "/api/company/executive-autonomy/daily-startup";
  const isAuthorizedCronRequest = isScheduledInternalRoute && await isCronAuthorizedRequest(request);
  const isUnsafeMethod = !["GET", "HEAD", "OPTIONS"].includes(method);

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

  if (isAuthenticated && isUnsafeMethod && !isSameOriginBrowserRequest(request)) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403 });
  }

  if (isAuthenticated || isAuthorizedCronRequest || isPublicLeadIntakeRoute || isPublicReferralTrackRoute || isPublicAuthRoute || isPublicTwilioInboundRoute) {
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
