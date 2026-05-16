import type { CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import {
  calculateCorridorConfidence,
  createCorridorWarning,
  normalizeCorridorScore,
} from "./corridor-intelligence-utils";

export type ResilienceLevel = "fragile" | "exposed" | "recoverable" | "resilient" | "anti_fragile";

export type EnterpriseResilienceAntifragilityInput = {
  operationalResilienceScore?: number;
  governanceResilienceScore?: number;
  strategicResilienceScore?: number;
  scalingFragilityScore?: number;
  recoveryReadinessScore?: number;
  leadershipSurvivabilityScore?: number;
  antiFragilityScore?: number;
  expansionStressDurabilityScore?: number;
  institutionalStressScore?: number;
  enterpriseResilienceMaturityScore?: number;
  enterpriseRiskProfile?: unknown;
  enterpriseStrategicRenewalProfile?: unknown;
  enterpriseStrategicReviewProfile?: unknown;
  enterpriseExpansionGovernanceProfile?: unknown;
  enterpriseInstitutionalCohesionProfile?: unknown;
  enterpriseStrategicConsistencyProfile?: unknown;
  enterpriseOperatingRhythmProfile?: unknown;
  founderDependencyProfile?: unknown;
  legacyContinuityProfile?: unknown;
  longHorizonWealthPreservationProfile?: unknown;
  strategicTreasuryProfile?: unknown;
  dataQualityScore?: number;
  assumptions?: string[];
};

export type EnterpriseResilienceAntifragilityScoreBreakdown = CorridorScoreBreakdown & {
  overallScore: number;
  operationalResilienceScore: number;
  governanceResilienceScore: number;
  strategicResilienceScore: number;
  scalingFragilityScore: number;
  recoveryReadinessScore: number;
  leadershipSurvivabilityScore: number;
  antiFragilityScore: number;
  expansionStressDurabilityScore: number;
  institutionalStressScore: number;
  enterpriseResilienceMaturityScore: number;
};

export type EnterpriseResilienceAntifragilityResult = {
  overallResilienceScore: number;
  resilienceLevel: ResilienceLevel;
  operationalResilienceScore: number;
  governanceResilienceScore: number;
  strategicResilienceScore: number;
  scalingFragilityScore: number;
  recoveryReadinessScore: number;
  leadershipSurvivabilityScore: number;
  antiFragilityScore: number;
  expansionStressDurabilityScore: number;
  institutionalStressScore: number;
  enterpriseResilienceMaturityScore: number;
  confidenceScore: number;
  scoreBreakdown: EnterpriseResilienceAntifragilityScoreBreakdown;
  keyRisks: string[];
  strengths: string[];
  recommendations: string[];
  resilienceWarnings: string[];
  reusableInfrastructureNotes: string[];
  explanation: string[];
  trace: string[];
  warnings: CorridorWarning[];
  missingData: string[];
  assumptions: string[];
  safety: {
    readOnly: true;
    outreachGenerated: false;
    smsGenerated: false;
    emailGenerated: false;
    twilioTouched: false;
    dbWrites: false;
    schemaChanges: false;
    automationExecution: false;
    autonomousStrategyDecisions: false;
    autonomousResilienceActions: false;
    autonomousMitigationActions: false;
    autonomousOptimizationActions: false;
    autonomousManagementDecisions: false;
    legalAdvice: false;
    hrAdvice: false;
    ownershipAdvice: false;
    taxAdvice: false;
    lendingAdvice: false;
    investmentAdvice: false;
    portfolioManagementAdvice: false;
    demographicTargetingUsed: false;
    protectedClassLogicUsed: false;
    externalDataUsed: false;
    scrapingUsed: false;
    marketPrediction: false;
  };
};

const REQUIRED_INPUTS = [
  "operationalResilienceScore",
  "governanceResilienceScore",
  "strategicResilienceScore",
  "scalingFragilityScore",
  "recoveryReadinessScore",
  "leadershipSurvivabilityScore",
  "antiFragilityScore",
  "expansionStressDurabilityScore",
  "institutionalStressScore",
  "enterpriseResilienceMaturityScore",
] as const;

const unique = (items: string[]): string[] => [...new Set(items)];

const weightedAverage = (entries: Array<[number, number]>): number => {
  const totals = entries.reduce(
    (acc, [score, weight]) => ({
      weighted: acc.weighted + normalizeCorridorScore(score) * weight,
      weight: acc.weight + weight,
    }),
    { weighted: 0, weight: 0 },
  );

  return totals.weight === 0 ? 0 : Math.round(totals.weighted / totals.weight);
};

const getPath = (source: unknown, path: string): unknown => {
  if (!source || typeof source !== "object") return undefined;

  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[key];
  }, source);
};

