import type { StoredLead } from "./leads-storage";
import {
  createManualFollowUpWorkspaceModel,
  manualFollowUpWorkspaceFlags,
  type ManualFollowUpWorkspaceModel,
} from "./manual-follow-up-workspace-usability";
import {
  createRealManualLeadDecision,
  getRealManualLeadMissingData,
  type RealManualLeadDecision,
} from "./real-manual-lead-operations-decision-adapter";

export type LeadDetailSellerCallOutcomeInput = {
  outcome?: string | null;
  callCompletedAt?: string | null;
  operatorSummary?: string | null;
  sellerMotivationSignal?: string | null;
  sellerTimelineSignal?: string | null;
  propertyConditionSignal?: string | null;
  priceExpectationSignal?: string | null;
  manualNextStep?: string | null;
  safetyFlags?: string[] | null;
};

export type LeadDetailManualReviewLeadInput = Partial<StoredLead> & {
  id: string;
  name?: string | null;
};

export type LeadDetailManualReviewModel = {
  leadId: string;
  leadLabel: string;
  sourceVisible: string;
  decision: RealManualLeadDecision;
  followUp: ManualFollowUpWorkspaceModel;
  missingCriticalData: string[];
  sellerContextSummary: string;
  blockedVisibility: string;
  safeManualNextReview: string;
  advisoryOnly: true;
  z10ControlsDecisionLayer: true;
  flags: typeof manualFollowUpWorkspaceFlags;
};

function formatLabel(value?: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized.replaceAll("_", " ") : "not captured";
}

function parseName(input: LeadDetailManualReviewLeadInput) {
  if (!input.name) {
    return {
      firstName: input.firstName ?? "",
      lastName: input.lastName ?? "",
    };
  }

  const [firstName = "", ...rest] = input.name.trim().split(/\s+/);

  return {
    firstName,
    lastName: rest.join(" "),
  };
}

function toStoredLead(input: LeadDetailManualReviewLeadInput): StoredLead {
  const parsedName = parseName(input);

  return {
    id: input.id,
    timestamp: input.timestamp ?? "",
    firstName: input.firstName ?? parsedName.firstName,
    lastName: input.lastName ?? parsedName.lastName,
    email: input.email ?? "",
    phone: input.phone ?? "",
    propertyAddress: input.propertyAddress ?? "",
    city: input.city ?? "",
    state: input.state ?? "",
    zipCode: input.zipCode ?? "",
    ownerName: input.ownerName ?? "",
    mailingAddress: input.mailingAddress ?? "",
    county: input.county ?? "",
    parcelId: input.parcelId ?? "",
    situationDetails: input.situationDetails ?? "",
    source: input.source ?? "",
    status: input.status ?? "new",
    notes: input.notes ?? [],
    followUps: input.followUps ?? [],
    analyzer: input.analyzer ?? {
      arv: "",
      estimatedRepairs: "",
      desiredProfit: "",
    },
    distressFlags: input.distressFlags ?? {
      taxDelinquent: false,
      inheritedProperty: false,
      vacantProperty: false,
      foreclosureRisk: false,
      majorRepairs: false,
      tiredLandlord: false,
      urgentTimeline: false,
      outOfStateOwner: false,
    },
    opportunityScore: input.opportunityScore ?? "Low",
    score: input.score ?? 0,
    priority: input.priority ?? "Low",
    scoreBreakdown: input.scoreBreakdown ?? "",
    lastContactedAt: input.lastContactedAt ?? null,
    nextFollowUpAt: input.nextFollowUpAt ?? null,
    followUpCount: input.followUpCount ?? 0,
    lastFollowUpMessage: input.lastFollowUpMessage ?? null,
    suggestedReply: input.suggestedReply ?? null,
    automationStatus: input.automationStatus ?? null,
    approvalStatus: input.approvalStatus ?? null,
    doNotContact: input.doNotContact ?? false,
    requiresHumanApproval: input.requiresHumanApproval ?? null,
    lastSellerReply: input.lastSellerReply ?? null,
    isHot: input.isHot ?? null,
  };
}

