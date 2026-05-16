import {
  calculateSimulationConfidence,
  type SimulationConfidenceResult,
} from "@/lib/execution-simulation-confidence";
import {
  compareExecutionSimulations,
  simulateExecutionFlow,
  type ExecutionSimulationInput,
  type StrategyExecutionSimulation,
} from "@/lib/execution-simulation-engine";

export type ExecutionScenarioComparisonInput = ExecutionSimulationInput & {
  simulations?: StrategyExecutionSimulation[];
};

export type ExecutionComparisonLearningHook = {
  hookType:
    | "executionScenarioCompared"
    | "confidenceCalculated"
    | "strategyRankingGenerated"
    | "lowConfidenceSimulationFlagged"
    | "futureComparePredictionToActual";
  strategy: string;
  shouldWriteNow: false;
  futureMemoryEventName: string;
  payloadPreview: Record<string, unknown>;
};

export type RankedExecutionOption = {
  strategy: string;
  rank: number;
  overallExecutionScore: number;
  confidenceScore: number;
  confidenceLabel: SimulationConfidenceResult["confidenceLabel"];
  projectedTimelineDays: number;
  projectedCostLow: number;
  projectedCostHigh: number;
  successProbability: number;
  riskScore: number;
  complexityScore: number;
  blockerCount: number;
  missingDataCount: number;
  bestFor: string[];
  worstFor: string[];
  whyRankedHere: string;
  recommendedNextReadOnlyAction: string;
  shouldProceedToExecutionPlanning: boolean;
  proceedReason: string;
  stopReason?: string;
  futureExecutionEligible: boolean;
  futureExecutionBlockedReasons: string[];
  eligibleForFutureExecutionPlanning: boolean;
  eligibleForFutureAutoExecution: false;
  requiresHumanApprovalBeforeExecution: true;
  requiresComplianceCheckBeforeExecution: boolean;
  requiresFundingReviewBeforeExecution: boolean;
  requiresDocumentReviewBeforeExecution: boolean;
  requiresSellerConsentBeforeExecution: boolean;
  requiresBuyerMatchBeforeExecution: boolean;
  unsafeToAutomateReasons: string[];
  simulation: StrategyExecutionSimulation;
  confidence: SimulationConfidenceResult;
};

export type ExecutionComparisonSummary = {
  headline: string;
  fastestStrategy: string | null;
  lowestRiskStrategy: string | null;
  highestUpsideStrategy: string | null;
  mostReliableStrategy: string | null;
  bestBalancedStrategy: string | null;
  strategiesToAvoid: string[];
  strategiesNeedingMoreData: string[];
  readOnlySafetyNote: string;
};

export type ExecutionScenarioComparisonResult = {
  rankedOptions: RankedExecutionOption[];
  confidenceResults: SimulationConfidenceResult[];
  summary: ExecutionComparisonSummary;
  fastestStrategy: string | null;
  lowestRiskStrategy: string | null;
  highestUpsideStrategy: string | null;
  mostReliableStrategy: string | null;
  bestBalancedStrategy: string | null;
  strategiesToAvoid: string[];
  strategiesNeedingMoreData: string[];
  learningHooks: ExecutionComparisonLearningHook[];
  eligibleForFutureExecutionPlanning: boolean;
  eligibleForFutureAutoExecution: false;
  requiresHumanApprovalBeforeExecution: true;
  requiresComplianceCheckBeforeExecution: true;
  requiresFundingReviewBeforeExecution: boolean;
  requiresDocumentReviewBeforeExecution: boolean;
  requiresSellerConsentBeforeExecution: boolean;
  requiresBuyerMatchBeforeExecution: boolean;
  unsafeToAutomateReasons: string[];
  readOnlySafetyNote: string;
};

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function average(values: number[]) {
  return values.length === 0 ? 0 : values.reduce((total, value) => total + value, 0) / values.length;
}

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function getAverageRiskScore(simulation: StrategyExecutionSimulation) {
  return clampScore(average(simulation.steps.map((step) => step.riskScore)));
}

function getWorstCaseSurvivability(simulation: StrategyExecutionSimulation) {
  const blockerPenalty = simulation.worstCase.mainFailurePoints.length * 4;

  return clampScore(simulation.worstCase.successProbability - blockerPenalty);
}

