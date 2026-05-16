import {
  buildGovernanceContinuityExplainability,
  buildGovernanceContinuityRecommendations,
} from "./reputation-governance-continuity-explainability";
import {
  calculateContinuityFindingConfidence,
  calculateGovernanceContinuityScore,
  continuityStatusFromScore,
  severityFromContinuityDelta,
} from "./reputation-governance-continuity-scoring";
import type {
  ReputationGovernanceContinuityInput,
  ReputationGovernanceContinuityResult,
  ReputationGovernanceDriftFinding,
  ReputationGovernanceDriftType,
} from "./reputation-governance-continuity-types";
import type { ReputationSeverity } from "./reputation-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const slug = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const domainList = (input: ReputationGovernanceContinuityInput): string[] =>
  unique([
    ...(input.governanceResult?.affectedGovernanceDomains ?? []),
    ...(input.remediationResult?.affectedGovernanceDomains ?? []),
    ...(input.currentLineageResult?.nodes.flatMap((node) => node.relatedGovernanceDomains) ?? []),
  ]);

const businessUnitList = (input: ReputationGovernanceContinuityInput): string[] =>
  unique([
    ...(input.remediationResult?.affectedBusinessUnits ?? []),
    ...(input.currentLineageResult?.nodes.flatMap((node) => node.relatedBusinessUnits) ?? []),
    ...(input.aggregationResult?.exposureByBusinessUnit.map((unit) => unit.businessUnit) ?? []),
  ]);

