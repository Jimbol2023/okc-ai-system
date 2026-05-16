import type { FundingRecommendation } from "@/types/capital-funding";
import type { FundingSensitivityResult } from "@/types/capital-stack";
import type { DealExecutionClosingRecommendation } from "@/types/deal-execution-closing";
import type { DispositionRecommendation } from "@/types/disposition-buyer-matching";
import type { FundingApprovalReadiness } from "@/types/funding-approval";
import type { FollowUpRecommendation } from "@/types/follow-up-conversion";
import type { GlobalDealScore } from "@/types/global-deal-score";
import type { NegotiationRecommendation } from "@/types/negotiation-engine";
import type { OfferRecommendation } from "@/types/offer-engine";
import type { PortfolioDecision } from "@/types/portfolio";

type JsonRecord = Record<string, unknown>;

type GlobalDealScoringInput = {
  decisionVisualization?: unknown;
  executionDecisionOutput?: unknown;
  executionDecisionSupport?: unknown;
  explainabilityOutput?: unknown;
  integrityOutput?: unknown;
  portfolioDecision?: PortfolioDecision | null;
  feasibilityResult?: unknown;
  fundingRecommendation?: FundingRecommendation | null;
  capitalStackComparison?: FundingSensitivityResult | null;
  fundingApprovalReadiness?: FundingApprovalReadiness | null;
  offerRecommendation?: OfferRecommendation | null;
  negotiationRecommendation?: NegotiationRecommendation | null;
  followUpRecommendation?: FollowUpRecommendation | null;
  dispositionRecommendation?: DispositionRecommendation | null;
  dealExecutionClosingRecommendation?: DealExecutionClosingRecommendation | null;
  deal?: unknown;
  lead?: unknown;
  doNotContact?: boolean | null;
  optOutReason?: string | null;
  state?: string | null;
  market?: string | null;
  assetType?: string | null;
  arv?: number | string | null;
  repairs?: number | string | null;
  expectedProfit?: number | string | null;
  riskScore?: number | string | null;
  uncertaintyScore?: number | string | null;
  reliabilityScore?: number | string | null;
  dataCompletenessScore?: number | string | null;
  buyerDemandScore?: number | string | null;
  sellerMotivation?: string | null;
  sellerTimeline?: string | null;
  titleStatus?: string | null;
  closingTimeline?: string | null;
  askingPrice?: number | string | null;
  walkAwayPrice?: number | string | null;
};

const OKLAHOMA_COMPLIANCE_WARNING =
  "Review Oklahoma wholesaling, disclosure, licensing, assignment, double-close, seller-finance, subject-to, cancellation-right, escrow, contract, title, marketing, buyer-disclosure, and closing requirements with a qualified Oklahoma real estate attorney/title company before marketing, assigning, double-closing, signing, or closing any agreement.";

const ASSUMPTION_WARNING = "Some score values use assumptions and require human verification.";

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

  return typeof value === "string" ? value.trim() : fallback;
}

function getBoolean(source: unknown, paths: string[], fallback = false) {
  const value = getPath(source, paths);

  return typeof value === "boolean" ? value : fallback;
}

function getNumber(source: unknown, paths: string[], fallback = 0) {
  const value = getPath(source, paths);
  const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;

  return Number.isFinite(parsed) ? parsed : fallback;
}

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean);
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function average(scores: number[]) {
  const usableScores = scores.filter((score) => Number.isFinite(score));

  return usableScores.length > 0 ? usableScores.reduce((total, score) => total + score, 0) / usableScores.length : 0;
}

function hasAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getDecisionOutput(input: GlobalDealScoringInput) {
  return input.decisionVisualization ?? input.executionDecisionOutput ?? input.executionDecisionSupport ?? {};
}