const extractProfileScore = (source: unknown, paths: string[], fallback = 50): number => {
  for (const path of paths) {
    const value = getPath(source, path);
    if (typeof value === "number" && Number.isFinite(value)) {
      return normalizeCorridorScore(value);
    }
  }

  return fallback;
};

const hasProfileScore = (source: unknown, paths: string[]): boolean =>
  paths.some((path) => typeof getPath(source, path) === "number");

const getScore = (
  input: EnterpriseResilienceAntifragilityInput,
  key: keyof EnterpriseResilienceAntifragilityInput,
  fallback: number,
): number => {
  const value = input[key];
  return typeof value === "number" && Number.isFinite(value)
    ? normalizeCorridorScore(value)
    : normalizeCorridorScore(fallback);
};

const hasFallbackForInput = (
  input: EnterpriseResilienceAntifragilityInput,
  key: (typeof REQUIRED_INPUTS)[number],
): boolean => {
  switch (key) {
    case "operationalResilienceScore":
      return (
        hasProfileScore(input.enterpriseRiskProfile, [
          "operationalContinuityResilience",
          "operationalContinuityResilienceScore",
          "defensiveOperationalResilience",
          "defensiveOperationalResilienceScore",
        ]) ||
        hasProfileScore(input.enterpriseExpansionGovernanceProfile, [
          "operationalGovernanceResilience",
          "operationalGovernanceResilienceScore",
        ]) ||
        hasProfileScore(input.strategicTreasuryProfile, [
          "operationalContinuityStrength",
          "operationalContinuityStrengthScore",
          "continuitySustainabilityQuality",
          "continuitySustainabilityScore",
        ])
      );
    case "governanceResilienceScore":
      return (
        hasProfileScore(input.enterpriseExpansionGovernanceProfile, [
          "governanceDurability",
          "governanceDurabilityScore",
          "defensiveGovernanceResilience",
          "defensiveGovernanceResilienceScore",
          "humanReviewGovernanceAlignment",
          "humanReviewGovernanceAlignmentScore",
        ]) ||
        hasProfileScore(input.enterpriseRiskProfile, [
          "governanceFragilityExposure",
          "governanceFragilityExposureScore",
        ]) ||
        hasProfileScore(input.enterpriseStrategicReviewProfile, [
          "governanceReviewScore",
          "strategicReviewMaturityScore",
        ])
      );
    case "strategicResilienceScore":
      return (
        hasProfileScore(input.enterpriseRiskProfile, [
          "strategicSurvivabilityQuality",
          "strategicSurvivabilityQualityScore",
          "systemicSurvivabilityBalance",
          "systemicSurvivabilityBalanceScore",
        ]) ||
        hasProfileScore(input.enterpriseStrategicRenewalProfile, [
          "overallRenewalScore",
          "longHorizonRenewalScore",
        ]) ||
        hasProfileScore(input.enterpriseStrategicConsistencyProfile, [
          "overallConsistencyScore",
          "longHorizonConsistencyScore",
        ])
      );
    case "scalingFragilityScore":
      return (
        hasProfileScore(input.enterpriseRiskProfile, ["expansionFragility", "expansionFragilityScore"]) ||
        hasProfileScore(input.enterpriseInstitutionalCohesionProfile, [
          "fragmentationRiskScore",
          "scalingCoherenceScore",
        ]) ||
        hasProfileScore(input.enterpriseStrategicRenewalProfile, ["stagnationRiskScore"]) ||
        hasProfileScore(input.enterpriseExpansionGovernanceProfile, [
          "expansionControlQuality",
          "expansionControlQualityScore",
        ])
      );
    case "recoveryReadinessScore":
      return (
        hasProfileScore(input.enterpriseOperatingRhythmProfile, ["crisisCadenceReadinessScore"]) ||
        hasProfileScore(input.enterpriseRiskProfile, [
          "operationalContinuityResilience",
          "operationalContinuityResilienceScore",
        ]) ||
        hasProfileScore(input.strategicTreasuryProfile, [
          "continuitySustainabilityQuality",
          "continuitySustainabilityScore",
        ]) ||
        hasProfileScore(input.legacyContinuityProfile, ["overallContinuityScore"])
      );
    case "leadershipSurvivabilityScore":
      return (
        hasProfileScore(input.founderDependencyProfile, [
          "continuityReadinessScore",
          "backupLeadershipReadinessScore",
        ]) ||
        hasProfileScore(input.legacyContinuityProfile, ["successionReadiness", "overallContinuityScore"]) ||
        hasProfileScore(input.enterpriseInstitutionalCohesionProfile, ["organizationalCohesionScore"])
      );
    case "antiFragilityScore":
      return (
        hasProfileScore(input.enterpriseStrategicRenewalProfile, [
          "overallRenewalScore",
          "innovationBalanceScore",
          "longHorizonRenewalScore",
        ]) ||
        hasProfileScore(input.longHorizonWealthPreservationProfile, [
          "longHorizonPreservationQuality",
          "longHorizonPreservationScore",
        ])
      );
    case "expansionStressDurabilityScore":
      return (
        hasProfileScore(input.enterpriseExpansionGovernanceProfile, [
          "defensiveGovernanceResilience",
          "defensiveGovernanceResilienceScore",
          "expansionOversightQuality",
          "expansionOversightQualityScore",
        ]) ||
        hasProfileScore(input.enterpriseRiskProfile, ["expansionFragility", "expansionFragilityScore"]) ||
        hasProfileScore(input.enterpriseStrategicRenewalProfile, ["expansionAdaptationScore"])
      );
    case "institutionalStressScore":
      return (
        hasProfileScore(input.enterpriseRiskProfile, [
          "institutionalStabilityDurability",
          "institutionalStabilityDurabilityScore",
          "systemicSurvivabilityBalance",
          "systemicSurvivabilityBalanceScore",
        ]) ||
        hasProfileScore(input.enterpriseInstitutionalCohesionProfile, [
          "overallCohesionScore",
          "institutionalIdentityScore",
        ]) ||
        hasProfileScore(input.longHorizonWealthPreservationProfile, [
          "institutionalContinuityDurability",
          "institutionalContinuityDurabilityScore",
        ])
      );
    case "enterpriseResilienceMaturityScore":
      return (
        hasProfileScore(input.enterpriseRiskProfile, [
          "enterpriseRiskDurability",
          "enterpriseRiskDurabilityScore",
        ]) ||
        hasProfileScore(input.enterpriseStrategicRenewalProfile, ["strategicRenewalMaturityScore"]) ||
        hasProfileScore(input.enterpriseInstitutionalCohesionProfile, ["overallCohesionScore"]) ||
        hasProfileScore(input.longHorizonWealthPreservationProfile, [
          "longHorizonPreservationQuality",
          "longHorizonPreservationScore",
        ])
      );
  }
};

