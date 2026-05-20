import type { StoredLead } from "@/lib/leads-storage";

export type ClosingReadinessState =
  | "closing_ready"
  | "almost_closing_ready"
  | "not_closing_ready"
  | "closing_blocked"
  | "not_applicable";

export type RevenueRealizationRisk = "low" | "medium" | "high" | "blocked" | "unknown";

export type ClosingChecklistStatus = "complete" | "missing" | "review_needed" | "not_applicable";

export type ClosingChecklistItem = {
  key: string;
  label: string;
  status: ClosingChecklistStatus;
  reason: string;
};

export type ClosingSideNextAction = {
  label: string;
  urgency: "critical" | "high" | "medium" | "low" | "blocked";
  reason: string;
  blocker?: string;
  safetyNote: string;
};

export type ClosingReadiness = {
  readinessState: ClosingReadinessState;
  readinessScore: number;
  reason: string;
  blockers: string[];
  missingFields: string[];
  bottlenecks: string[];
  contractChecklist: ClosingChecklistItem[];
  titleChecklist: ClosingChecklistItem[];
  earnestMoneyChecklist: ClosingChecklistItem[];
  nextClosingAction: ClosingSideNextAction;
  revenueRealizationRisk: RevenueRealizationRisk;
  safetyNotes: string[];
};

type ClosingPayloadFields = StoredLead & {
  doNotContact?: unknown;
  approvalStatus?: unknown;
  sellerAgreementStatus?: unknown;
  sellerContractStatus?: unknown;
  contractStatus?: unknown;
  assignmentAgreementStatus?: unknown;
  assignmentStatus?: unknown;
  buyerAssignmentStatus?: unknown;
  buyerSelected?: unknown;
  selectedBuyerId?: unknown;
  selectedBuyerName?: unknown;
  titleStatus?: unknown;
  titleOpened?: unknown;
  titleCompanyStatus?: unknown;
  titleBlockerStatus?: unknown;
  escrowStatus?: unknown;
  earnestMoneyStatus?: unknown;
  earnestMoneyReceived?: unknown;
  assignmentFee?: unknown;
  targetAssignmentFee?: unknown;
  closingDate?: unknown;
  closingTimeline?: unknown;
  closingStatus?: unknown;
};

const SAFETY_NOTE =
  "Closing guidance only. No documents generated, no title company contacted, and no SMS/email sent.";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function hasValue(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) && value > 0;
  if (typeof value === "string") return value.trim().length > 0;

  return false;
}