function getMetrics(input: GlobalDealScoringInput) {
  const decisionOutput = getDecisionOutput(input);
  const stateMarket = `${getString(input, ["state", "deal.state", "lead.state"], "")} ${getString(input, ["market", "deal.market", "lead.market"], "")}`.toLowerCase();
  const titleStatus = getString(input, ["titleStatus", "deal.titleStatus", "lead.titleStatus"], "unknown").toLowerCase();
  const riskScore = getNumber(input, ["riskScore", "deal.riskScore"], getNumber(decisionOutput, ["riskScore", "selectedOption.riskScore"], 50));
  const uncertaintyScore = getNumber(input, ["uncertaintyScore", "deal.uncertaintyScore"], getNumber(decisionOutput, ["uncertaintyScore", "reliability.confidenceSpread.spreadScore"], 50));
  const reliabilityScore = getNumber(input, ["reliabilityScore", "deal.reliabilityScore"], getNumber(decisionOutput, ["reliabilityScore", "reliability.dataTrustScore"], 50));
  const dataCompletenessScore = getNumber(input, ["dataCompletenessScore", "deal.dataCompletenessScore"], getNumber(decisionOutput, ["dataConfidence.completenessScore"], 55));
  const buyerDemandScore = getNumber(input, ["buyerDemandScore", "deal.buyerDemandScore"], 0);
  const expectedProfit = input.offerRecommendation?.expectedProfit ?? input.portfolioDecision?.estimatedReturn?.profit ?? getNumber(input, ["expectedProfit", "deal.expectedProfit"], 0);
  const askingPrice = getNumber(input, ["askingPrice", "deal.askingPrice"], 0);
  const walkAwayPrice = input.offerRecommendation?.walkAwayPrice ?? getNumber(input, ["walkAwayPrice", "deal.walkAwayPrice"], 0);
  const sellerMotivation = getString(input, ["sellerMotivation", "deal.sellerMotivation", "lead.sellerMotivation"], "").toLowerCase();
  const sellerTimeline = getString(input, ["sellerTimeline", "deal.sellerTimeline", "lead.sellerTimeline"], "").toLowerCase();
  const doNotContact = input.doNotContact === true || getBoolean(input, ["deal.doNotContact", "lead.doNotContact"], false);
  const optOutReason = getString(input, ["optOutReason", "deal.optOutReason", "lead.optOutReason"], "");

  return {
    stateMarket,
    titleStatus,
    riskScore,
    uncertaintyScore,
    reliabilityScore,
    dataCompletenessScore,
    buyerDemandScore,
    expectedProfit,
    askingPrice,
    walkAwayPrice,
    sellerMotivation,
    sellerTimeline,
    doNotContact,
    optOutReason,
  };
}

function scoreDecisionStrength(input: GlobalDealScoringInput) {
  const decisionOutput = getDecisionOutput(input);
  const decision = normalize(getString(decisionOutput, ["decision", "decisionLabel"], ""));
  const confidence = getNumber(decisionOutput, ["confidenceScore"], 55);
  const reliability = getNumber(decisionOutput, ["reliabilityScore"], getMetrics(input).reliabilityScore);
  const safeToProceed = getBoolean(decisionOutput, ["safeToProceed"], false);
  const shouldBlockExecution = getBoolean(decisionOutput, ["shouldBlockExecution"], false);
  const integrityLevel = normalize(getString(input, ["integrityOutput.integrityLevel", "explainabilityOutput.integrityLevel"], getString(decisionOutput, ["insightSummary.integrityLevel"], "")));
  let score = average([confidence, reliability]);

  if (decision.includes("go")) score += 15;
  if (decision.includes("wait") || decision.includes("fix") || decision.includes("switch")) score -= 15;
  if (decision.includes("kill") || decision.includes("no_go")) score -= 35;
  if (safeToProceed) score += 8;
  if (shouldBlockExecution) score -= 35;
  if (integrityLevel === "high") score += 8;
  if (integrityLevel === "low") score -= 20;

  return clampScore(score);
}

