import { buildGovernanceUtilityStabilizationExplainability } from "./governance-utility-stabilization-review-explainability";
import {
  calculateGovernanceUtilityStabilizationAreaScore,
  calculateGovernanceUtilityStabilizationFindingConfidence,
  calculateOverallGovernanceUtilityStabilizationScore,
  governanceUtilityStabilizationClassificationFromScore,
} from "./governance-utility-stabilization-review-scoring";
import { averageFiniteNumbers, uniqueNonEmptyStrings } from "./governance-utils/deterministic";
import { metadataStringList } from "./governance-utils/metadata";
import { createGovernanceSlug } from "./governance-utils/normalization";
import { governanceStatusScore } from "./governance-utils/scoring";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
} from "./full-system-governance-audit-types";
import type {
  GovernanceUtilityStabilizationArea,
  GovernanceUtilityStabilizationAreaAssessment,
  GovernanceUtilityStabilizationFinding,
  GovernanceUtilityStabilizationFindingType,
  GovernanceUtilityStabilizationReviewInput,
  GovernanceUtilityStabilizationReviewResult,
} from "./governance-utility-stabilization-review-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

type AreaInput = {
  area: GovernanceUtilityStabilizationArea;
  description: string;
  baseScore: number;
  stabilitySignals: string[];
  riskSignals: string[];
  recommendedHumanReview: string;
  reasoning: string;
};

const DEFAULT_UTILITY_FILES = [
  "lib/governance-utils/deterministic.ts",
  "lib/governance-utils/metadata.ts",
  "lib/governance-utils/normalization.ts",
  "lib/governance-utils/scoring.ts",
];

const DEFAULT_HELPER_NAMES = [
  "uniqueNonEmptyStrings",
  "averageFiniteNumbers",
  "stringsFromUnknown",
  "hasText",
  "metadataString",
  "metadataStringList",
  "hasEvaluatedAt",
  "normalizeGovernanceKey",
  "createGovernanceSlug",
  "includesNormalizedGovernanceTerm",
  "clampGovernanceScore",
  "governanceStatusScore",
  "scoreThresholdClassification",
];

const DEFAULT_CONSUMING_MODULES = [
  "lib/shared-governance-utility-extraction-plan.ts",
  "lib/shared-governance-utility-extraction-plan-scoring.ts",
  "lib/shared-governance-utility-extraction-plan-explainability.ts",
];

function contextSignals(
  input: GovernanceUtilityStabilizationReviewInput,
  key:
    | "utilityFiles"
    | "helperNames"
    | "consumingModules"
    | "adoptionScope"
    | "importGraphNotes"
    | "compatibilityNotes"
    | "knownLimitations"
    | "knownRisks"
    | "changedBehaviorNotes"
    | "testEvidence"
    | "futureCandidates",
): string[] {
  const contextValue = input.stabilizationContext?.[key];
  if (Array.isArray(contextValue)) {
    return uniqueNonEmptyStrings(contextValue);
  }

  return metadataStringList(input.metadata, key);
}

function utilityFiles(input: GovernanceUtilityStabilizationReviewInput): string[] {
  return uniqueNonEmptyStrings([...DEFAULT_UTILITY_FILES, ...contextSignals(input, "utilityFiles")]);
}

function helperNames(input: GovernanceUtilityStabilizationReviewInput): string[] {
  return uniqueNonEmptyStrings([...DEFAULT_HELPER_NAMES, ...contextSignals(input, "helperNames")]);
}

function consumingModules(input: GovernanceUtilityStabilizationReviewInput): string[] {
  return uniqueNonEmptyStrings([...DEFAULT_CONSUMING_MODULES, ...contextSignals(input, "consumingModules")]);
}

function getAuditFindings(
  input: GovernanceUtilityStabilizationReviewInput,
): FullSystemGovernanceAuditFinding[] {
  return [...(input.auditFindings ?? []), ...(input.auditResult?.findings ?? [])];
}

