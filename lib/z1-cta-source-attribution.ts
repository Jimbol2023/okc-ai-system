import { normalizeZ1LeadSource, z1RevenueOpsFlags, type Z1LeadSourceLabel } from "./z1-lead-source-taxonomy";

export const z1CtaOriginLabels = ["homepage_hero", "homepage_form", "seller_page_form", "dashboard_manual"] as const;

export type Z1CtaOriginLabel = (typeof z1CtaOriginLabels)[number];

export type Z1CtaAttributionInput = {
  source?: string;
  page?: string;
  origin?: string;
};

export function createZ1CtaAttribution(input: Z1CtaAttributionInput) {
  const origin = input.origin?.trim().toLowerCase().replace(/[\s-]+/g, "_") ?? "";
  const source = normalizeZ1LeadSource(input.source ?? origin);

  return {
    source,
    page: input.page?.trim() || "unknown",
    origin: z1CtaOriginLabels.includes(origin as Z1CtaOriginLabel) ? (origin as Z1CtaOriginLabel) : "homepage_form",
    sourceDetail: [input.page, origin].filter(Boolean).join(":") || "unknown",
    valid: Boolean(source),
  };
}

export function sourceForCtaOrigin(origin: Z1CtaOriginLabel): Z1LeadSourceLabel {
  if (origin === "seller_page_form") return "seller_page";
  if (origin === "dashboard_manual") return "manual_dashboard_entry";
  return origin;
}

export function createZ1CtaSourceAttributionReview() {
  return {
    phase: "Z1C" as const,
    flags: z1RevenueOpsFlags,
    planningOnly: true,
    ctaOrigins: z1CtaOriginLabels,
    supportedLabels: ["source", "page", "origin"],
  };
}
