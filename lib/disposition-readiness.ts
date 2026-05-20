import { analyzeRevenuePipelineLead } from "@/lib/revenue-pipeline";
import type { StoredLead } from "@/lib/leads-storage";

export type BuyerReadinessState = "buyer_ready" | "almost_buyer_ready" | "not_buyer_ready" | "blocked";

export type AssignmentReadinessState =
  | "ready_to_assign_review"
  | "needs_buyer_match"
  | "needs_contract"
  | "needs_price_validation"
  | "needs_photos"
  | "needs_title_review"
  | "blocked";

export type DispositionChecklistStatus = "complete" | "missing" | "review_needed";

export type DispositionChecklistItem = {
  key: string;
  label: string;
  status: DispositionChecklistStatus;
  reason: string;
};

export type BuyerSideNextAction = {
  label: string;
  urgency: "critical" | "high" | "medium" | "low" | "blocked";
  reason: string;
  blocker?: string;
  safetyNote: string;
};

export type DispositionReadiness = {
  buyerReadiness: BuyerReadinessState;
  buyerReadinessScore: number;
  assignmentReadiness: AssignmentReadinessState;
  reason: string;
  blockers: string[];
  missingFields: string[];
  bottlenecks: string[];
  checklist: DispositionChecklistItem[];
  buyerSideNextAction: BuyerSideNextAction;
  safetyNotes: string[];
};

