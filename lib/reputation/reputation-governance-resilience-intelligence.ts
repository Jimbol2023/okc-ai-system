import {
  buildGovernanceResilienceExplainability,
  buildGovernanceResilienceRecommendations,
} from "./reputation-governance-resilience-explainability";
import {
  calculateGovernanceResilienceScore,
  calculateResilienceFindingConfidence,
  resilienceStatusFromScore,
} from "./reputation-governance-resilience-scoring";
import type {
  ReputationArchitectureImprovementItem,
  ReputationGovernanceResilienceFinding,
  ReputationGovernanceResilienceFindingType,
  ReputationGovernanceResilienceInput,
  ReputationGovernanceResilienceResult,
} from "./reputation-governance-resilience-types";
import type { ReputationSeverity } from "./reputation-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const slug = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const governanceDomains = (input: ReputationGovernanceResilienceInput): string[] =>
  unique([
    ...(input.governanceResult?.affectedGovernanceDomains ?? []),
    ...(input.remediationResult?.affectedGovernanceDomains ?? []),
    ...(input.lineageResult?.nodes.flatMap((node) => node.relatedGovernanceDomains) ?? []),
    ...(input.continuityResult?.driftFindings.flatMap((finding) => finding.affectedGovernanceDomains) ?? []),
  ]);

const businessUnits = (input: ReputationGovernanceResilienceInput): string[] =>
  unique([
    ...(input.remediationResult?.affectedBusinessUnits ?? []),
    ...(input.lineageResult?.nodes.flatMap((node) => node.relatedBusinessUnits) ?? []),
    ...(input.continuityResult?.driftFindings.flatMap((finding) => finding.affectedBusinessUnits) ?? []),
    ...(input.aggregationResult?.exposureByBusinessUnit.map((unit) => unit.businessUnit) ?? []),
  ]);