const getMissingData = (input: EnterpriseResilienceAntifragilityInput): string[] =>
  REQUIRED_INPUTS.filter((key) => typeof input[key] !== "number" && !hasFallbackForInput(input, key));

const buildScoreBreakdown = (
  input: EnterpriseResilienceAntifragilityInput,
): EnterpriseResilienceAntifragilityScoreBreakdown => {
  const operationalResilienceScore = getScore(
    input,
    "operationalResilienceScore",
    weightedAverage([
      [
        extractProfileScore(input.enterpriseRiskProfile, [
          "operationalContinuityResilience",
          "operationalContinuityResilienceScore",
        ]),
        1.2,
      ],
      [
        extractProfileScore(input.enterpriseRiskProfile, [
          "defensiveOperationalResilience",
          "defensiveOperationalResilienceScore",
        ]),
        1,
      ],
      [
        extractProfileScore(input.enterpriseExpansionGovernanceProfile, [
          "operationalGovernanceResilience",
          "operationalGovernanceResilienceScore",
        ]),
        0.9,
      ],
      [
        extractProfileScore(input.strategicTreasuryProfile, [
          "operationalContinuityStrength",
          "operationalContinuityStrengthScore",
        ]),
        0.8,
      ],
    ]),
  );

  const governanceResilienceScore = getScore(
    input,
    "governanceResilienceScore",
    weightedAverage([
      [
        extractProfileScore(input.enterpriseExpansionGovernanceProfile, [
          "governanceDurability",
          "governanceDurabilityScore",
        ]),
        1.1,
      ],
      [
        extractProfileScore(input.enterpriseExpansionGovernanceProfile, [
          "defensiveGovernanceResilience",
          "defensiveGovernanceResilienceScore",
        ]),
        1,
      ],
      [
        100 -
          extractProfileScore(input.enterpriseRiskProfile, [
            "governanceFragilityExposure",
            "governanceFragilityExposureScore",
          ]),
        0.9,
      ],
      [
        extractProfileScore(input.enterpriseStrategicReviewProfile, [
          "governanceReviewScore",
          "strategicReviewMaturityScore",
        ]),
        0.8,
      ],
    ]),
  );

  const strategicResilienceScore = getScore(
    input,
    "strategicResilienceScore",
    weightedAverage([
      [
        extractProfileScore(input.enterpriseRiskProfile, [
          "strategicSurvivabilityQuality",
          "strategicSurvivabilityQualityScore",
        ]),
        1.1,
      ],
      [
        extractProfileScore(input.enterpriseRiskProfile, [
          "systemicSurvivabilityBalance",
          "systemicSurvivabilityBalanceScore",
        ]),
        1,
      ],
      [extractProfileScore(input.enterpriseStrategicRenewalProfile, ["overallRenewalScore"]), 0.9],
      [
        extractProfileScore(input.enterpriseStrategicConsistencyProfile, [
          "overallConsistencyScore",
          "longHorizonConsistencyScore",
        ]),
        0.8,
      ],
    ]),
  );

  const scalingFragilityScore = getScore(
    input,
    "scalingFragilityScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseRiskProfile, ["expansionFragility", "expansionFragilityScore"]), 1.2],
      [extractProfileScore(input.enterpriseInstitutionalCohesionProfile, ["fragmentationRiskScore"]), 1],
      [extractProfileScore(input.enterpriseStrategicRenewalProfile, ["stagnationRiskScore"]), 0.8],
      [
        100 -
          extractProfileScore(input.enterpriseExpansionGovernanceProfile, [
            "expansionControlQuality",
            "expansionControlQualityScore",
          ]),
        0.8,
      ],
      [100 - extractProfileScore(input.enterpriseInstitutionalCohesionProfile, ["scalingCoherenceScore"]), 0.7],
    ]),
  );

  const recoveryReadinessScore = getScore(
    input,
    "recoveryReadinessScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseOperatingRhythmProfile, ["crisisCadenceReadinessScore"]), 1],
      [
        extractProfileScore(input.enterpriseRiskProfile, [
          "operationalContinuityResilience",
          "operationalContinuityResilienceScore",
        ]),
        1,
      ],
      [
        extractProfileScore(input.strategicTreasuryProfile, [
          "continuitySustainabilityQuality",
          "continuitySustainabilityScore",
        ]),
        0.9,
      ],
      [extractProfileScore(input.legacyContinuityProfile, ["overallContinuityScore"]), 0.8],
    ]),
  );

  const leadershipSurvivabilityScore = getScore(
    input,
    "leadershipSurvivabilityScore",
    weightedAverage([
      [extractProfileScore(input.founderDependencyProfile, ["continuityReadinessScore"]), 1],
      [extractProfileScore(input.founderDependencyProfile, ["backupLeadershipReadinessScore"]), 0.9],
      [extractProfileScore(input.legacyContinuityProfile, ["successionReadiness", "overallContinuityScore"]), 0.9],
      [extractProfileScore(input.enterpriseInstitutionalCohesionProfile, ["organizationalCohesionScore"]), 0.7],
    ]),
  );

  const antiFragilityScore = getScore(
    input,
    "antiFragilityScore",
    weightedAverage([
      [extractProfileScore(input.enterpriseStrategicRenewalProfile, ["overallRenewalScore"]), 1],
      [extractProfileScore(input.enterpriseStrategicRenewalProfile, ["innovationBalanceScore"]), 0.9],
      [extractProfileScore(input.enterpriseStrategicRenewalProfile, ["longHorizonRenewalScore"]), 0.9],
      [
        extractProfileScore(input.longHorizonWealthPreservationProfile, [
          "longHorizonPreservationQuality",
          "longHorizonPreservationScore",
        ]),
        0.7,
      ],
    ]),
  );

  const expansionStressDurabilityScore = getScore(
    input,
    "expansionStressDurabilityScore",
    weightedAverage([
      [
        extractProfileScore(input.enterpriseExpansionGovernanceProfile, [
          "defensiveGovernanceResilience",
          "defensiveGovernanceResilienceScore",
        ]),
        1,
      ],
      [
        extractProfileScore(input.enterpriseExpansionGovernanceProfile, [
          "expansionOversightQuality",
          "expansionOversightQualityScore",
        ]),
        0.9,
      ],
      [100 - extractProfileScore(input.enterpriseRiskProfile, ["expansionFragility", "expansionFragilityScore"]), 1],
      [extractProfileScore(input.enterpriseStrategicRenewalProfile, ["expansionAdaptationScore"]), 0.8],
    ]),
  );

  const institutionalStressScore = getScore(
    input,
    "institutionalStressScore",
    weightedAverage([
      [
        extractProfileScore(input.enterpriseRiskProfile, [
          "institutionalStabilityDurability",
          "institutionalStabilityDurabilityScore",
        ]),
        1,
      ],
      [
        extractProfileScore(input.enterpriseRiskProfile, [
          "systemicSurvivabilityBalance",
          "systemicSurvivabilityBalanceScore",
        ]),
        1,
      ],
      [extractProfileScore(input.enterpriseInstitutionalCohesionProfile, ["overallCohesionScore"]), 0.9],
      [extractProfileScore(input.enterpriseInstitutionalCohesionProfile, ["institutionalIdentityScore"]), 0.7],
    ]),
  );

  const enterpriseResilienceMaturityScore = getScore(
    input,
    "enterpriseResilienceMaturityScore",
    weightedAverage([
      [
        extractProfileScore(input.enterpriseRiskProfile, [
          "enterpriseRiskDurability",
          "enterpriseRiskDurabilityScore",
        ]),
        1,
      ],
      [extractProfileScore(input.enterpriseStrategicRenewalProfile, ["strategicRenewalMaturityScore"]), 1],
      [extractProfileScore(input.enterpriseInstitutionalCohesionProfile, ["overallCohesionScore"]), 0.8],
      [
        extractProfileScore(input.longHorizonWealthPreservationProfile, [
          "longHorizonPreservationQuality",
          "longHorizonPreservationScore",
        ]),
        0.7,
      ],
    ]),
  );

  return {
    connectivityScore: recoveryReadinessScore,
    durabilityScore: weightedAverage([
      [operationalResilienceScore, 0.25],
      [governanceResilienceScore, 0.2],
      [strategicResilienceScore, 0.2],
      [100 - scalingFragilityScore, 0.2],
      [enterpriseResilienceMaturityScore, 0.15],
    ]),
    expansionScore: expansionStressDurabilityScore,
    institutionalScore: institutionalStressScore,
    logisticsScore: operationalResilienceScore,
    luxuryScore: antiFragilityScore,
    developmentScore: strategicResilienceScore,
    overallScore: weightedAverage([
      [operationalResilienceScore, 1.1],
      [governanceResilienceScore, 1],
      [strategicResilienceScore, 1],
      [100 - scalingFragilityScore, 1],
      [recoveryReadinessScore, 1],
      [leadershipSurvivabilityScore, 0.9],
      [antiFragilityScore, 0.9],
      [expansionStressDurabilityScore, 0.9],
      [institutionalStressScore, 0.9],
      [enterpriseResilienceMaturityScore, 1],
    ]),
    operationalResilienceScore,
    governanceResilienceScore,
    strategicResilienceScore,
    scalingFragilityScore,
    recoveryReadinessScore,
    leadershipSurvivabilityScore,
    antiFragilityScore,
    expansionStressDurabilityScore,
    institutionalStressScore,
    enterpriseResilienceMaturityScore,
  };
};

