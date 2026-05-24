import type { StoredLead } from "./leads-storage";
import { manualFollowUpWorkspaceFlags } from "./manual-follow-up-workspace-usability";
import type { SellerCallManualNextStep } from "./seller-call-outcome-validation";

export type SellerCallOutcomeUsabilityLeadInput = Partial<StoredLead> & {
  id: string;
  name?: string | null;
};

export type SellerCallOutcomeUsabilityOutcomeInput = {
  id?: string | null;
  leadId?: string | null;
  outcome?: string | null;
  callCompletedAt?: string | null;
  operatorSummary?: string | null;
  sellerMotivationSignal?: string | null;
  sellerTimelineSignal?: string | null;
  propertyConditionSignal?: string | null;
  priceExpectationSignal?: string | null;
  manualNextStep?: string | null;
  safetyFlags?: string[] | null;
  createdAt?: string | null;
};

export type SellerCallCaptureState =
  | "blocked_manual_review"
  | "needs_capture"
  | "needs_seller_signal_cleanup"
  | "captured_review_value"
  | "captured_monitor";

export type SellerCallOutcomeHistoryScanRow = {
  id: string;
  outcomeLabel: string;
  completedAtLabel: string;
  manualNextStepLabel: string;
  sellerSignalSummary: string;
  operatorSummary: string;
  safetyFlags: string[];
};

export const sellerCallOutcomeUsabilityFlags = {
  ...manualFollowUpWorkspaceFlags,
  sellerCallProviderCalled: false,
  sellerCallSent: false,
  sellerCallRuntimeActivated: false,
  sellerCallStorageAuthorizedByHelper: false,
  sellerCallAuditWriteAuthorized: false,
  sellerCallQueueCreated: false,
  sellerCallReminderCreated: false,
  sellerCallCalendarItemCreated: false,
  sellerCallAutomationTriggered: false,
  sellerCallContactExecuted: false,
  sellerCallCrmMutationExpanded: false,
} as const;

export type SellerCallOutcomeUsabilityModel = {
  leadId: string;
  sourceVisible: string;
  latestOutcomeLabel: string;
  captureState: SellerCallCaptureState;
  missingSellerSignals: string[];
  recommendedDefaults: {
    outcome: "no_answer";
    manualNextStep: SellerCallManualNextStep;
    sellerMotivationSignal: "not_captured";
    sellerTimelineSignal: "not_captured";
    propertyConditionSignal: "not_captured";
    priceExpectationSignal: "not_captured";
  };
  safetyCopy: string[];
  historyRows: SellerCallOutcomeHistoryScanRow[];
  operatorGuidance: string;
  recommendedNextExactStep: "Buyer/Disposition Readiness Usability";
  advisoryOnly: true;
  readOnly: true;
  flags: typeof sellerCallOutcomeUsabilityFlags;
};

function hasText(value?: string | null) {
  return typeof value === "string" && value.trim().length > 0;
}

function formatLabel(value?: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized.replaceAll("_", " ") : "not captured";
}

function formatDate(value?: string | null) {
  if (!value) return "date not captured";
  const parsedDate = new Date(value);

  return Number.isNaN(parsedDate.getTime()) ? "date not captured" : parsedDate.toLocaleString();
}

function getTime(value?: string | null) {
  if (!value) return 0;
  const parsedTime = new Date(value).getTime();

  return Number.isNaN(parsedTime) ? 0 : parsedTime;
}

function getSourceVisible(lead: SellerCallOutcomeUsabilityLeadInput) {
  return hasText(lead.source) ? lead.source!.trim() : "missing source";
}

function getLatestOutcome(outcomes: SellerCallOutcomeUsabilityOutcomeInput[]) {
  return [...outcomes].sort(
    (a, b) =>
      getTime(b.callCompletedAt) - getTime(a.callCompletedAt) ||
      getTime(b.createdAt) - getTime(a.createdAt) ||
      String(a.id ?? "").localeCompare(String(b.id ?? "")),
  )[0] ?? null;
}

function getMissingLeadData(lead: SellerCallOutcomeUsabilityLeadInput) {
  return [
    !hasText(lead.source) ? "source" : "",
    !hasText(lead.phone) && !hasText(lead.email) ? "seller contact" : "",
    !hasText(lead.propertyAddress) ? "property address" : "",
  ].filter(Boolean);
}

function getMissingSellerSignals(latestOutcome: SellerCallOutcomeUsabilityOutcomeInput | null) {
  return [
    !latestOutcome || latestOutcome.sellerMotivationSignal === "not_captured" ? "seller motivation" : "",
    !latestOutcome || latestOutcome.sellerTimelineSignal === "not_captured" ? "seller timeline" : "",
    !latestOutcome || latestOutcome.propertyConditionSignal === "not_captured" ? "property condition" : "",
    !latestOutcome || latestOutcome.priceExpectationSignal === "not_captured" ? "price expectation" : "",
  ].filter(Boolean);
}

