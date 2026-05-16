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

export type StrategyCategory =
  | "quick_cash"
  | "value_add"
  | "long_term_hold"
  | "development"
  | "luxury"
  | "creative_finance"
  | "review_required";

export type StrategyComparisonInput = StrategyDecisionInput & {
  leadId?: string;
  availableCapital?: number | null;
  strategyDecision?: StrategyDecisionResult | null;
  strategyScores?: Partial<StrategyScoreMatrix> | null;
  strategyScoreBreakdown?: Partial<StrategyScoreBreakdown> | null;
};

export type StrategyComparisonItem = {
  strategy: string;
  isViable: boolean;
  viabilityReason: string;
  category: StrategyCategory;
  score: number;
  roiScore: number;
  riskScore: number;
  speedScore: number;
  capitalEfficiencyScore: number;
  executionDifficultyScore: number;
  confidenceScore: number;
  volatilityScore: number;
  volatilityExplanation: string;
  confidenceExplanation: string;
  totalComparisonScore: number;
  pros: string[];
  cons: string[];
  tradeOffs: string[];
};

export type StrategyScenarioResult = {
  name: "conservative" | "expected" | "aggressive";
  bestStrategy: string | null;
  recommendationStrength: RecommendationStrength;
  topStrategies: {
    strategy: string;
    adjustedScore: number;
    explanation: string;
  }[];
  warnings: string[];
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
  viableStrategies: StrategyComparisonItem[];
  excludedStrategies: StrategyComparisonItem[];
  categoryWinners: {
    category: StrategyCategory;
    bestStrategy: string | null;
    explanation: string;
  }[];
  scenarios: {
    conservative: StrategyScenarioResult;
    expected: StrategyScenarioResult;
    aggressive: StrategyScenarioResult;
  };
  investorSummary: string;
  confidenceExplanation: string;
  comparisons: StrategyPairComparison[];
  dominance: StrategyDominanceResult[];
  summary: string;
  warnings: string[];
};

type StrategyComparisonMetrics = Omit<
  StrategyComparisonItem,
  "pros" | "cons" | "tradeOffs" | "isViable" | "viabilityReason" | "category" | "volatilityScore" | "volatilityExplanation" | "confidenceExplanation"
>;

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

function hasValue(value: unknown) {
  return value !== undefined && value !== null && value !== "";
}

function normalizeStrategyName(strategyName: string) {
  return strategyName.trim().toLowerCase();
}