const createFinding = (params: {
  findingType: ReputationGovernanceResilienceFindingType;
  severity: ReputationSeverity;
  description: string;
  evidence: string[];
  affectedGovernanceDomains: string[];
  affectedBusinessUnits: string[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  baseConfidence?: number;
}): ReputationGovernanceResilienceFinding => {
  const evidence = unique(params.evidence);
  const affectedGovernanceDomains = unique(params.affectedGovernanceDomains);
  const affectedBusinessUnits = unique(params.affectedBusinessUnits);
  const factors = unique(params.factors);

  return {
    id: `governance-resilience-${slug(params.findingType)}-${slug(params.description)}`,
    findingType: params.findingType,
    severity: params.severity,
    description: params.description,
    evidence,
    affectedGovernanceDomains,
    affectedBusinessUnits,
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore: calculateResilienceFindingConfidence({
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

const buildRecoveryIndicators = (input: ReputationGovernanceResilienceInput): string[] =>
  unique([
    ...(input.remediationResult && input.remediationResult.remediationReadinessScore >= 70
      ? [`Remediation readiness score is ${input.remediationResult.remediationReadinessScore}/100.`]
      : []),
    ...(input.resolutionResult && input.resolutionResult.resolutionProgressScore >= 70
      ? [`Resolution progress score is ${input.resolutionResult.resolutionProgressScore}/100.`]
      : []),
    ...(input.evidenceQualityResult && ["strong", "highly_reliable"].includes(input.evidenceQualityResult.overallReliabilityLevel)
      ? [`Evidence reliability is ${input.evidenceQualityResult.overallReliabilityLevel}.`]
      : []),
    ...(input.continuityResult && ["resilient", "anti_fragile"].includes(input.continuityResult.continuityStatus)
      ? [`Continuity status is ${input.continuityResult.continuityStatus}.`]
      : []),
    ...((input.lineageResult?.governanceDependencyChains.length ?? 0) > 0
      ? ["Governance dependency chains remain available for review."]
      : []),
  ]);

const buildFragilityIndicators = (input: ReputationGovernanceResilienceInput): string[] =>
  unique([
    ...(input.continuityResult && ["fragile", "stable"].includes(input.continuityResult.continuityStatus)
      ? [`Continuity status is ${input.continuityResult.continuityStatus}.`]
      : []),
    ...((input.continuityResult?.driftFindings.length ?? 0) > 0
      ? [`Continuity drift findings: ${input.continuityResult?.driftFindings.length}.`]
      : []),
    ...((input.lineageResult?.weakLineageAreas.length ?? 0) > 0
      ? [`Weak lineage areas: ${input.lineageResult?.weakLineageAreas.length}.`]
      : []),
    ...((input.lineageResult?.contradictionChains.length ?? 0) > 0
      ? [`Contradiction chains: ${input.lineageResult?.contradictionChains.length}.`]
      : []),
    ...(input.evidenceQualityResult && ["weak", "partial"].includes(input.evidenceQualityResult.overallReliabilityLevel)
      ? [`Evidence reliability is ${input.evidenceQualityResult.overallReliabilityLevel}.`]
      : []),
    ...(input.trendResult && ["deteriorating", "volatile"].includes(input.trendResult.trendDirection)
      ? [`Trend direction is ${input.trendResult.trendDirection}.`]
      : []),
    ...(input.aggregationResult && ["elevated", "critical"].includes(input.aggregationResult.enterpriseExposureLevel)
      ? [`Enterprise exposure level is ${input.aggregationResult.enterpriseExposureLevel}.`]
      : []),
  ]);

const buildAntiFragilityIndicators = (input: ReputationGovernanceResilienceInput): string[] => {
  const continuityStrong = input.continuityResult?.continuityStatus === "anti_fragile";
  const lineageStrong = (input.lineageResult?.lineageIntegrityScore ?? 0) >= 85;
  const noContradictions = (input.lineageResult?.contradictionChains.length ?? 0) === 0;
  const stabilizationPresent = (input.lineageResult?.stabilizationChains.length ?? 0) > 0;
  const evidenceStrong = ["strong", "highly_reliable"].includes(input.evidenceQualityResult?.overallReliabilityLevel ?? "");
  const stablePressureContext =
    (!input.trendResult || ["stable", "improving"].includes(input.trendResult.trendDirection)) &&
    (!input.aggregationResult || ["stable", "watch"].includes(input.aggregationResult.enterpriseExposureLevel));

  return unique([
    ...(continuityStrong ? ["Continuity status is anti_fragile."] : []),
    ...(lineageStrong ? [`Lineage integrity score is ${input.lineageResult?.lineageIntegrityScore}/100.`] : []),
    ...(noContradictions ? ["No current contradiction chains are supplied."] : []),
    ...(stabilizationPresent
      ? [`Stabilization chains supplied: ${input.lineageResult?.stabilizationChains.length}.`]
      : []),
    ...(evidenceStrong ? [`Evidence reliability is ${input.evidenceQualityResult?.overallReliabilityLevel}.`] : []),
    ...(stablePressureContext ? ["Trend and exposure context do not indicate elevated pressure."] : []),
  ]);
};

const buildFindings = (
  input: ReputationGovernanceResilienceInput,
  recoveryIndicators: string[],
  fragilityIndicators: string[],
  antiFragilityIndicators: string[],
): ReputationGovernanceResilienceFinding[] => {
  const findings: ReputationGovernanceResilienceFinding[] = [];
  const domains = governanceDomains(input);
  const units = businessUnits(input);
  const pressureSignals = [
    input.trendResult && ["deteriorating", "volatile"].includes(input.trendResult.trendDirection)
      ? `Trend direction: ${input.trendResult.trendDirection}.`
      : "",
    input.aggregationResult && ["elevated", "critical"].includes(input.aggregationResult.enterpriseExposureLevel)
      ? `Enterprise exposure level: ${input.aggregationResult.enterpriseExposureLevel}.`
      : "",
    input.continuityResult && ["fragile", "stable"].includes(input.continuityResult.continuityStatus)
      ? `Continuity status: ${input.continuityResult.continuityStatus}.`
      : "",
  ].filter(Boolean);

  if (pressureSignals.length >= 2 || (input.lineageResult?.lineageIntegrityScore ?? 100) < 55) {
    findings.push(
      createFinding({
        findingType: "stress_absorption_weakness",
        severity: pressureSignals.length >= 3 ? "elevated" : "moderate",
        description: "Governance stress absorption appears limited under the supplied pressure context.",
        evidence: [...pressureSignals, `Lineage integrity score: ${input.lineageResult?.lineageIntegrityScore ?? "not_supplied"}.`],
        affectedGovernanceDomains: domains,
        affectedBusinessUnits: units,
        recommendedHumanReview: "Review pressure context and lineage integrity before relying on stress absorption indicators.",
        factors: ["Stress absorption is evaluated from trend, exposure, continuity, and lineage integrity."],
        reasoning: ["Multiple pressure indicators or weak lineage integrity can reduce governance stress absorption."],
      }),
    );
  }

  if (recoveryIndicators.length < 2 || (input.resolutionResult?.resolutionProgressScore ?? 50) < 55) {
    findings.push(
      createFinding({
        findingType: "recovery_capacity_gap",
        severity: recoveryIndicators.length === 0 ? "elevated" : "moderate",
        description: "Governance recovery capacity has limited support in the supplied review context.",
        evidence: [
          `Recovery indicators: ${recoveryIndicators.length}.`,
          `Resolution progress score: ${input.resolutionResult?.resolutionProgressScore ?? "not_supplied"}.`,
          `Remediation readiness score: ${input.remediationResult?.remediationReadinessScore ?? "not_supplied"}.`,
        ],
        affectedGovernanceDomains: domains,
        affectedBusinessUnits: units,
        recommendedHumanReview: "Review remediation readiness, resolution progress, and evidence quality before interpreting recovery capacity.",
        factors: ["Recovery capacity requires adequate recovery indicators plus remediation and resolution support."],
        reasoning: ["Limited recovery indicators can weaken resilience even when governance remains reviewable."],
      }),
    );
  }

  const stabilizationChains = input.lineageResult?.stabilizationChains.length ?? 0;
  const supportedStabilizationAreas = input.evidenceQualityResult?.stabilizationSupportedAreas.length ?? 0;
  const contradictionChains = input.lineageResult?.contradictionChains.length ?? 0;

  if (stabilizationChains === 0 || contradictionChains > 0 || supportedStabilizationAreas === 0) {
    findings.push(
      createFinding({
        findingType: "stabilization_fragility",
        severity: contradictionChains >= 2 ? "elevated" : "moderate",
        description: "Stabilization resilience appears fragile in the current lineage and evidence context.",
        evidence: [
          `Stabilization chains: ${stabilizationChains}.`,
          `Evidence-supported stabilization areas: ${supportedStabilizationAreas}.`,
          `Contradiction chains: ${contradictionChains}.`,
        ],
        affectedGovernanceDomains: domains,
        affectedBusinessUnits: units,
        recommendedHumanReview: "Review stabilization chains and supporting evidence before interpreting stabilization resilience.",
        factors: ["Stabilization resilience requires traceable chains, supporting evidence, and low contradiction pressure."],
        reasoning: ["Limited stabilization support or contradiction pressure can weaken resilience under stress."],
      }),
    );
  }

  const dependencyChains = input.lineageResult?.governanceDependencyChains.length ?? 0;
  const weakLineageAreas = input.lineageResult?.weakLineageAreas.length ?? 0;
  const evidenceReliability = input.evidenceQualityResult?.overallReliabilityLevel;

  if (dependencyChains === 0 || weakLineageAreas > 0 || ["weak", "partial"].includes(evidenceReliability ?? "")) {
    findings.push(
      createFinding({
        findingType: "dependency_resilience_gap",
        severity: dependencyChains === 0 || weakLineageAreas >= 3 ? "elevated" : "moderate",
        description: "Governance dependency resilience has weak or incomplete review support.",
        evidence: [
          `Governance dependency chains: ${dependencyChains}.`,
          `Weak lineage areas: ${weakLineageAreas}.`,
          `Evidence reliability: ${evidenceReliability ?? "not_supplied"}.`,
          ...(input.lineageResult?.weakLineageAreas.slice(0, 6) ?? []),
        ],
        affectedGovernanceDomains: domains,
        affectedBusinessUnits: units,
        recommendedHumanReview: "Review dependency chains, weak lineage areas, and evidence reliability before interpreting dependency resilience.",
        factors: ["Dependency resilience requires reviewable governance chains and reliable supporting evidence."],
        reasoning: ["Weak dependencies can reduce governance durability during operational pressure."],
      }),
    );
  }

  if (input.continuityResult && ["fragile", "stable"].includes(input.continuityResult.continuityStatus)) {
    findings.push(
      createFinding({
        findingType: "continuity_pressure",
        severity: input.continuityResult.continuityStatus === "fragile" ? "critical" : "moderate",
        description: "Governance continuity remains under pressure in the supplied continuity result.",
        evidence: [
          `Continuity status: ${input.continuityResult.continuityStatus}.`,
          `Continuity score: ${input.continuityResult.governanceContinuityScore}/100.`,
          `Drift findings: ${input.continuityResult.driftFindings.length}.`,
          input.continuityResult.reviewabilityAssessment,
        ],
        affectedGovernanceDomains: domains,
        affectedBusinessUnits: units,
        recommendedHumanReview: "Review continuity pressure and drift findings before interpreting governance resilience.",
        factors: ["Continuity pressure uses continuity status, score, drift findings, and reviewability assessment."],
        reasoning: ["Governance resilience depends on continuity remaining reviewable under pressure."],
      }),
    );
  }

  if (contradictionChains > 0 && recoveryIndicators.length < 3) {
    findings.push(
      createFinding({
        findingType: "contradiction_recovery_weakness",
        severity: contradictionChains >= 3 ? "elevated" : "moderate",
        description: "Contradiction recovery appears weak relative to current recovery indicators.",
        evidence: [
          `Contradiction chains: ${contradictionChains}.`,
          `Recovery indicators: ${recoveryIndicators.length}.`,
          ...(input.lineageResult?.contradictionChains.slice(0, 6) ?? []),
        ],
        affectedGovernanceDomains: domains,
        affectedBusinessUnits: units,
        recommendedHumanReview: "Review contradiction chains and recovery indicators before interpreting resilience.",
        factors: ["Contradiction recovery requires low contradiction pressure or enough recovery support to remain reviewable."],
        reasoning: ["Persistent contradictions without adequate recovery indicators can weaken governance resilience."],
      }),
    );
  }

  if (antiFragilityIndicators.length >= 5 && fragilityIndicators.length <= 1) {
    findings.push(
      createFinding({
        findingType: "anti_fragility_indicator",
        severity: "low",
        description: "Governance resilience includes anti-fragility indicators in the supplied review context.",
        evidence: antiFragilityIndicators,
        affectedGovernanceDomains: domains,
        affectedBusinessUnits: units,
        recommendedHumanReview: "Continue human monitoring of anti-fragility indicators across future review periods.",
        factors: ["Anti-fragility requires strong continuity, lineage, evidence, stabilization, and low contradiction pressure."],
        reasoning: ["Multiple strengthening indicators can support durable governance resilience under pressure."],
        baseConfidence: 66,
      }),
    );
  }

  return findings;
};

const buildResilienceStrengths = (
  input: ReputationGovernanceResilienceInput,
  recoveryIndicators: string[],
  antiFragilityIndicators: string[],
): string[] =>
  unique([
    ...recoveryIndicators,
    ...(antiFragilityIndicators.length >= 4 ? ["Multiple anti-fragility indicators are present."] : []),
    ...(input.continuityResult?.resilienceIndicators.slice(0, 5) ?? []),
    ...((input.lineageResult?.governanceDependencyChains.length ?? 0) > 0
      ? ["Governance dependency lineage remains traceable."]
      : []),
  ]);

const buildResilienceWeaknesses = (findings: ReputationGovernanceResilienceFinding[]): string[] =>
  unique(
    findings
      .filter((finding) => finding.findingType !== "anti_fragility_indicator")
      .map((finding) => finding.description),
  );

const buildArchitectureImprovementReview = (
  input: ReputationGovernanceResilienceInput,
  findings: ReputationGovernanceResilienceFinding[],
): ReputationArchitectureImprovementItem[] => {
  const items: ReputationArchitectureImprovementItem[] = [
    {
      id: "architecture-shared-reputation-utilities",
      classification: "future_upgrade",
      area: "reusable infrastructure opportunities",
      observation: "Several reputation intelligence layers use similar deterministic helpers for uniqueness, slug generation, confidence scoring, and severity weighting.",
      recommendedHumanReview: "Consider a small shared reputation utility module after the current build sequence stabilizes.",
    },
    {
      id: "architecture-evidence-traceability-contract",
      classification: "future_upgrade",
      area: "dependency fragility",
      observation: "Evidence traceability is currently consumed through lineage outputs; a concrete traceability contract would reduce optional boundary fragility.",
      recommendedHumanReview: "Review whether evidence traceability types should be formalized before adding deeper memory or orchestration layers.",
    },
  ];

  if (!input.continuityResult || !input.lineageResult) {
    items.push({
      id: "architecture-resilience-input-completeness",
      classification: "immediate",
      area: "explainability gaps",
      observation: "Resilience review is less complete when continuity or lineage results are not supplied.",
      recommendedHumanReview: "Confirm upstream continuity and lineage outputs are passed into resilience review before relying on resilience status.",
    });
  }

  if (findings.some((finding) => finding.findingType === "dependency_resilience_gap")) {
    items.push({
      id: "architecture-dependency-resilience-review",
      classification: "future_upgrade",
      area: "resilience weaknesses",
      observation: "Dependency resilience gaps suggest future value in richer dependency-chain normalization across reputation layers.",
      recommendedHumanReview: "Review dependency-chain consistency after the strict governance build sequence is complete.",
    });
  }

  items.push({
    id: "architecture-no-orchestration-contamination",
    classification: "optional_optimization",
    area: "orchestration contamination risks",
    observation: "The resilience layer remains pure and read-only; future route or automation integrations should keep this module free of execution side effects.",
    recommendedHumanReview: "Keep resilience intelligence as a decision-support engine and gate any future execution separately through human-reviewed workflows.",
  });

  return items;
};

export function analyzeEnterpriseReputationGovernanceResilience(
  input: ReputationGovernanceResilienceInput,
): ReputationGovernanceResilienceResult {
  const recoveryIndicators = buildRecoveryIndicators(input);
  const fragilityIndicators = buildFragilityIndicators(input);
  const antiFragilityIndicators = buildAntiFragilityIndicators(input);
  const findings = buildFindings(input, recoveryIndicators, fragilityIndicators, antiFragilityIndicators);
  const resilienceStrengths = buildResilienceStrengths(input, recoveryIndicators, antiFragilityIndicators);
  const resilienceWeaknesses = buildResilienceWeaknesses(findings);
  const architectureImprovementReview = buildArchitectureImprovementReview(input, findings);
  const governanceResilienceScore = calculateGovernanceResilienceScore({
    input,
    findings,
    resilienceStrengths,
    recoveryIndicators,
    antiFragilityIndicators,
  });
  const resultWithoutExplainability = {
    resilienceStatus: resilienceStatusFromScore(governanceResilienceScore),
    governanceResilienceScore,
    findings,
    resilienceStrengths,
    resilienceWeaknesses,
    recoveryIndicators,
    fragilityIndicators,
    antiFragilityIndicators,
    architectureImprovementReview,
  };

  return {
    ...resultWithoutExplainability,
    recommendations: buildGovernanceResilienceRecommendations(resultWithoutExplainability),
    explainability: buildGovernanceResilienceExplainability({ input, result: resultWithoutExplainability }),
  };
}

export const getEnterpriseReputationGovernanceResilienceIntelligence =
  analyzeEnterpriseReputationGovernanceResilience;
