import { buildGovernanceReviewabilityIntegrityExplainability } from "./governance-reviewability-integrity-review-explainability";
import {
  calculateOverallReviewabilityIntegrityScore,
  calculateReviewabilityAreaScore,
  calculateReviewabilityFindingConfidence,
  reviewabilityIntegrityClassificationFromScore,
} from "./governance-reviewability-integrity-review-scoring";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
} from "./full-system-governance-audit-types";
import type {
  GovernanceReviewabilityAreaAssessment,
  GovernanceReviewabilityIntegrityArea,
  GovernanceReviewabilityIntegrityFinding,
  GovernanceReviewabilityIntegrityFindingType,
  GovernanceReviewabilityIntegrityInput,
  GovernanceReviewabilityIntegrityResult,
} from "./governance-reviewability-integrity-review-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const normalize = (value: string): string => value.trim().toLowerCase();

const slug = (value: string): string =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const getAuditFindings = (input: GovernanceReviewabilityIntegrityInput): FullSystemGovernanceAuditFinding[] =>
  input.auditFindings ?? input.auditResult?.findings ?? [];

const getRecommendations = (input: GovernanceReviewabilityIntegrityInput): FullSystemGovernanceAuditRecommendation[] =>
  input.recommendations ?? input.auditResult?.recommendations ?? [];

const countSupplied = (items: unknown[]): number => items.filter(Boolean).length;

const scoreFromStatus = (status: string | undefined): number => {
  if (!status) return 38;
  if (
    [
      "institutionally_reviewable",
      "institutionally_observable",
      "institutionally_scalable",
      "institutionally_durable",
      "institutionally_stable",
      "institutionally_consistent",
      "institutionally_traceable",
      "institutionally_ready",
      "institutionally_strong",
      "reviewable",
      "observable",
      "durable",
      "scalable",
      "anti_fragile",
    ].includes(status)
  ) {
    return 90;
  }
  if (["stable", "registry_candidate", "normalized", "strong", "operationally_ready", "reliable", "resilient", "aligned"].includes(status)) {
    return 76;
  }
  if (
    [
      "partially_reviewable",
      "conditionally_observable",
      "conditionally_scalable",
      "conditionally_durable",
      "mostly_stable",
      "developing",
      "partially_normalized",
      "moderate",
      "forming",
      "pressured",
    ].includes(status)
  ) {
    return 54;
  }
  return 32;
};

const explainabilityRuleCount = (input: GovernanceReviewabilityIntegrityInput): number =>
  (input.observabilityDurabilityResult?.explainability.observabilityDurabilityRulesApplied.length ?? 0) +
  (input.survivabilityExpansionResult?.explainability.survivabilityRulesApplied.length ?? 0) +
  (input.doctrineDurabilityResult?.explainability.doctrineDurabilityRulesApplied.length ?? 0) +
  (input.semanticStabilityResult?.explainability.semanticStabilityRulesApplied.length ?? 0) +
  (input.normalizationResult?.explainability.normalizationRulesApplied.length ?? 0) +
  (input.traceabilityResult?.explainability.traceabilityRulesApplied.length ?? 0) +
  (input.auditResult?.explainability.auditRulesApplied.length ?? 0) +
  (input.readinessResult?.explainability.readinessRulesApplied.length ?? 0) +
  (input.assuranceResult?.explainability.assuranceRulesApplied.length ?? 0) +
  (input.doctrineResult?.explainability.doctrineRulesApplied.length ?? 0);

