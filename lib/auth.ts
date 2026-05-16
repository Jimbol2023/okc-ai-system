import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { getAdminEmail, getAdminPassword, getAuthSecret } from "@/lib/env";

const AUTH_COOKIE_NAME = "okcWholesaleAdminSession";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

type SessionPayload = {
  email: string;
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

function getAuthConfig() {
  return {
    adminEmail: getAdminEmail(),
    adminPassword: getAdminPassword(),
    authSecret: getAuthSecret()
  };
}

async function signValue(value: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));

  return toBase64Url(new Uint8Array(signature));
}

async function verifySignature(value: string, signature: string, secret: string) {
  const expectedSignature = await signValue(value, secret);

  return expectedSignature === signature;
}

export async function createSessionToken(email: string) {
  const { authSecret } = getAuthConfig();
  const payload: SessionPayload = {
    email,
    exp: Date.now() + SESSION_DURATION_MS
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = await signValue(encodedPayload, authSecret);

  return `${encodedPayload}.${signature}`;
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  const { authSecret } = getAuthConfig();
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const isValid = await verifySignature(encodedPayload, signature, authSecret);

  if (!isValid) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;

    if (!payload.email || payload.exp <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function isValidAdminLogin(email: string, password: string) {
  const { adminEmail, adminPassword } = getAuthConfig();

  return email.trim().toLowerCase() === adminEmail && password === adminPassword;
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
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
  const token = getRequestAuthToken(request);
  const payload = await verifySessionToken(token);

  return Boolean(payload);
}

function getRequestAuthToken(request: NextRequest | Request) {
  return "cookies" in request && typeof request.cookies.get === "function"
    ? request.cookies.get(AUTH_COOKIE_NAME)?.value
    : request.headers
        .get("cookie")
        ?.split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith(`${AUTH_COOKIE_NAME}=`))
        ?.split("=")
        .slice(1)
        .join("=");
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
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  return verifySessionToken(token);
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

export { AUTH_COOKIE_NAME };
