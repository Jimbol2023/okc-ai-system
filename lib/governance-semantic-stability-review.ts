import { buildGovernanceSemanticStabilityExplainability } from "./governance-semantic-stability-review-explainability";
import {
  calculateOverallSemanticStabilityScore,
  calculateSemanticDomainScore,
  calculateSemanticFindingConfidence,
  semanticStabilityClassificationFromScore,
} from "./governance-semantic-stability-review-scoring";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
} from "./full-system-governance-audit-types";
import type {
  GovernanceSemanticDomainAssessment,
  GovernanceSemanticStabilityDomain,
  GovernanceSemanticStabilityFinding,
  GovernanceSemanticStabilityFindingType,
  GovernanceSemanticStabilityInput,
  GovernanceSemanticStabilityResult,
  GovernanceSemanticTermObservation,
} from "./governance-semantic-stability-review-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const normalize = (value: string): string => value.trim().toLowerCase();

const slug = (value: string): string =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const semanticDomains: GovernanceSemanticStabilityDomain[] = [
  "governance_terminology",
  "audit_categories",
  "evidence_categories",
  "scoring_drivers",
  "doctrine_principles",
  "recommendation_language",
  "limitation_language",
  "traceability_language",
  "readiness_classifications",
  "assurance_classifications",
  "resilience_classifications",
  "registry_readiness_classifications",
  "normalization_classifications",
];

const getAuditFindings = (input: GovernanceSemanticStabilityInput): FullSystemGovernanceAuditFinding[] =>
  input.auditFindings ?? input.auditResult?.findings ?? [];

const getRecommendations = (input: GovernanceSemanticStabilityInput): FullSystemGovernanceAuditRecommendation[] =>
  input.recommendations ?? input.auditResult?.recommendations ?? [];

const observe = (params: {
  term: string | undefined;
  domain: GovernanceSemanticStabilityDomain;
  sourceModule: string;
  evidence: string;
}): GovernanceSemanticTermObservation[] =>
  params.term
    ? [
        {
          term: params.term,
          normalizedTerm: normalize(params.term),
          domain: params.domain,
          sourceModule: params.sourceModule,
          evidence: params.evidence,
        },
      ]
    : [];

const observeMany = (params: {
  terms: string[];
  domain: GovernanceSemanticStabilityDomain;
  sourceModule: string;
  evidencePrefix: string;
}): GovernanceSemanticTermObservation[] =>
  unique(params.terms).flatMap((term) =>
    observe({
      term,
      domain: params.domain,
      sourceModule: params.sourceModule,
      evidence: `${params.evidencePrefix}: ${term}.`,
    }),
  );

