import type { FundingRecommendation } from "@/types/capital-funding";
import type { FundingSensitivityResult } from "@/types/capital-stack";
import type { FundingApprovalReadiness, FundingApprovalStatus, FundingGuardrail, GuardrailSeverity } from "@/types/funding-approval";
import type { PortfolioDecision } from "@/types/portfolio";

type JsonRecord = Record<string, unknown>;

type FundingApprovalInput = {
  portfolioDecision?: PortfolioDecision | null;
  feasibilityResult?: unknown;
  fundingRecommendation?: FundingRecommendation | null;
  capitalStackComparison?: FundingSensitivityResult | null;
  deal?: unknown;
  lead?: unknown;
  strategyDecision?: unknown;
  purchasePrice?: number | null;
  askingPrice?: number | null;
  arv?: number | null;
  repairs?: number | null;
  estimatedRepairs?: number | null;
  estimatedProfit?: number | null;
  timelineDays?: number | null;
  riskScore?: number | null;
  uncertaintyScore?: number | null;
  reliabilityScore?: number | null;
  dataCompletenessScore?: number | null;
  buyerDemandScore?: number | null;
  sellerTermsAvailable?: boolean | null;
  state?: string | null;
  market?: string | null;
  titleStatus?: string | null;
  occupancyStatus?: string | null;
  docsAvailable?: string[] | null;
  exitStrategy?: string | null;
};

const OKLAHOMA_COMPLIANCE_WARNING =
  "Review Oklahoma wholesaling, disclosure, licensing, assignment, double-close, seller-finance, subject-to, cancellation-right, escrow, and closing requirements with a qualified Oklahoma real estate attorney/title company before execution.";

const REVIEW_METHODS = new Set(["transactional_funding", "buyer_funded_double_close", "seller_finance", "subject_to"]);

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

function getNumber(source: unknown, paths: string[], fallback = 0) {
  const value = getPath(source, paths);
  const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;

  return Number.isFinite(parsed) ? parsed : fallback;
}

function getOptionalNumber(source: unknown, paths: string[]) {
  const value = getPath(source, paths);
  const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;

  return Number.isFinite(parsed) ? parsed : null;
}

function getString(source: unknown, paths: string[], fallback = "") {
  const value = getPath(source, paths);

  return typeof value === "string" ? value.trim() : fallback;
}

function getArray(source: unknown, paths: string[]) {
  const value = getPath(source, paths);

  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim() !== "") : [];
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function addGuardrail(guardrails: FundingGuardrail[], name: string, status: FundingGuardrail["status"], severity: GuardrailSeverity, message: string) {
  guardrails.push({ name, status, severity, message });
}

function hasCriticalData(input: FundingApprovalInput, label: "purchasePrice" | "arv" | "repairs" | "timelineDays") {
  const paths: Record<typeof label, string[]> = {
    purchasePrice: ["purchasePrice", "askingPrice", "deal.purchasePrice", "deal.askingPrice", "lead.askingPrice"],
    arv: ["arv", "deal.arv", "lead.arv"],
    repairs: ["repairs", "estimatedRepairs", "deal.estimatedRepairs", "lead.estimatedRepairs"],
    timelineDays: ["timelineDays", "portfolioDecision.timelineDays"],
  };

  return getOptionalNumber(input, paths[label]) !== null;
}