function getExpectedReliability(simulation: StrategyExecutionSimulation, confidenceScore: number) {
  const spreadPenalty = Math.max(0, simulation.bestCase.successProbability - simulation.worstCase.successProbability) * 0.25;

  return clampScore(simulation.expectedCase.successProbability * 0.65 + confidenceScore * 0.35 - spreadPenalty);
}

function getTimelineEfficiency(days: number) {
  if (days <= 3) return 95;
  if (days <= 7) return 82;
  if (days <= 14) return 68;
  if (days <= 30) return 52;
  return 35;
}

function getCostManageability(simulation: StrategyExecutionSimulation) {
  const high = simulation.expectedCase.projectedCostHigh;

  if (high <= 500) return 92;
  if (high <= 2500) return 78;
  if (high <= 10000) return 62;
  if (high <= 50000) return 45;
  return 30;
}

function getBlockerResolutionClarity(simulation: StrategyExecutionSimulation) {
  const blockers = simulation.predictedBlockers.length;
  const highRiskSteps = simulation.steps.filter((step) => step.riskScore >= 70).length;

  return clampScore(100 - blockers * 7 - highRiskSteps * 8);
}

function hasRequirement(simulation: StrategyExecutionSimulation, key: keyof StrategyExecutionSimulation["futureExecutionCompatibility"][number]) {
  return simulation.futureExecutionCompatibility.some((item) => Boolean(item[key]));
}

function getAutomationSafetyReasons(option: Pick<RankedExecutionOption, "strategy" | "confidenceLabel">, simulation: StrategyExecutionSimulation) {
  return unique([
    "Future auto-execution is disabled in this stage.",
    "Human approval is required before any execution action.",
    option.confidenceLabel === "low" || option.confidenceLabel === "unreliable" ? "Simulation confidence is not strong enough for automation." : "",
    ...simulation.predictedBlockers.map((blocker) => `Unresolved blocker: ${blocker}`),
  ]).slice(0, 10);
}

function getBestFor(simulation: StrategyExecutionSimulation, confidence: SimulationConfidenceResult) {
  const bestFor: string[] = [];

  if (simulation.expectedCase.projectedTimelineDays <= 7) bestFor.push("fast review cycle");
  if (simulation.expectedCase.projectedCostHigh <= 2500) bestFor.push("low capital exposure");
  if (confidence.confidenceScore >= 70) bestFor.push("higher-confidence decision support");
  if (simulation.expectedCase.successProbability >= 65) bestFor.push("strong expected-case reliability");
  if (simulation.worstCase.successProbability >= 45) bestFor.push("better downside survivability");

  return bestFor.length > 0 ? bestFor : ["manual comparison with limited standout strengths"];
}

function getWorstFor(simulation: StrategyExecutionSimulation, confidence: SimulationConfidenceResult) {
  const worstFor: string[] = [];

  if (simulation.expectedCase.projectedTimelineDays > 14) worstFor.push("speed-sensitive decisions");
  if (simulation.expectedCase.projectedCostHigh > 10000) worstFor.push("low-capital execution");
  if (confidence.confidenceScore < 55) worstFor.push("high-trust decisions without more data");
  if (simulation.complexityScore >= 70) worstFor.push("simple execution paths");
  if (simulation.predictedBlockers.length >= 5) worstFor.push("execution without blocker cleanup");

  return worstFor.length > 0 ? worstFor : ["no major execution limitation identified from current simulation"];
}

function getRecommendedAction(option: {
  confidence: SimulationConfidenceResult;
  simulation: StrategyExecutionSimulation;
  overallExecutionScore: number;
}) {
  if (!option.confidence.safeToUseForDecision) {
    return `Collect ${option.confidence.recommendedDataToCollect.slice(0, 3).join(", ") || "missing deal data"} before relying on this simulation.`;
  }

  if (option.simulation.predictedBlockers.length > 0) {
    return `Review and resolve blocker assumptions: ${option.simulation.predictedBlockers.slice(0, 2).join("; ")}.`;
  }

  if (option.overallExecutionScore >= 70) {
    return "Use this read-only result for human execution planning review only.";
  }

  return "Keep this option in manual review until confidence, blockers, or complexity improve.";
}

