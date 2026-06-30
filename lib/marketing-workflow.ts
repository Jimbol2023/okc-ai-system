import { prisma } from "@/lib/prisma";
import { buildReferralCopySuggestion } from "@/lib/referrals";
import type {
  CreateMarketingDraftInput,
  CanvaAssetAssistInput,
  MarketingAccountConnectionInput,
  MarketingApprovalInput,
  PublishAssistInput,
  UpdateMarketingDraftInput,
} from "@/lib/validations/marketing-workflow";
import {
  marketingChannelLabels,
  type MarketingChannel,
  type MarketingSafetyFlags,
} from "@/types/marketing-workflow";

const safetyFlags: MarketingSafetyFlags = {
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
};

const manualPostingChecklist = [
  "Human confirms the draft is accurate and not property-specific.",
  "Human confirms the source label is attached to the post workflow.",
  "Human copies the approved text into the platform manually.",
  "Human records the published URL only after posting outside this app.",
] as const;

function getAssetChecklist(channel: MarketingChannel) {
  if (channel === "instagram") {
    return ["Select approved brand image.", "Confirm caption fits mobile view.", "Add source label to manual tracking notes."];
  }

  if (channel === "google_business_profile") {
    return ["Select approved local business photo.", "Confirm GBP update is educational.", "Record manual GBP post date after posting."];
  }

  return ["Select approved brand image.", "Confirm Facebook page access manually.", "Record post URL after manual publication."];
}

function getCanvaFormat(channel: MarketingChannel) {
  if (channel === "instagram") return "Instagram post";
  if (channel === "google_business_profile") return "Google Business Profile update image";

  return "Facebook post";
}

function getCanvaCopyBlocks(draft: {
  channel: string;
  topic: string;
  sourceLabel: string;
  draftCopy: string;
  referralLink?: string | null;
}) {
  return [
    {
      label: "Headline",
      copy: draft.topic,
    },
    {
      label: "Body copy",
      copy: draft.draftCopy,
    },
    {
      label: "Source tracking note",
      copy: `Source label: ${draft.sourceLabel}`,
    },
    ...(buildReferralCopySuggestion((draft as { referralLink?: string | null }).referralLink)
      ? [
          {
            label: "Referral note",
            copy: buildReferralCopySuggestion((draft as { referralLink?: string | null }).referralLink) ?? "",
          },
        ]
      : []),
    {
      label: "Safety note",
      copy: "Educational marketing only. Do not include property-specific claims or owner-specific facts.",
    },
  ];
}

function buildCanvaDesignBrief(draft: {
  channel: string;
  topic: string;
  sourceLabel: string;
  draftCopy: string;
  assetNotes: string | null;
  referralLink?: string | null;
}) {
  const channel = draft.channel as MarketingChannel;
  const format = getCanvaFormat(channel);

  return `Create a clean J Capital Property Group ${format} visual for "${draft.topic}".

Goal: prepare a professional manual-posting asset for Oklahoma City property-owner education.

Use the approved copy blocks from this record. Keep the visual simple, mobile-first, and professional. Do not add property-specific facts, owner names, tax status, repair claims, valuation claims, legal claims, urgency claims, or guarantees.

Recommended visual direction: brand-safe real estate education graphic with calm typography, clear spacing, and no scraped or unapproved property imagery.

Manual source tracking: ${draft.sourceLabel}.
${buildReferralCopySuggestion(draft.referralLink) ? `\nManual referral tracking: ${buildReferralCopySuggestion(draft.referralLink)}.\n` : ""}

Asset notes: ${draft.assetNotes || "No extra asset notes provided."}

Approval boundary: this brief is for manual Canva work only. The app must not create, export, publish, schedule, or send anything through Canva or any social platform.`;
}

function buildDraftCopy(input: CreateMarketingDraftInput) {
  const channelLabel = marketingChannelLabels[input.channel];
  const referralSuggestion = buildReferralCopySuggestion(input.referralLink);
  const base = `Draft for ${channelLabel}: ${input.topic}

Oklahoma City property owners sometimes need a simple way to understand their options before making a decision. J Capital Property Group can review the situation, explain possible next steps, and keep the conversation clear.

This draft is educational only. It does not claim facts about any specific property, owner, title status, tax status, repairs, value, or timeline.

Source label: ${input.sourceLabel}

Suggested call to action: If you want to talk through your property situation, contact J Capital Property Group for a private review.${referralSuggestion ? `\n\n${referralSuggestion}` : ""}`;

  if (input.channel === "instagram") {
    return `${base}

Caption note: Keep the visual simple and avoid showing any property that has not been approved for use.`;
  }

  if (input.channel === "google_business_profile") {
    return `${base}

GBP note: Keep this as a short business update and verify the final text manually before posting.`;
  }

  return `${base}

Facebook note: Keep comments and messages human-managed. Do not use this app to message prospects.`;
}