const classifyResilience = (overallScore: number, scalingFragilityScore: number): ResilienceLevel => {
  if (overallScore >= 82 && scalingFragilityScore <= 28) return "anti_fragile";
  if (overallScore >= 68 && scalingFragilityScore <= 42) return "resilient";
  if (overallScore >= 54 && scalingFragilityScore <= 58) return "recoverable";
  if (overallScore >= 40 && scalingFragilityScore <= 72) return "exposed";
  return "fragile";
};

const buildWarnings = (
  breakdown: EnterpriseResilienceAntifragilityScoreBreakdown,
  missingData: string[],
): CorridorWarning[] => {
  const warnings: CorridorWarning[] = [];

  if (missingData.length > 0) {
    warnings.push(
      createCorridorWarning({
        code: "missing_resilience_inputs",
        severity: "medium",
        message: `Missing direct resilience inputs: ${missingData.join(", ")}. Deterministic fallbacks were used where available.`,
        category: "institutional",
        requiresHumanReview: true,
      }),
    );
  }

  if (breakdown.overallScore < 42) {
    warnings.push(
      createCorridorWarning({
        code: "low_resilience_score",
        severity: "high",
        message:
          "Overall resilience is weak; review continuity, recovery, governance, and stress-readiness inputs before relying on this assessment.",
        category: "institutional",
        requiresHumanReview: true,
      }),
    );
  }

  if (breakdown.scalingFragilityScore >= 72) {
    warnings.push(
      createCorridorWarning({
        code: "high_scaling_fragility",
        severity: "high",
        message: "Scaling fragility is elevated; expansion and growth assumptions should receive human governance review.",
        category: "institutional",
        requiresHumanReview: true,
      }),
    );
  }

  if (breakdown.operationalResilienceScore < 45) {
    warnings.push(
      createCorridorWarning({
        code: "operational_resilience_gap",
        severity: "medium",
        message:
          "Operational resilience is below durable range; recovery procedures and continuity checkpoints should be reviewed.",
        category: "institutional",
        requiresHumanReview: true,
      }),
    );
  }

  if (breakdown.leadershipSurvivabilityScore < 45) {
    warnings.push(
      createCorridorWarning({
        code: "leadership_survivability_gap",
        severity: "medium",
        message:
          "Leadership survivability is below durable range; review key-person continuity and backup leadership readiness without creating HR or legal directives.",
        category: "institutional",
        requiresHumanReview: true,
      }),
    );
  }

  return warnings;
};

