import { buildSharedGovernanceUtilityExtractionPlanExplainability } from "./shared-governance-utility-extraction-plan-explainability";
import {
  calculateOverallSharedGovernanceUtilityExtractionScore,
  calculateSharedGovernanceUtilityAreaScore,
  calculateSharedGovernanceUtilityCandidateScore,
  calculateSharedGovernanceUtilityExtractionFindingConfidence,
  sharedGovernanceUtilityExtractionClassificationFromScore,
} from "./shared-governance-utility-extraction-plan-scoring";
import {
  averageFiniteNumbers,
  uniqueNonEmptyStrings,
} from "./governance-utils/deterministic";
import { metadataStringList } from "./governance-utils/metadata";
import {
  createGovernanceSlug,
  normalizeGovernanceKey,
} from "./governance-utils/normalization";
import { governanceStatusScore } from "./governance-utils/scoring";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
} from "./full-system-governance-audit-types";
import type {
  SharedGovernanceUtilityAreaAssessment,
  SharedGovernanceUtilityCandidate,
  SharedGovernanceUtilityCandidateType,
  SharedGovernanceUtilityExtractionArea,
  SharedGovernanceUtilityExtractionFinding,
  SharedGovernanceUtilityExtractionFindingType,
  SharedGovernanceUtilityExtractionPhase,
  SharedGovernanceUtilityExtractionPlanInput,
  SharedGovernanceUtilityExtractionPlanResult,
} from "./shared-governance-utility-extraction-plan-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

type AreaInput = {
  area: SharedGovernanceUtilityExtractionArea;
  description: string;
  baseScore: number;
  extractionReadySignals: string[];
  extractionRiskSignals: string[];
  recommendedHumanReview: string;
  reasoning: string;
};

type CandidateInput = {
  candidateType: SharedGovernanceUtilityCandidateType;
  title: string;
  description: string;
  baseScore: number;
  supportingSignals: string[];
  riskSignals: string[];
  recommendedHumanReview: string;
  reasoning: string;
};

function contextSignals(
  input: SharedGovernanceUtilityExtractionPlanInput,
  key:
    | "proposedUtilityCandidates"
    | "proposedMetadataContractCandidates"
    | "proposedSurvivabilityContractCandidates"
    | "proposedNormalizationContractCandidates"
    | "knownHelperDuplication"
    | "knownExtractionRisks"
    | "extractionAssumptions"
    | "extractionLimitations"
    | "allowedPhaseOneCandidates"
    | "deferredCandidates",
): string[] {
  const contextValue = input.extractionContext?.[key];
  if (Array.isArray(contextValue)) {
    return uniqueNonEmptyStrings(contextValue);
  }

  return metadataStringList(input.metadata, key);
}

function getAuditFindings(
  input: SharedGovernanceUtilityExtractionPlanInput,
): FullSystemGovernanceAuditFinding[] {
  return [...(input.auditFindings ?? []), ...(input.auditResult?.findings ?? [])];
}

function auditCategories(input: SharedGovernanceUtilityExtractionPlanInput): FullSystemGovernanceAuditCategory[] {
  return uniqueNonEmptyStrings(
    getAuditFindings(input)
      .map((finding) => finding.category)
      .concat(Object.keys(input.auditResult?.categoryScores ?? {}) as FullSystemGovernanceAuditCategory[]),
  ) as FullSystemGovernanceAuditCategory[];
}

function recommendationPhase(score: number, riskSignals: string[]): SharedGovernanceUtilityExtractionPhase {
  if (score >= 75 && riskSignals.length === 0) {
    return "phase_1_low_risk";
  }
  if (score >= 55) {
    return "phase_2_contract_review";
  }

  return "defer_until_stable";
}

function createAreaAssessment(params: AreaInput): SharedGovernanceUtilityAreaAssessment {
  const score = calculateSharedGovernanceUtilityAreaScore({
    baseScore: params.baseScore,
    extractionReadySignalCount: params.extractionReadySignals.length,
    extractionRiskSignalCount: params.extractionRiskSignals.length,
    findingCount: params.extractionRiskSignals.length,
    explainabilityCount:
      params.reasoning.length > 0
        ? params.extractionReadySignals.length + 1
        : params.extractionReadySignals.length,
  });

  return {
    area: params.area,
    score,
    classification: sharedGovernanceUtilityExtractionClassificationFromScore(score),
    description: params.description,
    extractionReadySignals: uniqueNonEmptyStrings(params.extractionReadySignals),
    extractionRiskSignals: uniqueNonEmptyStrings(params.extractionRiskSignals),
    recommendedHumanReview: params.recommendedHumanReview,
    explainability: {
      factors: uniqueNonEmptyStrings([...params.extractionReadySignals, ...params.extractionRiskSignals]),
      reasoning: uniqueNonEmptyStrings([
        params.reasoning,
        params.extractionRiskSignals.length > 0
          ? "Utility extraction should wait for human review of extraction risks before any helper is centralized."
          : "",
      ]),
    },
  };
}

function createUtilityCandidate(params: CandidateInput): SharedGovernanceUtilityCandidate {
  const readinessScore = calculateSharedGovernanceUtilityCandidateScore({
    baseScore: params.baseScore,
    supportingSignalCount: params.supportingSignals.length,
    riskSignalCount: params.riskSignals.length,
  });
  const extractionReadiness =
    sharedGovernanceUtilityExtractionClassificationFromScore(readinessScore);

  return {
    id: `utility_${createGovernanceSlug(params.title, "shared_governance_utility_extraction")}`,
    candidateType: params.candidateType,
    title: params.title,
    description: params.description,
    readinessScore,
    extractionReadiness,
    supportingSignals: uniqueNonEmptyStrings(params.supportingSignals),
    riskSignals: uniqueNonEmptyStrings(params.riskSignals),
    recommendedPhase: recommendationPhase(readinessScore, params.riskSignals),
    recommendedHumanReview: params.recommendedHumanReview,
    explainability: {
      factors: uniqueNonEmptyStrings([...params.supportingSignals, ...params.riskSignals]),
      reasoning: uniqueNonEmptyStrings([
        params.reasoning,
        "Candidate readiness is deterministic and does not authorize extraction without explicit human approval.",
      ]),
    },
  };
}

