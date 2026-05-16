import {
  buildGovernanceDoctrineExplainability,
  buildGovernanceDoctrineRecommendations,
} from "./reputation-governance-doctrine-explainability";
import {
  calculateDoctrineConfidenceScore,
  calculateDoctrineDriftConfidence,
  calculateDoctrinePrincipleConfidence,
  doctrineStatusFromScore,
} from "./reputation-governance-doctrine-scoring";
import type {
  ReputationGovernanceDoctrineDriftFinding,
  ReputationGovernanceDoctrineDriftType,
  ReputationGovernanceDoctrineInput,
  ReputationGovernanceDoctrinePrinciple,
  ReputationGovernanceDoctrinePrincipleType,
  ReputationGovernanceDoctrineResult,
} from "./reputation-governance-doctrine-types";
import type { ReputationArchitectureImprovementItem } from "./reputation-governance-resilience-types";
import type { ReputationSeverity } from "./reputation-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const normalize = (value: string): string => value.trim().toLowerCase();

const slug = (value: string): string =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const includesAny = (value: string, terms: string[]): boolean => {
  const normalized = normalize(value);
  return terms.some((term) => normalized.includes(term));
};

const domainsFromInput = (input: ReputationGovernanceDoctrineInput): string[] =>
  unique([
    ...(input.governanceResult?.affectedGovernanceDomains ?? []),
    ...(input.remediationResult?.affectedGovernanceDomains ?? []),
    ...(input.lineageResult?.nodes.flatMap((node) => node.relatedGovernanceDomains) ?? []),
    ...(input.memoryResult?.recurringPatterns.flatMap((pattern) => pattern.affectedGovernanceDomains) ?? []),
    ...(input.resilienceResult?.findings.flatMap((finding) => finding.affectedGovernanceDomains) ?? []),
  ]);

const recurringPatternDescriptions = (input: ReputationGovernanceDoctrineInput, terms: string[]): string[] =>
  unique([
    ...(input.memoryResult?.recurringPatterns
      .filter((pattern) => includesAny(`${pattern.patternType} ${pattern.description}`, terms))
      .map((pattern) => `${pattern.patternType}: ${pattern.description}`) ?? []),
    ...(input.memoryResult?.governanceLessons.filter((lesson) => includesAny(lesson, terms)) ?? []),
    ...(input.memoryResult?.longHorizonContext.filter((context) => includesAny(context, terms)) ?? []),
  ]);

const doctrineLimitationsForContext = (input: ReputationGovernanceDoctrineInput): string[] =>
  unique([
    ...(!input.memoryResult ? ["Governance memory result was not supplied."] : []),
    ...(!input.resilienceResult ? ["Governance resilience result was not supplied."] : []),
    ...(!input.continuityResult ? ["Governance continuity result was not supplied."] : []),
    ...(!input.lineageResult ? ["Governance lineage result was not supplied."] : []),
    ...(!input.evidenceQualityResult ? ["Evidence quality result was not supplied."] : []),
    ...(input.evidenceQualityResult && ["weak", "partial"].includes(input.evidenceQualityResult.overallReliabilityLevel)
      ? [`Evidence reliability is ${input.evidenceQualityResult.overallReliabilityLevel}.`]
      : []),
    ...((input.lineageResult?.weakLineageAreas.length ?? 0) > 0
      ? [`Weak lineage areas: ${input.lineageResult?.weakLineageAreas.length}.`]
      : []),
    ...((input.lineageResult?.contradictionChains.length ?? 0) > 0
      ? [`Contradiction chains: ${input.lineageResult?.contradictionChains.length}.`]
      : []),
  ]);

