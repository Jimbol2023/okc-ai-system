export function clampGovernanceScore(score: unknown): number {
  if (typeof score !== "number" || !Number.isFinite(score)) return 0;
  if (score < 0) return 0;
  if (score > 100) return 100;
  return score;
}

export function scoreThresholdClassification<T extends string>(
  score: unknown,
  thresholds: readonly { minimumScore: number; classification: T }[],
  fallback: T,
): T {
  const clampedScore = clampGovernanceScore(score);

  for (const threshold of thresholds) {
    if (clampedScore >= threshold.minimumScore) {
      return threshold.classification;
    }
  }

  return fallback;
}

export function governanceStatusScore(status: unknown): number {
  if (typeof status !== "string") return 50;

  const normalized = status.trim().toLowerCase();
  if (!normalized) return 50;

  if (["ready", "certified", "stable", "complete", "passed", "pass", "approved"].includes(normalized)) {
    return 100;
  }

  if (["partial", "review", "warning", "degraded", "pending"].includes(normalized)) {
    return 60;
  }

  if (["blocked", "failing", "failed", "error", "critical", "unsafe"].includes(normalized)) {
    return 0;
  }

  return 50;
}

export function averageScore(values: readonly unknown[]): number {
  const scores = values
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value))
    .map((value) => clampGovernanceScore(value));

  if (scores.length === 0) return 0;

  return scores.reduce((total, score) => total + score, 0) / scores.length;
}
