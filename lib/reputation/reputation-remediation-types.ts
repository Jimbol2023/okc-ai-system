export interface ReputationRemediationPlanItem {
  category: string;
  title: string;
  priority: string;
  supportingEvidence: string[];
  affectedBusinessUnits: string[];
  affectedGovernanceDomains: string[];
  confidenceScore: number;
  estimatedComplexity: string;
}

export interface ReputationRemediationPlanningResult {
  remediationReadinessScore: number;
  affectedGovernanceDomains: string[];
  affectedBusinessUnits: string[];
  planItems: ReputationRemediationPlanItem[];
  recommendations: string[];
  explainability: {
    majorDrivers: string[];
  };
}
