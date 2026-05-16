import type { StrategyExecutionSimulation } from "@/lib/execution-simulation-engine";

export type SimulationConfidenceLabel = "high" | "medium" | "low" | "unreliable";

export type SimulationConfidenceResult = {
  strategy: string;
  confidenceScore: number;
  confidenceLabel: SimulationConfidenceLabel;
  confidenceWarnings: string[];
  missingData: string[];
  recommendedDataToCollect: string[];
  safeToUseForDecision: boolean;
  unsafeDecisionReason?: string;
};

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonRecord) : {};
}

function getPath(source: unknown, paths: string[]) {
  for (const path of paths) {
    const value = path.split(".").reduce<unknown>((current, key) => asRecord(current)[key], source);

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return null;
}

function getNumber(source: unknown, paths: string[], fallback: number) {
  const value = getPath(source, paths);
  const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;

  return Number.isFinite(parsed) ? parsed : fallback;
}

function getArray(source: unknown, paths: string[]) {
  const value = getPath(source, paths);

  return Array.isArray(value) ? value : [];
}

function hasValue(source: unknown, paths: string[]) {
  return getPath(source, paths) !== null;
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function getCompletenessScore(context: unknown, checks: { label: string; paths: string[] }[]) {
  const present = checks.filter((check) => hasValue(context, check.paths)).length;

  return checks.length === 0 ? 100 : clampScore((present / checks.length) * 100);
}

function getMissingContextData(context: unknown) {
  const requiredChecks = [
    { label: "property address", paths: ["lead.address", "deal.address", "address", "propertyAddress"] },
    { label: "seller contact", paths: ["lead.phone", "lead.email", "seller.phone", "seller.email", "sellerContact"] },
    { label: "asking price", paths: ["lead.askingPrice", "deal.askingPrice", "askingPrice", "price"] },
    { label: "ARV", paths: ["lead.arv", "deal.arv", "arv", "assetContext.arv"] },
    { label: "repair estimate", paths: ["lead.estimatedRepairs", "deal.estimatedRepairs", "estimatedRepairs", "repairEstimate"] },
    { label: "condition notes", paths: ["lead.condition", "deal.condition", "condition", "conditionNotes"] },
    { label: "seller motivation", paths: ["lead.motivation", "sellerMotivation", "motivation", "strategyDecision.sellerMotivation"] },
    { label: "buyer demand", paths: ["buyerIntelligence", "buyerDemand", "marketContext.buyerDemand"] },
    { label: "market confidence", paths: ["marketContext", "marketConfidence", "strategyDecision.marketConfidence"] },
    { label: "strategy fit", paths: ["strategyComparison", "strategyDecision", "executionReadiness"] },
  ];

  return requiredChecks.filter((check) => !hasValue(context, check.paths)).map((check) => check.label);
}

function getMissingRequiredData(simulation: StrategyExecutionSimulation) {
  return unique(simulation.steps.flatMap((step) => step.requiredData));
}

function getBlockerSeverityScore(simulation: StrategyExecutionSimulation, context: unknown) {
  const highImpactRisks = simulation.riskPoints.filter((risk) => risk.impact === "high").length;
  const blockerCount = simulation.predictedBlockers.length;
  const readinessBlockers = getArray(context, ["executionReadiness.blockers", "blockers"]).length;

  return clampScore(highImpactRisks * 18 + blockerCount * 5 + readinessBlockers * 8);
}

function getRiskUncertaintyScore(simulation: StrategyExecutionSimulation) {
  const worstDrop = simulation.expectedCase.successProbability - simulation.worstCase.successProbability;
  const costSpread = simulation.expectedCase.projectedCostHigh - simulation.expectedCase.projectedCostLow;
  const normalizedCostSpread = simulation.expectedCase.projectedCostHigh > 0
    ? (costSpread / simulation.expectedCase.projectedCostHigh) * 100
    : 20;

  return clampScore(worstDrop * 0.9 + normalizedCostSpread * 0.35 + simulation.riskPoints.length * 4);
}

export function getSimulationConfidenceLabel(score: number): SimulationConfidenceLabel {
  if (score >= 80) return "high";
  if (score >= 60) return "medium";
  if (score >= 40) return "low";
  return "unreliable";
}

export function getSimulationConfidenceWarnings(simulation: StrategyExecutionSimulation, context: unknown = {}) {
  const warnings: string[] = [];
  const missingContextData = getMissingContextData(context);
  const missingRequiredData = getMissingRequiredData(simulation);
  const unresolvedBlockers = unique([...simulation.predictedBlockers, ...getArray(context, ["executionReadiness.blockers"]).map((blocker) => {
    const issue = asRecord(blocker).issue;

    return typeof issue === "string" ? issue : "";
  })]);
  const blockerSeverity = getBlockerSeverityScore(simulation, context);
  const uncertainty = getRiskUncertaintyScore(simulation);

  if (missingContextData.length >= 4) warnings.push("Core deal data is too incomplete for a high-trust simulation.");
  if (missingRequiredData.length >= 6) warnings.push("Execution steps require several unverified data points.");
  if (simulation.expectedCase.successProbability < 50) warnings.push("Expected-case success probability is weak.");
  if (simulation.worstCase.successProbability < 35) warnings.push("Worst-case survivability is low.");
  if (blockerSeverity >= 55 || unresolvedBlockers.length >= 5) warnings.push("Unresolved execution blockers materially reduce confidence.");
  if (uncertainty >= 60) warnings.push("Risk uncertainty is elevated across timeline, cost, or failure exposure.");
  if (simulation.complexityScore >= 75) warnings.push("Execution complexity is high and should be reviewed manually.");

  return unique(warnings);
}

export function calculateSimulationConfidence(
  simulation: StrategyExecutionSimulation,
  context: unknown = {},
): SimulationConfidenceResult {
  const assetCompleteness = getCompletenessScore(context, [
    { label: "address", paths: ["lead.address", "deal.address", "address", "propertyAddress"] },
    { label: "condition", paths: ["lead.condition", "deal.condition", "condition", "conditionNotes"] },
    { label: "asset type", paths: ["assetClassification", "assetType", "propertyType"] },
  ]);
  const motivationCompleteness = getCompletenessScore(context, [
    { label: "motivation", paths: ["lead.motivation", "sellerMotivation", "motivation"] },
    { label: "seller contact", paths: ["lead.phone", "lead.email", "seller.phone", "seller.email", "sellerContact"] },
  ]);
  const pricingConfidence = hasValue(context, ["lead.askingPrice", "deal.askingPrice", "askingPrice", "price"]) ? 82 : 38;
  const arvConfidence = hasValue(context, ["lead.arv", "deal.arv", "arv", "assetContext.arv"]) ? 78 : 35;
  const repairConfidence = hasValue(context, ["lead.estimatedRepairs", "deal.estimatedRepairs", "estimatedRepairs", "repairEstimate"]) ? 76 : 36;
  const buyerDemandConfidence = hasValue(context, ["buyerIntelligence", "buyerDemand", "marketContext.buyerDemand"]) ? 74 : 42;
  const marketConfidence = getNumber(context, ["marketConfidence", "marketContext.confidenceScore", "strategyDecision.marketConfidence"], 55);
  const strategyFitConfidence = getNumber(
    context,
    ["strategyComparison.strategies.0.confidenceScore", "strategyDecision.strategyConfidence", "executionReadiness.readinessScore"],
    58,
  );
  const missingContextData = getMissingContextData(context);
  const missingRequiredData = getMissingRequiredData(simulation);
  const blockerSeverity = getBlockerSeverityScore(simulation, context);
  const riskUncertainty = getRiskUncertaintyScore(simulation);
  const confidenceScore = clampScore(
    assetCompleteness * 0.14 +
      motivationCompleteness * 0.1 +
      pricingConfidence * 0.11 +
      arvConfidence * 0.11 +
      repairConfidence * 0.1 +
      buyerDemandConfidence * 0.1 +
      marketConfidence * 0.1 +
      strategyFitConfidence * 0.12 +
      simulation.expectedCase.successProbability * 0.12 -
      blockerSeverity * 0.11 -
      riskUncertainty * 0.09 -
      missingRequiredData.length * 1.25 -
      missingContextData.length * 1.5,
  );
  const confidenceLabel = getSimulationConfidenceLabel(confidenceScore);
  const confidenceWarnings = getSimulationConfidenceWarnings(simulation, context);
  const missingData = unique([...missingContextData, ...missingRequiredData]);
  const recommendedDataToCollect = missingData.slice(0, 10);
  const safeToUseForDecision = confidenceScore >= 55 && confidenceWarnings.length <= 3 && simulation.worstCase.successProbability >= 35;
  const unsafeDecisionReason = safeToUseForDecision
    ? undefined
    : `Confidence is ${confidenceLabel} (${confidenceScore}/100), with ${missingData.length} missing data item(s) and ${confidenceWarnings.length} warning(s).`;

  return {
    strategy: simulation.normalizedStrategy || simulation.strategy,
    confidenceScore,
    confidenceLabel,
    confidenceWarnings,
    missingData,
    recommendedDataToCollect,
    safeToUseForDecision,
    unsafeDecisionReason,
  };
}

export function compareSimulationConfidence(simulations: StrategyExecutionSimulation[], context: unknown = {}) {
  return simulations.map((simulation) => calculateSimulationConfidence(simulation, context)).sort((a, b) => {
    return b.confidenceScore - a.confidenceScore || normalizeText(a.strategy).localeCompare(normalizeText(b.strategy));
  });
}
