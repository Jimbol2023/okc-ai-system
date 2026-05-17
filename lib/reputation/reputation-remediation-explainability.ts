export function remediationCategoryLabel(categoryId: unknown): string {
  if (typeof categoryId !== "string") return "General Remediation";

  const normalized = categoryId.replace(/[_-]+/g, " ").trim();
  if (!normalized) return "General Remediation";

  return normalized
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
