import type { CorridorConfidenceSummary, CorridorExplainability, CorridorScoreBreakdown, CorridorWarning } from "./corridor-intelligence-types";
import {
  calculateAverageCorridorScore,
  calculateCorridorConfidence,
  classifyCorridorContinuity,
  classifyCorridorDurability,
  classifyCorridorStrength,
  normalizeCorridorScore,
} from "./corridor-intelligence-utils";

function getScore(scoreBreakdown: Partial<CorridorScoreBreakdown>, key: keyof CorridorScoreBreakdown) {
  return normalizeCorridorScore(scoreBreakdown[key], 0);
}

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

export function explainCorridorStrengths(scoreBreakdown: Partial<CorridorScoreBreakdown>) {
  const averageScore = calculateAverageCorridorScore([
    getScore(scoreBreakdown, "connectivityScore"),
    getScore(scoreBreakdown, "durabilityScore"),
    getScore(scoreBreakdown, "expansionScore"),
    getScore(scoreBreakdown, "institutionalScore"),
    getScore(scoreBreakdown, "logisticsScore"),
    getScore(scoreBreakdown, "luxuryScore"),
    getScore(scoreBreakdown, "developmentScore"),
  ]);
  const strengthLevel = classifyCorridorStrength(averageScore);

  return unique([
    ...(averageScore >= 72 ? [`Overall corridor strength is ${strengthLevel} with a ${averageScore}/100 blended score.`] : []),
    ...(getScore(scoreBreakdown, "connectivityScore") >= 70 ? ["Connectivity supports market-to-market continuity and repeatable acquisition coverage."] : []),
    ...(getScore(scoreBreakdown, "durabilityScore") >= 70 ? ["Durability signals support a longer-lived corridor thesis."] : []),
    ...(getScore(scoreBreakdown, "expansionScore") >= 70 ? ["Expansion score supports controlled geographic sequencing."] : []),
    ...(getScore(scoreBreakdown, "institutionalScore") >= 70 ? ["Institutional score supports higher-quality review for larger capital or portfolio strategy."] : []),
    ...(getScore(scoreBreakdown, "logisticsScore") >= 70 ? ["Logistics score supports operational practicality across the corridor."] : []),
    ...(getScore(scoreBreakdown, "luxuryScore") >= 70 ? ["Luxury score supports future luxury-corridor analysis."] : []),
    ...(getScore(scoreBreakdown, "developmentScore") >= 70 ? ["Development score supports future land and development-site analysis."] : []),
  ]);
}

export function explainCorridorWeaknesses(scoreBreakdown: Partial<CorridorScoreBreakdown>) {
  return unique([
    ...(getScore(scoreBreakdown, "connectivityScore") > 0 && getScore(scoreBreakdown, "connectivityScore") < 45 ? ["Connectivity is weak and may make corridor execution fragmented."] : []),
    ...(getScore(scoreBreakdown, "durabilityScore") > 0 && getScore(scoreBreakdown, "durabilityScore") < 45 ? ["Durability is weak, so corridor strength may be tactical rather than long-term."] : []),
    ...(getScore(scoreBreakdown, "expansionScore") > 0 && getScore(scoreBreakdown, "expansionScore") < 45 ? ["Expansion score is weak and suggests staying local or monitoring only."] : []),
    ...(getScore(scoreBreakdown, "institutionalScore") > 0 && getScore(scoreBreakdown, "institutionalScore") < 45 ? ["Institutional score is weak for larger capital deployment or portfolio sequencing."] : []),
    ...(getScore(scoreBreakdown, "logisticsScore") > 0 && getScore(scoreBreakdown, "logisticsScore") < 45 ? ["Logistics score is weak and may increase operating friction."] : []),
    ...(getScore(scoreBreakdown, "luxuryScore") > 0 && getScore(scoreBreakdown, "luxuryScore") < 45 ? ["Luxury corridor signals are weak for premium acquisition focus."] : []),
    ...(getScore(scoreBreakdown, "developmentScore") > 0 && getScore(scoreBreakdown, "developmentScore") < 45 ? ["Development corridor signals are weak for land or builder-led expansion."] : []),
  ]);
}