function getOverallExecutionScore(simulation: StrategyExecutionSimulation, confidence: SimulationConfidenceResult) {
  const riskControl = clampScore(100 - getAverageRiskScore(simulation));
  const complexityControl = clampScore(100 - simulation.complexityScore);
  const timelineEfficiency = getTimelineEfficiency(simulation.expectedCase.projectedTimelineDays);
  const blockerClarity = getBlockerResolutionClarity(simulation);
  const worstCaseSurvivability = getWorstCaseSurvivability(simulation);
  const expectedReliability = getExpectedReliability(simulation, confidence.confidenceScore);
  const costManageability = getCostManageability(simulation);

  return clampScore(
    confidence.confidenceScore * 0.2 +
      simulation.expectedCase.successProbability * 0.19 +
      riskControl * 0.16 +
      complexityControl * 0.12 +
      timelineEfficiency * 0.1 +
      blockerClarity * 0.1 +
      worstCaseSurvivability * 0.08 +
      expectedReliability * 0.03 +
      costManageability * 0.02,
  );
}

function buildRankedOption(
  simulation: StrategyExecutionSimulation,
  confidence: SimulationConfidenceResult,
  index: number,
): RankedExecutionOption {
  const overallExecutionScore = getOverallExecutionScore(simulation, confidence);
  const averageRiskScore = getAverageRiskScore(simulation);
  const blockerCount = simulation.predictedBlockers.length;
  const missingDataCount = confidence.missingData.length;
  const futureExecutionBlockedReasons = unique([
    ...confidence.confidenceWarnings,
    ...simulation.predictedBlockers.map((blocker) => `Unresolved blocker: ${blocker}`),
    confidence.safeToUseForDecision ? "" : confidence.unsafeDecisionReason ?? "Simulation confidence is not decision-safe.",
  ]).slice(0, 12);
  const shouldProceedToExecutionPlanning = confidence.safeToUseForDecision && overallExecutionScore >= 60 && blockerCount <= 4;
  const baseOption = {
    strategy: simulation.normalizedStrategy || simulation.strategy,
    rank: index + 1,
    overallExecutionScore,
    confidenceScore: confidence.confidenceScore,
    confidenceLabel: confidence.confidenceLabel,
  };
  const unsafeToAutomateReasons = getAutomationSafetyReasons(baseOption, simulation);

  return {
    ...baseOption,
    projectedTimelineDays: simulation.expectedCase.projectedTimelineDays,
    projectedCostLow: simulation.expectedCase.projectedCostLow,
    projectedCostHigh: simulation.expectedCase.projectedCostHigh,
    successProbability: simulation.expectedCase.successProbability,
    riskScore: averageRiskScore,
    complexityScore: simulation.complexityScore,
    blockerCount,
    missingDataCount,
    bestFor: getBestFor(simulation, confidence),
    worstFor: getWorstFor(simulation, confidence),
    whyRankedHere: `${baseOption.strategy} ranks #${index + 1} with ${overallExecutionScore}/100 execution quality, ${confidence.confidenceScore}/100 confidence, ${simulation.expectedCase.successProbability}/100 expected success, ${averageRiskScore}/100 risk, and ${simulation.complexityScore}/100 complexity.`,
    recommendedNextReadOnlyAction: getRecommendedAction({ confidence, simulation, overallExecutionScore }),
    shouldProceedToExecutionPlanning,
    proceedReason: shouldProceedToExecutionPlanning
      ? "Read-only execution planning review is reasonable after human approval because confidence and execution quality are adequate."
      : "Do not proceed to execution planning yet.",
    stopReason: shouldProceedToExecutionPlanning
      ? undefined
      : confidence.unsafeDecisionReason ?? "Execution score, blocker count, or confidence is not strong enough yet.",
    futureExecutionEligible: false,
    futureExecutionBlockedReasons,
    eligibleForFutureExecutionPlanning: shouldProceedToExecutionPlanning,
    eligibleForFutureAutoExecution: false,
    requiresHumanApprovalBeforeExecution: true,
    requiresComplianceCheckBeforeExecution: true,
    requiresFundingReviewBeforeExecution: hasRequirement(simulation, "requiresFundingReview"),
    requiresDocumentReviewBeforeExecution: hasRequirement(simulation, "requiresDocumentReview"),
    requiresSellerConsentBeforeExecution: hasRequirement(simulation, "requiresSellerConsent"),
    requiresBuyerMatchBeforeExecution: hasRequirement(simulation, "requiresBuyerMatch"),
    unsafeToAutomateReasons,
    simulation,
    confidence,
  };
}