const buildKeyRisks = (breakdown: EnterpriseResilienceAntifragilityScoreBreakdown): string[] => {
  const risks: string[] = [];

  if (breakdown.scalingFragilityScore >= 60) {
    risks.push("Scaling fragility may reduce durability under expansion stress or operational load.");
  }
  if (breakdown.operationalResilienceScore < 55) {
    risks.push("Operational resilience may be insufficient for disruption recovery or continuity pressure.");
  }
  if (breakdown.governanceResilienceScore < 55) {
    risks.push("Governance resilience may not provide enough review discipline during stress events.");
  }
  if (breakdown.leadershipSurvivabilityScore < 55) {
    risks.push("Leadership survivability may be too dependent on a narrow set of people or undocumented handoffs.");
  }
  if (breakdown.antiFragilityScore < 55) {
    risks.push("Anti-fragility maturity may be limited; stress events may not reliably produce institutional learning.");
  }

  return unique(risks);
};

const buildStrengths = (breakdown: EnterpriseResilienceAntifragilityScoreBreakdown): string[] => {
  const strengths: string[] = [];

  if (breakdown.operationalResilienceScore >= 72) {
    strengths.push("Operational resilience appears durable enough to support disruption recovery review.");
  }
  if (breakdown.governanceResilienceScore >= 72) {
    strengths.push("Governance resilience appears strong and supports human-reviewed stress oversight.");
  }
  if (breakdown.strategicResilienceScore >= 72) {
    strengths.push("Strategic resilience appears aligned with long-horizon continuity and survivability.");
  }
  if (breakdown.scalingFragilityScore <= 35) {
    strengths.push("Scaling fragility appears contained relative to current resilience signals.");
  }
  if (breakdown.enterpriseResilienceMaturityScore >= 72) {
    strengths.push("Enterprise resilience maturity appears institutionally durable and reviewable.");
  }

  return unique(strengths);
};

