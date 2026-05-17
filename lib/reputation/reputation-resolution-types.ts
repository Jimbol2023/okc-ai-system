export interface ReputationResolutionFinding {
  id: string;
  status: string;
  description: string;
  evidence: readonly string[];
  affectedBusinessUnits: readonly string[];
  affectedGovernanceDomains: readonly string[];
  confidenceScore: number;
  relatedRemediationCategory: string;
}

export interface ReputationResolutionTrackingResult {
  findings: readonly ReputationResolutionFinding[];
  stabilizedAreas: readonly string[];
  overallResolutionStatus: string;
  unresolvedAreas: readonly string[];
  resolutionProgressScore: number;
  recommendations: readonly string[];
  explainability: {
    majorDrivers: readonly string[];
  };
}
