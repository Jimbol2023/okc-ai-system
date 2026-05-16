import type { EnterpriseReputationAggregationResult } from "./reputation-aggregation-types";
import type { ReputationEarlyWarningResult } from "./reputation-early-warning-types";
import type { ReputationGovernanceResult } from "./reputation-governance-types";
import type { ReputationRemediationPlanningResult } from "./reputation-remediation-types";
import type { ReputationResolutionTrackingResult } from "./reputation-resolution-types";
import type { ReputationSignal } from "./reputation-types";
import type { ReputationTrendResult } from "./reputation-trend-types";

export type ReputationEvidenceReliabilityLevel = "weak" | "partial" | "moderate" | "strong" | "highly_reliable";

export type ReputationEvidenceQualityFindingType =
  | "evidence_missing"
  | "evidence_incomplete"
  | "evidence_outdated"
  | "evidence_inconsistent"
  | "evidence_supports_stabilization"
  | "evidence_contradicts_stabilization"
  | "recurring_issue_without_resolution_evidence"
  | "remediation_without_supporting_evidence";

export interface ReputationEvidenceQualityInput {
  resolutionResult?: ReputationResolutionTrackingResult;
  remediationResult?: ReputationRemediationPlanningResult;
  governanceResult?: ReputationGovernanceResult;
  earlyWarningResult?: ReputationEarlyWarningResult;
  trendResult?: ReputationTrendResult;
  aggregationResult?: EnterpriseReputationAggregationResult;
  signals?: ReputationSignal[];
  evaluatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface ReputationEvidenceQualityFinding {
  id: string;
  findingType: ReputationEvidenceQualityFindingType;
  reliabilityLevel: ReputationEvidenceReliabilityLevel;
  description: string;
  supportingEvidence: string[];
  missingEvidence: string[];
  contradictions: string[];
  affectedBusinessUnits: string[];
  affectedGovernanceDomains: string[];
  recommendedHumanReview: string;
  confidenceScore: number;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface ReputationEvidenceQualityResult {
  overallReliabilityLevel: ReputationEvidenceReliabilityLevel;
  evidenceQualityScore: number;
  findings: ReputationEvidenceQualityFinding[];
  missingEvidenceAreas: string[];
  contradictionAreas: string[];
  stabilizationSupportedAreas: string[];
  recommendations: string[];
  explainability: {
    summary: string[];
    rulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