const buildRecommendations = (breakdown: EnterpriseResilienceAntifragilityScoreBreakdown): string[] => {
  const recommendations: string[] = [];

  if (breakdown.operationalResilienceScore < 65) {
    recommendations.push("Review operational recovery readiness and document human-reviewed continuity checkpoints.");
  }
  if (breakdown.governanceResilienceScore < 65) {
    recommendations.push(
      "Review governance resilience and stress-review cadence; this is not legal, HR, ownership, or tax advice.",
    );
  }
  if (breakdown.scalingFragilityScore > 45) {
    recommendations.push(
      "Review scaling fragility drivers before expansion discussions; do not treat this as an autonomous strategy decision.",
    );
  }
  if (breakdown.recoveryReadinessScore < 65) {
    recommendations.push("Review recovery readiness scenarios and ensure continuity steps remain human-approved.");
  }
  if (breakdown.institutionalStressScore < 65) {
    recommendations.push(
      "Review institutional stress durability without creating investment, lending, or portfolio-management recommendations.",
    );
  }

  recommendations.push("Use this module as a read-only governance review signal, not as an execution or mitigation system.");

  return unique(recommendations);
};

const buildExplanation = (
  breakdown: EnterpriseResilienceAntifragilityScoreBreakdown,
  resilienceLevel: ResilienceLevel,
): string[] => [
  `Overall resilience score is ${breakdown.overallScore}, classified as ${resilienceLevel}.`,
  `Operational resilience ${breakdown.operationalResilienceScore}, governance resilience ${breakdown.governanceResilienceScore}, and strategic resilience ${breakdown.strategicResilienceScore} anchor core durability.`,
  `Scaling fragility is ${breakdown.scalingFragilityScore}; the overall score treats lower fragility as stronger resilience.`,
  `Recovery readiness ${breakdown.recoveryReadinessScore}, leadership survivability ${breakdown.leadershipSurvivabilityScore}, and institutional stress durability ${breakdown.institutionalStressScore} inform stress survivability.`,
  "The module is deterministic, explainable, read-only, and limited to human-reviewed governance improvement signals.",
];

