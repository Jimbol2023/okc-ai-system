import {
  buildGovernanceMemoryExplainability,
  buildGovernanceMemoryRecommendations,
} from "./reputation-governance-memory-explainability";
import {
  calculateGovernanceMemoryConfidenceScore,
  calculateMemoryPatternConfidence,
  institutionalMemoryStatusFromScore,
} from "./reputation-governance-memory-scoring";
import type {
  ReputationGovernanceMemoryInput,
  ReputationGovernanceMemoryPattern,
  ReputationGovernanceMemoryPatternType,
  ReputationGovernanceMemoryResult,
  ReputationGovernanceMemorySnapshot,
} from "./reputation-governance-memory-types";
import type {
  ReputationArchitectureImprovementItem,
  ReputationGovernanceResilienceResult,
} from "./reputation-governance-resilience-types";

const unique = (items: string[]): string[] => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const normalize = (value: string): string => value.trim().toLowerCase();

const slug = (value: string): string =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

const metadataStringArray = (metadata: Record<string, unknown> | undefined, key: string): string[] => {
  const value = metadata?.[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
};

const previousEvaluatedAt = (input: ReputationGovernanceMemoryInput, index: number): string => {
  const previousDates = metadataStringArray(input.metadata, "previousEvaluatedAt");
  return previousDates[index] ?? `previous_period_${index + 1}`;
};

const domainsFromInput = (input: ReputationGovernanceMemoryInput): string[] =>
  unique([
    ...(input.governanceResult?.affectedGovernanceDomains ?? []),
    ...(input.remediationResult?.affectedGovernanceDomains ?? []),
    ...(input.lineageResult?.nodes.flatMap((node) => node.relatedGovernanceDomains) ?? []),
    ...(input.continuityResult?.driftFindings.flatMap((finding) => finding.affectedGovernanceDomains) ?? []),
    ...(input.currentResilienceResult?.findings.flatMap((finding) => finding.affectedGovernanceDomains) ?? []),
  ]);

const businessUnitsFromInput = (input: ReputationGovernanceMemoryInput): string[] =>
  unique([
    ...(input.remediationResult?.affectedBusinessUnits ?? []),
    ...(input.lineageResult?.nodes.flatMap((node) => node.relatedBusinessUnits) ?? []),
    ...(input.continuityResult?.driftFindings.flatMap((finding) => finding.affectedBusinessUnits) ?? []),
    ...(input.currentResilienceResult?.findings.flatMap((finding) => finding.affectedBusinessUnits) ?? []),
    ...(input.aggregationResult?.exposureByBusinessUnit.map((unit) => unit.businessUnit) ?? []),
  ]);

const resilienceRecurringDrivers = (result: ReputationGovernanceResilienceResult): string[] =>
  unique([
    ...result.resilienceWeaknesses,
    ...result.resilienceStrengths,
    ...result.findings.map((finding) => finding.description),
  ]);

const resilienceEvidenceLimitations = (result: ReputationGovernanceResilienceResult): string[] =>
  unique([
    ...result.findings
      .filter((finding) =>
        [
          "dependency_resilience_gap",
          "contradiction_recovery_weakness",
          "stabilization_fragility",
          "recovery_capacity_gap",
        ].includes(finding.findingType),
      )
      .flatMap((finding) => finding.evidence),
    ...result.explainability.limitations.slice(0, 4),
  ]);

const currentEvidenceLimitations = (input: ReputationGovernanceMemoryInput): string[] =>
  unique([
    ...(input.evidenceQualityResult?.missingEvidenceAreas.map((area) => `Missing evidence area: ${area}.`) ?? []),
    ...(input.evidenceQualityResult?.contradictionAreas.map((area) => `Evidence contradiction area: ${area}.`) ?? []),
    ...(input.lineageResult?.weakLineageAreas.map((area) => `Weak lineage area: ${area}.`) ?? []),
    ...(input.currentResilienceResult ? resilienceEvidenceLimitations(input.currentResilienceResult) : []),
  ]);

const snapshotFromCurrent = (input: ReputationGovernanceMemoryInput): ReputationGovernanceMemorySnapshot | undefined => {
  const result = input.currentResilienceResult;
  if (!result && !input.continuityResult && !input.lineageResult) return undefined;

  return {
    snapshotId: `governance-memory-current-${slug(input.evaluatedAt) || "current"}`,
    evaluatedAt: input.evaluatedAt,
    continuityStatus: input.continuityResult?.continuityStatus,
    resilienceStatus: result?.resilienceStatus,
    lineageIntegrityScore: input.lineageResult?.lineageIntegrityScore,
    governanceContinuityScore: input.continuityResult?.governanceContinuityScore,
    governanceResilienceScore: result?.governanceResilienceScore,
    recurringDrivers: unique([
      ...(result ? resilienceRecurringDrivers(result) : []),
      ...(input.continuityResult?.continuityWeaknesses ?? []),
      ...(input.continuityResult?.continuityStrengths ?? []),
      ...(input.lineageResult?.weakLineageAreas.map((area) => `Weak lineage area: ${area}.`) ?? []),
    ]),
    stabilizationIndicators: unique([
      ...(input.lineageResult?.stabilizationChains ?? []),
      ...(input.evidenceQualityResult?.stabilizationSupportedAreas.map(
        (area) => `Evidence supports stabilization area: ${area}.`,
      ) ?? []),
      ...(input.resolutionResult?.stabilizedAreas.map((area) => `Resolution stabilized area: ${area}.`) ?? []),
      ...(result?.resilienceStrengths.filter((strength) => normalize(strength).includes("stabil")) ?? []),
    ]),
    fragilityIndicators: unique([
      ...(result?.fragilityIndicators ?? []),
      ...(result?.resilienceWeaknesses ?? []),
      ...(input.continuityResult?.continuityWeaknesses ?? []),
    ]),
    antiFragilityIndicators: unique(result?.antiFragilityIndicators ?? []),
    evidenceLimitations: currentEvidenceLimitations(input),
  };
};

const snapshotFromPrevious = (
  result: ReputationGovernanceResilienceResult,
  input: ReputationGovernanceMemoryInput,
  index: number,
): ReputationGovernanceMemorySnapshot => ({
  snapshotId: `governance-memory-previous-${index + 1}`,
  evaluatedAt: previousEvaluatedAt(input, index),
  resilienceStatus: result.resilienceStatus,
  governanceResilienceScore: result.governanceResilienceScore,
  recurringDrivers: resilienceRecurringDrivers(result),
  stabilizationIndicators: unique([
    ...result.resilienceStrengths.filter((strength) => normalize(strength).includes("stabil")),
    ...result.recoveryIndicators.filter((indicator) => normalize(indicator).includes("stabil")),
  ]),
  fragilityIndicators: unique([...result.fragilityIndicators, ...result.resilienceWeaknesses]),
  antiFragilityIndicators: result.antiFragilityIndicators,
  evidenceLimitations: resilienceEvidenceLimitations(result),
});

const buildSnapshots = (input: ReputationGovernanceMemoryInput): ReputationGovernanceMemorySnapshot[] =>
  [
    ...(snapshotFromCurrent(input) ? [snapshotFromCurrent(input) as ReputationGovernanceMemorySnapshot] : []),
    ...(input.previousResilienceResults ?? []).map((result, index) => snapshotFromPrevious(result, input, index)),
  ];

const repeatedItems = (snapshots: ReputationGovernanceMemorySnapshot[], selector: (snapshot: ReputationGovernanceMemorySnapshot) => string[]): string[] => {
  const counts = new Map<string, { display: string; count: number }>();

  snapshots.forEach((snapshot) => {
    unique(selector(snapshot)).forEach((item) => {
      const key = normalize(item);
      const existing = counts.get(key);
      counts.set(key, { display: existing?.display ?? item, count: (existing?.count ?? 0) + 1 });
    });
  });

  return [...counts.values()]
    .filter((entry) => entry.count >= 2)
    .map((entry) => entry.display);
};

const createPattern = (params: {
  patternType: ReputationGovernanceMemoryPatternType;
  description: string;
  evidence: string[];
  affectedGovernanceDomains: string[];
  affectedBusinessUnits: string[];
  recommendedHumanReview: string;
  factors: string[];
  reasoning: string[];
  occurrenceCount: number;
  baseConfidence?: number;
}): ReputationGovernanceMemoryPattern => {
  const evidence = unique(params.evidence);
  const affectedGovernanceDomains = unique(params.affectedGovernanceDomains);
  const affectedBusinessUnits = unique(params.affectedBusinessUnits);
  const factors = unique(params.factors);

  return {
    id: `governance-memory-${slug(params.patternType)}-${slug(params.description)}`,
    patternType: params.patternType,
    description: params.description,
    evidence,
    affectedGovernanceDomains,
    affectedBusinessUnits,
    confidenceScore: calculateMemoryPatternConfidence({
      occurrenceCount: params.occurrenceCount,
      evidenceCount: evidence.length,
      affectedGovernanceDomainCount: affectedGovernanceDomains.length,
      affectedBusinessUnitCount: affectedBusinessUnits.length,
      factorCount: factors.length,
      baseConfidence: params.baseConfidence,
    }),
    recommendedHumanReview: params.recommendedHumanReview,
    explainability: {
      factors,
      reasoning: params.reasoning,
    },
  };
};

const buildRecurringPatterns = (
  input: ReputationGovernanceMemoryInput,
  snapshots: ReputationGovernanceMemorySnapshot[],
): ReputationGovernanceMemoryPattern[] => {
  const domains = domainsFromInput(input);
  const units = businessUnitsFromInput(input);
  const recurringWeaknesses = repeatedItems(snapshots, (snapshot) => snapshot.fragilityIndicators);
  const recurringStabilization = repeatedItems(snapshots, (snapshot) => snapshot.stabilizationIndicators);
  const recurringEvidenceGaps = repeatedItems(snapshots, (snapshot) => snapshot.evidenceLimitations);
  const recurringAntiFragility = repeatedItems(snapshots, (snapshot) => snapshot.antiFragilityIndicators);
  const recurringDrivers = repeatedItems(snapshots, (snapshot) => snapshot.recurringDrivers);
  const patterns: ReputationGovernanceMemoryPattern[] = [];

  if (recurringWeaknesses.length > 0) {
    patterns.push(
      createPattern({
        patternType: "recurring_governance_weakness",
        description: "Governance weakness indicators recur across supplied evaluation periods.",
        evidence: recurringWeaknesses.slice(0, 8),
        affectedGovernanceDomains: domains,
        affectedBusinessUnits: units,
        recommendedHumanReview: "Review recurring governance weakness indicators before interpreting institutional memory as durable.",
        factors: [`Recurring weakness count: ${recurringWeaknesses.length}.`, `Snapshots reviewed: ${snapshots.length}.`],
        reasoning: ["Repeated weakness indicators suggest durable review areas for institutional governance memory."],
        occurrenceCount: recurringWeaknesses.length,
      }),
    );
  }

  if (recurringStabilization.length > 0) {
    patterns.push(
      createPattern({
        patternType: "recurring_stabilization_success",
        description: "Stabilization indicators recur across supplied evaluation periods.",
        evidence: recurringStabilization.slice(0, 8),
        affectedGovernanceDomains: domains,
        affectedBusinessUnits: units,
        recommendedHumanReview: "Review recurring stabilization indicators and preserve human-reviewed support for future governance context.",
        factors: [`Recurring stabilization count: ${recurringStabilization.length}.`],
        reasoning: ["Repeated stabilization indicators can strengthen long-horizon governance memory when evidence remains reviewable."],
        occurrenceCount: recurringStabilization.length,
        baseConfidence: 60,
      }),
    );
  }

  if (
    recurringWeaknesses.some((weakness) => normalize(weakness).includes("dependency")) ||
    recurringWeaknesses.some((weakness) => normalize(weakness).includes("lineage"))
  ) {
    patterns.push(
      createPattern({
        patternType: "recurring_dependency_fragility",
        description: "Dependency or lineage fragility recurs in supplied governance memory context.",
        evidence: recurringWeaknesses
          .filter((weakness) => normalize(weakness).includes("dependency") || normalize(weakness).includes("lineage"))
          .slice(0, 8),
        affectedGovernanceDomains: domains,
        affectedBusinessUnits: units,
        recommendedHumanReview: "Review recurring dependency fragility and confirm future lineage chains remain traceable.",
        factors: ["Dependency fragility is detected from repeated dependency or lineage indicators."],
        reasoning: ["Repeated dependency fragility can reduce durable governance reviewability."],
        occurrenceCount: recurringWeaknesses.length,
      }),
    );
  }

  if (recurringEvidenceGaps.length > 0) {
    patterns.push(
      createPattern({
        patternType: "recurring_evidence_gap",
        description: "Evidence limitations recur across supplied evaluation periods.",
        evidence: recurringEvidenceGaps.slice(0, 8),
        affectedGovernanceDomains: domains,
        affectedBusinessUnits: units,
        recommendedHumanReview: "Review recurring evidence limitations before using memory context for future governance interpretation.",
        factors: [`Recurring evidence limitation count: ${recurringEvidenceGaps.length}.`],
        reasoning: ["Repeated evidence limitations reduce institutional memory confidence until reviewed by humans."],
        occurrenceCount: recurringEvidenceGaps.length,
      }),
    );
  }

  if (
    recurringEvidenceGaps.some((gap) => normalize(gap).includes("contradiction")) ||
    recurringWeaknesses.some((weakness) => normalize(weakness).includes("contradiction"))
  ) {
    patterns.push(
      createPattern({
        patternType: "recurring_contradiction_chain",
        description: "Contradiction indicators recur across supplied governance memory context.",
        evidence: unique([
          ...recurringEvidenceGaps.filter((gap) => normalize(gap).includes("contradiction")),
          ...recurringWeaknesses.filter((weakness) => normalize(weakness).includes("contradiction")),
        ]).slice(0, 8),
        affectedGovernanceDomains: domains,
        affectedBusinessUnits: units,
        recommendedHumanReview: "Review recurring contradiction indicators with evidence quality and stabilization context.",
        factors: ["Contradiction recurrence is detected from repeated contradiction-related memory indicators."],
        reasoning: ["Recurring contradiction chains can make governance memory less durable without human-reviewed context."],
        occurrenceCount: recurringEvidenceGaps.length + recurringWeaknesses.length,
      }),
    );
  }

  if (recurringAntiFragility.length > 0 || (input.currentResilienceResult?.resilienceStatus === "anti_fragile" && snapshots.length >= 2)) {
    patterns.push(
      createPattern({
        patternType: "anti_fragility_evolution",
        description: "Anti-fragility indicators are present across the supplied governance memory horizon.",
        evidence: unique([
          ...recurringAntiFragility,
          ...(input.currentResilienceResult?.antiFragilityIndicators ?? []),
        ]).slice(0, 10),
        affectedGovernanceDomains: domains,
        affectedBusinessUnits: units,
        recommendedHumanReview: "Continue human monitoring of anti-fragility indicators before treating them as durable institutional memory.",
        factors: [`Recurring anti-fragility count: ${recurringAntiFragility.length}.`],
        reasoning: ["Anti-fragility indicators can improve institutional memory when they remain traceable across periods."],
        occurrenceCount: Math.max(1, recurringAntiFragility.length),
        baseConfidence: 62,
      }),
    );
  }

  const stableSnapshots = snapshots.filter((snapshot) =>
    ["resilient", "anti_fragile"].includes(snapshot.resilienceStatus ?? ""),
  );

  if (stableSnapshots.length >= 2 || recurringDrivers.length > 0) {
    patterns.push(
      createPattern({
        patternType: "continuity_preservation_indicator",
        description: "Continuity or resilience preservation indicators recur across supplied memory snapshots.",
        evidence: unique([
          ...stableSnapshots.map((snapshot) => `${snapshot.snapshotId}: resilience status ${snapshot.resilienceStatus}.`),
          ...recurringDrivers.slice(0, 6),
        ]),
        affectedGovernanceDomains: domains,
        affectedBusinessUnits: units,
        recommendedHumanReview: "Review continuity preservation indicators and compare them against current evidence limitations.",
        factors: [`Stable or stronger snapshots: ${stableSnapshots.length}.`, `Recurring driver count: ${recurringDrivers.length}.`],
        reasoning: ["Repeated preservation indicators can support reliable long-horizon governance context."],
        occurrenceCount: stableSnapshots.length + recurringDrivers.length,
        baseConfidence: 60,
      }),
    );
  }

  return patterns;
};

const buildGovernanceLessons = (patterns: ReputationGovernanceMemoryPattern[]): string[] =>
  unique([
    ...patterns.map((pattern) => {
      switch (pattern.patternType) {
        case "recurring_governance_weakness":
          return "Recurring governance weakness indicators should remain visible in future human review cycles.";
        case "recurring_stabilization_success":
          return "Repeated stabilization indicators appear helpful when supported by traceable evidence.";
        case "recurring_dependency_fragility":
          return "Dependency and lineage fragility should be reviewed before treating governance memory as durable.";
        case "recurring_evidence_gap":
          return "Recurring evidence limitations reduce memory confidence until supporting evidence is refreshed or reviewed.";
        case "recurring_contradiction_chain":
          return "Recurring contradiction indicators should be compared against stabilization and evidence quality context.";
        case "anti_fragility_evolution":
          return "Anti-fragility indicators may become durable institutional signals when they remain explainable across periods.";
        case "continuity_preservation_indicator":
          return "Continuity preservation indicators can support long-horizon governance context when current reviewability remains strong.";
      }
    }),
  ]);

const buildLongHorizonContext = (
  snapshots: ReputationGovernanceMemorySnapshot[],
  patterns: ReputationGovernanceMemoryPattern[],
): string[] =>
  unique([
    `Governance memory reviewed ${snapshots.length} read-only snapshots.`,
    ...patterns.slice(0, 8).map((pattern) => `${pattern.patternType}: ${pattern.description}`),
    ...snapshots
      .slice(0, 5)
      .map(
        (snapshot) =>
          `${snapshot.snapshotId} captured resilience ${snapshot.resilienceStatus ?? "not_supplied"} and continuity ${snapshot.continuityStatus ?? "not_supplied"}.`,
      ),
  ]);

const buildContinuityLearningIndicators = (
  input: ReputationGovernanceMemoryInput,
  snapshots: ReputationGovernanceMemorySnapshot[],
): string[] =>
  unique([
    ...(input.continuityResult?.continuityStrengths.map((strength) => `Continuity strength: ${strength}`) ?? []),
    ...(input.continuityResult?.continuityWeaknesses.map((weakness) => `Continuity weakness: ${weakness}`) ?? []),
    ...(snapshots.filter((snapshot) => snapshot.governanceContinuityScore !== undefined).length >= 1
      ? ["Continuity score history is available for current memory review."]
      : []),
    ...repeatedItems(snapshots, (snapshot) => snapshot.recurringDrivers).map(
      (driver) => `Recurring continuity or resilience driver: ${driver}`,
    ),
  ]);

const buildResilienceLearningIndicators = (
  input: ReputationGovernanceMemoryInput,
  snapshots: ReputationGovernanceMemorySnapshot[],
): string[] =>
  unique([
    ...(input.currentResilienceResult?.recoveryIndicators.map((indicator) => `Recovery indicator: ${indicator}`) ?? []),
    ...(input.currentResilienceResult?.fragilityIndicators.map((indicator) => `Fragility indicator: ${indicator}`) ?? []),
    ...(input.currentResilienceResult?.antiFragilityIndicators.map(
      (indicator) => `Anti-fragility indicator: ${indicator}`,
    ) ?? []),
    ...(snapshots.filter((snapshot) => snapshot.governanceResilienceScore !== undefined).length >= 2
      ? ["Resilience score history is available across multiple supplied snapshots."]
      : []),
  ]);

const buildArchitectureImprovementReview = (
  input: ReputationGovernanceMemoryInput,
  snapshots: ReputationGovernanceMemorySnapshot[],
): ReputationArchitectureImprovementItem[] => {
  const items: ReputationArchitectureImprovementItem[] = [
    {
      id: "architecture-memory-input-completeness",
      classification: !input.continuityResult || !input.lineageResult ? "immediate" : "optional_optimization",
      area: "explainability gaps",
      observation: "Memory confidence is stronger when continuity and lineage results are supplied with current resilience context.",
      recommendedHumanReview: "Confirm continuity and lineage results are included before relying on governance memory status.",
    },
    {
      id: "architecture-shared-reputation-utilities",
      classification: "future_upgrade",
      area: "reusable infrastructure opportunities",
      observation: "Governance memory repeats small deterministic helpers already present in lineage, continuity, and resilience modules.",
      recommendedHumanReview: "Consider a narrow shared reputation utility module after the current strict build sequence stabilizes.",
    },
    {
      id: "architecture-evidence-traceability-contract",
      classification: "future_upgrade",
      area: "dependency fragility",
      observation: "Future durable memory would benefit from a formal evidence traceability contract rather than only downstream lineage and evidence quality context.",
      recommendedHumanReview: "Review a concrete evidence traceability type contract before connecting memory to storage or orchestration-adjacent layers.",
    },
    {
      id: "architecture-read-only-memory-boundary",
      classification: "optional_optimization",
      area: "orchestration contamination risks",
      observation: "This memory layer is a pure read-only intelligence engine and does not persist snapshots or execute autonomous memory writes.",
      recommendedHumanReview: "Keep any future storage integration behind explicit human-reviewed approval and separate from pure scoring engines.",
    },
  ];

  if (snapshots.length < 2) {
    items.push({
      id: "architecture-historical-depth",
      classification: "future_upgrade",
      area: "long-horizon durability",
      observation: "Institutional memory remains thin when fewer than two historical snapshots are supplied.",
      recommendedHumanReview: "Provide additional approved historical resilience snapshots before relying on long-horizon memory conclusions.",
    });
  }

  return items;
};

export function analyzeEnterpriseReputationGovernanceMemory(
  input: ReputationGovernanceMemoryInput,
): ReputationGovernanceMemoryResult {
  const snapshotsReviewed = buildSnapshots(input);
  const recurringPatterns = buildRecurringPatterns(input, snapshotsReviewed);
  const governanceLessons = buildGovernanceLessons(recurringPatterns);
  const longHorizonContext = buildLongHorizonContext(snapshotsReviewed, recurringPatterns);
  const continuityLearningIndicators = buildContinuityLearningIndicators(input, snapshotsReviewed);
  const resilienceLearningIndicators = buildResilienceLearningIndicators(input, snapshotsReviewed);
  const architectureImprovementReview = buildArchitectureImprovementReview(input, snapshotsReviewed);
  const memoryConfidenceScore = calculateGovernanceMemoryConfidenceScore({
    input,
    snapshots: snapshotsReviewed,
    recurringPatterns,
    continuityLearningIndicators,
    resilienceLearningIndicators,
  });
  const resultWithoutExplainability = {
    memoryConfidenceScore,
    institutionalMemoryStatus: institutionalMemoryStatusFromScore(memoryConfidenceScore),
    snapshotsReviewed,
    recurringPatterns,
    governanceLessons,
    longHorizonContext,
    continuityLearningIndicators,
    resilienceLearningIndicators,
    architectureImprovementReview,
  };

  return {
    ...resultWithoutExplainability,
    recommendations: buildGovernanceMemoryRecommendations(resultWithoutExplainability),
    explainability: buildGovernanceMemoryExplainability({ input, result: resultWithoutExplainability }),
  };
}

export const getEnterpriseReputationGovernanceMemoryIntelligence =
  analyzeEnterpriseReputationGovernanceMemory;