function hasStrategyTerm(strategyName: string, terms: string[]) {
  const normalized = normalizeStrategyName(strategyName);

  return terms.some((term) => normalized.includes(term));
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

export function getStrategyCategory(strategyName: string): StrategyCategory {
  if (hasStrategyTerm(strategyName, ["wholesale", "wholetail", "assignment"])) {
    return "quick_cash";
  }

  if (hasStrategyTerm(strategyName, ["flip", "rehab", "brrrr"])) {
    return "value_add";
  }

  if (hasStrategyTerm(strategyName, ["rental", "buy_and_hold", "airbnb", "short_term_rental"])) {
    return "long_term_hold";
  }

  if (hasStrategyTerm(strategyName, ["land", "construction", "development", "infill"])) {
    return "development";
  }

  if (hasStrategyTerm(strategyName, ["luxury", "estate", "high_end", "high-end"])) {
    return "luxury";
  }

  if (hasStrategyTerm(strategyName, ["subject_to", "seller_finance", "creative_finance", "wrap"])) {
    return "creative_finance";
  }

  return "review_required";
}

function getEstimatedRequiredCapital(strategy: string, input: StrategyComparisonInput) {
  const askingPrice = hasValue(input.askingPrice) ? Number(input.askingPrice) : 0;
  const repairs = hasValue(input.estimatedRepairs) ? Number(input.estimatedRepairs) : 0;

  if (hasStrategyTerm(strategy, ["wholesale", "assignment"])) {
    return Math.max(2500, askingPrice * 0.02);
  }

  if (hasStrategyTerm(strategy, ["subject_to", "seller_finance", "creative_finance", "wrap"])) {
    return Math.max(5000, askingPrice * 0.03);
  }

  if (hasStrategyTerm(strategy, ["land"])) {
    return Math.max(askingPrice * 0.25, 10000);
  }

  if (hasStrategyTerm(strategy, ["development", "construction", "luxury"])) {
    return askingPrice * 0.3 + repairs;
  }

  if (hasStrategyTerm(strategy, ["flip", "rehab", "brrrr"])) {
    return askingPrice * 0.2 + repairs;
  }

  if (hasStrategyTerm(strategy, ["rental", "buy_and_hold"])) {
    return askingPrice * 0.25 + repairs * 0.5;
  }

  return askingPrice * 0.2 + repairs * 0.5;
}

function getReadinessScoreForComparison(breakdown: StrategyBreakdownItem | undefined, decision: StrategyDecisionResult) {
  return breakdown?.readinessScore ? clampScore(breakdown.readinessScore / 0.15) : decision.strategyConfidence;
}

export function evaluateStrategyViability({
  strategy,
  input,
  readinessScore,
  confidenceScore,
  riskScore,
  missingCount,
}: {
  strategy: string;
  input: StrategyComparisonInput;
  readinessScore: number;
  confidenceScore: number;
  riskScore: number;
  missingCount: number;
}) {
  const reasons: string[] = [];
  const availableCapital = hasValue(input.availableCapital) ? Number(input.availableCapital) : null;
  const requiredCapital = getEstimatedRequiredCapital(strategy, input);
  const riskExposureScore = 100 - riskScore;

  if (availableCapital !== null && requiredCapital > availableCapital) {
    reasons.push(`estimated required capital (${Math.round(requiredCapital)}) exceeds available capital (${Math.round(availableCapital)})`);
  }

  if (hasValue(readinessScore) && readinessScore < 50) {
    reasons.push(`readiness score is below 50 (${readinessScore})`);
  }

  if (riskExposureScore > 85) {
    reasons.push(`risk exposure score is above 85 (${riskExposureScore})`);
  }

  if (missingCount > 0 && confidenceScore < 40) {
    reasons.push("critical data is missing and confidence is below 40");
  }

  return {
    isViable: reasons.length === 0,
    viabilityReason: reasons.length > 0 ? reasons.join("; ") : "Viable based on capital, readiness, risk, and available data checks.",
  };
}

export function calculateVolatilityScore({
  strategy,
  input,
  riskScore,
  confidenceScore,
  breakdown,
}: {
  strategy: string;
  input: StrategyComparisonInput;
  riskScore: number;
  confidenceScore: number;
  breakdown?: StrategyBreakdownItem;
}) {
  const reasons: string[] = [];
  let volatility = 30;
  const repairsMissing = !hasValue(input.estimatedRepairs);
  const repairs = hasValue(input.estimatedRepairs) ? Number(input.estimatedRepairs) : 0;
  const arv = hasValue(input.arv) ? Number(input.arv) : 0;
  const repairRatio = arv > 0 ? repairs / arv : null;

  if (repairsMissing) {
    volatility += 14;
    reasons.push("repair numbers are missing");
  } else if (repairRatio !== null && repairRatio >= 0.2) {
    volatility += 16;
    reasons.push("repair exposure is high");
  }

  if (!hasValue(input.arv) || (breakdown && breakdown.arvScore < 8)) {
    volatility += 12;
    reasons.push("ARV confidence is limited");
  }

  if (hasStrategyTerm(strategy, ["flip", "luxury", "development", "construction", "land", "brrrr"])) {
    volatility += 14;
    reasons.push("exit depends more heavily on resale/refinance market conditions");
  }

  if (riskScore < 45) {
    volatility += 16;
    reasons.push("risk-adjusted score is weak");
  }

  if (confidenceScore < 50) {
    volatility += 14;
    reasons.push("decision confidence is low");
  }

  if (hasStrategyTerm(strategy, ["wholesale", "assignment"]) && getEstimatedRequiredCapital(strategy, input) <= 10000) {
    volatility -= 16;
    reasons.push("low capital exposure reduces downside volatility");
  }

  if (confidenceScore >= 75) {
    volatility -= 10;
    reasons.push("high confidence lowers uncertainty");
  }

  if (riskScore >= 75) {
    volatility -= 8;
    reasons.push("risk-adjusted score is healthy");
  }

  const volatilityScore = clampScore(volatility);

  return {
    volatilityScore,
    volatilityExplanation: reasons.length > 0 ? reasons.join("; ") : "Volatility is moderate based on current strategy, risk, and data quality signals.",
  };
}

function getPros(strategy: string, item: StrategyComparisonMetrics) {
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

function getCons(strategy: string, item: StrategyComparisonMetrics) {
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

function getTradeOffs(strategy: string, item: StrategyComparisonMetrics) {
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
  input,
}: {
  strategy: string;
  score: number;
  breakdown?: StrategyBreakdownItem;
  decision: StrategyDecisionResult;
  input: StrategyComparisonInput;
}): StrategyComparisonItem {
  const roiScore = getRoiScore(strategy, score, breakdown);
  const riskPenalty = getStrategySpecificRisk(strategy, decision.riskFlags);
  const riskScore = clampScore(100 - riskPenalty);
  const speedScore = normalizeScore(STRATEGY_SPEED[strategy], 50);
  const capitalEfficiencyScore = normalizeScore(STRATEGY_CAPITAL_EFFICIENCY[strategy], 50);
  const executionDifficultyScore = normalizeScore(STRATEGY_EXECUTION_DIFFICULTY[strategy], 55);
  const readinessScore = getReadinessScoreForComparison(breakdown, decision);
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
  const category = getStrategyCategory(strategy);
  const viability = evaluateStrategyViability({
    strategy,
    input,
    readinessScore,
    confidenceScore,
    riskScore,
    missingCount: decision.requiredMissingData.length,
  });
  const volatility = calculateVolatilityScore({
    strategy,
    input,
    riskScore,
    confidenceScore,
    breakdown,
  });
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
  const confidenceExplanation = `Confidence is ${confidenceScore >= 70 ? "strong" : confidenceScore >= 50 ? "moderate" : "weak"} based on strategy score ${score}, readiness ${readinessScore}, ${decision.requiredMissingData.length} missing data item(s), and ${decision.riskFlags.length} risk flag(s).`;

  return {
    ...baseItem,
    ...viability,
    ...volatility,
    category,
    confidenceExplanation,
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

export function calculateCategoryWinners(viableStrategies: StrategyComparisonItem[]) {
  const categories: StrategyCategory[] = [
    "quick_cash",
    "value_add",
    "long_term_hold",
    "development",
    "luxury",
    "creative_finance",
    "review_required",
  ];

  return categories.map((category) => {
    const categoryStrategies = viableStrategies
      .filter((strategy) => strategy.category === category)
      .sort((a, b) => b.totalComparisonScore - a.totalComparisonScore);
    const bestStrategy = categoryStrategies[0];

    return {
      category,
      bestStrategy: bestStrategy?.strategy ?? null,
      explanation: bestStrategy
        ? `${bestStrategy.strategy} leads ${category} with a ${bestStrategy.totalComparisonScore}/100 comparison score and ${bestStrategy.volatilityScore}/100 volatility.`
        : `No viable ${category} strategy was identified from current inputs.`,
    };
  });
}

function getScenarioStrength(topStrategies: StrategyScenarioResult["topStrategies"], warnings: string[]) {
  const gap = (topStrategies[0]?.adjustedScore ?? 0) - (topStrategies[1]?.adjustedScore ?? 0);
  let strength: RecommendationStrength = "weak";

  if (gap >= 25) strength = "very_strong";
  else if (gap >= 15) strength = "strong";
  else if (gap >= 7) strength = "moderate";

  return warnings.length > 0 ? downgradeStrength(strength) : strength;
}

function buildScenario(
  name: StrategyScenarioResult["name"],
  viableStrategies: StrategyComparisonItem[],
  input: StrategyComparisonInput,
) {
  const warnings: string[] = [];
  const topStrategies = viableStrategies
    .map((strategy) => {
      const requiredCapital = getEstimatedRequiredCapital(strategy.strategy, input);
      const capitalPenalty = hasValue(input.availableCapital) && Number(input.availableCapital) > 0
        ? Math.min(20, (requiredCapital / Math.max(Number(input.availableCapital), 1)) * 10)
        : Math.min(12, requiredCapital / 50000);
      let adjustedScore = strategy.totalComparisonScore;
      const explanationParts: string[] = [];

      if (name === "conservative") {
        adjustedScore = strategy.totalComparisonScore - strategy.volatilityScore * 0.22 - capitalPenalty + strategy.riskScore * 0.08 + strategy.speedScore * 0.06;
        explanationParts.push("penalizes volatility, capital exposure, and rewards speed/risk control");
      } else if (name === "aggressive") {
        const categoryUpside = ["value_add", "luxury", "development"].includes(strategy.category) ? 8 : 0;
        adjustedScore = strategy.totalComparisonScore + strategy.roiScore * 0.12 + categoryUpside - Math.max(0, 55 - strategy.riskScore) * 0.25;
        explanationParts.push("rewards upside and value-add potential while still penalizing extreme risk");
      } else {
        explanationParts.push("uses the current total comparison score");
      }

      return {
        strategy: strategy.strategy,
        adjustedScore: clampScore(adjustedScore),
        explanation: `${strategy.strategy} ${explanationParts.join(", ")}.`,
      };
    })
    .sort((a, b) => b.adjustedScore - a.adjustedScore)
    .slice(0, 3);

  if (topStrategies.length < 2) {
    warnings.push("Scenario has fewer than two viable strategies to compare.");
  }

  if (viableStrategies.some((strategy) => strategy.volatilityScore > 70)) {
    warnings.push("One or more viable strategies has elevated volatility.");
  }

  if (name === "conservative" && viableStrategies.some((strategy) => getEstimatedRequiredCapital(strategy.strategy, input) > 50000)) {
    warnings.push("Conservative scenario is sensitive to capital requirement assumptions.");
  }

  return {
    name,
    bestStrategy: topStrategies[0]?.strategy ?? null,
    recommendationStrength: getScenarioStrength(topStrategies, warnings),
    topStrategies,
    warnings,
  };
}

export function runStrategyScenarios(viableStrategies: StrategyComparisonItem[], input: StrategyComparisonInput) {
  return {
    conservative: buildScenario("conservative", viableStrategies, input),
    expected: buildScenario("expected", viableStrategies, input),
    aggressive: buildScenario("aggressive", viableStrategies, input),
  };
}

function getConfidenceBand(score: number) {
  if (score >= 70) return "strong";
  if (score >= 50) return "moderate";
  return "weak";
}

export function generateConfidenceExplanation(strategies: StrategyComparisonItem[], input: StrategyComparisonInput) {
  const top = strategies[0];
  const runnerUp = strategies[1];
  const missingData: string[] = [];
  const warnings: string[] = [];

  if (!hasValue(input.arv)) missingData.push("ARV");
  if (!hasValue(input.estimatedRepairs)) missingData.push("repairs");
  if (!hasValue(input.askingPrice)) missingData.push("asking price");

  if (!top) {
    return "Confidence is weak because no strategies were available for comparison.";
  }

  if (top.confidenceScore < 50) {
    warnings.push("top strategy confidence is below 50");
  }

  if (runnerUp && top.totalComparisonScore - runnerUp.totalComparisonScore <= 7) {
    warnings.push("top two strategies are within 7 points");
  }

  if (strategies.some((strategy) => strategy.volatilityScore > 70)) {
    warnings.push("at least one strategy has volatility above 70");
  }

  return `Confidence is ${getConfidenceBand(top.confidenceScore)} because ${missingData.length > 0 ? `missing data includes ${missingData.join(", ")}` : "core valuation data is present"}, the top spread is ${runnerUp ? top.totalComparisonScore - runnerUp.totalComparisonScore : "not applicable"} point(s), top volatility is ${top.volatilityScore}/100, and risk clarity is ${top.riskScore}/100.${warnings.length > 0 ? ` Warning: ${warnings.join("; ")}.` : ""}`;
}

export function generateInvestorSummary(result: StrategyComparisonResult) {
  const best = result.strategies.find((strategy) => strategy.strategy === result.bestStrategy);
  const alternative = result.viableStrategies.find((strategy) => strategy.strategy !== result.bestStrategy) ?? result.strategies.find((strategy) => strategy.strategy !== result.bestStrategy);

  if (!best) {
    return "No strategy is recommended because the current inputs do not support a reliable comparison. Human review is recommended before execution.";
  }

  const confidenceBand = getConfidenceBand(best.confidenceScore);
  const reviewNeeded = result.warnings.length > 0 || best.confidenceScore < 70 || best.volatilityScore > 70 || result.excludedStrategies.length > 0;

  return `${best.strategy} is recommended because it leads the viable strategy set with a ${best.totalComparisonScore}/100 comparison score, ${best.riskScore}/100 risk-adjusted score, and ${best.speedScore}/100 speed score. ${
    alternative
      ? `${alternative.strategy} is the strongest alternative, but the trade-off is ${alternative.tradeOffs[0]?.toLowerCase() ?? "less favorable risk-adjusted execution"}. `
      : "No strong alternative is currently close enough to challenge it. "
  }Volatility is ${best.volatilityScore}/100 because ${best.volatilityExplanation.toLowerCase()}. Confidence is ${confidenceBand}; ${reviewNeeded ? "human review is recommended before execution." : "the comparison is clear enough for internal decision review."}`;
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
      input,
    }))
    .filter((strategy) => strategy.score > 0)
    .sort((a, b) => b.totalComparisonScore - a.totalComparisonScore);
  const viableStrategies = strategies.filter((strategy) => strategy.isViable).sort((a, b) => b.totalComparisonScore - a.totalComparisonScore);
  const excludedStrategies = strategies.filter((strategy) => !strategy.isViable).sort((a, b) => b.totalComparisonScore - a.totalComparisonScore);
  const comparisonStrategies = viableStrategies.length > 0 ? viableStrategies : strategies;
  const comparisons: StrategyPairComparison[] = [];

  for (let i = 0; i < comparisonStrategies.length; i += 1) {
    for (let j = i + 1; j < comparisonStrategies.length; j += 1) {
      comparisons.push(comparePair(comparisonStrategies[i], comparisonStrategies[j]));
    }
  }

  const warnings = getWarnings(decision, comparisonStrategies);

  if (strategies.length > 0 && viableStrategies.length === 0) {
    warnings.push("No viable strategies passed the elite viability filter; comparison fell back to all scored strategies for review.");
  }

  const bestStrategy = comparisonStrategies[0]?.strategy ?? null;
  const recommendationStrength = getRecommendationStrength(comparisonStrategies, warnings);
  const runnerUp = comparisonStrategies[1];
  const summary = bestStrategy
    ? `${bestStrategy} is the top-ranked strategy${runnerUp ? `, leading ${runnerUp.strategy} by ${comparisonStrategies[0].totalComparisonScore - runnerUp.totalComparisonScore} points` : ""}. Recommendation strength is ${recommendationStrength}.`
    : "No viable strategy comparison could be produced from the available inputs.";
  const categoryWinners = calculateCategoryWinners(viableStrategies);
  const scenarios = runStrategyScenarios(comparisonStrategies, input);
  const confidenceExplanation = generateConfidenceExplanation(comparisonStrategies, input);
  const result: StrategyComparisonResult = {
    leadId: input.leadId,
    bestStrategy,
    recommendationStrength,
    strategies,
    viableStrategies,
    excludedStrategies,
    categoryWinners,
    scenarios,
    investorSummary: "",
    confidenceExplanation,
    comparisons,
    dominance: getDominance(comparisonStrategies),
    summary,
    warnings,
  };

  return {
    ...result,
    investorSummary: generateInvestorSummary(result),
  };
}
