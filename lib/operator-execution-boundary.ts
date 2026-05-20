import { analyzeClosingReadiness, type ClosingReadiness } from "@/lib/closing-readiness";
import { analyzeDispositionReadiness, type DispositionReadiness } from "@/lib/disposition-readiness";
import type { StoredLead } from "@/lib/leads-storage";
import { analyzeRevenuePipelineLead, type RevenuePipelineLead } from "@/lib/revenue-pipeline";

export type ManualPrepStage = "seller_call_prep" | "buyer_disposition_prep" | "closing_prep" | "blocked_review";

export type ManualPrepReadiness = "ready_for_manual_prep" | "needs_review" | "blocked";

export type ManualPrepPacket = {
  stage: ManualPrepStage;
  title: string;
  readiness: ManualPrepReadiness;
  reason: string;
  recommendedManualStep: string;
  checklist: string[];
  blockers: string[];
  missingInformation: string[];
  safetyNotes: string[];
};

export type OperatorExecutionBoundaryLead = {
  lead: StoredLead;
  revenue: RevenuePipelineLead;
  disposition: DispositionReadiness;
  closing: ClosingReadiness;
  pilotEligible: boolean;
  pilotReason: string;
  leadSummary: string;
  scoreRationale: string;
  approvalState: string;
  dncState: string;
  propertyFacts: string[];
  motivationSignals: string[];
  riskFlags: string[];
  manualSellerCallPrep: ManualPrepPacket;
  manualBuyerDispositionPrep: ManualPrepPacket;
  manualClosingPrep: ManualPrepPacket;
};

export type OperatorExecutionBoundarySummary = {
  status: "prep_only";
  firstWorkflowPilot: string;
  pilotFlow: string[];
  operatorMayDo: string[];
  aiMayRecommend: string[];
  aiMustNeverExecute: string[];
  humanApprovalRequiredFor: string[];
  mockDryRunOnly: string[];
  safetyLabels: string[];
  leads: OperatorExecutionBoundaryLead[];
  pilotCandidates: OperatorExecutionBoundaryLead[];
  blockedManualPrep: OperatorExecutionBoundaryLead[];
};

function getLeadName(lead: StoredLead) {
  const name = `${lead.firstName} ${lead.lastName}`.trim();

  return name || lead.ownerName || "Unknown lead";
}

function hasValidPhone(lead: StoredLead) {
  return lead.phone.replace(/\D/g, "").length >= 10;
}

function isHighPriority(lead: StoredLead) {
  return lead.score >= 70 || lead.priority === "High" || Boolean(lead.isHot);
}

function isApproved(lead: StoredLead) {
  return lead.approvalStatus === "approved_for_outreach";
}

function getMissingCoreInfo(lead: StoredLead) {
  return [
    !lead.phone ? "Missing phone" : "",
    lead.phone && !hasValidPhone(lead) ? "Invalid phone" : "",
    !lead.propertyAddress ? "Missing property address" : "",
    !lead.city ? "Missing city" : "",
    !lead.zipCode ? "Missing ZIP" : "",
    !lead.source ? "Missing lead source" : "",
  ].filter(Boolean);
}

function getPropertyFacts(lead: StoredLead) {
  return [
    lead.propertyAddress ? `Address: ${lead.propertyAddress}` : "Address: missing",
    lead.city || lead.state || lead.zipCode ? `Market: ${[lead.city, lead.state, lead.zipCode].filter(Boolean).join(", ")}` : "Market: missing",
    lead.county ? `County: ${lead.county}` : "County: missing",
    lead.parcelId ? `Parcel: ${lead.parcelId}` : "Parcel: missing",
    lead.analyzer?.arv ? `ARV assumption: ${lead.analyzer.arv}` : "ARV assumption: missing",
    lead.analyzer?.estimatedRepairs ? `Repair assumption: ${lead.analyzer.estimatedRepairs}` : "Repair assumption: missing",
  ];
}

function getMotivationSignals(lead: StoredLead) {
  return [
    lead.isHot ? "Marked hot" : "",
    lead.priority === "High" ? "High priority" : "",
    lead.score >= 70 ? `High score: ${lead.score}` : "",
    lead.situationDetails ? "Seller situation details captured" : "",
    lead.scoreBreakdown || "",
  ].filter(Boolean);
}

