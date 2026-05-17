import { remediationCategoryLabel } from "./reputation-remediation-explainability";
import type { ReputationRemediationPlanItem } from "./reputation-remediation-types";
import type { ReputationResolutionFinding } from "./reputation-resolution-types";
import type {
  ReputationEvidenceQualityFinding,
  ReputationEvidenceQualityFindingType,
  ReputationEvidenceQualityInput,
  ReputationEvidenceQualityResult,
  ReputationEvidenceReliabilityLevel,
} from "./reputation-evidence-quality-types";
import {
  calculateEvidenceFindingConfidence,
  calculateEvidenceQualityScore,
  reliabilityLevelFromScore,
} from "./reputation-evidence-quality-scoring";
import {
  buildEvidenceQualityExplainability,
  buildEvidenceQualityRecommendations,
} from "./reputation-evidence-quality-explainability";
import type { ReputationSignal } from "./reputation-types";

const RECENCY_THRESHOLD_DAYS = 90;

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const daysBetween = (fromIso: string, toIso: string): number | undefined => {
  const fromTime = Date.parse(fromIso);
  const toTime = Date.parse(toIso);
  if (!Number.isFinite(fromTime) || !Number.isFinite(toTime)) return undefined;
  return Math.floor((toTime - fromTime) / 86_400_000);
};

const isEvidenceRecentEnough = (input: ReputationEvidenceQualityInput, signal: ReputationSignal): boolean => {
  const ageInDays = daysBetween(signal.detectedAt, input.evaluatedAt);
  return ageInDays === undefined || ageInDays <= RECENCY_THRESHOLD_DAYS;
};

const pressureIsReduced = (input: ReputationEvidenceQualityInput): boolean =>
  ["none", "monitor"].includes(input.earlyWarningResult?.overallWarningLevel ?? "none") &&
  ["stable", "watch"].includes(input.aggregationResult?.enterpriseExposureLevel ?? "stable") &&
  ["stable", "improving"].includes(input.trendResult?.trendDirection ?? "stable");

const pressureContradictsStabilization = (input: ReputationEvidenceQualityInput): boolean =>
  input.earlyWarningResult?.overallWarningLevel === "urgent" ||
  ["critical", "elevated"].includes(input.aggregationResult?.enterpriseExposureLevel ?? "stable") ||
  ["deteriorating", "volatile"].includes(input.trendResult?.trendDirection ?? "stable") ||
  (input.aggregationResult?.unresolvedSignals ?? 0) >= 2;

const areaFromResolutionFinding = (finding: ReputationResolutionFinding): string =>
  finding.relatedRemediationCategory
    ? remediationCategoryLabel(finding.relatedRemediationCategory)
    : finding.affectedGovernanceDomains[0] ?? finding.affectedBusinessUnits[0] ?? finding.id;

const areaFromPlanItem = (planItem: ReputationRemediationPlanItem): string => remediationCategoryLabel(planItem.category);

const reliabilityForFinding = (findingType: ReputationEvidenceQualityFindingType): ReputationEvidenceReliabilityLevel => {
  if (findingType === "evidence_supports_stabilization") return "strong";
  if (findingType === "evidence_incomplete" || findingType === "evidence_outdated") return "moderate";
  if (findingType === "evidence_inconsistent") return "partial";
  return "weak";
};

