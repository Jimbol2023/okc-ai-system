import {
  decideStrategy,
  type StrategyDecisionInput,
  type StrategyDecisionResult,
  type StrategyRiskFlag,
  type StrategyScoreBreakdown,
  type StrategyScoreMatrix,
} from "@/lib/strategy-decision-engine";

type StrategyBreakdownItem = StrategyScoreBreakdown[keyof StrategyScoreBreakdown];

export type RecommendationStrength = "weak" | "moderate" | "strong" | "very_strong";

export type StrategyComparisonInput = StrategyDecisionInput & {
  leadId?: string;
  strategyDecision?: StrategyDecisionResult | null;
  strategyScores?: Partial<StrategyScoreMatrix> | null;
  strategyScoreBreakdown?: Partial<StrategyScoreBreakdown> | null;
};

export type StrategyComparisonItem = {
  strategy: string;
  score: number;
  roiScore: number;
  riskScore: number;
  speedScore: number;
  capitalEfficiencyScore: number;
  executionDifficultyScore: number;
  confidenceScore: number;
  totalComparisonScore: number;
  pros: string[];
  cons: string[];
  tradeOffs: string[];
};

export type StrategyPairComparison = {
  strategyA: string;
  strategyB: string;
  scoreDelta: number;
  roiDelta: number;
  riskDelta: number;
  speedDelta: number;
  confidenceDelta: number;
  betterIn: string[];
  worseIn: string[];
  summary: string;
};

export type StrategyDominanceResult = {
  strategy: string;
  dominanceScore: number;
  rank: number;
  explanation: string;
};

export type StrategyComparisonResult = {
  leadId?: string;
  bestStrategy: string | null;
  recommendationStrength: RecommendationStrength;
  strategies: StrategyComparisonItem[];
  comparisons: StrategyPairComparison[];
  dominance: StrategyDominanceResult[];
  summary: string;
  warnings: string[];
};

const STRATEGY_SPEED: Record<string, number> = {
  wholesale: 90,
  land_flip: 70,
  buy_and_hold_rental: 45,
  brrrr: 35,
  creative_finance: 55,
  subject_to: 60,
  seller_finance: 50,
  luxury_acquisition: 35,
  development_or_construction: 20,
};

const STRATEGY_CAPITAL_EFFICIENCY: Record<string, number> = {
  wholesale: 85,
  land_flip: 70,
  buy_and_hold_rental: 45,
  brrrr: 55,
  creative_finance: 90,
  subject_to: 95,
  seller_finance: 85,
  luxury_acquisition: 25,
  development_or_construction: 20,
};

const STRATEGY_EXECUTION_DIFFICULTY: Record<string, number> = {
  wholesale: 35,
  land_flip: 45,
  buy_and_hold_rental: 55,
  brrrr: 75,
  creative_finance: 70,
  subject_to: 75,
  seller_finance: 65,
  luxury_acquisition: 80,
  development_or_construction: 90,
};

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalizeScore(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? clampScore(value) : fallback;
}

function getRiskPenalty(riskFlags: StrategyRiskFlag[]) {
  return riskFlags.reduce((total, risk) => total + risk.impactScore, 0);
}

function getStrategySpecificRisk(strategy: string, riskFlags: StrategyRiskFlag[]) {
  const basePenalty = getRiskPenalty(riskFlags);
  const complexityPenalty = STRATEGY_EXECUTION_DIFFICULTY[strategy] >= 75 ? 8 : 0;
  const heavyRepairPenalty = riskFlags.some((risk) => risk.type === "heavy_repair_risk") && strategy !== "wholesale" ? 8 : 0;

  return clampScore(basePenalty + complexityPenalty + heavyRepairPenalty);
}

function getRoiScore(strategy: string, score: number, breakdown: StrategyBreakdownItem | undefined) {
  if (!breakdown) {
    return score;
  }

  const upside = breakdown.equityScore + breakdown.arvScore + breakdown.demandScore;
  const strategyBoost = strategy === "brrrr" || strategy === "buy_and_hold_rental" ? breakdown.repairImpact * 0.5 : 0;

  return clampScore(upside * 1.35 + strategyBoost);
}

function getConfidenceScore({
  baseConfidence,
  readinessScore,
  strategyScore,
  missingCount,
  riskFlags,
}: {
  baseConfidence: number;
  readinessScore: number;
  strategyScore: number;
  missingCount: number;
  riskFlags: StrategyRiskFlag[];
}) {
  const riskClarityScore = riskFlags.length === 0 ? 100 : Math.max(35, 100 - riskFlags.length * 12);

  return clampScore(baseConfidence * 0.35 + readinessScore * 0.25 + strategyScore * 0.2 + riskClarityScore * 0.1 - missingCount * 4);
}