function getLatestOutcome(outcomes: LeadDetailSellerCallOutcomeInput[]) {
  return outcomes[0] ?? null;
}

function getSellerContextMissingData(latestOutcome: LeadDetailSellerCallOutcomeInput | null) {
  return [
    !latestOutcome || latestOutcome.sellerMotivationSignal === "not_captured" ? "seller motivation" : "",
    !latestOutcome || latestOutcome.sellerTimelineSignal === "not_captured" ? "seller timeline" : "",
  ].filter(Boolean);
}

function getSellerContextSummary(latestOutcome: LeadDetailSellerCallOutcomeInput | null) {
  if (!latestOutcome) return "No seller call outcome has been captured yet.";

  return `Latest seller outcome: ${formatLabel(latestOutcome.outcome)}; motivation ${formatLabel(latestOutcome.sellerMotivationSignal)}, timeline ${formatLabel(latestOutcome.sellerTimelineSignal)}, manual next step ${formatLabel(latestOutcome.manualNextStep)}.`;
}

function getBlockedVisibility(lead: StoredLead) {
  if (lead.doNotContact) return "Do-not-contact is visible. No seller or buyer-facing action should be taken from this page.";
  if (lead.approvalStatus === "rejected") return "Rejected approval state is visible. Manual review should stop before follow-up.";

  return "No DNC or rejected approval state is visible from current lead data.";
}

function getSafeManualNextReview(
  lead: StoredLead,
  decision: RealManualLeadDecision,
  followUp: ManualFollowUpWorkspaceModel,
  missingCriticalData: string[],
) {
  if (lead.doNotContact || lead.approvalStatus === "rejected") {
    return "Stop before working this lead. Review DNC, rejected approval, or contact-safety context manually.";
  }

  if (lead.status === "closed") {
    return "No active manual review is recommended for this terminal lead.";
  }

  if (missingCriticalData.length > 0) {
    return `Clean up ${missingCriticalData.slice(0, 4).join(", ")} before deciding on follow-up or revenue work.`;
  }

  if (followUp.lane === "overdue_manual_review" || followUp.lane === "due_soon_manual_review") {
    return followUp.safeManualNextReview;
  }

  return decision.safeManualNextReview;
}

export function createLeadDetailManualReviewModel(
  input: LeadDetailManualReviewLeadInput,
  outcomes: LeadDetailSellerCallOutcomeInput[] = [],
  now = new Date(),
): LeadDetailManualReviewModel {
  const lead = toStoredLead(input);
  const decision = createRealManualLeadDecision(lead);
  const followUp = createManualFollowUpWorkspaceModel(lead, now);
  const latestOutcome = getLatestOutcome(outcomes);
  const missingCriticalData = Array.from(
    new Set([...getRealManualLeadMissingData(lead), ...getSellerContextMissingData(latestOutcome)]),
  );

  return {
    leadId: lead.id,
    leadLabel: decision.leadLabel,
    sourceVisible: decision.sourceVisible,
    decision,
    followUp,
    missingCriticalData,
    sellerContextSummary: getSellerContextSummary(latestOutcome),
    blockedVisibility: getBlockedVisibility(lead),
    safeManualNextReview: getSafeManualNextReview(lead, decision, followUp, missingCriticalData),
    advisoryOnly: true,
    z10ControlsDecisionLayer: true,
    flags: manualFollowUpWorkspaceFlags,
  };
}

export function createLeadDetailManualReviewUsabilitySummary() {
  return {
    phase: "Lead Detail Manual Review Usability" as const,
    leadDetailManualReviewReady: true,
    z10ConsolidationReady: true,
    followUpWorkspaceIntegrated: true,
    recommendedNextExactStep: "Dashboard Signal Consolidation",
    advisoryOnly: true,
    flags: manualFollowUpWorkspaceFlags,
  };
}
