import { z } from "zod";

import type { SellerCallOutcomeId, SellerCallSafetyFlag, SellerCallSignalStrength } from "@/lib/seller-call-outcome-plan";

export const sellerCallOutcomeIds = [
  "no_answer",
  "left_voicemail",
  "wrong_number",
  "disconnected",
  "not_interested",
  "call_back_requested",
  "interested",
  "wants_offer",
  "appointment_set",
  "already_sold",
  "do_not_contact",
  "needs_manual_review",
] as const satisfies readonly SellerCallOutcomeId[];

export const sellerCallSignalStrengths = [
  "not_captured",
  "low",
  "medium",
  "high",
  "needs_review",
] as const satisfies readonly SellerCallSignalStrength[];

export const sellerCallSafetyFlags = [
  "dnc_requested",
  "wrong_number",
  "disconnected_number",
  "sensitive_content",
  "manual_review_required",
  "approval_gate_review",
  "no_execution",
] as const satisfies readonly SellerCallSafetyFlag[];

export const sellerCallManualNextSteps = [
  "operator_review",
  "verify_contact_info",
  "manual_follow_up_review",
  "manual_offer_readiness_review",
  "manual_appointment_review",
  "manual_closeout_review",
  "dnc_manual_review",
  "sensitive_manual_review",
] as const;

const MAX_OPERATOR_SUMMARY_LENGTH = 700;

const restrictedSummaryPatterns: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /\b(send|text|sms|email|dial)\b.*\b(now|seller|buyer|owner|lead|them)\b/i, reason: "Summary cannot contain send, text, email, or dial instructions." },
  { pattern: /\bcall\s+(now|the\s+seller|seller|the\s+buyer|buyer|the\s+owner|owner|the\s+lead|lead|them)\b/i, reason: "Summary cannot contain call instructions." },
  { pattern: /\b(schedule|queue|trigger|run|start|execute)\b/i, reason: "Summary cannot contain scheduling or automation commands." },
  { pattern: /\b(generate|create|prepare)\b.*\b(contract|document|agreement|offer packet)\b/i, reason: "Summary cannot contain document or contract generation instructions." },
  { pattern: /\b(approve|approval)\b.*\b(outreach|send|message|anyway)\b/i, reason: "Summary cannot authorize or bypass approval gates." },
  { pattern: /\b(ignore|override|bypass)\b.*\b(dnc|do not contact|approval|preflight|gate)\b/i, reason: "Summary cannot bypass DNC, approval, preflight, or gate controls." },
  { pattern: /\b(twilio|sendgrid|mailgun|provider payload|webhook|api response)\b/i, reason: "Summary cannot store provider payloads or provider instructions." },
  { pattern: /\b(api[_-]?key|secret|token|password|bearer|database_url|direct_url)\b/i, reason: "Summary cannot contain credentials or secrets." },
];

const rawSellerCallOutcomePayloadSchema = z.object({
  outcome: z.enum(sellerCallOutcomeIds),
  callCompletedAt: z.string().min(1),
  operatorSummary: z.string(),
  sellerMotivationSignal: z.enum(sellerCallSignalStrengths),
  sellerTimelineSignal: z.enum(sellerCallSignalStrengths),
  propertyConditionSignal: z.enum(sellerCallSignalStrengths),
  priceExpectationSignal: z.enum(sellerCallSignalStrengths),
  manualNextStep: z.enum(sellerCallManualNextSteps),
  safetyFlags: z.array(z.enum(sellerCallSafetyFlags)).min(1),
});

export type SellerCallManualNextStep = (typeof sellerCallManualNextSteps)[number];

export type ValidatedSellerCallOutcomeInput = {
  outcome: SellerCallOutcomeId;
  callCompletedAt: Date;
  operatorSummary: string;
  sellerMotivationSignal: SellerCallSignalStrength;
  sellerTimelineSignal: SellerCallSignalStrength;
  propertyConditionSignal: SellerCallSignalStrength;
  priceExpectationSignal: SellerCallSignalStrength;
  manualNextStep: SellerCallManualNextStep;
  safetyFlags: SellerCallSafetyFlag[];
};

export type SellerCallOutcomeValidationResult =
  | {
      ok: true;
      data: ValidatedSellerCallOutcomeInput;
    }
  | {
      ok: false;
      errors: string[];
    };

function sanitizeOperatorSummary(summary: string) {
  const trimmed = summary.trim().replace(/\s+/g, " ");

  if (!trimmed) {
    return {
      ok: false as const,
      error: "Operator summary is required.",
    };
  }

  if (trimmed.length > MAX_OPERATOR_SUMMARY_LENGTH) {
    return {
      ok: false as const,
      error: `Operator summary must be ${MAX_OPERATOR_SUMMARY_LENGTH} characters or fewer.`,
    };
  }

  const restrictedRule = restrictedSummaryPatterns.find((rule) => rule.pattern.test(trimmed));

  if (restrictedRule) {
    return {
      ok: false as const,
      error: restrictedRule.reason,
    };
  }

  return {
    ok: true as const,
    summary: trimmed,
  };
}

function parseCallCompletedAt(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

export function validateSellerCallOutcomePayload(payload: unknown): SellerCallOutcomeValidationResult {
  const parsed = rawSellerCallOutcomePayloadSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((issue) => issue.message),
    };
  }

  const sanitizedSummary = sanitizeOperatorSummary(parsed.data.operatorSummary);

  if (!sanitizedSummary.ok) {
    return {
      ok: false,
      errors: [sanitizedSummary.error],
    };
  }

  const callCompletedAt = parseCallCompletedAt(parsed.data.callCompletedAt);

  if (!callCompletedAt) {
    return {
      ok: false,
      errors: ["callCompletedAt must be a valid timestamp."],
    };
  }

  return {
    ok: true,
    data: {
      ...parsed.data,
      callCompletedAt,
      operatorSummary: sanitizedSummary.summary,
      safetyFlags: [...new Set(parsed.data.safetyFlags)],
    },
  };
}