function getMetrics(input: FundingApprovalInput) {
  const purchasePrice = getNumber(input, ["purchasePrice", "askingPrice", "deal.purchasePrice", "deal.askingPrice", "lead.askingPrice"], 0);
  const arv = getNumber(input, ["arv", "deal.arv", "lead.arv"], 0);
  const repairs = getNumber(input, ["repairs", "estimatedRepairs", "deal.estimatedRepairs", "lead.estimatedRepairs"], 0);
  const timelineDays = input.portfolioDecision?.timelineDays ?? getNumber(input, ["timelineDays"], 0);
  const estimatedProfit = input.portfolioDecision?.estimatedReturn?.profit ?? getNumber(input, ["estimatedProfit"], arv > 0 ? arv - purchasePrice - repairs : 0);
  const roi = input.portfolioDecision?.estimatedReturn?.roi ?? (purchasePrice + repairs > 0 ? (estimatedProfit / (purchasePrice + repairs)) * 100 : 0);
  const riskScore = getNumber(input, ["riskScore"], 50);
  const uncertaintyScore = getNumber(input, ["uncertaintyScore"], 50);
  const reliabilityScore = getNumber(input, ["reliabilityScore", "portfolioDecision.confidence"], input.portfolioDecision?.confidence ?? 50);
  const dataCompletenessScore = getNumber(input, ["dataCompletenessScore"], 100);
  const buyerDemandScore = getNumber(input, ["buyerDemandScore"], 50);
  const titleStatus = getString(input, ["titleStatus", "deal.titleStatus", "lead.titleStatus"], "unknown").toLowerCase();
  const occupancyStatus = getString(input, ["occupancyStatus", "occupancy", "deal.occupancyStatus", "lead.occupancy"], "unknown").toLowerCase();
  const docsAvailable = unique([...getArray(input, ["docsAvailable", "deal.docsAvailable", "lead.docsAvailable"])]);
  const exitStrategy = getString(input, ["exitStrategy", "strategyDecision.recommendedStrategy", "portfolioDecision.action"], input.portfolioDecision?.action ?? "");
  const stateMarket = `${getString(input, ["state", "deal.state", "lead.state"], "")} ${getString(input, ["market", "deal.market", "lead.market"], "")}`.toLowerCase();
  const capitalRequired = input.fundingRecommendation?.capitalRequired ?? input.portfolioDecision?.capitalRequired ?? getNumber(input, ["capitalRequired"], Math.round(purchasePrice * 0.2 + repairs));
  const worstCaseProfit = Math.min(
    estimatedProfit,
    ...((input.capitalStackComparison?.scenarios ?? []).map((scenario) => scenario.estimatedProfit ?? estimatedProfit)),
  );

  return {
    purchasePrice,
    arv,
    repairs,
    timelineDays,
    estimatedProfit,
    roi,
    riskScore,
    uncertaintyScore,
    reliabilityScore,
    dataCompletenessScore,
    buyerDemandScore,
    titleStatus,
    occupancyStatus,
    docsAvailable,
    exitStrategy,
    stateMarket,
    capitalRequired,
    worstCaseProfit,
    action: input.portfolioDecision?.action,
    capitalFit: input.portfolioDecision?.capitalFit,
    timelineRisk: input.portfolioDecision?.timelineRisk,
    fundingFit: input.fundingRecommendation?.fundingFit,
    strategyFit: input.fundingRecommendation?.strategyFit,
    primaryMethod: input.fundingRecommendation?.primaryMethod,
    bestMethod: input.capitalStackComparison?.bestMethod,
    avoidMethods: input.capitalStackComparison?.avoidMethods ?? [],
    sensitivityAlerts: input.capitalStackComparison?.sensitivityAlerts ?? [],
  };
}

function getMissingData(input: FundingApprovalInput) {
  const missing: string[] = [];

  if (!hasCriticalData(input, "purchasePrice")) missing.push("purchase price");
  if (!hasCriticalData(input, "arv")) missing.push("ARV");
  if (!hasCriticalData(input, "repairs")) missing.push("repair estimate");
  if (!hasCriticalData(input, "timelineDays")) missing.push("timeline");
  if (!getPath(input, ["exitStrategy", "strategyDecision.recommendedStrategy", "portfolioDecision.action"])) missing.push("exit strategy");
  if (!input.fundingRecommendation) missing.push("funding assumptions");

  return missing;
}

function getMissingDocuments(input: FundingApprovalInput) {
  const metrics = getMetrics(input);
  const docs = new Set(metrics.docsAvailable.map((doc) => doc.toLowerCase()));
  const missing = ["title or ownership review", "repair scope", "funding terms summary"].filter((doc) => !docs.has(doc));

  if (!docs.has("purchase contract") && !docs.has("contract")) missing.push("purchase contract or draft terms");
  if (metrics.occupancyStatus === "occupied" && !docs.has("occupancy verification")) missing.push("occupancy verification");

  return unique(missing);
}

function needsComplianceWarning(input: FundingApprovalInput) {
  const metrics = getMetrics(input);
  const methodText = [metrics.primaryMethod, metrics.bestMethod, metrics.action, metrics.exitStrategy].filter(Boolean).join(" ");

  return (
    metrics.stateMarket.trim() === "" ||
    metrics.stateMarket.includes("ok") ||
    metrics.stateMarket.includes("oklahoma") ||
    methodText.includes("wholesale") ||
    methodText.includes("double") ||
    methodText.includes("assignment") ||
    methodText.includes("seller_finance") ||
    methodText.includes("subject_to") ||
    methodText.includes("creative_finance") ||
    methodText.includes("transactional_funding")
  );
}

function usesDefaultAssumptions(input: FundingApprovalInput) {
  return (
    getOptionalNumber(input, ["riskScore"]) === null ||
    getOptionalNumber(input, ["uncertaintyScore"]) === null ||
    getOptionalNumber(input, ["reliabilityScore", "portfolioDecision.confidence"]) === null ||
    getOptionalNumber(input, ["dataCompletenessScore"]) === null ||
    getPath(input, ["titleStatus", "deal.titleStatus", "lead.titleStatus"]) === null ||
    getPath(input, ["docsAvailable", "deal.docsAvailable", "lead.docsAvailable"]) === null
  );
}

