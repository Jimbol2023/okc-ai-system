import { analyzeClosingReadiness, type ClosingReadiness } from "./closing-readiness";
import { analyzeDispositionReadiness, type DispositionReadiness } from "./disposition-readiness";
import type { StoredLead } from "./leads-storage";
import { z4ManualConversionFlags } from "./z4-manual-conversion-policy";

export type BuyerDispositionReadinessLeadInput = Partial<StoredLead> & {
  id: string;
  name?: string | null;
};

export type BuyerDispositionPackageChecklistSummary = {
  total: number;
  complete: number;
  missing: number;
  reviewNeeded: number;
  visibleItems: Array<{
    label: string;
    status: "complete" | "missing" | "review_needed";
    reason: string;
  }>;
};

export const buyerDispositionReadinessUsabilityFlags = {
  ...z4ManualConversionFlags,
  buyerDispositionProviderCalled: false,
  buyerDispositionSent: false,
  buyerDispositionRuntimeActivated: false,
  buyerDispositionQueueCreated: false,
  buyerDispositionRoutingCreated: false,
  buyerDispositionAssignmentCreated: false,
  buyerDispositionCalendarItemCreated: false,
  buyerDispositionReminderCreated: false,
  buyerDispositionStorageAuthorized: false,
  buyerDispositionAuditWriteAuthorized: false,
  buyerDispositionContractGenerated: false,
  buyerDispositionAssignmentExecuted: false,
  buyerDispositionCrmMutationExpanded: false,
} as const;

export type BuyerDispositionReadinessUsabilityModel = {
  leadId: string;
  leadLabel: string;
  sourceVisible: string;
  buyerReadinessLabel: string;
  assignmentReadinessLabel: string;
  buyerReadinessScore: number;
  packageChecklistSummary: BuyerDispositionPackageChecklistSummary;
  blockerLabels: string[];
  missingPackageData: string[];
  nearCloseVisibility: string;
  closingVisibility: string;
  safeManualNextReview: string;
  disposition: DispositionReadiness;
  closing: ClosingReadiness;
  recommendedNextExactStep: "Operational Pilot Hardening";
  advisoryOnly: true;
  readOnly: true;
  flags: typeof buyerDispositionReadinessUsabilityFlags;
};

function hasText(value?: string | null) {
  return typeof value === "string" && value.trim().length > 0;
}

function formatLabel(value?: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized.replaceAll("_", " ") : "not captured";
}

function parseName(input: BuyerDispositionReadinessLeadInput) {
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

function toStoredLead(input: BuyerDispositionReadinessLeadInput): StoredLead {
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
    latestApprovalAction: input.latestApprovalAction ?? null,
    latestApprovalNote: input.latestApprovalNote ?? null,
    latestApprovalAt: input.latestApprovalAt ?? null,
    approvalHistory: input.approvalHistory,
    latestMockOutreachAt: input.latestMockOutreachAt ?? null,
    latestMockOutreachResult: input.latestMockOutreachResult ?? null,
    latestMockOutreachMessage: input.latestMockOutreachMessage ?? null,
    latestMockOutreachBlockedReasons: input.latestMockOutreachBlockedReasons,
    mockOutreachHistory: input.mockOutreachHistory,
  };
}