export function rankExecutionSimulations(
  simulations: StrategyExecutionSimulation[],
  context: unknown = {},
): RankedExecutionOption[] {
  return simulations
    .map((simulation) => ({
      simulation,
      confidence: calculateSimulationConfidence(simulation, context),
    }))
    .sort((a, b) => {
      const aScore = getOverallExecutionScore(a.simulation, a.confidence);
      const bScore = getOverallExecutionScore(b.simulation, b.confidence);

      return bScore - aScore ||
        b.confidence.confidenceScore - a.confidence.confidenceScore ||
        b.simulation.expectedCase.successProbability - a.simulation.expectedCase.successProbability ||
        a.simulation.complexityScore - b.simulation.complexityScore;
    })
    .map(({ simulation, confidence }, index) => buildRankedOption(simulation, confidence, index));
}

export function selectBestExecutionPath(comparisons: RankedExecutionOption[] | ExecutionScenarioComparisonResult) {
  const rankedOptions = Array.isArray(comparisons) ? comparisons : comparisons.rankedOptions;

  return rankedOptions.find((option) => option.shouldProceedToExecutionPlanning) ?? rankedOptions[0] ?? null;
}

function getStrategyByMin(options: RankedExecutionOption[], selector: (option: RankedExecutionOption) => number) {
  return [...options].sort((a, b) => selector(a) - selector(b))[0]?.strategy ?? null;
}

function getStrategyByMax(options: RankedExecutionOption[], selector: (option: RankedExecutionOption) => number) {
  return [...options].sort((a, b) => selector(b) - selector(a))[0]?.strategy ?? null;
}

export function summarizeExecutionComparison(comparison: Pick<ExecutionScenarioComparisonResult, "rankedOptions">): ExecutionComparisonSummary {
  const options = comparison.rankedOptions;
  const bestBalancedStrategy = options[0]?.strategy ?? null;
  const fastestStrategy = getStrategyByMin(options, (option) => option.projectedTimelineDays);
  const lowestRiskStrategy = getStrategyByMin(options, (option) => option.riskScore + option.blockerCount * 5);
  const highestUpsideStrategy = getStrategyByMax(options, (option) => option.simulation.bestCase.successProbability);
  const mostReliableStrategy = getStrategyByMax(options, (option) => getExpectedReliability(option.simulation, option.confidenceScore));
  const strategiesToAvoid = options
    .filter((option) => option.confidenceLabel === "unreliable" || option.overallExecutionScore < 40 || option.simulation.worstCase.successProbability < 30)
    .map((option) => option.strategy);
  const strategiesNeedingMoreData = options
    .filter((option) => option.missingDataCount >= 5 || option.confidenceLabel === "low" || option.confidenceLabel === "unreliable")
    .map((option) => option.strategy);
  const headline = bestBalancedStrategy
    ? `${bestBalancedStrategy} is the best balanced read-only execution path with ${options[0].overallExecutionScore}/100 execution quality and ${options[0].confidenceScore}/100 confidence.`
    : "No execution scenario comparison could be produced from the available simulations.";

  return {
    headline,
    fastestStrategy,
    lowestRiskStrategy,
    highestUpsideStrategy,
    mostReliableStrategy,
    bestBalancedStrategy,
    strategiesToAvoid,
    strategiesNeedingMoreData,
    readOnlySafetyNote: "Scenario comparison is read-only and does not send SMS, use Twilio, trigger outreach, route deals, execute automation, or mutate records.",
  };
}

