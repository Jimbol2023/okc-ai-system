import { z } from "zod";

import { prisma } from "@/lib/prisma";
import type { AiDepartmentName, ExecutiveDirective, OpportunitySource } from "@/lib/company-orchestrator";
import type { MarketingChannel } from "@/types/marketing-workflow";

const tenantId = "default";

export const businessActivationSafetyFlags = {
  providerCalled: false,
  liveExecutionAllowed: false,
  published: false,
  sent: false,
  outreachBlocked: true,
  workflowExecutionBlocked: true,
  scrapingBlocked: true,
  adsBlocked: true,
  emailBlocked: true,
  smsBlocked: true,
  providerLookupBlocked: true,
  skipTracingBlocked: true,
  propertyFactsInvented: false,
} as const;

export const opportunitySources = [
  "Website lead",
  "Referral",
  "Phone",
  "Google Business Profile",
  "Driving for Dollars",
  "County Records",
  "Manual Import",
] as const;

export const opportunityQueueInputSchema = z
  .object({
    source: z.enum(opportunitySources),
    sourceLabel: z.string().trim().min(2).max(80),
    address: z.string().trim().max(180).optional().or(z.literal("")),
    addressMissingReason: z.string().trim().max(240).optional().or(z.literal("")),
    ownerName: z.string().trim().max(120).optional().or(z.literal("")),
    contactInfo: z.string().trim().max(180).optional().or(z.literal("")),
    leadScore: z.number().int().min(0).max(100).default(0),
    confidence: z.number().int().min(0).max(100).default(0),
    estimatedValue: z.string().trim().max(120).optional().or(z.literal("")),
    opportunityType: z.string().trim().min(2).max(120),
    motivationSignal: z.string().trim().min(2).max(240),
    recommendedAction: z.string().trim().min(2).max(240),
    assumptions: z.array(z.string().trim().min(2).max(240)).max(8).optional(),
  })
  .refine((input) => Boolean(input.address?.trim() || input.addressMissingReason?.trim()), {
    message: "Provide an address or explain why the address is missing.",
    path: ["address"],
  });

export type OpportunityQueueInput = z.infer<typeof opportunityQueueInputSchema>;

type BusinessActivationRecord = {
  id: string;
  directiveId?: string;
  output?: string;
  ownerDepartment?: string;
  sourceLabel?: string;
  workProduct?: unknown;
  qualityChecklist?: unknown;
  channel?: string;
  topic?: string;
  draftCopy?: string;
  assetNotes?: string | null;
  status?: string;
};

type BusinessActivationDelegate<TRecord extends BusinessActivationRecord> = {
  findFirst(args?: unknown): Promise<TRecord | null>;
  findMany(args?: unknown): Promise<TRecord[]>;
  create(args: unknown): Promise<TRecord>;
  update(args: unknown): Promise<TRecord>;
  upsert(args: unknown): Promise<TRecord>;
};

export type BusinessActivationWritableTx = {
  aiCompanyDraftQueueItem: BusinessActivationDelegate<BusinessActivationRecord>;
  marketingDraft: BusinessActivationDelegate<BusinessActivationRecord>;
  aiDepartmentMemoryEvent: BusinessActivationDelegate<BusinessActivationRecord>;
};

type OpportunityDb = {
  aiCompanyOpportunityQueueItem: BusinessActivationDelegate<BusinessActivationRecord>;
};

const db = prisma as unknown as OpportunityDb;

const campaignSourceLabel = "executive_directive:campaign-001";
const campaignTopic = "Inherited Property in Oklahoma";

const qualityChecklist = [
  "Identifies the target seller problem.",
  "Includes a clear lead-capture CTA.",
  "Uses generic education, approved source labels, or explicit assumptions.",
  "Invents no property-specific facts.",
  "Requires CEO review before publishing, sending, or manual execution.",
] as const;

