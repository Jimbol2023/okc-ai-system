import type { FundingRecommendation } from "@/types/capital-funding";
import type { FundingSensitivityResult } from "@/types/capital-stack";
import type { DealExecutionClosingRecommendation, ClosingChecklistItem, ClosingPath, ClosingReadinessStatus } from "@/types/deal-execution-closing";
import type { DispositionRecommendation } from "@/types/disposition-buyer-matching";
import type { FundingApprovalReadiness } from "@/types/funding-approval";
import type { FollowUpRecommendation } from "@/types/follow-up-conversion";
import type { NegotiationRecommendation } from "@/types/negotiation-engine";
import type { OfferRecommendation } from "@/types/offer-engine";
import type { PortfolioDecision } from "@/types/portfolio";

type JsonRecord = Record<string, unknown>;

type DealExecutionClosingInput = {
  dispositionRecommendation?: DispositionRecommendation | null;
  followUpRecommendation?: FollowUpRecommendation | null;
  negotiationRecommendation?: NegotiationRecommendation | null;
  offerRecommendation?: OfferRecommendation | null;
  fundingApprovalReadiness?: FundingApprovalReadiness | null;
  capitalStackComparison?: FundingSensitivityResult | null;
  fundingRecommendation?: FundingRecommendation | null;
  portfolioDecision?: PortfolioDecision | null;
  deal?: unknown;
  lead?: unknown;
  sellerContractStatus?: string | null;
  buyerContractStatus?: string | null;
  assignmentStatus?: string | null;
  titleStatus?: string | null;
  escrowStatus?: string | null;
  earnestMoneyStatus?: string | null;
  buyerProofOfFundsStatus?: string | null;
  inspectionStatus?: string | null;
  occupancyStatus?: string | null;
  accessStatus?: string | null;
  closingDate?: string | Date | null;
  closingTimeline?: string | null;
  state?: string | null;
  market?: string | null;
  propertyAddress?: string | null;
  assetType?: string | null;
  selectedBuyer?: unknown;
  dispositionPath?: string | null;
};

const OKLAHOMA_COMPLIANCE_WARNING =
  "Review Oklahoma wholesaling, disclosure, licensing, assignment, double-close, seller-finance, subject-to, cancellation-right, escrow, contract, title, marketing, buyer-disclosure, and closing requirements with a qualified Oklahoma real estate attorney/title company before marketing, assigning, double-closing, signing, or closing any agreement.";

const ASSUMPTION_WARNING = "Some closing guidance uses assumptions and requires human verification.";

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonRecord) : {};
}

function getPath(source: unknown, paths: string[]) {
  for (const path of paths) {
    const value = path.split(".").reduce<unknown>((current, key) => asRecord(current)[key], source);

    if (value !== undefined && value !== null && value !== "") return value;
  }

  return null;
}

function getString(source: unknown, paths: string[], fallback = "") {
  const value = getPath(source, paths);

  if (value instanceof Date) return value.toISOString();

  return typeof value === "string" ? value.trim() : fallback;
}

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalized(value: string) {
  return value.trim().toLowerCase().replaceAll("-", "_").replaceAll(" ", "_");
}

function statusFrom(value: string): ClosingChecklistItem["status"] {
  const text = normalized(value);

  if (!text || text === "unknown" || text === "na" || text === "n/a") return "missing";
  if (text === "not_applicable") return "not_applicable";
  if (["missing", "not_started", "not_open", "not_selected", "not_verified", "unverified", "not_clear", "not_cleared", "none", "no"].some((term) => text.includes(term))) {
    return "missing";
  }
  if (["approved_with_conditions", "issue", "lien", "probate", "cloud", "pending", "review_required", "needs_review", "conditional", "condition", "unresolved", "hold", "blocked", "arrears", "exception"].some((term) => text.includes(term))) {
    return "needs_review";
  }
  if (["complete", "completed", "clear", "cleared", "verified", "approved", "open", "opened", "selected", "confirmed", "reviewed", "received", "funded"].some((term) => text.includes(term))) {
    return "complete";
  }

  return "needs_review";
}