const createFinding = (params: {
  driftType: ReputationGovernanceDriftType;
  severity: ReputationSeverity;
  description: string;
  evidence: string[];
  affectedGovernanceDomains: string[];
  affectedBusinessUnits: string[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  baseConfidence?: number;
}): ReputationGovernanceDriftFinding => {
  const evidence = unique(params.evidence);
  const affectedGovernanceDomains = unique(params.affectedGovernanceDomains);
  const affectedBusinessUnits = unique(params.affectedBusinessUnits);
  const factors = unique(params.factors);

  return {
    id: `governance-continuity-${slug(params.driftType)}-${slug(params.description)}`,
    driftType: params.driftType,
    severity: params.severity,
    description: params.description,
    evidence,
    affectedGovernanceDomains,
    affectedBusinessUnits,
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore: calculateContinuityFindingConfidence({
      evidenceCount: evidence.length,
      affectedGovernanceDomainCount: affectedGovernanceDomains.length,
      affectedBusinessUnitCount: affectedBusinessUnits.length,
      factorCount: factors.length,
      baseConfidence: params.baseConfidence,
    }),
    explainability: {
      factors,
      reasoning: params.reasoning,
    },
  };
};

const scoreDelta = (input: ReputationGovernanceContinuityInput): number | undefined => {
  if (!input.currentLineageResult || !input.previousLineageResult) return undefined;
  return input.currentLineageResult.lineageIntegrityScore - input.previousLineageResult.lineageIntegrityScore;
};

const buildDriftFindings = (input: ReputationGovernanceContinuityInput): ReputationGovernanceDriftFinding[] => {
  const findings: ReputationGovernanceDriftFinding[] = [];
  const delta = scoreDelta(input);
  const domains = domainList(input);
  const businessUnits = businessUnitList(input);
  const current = input.currentLineageResult;
  const previous = input.previousLineageResult;

  if (!current) {
    findings.push(
      createFinding({
        driftType: "reviewability_decline",
        severity: "elevated",
        description: "Current governance lineage was not supplied for continuity review.",
        evidence: ["Current lineage result is not supplied."],
        affectedGovernanceDomains: domains,
        affectedBusinessUnits: businessUnits,
        recommendedHumanReview: "Review whether current governance lineage can be generated before interpreting continuity.",
        factors: ["Current lineage result: not_supplied."],
        reasoning: ["Continuity review requires current lineage context to remain reviewable."],
      }),
    );
  }

  if (delta !== undefined && delta <= -8) {
    findings.push(
      createFinding({
        driftType: "lineage_integrity_decline",
        severity: severityFromContinuityDelta(delta),
        description: "Current governance lineage integrity declined compared with the previous evaluation period.",
        evidence: [
          `Previous lineage integrity score: ${previous?.lineageIntegrityScore}.`,
          `Current lineage integrity score: ${current?.lineageIntegrityScore}.`,
          `Lineage integrity delta: ${delta}.`,
        ],
        affectedGovernanceDomains: domains,
        affectedBusinessUnits: businessUnits,
        recommendedHumanReview: "Review the lineage integrity decline and confirm whether evidence, remediation, or resolution continuity changed.",
        factors: [`Deterministic decline threshold: -8.`, `Observed delta: ${delta}.`],
        reasoning: ["A material decline in lineage integrity can reduce institutional continuity and review confidence."],
      }),
    );
  }

  const weakLineageCount = current?.weakLineageAreas.length ?? 0;
  const dependencyChainCount = current?.governanceDependencyChains.length ?? 0;
  const explainabilityDriverCount = current?.explainability.majorDrivers.length ?? 0;

  if (weakLineageCount >= 2 || dependencyChainCount === 0 || explainabilityDriverCount === 0) {
    findings.push(
      createFinding({
        driftType: "reviewability_decline",
        severity: weakLineageCount >= 4 || dependencyChainCount === 0 ? "elevated" : "moderate",
        description: "Governance lineage reviewability appears limited in the current evaluation period.",
        evidence: [
          `Weak lineage areas: ${weakLineageCount}.`,
          `Governance dependency chains: ${dependencyChainCount}.`,
          `Major lineage explainability drivers: ${explainabilityDriverCount}.`,
          ...(current?.weakLineageAreas.slice(0, 6) ?? []),
        ],
        affectedGovernanceDomains: domains,
        affectedBusinessUnits: businessUnits,
        recommendedHumanReview: "Review weak lineage areas and dependency chains before relying on continuity indicators.",
        factors: [
          "Reviewability requires traceable lineage areas, dependency chains, and explainability drivers.",
          `Dependency chain count: ${dependencyChainCount}.`,
        ],
        reasoning: ["Limited dependency and explanation context can reduce human reviewability across periods."],
      }),
    );
  }

  const evidenceQualityWeak = ["weak", "partial"].includes(input.evidenceQualityResult?.overallReliabilityLevel ?? "");
  const missingEvidenceCount = input.evidenceQualityResult?.missingEvidenceAreas.length ?? 0;
  const currentDependencyCount = current?.governanceDependencyChains.length ?? 0;
  const previousDependencyCount = previous?.governanceDependencyChains.length ?? currentDependencyCount;

  if (evidenceQualityWeak || missingEvidenceCount >= 2 || currentDependencyCount < previousDependencyCount) {
    findings.push(
      createFinding({
        driftType: "evidence_dependency_weakening",
        severity: evidenceQualityWeak || missingEvidenceCount >= 4 ? "elevated" : "moderate",
        description: "Evidence dependency continuity appears weaker in the current governance review context.",
        evidence: [
          `Evidence reliability: ${input.evidenceQualityResult?.overallReliabilityLevel ?? "not_supplied"}.`,
          `Missing evidence areas: ${missingEvidenceCount}.`,
          `Previous dependency chains: ${previousDependencyCount}.`,
          `Current dependency chains: ${currentDependencyCount}.`,
          ...(input.evidenceQualityResult?.missingEvidenceAreas.slice(0, 6) ?? []),
        ],
        affectedGovernanceDomains: domains,
        affectedBusinessUnits: businessUnits,
        recommendedHumanReview: "Review evidence dependency continuity and missing evidence areas before interpreting governance durability.",
        factors: ["Evidence dependency continuity uses evidence quality and lineage dependency chain counts."],
        reasoning: ["Weak or reduced evidence dependencies can make continuity less durable across evaluation periods."],
      }),
    );
  }

  const planItems = input.remediationResult?.planItems ?? [];
  const elevatedPlanItems = planItems.filter((item) => ["elevated", "critical"].includes(item.priority));
  const weakPlanEvidence = elevatedPlanItems.filter((item) => item.supportingEvidence.length < 2);

  if (weakPlanEvidence.length > 0) {
    findings.push(
      createFinding({
        driftType: "remediation_pattern_instability",
        severity: weakPlanEvidence.length >= 2 ? "elevated" : "moderate",
        description: "Some elevated remediation patterns have limited supporting lineage evidence.",
        evidence: weakPlanEvidence.flatMap((item) => [
          `${item.title}: priority ${item.priority}.`,
          `Supporting evidence count: ${item.supportingEvidence.length}.`,
        ]),
        affectedGovernanceDomains: weakPlanEvidence.flatMap((item) => item.affectedGovernanceDomains),
        affectedBusinessUnits: weakPlanEvidence.flatMap((item) => item.affectedBusinessUnits),
        recommendedHumanReview: "Review elevated remediation patterns and confirm supporting evidence continuity.",
        factors: ["Elevated remediation plan items require durable evidence references for continuity review."],
        reasoning: ["Limited evidence for elevated remediation patterns can reduce continuity confidence."],
      }),
    );
  }

  const unstableResolutionFindings =
    input.resolutionResult?.findings.filter((finding) => ["unresolved", "recurring", "not_started"].includes(finding.status)) ??
    [];

  if (unstableResolutionFindings.length > 0) {
    findings.push(
      createFinding({
        driftType: "resolution_pattern_instability",
        severity: unstableResolutionFindings.length >= 3 ? "elevated" : "moderate",
        description: "Resolution patterns include current unresolved, recurring, or not-started areas.",
        evidence: unstableResolutionFindings.flatMap((finding) => [
          `${finding.description}`,
          `Resolution status: ${finding.status}.`,
        ]),
        affectedGovernanceDomains: unstableResolutionFindings.flatMap((finding) => finding.affectedGovernanceDomains),
        affectedBusinessUnits: unstableResolutionFindings.flatMap((finding) => finding.affectedBusinessUnits),
        recommendedHumanReview: "Review unstable resolution patterns before treating governance continuity as durable.",
        factors: ["Resolution continuity is reduced by unresolved, recurring, or not-started tracking states."],
        reasoning: ["Resolution pattern instability can interrupt governance continuity across periods."],
      }),
    );
  }

  const currentStabilizationCount = current?.stabilizationChains.length ?? 0;
  const previousStabilizationCount = previous?.stabilizationChains.length ?? currentStabilizationCount;
  const contradictionDelta =
    current && previous ? current.contradictionChains.length - previous.contradictionChains.length : 0;
  const stabilizationDeclined = currentStabilizationCount < previousStabilizationCount;

  if (stabilizationDeclined || contradictionDelta > 0) {
    findings.push(
      createFinding({
        driftType: "stabilization_chain_deterioration",
        severity: contradictionDelta >= 2 || previousStabilizationCount - currentStabilizationCount >= 2 ? "elevated" : "moderate",
        description: "Stabilization continuity appears weaker than the previous lineage period.",
        evidence: [
          `Previous stabilization chains: ${previousStabilizationCount}.`,
          `Current stabilization chains: ${currentStabilizationCount}.`,
          `Contradiction chain delta: ${contradictionDelta}.`,
        ],
        affectedGovernanceDomains: domains,
        affectedBusinessUnits: businessUnits,
        recommendedHumanReview: "Review stabilization chain changes and contradiction context before interpreting continuity.",
        factors: ["Stabilization chain continuity compares current and previous lineage stabilization and contradiction counts."],
        reasoning: ["Reduced stabilization chains or increased contradictions can weaken long-horizon governance durability."],
      }),
    );
  }

  const contradictionCount = current?.contradictionChains.length ?? 0;
  const governanceFindings = input.governanceResult?.findings.length ?? 0;

  if (contradictionCount > 0 || (governanceFindings > 0 && dependencyChainCount === 0)) {
    findings.push(
      createFinding({
        driftType: "governance_reasoning_inconsistency",
        severity: contradictionCount >= 3 ? "elevated" : "moderate",
        description: "Governance reasoning continuity has contradiction or dependency-chain gaps.",
        evidence: [
          `Contradiction chains: ${contradictionCount}.`,
          `Governance findings: ${governanceFindings}.`,
          `Governance dependency chains: ${dependencyChainCount}.`,
          ...(current?.contradictionChains.slice(0, 6) ?? []),
        ],
        affectedGovernanceDomains: domains,
        affectedBusinessUnits: businessUnits,
        recommendedHumanReview: "Review contradiction chains and governance dependency paths before relying on reasoning continuity.",
        factors: ["Governance reasoning continuity requires low contradiction pressure and traceable dependency chains."],
        reasoning: ["Contradictions or missing dependency chains can make governance reasoning harder to review over time."],
      }),
    );
  }

  return findings;
};

const buildContinuityStrengths = (input: ReputationGovernanceContinuityInput): string[] => {
  const delta = scoreDelta(input);

  return unique([
    ...(delta !== undefined && delta >= 0 ? ["Lineage integrity is stable or improved compared with the previous period."] : []),
    ...((input.currentLineageResult?.contradictionChains.length ?? 0) === 0
      ? ["Current lineage has no contradiction chains supplied."]
      : []),
    ...((input.currentLineageResult?.governanceDependencyChains.length ?? 0) > 0
      ? ["Current governance findings retain traceable dependency chains."]
      : []),
    ...(input.evidenceQualityResult && ["strong", "highly_reliable"].includes(input.evidenceQualityResult.overallReliabilityLevel)
      ? ["Evidence quality is strong enough to support continuity review."]
      : []),
    ...(input.resolutionResult && ["stabilized", "improving"].includes(input.resolutionResult.overallResolutionStatus)
      ? ["Resolution tracking indicates improving or stabilized operational continuity."]
      : []),
  ]);
};

const buildContinuityWeaknesses = (driftFindings: ReputationGovernanceDriftFinding[]): string[] =>
  unique(driftFindings.map((finding) => finding.description));

const buildResilienceIndicators = (
  input: ReputationGovernanceContinuityInput,
  strengths: string[],
): string[] => {
  const current = input.currentLineageResult;
  const previous = input.previousLineageResult;
  const contradictionReduced =
    current && previous ? current.contradictionChains.length < previous.contradictionChains.length : false;
  const stabilizationStrengthened =
    current && previous ? current.stabilizationChains.length > previous.stabilizationChains.length : false;

  return unique([
    ...(strengths.length >= 3 ? ["Multiple continuity strengths are present in the current evaluation period."] : []),
    ...(contradictionReduced ? ["Contradiction chains reduced compared with the previous lineage period."] : []),
    ...(stabilizationStrengthened ? ["Stabilization chains strengthened compared with the previous lineage period."] : []),
    ...((current?.lineageIntegrityScore ?? 0) >= 75 ? ["Current lineage integrity is in a resilient operating range."] : []),
    ...(input.trendResult && ["stable", "improving"].includes(input.trendResult.trendDirection)
      ? ["Trend context is stable or improving."]
      : []),
    ...(input.aggregationResult && ["stable", "watch"].includes(input.aggregationResult.enterpriseExposureLevel)
      ? ["Aggregation exposure is stable or watch-level."]
      : []),
  ]);
};

const buildReviewabilityAssessment = (
  input: ReputationGovernanceContinuityInput,
  driftFindings: ReputationGovernanceDriftFinding[],
): string => {
  const current = input.currentLineageResult;
  if (!current) return "Current governance lineage is not supplied, so reviewability is limited.";
  if (driftFindings.some((finding) => finding.driftType === "reviewability_decline")) {
    return "Current governance lineage remains reviewable, but weak areas or dependency gaps require human review.";
  }
  if (current.weakLineageAreas.length === 0 && current.governanceDependencyChains.length > 0) {
    return "Current governance lineage is reviewable with traceable dependency chains and no weak lineage areas supplied.";
  }
  return "Current governance lineage is partially reviewable and should be interpreted with human oversight.";
};

export function analyzeEnterpriseReputationGovernanceContinuity(
  input: ReputationGovernanceContinuityInput,
): ReputationGovernanceContinuityResult {
  const driftFindings = buildDriftFindings(input);
  const continuityStrengths = buildContinuityStrengths(input);
  const continuityWeaknesses = buildContinuityWeaknesses(driftFindings);
  const resilienceIndicators = buildResilienceIndicators(input, continuityStrengths);
  const reviewabilityAssessment = buildReviewabilityAssessment(input, driftFindings);
  const governanceContinuityScore = calculateGovernanceContinuityScore({
    input,
    driftFindings,
    continuityStrengths,
    resilienceIndicators,
  });
  const resultWithoutExplainability = {
    continuityStatus: continuityStatusFromScore(governanceContinuityScore),
    governanceContinuityScore,
    driftFindings,
    continuityStrengths,
    continuityWeaknesses,
    resilienceIndicators,
    reviewabilityAssessment,
  };

  return {
    ...resultWithoutExplainability,
    recommendations: buildGovernanceContinuityRecommendations(resultWithoutExplainability),
    explainability: buildGovernanceContinuityExplainability({ input, result: resultWithoutExplainability }),
  };
}

export const getEnterpriseReputationGovernanceContinuityIntelligence =
  analyzeEnterpriseReputationGovernanceContinuity;
