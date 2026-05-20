export type OutreachBlockReasonCode =
  | "blocked_dnc"
  | "blocked_unapproved"
  | "blocked_missing_message"
  | "blocked_missing_phone"
  | "blocked_invalid_phone"
  | "blocked_follow_up_only"
  | "blocked_rejected"
  | "blocked_needs_human_review"
  | "blocked_live_disabled"
  | "simulated_only";

export type OutreachEligibilityMode = "simulation" | "live_disabled";

export type OutreachEligibilityResult = {
  eligible: boolean;
  blocked: boolean;
  simulatedOnly: boolean;
  needsHumanReview: boolean;
  wouldSend: false;
  sent: false;
  providerCalled: false;
  mode: OutreachEligibilityMode;
  provider: "mock";
  reasonCodes: OutreachBlockReasonCode[];
  reasons: string[];
  missingRequirements: string[];
  safetyFlags: string[];
};

export type OutreachLead = {
  approvalStatus?: string | null;
  automationStatus?: string | null;
  doNotContact?: boolean | null;
  suggestedReply?: string | null;
  lastFollowUpMessage?: string | null;
  requiresHumanApproval?: boolean | null;
  phone?: string | null;
  nextFollowUpAt?: Date | string | null;
  followUpCount?: number | null;
  score?: number | null;
  priority?: string | null;
};

const reasonText: Record<OutreachBlockReasonCode, string> = {
  blocked_dnc: "Lead is marked Do Not Contact.",
  blocked_unapproved: "Lead is not approved for future outreach.",
  blocked_missing_message: "No approved or suggested message is available.",
  blocked_missing_phone: "Lead is missing a phone number.",
  blocked_invalid_phone: "Lead phone number is not valid for outreach.",
  blocked_follow_up_only: "Lead is marked Follow-Up Only.",
  blocked_rejected: "Lead is rejected.",
  blocked_needs_human_review: "Lead still needs human review.",
  blocked_live_disabled: "Live outreach is disabled.",
  simulated_only: "Simulation only. No SMS or email will be sent.",
};

function isLiveOutreachExplicitlyEnabled() {
  if (typeof process === "undefined") return false;

  return process.env.OUTREACH_LIVE_ENABLED === "true" && process.env.OUTREACH_RUNTIME_MODE === "live";
}

function hasTwilioConfig() {
  if (typeof process === "undefined") return false;

  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER);
}

export function normalizePhoneForOutreach(phone?: string | null) {
  const trimmedPhone = phone?.trim() ?? "";

  if (!trimmedPhone) return "";

  if (/^\+\d{10,15}$/.test(trimmedPhone)) {
    return trimmedPhone;
  }

  const digits = trimmedPhone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  return "";
}

export function isValidOutreachPhone(phone?: string | null) {
  return Boolean(normalizePhoneForOutreach(phone));
}

function addReason(codes: OutreachBlockReasonCode[], code: OutreachBlockReasonCode) {
  if (!codes.includes(code)) {
    codes.push(code);
  }
}

export function evaluateOutreachEligibility(lead: OutreachLead): OutreachEligibilityResult {
  const reasonCodes: OutreachBlockReasonCode[] = [];
  const missingRequirements: string[] = [];
  const message = lead.suggestedReply?.trim() || lead.lastFollowUpMessage?.trim();
  const hasPhone = Boolean(lead.phone?.trim());
  const hasValidPhone = isValidOutreachPhone(lead.phone);
  const liveReady = isLiveOutreachExplicitlyEnabled() && hasTwilioConfig();

  if (lead.doNotContact) {
    addReason(reasonCodes, "blocked_dnc");
  }

  if (!hasPhone) {
    addReason(reasonCodes, "blocked_missing_phone");
    missingRequirements.push("Add a phone number.");
  } else if (!hasValidPhone) {
    addReason(reasonCodes, "blocked_invalid_phone");
    missingRequirements.push("Use a valid US or E.164 phone number.");
  }

  if (!message) {
    addReason(reasonCodes, "blocked_missing_message");
    missingRequirements.push("Add an approved message or suggested reply.");
  }

  if (lead.approvalStatus === "rejected") {
    addReason(reasonCodes, "blocked_rejected");
  } else if (lead.approvalStatus === "follow_up_only") {
    addReason(reasonCodes, "blocked_follow_up_only");
  } else if (lead.approvalStatus === "needs_human_review" || lead.requiresHumanApproval) {
    addReason(reasonCodes, "blocked_needs_human_review");
  } else if (lead.approvalStatus !== "approved_for_outreach") {
    addReason(reasonCodes, "blocked_unapproved");
    missingRequirements.push("Approve the lead for future outreach.");
  }

  addReason(reasonCodes, "simulated_only");

  if (!liveReady) {
    addReason(reasonCodes, "blocked_live_disabled");
  }

  const hardBlockCodes = reasonCodes.filter((code) => code !== "simulated_only" && code !== "blocked_live_disabled");
  const eligible = hardBlockCodes.length === 0;

  return {
    eligible,
    blocked: !eligible,
    simulatedOnly: true,
    needsHumanReview: reasonCodes.includes("blocked_needs_human_review") || reasonCodes.includes("blocked_unapproved"),
    wouldSend: false,
    sent: false,
    providerCalled: false,
    mode: liveReady ? "simulation" : "live_disabled",
    provider: "mock",
    reasonCodes,
    reasons: reasonCodes.map((code) => reasonText[code]),
    missingRequirements: [...new Set(missingRequirements)],
    safetyFlags: [
      "No SMS or email has been sent.",
      "Live outreach remains disabled.",
      "Approval and execution are evaluated separately.",
    ],
  };
}