function getLeadLabel(lead: StoredLead) {
  const sellerName = `${lead.firstName ?? ""} ${lead.lastName ?? ""}`.trim();
  return sellerName || lead.propertyAddress || lead.ownerName || lead.id;
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function getPackageChecklistSummary(disposition: DispositionReadiness): BuyerDispositionPackageChecklistSummary {
  const visibleItems = disposition.checklist.slice(0, 6).map((item) => ({
    label: item.label,
    status: item.status,
    reason: item.reason,
  }));

  return {
    total: disposition.checklist.length,
    complete: disposition.checklist.filter((item) => item.status === "complete").length,
    missing: disposition.checklist.filter((item) => item.status === "missing").length,
    reviewNeeded: disposition.checklist.filter((item) => item.status === "review_needed").length,
    visibleItems,
  };
}

function getNearCloseVisibility(lead: StoredLead, closing: ClosingReadiness) {
  if (lead.status === "closed") return "Closed lead: no buyer/disposition execution is recommended from this review.";
  if (lead.status === "under_contract") {
    return `Under-contract visibility is present. Closing readiness is ${formatLabel(closing.readinessState)} with ${closing.bottlenecks.length} closing bottleneck(s).`;
  }
  if (lead.approvalStatus === "approved_for_outreach") return "Buyer-ready approval visibility exists, but buyer-facing work still requires human review.";
  return "No under-contract or buyer-ready visibility is present yet.";
}

function getSafeManualNextReview(lead: StoredLead, disposition: DispositionReadiness, closing: ClosingReadiness, missingPackageData: string[]) {
  if (lead.doNotContact || lead.approvalStatus === "rejected") {
    return "Stop before buyer/disposition work. Review DNC, rejected, or contact-safety context manually.";
  }

  if (lead.status === "closed") {
    return "Closed lead: review records only. Do not create buyer work, assignment work, or closing execution from this page.";
  }

  if (lead.status === "under_contract" && closing.blockers.length > 0) {
    return `Review closing blocker manually: ${closing.blockers[0]}.`;
  }

  if (lead.status === "under_contract" && closing.nextClosingAction.urgency !== "low") {
    return `${closing.nextClosingAction.label}: ${closing.nextClosingAction.reason}`;
  }

  if (missingPackageData.length > 0) {
    return `Clean up buyer package data before buyer/disposition review: ${missingPackageData.slice(0, 4).join(", ")}.`;
  }

  if (disposition.buyerReadiness === "buyer_ready" || disposition.buyerReadiness === "almost_buyer_ready") {
    return `${disposition.buyerSideNextAction.label}: ${disposition.buyerSideNextAction.reason}`;
  }

  return "Monitor buyer/disposition readiness behind higher-priority records until seller agreement, valuation, photos, access, and buyer package context improve.";
}

export function createBuyerDispositionReadinessUsabilityModel(
  input: BuyerDispositionReadinessLeadInput,
): BuyerDispositionReadinessUsabilityModel {
  const lead = toStoredLead(input);
  const disposition = analyzeDispositionReadiness(lead);
  const closing = analyzeClosingReadiness(lead);
  const missingPackageData = unique([
    ...disposition.missingFields,
    ...(lead.status === "under_contract" ? closing.missingFields : []),
    ...(lead.status === "under_contract" ? closing.contractChecklist.filter((item) => item.status === "review_needed").map((item) => item.label) : []),
    ...(lead.status === "under_contract" ? closing.titleChecklist.filter((item) => item.status === "review_needed").map((item) => item.label) : []),
    ...(lead.status === "under_contract" ? closing.earnestMoneyChecklist.filter((item) => item.status === "review_needed").map((item) => item.label) : []),
  ]);
  const blockerLabels = unique([...disposition.blockers, ...closing.blockers]);

  return {
    leadId: lead.id,
    leadLabel: getLeadLabel(lead),
    sourceVisible: hasText(lead.source) ? lead.source : "missing source",
    buyerReadinessLabel: formatLabel(disposition.buyerReadiness),
    assignmentReadinessLabel: formatLabel(disposition.assignmentReadiness),
    buyerReadinessScore: disposition.buyerReadinessScore,
    packageChecklistSummary: getPackageChecklistSummary(disposition),
    blockerLabels,
    missingPackageData,
    nearCloseVisibility: getNearCloseVisibility(lead, closing),
    closingVisibility: `${formatLabel(closing.readinessState)}; revenue risk ${formatLabel(closing.revenueRealizationRisk)}.`,
    safeManualNextReview: getSafeManualNextReview(lead, disposition, closing, missingPackageData),
    disposition,
    closing,
    recommendedNextExactStep: "Operational Pilot Hardening",
    advisoryOnly: true,
    readOnly: true,
    flags: buyerDispositionReadinessUsabilityFlags,
  };
}

export function createBuyerDispositionReadinessUsabilitySummary() {
  return {
    phase: "Buyer/Disposition Readiness Usability" as const,
    buyerDispositionReadinessUsabilityReady: true,
    canonicalDispositionLogic: "analyzeDispositionReadiness",
    canonicalClosingLogic: "analyzeClosingReadiness",
    recommendedNextExactStep: "Operational Pilot Hardening",
    advisoryOnly: true,
    readOnly: true,
    flags: buyerDispositionReadinessUsabilityFlags,
  };
}