function stableMetadataContractCandidates(
  input: SharedGovernanceUtilityExtractionPlanInput,
): string[] {
  return uniqueNonEmptyStrings([
    ...contextSignals(input, "proposedMetadataContractCandidates"),
    "evaluatedAt timestamp contract",
    "humanReviewRequired flag contract",
    "human-review note contract",
    "score/classification/explainability contract",
    ...(input.architectureFreezeReadinessResult?.stableContractCandidates ?? []).filter((candidate) =>
      normalizeGovernanceKey(candidate).includes("metadata"),
    ),
    ...(input.versioningReadinessResult?.stableVersionReadyAreas ?? []).filter((area) =>
      normalizeGovernanceKey(area).includes("metadata"),
    ),
  ]);
}

function survivabilityContractCandidates(
  input: SharedGovernanceUtilityExtractionPlanInput,
): string[] {
  return uniqueNonEmptyStrings([
    ...contextSignals(input, "proposedSurvivabilityContractCandidates"),
    ...(input.longHorizonInstitutionalResilienceResult?.resilientGovernanceAreas ?? []).map(
      (area) => `Long-horizon resilience candidate: ${area}`,
    ),
    ...(input.traceabilitySurvivabilityResult?.durableTraceabilityAreas ?? []).map(
      (area) => `Traceability survivability candidate: ${area}`,
    ),
    ...(input.semanticVersionSurvivabilityResult?.versionStableSemanticAreas ?? []).map(
      (area) => `Semantic-version survivability candidate: ${area}`,
    ),
  ]);
}

function normalizationContractCandidates(
  input: SharedGovernanceUtilityExtractionPlanInput,
): string[] {
  return uniqueNonEmptyStrings([
    ...contextSignals(input, "proposedNormalizationContractCandidates"),
    ...(input.normalizationResult?.principleMappingStrength ?? []).map(
      (item) => `Principle mapping candidate: ${item}`,
    ),
    ...(input.normalizationResult?.scoringDriverConsistency ?? []).map(
      (item) => `Scoring driver consistency candidate: ${item}`,
    ),
    ...(input.normalizationResult?.recommendationLinkageConsistency ?? []).map(
      (item) => `Recommendation linkage candidate: ${item}`,
    ),
  ]);
}

function knownExtractionRisks(input: SharedGovernanceUtilityExtractionPlanInput): string[] {
  return uniqueNonEmptyStrings([
    ...contextSignals(input, "knownExtractionRisks"),
    ...contextSignals(input, "extractionLimitations"),
    ...(input.architectureFreezeReadinessResult?.unstableContractAreas ?? []),
    ...(input.architectureFreezeReadinessResult?.notFreezeReadyAreas ?? []),
    ...(input.auditResult?.futureTechnicalDebtItems ?? []),
  ]);
}

