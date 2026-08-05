import { prisma } from "@/lib/prisma";
import { logRevenueAuditEvent } from "@/lib/revenue-spine";
import type { StoredLead } from "@/lib/leads-storage";
import { requireTenantId } from "@/lib/tenant-context";

const DEFAULT_TENANT_ID = "default";

export const referralPartnerTypes = [
  "friend",
  "family",
  "past_client",
  "attorney",
  "cpa",
  "contractor",
  "agent",
  "community",
  "social_media",
  "other",
] as const;

export type ReferralPartnerType = (typeof referralPartnerTypes)[number];

export type ReferralTrackingInput = {
  ref?: string | null;
  campaign?: string | null;
  source?: string | null;
  landingPage?: string | null;
  eventType?: "click" | "lead_created" | "manual_review";
  duplicateKey?: string | null;
};

export type ReferralLeadAttributionInput = {
  referralCode?: string | null;
  referralCampaign?: string | null;
  referralSource?: string | null;
  referralLandingPage?: string | null;
};

export const referralSafetyFlags = {
  providerCalled: false,
  outreachSent: false,
  published: false,
  liveExecutionAllowed: false,
  paymentCreated: false,
  privateDealDataExposed: false,
  scrapingEnabled: false,
  connectorActivationAllowed: false,
} as const;

const referralEventExecutionFlags = {
  providerCalled: false,
  outreachSent: false,
  published: false,
  liveExecutionAllowed: false,
} as const;

function cleanText(value: string | null | undefined, maxLength: number) {
  const text = value?.trim() ?? "";

  if (!text) return null;

  return text.slice(0, maxLength);
}

export function normalizeReferralCode(value: string | null | undefined) {
  const code = cleanText(value, 48)?.toUpperCase().replace(/[^A-Z0-9_-]/g, "") ?? "";

  return /^[A-Z0-9][A-Z0-9_-]{1,47}$/.test(code) ? code : null;
}

export function normalizeReferralSource(value: string | null | undefined) {
  const source = cleanText(value, 60)?.toLowerCase().replace(/[^a-z0-9_-]/g, "_").replace(/_+/g, "_") ?? "";

  return source.length >= 2 ? source : null;
}

export function normalizeReferralCampaign(value: string | null | undefined) {
  const campaign = cleanText(value, 80)?.toLowerCase().replace(/[^a-z0-9_-]/g, "_").replace(/_+/g, "_") ?? "";

  return campaign.length >= 2 ? campaign : null;
}

export function normalizeLandingPage(value: string | null | undefined) {
  const landingPage = cleanText(value, 220) ?? "/sell-your-house";

  if (!landingPage.startsWith("/") || landingPage.startsWith("//")) return "/sell-your-house";
  if (/[<>]/.test(landingPage)) return "/sell-your-house";

  return landingPage;
}

export function normalizePartnerType(value: string | null | undefined): ReferralPartnerType {
  return referralPartnerTypes.includes(value as ReferralPartnerType) ? (value as ReferralPartnerType) : "other";
}

function isKnownPrismaDuplicate(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "P2002");
}

export function getReferralDuplicateKey(input: Required<Pick<ReferralTrackingInput, "eventType">> & ReferralTrackingInput) {
  const code = normalizeReferralCode(input.ref) ?? "UNKNOWN";
  const landingPage = normalizeLandingPage(input.landingPage);
  const campaign = normalizeReferralCampaign(input.campaign) ?? "no_campaign";
  const source = normalizeReferralSource(input.source) ?? "unknown_source";
  const suppliedKey = cleanText(input.duplicateKey, 120)?.replace(/[^a-zA-Z0-9:_-]/g, "_");

  return suppliedKey ?? `${input.eventType}:${code}:${landingPage}:${campaign}:${source}`;
}

export function buildReferralLeadSource(referral: ReferralLeadAttributionInput) {
  const code = normalizeReferralCode(referral.referralCode);
  const campaign = normalizeReferralCampaign(referral.referralCampaign);
  const source = normalizeReferralSource(referral.referralSource);

  if (!code) return null;

  return {
    source: `referral_${code.toLowerCase()}`,
    sourceType: "referral",
    sourceDetail: code,
    campaignName: campaign,
    campaignMedium: source,
  };
}

export function buildReferralCopySuggestion(referralLink?: string | null) {
  const link = cleanText(referralLink, 300);

  if (!link) return null;

  return `Referral-ready CTA: If this is helpful, share this J Capital link with someone who wants a no-pressure property conversation: ${link}`;
}

export async function createReferralPartner(input: {
  name: string;
  partnerType?: string | null;
  status?: string | null;
  notes?: string | null;
}) {
  return prisma.referralPartner.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      name: cleanText(input.name, 120) ?? "Unnamed referral partner",
      partnerType: normalizePartnerType(input.partnerType),
      status: cleanText(input.status, 40) ?? "active",
      notes: cleanText(input.notes, 1000),
    },
  });
}