const createPrinciple = (params: {
  principleType: ReputationGovernanceDoctrinePrincipleType;
  title: string;
  description: string;
  supportingEvidence: string[];
  recurringPatterns: string[];
  affectedGovernanceDomains: string[];
  limitations: string[];
  factors: string[];
  reasoning: string[];
  baseConfidence?: number;
}): ReputationGovernanceDoctrinePrinciple => {
  const supportingEvidence = unique(params.supportingEvidence);
  const recurringPatterns = unique(params.recurringPatterns);
  const affectedGovernanceDomains = unique(params.affectedGovernanceDomains);
  const limitations = unique(params.limitations);
  const factors = unique(params.factors);

  return {
    id: `governance-doctrine-${slug(params.principleType)}`,
    principleType: params.principleType,
    title: params.title,
    description: params.description,
    supportingEvidence,
    recurringPatterns,
    affectedGovernanceDomains,
    confidenceScore: calculateDoctrinePrincipleConfidence({
      supportingEvidenceCount: supportingEvidence.length,
      recurringPatternCount: recurringPatterns.length,
      affectedGovernanceDomainCount: affectedGovernanceDomains.length,
      limitationCount: limitations.length,
      factorCount: factors.length,
      baseConfidence: params.baseConfidence,
    }),
    limitations,
    explainability: {
      factors,
      reasoning: params.reasoning,
    },
  };
};

