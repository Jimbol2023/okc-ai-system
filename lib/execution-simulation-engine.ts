export type ExecutionSimulationInput = {
  lead?: unknown;
  deal?: unknown;
  assetClassification?: unknown;
  strategyDecision?: unknown;
  strategyComparison?: unknown;
  executionReadiness?: unknown;
  blockerResolution?: unknown;
  buyerIntelligence?: unknown;
  marketContext?: unknown;
  assetContext?: unknown;
  strategies?: string[];
  selectedStrategy?: string;
};

export type ExecutionSimulationStep = {
  stepId: string;
  stepName: string;
  description: string;
  dependsOn: string[];
  estimatedDurationDays: number;
  estimatedCostLow: number;
  estimatedCostHigh: number;
  complexityScore: number;
  riskScore: number;
  failureProbability: number;
  requiredData: string[];
  likelyBlockers: string[];
  recommendedPreparation: string[];
  automationEligibleFuture: boolean;
  humanApprovalRequiredFuture: boolean;
};

export type ExecutionSimulationRisk = {
  risk: string;
  probability: number;
  impact: "low" | "medium" | "high";
  mitigation: string;
  relatedStepIds: string[];
};

export type ExecutionSimulationScenario = {
  projectedTimelineDays: number;
  projectedCostLow: number;
  projectedCostHigh: number;
  successProbability: number;
  mainFailurePoints: string[];
  investorSummary: string;
  recommendedNextReadOnlyAction: string;
};

export type ExecutionSimulationLearningHook = {
  eventName: "simulationGenerated" | "strategySimulated" | "risksPredicted" | "blockersPredicted" | "futureCompareWithActualOutcome";
  payload: Record<string, unknown>;
  shouldWriteNow: false;
};

export type FutureExecutionCompatibility = {
  futureExecutableStep: string;
  requiresHumanApproval: boolean;
  requiresComplianceCheck: boolean;
  requiresBuyerMatch: boolean;
  requiresSellerConsent: boolean;
  requiresFundingReview: boolean;
  requiresDocumentReview: boolean;
  unsafeToAutomateReason: string;
};

export type StrategyExecutionSimulation = {
  strategy: string;
  normalizedStrategy: string;
  steps: ExecutionSimulationStep[];
  timelineEstimateDays: {
    low: number;
    expected: number;
    high: number;
  };
  costEstimate: {
    low: number;
    high: number;
  };
  complexityScore: number;
  riskPoints: ExecutionSimulationRisk[];
  predictedBlockers: string[];
  bestCase: ExecutionSimulationScenario;
  expectedCase: ExecutionSimulationScenario;
  worstCase: ExecutionSimulationScenario;
  futureExecutionCompatibility: FutureExecutionCompatibility[];
  learningHooks: ExecutionSimulationLearningHook[];
};

export type ExecutionSimulationResult = {
  selectedStrategy: string;
  selectedSimulation: StrategyExecutionSimulation;
  comparedStrategies: StrategyExecutionSimulation[];
  strategyComparisonSummary: string;
  highestRiskSteps: ExecutionSimulationStep[];
  blockersToResolveBeforeExecution: string[];
  learningHooks: ExecutionSimulationLearningHook[];
  futureExecutionCompatibility: FutureExecutionCompatibility[];
  readOnlySafetyNote: string;
};

type JsonRecord = Record<string, unknown>;
type StrategyTemplateStep = Omit<
  ExecutionSimulationStep,
  "stepId" | "dependsOn" | "failureProbability" | "likelyBlockers" | "recommendedPreparation"
