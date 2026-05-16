import type {
  CorridorConfidenceSummary,
  CorridorContinuityLevel,
  CorridorDurabilityLevel,
  CorridorScoreBreakdown,
  CorridorStrengthLevel,
  CorridorWarning,
  CorridorWarningSeverity,
  CorridorCategory,
} from "./corridor-intelligence-types";

const SCORE_KEYS: Array<keyof CorridorScoreBreakdown> = [
  "connectivityScore",
  "durabilityScore",
  "expansionScore",
  "institutionalScore",
  "logisticsScore",
  "luxuryScore",
  "developmentScore",
];

function hasNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function round(value: number, decimals = 2) {
  const multiplier = 10 ** decimals;

  return Math.round(value * multiplier) / multiplier;
}

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

export function normalizeCorridorScore(value: unknown, fallback = 0) {
  if (!hasNumber(value)) return Math.max(0, Math.min(100, Math.round(fallback)));

  return Math.max(0, Math.min(100, Math.round(value <= 1 ? value * 100 : value)));
}

export function calculateAverageCorridorScore(scores: CorridorScoreBreakdown | number[]) {
  const values = Array.isArray(scores) ? scores : SCORE_KEYS.map((key) => scores[key]);
  const normalized = values.filter(hasNumber).map((value) => normalizeCorridorScore(value));

  if (normalized.length === 0) return 0;

  return normalizeCorridorScore(normalized.reduce((total, value) => total + value, 0) / normalized.length);
}

export function classifyCorridorStrength(score: number): CorridorStrengthLevel {
  const normalized = normalizeCorridorScore(score);

  if (normalized >= 85) return "elite";
  if (normalized >= 72) return "strong";
  if (normalized >= 55) return "moderate";
  if (normalized >= 38) return "emerging";

  return "weak";
}

export function classifyCorridorContinuity(score: number): CorridorContinuityLevel {
  const normalized = normalizeCorridorScore(score);

  if (normalized >= 82) return "highly_connected";
  if (normalized >= 64) return "connected";
  if (normalized >= 42) return "partial";
  if (normalized >= 1) return "fragmented";

  return "unknown";
}

export function classifyCorridorDurability(score: number): CorridorDurabilityLevel {
  const normalized = normalizeCorridorScore(score);

  if (normalized >= 86) return "institutional_grade";
  if (normalized >= 72) return "durable";
  if (normalized >= 55) return "stable";
  if (normalized >= 38) return "cyclical";

  return "fragile";
}

export function createCorridorWarning(params: {
  code: string;
  message: string;
  severity?: CorridorWarningSeverity;
  category?: CorridorCategory;
  requiresHumanReview?: boolean;
}): CorridorWarning {
  return {
    code: params.code,
    severity: params.severity ?? "medium",
    message: params.message,
    category: params.category,
    requiresHumanReview: params.requiresHumanReview ?? params.severity === "high",
  };
}

export function calculateCorridorConfidence(params: {
  scoreBreakdown?: Partial<CorridorScoreBreakdown>;
  missingData?: string[];
  assumptions?: string[];
  warnings?: CorridorWarning[];
  dataQualityScore?: number;
}): CorridorConfidenceSummary {
  const presentScoreCount = SCORE_KEYS.filter((key) => hasNumber(params.scoreBreakdown?.[key])).length;
  const completenessScore = normalizeCorridorScore((presentScoreCount / SCORE_KEYS.length) * 100);
  const missingData = unique(params.missingData ?? []);
  const assumptions = unique(params.assumptions ?? []);
  const warnings = params.warnings ?? [];
  const highWarnings = warnings.filter((warning) => warning.severity === "high").length;
  const mediumWarnings = warnings.filter((warning) => warning.severity === "medium").length;
  const baseDataQuality = normalizeCorridorScore(params.dataQualityScore, completenessScore);
  const confidenceScore = round(
    Math.max(
      0,
      Math.min(
        1,
        baseDataQuality / 100 * 0.4 +
          completenessScore / 100 * 0.34 -
          Math.min(missingData.length * 0.045, 0.22) -
          Math.min(assumptions.length * 0.025, 0.12) -
          Math.min(highWarnings * 0.08 + mediumWarnings * 0.035, 0.22) +
          0.18,
      ),
    ),
  );

  const confidenceLevel = confidenceScore >= 0.72 ? "high" : confidenceScore >= 0.48 ? "moderate" : "low";
  const reasoning =
    missingData.length > 0
      ? `Confidence is ${confidenceLevel} because ${presentScoreCount}/${SCORE_KEYS.length} core corridor scores are present and ${missingData.length} required inputs need verification.`
      : `Confidence is ${confidenceLevel} because ${presentScoreCount}/${SCORE_KEYS.length} core corridor scores are present with no required missing data flagged.`;

  return {
    confidenceScore,
    confidenceLevel,
    dataQualityScore: baseDataQuality,
    missingData,
    assumptions,
    reasoning,
  };
}
