import { NextResponse } from "next/server";

import { clearAuthCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url));

  clearAuthCookie(response);

  return response;
}