function hasKnownValue(value: unknown) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (value instanceof Date) return true;

  return true;
}

function itemFromStatus(name: string, value: unknown, severity: ClosingChecklistItem["severity"], fallbackNote: string): ClosingChecklistItem {
  const stringValue = value instanceof Date ? value.toISOString() : typeof value === "string" ? value : "";
  const status = statusFrom(stringValue);

  return {
    name,
    status,
    severity,
    note: status === "complete" ? stringValue : fallbackNote,
  };
}

function itemFromPresence(name: string, value: unknown, severity: ClosingChecklistItem["severity"], missingNote: string): ClosingChecklistItem {
  return hasKnownValue(value)
    ? { name, status: "complete", severity, note: "Available for closing review." }
    : { name, status: "missing", severity, note: missingNote };
}

function getMetrics(input: DealExecutionClosingInput) {
  const dispositionPath = getString(input, ["dispositionPath", "deal.dispositionPath"], input.dispositionRecommendation?.dispositionPath ?? "");
  const stateMarket = `${getString(input, ["state", "deal.state", "lead.state"], "")} ${getString(input, ["market", "deal.market", "lead.market"], "")}`.toLowerCase();
  const titleStatus = getString(input, ["titleStatus", "deal.titleStatus", "lead.titleStatus"], "unknown");
  const escrowStatus = getString(input, ["escrowStatus", "deal.escrowStatus"], "unknown");
  const sellerContractStatus = getString(input, ["sellerContractStatus", "deal.sellerContractStatus"], "unknown");
  const buyerContractStatus = getString(input, ["buyerContractStatus", "deal.buyerContractStatus"], "unknown");
  const assignmentStatus = getString(input, ["assignmentStatus", "deal.assignmentStatus"], "unknown");
  const earnestMoneyStatus = getString(input, ["earnestMoneyStatus", "deal.earnestMoneyStatus"], "unknown");
  const buyerProofOfFundsStatus = getString(input, ["buyerProofOfFundsStatus", "deal.buyerProofOfFundsStatus"], "unknown");
  const inspectionStatus = getString(input, ["inspectionStatus", "deal.inspectionStatus"], "unknown");
  const occupancyStatus = getString(input, ["occupancyStatus", "deal.occupancyStatus", "lead.occupancy"], "unknown");
  const accessStatus = getString(input, ["accessStatus", "deal.accessStatus"], "unknown");
  const closingDate = getPath(input, ["closingDate", "deal.closingDate"]);
  const closingTimeline = getString(input, ["closingTimeline", "deal.closingTimeline"], "");
  const assetType = getString(input, ["assetType", "deal.assetType", "lead.propertyType"], "");
  const propertyAddress = getString(input, ["propertyAddress", "address", "deal.propertyAddress", "lead.propertyAddress"], "");
  const strategyText = `${dispositionPath} ${input.dispositionRecommendation?.dispositionPath ?? ""} ${input.offerRecommendation?.offerType ?? ""} ${input.fundingRecommendation?.primaryMethod ?? ""} ${input.capitalStackComparison?.bestMethod ?? ""} ${input.portfolioDecision?.action ?? ""}`.toLowerCase();

  return {
    dispositionPath,
    stateMarket,
    titleStatus,
    escrowStatus,
    sellerContractStatus,
    buyerContractStatus,
    assignmentStatus,
    earnestMoneyStatus,
    buyerProofOfFundsStatus,
    inspectionStatus,
    occupancyStatus,
    accessStatus,
    closingDate,
    closingTimeline,
    assetType,
    propertyAddress,
    strategyText,
  };
}

function hasTitleBlocker(titleStatus: string) {
  const text = titleStatus.toLowerCase();

  return ["issue", "lien", "probate", "cloud", "lawsuit", "litigation", "heir", "foreclosure", "unresolved", "blocked", "cannot_close", "not_clear"].some((term) => text.includes(term));
}

