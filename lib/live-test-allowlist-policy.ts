export type LiveTestAllowlistChannel = "sms" | "email";

export type LiveTestAllowlistMode = "disabled" | "simulation_only" | "live_test";

export type LiveTestAllowlistReasonCode =
  | "recipient_missing"
  | "allowlist_empty"
  | "allowlist_disabled"
  | "simulation_only"
  | "recipient_not_allowlisted"
  | "operator_confirmation_required"
  | "recipient_allowlisted";

export type LiveTestAllowlistInput = {
  channel: LiveTestAllowlistChannel;
  recipient?: string | null;
  normalizedRecipient?: string | null;
  leadId?: string;
  allowlistedRecipients?: string[];
  allowlistMode: LiveTestAllowlistMode;
  operatorConfirmed?: boolean;
};

export type LiveTestAllowlistDecision = {
  allowed: boolean;
  allowlistMode: LiveTestAllowlistMode;
  channel: LiveTestAllowlistChannel;
  recipient: string;
  normalizedRecipient: string;
  reasonCodes: LiveTestAllowlistReasonCode[];
  requiresOperatorConfirmation: boolean;
  safetySummary: string;
};

function addReason(reasonCodes: LiveTestAllowlistReasonCode[], reasonCode: LiveTestAllowlistReasonCode) {
  if (!reasonCodes.includes(reasonCode)) {
    reasonCodes.push(reasonCode);
  }
}

function normalizePhoneRecipient(recipient: string) {
  const trimmedRecipient = recipient.trim();

  if (/^\+\d{10,15}$/.test(trimmedRecipient)) return trimmedRecipient;

  const digits = trimmedRecipient.replace(/\D/g, "");

  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;

  return trimmedRecipient.toLowerCase();
}

export function normalizeAllowlistRecipient(recipient?: string | null, channel: LiveTestAllowlistChannel = "sms") {
  const trimmedRecipient = recipient?.trim() ?? "";

  if (!trimmedRecipient) return "";

  if (channel === "email") {
    return trimmedRecipient.toLowerCase();
  }

  return normalizePhoneRecipient(trimmedRecipient);
}

function buildDecision({
  allowed,
  input,
  normalizedRecipient,
  reasonCodes,
}: {
  allowed: boolean;
  input: LiveTestAllowlistInput;
  normalizedRecipient: string;
  reasonCodes: LiveTestAllowlistReasonCode[];
}): LiveTestAllowlistDecision {
  return {
    allowed,
    allowlistMode: input.allowlistMode,
    channel: input.channel,
    recipient: input.recipient?.trim() ?? "",
    normalizedRecipient,
    reasonCodes,
    requiresOperatorConfirmation: !input.operatorConfirmed,
    safetySummary:
      "Live-test allowlist policy evaluated without side effects. No SMS, email, provider call, env read, or DB read occurred.",
  };
}

export function createAllowlistBlockedDecision(
  input: LiveTestAllowlistInput,
  reasonCodes: LiveTestAllowlistReasonCode[] = ["allowlist_disabled"],
): LiveTestAllowlistDecision {
  const normalizedRecipient = input.normalizedRecipient?.trim() || normalizeAllowlistRecipient(input.recipient, input.channel);

  return buildDecision({
    allowed: false,
    input,
    normalizedRecipient,
    reasonCodes,
  });
}

export function createAllowlistApprovedDecision(input: LiveTestAllowlistInput): LiveTestAllowlistDecision {
  const normalizedRecipient = input.normalizedRecipient?.trim() || normalizeAllowlistRecipient(input.recipient, input.channel);
  const normalizedAllowlist = (input.allowlistedRecipients ?? [])
    .map((recipient) => normalizeAllowlistRecipient(recipient, input.channel))
    .filter(Boolean);

  if (
    input.allowlistMode !== "live_test" ||
    !normalizedRecipient ||
    normalizedAllowlist.length === 0 ||
    !normalizedAllowlist.includes(normalizedRecipient) ||
    input.operatorConfirmed !== true
  ) {
    return evaluateLiveTestAllowlist(input);
  }

  return buildDecision({
    allowed: true,
    input,
    normalizedRecipient,
    reasonCodes: ["recipient_allowlisted"],
  });
}

export function evaluateLiveTestAllowlist(input: LiveTestAllowlistInput): LiveTestAllowlistDecision {
  const normalizedRecipient = input.normalizedRecipient?.trim() || normalizeAllowlistRecipient(input.recipient, input.channel);
  const normalizedAllowlist = (input.allowlistedRecipients ?? [])
    .map((recipient) => normalizeAllowlistRecipient(recipient, input.channel))
    .filter(Boolean);
  const reasonCodes: LiveTestAllowlistReasonCode[] = [];

  if (!normalizedRecipient) addReason(reasonCodes, "recipient_missing");
  if (normalizedAllowlist.length === 0) addReason(reasonCodes, "allowlist_empty");
  if (input.allowlistMode === "disabled") addReason(reasonCodes, "allowlist_disabled");
  if (input.allowlistMode === "simulation_only") addReason(reasonCodes, "simulation_only");
  if (!input.operatorConfirmed) addReason(reasonCodes, "operator_confirmation_required");

  const recipientIsAllowlisted = normalizedAllowlist.includes(normalizedRecipient);

  if (normalizedRecipient && normalizedAllowlist.length > 0 && !recipientIsAllowlisted) {
    addReason(reasonCodes, "recipient_not_allowlisted");
  }

  if (input.allowlistMode === "live_test" && recipientIsAllowlisted && input.operatorConfirmed) {
    addReason(reasonCodes, "recipient_allowlisted");
  }

  const allowed =
    input.allowlistMode === "live_test" &&
    Boolean(normalizedRecipient) &&
    normalizedAllowlist.length > 0 &&
    recipientIsAllowlisted &&
    input.operatorConfirmed === true;

  return buildDecision({
    allowed,
    input,
    normalizedRecipient,
    reasonCodes,
  });
}