function scoreRiskControl(input: GlobalDealScoringInput) {
  const metrics = getMetrics(input);
  const criticalBlockers = [
    ...stringArray(getPath(getDecisionOutput(input), ["blockReasons"])),
    ...(input.portfolioDecision?.executionBlockers ?? []),
    ...(input.dealExecutionClosingRecommendation?.blockerItems ?? []),
  ];
  let score = average([100 - metrics.riskScore, 100 - metrics.uncertaintyScore, metrics.dataCompletenessScore]);

  if (metrics.titleStatus === "unknown") score -= 18;
  if (hasAny(metrics.titleStatus, ["issue", "lien", "probate", "cloud", "blocked", "lawsuit", "litigation"])) score -= 30;
  if (criticalBlockers.length > 0) score -= Math.min(45, criticalBlockers.length * 12);
  if ((input.fundingApprovalReadiness?.violatedGuardrails ?? []).some((guardrail) => guardrail.severity === "critical")) score -= 25;

  return clampScore(score);
}

function scoreFundingStrength(input: GlobalDealScoringInput) {
  const approvalStatus = input.fundingApprovalReadiness?.status;
  const fundingFit = input.fundingRecommendation?.fundingFit;
  const capitalFit = input.portfolioDecision?.capitalFit;
  const bestMethod = input.capitalStackComparison?.bestMethod ?? input.fundingRecommendation?.primaryMethod;
  let score = 45;

  if (approvalStatus === "approved") score += 35;
  if (approvalStatus === "approved_with_conditions") score += 22;
  if (approvalStatus === "review_required") score -= 8;
  if (approvalStatus === "rejected") score -= 45;
  if (fundingFit === "strong") score += 18;
  if (fundingFit === "moderate") score += 8;
  if (fundingFit === "weak") score -= 15;
  if (capitalFit === "good") score += 10;
  if (capitalFit === "tight") score -= 5;
  if (capitalFit === "insufficient") score -= 30;
  if (bestMethod === "cash" || bestMethod === "private_money") score += 8;
  if (bestMethod === "pass_or_wait") score -= 25;
  if ((input.fundingRecommendation?.blockers ?? []).length > 0) score -= 20;
  if ((input.capitalStackComparison?.sensitivityAlerts ?? []).length > 0) score -= 8;

  return clampScore(score);
}

function scoreOfferQuality(input: GlobalDealScoringInput) {
  const offer = input.offerRecommendation;
  const metrics = getMetrics(input);

  if (!offer) return 30;
  if (offer.offerType === "pass_no_offer") return 5;

  let score = 48;
  const marginOfSafety = offer.marginOfSafety ?? 0;
  const negotiationRoom = offer.negotiationRoom ?? 0;
  const missingDataCount = offer.missingData?.length ?? 0;

  if (offer.offerStrength === "strong") score += 25;
  if (offer.offerStrength === "moderate") score += 12;
  if (offer.offerStrength === "weak") score -= 15;
  if (marginOfSafety >= 25) score += 15;
  if (marginOfSafety >= 10 && marginOfSafety < 25) score += 8;
  if (marginOfSafety > 0 && marginOfSafety < 10) score -= 8;
  if (negotiationRoom > 0) score += Math.min(12, negotiationRoom / 2500);
  if (metrics.expectedProfit > 0) score += Math.min(15, metrics.expectedProfit / 5000);
  if (metrics.walkAwayPrice > 0 && metrics.askingPrice > metrics.walkAwayPrice) score -= 18;
  if (missingDataCount > 0) score -= Math.min(18, missingDataCount * 6);

  return clampScore(score);
}

function scoreNegotiationReadiness(input: GlobalDealScoringInput) {
  const status = input.negotiationRecommendation?.status;

  if (!status) return 35;
  if (status === "ready_to_negotiate") return 88;
  if (status === "negotiate_with_conditions") return 72;
  if (status === "review_required") return 42;

  return 5;
}

