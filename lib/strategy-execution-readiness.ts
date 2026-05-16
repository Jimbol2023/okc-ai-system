export type ExecutionDecision = "GO" | "HOLD" | "STOP";
export type ExecutionRiskLevel = "low" | "medium" | "high" | "critical";

export type ExecutionBlocker = {
  type: "data" | "seller" | "buyer" | "financial" | "legal" | "market" | "title" | "operations";
  issue: string;
  severity: "low" | "medium" | "high" | "critical";
  fix: string;
};

export type ExecutionReadinessInput = {
  lead?: unknown;
  assetClassification?: unknown;
  strategyReadiness?: unknown;
  strategyDecision?: unknown;
  strategyComparison?: unknown;
};

export type ExecutionReadinessResult = {
  executionDecision: ExecutionDecision;
  readinessScore: number;
  executionConfidence: number;
  executionRiskLevel: ExecutionRiskLevel;
  failureProbability: number;
  timeToExecution: "immediate" | "short" | "medium" | "long";
  blockers: ExecutionBlocker[];
  predictiveSignals: {
    sellerExecutionRisk: number;
    buyerExecutionRisk: number;
    titleRisk: number;
    fundingRisk: number;
    marketTimingRisk: number;
    operationalComplexityRisk: number;
  };
  learningHooks: {
    recommendedMemoryEvent: string;
    futureMetricsToTrack: string[];
    shouldLogForLearning: boolean;
  };
  futureAutomationCompatibility: {
    canTriggerApprovalGateLater: boolean;
    canTriggerBuyerRoutingLater: boolean;
    canTriggerFollowUpLater: boolean;
    requiresHumanApprovalBeforeExecution: boolean;
  };
  executionSummary: string;
};

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonRecord) : {};
}

function getPath(source: unknown, paths: string[]) {
  for (const path of paths) {
    const value = path.split(".").reduce<unknown>((current, key) => asRecord(current)[key], source);

    if (hasValue(value)) {
      return value;
    }
  }

  return null;
}

function hasValue(value: unknown) {
  return value !== undefined && value !== null && value !== "";
}

function getNumber(source: unknown, paths: string[], fallback: number | null = null) {
  const value = getPath(source, paths);
  const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;

  return Number.isFinite(parsed) ? parsed : fallback;
}

function getBoolean(source: unknown, paths: string[], fallback = false) {
  const value = getPath(source, paths);

  return typeof value === "boolean" ? value : fallback;
}

