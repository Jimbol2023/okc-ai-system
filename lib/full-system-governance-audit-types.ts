import type { GovernanceReadinessResult } from "./governance-readiness-types";
import type { ReputationEvidenceQualityResult } from "./reputation/reputation-evidence-quality-types";
import type { ReputationGovernanceAlignmentResult } from "./reputation/reputation-governance-alignment-types";
import type { ReputationGovernanceAssuranceResult } from "./reputation/reputation-governance-assurance-types";
import type { ReputationGovernanceContinuityResult } from "./reputation/reputation-governance-continuity-types";
import type { ReputationGovernanceDoctrineResult } from "./reputation/reputation-governance-doctrine-types";
import type { ReputationGovernanceLineageResult } from "./reputation/reputation-governance-lineage-types";
import type { ReputationGovernanceMemoryResult } from "./reputation/reputation-governance-memory-types";
import type { ReputationGovernanceResilienceResult } from "./reputation/reputation-governance-resilience-types";

export type FullSystemGovernanceAuditClassification =
  | "critical_risk"
  | "needs_attention"
  | "stable"
  | "institutionally_strong";

export type FullSystemGovernanceAuditRecommendationClassification =
  | "Immediate"
  | "Future Upgrade"
  | "Optional Optimization";

export type FullSystemGovernanceAuditCategory =
  | "architecture_integrity"
  | "dependency_integrity"
  | "orchestration_purity"
  | "governance_safety"
  | "explainability_integrity"
  | "deterministic_scoring_integrity"
  | "traceability_integrity"
  | "resilience_consistency"
  | "doctrine_consistency"
  | "utility_duplication"
  | "type_duplication"
  | "scalability_risks"
  | "enterprise_durability"
  | "long_horizon_maintainability"
  | "hidden_execution_pathways"
  | "future_technical_debt"
  | "reusable_infrastructure_opportunities"
  | "adapter_consistency"
  | "anti_fragility_opportunities"
  | "institutional_continuity_risks";

export type FullSystemGovernanceAuditCategoryScores = Record<FullSystemGovernanceAuditCategory, number>;

export interface FullSystemGovernanceAuditInventory {
  modules?: string[];
  governanceModules?: string[];
  adapterModules?: string[];
  routeModules?: string[];
  apiModules?: string[];
  automationModules?: string[];
  messagingModules?: string[];
  databaseModules?: string[];
  orchestrationModules?: string[];
  knownWarnings?: string[];
  knownLimitations?: string[];
}

export interface FullSystemGovernanceAuditInput {
  readinessResult?: GovernanceReadinessResult;
  assuranceResult?: ReputationGovernanceAssuranceResult;
  alignmentResult?: ReputationGovernanceAlignmentResult;
  doctrineResult?: ReputationGovernanceDoctrineResult;
  memoryResult?: ReputationGovernanceMemoryResult;
  resilienceResult?: ReputationGovernanceResilienceResult;
  continuityResult?: ReputationGovernanceContinuityResult;
  lineageResult?: ReputationGovernanceLineageResult;
  evidenceQualityResult?: ReputationEvidenceQualityResult;
  inventory?: FullSystemGovernanceAuditInventory;
  evaluatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface FullSystemGovernanceAuditFinding {
  id: string;
  category: FullSystemGovernanceAuditCategory;
  classification: FullSystemGovernanceAuditClassification;
  score: number;
  description: string;
  evidence: string[];
  risks: string[];
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface FullSystemGovernanceAuditRecommendation {
  id: string;
  classification: FullSystemGovernanceAuditRecommendationClassification;
  category: FullSystemGovernanceAuditCategory;
  recommendation: string;
  rationale: string;
}

export interface FullSystemGovernanceAuditResult {
  overallAuditScore: number;
  auditClassification: FullSystemGovernanceAuditClassification;
  categoryScores: FullSystemGovernanceAuditCategoryScores;
  findings: FullSystemGovernanceAuditFinding[];
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  evidence: string[];
  limitations: string[];
  governanceSafetyNotes: string[];
  architectureObservations: string[];
  orchestrationContaminationRisks: string[];
  hiddenExecutionPathwayRisks: string[];
  reusableInfrastructureOpportunities: string[];
  futureTechnicalDebtItems: string[];
  recommendations: FullSystemGovernanceAuditRecommendation[];
  humanReviewRequired: boolean;
  explainability: {
    summary: string[];
    auditRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