const buildPrinciples = (input: ReputationGovernanceDoctrineInput): ReputationGovernanceDoctrinePrinciple[] => {
  const domains = domainsFromInput(input);
  const contextLimitations = doctrineLimitationsForContext(input);
  const principles: ReputationGovernanceDoctrinePrinciple[] = [];
  const stabilizationEvidence = unique([
    ...(input.lineageResult?.stabilizationChains ?? []),
    ...(input.evidenceQualityResult?.stabilizationSupportedAreas.map(
      (area) => `Evidence supports stabilization area: ${area}.`,
    ) ?? []),
    ...(input.resolutionResult?.stabilizedAreas.map((area) => `Resolution stabilized area: ${area}.`) ?? []),
    ...(input.resilienceResult?.resilienceStrengths.filter((item) => includesAny(item, ["stabil"])) ?? []),
  ]);
  const stabilizationPatterns = recurringPatternDescriptions(input, ["stabilization", "stabilized", "stable"]);

  if (stabilizationEvidence.length > 0 || stabilizationPatterns.length > 0) {
    principles.push(
      createPrinciple({
        principleType: "stabilization_first",
        title: "Stabilization-first governance",
        description: "Prioritize reviewable stabilization signals when interpreting governance health across evaluation periods.",
        supportingEvidence: stabilizationEvidence,
        recurringPatterns: stabilizationPatterns,
        affectedGovernanceDomains: domains,
        limitations: contextLimitations.filter((limitation) => includesAny(limitation, ["evidence", "lineage", "contradiction"])),
        factors: [
          `Stabilization evidence count: ${stabilizationEvidence.length}.`,
          `Recurring stabilization pattern count: ${stabilizationPatterns.length}.`,
        ],
        reasoning: ["Stabilization-first doctrine is formed only when stabilization indicators or recurring stabilization patterns are supplied."],
        baseConfidence: 58,
      }),
    );
  }

  const continuityEvidence = unique([
    ...(input.continuityResult?.continuityStrengths ?? []),
    ...(input.continuityResult?.resilienceIndicators ?? []),
    ...(input.memoryResult?.continuityLearningIndicators ?? []),
    ...(input.memoryResult?.recurringPatterns
      .filter((pattern) => pattern.patternType === "continuity_preservation_indicator")
      .flatMap((pattern) => pattern.evidence) ?? []),
  ]);
  const continuityPatterns = recurringPatternDescriptions(input, ["continuity", "preservation", "durable"]);

  if (continuityEvidence.length > 0 || continuityPatterns.length > 0 || input.continuityResult) {
    principles.push(
      createPrinciple({
        principleType: "continuity_preservation",
        title: "Continuity preservation",
        description: "Preserve governance continuity by keeping review context, drift visibility, and durability indicators traceable.",
        supportingEvidence: continuityEvidence,
        recurringPatterns: continuityPatterns,
        affectedGovernanceDomains: domains,
        limitations: contextLimitations.filter((limitation) => includesAny(limitation, ["continuity", "memory", "lineage"])),
        factors: [
          `Continuity status: ${input.continuityResult?.continuityStatus ?? "not_supplied"}.`,
          `Continuity evidence count: ${continuityEvidence.length}.`,
        ],
        reasoning: ["Continuity doctrine is derived from supplied continuity status, memory learning indicators, and recurring preservation patterns."],
        baseConfidence: 56,
      }),
    );
  }

  const remediationEvidence = unique([
    ...(input.remediationResult?.planItems.flatMap((item) => item.supportingEvidence) ?? []),
    ...(input.evidenceQualityResult?.findings
      .filter((finding) => finding.findingType === "evidence_supports_stabilization")
      .flatMap((finding) => finding.supportingEvidence) ?? []),
    ...(input.memoryResult?.governanceLessons.filter((lesson) => includesAny(lesson, ["evidence", "trust"])) ?? []),
  ]);
  const remediationPatterns = recurringPatternDescriptions(input, ["evidence", "remediation", "trust"]);

  if (remediationEvidence.length > 0 || remediationPatterns.length > 0 || input.remediationResult) {
    principles.push(
      createPrinciple({
        principleType: "evidence_supported_remediation",
        title: "Evidence-supported remediation",
        description: "Treat remediation planning as stronger when supporting evidence remains traceable, reviewable, and current.",
        supportingEvidence: remediationEvidence,
        recurringPatterns: remediationPatterns,
        affectedGovernanceDomains: domains,
        limitations: contextLimitations.filter((limitation) => includesAny(limitation, ["evidence", "trace", "lineage"])),
        factors: [
          `Remediation plan items: ${input.remediationResult?.planItems.length ?? 0}.`,
          `Evidence reliability: ${input.evidenceQualityResult?.overallReliabilityLevel ?? "not_supplied"}.`,
        ],
        reasoning: ["Evidence-supported remediation doctrine is formed from remediation evidence, evidence quality, and memory lessons about evidence reliability."],
        baseConfidence: 56,
      }),
    );
  }

  const reviewabilityEvidence = unique([
    input.continuityResult?.reviewabilityAssessment,
    ...(input.lineageResult?.governanceDependencyChains ?? []),
    ...(input.lineageResult?.explainability.lineageRulesApplied ?? []),
    ...(input.memoryResult?.longHorizonContext ?? []),
  ].filter((item): item is string => typeof item === "string"));
  const reviewabilityPatterns = recurringPatternDescriptions(input, ["review", "trace", "lineage", "explain"]);

  if (reviewabilityEvidence.length > 0 || reviewabilityPatterns.length > 0 || input.lineageResult) {
    principles.push(
      createPrinciple({
        principleType: "reviewability_preservation",
        title: "Reviewability preservation",
        description: "Preserve human reviewability by keeping governance reasoning, lineage, limitations, and major drivers visible.",
        supportingEvidence: reviewabilityEvidence,
        recurringPatterns: reviewabilityPatterns,
        affectedGovernanceDomains: domains,
        limitations: contextLimitations.filter((limitation) => includesAny(limitation, ["lineage", "continuity", "memory"])),
        factors: [
          `Governance dependency chains: ${input.lineageResult?.governanceDependencyChains.length ?? 0}.`,
          `Weak lineage areas: ${input.lineageResult?.weakLineageAreas.length ?? 0}.`,
        ],
        reasoning: ["Reviewability doctrine is derived from lineage dependency chains, continuity reviewability assessment, and explainable long-horizon memory context."],
        baseConfidence: 58,
      }),
    );
  }

  const dependencyEvidence = unique([
    ...(input.lineageResult?.governanceDependencyChains ?? []),
    ...(input.resilienceResult?.recoveryIndicators.filter((indicator) => includesAny(indicator, ["dependency", "lineage"])) ?? []),
    ...(input.resilienceResult?.resilienceStrengths.filter((strength) => includesAny(strength, ["dependency", "lineage"])) ?? []),
  ]);
  const dependencyPatterns = recurringPatternDescriptions(input, ["dependency", "lineage", "traceable"]);

  if (dependencyEvidence.length > 0 || dependencyPatterns.length > 0) {
    principles.push(
      createPrinciple({
        principleType: "dependency_resilience",
        title: "Dependency resilience",
        description: "Maintain traceable governance dependency chains so resilience remains reviewable under operational pressure.",
        supportingEvidence: dependencyEvidence,
        recurringPatterns: dependencyPatterns,
        affectedGovernanceDomains: domains,
        limitations: contextLimitations.filter((limitation) => includesAny(limitation, ["lineage", "dependency", "evidence"])),
        factors: [
          `Dependency chains: ${input.lineageResult?.governanceDependencyChains.length ?? 0}.`,
          `Memory dependency patterns: ${dependencyPatterns.length}.`,
        ],
        reasoning: ["Dependency resilience doctrine is formed from lineage dependency chains and recurring dependency memory context."],
        baseConfidence: 56,
      }),
    );
  }

  const antiFragilityEvidence = unique([
    ...(input.resilienceResult?.antiFragilityIndicators ?? []),
    ...(input.memoryResult?.resilienceLearningIndicators.filter((indicator) => includesAny(indicator, ["anti-fragility", "anti_fragility"])) ?? []),
    ...(input.memoryResult?.recurringPatterns
      .filter((pattern) => pattern.patternType === "anti_fragility_evolution")
      .flatMap((pattern) => pattern.evidence) ?? []),
  ]);
  const antiFragilityPatterns = recurringPatternDescriptions(input, ["anti-fragility", "anti_fragility", "learning"]);

  if (antiFragilityEvidence.length > 0 || antiFragilityPatterns.length > 0) {
    principles.push(
      createPrinciple({
        principleType: "anti_fragility_learning",
        title: "Anti-fragility learning",
        description: "Use recurring anti-fragility indicators as neutral learning context when they remain evidence-supported and explainable.",
        supportingEvidence: antiFragilityEvidence,
        recurringPatterns: antiFragilityPatterns,
        affectedGovernanceDomains: domains,
        limitations: contextLimitations.filter((limitation) => includesAny(limitation, ["memory", "evidence", "lineage"])),
        factors: [
          `Anti-fragility indicator count: ${input.resilienceResult?.antiFragilityIndicators.length ?? 0}.`,
          `Anti-fragility pattern count: ${antiFragilityPatterns.length}.`,
        ],
        reasoning: ["Anti-fragility doctrine is formed from supplied resilience indicators and memory patterns that show strengthening over time."],
        baseConfidence: 60,
      }),
    );
  }

  const humanReviewEvidence = unique([
    ...(input.governanceResult?.recommendations ?? []),
    ...(input.remediationResult?.recommendations ?? []),
    ...(input.resolutionResult?.recommendations ?? []),
    ...(input.evidenceQualityResult?.recommendations ?? []),
    ...(input.memoryResult?.recommendations ?? []),
    ...(input.resilienceResult?.recommendations ?? []),
    ...(input.continuityResult?.recommendations ?? []),
  ]).filter((item) => includesAny(item, ["human", "review", "read-only", "decision support"]));
  const humanReviewPatterns = recurringPatternDescriptions(input, ["human", "review", "discipline"]);

  principles.push(
    createPrinciple({
      principleType: "human_reviewed_governance",
      title: "Human-reviewed governance discipline",
      description: "Keep governance doctrine as neutral decision support that requires human review before operational interpretation.",
      supportingEvidence: humanReviewEvidence,
      recurringPatterns: humanReviewPatterns,
      affectedGovernanceDomains: domains,
      limitations: contextLimitations,
      factors: [
        `Human-review recommendation count: ${humanReviewEvidence.length}.`,
        `Context limitation count: ${contextLimitations.length}.`,
      ],
      reasoning: ["Human-reviewed governance doctrine is always included to preserve the read-only, non-enforcement boundary of this intelligence layer."],
      baseConfidence: 54,
    }),
  );

  return principles;
};