function getAssumptions(input: CreateMarketingDraftInput) {
  return [
    `Topic was provided by the operator: ${input.topic}.`,
    `Channel was selected by the operator: ${marketingChannelLabels[input.channel]}.`,
    `Source label was provided by the operator: ${input.sourceLabel}.`,
    ...(input.referralLink ? [`Referral link was provided by the operator for manual attribution: ${input.referralLink}.`] : []),
    "No property-specific facts were generated or inferred.",
  ];
}

export async function listMarketingWorkflow() {
  const [drafts, accounts] = await Promise.all([
    prisma.marketingDraft.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        approvals: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
        publishAssists: {
          orderBy: {
            createdAt: "desc",
          },
          take: 3,
        },
        canvaAssetAssists: {
          orderBy: {
            createdAt: "desc",
          },
          take: 3,
        },
      },
    }),
    prisma.marketingAccountConnection.findMany({
      orderBy: {
        platform: "asc",
      },
    }),
  ]);

  return {
    drafts,
    accounts,
    safetyFlags,
  };
}

export async function createMarketingDraft(input: CreateMarketingDraftInput) {
  return prisma.marketingDraft.create({
    data: {
      channel: input.channel,
      topic: input.topic,
      sourceLabel: input.sourceLabel,
      status: "pending_approval",
      draftCopy: buildDraftCopy(input),
      assetNotes: input.assetNotes || null,
      referralLink: input.referralLink || null,
      assumptions: getAssumptions(input),
      safetyFlags,
      createdSource: "template",
    },
    include: {
      approvals: true,
      publishAssists: true,
      canvaAssetAssists: true,
    },
  });
}