> & {
  dependsOn?: string[];
  blockerHints?: string[];
  preparationHints?: string[];
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

function getArray(source: unknown, paths: string[]) {
  const value = getPath(source, paths);

  return Array.isArray(value) ? value : [];
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function hasAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function getSelectedStrategy(input: ExecutionSimulationInput) {
  return input.selectedStrategy ||
    getString(input.strategyComparison, ["bestStrategy"]) ||
    getString(input.strategyDecision, ["recommendedStrategy"]) ||
    getString(input.executionReadiness, ["strategyDependencyCheck.selectedStrategy"]) ||
    "pass_or_review";
}

function normalizeStrategy(strategy: string) {
  const normalized = normalizeText(strategy);

  if (hasAny(normalized, ["wholesale", "assignment"])) return "wholesale";
  if (hasAny(normalized, ["wholetail"])) return "wholetail";
  if (hasAny(normalized, ["land_development", "development", "construction", "infill"])) return "land_development";
  if (hasAny(normalized, ["land"])) return "land_flip";
  if (hasAny(normalized, ["fix_and_flip", "flip", "rehab"])) return "fix_and_flip";
  if (hasAny(normalized, ["buy_and_hold", "rental", "hold"])) return "buy_and_hold_rental";
  if (hasAny(normalized, ["seller_finance"])) return "seller_finance";
  if (hasAny(normalized, ["subject_to", "subto"])) return "subject_to";
  if (hasAny(normalized, ["multifamily", "multi_family", "apartment"])) return "multifamily";
  if (hasAny(normalized, ["commercial", "retail", "office", "industrial"])) return "commercial";
  if (hasAny(normalized, ["luxury", "estate", "high_end", "high-end"])) return "luxury_acquisition";

  return "pass_or_review";
}

const STEP_TEMPLATES: Record<string, StrategyTemplateStep[]> = {
  wholesale: [
    {
      stepName: "Human approval gate",
      description: "Review readiness, blockers, seller facts, title posture, and buyer demand before any execution.",
      estimatedDurationDays: 1,
      estimatedCostLow: 0,
      estimatedCostHigh: 150,
      complexityScore: 30,
      riskScore: 35,
      requiredData: ["execution readiness result", "seller contact", "property address"],
      automationEligibleFuture: false,
      humanApprovalRequiredFuture: true,
      blockerHints: ["missing approval", "unclear seller facts"],
      preparationHints: ["Confirm no outreach or routing has been triggered."],
    },
    {
      stepName: "Validate seller and property facts",
      description: "Confirm seller identity, property address, asking price, condition, and motivation.",
      dependsOn: ["step_1"],
      estimatedDurationDays: 1,
      estimatedCostLow: 0,
      estimatedCostHigh: 100,
      complexityScore: 35,
      riskScore: 45,
      requiredData: ["seller contact", "asking price", "condition notes"],
      automationEligibleFuture: true,
      humanApprovalRequiredFuture: true,
      blockerHints: ["seller contact missing", "asking price missing"],
      preparationHints: ["Prepare a human-reviewed seller fact checklist."],
    },
    {
      stepName: "Confirm title and ownership confidence",
      description: "Verify ownership posture, title concerns, liens, probate, or legal restrictions before buyer matching.",
      dependsOn: ["step_1"],
      estimatedDurationDays: 2,
      estimatedCostLow: 50,
      estimatedCostHigh: 300,
      complexityScore: 50,
      riskScore: 60,
      requiredData: ["title confidence", "ownership data"],
      automationEligibleFuture: false,
      humanApprovalRequiredFuture: true,
      blockerHints: ["title confidence missing", "legal review required"],
      preparationHints: ["Request title/ownership review before execution approval."],
    },
    {
      stepName: "Validate buyer demand",
      description: "Confirm there is real buyer demand for the asset, price band, location, and condition.",
      dependsOn: ["step_3"],
      estimatedDurationDays: 2,
      estimatedCostLow: 0,
      estimatedCostHigh: 250,
      complexityScore: 45,
      riskScore: 55,
      requiredData: ["buyer demand validation", "spread evidence"],
      automationEligibleFuture: true,
      humanApprovalRequiredFuture: true,
      blockerHints: ["buyer demand missing", "spread too thin"],
      preparationHints: ["Prepare buyer validation criteria for future approval."],
    },
    {
      stepName: "Prepare assignment execution review",
      description: "Package decision notes, risks, pricing, and human approval needs for future assignment execution.",
      dependsOn: ["step_2", "step_3", "step_4"],
      estimatedDurationDays: 1,
      estimatedCostLow: 0,
      estimatedCostHigh: 100,
      complexityScore: 40,
      riskScore: 45,
      requiredData: ["approval notes", "buyer validation", "seller terms"],
      automationEligibleFuture: true,
      humanApprovalRequiredFuture: true,
      blockerHints: ["approval not complete"],
      preparationHints: ["Keep all execution actions disabled until approval."],
    },
  ],
  wholetail: [
    {
      stepName: "Approval and wholetail fit review",
      description: "Confirm the property can be cleaned, listed, or resold with limited improvements.",
      estimatedDurationDays: 1,
      estimatedCostLow: 0,
      estimatedCostHigh: 200,
      complexityScore: 40,
      riskScore: 45,
      requiredData: ["condition", "ARV", "repair range"],
      automationEligibleFuture: false,
      humanApprovalRequiredFuture: true,
      blockerHints: ["unclear condition", "weak ARV"],
      preparationHints: ["Confirm wholetail thesis before any contract action."],
    },
    {
      stepName: "Light repair and cleanup estimate",
      description: "Estimate cleanout, safety, and light repair scope.",
      dependsOn: ["step_1"],
      estimatedDurationDays: 3,
      estimatedCostLow: 1500,
      estimatedCostHigh: 10000,
      complexityScore: 55,
      riskScore: 50,
      requiredData: ["repair estimate", "photos"],
      automationEligibleFuture: true,
      humanApprovalRequiredFuture: true,
      blockerHints: ["repair estimate missing"],
      preparationHints: ["Collect contractor-backed light scope."],
    },
    {
      stepName: "Resale channel validation",
      description: "Validate retail, investor, or MLS resale route before committing capital.",
      dependsOn: ["step_2"],
      estimatedDurationDays: 3,
      estimatedCostLow: 0,
      estimatedCostHigh: 500,
      complexityScore: 60,
      riskScore: 55,
      requiredData: ["resale comps", "buyer demand"],
      automationEligibleFuture: true,
      humanApprovalRequiredFuture: true,
      blockerHints: ["resale demand missing"],
      preparationHints: ["Compare resale routes and holding assumptions."],
    },
  ],
  fix_and_flip: [
    {
      stepName: "Flip approval and capital review",
      description: "Confirm approval, capital availability, ARV, repairs, and timeline before execution.",
      estimatedDurationDays: 2,
      estimatedCostLow: 0,
      estimatedCostHigh: 500,
      complexityScore: 60,
      riskScore: 60,
      requiredData: ["funding path", "ARV", "repair estimate"],
      automationEligibleFuture: false,
      humanApprovalRequiredFuture: true,
      blockerHints: ["funding path missing", "ARV weak"],
      preparationHints: ["Complete capital and underwriting review."],
    },
    {
      stepName: "Detailed rehab scope",
      description: "Build line-item scope, contingency, contractor timeline, and inspection assumptions.",
      dependsOn: ["step_1"],
      estimatedDurationDays: 5,
      estimatedCostLow: 500,
      estimatedCostHigh: 2500,
      complexityScore: 70,
      riskScore: 65,
      requiredData: ["contractor estimate", "condition photos"],
      automationEligibleFuture: true,
      humanApprovalRequiredFuture: true,
      blockerHints: ["repair estimate missing", "scope unknown"],
      preparationHints: ["Add contingency for unknown repair exposure."],
    },
    {
      stepName: "Resale and holding model",
      description: "Validate resale timeline, carrying cost, listing path, and exit sensitivity.",
      dependsOn: ["step_1", "step_2"],
      estimatedDurationDays: 3,
      estimatedCostLow: 0,
      estimatedCostHigh: 750,
      complexityScore: 65,
      riskScore: 60,
      requiredData: ["resale comps", "holding cost model"],
      automationEligibleFuture: true,
      humanApprovalRequiredFuture: true,
      blockerHints: ["market confidence weak"],
      preparationHints: ["Stress test resale timeline and price reduction."],
    },
  ],
  buy_and_hold_rental: [
    {
      stepName: "Hold strategy approval",
      description: "Confirm portfolio fit, funding source, rent assumptions, and management readiness.",
      estimatedDurationDays: 2,
      estimatedCostLow: 0,
      estimatedCostHigh: 500,
      complexityScore: 55,
      riskScore: 50,
      requiredData: ["funding path", "rent estimate", "portfolio fit"],
      automationEligibleFuture: false,
      humanApprovalRequiredFuture: true,
      blockerHints: ["funding path missing", "rent estimate missing"],
      preparationHints: ["Validate debt service and management assumptions."],
    },
    {
      stepName: "Rental underwriting",
      description: "Model rent, vacancy, repairs, management, taxes, insurance, and cashflow.",
      dependsOn: ["step_1"],
      estimatedDurationDays: 3,
      estimatedCostLow: 0,
      estimatedCostHigh: 500,
      complexityScore: 60,
      riskScore: 55,
      requiredData: ["monthly rent", "operating expenses", "repair estimate"],
      automationEligibleFuture: true,
      humanApprovalRequiredFuture: true,
      blockerHints: ["rent estimate weak", "repair estimate missing"],
      preparationHints: ["Run conservative cashflow sensitivity."],
    },
    {
      stepName: "Funding and closing readiness",
      description: "Confirm lender, capital stack, closing requirements, and reserves.",
      dependsOn: ["step_1", "step_2"],
      estimatedDurationDays: 7,
      estimatedCostLow: 500,
      estimatedCostHigh: 3000,
      complexityScore: 70,
      riskScore: 60,
      requiredData: ["lender terms", "cash to close", "reserves"],
      automationEligibleFuture: false,
      humanApprovalRequiredFuture: true,
      blockerHints: ["funding review required"],
      preparationHints: ["Obtain human finance approval before execution."],
    },
  ],
  seller_finance: [
    {
      stepName: "Terms and seller motivation review",
      description: "Validate seller motivation, proposed terms, payment tolerance, and approval posture.",
      estimatedDurationDays: 2,
      estimatedCostLow: 0,
      estimatedCostHigh: 300,
      complexityScore: 60,
      riskScore: 55,
      requiredData: ["seller motivation", "terms", "debt info"],
      automationEligibleFuture: true,
      humanApprovalRequiredFuture: true,
      blockerHints: ["seller motivation missing", "debt info missing"],
      preparationHints: ["Prepare terms review for human approval."],
    },
    {
      stepName: "Legal and document review",
      description: "Review compliance, documentation, title, and servicing requirements.",
      dependsOn: ["step_1"],
      estimatedDurationDays: 5,
      estimatedCostLow: 500,
      estimatedCostHigh: 2500,
      complexityScore: 80,
      riskScore: 75,
      requiredData: ["legal review", "title confidence", "payment terms"],
      automationEligibleFuture: false,
      humanApprovalRequiredFuture: true,
      blockerHints: ["legal review missing", "title issue"],
      preparationHints: ["Do not execute documents without legal review."],
    },
  ],
  subject_to: [
    {
      stepName: "Debt and payment verification",
      description: "Validate mortgage balance, arrears, payment, lender posture, and seller consent risk.",
      estimatedDurationDays: 3,
      estimatedCostLow: 0,
      estimatedCostHigh: 500,
      complexityScore: 75,
      riskScore: 75,
      requiredData: ["mortgage balance", "payment", "seller consent"],
      automationEligibleFuture: false,
      humanApprovalRequiredFuture: true,
      blockerHints: ["debt info missing", "seller consent unclear"],
      preparationHints: ["Verify debt details before any execution planning."],
    },
    {
      stepName: "Legal/title compliance review",
      description: "Review title, due-on-sale risk, disclosures, and compliance requirements.",
      dependsOn: ["step_1"],
      estimatedDurationDays: 7,
      estimatedCostLow: 750,
      estimatedCostHigh: 3000,
      complexityScore: 85,
      riskScore: 80,
      requiredData: ["legal review", "title confidence", "compliance notes"],
      automationEligibleFuture: false,
      humanApprovalRequiredFuture: true,
      blockerHints: ["legal review required", "title confidence missing"],
      preparationHints: ["Require legal and human approval before execution."],
    },
  ],
  land_flip: [
    {
      stepName: "Parcel and zoning validation",
      description: "Confirm parcel identity, access, utilities, zoning, and use restrictions.",
      estimatedDurationDays: 5,
      estimatedCostLow: 100,
      estimatedCostHigh: 1000,
      complexityScore: 65,
      riskScore: 65,
      requiredData: ["parcel address", "zoning", "access/utilities"],
      automationEligibleFuture: true,
      humanApprovalRequiredFuture: true,
      blockerHints: ["zoning unknown", "access unknown"],
      preparationHints: ["Confirm parcel facts before buyer validation."],
    },
    {
      stepName: "Land buyer demand validation",
      description: "Confirm developer, builder, investor, or land buyer demand.",
      dependsOn: ["step_1"],
      estimatedDurationDays: 4,
      estimatedCostLow: 0,
      estimatedCostHigh: 500,
      complexityScore: 60,
      riskScore: 70,
      requiredData: ["buyer demand", "use case"],
      automationEligibleFuture: true,
      humanApprovalRequiredFuture: true,
      blockerHints: ["land buyer demand missing"],
      preparationHints: ["Validate buyer demand without routing buyers yet."],
    },
  ],
  land_development: [
    {
      stepName: "Development feasibility review",
      description: "Review zoning, entitlement path, utilities, access, and site constraints.",
      estimatedDurationDays: 10,
      estimatedCostLow: 1000,
      estimatedCostHigh: 7500,
      complexityScore: 85,
      riskScore: 80,
      requiredData: ["zoning", "utilities", "entitlement path"],
      automationEligibleFuture: false,
      humanApprovalRequiredFuture: true,
      blockerHints: ["zoning unknown", "utilities unknown"],
      preparationHints: ["Use human development review before execution."],
    },
    {
      stepName: "Capital and partner review",
      description: "Validate capital stack, partners, timeline, and entitlement risk tolerance.",
      dependsOn: ["step_1"],
      estimatedDurationDays: 7,
      estimatedCostLow: 500,
      estimatedCostHigh: 5000,
      complexityScore: 80,
      riskScore: 75,
      requiredData: ["capital path", "partner interest", "timeline"],
      automationEligibleFuture: false,
      humanApprovalRequiredFuture: true,
      blockerHints: ["funding path missing"],
      preparationHints: ["Confirm capital before any execution path."],
    },
  ],
  multifamily: [
    {
      stepName: "Income and occupancy validation",
      description: "Validate rent roll, occupancy, unit mix, expenses, and operating assumptions.",
      estimatedDurationDays: 5,
      estimatedCostLow: 0,
      estimatedCostHigh: 1500,
      complexityScore: 75,
      riskScore: 70,
      requiredData: ["rent roll", "occupancy", "expenses"],
      automationEligibleFuture: true,
      humanApprovalRequiredFuture: true,
      blockerHints: ["rent data missing", "occupancy missing"],
      preparationHints: ["Normalize income before finance review."],
    },
    {
      stepName: "Debt and valuation review",
      description: "Validate cap rate, valuation, financing, reserves, and due diligence timeline.",
      dependsOn: ["step_1"],
      estimatedDurationDays: 7,
      estimatedCostLow: 500,
      estimatedCostHigh: 5000,
      complexityScore: 80,
      riskScore: 75,
      requiredData: ["NOI", "cap rate", "funding path"],
      automationEligibleFuture: false,
      humanApprovalRequiredFuture: true,
      blockerHints: ["valuation confidence weak", "funding path missing"],
      preparationHints: ["Require finance and human approval before execution."],
    },
  ],
  commercial: [
    {
      stepName: "Commercial diligence review",
      description: "Review leases, tenant quality, use, zoning, environmental risk, and valuation.",
      estimatedDurationDays: 10,
      estimatedCostLow: 1000,
      estimatedCostHigh: 10000,
      complexityScore: 85,
      riskScore: 80,
      requiredData: ["leases", "NOI", "zoning", "tenant profile"],
      automationEligibleFuture: false,
      humanApprovalRequiredFuture: true,
      blockerHints: ["lease data missing", "zoning issue"],
      preparationHints: ["Complete commercial diligence before any action."],
    },
    {
      stepName: "Capital and exit review",
      description: "Validate debt terms, investor appetite, exit route, and holding risk.",
      dependsOn: ["step_1"],
      estimatedDurationDays: 7,
      estimatedCostLow: 500,
      estimatedCostHigh: 7500,
      complexityScore: 80,
      riskScore: 75,
      requiredData: ["funding path", "exit strategy"],
      automationEligibleFuture: false,
      humanApprovalRequiredFuture: true,
      blockerHints: ["funding path missing", "exit unclear"],
      preparationHints: ["Require finance review and human approval."],
    },
  ],
  luxury_acquisition: [
    {
      stepName: "Luxury market and buyer pool review",
      description: "Validate high-end comps, buyer pool, lifestyle fit, capital path, and hold tolerance.",
      estimatedDurationDays: 7,
      estimatedCostLow: 500,
      estimatedCostHigh: 5000,
      complexityScore: 80,
      riskScore: 75,
      requiredData: ["luxury comps", "buyer pool", "capital path"],
      automationEligibleFuture: false,
      humanApprovalRequiredFuture: true,
      blockerHints: ["luxury buyer pool unverified", "capital path missing"],
      preparationHints: ["Confirm luxury demand before execution approval."],
    },
    {
      stepName: "High-end disposition plan",
      description: "Build longer-hold, pricing, staging, and buyer channel assumptions.",
      dependsOn: ["step_1"],
      estimatedDurationDays: 5,
      estimatedCostLow: 1000,
      estimatedCostHigh: 10000,
      complexityScore: 75,
      riskScore: 70,
      requiredData: ["hold tolerance", "pricing strategy"],
      automationEligibleFuture: true,
      humanApprovalRequiredFuture: true,
      blockerHints: ["timeline risk", "thin buyer pool"],
      preparationHints: ["Stress test price and hold duration."],
    },
  ],
  pass_or_review: [
    {
      stepName: "Manual review",
      description: "Pause execution and review missing strategy, blocker, confidence, and safety context.",
      estimatedDurationDays: 1,
      estimatedCostLow: 0,
      estimatedCostHigh: 250,
      complexityScore: 40,
      riskScore: 60,
      requiredData: ["strategy decision", "readiness decision"],
      automationEligibleFuture: false,
      humanApprovalRequiredFuture: true,
      blockerHints: ["strategy unclear", "execution not ready"],
      preparationHints: ["Re-run strategy comparison and readiness before execution."],
    },
  ],
};

function getContextBlockers(context: ExecutionSimulationInput) {
  const readinessBlockers = getArray(context.executionReadiness, ["blockers"]);
  const resolutionPlan = getArray(context.blockerResolution, ["resolutionPlan"]);
  const blockers = readinessBlockers.map((blocker) => asRecord(blocker).issue).filter((issue): issue is string => typeof issue === "string");
  const resolutionBlockers = resolutionPlan.map((step) => asRecord(step).blockerIssue).filter((issue): issue is string => typeof issue === "string");

  return [...new Set([...blockers, ...resolutionBlockers])];
}

function getContextRiskAdjustment(context: ExecutionSimulationInput) {
  const failureProbability = getNumber(context.executionReadiness, ["failureProbability"], 30);
  const resolutionConfidence = getNumber(context.blockerResolution, ["resolutionConfidence"], 75);
  const decisionPressure = getNumber(context.strategyComparison, ["decisionPressureScore"], 50);

  return clampScore(failureProbability * 0.35 + (100 - resolutionConfidence) * 0.3 + (100 - decisionPressure) * 0.15);
}

function hydrateStep(step: StrategyTemplateStep, index: number, context: ExecutionSimulationInput): ExecutionSimulationStep {
  const stepId = `step_${index + 1}`;
  const contextBlockers = getContextBlockers(context);
  const riskAdjustment = getContextRiskAdjustment(context);
  const likelyBlockers = [
    ...(step.blockerHints ?? []),
    ...contextBlockers.filter((blocker) => step.requiredData.some((data) => normalizeText(blocker).includes(normalizeText(data).split(" ")[0]))),
  ];
  const riskScore = clampScore(step.riskScore + riskAdjustment * 0.25 + likelyBlockers.length * 3);

  return {
    ...step,
    stepId,
    dependsOn: step.dependsOn ?? [],
    riskScore,
    failureProbability: clampScore(riskScore * 0.55 + step.complexityScore * 0.2),
    likelyBlockers: [...new Set(likelyBlockers)],
    recommendedPreparation: step.preparationHints ?? [],
  };
}

function getTemplate(strategy: string) {
  return STEP_TEMPLATES[normalizeStrategy(strategy)] ?? STEP_TEMPLATES.pass_or_review;
}

function getTimeline(steps: ExecutionSimulationStep[]) {
  const expected = steps.reduce((total, step) => total + step.estimatedDurationDays, 0);

  return {
    low: Math.max(1, Math.round(expected * 0.75)),
    expected,
    high: Math.max(expected, Math.round(expected * 1.45)),
  };
}

function getCostEstimate(steps: ExecutionSimulationStep[]) {
  return {
    low: steps.reduce((total, step) => total + step.estimatedCostLow, 0),
    high: steps.reduce((total, step) => total + step.estimatedCostHigh, 0),
  };
}

function getComplexityScore(steps: ExecutionSimulationStep[]) {
  if (steps.length === 0) return 0;

  return clampScore(steps.reduce((total, step) => total + step.complexityScore, 0) / steps.length);
}

function getRiskPoints(steps: ExecutionSimulationStep[], context: ExecutionSimulationInput): ExecutionSimulationRisk[] {
  const blockerRisks = getContextBlockers(context).slice(0, 5).map((blocker, index) => ({
    risk: blocker,
    probability: clampScore(40 + index * 5),
    impact: "medium" as const,
    mitigation: "Resolve through execution readiness and blocker resolution before any action.",
    relatedStepIds: steps.filter((step) => step.likelyBlockers.includes(blocker)).map((step) => step.stepId),
  }));
  const stepRisks = steps
    .filter((step) => step.riskScore >= 65 || step.failureProbability >= 50)
    .map((step) => ({
      risk: `${step.stepName} may delay or fail without preparation.`,
      probability: step.failureProbability,
      impact: step.riskScore >= 75 ? "high" as const : "medium" as const,
      mitigation: step.recommendedPreparation[0] ?? "Require human review before advancing.",
      relatedStepIds: [step.stepId],
    }));

  return [...blockerRisks, ...stepRisks].slice(0, 8);
}

function getPredictedBlockers(steps: ExecutionSimulationStep[], context: ExecutionSimulationInput) {
  return [...new Set([...getContextBlockers(context), ...steps.flatMap((step) => step.likelyBlockers)])].slice(0, 10);
}

function getScenario({
  kind,
  strategy,
  steps,
  timeline,
  cost,
  risks,
}: {
  kind: "best" | "expected" | "worst";
  strategy: string;
  steps: ExecutionSimulationStep[];
  timeline: ReturnType<typeof getTimeline>;
  cost: ReturnType<typeof getCostEstimate>;
  risks: ExecutionSimulationRisk[];
}): ExecutionSimulationScenario {
  const averageFailure = steps.length > 0 ? steps.reduce((total, step) => total + step.failureProbability, 0) / steps.length : 50;
  const timelineMultiplier = kind === "best" ? 0.8 : kind === "worst" ? 1.6 : 1;
  const costMultiplierLow = kind === "best" ? 0.85 : kind === "worst" ? 1.15 : 1;
  const costMultiplierHigh = kind === "best" ? 0.9 : kind === "worst" ? 1.45 : 1;
  const successAdjustment = kind === "best" ? 18 : kind === "worst" ? -25 : 0;
  const successProbability = clampScore(100 - averageFailure + successAdjustment);
  const projectedTimelineDays = Math.max(1, Math.round(timeline.expected * timelineMultiplier));
  const mainFailurePoints = risks.slice(0, kind === "best" ? 2 : kind === "worst" ? 5 : 3).map((risk) => risk.risk);

  return {
    projectedTimelineDays,
    projectedCostLow: Math.round(cost.low * costMultiplierLow),
    projectedCostHigh: Math.round(cost.high * costMultiplierHigh),
    successProbability,
    mainFailurePoints,
    investorSummary: `${strategy} ${kind}-case simulation projects ${projectedTimelineDays} day(s), ${successProbability}/100 success probability, and primary exposure around ${mainFailurePoints[0] ?? "execution approval"}.`,
    recommendedNextReadOnlyAction: "Review simulation assumptions and resolve blockers before any execution, outreach, routing, or automation.",
  };
}

function getFutureCompatibility(steps: ExecutionSimulationStep[]): FutureExecutionCompatibility[] {
  return steps.map((step) => {
    const requiredText = normalizeText(step.requiredData.join(" ") + " " + step.description);

    return {
      futureExecutableStep: step.stepName,
      requiresHumanApproval: true,
      requiresComplianceCheck: step.humanApprovalRequiredFuture || hasAny(requiredText, ["legal", "title", "compliance", "document"]),
      requiresBuyerMatch: hasAny(requiredText, ["buyer", "demand", "disposition"]),
      requiresSellerConsent: hasAny(requiredText, ["seller", "motivation", "terms", "consent"]),
      requiresFundingReview: hasAny(requiredText, ["funding", "capital", "lender", "finance", "debt"]),
      requiresDocumentReview: hasAny(requiredText, ["document", "contract", "title", "legal"]),
      unsafeToAutomateReason: "Future only - this simulator is read-only and does not execute actions.",
    };
  });
}

function getLearningHooks(strategy: string, simulation?: Partial<StrategyExecutionSimulation>): ExecutionSimulationLearningHook[] {
  return [
    {
      eventName: "simulationGenerated",
      payload: { strategy },
      shouldWriteNow: false,
    },
    {
      eventName: "strategySimulated",
      payload: { strategy, timelineDays: simulation?.timelineEstimateDays?.expected },
      shouldWriteNow: false,
    },
    {
      eventName: "risksPredicted",
      payload: { strategy, riskCount: simulation?.riskPoints?.length ?? 0 },
      shouldWriteNow: false,
    },
    {
      eventName: "blockersPredicted",
      payload: { strategy, blockerCount: simulation?.predictedBlockers?.length ?? 0 },
      shouldWriteNow: false,
    },
    {
      eventName: "futureCompareWithActualOutcome",
      payload: { strategy, compareFields: ["timelineDays", "costRange", "blockers", "successOutcome"] },
      shouldWriteNow: false,
    },
  ];
}

export function simulateStrategyExecution(strategy: string, context: ExecutionSimulationInput = {}): StrategyExecutionSimulation {
  const normalizedStrategy = normalizeStrategy(strategy);
  const steps = getTemplate(strategy).map((step, index) => hydrateStep(step, index, context));
  const timelineEstimateDays = getTimeline(steps);
  const costEstimate = getCostEstimate(steps);
  const complexityScore = getComplexityScore(steps);
  const riskPoints = getRiskPoints(steps, context);
  const predictedBlockers = getPredictedBlockers(steps, context);
  const bestCase = getScenario({ kind: "best", strategy: normalizedStrategy, steps, timeline: timelineEstimateDays, cost: costEstimate, risks: riskPoints });
  const expectedCase = getScenario({ kind: "expected", strategy: normalizedStrategy, steps, timeline: timelineEstimateDays, cost: costEstimate, risks: riskPoints });
  const worstCase = getScenario({ kind: "worst", strategy: normalizedStrategy, steps, timeline: timelineEstimateDays, cost: costEstimate, risks: riskPoints });
  const partialSimulation = {
    strategy,
    normalizedStrategy,
    steps,
    timelineEstimateDays,
    costEstimate,
    complexityScore,
    riskPoints,
    predictedBlockers,
    bestCase,
    expectedCase,
    worstCase,
    futureExecutionCompatibility: getFutureCompatibility(steps),
  };

  return {
    ...partialSimulation,
    learningHooks: getLearningHooks(strategy, partialSimulation),
  };
}

export function compareExecutionSimulations(strategies: string[], context: ExecutionSimulationInput = {}) {
  return [...new Set(strategies.filter(Boolean))].map((strategy) => simulateStrategyExecution(strategy, context));
}

function getStrategiesToCompare(input: ExecutionSimulationInput) {
  if (input.strategies && input.strategies.length > 0) {
    return input.strategies;
  }

  const comparisonStrategies = getArray(input.strategyComparison, ["viableStrategies", "strategies"])
    .map((strategy) => getString(strategy, ["strategy"]))
    .filter(Boolean);
  const selected = getSelectedStrategy(input);

  return [...new Set([selected, ...comparisonStrategies])].slice(0, 5);
}

function getComparisonSummary(simulations: StrategyExecutionSimulation[]) {
  if (simulations.length === 0) {
    return "No execution simulations were generated from the available inputs.";
  }

  const best = [...simulations].sort((a, b) =>
    b.expectedCase.successProbability - a.expectedCase.successProbability ||
    a.timelineEstimateDays.expected - b.timelineEstimateDays.expected ||
    a.complexityScore - b.complexityScore,
  )[0];

  return `${best.normalizedStrategy} has the strongest simulated execution profile with ${best.expectedCase.successProbability}/100 expected success probability, ${best.timelineEstimateDays.expected} expected day(s), and ${best.complexityScore}/100 complexity.`;
}

export function simulateExecutionFlow(input: ExecutionSimulationInput): ExecutionSimulationResult {
  const selectedStrategy = getSelectedStrategy(input);
  const strategies = getStrategiesToCompare(input);
  const comparedStrategies = compareExecutionSimulations(strategies, input);
  const selectedSimulation =
    comparedStrategies.find((simulation) => simulation.strategy === selectedStrategy || simulation.normalizedStrategy === normalizeStrategy(selectedStrategy)) ??
    simulateStrategyExecution(selectedStrategy, input);
  const highestRiskSteps = [...selectedSimulation.steps]
    .sort((a, b) => b.riskScore - a.riskScore || b.failureProbability - a.failureProbability)
    .slice(0, 5);

  return {
    selectedStrategy,
    selectedSimulation,
    comparedStrategies,
    strategyComparisonSummary: getComparisonSummary(comparedStrategies),
    highestRiskSteps,
    blockersToResolveBeforeExecution: selectedSimulation.predictedBlockers,
    learningHooks: comparedStrategies.flatMap((simulation) => simulation.learningHooks),
    futureExecutionCompatibility: selectedSimulation.futureExecutionCompatibility,
    readOnlySafetyNote: "Execution simulation is read-only. It does not send SMS, use Twilio, trigger outreach, route deals, execute automation, or mutate records.",
  };
}