function hasStrongSellerSignal(latestOutcome: SellerCallOutcomeUsabilityOutcomeInput | null) {
  return (
    latestOutcome?.outcome === "wants_offer" ||
    latestOutcome?.outcome === "appointment_set" ||
    latestOutcome?.sellerMotivationSignal === "high" ||
    latestOutcome?.sellerTimelineSignal === "high"
  );
}

function getCaptureState(
  lead: SellerCallOutcomeUsabilityLeadInput,
  latestOutcome: SellerCallOutcomeUsabilityOutcomeInput | null,
  missingLeadData: string[],
  missingSellerSignals: string[],
): SellerCallCaptureState {
  if (lead.doNotContact === true || lead.approvalStatus === "rejected") return "blocked_manual_review";
  if (!latestOutcome) return "needs_capture";
  if (missingLeadData.length > 0 || missingSellerSignals.length > 0) return "needs_seller_signal_cleanup";
  if (hasStrongSellerSignal(latestOutcome)) return "captured_review_value";
  return "captured_monitor";
}

function getOperatorGuidance(captureState: SellerCallCaptureState) {
  if (captureState === "blocked_manual_review") return "Stop before seller-call work. Review DNC, rejected, or contact-safety context manually.";
  if (captureState === "needs_capture") return "After a completed manual seller call, capture the outcome, seller signals, and manual next review here.";
  if (captureState === "needs_seller_signal_cleanup") return "Clean up missing lead or seller signal data before using this outcome for manual revenue review.";
  if (captureState === "captured_review_value") return "Review this seller context manually for offer, appointment, or buyer/disposition readiness.";
  return "Seller call context is captured; monitor behind higher-priority manual review records.";
}

function createHistoryRows(outcomes: SellerCallOutcomeUsabilityOutcomeInput[]): SellerCallOutcomeHistoryScanRow[] {
  return [...outcomes]
    .sort(
      (a, b) =>
        getTime(b.callCompletedAt) - getTime(a.callCompletedAt) ||
        getTime(b.createdAt) - getTime(a.createdAt) ||
        String(a.id ?? "").localeCompare(String(b.id ?? "")),
    )
    .map((outcome, index) => ({
      id: outcome.id || `seller-call-outcome-${index + 1}`,
      outcomeLabel: formatLabel(outcome.outcome),
      completedAtLabel: formatDate(outcome.callCompletedAt),
      manualNextStepLabel: formatLabel(outcome.manualNextStep),
      sellerSignalSummary: `Motivation ${formatLabel(outcome.sellerMotivationSignal)}; timeline ${formatLabel(outcome.sellerTimelineSignal)}; condition ${formatLabel(outcome.propertyConditionSignal)}; price ${formatLabel(outcome.priceExpectationSignal)}.`,
      operatorSummary: hasText(outcome.operatorSummary) ? outcome.operatorSummary!.trim() : "No operator summary captured.",
      safetyFlags: Array.isArray(outcome.safetyFlags) ? outcome.safetyFlags.filter((flag): flag is string => hasText(flag)) : [],
    }));
}

export function createSellerCallOutcomeUsabilityModel(
  lead: SellerCallOutcomeUsabilityLeadInput,
  outcomes: SellerCallOutcomeUsabilityOutcomeInput[] = [],
): SellerCallOutcomeUsabilityModel {
  const latestOutcome = getLatestOutcome(outcomes);
  const missingLeadData = getMissingLeadData(lead);
  const missingSellerSignals = Array.from(new Set([...missingLeadData, ...getMissingSellerSignals(latestOutcome)]));
  const captureState = getCaptureState(lead, latestOutcome, missingLeadData, missingSellerSignals);

  return {
    leadId: lead.id,
    sourceVisible: getSourceVisible(lead),
    latestOutcomeLabel: latestOutcome ? formatLabel(latestOutcome.outcome) : "not captured",
    captureState,
    missingSellerSignals,
    recommendedDefaults: {
      outcome: "no_answer",
      manualNextStep: "manual_follow_up_review",
      sellerMotivationSignal: "not_captured",
      sellerTimelineSignal: "not_captured",
      propertyConditionSignal: "not_captured",
      priceExpectationSignal: "not_captured",
    },
    safetyCopy: [
      "Manual outcome capture only.",
      "Do not enter send, call, schedule, approval, DNC override, provider, credential, or contract instructions.",
      "Saving an outcome does not send outreach, call providers, create reminders, mutate CRM status, or authorize execution.",
    ],
    historyRows: createHistoryRows(outcomes),
    operatorGuidance: getOperatorGuidance(captureState),
    recommendedNextExactStep: "Buyer/Disposition Readiness Usability",
    advisoryOnly: true,
    readOnly: true,
    flags: sellerCallOutcomeUsabilityFlags,
  };
}

export function createSellerCallOutcomeUsabilitySummary() {
  return {
    phase: "Seller Call Outcome Usability" as const,
    sellerCallOutcomeUsabilityReady: true,
    appendOnlyOutcomeBehaviorPreserved: true,
    recommendedNextExactStep: "Buyer/Disposition Readiness Usability",
    advisoryOnly: true,
    readOnly: true,
    flags: sellerCallOutcomeUsabilityFlags,
  };
}