function hasCriticalTitleBlocker(titleStatus: string) {
  const text = titleStatus.toLowerCase();

  return ["cannot_close", "not_closable", "fatal", "blocked", "fraud", "lawsuit", "litigation"].some((term) => text.includes(term));
}

function needsOklahomaWarning(input: DealExecutionClosingInput) {
  const metrics = getMetrics(input);
  const text = `${metrics.stateMarket} ${metrics.strategyText}`.toLowerCase();

  return (
    metrics.stateMarket.trim() === "" ||
    text.includes("ok") ||
    text.includes("oklahoma") ||
    text.includes("wholesale") ||
    text.includes("assignment") ||
    text.includes("double") ||
    text.includes("seller_finance") ||
    text.includes("subject_to") ||
    text.includes("creative") ||
    text.includes("contract")
  );
}

function chooseClosingPath(input: DealExecutionClosingInput): ClosingPath {
  const metrics = getMetrics(input);
  const dispositionPath = metrics.dispositionPath || input.dispositionRecommendation?.dispositionPath || "";
  const fundingMethod = input.fundingRecommendation?.primaryMethod ?? input.capitalStackComparison?.bestMethod ?? "";
  const offerType = input.offerRecommendation?.offerType ?? "";

  if (dispositionPath === "do_not_dispose") return "do_not_close";
  if (input.fundingApprovalReadiness?.status === "rejected") return "do_not_close";
  if (fundingMethod === "subject_to" || offerType === "subject_to_offer") return "subject_to_close";
  if (fundingMethod === "seller_finance" || offerType === "seller_finance_offer" || input.portfolioDecision?.action === "creative_finance") return "seller_finance_close";
  if (dispositionPath === "assign_contract") return "assignment";
  if (dispositionPath === "double_close") return "double_close";
  if (dispositionPath === "hold_internal" || input.portfolioDecision?.action === "hold") return "hold_internal";
  if (dispositionPath === "sell_owned_asset" || input.portfolioDecision?.action === "flip") return "direct_purchase";

  return "pause_review";
}

function baseChecklist(input: DealExecutionClosingInput): ClosingChecklistItem[] {
  const metrics = getMetrics(input);

  return [
    itemFromPresence("Property address verified", metrics.propertyAddress, "medium", "Property address is missing."),
    itemFromStatus("Seller agreement reviewed", metrics.sellerContractStatus, "critical", "Seller agreement status must be verified by a qualified human reviewer."),
    itemFromStatus("Title status verified", metrics.titleStatus, "critical", "Title status is unknown or needs title-company review."),
    itemFromStatus("Title company / escrow selected", metrics.escrowStatus, "high", "Escrow or title company status is missing."),
    itemFromStatus("Earnest money / escrow verified", metrics.earnestMoneyStatus, "high", "Earnest money and escrow handling must be verified."),
    itemFromStatus("Occupancy verified", metrics.occupancyStatus, "medium", "Occupancy status is missing or needs review."),
    itemFromStatus("Access verified", metrics.accessStatus, "medium", "Property access status must be confirmed."),
    itemFromPresence("Closing date or timeline confirmed", metrics.closingDate ?? metrics.closingTimeline, "high", "Closing date or closing timeline is missing."),
  ];
}