function marketingDraftCopy(channel: MarketingChannel) {
  const platformNote: Record<MarketingChannel, string> = {
    facebook: "Use a calm, educational post that invites Oklahoma homeowners to ask questions before making inherited-property decisions.",
    instagram: "Use a concise caption with a simple carousel or static graphic about next steps after inheriting a property.",
    google_business_profile: "Use a short local business update focused on education and private review.",
    linkedin: "Use a professional Company Page post about reducing confusion for families handling inherited property decisions.",
  };

  return `Draft for ${campaignTopic}

Target seller problem: Oklahoma homeowners may feel unsure about what to do after inheriting a property, especially when family, repairs, timelines, or title questions make the next step unclear.

Core message: J Capital Property Group can help homeowners talk through options privately and understand practical next steps before they decide whether selling makes sense.

Lead-capture CTA: If you inherited a property in Oklahoma and want a private review, contact J Capital Property Group to talk through your situation.

Platform guidance: ${platformNote[channel]}

Source label: ${campaignSourceLabel}

Assumptions: This draft is general education only. It does not claim facts about any specific property, owner, title status, tax status, repairs, value, legal outcome, or timeline.

Approval boundary: CEO review is required before any manual publishing. The app does not publish, schedule, message, call providers, scrape, or run ads.`;
}

function marketingAssetNotes(channel: MarketingChannel) {
  const note: Record<MarketingChannel, string> = {
    facebook: "Use a professional J Capital branded education graphic; avoid distressed-property imagery or owner-specific visuals.",
    instagram: "Prepare a mobile-first graphic or carousel cover with large readable text and a clear CTA.",
    google_business_profile: "Use a simple local-business visual or approved brand photo; keep it educational.",
    linkedin: "Use a clean, professional brand visual appropriate for a company audience.",
  };

  return note[channel];
}

const marketingDrafts: Array<{ channel: MarketingChannel; topic: string }> = [
  { channel: "facebook", topic: "Inherited Property in Oklahoma" },
  { channel: "instagram", topic: "Inherited Property in Oklahoma" },
  { channel: "google_business_profile", topic: "Inherited Property in Oklahoma" },
  { channel: "linkedin", topic: "Inherited Property in Oklahoma" },
];

function ownerForWorkProduct(output: string): AiDepartmentName {
  const normalized = output.toLowerCase();
  if (normalized.includes("brand")) return "Brand Intelligence AI";
  if (normalized.includes("governance") || normalized.includes("final approval")) return "Security & Governance AI";
  if (normalized.includes("canva") || normalized.includes("adobe") || normalized.includes("firefly") || normalized.includes("thumbnail") || normalized.includes("carousel concept")) return "Design AI";
  if (normalized.includes("seo") || normalized.includes("keyword") || normalized.includes("internal link")) return "SEO AI";
  if (normalized.includes("call") || normalized.includes("sms") || normalized.includes("email") || normalized.includes("objection")) return "Sales AI";
  if (normalized.includes("executive")) return "Executive AI";

  return "Marketing AI";
}

