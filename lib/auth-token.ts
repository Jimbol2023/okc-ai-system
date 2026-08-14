import type { NextRequest } from "next/server";

import { getAuthSecret } from "@/lib/env";
import { requireTenantId } from "@/lib/tenant-context";

export const AUTH_COOKIE_NAME = "okcWholesaleAdminSession";
export const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

export type SessionPayload = {
  email: string;
  tenantId?: string;
  actorId?: string;
  sessionVersion?: 1;
  sessionId: string;
  exp: number;
};

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function base64UrlEncode(value: string) {
  return toBase64Url(new TextEncoder().encode(value));
}

function base64UrlDecode(value: string) {
  return new TextDecoder().decode(fromBase64Url(value));
}

async function signValue(value: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toBase64Url(new Uint8Array(signature));
}

async function verifySignature(value: string, signature: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  return crypto.subtle.verify("HMAC", key, fromBase64Url(signature), encoder.encode(value));
}

export async function constantTimeEqual(left: string, right: string) {
  const encoder = new TextEncoder();
  const [leftDigest, rightDigest] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(left)),
    crypto.subtle.digest("SHA-256", encoder.encode(right)),
  ]);
  const leftBytes = new Uint8Array(leftDigest);
  const rightBytes = new Uint8Array(rightDigest);
  let difference = left.length ^ right.length;
  for (let index = 0; index < leftBytes.length; index += 1) difference |= leftBytes[index] ^ rightBytes[index];
  return difference === 0;
}

export async function createSignedSessionToken(email: string, options: { tenantId?: string; actorId?: string } = {}) {
  const payload: SessionPayload = {
    email,
    tenantId: requireTenantId(options.tenantId ?? "default", "session_creation"),
    actorId: options.actorId ?? email,
    sessionVersion: 1,
    sessionId: crypto.randomUUID(),
    exp: Date.now() + SESSION_DURATION_MS,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  return `${encodedPayload}.${await signValue(encodedPayload, getAuthSecret())}`;
}

export async function verifySessionTokenClaims(token: string | undefined) {
  if (!token) return null;
  try {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature || !(await verifySignature(encodedPayload, signature, getAuthSecret()))) return null;
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;
    if (!payload.email || !payload.tenantId || !payload.sessionId || payload.exp <= Date.now()) return null;
    return {
      ...payload,
      tenantId: requireTenantId(payload.tenantId, "session_payload"),
      actorId: payload.actorId || payload.email,
      sessionVersion: payload.sessionVersion ?? 1,
    };
  } catch {
    return null;
  }
}

export function getRequestAuthToken(request: NextRequest | Request) {
  return "cookies" in request && typeof request.cookies.get === "function"
    ? request.cookies.get(AUTH_COOKIE_NAME)?.value
    : request.headers.get("cookie")?.split(";").map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith(`${AUTH_COOKIE_NAME}=`))?.split("=").slice(1).join("=");
}

export async function isCronAuthorizedRequest(request: NextRequest | Request, env: NodeJS.ProcessEnv = process.env) {
  const configuredSecret = env.CRON_SECRET?.trim();
  const authorization = request.headers.get("authorization") ?? "";
  return configuredSecret ? constantTimeEqual(authorization, `Bearer ${configuredSecret}`) : false;
}