function scoreConversionLikelihood(input: GlobalDealScoringInput) {
  const followUp = input.followUpRecommendation;
  const metrics = getMetrics(input);
  let score = 35;

  if (!followUp) {
    if (hasAny(metrics.sellerMotivation, ["urgent", "motivated", "foreclosure", "probate", "vacant"])) score += 15;
    if (hasAny(metrics.sellerTimeline, ["asap", "soon", "today", "week", "30"])) score += 12;

    return clampScore(score);
  }

  if (followUp.sellerState === "hot_ready") score = 92;
  else if (followUp.sellerState === "interested") score = 78;
  else if (followUp.sellerState === "follow_up_needed" || followUp.sellerState === "needs_time") score = 60;
  else if (followUp.sellerState === "price_gap") score = 45;
  else if (followUp.sellerState === "cold" || followUp.sellerState === "new_uncontacted") score = 32;
  else if (followUp.sellerState === "dead" || followUp.sellerState === "do_not_contact") score = 0;
  else if (followUp.sellerState === "review_required") score = 35;

  if (followUp.priority === "urgent") score += 8;
  if (followUp.priority === "high") score += 4;
  if (followUp.priority === "low") score -= 8;
  if (followUp.priority === "do_not_pursue") score = 0;

  return clampScore(score);
}

function scoreBuyerDemand(input: GlobalDealScoringInput) {
  const disposition = input.dispositionRecommendation;
  const metrics = getMetrics(input);
  const matches = disposition?.recommendedBuyerMatches ?? [];
  let score = metrics.buyerDemandScore > 0 ? metrics.buyerDemandScore : 35;

  if (disposition?.buyerDemandSignal === "strong") score = Math.max(score, 82);
  if (disposition?.buyerDemandSignal === "moderate") score = Math.max(score, 62);
  if (disposition?.buyerDemandSignal === "weak") score = Math.min(score, 42);
  if (disposition?.buyerDemandSignal === "unknown") score = Math.min(score, 35);
  if (matches.length > 0) score += Math.min(12, matches.length * 3);
  if (matches[0]?.matchScore && matches[0].matchScore >= 75) score += 8;
  if (disposition?.dispositionPath === "do_not_dispose") score = 0;

  return clampScore(score);
}

function scoreClosingReadiness(input: GlobalDealScoringInput) {
  const closing = input.dealExecutionClosingRecommendation;

  if (!closing) return 25;
  if (closing.readinessStatus === "ready_to_close") return Math.max(88, closing.readinessScore);
  if (closing.readinessStatus === "almost_ready") return Math.max(72, closing.readinessScore);
  if (closing.readinessStatus === "review_required") return Math.min(58, closing.readinessScore);
  if (closing.readinessStatus === "not_ready") return Math.min(38, closing.readinessScore);

  return 0;
}

function collectBlockers(input: GlobalDealScoringInput) {
  const metrics = getMetrics(input);
  const decisionOutput = getDecisionOutput(input);

  return unique([
    ...(metrics.doNotContact ? ["Lead is marked Do Not Contact."] : []),
    ...(metrics.optOutReason ? ["Lead has an opt-out reason."] : []),
    ...(input.fundingApprovalReadiness?.status === "rejected" ? ["Funding approval readiness is rejected."] : []),
    ...(input.offerRecommendation?.offerType === "pass_no_offer" ? ["Offer engine recommends pass / no offer."] : []),
    ...(input.negotiationRecommendation?.status === "do_not_negotiate" ? ["Negotiation engine says do not negotiate."] : []),
    ...(input.followUpRecommendation?.sellerState === "do_not_contact" ? ["Follow-up engine says Do Not Contact."] : []),
    ...(input.followUpRecommendation?.priority === "do_not_pursue" ? ["Follow-up priority is Do Not Pursue."] : []),
    ...(input.dispositionRecommendation?.dispositionPath === "do_not_dispose" ? ["Disposition engine says do not dispose."] : []),
    ...(input.dealExecutionClosingRecommendation?.readinessStatus === "do_not_close" ? ["Closing engine says do not close."] : []),
    ...(getBoolean(decisionOutput, ["shouldBlockExecution"], false) ? ["Execution decision support blocks execution."] : []),
    ...stringArray(getPath(decisionOutput, ["blockReasons"])),
    ...(input.portfolioDecision?.executionBlockers ?? []),
    ...(input.dealExecutionClosingRecommendation?.blockerItems ?? []),
  ]);
}

