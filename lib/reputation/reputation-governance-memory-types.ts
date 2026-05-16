import type { EnterpriseReputationAggregationResult } from "./reputation-aggregation-types";
import type { ReputationEvidenceQualityResult } from "./reputation-evidence-quality-types";
import type { ReputationGovernanceContinuityResult } from "./reputation-governance-continuity-types";
import type { ReputationGovernanceLineageResult } from "./reputation-governance-lineage-types";
import type { ReputationGovernanceResilienceResult } from "./reputation-governance-resilience-types";
import type { ReputationArchitectureImprovementItem } from "./reputation-governance-resilience-types";
import type { ReputationGovernanceResult } from "./reputation-governance-types";
import type { ReputationRemediationPlanningResult } from "./reputation-remediation-types";
import type { ReputationResolutionTrackingResult } from "./reputation-resolution-types";
import type { ReputationTrendResult } from "./reputation-trend-types";

export interface ReputationGovernanceMemoryInput {
  currentResilienceResult?: ReputationGovernanceResilienceResult;
  previousResilienceResults?: ReputationGovernanceResilienceResult[];
  continuityResult?: ReputationGovernanceContinuityResult;
  lineageResult?: ReputationGovernanceLineageResult;
  evidenceQualityResult?: ReputationEvidenceQualityResult;
  resolutionResult?: ReputationResolutionTrackingResult;
  remediationResult?: ReputationRemediationPlanningResult;
  governanceResult?: ReputationGovernanceResult;
  trendResult?: ReputationTrendResult;
  aggregationResult?: EnterpriseReputationAggregationResult;
  evaluatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface ReputationGovernanceMemorySnapshot {
  snapshotId: string;
  evaluatedAt: string;
  continuityStatus?: ReputationGovernanceContinuityResult["continuityStatus"];
  resilienceStatus?: ReputationGovernanceResilienceResult["resilienceStatus"];
  lineageIntegrityScore?: number;
  governanceContinuityScore?: number;
  governanceResilienceScore?: number;
  recurringDrivers: string[];
  stabilizationIndicators: string[];
  fragilityIndicators: string[];
  antiFragilityIndicators: string[];
  evidenceLimitations: string[];
}

export type ReputationGovernanceMemoryPatternType =
  | "recurring_governance_weakness"
  | "recurring_stabilization_success"
  | "recurring_dependency_fragility"
  | "recurring_evidence_gap"
  | "recurring_contradiction_chain"
  | "anti_fragility_evolution"
  | "continuity_preservation_indicator";

export interface ReputationGovernanceMemoryPattern {
  id: string;
  patternType: ReputationGovernanceMemoryPatternType;
  description: string;
  evidence: string[];
  affectedGovernanceDomains: string[];
  affectedBusinessUnits: string[];
  confidenceScore: number;
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export type ReputationInstitutionalMemoryStatus = "thin" | "developing" | "reliable" | "durable";

export interface ReputationGovernanceMemoryResult {
  memoryConfidenceScore: number;
  institutionalMemoryStatus: ReputationInstitutionalMemoryStatus;
  snapshotsReviewed: ReputationGovernanceMemorySnapshot[];
  recurringPatterns: ReputationGovernanceMemoryPattern[];
  governanceLessons: string[];
  longHorizonContext: string[];
  continuityLearningIndicators: string[];
  resilienceLearningIndicators: string[];
  recommendations: string[];
  architectureImprovementReview: ReputationArchitectureImprovementItem[];
  explainability: {
    summary: string[];
    memoryRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