const collectSemanticObservations = (input: GovernanceSemanticStabilityInput): GovernanceSemanticTermObservation[] => {
  const doctrinePrinciples = input.doctrinePrinciples ?? input.doctrineResult?.principles ?? [];
  const auditFindings = getAuditFindings(input);
  const auditRecommendations = getRecommendations(input);
  const mappings = input.normalizationResult?.mappings ?? [];
  const traces = input.traceabilityResult?.traces ?? [];

  return [
    ...observeMany({
      terms: [
        ...(input.registryReviewResult?.governanceVocabularyFindings ?? []),
        ...(input.registryReviewResult?.semanticStabilityFindings ?? []),
        ...(input.doctrineResult?.governancePhilosophyIndicators ?? []),
      ],
      domain: "governance_terminology",
      sourceModule: "governance-semantic-context",
      evidencePrefix: "Governance vocabulary",
    }),
    ...observeMany({
      terms: unique([
        ...auditFindings.map((finding) => finding.category),
        ...auditRecommendations.map((recommendation) => recommendation.category),
        ...Object.keys(input.auditResult?.categoryScores ?? {}),
        ...mappings.flatMap((mapping) => mapping.auditCategories),
        ...traces.map((trace) => trace.auditCategory),
      ]) as FullSystemGovernanceAuditCategory[],
      domain: "audit_categories",
      sourceModule: "full-system-governance-audit",
      evidencePrefix: "Audit category",
    }),
    ...observeMany({
      terms: unique([
        ...(input.evidenceQualityResult?.findings.map((finding) => finding.findingType) ?? []),
        ...(input.evidenceQualityResult ? [input.evidenceQualityResult.overallReliabilityLevel] : []),
        ...traces.map((trace) => trace.evidenceType),
      ]),
      domain: "evidence_categories",
      sourceModule: "evidence-quality-and-traceability",
      evidencePrefix: "Evidence semantic term",
    }),
    ...observeMany({
      terms: unique([
        ...traces.map((trace) => trace.scoringDriver),
        ...mappings.flatMap((mapping) => mapping.scoringDrivers),
        ...(input.auditResult?.explainability.majorDrivers ?? []),
        ...(input.readinessResult?.readinessDrivers ?? []),
      ]),
      domain: "scoring_drivers",
      sourceModule: "governance-scoring-context",
      evidencePrefix: "Scoring driver",
    }),
    ...observeMany({
      terms: unique([
        ...doctrinePrinciples.flatMap((principle) => [principle.principleType, principle.title, principle.description]),
        ...mappings.flatMap((mapping) => [mapping.principleType, mapping.principleLabel]),
      ]),
      domain: "doctrine_principles",
      sourceModule: "governance-doctrine-and-normalization",
      evidencePrefix: "Doctrine principle",
    }),
    ...observeMany({
      terms: unique([
        ...auditRecommendations.flatMap((recommendation) => [recommendation.recommendation, recommendation.rationale]),
        ...(input.doctrineResult?.recommendations ?? []),
        ...(input.readinessResult?.recommendations ?? []),
        ...(input.assuranceResult?.recommendations ?? []),
        ...(input.alignmentResult?.recommendations ?? []),
        ...(input.resilienceResult?.recommendations ?? []),
        ...(input.continuityResult?.recommendations ?? []),
        ...(input.evidenceQualityResult?.recommendations ?? []),
      ]),
      domain: "recommendation_language",
      sourceModule: "governance-recommendations",
      evidencePrefix: "Recommendation language",
    }),
    ...observeMany({
      terms: unique([
        ...(input.auditResult?.limitations ?? []),
        ...(input.doctrineResult?.doctrineLimitations ?? []),
        ...(input.readinessResult?.limitations ?? []),
        ...(input.assuranceResult?.explainability.limitations ?? []),
        ...(input.alignmentResult?.explainability.limitations ?? []),
        ...(input.resilienceResult?.explainability.limitations ?? []),
        ...(input.continuityResult?.explainability.limitations ?? []),
        ...(input.evidenceQualityResult?.explainability.limitations ?? []),
        ...mappings.flatMap((mapping) => mapping.limitations),
        ...traces.map((trace) => trace.limitation),
      ]),
      domain: "limitation_language",
      sourceModule: "governance-limitations",
      evidencePrefix: "Limitation language",
    }),
    ...observeMany({
      terms: unique([
        ...(input.traceabilityResult ? [input.traceabilityResult.traceabilityClassification] : []),
        ...(input.traceabilityResult?.traceStrengths ?? []),
        ...(input.traceabilityResult?.traceWeaknesses ?? []),
        ...(input.traceabilityResult?.gaps.map((gap) => gap.gapType) ?? []),
        ...traces.map((trace) => trace.traceStrength),
      ]),
      domain: "traceability_language",
      sourceModule: "governance-evidence-traceability",
      evidencePrefix: "Traceability term",
    }),
    ...observeMany({
      terms: unique([
        ...(input.readinessResult ? [input.readinessResult.readinessClassification] : []),
        ...(input.readinessResult?.findings.map((finding) => finding.readinessArea) ?? []),
        ...(input.readinessResult?.findings.map((finding) => finding.classification) ?? []),
      ]),
      domain: "readiness_classifications",
      sourceModule: "governance-readiness",
      evidencePrefix: "Readiness classification",
    }),
    ...observeMany({
      terms: unique([
        ...(input.assuranceResult ? [input.assuranceResult.overallAssuranceStatus] : []),
        ...(input.assuranceResult?.findings.map((finding) => finding.assuranceType) ?? []),
        ...(input.assuranceResult?.findings.map((finding) => finding.status) ?? []),
      ]),
      domain: "assurance_classifications",
      sourceModule: "governance-assurance",
      evidencePrefix: "Assurance classification",
    }),
    ...observeMany({
      terms: unique([
        ...(input.resilienceResult ? [input.resilienceResult.resilienceStatus] : []),
        ...(input.continuityResult ? [input.continuityResult.continuityStatus] : []),
        ...(input.resilienceResult?.findings.map((finding) => finding.findingType) ?? []),
        ...(input.continuityResult?.driftFindings.map((finding) => finding.driftType) ?? []),
      ]),
      domain: "resilience_classifications",
      sourceModule: "governance-resilience-continuity",
      evidencePrefix: "Resilience and continuity classification",
    }),
    ...observeMany({
      terms: unique([
        ...(input.registryReviewResult ? [input.registryReviewResult.registryReadinessClassification] : []),
        ...(input.registryReviewResult?.readinessAreas.map((area) => area.areaType) ?? []),
        ...(input.registryReviewResult?.readinessAreas.map((area) => area.status) ?? []),
      ]),
      domain: "registry_readiness_classifications",
      sourceModule: "governance-principle-registry-review",
      evidencePrefix: "Registry readiness classification",
    }),
    ...observeMany({
      terms: unique([
        ...(input.normalizationResult ? [input.normalizationResult.normalizationClassification] : []),
        ...(input.normalizationResult?.mappings.map((mapping) => mapping.mappingStrength) ?? []),
        ...(input.normalizationResult?.gaps.map((gap) => gap.gapType) ?? []),
      ]),
      domain: "normalization_classifications",
      sourceModule: "principle-evidence-normalization",
      evidencePrefix: "Normalization classification",
    }),
  ];
};