function auditCategories(input: GovernanceUtilityStabilizationReviewInput): FullSystemGovernanceAuditCategory[] {
  return uniqueNonEmptyStrings(
    getAuditFindings(input)
      .map((finding) => finding.category)
      .concat(Object.keys(input.auditResult?.categoryScores ?? {}) as FullSystemGovernanceAuditCategory[]),
  ) as FullSystemGovernanceAuditCategory[];
}

function knownRisks(input: GovernanceUtilityStabilizationReviewInput): string[] {
  return uniqueNonEmptyStrings([
    ...contextSignals(input, "knownRisks"),
    ...contextSignals(input, "knownLimitations"),
    ...(input.extractionPlanResult?.unstableUtilityCandidates ?? []),
    ...(input.extractionPlanResult?.findings.map((finding) => finding.description) ?? []),
  ]);
}

function createAreaAssessment(params: AreaInput): GovernanceUtilityStabilizationAreaAssessment {
  const score = calculateGovernanceUtilityStabilizationAreaScore({
    baseScore: params.baseScore,
    stabilitySignalCount: params.stabilitySignals.length,
    riskSignalCount: params.riskSignals.length,
    findingCount: params.riskSignals.length,
    explainabilityCount:
      params.reasoning.length > 0 ? params.stabilitySignals.length + 1 : params.stabilitySignals.length,
  });

  return {
    area: params.area,
    score,
    classification: governanceUtilityStabilizationClassificationFromScore(score),
    description: params.description,
    stabilitySignals: uniqueNonEmptyStrings(params.stabilitySignals),
    riskSignals: uniqueNonEmptyStrings(params.riskSignals),
    recommendedHumanReview: params.recommendedHumanReview,
    explainability: {
      factors: uniqueNonEmptyStrings([...params.stabilitySignals, ...params.riskSignals]),
      reasoning: uniqueNonEmptyStrings([
        params.reasoning,
        params.riskSignals.length > 0
          ? "Human review should resolve utility stabilization risks before future adoption expands beyond Phase 1."
          : "",
      ]),
    },
  };
}

