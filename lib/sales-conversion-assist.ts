import { prisma } from "@/lib/prisma";
import type { SalesAssistRequestInput, SalesAttributionInput } from "@/lib/validations/sales-conversion";

const salesSafetyFlags = {
  noSocialApiRoutes: true,
  noAnalyticsApiRoutes: true,
  noContentApiRoutes: true,
  noResearchApiRoutes: true,
  noOAuth: true,
  noApiKeysStored: true,
  noHardCodedSecrets: true,
  noAutoPublish: true,
  noScheduling: true,
  noMessaging: true,
  noLeadMutation: true,
  noCrmMutation: true,
  noAds: true,
};

const futureApiReview = [
  {
    group: "Social API",
    requestedRoutes: ["/api/social/facebook", "/api/social/instagram", "/api/social/tiktok", "/api/social/linkedin"],
    recommendation: "future_gated",
    reason: "Useful later for approved publishing and analytics, but blocked until attribution proves which channels create revenue.",
  },
  {
    group: "Analytics API",
    requestedRoutes: ["/api/analytics/ga4", "/api/analytics/search-console", "/api/analytics/facebook", "/api/analytics/tiktok"],
    recommendation: "future_gated",
    reason: "Read-only analytics can be valuable after source attribution is stable and credentials are scoped server-side.",
  },
  {
    group: "Content API",
    requestedRoutes: ["/api/content/generate", "/api/content/repurpose"],
    recommendation: "not_recommended_yet",
    reason: "The current template draft queue already covers safe content generation. Add richer generation only after sales ROI is visible.",
  },
  {
    group: "Research API",
    requestedRoutes: ["/api/research/county", "/api/research/probate", "/api/research/vacant"],
    recommendation: "future_gated",
    reason: "High value for acquisition research, but must be implemented with verified sources and never invented property facts.",
  },
] as const;

