export type LiveTestAuditEventType =
  | "live_test_precheck"
  | "allowlist_check"
  | "kill_switch_check"
  | "approval_gate_check"
  | "provider_boundary_check"
  | "send_simulation"
  | "live_test_blocked"
  | "live_test_ready"
  | "live_test_aborted";

export type LiveTestAuditChannel = "sms" | "email";

export type LiveTestAuditSeverity = "info" | "warning" | "blocker";

export type LiveTestAuditMetadataValue = string | number | boolean | null | undefined;

export type LiveTestAuditMetadata = Record<string, LiveTestAuditMetadataValue>;

export type LiveTestAuditInput = {
  eventType: LiveTestAuditEventType;
  leadId?: string;
  channel?: LiveTestAuditChannel;
  recipientFingerprint?: string;
  operatorId?: string;
  policyMode?: string;
  reasonCodes?: string[];
  safetySummary?: string;
  metadata?: LiveTestAuditMetadata;
};

export type LiveTestAuditOutput = {
  ok: boolean;
  eventType: LiveTestAuditEventType;
  severity: LiveTestAuditSeverity;
  nonSecret: true;
  redacted: boolean;
  reasonCodes: string[];
  safetySummary: string;
  auditFields: {
    leadId: string;
    channel: LiveTestAuditChannel | "unknown";
    recipientFingerprint: string;
    operatorId: string;
    policyMode: string;
    metadata: Record<string, string | number | boolean | null>;
    metadataKeys: string[];
    invariants: {
      rawPhoneNumberRequired: false;
      messageBodyRequired: false;
      providerCredentialsAllowed: false;
      envValuesAllowed: false;
      dbWritesAllowed: false;
      filesystemWritesAllowed: false;
      routeBehaviorAllowed: false;
      safeToPersistLater: true;
      persistedNow: false;
    };
  };
};

const maxMetadataKeys = 20;
const maxKeyLength = 48;
const maxStringLength = 120;

const blockedEventTypes: LiveTestAuditEventType[] = ["live_test_blocked", "live_test_aborted"];
const warningEventTypes: LiveTestAuditEventType[] = ["kill_switch_check", "provider_boundary_check"];

const secretKeyPattern =
  /(secret|token|password|credential|api[_-]?key|auth|env|twilio|provider[_-]?key|phone|recipient|message|body|raw)/i;
const phoneLikePattern = /\+?\d[\d\s().-]{7,}\d/;
const credentialLikePattern = /(sk_live|sk_test|AC[a-f0-9]{32}|SG\.[A-Za-z0-9_-]+|Bearer\s+[A-Za-z0-9._-]+)/i;

function addReason(reasonCodes: string[], reasonCode: string) {
  if (!reasonCodes.includes(reasonCode)) {
    reasonCodes.push(reasonCode);
  }
}

function normalizeText(value?: string) {
  return value?.trim() ?? "";
}

function boundText(value: string) {
  const trimmedValue = value.trim();

  if (trimmedValue.length <= maxStringLength) return trimmedValue;

  return `${trimmedValue.slice(0, maxStringLength)}...`;
}

function normalizeReasonCodes(reasonCodes?: string[]) {
  const normalizedReasonCodes: string[] = [];

  for (const reasonCode of reasonCodes ?? []) {
    const normalizedReasonCode = boundText(String(reasonCode));

    if (normalizedReasonCode) addReason(normalizedReasonCodes, normalizedReasonCode);
  }

  return normalizedReasonCodes;
}

function normalizeMetadataKey(key: string) {
  const trimmedKey = key.trim();

  if (trimmedKey.length <= maxKeyLength) return trimmedKey;

  return `${trimmedKey.slice(0, maxKeyLength)}...`;
}

function metadataValueNeedsRedaction(value: LiveTestAuditMetadataValue) {
  return typeof value === "string" && (phoneLikePattern.test(value) || credentialLikePattern.test(value));
}