function buildUtilityCandidates(
  input: SharedGovernanceUtilityExtractionPlanInput,
): SharedGovernanceUtilityCandidate[] {
  const risks = knownExtractionRisks(input);

  return [
    createUtilityCandidate({
      candidateType: "deterministic_helper",
      title: "Deterministic score clamping and averaging helper",
      description:
        "Future low-risk helper candidate for repeated score clamping, rounding, and average calculations.",
      baseScore: averageFiniteNumbers([
        input.architectureFreezeReadinessResult?.architectureFreezeReadinessScore ?? 42,
        input.finalStabilityConsolidationResult?.finalGovernanceStabilityScore ?? 42,
        input.auditResult?.categoryScores.deterministic_scoring_integrity ?? 42,
      ]),
      supportingSignals: [
        "Repeated deterministic scoring helpers appear across governance review modules.",
        ...(input.architectureFreezeReadinessResult?.reusableUtilityExtractionCandidates ?? []).filter((candidate) =>
          /score|clamp|average/i.test(candidate),
        ),
        ...contextSignals(input, "allowedPhaseOneCandidates").filter((candidate) =>
          /score|clamp|average/i.test(candidate),
        ),
      ],
      riskSignals: risks.filter((risk) => /score|deterministic|utility/i.test(risk)),
      recommendedHumanReview:
        "Review score clamping and averaging patterns before approving any Phase 1 helper extraction.",
      reasoning:
        "This helper is low risk when it remains deterministic, side-effect free, and does not alter scoring weights.",
    }),
    createUtilityCandidate({
      candidateType: "deterministic_helper",
      title: "Unique string normalization and slug helper",
      description:
        "Future low-risk helper candidate for repeated unique, normalization, and slug generation logic.",
      baseScore: averageFiniteNumbers([
        input.architectureFreezeReadinessResult?.architectureFreezeReadinessScore ?? 42,
        input.auditResult?.categoryScores.utility_duplication ?? 42,
      ]),
      supportingSignals: [
        "Repeated unique, normalize, and slug helper patterns appear across review modules.",
        ...(input.architectureFreezeReadinessResult?.reusableUtilityExtractionCandidates ?? []).filter((candidate) =>
          /unique|string|slug|normal/i.test(candidate),
        ),
        ...contextSignals(input, "knownHelperDuplication").filter((item) =>
          /unique|string|slug|normal/i.test(item),
        ),
      ],
      riskSignals: risks.filter((risk) => /normalize|semantic|slug|string/i.test(risk)),
      recommendedHumanReview:
        "Review normalization semantics carefully so helper extraction does not mutate governance terminology.",
      reasoning:
        "String helpers are low risk only if they preserve existing labels and are not used to rewrite governance semantics.",
    }),
    createUtilityCandidate({
      candidateType: "explainability_helper",
      title: "Explainability summary and limitation builder",
      description:
        "Future helper candidate for repeated summary, rules-applied, major-driver, and limitation output shapes.",
      baseScore: averageFiniteNumbers([
        input.explainabilityContinuityResult?.explainabilityContinuityScore ?? 42,
        input.auditResult?.categoryScores.explainability_integrity ?? 42,
        input.architectureFreezeReadinessResult?.architectureFreezeReadinessScore ?? 42,
      ]),
      supportingSignals: [
        ...(input.explainabilityContinuityResult?.durableExplainabilityAreas ?? []),
        ...(input.architectureFreezeReadinessResult?.stableContractCandidates ?? []).filter((candidate) =>
          /explain/i.test(candidate),
        ),
      ],
      riskSignals: [
        ...(input.explainabilityContinuityResult?.fragileExplainabilityAreas ?? []),
        ...(input.explainabilityContinuityResult?.reasoningContinuityFindings ?? []),
        ...risks.filter((risk) => /explain|reason|limitation/i.test(risk)),
      ],
      recommendedHumanReview:
        "Review explainability helper extraction only after confirming outputs remain module-specific and limitation-aware.",
      reasoning:
        "Explainability helpers should reduce repeated output structure without flattening module-specific reasoning.",
    }),
    createUtilityCandidate({
      candidateType: "traceability_helper",
      title: "Traceability evidence and recommendation linkage helper",
      description:
        "Future helper candidate for repeated traceability linkage, evidence gap, and recommendation linkage patterns.",
      baseScore: averageFiniteNumbers([
        input.traceabilityResult?.traceabilityScore ?? 42,
        input.traceabilitySurvivabilityResult?.traceabilitySurvivabilityScore ?? 42,
        input.auditResult?.categoryScores.traceability_integrity ?? 42,
      ]),
      supportingSignals: [
        ...(input.traceabilityResult?.traceStrengths ?? []),
        ...(input.traceabilitySurvivabilityResult?.durableTraceabilityAreas ?? []),
      ],
      riskSignals: [
        ...(input.traceabilityResult?.missingLinks ?? []),
        ...(input.traceabilityResult?.recommendationLinkageGaps ?? []),
        ...(input.traceabilitySurvivabilityResult?.fragileTraceabilityAreas ?? []),
        ...risks.filter((risk) => /trace|evidence|recommendation/i.test(risk)),
      ],
      recommendedHumanReview:
        "Review traceability helper extraction after confirming evidence and recommendation links remain reconstructable.",
      reasoning:
        "Traceability helpers are reusable only when source attribution, evidence IDs, limitations, and human-review notes remain explicit.",
    }),
    createUtilityCandidate({
      candidateType: "normalization_helper",
      title: "Principle-to-evidence normalization contract helper",
      description:
        "Future helper candidate for repeated principle, evidence, scoring-driver, limitation, and recommendation mapping checks.",
      baseScore: averageFiniteNumbers([
        input.normalizationResult?.normalizationScore ?? 42,
        governanceStatusScore(input.normalizationResult?.normalizationClassification),
        input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityScore ?? 42,
      ]),
      supportingSignals: normalizationContractCandidates(input),
      riskSignals: [
        ...(input.normalizationResult?.weakMappings ?? []),
        ...(input.normalizationResult?.missingMappings ?? []),
        ...(input.normalizationResult?.inconsistentMappings ?? []),
        ...(input.semanticVersionSurvivabilityResult?.normalizationVersionFindings ?? []),
      ],
      recommendedHumanReview:
        "Review normalization helper extraction after principle-to-evidence semantics remain stable across modules.",
      reasoning:
        "Normalization helpers should not introduce dynamic interpretation or mutate governance doctrine semantics.",
    }),
    createUtilityCandidate({
      candidateType: "metadata_contract",
      title: "Governance review metadata contract",
      description:
        "Future contract candidate for evaluatedAt, metadata, score, classification, human-review, and limitations fields.",
      baseScore: averageFiniteNumbers([
        input.architectureFreezeReadinessResult?.architectureFreezeReadinessScore ?? 42,
        input.versioningReadinessResult?.versioningReadinessScore ?? 42,
      ]),
      supportingSignals: stableMetadataContractCandidates(input),
      riskSignals: risks.filter((risk) => /metadata|contract|version/i.test(risk)),
      recommendedHumanReview:
        "Review metadata contract candidates before any shared contract is introduced.",
      reasoning:
        "Metadata contracts are reusable only when they remain read-only, stable, version-aware, and human-review oriented.",
    }),
    createUtilityCandidate({
      candidateType: "survivability_contract",
      title: "Governance survivability contract",
      description:
        "Future contract candidate for durable areas, fragile areas, reconstruction findings, and stabilization recommendations.",
      baseScore: averageFiniteNumbers([
        input.longHorizonInstitutionalResilienceResult?.institutionalResilienceScore ?? 42,
        input.traceabilitySurvivabilityResult?.traceabilitySurvivabilityScore ?? 42,
        input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityScore ?? 42,
      ]),
      supportingSignals: survivabilityContractCandidates(input),
      riskSignals: [
        ...(input.longHorizonInstitutionalResilienceResult?.fragileGovernanceAreas ?? []),
        ...(input.traceabilitySurvivabilityResult?.fragileTraceabilityAreas ?? []),
        ...(input.semanticVersionSurvivabilityResult?.versionFragileSemanticAreas ?? []),
      ],
      recommendedHumanReview:
        "Review survivability contract candidates before any shared survivability shape is extracted.",
      reasoning:
        "Survivability contracts should preserve module-specific risk context while keeping common review fields stable.",
    }),
    createUtilityCandidate({
      candidateType: "continuity_contract",
      title: "Governance continuity and reconstruction contract",
      description:
        "Future contract candidate for durable continuity, fragile continuity, reconstruction, and lifecycle review outputs.",
      baseScore: averageFiniteNumbers([
        input.lifecycleContinuityResult?.lifecycleContinuityScore ?? 42,
        input.reviewabilityIntegrityResult?.reviewabilityIntegrityScore ?? 42,
      ]),
      supportingSignals: [
        ...(input.lifecycleContinuityResult?.durableContinuityAreas ?? []),
        ...(input.reviewabilityIntegrityResult?.reviewableAreas ?? []),
      ],
      riskSignals: [
        ...(input.lifecycleContinuityResult?.fragileContinuityAreas ?? []),
        ...(input.reviewabilityIntegrityResult?.reconstructionRisks ?? []),
      ],
      recommendedHumanReview:
        "Review continuity and reconstruction contract candidates before shared extraction.",
      reasoning:
        "Continuity contracts should improve reconstruction review without implementing persistence or lifecycle automation.",
    }),
  ];
}

