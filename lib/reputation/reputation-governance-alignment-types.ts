import type { EnterpriseReputationAggregationResult } from "./reputation-aggregation-types";
import type { ReputationEvidenceQualityResult } from "./reputation-evidence-quality-types";
import type { ReputationGovernanceContinuityResult } from "./reputation-governance-continuity-types";
import type { ReputationGovernanceDoctrineResult } from "./reputation-governance-doctrine-types";
import type { ReputationGovernanceLineageResult } from "./reputation-governance-lineage-types";
import type { ReputationGovernanceMemoryResult } from "./reputation-governance-memory-types";
import type {
  ReputationArchitectureImprovementItem,
  ReputationGovernanceResilienceResult,
} from "./reputation-governance-resilience-types";
import type { ReputationGovernanceResult } from "./reputation-governance-types";
import type { ReputationRemediationPlanningResult } from "./reputation-remediation-types";
import type { ReputationResolutionTrackingResult } from "./reputation-resolution-types";
import type { ReputationTrendResult } from "./reputation-trend-types";

export interface ReputationGovernanceAlignmentInput {
  doctrineResult?: ReputationGovernanceDoctrineResult;
  memoryResult?: ReputationGovernanceMemoryResult;
  resilienceResult?: ReputationGovernanceResilienceResult;
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

export type ReputationGovernanceAlignmentStatus =
  | "misaligned"
  | "partially_aligned"
  | "aligned"
  | "strongly_aligned";

export type ReputationGovernanceAlignmentType =
  | "doctrine_alignment"
  | "evidence_alignment"
  | "remediation_alignment"
  | "resolution_alignment"
  | "continuity_alignment"
  | "resilience_alignment"
  | "reviewability_alignment";

export interface ReputationGovernanceAlignmentFinding {
  id: string;
  alignmentType: ReputationGovernanceAlignmentType;
  status: ReputationGovernanceAlignmentStatus;
  description: string;
  supportingEvidence: string[];
  conflictingEvidence: string[];
  affectedGovernanceDomains: string[];
  confidenceScore: number;
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface ReputationGovernanceAlignmentResult {
  overallAlignmentStatus: ReputationGovernanceAlignmentStatus;
  governanceAlignmentScore: number;
  findings: ReputationGovernanceAlignmentFinding[];
  alignmentStrengths: string[];
  alignmentGaps: string[];
  alignmentDriftFindings: string[];
  doctrinePracticeGaps: string[];
  recommendations: string[];
  architectureImprovementReview: ReputationArchitectureImprovementItem[];
  explainability: {
    summary: string[];
    alignmentRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