function buildAreaAssessments(
  input: GovernanceUtilityStabilizationReviewInput,
): GovernanceUtilityStabilizationAreaAssessment[] {
  const riskSignals = knownRisks(input);
  const changedBehaviorNotes = contextSignals(input, "changedBehaviorNotes");
  const importGraphNotes = contextSignals(input, "importGraphNotes");
  const compatibilityNotes = contextSignals(input, "compatibilityNotes");
  const adoptedModules = consumingModules(input);
  const helpers = helperNames(input);

  return [
    createAreaAssessment({
      area: "deterministic_behavior_stability",
      description:
        "Validates that Phase 1 helpers remain deterministic, side-effect free, and scoring-safe.",
      baseScore: averageFiniteNumbers([
        input.auditResult?.categoryScores.deterministic_scoring_integrity ?? 42,
        governanceStatusScore(input.extractionPlanResult?.extractionReadinessClassification),
      ]),
      stabilitySignals: [
        ...helpers.filter((helper) =>
          /score|average|unique|metadata|string|slug|normalize|threshold/i.test(helper),
        ),
        ...(input.extractionPlanResult?.deterministicHelperFindings ?? []),
        ...contextSignals(input, "testEvidence"),
      ],
      riskSignals: [
        ...changedBehaviorNotes.filter((note) => /score|deterministic|average|clamp/i.test(note)),
        ...riskSignals.filter((risk) => /score|deterministic|average|clamp|helper/i.test(risk)),
      ],
      recommendedHumanReview:
        "Review deterministic helper outputs before expanding adoption beyond the extraction-plan module.",
      reasoning:
        "Deterministic behavior is stable when helpers are pure, finite, bounded, and do not alter scoring weights.",
    }),
    createAreaAssessment({
      area: "helper_output_consistency",
      description:
        "Reviews whether helper outputs are consistent with prior local helper behavior.",
      baseScore: averageFiniteNumbers([
        input.extractionPlanResult?.extractionReadinessScore ?? 42,
        input.auditResult?.categoryScores.utility_duplication ?? 42,
      ]),
      stabilitySignals: [
        `Utility files reviewed: ${utilityFiles(input).join(", ")}`,
        `Helpers reviewed: ${helpers.join(", ")}`,
        ...contextSignals(input, "testEvidence"),
      ],
      riskSignals: changedBehaviorNotes,
      recommendedHumanReview:
        "Review helper output consistency before replacing older local helpers.",
      reasoning:
        "Output consistency is strongest when Phase 1 primitives match the existing deterministic mechanics they replaced.",
    }),
    createAreaAssessment({
      area: "semantic_stability",
      description:
        "Reviews whether key normalization and slug helpers avoid governance semantic mutation.",
      baseScore: averageFiniteNumbers([
        input.auditResult?.categoryScores.doctrine_consistency ?? 42,
        governanceStatusScore(input.extractionPlanResult?.extractionReadinessClassification),
      ]),
      stabilitySignals: [
        "normalizeGovernanceKey preserves deterministic key generation only.",
        "createGovernanceSlug preserves deterministic slug generation only.",
      ],
      riskSignals: [
        ...changedBehaviorNotes.filter((note) => /slug|key|semantic|normalize/i.test(note)),
        ...riskSignals.filter((risk) => /semantic|slug|key|normalize|doctrine/i.test(risk)),
      ],
      recommendedHumanReview:
        "Review slug and normalization usage to confirm no governance terminology is rewritten.",
      reasoning:
        "Semantic stability is preserved when utilities create keys and slugs without changing displayed doctrine meaning.",
    }),
    createAreaAssessment({
      area: "explainability_continuity",
      description:
        "Reviews whether Phase 1 helper adoption preserves explainability output continuity.",
      baseScore: averageFiniteNumbers([
        input.auditResult?.categoryScores.explainability_integrity ?? 42,
        governanceStatusScore(input.extractionPlanResult?.extractionReadinessClassification),
      ]),
      stabilitySignals: [
        ...(input.extractionPlanResult?.explainabilityHelperFindings ?? []),
        "Plan explainability now uses shared unique string mechanics only.",
      ],
      riskSignals: riskSignals.filter((risk) => /explain|reason|limitation|driver/i.test(risk)),
      recommendedHumanReview:
        "Review explainability output shape before adopting helpers in older governance modules.",
      reasoning:
        "Explainability continuity is stable when summary, rules, drivers, limitations, and reasoning remain visible.",
    }),
    createAreaAssessment({
      area: "traceability_continuity",
      description:
        "Reviews whether Phase 1 helper adoption avoids traceability degradation.",
      baseScore: averageFiniteNumbers([
        input.auditResult?.categoryScores.traceability_integrity ?? 42,
        governanceStatusScore(input.extractionPlanResult?.extractionReadinessClassification),
      ]),
      stabilitySignals: [
        ...(input.extractionPlanResult?.traceabilityHelperFindings ?? []),
        "Phase 1 did not mutate evidence links, trace IDs, recommendations, or limitation linkages.",
      ],
      riskSignals: riskSignals.filter((risk) => /trace|evidence|recommendation|linkage/i.test(risk)),
      recommendedHumanReview:
        "Review traceability outputs before any helper adoption touches evidence or recommendation linkage.",
      reasoning:
        "Traceability continuity is stable when shared helpers do not rewrite evidence chains or recommendation mappings.",
    }),
    createAreaAssessment({
      area: "survivability_continuity",
      description:
        "Reviews whether Phase 1 helper adoption preserves survivability and continuity signals.",
      baseScore: averageFiniteNumbers([
        input.auditResult?.categoryScores.enterprise_durability ?? 42,
        governanceStatusScore(input.extractionPlanResult?.extractionReadinessClassification),
      ]),
      stabilitySignals: [
        ...(input.extractionPlanResult?.survivabilityContractCandidates ?? []),
        "Phase 1 avoided survivability engine or contract mutation.",
      ],
      riskSignals: riskSignals.filter((risk) => /surviv|continuity|durability|reconstruction/i.test(risk)),
      recommendedHumanReview:
        "Review survivability continuity before extracting any contract-level helpers.",
      reasoning:
        "Survivability continuity is preserved when only primitive helpers were extracted and survivability engines remained untouched.",
    }),
    createAreaAssessment({
      area: "coupling_risk",
      description:
        "Reviews whether Phase 1 introduced hidden coupling between utilities and governance engines.",
      baseScore: averageFiniteNumbers([
        input.auditResult?.categoryScores.dependency_integrity ?? 42,
        input.auditResult?.categoryScores.architecture_integrity ?? 42,
      ]),
      stabilitySignals: [
        "Utilities depend only on primitive local logic.",
        `Consuming modules remain scoped: ${adoptedModules.join(", ")}`,
        ...importGraphNotes.filter((note) => !/risk|cycle|coupling/i.test(note)),
      ],
      riskSignals: [
        ...importGraphNotes.filter((note) => /risk|cycle|coupling/i.test(note)),
        ...riskSignals.filter((risk) => /coupling|dependency|import/i.test(risk)),
      ],
      recommendedHumanReview:
        "Review dependency direction before adopting utilities in additional governance modules.",
      reasoning:
        "Coupling risk stays low when utilities remain leaf modules with no route, DB, orchestration, or subsystem dependencies.",
    }),
    createAreaAssessment({
      area: "dependency_risk",
      description:
        "Reviews dependency risks and import-cycle risk introduced by Phase 1.",
      baseScore: averageFiniteNumbers([
        input.auditResult?.categoryScores.dependency_integrity ?? 42,
        input.extractionPlanResult?.extractionReadinessScore ?? 42,
      ]),
      stabilitySignals: [
        "No external package dependency was introduced for Phase 1 utilities.",
        "Utility imports are local and deterministic.",
      ],
      riskSignals: riskSignals.filter((risk) => /dependency|cycle|package|import/i.test(risk)),
      recommendedHumanReview:
        "Review import graph notes before wider utility adoption.",
      reasoning:
        "Dependency stability is strongest when helper modules stay package-free and acyclic.",
    }),
    createAreaAssessment({
      area: "import_safety",
      description:
        "Reviews import safety and old module compatibility after Phase 1 extraction.",
      baseScore: averageFiniteNumbers([
        input.auditResult?.categoryScores.dependency_integrity ?? 42,
        input.auditResult?.categoryScores.long_horizon_maintainability ?? 42,
      ]),
      stabilitySignals: [
        ...compatibilityNotes,
        "Older governance modules were not migrated in Phase 1.",
        `Current adoption scope: ${adoptedModules.join(", ")}`,
      ],
      riskSignals: riskSignals.filter((risk) => /compat|import|old module|migration/i.test(risk)),
      recommendedHumanReview:
        "Review old module compatibility before any follow-up migration.",
      reasoning:
        "Import safety is stronger when old modules continue compiling without forced migration.",
    }),
    createAreaAssessment({
      area: "hidden_execution_pathways",
      description:
        "Reviews whether Phase 1 utilities introduced hidden execution pathways.",
      baseScore: input.auditResult?.categoryScores.hidden_execution_pathways ?? 76,
      stabilitySignals: [
        "Utilities do not import routes, APIs, DB modules, automation modules, messaging systems, or orchestration systems.",
      ],
      riskSignals: [
        ...(input.auditResult?.hiddenExecutionPathwayRisks ?? []),
        ...riskSignals.filter((risk) => /execution|route|api|db|automation|workflow/i.test(risk)),
      ],
      recommendedHumanReview:
        "Review hidden execution pathway risks before future utility adoption.",
      reasoning:
        "Hidden execution risk remains low when utilities are pure functions with no operational side effects.",
    }),
    createAreaAssessment({
      area: "orchestration_contamination",
      description:
        "Reviews whether Phase 1 utilities contaminated orchestration boundaries.",
      baseScore: input.auditResult?.categoryScores.orchestration_purity ?? 76,
      stabilitySignals: [
        "No orchestration, automation, outreach, workflow, or execution helper was extracted.",
      ],
      riskSignals: [
        ...(input.auditResult?.orchestrationContaminationRisks ?? []),
        ...riskSignals.filter((risk) => /orchestration|automation|workflow|outreach|twilio/i.test(risk)),
      ],
      recommendedHumanReview:
        "Keep governance utilities separate from orchestration and automation systems.",
      reasoning:
        "Orchestration safety is preserved when utilities remain read-only primitives and do not trigger actions.",
    }),
    createAreaAssessment({
      area: "old_module_compatibility",
      description:
        "Reviews whether older governance modules remain compatible after Phase 1.",
      baseScore: averageFiniteNumbers([
        input.auditResult?.categoryScores.long_horizon_maintainability ?? 42,
        input.auditResult?.categoryScores.type_duplication ?? 42,
      ]),
      stabilitySignals: [
        "Older governance review modules were not refactored in Phase 1.",
        ...compatibilityNotes,
      ],
      riskSignals: riskSignals.filter((risk) => /old module|compat|migration|refactor/i.test(risk)),
      recommendedHumanReview:
        "Validate old module compatibility during the next stabilization checkpoint before broad adoption.",
      reasoning:
        "Compatibility is preserved by keeping Phase 1 adoption narrow and avoiding forced migration.",
    }),
    createAreaAssessment({
      area: "future_adoption_readiness",
      description:
        "Reviews whether future adoption should proceed, pause, or remain staged.",
      baseScore: averageFiniteNumbers([
        input.extractionPlanResult?.extractionReadinessScore ?? 42,
        input.auditResult?.categoryScores.reusable_infrastructure_opportunities ?? 42,
        input.auditResult?.categoryScores.future_technical_debt ?? 42,
      ]),
      stabilitySignals: [
        ...(input.extractionPlanResult?.extractionReadyUtilityCandidates ?? []),
        ...contextSignals(input, "futureCandidates"),
      ],
      riskSignals: [
        ...(input.extractionPlanResult?.unstableUtilityCandidates ?? []),
        ...riskSignals.filter((risk) => /adoption|future|refactor|premature/i.test(risk)),
      ],
      recommendedHumanReview:
        "Adopt helpers in future phases only through small, reviewed batches.",
      reasoning:
        "Future adoption readiness is strongest when Phase 1 stays stable and high-risk contracts remain deferred.",
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
  type: GovernanceUtilityStabilizationFindingType;
  area: GovernanceUtilityStabilizationArea;
  description: string;
  evidence: string[];
  affectedAuditCategories: FullSystemGovernanceAuditCategory[];
  recommendedHumanReview: string;
  riskWeight?: number;
}): GovernanceUtilityStabilizationFinding {
  const evidence = uniqueNonEmptyStrings(params.evidence);

  return {
    id: `governance_utility_stabilization_${createGovernanceSlug(params.type)}_${createGovernanceSlug(
      params.area,
    )}`,
    findingType: params.type,
    area: params.area,
    severity: severityForFinding({ evidenceCount: evidence.length, riskWeight: params.riskWeight }),
    description: params.description,
    evidence,
    affectedAuditCategories: params.affectedAuditCategories,
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore: calculateGovernanceUtilityStabilizationFindingConfidence({
      evidenceCount: evidence.length,
      factorCount: params.affectedAuditCategories.length,
    }),
    explainability: {
      factors: evidence,
      reasoning: uniqueNonEmptyStrings([
        params.description,
        "Finding is review-only and does not trigger utility adoption, extraction, remediation, enforcement, or orchestration.",
      ]),
    },
  };
}

function buildFindings(
  input: GovernanceUtilityStabilizationReviewInput,
): GovernanceUtilityStabilizationFinding[] {
  const findings: GovernanceUtilityStabilizationFinding[] = [];
  const categories = auditCategories(input);
  const risks = knownRisks(input);
  const changedBehaviorNotes = contextSignals(input, "changedBehaviorNotes");
  const importGraphNotes = contextSignals(input, "importGraphNotes");

  if (changedBehaviorNotes.length > 0) {
    findings.push(
      createFinding({
        type: "utility_instability",
        area: "helper_output_consistency",
        description:
          "Changed behavior notes were supplied and should be reviewed before future utility adoption.",
        evidence: changedBehaviorNotes,
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review changed behavior notes before adopting Phase 1 helpers in additional modules.",
        riskWeight: 2,
      }),
    );
  }

  if (changedBehaviorNotes.some((note) => /score|clamp|average|confidence|classification/i.test(note))) {
    findings.push(
      createFinding({
        type: "changed_scoring_behavior",
        area: "deterministic_behavior_stability",
        description:
          "Potential scoring behavior changes require human review before wider utility adoption.",
        evidence: changedBehaviorNotes.filter((note) =>
          /score|clamp|average|confidence|classification/i.test(note),
        ),
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Confirm score, confidence, clamp, average, and classification outputs are unchanged.",
        riskWeight: 3,
      }),
    );
  }

  if (changedBehaviorNotes.some((note) => /slug|key|normalize|semantic/i.test(note))) {
    findings.push(
      createFinding({
        type: "changed_slug_key_behavior",
        area: "semantic_stability",
        description:
          "Potential slug, key, or normalization behavior changes require human review.",
        evidence: changedBehaviorNotes.filter((note) => /slug|key|normalize|semantic/i.test(note)),
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Confirm slug and normalization helpers do not rewrite governance terminology.",
        riskWeight: 3,
      }),
    );
  }

  if (importGraphNotes.some((note) => /cycle/i.test(note))) {
    findings.push(
      createFinding({
        type: "import_cycle_risk",
        area: "dependency_risk",
        description:
          "Import-cycle risk was reported and should be resolved before future adoption.",
        evidence: importGraphNotes.filter((note) => /cycle/i.test(note)),
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review import cycles before migrating additional governance modules to shared utilities.",
        riskWeight: 3,
      }),
    );
  }

  if (risks.some((risk) => /coupling|dependency|import/i.test(risk))) {
    findings.push(
      createFinding({
        type: "hidden_dependency_coupling",
        area: "coupling_risk",
        description:
          "Coupling or dependency risk should be reviewed before expanding utility adoption.",
        evidence: risks.filter((risk) => /coupling|dependency|import/i.test(risk)),
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Confirm utilities remain leaf modules with no route, DB, automation, or orchestration dependencies.",
      }),
    );
  }

  if (risks.some((risk) => /semantic|doctrine|terminology|normalization/i.test(risk))) {
    findings.push(
      createFinding({
        type: "semantic_drift",
        area: "semantic_stability",
        description:
          "Semantic drift risk should be reviewed before adopting normalization helpers more broadly.",
        evidence: risks.filter((risk) => /semantic|doctrine|terminology|normalization/i.test(risk)),
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review semantic stability before using shared normalization helpers in doctrine or registry-adjacent modules.",
      }),
    );
  }

  if (risks.some((risk) => /trace|evidence|linkage/i.test(risk))) {
    findings.push(
      createFinding({
        type: "traceability_drift",
        area: "traceability_continuity",
        description:
          "Traceability drift risk should be reviewed before any helper touches evidence or recommendation linkage.",
        evidence: risks.filter((risk) => /trace|evidence|linkage/i.test(risk)),
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review traceability continuity before future traceability helper adoption.",
      }),
    );
  }

  if (risks.some((risk) => /explain|reason|limitation|driver/i.test(risk))) {
    findings.push(
      createFinding({
        type: "explainability_degradation",
        area: "explainability_continuity",
        description:
          "Explainability degradation risk should be reviewed before broader explainability helper adoption.",
        evidence: risks.filter((risk) => /explain|reason|limitation|driver/i.test(risk)),
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Review explainability continuity before replacing older local explainability helpers.",
      }),
    );
  }

  if (
    (input.auditResult?.orchestrationContaminationRisks.length ?? 0) > 0 ||
    risks.some((risk) => /orchestration|automation|workflow|outreach|twilio/i.test(risk))
  ) {
    findings.push(
      createFinding({
        type: "governance_boundary_weakening",
        area: "orchestration_contamination",
        description:
          "Orchestration or automation boundary risks should remain isolated from shared governance utilities.",
        evidence: [
          ...(input.auditResult?.orchestrationContaminationRisks ?? []),
          ...risks.filter((risk) => /orchestration|automation|workflow|outreach|twilio/i.test(risk)),
        ],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Confirm shared utilities remain separate from orchestration, automation, and execution systems.",
        riskWeight: 2,
      }),
    );
  }

  if ((input.extractionPlanResult?.unstableUtilityCandidates.length ?? 0) > 0) {
    findings.push(
      createFinding({
        type: "premature_adoption_risk",
        area: "future_adoption_readiness",
        description:
          "Unstable utility candidates remain and should not be adopted until later phases.",
        evidence: input.extractionPlanResult?.unstableUtilityCandidates ?? [],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Keep unstable candidates deferred until a future review approves them.",
      }),
    );
  }

  if ((input.auditResult?.futureTechnicalDebtItems.length ?? 0) > 0) {
    findings.push(
      createFinding({
        type: "future_refactor_risk",
        area: "future_adoption_readiness",
        description:
          "Future technical debt should be considered before additional helper migration.",
        evidence: input.auditResult?.futureTechnicalDebtItems ?? [],
        affectedAuditCategories: categories,
        recommendedHumanReview:
          "Plan future helper migration in small batches so technical debt is reduced without broad refactor.",
      }),
    );
  }

  return findings;
}

function buildHumanReviewNotes(
  input: GovernanceUtilityStabilizationReviewInput,
  findings: GovernanceUtilityStabilizationFinding[],
): string[] {
  return uniqueNonEmptyStrings([
    "Human review is required before adopting shared governance utilities beyond Phase 1.",
    "This stabilization review is read-only and does not extract new utilities, mutate behavior, add routes, write to databases, trigger orchestration, or enforce governance.",
    "Phase 1 remains limited to low-risk deterministic primitives.",
    ...findings.map((finding) => finding.recommendedHumanReview),
    ...(input.extractionPlanResult?.humanReviewNotes ?? []),
  ]);
}

function buildFutureRecommendations(
  input: GovernanceUtilityStabilizationReviewInput,
  findings: GovernanceUtilityStabilizationFinding[],
): string[] {
  return uniqueNonEmptyStrings([
    findings.length > 0
      ? "Resolve stabilization findings before adopting utilities in additional governance modules."
      : "Proceed only to review-only closure planning before any further utility adoption.",
    "Keep future utility adoption limited to small, deterministic, reviewed batches.",
    "Do not migrate traceability, explainability, normalization, survivability, or semantic-version helpers until separate reviews approve them.",
    ...contextSignals(input, "futureCandidates").map(
      (candidate) => `Future candidate for review only: ${candidate}`,
    ),
    ...(input.extractionPlanResult?.stagedExtractionRecommendations.map(
      (recommendation) => recommendation.recommendation,
    ) ?? []),
  ]);
}

export function runGovernanceUtilityStabilizationReview(
  input: GovernanceUtilityStabilizationReviewInput,
): GovernanceUtilityStabilizationReviewResult {
  const areaAssessments = buildAreaAssessments(input);
  const findings = buildFindings(input);
  const stabilizationScore = calculateOverallGovernanceUtilityStabilizationScore({
    areaAssessments,
    findings,
  });
  const stabilizationClassification = governanceUtilityStabilizationClassificationFromScore(stabilizationScore);

  const resultWithoutExplainability: Omit<
    GovernanceUtilityStabilizationReviewResult,
    "explainability"
  > = {
    stabilizationScore,
    stabilizationClassification,
    areaAssessments,
    findings,
    stableHelperFindings: uniqueNonEmptyStrings([
      ...helperNames(input).map((helper) => `Stable Phase 1 helper reviewed: ${helper}`),
      ...areaAssessments
        .filter((assessment) =>
          ["stable", "institutionally_stable"].includes(assessment.classification),
        )
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100`),
    ]),
    unstableHelperFindings: uniqueNonEmptyStrings([
      ...areaAssessments
        .filter((assessment) => ["unstable", "needs_review"].includes(assessment.classification))
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100`),
      ...findings
        .filter((finding) =>
          ["utility_instability", "changed_scoring_behavior", "changed_slug_key_behavior"].includes(
            finding.findingType,
          ),
        )
        .map((finding) => finding.description),
    ]),
    compatibilityFindings: uniqueNonEmptyStrings([
      ...contextSignals(input, "compatibilityNotes"),
      ...areaAssessments
        .filter((assessment) => assessment.area === "old_module_compatibility")
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100`),
    ]),
    couplingFindings: uniqueNonEmptyStrings([
      ...areaAssessments
        .filter((assessment) =>
          ["coupling_risk", "dependency_risk", "import_safety"].includes(assessment.area),
        )
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100`),
      ...findings
        .filter((finding) =>
          ["hidden_dependency_coupling", "import_cycle_risk"].includes(finding.findingType),
        )
        .map((finding) => finding.description),
    ]),
    semanticStabilityFindings: uniqueNonEmptyStrings([
      ...areaAssessments
        .filter((assessment) => assessment.area === "semantic_stability")
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100`),
      ...findings
        .filter((finding) =>
          ["semantic_drift", "changed_slug_key_behavior"].includes(finding.findingType),
        )
        .map((finding) => finding.description),
    ]),
    traceabilityExplainabilityFindings: uniqueNonEmptyStrings([
      ...areaAssessments
        .filter((assessment) =>
          ["traceability_continuity", "explainability_continuity"].includes(assessment.area),
        )
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100`),
      ...findings
        .filter((finding) =>
          ["traceability_drift", "explainability_degradation"].includes(finding.findingType),
        )
        .map((finding) => finding.description),
    ]),
    governanceSafetyFindings: uniqueNonEmptyStrings([
      ...areaAssessments
        .filter((assessment) =>
          ["hidden_execution_pathways", "orchestration_contamination"].includes(assessment.area),
        )
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100`),
      ...(input.auditResult?.governanceSafetyNotes ?? []),
    ]),
    adoptionReadinessFindings: uniqueNonEmptyStrings([
      ...areaAssessments
        .filter((assessment) => assessment.area === "future_adoption_readiness")
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100`),
      ...findings
        .filter((finding) => finding.findingType === "premature_adoption_risk")
        .map((finding) => finding.description),
    ]),
    humanReviewNotes: buildHumanReviewNotes(input, findings),
    futureRecommendations: buildFutureRecommendations(input, findings),
    humanReviewRequired:
      findings.length > 0 ||
      areaAssessments.some((assessment) => ["unstable", "needs_review"].includes(assessment.classification)),
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildGovernanceUtilityStabilizationExplainability({
      input,
      result: resultWithoutExplainability,
    }),
  };
}
