export type ResolutionPriority = "critical" | "high" | "medium" | "low";
export type OwnerRole =
  | "human"
  | "acquisition_manager"
  | "disposition_manager"
  | "transaction_coordinator"
  | "finance_review"
  | "legal_review"
  | "system_review";
export type EstimatedDifficulty = "easy" | "moderate" | "hard";
export type EstimatedTimeframe = "same_day" | "1_2_days" | "3_7_days" | "longer";

export type ResolutionStep = {
  stepId: string;
  blockerType: string;
  blockerIssue: string;
  resolutionAction: string;
  priority: ResolutionPriority;
  ownerRole: OwnerRole;
  estimatedDifficulty: EstimatedDifficulty;
  estimatedTimeframe: EstimatedTimeframe;
  canBeAutomatedLater: boolean;
  requiresHumanApproval: boolean;
  safetyNote: string;
  dependsOnStepIds?: string[];
};

export type ExpectedImpactAfterResolution = {
  readinessScoreIncrease: number;
  confidenceIncrease: number;
  failureProbabilityDecrease: number;
  likelyDecisionAfterResolution: "GO" | "HOLD" | "STOP";
};

export type PostResolutionRisk = {
  risk: string;
  probability: number;
  impact: "low" | "medium" | "high";
};

export type ExecutionBlockerResolutionInput = {
  executionReadiness?: unknown;
  blockers?: unknown[];
  selectedStrategy?: string;
  lead?: unknown;
};

export type ExecutionBlockerResolutionResult = {
  resolutionPlan: ResolutionStep[];
  resolutionOrder: string[];
  criticalPath: ResolutionStep[];
  expectedImpactAfterResolution: ExpectedImpactAfterResolution;
  resolutionConfidence: number;
  postResolutionRisks: PostResolutionRisk[];
  shouldReevaluateStrategy: boolean;
  alternativeStrategySuggestion?: string;
  isOverResolution: boolean;
  overResolutionReason?: string;
  approvalRequirements: {
    requiresHumanApproval: boolean;
    requiresLegalReview: boolean;
    requiresFinanceReview: boolean;
    requiresDispositionReview: boolean;
  };
  automationReadiness: {
    canCreateTasksLater: boolean;
    canTriggerFollowUpLater: boolean;
    canTriggerBuyerValidationLater: boolean;
    canTriggerLegalReviewLater: boolean;
    safeForAutomationNow: boolean;
  };
  resolutionSummary: string;
};

type JsonRecord = Record<string, unknown>;
type NormalizedBlocker = {
  type: string;
  issue: string;
  severity: "low" | "medium" | "high" | "critical";
  fix: string;
  priorityScore: number;
  isExecutionCritical: boolean;
};

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

function getString(source: unknown, paths: string[], fallback = "") {
  const value = getPath(source, paths);

  return typeof value === "string" ? value.trim() : fallback;
}

