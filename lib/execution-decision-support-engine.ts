import {
  compareExecutionScenarios,
  type ExecutionScenarioComparisonInput,
  type ExecutionScenarioComparisonResult,
  type RankedExecutionOption,
} from "@/lib/execution-scenario-comparison-engine";
import { calculateSimulationReliability, type SimulationReliabilityResult } from "@/lib/execution-reliability-engine";
import { calculateSimulationConfidence, type SimulationConfidenceResult } from "@/lib/execution-simulation-confidence";
import type { StrategyExecutionSimulation } from "@/lib/execution-simulation-engine";

export type ExecutionDecisionType =
  | "execute_now"
  | "wait"
  | "collect_more_data"
  | "fix_blockers_first"
  | "switch_strategy"
  | "kill_deal"
  | "manual_review_required";

export type ExecutionDecisionReason = {
  reason: string;
  impact: "positive" | "negative" | "neutral";
  severity: "low" | "medium" | "high" | "critical";
};

export type ExecutionDecisionWarning = {
  warning: string;
  severity: "low" | "medium" | "high" | "critical";
};

export type ExecutionDecisionBlocker = {
  blocker: string;
  severity: "medium" | "high" | "critical";
  source: "reliability" | "confidence" | "execution" | "compliance" | "future_execution";
};

export type ExecutionNextReadOnlyAction = {
  action: string;
  priority: "low" | "medium" | "high";
  reason: string;
};

export type StrategySwitchRecommendation = {
  shouldSwitch: boolean;
  fromStrategy?: string;
  toStrategy?: string;
  reason?: string;
};

export type InvestorDecisionSummary = {
  plainEnglishDecision: string;
  whyThisDecision: string;
  biggestRisk: string;
  missingData: string[];
  recommendedNextStep: string;
  capitalRiskNote?: string;
  executionReadinessNote?: string;
};

export type ExecutionDecisionLearningHook = {
  hookType:
    | "executionDecisionGenerated"
    | "executionBlockedForSafety"
    | "strategySwitchRecommended"
    | "manualReviewRequired"
    | "dealKilledByDecisionEngine"
    | "moreDataRequestedByDecisionEngine";
  shouldWriteNow: false;
  futureMemoryEventName: string;
  payloadPreview: Record<string, unknown>;
};

export type ExecutionDecisionSupportInput = ExecutionScenarioComparisonInput & {
  executionScenarioComparison?: ExecutionScenarioComparisonResult;
  selectedSimulation?: StrategyExecutionSimulation;
  confidenceResult?: SimulationConfidenceResult;
  reliabilityResult?: SimulationReliabilityResult;
  selectedStrategy?: string;
};