function getPros(strategy: string, item: Omit<StrategyComparisonItem, "pros" | "cons" | "tradeOffs">) {
  const pros: string[] = [];

  if (item.roiScore >= 70) pros.push("Strong upside/ROI signal");
  if (item.riskScore >= 70) pros.push("Lower relative risk");
  if (item.speedScore >= 70) pros.push("Faster execution path");
  if (item.capitalEfficiencyScore >= 70) pros.push("Efficient use of capital");
  if (item.confidenceScore >= 70) pros.push("Decision confidence is healthy");
  if (strategy === "wholesale") pros.push("Works well as a low-hold-time disposition path");
  if (strategy === "subject_to" || strategy === "seller_finance" || strategy === "creative_finance") pros.push("Can preserve cash if terms are real");

  return pros.length > 0 ? pros : ["No standout advantage from current inputs"];
}

function getCons(strategy: string, item: Omit<StrategyComparisonItem, "pros" | "cons" | "tradeOffs">) {
  const cons: string[] = [];

  if (item.roiScore < 45) cons.push("Upside signal is limited");
  if (item.riskScore < 50) cons.push("Risk-adjusted score is weak");
  if (item.speedScore < 45) cons.push("Likely slower execution");
  if (item.executionDifficultyScore > 70) cons.push("Execution complexity is high");
  if (item.capitalEfficiencyScore < 45) cons.push("Requires heavier capital commitment");
  if (item.confidenceScore < 55) cons.push("Confidence is limited by missing or unclear data");
  if (strategy === "development_or_construction") cons.push("Requires specialized diligence before action");

  return cons;
}

function getTradeOffs(strategy: string, item: Omit<StrategyComparisonItem, "pros" | "cons" | "tradeOffs">) {
  const tradeOffs: string[] = [];

  if (item.roiScore >= 70 && item.speedScore < 50) tradeOffs.push("Higher upside may require slower execution");
  if (item.speedScore >= 70 && item.roiScore < 55) tradeOffs.push("Faster path may cap upside");
  if (item.capitalEfficiencyScore >= 70 && item.executionDifficultyScore >= 65) tradeOffs.push("Capital efficient, but operationally complex");
  if (strategy === "brrrr") tradeOffs.push("Potential upside depends on rehab and refinance assumptions");
  if (strategy === "buy_and_hold_rental") tradeOffs.push("Portfolio value depends on verified rent and management assumptions");

  return tradeOffs.length > 0 ? tradeOffs : ["No major trade-off identified from current inputs"];
}

function getComparisonItem({
  strategy,
  score,
  breakdown,
  decision,
}: {
  strategy: string;
  score: number;
  breakdown?: StrategyBreakdownItem;
  decision: StrategyDecisionResult;
}): StrategyComparisonItem {
  const roiScore = getRoiScore(strategy, score, breakdown);
  const riskPenalty = getStrategySpecificRisk(strategy, decision.riskFlags);
  const riskScore = clampScore(100 - riskPenalty);
  const speedScore = normalizeScore(STRATEGY_SPEED[strategy], 50);
  const capitalEfficiencyScore = normalizeScore(STRATEGY_CAPITAL_EFFICIENCY[strategy], 50);
  const executionDifficultyScore = normalizeScore(STRATEGY_EXECUTION_DIFFICULTY[strategy], 55);
  const readinessScore = breakdown?.readinessScore ? clampScore(breakdown.readinessScore / 0.15) : decision.strategyConfidence;
  const confidenceScore = getConfidenceScore({
    baseConfidence: decision.strategyConfidence,
    readinessScore,
    strategyScore: score,
    missingCount: decision.requiredMissingData.length,
    riskFlags: decision.riskFlags,
  });
  const totalComparisonScore = clampScore(
    score * 0.3 +
      roiScore * 0.2 +
      riskScore * 0.2 +
      speedScore * 0.1 +
      capitalEfficiencyScore * 0.1 +
      confidenceScore * 0.1,
  );
  const baseItem = {
    strategy,
    score,
    roiScore,
    riskScore,
    speedScore,
    capitalEfficiencyScore,
    executionDifficultyScore,
    confidenceScore,
    totalComparisonScore,
  };

  return {
    ...baseItem,
    pros: getPros(strategy, baseItem),
    cons: getCons(strategy, baseItem),
    tradeOffs: getTradeOffs(strategy, baseItem),
  };
}