const createFinding = (params: {
  id: string;
  findingType: ReputationEvidenceQualityFindingType;
  description: string;
  supportingEvidence?: string[];
  missingEvidence?: string[];
  contradictions?: string[];
  affectedBusinessUnits?: string[];
  affectedGovernanceDomains?: string[];
  recommendedHumanReview: string;
  baseConfidence?: number;
  factors: string[];
  reasoning: string[];
}): ReputationEvidenceQualityFinding => {
  const supportingEvidence = unique(params.supportingEvidence ?? []);
  const missingEvidence = unique(params.missingEvidence ?? []);
  const contradictions = unique(params.contradictions ?? []);
  const affectedBusinessUnits = unique(params.affectedBusinessUnits ?? []);
  const affectedGovernanceDomains = unique(params.affectedGovernanceDomains ?? []);
  const factors = unique(params.factors);

  return {
    id: params.id,
    findingType: params.findingType,
    reliabilityLevel: reliabilityForFinding(params.findingType),
    description: params.description,
    supportingEvidence,
    missingEvidence,
    contradictions,
    affectedBusinessUnits,
    affectedGovernanceDomains,
    recommendedHumanReview: params.recommendedHumanReview,
    confidenceScore: calculateEvidenceFindingConfidence({
      supportingEvidenceCount: supportingEvidence.length,
      missingEvidenceCount: missingEvidence.length,
      contradictionCount: contradictions.length,
      factorCount: factors.length,
      affectedBusinessUnitCount: affectedBusinessUnits.length,
      affectedGovernanceDomainCount: affectedGovernanceDomains.length,
      baseConfidence: params.baseConfidence,
    }),
    explainability: {
      factors,
      reasoning: unique(params.reasoning),
    },
  };
};

const buildMissingEvidenceFindings = (input: ReputationEvidenceQualityInput): ReputationEvidenceQualityFinding[] => {
  const hasReviewPressure =
    (input.governanceResult?.findings.length ?? 0) > 0 ||
    (input.earlyWarningResult?.findings.length ?? 0) > 0 ||
    (input.aggregationResult?.unresolvedSignals ?? 0) > 0;

  if (!hasReviewPressure || input.remediationResult || input.resolutionResult) return [];

  return [
    createFinding({
      id: "evidence-quality-missing-resolution-context",
      findingType: "evidence_missing",
      description: "Review pressure appears present, but remediation or resolution evidence was not supplied for evidence-quality evaluation.",
      missingEvidence: ["Remediation planning result.", "Resolution tracking result.", "Human-reviewed supporting evidence for current review areas."],
      affectedBusinessUnits: input.aggregationResult?.exposureByBusinessUnit.map((unit) => unit.businessUnit),
      affectedGovernanceDomains: input.governanceResult
        ? [...input.governanceResult.affectedGovernanceDomains]
        : undefined,
      recommendedHumanReview: "Confirm whether remediation and resolution evidence exists before interpreting evidence reliability.",
      factors: [
        `Governance findings supplied: ${input.governanceResult?.findings.length ?? 0}.`,
        `Early warning findings supplied: ${input.earlyWarningResult?.findings.length ?? 0}.`,
        `Unresolved signals supplied through aggregation: ${input.aggregationResult?.unresolvedSignals ?? 0}.`,
      ],
      reasoning: [
        "Evidence missing status is used when review pressure exists without supplied remediation or resolution context.",
        "This is a read-only completeness indicator and does not make a compliance or performance conclusion.",
      ],
    }),
  ];
};

