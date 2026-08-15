export const twilioDiagnosticCapabilities = [
  "get_twilio_account_identity",
  "list_owned_phone_numbers",
  "get_inbound_phone_number_configuration",
  "get_messaging_readiness",
  "get_account_trial_or_upgrade_status",
  "get_toll_free_verification_status",
  "get_recent_message_delivery_metadata",
  "get_twilio_error_metadata",
  "get_webhook_readiness",
] as const;

export type TwilioDiagnosticCapability = (typeof twilioDiagnosticCapabilities)[number];

const deniedOperations = new Set([
  "send_message", "send_sms", "make_call", "buy_phone_number", "release_phone_number",
  "modify_phone_number", "modify_webhook", "modify_messaging_service", "modify_account",
  "modify_billing", "modify_security_settings", "retrieve_auth_token", "rotate_auth_token",
  "create_api_key", "delete_api_key", "outreach", "publishing", "crm_mutation", "external_execution",
]);

const SID_PATTERN = /^AC[a-fA-F0-9]{32}$/;
const KEY_PATTERN = /^SK[a-fA-F0-9]{32}$/;
const PHONE_SID_PATTERN = /^PN[a-fA-F0-9]{32}$/;
const MAX_RESPONSE_BYTES = 256 * 1024;
const TIMEOUT_MS = 5_000;

export type TwilioDiagnosticCredential = Readonly<{ accountSid: string; apiKeySid: string; apiKeySecret: string }>;
export type TwilioDiagnosticInput = Readonly<{ capability: TwilioDiagnosticCapability; phoneNumberSid?: string }>;

export class TwilioDiagnosticError extends Error {
  constructor(public readonly code: "denied" | "invalid_request" | "timeout" | "rate_limited" | "provider_error" | "response_invalid", message: string, public readonly providerAttempted = false) {
    super(message);
  }
}

export function assertTwilioDiagnosticCapability(operation: string): asserts operation is TwilioDiagnosticCapability {
  if (deniedOperations.has(operation)) throw new TwilioDiagnosticError("denied", "Twilio write or external-action operation is prohibited.");
  if (!(twilioDiagnosticCapabilities as readonly string[]).includes(operation)) throw new TwilioDiagnosticError("denied", "Unknown Twilio diagnostic operation is prohibited.");
}

export function validateTwilioDiagnosticCredential(value: TwilioDiagnosticCredential) {
  return SID_PATTERN.test(value.accountSid) && KEY_PATTERN.test(value.apiKeySid) && value.apiKeySecret.length >= 16;
}

function redactPhone(value: unknown) {
  const phone = typeof value === "string" ? value : "";
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 4 ? `***${digits.slice(-4)}` : "redacted";
}

function fingerprintSid(value: string) {
  return `${value.slice(0, 2)}…${value.slice(-4)}`;
}

function endpoint(input: TwilioDiagnosticInput, accountSid: string) {
  const api = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}`;
  switch (input.capability) {
    case "get_twilio_account_identity":
    case "get_account_trial_or_upgrade_status": return `${api}.json`;
    case "list_owned_phone_numbers":
    case "get_messaging_readiness": return `${api}/IncomingPhoneNumbers.json?PageSize=20`;
    case "get_inbound_phone_number_configuration":
    case "get_webhook_readiness":
      if (!input.phoneNumberSid || !PHONE_SID_PATTERN.test(input.phoneNumberSid)) throw new TwilioDiagnosticError("invalid_request", "A valid governed phone-number SID is required.");
      return `${api}/IncomingPhoneNumbers/${input.phoneNumberSid}.json`;
    case "get_recent_message_delivery_metadata": return `${api}/Messages.json?PageSize=20`;
    case "get_twilio_error_metadata": return `https://monitor.twilio.com/v1/Alerts?PageSize=20`;
    case "get_toll_free_verification_status": return "https://messaging.twilio.com/v1/Tollfree/Verifications?PageSize=20";
  }
}