const createFinding = (params: {
  findingType: GovernanceSemanticStabilityFindingType;
  domain: GovernanceSemanticStabilityDomain;
  severity: ReputationSeverity;
  description: string;
  evidence: string[];
  affectedTerms: string[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  baseConfidence?: number;
}): GovernanceSemanticStabilityFinding => {
  const evidence = unique(params.evidence);
  const affectedTerms = unique(params.affectedTerms);
  const factors = unique(params.factors);

  return {
    id: `governance-semantic-stability-${slug(params.findingType)}-${slug(params.domain)}-${slug(params.description)}`,
    findingType: params.findingType,
    domain: params.domain,
    severity: params.severity,
    description: params.description,
    evidence,
    affectedTerms,
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore: calculateSemanticFindingConfidence({
      evidenceCount: evidence.length,
      termCount: affectedTerms.length,
      factorCount: factors.length,
      baseConfidence: params.baseConfidence,
    }),
    explainability: {
      factors,
      reasoning: params.reasoning,
    },
  };
};

const ambiguousLanguage = (items: string[]): string[] =>
  unique(
    items.filter((item) => {
      const normalized = normalize(item);
      return (
        normalized.length < 18 ||
        normalized === "review" ||
        normalized === "monitor" ||
        normalized.includes("as needed") ||
        normalized.includes("maybe") ||
        normalized.includes("possibly")
      );
    }),
  );

const buildFindings = (
  input: GovernanceSemanticStabilityInput,
  observations: GovernanceSemanticTermObservation[],
): GovernanceSemanticStabilityFinding[] => {
  const findings: GovernanceSemanticStabilityFinding[] = [];
  const normalizationGaps = input.normalizationResult?.gaps ?? [];
  const traceabilityGaps = input.traceabilityResult?.gaps ?? [];
  const registryFindings = input.registryReviewResult?.findings ?? [];
  const doctrinePrinciples = input.doctrinePrinciples ?? input.doctrineResult?.principles ?? [];
  const mappings = input.normalizationResult?.mappings ?? [];
  const observedByTerm = new Map<string, GovernanceSemanticTermObservation[]>();

  observations.forEach((observation) => {
    observedByTerm.set(observation.normalizedTerm, [...(observedByTerm.get(observation.normalizedTerm) ?? []), observation]);
  });

  const duplicatedMeaningTerms = Array.from(observedByTerm.entries()).filter(
    ([, termObservations]) => new Set(termObservations.map((observation) => observation.sourceModule)).size > 2,
  );

  if (duplicatedMeaningTerms.length > 0) {
    findings.push(
      createFinding({
        findingType: "duplicated_meaning",
        domain: "governance_terminology",
        severity: duplicatedMeaningTerms.length >= 6 ? "elevated" : "moderate",
        description: "Some normalized terms appear across several modules and should be reviewed for duplicated or overloaded meaning.",
        evidence: duplicatedMeaningTerms
          .slice(0, 10)
          .map(([term, termObservations]) => `${term}: ${termObservations.map((observation) => observation.sourceModule).join(", ")}.`),
        affectedTerms: duplicatedMeaningTerms.map(([term]) => term),
        recommendedHumanReview: "Review repeated governance terms before treating them as institutionally stable vocabulary.",
        factors: [`Duplicated term groups: ${duplicatedMeaningTerms.length}.`],
        reasoning: ["Repeated terms can be healthy reuse, but they need review when they span many modules with different context."],
      }),
    );
  }

  doctrinePrinciples.forEach((principle) => {
    const mismatchedLabels = mappings
      .filter((mapping) => mapping.principleType === principle.principleType && normalize(mapping.principleLabel) !== normalize(principle.title))
      .map((mapping) => mapping.principleLabel);

    if (mismatchedLabels.length > 0) {
      findings.push(
        createFinding({
          findingType: "terminology_inconsistency",
          domain: "doctrine_principles",
          severity: "moderate",
          description: "Doctrine principle label differs from normalized mapping label.",
          evidence: [`Doctrine: ${principle.title}.`, ...mismatchedLabels.map((label) => `Mapping: ${label}.`)],
          affectedTerms: [principle.title, ...mismatchedLabels],
          recommendedHumanReview: "Review doctrine principle and normalized mapping labels before relying on semantic stability.",
          factors: [`Principle type: ${principle.principleType}.`],
          reasoning: ["Semantic stability is stronger when the same principle type carries the same label across doctrine and normalization outputs."],
        }),
      );
    }
  });

  const driftEvidence = unique([
    ...(input.registryReviewResult?.semanticDriftRisks ?? []),
    ...(input.normalizationResult?.governanceSemanticDriftRisks ?? []),
    ...(input.readinessResult?.driftSignals ?? []),
    ...(input.assuranceResult?.assuranceDriftFindings ?? []),
    ...(input.alignmentResult?.alignmentDriftFindings ?? []),
    ...(input.continuityResult?.driftFindings.map((finding) => finding.description) ?? []),
    ...(input.doctrineResult?.driftFindings.map((finding) => finding.description) ?? []),
  ]);

  if (driftEvidence.length > 0) {
    findings.push(
      createFinding({
        findingType: "semantic_drift",
        domain: "governance_terminology",
        severity: driftEvidence.length >= 6 ? "elevated" : "moderate",
        description: "Supplied governance context includes drift signals that may affect semantic stability.",
        evidence: driftEvidence.slice(0, 10),
        affectedTerms: driftEvidence,
        recommendedHumanReview: "Review semantic drift signals before treating governance terminology as institutionally stable.",
        factors: [`Drift signals: ${driftEvidence.length}.`],
        reasoning: ["Semantic stability is weaker when registry, normalization, readiness, assurance, alignment, continuity, or doctrine layers report drift."],
      }),
    );
  }

  if (
    input.registryReviewResult &&
    input.normalizationResult &&
    input.registryReviewResult.registryReadinessClassification === "unstable" &&
    input.normalizationResult.normalizationClassification === "institutionally_consistent"
  ) {
    findings.push(
      createFinding({
        findingType: "classification_mismatch",
        domain: "registry_readiness_classifications",
        severity: "elevated",
        description: "Registry readiness classification and normalization classification appear materially misaligned.",
        evidence: [
          `Registry readiness: ${input.registryReviewResult.registryReadinessClassification}.`,
          `Normalization: ${input.normalizationResult.normalizationClassification}.`,
        ],
        affectedTerms: [
          input.registryReviewResult.registryReadinessClassification,
          input.normalizationResult.normalizationClassification,
        ],
        recommendedHumanReview: "Review classification semantics before relying on registry or normalization readiness.",
        factors: ["Registry readiness is unstable while normalization is institutionally consistent."],
        reasoning: ["Classification mismatch can indicate semantic instability between maturity review and normalization layers."],
      }),
    );
  }

  if (
    normalizationGaps.some((gap) => gap.gapType === "scoring_driver_inconsistency") ||
    traceabilityGaps.some((gap) => gap.gapType === "unsupported_scoring_driver")
  ) {
    findings.push(
      createFinding({
        findingType: "scoring_semantic_instability",
        domain: "scoring_drivers",
        severity: "moderate",
        description: "Scoring driver terminology has unsupported or inconsistent links.",
        evidence: [
          ...normalizationGaps.filter((gap) => gap.gapType === "scoring_driver_inconsistency").map((gap) => gap.description),
          ...traceabilityGaps.filter((gap) => gap.gapType === "unsupported_scoring_driver").map((gap) => gap.description),
        ],
        affectedTerms: ["scoring_driver"],
        recommendedHumanReview: "Review scoring driver semantics before relying on semantic stability.",
        factors: ["Scoring driver gaps were detected in normalization or traceability context."],
        reasoning: ["Deterministic scoring requires stable and explainable scoring driver language."],
      }),
    );
  }

  if (
    normalizationGaps.some((gap) => ["weak_principle_evidence_mapping", "unsupported_evidence_relationship"].includes(gap.gapType)) ||
    traceabilityGaps.some((gap) => ["missing_evidence_link", "weak_source_attribution"].includes(gap.gapType))
  ) {
    findings.push(
      createFinding({
        findingType: "weak_evidence_term_alignment",
        domain: "evidence_categories",
        severity: "moderate",
        description: "Evidence terminology is not fully aligned with principle or traceability terms.",
        evidence: [
          ...normalizationGaps
            .filter((gap) => ["weak_principle_evidence_mapping", "unsupported_evidence_relationship"].includes(gap.gapType))
            .map((gap) => gap.description),
          ...traceabilityGaps
            .filter((gap) => ["missing_evidence_link", "weak_source_attribution"].includes(gap.gapType))
            .map((gap) => gap.description),
        ],
        affectedTerms: ["evidence", "traceability"],
        recommendedHumanReview: "Review evidence terminology and source attribution before relying on evidence semantic stability.",
        factors: ["Evidence alignment gaps were detected."],
        reasoning: ["Evidence semantics are stronger when evidence terms are traceable, attributed, and linked to principle context."],
      }),
    );
  }

  if (
    registryFindings.some((finding) =>
      ["inconsistent_principle_naming", "principle_evidence_inconsistency", "conflicting_principle_meaning"].includes(finding.findingType),
    )
  ) {
    findings.push(
      createFinding({
        findingType: "weak_principle_term_alignment",
        domain: "doctrine_principles",
        severity: "moderate",
        description: "Registry review indicates weak principle terminology alignment.",
        evidence: registryFindings
          .filter((finding) =>
            ["inconsistent_principle_naming", "principle_evidence_inconsistency", "conflicting_principle_meaning"].includes(finding.findingType),
          )
          .map((finding) => finding.description),
        affectedTerms: registryFindings.flatMap((finding) => finding.affectedPrinciples),
        recommendedHumanReview: "Review principle term alignment before semantic stabilization or future registry work.",
        factors: ["Registry review produced principle-alignment findings."],
        reasoning: ["Semantic stability depends on consistent principle meaning across doctrine, normalization, evidence, and audit context."],
      }),
    );
  }

  const ambiguousRecommendations = ambiguousLanguage([
    ...getRecommendations(input).map((recommendation) => recommendation.recommendation),
    ...(input.doctrineResult?.recommendations ?? []),
    ...(input.readinessResult?.recommendations ?? []),
    ...(input.assuranceResult?.recommendations ?? []),
    ...(input.resilienceResult?.recommendations ?? []),
  ]);

  if (ambiguousRecommendations.length > 0) {
    findings.push(
      createFinding({
        findingType: "recommendation_ambiguity",
        domain: "recommendation_language",
        severity: ambiguousRecommendations.length >= 4 ? "elevated" : "moderate",
        description: "Some recommendation language may be too ambiguous for semantic stability review.",
        evidence: ambiguousRecommendations.slice(0, 8),
        affectedTerms: ambiguousRecommendations,
        recommendedHumanReview: "Review ambiguous recommendation language before treating recommendations as stable governance semantics.",
        factors: [`Ambiguous recommendations: ${ambiguousRecommendations.length}.`],
        reasoning: ["Recommendation semantics are more stable when human-review actions are specific, neutral, and traceable."],
      }),
    );
  }

  const ambiguousLimitations = ambiguousLanguage([
    ...(input.auditResult?.limitations ?? []),
    ...(input.doctrineResult?.doctrineLimitations ?? []),
    ...(input.readinessResult?.limitations ?? []),
    ...(input.normalizationResult?.explainability.limitations ?? []),
    ...(input.traceabilityResult?.explainability.limitations ?? []),
  ]);

  if (ambiguousLimitations.length > 0 || (!input.auditResult && !input.doctrineResult && !input.normalizationResult)) {
    findings.push(
      createFinding({
        findingType: "limitation_ambiguity",
        domain: "limitation_language",
        severity: ambiguousLimitations.length >= 4 || (!input.auditResult && !input.doctrineResult) ? "elevated" : "moderate",
        description: "Limitation language is missing or may be too ambiguous for durable semantic review.",
        evidence: ambiguousLimitations.slice(0, 8),
        affectedTerms: ambiguousLimitations,
        recommendedHumanReview: "Review limitation language before treating governance semantics as durable.",
        factors: [`Ambiguous limitations: ${ambiguousLimitations.length}.`],
        reasoning: ["Limitation semantics preserve reviewability and prevent unsupported governance interpretation."],
      }),
    );
  }

  if (traceabilityGaps.length > 0) {
    findings.push(
      createFinding({
        findingType: "traceability_terminology_gap",
        domain: "traceability_language",
        severity: traceabilityGaps.length >= 6 ? "elevated" : "moderate",
        description: "Traceability terminology has gaps that may weaken semantic stability.",
        evidence: traceabilityGaps.map((gap) => `${gap.gapType}: ${gap.description}`).slice(0, 10),
        affectedTerms: traceabilityGaps.map((gap) => gap.gapType),
        recommendedHumanReview: "Review traceability terminology gaps before relying on semantic stability.",
        factors: [`Traceability gaps: ${traceabilityGaps.length}.`],
        reasoning: ["Traceability terminology stabilizes governance meaning by linking evidence, reasoning, limitations, and recommendations."],
      }),
    );
  }

  if (!input.doctrineResult || input.doctrineResult.doctrineStatus === "thin" || input.doctrineResult.driftFindings.length > 0) {
    findings.push(
      createFinding({
        findingType: "doctrine_vocabulary_instability",
        domain: "doctrine_principles",
        severity: !input.doctrineResult || input.doctrineResult.doctrineStatus === "thin" ? "elevated" : "moderate",
        description: "Doctrine vocabulary is limited by missing context, thin status, or drift findings.",
        evidence: [
          `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
          `Doctrine drift findings: ${input.doctrineResult?.driftFindings.length ?? "not_supplied"}.`,
          ...(input.doctrineResult?.driftFindings.map((finding) => finding.description).slice(0, 6) ?? []),
        ],
        affectedTerms: doctrinePrinciples.map((principle) => principle.title),
        recommendedHumanReview: "Review doctrine vocabulary before future doctrine durability or registry work.",
        factors: [`Doctrine supplied: ${Boolean(input.doctrineResult)}.`],
        reasoning: ["Doctrine semantic stability requires stable principle vocabulary and limited drift."],
      }),
    );
  }

  if (
    !input.registryReviewResult ||
    ["unstable", "developing"].includes(input.registryReviewResult.registryReadinessClassification) ||
    input.registryReviewResult.semanticDriftRisks.length > 0
  ) {
    findings.push(
      createFinding({
        findingType: "future_registry_instability_risk",
        domain: "registry_readiness_classifications",
        severity: !input.registryReviewResult || input.registryReviewResult.registryReadinessClassification === "unstable" ? "elevated" : "moderate",
        description: "Future registry readiness context indicates semantic stability should be reviewed before any registry work.",
        evidence: [
          `Registry readiness: ${input.registryReviewResult?.registryReadinessClassification ?? "not_supplied"}.`,
          ...(input.registryReviewResult?.semanticDriftRisks.slice(0, 8) ?? []),
        ],
        affectedTerms: [input.registryReviewResult?.registryReadinessClassification ?? "not_supplied"],
        recommendedHumanReview: "Complete semantic stability review before any future registry implementation discussion.",
        factors: [`Registry semantic drift risks: ${input.registryReviewResult?.semanticDriftRisks.length ?? "not_supplied"}.`],
        reasoning: ["Registry implementation should wait until semantic stability and registry readiness are both human-reviewed."],
      }),
    );
  }

  return findings;
};

const buildDomainAssessments = (
  observations: GovernanceSemanticTermObservation[],
  findings: GovernanceSemanticStabilityFinding[],
): GovernanceSemanticDomainAssessment[] =>
  semanticDomains.map((domain) => {
    const domainObservations = observations.filter((observation) => observation.domain === domain);
    const domainFindings = findings.filter((finding) => finding.domain === domain);
    const score = calculateSemanticDomainScore({
      observations: domainObservations,
      findings: domainFindings,
      contextSupplied: domainObservations.length > 0,
    });

    return {
      domain,
      score,
      classification: semanticStabilityClassificationFromScore(score),
      stableTerms: unique(domainObservations.map((observation) => observation.term)).slice(0, 12),
      unstableTerms: unique(domainFindings.flatMap((finding) => finding.affectedTerms)).slice(0, 12),
      limitations:
        domainObservations.length === 0
          ? [`No ${domain} semantic observations were supplied.`]
          : domainFindings.map((finding) => finding.description).slice(0, 6),
      explainability: {
        factors: [
          `Semantic observations: ${domainObservations.length}.`,
          `Unique terms: ${new Set(domainObservations.map((observation) => observation.normalizedTerm)).size}.`,
          `Findings: ${domainFindings.length}.`,
        ],
        reasoning: ["Domain stability is scored from observed term coverage, source diversity, explainability context, and domain-specific findings."],
      },
    };
  });

export function analyzeGovernanceSemanticStability(
  input: GovernanceSemanticStabilityInput,
): GovernanceSemanticStabilityResult {
  const observations = collectSemanticObservations(input);
  const findings = buildFindings(input, observations);
  const domainAssessments = buildDomainAssessments(observations, findings);
  const semanticStabilityScore = calculateOverallSemanticStabilityScore({ domainAssessments, findings });
  const duplicatedTerms = unique(
    findings.filter((finding) => finding.findingType === "duplicated_meaning").flatMap((finding) => finding.affectedTerms),
  );
  const conflictingTerms = unique(
    findings
      .filter((finding) => finding.findingType === "conflicting_meaning" || finding.findingType === "terminology_inconsistency")
      .flatMap((finding) => finding.affectedTerms),
  );
  const resultWithoutExplainability = {
    semanticStabilityScore,
    semanticStabilityClassification: semanticStabilityClassificationFromScore(semanticStabilityScore),
    domainAssessments,
    findings,
    stableTerms: unique(
      domainAssessments
        .filter((assessment) => assessment.classification === "stable" || assessment.classification === "institutionally_stable")
        .flatMap((assessment) => assessment.stableTerms),
    ),
    unstableTerms: unique(findings.flatMap((finding) => finding.affectedTerms)),
    duplicatedTerms,
    conflictingTerms,
    driftRisks: unique(findings.filter((finding) => finding.findingType === "semantic_drift").flatMap((finding) => finding.evidence)),
    scoringSemanticFindings: unique(
      findings
        .filter((finding) => finding.findingType === "scoring_semantic_instability" || finding.domain === "scoring_drivers")
        .map((finding) => finding.description),
    ),
    evidenceSemanticFindings: unique(
      findings
        .filter((finding) => finding.findingType === "weak_evidence_term_alignment" || finding.domain === "evidence_categories")
        .map((finding) => finding.description),
    ),
    doctrineSemanticFindings: unique(
      findings
        .filter((finding) => finding.findingType === "doctrine_vocabulary_instability" || finding.domain === "doctrine_principles")
        .map((finding) => finding.description),
    ),
    recommendationSemanticFindings: unique(
      findings
        .filter((finding) => finding.findingType === "recommendation_ambiguity" || finding.domain === "recommendation_language")
        .map((finding) => finding.description),
    ),
    limitationSemanticFindings: unique(
      findings
        .filter((finding) => finding.findingType === "limitation_ambiguity" || finding.domain === "limitation_language")
        .map((finding) => finding.description),
    ),
    traceabilitySemanticFindings: unique(
      findings
        .filter((finding) => finding.findingType === "traceability_terminology_gap" || finding.domain === "traceability_language")
        .map((finding) => finding.description),
    ),
    registryReadinessImplications: unique([
      `Registry readiness classification: ${input.registryReviewResult?.registryReadinessClassification ?? "not_supplied"}.`,
      ...(input.registryReviewResult?.semanticDriftRisks ?? []),
      ...(input.registryReviewResult?.futureRegistryRecommendations ?? []),
      "Semantic stability review remains a prerequisite signal before any future production registry.",
    ]),
    humanReviewNotes: unique([
      ...findings.map((finding) => finding.recommendedHumanReview),
      "Do not rename, centralize, or mutate governance terms during this review-only stage.",
      "Do not implement a production registry until semantic stability and doctrine durability are reviewed.",
    ]),
    futureStabilizationRecommendations: [
      "Review doctrine vocabulary durability before adopting registry-backed governance terms.",
      "Review semantic versioning requirements before any future terminology registry or persistence layer.",
      "Consider shared deterministic terminology utilities only after semantic stability and doctrine durability reviews pass.",
      "Keep any future terminology preview read-only and separate from routes, automation, messaging, and orchestration.",
    ],
    humanReviewRequired:
      findings.length > 0 ||
      domainAssessments.some((assessment) => assessment.classification === "unstable" || assessment.classification === "mostly_stable"),
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildGovernanceSemanticStabilityExplainability({
      input,
      result: resultWithoutExplainability,
    }),
  };
}

export const getGovernanceSemanticStabilityReview = analyzeGovernanceSemanticStability;
