export function uniqueNonEmptyStrings(values: readonly unknown[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    if (typeof value !== "string") continue;

    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) continue;

    seen.add(trimmed);
    result.push(trimmed);
  }

  return result;
}

export function averageFiniteNumbers(values: readonly unknown[]): number {
  const finiteNumbers = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));

  if (finiteNumbers.length === 0) return 0;

  return finiteNumbers.reduce((total, value) => total + value, 0) / finiteNumbers.length;
}