function pathChecklist(input: DealExecutionClosingInput, path: ClosingPath): ClosingChecklistItem[] {
  const metrics = getMetrics(input);
  const selectedBuyer = getPath(input, ["selectedBuyer"]) ?? input.dispositionRecommendation?.recommendedBuyerMatches?.[0] ?? null;

  if (path === "assignment") {
    return [
      itemFromStatus("Assignment / disposition path attorney-title review", metrics.assignmentStatus, "critical", "Assignment path needs attorney/title review."),
      itemFromPresence("Buyer identified", selectedBuyer, "high", "Buyer has not been selected or verified."),
      itemFromStatus("Buyer proof of funds verified", metrics.buyerProofOfFundsStatus, "critical", "Buyer proof of funds is missing or unverified."),
      itemFromStatus("Buyer agreement status reviewed", metrics.buyerContractStatus, "critical", "Buyer agreement status must be reviewed before closing."),
      { name: "Disclosures reviewed", status: "needs_review", severity: "critical", note: "Disclosure package requires human legal/title review before any closing action." },
      itemFromPresence("Closing date confirmed", metrics.closingDate, "high", "Closing date is missing."),
    ];
  }

  if (path === "double_close") {
    return [
      itemFromStatus("A-to-B close reviewed", metrics.sellerContractStatus, "critical", "A-to-B close requires contract and title review."),
      itemFromStatus("B-to-C close reviewed", metrics.buyerContractStatus, "critical", "B-to-C close requires buyer-side review."),
      itemFromStatus("Transactional / buyer funding verified", metrics.buyerProofOfFundsStatus, "critical", "Transactional or buyer funding is missing or unverified."),
      itemFromStatus("Title company confirms double-close structure", metrics.escrowStatus, "critical", "Title company must confirm structure and timing."),
      itemFromPresence("Closing timing confirmed", metrics.closingDate ?? metrics.closingTimeline, "high", "Double-close timing is not confirmed."),
      { name: "Compliance / title review complete", status: "needs_review", severity: "critical", note: "Qualified attorney/title review is required before any double-close action." },
    ];
  }

  if (path === "direct_purchase" || path === "hold_internal") {
    return [
      itemFromStatus("Funding approved", input.fundingApprovalReadiness?.status ?? "unknown", "critical", "Funding approval is missing or not approved."),
      itemFromStatus("Title clear", metrics.titleStatus, "critical", "Title must be clear or reviewed before closing."),
      { name: "Insurance plan reviewed", status: "needs_review", severity: "medium", note: "Insurance plan must be reviewed before owned-asset closing." },
      itemFromStatus("Occupancy / access verified", `${metrics.occupancyStatus} ${metrics.accessStatus}`, "high", "Occupancy and access must be verified."),
      itemFromStatus("Closing cash verified", input.fundingRecommendation?.fundingFit ?? input.capitalStackComparison?.bestMethod ?? "unknown", "critical", "Closing cash and funding stack must be verified."),
    ];
  }

  if (path === "seller_finance_close" || path === "subject_to_close") {
    return [
      { name: "Attorney / title review complete", status: "needs_review", severity: "critical", note: "Creative-finance closing guidance requires qualified attorney/title review." },
      itemFromStatus("Loan balance / payoff / arrears verified", metrics.titleStatus, "critical", "Loan balance, payoff, arrears, and title position must be verified."),
      { name: "Payment / escrow / insurance plan verified", status: "needs_review", severity: "critical", note: "Payment, escrow, and insurance handling must be reviewed by qualified professionals." },
      { name: "Due-on-sale risk reviewed", status: "needs_review", severity: "critical", note: "Due-on-sale and loan-servicing risks must be reviewed before proceeding." },
      itemFromStatus("Seller disclosures reviewed", metrics.sellerContractStatus, "critical", "Seller disclosures must be reviewed before any closing action."),
    ];
  }

  return [
    { name: "Closing path confirmed", status: "missing", severity: "critical", note: "Closing path cannot be determined from current disposition, funding, and title inputs." },
  ];
}

function buildChecklist(input: DealExecutionClosingInput, path: ClosingPath): ClosingChecklistItem[] {
  if (path === "do_not_close") {
    return [
      { name: "Disposition allowed closing review", status: "missing", severity: "critical", note: "Disposition or approval status blocks closing." },
      ...baseChecklist(input),
    ];
  }

  return [...baseChecklist(input), ...pathChecklist(input, path)];
}

function readinessScore(checklist: ClosingChecklistItem[]) {
  const weightBySeverity: Record<NonNullable<ClosingChecklistItem["severity"]>, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };
  const totalWeight = checklist.reduce((total, item) => total + weightBySeverity[item.severity ?? "medium"], 0);
  const earnedWeight = checklist.reduce((total, item) => {
    const weight = weightBySeverity[item.severity ?? "medium"];

    if (item.status === "complete" || item.status === "not_applicable") return total + weight;
    if (item.status === "needs_review") return total + weight * 0.35;

    return total;
  }, 0);

  return totalWeight > 0 ? clampScore((earnedWeight / totalWeight) * 100) : 0;
}