export function createCampaign001WorkProduct(output: string) {
  const owner = ownerForWorkProduct(output);
  const common = {
    campaign: "Campaign 001: Inherited Property in Oklahoma",
    targetSellerProblem: "Oklahoma homeowners need a clear, private way to understand inherited-property options before deciding what to do next.",
    leadCaptureCta: "Contact J Capital Property Group for a private inherited-property review.",
    sourceLabel: campaignSourceLabel,
    assumptions: [
      "Educational campaign context is approved for internal preparation only.",
      "No property-specific facts, owner facts, legal claims, tax claims, valuation claims, or timeline claims are invented.",
      "CEO final approval is required before any manual publishing or outreach.",
    ],
    safetyFlags: businessActivationSafetyFlags,
  };

  if (owner === "SEO AI") {
    return {
      ...common,
      output,
      ownerDepartment: owner,
      keywordTargets: ["sell inherited house Oklahoma", "inherited property Oklahoma", "what to do with inherited house Oklahoma"],
      internalLinkIdeas: ["/resources/inherited-property-oklahoma", "/resources/education", "/sell-your-house?source=campaign_001_inherited_property"],
      refreshAngle: "Use practical education and clear next steps, not legal or tax advice.",
    };
  }

  if (owner === "Design AI") {
    return {
      ...common,
      output,
      ownerDepartment: owner,
      designBrief: "Create a clean, mobile-first J Capital education asset with calm typography, strong contrast, and no unapproved property imagery.",
      accessibility: "Use readable text, avoid tiny disclaimers, and keep the CTA visible.",
      manualWorkflowOnly: "Canva, Adobe Express, and Firefly prompts are briefs only; no exports or provider calls are authorized.",
    };
  }

  if (owner === "Sales AI") {
    return {
      ...common,
      output,
      ownerDepartment: owner,
      salesPrep: "Prepare human-owned conversation support for inherited-property questions.",
      objectionHandling: ["I need to talk to family.", "I am not sure what the property is worth.", "The house needs repairs.", "I do not know where to start."],
      manualAction: "CEO or human operator reviews before any call, SMS, or email. The system sends nothing.",
    };
  }

  if (owner === "Brand Intelligence AI") {
    return {
      ...common,
      output,
      ownerDepartment: owner,
      brandReview: "Check tone for trust, clarity, professionalism, and no pressure language.",
      riskNotes: ["Avoid legal advice.", "Avoid probate promises.", "Avoid urgency or fear-based claims."],
    };
  }

  if (owner === "Security & Governance AI") {
    return {
      ...common,
      output,
      ownerDepartment: owner,
      governanceReview: "Confirm all outputs are internal, approval-gated, source-labeled, and free of external execution.",
      blockedActions: ["publishing", "email sending", "SMS sending", "provider calls", "scraping", "ads", "outreach", "external workflow automation"],
    };
  }

  if (owner === "Executive AI") {
    return {
      ...common,
      output,
      ownerDepartment: owner,
      executiveSummary: "Campaign 001 is prepared for CEO review as an inherited-property education package designed to generate qualified seller conversations.",
      decisionNeeded: "Approve, reject, request changes, or defer each prepared asset before any manual execution.",
    };
  }

  return {
    ...common,
    output,
    ownerDepartment: owner,
    draftBrief: "Prepare educational copy that explains the seller problem, gives a clear next step, and routes the homeowner to a private review.",
  };
}

async function upsertMarketingDraft(tx: BusinessActivationWritableTx, channel: MarketingChannel, topic: string) {
  const existing = await tx.marketingDraft.findFirst({
    where: {
      channel,
      sourceLabel: campaignSourceLabel,
      topic,
    },
  });
  const data = {
    channel,
    topic,
    sourceLabel: campaignSourceLabel,
    status: "pending_approval",
    draftCopy: marketingDraftCopy(channel),
    assetNotes: marketingAssetNotes(channel),
    referralLink: null,
    assumptions: [
      `Topic is CEO-approved for internal preparation: ${topic}.`,
      `Channel is internal draft-only: ${channel}.`,
      "No property-specific facts were generated or inferred.",
    ],
    safetyFlags: businessActivationSafetyFlags,
    createdSource: "ai_coo_campaign_001",
  };

  if (existing) {
    await tx.marketingDraft.update({
      where: { id: existing.id },
      data,
    });
    return;
  }

  await tx.marketingDraft.create({ data });
}