function getString(source: unknown, paths: string[]) {
  const value = getPath(source, paths);

  return typeof value === "string" ? value.trim() : "";
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalizeText(value: string) {
  return value.toLowerCase();
}

function hasAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function getStrategyName(input: ExecutionReadinessInput) {
  return getString(input.strategyComparison, ["bestStrategy"]) ||
    getString(input.strategyDecision, ["recommendedStrategy"]) ||
    getString(input.strategyReadiness, ["recommendedStrategy"]);
}

function getCombinedNotes(input: ExecutionReadinessInput) {
  return normalizeText([
    getString(input.lead, ["notes", "sellerNotes", "property.notes", "analyzer.notes"]),
    getString(input.strategyDecision, ["reason", "portfolioFit"]),
    getString(input.strategyComparison, ["summary", "investorSummary", "confidenceExplanation"]),
  ].filter(Boolean).join(" "));
}

function getTopStrategy(input: ExecutionReadinessInput) {
  const comparison = asRecord(input.strategyComparison);
  const viableStrategies = comparison.viableStrategies;
  const strategies = comparison.strategies;
  const viableList = Array.isArray(viableStrategies) ? viableStrategies : [];
  const strategyList = Array.isArray(strategies) ? strategies : [];

  return asRecord(viableList[0] ?? strategyList[0]);
}

function getTopComparisonConfidence(input: ExecutionReadinessInput) {
  const topStrategy = getTopStrategy(input);
  const topConfidence = getNumber(topStrategy, ["confidenceScore"]);
  const comparisonConfidence = getNumber(input.strategyComparison, ["decisionPressureScore"]);
  const decisionConfidence = getNumber(input.strategyDecision, ["strategyConfidence"]);

  return topConfidence ?? comparisonConfidence ?? decisionConfidence ?? 70;
}

function addBlocker(blockers: ExecutionBlocker[], blocker: ExecutionBlocker) {
  if (!blockers.some((item) => item.type === blocker.type && item.issue === blocker.issue)) {
    blockers.push(blocker);
  }
}

function needsRepairEstimate(strategyName: string) {
  return hasAny(strategyName, ["flip", "rehab", "brrrr", "luxury", "development", "construction"]);
}

function needsFundingPath(strategyName: string) {
  return hasAny(strategyName, ["buy_and_hold", "rental", "brrrr", "luxury", "creative", "subject_to", "seller_finance", "development", "construction"]);
}

function needsBuyerDemand(strategyName: string) {
  return hasAny(strategyName, ["wholesale", "assignment", "land", "flip", "development"]);
}

function getBlockers(input: ExecutionReadinessInput) {
  const blockers: ExecutionBlocker[] = [];
  const strategyName = normalizeText(getStrategyName(input));
  const notes = getCombinedNotes(input);
  const topStrategy = getTopStrategy(input);
  const address = getString(input.lead, ["address", "propertyAddress", "streetAddress", "fullAddress", "property.address"]);
  const sellerPhone = getString(input.lead, ["sellerPhone", "phone", "seller.phone", "contact.phone", "phoneNumber"]);
  const sellerEmail = getString(input.lead, ["sellerEmail", "email", "seller.email", "contact.email"]);
  const askingPrice = getNumber(input.lead, ["askingPrice", "estimatedPrice", "price", "property.askingPrice", "analyzer.askingPrice"]);
  const arv = getNumber(input.lead, ["arv", "estimatedArv", "afterRepairValue", "property.arv", "analyzer.arv"]);
  const repairs = getNumber(input.lead, ["estimatedRepairs", "repairEstimate", "repairs", "property.estimatedRepairs", "analyzer.estimatedRepairs"]);
  const knownBuyerDemand = getBoolean(input.lead, ["knownBuyerDemand", "buyerDemandValidated"]) ||
    getBoolean(input.assetClassification, ["knownBuyerDemand"]) ||
    getBoolean(input.strategyDecision, ["knownBuyerDemand"]);
  const exitStrategyValidated = getBoolean(input.lead, ["exitStrategyValidated"]) || getBoolean(input.strategyComparison, ["exitStrategyValidated"]);
  const fundingPath = getString(input.lead, ["fundingPath", "financingPlan", "capitalSource", "funding.source"]);
  const titleConfidence = getBoolean(input.lead, ["titleConfidence", "ownershipConfidence", "title.clear", "titleConfidenceVerified"]);
  const portfolioFit = getString(input.strategyDecision, ["portfolioFit"]);
  const comparisonConfidence = getTopComparisonConfidence(input);
  const volatility = getNumber(topStrategy, ["volatilityScore"], getNumber(input.strategyComparison, ["decisionPressureScore"], 50));

  if (!address) {
    addBlocker(blockers, {
      type: "data",
      issue: "Missing property address",
      severity: "high",
      fix: "Verify the property address before execution review.",
    });
  }

  if (!sellerPhone && !sellerEmail) {
    addBlocker(blockers, {
      type: "seller",
      issue: "Missing seller contact information",
      severity: "medium",
      fix: "Add verified seller phone or email before outreach approval.",
    });
  }

  if (askingPrice === null) {
    addBlocker(blockers, {
      type: "financial",
      issue: "Missing asking price or estimated price",
      severity: "high",
      fix: "Add asking price, seller price, or a documented estimated price.",
    });
  }

  if (arv === null || comparisonConfidence < 50) {
    addBlocker(blockers, {
      type: "market",
      issue: "Missing or weak ARV/comps confidence",
      severity: arv === null ? "high" : "medium",
      fix: "Verify ARV with comps before execution.",
    });
  }

  if (needsRepairEstimate(strategyName) && repairs === null) {
    addBlocker(blockers, {
      type: "operations",
      issue: "Missing repair estimate for repair-sensitive strategy",
      severity: "high",
      fix: "Add repair estimate or contractor-backed repair range.",
    });
  }

  if (needsBuyerDemand(strategyName) && !knownBuyerDemand) {
    addBlocker(blockers, {
      type: "buyer",
      issue: "Missing buyer demand validation",
      severity: strategyName.includes("land") ? "high" : "medium",
      fix: "Validate buyer demand or buyer pool before execution.",
    });
  }

  if (!exitStrategyValidated) {
    addBlocker(blockers, {
      type: "market",
      issue: "Missing exit strategy validation",
      severity: "medium",
      fix: "Confirm intended exit, buyer channel, or hold model before execution.",
    });
  }

  if (needsFundingPath(strategyName) && !fundingPath) {
    addBlocker(blockers, {
      type: "financial",
      issue: "Missing funding path",
      severity: hasAny(strategyName, ["luxury", "development", "construction"]) ? "critical" : "high",
      fix: "Confirm funding source, terms path, or capital approval before execution.",
    });
  }

  if (!titleConfidence || hasAny(notes, ["title issue", "clouded title", "ownership dispute", "probate", "lien"])) {
    addBlocker(blockers, {
      type: "title",
      issue: "Missing title/ownership confidence",
      severity: hasAny(notes, ["clouded title", "ownership dispute", "lien"]) ? "critical" : "high",
      fix: "Verify title, ownership, and lien posture before execution.",
    });
  }

  if (hasAny(notes, ["lawsuit", "code violation", "legal dispute", "foreclosure auction"]) || getBoolean(input.lead, ["legalBlocker"])) {
    addBlocker(blockers, {
      type: "legal",
      issue: "Potential legal blocker requires review",
      severity: "critical",
      fix: "Escalate for human legal/title review before execution.",
    });
  }

  if (portfolioFit === "weak" || volatility !== null && volatility >= 75) {
    addBlocker(blockers, {
      type: "operations",
      issue: "High volatility or weak portfolio fit",
      severity: "medium",
      fix: "Review risk, disposition path, and portfolio fit before execution.",
    });
  }

  if (comparisonConfidence < 55 || getString(input.strategyDecision, ["strategyReadiness"]) === "manual_review") {
    addBlocker(blockers, {
      type: "data",
      issue: "Prior strategy confidence requires human review",
      severity: comparisonConfidence < 45 ? "high" : "medium",
      fix: "Resolve confidence gaps before execution.",
    });
  }

  return blockers;
}

function blockerRisk(blockers: ExecutionBlocker[], types: ExecutionBlocker["type"][]) {
  const severityWeight = {
    low: 15,
    medium: 35,
    high: 65,
    critical: 95,
  };
  const matching = blockers.filter((blocker) => types.includes(blocker.type));

  if (matching.length === 0) {
    return 10;
  }

  return clampScore(Math.max(...matching.map((blocker) => severityWeight[blocker.severity])) + Math.min(20, matching.length * 5));
}

function getPredictiveSignals(input: ExecutionReadinessInput, blockers: ExecutionBlocker[]) {
  const strategyName = normalizeText(getStrategyName(input));
  const topStrategy = getTopStrategy(input);
  const volatility = getNumber(topStrategy, ["volatilityScore"], 50) ?? 50;
  const riskScore = getNumber(topStrategy, ["riskScore"], 60) ?? 60;

  return {
    sellerExecutionRisk: blockerRisk(blockers, ["seller"]),
    buyerExecutionRisk: clampScore(blockerRisk(blockers, ["buyer"]) + (needsBuyerDemand(strategyName) ? 5 : 0)),
    titleRisk: blockerRisk(blockers, ["title", "legal"]),
    fundingRisk: clampScore(blockerRisk(blockers, ["financial"]) + (needsFundingPath(strategyName) ? 8 : 0)),
    marketTimingRisk: clampScore(blockerRisk(blockers, ["market"]) + volatility * 0.35),
    operationalComplexityRisk: clampScore(blockerRisk(blockers, ["operations"]) + Math.max(0, 70 - riskScore) * 0.3),
  };
}

function getReadinessScore(blockers: ExecutionBlocker[]) {
  const penalty = blockers.reduce((total, blocker) => {
    if (blocker.severity === "critical") return total + 30;
    if (blocker.severity === "high") return total + 20;
    if (blocker.severity === "medium") return total + 10;
    return total + 5;
  }, 0);

  return clampScore(100 - penalty);
}

function getExecutionConfidence(input: ExecutionReadinessInput, blockers: ExecutionBlocker[]) {
  const baseConfidence = getTopComparisonConfidence(input);
  const penalty = blockers.reduce((total, blocker) => {
    if (blocker.severity === "critical") return total + 20;
    if (blocker.severity === "high") return total + 12;
    if (blocker.severity === "medium") return total + 6;
    return total + 3;
  }, 0);

  return clampScore(baseConfidence - penalty);
}

function getFailureProbability(readinessScore: number, predictiveSignals: ExecutionReadinessResult["predictiveSignals"]) {
  const signalValues = Object.values(predictiveSignals);
  const averageSignal = signalValues.reduce((total, signal) => total + signal, 0) / signalValues.length;

  return clampScore(100 - readinessScore + averageSignal * 0.25);
}

function getExecutionRiskLevel(failureProbability: number): ExecutionRiskLevel {
  if (failureProbability >= 75) return "critical";
  if (failureProbability >= 50) return "high";
  if (failureProbability >= 25) return "medium";
  return "low";
}

function hasCriticalLegalTitleFinancialBlocker(blockers: ExecutionBlocker[]) {
  return blockers.some((blocker) => blocker.severity === "critical" && ["legal", "title", "financial"].includes(blocker.type));
}

function getExecutionDecision({
  readinessScore,
  executionConfidence,
  failureProbability,
  blockers,
}: {
  readinessScore: number;
  executionConfidence: number;
  failureProbability: number;
  blockers: ExecutionBlocker[];
}): ExecutionDecision {
  const hasHighOrCritical = blockers.some((blocker) => blocker.severity === "high" || blocker.severity === "critical");
  const hasCritical = blockers.some((blocker) => blocker.severity === "critical");
  const criticalBlockersAreFixableData = blockers
    .filter((blocker) => blocker.severity === "critical")
    .every((blocker) => blocker.type === "data");

  if (readinessScore < 50 || failureProbability >= 60 || hasCriticalLegalTitleFinancialBlocker(blockers)) {
    return "STOP";
  }

  if (readinessScore >= 80 && executionConfidence >= 75 && failureProbability < 30 && !hasHighOrCritical) {
    return "GO";
  }

  if (readinessScore >= 50 && (!hasCritical || criticalBlockersAreFixableData) && failureProbability < 60) {
    return "HOLD";
  }

  return "STOP";
}

function getTimeToExecution(decision: ExecutionDecision, blockers: ExecutionBlocker[]): ExecutionReadinessResult["timeToExecution"] {
  if (decision === "GO") return blockers.length === 0 ? "immediate" : "short";
  if (decision === "STOP") return "long";

  if (blockers.some((blocker) => blocker.severity === "high" || blocker.severity === "critical")) {
    return "medium";
  }

  return "short";
}

function getExecutionSummary(result: Omit<ExecutionReadinessResult, "executionSummary" | "learningHooks" | "futureAutomationCompatibility">) {
  const topBlocker = result.blockers[0];

  if (result.executionDecision === "GO") {
    return `Execution readiness is GO with a ${result.readinessScore}/100 readiness score and ${result.failureProbability}/100 failure probability. Human approval is still required before any execution.`;
  }

  if (result.executionDecision === "HOLD") {
    return `Execution readiness is HOLD because ${topBlocker ? topBlocker.issue.toLowerCase() : "execution data needs review"}. Resolve blockers before action; this engine did not trigger outreach, routing, or automation.`;
  }

  return `Execution readiness is STOP because ${topBlocker ? topBlocker.issue.toLowerCase() : "failure probability is too high"}. Human review is required before any execution path is considered.`;
}

function getLearningHooks(): ExecutionReadinessResult["learningHooks"] {
  return {
    recommendedMemoryEvent: "execution_readiness_evaluated",
    futureMetricsToTrack: [
      "strategyChosen",
      "executionDecision",
      "readinessScore",
      "failureProbability",
      "actualOutcome",
      "dealClosed",
      "dealLostReason",
    ],
    shouldLogForLearning: true,
  };
}

function getFutureAutomationCompatibility(executionDecision: ExecutionDecision): ExecutionReadinessResult["futureAutomationCompatibility"] {
  return {
    canTriggerApprovalGateLater: executionDecision === "GO" || executionDecision === "HOLD",
    canTriggerBuyerRoutingLater: executionDecision === "GO",
    canTriggerFollowUpLater: executionDecision === "HOLD",
    requiresHumanApprovalBeforeExecution: true,
  };
}

export function evaluateExecutionReadiness(input: ExecutionReadinessInput): ExecutionReadinessResult {
  const blockers = getBlockers(input);
  const readinessScore = getReadinessScore(blockers);
  const executionConfidence = getExecutionConfidence(input, blockers);
  const predictiveSignals = getPredictiveSignals(input, blockers);
  const failureProbability = getFailureProbability(readinessScore, predictiveSignals);
  const executionRiskLevel = getExecutionRiskLevel(failureProbability);
  const executionDecision = getExecutionDecision({
    readinessScore,
    executionConfidence,
    failureProbability,
    blockers,
  });
  const partialResult = {
    executionDecision,
    readinessScore,
    executionConfidence,
    executionRiskLevel,
    failureProbability,
    timeToExecution: getTimeToExecution(executionDecision, blockers),
    blockers,
    predictiveSignals,
  };

  return {
    ...partialResult,
    learningHooks: getLearningHooks(),
    futureAutomationCompatibility: getFutureAutomationCompatibility(executionDecision),
    executionSummary: getExecutionSummary(partialResult),
  };
}
