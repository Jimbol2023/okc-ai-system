import { NextResponse } from "next/server";

import { createSessionToken, isSecureRequest, isValidAdminLogin, setAuthCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      email?: string;
      password?: string;
    };
    const submittedEmail = payload.email ?? "";
    const submittedPassword = payload.password ?? "";
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    console.log("[auth-debug]", {
      hasAdminEmail: Boolean(adminEmail),
      hasAdminPassword: Boolean(adminPassword),
      normalizedEmailMatch: submittedEmail.trim().toLowerCase() === adminEmail?.trim().toLowerCase(),
      submittedEmailLength: submittedEmail.trim().length,
      adminEmailLength: adminEmail?.trim().length ?? 0,
      passwordLengthMatch: submittedPassword.length === (adminPassword?.length ?? -1)
    });

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

    setAuthCookie(response, token, {
      secure: isSecureRequest(request)
    });

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