const buildRemediationEvidenceFindings = (
  input: ReputationEvidenceQualityInput,
): ReputationEvidenceQualityFinding[] =>
  (input.remediationResult?.planItems ?? []).flatMap((planItem, index) => {
    const findings: ReputationEvidenceQualityFinding[] = [];
    const area = areaFromPlanItem(planItem);

    if (planItem.supportingEvidence.length === 0) {
      findings.push(
        createFinding({
          id: `evidence-quality-remediation-missing-${index + 1}`,
          findingType: "remediation_without_supporting_evidence",
          description: `${area} remediation planning appears to have limited supporting evidence.`,
          missingEvidence: ["Supporting evidence for the remediation plan item.", "Human-reviewed basis for the recommended review prompt."],
          affectedBusinessUnits: [...planItem.affectedBusinessUnits],
          affectedGovernanceDomains: [...planItem.affectedGovernanceDomains],
          recommendedHumanReview: "Review the remediation plan item and attach or reference human-reviewed supporting evidence before relying on it.",
          baseConfidence: planItem.confidenceScore,
          factors: [`Plan item priority: ${planItem.priority}.`, `Plan item complexity: ${planItem.estimatedComplexity}.`],
          reasoning: [
            "Remediation evidence quality requires at least one supporting evidence item for each plan item.",
            "The finding does not reject the plan item; it flags evidence completeness for human review.",
          ],
        }),
      );
    } else if (planItem.supportingEvidence.length < 2 && ["critical", "elevated"].includes(planItem.priority)) {
      findings.push(
        createFinding({
          id: `evidence-quality-remediation-incomplete-${index + 1}`,
          findingType: "evidence_incomplete",
          description: `${area} remediation planning has some supporting evidence but may need additional corroboration for its priority level.`,
          supportingEvidence: [...planItem.supportingEvidence],
          missingEvidence: ["Additional corroborating evidence for elevated or critical remediation priority."],
          affectedBusinessUnits: [...planItem.affectedBusinessUnits],
          affectedGovernanceDomains: [...planItem.affectedGovernanceDomains],
          recommendedHumanReview: "Review whether the supplied evidence is sufficient for the remediation priority before confirming next steps.",
          baseConfidence: planItem.confidenceScore,
          factors: [`Supporting evidence count: ${planItem.supportingEvidence.length}.`, `Plan item priority: ${planItem.priority}.`],
          reasoning: [
            "Higher-priority remediation items require stronger evidence completeness signals.",
            "This read-only finding does not change the remediation plan or execute any action.",
          ],
        }),
      );
    }

    return findings;
  });