const createDriftFinding = (params: {
  driftType: ReputationGovernanceDoctrineDriftType;
  severity: ReputationSeverity;
  description: string;
  evidence: string[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  baseConfidence?: number;
}): ReputationGovernanceDoctrineDriftFinding => {
  const evidence = unique(params.evidence);
  const factors = unique(params.factors);

  return {
    id: `governance-doctrine-drift-${slug(params.driftType)}-${slug(params.description)}`,
    driftType: params.driftType,
    severity: params.severity,
    description: params.description,
    evidence,
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore: calculateDoctrineDriftConfidence({
      evidenceCount: evidence.length,
      factorCount: factors.length,
      baseConfidence: params.baseConfidence,
    }),
    explainability: {
      factors,
      reasoning: params.reasoning,
    },
  };
};

const buildDriftFindings = (
  input: ReputationGovernanceDoctrineInput,
  principles: ReputationGovernanceDoctrinePrinciple[],
): ReputationGovernanceDoctrineDriftFinding[] => {
  const findings: ReputationGovernanceDoctrineDriftFinding[] = [];
  const unsupportedPrinciples = principles.filter(
    (principle) => principle.supportingEvidence.length === 0 || principle.confidenceScore < 45,
  );

  if (unsupportedPrinciples.length > 0) {
    findings.push(
      createDriftFinding({
        driftType: "unsupported_principle",
        severity: unsupportedPrinciples.length >= 3 ? "elevated" : "moderate",
        description: "Some doctrine principles have limited support in the supplied governance context.",
        evidence: unsupportedPrinciples.map(
          (principle) => `${principle.title}: confidence ${principle.confidenceScore}/100.`,
        ),
        recommendedHumanReview: "Review low-support doctrine principles before treating them as durable institutional guidance.",
        factors: [`Unsupported principle count: ${unsupportedPrinciples.length}.`],
        reasoning: ["Doctrine principles require traceable evidence or recurring patterns to remain reviewable."],
      }),
    );
  }

  if (!input.continuityResult || input.continuityResult.continuityStatus === "fragile") {
    findings.push(
      createDriftFinding({
        driftType: "continuity_context_gap",
        severity: !input.continuityResult ? "elevated" : "moderate",
        description: "Doctrine formation has limited continuity context.",
        evidence: [
          `Continuity result: ${input.continuityResult ? "supplied" : "not_supplied"}.`,
          `Continuity status: ${input.continuityResult?.continuityStatus ?? "not_supplied"}.`,
        ],
        recommendedHumanReview: "Supply or review continuity context before relying on doctrine confidence.",
        factors: ["Continuity context is required for durable doctrine formation."],
        reasoning: ["Doctrine confidence is weaker when continuity status, drift findings, or reviewability context are missing or fragile."],
      }),
    );
  }

  if (!input.lineageResult || input.lineageResult.lineageIntegrityScore < 55 || input.lineageResult.weakLineageAreas.length > 0) {
    findings.push(
      createDriftFinding({
        driftType: "lineage_context_gap",
        severity: !input.lineageResult || (input.lineageResult?.lineageIntegrityScore ?? 0) < 45 ? "elevated" : "moderate",
        description: "Doctrine formation has limited lineage integrity or weak lineage context.",
        evidence: [
          `Lineage result: ${input.lineageResult ? "supplied" : "not_supplied"}.`,
          `Lineage integrity score: ${input.lineageResult?.lineageIntegrityScore ?? "not_supplied"}.`,
          `Weak lineage areas: ${input.lineageResult?.weakLineageAreas.length ?? "not_supplied"}.`,
        ],
        recommendedHumanReview: "Review lineage integrity and weak lineage areas before treating doctrine as reliable.",
        factors: ["Lineage context is required for traceable and explainable doctrine formation."],
        reasoning: ["Weak lineage reduces doctrine traceability and can create unsupported principle formation."],
      }),
    );
  }

  if (
    !input.evidenceQualityResult ||
    ["weak", "partial"].includes(input.evidenceQualityResult.overallReliabilityLevel) ||
    input.evidenceQualityResult.missingEvidenceAreas.length > 0
  ) {
    findings.push(
      createDriftFinding({
        driftType: "evidence_support_gap",
        severity:
          !input.evidenceQualityResult || input.evidenceQualityResult.overallReliabilityLevel === "weak"
            ? "elevated"
            : "moderate",
        description: "Doctrine formation has evidence support limitations.",
        evidence: [
          `Evidence quality result: ${input.evidenceQualityResult ? "supplied" : "not_supplied"}.`,
          `Evidence reliability: ${input.evidenceQualityResult?.overallReliabilityLevel ?? "not_supplied"}.`,
          `Missing evidence areas: ${input.evidenceQualityResult?.missingEvidenceAreas.length ?? "not_supplied"}.`,
          ...(input.evidenceQualityResult?.missingEvidenceAreas.slice(0, 6) ?? []),
        ],
        recommendedHumanReview: "Review evidence support and traceability before relying on doctrine principles.",
        factors: ["Evidence support is required for reliable institutional doctrine formation."],
        reasoning: ["Doctrine principles are less durable when evidence reliability is weak, partial, missing, or not supplied."],
      }),
    );
  }

  const contradictionEvidence = unique([
    ...(input.lineageResult?.contradictionChains ?? []),
    ...(input.evidenceQualityResult?.contradictionAreas.map((area) => `Evidence contradiction area: ${area}.`) ?? []),
    ...(input.memoryResult?.recurringPatterns
      .filter((pattern) => pattern.patternType === "recurring_contradiction_chain")
      .flatMap((pattern) => pattern.evidence) ?? []),
  ]);

  if (contradictionEvidence.length > 0) {
    findings.push(
      createDriftFinding({
        driftType: "contradictory_governance_pattern",
        severity: contradictionEvidence.length >= 3 ? "elevated" : "moderate",
        description: "Contradictory governance patterns are present in the supplied doctrine context.",
        evidence: contradictionEvidence.slice(0, 8),
        recommendedHumanReview: "Review contradiction context before interpreting doctrine as stable or durable.",
        factors: [`Contradiction evidence count: ${contradictionEvidence.length}.`],
        reasoning: ["Contradictory patterns can fragment doctrine formation unless they are reviewed with evidence and lineage context."],
      }),
    );
  }

  const lowConfidencePrinciples = principles.filter((principle) => principle.confidenceScore < 55);
  const broadLimitations = principles.reduce((total, principle) => total + principle.limitations.length, 0);

  if (lowConfidencePrinciples.length >= 2 || broadLimitations >= 8) {
    findings.push(
      createDriftFinding({
        driftType: "doctrine_inconsistency",
        severity: lowConfidencePrinciples.length >= 4 || broadLimitations >= 12 ? "elevated" : "moderate",
        description: "Doctrine consistency appears limited by uneven principle confidence or broad limitations.",
        evidence: [
          `Low-confidence principles: ${lowConfidencePrinciples.length}.`,
          `Total doctrine limitations: ${broadLimitations}.`,
          ...lowConfidencePrinciples.map((principle) => `${principle.title}: ${principle.confidenceScore}/100.`),
        ],
        recommendedHumanReview: "Review doctrine consistency before using principles as institutional guidance.",
        factors: ["Doctrine consistency is evaluated from principle confidence and limitation volume."],
        reasoning: ["Uneven principle support can indicate doctrine fragmentation or unstable governance philosophy."],
      }),
    );
  }

  return findings;
};

const buildGovernancePhilosophyIndicators = (
  input: ReputationGovernanceDoctrineInput,
  principles: ReputationGovernanceDoctrinePrinciple[],
): string[] =>
  unique([
    ...principles.map((principle) => `${principle.title}: ${principle.confidenceScore}/100.`),
    ...(input.memoryResult?.governanceLessons.slice(0, 8) ?? []),
    ...(input.resilienceResult?.antiFragilityIndicators.slice(0, 5) ?? []),
    ...(input.continuityResult?.resilienceIndicators.slice(0, 5) ?? []),
  ]);

const buildDurablePatterns = (input: ReputationGovernanceDoctrineInput): string[] =>
  unique([
    ...(input.memoryResult?.recurringPatterns
      .filter((pattern) => pattern.confidenceScore >= 65)
      .map((pattern) => `${pattern.patternType}: ${pattern.description}`) ?? []),
    ...(input.memoryResult?.longHorizonContext.slice(0, 8) ?? []),
    ...(input.lineageResult?.stabilizationChains.slice(0, 6) ?? []),
    ...(input.resilienceResult?.resilienceStrengths.slice(0, 6) ?? []),
  ]);

const buildDoctrineLimitations = (
  input: ReputationGovernanceDoctrineInput,
  principles: ReputationGovernanceDoctrinePrinciple[],
  driftFindings: ReputationGovernanceDoctrineDriftFinding[],
): string[] =>
  unique([
    ...doctrineLimitationsForContext(input),
    ...principles.flatMap((principle) => principle.limitations),
    ...driftFindings.map((finding) => finding.description),
    "Doctrine principles are neutral institutional guidance for human review, not policy enforcement or automation.",
    "Formal evidence traceability contract remains recommended before doctrine is connected to deeper memory, storage, or orchestration-adjacent layers.",
  ]);

const buildArchitectureImprovementReview = (
  input: ReputationGovernanceDoctrineInput,
  driftFindings: ReputationGovernanceDoctrineDriftFinding[],
): ReputationArchitectureImprovementItem[] => {
  const items: ReputationArchitectureImprovementItem[] = [
    {
      id: "architecture-doctrine-input-completeness",
      classification: !input.continuityResult || !input.lineageResult ? "immediate" : "optional_optimization",
      area: "explainability gaps",
      observation: "Doctrine confidence is stronger when memory, resilience, continuity, lineage, and evidence quality results are supplied together.",
      recommendedHumanReview: "Confirm continuity and lineage results are included before relying on doctrine status.",
    },
    {
      id: "architecture-shared-reputation-utilities",
      classification: "future_upgrade",
      area: "reusable infrastructure opportunities",
      observation: "Doctrine repeats small deterministic helpers already used by lineage, continuity, resilience, and memory modules.",
      recommendedHumanReview: "Consider a narrow shared reputation utility module after the strict governance build sequence stabilizes.",
    },
    {
      id: "architecture-evidence-traceability-contract",
      classification: "future_upgrade",
      area: "dependency fragility",
      observation: "Doctrine formation depends on traceable evidence, but a concrete evidence traceability contract has not been formalized in this workspace.",
      recommendedHumanReview: "Review a formal evidence traceability type contract before connecting doctrine to deeper memory, storage, or orchestration-adjacent layers.",
    },
    {
      id: "architecture-read-only-doctrine-boundary",
      classification: "optional_optimization",
      area: "orchestration contamination risks",
      observation: "Doctrine intelligence remains a pure read-only engine and is isolated from routes, UI, storage, automation, messaging, and orchestration.",
      recommendedHumanReview: "Keep any future doctrine adoption, storage, or automation workflows separated behind explicit human-reviewed approval.",
    },
  ];

  if (driftFindings.some((finding) => finding.driftType === "unsupported_principle")) {
    items.push({
      id: "architecture-doctrine-principle-support",
      classification: "future_upgrade",
      area: "enterprise durability improvements",
      observation: "Unsupported principle drift suggests future value in richer principle-to-evidence traceability normalization.",
      recommendedHumanReview: "Review principle support and evidence normalization after the current doctrine layer is validated.",
    });
  }

  return items;
};

export function analyzeEnterpriseReputationGovernanceDoctrine(
  input: ReputationGovernanceDoctrineInput,
): ReputationGovernanceDoctrineResult {
  const principles = buildPrinciples(input);
  const driftFindings = buildDriftFindings(input, principles);
  const governancePhilosophyIndicators = buildGovernancePhilosophyIndicators(input, principles);
  const durablePatterns = buildDurablePatterns(input);
  const doctrineLimitations = buildDoctrineLimitations(input, principles, driftFindings);
  const architectureImprovementReview = buildArchitectureImprovementReview(input, driftFindings);
  const doctrineConfidenceScore = calculateDoctrineConfidenceScore({
    input,
    principles,
    driftFindings,
    durablePatterns,
    governancePhilosophyIndicators,
  });
  const resultWithoutExplainability = {
    doctrineConfidenceScore,
    doctrineStatus: doctrineStatusFromScore(doctrineConfidenceScore),
    principles,
    driftFindings,
    governancePhilosophyIndicators,
    durablePatterns,
    doctrineLimitations,
    architectureImprovementReview,
  };

  return {
    ...resultWithoutExplainability,
    recommendations: buildGovernanceDoctrineRecommendations(resultWithoutExplainability),
    explainability: buildGovernanceDoctrineExplainability({ input, result: resultWithoutExplainability }),
  };
}

export const getEnterpriseReputationGovernanceDoctrineIntelligence =
  analyzeEnterpriseReputationGovernanceDoctrine;
