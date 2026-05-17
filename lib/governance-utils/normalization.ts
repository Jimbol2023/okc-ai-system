export function createGovernanceSlug(...parts: readonly unknown[]): string {
  const slug = parts
    .filter((part): part is string | number | boolean =>
      typeof part === "string" || typeof part === "number" || typeof part === "boolean",
    )
    .map((part) => String(part).trim())
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72)
    .replace(/-+$/g, "");

  return slug || "governance-item";
}

export function normalizeGovernanceKey(value: unknown): string {
  if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
    return "";
  }

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}