const buildResolutionEvidenceFindings = (
  input: ReputationEvidenceQualityInput,
): ReputationEvidenceQualityFinding[] =>
  (input.resolutionResult?.findings ?? []).flatMap((finding, index) => {
    const findings: ReputationEvidenceQualityFinding[] = [];
    const area = areaFromResolutionFinding(finding);
    const claimsStabilization = ["stabilized", "improving"].includes(finding.status);
    const hasEvidence = finding.evidence.length > 0;

    if (!hasEvidence) {
      findings.push(
        createFinding({
          id: `evidence-quality-resolution-missing-${index + 1}`,
          findingType: "evidence_missing",
          description: `${area} resolution status has no supplied evidence for evidence-quality review.`,
          missingEvidence: ["Resolution finding evidence.", "Human-reviewed evidence supporting the current resolution status."],
          affectedBusinessUnits: [...finding.affectedBusinessUnits],
          affectedGovernanceDomains: [...finding.affectedGovernanceDomains],
          recommendedHumanReview: "Review the resolution finding and add supporting evidence before relying on the status indicator.",
          baseConfidence: finding.confidenceScore,
          factors: [`Resolution status: ${finding.status}.`],
          reasoning: [
            "Resolution statuses require supporting evidence to be evidence-quality reliable.",
            "This finding is informational and does not mutate or reverse the resolution status.",
          ],
        }),
      );
    }

    if (finding.status === "recurring" && finding.evidence.length < 2) {
      findings.push(
        createFinding({
          id: `evidence-quality-recurring-without-resolution-${index + 1}`,
          findingType: "recurring_issue_without_resolution_evidence",
          description: `${area} appears recurring but has limited resolution-specific evidence.`,
          supportingEvidence: [...finding.evidence],
          missingEvidence: ["Resolution evidence explaining the current state of the recurring area.", "Human-reviewed stabilization or monitoring evidence."],
          affectedBusinessUnits: [...finding.affectedBusinessUnits],
          affectedGovernanceDomains: [...finding.affectedGovernanceDomains],
          recommendedHumanReview: "Review recurring evidence and confirm what human-reviewed resolution evidence is available.",
          baseConfidence: finding.confidenceScore,
          factors: [`Resolution status: ${finding.status}.`, `Evidence count: ${finding.evidence.length}.`],
          reasoning: [
            "Recurring areas need explicit resolution evidence before they can be interpreted as improving or stabilized.",
            "No remediation or governance action is executed by this finding.",
          ],
        }),
      );
    }

    if (claimsStabilization && pressureContradictsStabilization(input)) {
      findings.push(
        createFinding({
          id: `evidence-quality-stabilization-contradiction-${index + 1}`,
          findingType: "evidence_contradicts_stabilization",
          description: `${area} has an improvement or stabilization indicator that may not align with current reputation pressure.`,
          supportingEvidence: [...finding.evidence],
          contradictions: [
            `Trend direction: ${input.trendResult?.trendDirection ?? "not_supplied"}.`,
            `Early warning level: ${input.earlyWarningResult?.overallWarningLevel ?? "not_supplied"}.`,
            `Enterprise exposure: ${input.aggregationResult?.enterpriseExposureLevel ?? "not_supplied"}.`,
            `Unresolved signals: ${input.aggregationResult?.unresolvedSignals ?? "not_supplied"}.`,
          ],
          affectedBusinessUnits: [...finding.affectedBusinessUnits],
          affectedGovernanceDomains: [...finding.affectedGovernanceDomains],
          recommendedHumanReview: "Compare the stabilization indicator with current trend, warning, and exposure evidence before relying on it.",
          baseConfidence: finding.confidenceScore,
          factors: [`Resolution status: ${finding.status}.`, "Current reputation pressure may contradict stabilization."],
          reasoning: [
            "Contradiction risk is flagged when stabilization indicators coexist with deteriorating or elevated current context.",
            "This does not determine fault or invalidate the resolution finding; it routes evidence quality to human review.",
          ],
        }),
      );
    } else if (claimsStabilization && hasEvidence && pressureIsReduced(input)) {
      findings.push(
        createFinding({
          id: `evidence-quality-stabilization-supported-${index + 1}`,
          findingType: "evidence_supports_stabilization",
          description: `${area} has supplied evidence that appears consistent with reduced reputation pressure.`,
          supportingEvidence: [...finding.evidence],
          affectedBusinessUnits: [...finding.affectedBusinessUnits],
          affectedGovernanceDomains: [...finding.affectedGovernanceDomains],
          recommendedHumanReview: "Maintain human monitoring and compare this evidence against future review periods.",
          baseConfidence: finding.confidenceScore,
          factors: [
            `Resolution status: ${finding.status}.`,
            `Trend direction: ${input.trendResult?.trendDirection ?? "not_supplied"}.`,
            `Early warning level: ${input.earlyWarningResult?.overallWarningLevel ?? "not_supplied"}.`,
            `Enterprise exposure: ${input.aggregationResult?.enterpriseExposureLevel ?? "not_supplied"}.`,
          ],
          reasoning: [
            "Stabilization support requires supplied resolution evidence and reduced current reputation pressure.",
            "This remains a read-only reliability indicator and does not certify completion.",
          ],
        }),
      );
    }

    return findings;
  });

const buildSignalRecencyFindings = (input: ReputationEvidenceQualityInput): ReputationEvidenceQualityFinding[] => {
  const outdatedSignals = (input.signals ?? []).filter(
    (signal) => !signal.resolved && !isEvidenceRecentEnough(input, signal),
  );
  if (outdatedSignals.length === 0) return [];

  return [
    createFinding({
      id: "evidence-quality-outdated-signal-evidence",
      findingType: "evidence_outdated",
      description: "Some unresolved reputation signal evidence appears older than the deterministic recency threshold.",
      supportingEvidence: outdatedSignals
        .slice(0, 8)
        .map((signal) => `Signal ${signal.id} detected at ${signal.detectedAt} from ${signal.sourceSystem}.`),
      missingEvidence: ["Recent human-reviewed update or resolution evidence for older unresolved signals."],
      affectedGovernanceDomains: unique(outdatedSignals.flatMap((signal) => signal.impactDomains ?? [])),
      recommendedHumanReview: "Review older unresolved signals and confirm whether recent evidence or resolution notes should be supplied.",
      factors: [`Outdated unresolved signal count: ${outdatedSignals.length}.`, `Recency threshold: ${RECENCY_THRESHOLD_DAYS} days.`],
      reasoning: [
        "Recency is evaluated only when signal timestamps are supplied and parseable.",
        "Older unresolved evidence is not treated as incorrect; it is flagged for human freshness review.",
      ],
    }),
  ];
};