export async function listReferralPartners() {
  return prisma.referralPartner.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      links: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });
}

export async function createReferralLink(input: {
  partnerId?: string | null;
  referralCode: string;
  landingPage?: string | null;
  campaign?: string | null;
  status?: string | null;
  notes?: string | null;
}) {
  const referralCode = normalizeReferralCode(input.referralCode);

  if (!referralCode) {
    throw new Error("Referral code must be 2-48 letters, numbers, underscores, or hyphens.");
  }

  return prisma.referralLink.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      partnerId: cleanText(input.partnerId, 80),
      referralCode,
      landingPage: normalizeLandingPage(input.landingPage),
      campaign: normalizeReferralCampaign(input.campaign),
      status: cleanText(input.status, 40) ?? "active",
      notes: cleanText(input.notes, 1000),
    },
    include: {
      partner: true,
    },
  });
}

export async function listReferralLinks() {
  return prisma.referralLink.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      partner: true,
    },
  });
}

export async function trackReferralEvent(input: ReferralTrackingInput) {
  const eventType = input.eventType ?? "click";
  const referralCode = normalizeReferralCode(input.ref);
  const campaign = normalizeReferralCampaign(input.campaign);
  const source = normalizeReferralSource(input.source);
  const landingPage = normalizeLandingPage(input.landingPage);
  const duplicateKey = getReferralDuplicateKey({ ...input, eventType });

  if (!referralCode) {
    const event = await prisma.referralAttributionEvent.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        eventType,
        referralCode: "UNKNOWN",
        landingPage,
        campaign,
        source,
        status: "unknown_code",
        duplicateKey,
        safeMetadata: {
          reason: "Referral code missing or invalid.",
          ...referralSafetyFlags,
        },
        ...referralEventExecutionFlags,
      },
    }).catch((error) => {
      if (isKnownPrismaDuplicate(error)) return null;
      throw error;
    });

    return {
      ok: true,
      status: "unknown_code" as const,
      event,
      referralLinkFound: false,
      ...referralEventExecutionFlags,
    };
  }

  const link = await prisma.referralLink.findUnique({
    where: {
      referralCode,
    },
    include: {
      partner: true,
    },
  });

  if (!link || link.status !== "active") {
    const event = await prisma.referralAttributionEvent.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        eventType,
        referralCode,
        landingPage,
        campaign,
        source,
        status: "unknown_code",
        duplicateKey,
        safeMetadata: {
          reason: "Referral code was not found or is inactive.",
          ...referralSafetyFlags,
        },
        ...referralEventExecutionFlags,
      },
    }).catch((error) => {
      if (isKnownPrismaDuplicate(error)) return null;
      throw error;
    });

    return {
      ok: true,
      status: "unknown_code" as const,
      event,
      referralLinkFound: false,
      ...referralSafetyFlags,
    };
  }

  const event = await prisma.referralAttributionEvent.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      partnerId: link.partnerId,
      referralLinkId: link.id,
      eventType,
      referralCode,
      landingPage,
      campaign: campaign ?? link.campaign,
      source,
      status: "tracked",
      duplicateKey,
      safeMetadata: {
        landingPage,
        campaign: campaign ?? link.campaign,
        source,
        ...referralSafetyFlags,
      },
      ...referralEventExecutionFlags,
    },
  }).catch((error) => {
    if (isKnownPrismaDuplicate(error)) return null;
    throw error;
  });

  if (event && eventType === "click") {
    await prisma.referralLink.update({
      where: {
        id: link.id,
      },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });
  }

  return {
    ok: true,
    status: event ? ("tracked" as const) : ("duplicate_ignored" as const),
    event,
    referralLinkFound: true,
    ...referralSafetyFlags,
  };
}