function getRiskFlags(lead: StoredLead, revenue: RevenuePipelineLead, disposition: DispositionReadiness, closing: ClosingReadiness) {
  return [
    lead.doNotContact ? "DNC protection active" : "",
    lead.approvalStatus === "rejected" ? "Lead rejected" : "",
    !isApproved(lead) ? "Approval is not complete" : "",
    ...revenue.blockers.slice(0, 3),
    ...disposition.blockers.slice(0, 2),
    ...closing.blockers.slice(0, 2),
  ].filter(Boolean);
}

function getSellerCallPrep(lead: StoredLead, revenue: RevenuePipelineLead, riskFlags: string[], missingCoreInfo: string[]): ManualPrepPacket {
  const hardBlocked = Boolean(lead.doNotContact) || lead.approvalStatus === "rejected";
  const pilotEligible = isApproved(lead) && !lead.doNotContact && isHighPriority(lead);

  if (hardBlocked) {
    return {
      stage: "blocked_review",
      title: "Manual seller call prep blocked",
      readiness: "blocked",
      reason: "Hard safety state blocks seller contact preparation.",
      recommendedManualStep: "Do not contact. Review blocker state with a human operator.",
      checklist: ["Review DNC/rejected state", "Confirm no outreach is performed", "Keep lead in blocked review"],
      blockers: riskFlags,
      missingInformation: missingCoreInfo,
      safetyNotes: ["No outreach sent.", "DNC remains enforced.", "Approval is not execution."],
    };
  }

  return {
    stage: "seller_call_prep",
    title: "Manual seller call prep",
    readiness: pilotEligible ? "ready_for_manual_prep" : "needs_review",
    reason: pilotEligible
      ? "Lead matches the approved R17 pilot: approved, non-DNC, and high priority."
      : "Lead can be reviewed manually, but it does not fully match the first pilot boundary yet.",
    recommendedManualStep: pilotEligible
      ? "Prepare for a human-performed seller call outside the system."
      : revenue.nextMoneyAction.label,
    checklist: [
      "Confirm approval status before any manual outreach.",
      "Confirm DNC is inactive.",
      "Review score rationale and seller situation details.",
      "Prepare valuation and motivation questions.",
      "Record any real-world outcome outside R17; no note persistence is added here.",
    ],
    blockers: riskFlags,
    missingInformation: missingCoreInfo,
    safetyNotes: [
      "No outreach sent.",
      "Operator must manually perform any real-world outreach outside the system.",
      "Approval is not execution.",
      "DNC remains enforced.",
    ],
  };
}

function getBuyerDispositionPrep(disposition: DispositionReadiness): ManualPrepPacket {
  const blocked = disposition.buyerReadiness === "blocked" || disposition.assignmentReadiness === "blocked";

  return {
    stage: blocked ? "blocked_review" : "buyer_disposition_prep",
    title: "Manual buyer / disposition prep",
    readiness: blocked ? "blocked" : disposition.buyerReadiness === "buyer_ready" ? "ready_for_manual_prep" : "needs_review",
    reason: disposition.reason,
    recommendedManualStep: disposition.buyerSideNextAction.label,
    checklist: disposition.checklist.slice(0, 6).map((item) => `${item.label}: ${item.status.replaceAll("_", " ")}`),
    blockers: disposition.blockers,
    missingInformation: disposition.missingFields,
    safetyNotes: [
      "No buyer contact execution.",
      "No SMS/email sent.",
      "No assignment execution.",
      "Internal disposition review only.",
    ],
  };
}

function getClosingPrep(closing: ClosingReadiness): ManualPrepPacket {
  const blocked = closing.readinessState === "closing_blocked";

  return {
    stage: blocked ? "blocked_review" : "closing_prep",
    title: "Manual closing prep",
    readiness: blocked ? "blocked" : closing.readinessState === "closing_ready" ? "ready_for_manual_prep" : "needs_review",
    reason: closing.reason,
    recommendedManualStep: closing.nextClosingAction.label,
    checklist: [
      ...closing.contractChecklist.slice(0, 3).map((item) => `${item.label}: ${item.status.replaceAll("_", " ")}`),
      ...closing.titleChecklist.slice(0, 3).map((item) => `${item.label}: ${item.status.replaceAll("_", " ")}`),
      ...closing.earnestMoneyChecklist.slice(0, 3).map((item) => `${item.label}: ${item.status.replaceAll("_", " ")}`),
    ],
    blockers: closing.blockers,
    missingInformation: closing.missingFields,
    safetyNotes: [
      "No title-company execution.",
      "No documents generated.",
      "No SMS/email sent.",
      "Closing guidance only.",
    ],
  };
}