const buildConsistencyFindings = (input: ReputationEvidenceQualityInput): ReputationEvidenceQualityFinding[] => {
  const stabilizedAreas = input.resolutionResult?.stabilizedAreas ?? [];
  const pressureStillElevated = pressureContradictsStabilization(input);
  if (stabilizedAreas.length === 0 || !pressureStillElevated) return [];

  return [
    createFinding({
      id: "evidence-quality-stabilized-area-inconsistency",
      findingType: "evidence_inconsistent",
      description: "Stabilized areas are present while current reputation context still shows elevated review pressure.",
      supportingEvidence: stabilizedAreas.map((area) => `Stabilized area: ${area}.`),
      contradictions: [
        `Trend direction: ${input.trendResult?.trendDirection ?? "not_supplied"}.`,
        `Early warning level: ${input.earlyWarningResult?.overallWarningLevel ?? "not_supplied"}.`,
        `Enterprise exposure: ${input.aggregationResult?.enterpriseExposureLevel ?? "not_supplied"}.`,
      ],
      affectedBusinessUnits: input.remediationResult ? [...input.remediationResult.affectedBusinessUnits] : undefined,
      affectedGovernanceDomains: input.remediationResult
        ? [...input.remediationResult.affectedGovernanceDomains]
        : undefined,
      recommendedHumanReview: "Review stabilized area evidence against current reputation context before treating the areas as reliably stabilized.",
      factors: [`Stabilized area count: ${stabilizedAreas.length}.`, "Current reputation pressure remains elevated."],
      reasoning: [
        "Consistency checks compare resolution area labels with trend, warning, and aggregation context.",
        "This is a neutral evidence-quality check and does not alter any status or execute an action.",
      ],
    }),
  ];
};

const areaLabel = (finding: ReputationEvidenceQualityFinding): string =>
  finding.affectedGovernanceDomains[0] ?? finding.affectedBusinessUnits[0] ?? finding.id;

export function evaluateEnterpriseReputationEvidenceQuality(
  input: ReputationEvidenceQualityInput,
): ReputationEvidenceQualityResult {
  const findings = [
    ...buildMissingEvidenceFindings(input),
    ...buildRemediationEvidenceFindings(input),
    ...buildResolutionEvidenceFindings(input),
    ...buildSignalRecencyFindings(input),
    ...buildConsistencyFindings(input),
  ];
  const evidenceQualityScore = calculateEvidenceQualityScore({ input, findings });
  const overallReliabilityLevel = reliabilityLevelFromScore(evidenceQualityScore);
  const resultWithoutExplainability = {
    overallReliabilityLevel,
    evidenceQualityScore,
    findings,
    missingEvidenceAreas: unique(
      findings
        .filter((finding) => finding.missingEvidence.length > 0)
        .map(areaLabel),
    ),
    contradictionAreas: unique(
      findings
        .filter((finding) => finding.contradictions.length > 0)
        .map(areaLabel),
    ),
    stabilizationSupportedAreas: unique(
      findings
        .filter((finding) => finding.findingType === "evidence_supports_stabilization")
        .map(areaLabel),
    ),
  };

  return {
    ...resultWithoutExplainability,
    recommendations: buildEvidenceQualityRecommendations({ overallReliabilityLevel, findings }),
    explainability: buildEvidenceQualityExplainability({ input, result: resultWithoutExplainability }),
  };
}

export const getEnterpriseReputationEvidenceQualityIntelligence = evaluateEnterpriseReputationEvidenceQuality;