function parseMoney(value?: string | number | null) {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  if (!value) return null;

  const parsed = Number(String(value).replace(/[$,\s]/g, ""));

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function hasValidPhone(lead: StoredLead) {
  return lead.phone.replace(/\D/g, "").length >= 10;
}

function getLeadName(lead: StoredLead) {
  const name = `${lead.firstName} ${lead.lastName}`.trim();

  return name || lead.ownerName || "Unknown lead";
}

function checklistItem(key: string, label: string, complete: boolean, reason: string, reviewNeeded = false): DispositionChecklistItem {
  return {
    key,
    label,
    status: complete ? "complete" : reviewNeeded ? "review_needed" : "missing",
    reason,
  };
}

function getChecklist(lead: StoredLead): DispositionChecklistItem[] {
  const arv = parseMoney(lead.analyzer?.arv);
  const repairs = parseMoney(lead.analyzer?.estimatedRepairs);
  const desiredProfit = parseMoney(lead.analyzer?.desiredProfit);

  return [
    checklistItem("address", "Property address", Boolean(lead.propertyAddress), "Property address is required for buyer package review."),
    checklistItem("arv", "ARV", Boolean(arv), "ARV is needed before buyer price fit can be trusted."),
    checklistItem("repairs", "Repair estimate", Boolean(repairs), "Repair estimate is needed for buyer underwriting and assignment spread review."),
    checklistItem("spread", "Estimated spread / assignment assumption", Boolean(desiredProfit), "Desired profit or spread assumption is needed for revenue review."),
    checklistItem("approval", "Seller approval state", lead.approvalStatus === "approved_for_outreach" || lead.status === "under_contract", "Seller-side approval or contract progress should be clear before buyer-facing work.", lead.approvalStatus === "pending_review" || lead.approvalStatus === "needs_human_review"),
    checklistItem("contract", "Seller agreement / contract visibility", lead.status === "under_contract" || lead.status === "closed", "Signed agreement is not verified in current lead data.", lead.status === "negotiating"),
    checklistItem("title", "Title / closing visibility", lead.status === "under_contract" || lead.status === "closed", "Title and closing status are not captured in current lead data.", lead.status === "under_contract"),
    checklistItem("photos", "Photos", false, "Photo status is not captured yet. Gather photos before buyer package review."),
    checklistItem("access", "Access instructions", false, "Access instructions are not captured yet. Confirm access before buyer walkthrough planning."),
  ];
}

function getMissingFields(checklist: DispositionChecklistItem[]) {
  return checklist.filter((item) => item.status === "missing").map((item) => item.label);
}

function getBlockers(lead: StoredLead) {
  return [
    lead.doNotContact ? "DNC protection active" : "",
    lead.approvalStatus === "rejected" ? "Lead rejected" : "",
    !lead.phone ? "Missing seller phone" : "",
    lead.phone && !hasValidPhone(lead) ? "Invalid seller phone" : "",
  ].filter(Boolean);
}

function getBottlenecks(lead: StoredLead, checklist: DispositionChecklistItem[], blockers: string[]) {
  const missing = getMissingFields(checklist);

  return [
    ...blockers,
    missing.includes("ARV") ? "Missing ARV" : "",
    missing.includes("Repair estimate") ? "Missing repairs" : "",
    missing.includes("Estimated spread / assignment assumption") ? "Missing asking price/spread assumption" : "",
    missing.includes("Photos") ? "Missing photos" : "",
    missing.includes("Access instructions") ? "Missing access instructions" : "",
    lead.status === "under_contract" ? "Under contract but buyer readiness still needs review" : "",
    lead.status === "under_contract" ? "Title/closing data missing" : "",
    lead.status !== "under_contract" && lead.status !== "closed" ? "No signed agreement visibility" : "",
  ].filter(Boolean);
}

function getAssignmentReadiness(lead: StoredLead, blockers: string[], missingFields: string[]): AssignmentReadinessState {
  if (blockers.length > 0) return "blocked";
  if (lead.status !== "under_contract" && lead.status !== "closed") return "needs_contract";
  if (missingFields.includes("ARV") || missingFields.includes("Repair estimate") || missingFields.includes("Estimated spread / assignment assumption")) return "needs_price_validation";
  if (missingFields.includes("Photos")) return "needs_photos";
  if (missingFields.includes("Title / closing visibility")) return "needs_title_review";

  return "needs_buyer_match";
}

function scoreReadiness(lead: StoredLead, checklist: DispositionChecklistItem[], blockers: string[]) {
  const revenueLead = analyzeRevenuePipelineLead(lead);
  const completeItems = checklist.filter((item) => item.status === "complete").length;
  const reviewItems = checklist.filter((item) => item.status === "review_needed").length;
  const checklistScore = (completeItems / checklist.length) * 52 + (reviewItems / checklist.length) * 16;
  const leadScore = Math.min(24, lead.score * 0.24);
  const statusScore = lead.status === "under_contract" ? 20 : lead.status === "negotiating" ? 12 : lead.approvalStatus === "approved_for_outreach" ? 8 : 0;
  const revenueScore = revenueLead.isBuyerReady ? 14 : revenueLead.isNearContract ? 10 : 0;

  return Math.max(0, Math.min(100, Math.round(checklistScore + leadScore + statusScore + revenueScore - blockers.length * 35)));
}

function getBuyerReadiness(score: number, blockers: string[], missingFields: string[]): BuyerReadinessState {
  if (blockers.length > 0) return "blocked";
  if (score >= 76 && missingFields.length <= 2) return "buyer_ready";
  if (score >= 48) return "almost_buyer_ready";

  return "not_buyer_ready";
}

function getNextAction(
  lead: StoredLead,
  buyerReadiness: BuyerReadinessState,
  assignmentReadiness: AssignmentReadinessState,
  blockers: string[],
  missingFields: string[],
): BuyerSideNextAction {
  const safetyNote = "Internal disposition guidance only. No buyer outreach, SMS, email, contract, or assignment execution occurs.";

  if (blockers.length > 0) {
    return {
      label: "Resolve disposition blocker",
      urgency: "blocked",
      reason: "Buyer-side work is blocked until hard safety or data blockers are resolved.",
      blocker: blockers[0],
      safetyNote,
    };
  }

  if (missingFields.includes("ARV")) {
    return {
      label: "Verify ARV",
      urgency: "high",
      reason: "Buyer matching and assignment pricing need a verified ARV before the package is credible.",
      blocker: "Missing ARV",
      safetyNote,
    };
  }

  if (missingFields.includes("Repair estimate")) {
    return {
      label: "Verify repair estimate",
      urgency: "high",
      reason: "Repair estimate affects buyer fit, exit price, and assignment spread.",
      blocker: "Missing repair estimate",
      safetyNote,
    };
  }

  if (assignmentReadiness === "needs_contract") {
    return {
      label: "Wait for acquisition progress",
      urgency: lead.status === "negotiating" ? "high" : "medium",
      reason: "Buyer-facing disposition should wait until seller agreement or contract visibility improves.",
      blocker: "No signed agreement visibility",
      safetyNote,
    };
  }

  if (assignmentReadiness === "needs_photos") {
    return {
      label: "Collect photos",
      urgency: "medium",
      reason: "Buyer package is incomplete without property photos.",
      blocker: "Missing photos",
      safetyNote,
    };
  }

  if (assignmentReadiness === "needs_title_review") {
    return {
      label: "Check title/closing readiness",
      urgency: "high",
      reason: "Under-contract disposition needs title and closing visibility before assignment review.",
      blocker: "Title/closing data missing",
      safetyNote,
    };
  }

  if (buyerReadiness === "buyer_ready" || assignmentReadiness === "needs_buyer_match") {
    return {
      label: "Review buyer matches",
      urgency: "high",
      reason: "Core package data is ready enough for internal buyer-match review.",
      safetyNote,
    };
  }

  return {
    label: "Prepare disposition package",
    urgency: "medium",
    reason: "Gather missing package data before buyer matching or assignment review.",
    safetyNote,
  };
}

export function analyzeDispositionReadiness(lead: StoredLead): DispositionReadiness {
  const checklist = getChecklist(lead);
  const missingFields = getMissingFields(checklist);
  const blockers = getBlockers(lead);
  const bottlenecks = getBottlenecks(lead, checklist, blockers);
  const assignmentReadiness = getAssignmentReadiness(lead, blockers, missingFields);
  const buyerReadinessScore = scoreReadiness(lead, checklist, blockers);
  const buyerReadiness = getBuyerReadiness(buyerReadinessScore, blockers, missingFields);
  const buyerSideNextAction = getNextAction(lead, buyerReadiness, assignmentReadiness, blockers, missingFields);

  return {
    buyerReadiness,
    buyerReadinessScore,
    assignmentReadiness,
    reason: `${getLeadName(lead)} is ${buyerReadiness.replaceAll("_", " ")} with ${missingFields.length} missing disposition package item(s).`,
    blockers,
    missingFields,
    bottlenecks,
    checklist,
    buyerSideNextAction,
    safetyNotes: [
      "Read-only buyer/disposition guidance.",
      "No buyer outreach.",
      "No SMS/email sent.",
      "Assignment guidance only.",
    ],
  };
}