function readinessStatus(input: DealExecutionClosingInput, path: ClosingPath, score: number, blockers: string[]): ClosingReadinessStatus {
  const metrics = getMetrics(input);

  if (path === "do_not_close" || input.fundingApprovalReadiness?.status === "rejected") return "do_not_close";
  if (hasCriticalTitleBlocker(metrics.titleStatus)) return "do_not_close";
  if (blockers.length > 0 || score < 45) return "not_ready";
  if (hasTitleBlocker(metrics.titleStatus) || score < 70) return "review_required";
  if (score < 88) return "almost_ready";

  return "ready_to_close";
}

function missingItems(checklist: ClosingChecklistItem[]) {
  return checklist.filter((item) => item.status === "missing").map((item) => item.name);
}

function blockerItems(checklist: ClosingChecklistItem[]) {
  return checklist
    .filter((item) => item.severity === "critical" && item.status !== "complete" && item.status !== "not_applicable")
    .map((item) => item.name);
}

function riskSections(input: DealExecutionClosingInput, path: ClosingPath, checklist: ClosingChecklistItem[]) {
  const metrics = getMetrics(input);
  const missing = missingItems(checklist);
  const blockers = blockerItems(checklist);

  return {
    missing,
    blockers,
    titleRisks: unique([
      ...(statusFrom(metrics.titleStatus) !== "complete" ? ["Title status is not verified clear."] : []),
      ...(hasTitleBlocker(metrics.titleStatus) ? [`Title status indicates a blocker or review item: ${metrics.titleStatus}.`] : []),
      ...(statusFrom(metrics.escrowStatus) !== "complete" ? ["Title company or escrow status is not confirmed."] : []),
      ...(input.dispositionRecommendation?.dispositionRisks ?? []).filter((risk) => risk.toLowerCase().includes("title")),
    ]),
    buyerRisks: unique([
      ...(path === "assignment" || path === "double_close" ? ["Buyer funding, entity details, and closing capacity must be verified before closing."] : []),
      ...(statusFrom(metrics.buyerProofOfFundsStatus) !== "complete" ? ["Buyer proof of funds is missing or unverified."] : []),
      ...(input.dispositionRecommendation?.recommendedBuyerMatches?.[0]?.risks ?? []),
    ]),
    sellerRisks: unique([
      ...(statusFrom(metrics.sellerContractStatus) !== "complete" ? ["Seller agreement status is not verified complete."] : []),
      ...(input.followUpRecommendation?.sellerState === "do_not_contact" ? ["Lead is marked Do Not Contact and must not receive seller-facing activity."] : []),
      ...(input.negotiationRecommendation?.negotiationRisks ?? []),
    ]),
    fundingRisks: unique([
      ...(input.fundingApprovalReadiness?.status === "rejected" ? ["Funding approval readiness is rejected."] : []),
      ...(input.fundingApprovalReadiness?.status === "review_required" ? ["Funding approval readiness requires review."] : []),
      ...(input.fundingRecommendation?.blockers ?? []),
      ...(input.fundingRecommendation?.risks ?? []),
      ...(input.capitalStackComparison?.sensitivityAlerts ?? []),
    ]),
    timelineRisks: unique([
      ...(!metrics.closingDate && !metrics.closingTimeline ? ["Closing date or closing timeline is missing."] : []),
      ...(path === "double_close" ? ["Double-close timing must coordinate both A-to-B and B-to-C settlement steps."] : []),
      ...(metrics.occupancyStatus.toLowerCase().includes("occupied") ? ["Occupancy may affect access, possession, and closing timing."] : []),
      ...(missing.length > 0 || blockers.length > 0 ? ["Open missing or blocker items may delay closing."] : []),
    ]),
  };
}

