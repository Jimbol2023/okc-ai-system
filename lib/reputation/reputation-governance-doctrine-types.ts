import type { EnterpriseReputationAggregationResult } from "./reputation-aggregation-types";
import type { ReputationEvidenceQualityResult } from "./reputation-evidence-quality-types";
import type { ReputationGovernanceContinuityResult } from "./reputation-governance-continuity-types";
import type { ReputationGovernanceLineageResult } from "./reputation-governance-lineage-types";
import type { ReputationGovernanceMemoryResult } from "./reputation-governance-memory-types";
import type {
  ReputationArchitectureImprovementItem,
  ReputationGovernanceResilienceResult,
} from "./reputation-governance-resilience-types";
import type { ReputationGovernanceResult } from "./reputation-governance-types";
import type { ReputationRemediationPlanningResult } from "./reputation-remediation-types";
import type { ReputationResolutionTrackingResult } from "./reputation-resolution-types";
import type { ReputationSeverity } from "./reputation-types";
import type { ReputationTrendResult } from "./reputation-trend-types";

export interface ReputationGovernanceDoctrineInput {
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

export type ReputationGovernanceDoctrinePrincipleType =
  | "stabilization_first"
  | "continuity_preservation"
  | "evidence_supported_remediation"
  | "reviewability_preservation"
  | "dependency_resilience"
  | "anti_fragility_learning"
  | "human_reviewed_governance";

export interface ReputationGovernanceDoctrinePrinciple {
  id: string;
  principleType: ReputationGovernanceDoctrinePrincipleType;
  title: string;
  description: string;
  supportingEvidence: string[];
  recurringPatterns: string[];
  affectedGovernanceDomains: string[];
  confidenceScore: number;
  limitations: string[];
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export type ReputationGovernanceDoctrineDriftType =
  | "doctrine_inconsistency"
  | "unsupported_principle"
  | "contradictory_governance_pattern"
  | "evidence_support_gap"
  | "continuity_context_gap"
  | "lineage_context_gap";

export interface ReputationGovernanceDoctrineDriftFinding {
  id: string;
  driftType: ReputationGovernanceDoctrineDriftType;
  severity: ReputationSeverity;
  description: string;
  evidence: string[];
  recommendedHumanReview: string;
  confidenceScore: number;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export type ReputationGovernanceDoctrineStatus = "thin" | "forming" | "reliable" | "durable";

export interface ReputationGovernanceDoctrineResult {
  doctrineConfidenceScore: number;
  doctrineStatus: ReputationGovernanceDoctrineStatus;
  principles: ReputationGovernanceDoctrinePrinciple[];
  driftFindings: ReputationGovernanceDoctrineDriftFinding[];
  governancePhilosophyIndicators: string[];
  durablePatterns: string[];
  doctrineLimitations: string[];
  recommendations: string[];
  architectureImprovementReview: ReputationArchitectureImprovementItem[];
  explainability: {
    summary: string[];
    doctrineRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
