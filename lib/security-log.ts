import { createHmac } from "node:crypto";

const SECRET_KEY_PATTERN = /(authorization|cookie|password|secret|token|api[-_]?key|database[-_]?url|message|body|email|phone|recipient)/i;
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_PATTERN = /(?:\+?\d[\d\s().-]{8,}\d)/g;
const BEARER_PATTERN = /\bBearer\s+[A-Za-z0-9._~+\/-]+=*/gi;
const URL_CREDENTIAL_PATTERN = /([a-z][a-z0-9+.-]*:\/\/)[^\s/@:]+:[^\s/@]+@/gi;
const MAX_STRING_LENGTH = 500;

export type SecurityLogLevel = "info" | "warn" | "error";
export type SecurityLogFields = Record<string, unknown>;

function redactString(value: string) {
  return value
    .replace(BEARER_PATTERN, "[redacted:authorization]")
    .replace(URL_CREDENTIAL_PATTERN, "$1[redacted]@")
    .replace(EMAIL_PATTERN, "[redacted:email]")
    .replace(PHONE_PATTERN, "[redacted:phone]")
    .slice(0, MAX_STRING_LENGTH);
}

export function redactSecurityValue(value: unknown, key = "", depth = 0): unknown {
  if (SECRET_KEY_PATTERN.test(key)) return "[redacted]";
  if (depth > 5) return "[redacted:depth]";
  if (typeof value === "string") return redactString(value);
  if (typeof value === "number" || typeof value === "boolean" || value === null || value === undefined) return value;
  if (value instanceof Error) return { name: value.name, message: redactString(value.message) };
  if (Array.isArray(value)) return value.slice(0, 50).map((item) => redactSecurityValue(item, "", depth + 1));
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .slice(0, 100)
        .map(([entryKey, entryValue]) => [entryKey, redactSecurityValue(entryValue, entryKey, depth + 1)]),
    );
  }
  return "[redacted:unsupported]";
}

export function securityFingerprint(value: string, secret = process.env.SECURITY_FINGERPRINT_SECRET ?? process.env.AUTH_SECRET ?? "") {
  if (secret.length < 16) throw new Error("Security fingerprint secret is not configured.");
  return createHmac("sha256", secret).update(value.trim().toLowerCase()).digest("hex");
}

export function securityLog(level: SecurityLogLevel, event: string, fields: SecurityLogFields = {}) {
  const redactedFields = redactSecurityValue(fields);
  const record = JSON.stringify({
    event: event.replace(/[^a-z0-9_.-]/gi, "_").slice(0, 100),
    at: new Date().toISOString(),
    ...(redactedFields && typeof redactedFields === "object" && !Array.isArray(redactedFields) ? redactedFields : {}),
  });
  const writer = level === "error" ? console.error : level === "warn" ? console.warn : console.info;
  writer(record);
}
