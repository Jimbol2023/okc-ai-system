export type ExecutionDecisionType = "go" | "no_go" | "wait" | "fix" | "switch" | "kill";

export type ScoreTone = "positive" | "caution" | "warning" | "danger" | "strategic" | "neutral";

export type DecisionVisualizationInput = {
  decision?: ExecutionDecisionType | string;
  decisionLabel?: string;
  confidenceScore?: number | null;
  reliabilityScore?: number | null;
  riskScore?: number | null;
  uncertaintyScore?: number | null;
  uncertaintyLevel?: string | null;
  overconfidenceDetected?: boolean | null;
  overconfidenceReason?: string | null;
  reasons?: string[];
  rejectedOptions?: string[];
  missingData?: string[];
  warnings?: string[];
  executionBlockers?: string[];
  recommendedNextAction?: string | null;
  scenarioSummary?: DecisionScenarioSummary | null;
  confidenceBreakdown?: DecisionConfidenceBreakdown | null;
  reliabilityBreakdown?: DecisionReliabilityBreakdown | null;
  riskDetails?: DecisionRiskDetail[];
  uncertaintyDetails?: DecisionUncertaintyDetail[];
  scenarioDetails?: DecisionScenarioDetails | null;
  strategyComparison?: DecisionStrategyComparison | null;
  dataConfidence?: DecisionDataConfidence | null;
  insightSummary?: DecisionInsightSummary | null;
  investorSummary?: {
    plainEnglishDecision?: string;
    whyThisDecision?: string;
    biggestRisk?: string;
    missingData?: string[];
    recommendedNextStep?: string;
    capitalRiskNote?: string;
    executionReadinessNote?: string;
  } | null;
};

export type DecisionScenarioSummary = {
  bestScenario?: string | null;
  worstScenario?: string | null;
  mostLikelyScenario?: string | null;
  keyTradeoff?: string | null;
  riskRewardNote?: string | null;
  recommendedPath?: string | null;
};

export type DecisionBreakdownItem = {
  label: string;
  description?: string | null;
  value?: string | number | null;
  weight?: string | number | null;
};

export type DecisionConfidenceBreakdown = {
  increasedBy?: DecisionBreakdownItem[];
  reducedBy?: DecisionBreakdownItem[];
  weightedContributors?: DecisionBreakdownItem[];
};

export type DecisionReliabilityBreakdown = {
  dataQualityIndicators?: DecisionBreakdownItem[];
  missingFieldsImpact?: string[];
  confidenceVsReliability?: string | null;
};

export type DecisionRiskDetail = {
  risk: string;
  severity?: "low" | "medium" | "high" | "critical" | string;
  impact?: string | null;
};

export type DecisionUncertaintyDetail = {
  area: string;
  explanation?: string | null;
  source?: "data_gap" | "market" | "assumption" | "model" | string;
};

export type DecisionScenarioDetails = {
  bestCase?: {
    expectedOutcome?: string | null;
    upside?: string | null;
  } | null;
  worstCase?: {
    expectedOutcome?: string | null;
    downside?: string | null;
  } | null;
  mostLikely?: {
    expectedOutcome?: string | null;
  } | null;
  riskRewardExplanation?: string | null;
  keyAssumptions?: string[];
};

export type DecisionStrategyComparison = {
  selectedStrategy?: string | null;
  whySelectedWon?: string | null;
  alternatives?: Array<{
    strategy: string;
    whyLost?: string | null;
    scoreDifference?: number | null;
    riskDifference?: number | null;
  }>;
};

export type DecisionDataConfidence = {
  completenessScore?: number | null;
  missingCriticalFields?: string[];
  inputReliability?: string | null;
  lowQualityWarning?: string | null;
};

export type DecisionIntegrityLevel = "high" | "medium" | "low";

export type DecisionInsightSummary = {
  integrityLevel?: DecisionIntegrityLevel | null;
  integrityReason?: string | null;
  keyInsights?: string[];
  alertSignals?: string[];
};