function collectWarnings(input: GlobalDealScoringInput) {
  const decisionOutput = getDecisionOutput(input);

  return unique([
    ...stringArray(getPath(decisionOutput, ["warnings"])),
    ...stringArray(getPath(decisionOutput, ["missingData"])).map((item) => `Missing decision data: ${item}`),
    ...(input.portfolioDecision?.risks ?? []),
    ...(input.portfolioDecision?.feasibilityIssues ?? []),
    ...(input.fundingRecommendation?.risks ?? []),
    ...(input.capitalStackComparison?.sensitivityAlerts ?? []),
    ...(input.fundingApprovalReadiness?.requiredFixes ?? []),
    ...(input.offerRecommendation?.riskAdjustments ?? []),
    ...(input.negotiationRecommendation?.negotiationRisks ?? []),
    ...(input.followUpRecommendation?.risks ?? []),
    ...(input.dispositionRecommendation?.dispositionRisks ?? []),
    ...(input.dealExecutionClosingRecommendation?.titleRisks ?? []),
    ...(input.dealExecutionClosingRecommendation?.buyerRisks ?? []),
    ...(input.dealExecutionClosingRecommendation?.sellerRisks ?? []),
    ...(input.dealExecutionClosingRecommendation?.fundingRisks ?? []),
    ...(input.dealExecutionClosingRecommendation?.timelineRisks ?? []),
  ]);
}

function collectComplianceWarnings(input: GlobalDealScoringInput) {
  const metrics = getMetrics(input);
  const strategyText = `${input.offerRecommendation?.offerType ?? ""} ${input.dispositionRecommendation?.dispositionPath ?? ""} ${input.dealExecutionClosingRecommendation?.closingPath ?? ""} ${input.capitalStackComparison?.bestMethod ?? ""}`.toLowerCase();

  return unique([
    ...(metrics.stateMarket.trim() === "" || metrics.stateMarket.includes("ok") || metrics.stateMarket.includes("oklahoma") || hasAny(strategyText, ["wholesale", "assignment", "double", "seller_finance", "subject_to", "contract"])
      ? [OKLAHOMA_COMPLIANCE_WARNING, "Internal global scoring guidance only. This is not legal advice and does not guarantee compliance."]
      : []),
    ...(!input.dispositionRecommendation || !input.dealExecutionClosingRecommendation || !input.offerRecommendation || !input.fundingApprovalReadiness ? [ASSUMPTION_WARNING] : []),
    ...(input.fundingRecommendation?.complianceWarnings ?? []),
    ...(input.capitalStackComparison?.complianceWarnings ?? []),
    ...(input.fundingApprovalReadiness?.complianceWarnings ?? []),
    ...(input.offerRecommendation?.complianceWarnings ?? []),
    ...(input.negotiationRecommendation?.complianceWarnings ?? []),
    ...(input.followUpRecommendation?.complianceWarnings ?? []),
    ...(input.dispositionRecommendation?.complianceWarnings ?? []),
    ...(input.dealExecutionClosingRecommendation?.complianceWarnings ?? []),
  ]);
}

function strongestSignals(input: GlobalDealScoringInput, breakdown: GlobalDealScore["scoreBreakdown"]) {
  const signals = [
    ...(breakdown.decisionStrength >= 75 ? ["Decision support is strong enough to keep this deal in the active review lane."] : []),
    ...(breakdown.riskControl >= 75 ? ["Risk, uncertainty, and data quality are controlled relative to other deals."] : []),
    ...(breakdown.fundingStrength >= 75 ? ["Funding path appears strong or conditionally workable."] : []),
    ...(breakdown.offerQuality >= 75 ? ["Offer quality, margin, or expected profit is favorable."] : []),
    ...(breakdown.negotiationReadiness >= 75 ? ["Negotiation posture is ready or close to ready."] : []),
    ...(breakdown.conversionLikelihood >= 75 ? ["Seller conversion signal is strong."] : []),
    ...(breakdown.buyerDemand >= 75 ? ["Buyer demand or disposition match signal is strong."] : []),
    ...(breakdown.closingReadiness >= 75 ? ["Closing readiness is ahead of most open deals."] : []),
    ...((input.dispositionRecommendation?.recommendedBuyerMatches?.[0]?.matchScore ?? 0) >= 75 ? ["Top buyer match score is strong."] : []),
  ];

  return unique(signals).slice(0, 8);
}

