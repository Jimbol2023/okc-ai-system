export const salesWorkspaceSafetyFlags = {
  sent: false,
  wouldSend: false,
  providerCalled: false,
  automationTriggered: false,
  crmAutoMutation: false,
  externalFetch: false,
} as const;

type LeadForSalesWorkspaceCore = {
  phone: string;
  propertyAddress: string;
  source: string;
  status: string;
  score: number;
  priority: string;
  approvalStatus: string;
  doNotContact: boolean;
  nextFollowUpAt: Date | null;
  createdAt: Date;
  payload: string | null;
};

export type SalesWorkspaceOutcomeInput = {
  id: string;
  leadId: string;
  outcome: string;
  callCompletedAt: Date | string;
  operatorSummary: string;
  sellerMotivationSignal: string;
  sellerTimelineSignal: string;
  propertyConditionSignal: string;
  priceExpectationSignal: string;
  manualNextStep: string;
};

function parsePayload(rawPayload: string | null) {
  if (!rawPayload) return {};

  try {
    const parsed = JSON.parse(rawPayload) as Record<string, unknown>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function hasPayloadValue(payload: Record<string, unknown>, keys: string[]) {
  return keys.some((key) => typeof payload[key] === "string" && String(payload[key]).trim().length > 0);
}

export function getSalesWorkspaceMissingFacts(
  lead: Pick<LeadForSalesWorkspaceCore, "phone" | "propertyAddress" | "source" | "payload">,
  latestOutcome?: SalesWorkspaceOutcomeInput | null,
) {
  const payload = parsePayload(lead.payload);
  const missing = [
    !lead.phone ? "phone" : "",
    !lead.propertyAddress ? "property address" : "",
    !lead.source ? "source" : "",
    !hasPayloadValue(payload, ["sellerMotivation", "motivation", "sellerMotivationSignal"]) &&
    (!latestOutcome || latestOutcome.sellerMotivationSignal === "not_captured")
      ? "seller motivation"
      : "",
    !hasPayloadValue(payload, ["timeline", "sellerTimeline", "sellerTimelineSignal"]) &&
    (!latestOutcome || latestOutcome.sellerTimelineSignal === "not_captured")
      ? "seller timeline"
      : "",
    !hasPayloadValue(payload, ["propertyCondition", "condition", "propertyConditionSignal"]) &&
    (!latestOutcome || latestOutcome.propertyConditionSignal === "not_captured")
      ? "property condition"
      : "",
    !hasPayloadValue(payload, ["askingPrice", "priceExpectation", "priceExpectationSignal"]) &&
    (!latestOutcome || latestOutcome.priceExpectationSignal === "not_captured")
      ? "price expectation"
      : "",
  ].filter(Boolean);

  return Array.from(new Set(missing));
}

function getTime(value: Date | string | null | undefined) {
  if (!value) return 0;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

export function getLatestSalesWorkspaceOutcome(outcomes: SalesWorkspaceOutcomeInput[]) {
  return [...outcomes].sort((a, b) => getTime(b.callCompletedAt) - getTime(a.callCompletedAt))[0] ?? null;
}

export function getSalesWorkspaceRank(input: {
  lead: Pick<LeadForSalesWorkspaceCore, "status" | "score" | "priority" | "doNotContact" | "approvalStatus" | "nextFollowUpAt" | "createdAt">;
  missingFacts: string[];
  latestOutcome?: SalesWorkspaceOutcomeInput | null;
  attributionCount?: number;
  manualIntakeCount?: number;
}) {
  const { lead, missingFacts, latestOutcome, attributionCount = 0, manualIntakeCount = 0 } = input;

  if (lead.doNotContact || lead.approvalStatus === "rejected") return 0;

  let rank = lead.score;
  if (lead.priority === "High") rank += 35;
  if (lead.priority === "Medium") rank += 15;
  if (lead.status === "new") rank += 30;
  if (lead.status === "contacted") rank += 20;
  if (lead.status === "negotiating") rank += 30;
  if (lead.nextFollowUpAt && lead.nextFollowUpAt.getTime() <= Date.now()) rank += 20;
  if (!latestOutcome) rank += 18;
  if (attributionCount > 0) rank += 8;
  if (manualIntakeCount > 0) rank += 10;
  if (missingFacts.length > 0) rank -= Math.min(missingFacts.length * 4, 24);

  return Math.max(rank, 1);
}

export function getSalesWorkspaceNextManualAction(input: {
  lead: Pick<LeadForSalesWorkspaceCore, "status" | "doNotContact" | "approvalStatus">;
  missingFacts: string[];
  latestOutcome?: SalesWorkspaceOutcomeInput | null;
}) {
  const { lead, missingFacts, latestOutcome } = input;

  if (lead.doNotContact) return "Do not contact. Review DNC or opt-out status manually.";
  if (lead.approvalStatus === "rejected") return "Do not contact. Resolve rejected approval state manually.";
  if (!latestOutcome) return "Prepare and complete a manual seller call outcome capture.";
  if (missingFacts.length > 0) return `Collect missing facts: ${missingFacts.slice(0, 4).join(", ")}.`;
  if (lead.status === "new") return "Review seller context and move to manual call prep.";
  if (lead.status === "contacted") return "Review latest seller outcome and prepare manual follow-up.";
  if (lead.status === "negotiating") return "Prepare manual offer-readiness review.";
  if (lead.status === "under_contract") return "Coordinate manual closing and disposition readiness.";
  if (lead.status === "closed") return "Record source ROI and archive sales learning.";

  return "Review manually before any seller action.";
}

export function buildSalesWorkspaceAudit(input: {
  totalLeads: number;
  queueCount: number;
  blockedCount: number;
  missingFactCount: number;
  outcomeCount: number;
}) {
  return {
    status: "manual_sales_workspace_ready",
    summary: `${input.queueCount} lead(s) prepared for manual sales review from ${input.totalLeads} active lead(s).`,
    blockedCount: input.blockedCount,
    missingFactCount: input.missingFactCount,
    outcomeCount: input.outcomeCount,
    safetyFlags: salesWorkspaceSafetyFlags,
    reviewNotes: [
      "Workspace is advisory and manual-only.",
      "Seller call outcomes remain human-entered.",
      "No outbound call, SMS, email, social message, provider call, or automation is triggered.",
    ],
  };
}