function getNumber(source: unknown, paths: string[], fallback: number) {
  const value = getPath(source, paths);
  const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;

  return Number.isFinite(parsed) ? parsed : fallback;
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalizeSeverity(value: unknown): NormalizedBlocker["severity"] {
  if (value === "critical" || value === "high" || value === "medium" || value === "low") {
    return value;
  }

  return "medium";
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function hasAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function getDefaultPriorityScore(severity: NormalizedBlocker["severity"]) {
  if (severity === "critical") return 95;
  if (severity === "high") return 80;
  if (severity === "medium") return 55;
  return 25;
}

function normalizeBlocker(blocker: unknown): NormalizedBlocker {
  const record = asRecord(blocker);
  const severity = normalizeSeverity(record.severity);
  const type = typeof record.type === "string" ? record.type : "data";
  const priorityScore = typeof record.priorityScore === "number" ? clampScore(record.priorityScore) : getDefaultPriorityScore(severity);
  const isCriticalType = ["legal", "title", "financial"].includes(type);

  return {
    type,
    issue: typeof record.issue === "string" ? record.issue : "Execution blocker requires review",
    severity,
    fix: typeof record.fix === "string" ? record.fix : "Review and resolve this blocker before execution.",
    priorityScore,
    isExecutionCritical: typeof record.isExecutionCritical === "boolean" ? record.isExecutionCritical : severity === "critical" && isCriticalType,
  };
}

function getInputBlockers(input: ExecutionBlockerResolutionInput) {
  const readinessBlockers = asRecord(input.executionReadiness).blockers;
  const source = Array.isArray(readinessBlockers) ? readinessBlockers : Array.isArray(input.blockers) ? input.blockers : [];

  return source.map(normalizeBlocker);
}

function getSelectedStrategy(input: ExecutionBlockerResolutionInput) {
  return input.selectedStrategy ||
    getString(input.executionReadiness, ["strategyDependencyCheck.selectedStrategy"]) ||
    "selected strategy";
}

function getTypeRank(type: string) {
  const ranks: Record<string, number> = {
    legal: 1,
    title: 2,
    financial: 3,
    operations_critical: 4,
    seller: 5,
    buyer: 6,
    market: 7,
    data: 8,
    operations: 9,
  };

  return ranks[type] ?? 9;
}

function getSeverityRank(severity: NormalizedBlocker["severity"]) {
  const ranks = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  return ranks[severity];
}

function sortBlockers(blockers: NormalizedBlocker[]) {
  return [...blockers].sort((a, b) => {
    const aType = a.type === "operations" && a.isExecutionCritical ? "operations_critical" : a.type;
    const bType = b.type === "operations" && b.isExecutionCritical ? "operations_critical" : b.type;

    return getTypeRank(aType) - getTypeRank(bType) ||
      Number(b.isExecutionCritical) - Number(a.isExecutionCritical) ||
      getSeverityRank(b.severity) - getSeverityRank(a.severity) ||
      b.priorityScore - a.priorityScore;
  });
}

function getPriority(blocker: NormalizedBlocker): ResolutionPriority {
  if (blocker.isExecutionCritical || blocker.severity === "critical") return "critical";
  return blocker.severity;
}

function getOwnerRole(blocker: NormalizedBlocker): OwnerRole {
  if (blocker.type === "legal") return "legal_review";
  if (blocker.type === "title") return blocker.severity === "critical" ? "legal_review" : "transaction_coordinator";
  if (blocker.type === "financial") return "finance_review";
  if (blocker.type === "seller") return "acquisition_manager";
  if (blocker.type === "buyer") return "disposition_manager";
  if (blocker.type === "market" || blocker.type === "data") return "system_review";
  if (blocker.type === "operations") return blocker.severity === "high" || blocker.severity === "critical" ? "transaction_coordinator" : "system_review";

  return "human";
}

function getDifficulty(blocker: NormalizedBlocker): EstimatedDifficulty {
  if (blocker.severity === "critical") return "hard";
  if (blocker.severity === "high" || ["legal", "title", "financial"].includes(blocker.type)) return "moderate";
  return "easy";
}

function getTimeframe(blocker: NormalizedBlocker): EstimatedTimeframe {
  if (blocker.severity === "critical" && ["legal", "title", "financial"].includes(blocker.type)) {
    return blocker.type === "legal" ? "longer" : "3_7_days";
  }

  if (blocker.severity === "high" && ["legal", "title", "financial"].includes(blocker.type)) {
    return blocker.type === "legal" ? "3_7_days" : "1_2_days";
  }

  if ((blocker.type === "seller" || blocker.type === "buyer" || blocker.type === "data") && blocker.severity === "medium") {
    return "same_day";
  }

  if (blocker.type === "market" || blocker.type === "operations") {
    return blocker.severity === "high" || blocker.severity === "critical" ? "3_7_days" : "1_2_days";
  }

  return blocker.severity === "low" ? "same_day" : "1_2_days";
}

function getCanBeAutomatedLater(blocker: NormalizedBlocker) {
  if (["legal", "title", "financial"].includes(blocker.type)) return false;
  if (blocker.type === "seller" || blocker.type === "buyer" || blocker.type === "market" || blocker.type === "data" || blocker.type === "operations") return true;
  return false;
}

function getRequiresHumanApproval(blocker: NormalizedBlocker) {
  if (["legal", "title", "financial", "seller", "buyer"].includes(blocker.type)) return true;
  if (blocker.type === "market" || blocker.type === "data" || blocker.type === "operations") {
    return blocker.severity === "high" || blocker.severity === "critical";
  }

  return true;
}

function getSafetyNote(blocker: NormalizedBlocker) {
  if (blocker.type === "legal") return "No execution, routing, or contract action until legal risk is reviewed.";
  if (blocker.type === "title") return "Title/ownership issues must be verified before execution.";
  if (blocker.type === "financial") return "Do not proceed until capital/funding risk is resolved.";
  if (blocker.type === "seller") return "No automatic seller outreach in this stage.";
  if (blocker.type === "buyer") return "No buyer routing or buyer outreach in this stage.";
  if (blocker.type === "market") return "Market confidence must be reviewed before execution.";
  if (blocker.type === "data") return "Data can be enriched later but no live actions are allowed now.";
  if (blocker.type === "operations") return "Operational blockers must be cleared before handoff.";

  return "Human review is required before any live execution.";
}

function getResolutionAction(blocker: NormalizedBlocker) {
  return blocker.fix || `Resolve ${blocker.issue.toLowerCase()} before execution.`;
}

function createResolutionStep(blocker: NormalizedBlocker, index: number): ResolutionStep {
  return {
    stepId: `resolution_step_${index + 1}`,
    blockerType: blocker.type,
    blockerIssue: blocker.issue,
    resolutionAction: getResolutionAction(blocker),
    priority: getPriority(blocker),
    ownerRole: getOwnerRole(blocker),
    estimatedDifficulty: getDifficulty(blocker),
    estimatedTimeframe: getTimeframe(blocker),
    canBeAutomatedLater: getCanBeAutomatedLater(blocker),
    requiresHumanApproval: getRequiresHumanApproval(blocker),
    safetyNote: getSafetyNote(blocker),
  };
}

function withDependencyChains(plan: ResolutionStep[]) {
  const legalTitleStepIds = plan
    .filter((step) => step.blockerType === "legal" || step.blockerType === "title")
    .map((step) => step.stepId);
  const financialStepIds = plan
    .filter((step) => step.blockerType === "financial")
    .map((step) => step.stepId);
  const executionCriticalStepIds = plan
    .filter((step) => step.priority === "critical" || ["legal", "title", "financial"].includes(step.blockerType))
    .map((step) => step.stepId);
  const marketStepIds = plan
    .filter((step) => step.blockerType === "market")
    .map((step) => step.stepId);

  return plan.map((step) => {
    const dependencies = new Set<string>();

    if (step.blockerType === "financial") {
      legalTitleStepIds.forEach((stepId) => dependencies.add(stepId));
    }

    if (step.blockerType === "buyer") {
      [...legalTitleStepIds, ...financialStepIds].forEach((stepId) => dependencies.add(stepId));
    }

    if (step.blockerType === "seller" && step.priority === "critical") {
      legalTitleStepIds.forEach((stepId) => dependencies.add(stepId));
    }

    if (step.blockerType === "market") {
      plan
        .filter((candidate) => candidate.blockerType === "data")
        .forEach((candidate) => dependencies.add(candidate.stepId));
    }

    if (step.blockerType === "buyer") {
      marketStepIds.forEach((stepId) => dependencies.add(stepId));
    }

    if (step.blockerType === "operations") {
      executionCriticalStepIds
        .filter((stepId) => stepId !== step.stepId)
        .forEach((stepId) => dependencies.add(stepId));
    }

    const dependsOnStepIds = [...dependencies].filter((stepId) => stepId !== step.stepId);

    return dependsOnStepIds.length > 0 ? { ...step, dependsOnStepIds } : step;
  });
}

function getCriticalPath(plan: ResolutionStep[]) {
  const selected = plan.filter((step) => (
    step.priority === "critical" ||
    (step.priority === "high" && ["legal", "title", "financial"].includes(step.blockerType)) ||
    step.blockerIssue.toLowerCase().includes("strategy dependency")
  ));
  const highestBuyerSeller = plan.find((step) => ["buyer", "seller"].includes(step.blockerType) && (step.priority === "high" || step.priority === "critical"));

  if (highestBuyerSeller && !selected.some((step) => step.stepId === highestBuyerSeller.stepId)) {
    selected.push(highestBuyerSeller);
  }

  return selected.slice(0, 5);
}

function getImpactForStep(step: ResolutionStep) {
  if (step.priority === "critical") {
    return { readiness: 15, confidence: 10, failure: 15 };
  }

  if (step.priority === "high") {
    return { readiness: 10, confidence: 7, failure: 10 };
  }

  if (step.priority === "medium") {
    return { readiness: 5, confidence: 3, failure: 5 };
  }

  return { readiness: 2, confidence: 1, failure: 2 };
}

function getExpectedImpact(
  executionReadiness: unknown,
  criticalPath: ResolutionStep[],
  plan: ResolutionStep[],
): ExpectedImpactAfterResolution {
  const currentReadiness = getNumber(executionReadiness, ["readinessScore"], 0);
  const currentConfidence = getNumber(executionReadiness, ["executionConfidence", "confidenceBreakdown.executionConfidence"], 0);
  const currentFailure = getNumber(executionReadiness, ["failureProbability"], 100);
  const impact = criticalPath.reduce(
    (total, step) => {
      const stepImpact = getImpactForStep(step);

      return {
        readiness: total.readiness + stepImpact.readiness,
        confidence: total.confidence + stepImpact.confidence,
        failure: total.failure + stepImpact.failure,
      };
    },
    { readiness: 0, confidence: 0, failure: 0 },
  );
  const readinessScoreIncrease = Math.min(100 - currentReadiness, impact.readiness);
  const confidenceIncrease = Math.min(100 - currentConfidence, impact.confidence);
  const failureProbabilityDecrease = Math.min(currentFailure, impact.failure);
  const projectedReadiness = clampScore(currentReadiness + readinessScoreIncrease);
  const projectedConfidence = clampScore(currentConfidence + confidenceIncrease);
  const projectedFailure = clampScore(currentFailure - failureProbabilityDecrease);
  const remainingCritical = plan.some((step) => step.priority === "critical" && !criticalPath.some((criticalStep) => criticalStep.stepId === step.stepId));
  const likelyDecisionAfterResolution =
    projectedReadiness >= 80 && projectedConfidence >= 75 && projectedFailure < 30 && !remainingCritical
      ? "GO"
      : projectedReadiness >= 50 && projectedFailure < 60
        ? "HOLD"
        : "STOP";

  return {
    readinessScoreIncrease: clampScore(readinessScoreIncrease),
    confidenceIncrease: clampScore(confidenceIncrease),
    failureProbabilityDecrease: clampScore(failureProbabilityDecrease),
    likelyDecisionAfterResolution,
  };
}

function getProjectedMetrics(
  executionReadiness: unknown,
  expectedImpactAfterResolution: ExpectedImpactAfterResolution,
) {
  const currentReadiness = getNumber(executionReadiness, ["readinessScore"], 0);
  const currentConfidence = getNumber(executionReadiness, ["executionConfidence", "confidenceBreakdown.executionConfidence"], 0);
  const currentFailure = getNumber(executionReadiness, ["failureProbability"], 100);

  return {
    projectedReadiness: clampScore(currentReadiness + expectedImpactAfterResolution.readinessScoreIncrease),
    projectedConfidence: clampScore(currentConfidence + expectedImpactAfterResolution.confidenceIncrease),
    projectedFailureProbability: clampScore(currentFailure - expectedImpactAfterResolution.failureProbabilityDecrease),
  };
}

function getBlockerSeverity(blockers: NormalizedBlocker[], type: string) {
  const matching = blockers.filter((blocker) => blocker.type === type);

  if (matching.some((blocker) => blocker.severity === "critical")) return "critical";
  if (matching.some((blocker) => blocker.severity === "high")) return "high";
  if (matching.some((blocker) => blocker.severity === "medium")) return "medium";
  if (matching.some((blocker) => blocker.severity === "low")) return "low";

  return null;
}

function getRiskProbability(blockers: NormalizedBlocker[], types: string[]) {
  const matching = blockers.filter((blocker) => types.includes(blocker.type));
  const highestSeverity = matching.reduce((highest, blocker) => Math.max(highest, blocker.severity === "critical" ? 15 : blocker.severity === "high" ? 10 : blocker.severity === "medium" ? 5 : 0), 0);

  return clampScore(20 + highestSeverity);
}

function getRiskImpact(blockers: NormalizedBlocker[], types: string[]): PostResolutionRisk["impact"] {
  const matching = blockers.filter((blocker) => types.includes(blocker.type));

  if (matching.some((blocker) => blocker.severity === "critical")) return "high";
  if (matching.some((blocker) => blocker.severity === "high")) return "medium";
  return "low";
}

function getPostResolutionRisks(blockers: NormalizedBlocker[], selectedStrategy: string): PostResolutionRisk[] {
  const strategy = normalizeText(selectedStrategy);
  const risks: PostResolutionRisk[] = [];
  const addRisk = (types: string[], risk: string) => {
    if (blockers.some((blocker) => types.includes(blocker.type))) {
      risks.push({
        risk,
        probability: getRiskProbability(blockers, types),
        impact: getRiskImpact(blockers, types),
      });
    }
  };

  addRisk(["legal", "title"], "Title or legal review may uncover additional execution restrictions.");
  addRisk(["financial"], "Funding or capital assumptions may remain unstable after review.");
  addRisk(["buyer"], "Buyer demand may not convert into executable buyer commitment.");
  addRisk(["seller"], "Seller may delay, ghost, or change terms during resolution.");
  addRisk(["market"], "Market conditions may reduce spread, demand, or exit confidence.");

  if (hasAny(strategy, ["luxury", "estate", "high_end"])) {
    risks.push({
      risk: "Luxury buyer pool may be thinner and timeline may extend.",
      probability: clampScore(20 + (getBlockerSeverity(blockers, "buyer") === "critical" ? 15 : getBlockerSeverity(blockers, "buyer") === "high" ? 10 : 5)),
      impact: "high",
    });
  }

  if (hasAny(strategy, ["creative", "subject_to", "seller_finance", "wrap"])) {
    risks.push({
      risk: "Creative finance structure may require deeper legal and compliance review.",
      probability: clampScore(20 + (blockers.some((blocker) => blocker.type === "legal" || blocker.type === "title") ? 15 : 5)),
      impact: "high",
    });
  }

  return risks;
}

function getOverResolutionAssessment({
  blockers,
  executionReadiness,
  expectedImpactAfterResolution,
}: {
  blockers: NormalizedBlocker[];
  executionReadiness: unknown;
  expectedImpactAfterResolution: ExpectedImpactAfterResolution;
}) {
  const currentReadiness = getNumber(executionReadiness, ["readinessScore"], 0);
  const criticalBlockerCount = blockers.filter((blocker) => blocker.severity === "critical").length;
  const hasCriticalLegalTitle = blockers.some((blocker) => (blocker.type === "legal" || blocker.type === "title") && blocker.severity === "critical");
  const hasCriticalFinancial = blockers.some((blocker) => blocker.type === "financial" && blocker.severity === "critical");
  const projected = getProjectedMetrics(executionReadiness, expectedImpactAfterResolution);

  if (hasCriticalLegalTitle && hasCriticalFinancial) {
    return {
      isOverResolution: true,
      overResolutionReason: "Legal/title and financial blockers make resolution inefficient before strategy reevaluation.",
    };
  }

  if ((blockers.length >= 6 && currentReadiness < 60) || criticalBlockerCount >= 2) {
    return {
      isOverResolution: true,
      overResolutionReason: "Too many execution-critical blockers remain relative to projected readiness.",
    };
  }

  if (expectedImpactAfterResolution.likelyDecisionAfterResolution === "STOP" || projected.projectedReadiness < 50 || projected.projectedFailureProbability >= 60) {
    return {
      isOverResolution: true,
      overResolutionReason: "Projected outcome remains STOP after critical-path resolution.",
    };
  }

  return {
    isOverResolution: false,
    overResolutionReason: undefined,
  };
}

function getResolutionConfidence({
  blockers,
  expectedImpactAfterResolution,
  isOverResolution,
}: {
  blockers: NormalizedBlocker[];
  expectedImpactAfterResolution: ExpectedImpactAfterResolution;
  isOverResolution: boolean;
}) {
  let confidence = 85;
  const mostlyDataOnly = blockers.length > 0 && blockers.filter((blocker) => blocker.type === "data").length / blockers.length >= 0.7;
  const hasCriticalBlocker = blockers.some((blocker) => blocker.severity === "critical");

  for (const blocker of blockers) {
    if ((blocker.type === "legal" || blocker.type === "title") && blocker.severity === "critical") confidence -= 25;
    else if ((blocker.type === "legal" || blocker.type === "title") && blocker.severity === "high") confidence -= 15;
    else if (blocker.type === "financial" && blocker.severity === "critical") confidence -= 20;
    else if (blocker.type === "financial" && blocker.severity === "high") confidence -= 12;
    else if (blocker.type === "buyer" && (blocker.severity === "high" || blocker.severity === "critical")) confidence -= 10;
    else if (blocker.type === "market" && (blocker.severity === "high" || blocker.severity === "critical")) confidence -= 10;
  }

  if (blockers.length > 5) confidence -= 10;
  if (isOverResolution) confidence -= 20;
  if (mostlyDataOnly) confidence += 5;
  if (!hasCriticalBlocker) confidence += 5;
  if (expectedImpactAfterResolution.likelyDecisionAfterResolution === "GO") confidence += 5;

  return clampScore(confidence);
}

function hasCriticalPattern(blockers: NormalizedBlocker[], selectedStrategy: string) {
  const strategy = normalizeText(selectedStrategy);

  if (hasAny(strategy, ["wholesale", "assignment"])) {
    return blockers.some((blocker) => ["buyer", "title", "financial"].includes(blocker.type) && (blocker.severity === "critical" || blocker.severity === "high"));
  }

  if (hasAny(strategy, ["brrrr", "rental", "buy_and_hold"])) {
    return blockers.some((blocker) => ["financial", "market", "operations"].includes(blocker.type) && (blocker.severity === "critical" || blocker.severity === "high"));
  }

  if (hasAny(strategy, ["land"])) {
    return blockers.some((blocker) => ["buyer", "market", "data"].includes(blocker.type) && (blocker.severity === "critical" || blocker.severity === "high"));
  }

  if (hasAny(strategy, ["luxury", "estate", "high_end"])) {
    return blockers.some((blocker) => ["financial", "buyer", "market"].includes(blocker.type) && (blocker.severity === "critical" || blocker.severity === "high"));
  }

  if (hasAny(strategy, ["creative", "subject_to", "seller_finance", "wrap"])) {
    return blockers.some((blocker) => ["legal", "title", "financial"].includes(blocker.type) && (blocker.severity === "critical" || blocker.severity === "high"));
  }

  return false;
}

function getAlternativeStrategySuggestion(selectedStrategy: string, blockers: NormalizedBlocker[]) {
  const strategy = normalizeText(selectedStrategy);
  const blockerText = normalizeText(blockers.map((blocker) => `${blocker.type} ${blocker.issue}`).join(" "));

  if (hasAny(strategy, ["wholesale", "assignment"]) && hasAny(blockerText, ["buyer", "title", "funding", "financial"])) {
    return "Consider creative finance, seller finance, or hold/rental review.";
  }

  if (hasAny(strategy, ["brrrr", "rental", "buy_and_hold"]) && hasAny(blockerText, ["funding", "rent", "repair", "financial", "operations"])) {
    return "Consider wholesale or flip review.";
  }

  if (hasAny(strategy, ["land"]) && hasAny(blockerText, ["buyer", "zoning", "access", "market"])) {
    return "Consider hold, entitlement review, or pass.";
  }

  if (hasAny(strategy, ["luxury", "estate", "high_end"]) && hasAny(blockerText, ["capital", "funding", "buyer", "timeline", "financial"])) {
    return "Consider standard acquisition, partnership/capital review, or pass.";
  }

  if (hasAny(strategy, ["creative", "subject_to", "seller_finance", "wrap"]) && hasAny(blockerText, ["legal", "title", "debt", "financial"])) {
    return "Consider standard wholesale/retail offer review or pass.";
  }

  return "Re-run strategy comparison after blockers are resolved.";
}

function getStrategyReevaluation({
  selectedStrategy,
  blockers,
  executionReadiness,
  expectedImpactAfterResolution,
  resolutionConfidence,
  isOverResolution,
}: {
  selectedStrategy: string;
  blockers: NormalizedBlocker[];
  executionReadiness: unknown;
  expectedImpactAfterResolution: ExpectedImpactAfterResolution;
  resolutionConfidence: number;
  isOverResolution: boolean;
}) {
  const projected = getProjectedMetrics(executionReadiness, expectedImpactAfterResolution);
  const shouldReevaluateStrategy =
    expectedImpactAfterResolution.likelyDecisionAfterResolution === "STOP" ||
    resolutionConfidence < 50 ||
    isOverResolution ||
    hasCriticalPattern(blockers, selectedStrategy) ||
    projected.projectedReadiness < 60 ||
    projected.projectedFailureProbability >= 55;

  return {
    shouldReevaluateStrategy,
    alternativeStrategySuggestion: shouldReevaluateStrategy ? getAlternativeStrategySuggestion(selectedStrategy, blockers) : undefined,
  };
}

function getApprovalRequirements(plan: ResolutionStep[]): ExecutionBlockerResolutionResult["approvalRequirements"] {
  return {
    requiresHumanApproval: plan.some((step) => step.requiresHumanApproval),
    requiresLegalReview: plan.some((step) => step.blockerType === "legal" || step.blockerType === "title"),
    requiresFinanceReview: plan.some((step) => step.blockerType === "financial"),
    requiresDispositionReview: plan.some((step) => step.blockerType === "buyer"),
  };
}

function getAutomationReadiness(plan: ResolutionStep[]): ExecutionBlockerResolutionResult["automationReadiness"] {
  return {
    canCreateTasksLater: true,
    canTriggerFollowUpLater: plan.some((step) => step.blockerType === "seller"),
    canTriggerBuyerValidationLater: plan.some((step) => step.blockerType === "buyer"),
    canTriggerLegalReviewLater: plan.some((step) => step.blockerType === "legal" || step.blockerType === "title"),
    safeForAutomationNow: false,
  };
}

function getResolutionSummary({
  selectedStrategy,
  executionReadiness,
  resolutionPlan,
  criticalPath,
  expectedImpactAfterResolution,
  resolutionConfidence,
  postResolutionRisks,
  shouldReevaluateStrategy,
  alternativeStrategySuggestion,
  isOverResolution,
  overResolutionReason,
  approvalRequirements,
}: {
  selectedStrategy: string;
  executionReadiness: unknown;
  resolutionPlan: ResolutionStep[];
  criticalPath: ResolutionStep[];
  expectedImpactAfterResolution: ExpectedImpactAfterResolution;
  resolutionConfidence: number;
  postResolutionRisks: PostResolutionRisk[];
  shouldReevaluateStrategy: boolean;
  alternativeStrategySuggestion?: string;
  isOverResolution: boolean;
  overResolutionReason?: string;
  approvalRequirements: ExecutionBlockerResolutionResult["approvalRequirements"];
}) {
  const currentDecision = getString(executionReadiness, ["executionDecision"], "UNKNOWN");
  const topBlockers = resolutionPlan.slice(0, 2).map((step) => step.blockerIssue).join(" and ");
  const firstStep = criticalPath[0] ?? resolutionPlan[0];
  const reviewNeeds = [
    approvalRequirements.requiresLegalReview ? "legal/title review" : "",
    approvalRequirements.requiresFinanceReview ? "finance review" : "",
    approvalRequirements.requiresDispositionReview ? "disposition review" : "",
    approvalRequirements.requiresHumanApproval ? "human approval" : "",
  ].filter(Boolean).join(", ");
  const topRisks = postResolutionRisks.slice(0, 2).map((risk) => risk.risk).join(" ");
  const reevaluationNote = shouldReevaluateStrategy
    ? ` Strategy reevaluation is recommended${alternativeStrategySuggestion ? `: ${alternativeStrategySuggestion}` : ""}.`
    : " Strategy reevaluation is not required from this blocker plan alone.";
  const efficiencyNote = isOverResolution
    ? ` Resolution may be inefficient because ${overResolutionReason?.toLowerCase() ?? "projected readiness remains weak"}.`
    : " Resolution effort appears proportionate to the projected improvement.";

  if (resolutionPlan.length === 0) {
    return `${selectedStrategy} has no execution blockers in the provided readiness result. Current decision is ${currentDecision}; resolution confidence is ${resolutionConfidence}%. Keep human approval in place before execution. This stage is read-only and does not execute actions.`;
  }

  return `${selectedStrategy} is currently ${currentDecision} with top blocker(s): ${topBlockers}. Resolution plan confidence is ${resolutionConfidence}%. First required step: ${firstStep.resolutionAction} Required review: ${reviewNeeds || "standard human review"}. Resolving the critical path is projected to add ${expectedImpactAfterResolution.readinessScoreIncrease} readiness points, add ${expectedImpactAfterResolution.confidenceIncrease} confidence points, reduce failure probability by ${expectedImpactAfterResolution.failureProbabilityDecrease} points, and move the likely decision to ${expectedImpactAfterResolution.likelyDecisionAfterResolution}. ${topRisks ? `Post-resolution risks include: ${topRisks}` : "No major post-resolution risks were identified from the provided blockers."}${reevaluationNote}${efficiencyNote} This stage is read-only and does not execute outreach, buyer routing, live execution, or automation.`;
}

export function createExecutionBlockerResolutionPlan(input: ExecutionBlockerResolutionInput): ExecutionBlockerResolutionResult {
  const selectedStrategy = getSelectedStrategy(input);
  const sortedBlockers = sortBlockers(getInputBlockers(input));
  const resolutionPlan = withDependencyChains(sortedBlockers.map(createResolutionStep));
  const criticalPath = getCriticalPath(resolutionPlan);
  const expectedImpactAfterResolution = getExpectedImpact(input.executionReadiness, criticalPath, resolutionPlan);
  const overResolution = getOverResolutionAssessment({
    blockers: sortedBlockers,
    executionReadiness: input.executionReadiness,
    expectedImpactAfterResolution,
  });
  const resolutionConfidence = getResolutionConfidence({
    blockers: sortedBlockers,
    expectedImpactAfterResolution,
    isOverResolution: overResolution.isOverResolution,
  });
  const postResolutionRisks = getPostResolutionRisks(sortedBlockers, selectedStrategy);
  const strategyReevaluation = getStrategyReevaluation({
    selectedStrategy,
    blockers: sortedBlockers,
    executionReadiness: input.executionReadiness,
    expectedImpactAfterResolution,
    resolutionConfidence,
    isOverResolution: overResolution.isOverResolution,
  });
  const approvalRequirements = getApprovalRequirements(resolutionPlan);
  const automationReadiness = getAutomationReadiness(resolutionPlan);

  return {
    resolutionPlan,
    resolutionOrder: resolutionPlan.map((step) => step.stepId),
    criticalPath,
    expectedImpactAfterResolution,
    resolutionConfidence,
    postResolutionRisks,
    ...strategyReevaluation,
    ...overResolution,
    approvalRequirements,
    automationReadiness,
    resolutionSummary: getResolutionSummary({
      selectedStrategy,
      executionReadiness: input.executionReadiness,
      resolutionPlan,
      criticalPath,
      expectedImpactAfterResolution,
      resolutionConfidence,
      postResolutionRisks,
      ...strategyReevaluation,
      ...overResolution,
      approvalRequirements,
    }),
  };
}