function safeJson(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function safeRows(value: unknown, key: string) {
  const rows = safeJson(value)[key];
  return Array.isArray(rows) ? rows.slice(0, 20).map(safeJson) : [];
}

function normalize(input: TwilioDiagnosticInput, payload: unknown, accountSid: string) {
  const body = safeJson(payload);
  const common = { capability: input.capability, accountSidFingerprint: fingerprintSid(accountSid) };
  if (input.capability === "get_twilio_account_identity" || input.capability === "get_account_trial_or_upgrade_status") {
    return { ...common, account: { sidFingerprint: fingerprintSid(String(body.sid ?? accountSid)), type: body.type ?? null, status: body.status ?? null } };
  }
  if (input.capability === "list_owned_phone_numbers" || input.capability === "get_messaging_readiness") {
    const records = safeRows(body, "incoming_phone_numbers").map((row) => ({ phoneNumberSid: row.sid ?? null, phoneNumber: redactPhone(row.phone_number), capabilities: row.capabilities ?? {}, status: row.status ?? null }));
    return { ...common, ownedNumberCount: records.length, records };
  }
  if (input.capability === "get_inbound_phone_number_configuration" || input.capability === "get_webhook_readiness") {
    return { ...common, phoneNumberSid: body.sid ?? input.phoneNumberSid, phoneNumber: redactPhone(body.phone_number), inbound: { smsUrl: body.sms_url ?? null, smsMethod: body.sms_method ?? null, statusCallback: body.status_callback ?? null }, configured: Boolean(body.sms_url) };
  }
  if (input.capability === "get_recent_message_delivery_metadata") {
    const records = safeRows(body, "messages").map((row) => ({ messageSid: row.sid ?? null, direction: row.direction ?? null, deliveryStatus: row.status ?? null, errorCode: row.error_code ?? null, createdAt: row.date_created ?? null, sentAt: row.date_sent ?? null, updatedAt: row.date_updated ?? null }));
    return { ...common, records };
  }
  if (input.capability === "get_twilio_error_metadata") {
    const records = safeRows(body, "alerts").map((row) => ({ alertSid: row.sid ?? null, errorCode: row.error_code ?? null, logLevel: row.log_level ?? null, firstSeenAt: row.date_created ?? null, lastSeenAt: row.date_updated ?? null }));
    return { ...common, records };
  }
  const records = safeRows(body, "verifications").map((row) => ({ verificationSid: row.sid ?? null, status: row.status ?? null, createdAt: row.date_created ?? null, updatedAt: row.date_updated ?? null }));
  return { ...common, records };
}

export async function executeTwilioDiagnosticRead(input: TwilioDiagnosticInput, credential: TwilioDiagnosticCredential, fetcher: typeof fetch = fetch) {
  assertTwilioDiagnosticCapability(input.capability);
  if (!validateTwilioDiagnosticCredential(credential)) throw new TwilioDiagnosticError("invalid_request", "Twilio diagnostic credential is unavailable or invalid.");
  const authorization = `Basic ${Buffer.from(`${credential.apiKeySid}:${credential.apiKeySecret}`).toString("base64")}`;
  let response: Response;
  try {
    response = await fetcher(endpoint(input, credential.accountSid), { method: "GET", headers: { authorization, accept: "application/json" }, cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (error) {
    throw new TwilioDiagnosticError(error instanceof DOMException && error.name === "TimeoutError" ? "timeout" : "provider_error", "Twilio diagnostic read failed safely.", true);
  }
  if (response.status === 429) throw new TwilioDiagnosticError("rate_limited", "Twilio diagnostic read was rate limited.", true);
  if (!response.ok) throw new TwilioDiagnosticError("provider_error", `Twilio diagnostic read returned HTTP ${response.status}.`, true);
  const text = await response.text();
  if (Buffer.byteLength(text, "utf8") > MAX_RESPONSE_BYTES) throw new TwilioDiagnosticError("response_invalid", "Twilio diagnostic response exceeded the safe size limit.", true);
  try {
    return normalize(input, JSON.parse(text), credential.accountSid);
  } catch {
    throw new TwilioDiagnosticError("response_invalid", "Twilio diagnostic response was invalid.", true);
  }
}