function comparePair(strategyA: StrategyComparisonItem, strategyB: StrategyComparisonItem): StrategyPairComparison {
  const betterIn: string[] = [];
  const worseIn: string[] = [];
  const metrics = [
    ["score", strategyA.score - strategyB.score],
    ["roi", strategyA.roiScore - strategyB.roiScore],
    ["risk", strategyA.riskScore - strategyB.riskScore],
    ["speed", strategyA.speedScore - strategyB.speedScore],
    ["confidence", strategyA.confidenceScore - strategyB.confidenceScore],
  ] as const;

  for (const [metric, delta] of metrics) {
    if (delta > 0) betterIn.push(metric);
    if (delta < 0) worseIn.push(metric);
  }

  return {
    strategyA: strategyA.strategy,
    strategyB: strategyB.strategy,
    scoreDelta: strategyA.score - strategyB.score,
    roiDelta: strategyA.roiScore - strategyB.roiScore,
    riskDelta: strategyA.riskScore - strategyB.riskScore,
    speedDelta: strategyA.speedScore - strategyB.speedScore,
    confidenceDelta: strategyA.confidenceScore - strategyB.confidenceScore,
    betterIn,
    worseIn,
    summary: `${strategyA.strategy} is ${Math.abs(strategyA.totalComparisonScore - strategyB.totalComparisonScore)} points ${strategyA.totalComparisonScore >= strategyB.totalComparisonScore ? "ahead of" : "behind"} ${strategyB.strategy} on total comparison score.`,
  };
}

function downgradeStrength(strength: RecommendationStrength): RecommendationStrength {
  if (strength === "very_strong") return "strong";
  if (strength === "strong") return "moderate";
  if (strength === "moderate") return "weak";
  return "weak";
}

function getRecommendationStrength(strategies: StrategyComparisonItem[], warnings: string[]): RecommendationStrength {
  const gap = (strategies[0]?.totalComparisonScore ?? 0) - (strategies[1]?.totalComparisonScore ?? 0);
  let strength: RecommendationStrength = "weak";

  if (gap >= 25) strength = "very_strong";
  else if (gap >= 15) strength = "strong";
  else if (gap >= 7) strength = "moderate";

  if (warnings.includes("Recommendation confidence is limited because some deal data is incomplete.")) {
    strength = downgradeStrength(strength);
  }

  return strength;
}

function getWarnings(decision: StrategyDecisionResult, strategies: StrategyComparisonItem[]) {
  const warnings: string[] = [];

  if (decision.requiredMissingData.length > 0 || strategies.some((strategy) => strategy.confidenceScore < 55)) {
    warnings.push("Recommendation confidence is limited because some deal data is incomplete.");
  }

  if (decision.riskFlags.some((risk) => risk.severity === "high")) {
    warnings.push("High-impact risk flags are present.");
  }

  if (strategies.length < 2) {
    warnings.push("Not enough viable strategies to compare confidently.");
  }

  return warnings;
}

function getDominance(strategies: StrategyComparisonItem[]): StrategyDominanceResult[] {
  return strategies.map((strategy, index) => ({
    strategy: strategy.strategy,
    dominanceScore: strategy.totalComparisonScore,
    rank: index + 1,
    explanation: `${strategy.strategy} ranks #${index + 1} with strongest combined score across ROI, risk, speed, capital efficiency, and confidence.`,
  }));
}

export function compareStrategies(input: StrategyComparisonInput): StrategyComparisonResult {
  const decision = input.strategyDecision ?? decideStrategy(input);
  const scoreSource = input.strategyScores ?? decision.strategyScores ?? {};
  const breakdownSource = input.strategyScoreBreakdown ?? decision.strategyScoreBreakdown ?? {};
  const strategies = Object.entries(scoreSource)
    .map(([strategy, rawScore]) => getComparisonItem({
      strategy,
      score: normalizeScore(rawScore),
      breakdown: breakdownSource[strategy as keyof typeof breakdownSource],
      decision,
    }))
    .filter((strategy) => strategy.score > 0)
    .sort((a, b) => b.totalComparisonScore - a.totalComparisonScore);
  const comparisons: StrategyPairComparison[] = [];

  for (let i = 0; i < strategies.length; i += 1) {
    for (let j = i + 1; j < strategies.length; j += 1) {
      comparisons.push(comparePair(strategies[i], strategies[j]));
    }
  }

  const warnings = getWarnings(decision, strategies);
  const bestStrategy = strategies[0]?.strategy ?? null;
  const recommendationStrength = getRecommendationStrength(strategies, warnings);
  const runnerUp = strategies[1];
  const summary = bestStrategy
    ? `${bestStrategy} is the top-ranked strategy${runnerUp ? `, leading ${runnerUp.strategy} by ${strategies[0].totalComparisonScore - runnerUp.totalComparisonScore} points` : ""}. Recommendation strength is ${recommendationStrength}.`
    : "No viable strategy comparison could be produced from the available inputs.";

  return {
    leadId: input.leadId,
    bestStrategy,
    recommendationStrength,
    strategies,
    comparisons,
    dominance: getDominance(strategies),
    summary,
    warnings,
  };
}