const buildTrace = (
  input: EnterpriseResilienceAntifragilityInput,
  breakdown: EnterpriseResilienceAntifragilityScoreBreakdown,
): string[] => [
  "Normalized all direct numeric inputs to a 0-100 deterministic scoring range.",
  "Used existing read-only enterprise risk, renewal, expansion governance, cohesion, rhythm, continuity, and treasury profiles only as optional fallback signals.",
  `Computed operationalResilienceScore=${breakdown.operationalResilienceScore}, governanceResilienceScore=${breakdown.governanceResilienceScore}, strategicResilienceScore=${breakdown.strategicResilienceScore}.`,
  `Computed scalingFragilityScore=${breakdown.scalingFragilityScore}; lower scaling fragility improves the overall resilience calculation.`,
  `Computed overallResilienceScore=${breakdown.overallScore} with confidence adjusted by data coverage and optional dataQualityScore=${typeof input.dataQualityScore === "number" ? normalizeCorridorScore(input.dataQualityScore) : "not provided"}.`,
  "No outreach, database writes, schema changes, automation execution, market prediction, or financial/legal/HR advice was generated.",
];

const buildReusableInfrastructureNotes = (input: EnterpriseResilienceAntifragilityInput): string[] => {
  const notes = [
    "Reuses corridor scoring utilities for normalization, warnings, and confidence.",
    "Designed as a pure TypeScript module with structured inputs and explainable outputs.",
  ];

  if (input.enterpriseRiskProfile) {
    notes.push("Can consume the enterprise risk layer as a read-only resilience and fragility signal.");
  }
  if (input.enterpriseStrategicRenewalProfile) {
    notes.push("Can consume strategic renewal intelligence as a read-only adaptation and anti-fragility signal.");
  }
  if (input.enterpriseExpansionGovernanceProfile) {
    notes.push("Can consume expansion governance intelligence as a read-only governance stress signal.");
  }
  if (input.enterpriseInstitutionalCohesionProfile) {
    notes.push("Can consume institutional cohesion intelligence as a read-only fragmentation and identity durability signal.");
  }

  return notes;
};