export function redactAuditMetadata(metadata: LiveTestAuditMetadata = {}) {
  const redactedMetadata: Record<string, string | number | boolean | null> = {};
  let redacted = false;

  for (const [rawKey, rawValue] of Object.entries(metadata).slice(0, maxMetadataKeys)) {
    const key = normalizeMetadataKey(rawKey);

    if (!key) {
      redacted = true;
      continue;
    }

    if (secretKeyPattern.test(rawKey) || metadataValueNeedsRedaction(rawValue)) {
      redactedMetadata[key] = "[redacted]";
      redacted = true;
      continue;
    }

    if (typeof rawValue === "string") {
      const boundedValue = boundText(rawValue);
      redactedMetadata[key] = boundedValue;
      redacted = redacted || boundedValue !== rawValue.trim();
      continue;
    }

    if (typeof rawValue === "number") {
      redactedMetadata[key] = Number.isFinite(rawValue) ? rawValue : null;
      redacted = redacted || !Number.isFinite(rawValue);
      continue;
    }

    if (typeof rawValue === "boolean" || rawValue === null) {
      redactedMetadata[key] = rawValue;
      continue;
    }

    redactedMetadata[key] = null;
    redacted = true;
  }

  if (Object.keys(metadata).length > maxMetadataKeys) {
    redacted = true;
  }

  return {
    metadata: redactedMetadata,
    redacted,
  };
}

export function classifyLiveTestAuditSeverity(input: LiveTestAuditInput): LiveTestAuditSeverity {
  const reasonCodes = normalizeReasonCodes(input.reasonCodes);

  if (blockedEventTypes.includes(input.eventType)) return "blocker";
  if (reasonCodes.some((reasonCode) => /block|abort|kill|disabled|denied|forbidden|not_allowed/i.test(reasonCode))) {
    return "blocker";
  }

  if (warningEventTypes.includes(input.eventType)) return "warning";
  if (reasonCodes.length > 0) return "warning";

  return "info";
}

export function summarizeLiveTestAuditEvent(event: Pick<LiveTestAuditOutput, "eventType" | "severity" | "reasonCodes">) {
  const baseSummary =
    "Live-test audit contract event created without side effects. No SMS, email, provider call, env read, DB write, filesystem write, route call, or automation execution occurred.";

  if (event.severity === "blocker") {
    return `${baseSummary} Event is blocked for later review. Reasons: ${event.reasonCodes.join(", ") || "none"}.`;
  }

  if (event.severity === "warning") {
    return `${baseSummary} Event needs operator review before any future live-test planning. Reasons: ${
      event.reasonCodes.join(", ") || "none"
    }.`;
  }

  return baseSummary;
}

export function createLiveTestAuditEvent(input: LiveTestAuditInput): LiveTestAuditOutput {
  const reasonCodes = normalizeReasonCodes(input.reasonCodes);
  const metadataResult = redactAuditMetadata(input.metadata);
  const severity = classifyLiveTestAuditSeverity(input);
  const eventSummary = summarizeLiveTestAuditEvent({
    eventType: input.eventType,
    severity,
    reasonCodes,
  });

  return {
    ok: severity !== "blocker",
    eventType: input.eventType,
    severity,
    nonSecret: true,
    redacted: metadataResult.redacted,
    reasonCodes,
    safetySummary: normalizeText(input.safetySummary) || eventSummary,
    auditFields: {
      leadId: boundText(normalizeText(input.leadId)),
      channel: input.channel ?? "unknown",
      recipientFingerprint: boundText(normalizeText(input.recipientFingerprint)),
      operatorId: boundText(normalizeText(input.operatorId)),
      policyMode: boundText(normalizeText(input.policyMode)),
      metadata: metadataResult.metadata,
      metadataKeys: Object.keys(metadataResult.metadata),
      invariants: {
        rawPhoneNumberRequired: false,
        messageBodyRequired: false,
        providerCredentialsAllowed: false,
        envValuesAllowed: false,
        dbWritesAllowed: false,
        filesystemWritesAllowed: false,
        routeBehaviorAllowed: false,
        safeToPersistLater: true,
        persistedNow: false,
      },
    },
  };
}
