import { NextResponse, type NextRequest } from "next/server";

import { getAdminEmail, getAdminPassword } from "@/lib/env";
import {
  AUTH_COOKIE_NAME,
  SESSION_DURATION_MS,
  constantTimeEqual,
  createSignedSessionToken,
  getRequestAuthToken,
  isCronAuthorizedRequest,
  verifySessionTokenClaims,
} from "@/lib/auth-token";
import { requireTenantId } from "@/lib/tenant-context";
import { isSessionRevoked, revokeSession } from "@/lib/security-controls";

function getAuthConfig() {
  return {
    adminEmail: getAdminEmail(),
    adminPassword: getAdminPassword()
  };
}

function getConfiguredAdminTenantId() {
  return process.env.ADMIN_TENANT_ID
    ? requireTenantId(process.env.ADMIN_TENANT_ID, "admin_session_configuration")
    : null;
}

export async function createSessionToken(email: string, options: { tenantId?: string; actorId?: string } = {}) {
  return createSignedSessionToken(email, options);
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  try {
    const payload = await verifySessionTokenClaims(token);
    if (!payload) return null;

    const tenantId = requireTenantId(payload.tenantId, "session_payload");
    const configuredTenantId = getConfiguredAdminTenantId();
    if (configuredTenantId && tenantId !== configuredTenantId) return null;

    if (await isSessionRevoked(tenantId, payload.sessionId)) return null;

    return {
      ...payload,
      tenantId,
      actorId: payload.actorId || payload.email,
      sessionVersion: payload.sessionVersion ?? 1,
    };
  } catch {
    return null;
  }
}

export async function isValidAdminLogin(email: string, password: string) {
  const { adminEmail, adminPassword } = getAuthConfig();
  const emailMatches = await constantTimeEqual(email.trim().toLowerCase(), adminEmail);
  const passwordMatches = await constantTimeEqual(password, adminPassword);
  return emailMatches && passwordMatches;
}

export function isSecureRequest(request: NextRequest | Request) {
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim().toLowerCase();

  if (forwardedProto) {
    return forwardedProto === "https";
  }

  return new URL(request.url).protocol === "https:";
}

export function setAuthCookie(response: NextResponse, token: string, options: { secure?: boolean } = {}) {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: options.secure ?? (process.env.NODE_ENV === "production"),
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export async function isAuthenticatedRequest(request: NextRequest | Request) {
  try {
    const token = getRequestAuthToken(request);
    const payload = await verifySessionToken(token);

    return Boolean(payload);
  } catch {
    return false;
  }
}

export async function getAuthenticatedRequestContext(request: NextRequest | Request) {
  const token = getRequestAuthToken(request);
  const payload = await verifySessionToken(token);
  if (!payload) return null;

  return Object.freeze({
    tenantId: requireTenantId(payload.tenantId, "authenticated_request"),
    actorId: payload.actorId || payload.email,
    email: payload.email,
    sessionVersion: payload.sessionVersion ?? 1,
  });
}

export async function revokeRequestSession(request: NextRequest | Request) {
  const payload = await verifySessionToken(getRequestAuthToken(request));
  if (!payload) return false;
  await revokeSession(payload.tenantId, payload.sessionId);
  return true;
}

export async function isAdminRequest(request: NextRequest | Request) {
  try {
    const token = getRequestAuthToken(request);
    const payload = await verifySessionToken(token);

    if (!payload?.email) {
      return false;
    }

    const { adminEmail } = getAuthConfig();

    return payload.email.trim().toLowerCase() === adminEmail;
  } catch {
    return false;
  }
}

export async function getAuthenticatedAdmin() {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export function getUnauthorizedApiResponse() {
  return NextResponse.json(
    {
      ok: false,
      error: "Unauthorized"
    },
    { status: 401 }
  );
}

export { AUTH_COOKIE_NAME, getRequestAuthToken, isCronAuthorizedRequest };