function parsePayload(rawPayload: string | null) {
  if (!rawPayload) return {};

  try {
    const parsed = JSON.parse(rawPayload) as Record<string, unknown>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function getPayloadValue(payload: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return "";
}

function getOfferReadiness(lead: {
  phone: string;
  propertyAddress: string;
  source: string;
  payload: string | null;
}) {
  const payload = parsePayload(lead.payload);
  const missing = [
    !lead.propertyAddress ? "property address" : "",
    !lead.phone ? "seller phone" : "",
    !lead.source ? "lead source" : "",
    !getPayloadValue(payload, ["sellerMotivation", "motivation", "sellerMotivationSignal"]) ? "motivation" : "",
    !getPayloadValue(payload, ["propertyCondition", "condition", "propertyConditionSignal"]) ? "property condition" : "",
    !getPayloadValue(payload, ["timeline", "sellerTimeline", "sellerTimelineSignal"]) ? "seller timeline" : "",
    !getPayloadValue(payload, ["askingPrice", "priceExpectation", "priceExpectationSignal"]) ? "price expectation" : "",
    !getPayloadValue(payload, ["occupancy", "occupancyStatus"]) ? "occupancy" : "",
  ].filter(Boolean);

  return {
    status: missing.length === 0 ? "ready_for_manual_offer_review" : "needs_more_facts",
    missing,
    summary:
      missing.length === 0
        ? "Lead has enough captured facts for a manual offer-readiness review."
        : `Collect ${missing.slice(0, 4).join(", ")} before offer review.`,
  };
}

function getNextSalesAction(lead: {
  status: string;
  score: number;
  priority: string;
  doNotContact: boolean;
  approvalStatus: string;
  nextFollowUpAt: Date | null;
}) {
  if (lead.doNotContact || lead.approvalStatus === "rejected") return "Do not contact. Resolve safety or approval blocker manually.";
  if (lead.status === "new") return "Call or manually review seller lead within the current work block.";
  if (lead.status === "contacted") return "Complete manual follow-up and confirm motivation, timeline, condition, and price.";
  if (lead.status === "negotiating") return "Prepare manual offer-readiness review.";
  if (lead.status === "under_contract") return "Coordinate closing and disposition readiness manually.";
  if (lead.status === "closed") return "Archive ROI outcome and source attribution.";
  if (lead.score >= 70 || lead.priority === "High") return "Prioritize manual seller conversation.";

  return "Review manually when higher-priority seller leads are handled.";
}

function buildSalesAssist(lead: {
  name: string;
  phone: string;
  propertyAddress: string;
  source: string;
  status: string;
  score: number;
  priority: string;
  doNotContact: boolean;
  approvalStatus: string;
  nextFollowUpAt: Date | null;
  payload: string | null;
}) {
  const offerReadiness = getOfferReadiness(lead);
  const nextSalesAction = getNextSalesAction(lead);

  return {
    nextSalesAction,
    callOpener: `Hi ${lead.name}, this is J Capital Property Group. I saw your property inquiry for ${lead.propertyAddress}. I wanted to understand what is going on and see if there is a simple option worth reviewing.`,
    sellerQuestions: [
      "What made you start looking at selling or reviewing options?",
      "What is the current condition of the property?",
      "Is anyone living in the property right now?",
      "What timeline would be ideal for you?",
      "Have you thought about a price range, or are you still gathering options?",
      "Are there any title, probate, tax, tenant, or repair issues we should understand before discussing next steps?",
    ],
    objectionNotes: [
      "If the seller wants more money: acknowledge it and ask what number would make sense before discussing assumptions.",
      "If the seller is unsure: offer a simple manual review without pressure.",
      "If facts are missing: do not estimate property value, repairs, title status, or tax status.",
      "If seller requests legal, tax, or title advice: recommend a qualified local professional.",
    ],
    followUpDrafts: [
      `Thanks for talking with J Capital Property Group. Based on what you shared, the next step is a manual review of the property situation. No assumptions will be made without confirming the facts.`,
      `Following up on your property inquiry. If you still want to review options, we can walk through condition, timeline, and next steps manually.`,
    ],
    offerReadiness,
    roiSignals: {
      source: lead.source || "unknown",
      score: lead.score,
      priority: lead.priority,
      pipelineStatus: lead.status,
    },
  };
}

function getSalesQueueRank(lead: {
  status: string;
  score: number;
  priority: string;
  doNotContact: boolean;
  approvalStatus: string;
  nextFollowUpAt: Date | null;
}) {
  if (lead.doNotContact || lead.approvalStatus === "rejected") return 0;
  let rank = lead.score;
  if (lead.priority === "High") rank += 30;
  if (lead.status === "new") rank += 20;
  if (lead.status === "negotiating") rank += 25;
  if (lead.nextFollowUpAt && lead.nextFollowUpAt.getTime() <= Date.now()) rank += 15;
  return rank;
}

export async function getSalesConversionDashboard() {
  const [leads, attributions, assists] = await Promise.all([
    prisma.lead.findMany({
      orderBy: [{ score: "desc" }, { createdAt: "desc" }],
      include: {
        marketingSalesAttributions: {
          orderBy: {
            createdAt: "desc",
          },
          take: 3,
        },
        salesConversionAssists: {
          orderBy: {
            createdAt: "desc",
          },
          take: 2,
        },
      },
    }),
    prisma.marketingSalesAttribution.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    }),
    prisma.salesConversionAssist.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    }),
  ]);

  const salesQueue = leads
    .map((lead) => ({
      ...lead,
      salesQueueRank: getSalesQueueRank(lead),
      nextSalesAction: getNextSalesAction(lead),
      offerReadiness: getOfferReadiness(lead),
    }))
    .sort((a, b) => b.salesQueueRank - a.salesQueueRank)
    .slice(0, 25);

  const channelSummary = attributions.reduce<Record<string, { leads: number; sourceLabels: string[] }>>((summary, attribution) => {
    const existing = summary[attribution.channel] ?? { leads: 0, sourceLabels: [] };
    existing.leads += 1;
    if (!existing.sourceLabels.includes(attribution.sourceLabel)) existing.sourceLabels.push(attribution.sourceLabel);
    summary[attribution.channel] = existing;
    return summary;
  }, {});

  return {
    salesQueue,
    attributions,
    assists,
    roiSummary: {
      totalAttributedLeads: attributions.length,
      channels: channelSummary,
      pipelineCounts: {
        new: leads.filter((lead) => lead.status === "new").length,
        contacted: leads.filter((lead) => lead.status === "contacted").length,
        negotiating: leads.filter((lead) => lead.status === "negotiating").length,
        underContract: leads.filter((lead) => lead.status === "under_contract").length,
        closed: leads.filter((lead) => lead.status === "closed").length,
      },
    },
    futureApiReview,
    safetyFlags: salesSafetyFlags,
  };
}

export async function createSalesAttribution(input: SalesAttributionInput) {
  const lead = await prisma.lead.findUnique({
    where: {
      id: input.leadId,
    },
  });

  if (!lead) throw new Error("Lead not found.");

  return prisma.marketingSalesAttribution.create({
    data: {
      leadId: input.leadId,
      marketingDraftId: input.marketingDraftId || null,
      canvaAssetAssistId: input.canvaAssetAssistId || null,
      publishAssistId: input.publishAssistId || null,
      channel: input.channel,
      topic: input.topic,
      sourceLabel: input.sourceLabel,
      manualPostUrl: input.manualPostUrl || null,
      attributionStatus: input.attributionStatus,
      attributionNote: input.attributionNote,
    },
  });
}

export async function createSalesConversionAssist(input: SalesAssistRequestInput) {
  const lead = await prisma.lead.findUnique({
    where: {
      id: input.leadId,
    },
  });

  if (!lead) throw new Error("Lead not found.");

  const assist = buildSalesAssist(lead);

  return prisma.salesConversionAssist.create({
    data: {
      leadId: input.leadId,
      nextSalesAction: assist.nextSalesAction,
      callOpener: assist.callOpener,
      sellerQuestions: assist.sellerQuestions,
      objectionNotes: assist.objectionNotes,
      followUpDrafts: assist.followUpDrafts,
      offerReadiness: assist.offerReadiness,
      roiSignals: assist.roiSignals,
      safetyFlags: salesSafetyFlags,
      manualApprovalStatus: input.manualApprovalStatus || "pending_manual_review",
    },
  });
}
