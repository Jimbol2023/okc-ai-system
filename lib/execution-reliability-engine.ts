import {
  calculateSimulationConfidence,
  type SimulationConfidenceResult,
} from "@/lib/execution-simulation-confidence";
import type { StrategyExecutionSimulation } from "@/lib/execution-simulation-engine";

export type SimulationReliabilityLabel = "very_high" | "high" | "medium" | "low" | "unreliable";
export type SimulationUncertaintyLevel = "low" | "moderate" | "high" | "extreme";

export type SimulationConfidenceSpread = {
  lowEstimate: number;
  expectedEstimate: number;
  highEstimate: number;
  spreadScore: number;
};

export type SimulationDecisionSafety = {
  safeToProceed: boolean;
  requiresMoreData: boolean;
  shouldBlockDecision: boolean;
  reason?: string;
};

export type SimulationReliabilityResult = {
  strategy: string;
  reliabilityScore: number;
  reliabilityLabel: SimulationReliabilityLabel;
  confidenceSpread: SimulationConfidenceSpread;
  predictionVariance: number;
  dataTrustScore: number;
  modelRiskScore: number;
  overconfidenceDetected: boolean;
  overconfidenceReason?: string;
  uncertaintyLevel: SimulationUncertaintyLevel;
  decisionSafety: SimulationDecisionSafety;
  reliabilityWarnings: string[];
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

function hasValue(source: unknown, paths: string[]) {
  return getPath(source, paths) !== null;
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function average(values: number[]) {
  return values.length === 0 ? 0 : values.reduce((total, value) => total + value, 0) / values.length;
}

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function getReliabilityLabel(score: number): SimulationReliabilityLabel {
  if (score >= 90) return "very_high";
  if (score >= 78) return "high";
  if (score >= 60) return "medium";
  if (score >= 40) return "low";
  return "unreliable";
}

function getUncertaintyLevel(modelRiskScore: number): SimulationUncertaintyLevel {
  if (modelRiskScore >= 75) return "extreme";
  if (modelRiskScore >= 55) return "high";
  if (modelRiskScore >= 35) return "moderate";
  return "low";
}

function getScenarioValues(simulation: StrategyExecutionSimulation) {
  return [
    simulation.worstCase.successProbability,
    simulation.expectedCase.successProbability,
    simulation.bestCase.successProbability,
  ];
}

function getStandardDeviation(values: number[]) {
  const mean = average(values);
  const variance = average(values.map((value) => (value - mean) ** 2));

  return Math.sqrt(variance);
}

function getRequiredSimulationData(simulation: StrategyExecutionSimulation) {
  return unique(simulation.steps.flatMap((step) => step.requiredData));
}

function getMissingCoreData(context: unknown) {
  const checks = [
    { label: "property address", paths: ["lead.address", "deal.address", "address", "propertyAddress"] },
    { label: "seller contact", paths: ["lead.phone", "lead.email", "seller.phone", "seller.email", "sellerContact"] },
    { label: "asking price", paths: ["lead.askingPrice", "deal.askingPrice", "askingPrice", "price"] },
    { label: "ARV", paths: ["lead.arv", "deal.arv", "arv", "assetContext.arv"] },
    { label: "repair estimate", paths: ["lead.estimatedRepairs", "deal.estimatedRepairs", "estimatedRepairs", "repairEstimate"] },
    { label: "condition notes", paths: ["lead.condition", "deal.condition", "condition", "conditionNotes"] },
    { label: "seller motivation", paths: ["lead.motivation", "sellerMotivation", "motivation"] },
    { label: "buyer demand", paths: ["buyerIntelligence", "buyerDemand", "marketContext.buyerDemand"] },
    { label: "market data", paths: ["marketContext", "marketConfidence", "strategyDecision.marketConfidence"] },
    { label: "strategy analysis", paths: ["strategyDecision", "strategyComparison", "executionReadiness"] },
  ];

  return checks.filter((check) => !hasValue(context, check.paths)).map((check) => check.label);
}

function getVerificationPenalty(context: unknown) {
  const unverifiedSignals = [
    !hasValue(context, ["verifiedArv", "assetContext.verifiedArv", "marketContext.verifiedComps"]) ? "ARV/comps not verified" : "",
    !hasValue(context, ["verifiedRepairs", "assetContext.verifiedRepairs", "contractorEstimate"]) ? "repairs not verified" : "",
    !hasValue(context, ["verifiedSellerMotivation", "sellerVerified", "lead.sellerVerified"]) ? "seller motivation not verified" : "",
    !hasValue(context, ["titleConfidence", "assetContext.titleConfidence", "executionReadiness.titleConfidence"]) ? "title confidence unknown" : "",
  ].filter(Boolean);

  return Math.min(28, unverifiedSignals.length * 7);
}

function getStalenessPenalty(context: unknown) {
  const staleDataScore = getNumber(context, ["staleDataScore", "marketContext.staleDataScore", "assetContext.staleDataScore"], 0);

  if (staleDataScore > 0) return Math.min(25, staleDataScore);

  return hasValue(context, ["lastUpdatedAt", "lead.updatedAt", "deal.updatedAt", "marketContext.updatedAt"]) ? 0 : 8;
}

export function calculateConfidenceSpread(simulation: StrategyExecutionSimulation): SimulationConfidenceSpread {
  const lowEstimate = simulation.worstCase.successProbability;
  const expectedEstimate = simulation.expectedCase.successProbability;
  const highEstimate = simulation.bestCase.successProbability;
  const spread = Math.max(0, highEstimate - lowEstimate);

  return {
    lowEstimate,
    expectedEstimate,
    highEstimate,
    spreadScore: clampScore(spread * 1.35),
  };
}

export function calculatePredictionVariance(simulation: StrategyExecutionSimulation) {
  const successVariance = getStandardDeviation(getScenarioValues(simulation)) * 1.45;
  const timelineSpread = simulation.worstCase.projectedTimelineDays - simulation.bestCase.projectedTimelineDays;
  const timelineVariance = simulation.expectedCase.projectedTimelineDays > 0
    ? (timelineSpread / simulation.expectedCase.projectedTimelineDays) * 18
    : 18;
  const expectedCostHigh = Math.max(simulation.expectedCase.projectedCostHigh, 1);
  const costSpread = simulation.worstCase.projectedCostHigh - simulation.bestCase.projectedCostLow;
  const costVariance = Math.min(35, (costSpread / expectedCostHigh) * 18);
  const blockerVariance = simulation.predictedBlockers.length * 3;

  return clampScore(successVariance + timelineVariance + costVariance + blockerVariance);
}

export function calculateDataTrustScore(context: unknown = {}) {
  const missingCoreData = getMissingCoreData(context);
  const missingPenalty = missingCoreData.length * 7;
  const verificationPenalty = getVerificationPenalty(context);
  const stalenessPenalty = getStalenessPenalty(context);
  const marketConfidence = getNumber(context, ["marketConfidence", "marketContext.confidenceScore", "strategyDecision.marketConfidence"], 55);
  const strategyConfidence = getNumber(context, ["strategyDecision.strategyConfidence", "strategyComparison.strategies.0.confidenceScore"], 55);
  const confidenceLift = (marketConfidence + strategyConfidence) * 0.1;

  return clampScore(88 + confidenceLift - missingPenalty - verificationPenalty - stalenessPenalty);
}

export function detectOverconfidence(
  simulation: StrategyExecutionSimulation,
  confidenceResult: SimulationConfidenceResult,
) {
  const requiredDataCount = getRequiredSimulationData(simulation).length;
  const missingDataCount = confidenceResult.missingData.length;
  const dataCompletenessScore = requiredDataCount > 0
    ? clampScore(((requiredDataCount - Math.min(requiredDataCount, missingDataCount)) / requiredDataCount) * 100)
    : 80;
  const wideSpread = calculateConfidenceSpread(simulation).spreadScore >= 55;
  const highConfidence = confidenceResult.confidenceScore >= 75;

  if (highConfidence && dataCompletenessScore < 55) {
    return {
      overconfidenceDetected: true,
      overconfidenceReason: `Confidence is ${confidenceResult.confidenceScore}/100 while data completeness is only ${dataCompletenessScore}/100.`,
    };
  }

  if (highConfidence && wideSpread) {
    return {
      overconfidenceDetected: true,
      overconfidenceReason: "Confidence is high, but best/expected/worst scenario spread is too wide.",
    };
  }

  if (confidenceResult.confidenceLabel === "high" && simulation.worstCase.successProbability < 40) {
    return {
      overconfidenceDetected: true,
      overconfidenceReason: "Confidence is high, but worst-case survivability is weak.",
    };
  }

  return {
    overconfidenceDetected: false,
    overconfidenceReason: undefined,
  };
}

function calculateModelRiskScore({
  simulation,
  confidenceSpread,
  predictionVariance,
  dataTrustScore,
  overconfidenceDetected,
}: {
  simulation: StrategyExecutionSimulation;
  confidenceSpread: SimulationConfidenceSpread;
  predictionVariance: number;
  dataTrustScore: number;
  overconfidenceDetected: boolean;
}) {
  const blockerRisk = simulation.predictedBlockers.length * 5;
  const complexityRisk = simulation.complexityScore * 0.22;
  const failureRisk = (100 - simulation.worstCase.successProbability) * 0.16;
  const dataRisk = (100 - dataTrustScore) * 0.32;
  const overconfidenceRisk = overconfidenceDetected ? 18 : 0;

  return clampScore(
    confidenceSpread.spreadScore * 0.22 +
      predictionVariance * 0.22 +
      blockerRisk +
      complexityRisk +
      failureRisk +
      dataRisk +
      overconfidenceRisk,
  );
}

export function determineIfSimulationIsDecisionSafe(
  simulation: StrategyExecutionSimulation,
  reliability: Pick<
    SimulationReliabilityResult,
    "reliabilityScore" | "dataTrustScore" | "modelRiskScore" | "overconfidenceDetected" | "uncertaintyLevel"
  >,
): SimulationDecisionSafety {
  if (reliability.overconfidenceDetected) {
    return {
      safeToProceed: false,
      requiresMoreData: true,
      shouldBlockDecision: true,
      reason: "Decision blocked because overconfidence was detected.",
    };
  }

  if (reliability.uncertaintyLevel === "extreme" || reliability.modelRiskScore >= 75) {
    return {
      safeToProceed: false,
      requiresMoreData: true,
      shouldBlockDecision: true,
      reason: "Decision blocked because prediction uncertainty is extreme.",
    };
  }

  if (reliability.dataTrustScore < 45) {
    return {
      safeToProceed: false,
      requiresMoreData: true,
      shouldBlockDecision: true,
      reason: "Decision blocked because data trust is too low.",
    };
  }

  if (simulation.worstCase.successProbability < 30) {
    return {
      safeToProceed: false,
      requiresMoreData: true,
      shouldBlockDecision: true,
      reason: "Decision blocked because worst-case survivability is too weak.",
    };
  }

  if (reliability.reliabilityScore < 60 || reliability.dataTrustScore < 60 || reliability.modelRiskScore >= 55) {
    return {
      safeToProceed: false,
      requiresMoreData: true,
      shouldBlockDecision: false,
      reason: "More data is required before using this simulation for action recommendations.",
    };
  }

  return {
    safeToProceed: true,
    requiresMoreData: false,
    shouldBlockDecision: false,
    reason: "Simulation is reliable enough for read-only human decision review, not execution.",
  };
}

export function generateReliabilityWarnings(
  simulation: StrategyExecutionSimulation,
  reliability: Pick<
    SimulationReliabilityResult,
    | "reliabilityScore"
    | "confidenceSpread"
    | "predictionVariance"
    | "dataTrustScore"
    | "modelRiskScore"
    | "overconfidenceDetected"
    | "overconfidenceReason"
    | "uncertaintyLevel"
    | "decisionSafety"
  >,
) {
  const warnings: string[] = [];

  if (reliability.reliabilityScore < 40) warnings.push("Simulation reliability is too low for decision support.");
  if (reliability.confidenceSpread.spreadScore >= 55) warnings.push("Best, expected, and worst cases are too far apart.");
  if (reliability.predictionVariance >= 60) warnings.push("Predicted outcome variance is high.");
  if (reliability.dataTrustScore < 60) warnings.push("Data trust is limited by missing, unverified, stale, or weak inputs.");
  if (reliability.modelRiskScore >= 60) warnings.push("Model risk is elevated and may understate real execution exposure.");
  if (reliability.overconfidenceDetected && reliability.overconfidenceReason) warnings.push(reliability.overconfidenceReason);
  if (reliability.uncertaintyLevel === "extreme") warnings.push("Uncertainty is extreme; refuse action recommendation until data improves.");
  if (reliability.decisionSafety.shouldBlockDecision && reliability.decisionSafety.reason) warnings.push(reliability.decisionSafety.reason);
  if (simulation.predictedBlockers.length >= 5) warnings.push("Unresolved blocker count is high.");

  return unique(warnings);
}

export function calculateSimulationReliability(
  simulation: StrategyExecutionSimulation,
  context: unknown = {},
): SimulationReliabilityResult {
  const confidenceResult = calculateSimulationConfidence(simulation, context);
  const confidenceSpread = calculateConfidenceSpread(simulation);
  const predictionVariance = calculatePredictionVariance(simulation);
  const dataTrustScore = calculateDataTrustScore(context);
  const overconfidence = detectOverconfidence(simulation, confidenceResult);
  const modelRiskScore = calculateModelRiskScore({
    simulation,
    confidenceSpread,
    predictionVariance,
    dataTrustScore,
    overconfidenceDetected: overconfidence.overconfidenceDetected,
  });
  const uncertaintyLevel = getUncertaintyLevel(modelRiskScore);
  const reliabilityScore = clampScore(
    confidenceResult.confidenceScore * 0.22 +
      dataTrustScore * 0.24 +
      simulation.expectedCase.successProbability * 0.14 +
      simulation.worstCase.successProbability * 0.12 +
      (100 - confidenceSpread.spreadScore) * 0.1 +
      (100 - predictionVariance) * 0.09 +
      (100 - modelRiskScore) * 0.09,
  );
  const reliabilityShell = {
    reliabilityScore,
    dataTrustScore,
    modelRiskScore,
    overconfidenceDetected: overconfidence.overconfidenceDetected,
    uncertaintyLevel,
  };
  const decisionSafety = determineIfSimulationIsDecisionSafe(simulation, reliabilityShell);
  const reliabilityForWarnings = {
    reliabilityScore,
    confidenceSpread,
    predictionVariance,
    dataTrustScore,
    modelRiskScore,
    overconfidenceDetected: overconfidence.overconfidenceDetected,
    overconfidenceReason: overconfidence.overconfidenceReason,
    uncertaintyLevel,
    decisionSafety,
  };

  return {
    strategy: simulation.normalizedStrategy || simulation.strategy,
    reliabilityScore,
    reliabilityLabel: getReliabilityLabel(reliabilityScore),
    confidenceSpread,
    predictionVariance,
    dataTrustScore,
    modelRiskScore,
    overconfidenceDetected: overconfidence.overconfidenceDetected,
    overconfidenceReason: overconfidence.overconfidenceReason,
    uncertaintyLevel,
    decisionSafety,
    reliabilityWarnings: generateReliabilityWarnings(simulation, reliabilityForWarnings),
  };
}