function getRecommendedFocus(breakdown: GlobalDealScore["scoreBreakdown"], blockers: string[]) {
  if (blockers.length > 0) return "Resolve critical blockers before spending more execution time.";

  const labels: Record<keyof GlobalDealScore["scoreBreakdown"], string> = {
    decisionStrength: "Decision strength",
    riskControl: "Risk control",
    fundingStrength: "Funding strength",
    offerQuality: "Offer quality",
    negotiationReadiness: "Negotiation readiness",
    conversionLikelihood: "Conversion likelihood",
    buyerDemand: "Buyer demand",
    closingReadiness: "Closing readiness",
  };
  const [lowestKey, lowestScore] = Object.entries(breakdown).sort((a, b) => a[1] - b[1])[0] as [keyof GlobalDealScore["scoreBreakdown"], number];

  return `${labels[lowestKey]} is the main constraint at ${lowestScore}/100.`;
}

function getRecommendedNextStep(priority: GlobalDealScore["priority"], focus: string) {
  if (priority === "avoid") return "Avoid working this deal until hard stops are cleared by qualified human review.";
  if (priority === "urgent") return "Work this deal today after human review, starting with the focus area and any required verifications.";
  if (priority === "high") return "Prioritize this deal in the active queue and resolve the weakest lifecycle area next.";
  if (priority === "medium") return "Keep this deal in review and improve the weakest score category before advancing.";
  if (priority === "low") return "Deprioritize until new facts improve the score, especially the focus area.";

  return focus;
}

export function generateGlobalDealScore(input: GlobalDealScoringInput): GlobalDealScore {
  const scoreBreakdown: GlobalDealScore["scoreBreakdown"] = {
    decisionStrength: scoreDecisionStrength(input),
    riskControl: scoreRiskControl(input),
    fundingStrength: scoreFundingStrength(input),
    offerQuality: scoreOfferQuality(input),
    negotiationReadiness: scoreNegotiationReadiness(input),
    conversionLikelihood: scoreConversionLikelihood(input),
    buyerDemand: scoreBuyerDemand(input),
    closingReadiness: scoreClosingReadiness(input),
  };
  const blockers = collectBlockers(input);
  const criticalStop = blockers.length > 0;
  const weightedScore = clampScore(
    scoreBreakdown.decisionStrength * 0.14 +
      scoreBreakdown.riskControl * 0.16 +
      scoreBreakdown.fundingStrength * 0.13 +
      scoreBreakdown.offerQuality * 0.13 +
      scoreBreakdown.negotiationReadiness * 0.1 +
      scoreBreakdown.conversionLikelihood * 0.12 +
      scoreBreakdown.buyerDemand * 0.1 +
      scoreBreakdown.closingReadiness * 0.12,
  );
  const score = criticalStop ? Math.min(weightedScore, 29) : weightedScore;
  const priority: GlobalDealScore["priority"] =
    criticalStop || score < 30
      ? "avoid"
      : score >= 85
        ? "urgent"
        : score >= 70
          ? "high"
          : score >= 50
            ? "medium"
            : "low";
  const recommendedFocus = getRecommendedFocus(scoreBreakdown, blockers);

  return {
    score,
    priority,
    scoreBreakdown,
    strongestSignals: strongestSignals(input, scoreBreakdown),
    warnings: collectWarnings(input),
    blockers,
    recommendedFocus,
    recommendedNextStep: getRecommendedNextStep(priority, recommendedFocus),
    complianceWarnings: collectComplianceWarnings(input),
  };
}