function getLearningHooks(options: RankedExecutionOption[]): ExecutionComparisonLearningHook[] {
  return options.flatMap((option) => {
    const hooks: ExecutionComparisonLearningHook[] = [
      {
        hookType: "executionScenarioCompared",
        strategy: option.strategy,
        shouldWriteNow: false,
        futureMemoryEventName: "execution_scenario_compared",
        payloadPreview: {
          rank: option.rank,
          overallExecutionScore: option.overallExecutionScore,
          bestCaseSuccessProbability: option.simulation.bestCase.successProbability,
          expectedCaseSuccessProbability: option.simulation.expectedCase.successProbability,
          worstCaseSuccessProbability: option.simulation.worstCase.successProbability,
        },
      },
      {
        hookType: "confidenceCalculated",
        strategy: option.strategy,
        shouldWriteNow: false,
        futureMemoryEventName: "simulation_confidence_calculated",
        payloadPreview: {
          confidenceScore: option.confidenceScore,
          confidenceLabel: option.confidenceLabel,
          missingDataCount: option.missingDataCount,
        },
      },
      {
        hookType: "strategyRankingGenerated",
        strategy: option.strategy,
        shouldWriteNow: false,
        futureMemoryEventName: "execution_strategy_ranking_generated",
        payloadPreview: {
          rank: option.rank,
          overallExecutionScore: option.overallExecutionScore,
          proceedToExecutionPlanning: option.shouldProceedToExecutionPlanning,
        },
      },
      {
        hookType: "futureComparePredictionToActual",
        strategy: option.strategy,
        shouldWriteNow: false,
        futureMemoryEventName: "future_compare_execution_prediction_to_actual",
        payloadPreview: {
          predictedTimelineDays: option.projectedTimelineDays,
          predictedCostLow: option.projectedCostLow,
          predictedCostHigh: option.projectedCostHigh,
          predictedBlockerCount: option.blockerCount,
        },
      },
    ];

    if (option.confidenceLabel === "low" || option.confidenceLabel === "unreliable") {
      hooks.push({
        hookType: "lowConfidenceSimulationFlagged",
        strategy: option.strategy,
        shouldWriteNow: false,
        futureMemoryEventName: "low_confidence_simulation_flagged",
        payloadPreview: {
          confidenceScore: option.confidenceScore,
          warnings: option.confidence.confidenceWarnings,
          unsafeDecisionReason: option.confidence.unsafeDecisionReason,
        },
      });
    }

    return hooks;
  });
}

function getSimulations(input: ExecutionScenarioComparisonInput) {
  if (input.simulations && input.simulations.length > 0) {
    return input.simulations;
  }

  if (input.strategies && input.strategies.length > 0) {
    return compareExecutionSimulations(input.strategies, input);
  }

  return simulateExecutionFlow(input).comparedStrategies;
}

export function compareExecutionScenarios(input: ExecutionScenarioComparisonInput): ExecutionScenarioComparisonResult {
  const simulations = getSimulations(input);
  const rankedOptions = rankExecutionSimulations(simulations, input);
  const confidenceResults = rankedOptions.map((option) => option.confidence);
  const summary = summarizeExecutionComparison({ rankedOptions });
  const unsafeToAutomateReasons = unique([
    "Future auto-execution is disabled in 6.2D.2.",
    "Human approval is required before execution planning or execution.",
    ...rankedOptions.flatMap((option) => option.unsafeToAutomateReasons),
  ]).slice(0, 20);

  return {
    rankedOptions,
    confidenceResults,
    summary,
    fastestStrategy: summary.fastestStrategy,
    lowestRiskStrategy: summary.lowestRiskStrategy,
    highestUpsideStrategy: summary.highestUpsideStrategy,
    mostReliableStrategy: summary.mostReliableStrategy,
    bestBalancedStrategy: summary.bestBalancedStrategy,
    strategiesToAvoid: summary.strategiesToAvoid,
    strategiesNeedingMoreData: summary.strategiesNeedingMoreData,
    learningHooks: getLearningHooks(rankedOptions),
    eligibleForFutureExecutionPlanning: rankedOptions.some((option) => option.eligibleForFutureExecutionPlanning),
    eligibleForFutureAutoExecution: false,
    requiresHumanApprovalBeforeExecution: true,
    requiresComplianceCheckBeforeExecution: true,
    requiresFundingReviewBeforeExecution: rankedOptions.some((option) => option.requiresFundingReviewBeforeExecution),
    requiresDocumentReviewBeforeExecution: rankedOptions.some((option) => option.requiresDocumentReviewBeforeExecution),
    requiresSellerConsentBeforeExecution: rankedOptions.some((option) => option.requiresSellerConsentBeforeExecution),
    requiresBuyerMatchBeforeExecution: rankedOptions.some((option) => option.requiresBuyerMatchBeforeExecution),
    unsafeToAutomateReasons,
    readOnlySafetyNote: "Execution scenario comparison is read-only. It does not send SMS, use Twilio, trigger outreach, route deals, execute automation, or mutate records.",
  };
}