const buildAssumptions = (
  input: EnterpriseResilienceAntifragilityInput,
  missingData: string[],
): string[] =>
  unique([
    ...(input.assumptions ?? []),
    "All input scores are deterministic structured signals supplied by upstream human-reviewed systems.",
    "No live market, banking, financial, demographic, protected-class, or scraped data is used.",
    ...(missingData.length > 0
      ? ["Some resilience dimensions were inferred from available read-only profile fallbacks or neutral deterministic defaults."]
      : []),
  ]);

export function analyzeEnterpriseResilienceAntifragility(
  input: EnterpriseResilienceAntifragilityInput = {},
): EnterpriseResilienceAntifragilityResult {
  const scoreBreakdown = buildScoreBreakdown(input);
  const overallResilienceScore = scoreBreakdown.overallScore;
  const resilienceLevel = classifyResilience(overallResilienceScore, scoreBreakdown.scalingFragilityScore);
  const missingData = getMissingData(input);
  const warnings = buildWarnings(scoreBreakdown, missingData);
  const assumptions = buildAssumptions(input, missingData);
  const confidence = calculateCorridorConfidence({
    scoreBreakdown,
    missingData,
    assumptions,
    warnings,
    dataQualityScore: input.dataQualityScore,
  });

  return {
    overallResilienceScore,
    resilienceLevel,
    operationalResilienceScore: scoreBreakdown.operationalResilienceScore,
    governanceResilienceScore: scoreBreakdown.governanceResilienceScore,
    strategicResilienceScore: scoreBreakdown.strategicResilienceScore,
    scalingFragilityScore: scoreBreakdown.scalingFragilityScore,
    recoveryReadinessScore: scoreBreakdown.recoveryReadinessScore,
    leadershipSurvivabilityScore: scoreBreakdown.leadershipSurvivabilityScore,
    antiFragilityScore: scoreBreakdown.antiFragilityScore,
    expansionStressDurabilityScore: scoreBreakdown.expansionStressDurabilityScore,
    institutionalStressScore: scoreBreakdown.institutionalStressScore,
    enterpriseResilienceMaturityScore: scoreBreakdown.enterpriseResilienceMaturityScore,
    confidenceScore: confidence.confidenceScore,
    scoreBreakdown,
    keyRisks: buildKeyRisks(scoreBreakdown),
    strengths: buildStrengths(scoreBreakdown),
    recommendations: buildRecommendations(scoreBreakdown),
    resilienceWarnings: warnings.map((warning) => warning.message),
    reusableInfrastructureNotes: buildReusableInfrastructureNotes(input),
    explanation: buildExplanation(scoreBreakdown, resilienceLevel),
    trace: buildTrace(input, scoreBreakdown),
    warnings,
    missingData,
    assumptions,
    safety: {
      readOnly: true,
      outreachGenerated: false,
      smsGenerated: false,
      emailGenerated: false,
      twilioTouched: false,
      dbWrites: false,
      schemaChanges: false,
      automationExecution: false,
      autonomousStrategyDecisions: false,
      autonomousResilienceActions: false,
      autonomousMitigationActions: false,
      autonomousOptimizationActions: false,
      autonomousManagementDecisions: false,
      legalAdvice: false,
      hrAdvice: false,
      ownershipAdvice: false,
      taxAdvice: false,
      lendingAdvice: false,
      investmentAdvice: false,
      portfolioManagementAdvice: false,
      demographicTargetingUsed: false,
      protectedClassLogicUsed: false,
      externalDataUsed: false,
      scrapingUsed: false,
      marketPrediction: false,
    },
  };
}

export const getEnterpriseResilienceAntifragilityIntelligence =
  analyzeEnterpriseResilienceAntifragility;