function requiredVerifications(input: DealExecutionClosingInput, path: ClosingPath) {
  return unique([
    "Verify legal/title review before any signing or closing action.",
    "Verify seller agreement status, seller authority, required disclosures, and cancellation or closing constraints.",
    "Verify title status, liens, taxes, payoff, escrow path, and title-company requirements.",
    "Verify buyer identity, buyer funding, proof of funds, and closing capacity before any buyer-facing step.",
    "Verify escrow, earnest money handling, inspection status, access, occupancy, and closing date.",
    ...(path === "assignment" ? ["Verify assignment path, buyer disclosure, title-company handling, and attorney/title review."] : []),
    ...(path === "double_close" ? ["Verify A-to-B and B-to-C closing structure, timing, funding, escrow flow, and title-company approval."] : []),
    ...(path === "seller_finance_close" || path === "subject_to_close" ? ["Verify loan balance, payoff, arrears, escrow/payment handling, insurance, due-on-sale risk, and seller disclosures with qualified counsel/title."] : []),
    ...(input.dispositionRecommendation?.requiredVerifications ?? []),
    ...(input.fundingApprovalReadiness?.requiredFixes ?? []),
  ]);
}

function closingSequence(path: ClosingPath) {
  return [
    "Confirm legal/title review.",
    "Verify contract and disclosure status.",
    "Confirm buyer and funding readiness.",
    "Open or confirm title and escrow.",
    "Resolve title issues.",
    "Confirm closing date and settlement timing.",
    path === "double_close" ? "Confirm A-to-B and B-to-C closing sequence with title company." : "Prepare closing package review.",
    "Close only after required human, funding, title, and compliance approvals.",
  ];
}

function complianceWarnings(input: DealExecutionClosingInput) {
  return unique([
    ...(needsOklahomaWarning(input) ? [OKLAHOMA_COMPLIANCE_WARNING, "Internal closing readiness guidance only. This is not legal advice, title advice, or a guarantee of compliance."] : []),
    ...(!input.dispositionRecommendation || !input.offerRecommendation || !input.fundingApprovalReadiness || !input.portfolioDecision ? [ASSUMPTION_WARNING] : []),
    ...(input.dispositionRecommendation?.complianceWarnings ?? []),
    ...(input.fundingApprovalReadiness?.complianceWarnings ?? []),
    ...(input.capitalStackComparison?.complianceWarnings ?? []),
    ...(input.fundingRecommendation?.complianceWarnings ?? []),
  ]);
}

function nextStep(status: ClosingReadinessStatus) {
  if (status === "do_not_close") return "Do not move toward closing. Preserve the record and require qualified human, title, and legal review before any future closing action.";
  if (status === "not_ready") return "Do not close yet. Resolve missing and blocker items before preparing any closing package review.";
  if (status === "review_required") return "Pause for legal/title and funding review. Continue only after required verifications are complete.";
  if (status === "almost_ready") return "Complete the remaining review items and prepare the closing package for human approval only.";

  return "Ready for human-approved closing preparation. Do not create, send, sign, or execute contracts from this system.";
}

export function generateDealExecutionClosingRecommendation(input: DealExecutionClosingInput): DealExecutionClosingRecommendation {
  const closingPath = chooseClosingPath(input);
  const checklist = buildChecklist(input, closingPath);
  const score = readinessScore(checklist);
  const blockers = blockerItems(checklist);
  const status = readinessStatus(input, closingPath, score, blockers);
  const risks = riskSections(input, closingPath, checklist);

  return {
    closingPath,
    readinessStatus: status,
    readinessScore: status === "do_not_close" ? Math.min(score, 20) : score,
    checklist,
    missingItems: risks.missing,
    blockerItems: risks.blockers,
    titleRisks: risks.titleRisks,
    buyerRisks: risks.buyerRisks,
    sellerRisks: risks.sellerRisks,
    fundingRisks: risks.fundingRisks,
    timelineRisks: risks.timelineRisks,
    requiredVerifications: requiredVerifications(input, closingPath),
    recommendedClosingSequence: closingSequence(closingPath),
    complianceWarnings: complianceWarnings(input),
    recommendedNextStep: nextStep(status),
  };
}