const createAreaAssessment = (params: {
  area: GovernanceReviewabilityIntegrityArea;
  baseScore: number;
  description: string;
  reviewableSignals: string[];
  weakSignals: string[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  findingCount?: number;
}): GovernanceReviewabilityAreaAssessment => {
  const reviewableSignals = unique(params.reviewableSignals);
  const weakSignals = unique(params.weakSignals);
  const factors = unique(params.factors);
  const score = calculateReviewabilityAreaScore({
    baseScore: params.baseScore,
    reviewableSignalCount: reviewableSignals.length,
    weakSignalCount: weakSignals.length,
    findingCount: params.findingCount ?? 0,
    explainabilityCount: factors.length + params.reasoning.length,
  });

  return {
    area: params.area,
    score,
    classification: reviewabilityIntegrityClassificationFromScore(score),
    description: params.description,
    reviewableSignals,
    weakSignals,
    recommendedHumanReview: params.recommendedHumanReview,
    explainability: {
      factors,
      reasoning: params.reasoning,
    },
  };
};

const incompleteAuditFindings = (findings: FullSystemGovernanceAuditFinding[]): FullSystemGovernanceAuditFinding[] =>
  findings.filter(
    (finding) =>
      !finding.description ||
      finding.evidence.length === 0 ||
      finding.explainability.factors.length === 0 ||
      finding.explainability.reasoning.length === 0 ||
      !finding.recommendedHumanReview,
  );

const buildAreaAssessments = (input: GovernanceReviewabilityIntegrityInput): GovernanceReviewabilityAreaAssessment[] => {
  const auditFindings = getAuditFindings(input);
  const recommendations = getRecommendations(input);
  const incompleteFindings = incompleteAuditFindings(auditFindings);
  const suppliedReviewLayers = countSupplied([
    input.observabilityDurabilityResult,
    input.survivabilityExpansionResult,
    input.doctrineDurabilityResult,
    input.semanticStabilityResult,
    input.normalizationResult,
    input.traceabilityResult,
    input.auditResult,
    input.readinessResult,
    input.assuranceResult,
    input.alignmentResult,
    input.doctrineResult,
    input.memoryResult,
    input.lineageResult,
    input.resilienceResult,
    input.continuityResult,
    input.evidenceQualityResult,
  ]);
  const ruleCount = explainabilityRuleCount(input);

  return [
    createAreaAssessment({
      area: "governance_findings",
      baseScore: Math.min(88, suppliedReviewLayers * 6),
      description: "Evaluates whether governance review outputs are available together for human review.",
      reviewableSignals: [
        `Review layers supplied: ${suppliedReviewLayers}.`,
        `Observability findings: ${input.observabilityDurabilityResult?.findings.length ?? "not_supplied"}.`,
        `Survivability findings: ${input.survivabilityExpansionResult?.findings.length ?? "not_supplied"}.`,
        `Readiness findings: ${input.readinessResult?.findings.length ?? "not_supplied"}.`,
        `Assurance findings: ${input.assuranceResult?.findings.length ?? "not_supplied"}.`,
      ],
      weakSignals: suppliedReviewLayers < 11 ? ["Layered governance review context is incomplete."] : [],
      recommendedHumanReview: "Review supplied governance layers together before relying on institutional reviewability.",
      factors: [`Review layers supplied: ${suppliedReviewLayers}.`],
      reasoning: ["Governance findings are more reviewable when upstream layers are visible together and remain read-only."],
    }),
    createAreaAssessment({
      area: "audit_findings",
      baseScore: scoreFromStatus(input.auditResult?.auditClassification),
      description: "Evaluates whether audit findings can be reconstructed from description, evidence, reasoning, and human-review linkage.",
      reviewableSignals: [
        `Audit classification: ${input.auditResult?.auditClassification ?? "not_supplied"}.`,
        `Audit findings: ${auditFindings.length}.`,
        `Complete audit findings: ${auditFindings.length - incompleteFindings.length}.`,
      ],
      weakSignals: [
        ...(!input.auditResult ? ["Audit result was not supplied."] : []),
        ...incompleteFindings.map((finding) => `${finding.id}: incomplete reviewability structure.`),
      ],
      recommendedHumanReview: "Review audit finding structure before relying on audit defensibility.",
      factors: [`Incomplete audit findings: ${incompleteFindings.length}.`],
      reasoning: ["Audit findings are defensible when their description, evidence, reasoning, and human-review recommendation can be reconstructed."],
      findingCount: incompleteFindings.length,
    }),
    createAreaAssessment({
      area: "traceability_findings",
      baseScore: scoreFromStatus(input.traceabilityResult?.traceabilityClassification),
      description: "Evaluates whether traceability findings connect evidence, source, reasoning, limitations, and recommendations.",
      reviewableSignals: [
        `Traceability classification: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
        `Trace links: ${input.traceabilityResult?.traces.length ?? "not_supplied"}.`,
        ...(input.traceabilityResult?.traceStrengths ?? []),
      ],
      weakSignals: input.traceabilityResult?.traceWeaknesses ?? ["Traceability result was not supplied."],
      recommendedHumanReview: "Review traceability gaps before relying on reconstruction integrity.",
      factors: [`Traceability gaps: ${input.traceabilityResult?.gaps.length ?? "not_supplied"}.`],
      reasoning: ["Traceability findings are reviewable when evidence chains and limitations are visible."],
      findingCount: input.traceabilityResult?.gaps.length ?? 1,
    }),
    createAreaAssessment({
      area: "explainability_findings",
      baseScore: Math.min(88, ruleCount * 2),
      description: "Evaluates whether explainability rules, drivers, and limitations are visible across review layers.",
      reviewableSignals: [`Explainability rules supplied: ${ruleCount}.`],
      weakSignals: ruleCount < 24 ? ["Explainability rule depth may be limited for future reviewability."] : [],
      recommendedHumanReview: "Review explainability depth before relying on reviewability integrity.",
      factors: [`Explainability rule count: ${ruleCount}.`],
      reasoning: ["Explainability is reconstructable when rules, drivers, summaries, and limitations are present across layers."],
    }),
    createAreaAssessment({
      area: "survivability_findings",
      baseScore: scoreFromStatus(input.survivabilityExpansionResult?.survivabilityClassification),
      description: "Evaluates whether survivability findings remain visible and understandable.",
      reviewableSignals: [
        `Survivability classification: ${input.survivabilityExpansionResult?.survivabilityClassification ?? "not_supplied"}.`,
        ...(input.survivabilityExpansionResult?.governanceScalabilityFindings ?? []),
      ],
      weakSignals: input.survivabilityExpansionResult?.fragileExpansionAreas ?? ["Survivability and expansion review result was not supplied."],
      recommendedHumanReview: "Review survivability findings before future governance scaling.",
      factors: [`Survivability findings: ${input.survivabilityExpansionResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Survivability findings are reviewable when durable and fragile areas are visible together."],
    }),
    createAreaAssessment({
      area: "readiness_findings",
      baseScore: scoreFromStatus(input.readinessResult?.readinessClassification),
      description: "Evaluates whether readiness findings preserve preparedness context.",
      reviewableSignals: [
        `Readiness classification: ${input.readinessResult?.readinessClassification ?? "not_supplied"}.`,
        ...(input.readinessResult?.strengths ?? []),
      ],
      weakSignals: input.readinessResult?.weaknesses ?? ["Readiness result was not supplied."],
      recommendedHumanReview: "Review readiness findings before relying on governance preparedness.",
      factors: [`Readiness findings: ${input.readinessResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Readiness findings are reviewable when supporting evidence, limiting evidence, and review recommendations are visible."],
    }),
    createAreaAssessment({
      area: "assurance_findings",
      baseScore: scoreFromStatus(input.assuranceResult?.overallAssuranceStatus),
      description: "Evaluates whether assurance findings preserve governance confidence context.",
      reviewableSignals: [
        `Assurance status: ${input.assuranceResult?.overallAssuranceStatus ?? "not_supplied"}.`,
        ...(input.assuranceResult?.assuranceStrengths ?? []),
      ],
      weakSignals: input.assuranceResult?.assuranceWeaknesses ?? ["Assurance result was not supplied."],
      recommendedHumanReview: "Review assurance findings before relying on governance confidence.",
      factors: [`Assurance findings: ${input.assuranceResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Assurance findings are reviewable when strengths, weaknesses, drift, confidence, and recommendations stay visible."],
    }),
    createAreaAssessment({
      area: "doctrine_findings",
      baseScore: scoreFromStatus(input.doctrineResult?.doctrineStatus),
      description: "Evaluates whether doctrine findings and principles remain reconstructable.",
      reviewableSignals: [
        `Doctrine status: ${input.doctrineResult?.doctrineStatus ?? "not_supplied"}.`,
        ...(input.doctrineResult?.principles.map((principle) => `${principle.principleType}: ${principle.title}.`) ?? []),
      ],
      weakSignals: input.doctrineResult?.doctrineLimitations ?? ["Doctrine result was not supplied."],
      recommendedHumanReview: "Review doctrine principles and drift before relying on doctrine reviewability.",
      factors: [`Doctrine drift findings: ${input.doctrineResult?.driftFindings.length ?? "not_supplied"}.`],
      reasoning: ["Doctrine is reconstructable when principles, evidence, drift, limitations, and recommendations are visible."],
    }),
    createAreaAssessment({
      area: "semantic_stability_findings",
      baseScore: scoreFromStatus(input.semanticStabilityResult?.semanticStabilityClassification),
      description: "Evaluates whether semantic stability findings preserve term and drift reviewability.",
      reviewableSignals: [
        `Semantic stability: ${input.semanticStabilityResult?.semanticStabilityClassification ?? "not_supplied"}.`,
        ...(input.semanticStabilityResult?.stableTerms.slice(0, 8) ?? []),
      ],
      weakSignals: input.semanticStabilityResult?.unstableTerms ?? ["Semantic stability result was not supplied."],
      recommendedHumanReview: "Review semantic stability findings before future terminology or registry work.",
      factors: [`Semantic findings: ${input.semanticStabilityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Semantic findings are reviewable when stable terms, unstable terms, conflicts, drift risks, and limitations are visible."],
    }),
    createAreaAssessment({
      area: "observability_findings",
      baseScore: scoreFromStatus(input.observabilityDurabilityResult?.observabilityDurabilityClassification),
      description: "Evaluates whether observability findings preserve visibility and blind spot context.",
      reviewableSignals: [
        `Observability durability: ${input.observabilityDurabilityResult?.observabilityDurabilityClassification ?? "not_supplied"}.`,
        ...(input.observabilityDurabilityResult?.durableObservabilityAreas ?? []),
      ],
      weakSignals: input.observabilityDurabilityResult?.fragileObservabilityAreas ?? ["Observability durability result was not supplied."],
      recommendedHumanReview: "Review observability findings before future dashboard or observability growth.",
      factors: [`Observability findings: ${input.observabilityDurabilityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Observability findings are reviewable when durable areas, fragile areas, blind spots, and visibility risks are explicit."],
    }),
    createAreaAssessment({
      area: "recommendation_findings",
      baseScore: recommendations.length + (input.doctrineResult?.recommendations.length ?? 0) > 0 ? 72 : 42,
      description: "Evaluates whether recommendations remain linked and human-review oriented.",
      reviewableSignals: [
        `Audit recommendations: ${recommendations.length}.`,
        `Doctrine recommendations: ${input.doctrineResult?.recommendations.length ?? "not_supplied"}.`,
        ...(input.readinessResult?.recommendations ?? []),
      ],
      weakSignals: input.traceabilityResult?.recommendationLinkageGaps ?? [],
      recommendedHumanReview: "Review recommendation linkage before relying on reviewability integrity.",
      factors: [`Recommendation linkage gaps: ${input.traceabilityResult?.recommendationLinkageGaps.length ?? "not_supplied"}.`],
      reasoning: ["Recommendations are reviewable when linked to findings, evidence, limitations, and human-review actions."],
    }),
    createAreaAssessment({
      area: "limitation_findings",
      baseScore: (input.semanticStabilityResult?.limitationSemanticFindings.length ?? 1) === 0 ? 76 : 58,
      description: "Evaluates whether limitations remain visible enough for institutional defensibility.",
      reviewableSignals: [
        `Audit limitations: ${input.auditResult?.limitations.length ?? "not_supplied"}.`,
        `Doctrine limitations: ${input.doctrineResult?.doctrineLimitations.length ?? "not_supplied"}.`,
      ],
      weakSignals: [
        ...(input.traceabilityResult?.limitationGaps ?? []),
        ...(input.semanticStabilityResult?.limitationSemanticFindings ?? []),
      ],
      recommendedHumanReview: "Review limitation visibility before relying on institutional defensibility.",
      factors: [`Traceability limitation gaps: ${input.traceabilityResult?.limitationGaps.length ?? "not_supplied"}.`],
      reasoning: ["Limitations are reviewable when caveats remain attached to findings, evidence, and recommendations."],
    }),
    createAreaAssessment({
      area: "evidence_findings",
      baseScore: Math.min(
        90,
        scoreFromStatus(input.evidenceQualityResult?.overallReliabilityLevel) * 0.5 +
          scoreFromStatus(input.traceabilityResult?.traceabilityClassification) * 0.5,
      ),
      description: "Evaluates whether evidence findings support reconstruction.",
      reviewableSignals: [
        `Evidence reliability: ${input.evidenceQualityResult?.overallReliabilityLevel ?? "not_supplied"}.`,
        `Evidence score: ${input.evidenceQualityResult?.evidenceQualityScore ?? "not_supplied"}.`,
        ...(input.evidenceQualityResult?.stabilizationSupportedAreas ?? []),
      ],
      weakSignals: [
        ...(input.evidenceQualityResult?.missingEvidenceAreas ?? []),
        ...(input.traceabilityResult?.evidenceGaps ?? []),
      ],
      recommendedHumanReview: "Review evidence quality and evidence gaps before relying on reconstruction integrity.",
      factors: [`Evidence quality findings: ${input.evidenceQualityResult?.findings.length ?? "not_supplied"}.`],
      reasoning: ["Evidence reconstruction is stronger when evidence quality and traceability are visible together."],
    }),
    createAreaAssessment({
      area: "human_review_notes",
      baseScore: input.observabilityDurabilityResult?.humanReviewRequired || input.readinessResult?.humanReviewRequired ? 72 : 50,
      description: "Evaluates whether human-review requirements and notes remain explicit.",
      reviewableSignals: [
        `Readiness human review required: ${input.readinessResult?.humanReviewRequired ?? "not_supplied"}.`,
        `Observability human review required: ${input.observabilityDurabilityResult?.humanReviewRequired ?? "not_supplied"}.`,
        ...(input.observabilityDurabilityResult?.humanReviewNotes ?? []),
      ],
      weakSignals: [
        ...(!input.readinessResult ? ["Readiness human-review context was not supplied."] : []),
        ...(!input.observabilityDurabilityResult ? ["Observability human-review notes were not supplied."] : []),
      ],
      recommendedHumanReview: "Review human-review notes before relying on institutional defensibility.",
      factors: [`Observability human-review notes: ${input.observabilityDurabilityResult?.humanReviewNotes.length ?? "not_supplied"}.`],
      reasoning: ["Human-review integrity is stronger when review requirements and review notes are explicit and easy to inspect."],
    }),
  ];
};

const createFinding = (params: {
  findingType: GovernanceReviewabilityIntegrityFindingType;
  area: GovernanceReviewabilityIntegrityArea;
  severity: ReputationSeverity;
  description: string;
  evidence: string[];
  affectedAuditCategories?: FullSystemGovernanceAuditCategory[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  baseConfidence?: number;
}): GovernanceReviewabilityIntegrityFinding => {
  const evidence = unique(params.evidence);
  const factors = unique(params.factors);

  return {
    id: `governance-reviewability-integrity-${slug(params.findingType)}-${slug(params.area)}-${slug(params.description)}`,
    findingType: params.findingType,
    area: params.area,
    severity: params.severity,
    description: params.description,
    evidence,
    affectedAuditCategories: unique(params.affectedAuditCategories ?? []) as FullSystemGovernanceAuditCategory[],
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore: calculateReviewabilityFindingConfidence({
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

const buildFindings = (input: GovernanceReviewabilityIntegrityInput): GovernanceReviewabilityIntegrityFinding[] => {
  const findings: GovernanceReviewabilityIntegrityFinding[] = [];
  const auditFindings = getAuditFindings(input);
  const incompleteFindings = incompleteAuditFindings(auditFindings);
  const auditCategories = unique([
    ...auditFindings.map((finding) => finding.category),
    ...Object.keys(input.auditResult?.categoryScores ?? {}),
  ]) as FullSystemGovernanceAuditCategory[];
  const suppliedReviewLayers = countSupplied([
    input.observabilityDurabilityResult,
    input.survivabilityExpansionResult,
    input.doctrineDurabilityResult,
    input.semanticStabilityResult,
    input.normalizationResult,
    input.traceabilityResult,
    input.auditResult,
    input.readinessResult,
    input.assuranceResult,
    input.doctrineResult,
    input.memoryResult,
    input.lineageResult,
    input.continuityResult,
    input.evidenceQualityResult,
  ]);
  const ruleCount = explainabilityRuleCount(input);

  if (suppliedReviewLayers < 10) {
    findings.push(
      createFinding({
        findingType: "reviewability_gap",
        area: "governance_findings",
        severity: suppliedReviewLayers < 7 ? "elevated" : "moderate",
        description: "Layered governance review context is incomplete.",
        evidence: [`Review layers supplied: ${suppliedReviewLayers}.`],
        recommendedHumanReview: "Supply observability, survivability, doctrine durability, semantic stability, normalization, traceability, audit, readiness, assurance, doctrine, memory, lineage, continuity, and evidence context before relying on reviewability score.",
        factors: ["Reviewability depends on layered context."],
        reasoning: ["Reviewability gaps emerge when a reviewer cannot inspect the upstream context needed to reconstruct findings."],
      }),
    );
  }

  if (incompleteFindings.length > 0) {
    findings.push(
      createFinding({
        findingType: "unclear_finding_structure",
        area: "audit_findings",
        severity: incompleteFindings.length >= 4 ? "elevated" : "moderate",
        description: "Some audit findings are missing evidence, reasoning, factors, description, or human-review linkage.",
        evidence: incompleteFindings.map((finding) => finding.id),
        affectedAuditCategories: incompleteFindings.map((finding) => finding.category),
        recommendedHumanReview: "Review incomplete audit finding structure before relying on audit defensibility.",
        factors: [`Incomplete audit findings: ${incompleteFindings.length}.`],
        reasoning: ["A finding is harder to defend when reviewers cannot reconstruct description, evidence, reasoning, and recommended review."],
      }),
    );
  }

  if (
    !input.evidenceQualityResult ||
    !input.traceabilityResult ||
    input.traceabilityResult.evidenceGaps.length > 0 ||
    input.evidenceQualityResult.missingEvidenceAreas.length > 0
  ) {
    findings.push(
      createFinding({
        findingType: "weak_evidence_reconstruction",
        area: "evidence_findings",
        severity: !input.evidenceQualityResult || !input.traceabilityResult ? "elevated" : "moderate",
        description: "Evidence reconstruction context is missing or has visible gaps.",
        evidence: [
          `Evidence quality supplied: ${Boolean(input.evidenceQualityResult)}.`,
          `Traceability supplied: ${Boolean(input.traceabilityResult)}.`,
          ...(input.traceabilityResult?.evidenceGaps ?? []),
          ...(input.evidenceQualityResult?.missingEvidenceAreas ?? []),
        ],
        recommendedHumanReview: "Review evidence quality, missing evidence, and traceability before relying on reconstruction integrity.",
        factors: ["Evidence reconstruction requires both evidence quality and traceability context."],
        reasoning: ["Reviewers need evidence quality and trace links to reconstruct why findings were generated."],
      }),
    );
  }

  if (ruleCount < 24) {
    findings.push(
      createFinding({
        findingType: "weak_reasoning_reconstruction",
        area: "explainability_findings",
        severity: ruleCount < 14 ? "elevated" : "moderate",
        description: "Explainability rule depth may be limited for future reasoning reconstruction.",
        evidence: [`Explainability rules supplied: ${ruleCount}.`],
        recommendedHumanReview: "Review explainability rules and major drivers before relying on reasoning reconstruction.",
        factors: ["Reasoning reconstruction depends on visible rules, drivers, summaries, and limitations."],
        reasoning: ["Future reviewers need explainability structure to reconstruct how governance outputs were derived."],
      }),
    );
  }

  if (
    (input.traceabilityResult?.limitationGaps.length ?? 0) > 0 ||
    (input.semanticStabilityResult?.limitationSemanticFindings.length ?? 0) > 0 ||
    !input.auditResult
  ) {
    findings.push(
      createFinding({
        findingType: "weak_limitation_visibility",
        area: "limitation_findings",
        severity: !input.auditResult ? "elevated" : "moderate",
        description: "Limitation visibility may be incomplete.",
        evidence: [
          ...(input.traceabilityResult?.limitationGaps ?? []),
          ...(input.semanticStabilityResult?.limitationSemanticFindings ?? []),
          ...(!input.auditResult ? ["Audit limitations were not supplied."] : []),
        ],
        recommendedHumanReview: "Review limitation linkage before relying on institutional defensibility.",
        factors: ["Limitation visibility reduces unsupported interpretation risk."],
        reasoning: ["Institutional defensibility depends on visible limitations attached to findings, evidence, and recommendations."],
      }),
    );
  }

  if (
    (input.traceabilityResult?.recommendationLinkageGaps.length ?? 0) > 0 ||
    !input.readinessResult ||
    !input.observabilityDurabilityResult
  ) {
    findings.push(
      createFinding({
        findingType: "weak_human_review_linkage",
        area: "human_review_notes",
        severity: !input.readinessResult || !input.observabilityDurabilityResult ? "elevated" : "moderate",
        description: "Human-review linkage or recommendation linkage is incomplete.",
        evidence: [
          ...(input.traceabilityResult?.recommendationLinkageGaps ?? []),
          `Readiness supplied: ${Boolean(input.readinessResult)}.`,
          `Observability supplied: ${Boolean(input.observabilityDurabilityResult)}.`,
        ],
        recommendedHumanReview: "Review human-review linkage before relying on reviewability integrity.",
        factors: ["Human-review linkage depends on recommendation linkage and explicit human-review notes."],
        reasoning: ["Governance outputs are less defensible when reviewers cannot see what should be reviewed by a person."],
      }),
    );
  }

  if (!input.auditResult || input.auditResult.auditClassification === "critical_risk" || input.auditResult.humanReviewRequired) {
    findings.push(
      createFinding({
        findingType: "audit_defensibility_risk",
        area: "audit_findings",
        severity: !input.auditResult || input.auditResult.auditClassification === "critical_risk" ? "elevated" : "moderate",
        description: "Audit defensibility requires human review or missing audit context review.",
        evidence: [
          `Audit classification: ${input.auditResult?.auditClassification ?? "not_supplied"}.`,
          `Audit human review required: ${input.auditResult?.humanReviewRequired ?? "not_supplied"}.`,
        ],
        affectedAuditCategories: auditCategories,
        recommendedHumanReview: "Review audit defensibility before relying on system-wide governance conclusions.",
        factors: ["Audit defensibility is evaluated from audit classification and human-review requirement."],
        reasoning: ["Audit outputs are more defensible when reviewers can inspect risks, evidence, and review requirements."],
      }),
    );
  }

  if (ruleCount < 18 || !input.observabilityDurabilityResult || !input.semanticStabilityResult) {
    findings.push(
      createFinding({
        findingType: "explainability_fragmentation",
        area: "explainability_findings",
        severity: !input.observabilityDurabilityResult || !input.semanticStabilityResult ? "elevated" : "moderate",
        description: "Explainability context is fragmented or incomplete across review layers.",
        evidence: [
          `Explainability rules: ${ruleCount}.`,
          `Observability supplied: ${Boolean(input.observabilityDurabilityResult)}.`,
          `Semantic stability supplied: ${Boolean(input.semanticStabilityResult)}.`,
        ],
        recommendedHumanReview: "Review explainability fragmentation before future reviewability expansion.",
        factors: ["Explainability fragmentation reduces reconstruction integrity."],
        reasoning: ["Reviewability is weaker when explanations are distributed across missing or inconsistent layers."],
      }),
    );
  }

  if (!input.traceabilityResult || input.traceabilityResult.gaps.length > 0 || ["weak", "moderate"].includes(input.traceabilityResult.traceabilityClassification)) {
    findings.push(
      createFinding({
        findingType: "traceability_fragmentation",
        area: "traceability_findings",
        severity: !input.traceabilityResult || input.traceabilityResult.traceabilityClassification === "weak" ? "elevated" : "moderate",
        description: "Traceability context is missing, fragmented, or below strong traceability.",
        evidence: [
          `Traceability classification: ${input.traceabilityResult?.traceabilityClassification ?? "not_supplied"}.`,
          ...(input.traceabilityResult?.gaps.map((gap) => gap.description).slice(0, 8) ?? []),
        ],
        recommendedHumanReview: "Review traceability fragmentation before relying on reconstruction integrity.",
        factors: [`Traceability gaps: ${input.traceabilityResult?.gaps.length ?? "not_supplied"}.`],
        reasoning: ["Traceability fragmentation makes it harder to connect findings back to evidence and limitations."],
      }),
    );
  }

  if (
    !input.memoryResult ||
    !input.lineageResult ||
    !input.continuityResult ||
    (input.observabilityDurabilityResult?.institutionalReviewabilityFindings.length ?? 0) > 0
  ) {
    findings.push(
      createFinding({
        findingType: "institutional_trust_risk",
        area: "human_review_notes",
        severity: !input.memoryResult || !input.lineageResult ? "elevated" : "moderate",
        description: "Institutional trust context is incomplete or has reviewability findings.",
        evidence: [
          `Memory supplied: ${Boolean(input.memoryResult)}.`,
          `Lineage supplied: ${Boolean(input.lineageResult)}.`,
          `Continuity supplied: ${Boolean(input.continuityResult)}.`,
          ...(input.observabilityDurabilityResult?.institutionalReviewabilityFindings ?? []),
        ],
        recommendedHumanReview: "Review institutional memory, lineage, continuity, and observability reviewability before relying on institutional trust.",
        factors: ["Institutional trust requires historical context and visible reviewability findings."],
        reasoning: ["Governance outputs are harder to defend when institutional memory or lineage is missing."],
      }),
    );
  }

  if (
    !input.observabilityDurabilityResult ||
    ["fragile", "conditionally_observable"].includes(input.observabilityDurabilityResult.observabilityScalabilityClassification)
  ) {
    findings.push(
      createFinding({
        findingType: "future_reviewability_degradation",
        area: "observability_findings",
        severity: !input.observabilityDurabilityResult || input.observabilityDurabilityResult.observabilityScalabilityClassification === "fragile" ? "elevated" : "moderate",
        description: "Future reviewability may degrade under observability scaling pressure.",
        evidence: [
          `Observability scalability: ${input.observabilityDurabilityResult?.observabilityScalabilityClassification ?? "not_supplied"}.`,
          ...(input.observabilityDurabilityResult?.fragileObservabilityAreas ?? []),
        ],
        recommendedHumanReview: "Review observability scalability before future reviewability expansion.",
        factors: ["Future reviewability depends on durable observability scaling."],
        reasoning: ["As governance complexity grows, weak observability scalability can make outputs less reviewable."],
      }),
    );
  }

  if (
    !input.auditResult ||
    !input.traceabilityResult ||
    !input.observabilityDurabilityResult ||
    !input.semanticStabilityResult ||
    !input.doctrineResult
  ) {
    findings.push(
      createFinding({
        findingType: "governance_opacity_risk",
        area: "governance_findings",
        severity: "elevated",
        description: "Core governance reviewability context is missing.",
        evidence: [
          `Audit supplied: ${Boolean(input.auditResult)}.`,
          `Traceability supplied: ${Boolean(input.traceabilityResult)}.`,
          `Observability supplied: ${Boolean(input.observabilityDurabilityResult)}.`,
          `Semantic stability supplied: ${Boolean(input.semanticStabilityResult)}.`,
          `Doctrine supplied: ${Boolean(input.doctrineResult)}.`,
        ],
        recommendedHumanReview: "Supply core governance reviewability context before relying on reviewability integrity.",
        factors: ["Opacity risk is evaluated from missing core context layers."],
        reasoning: ["Governance opacity increases when reviewers cannot inspect audit, evidence, traceability, observability, semantic, and doctrine context together."],
      }),
    );
  }

  return findings;
};

export function analyzeGovernanceReviewabilityIntegrity(
  input: GovernanceReviewabilityIntegrityInput,
): GovernanceReviewabilityIntegrityResult {
  const areaAssessments = buildAreaAssessments(input);
  const findings = buildFindings(input);
  const reviewabilityIntegrityScore = calculateOverallReviewabilityIntegrityScore({ areaAssessments, findings });
  const resultWithoutExplainability = {
    reviewabilityIntegrityScore,
    reviewabilityClassification: reviewabilityIntegrityClassificationFromScore(reviewabilityIntegrityScore),
    areaAssessments,
    findings,
    reviewableAreas: unique(
      areaAssessments
        .filter((assessment) => assessment.classification === "reviewable" || assessment.classification === "institutionally_reviewable")
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
    ),
    weakReviewabilityAreas: unique(
      areaAssessments
        .filter((assessment) => assessment.classification === "weak" || assessment.classification === "partially_reviewable")
        .map((assessment) => `${assessment.area}: ${assessment.classification} at ${assessment.score}/100.`),
    ),
    reconstructionRisks: unique(
      findings
        .filter((finding) =>
          ["weak_evidence_reconstruction", "weak_reasoning_reconstruction", "traceability_fragmentation", "governance_opacity_risk"].includes(
            finding.findingType,
          ),
        )
        .map((finding) => finding.description),
    ),
    auditDefensibilityFindings: unique(
      findings.filter((finding) => finding.findingType === "audit_defensibility_risk").map((finding) => finding.description),
    ),
    evidenceReviewabilityFindings: unique(
      findings
        .filter((finding) => finding.findingType === "weak_evidence_reconstruction" || finding.area === "evidence_findings")
        .map((finding) => finding.description),
    ),
    reasoningReviewabilityFindings: unique(
      findings
        .filter((finding) => finding.findingType === "weak_reasoning_reconstruction" || finding.findingType === "explainability_fragmentation")
        .map((finding) => finding.description),
    ),
    limitationReviewabilityFindings: unique(
      findings.filter((finding) => finding.findingType === "weak_limitation_visibility").map((finding) => finding.description),
    ),
    recommendationReviewabilityFindings: unique(
      findings.filter((finding) => finding.findingType === "weak_human_review_linkage").map((finding) => finding.description),
    ),
    humanReviewFindings: unique(
      findings
        .filter((finding) => finding.findingType === "weak_human_review_linkage" || finding.area === "human_review_notes")
        .map((finding) => finding.description),
    ),
    institutionalTrustFindings: unique(
      findings
        .filter((finding) => finding.findingType === "institutional_trust_risk" || finding.findingType === "future_reviewability_degradation")
        .map((finding) => finding.description),
    ),
    humanReviewNotes: unique([
      ...findings.map((finding) => finding.recommendedHumanReview),
      "Do not mutate governance findings, rewrite outputs, enforce reviewability, add persistence, add routes, or introduce governance rewriting during this review-only stage.",
      "Keep future reviewability, observability, versioning, registry, and orchestration integrations separate from pure governance review engines.",
    ]),
    futureStabilizationRecommendations: [
      "Prepare Governance Versioning Readiness Review before adding persistence, registry, or reviewability enforcement.",
      "Review finding structure standards before future governance complexity increases.",
      "Review evidence, reasoning, limitation, recommendation, and human-review linkage together before relying on institutional defensibility.",
      "Consider shared deterministic reviewability helpers only after versioning readiness confirms stable contracts.",
      "Keep future reviewability previews read-only and human-review first.",
    ],
    humanReviewRequired:
      findings.length > 0 ||
      areaAssessments.some(
        (assessment) => assessment.classification === "weak" || assessment.classification === "partially_reviewable",
      ),
  };

  return {
    ...resultWithoutExplainability,
    explainability: buildGovernanceReviewabilityIntegrityExplainability({
      input,
      result: resultWithoutExplainability,
    }),
  };
}

export const getGovernanceReviewabilityIntegrityReview = analyzeGovernanceReviewabilityIntegrity;
