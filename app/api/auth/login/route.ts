import { NextResponse } from "next/server";

import { createSessionToken, isSecureRequest, isValidAdminLogin, setAuthCookie } from "@/lib/auth";
import { getRequestIp, isSameOriginBrowserRequest, readBoundedJsonBody } from "@/lib/request-security";
import { consumeSecurityRateLimit, recordSecurityEvent, resetSecurityRateLimit } from "@/lib/security-controls";
import { requireTenantId } from "@/lib/tenant-context";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!isSameOriginBrowserRequest(request)) {
      return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
    }
    const body = await readBoundedJsonBody(request, 8 * 1024);
    if (!body.ok) {
      return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
    }
    const payload = body.value as {
      email?: string;
      password?: string;
    };
    const tenantId = requireTenantId(process.env.ADMIN_TENANT_ID, "admin_login_configuration");
    const normalizedEmail = payload.email?.trim().toLowerCase() ?? "";
    const identifier = `${normalizedEmail || "missing"}:${getRequestIp(request)}`;
    const limit = await consumeSecurityRateLimit({
      tenantId,
      purpose: "admin_login",
      identifier,
      limit: 5,
      windowMs: 15 * 60 * 1000,
      lockoutMs: 30 * 60 * 1000,
    });
    if (limit.count > 1) await new Promise((resolve) => setTimeout(resolve, Math.min(1000, (limit.count - 1) * 250)));
    const valid = Boolean(payload.email && payload.password && limit.allowed && await isValidAdminLogin(payload.email, payload.password));

    if (!valid) {
      await recordSecurityEvent({
        tenantId,
        eventType: "admin_login",
        outcome: "rejected",
        identifier,
        reasonCodes: [limit.allowed ? "invalid_credentials" : "rate_limited"],
      });
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid email or password."
        },
        {
          status: limit.allowed ? 401 : 429,
          headers: limit.allowed ? undefined : { "Retry-After": String(limit.retryAfterSeconds) },
        }
      );
    }

    const token = await createSessionToken(normalizedEmail, { tenantId });
    await resetSecurityRateLimit({ tenantId, purpose: "admin_login", identifier });
    await recordSecurityEvent({ tenantId, eventType: "admin_login", outcome: "accepted", identifier, reasonCodes: ["session_rotated"] });
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