export async function updateMarketingDraft(id: string, input: UpdateMarketingDraftInput) {
  return prisma.marketingDraft.update({
    where: {
      id,
    },
    data: {
      ...(input.topic ? { topic: input.topic } : {}),
      ...(input.sourceLabel ? { sourceLabel: input.sourceLabel } : {}),
      ...(typeof input.referralLink === "string" ? { referralLink: input.referralLink || null } : {}),
      ...(input.draftCopy ? { draftCopy: input.draftCopy } : {}),
      ...(typeof input.assetNotes === "string" ? { assetNotes: input.assetNotes || null } : {}),
      ...(input.status ? { status: input.status } : {}),
    },
    include: {
      approvals: {
        orderBy: {
          createdAt: "desc",
        },
      },
      publishAssists: {
        orderBy: {
          createdAt: "desc",
        },
      },
      canvaAssetAssists: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function reviewMarketingDraft(draftId: string, input: MarketingApprovalInput) {
  const draft = await prisma.marketingDraft.findUnique({
    where: {
      id: draftId,
    },
  });

  if (!draft) {
    throw new Error("Marketing draft not found.");
  }

  if (input.decision === "edit" && !input.editedCopy?.trim()) {
    throw new Error("Edited copy is required when editing a draft.");
  }

  const finalCopy = input.editedCopy?.trim() || draft.draftCopy;
  const nextStatus = input.decision === "approve" ? "approved" : input.decision === "reject" ? "rejected" : "pending_approval";

  const approval = await prisma.marketingApproval.create({
    data: {
      draftId,
      decision: input.decision,
      editedCopy: input.editedCopy?.trim() || null,
      note: input.note,
      reviewer: input.reviewer || null,
    },
  });

  const updatedDraft = await prisma.marketingDraft.update({
    where: {
      id: draftId,
    },
    data: {
      draftCopy: finalCopy,
      status: nextStatus,
    },
    include: {
      approvals: {
        orderBy: {
          createdAt: "desc",
        },
      },
      publishAssists: {
        orderBy: {
          createdAt: "desc",
        },
      },
      canvaAssetAssists: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return {
    approval,
    draft: updatedDraft,
    sent: false,
    providerCalled: false,
    published: false,
  };
}

export async function upsertMarketingAccountConnection(input: MarketingAccountConnectionInput) {
  return prisma.marketingAccountConnection.upsert({
    where: {
      platform: input.platform,
    },
    create: {
      platform: input.platform,
      accountName: input.accountName,
      handle: input.handle,
      profileUrl: input.profileUrl,
      verificationStatus: input.verificationStatus,
      proofNote: input.proofNote,
      lastVerifiedAt: input.verificationStatus === "verified" ? new Date() : null,
    },
    update: {
      accountName: input.accountName,
      handle: input.handle,
      profileUrl: input.profileUrl,
      verificationStatus: input.verificationStatus,
      proofNote: input.proofNote,
      lastVerifiedAt: input.verificationStatus === "verified" ? new Date() : null,
    },
  });
}

export async function createMarketingPublishAssist(draftId: string, input: PublishAssistInput = {}) {
  const draft = await prisma.marketingDraft.findUnique({
    where: {
      id: draftId,
    },
  });

  if (!draft) {
    throw new Error("Marketing draft not found.");
  }

  if (draft.status !== "approved" && draft.status !== "ready_for_manual_publish" && draft.status !== "manually_published") {
    throw new Error("Only approved drafts can be prepared for manual publishing.");
  }

  const status = input.markManuallyPublished ? "manually_published" : "ready_for_manual_publish";
  const manualPublishedUrl = input.manualPublishedUrl?.trim() || null;
  const manualPublishedAt = input.markManuallyPublished ? new Date() : null;

  const publishAssist = await prisma.marketingPublishAssist.create({
    data: {
      draftId,
      preparedCopy: draft.draftCopy,
      assetChecklist: getAssetChecklist(draft.channel as MarketingChannel),
      manualPostingChecklist,
      sourceLabel: draft.sourceLabel,
      status,
      manualPublishedUrl,
      manualPublishedAt,
    },
  });

  const updatedDraft = await prisma.marketingDraft.update({
    where: {
      id: draftId,
    },
    data: {
      status,
    },
    include: {
      approvals: {
        orderBy: {
          createdAt: "desc",
        },
      },
      publishAssists: {
        orderBy: {
          createdAt: "desc",
        },
      },
      canvaAssetAssists: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return {
    publishAssist,
    draft: updatedDraft,
    sent: false,
    providerCalled: false,
    publishedBySystem: false,
  };
}

export async function createMarketingCanvaAssetAssist(draftId: string, input: CanvaAssetAssistInput = {}) {
  const draft = await prisma.marketingDraft.findUnique({
    where: {
      id: draftId,
    },
  });

  if (!draft) {
    throw new Error("Marketing draft not found.");
  }

  if (draft.status !== "approved" && draft.status !== "ready_for_manual_publish" && draft.status !== "manually_published") {
    throw new Error("Only approved drafts can generate Canva asset briefs.");
  }

  const channel = draft.channel as MarketingChannel;
  const canvaAssetAssist = await prisma.marketingCanvaAssetAssist.create({
    data: {
      draftId,
      recommendedFormat: getCanvaFormat(channel),
      designBrief: buildCanvaDesignBrief({
        channel: draft.channel,
        topic: draft.topic,
        sourceLabel: draft.sourceLabel,
        draftCopy: draft.draftCopy,
        assetNotes: input.assetNotes?.trim() || draft.assetNotes,
        referralLink: draft.referralLink,
      }),
      brandSafeCopyBlocks: getCanvaCopyBlocks(draft),
      assetNotes: input.assetNotes?.trim() || draft.assetNotes,
      manualApprovalStatus: input.manualApprovalStatus || "pending_manual_asset_approval",
      safetyFlags,
    },
  });

  const updatedDraft = await prisma.marketingDraft.findUnique({
    where: {
      id: draftId,
    },
    include: {
      approvals: {
        orderBy: {
          createdAt: "desc",
        },
      },
      publishAssists: {
        orderBy: {
          createdAt: "desc",
        },
      },
      canvaAssetAssists: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return {
    canvaAssetAssist,
    draft: updatedDraft,
    canvaApiCalled: false,
    designCreated: false,
    exported: false,
    providerCalled: false,
  };
}