export function explainCorridorContinuity(scoreBreakdown: Partial<CorridorScoreBreakdown>) {
  const connectivityScore = getScore(scoreBreakdown, "connectivityScore");
  const logisticsScore = getScore(scoreBreakdown, "logisticsScore");
  const continuityScore = calculateAverageCorridorScore([connectivityScore, logisticsScore]);
  const continuityLevel = classifyCorridorContinuity(continuityScore);
  const durabilityLevel = classifyCorridorDurability(getScore(scoreBreakdown, "durabilityScore"));

  return unique([
    `Corridor continuity is ${continuityLevel} based on connectivity ${connectivityScore}/100 and logistics ${logisticsScore}/100.`,
    `Corridor durability is ${durabilityLevel} based on the current durability score.`,
    ...(continuityScore >= 70 ? ["Continuity supports sequencing adjacent or corridor-based expansion before broad multi-market expansion."] : []),
    ...(continuityScore > 0 && continuityScore < 45 ? ["Continuity is not strong enough to support aggressive expansion without more verification."] : []),
  ]);
}

export function explainCorridorRisks(params: {
  scoreBreakdown: Partial<CorridorScoreBreakdown>;
  warnings?: CorridorWarning[];
  confidence?: CorridorConfidenceSummary;
  missingData?: string[];
}) {
  const scoreBreakdown = params.scoreBreakdown;
  const warnings = params.warnings ?? [];
  const confidence = params.confidence ?? calculateCorridorConfidence({ scoreBreakdown, missingData: params.missingData, warnings });
  const averageScore = calculateAverageCorridorScore([
    getScore(scoreBreakdown, "connectivityScore"),
    getScore(scoreBreakdown, "durabilityScore"),
    getScore(scoreBreakdown, "expansionScore"),
    getScore(scoreBreakdown, "institutionalScore"),
    getScore(scoreBreakdown, "logisticsScore"),
    getScore(scoreBreakdown, "luxuryScore"),
    getScore(scoreBreakdown, "developmentScore"),
  ]);

  return unique([
    ...(averageScore < 45 ? ["Corridor score is weak enough to keep expansion in monitor-only mode."] : []),
    ...(confidence.confidenceScore < 0.5 ? ["Corridor confidence is low and requires human verification before strategic use."] : []),
    ...(warnings.some((warning) => warning.severity === "high") ? ["High-severity corridor warning requires manual review."] : []),
    ...(warnings.some((warning) => warning.requiresHumanReview) ? ["At least one warning requires human review before downstream action."] : []),
    ...(confidence.missingData.length > 0 ? `Missing corridor data reduces confidence: ${confidence.missingData.slice(0, 4).join(", ")}.` : ""),
  ]);
}

export function buildCorridorExplainability(params: {
  scoreBreakdown: Partial<CorridorScoreBreakdown>;
  warnings?: CorridorWarning[];
  missingData?: string[];
  assumptions?: string[];
  dataQualityScore?: number;
}): CorridorExplainability {
  const confidence = calculateCorridorConfidence({
    scoreBreakdown: params.scoreBreakdown,
    missingData: params.missingData,
    assumptions: params.assumptions,
    warnings: params.warnings,
    dataQualityScore: params.dataQualityScore,
  });
  const strengths = explainCorridorStrengths(params.scoreBreakdown);
  const weaknesses = explainCorridorWeaknesses(params.scoreBreakdown);
  const continuity = explainCorridorContinuity(params.scoreBreakdown);
  const risks = explainCorridorRisks({
    scoreBreakdown: params.scoreBreakdown,
    warnings: params.warnings,
    confidence,
    missingData: params.missingData,
  });
  const averageScore = calculateAverageCorridorScore([
    getScore(params.scoreBreakdown, "connectivityScore"),
    getScore(params.scoreBreakdown, "durabilityScore"),
    getScore(params.scoreBreakdown, "expansionScore"),
    getScore(params.scoreBreakdown, "institutionalScore"),
    getScore(params.scoreBreakdown, "logisticsScore"),
    getScore(params.scoreBreakdown, "luxuryScore"),
    getScore(params.scoreBreakdown, "developmentScore"),
  ]);
  const strengthLevel = classifyCorridorStrength(averageScore);

  return {
    summary: `Corridor foundation classifies the current blended corridor strength as ${strengthLevel} with a ${averageScore}/100 average score and ${confidence.confidenceLevel} confidence. This is read-only strategic explainability only.`,
    strengths,
    weaknesses,
    continuity,
    risks,
    warnings: params.warnings ?? [],
    confidence,
  };
}