export type ExecutionDecisionSupportResult = {
  decision: ExecutionDecisionType;
  decisionScore: number;
  decisionLabel: string;
  confidenceScore: number;
  reliabilityScore: number;
  dataTrustScore: number;
  modelRiskScore: number;
  uncertaintyLevel: string;
  safeToProceed: boolean;
  shouldBlockExecution: boolean;
  blockReasons: string[];
  primaryReasons: string[];
  warnings: string[];
  nextReadOnlyActions: string[];
  recommendedStrategy?: string;
  strategySwitchRecommendation?: StrategySwitchRecommendation;
  investorSummary: InvestorDecisionSummary;
  futureExecutionCompatibility: {
    eligibleForExecutionPlanning: boolean;
    eligibleForFutureAutoExecution: false;
    requiresHumanApprovalBeforeExecution: boolean;
    requiresComplianceCheckBeforeExecution: boolean;
    requiresDocumentReviewBeforeExecution: boolean;
    requiresFundingReviewBeforeExecution: boolean;
    requiresSellerConsentBeforeExecution: boolean;
    requiresBuyerMatchBeforeExecution: boolean;
    unsafeToAutomateReasons: string[];
  };
  learningHooks: ExecutionDecisionLearningHook[];
  comparison: ExecutionScenarioComparisonResult;
  reliability: SimulationReliabilityResult;
  confidence: SimulationConfidenceResult;
  selectedOption: RankedExecutionOption;
  readOnlySafetyNote: string;
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

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function hasStrategyTerm(strategy: string, terms: string[]) {
  const normalized = strategy.toLowerCase();

  return terms.some((term) => normalized.includes(term));
}

function getDecisionLabel(decision: ExecutionDecisionType) {
  const labels: Record<ExecutionDecisionType, string> = {
    execute_now: "Read-only execution planning approved for human review",
    wait: "Wait before execution planning",
    collect_more_data: "Collect more data",
    fix_blockers_first: "Fix blockers first",
    switch_strategy: "Consider switching strategy",
    kill_deal: "Kill or pass on deal",
    manual_review_required: "Manual review required",
  };

  return labels[decision];
}

function getSelectedOption(input: ExecutionDecisionSupportInput, comparison: ExecutionScenarioComparisonResult) {
  const requested = input.selectedStrategy?.trim().toLowerCase();

  if (requested) {
    const exact = comparison.rankedOptions.find((option) =>
      option.strategy.toLowerCase() === requested || option.simulation.strategy.toLowerCase() === requested,
    );

    if (exact) return exact;
  }

  return comparison.rankedOptions[0];
}

function getComparison(input: ExecutionDecisionSupportInput) {
  return input.executionScenarioComparison ?? compareExecutionScenarios(input);
}

function getConfidence(input: ExecutionDecisionSupportInput, option: RankedExecutionOption) {
  return input.confidenceResult ?? option.confidence ?? calculateSimulationConfidence(option.simulation, input);
}

function getReliability(input: ExecutionDecisionSupportInput, option: RankedExecutionOption) {
  return input.reliabilityResult ?? calculateSimulationReliability(option.simulation, input);
}

function hasComplianceBlock(input: ExecutionDecisionSupportInput) {
  return Boolean(
    getPath(input, ["doNotContact", "lead.doNotContact", "seller.doNotContact"]) ||
      getPath(input, ["complianceIssue", "lead.complianceIssue", "executionReadiness.complianceIssue"]) ||
      getPath(input, ["legalHold", "lead.legalHold", "assetContext.legalHold"]),
  );
}

function getCriticalMissingData(confidence: SimulationConfidenceResult) {
  const criticalTerms = ["seller contact", "property address", "asking price", "arv", "repair", "seller motivation", "buyer demand", "title"];

  return confidence.missingData.filter((item) => criticalTerms.some((term) => item.toLowerCase().includes(term)));
}

export function determineDecisionBlockers(input: {
  selectedOption: RankedExecutionOption;
  reliability: SimulationReliabilityResult;
  confidence: SimulationConfidenceResult;
  context: ExecutionDecisionSupportInput;
}): ExecutionDecisionBlocker[] {
  const blockers: ExecutionDecisionBlocker[] = [];

  if (input.reliability.uncertaintyLevel === "extreme") {
    blockers.push({ blocker: "Prediction uncertainty is extreme.", severity: "critical", source: "reliability" });
  }

  if (input.reliability.overconfidenceDetected) {
    blockers.push({
      blocker: input.reliability.overconfidenceReason ?? "Overconfidence detected.",
      severity: "critical",
      source: "reliability",
    });
  }

  if (input.reliability.reliabilityLabel === "unreliable") {
    blockers.push({ blocker: "Reliability label is unreliable.", severity: "critical", source: "reliability" });
  }

  if (input.reliability.decisionSafety.shouldBlockDecision) {
    blockers.push({
      blocker: input.reliability.decisionSafety.reason ?? "Reliability engine blocked the decision.",
      severity: "critical",
      source: "reliability",
    });
  }

  if (input.selectedOption.blockerCount >= 5) {
    blockers.push({ blocker: "Execution blocker severity is high.", severity: "high", source: "execution" });
  }

  if (getCriticalMissingData(input.confidence).length >= 3) {
    blockers.push({ blocker: "Critical deal data is missing.", severity: "high", source: "confidence" });
  }

  if (hasComplianceBlock(input.context)) {
    blockers.push({ blocker: "Compliance, do-not-contact, or legal hold issue is present.", severity: "critical", source: "compliance" });
  }

  if (input.selectedOption.requiresDocumentReviewBeforeExecution || input.selectedOption.requiresFundingReviewBeforeExecution) {
    blockers.push({ blocker: "Document or funding review is required before execution.", severity: "high", source: "future_execution" });
  }

  if (input.selectedOption.unsafeToAutomateReasons.length > 0) {
    blockers.push({ blocker: "Future execution compatibility remains unsafe by default.", severity: "medium", source: "future_execution" });
  }

  return blockers;
}

export function calculateExecutionDecisionScore(input: {
  selectedOption: RankedExecutionOption;
  reliability: SimulationReliabilityResult;
  confidence: SimulationConfidenceResult;
  blockers: ExecutionDecisionBlocker[];
}) {
  const criticalPenalty = input.blockers.filter((blocker) => blocker.severity === "critical").length * 22;
  const highPenalty = input.blockers.filter((blocker) => blocker.severity === "high").length * 11;
  const blockerPenalty = input.selectedOption.blockerCount * 3;
  const uncertaintyPenalty = input.reliability.uncertaintyLevel === "high" ? 10 : input.reliability.uncertaintyLevel === "extreme" ? 25 : 0;

  return clampScore(
    input.selectedOption.overallExecutionScore * 0.22 +
      input.confidence.confidenceScore * 0.2 +
      input.reliability.reliabilityScore * 0.24 +
      input.reliability.dataTrustScore * 0.14 +
      (100 - input.reliability.modelRiskScore) * 0.12 +
      input.selectedOption.successProbability * 0.08 -
      criticalPenalty -
      highPenalty -
      blockerPenalty -
      uncertaintyPenalty,
  );
}

export function determineStrategySwitchRecommendation(input: {
  selectedOption: RankedExecutionOption;
  comparison: ExecutionScenarioComparisonResult;
  context: ExecutionDecisionSupportInput;
  reliability: SimulationReliabilityResult;
}): StrategySwitchRecommendation {
  const current = input.selectedOption;
  const alternatives = input.comparison.rankedOptions.filter((option) => option.strategy !== current.strategy);
  const currentReliability = input.reliability;
  const bestAlternative = alternatives
    .map((option) => ({
      option,
      reliability: calculateSimulationReliability(option.simulation, input.context),
    }))
    .filter(({ option, reliability }) =>
      reliability.reliabilityScore >= currentReliability.reliabilityScore + 8 &&
      option.riskScore <= current.riskScore &&
      option.successProbability >= current.successProbability &&
      option.projectedTimelineDays <= Math.max(current.projectedTimelineDays + 5, current.projectedTimelineDays * 1.25) &&
      option.blockerCount <= current.blockerCount + 1,
    )
    .sort((a, b) =>
      b.reliability.reliabilityScore - a.reliability.reliabilityScore ||
      a.option.riskScore - b.option.riskScore ||
      b.option.successProbability - a.option.successProbability,
    )[0];

  if (!bestAlternative) {
    return { shouldSwitch: false };
  }

  return {
    shouldSwitch: true,
    fromStrategy: current.strategy,
    toStrategy: bestAlternative.option.strategy,
    reason: `${bestAlternative.option.strategy} has stronger reliability (${bestAlternative.reliability.reliabilityScore}/100), lower or equal risk, acceptable timeline, and no major blocker increase versus ${current.strategy}.`,
  };
}

export function determineExecutionDecision(input: {
  selectedOption: RankedExecutionOption;
  reliability: SimulationReliabilityResult;
  confidence: SimulationConfidenceResult;
  blockers: ExecutionDecisionBlocker[];
  switchRecommendation: StrategySwitchRecommendation;
}) {
  const criticalBlockers = input.blockers.filter((blocker) => blocker.severity === "critical");
  const highBlockers = input.blockers.filter((blocker) => blocker.severity === "high");
  const strategy = input.selectedOption.strategy;
  const manualReviewStrategy = hasStrategyTerm(strategy, ["seller_finance", "subject_to", "creative", "commercial", "luxury", "development", "multifamily"]);

  if (
    input.reliability.modelRiskScore >= 82 ||
    input.selectedOption.simulation.worstCase.successProbability < 25 ||
    (input.reliability.reliabilityLabel === "unreliable" && input.reliability.dataTrustScore < 45)
  ) {
    return "kill_deal" satisfies ExecutionDecisionType;
  }

  if (input.switchRecommendation.shouldSwitch) {
    return "switch_strategy" satisfies ExecutionDecisionType;
  }

  if (criticalBlockers.length > 0) {
    return "manual_review_required" satisfies ExecutionDecisionType;
  }

  if (highBlockers.length > 0 || input.selectedOption.blockerCount >= 4) {
    return "fix_blockers_first" satisfies ExecutionDecisionType;
  }

  if (
    input.confidence.confidenceScore < 65 ||
    input.reliability.reliabilityScore < 72 ||
    input.reliability.dataTrustScore < 65 ||
    input.confidence.missingData.length >= 5
  ) {
    return "collect_more_data" satisfies ExecutionDecisionType;
  }

  if (
    manualReviewStrategy ||
    input.selectedOption.requiresComplianceCheckBeforeExecution ||
    input.selectedOption.requiresFundingReviewBeforeExecution ||
    input.selectedOption.requiresDocumentReviewBeforeExecution ||
    input.selectedOption.requiresSellerConsentBeforeExecution
  ) {
    return "manual_review_required" satisfies ExecutionDecisionType;
  }

  if (
    input.reliability.reliabilityScore >= 78 &&
    input.confidence.confidenceScore >= 75 &&
    input.reliability.dataTrustScore >= 65 &&
    (input.reliability.uncertaintyLevel === "low" || input.reliability.uncertaintyLevel === "moderate") &&
    input.reliability.modelRiskScore <= 50 &&
    !input.reliability.overconfidenceDetected &&
    input.reliability.decisionSafety.safeToProceed &&
    input.selectedOption.blockerCount === 0
  ) {
    return "execute_now" satisfies ExecutionDecisionType;
  }

  return "wait" satisfies ExecutionDecisionType;
}

export function generateDecisionReasons(input: {
  decision: ExecutionDecisionType;
  selectedOption: RankedExecutionOption;
  reliability: SimulationReliabilityResult;
  confidence: SimulationConfidenceResult;
  switchRecommendation: StrategySwitchRecommendation;
}): ExecutionDecisionReason[] {
  const reasons: ExecutionDecisionReason[] = [
    {
      reason: `${input.selectedOption.strategy} has ${input.selectedOption.overallExecutionScore}/100 execution quality and ${input.selectedOption.successProbability}/100 expected success probability.`,
      impact: "positive",
      severity: "medium",
    },
    {
      reason: `Reliability is ${input.reliability.reliabilityLabel} at ${input.reliability.reliabilityScore}/100 with ${input.reliability.uncertaintyLevel} uncertainty.`,
      impact: input.reliability.reliabilityScore >= 72 ? "positive" : "negative",
      severity: input.reliability.reliabilityScore >= 72 ? "medium" : "high",
    },
    {
      reason: `Confidence is ${input.confidence.confidenceLabel} at ${input.confidence.confidenceScore}/100.`,
      impact: input.confidence.confidenceScore >= 70 ? "positive" : "negative",
      severity: input.confidence.confidenceScore >= 70 ? "medium" : "high",
    },
  ];

  if (input.switchRecommendation.shouldSwitch && input.switchRecommendation.reason) {
    reasons.push({ reason: input.switchRecommendation.reason, impact: "neutral", severity: "high" });
  }

  if (input.decision === "kill_deal") {
    reasons.push({ reason: "Downside risk is too large relative to available trust signals.", impact: "negative", severity: "critical" });
  }

  return reasons;
}

export function generateDecisionWarnings(input: {
  selectedOption: RankedExecutionOption;
  reliability: SimulationReliabilityResult;
  confidence: SimulationConfidenceResult;
  blockers: ExecutionDecisionBlocker[];
}): ExecutionDecisionWarning[] {
  return unique([
    ...input.reliability.reliabilityWarnings,
    ...input.confidence.confidenceWarnings,
    ...input.blockers.map((blocker) => blocker.blocker),
    input.selectedOption.requiresBuyerMatchBeforeExecution ? "Buyer match is required before execution." : "",
    input.selectedOption.requiresSellerConsentBeforeExecution ? "Seller consent must be verified before execution." : "",
  ]).map((warning) => ({
    warning,
    severity: warning.toLowerCase().includes("blocked") || warning.toLowerCase().includes("compliance") ? "critical" : "high",
  }));
}

export function generateNextReadOnlyActions(input: {
  decision: ExecutionDecisionType;
  selectedOption: RankedExecutionOption;
  confidence: SimulationConfidenceResult;
  blockers: ExecutionDecisionBlocker[];
  switchRecommendation: StrategySwitchRecommendation;
}): ExecutionNextReadOnlyAction[] {
  const actions: ExecutionNextReadOnlyAction[] = [];

  if (input.switchRecommendation.shouldSwitch) {
    actions.push({
      action: `Compare ${input.switchRecommendation.fromStrategy} against ${input.switchRecommendation.toStrategy} in human review.`,
      priority: "high",
      reason: input.switchRecommendation.reason ?? "Alternate strategy appears stronger.",
    });
  }

  if (input.confidence.recommendedDataToCollect.length > 0) {
    actions.push({
      action: `Collect: ${input.confidence.recommendedDataToCollect.slice(0, 5).join(", ")}.`,
      priority: "high",
      reason: "Missing data limits decision quality.",
    });
  }

  if (input.blockers.length > 0) {
    actions.push({
      action: `Review blockers: ${input.blockers.slice(0, 3).map((blocker) => blocker.blocker).join("; ")}.`,
      priority: "high",
      reason: "Execution must remain blocked until safety issues are resolved.",
    });
  }

  actions.push({
    action: input.selectedOption.recommendedNextReadOnlyAction,
    priority: input.decision === "execute_now" ? "medium" : "high",
    reason: "This is the next read-only step from the ranked execution option.",
  });

  return actions;
}

export function generateInvestorDecisionSummary(input: {
  decision: ExecutionDecisionType;
  selectedOption: RankedExecutionOption;
  reliability: SimulationReliabilityResult;
  confidence: SimulationConfidenceResult;
  warnings: ExecutionDecisionWarning[];
  nextActions: ExecutionNextReadOnlyAction[];
  switchRecommendation: StrategySwitchRecommendation;
}): InvestorDecisionSummary {
  const biggestRisk =
    input.warnings[0]?.warning ??
    input.reliability.reliabilityWarnings[0] ??
    input.selectedOption.simulation.worstCase.mainFailurePoints[0] ??
    "Execution risk is not fully known.";
  const recommendedNextStep = input.nextActions[0]?.action ?? "Keep the deal in read-only manual review.";
  const plainEnglishDecisionMap: Record<ExecutionDecisionType, string> = {
    execute_now: `Do not execute automatically. ${input.selectedOption.strategy} is strong enough for human execution planning review.`,
    wait: "Wait. The deal is not rejected, but timing, trust, or market clarity is not strong enough yet.",
    collect_more_data: "Do not execute yet. The deal may work, but key data is too weak or incomplete.",
    fix_blockers_first: "Do not execute yet. Fix the execution blockers before relying on this path.",
    switch_strategy: `${input.switchRecommendation.toStrategy ?? "Another strategy"} may be safer than ${input.selectedOption.strategy}. Do not switch automatically; review it manually.`,
    kill_deal: "Pass or kill this deal unless new evidence materially changes the risk profile.",
    manual_review_required: "Manual review required before any execution planning because the risk profile is too sensitive for an automatic recommendation.",
  };

  return {
    plainEnglishDecision: plainEnglishDecisionMap[input.decision],
    whyThisDecision: `${input.selectedOption.strategy} shows ${input.confidence.confidenceScore}/100 confidence, ${input.reliability.reliabilityScore}/100 reliability, ${input.reliability.dataTrustScore}/100 data trust, and ${input.reliability.modelRiskScore}/100 model risk.`,
    biggestRisk,
    missingData: input.confidence.missingData,
    recommendedNextStep,
    capitalRiskNote: input.selectedOption.projectedCostHigh > 10000
      ? `Projected high-side execution cost is ${input.selectedOption.projectedCostHigh}, so capital review is required.`
      : undefined,
    executionReadinessNote: input.selectedOption.blockerCount > 0
      ? `${input.selectedOption.blockerCount} blocker(s) must be reviewed before execution planning.`
      : "No major blocker count was detected, but human approval is still required.",
  };
}

function getLearningHooks(input: {
  decision: ExecutionDecisionType;
  selectedOption: RankedExecutionOption;
  decisionScore: number;
  shouldBlockExecution: boolean;
  switchRecommendation: StrategySwitchRecommendation;
}) {
  const hooks: ExecutionDecisionLearningHook[] = [
    {
      hookType: "executionDecisionGenerated",
      shouldWriteNow: false,
      futureMemoryEventName: "execution_decision_generated",
      payloadPreview: {
        strategy: input.selectedOption.strategy,
        decision: input.decision,
        decisionScore: input.decisionScore,
      },
    },
  ];

  if (input.shouldBlockExecution) {
    hooks.push({
      hookType: "executionBlockedForSafety",
      shouldWriteNow: false,
      futureMemoryEventName: "execution_blocked_for_safety",
      payloadPreview: { strategy: input.selectedOption.strategy, decision: input.decision },
    });
  }

  if (input.switchRecommendation.shouldSwitch) {
    hooks.push({
      hookType: "strategySwitchRecommended",
      shouldWriteNow: false,
      futureMemoryEventName: "strategy_switch_recommended",
      payloadPreview: input.switchRecommendation,
    });
  }

  if (input.decision === "manual_review_required") {
    hooks.push({
      hookType: "manualReviewRequired",
      shouldWriteNow: false,
      futureMemoryEventName: "manual_review_required_by_execution_decision",
      payloadPreview: { strategy: input.selectedOption.strategy, decisionScore: input.decisionScore },
    });
  }

  if (input.decision === "kill_deal") {
    hooks.push({
      hookType: "dealKilledByDecisionEngine",
      shouldWriteNow: false,
      futureMemoryEventName: "deal_killed_by_execution_decision_engine",
      payloadPreview: { strategy: input.selectedOption.strategy, decisionScore: input.decisionScore },
    });
  }

  if (input.decision === "collect_more_data") {
    hooks.push({
      hookType: "moreDataRequestedByDecisionEngine",
      shouldWriteNow: false,
      futureMemoryEventName: "more_data_requested_by_execution_decision_engine",
      payloadPreview: { strategy: input.selectedOption.strategy },
    });
  }

  return hooks;
}

export function generateExecutionDecisionSupport(input: ExecutionDecisionSupportInput): ExecutionDecisionSupportResult {
  const comparison = getComparison(input);
  const selectedOption = getSelectedOption(input, comparison);

  if (!selectedOption) {
    throw new Error("No ranked execution option is available for decision support.");
  }

  const confidence = getConfidence(input, selectedOption);
  const reliability = getReliability(input, selectedOption);
  const blockers = determineDecisionBlockers({ selectedOption, reliability, confidence, context: input });
  const switchRecommendation = determineStrategySwitchRecommendation({ selectedOption, comparison, context: input, reliability });
  const decision = determineExecutionDecision({ selectedOption, reliability, confidence, blockers, switchRecommendation });
  const decisionScore = calculateExecutionDecisionScore({ selectedOption, reliability, confidence, blockers });
  const reasons = generateDecisionReasons({ decision, selectedOption, reliability, confidence, switchRecommendation });
  const warnings = generateDecisionWarnings({ selectedOption, reliability, confidence, blockers });
  const nextActions = generateNextReadOnlyActions({ decision, selectedOption, confidence, blockers, switchRecommendation });
  const shouldBlockExecution =
    decision !== "execute_now" ||
    blockers.some((blocker) => blocker.severity === "critical" || blocker.severity === "high") ||
    reliability.decisionSafety.shouldBlockDecision ||
    reliability.overconfidenceDetected;
  const investorSummary = generateInvestorDecisionSummary({
    decision,
    selectedOption,
    reliability,
    confidence,
    warnings,
    nextActions,
    switchRecommendation,
  });
  const unsafeToAutomateReasons = unique([
    "Future auto-execution is disabled in 6.2D.4.",
    "Human approval is required before execution.",
    ...selectedOption.unsafeToAutomateReasons,
    ...blockers.map((blocker) => blocker.blocker),
  ]);

  return {
    decision,
    decisionScore,
    decisionLabel: getDecisionLabel(decision),
    confidenceScore: confidence.confidenceScore,
    reliabilityScore: reliability.reliabilityScore,
    dataTrustScore: reliability.dataTrustScore,
    modelRiskScore: reliability.modelRiskScore,
    uncertaintyLevel: reliability.uncertaintyLevel,
    safeToProceed: decision === "execute_now" && reliability.decisionSafety.safeToProceed,
    shouldBlockExecution,
    blockReasons: blockers.map((blocker) => blocker.blocker),
    primaryReasons: reasons.map((reason) => reason.reason),
    warnings: warnings.map((warning) => warning.warning),
    nextReadOnlyActions: nextActions.map((action) => action.action),
    recommendedStrategy: switchRecommendation.shouldSwitch ? switchRecommendation.toStrategy : selectedOption.strategy,
    strategySwitchRecommendation: switchRecommendation,
    investorSummary,
    futureExecutionCompatibility: {
      eligibleForExecutionPlanning: selectedOption.eligibleForFutureExecutionPlanning && !shouldBlockExecution,
      eligibleForFutureAutoExecution: false,
      requiresHumanApprovalBeforeExecution: true,
      requiresComplianceCheckBeforeExecution: true,
      requiresDocumentReviewBeforeExecution: selectedOption.requiresDocumentReviewBeforeExecution,
      requiresFundingReviewBeforeExecution: selectedOption.requiresFundingReviewBeforeExecution,
      requiresSellerConsentBeforeExecution: selectedOption.requiresSellerConsentBeforeExecution,
      requiresBuyerMatchBeforeExecution: selectedOption.requiresBuyerMatchBeforeExecution,
      unsafeToAutomateReasons,
    },
    learningHooks: getLearningHooks({ decision, selectedOption, decisionScore, shouldBlockExecution, switchRecommendation }),
    comparison,
    reliability,
    confidence,
    selectedOption,
    readOnlySafetyNote: "Execution decision support is read-only. It does not send SMS, use Twilio, trigger outreach, route deals, execute automation, or mutate records.",
  };
}
