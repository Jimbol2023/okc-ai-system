import { NextResponse } from "next/server";

import { createSessionToken, isValidAdminLogin, setAuthCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (!payload.email || !payload.password || !isValidAdminLogin(payload.email, payload.password)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid email or password."
        },
        { status: 401 }
      );
    }

    const token = await createSessionToken(payload.email.trim().toLowerCase());
    const response = NextResponse.json({
      ok: true
    });

    setAuthCookie(response, token);

    return response;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Unable to sign in right now."
      },
      { status: 500 }
    );
  }
}
