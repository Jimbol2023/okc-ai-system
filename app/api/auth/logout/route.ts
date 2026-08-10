import { NextResponse } from "next/server";

import { clearAuthCookie, revokeRequestSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  await revokeRequestSession(request);
  const response = NextResponse.redirect(new URL("/login", request.url));

  clearAuthCookie(response);

  return response;
}
