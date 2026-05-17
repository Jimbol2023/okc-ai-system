export function metadataStringList(metadata: unknown, key: string): string[] {
  if (typeof metadata !== "object" || metadata === null) return [];

  const value = (metadata as Record<string, unknown>)[key];
  const values = Array.isArray(value) ? value : [value];
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of values) {
    if (typeof item !== "string") continue;

    const trimmed = item.trim();
    if (!trimmed || seen.has(trimmed)) continue;

    seen.add(trimmed);
    result.push(trimmed);
  }

  return result;
}
