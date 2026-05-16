export type DealPriority =
  | "urgent"
  | "high"
  | "medium"
  | "low"
  | "avoid";

export type GlobalDealScore = {
  score: number;
  priority: DealPriority;
  scoreBreakdown: {
    decisionStrength: number;
    riskControl: number;
    fundingStrength: number;
    offerQuality: number;
    negotiationReadiness: number;
    conversionLikelihood: number;
    buyerDemand: number;
    closingReadiness: number;
  };
  strongestSignals?: string[];
  warnings?: string[];
  blockers?: string[];
  recommendedFocus?: string;
  recommendedNextStep?: string;
  complianceWarnings?: string[];
};
