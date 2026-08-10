import twilio from "twilio";
import { z } from "zod";

const MAX_BODY_BYTES = 64 * 1024;
const twilioPayloadSchema = z.object({
  MessageSid: z.string().regex(/^SM[a-zA-Z0-9]{32}$/),
  AccountSid: z.string().regex(/^AC[a-zA-Z0-9]{32}$/),
  From: z.string().trim().regex(/^\+\d{10,15}$/),
  To: z.string().trim().regex(/^\+\d{10,15}$/),
  Body: z.string().trim().min(1).max(1600),
}).passthrough();

export type VerifiedTwilioPayload = z.infer<typeof twilioPayloadSchema>;

type WebhookConfig = {
  authToken: string;
  publicUrl: string;
  accountSid: string;
  toNumber: string;
  tenantId: string;
};

function getConfig(): WebhookConfig | null {
  const authToken = process.env.TWILIO_WEBHOOK_AUTH_TOKEN?.trim() || process.env.TWILIO_AUTH_TOKEN?.trim() || "";
  const publicUrl = process.env.TWILIO_WEBHOOK_PUBLIC_URL?.trim() || "";
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim() || "";
  const toNumber = process.env.TWILIO_FROM_NUMBER?.trim() || "";
  const tenantId = process.env.PUBLIC_TENANT_ID?.trim() || "";
  return authToken && publicUrl && accountSid && toNumber && tenantId ? { authToken, publicUrl, accountSid, toNumber, tenantId } : null;
}

export async function verifyTwilioWebhookRequest(
  request: Request,
  options: { config?: WebhookConfig | null; validate?: typeof twilio.validateRequest } = {},
): Promise<{ ok: true; payload: VerifiedTwilioPayload; tenantId: string } | { ok: false; status: number; reason: string }> {
  if (request.method !== "POST") return { ok: false, status: 405, reason: "method_not_allowed" };
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/x-www-form-urlencoded")) {
    return { ok: false, status: 415, reason: "unsupported_content_type" };
  }
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) return { ok: false, status: 413, reason: "payload_too_large" };
  const signature = request.headers.get("x-twilio-signature")?.trim();
  if (!signature) return { ok: false, status: 403, reason: "signature_missing" };
  const config = options.config === undefined ? getConfig() : options.config;
  if (!config) return { ok: false, status: 503, reason: "webhook_not_configured" };

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) return { ok: false, status: 413, reason: "payload_too_large" };
  const params = Object.fromEntries(new URLSearchParams(rawBody));
  const validate = options.validate ?? twilio.validateRequest;
  if (!validate(config.authToken, signature, config.publicUrl, params)) return { ok: false, status: 403, reason: "signature_invalid" };
  const parsed = twilioPayloadSchema.safeParse(params);
  if (!parsed.success) return { ok: false, status: 400, reason: "payload_invalid" };
  if (parsed.data.AccountSid !== config.accountSid || parsed.data.To !== config.toNumber) {
    return { ok: false, status: 403, reason: "tenant_boundary_mismatch" };
  }
  return { ok: true, payload: parsed.data, tenantId: config.tenantId };
}