export function analyzeOperatorExecutionBoundaryLead(lead: StoredLead): OperatorExecutionBoundaryLead {
  const revenue = analyzeRevenuePipelineLead(lead);
  const disposition = analyzeDispositionReadiness(lead);
  const closing = analyzeClosingReadiness(lead);
  const missingCoreInfo = getMissingCoreInfo(lead);
  const riskFlags = getRiskFlags(lead, revenue, disposition, closing);
  const pilotEligible = isApproved(lead) && !lead.doNotContact && isHighPriority(lead);

  return {
    lead,
    revenue,
    disposition,
    closing,
    pilotEligible,
    pilotReason: pilotEligible
      ? "Approved, non-DNC, high-priority lead is eligible for seller call preparation."
      : "Lead does not fully match the R17 seller call prep pilot boundary.",
    leadSummary: `${getLeadName(lead)} is a ${lead.priority} priority lead with score ${lead.score}.`,
    scoreRationale: lead.scoreBreakdown || "No deterministic score explanation captured.",
    approvalState: lead.approvalStatus || "unknown",
    dncState: lead.doNotContact ? "DNC active" : "DNC inactive",
    propertyFacts: getPropertyFacts(lead),
    motivationSignals: getMotivationSignals(lead),
    riskFlags,
    manualSellerCallPrep: getSellerCallPrep(lead, revenue, riskFlags, missingCoreInfo),
    manualBuyerDispositionPrep: getBuyerDispositionPrep(disposition),
    manualClosingPrep: getClosingPrep(closing),
  };
}

export function getOperatorExecutionBoundarySummary(leads: StoredLead[]): OperatorExecutionBoundarySummary {
  const analyzedLeads = leads
    .map(analyzeOperatorExecutionBoundaryLead)
    .sort((a, b) => b.revenue.monetizationRank - a.revenue.monetizationRank || b.lead.score - a.lead.score);

  return {
    status: "prep_only",
    firstWorkflowPilot: "Seller call preparation for approved, non-DNC, high-priority leads.",
    pilotFlow: [
      "Approved + non-DNC + high-priority lead",
      "Seller call preparation",
      "Operator manual review",
      "Operator manual action outside system",
      "No system execution",
    ],
    operatorMayDo: [
      "Review lead facts and score rationale.",
      "Prepare seller call questions.",
      "Review buyer/disposition package gaps.",
      "Review assignment and closing checklists.",
      "Perform any real-world action manually outside the system.",
    ],
    aiMayRecommend: [
      "Summarize.",
      "Explain.",
      "Recommend.",
      "Prioritize.",
      "Prepare checklists.",
    ],
    aiMustNeverExecute: [
      "Contact sellers.",
      "Contact buyers.",
      "Contact title companies.",
      "Send SMS/email.",
      "Generate contracts.",
      "Approve execution.",
      "Override DNC.",
      "Bypass approval.",
      "Trigger automation.",
      "Call providers.",
    ],
    humanApprovalRequiredFor: [
      "Any real-world seller outreach.",
      "Any buyer/disposition action.",
      "Any title or closing coordination.",
      "Any contract or document workflow.",
      "Any future live-send consideration.",
    ],
    mockDryRunOnly: [
      "Outreach testing remains mock-only.",
      "Automation remains dry-run only.",
      "Live-send preflight remains fail-closed.",
      "Notes remain planning/context only unless explicitly approved later.",
    ],
    safetyLabels: [
      "Manual action prep only",
      "No outreach sent",
      "No automation executed",
      "No provider called",
      "No documents generated",
      "Approval is not execution",
      "DNC remains enforced",
    ],
    leads: analyzedLeads,
    pilotCandidates: analyzedLeads.filter((item) => item.pilotEligible).slice(0, 5),
    blockedManualPrep: analyzedLeads.filter((item) => item.manualSellerCallPrep.readiness === "blocked").slice(0, 5),
  };
}