export function evaluateFundingApprovalReadiness(input: FundingApprovalInput): FundingApprovalReadiness {
  const metrics = getMetrics(input);
  const guardrails: FundingGuardrail[] = [];
  const requiredFixes: string[] = [];
  const fundingConditions: string[] = [];
  const missingData = getMissingData(input);
  const missingDocuments = getMissingDocuments(input);

  if (metrics.estimatedProfit <= 0 || metrics.worstCaseProfit < 0) {
    addGuardrail(guardrails, "Minimum Return Guardrail", "fail", metrics.worstCaseProfit < 0 ? "critical" : "high", "Expected or downside profit is too weak for funding review readiness.");
    requiredFixes.push("Improve price, repair budget, exit price, or funding structure before funding review.");
  } else if (metrics.roi < 10 || metrics.estimatedProfit < 10000) {
    addGuardrail(guardrails, "Minimum Return Guardrail", "warning", "medium", "Expected return is thin and needs investor review before moving forward.");
    fundingConditions.push("Verify profit, ROI, repair budget, and exit assumptions before funding review.");
  } else {
    addGuardrail(guardrails, "Minimum Return Guardrail", "pass", "low", "Expected return clears the internal readiness threshold.");
  }

  if (metrics.capitalFit === "insufficient" || metrics.fundingFit === "weak") {
    addGuardrail(guardrails, "Capital Exposure Guardrail", "fail", "critical", "Capital fit is insufficient or funding fit is weak under current assumptions.");
    requiredFixes.push("Resolve capital shortfall or select a better-aligned funding path.");
  } else if (metrics.capitalRequired > Math.max(50000, metrics.purchasePrice * 0.35) || metrics.capitalFit === "tight") {
    addGuardrail(guardrails, "Capital Exposure Guardrail", "warning", "high", "Cash required is high or capital fit is tight for the selected strategy.");
    fundingConditions.push("Confirm available capital, reserves, and maximum exposure before funding review.");
  } else {
    addGuardrail(guardrails, "Capital Exposure Guardrail", "pass", "low", "Capital exposure appears manageable for readiness review.");
  }

  if (missingData.length >= 4 || metrics.dataCompletenessScore < 45) {
    addGuardrail(guardrails, "Data Completeness Guardrail", "fail", "critical", "Critical funding review fields are missing.");
    requiredFixes.push("Add purchase price, ARV, repairs, timeline, exit strategy, and funding assumptions.");
  } else if (missingData.length > 0 || metrics.dataCompletenessScore < 70) {
    addGuardrail(guardrails, "Data Completeness Guardrail", "warning", "high", "Important fields are missing or incomplete.");
    fundingConditions.push("Complete missing deal and funding data before human funding review.");
  } else {
    addGuardrail(guardrails, "Data Completeness Guardrail", "pass", "low", "Core funding readiness data is present.");
  }

  if (metrics.riskScore >= 75 && metrics.uncertaintyScore >= 65) {
    addGuardrail(guardrails, "Risk / Uncertainty Guardrail", "fail", "high", "Risk and uncertainty are both elevated and need human review.");
    requiredFixes.push("Reduce uncertainty with verified comps, repair scope, buyer demand, and title/closing facts.");
  } else if (metrics.reliabilityScore >= 85 && (metrics.dataCompletenessScore < 70 || missingData.length > 0)) {
    addGuardrail(guardrails, "Risk / Uncertainty Guardrail", "warning", "high", "Confidence appears high while source data is incomplete.");
    fundingConditions.push("Human verification required because overconfidence may be present.");
  } else {
    addGuardrail(guardrails, "Risk / Uncertainty Guardrail", metrics.riskScore >= 70 ? "warning" : "pass", metrics.riskScore >= 70 ? "medium" : "low", "Risk and uncertainty are within reviewable bounds.");
  }

  if ((metrics.primaryMethod === "hard_money" || metrics.primaryMethod === "bridge_lending") && (metrics.timelineRisk === "high" || metrics.timelineDays > 180)) {
    addGuardrail(guardrails, "Timeline Guardrail", "fail", "high", "Short-term debt does not fit the current timeline risk.");
    requiredFixes.push("Shorten timeline, add reserves, or use a better-aligned funding path.");
  } else if (metrics.sensitivityAlerts.some((alert) => alert.toLowerCase().includes("delay"))) {
    addGuardrail(guardrails, "Timeline Guardrail", "warning", "medium", "Delay stress may materially reduce profit.");
    fundingConditions.push("Verify schedule, holding costs, and delay reserves.");
  } else {
    addGuardrail(guardrails, "Timeline Guardrail", "pass", "low", "Timeline risk is acceptable for readiness review.");
  }

  if (!metrics.titleStatus || metrics.titleStatus === "unknown" || metrics.titleStatus === "missing") {
    addGuardrail(guardrails, "Title / Closing Readiness Guardrail", "warning", "high", "Title status is missing or unknown.");
    fundingConditions.push("Obtain title or ownership review before any execution step.");
  } else {
    addGuardrail(guardrails, "Title / Closing Readiness Guardrail", "pass", "low", "Title status has been provided for readiness review.");
  }

  if (metrics.primaryMethod && metrics.avoidMethods.some((method) => method.method === metrics.primaryMethod)) {
    addGuardrail(guardrails, "Strategy-Funding Fit Guardrail", "fail", "critical", "Capital stack comparison says to avoid the primary funding method.");
    requiredFixes.push("Replace the primary funding method or rerun assumptions.");
  } else if (metrics.strategyFit === "weak" || (metrics.bestMethod && metrics.primaryMethod && metrics.bestMethod !== metrics.primaryMethod && metrics.primaryMethod !== "pass_or_wait")) {
    addGuardrail(guardrails, "Strategy-Funding Fit Guardrail", "warning", "medium", "Selected funding method is not the strongest fit for the current strategy.");
    fundingConditions.push("Review why the selected funding method differs from the top capital stack.");
  } else {
    addGuardrail(guardrails, "Strategy-Funding Fit Guardrail", "pass", "low", "Funding method appears aligned with the current strategy.");
  }

  if (needsComplianceWarning(input)) {
    addGuardrail(guardrails, "Compliance Guardrail", "warning", "high", "Oklahoma or creative/wholesale transaction review warning applies.");
    fundingConditions.push("Qualified Oklahoma attorney/title review required before execution.");
  } else {
    addGuardrail(guardrails, "Compliance Guardrail", "pass", "low", "No Oklahoma-specific compliance warning was triggered from the available inputs.");
  }

  if (metrics.primaryMethod && REVIEW_METHODS.has(metrics.primaryMethod)) {
    fundingConditions.push("Attorney/title company review required for assignment, double-close, seller-finance, subject-to, escrow, and closing requirements.");
  }

  if (usesDefaultAssumptions(input)) {
    fundingConditions.push("Some approval readiness values use default assumptions and require human verification.");
  }

  const violatedGuardrails = guardrails.filter((guardrail) => guardrail.status !== "pass");
  const criticalFailures = guardrails.filter((guardrail) => guardrail.status === "fail" && guardrail.severity === "critical").length;
  const highFailures = guardrails.filter((guardrail) => guardrail.status === "fail" && guardrail.severity === "high").length;
  const warnings = guardrails.filter((guardrail) => guardrail.status === "warning").length;
  const readinessScore = clampScore(
    100 -
      criticalFailures * 28 -
      highFailures * 18 -
      warnings * 7 -
      missingData.length * 6 -
      Math.max(0, missingDocuments.length - 2) * 2 -
      Math.max(0, metrics.riskScore - 65) * 0.4 -
      Math.max(0, metrics.uncertaintyScore - 60) * 0.3,
  );
  let status: FundingApprovalStatus = "approved";

  if (criticalFailures > 0 || metrics.worstCaseProfit < 0 || (missingData.length >= 4 && metrics.estimatedProfit <= 0)) {
    status = "rejected";
  } else if (highFailures > 0 || missingData.length >= 3 || (metrics.riskScore >= 75 && metrics.uncertaintyScore >= 65)) {
    status = "review_required";
  } else if (warnings > 0 || missingDocuments.length > 0 || fundingConditions.length > 0) {
    status = "approved_with_conditions";
  }

  const complianceWarnings = needsComplianceWarning(input) ? [OKLAHOMA_COMPLIANCE_WARNING, "This is internal readiness scoring only and is not legal advice or a guarantee of compliance."] : [];
  const unavailable = missingData.length >= 6;

  return {
    status,
    readinessScore,
    guardrails,
    violatedGuardrails,
    requiredFixes: unique(requiredFixes),
    missingDocuments: unique(missingDocuments),
    missingData,
    fundingConditions: unique(fundingConditions),
    approvalSummary: unavailable
      ? "Funding approval readiness unavailable. Add purchase price, ARV, repairs, timeline, funding assumptions, title status, and exit strategy."
      : `Internal funding review readiness is ${status.replaceAll("_", " ")} with a ${readinessScore}/100 score. This is not real funding approval.`,
    complianceWarnings,
    recommendedNextStep:
      status === "rejected"
        ? "Do not move toward funding review until critical guardrail failures are fixed."
        : status === "review_required"
          ? "Send the deal to a qualified human operator for review after missing data and title/closing items are completed."
          : status === "approved_with_conditions"
            ? "Resolve listed conditions and verify assumptions before preparing a funding review package."
            : "Prepare an internal funding review package with human verification of all assumptions.",
  };
}
