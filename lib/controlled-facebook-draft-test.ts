import { prisma } from "@/lib/prisma";

export const controlledFacebookDraftIdentity = {
  channel: "facebook",
  topic: "Oklahoma inherited property education",
  sourceLabel: "controlled_facebook_draft_test",
} as const;

export const controlledFacebookDraftReferralLink =
  "https://jcapitalpropertygroup.com/sell-your-house?ref=REFERRAL_PLACEHOLDER&utm_source=facebook&utm_campaign=inherited-property-education";

export const controlledFacebookDraftSafetyFlags = {
  noOAuth: true,
  noLiveApis: true,
  noExternalFetchCalls: true,
  noProviderCalls: true,
  noCanvaApiCalls: true,
  noCanvaExports: true,
  noAutomaticDesignCreation: true,
  noPosting: true,
  noScheduling: true,
  noMessaging: true,
  noScraping: true,
  noLeadCreation: true,
  noCrmMutation: true,
  noAds: true,
  noPhase2EPublishing: true,
  providerCalled: false,
  published: false,
  scheduled: false,
  outreachSent: false,
  connectorActivated: false,
  approvalRequired: true,
} as const;

export function buildControlledFacebookDraftCopy() {
  return `Inherited property decisions in Oklahoma can feel complicated, especially when family, timing, maintenance, probate questions, or distance are involved.

Before making a decision, it can help to slow down and understand the options available to you. Some owners choose to keep the property, some explore repairs, some talk with local professionals, and some decide that selling may be the right path for their situation.

The important part is getting clear information first.

J Capital Property Group prepared this educational note to encourage Oklahoma homeowners to review their options, ask questions, and make decisions at their own pace.

This is general education only, not legal advice, tax advice, or a prediction of any result. For legal, title, probate, or tax questions, speak with a qualified professional.

Referral-ready link placeholder for manual attribution:
${controlledFacebookDraftReferralLink}`;
}

export function buildControlledFacebookDraftAssetNotes() {
  return `Canva brief: create a simple square Facebook graphic for manual review only.

Format: 1:1 square graphic.
Visual direction: calm Oklahoma-focused property education, clean navy and white J Capital style, simple headline typography, no pressure language, no distressed-property imagery, no specific home photo unless separately approved.
Suggested headline: Understand Your Options Before Deciding What To Do With An Inherited Oklahoma Property.
Footer note: Educational information only. Review before publishing.
Safety boundary: Canva brief only; do not create, export, publish, schedule, message, activate connectors, or call providers.`;
}

export function buildControlledFacebookDraftPayload() {
  const draftCopy = buildControlledFacebookDraftCopy();
  const assetNotes = buildControlledFacebookDraftAssetNotes();

  return {
    ...controlledFacebookDraftIdentity,
    status: "pending_approval",
    draftCopy,
    assetNotes,
    referralLink: controlledFacebookDraftReferralLink,
    assumptions: [
      "Topic was provided by the operator: Oklahoma inherited property education.",
      "Channel was selected by the operator: Facebook.",
      "Source label was provided by the controlled draft test.",
      "Referral link is a first-party placeholder for manual attribution only.",
      "No property-specific facts were generated or inferred.",
      "This draft is educational and does not provide legal, tax, title, probate, value, timing, or outcome advice.",
    ],
    safetyFlags: controlledFacebookDraftSafetyFlags,
    createdSource: "controlled_facebook_draft_test",
  } as const;
}

export async function saveControlledFacebookDraftTest() {
  const payload = buildControlledFacebookDraftPayload();
  const existingDraft = await prisma.marketingDraft.findFirst({
    where: {
      channel: payload.channel,
      topic: payload.topic,
      sourceLabel: payload.sourceLabel,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const data = {
    channel: payload.channel,
    topic: payload.topic,
    sourceLabel: payload.sourceLabel,
    status: payload.status,
    draftCopy: payload.draftCopy,
    assetNotes: payload.assetNotes,
    referralLink: payload.referralLink,
    assumptions: payload.assumptions,
    safetyFlags: payload.safetyFlags,
    createdSource: payload.createdSource,
  };

  if (existingDraft) {
    const draft = await prisma.marketingDraft.update({
      where: {
        id: existingDraft.id,
      },
      data,
    });

    return {
      action: "updated" as const,
      draft,
      providerCalled: false,
      published: false,
      scheduled: false,
      approvalRequired: true,
    };
  }

  const draft = await prisma.marketingDraft.create({
    data,
  });

  return {
    action: "created" as const,
    draft,
    providerCalled: false,
    published: false,
    scheduled: false,
    approvalRequired: true,
  };
}