function parseMoney(value?: string | number | null) {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  if (!value) return null;

  const parsed = Number(String(value).replace(/[$,\s]/g, ""));

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function getLeadName(lead: StoredLead) {
  const name = `${lead.firstName} ${lead.lastName}`.trim();

  return name || lead.ownerName || "Unknown lead";
}

function isPositiveStatus(value: unknown) {
  const normalized = normalizeText(value);

  return [
    "complete",
    "completed",
    "signed",
    "approved",
    "ready",
    "opened",
    "open",
    "received",
    "verified",
    "assigned",
    "selected",
    "clear",
    "cleared",
  ].some((status) => normalized.includes(status));
}

function isBlockingStatus(value: unknown) {
  const normalized = normalizeText(value);

  return ["blocked", "issue", "problem", "rejected", "failed", "cancelled", "canceled", "hold"].some((status) =>
    normalized.includes(status),
  );
}

function checklistItem(
  key: string,
  label: string,
  status: ClosingChecklistStatus,
  reason: string,
): ClosingChecklistItem {
  return {
    key,
    label,
    status,
    reason,
  };
}

function getContractChecklist(lead: ClosingPayloadFields): ClosingChecklistItem[] {
  const hasSellerAgreement =
    lead.status === "under_contract" ||
    lead.status === "closed" ||
    isPositiveStatus(lead.sellerAgreementStatus) ||
    isPositiveStatus(lead.sellerContractStatus) ||
    isPositiveStatus(lead.contractStatus);
  const assignmentVisible =
    lead.status === "closed" ||
    isPositiveStatus(lead.assignmentAgreementStatus) ||
    isPositiveStatus(lead.assignmentStatus) ||
    isPositiveStatus(lead.buyerAssignmentStatus);
  const documentBlocker =
    isBlockingStatus(lead.contractStatus) ||
    isBlockingStatus(lead.sellerAgreementStatus) ||
    isBlockingStatus(lead.assignmentAgreementStatus);

  return [
    checklistItem(
      "seller_agreement",
      "Seller agreement",
      hasSellerAgreement ? "complete" : lead.status === "negotiating" ? "review_needed" : "missing",
      hasSellerAgreement
        ? "Seller agreement or under-contract status is visible from existing lead data."
        : "Seller agreement is not verified in current lead data.",
    ),
    checklistItem(
      "assignment_agreement",
      "Assignment agreement",
      assignmentVisible ? "complete" : lead.status === "under_contract" ? "review_needed" : "missing",
      assignmentVisible
        ? "Buyer assignment or closed status is visible from existing lead data."
        : "Assignment agreement is not verified in current lead data.",
    ),
    checklistItem(
      "document_blocker",
      "Document blocker",
      documentBlocker ? "missing" : "review_needed",
      documentBlocker
        ? "Contract/document status includes a blocker term that needs human review."
        : "No document execution occurs here. Human review is still required before relying on contract status.",
    ),
  ];
}

function getTitleChecklist(lead: ClosingPayloadFields): ClosingChecklistItem[] {
  const titleOpened = isPositiveStatus(lead.titleOpened) || isPositiveStatus(lead.titleStatus) || isPositiveStatus(lead.titleCompanyStatus);
  const titleBlocked = isBlockingStatus(lead.titleStatus) || isBlockingStatus(lead.titleCompanyStatus) || isBlockingStatus(lead.titleBlockerStatus);
  const escrowVisible = isPositiveStatus(lead.escrowStatus);

  return [
    checklistItem(
      "title_opened",
      "Title opened",
      titleOpened ? "complete" : lead.status === "under_contract" || lead.status === "closed" ? "review_needed" : "missing",
      titleOpened
        ? "Title/opening status is visible from existing lead data."
        : "Title readiness unavailable - missing required data.",
    ),
    checklistItem(
      "title_status",
      "Title status",
      titleBlocked ? "missing" : titleOpened ? "complete" : "review_needed",
      titleBlocked
        ? "Title status appears blocked and needs manual review."
        : titleOpened
          ? "Title status appears available from existing lead data."
          : "Title status is unknown in current lead data.",
    ),
    checklistItem(
      "escrow_status",
      "Escrow / title company status",
      escrowVisible ? "complete" : lead.status === "under_contract" || lead.status === "closed" ? "review_needed" : "missing",
      escrowVisible
        ? "Escrow or title company status is visible from existing lead data."
        : "Escrow/title company status is not captured yet.",
    ),
  ];
}

function getEarnestMoneyChecklist(lead: ClosingPayloadFields): ClosingChecklistItem[] {
  const buyerAssigned =
    lead.status === "closed" ||
    isPositiveStatus(lead.buyerAssignmentStatus) ||
    isPositiveStatus(lead.assignmentStatus) ||
    hasValue(lead.selectedBuyerId) ||
    hasValue(lead.selectedBuyerName) ||
    hasValue(lead.buyerSelected);
  const earnestMoneyVisible = isPositiveStatus(lead.earnestMoneyStatus) || hasValue(lead.earnestMoneyReceived);
  const assignmentFeeVisible = hasValue(lead.assignmentFee) || hasValue(lead.targetAssignmentFee) || parseMoney(lead.analyzer?.desiredProfit) !== null;
  const closingDateVisible = hasValue(lead.closingDate) || hasValue(lead.closingTimeline);

  return [
    checklistItem(
      "buyer_assignment",
      "Buyer assignment",
      buyerAssigned ? "complete" : lead.status === "under_contract" ? "review_needed" : "missing",
      buyerAssigned
        ? "Buyer assignment visibility is present in existing lead data."
        : "Buyer assignment is not verified in current lead data.",
    ),
    checklistItem(
      "earnest_money",
      "Earnest money",
      earnestMoneyVisible ? "complete" : lead.status === "under_contract" || lead.status === "closed" ? "review_needed" : "missing",
      earnestMoneyVisible
        ? "Earnest money status is visible from existing lead data."
        : "Earnest money status is unknown.",
    ),
    checklistItem(
      "assignment_fee",
      "Assignment fee / revenue value",
      assignmentFeeVisible ? "complete" : "missing",
      assignmentFeeVisible
        ? "Assignment fee or desired profit assumption is available. Revenue estimates are not guarantees."
        : "Assignment fee or revenue value is missing.",
    ),
    checklistItem(
      "closing_date",
      "Closing date / timeline",
      closingDateVisible ? "complete" : lead.status === "under_contract" || lead.status === "closed" ? "review_needed" : "missing",
      closingDateVisible
        ? "Closing date or timeline is visible from existing lead data."
        : "Closing date or timeline is not captured yet.",
    ),
  ];
}

function getMissingFields(checklists: ClosingChecklistItem[][]) {
  return checklists
    .flat()
    .filter((item) => item.status === "missing")
    .map((item) => item.label);
}

function getReviewFields(checklists: ClosingChecklistItem[][]) {
  return checklists
    .flat()
    .filter((item) => item.status === "review_needed")
    .map((item) => item.label);
}

function getBlockers(lead: ClosingPayloadFields, missingFields: string[]) {
  return [
    lead.doNotContact ? "DNC protection active" : "",
    lead.approvalStatus === "rejected" ? "Lead rejected" : "",
    isBlockingStatus(lead.titleStatus) || isBlockingStatus(lead.titleBlockerStatus) ? "Title blocker needs manual review" : "",
    isBlockingStatus(lead.contractStatus) || isBlockingStatus(lead.assignmentAgreementStatus) ? "Contract/document blocker needs manual review" : "",
    lead.status === "under_contract" && missingFields.includes("Seller agreement") ? "Under contract but seller agreement visibility is missing" : "",
    lead.status === "under_contract" && missingFields.includes("Buyer assignment") ? "Under contract but buyer assignment is missing" : "",
  ].filter(Boolean);
}

function getBottlenecks(lead: ClosingPayloadFields, blockers: string[], missingFields: string[], reviewFields: string[]) {
  return [
    ...blockers,
    missingFields.includes("Seller agreement") ? "Missing seller agreement" : "",
    missingFields.includes("Assignment agreement") ? "Missing assignment agreement" : "",
    reviewFields.includes("Title opened") || reviewFields.includes("Title status") ? "Title unknown or not opened" : "",
    reviewFields.includes("Earnest money") ? "Earnest money unknown" : "",
    reviewFields.includes("Closing date / timeline") ? "Closing date missing" : "",
    lead.status === "under_contract" && missingFields.includes("Buyer assignment") ? "Under contract but no buyer assignment" : "",
    lead.status === "closed" && blockers.length > 0 ? "Closed status mismatch needs review" : "",
    missingFields.includes("Assignment fee / revenue value") ? "Revenue value missing" : "",
  ].filter(Boolean);
}

function getReadinessScore(lead: ClosingPayloadFields, checklists: ClosingChecklistItem[][], blockers: string[]) {
  const items = checklists.flat();
  const completeItems = items.filter((item) => item.status === "complete").length;
  const reviewItems = items.filter((item) => item.status === "review_needed").length;
  const checklistScore = items.length > 0 ? (completeItems / items.length) * 70 + (reviewItems / items.length) * 18 : 0;
  const statusScore = lead.status === "closed" ? 24 : lead.status === "under_contract" ? 18 : lead.status === "negotiating" ? 8 : 0;

  return Math.max(0, Math.min(100, Math.round(checklistScore + statusScore - blockers.length * 30)));
}

function getReadinessState(
  lead: ClosingPayloadFields,
  score: number,
  blockers: string[],
  missingFields: string[],
  reviewFields: string[],
): ClosingReadinessState {
  if (lead.doNotContact || lead.approvalStatus === "rejected" || blockers.some((blocker) => blocker.includes("blocker"))) {
    return "closing_blocked";
  }

  if (lead.status !== "under_contract" && lead.status !== "closed") {
    return "not_applicable";
  }

  if (lead.status === "closed" && blockers.length === 0) {
    return "closing_ready";
  }

  if (missingFields.includes("Seller agreement") || missingFields.includes("Buyer assignment")) {
    return "closing_blocked";
  }

  if (score >= 82 && missingFields.length === 0 && reviewFields.length <= 1) {
    return "closing_ready";
  }

  if (score >= 58) {
    return "almost_closing_ready";
  }

  return "not_closing_ready";
}

function getRevenueRisk(state: ClosingReadinessState, blockers: string[], missingFields: string[], reviewFields: string[]): RevenueRealizationRisk {
  if (state === "closing_blocked" || blockers.length > 0) return "blocked";
  if (state === "not_applicable") return "unknown";
  if (missingFields.length >= 3) return "high";
  if (missingFields.length > 0 || reviewFields.length >= 3) return "medium";
  if (state === "closing_ready") return "low";

  return "high";
}

function getNextAction(
  lead: ClosingPayloadFields,
  state: ClosingReadinessState,
  blockers: string[],
  missingFields: string[],
  reviewFields: string[],
): ClosingSideNextAction {
  if (blockers.length > 0) {
    return {
      label: "Resolve closing blocker",
      urgency: "blocked",
      reason: "Closing workflow should not advance until the hard blocker is reviewed by a human operator.",
      blocker: blockers[0],
      safetyNote: SAFETY_NOTE,
    };
  }

  if (state === "not_applicable") {
    return {
      label: lead.status === "negotiating" ? "Wait for contract progress" : "No closing action yet",
      urgency: lead.status === "negotiating" ? "medium" : "low",
      reason: "Closing workflow becomes actionable after contract or under-contract visibility exists.",
      blocker: "Deal is not under contract.",
      safetyNote: SAFETY_NOTE,
    };
  }

  if (missingFields.includes("Seller agreement")) {
    return {
      label: "Verify seller agreement",
      urgency: "critical",
      reason: "Closing readiness depends on confirmed seller agreement visibility.",
      blocker: "Missing seller agreement",
      safetyNote: SAFETY_NOTE,
    };
  }

  if (missingFields.includes("Buyer assignment")) {
    return {
      label: "Confirm buyer assignment",
      urgency: "critical",
      reason: "Under-contract revenue cannot move toward assignment without buyer assignment visibility.",
      blocker: "Missing buyer assignment",
      safetyNote: SAFETY_NOTE,
    };
  }

  if (reviewFields.includes("Title opened") || reviewFields.includes("Title status")) {
    return {
      label: "Request title status manually",
      urgency: "high",
      reason: "Title readiness is unknown and should be verified before relying on closing timing.",
      blocker: "Title readiness unavailable - missing required data.",
      safetyNote: SAFETY_NOTE,
    };
  }

  if (reviewFields.includes("Earnest money")) {
    return {
      label: "Verify earnest money",
      urgency: "high",
      reason: "Earnest money status is unknown and may affect buyer commitment and closing confidence.",
      blocker: "Earnest money unknown",
      safetyNote: SAFETY_NOTE,
    };
  }

  if (reviewFields.includes("Closing date / timeline")) {
    return {
      label: "Confirm closing date",
      urgency: "medium",
      reason: "Closing date or timeline is missing from current deal data.",
      blocker: "Closing date missing",
      safetyNote: SAFETY_NOTE,
    };
  }

  if (state === "closing_ready") {
    return {
      label: "Prepare closing checklist",
      urgency: "high",
      reason: "Available data suggests the deal is closest to payment, but this remains operator guidance only.",
      safetyNote: SAFETY_NOTE,
    };
  }

  return {
    label: "Review closing checklist",
    urgency: "medium",
    reason: "Closing data is incomplete or needs human review before revenue realization can be trusted.",
    safetyNote: SAFETY_NOTE,
  };
}

export function analyzeClosingReadiness(lead: StoredLead): ClosingReadiness {
  const closingLead = lead as ClosingPayloadFields;
  const contractChecklist = getContractChecklist(closingLead);
  const titleChecklist = getTitleChecklist(closingLead);
  const earnestMoneyChecklist = getEarnestMoneyChecklist(closingLead);
  const checklists = [contractChecklist, titleChecklist, earnestMoneyChecklist];
  const missingFields = getMissingFields(checklists);
  const reviewFields = getReviewFields(checklists);
  const blockers = getBlockers(closingLead, missingFields);
  const bottlenecks = getBottlenecks(closingLead, blockers, missingFields, reviewFields);
  const readinessScore = getReadinessScore(closingLead, checklists, blockers);
  const readinessState = getReadinessState(closingLead, readinessScore, blockers, missingFields, reviewFields);
  const revenueRealizationRisk = getRevenueRisk(readinessState, blockers, missingFields, reviewFields);
  const nextClosingAction = getNextAction(closingLead, readinessState, blockers, missingFields, reviewFields);

  return {
    readinessState,
    readinessScore,
    reason: `${getLeadName(lead)} is ${readinessState.replaceAll("_", " ")} with ${bottlenecks.length} closing bottleneck(s). Revenue estimates are not guarantees.`,
    blockers,
    missingFields,
    bottlenecks,
    contractChecklist,
    titleChecklist,
    earnestMoneyChecklist,
    nextClosingAction,
    revenueRealizationRisk,
    safetyNotes: [
      "Read-only.",
      "No documents generated.",
      "No title company contacted.",
      "No SMS/email sent.",
      "Closing guidance only.",
    ],
  };
}
