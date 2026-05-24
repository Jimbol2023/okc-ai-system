import type { StoredLead } from "./leads-storage";
import { createZ10RevenueDecisionSupportList, createZ10RevenueDecisionSupportSummary } from "./z10-revenue-decision-support-summary";
import type { Z10RevenueDecisionSupportInput, Z10DecisionSignalLevel } from "./z10-decision-support-signal-review";
import type { Z10RevenueDecisionLane } from "./z10-manual-revenue-decision-policy";

export type RealManualLeadDecision = {
  leadId: string;
  leadLabel: string;
  sourceVisible: string;
  missingData: string[];
  decisionLane: Z10RevenueDecisionLane;
  decisionSignalLevel: Z10DecisionSignalLevel;
  summaryState: ReturnType<typeof createZ10RevenueDecisionSupportSummary>["summaryState"];
  safeManualNextReview: string;
  operatorDecisionLabel: string;
  advisoryDecisionScore: number;
  flags: ReturnType<typeof createZ10RevenueDecisionSupportSummary>["flags"];
  advisoryOnly: true;
};

function parseCurrencyLike(value: string | number | null | undefined) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (!value) return 0;
  const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getRealManualLeadMissingData(lead: StoredLead) {
  return [
    !lead.source ? "source" : "",
    !lead.phone && !lead.email ? "contact" : "",
    !lead.propertyAddress ? "property address" : "",
    !lead.city ? "city" : "",
    !lead.zipCode ? "ZIP" : "",
  ].filter(Boolean);
}

function getLeadLabel(lead: StoredLead) {
  const sellerName = `${lead.firstName ?? ""} ${lead.lastName ?? ""}`.trim();
  return sellerName || lead.propertyAddress || lead.id;
}

function isTerminalLead(lead: StoredLead) {
  return lead.status === "closed";
}

function isBlockedLead(lead: StoredLead) {
  return Boolean(lead.doNotContact) || lead.approvalStatus === "rejected";
}

function hasPendingFollowUp(lead: StoredLead) {
  return Array.isArray(lead.followUps) && lead.followUps.some((followUp) => followUp.status === "pending");
}

function getAdvisoryScore(lead: StoredLead, missingData: string[]) {
  if (isBlockedLead(lead)) return 100;
  if (isTerminalLead(lead)) return 5;
  if (missingData.length > 0) return 88;
  if (lead.score >= 70 || lead.priority === "High" || lead.isHot) return 80;
  if (lead.priority === "Medium" || hasPendingFollowUp(lead)) return 58;
  return Math.max(10, Math.min(45, lead.score));
}

export function createZ10DecisionInputFromStoredLead(lead: StoredLead): Z10RevenueDecisionSupportInput {
  const missingData = getRealManualLeadMissingData(lead);
  const estimatedRevenue = parseCurrencyLike(lead.analyzer?.desiredProfit);
  const riskFactors: string[] = [];
  const usabilityNotes: string[] = [];

  if (lead.approvalStatus === "needs_human_review" || lead.requiresHumanApproval) riskFactors.push("human review required");
  if (lead.status === "under_contract") riskFactors.push("near-close review");
  if (lead.status === "negotiating") riskFactors.push("conversion quality review");
  if (hasPendingFollowUp(lead)) riskFactors.push("pending follow-up review");
  if (missingData.length > 0) usabilityNotes.push("missing lead data blocks fast operator review");

  return {
    id: lead.id,
    label: getLeadLabel(lead),
    status: lead.status,
    source: lead.source,
    priorityLane: lead.priority === "Low" && lead.score < 40 ? "low_priority" : lead.priority === "High" || lead.isHot ? "work_first" : undefined,
    workdayLane: hasPendingFollowUp(lead) ? "work_today" : undefined,
    riskLane: isBlockedLead(lead)
      ? "contact_risk_stop"
      : isTerminalLead(lead)
        ? "terminal_no_risk_review"
        : riskFactors.length > 0
          ? "conversion_quality_risk"
          : undefined,
    advisoryScore: getAdvisoryScore(lead, missingData),
    blockers: isBlockedLead(lead) ? ["DNC/blocked/contact stop"] : [],
    missingData,
    riskFactors,
    estimatedRevenue,
    confidenceScore: missingData.length > 0 ? 45 : 80,
    dataQualityScore: missingData.length > 0 ? 45 : 80,
    terminal: isTerminalLead(lead),
    doNotContact: Boolean(lead.doNotContact),
    blocked: lead.approvalStatus === "rejected",
    usabilityNotes,
  };
}

export function createRealManualLeadDecision(lead: StoredLead): RealManualLeadDecision {
  const input = createZ10DecisionInputFromStoredLead(lead);
  const summary = createZ10RevenueDecisionSupportSummary(input);

  return {
    leadId: lead.id,
    leadLabel: input.label ?? lead.id,
    sourceVisible: lead.source || "missing source",
    missingData: input.missingData ?? [],
    decisionLane: summary.decision.decisionLane,
    decisionSignalLevel: summary.signals.decisionSignalLevel,
    summaryState: summary.summaryState,
    safeManualNextReview: summary.safeNextManualReview,
    operatorDecisionLabel: summary.decision.decisionLane.replaceAll("_", " "),
    advisoryDecisionScore: summary.decision.advisoryDecisionScore,
    flags: summary.flags,
    advisoryOnly: true,
  };
}

export function createRealManualLeadOperationsDecisionList(leads: StoredLead[]) {
  const inputs = leads.map(createZ10DecisionInputFromStoredLead);
  const decisionList = createZ10RevenueDecisionSupportList(inputs);
  const decisions = leads.map(createRealManualLeadDecision);

  return {
    phase: "RLO-B" as const,
    advisoryOnly: true,
    flags: decisionList.flags,
    ranked: decisionList.ranked,
    decisions,
    countsBySummaryState: decisionList.countsBySummaryState,
  };
}

export function createRealManualLeadOperationsUsabilityPassSummary(leads: StoredLead[]) {
  const list = createRealManualLeadOperationsDecisionList(leads);

  return {
    phase: "RLO-F" as const,
    advisoryOnly: true,
    realLeadOperationsUsabilityReady: true,
    z10ConsolidationReady: true,
    unresolvedUiUsabilityBlockers: [
      "existing dashboard lead page still contains live mutation controls",
      "follow-up workspace usability not yet consolidated",
      "manual review labels are advisory and not persisted",
    ],
    untouchedExecutionBoundaries: [
      "no provider/runtime/schema/storage/audit/communication authorization",
      "no CRM mutation authorization from this adapter",
      "no task/queue/routing/assignment/calendar/reminder creation",
      "no outreach/contact",
      "no recovery/revenue/decision execution",
    ],
    recommendedNextExactStep: "Manual Follow-Up Workspace Usability",
    flags: list.flags,
  };
}
