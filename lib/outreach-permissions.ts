import { isValidOutreachPhone, type OutreachLead } from "@/lib/outreach-gating";

export type OutreachRolloutStage =
  | "mock_only"
  | "test_number_only"
  | "staging_only"
  | "allowlisted_recipients"
  | "monitored_rollout";

export type LiveSendPermissionReason =
  | "blocked_emergency_stop"
  | "blocked_live_disabled"
  | "blocked_provider_disabled"
  | "blocked_provider_not_ready"
  | "blocked_operator_confirmation_required"
  | "blocked_missing_lead_context"
  | "blocked_dnc"
  | "blocked_unapproved"
  | "blocked_missing_message"
  | "blocked_missing_phone"
  | "blocked_invalid_phone"
  | "blocked_follow_up_only"
  | "blocked_rejected"
  | "blocked_needs_human_review";

export type OutreachActivationState = {
  runtimeMode: "simulation" | "live";
  rolloutStage: OutreachRolloutStage;
  liveEnabled: boolean;
  providerEnabled: boolean;
  providerReady: boolean;
  emergencyStop: boolean;
};

export type LiveSendPermissionInput = {
  lead?: OutreachLead;
  phone?: string | null;
  message?: string | null;
  operatorConfirmed?: boolean;
};

export type LiveSendPermissionResult = {
  allowed: boolean;
  activation: OutreachActivationState;
  blockedReasons: LiveSendPermissionReason[];
  humanReadableReasons: string[];
};

const reasonText: Record<LiveSendPermissionReason, string> = {
  blocked_emergency_stop: "Emergency stop is active.",
  blocked_live_disabled: "Live outreach is disabled.",
  blocked_provider_disabled: "Provider activation is disabled.",
  blocked_provider_not_ready: "Provider configuration is not ready.",
  blocked_operator_confirmation_required: "Final operator live-send confirmation is required and is not implemented yet.",
  blocked_missing_lead_context: "Lead context is required for live-send permission.",
  blocked_dnc: "Lead is marked Do Not Contact.",
  blocked_unapproved: "Lead is not approved for future outreach.",
  blocked_missing_message: "Message is required.",
  blocked_missing_phone: "Phone number is required.",
  blocked_invalid_phone: "Phone number is invalid.",
  blocked_follow_up_only: "Lead is follow-up-only.",
  blocked_rejected: "Lead is rejected.",
  blocked_needs_human_review: "Lead needs human review.",
};

function readBooleanEnv(name: string) {
  return process.env[name] === "true";
}

function getRolloutStage(): OutreachRolloutStage {
  const stage = process.env.OUTREACH_ROLLOUT_STAGE;

  if (
    stage === "test_number_only" ||
    stage === "staging_only" ||
    stage === "allowlisted_recipients" ||
    stage === "monitored_rollout"
  ) {
    return stage;
  }

  return "mock_only";
}

function addReason(reasons: LiveSendPermissionReason[], reason: LiveSendPermissionReason) {
  if (!reasons.includes(reason)) {
    reasons.push(reason);
  }
}

export function getOutreachActivationState(): OutreachActivationState {
  const runtimeMode = process.env.OUTREACH_RUNTIME_MODE === "live" ? "live" : "simulation";
  const liveEnabled = readBooleanEnv("OUTREACH_LIVE_ENABLED");
  const providerEnabled = readBooleanEnv("OUTREACH_PROVIDER_ENABLED");
  const emergencyStop = readBooleanEnv("OUTREACH_EMERGENCY_STOP");
  const providerReady = Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER,
  );

  return {
    runtimeMode,
    rolloutStage: getRolloutStage(),
    liveEnabled,
    providerEnabled,
    providerReady,
    emergencyStop,
  };
}

export function evaluateLiveSendPermission({
  lead,
  phone,
  message,
  operatorConfirmed = false,
}: LiveSendPermissionInput): LiveSendPermissionResult {
  const activation = getOutreachActivationState();
  const blockedReasons: LiveSendPermissionReason[] = [];
  const targetPhone = phone ?? lead?.phone;
  const targetMessage = message?.trim() || lead?.suggestedReply?.trim() || lead?.lastFollowUpMessage?.trim();

  if (activation.emergencyStop) addReason(blockedReasons, "blocked_emergency_stop");
  if (!activation.liveEnabled || activation.runtimeMode !== "live") addReason(blockedReasons, "blocked_live_disabled");
  if (!activation.providerEnabled) addReason(blockedReasons, "blocked_provider_disabled");
  if (!activation.providerReady) addReason(blockedReasons, "blocked_provider_not_ready");
  if (!operatorConfirmed) addReason(blockedReasons, "blocked_operator_confirmation_required");
  if (!lead) addReason(blockedReasons, "blocked_missing_lead_context");

  if (lead?.doNotContact) addReason(blockedReasons, "blocked_dnc");

  if (!targetPhone?.trim()) {
    addReason(blockedReasons, "blocked_missing_phone");
  } else if (!isValidOutreachPhone(targetPhone)) {
    addReason(blockedReasons, "blocked_invalid_phone");
  }

  if (!targetMessage) addReason(blockedReasons, "blocked_missing_message");

  if (lead?.approvalStatus === "rejected") {
    addReason(blockedReasons, "blocked_rejected");
  } else if (lead?.approvalStatus === "follow_up_only") {
    addReason(blockedReasons, "blocked_follow_up_only");
  } else if (lead?.approvalStatus === "needs_human_review" || lead?.requiresHumanApproval) {
    addReason(blockedReasons, "blocked_needs_human_review");
  } else if (lead && lead.approvalStatus !== "approved_for_outreach") {
    addReason(blockedReasons, "blocked_unapproved");
  }

  return {
    allowed: blockedReasons.length === 0,
    activation,
    blockedReasons,
    humanReadableReasons: blockedReasons.map((reason) => reasonText[reason]),
  };
}