function buildAreaAssessments(
  input: SharedGovernanceUtilityExtractionPlanInput,
): SharedGovernanceUtilityAreaAssessment[] {
  const risks = knownExtractionRisks(input);

  return [
    createAreaAssessment({
      area: "deterministic_scoring_helpers",
      description:
        "Reviews whether repeated deterministic score clamping, averaging, confidence, and classification helpers are stable enough for future extraction.",
      baseScore: averageFiniteNumbers([
        input.auditResult?.categoryScores.deterministic_scoring_integrity ?? 42,
        input.architectureFreezeReadinessResult?.architectureFreezeReadinessScore ?? 42,
      ]),
      extractionReadySignals: [
        "Deterministic scoring remains a stable repeated helper pattern.",
        ...(input.architectureFreezeReadinessResult?.reusableUtilityExtractionCandidates ?? []).filter((candidate) =>
          /score|confidence|clamp|average|classification/i.test(candidate),
        ),
      ],
      extractionRiskSignals: risks.filter((risk) => /score|confidence|classification|weight/i.test(risk)),
      recommendedHumanReview:
        "Review deterministic helper candidates without changing scoring weights or classifications.",
      reasoning:
        "Scoring helpers are safest when they preserve existing module-specific weights and only remove repeated mechanics.",
    }),
    createAreaAssessment({
      area: "explainability_helpers",
      description:
        "Reviews whether repeated explainability summary, rules, major-driver, and limitation helpers are stable enough for future extraction.",
      baseScore: averageFiniteNumbers([
        input.explainabilityContinuityResult?.explainabilityContinuityScore ?? 42,
        input.auditResult?.categoryScores.explainability_integrity ?? 42,
      ]),
      extractionReadySignals: [...(input.explainabilityContinuityResult?.durableExplainabilityAreas ?? [])],
      extractionRiskSignals: [
        ...(input.explainabilityContinuityResult?.fragileExplainabilityAreas ?? []),
        ...(input.explainabilityContinuityResult?.semanticExplainabilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review explainability helper candidates for module-specific reasoning preservation.",
      reasoning:
        "Explainability helpers are extractable only when they keep evidence, limitations, rules applied, and major drivers visible.",
    }),
    createAreaAssessment({
      area: "traceability_helpers",
      description:
        "Reviews whether traceability linkage helpers are stable enough for future extraction.",
      baseScore: averageFiniteNumbers([
        input.traceabilityResult?.traceabilityScore ?? 42,
        input.traceabilitySurvivabilityResult?.traceabilitySurvivabilityScore ?? 42,
      ]),
      extractionReadySignals: [
        ...(input.traceabilityResult?.traceStrengths ?? []),
        ...(input.traceabilitySurvivabilityResult?.durableTraceabilityAreas ?? []),
      ],
      extractionRiskSignals: [
        ...(input.traceabilityResult?.traceWeaknesses ?? []),
        ...(input.traceabilityResult?.missingLinks ?? []),
        ...(input.traceabilitySurvivabilityResult?.fragileTraceabilityAreas ?? []),
      ],
      recommendedHumanReview:
        "Review traceability helper candidates for source attribution and reconstruction safety.",
      reasoning:
        "Traceability helpers should make linkage more consistent without rewriting evidence or recommendation relationships.",
    }),
    createAreaAssessment({
      area: "normalization_helpers",
      description:
        "Reviews whether principle-to-evidence and scoring-driver normalization helpers are stable enough for future extraction.",
      baseScore: averageFiniteNumbers([
        input.normalizationResult?.normalizationScore ?? 42,
        governanceStatusScore(input.normalizationResult?.normalizationClassification),
        input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityScore ?? 42,
      ]),
      extractionReadySignals: normalizationContractCandidates(input),
      extractionRiskSignals: [
        ...(input.normalizationResult?.weakMappings ?? []),
        ...(input.normalizationResult?.missingMappings ?? []),
        ...(input.normalizationResult?.inconsistentMappings ?? []),
      ],
      recommendedHumanReview:
        "Review normalization helper candidates after principle-to-evidence semantics remain stable.",
      reasoning:
        "Normalization helpers should standardize mappings without introducing semantic mutation or dynamic doctrine interpretation.",
    }),
    createAreaAssessment({
      area: "metadata_contracts",
      description:
        "Reviews whether metadata contracts are stable enough for future shared governance utility extraction.",
      baseScore: averageFiniteNumbers([
        input.versioningReadinessResult?.versioningReadinessScore ?? 42,
        input.architectureFreezeReadinessResult?.architectureFreezeReadinessScore ?? 42,
      ]),
      extractionReadySignals: stableMetadataContractCandidates(input),
      extractionRiskSignals: risks.filter((risk) => /metadata|version|contract/i.test(risk)),
      recommendedHumanReview:
        "Review metadata contract candidates before introducing any shared contract surface.",
      reasoning:
        "Metadata contracts should stay stable, explicit, version-aware, and review-only.",
    }),
    createAreaAssessment({
      area: "survivability_contracts",
      description:
        "Reviews whether survivability and durability output contracts are stable enough for future extraction.",
      baseScore: averageFiniteNumbers([
        input.longHorizonInstitutionalResilienceResult?.institutionalResilienceScore ?? 42,
        input.finalStabilityConsolidationResult?.finalGovernanceStabilityScore ?? 42,
      ]),
      extractionReadySignals: survivabilityContractCandidates(input),
      extractionRiskSignals: [
        ...(input.longHorizonInstitutionalResilienceResult?.fragileGovernanceAreas ?? []),
        ...(input.finalStabilityConsolidationResult?.fragileGovernanceAreas ?? []),
      ],
      recommendedHumanReview:
        "Review survivability contract candidates for long-horizon durability before extraction.",
      reasoning:
        "Survivability contracts should preserve fragile-area context and future stabilization recommendations.",
    }),
    createAreaAssessment({
      area: "continuity_contracts",
      description:
        "Reviews whether continuity and lifecycle helper patterns are stable enough for future extraction.",
      baseScore: averageFiniteNumbers([
        input.lifecycleContinuityResult?.lifecycleContinuityScore ?? 42,
        input.reviewabilityIntegrityResult?.reviewabilityIntegrityScore ?? 42,
      ]),
      extractionReadySignals: [
        ...(input.lifecycleContinuityResult?.durableContinuityAreas ?? []),
        ...(input.reviewabilityIntegrityResult?.reviewableAreas ?? []),
      ],
      extractionRiskSignals: [
        ...(input.lifecycleContinuityResult?.fragileContinuityAreas ?? []),
        ...(input.reviewabilityIntegrityResult?.weakReviewabilityAreas ?? []),
      ],
      recommendedHumanReview:
        "Review continuity contract candidates before any future extraction.",
      reasoning:
        "Continuity helpers should remain review-only and must not become lifecycle automation.",
    }),
    createAreaAssessment({
      area: "reconstruction_helpers",
      description:
        "Reviews whether reconstruction helper patterns are mature enough for future extraction.",
      baseScore: averageFiniteNumbers([
        input.reviewabilityIntegrityResult?.reviewabilityIntegrityScore ?? 42,
        input.traceabilitySurvivabilityResult?.traceabilitySurvivabilityScore ?? 42,
      ]),
      extractionReadySignals: [
        ...(input.reviewabilityIntegrityResult?.reviewableAreas ?? []),
        ...(input.traceabilitySurvivabilityResult?.reconstructionSurvivabilityFindings ?? []),
      ],
      extractionRiskSignals: [
        ...(input.reviewabilityIntegrityResult?.reconstructionRisks ?? []),
        ...(input.traceabilitySurvivabilityResult?.fragileTraceabilityAreas ?? []),
      ],
      recommendedHumanReview:
        "Review reconstruction helper candidates for audit and traceability defensibility.",
      reasoning:
        "Reconstruction helpers are useful only when they preserve evidence, reasoning, limitation, and recommendation context.",
    }),
    createAreaAssessment({
      area: "reviewability_helpers",
      description:
        "Reviews whether human-review note and recommendation helper patterns are stable enough for future extraction.",
      baseScore: averageFiniteNumbers([
        input.reviewabilityIntegrityResult?.reviewabilityIntegrityScore ?? 42,
        input.auditResult?.categoryScores.enterprise_durability ?? 42,
      ]),
      extractionReadySignals: [
        ...(input.reviewabilityIntegrityResult?.reviewableAreas ?? []),
        ...(input.reviewabilityIntegrityResult?.humanReviewFindings ?? []),
      ],
      extractionRiskSignals: [
        ...(input.reviewabilityIntegrityResult?.weakReviewabilityAreas ?? []),
        ...(input.reviewabilityIntegrityResult?.institutionalTrustFindings ?? []),
      ],
      recommendedHumanReview:
        "Review human-review helper candidates before extraction.",
      reasoning:
        "Reviewability helpers should keep recommendations neutral, operational, and clearly human-reviewed.",
    }),
    createAreaAssessment({
      area: "isolation_helpers",
      description:
        "Reviews whether isolation helper patterns are stable enough for future multi-business and multi-tenant reuse.",
      baseScore: averageFiniteNumbers([
        input.multiBusinessTenantIsolationResult?.isolationSurvivabilityScore ?? 42,
        input.auditResult?.categoryScores.adapter_consistency ?? 42,
      ]),
      extractionReadySignals: [...(input.multiBusinessTenantIsolationResult?.durableIsolationAreas ?? [])],
      extractionRiskSignals: [
        ...(input.multiBusinessTenantIsolationResult?.fragileIsolationAreas ?? []),
        ...(input.multiBusinessTenantIsolationResult?.tenantBoundaryFindings ?? []),
      ],
      recommendedHumanReview:
        "Review isolation helper candidates before cross-business or tenant-aware reuse.",
      reasoning:
        "Isolation helpers must remain review-only and must not introduce tenant routing or execution.",
    }),
    createAreaAssessment({
      area: "resilience_helpers",
      description:
        "Reviews whether resilience helper patterns are stable enough for future extraction.",
      baseScore: averageFiniteNumbers([
        input.longHorizonInstitutionalResilienceResult?.institutionalResilienceScore ?? 42,
        input.auditResult?.categoryScores.resilience_consistency ?? 42,
      ]),
      extractionReadySignals: [
        ...(input.longHorizonInstitutionalResilienceResult?.resilientGovernanceAreas ?? []),
      ],
      extractionRiskSignals: [
        ...(input.longHorizonInstitutionalResilienceResult?.fragileGovernanceAreas ?? []),
        ...(input.longHorizonInstitutionalResilienceResult?.longHorizonSurvivabilityFindings ?? []),
      ],
      recommendedHumanReview:
        "Review resilience helper candidates for long-horizon durability before extraction.",
      reasoning:
        "Resilience helpers should support future review without centralizing governance control.",
    }),
    createAreaAssessment({
      area: "semantic_version_helpers",
      description:
        "Reviews whether semantic-version helper patterns are stable enough for future extraction.",
      baseScore: averageFiniteNumbers([
        input.semanticVersionSurvivabilityResult?.semanticVersionSurvivabilityScore ?? 42,
        input.versioningReadinessResult?.versioningReadinessScore ?? 42,
      ]),
      extractionReadySignals: [
        ...(input.semanticVersionSurvivabilityResult?.versionStableSemanticAreas ?? []),
        ...(input.versioningReadinessResult?.stableVersionReadyAreas ?? []),
      ],
      extractionRiskSignals: [
        ...(input.semanticVersionSurvivabilityResult?.versionFragileSemanticAreas ?? []),
        ...(input.versioningReadinessResult?.unstableVersionFragileAreas ?? []),
      ],
      recommendedHumanReview:
        "Review semantic-version helper candidates without mutating existing terminology.",
      reasoning:
        "Semantic-version helpers should preserve backward compatibility and reconstruction while avoiding semantic rewriting.",
    }),
    createAreaAssessment({
      area: "governance_utility_patterns",
      description:
        "Reviews repeated governance utility patterns and helper duplication for staged extraction readiness.",
      baseScore: averageFiniteNumbers([
        input.auditResult?.categoryScores.utility_duplication ?? 42,
        input.architectureFreezeReadinessResult?.architectureFreezeReadinessScore ?? 42,
      ]),
      extractionReadySignals: [
        ...contextSignals(input, "knownHelperDuplication"),
        ...(input.architectureFreezeReadinessResult?.reusableUtilityExtractionCandidates ?? []),
      ],
      extractionRiskSignals: risks,
      recommendedHumanReview:
        "Review repeated helper patterns before approving a controlled extraction phase.",
      reasoning:
        "Utility extraction should begin only with stable, deterministic, side-effect-free helpers.",
    }),
    createAreaAssessment({
      area: "shared_contract_candidates",
      description:
        "Reviews stable contract candidates and shared contract immaturity risks before future extraction.",
      baseScore: averageFiniteNumbers([
        input.architectureFreezeReadinessResult?.architectureFreezeReadinessScore ?? 42,
        input.versioningReadinessResult?.versioningReadinessScore ?? 42,
        input.finalStabilityConsolidationResult?.finalGovernanceStabilityScore ?? 42,
      ]),
      extractionReadySignals: [
        ...(input.architectureFreezeReadinessResult?.stableContractCandidates ?? []),
        ...stableMetadataContractCandidates(input),
        ...survivabilityContractCandidates(input),
        ...normalizationContractCandidates(input),
      ],
      extractionRiskSignals: [
        ...(input.architectureFreezeReadinessResult?.unstableContractAreas ?? []),
        ...(input.versioningReadinessResult?.unstableVersionFragileAreas ?? []),
      ],
      recommendedHumanReview:
        "Review stable and unstable contract candidates before any shared contract extraction.",
      reasoning:
        "Shared contracts are extractable only when semantics, metadata, traceability, and versioning are stable.",
    }),
  ];
}

function severityForFinding(params: { evidenceCount: number; riskWeight?: number }): ReputationSeverity {
  const riskWeight = params.riskWeight ?? 0;
  if (params.evidenceCount + riskWeight >= 8) return "critical";
  if (params.evidenceCount + riskWeight >= 4) return "elevated";
  if (params.evidenceCount + riskWeight >= 2) return "moderate";
  return "low";
}

function createFinding(params: {
  type: SharedGovernanceUtilityExtractionFindingType;
  area: SharedGovernanceUtilityExtractionArea;
  description: string;
  evidence: string[];
  affectedAuditCategories: FullSystemGovernanceAuditCategory[];
  recommendedHumanReview: string;
  riskWeight?: number;
}): SharedGovernanceUtilityExtractionFinding {
  const evidence = uniqueNonEmptyStrings(params.evidence);

  return {
    id: `shared_utility_${createGovernanceSlug(
      params.type,
      "shared_governance_utility_extraction",
    )}_${createGovernanceSlug(params.area, "shared_governance_utility_extraction")}`,
    findingType: params.type,
    area: params.area,
    severity: severityForFinding({ evidenceCount: evidence.length, riskWeight: params.riskWeight }),
    description: params.description,
    evidence,
    affectedAuditCategories: params.affectedAuditCategories,
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore: calculateSharedGovernanceUtilityExtractionFindingConfidence({
      evidenceCount: evidence.length,
      factorCount: params.affectedAuditCategories.length,
    }),
    explainability: {
      factors: evidence,
      reasoning: uniqueNonEmptyStrings([
        params.description,
        "Finding is recommendation-only and does not authorize utility extraction, governance centralization, execution, or automation.",
      ]),
    },
  };
}

function buildFindings(
  input: SharedGovernanceUtilityExtractionPlanInput,
): SharedGovernanceUtilityExtractionFinding[] {
  const findings: SharedGovernanceUtilityExtractionFinding[] = [];
  const categories = auditCategories(input);
  const extractionRisks = knownExtractionRisks(input);

  if (!input.architectureFreezeReadinessResult) {
    findings.push(
      createFinding({
        type: "governance_stack_dependency_risk",
        area: "governance_utility_patterns",
        description:
          "Architecture freeze readiness result is not supplied, which weakens extraction planning confidence.",
        evidence: ["Architecture freeze readiness result was not supplied."],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Supply the architecture freeze readiness result before approving any utility extraction phase.",
        riskWeight: 2,
      }),
    );
  }

  if (
    input.architectureFreezeReadinessResult &&
    !["freeze_ready", "institutionally_freeze_ready"].includes(
      input.architectureFreezeReadinessResult.freezeReadinessClassification,
    )
  ) {
    findings.push(
      createFinding({
        type: "premature_extraction_risk",
        area: "governance_utility_patterns",
        description:
          "Architecture freeze readiness has not reached a strong enough classification for extraction implementation.",
        evidence: [
          `Freeze readiness classification: ${input.architectureFreezeReadinessResult.freezeReadinessClassification}`,
          ...input.architectureFreezeReadinessResult.notFreezeReadyAreas,
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Keep utility extraction review-only until architecture freeze readiness is stronger.",
        riskWeight: 2,
      }),
    );
  }

  if ((input.architectureFreezeReadinessResult?.unstableContractAreas.length ?? 0) > 0) {
    findings.push(
      createFinding({
        type: "shared_contract_immaturity",
        area: "shared_contract_candidates",
        description:
          "Unstable contract areas should be resolved before shared utility or contract extraction.",
        evidence: input.architectureFreezeReadinessResult?.unstableContractAreas ?? [],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review unstable contract areas before approving shared contract extraction.",
        riskWeight: 2,
      }),
    );
  }

  if (extractionRisks.length > 0) {
    findings.push(
      createFinding({
        type: "future_refactor_risk",
        area: "governance_utility_patterns",
        description:
          "Known extraction risks and technical debt items should be staged before implementation.",
        evidence: extractionRisks,
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Classify extraction risks by phase before implementing any shared helper.",
      }),
    );
  }

  if (
    (input.auditResult?.orchestrationContaminationRisks.length ?? 0) > 0 ||
    (input.architectureFreezeReadinessResult?.operationalDeploymentReadinessFindings.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "orchestration_contamination_risk",
        area: "governance_utility_patterns",
        description:
          "Utility extraction should remain isolated from orchestration, routes, automation, and execution systems.",
        evidence: [
          ...(input.auditResult?.orchestrationContaminationRisks ?? []),
          ...(input.architectureFreezeReadinessResult?.operationalDeploymentReadinessFindings ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Confirm utility extraction candidates remain pure and side-effect free.",
        riskWeight: 2,
      }),
    );
  }

  if ((input.auditResult?.hiddenExecutionPathwayRisks.length ?? 0) > 0) {
    findings.push(
      createFinding({
        type: "hidden_coupling_risk",
        area: "governance_utility_patterns",
        description:
          "Hidden execution pathway risks should be reviewed before shared utilities are introduced.",
        evidence: input.auditResult?.hiddenExecutionPathwayRisks ?? [],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review hidden execution pathway risks before extracting shared utilities.",
        riskWeight: 2,
      }),
    );
  }

  if (
    input.normalizationResult?.normalizationClassification === "fragmented" ||
    (input.normalizationResult?.inconsistentMappings.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "normalization_fragility",
        area: "normalization_helpers",
        description:
          "Normalization fragility should be reviewed before extracting normalization helpers.",
        evidence: [
          input.normalizationResult
            ? `Normalization classification: ${input.normalizationResult.normalizationClassification}`
            : "Normalization result was not supplied.",
          ...(input.normalizationResult?.inconsistentMappings ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review normalization mapping stability before extracting normalization helpers.",
      }),
    );
  }

  if (
    input.traceabilityResult?.traceabilityClassification === "weak" ||
    input.traceabilitySurvivabilityResult?.traceabilitySurvivabilityClassification === "collapsed" ||
    (input.traceabilityResult?.missingLinks.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "traceability_helper_inconsistency",
        area: "traceability_helpers",
        description:
          "Traceability helper extraction should wait for stronger evidence and recommendation linkage.",
        evidence: [
          input.traceabilityResult
            ? `Traceability classification: ${input.traceabilityResult.traceabilityClassification}`
            : "Evidence traceability result was not supplied.",
          input.traceabilitySurvivabilityResult
            ? `Traceability survivability classification: ${input.traceabilitySurvivabilityResult.traceabilitySurvivabilityClassification}`
            : "Traceability survivability result was not supplied.",
          ...(input.traceabilityResult?.missingLinks ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review traceability gaps before extracting traceability helpers.",
      }),
    );
  }

  if (
    input.explainabilityContinuityResult?.explainabilityContinuityClassification === "opaque" ||
    (input.explainabilityContinuityResult?.fragileExplainabilityAreas.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        type: "explainability_helper_inconsistency",
        area: "explainability_helpers",
        description:
          "Explainability helper extraction should wait for stronger reasoning and limitation consistency.",
        evidence: [
          input.explainabilityContinuityResult
            ? `Explainability continuity classification: ${input.explainabilityContinuityResult.explainabilityContinuityClassification}`
            : "Explainability continuity result was not supplied.",
          ...(input.explainabilityContinuityResult?.fragileExplainabilityAreas ?? []),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review explainability fragility before extracting explainability helpers.",
      }),
    );
  }

  if ((input.lifecycleContinuityResult?.fragileContinuityAreas.length ?? 0) > 0) {
    findings.push(
      createFinding({
        type: "survivability_helper_instability",
        area: "continuity_contracts",
        description:
          "Continuity fragility should be reviewed before survivability or continuity helper extraction.",
        evidence: input.lifecycleContinuityResult?.fragileContinuityAreas ?? [],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review continuity fragility before extracting survivability or continuity helpers.",
      }),
    );
  }

  if (stableMetadataContractCandidates(input).length < 3) {
    findings.push(
      createFinding({
        type: "unstable_metadata_contract",
        area: "metadata_contracts",
        description:
          "Metadata contract candidates are not yet explicit enough for shared extraction.",
        evidence: [
          "Expected stable metadata candidates include evaluatedAt, score, classification, human-review, limitation, and explainability fields.",
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review metadata contract candidates before shared utility extraction.",
      }),
    );
  }

  return findings;
}

function buildHumanReviewNotes(
  input: SharedGovernanceUtilityExtractionPlanInput,
  findings: SharedGovernanceUtilityExtractionFinding[],
): string[] {
  return uniqueNonEmptyStrings([
    "Human review is required before any shared governance utility extraction.",
    "This plan is read-only and does not extract utilities, centralize governance logic, mutate semantics, implement persistence, or trigger orchestration.",
    "Phase 1 should begin only with low-risk deterministic helpers after explicit approval.",
    ...contextSignals(input, "extractionAssumptions").map((assumption) => `Extraction assumption: ${assumption}`),
    ...contextSignals(input, "extractionLimitations").map((limitation) => `Extraction limitation: ${limitation}`),
    ...findings.map((finding) => finding.recommendedHumanReview),
    ...(input.architectureFreezeReadinessResult?.humanReviewNotes ?? []),
    ...(input.finalStabilityConsolidationResult?.humanReviewNotes ?? []),
  ]);
}

function buildStagedExtractionRecommendations(
  input: SharedGovernanceUtilityExtractionPlanInput,
  candidates: SharedGovernanceUtilityCandidate[],
  findings: SharedGovernanceUtilityExtractionFinding[],
) {
  const lowRiskCandidates = candidates.filter((candidate) => candidate.recommendedPhase === "phase_1_low_risk");
  const deferredCandidates = candidates.filter((candidate) => candidate.recommendedPhase === "defer_until_stable");

  return [
    {
      id: "shared_utility_recommendation_phase_1_review",
      classification: "Immediate" as const,
      recommendation:
        "Keep this stage review-only and require explicit human approval before Controlled Shared Governance Utility Extraction Phase 1.",
      rationale:
        "The current stage is a planning review and must not extract utilities, centralize governance logic, or change module behavior.",
      humanReviewRequired: true,
    },
    {
      id: "shared_utility_recommendation_low_risk_candidates",
      classification: "Future Upgrade" as const,
      recommendation:
        lowRiskCandidates.length > 0
          ? `Consider Phase 1 only for low-risk deterministic candidates: ${lowRiskCandidates
              .map((candidate) => candidate.title)
              .join(", ")}.`
          : "Wait to identify Phase 1 candidates until deterministic helper readiness is stronger.",
      rationale:
        "Phase 1 should be limited to side-effect-free helper mechanics such as clamping, averaging, unique strings, and stable slug generation.",
      humanReviewRequired: true,
    },
    {
      id: "shared_utility_recommendation_deferred_candidates",
      classification: "Future Upgrade" as const,
      recommendation:
        deferredCandidates.length > 0
          ? `Defer unstable candidates: ${deferredCandidates.map((candidate) => candidate.title).join(", ")}.`
          : "Keep contract and semantic helper extraction staged behind human review even when candidates look stable.",
      rationale:
        "Contract, traceability, explainability, normalization, and semantic-version helpers carry higher coupling risk.",
      humanReviewRequired: true,
    },
    {
      id: "shared_utility_recommendation_optional_inventory",
      classification: "Optional Optimization" as const,
      recommendation:
        "Create a future helper inventory checklist after approval so repeated deterministic helpers can be extracted in small batches.",
      rationale:
        "A lightweight inventory can reduce technical debt without broad refactor or governance redesign.",
      humanReviewRequired: true,
    },
    ...findings.slice(0, 4).map((finding, index) => ({
      id: `shared_utility_recommendation_finding_${index + 1}`,
      classification: "Immediate" as const,
      recommendation: finding.recommendedHumanReview,
      rationale: finding.description,
      humanReviewRequired: true,
    })),
    ...(input.architectureFreezeReadinessResult?.finalRecommendations.slice(0, 3).map(
      (recommendation, index) => ({
        id: `shared_utility_recommendation_freeze_${index + 1}`,
        classification: "Future Upgrade" as const,
        recommendation,
        rationale:
          "Architecture freeze readiness recommendations remain relevant to staged utility extraction planning.",
        humanReviewRequired: true,
      }),
    ) ?? []),
  ];
}

export function runSharedGovernanceUtilityExtractionPlan(
  input: SharedGovernanceUtilityExtractionPlanInput,
): SharedGovernanceUtilityExtractionPlanResult {
  const areaAssessments = buildAreaAssessments(input);
  const utilityCandidates = buildUtilityCandidates(input);
  const findings = buildFindings(input);
  const extractionReadinessScore = calculateOverallSharedGovernanceUtilityExtractionScore({
    areaAssessments,
    utilityCandidates,
    findings,
  });
  const extractionReadinessClassification =
    sharedGovernanceUtilityExtractionClassificationFromScore(extractionReadinessScore);

  const resultWithoutExplainability: Omit<
    SharedGovernanceUtilityExtractionPlanResult,
    "explainability"
  > = {
    extractionReadinessScore,
    extractionReadinessClassification,
    areaAssessments,
    utilityCandidates,
    findings,
    extractionReadyUtilityCandidates: utilityCandidates
      .filter((candidate) =>
        ["extractable", "institutionally_reusable"].includes(candidate.extractionReadiness),
      )
      .map(
        (candidate) =>
          `${candidate.title}: ${candidate.extractionReadiness} at ${candidate.readinessScore}/100 (${candidate.recommendedPhase})`,
      ),
    unstableUtilityCandidates: uniqueNonEmptyStrings([
      ...utilityCandidates
        .filter((candidate) =>
          ["not_ready_for_extraction", "partially_extractable"].includes(candidate.extractionReadiness),
        )
        .map(
          (candidate) =>
            `${candidate.title}: ${candidate.extractionReadiness} at ${candidate.readinessScore}/100`,
        ),
      ...contextSignals(input, "deferredCandidates"),
    ]),
    stableMetadataContractCandidates: stableMetadataContractCandidates(input),
    survivabilityContractCandidates: survivabilityContractCandidates(input),
    normalizationContractCandidates: normalizationContractCandidates(input),
    deterministicHelperFindings: uniqueNonEmptyStrings([
      ...areaAssessments
        .filter((assessment) => assessment.area === "deterministic_scoring_helpers")
        .flatMap((assessment) => assessment.extractionRiskSignals),
      ...findings
        .filter((finding) => finding.area === "deterministic_scoring_helpers")
        .map((finding) => finding.description),
    ]),
    explainabilityHelperFindings: uniqueNonEmptyStrings([
      ...(input.explainabilityContinuityResult?.reasoningContinuityFindings ?? []),
      ...(input.explainabilityContinuityResult?.limitationVisibilityFindings ?? []),
      ...findings
        .filter((finding) => finding.area === "explainability_helpers")
        .map((finding) => finding.description),
    ]),
    traceabilityHelperFindings: uniqueNonEmptyStrings([
      ...(input.traceabilityResult?.missingLinks ?? []),
      ...(input.traceabilityResult?.recommendationLinkageGaps ?? []),
      ...(input.traceabilitySurvivabilityResult?.reasoningLinkageFindings ?? []),
      ...findings
        .filter((finding) => finding.area === "traceability_helpers")
        .map((finding) => finding.description),
    ]),
    governanceUtilityMaturityFindings: uniqueNonEmptyStrings([
      ...areaAssessments
        .filter((assessment) =>
          ["governance_utility_patterns", "shared_contract_candidates"].includes(assessment.area),
        )
        .map(
          (assessment) =>
            `${assessment.area}: ${assessment.classification} at ${assessment.score}/100`,
        ),
      ...findings.map((finding) => finding.description),
    ]),
    humanReviewNotes: buildHumanReviewNotes(input, findings),
    stagedExtractionRecommendations: buildStagedExtractionRecommendations(input, utilityCandidates, findings),
    humanReviewRequired:
      findings.length > 0 ||
      utilityCandidates.some((candidate) => candidate.recommendedPhase !== "phase_1_low_risk") ||
      areaAssessments.some((assessment) =>
        ["not_ready_for_extraction", "partially_extractable"].includes(assessment.classification),
      ),
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildSharedGovernanceUtilityExtractionPlanExplainability({
      input,
      result: resultWithoutExplainability,
    }),
  };
}