export async function attachReferralAttributionToLead(input: {
  tenantId: string;
  lead: StoredLead;
  created: boolean;
  referral: ReferralLeadAttributionInput;
}) {
  const tenantId = requireTenantId(input.tenantId, "referral_attribution");
  const source = buildReferralLeadSource(input.referral);

  if (!source) {
    return {
      ok: true,
      attached: false,
      reason: "no_referral_code" as const,
      ...referralEventExecutionFlags,
    };
  }

  const link = await prisma.referralLink.findFirst({
    where: {
      referralCode: source.sourceDetail,
      tenantId,
    },
  });

  const duplicateKey = `lead:${input.lead.id}:${source.sourceDetail}`;
  const event = await prisma.referralAttributionEvent.create({
    data: {
      tenantId,
      partnerId: link?.partnerId ?? null,
      referralLinkId: link?.id ?? null,
      leadId: input.lead.id,
      eventType: "lead_created",
      referralCode: source.sourceDetail,
      landingPage: normalizeLandingPage(input.referral.referralLandingPage),
      campaign: source.campaignName,
      source: source.campaignMedium,
      status: link ? "lead_attributed" : "unknown_code",
      duplicateKey,
      safeMetadata: {
        created: input.created,
        source: source.source,
        sourceType: source.sourceType,
        ...referralSafetyFlags,
      },
      ...referralEventExecutionFlags,
    },
  }).catch((error) => {
    if (isKnownPrismaDuplicate(error)) return null;
    throw error;
  });

  if (!event) {
    await logRevenueAuditEvent({
      tenantId,
      action: "referral_duplicate_ignored",
      targetType: "lead",
      targetId: input.lead.id,
      source: "referral_growth_engine",
      metadata: {
        referralCode: source.sourceDetail,
        providerCalled: false,
        outreachSent: false,
        published: false,
        liveExecutionAllowed: false,
      },
    });

    return {
      ok: true,
      attached: false,
      reason: "duplicate_ignored" as const,
      ...referralSafetyFlags,
    };
  }

  if (link && input.created) {
    await prisma.referralLink.update({
      where: {
        id: link.id,
      },
      data: {
        leadCount: {
          increment: 1,
        },
        qualifiedLeadCount: input.lead.score >= 55 || input.lead.priority !== "Low" ? { increment: 1 } : undefined,
        closedDealCount: input.lead.status === "closed" ? { increment: 1 } : undefined,
      },
    });
  }

  if (link) {
    await prisma.revenueLeadSource.upsert({
      where: {
        leadId_source_sourceDetail: {
          leadId: input.lead.id,
          source: source.source,
          sourceDetail: source.sourceDetail,
        },
      },
      update: {
        sourceType: source.sourceType,
        sourceRecordId: link.id,
        campaignName: source.campaignName,
        campaignMedium: source.campaignMedium,
        verified: true,
      },
      create: {
        tenantId,
        leadId: input.lead.id,
        source: source.source,
        sourceType: source.sourceType,
        sourceDetail: source.sourceDetail,
        sourceRecordId: link.id,
        campaignName: source.campaignName,
        campaignMedium: source.campaignMedium,
        confidence: 70,
        verified: true,
        importedBy: "referral_growth_engine",
      },
    });
  }

  await logRevenueAuditEvent({
    tenantId,
    action: "referral_attribution_attached",
    targetType: "lead",
    targetId: input.lead.id,
    source: "referral_growth_engine",
    metadata: {
      referralCode: source.sourceDetail,
      referralLinkFound: Boolean(link),
      providerCalled: false,
      outreachSent: false,
      published: false,
      liveExecutionAllowed: false,
    },
  });

  return {
    ok: true,
    attached: Boolean(link),
    reason: link ? ("attached" as const) : ("unknown_code" as const),
    ...referralSafetyFlags,
  };
}

export async function getReferralDashboard() {
  const [partners, links, events] = await Promise.all([
    prisma.referralPartner.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      include: {
        links: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      take: 50,
    }),
    prisma.referralLink.findMany({
      orderBy: [{ leadCount: "desc" }, { clickCount: "desc" }, { createdAt: "desc" }],
      include: {
        partner: true,
      },
      take: 50,
    }),
    prisma.referralAttributionEvent.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 25,
      include: {
        partner: true,
        referralLink: true,
      },
    }),
  ]);

  const clickCount = links.reduce((total, link) => total + link.clickCount, 0);
  const leadCount = links.reduce((total, link) => total + link.leadCount, 0);
  const qualifiedLeadCount = links.reduce((total, link) => total + link.qualifiedLeadCount, 0);
  const closedDealCount = links.reduce((total, link) => total + link.closedDealCount, 0);
  const topSources = links
    .map((link) => ({
      referralCode: link.referralCode,
      partnerName: link.partner?.name ?? "Unassigned",
      campaign: link.campaign,
      clickCount: link.clickCount,
      leadCount: link.leadCount,
      conversionRate: link.clickCount > 0 ? Math.round((link.leadCount / link.clickCount) * 100) : 0,
    }))
    .sort((a, b) => b.leadCount - a.leadCount || b.clickCount - a.clickCount)
    .slice(0, 8);

  return {
    ok: true,
    partners,
    links,
    events,
    topSources,
    summary: {
      partners: partners.length,
      links: links.length,
      clickCount,
      leadCount,
      qualifiedLeadCount,
      closedDealCount,
      referralToLeadConversion: clickCount > 0 ? Math.round((leadCount / clickCount) * 100) : 0,
    },
    suggestedRelationshipFollowUps: topSources.slice(0, 5).map((source) => ({
      referralCode: source.referralCode,
      partnerName: source.partnerName,
      suggestion:
        source.leadCount > 0
          ? "Review this relationship for a thank-you or manual partner check-in."
          : "Review whether this referral link needs clearer social or community placement.",
    })),
    ...referralSafetyFlags,
    approvalRequired: true,
  };
}