export async function activateCampaign001BusinessWork(tx: BusinessActivationWritableTx, directive: ExecutiveDirective) {
  if (directive.id !== "campaign-001") return;

  for (const draft of marketingDrafts) {
    await upsertMarketingDraft(tx, draft.channel, draft.topic);
  }

  for (const output of directive.requested_outputs) {
    await tx.aiCompanyDraftQueueItem.upsert({
      where: {
        directiveId_output: {
          directiveId: directive.id,
          output,
        },
      },
      create: {
        tenantId,
        directiveId: directive.id,
        output,
        ownerDepartment: ownerForWorkProduct(output),
        status: "draft_required",
        sourceLabel: campaignSourceLabel,
        workProduct: createCampaign001WorkProduct(output),
        qualityChecklist,
        approvalRequired: true,
        providerCalled: false,
        sent: false,
        published: false,
        liveExecutionAllowed: false,
      },
      update: {
        ownerDepartment: ownerForWorkProduct(output),
        status: "draft_required",
        workProduct: createCampaign001WorkProduct(output),
        qualityChecklist,
        approvalRequired: true,
        providerCalled: false,
        sent: false,
        published: false,
        liveExecutionAllowed: false,
      },
    });
  }
}

function cleanOptional(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizeOpportunitySource(source: (typeof opportunitySources)[number]): OpportunitySource {
  if (source === "Website lead") return "Website";
  if (source === "Google Business Profile") return "Google Business Profile";
  if (source === "Driving for Dollars") return "Driving for Dollars";
  if (source === "County Records") return "County Records";
  if (source === "Referral") return "Referrals";
  if (source === "Phone") return "Phone";

  return "Manual Import";
}

export function toCompanyOpportunityQueueItem(record: Record<string, unknown>) {
  return {
    id: String(record.id),
    source: normalizeOpportunitySource(record.source as (typeof opportunitySources)[number]),
    address: String(record.address || record.addressMissingReason || "Address missing"),
    owner_name: cleanOptional(String(record.ownerName || "")) || undefined,
    contact_info: cleanOptional(String(record.contactInfo || "")) || undefined,
    lead_score: Number(record.leadScore ?? 0),
    confidence: Number(record.confidence ?? 0),
    estimated_value: String(record.estimatedValue || "Not estimated"),
    opportunity_type: String(record.opportunityType || "Manual opportunity"),
    motivation_signal: String(record.motivationSignal || "Manual review required"),
    recommended_action: String(record.recommendedAction || "Review manually"),
    status: "triage" as const,
    sourceLabel: String(record.sourceLabel || "manual_opportunity_queue"),
    assumption: Array.isArray(record.assumptions) ? record.assumptions.join(" ") : "Manual opportunity queue item; facts require human verification.",
    outreachAllowed: false as const,
  };
}

export async function listCompanyOpportunityQueue() {
  const records = await db.aiCompanyOpportunityQueueItem.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 25,
  });

  return records.map((record) => toCompanyOpportunityQueueItem(record as unknown as Record<string, unknown>));
}

export async function createCompanyOpportunityQueueItem(input: OpportunityQueueInput) {
  const assumptions = input.assumptions?.length
    ? input.assumptions
    : ["Manual opportunity queue item. Property facts and seller facts require human verification before business decisions."];

  const item = await db.aiCompanyOpportunityQueueItem.create({
    data: {
      tenantId,
      source: input.source,
      sourceLabel: input.sourceLabel.trim(),
      address: cleanOptional(input.address),
      addressMissingReason: cleanOptional(input.addressMissingReason),
      ownerName: cleanOptional(input.ownerName),
      contactInfo: cleanOptional(input.contactInfo),
      leadScore: input.leadScore,
      confidence: input.confidence,
      estimatedValue: cleanOptional(input.estimatedValue),
      opportunityType: input.opportunityType.trim(),
      motivationSignal: input.motivationSignal.trim(),
      recommendedAction: input.recommendedAction.trim(),
      status: "manual_review",
      assumptions,
      safetyFlags: businessActivationSafetyFlags,
      providerCalled: false,
      sent: false,
      published: false,
      liveExecutionAllowed: false,
    },
  });

  return {
    item,
    opportunity: toCompanyOpportunityQueueItem(item as unknown as Record<string, unknown>),
    safetyFlags: businessActivationSafetyFlags,
  };
}
