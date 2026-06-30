import { evaluateConnectorAction, evaluateConnectorLifecycle, getConnectorHealth, listEnterpriseConnectors, type ConnectorLifecycleAction } from "@/lib/connector-platform";
import { createDemandDiscoveryReport, createExecutiveBriefing, createMarketIntelligenceReport } from "@/lib/phase2-intelligence";
import { evaluateSafeAutomation } from "@/lib/safe-auto-mode";

export type ApprovalDecision = "approve" | "reject" | "edit" | "reschedule" | "delegate" | "block";

export type UnifiedApprovalItem = {
  id: string;
  itemType: "lead_follow_up" | "social_post" | "canva_design" | "gbp_post" | "email_sms" | "relationship_outreach" | "connector_lifecycle" | "ai_recommendation";
  title: string;
  sourceLabel: string;
  approvalStatus: "pending_review" | "approved" | "rejected" | "blocked" | "delegated" | "rescheduled";
  riskLevel: "low" | "medium" | "high";
  requiredApprovals: string[];
  connectorId: string | null;
  executionBlockedReason: string;
  providerCalled: false;
  sent: false;
  published: false;
};

export type SocialOpsDraft = {
  id: string;
  platform: "facebook" | "instagram" | "linkedin" | "x" | "youtube" | "google_business_profile";
  contentType: "educational_post" | "carousel" | "video_script" | "shorts_script" | "blog_summary" | "newsletter" | "infographic_brief";
  title: string;
  sourceLabel: string;
  assumptions: string[];
  draftCopy: string;
  approvalStatus: "pending_review";
  connectorId: string;
  providerCalled: false;
  published: false;
  scheduled: false;
};

export type AutomationPolicy = {
  id: string;
  name: string;
  workflow: string;
  featureFlag: string;
  approvalRequirement: string;
  rollbackPlan: string;
  safeAutoCompatible: boolean;
  externalExecutionAllowed: false;
};

export type LearningOutcome = {
  id: string;
  source: "closed_deal" | "lost_opportunity" | "marketing_roi" | "approval_history" | "executive_decision" | "seo_social_website";
  summary: string;
  recommendationImpact: string;
  confidence: number;
  explainabilityNote: string;
  autonomousSelfModification: false;
};

export type UnifiedApprovalDecisionResult =
  | {
      ok: true;
      approval: UnifiedApprovalItem & {
        latestDecision: ApprovalDecision;
        note: string | null;
        auditLogged: true;
        approvalDoesNotBypassSafeAuto: true;
      };
      providerCalled: false;
      sent: false;
      published: false;
      liveExecutionAllowed: false;
    }
  | {
      ok: false;
      error: string;
      providerCalled: false;
      liveExecutionAllowed: false;
    };

export const socialOpsDrafts: SocialOpsDraft[] = [
  {
    id: "gbp-educational-owner-options",
    platform: "google_business_profile",
    contentType: "educational_post",
    title: "Property owner options education draft",
    sourceLabel: "approved-education-topic",
    assumptions: ["Topic is educational and not property-specific.", "No client or deal facts are used."],
    draftCopy: "Oklahoma property owners often benefit from organizing timing, condition, and ownership questions before deciding next steps. J Capital Property Group can help owners talk through practical options without pressure.",
    approvalStatus: "pending_review",
    connectorId: "google_business_profile",
    providerCalled: false,
    published: false,
    scheduled: false,
  },
  {
    id: "canva-owner-checklist-brief",
    platform: "instagram",
    contentType: "carousel",
    title: "Owner conversation checklist carousel brief",
    sourceLabel: "approved-faq-topic",
    assumptions: ["Checklist is general education.", "No property facts are inferred."],
    draftCopy: "Carousel brief: 1. Gather property basics. 2. Think through timing. 3. List repair concerns. 4. Ask questions before deciding. Brand-safe, mobile-first, no pressure.",
    approvalStatus: "pending_review",
    connectorId: "canva",
    providerCalled: false,
    published: false,
    scheduled: false,
  },
];

export const automationPolicies: AutomationPolicy[] = [
  {
    id: "educational-content",
    name: "Educational Content",
    workflow: "Generate -> Review -> Publish Plan",
    featureFlag: "social_media_ops",
    approvalRequirement: "Human content approval before any connector execution plan.",
    rollbackPlan: "Archive draft and block execution plan.",
    safeAutoCompatible: true,
    externalExecutionAllowed: false,
  },
  {
    id: "closing-announcement",
    name: "Closing Announcement",
    workflow: "Generate -> Manual Approval -> Publish Plan",
    featureFlag: "social_media_ops",
    approvalRequirement: "Manual approval plus verified non-private closing facts.",
    rollbackPlan: "Withdraw announcement plan and retain audit record.",
    safeAutoCompatible: true,
    externalExecutionAllowed: false,
  },
  {
    id: "google-review-request",
    name: "Google Review Request",
    workflow: "Draft Only",
    featureFlag: "automation_policy_center",
    approvalRequirement: "Draft only; human sends outside system unless future policy permits.",
    rollbackPlan: "Delete draft request and log blocked state.",
    safeAutoCompatible: true,
    externalExecutionAllowed: false,
  },
  {
    id: "marketing-campaign",
    name: "Marketing Campaign",
    workflow: "Generate -> Review -> Schedule Plan",
    featureFlag: "social_media_ops",
    approvalRequirement: "Campaign approval, budget review, and connector policy before execution.",
    rollbackPlan: "Pause schedule plan and preserve approval history.",
    safeAutoCompatible: true,
    externalExecutionAllowed: false,
  },
];

export const learningOutcomes: LearningOutcome[] = [
  {
    id: "approval-edits-improve-content",
    source: "approval_history",
    summary: "Edited approvals should improve future draft tone and prohibited-claim checks.",
    recommendationImpact: "Favor shorter educational copy with explicit source labels.",
    confidence: 68,
    explainabilityNote: "Derived from approval workflow design, not live performance analytics.",
    autonomousSelfModification: false,
  },
  {
    id: "source-roi-follow-up",
    source: "marketing_roi",
    summary: "Lead source quality should influence campaign prioritization after attribution is verified.",
    recommendationImpact: "Prioritize high-source-confidence leads and content lanes.",
    confidence: 64,
    explainabilityNote: "Requires future verified ROI data before budget recommendations.",
    autonomousSelfModification: false,
  },
];

export const supportedSocialPlatforms: SocialOpsDraft["platform"][] = ["facebook", "instagram", "linkedin", "x", "youtube", "google_business_profile"];

export function getConnectorMarketplace() {
  return {
    ok: true,
    connectors: listEnterpriseConnectors().map((connector) => ({
      ...connector,
      marketplaceStatus: connector.lifecycleState === "enabled" ? "enabled" : "available_for_setup",
      canInstall: true,
      canEnableNow: false,
      secretRendered: false,
    })),
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function prepareConnectorWizardAction(connectorId: string, lifecycleAction: ConnectorLifecycleAction) {
  const lifecycle = evaluateConnectorLifecycle({ connectorId, lifecycleAction });

  return {
    ...lifecycle,
    setupWizard: {
      oauthSupported: listEnterpriseConnectors().find((connector) => connector.connectorId === connectorId)?.oauthSupported ?? false,
      credentialReferenceOnly: true,
      permissionValidationRequired: true,
      scopeVerificationRequired: true,
      healthCheckRequired: true,
      sandboxMode: true,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function getAiPermissionPolicies() {
  return {
    ok: true,
    policies: [
      {
        id: "marketing-ai-social",
        subject: "Marketing AI",
        may: ["draft_posts", "create_canva_briefs", "prepare_schedule_intent", "analyze_placeholder_performance"],
        mayNot: ["publish", "spend_ad_budget", "reply_publicly"],
        approvalRequiredFor: ["publish", "schedule", "campaign_launch"],
      },
      {
        id: "executive-ai-ops",
        subject: "Executive AI",
        may: ["observe", "analyze", "recommend", "prioritize", "prepare_briefings"],
        mayNot: ["execute_external_writes", "sign_documents", "change_budgets"],
        approvalRequiredFor: ["connector_enable", "automation_policy_change", "public_action"],
      },
    ],
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function getUnifiedApprovalQueue(): { ok: true; items: UnifiedApprovalItem[]; providerCalled: false; liveExecutionAllowed: false } {
  return {
    ok: true,
    items: [
      {
        id: "approval-lead-follow-up",
        itemType: "lead_follow_up",
        title: "Review high-intent seller follow-up task",
        sourceLabel: "revenue-spine",
        approvalStatus: "pending_review",
        riskLevel: "medium",
        requiredApprovals: ["Human follow-up approval", "DNC review"],
        connectorId: "twilio",
        executionBlockedReason: "Twilio sending remains blocked; task is internal only.",
        providerCalled: false,
        sent: false,
        published: false,
      },
      ...socialOpsDrafts.map((draft): UnifiedApprovalItem => ({
        id: `approval-${draft.id}`,
        itemType: draft.platform === "google_business_profile" ? "gbp_post" : draft.connectorId === "canva" ? "canva_design" : "social_post",
        title: draft.title,
        sourceLabel: draft.sourceLabel,
        approvalStatus: "pending_review",
        riskLevel: "medium",
        requiredApprovals: ["Content approval", "Connector execution approval"],
        connectorId: draft.connectorId,
        executionBlockedReason: "Live publishing is connector-gated and disabled by default.",
        providerCalled: false,
        sent: false,
        published: false,
      })),
    ],
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function decideUnifiedApproval(input: { approvalId: string; decision: ApprovalDecision; note?: string }): UnifiedApprovalDecisionResult {
  const queue = getUnifiedApprovalQueue();
  const item = queue.items.find((approvalItem) => approvalItem.id === input.approvalId) ?? null;

  if (!item) {
    return {
      ok: false,
      error: "Approval item not found.",
      providerCalled: false,
      liveExecutionAllowed: false,
    };
  }

  const statusByDecision: Record<ApprovalDecision, UnifiedApprovalItem["approvalStatus"]> = {
    approve: "approved",
    reject: "rejected",
    edit: "pending_review",
    reschedule: "rescheduled",
    delegate: "delegated",
    block: "blocked",
  };

  return {
    ok: true,
    approval: {
      ...item,
      approvalStatus: statusByDecision[input.decision],
      latestDecision: input.decision,
      note: input.note ?? null,
      auditLogged: true,
      approvalDoesNotBypassSafeAuto: true,
    },
    providerCalled: false,
    sent: false,
    published: false,
    liveExecutionAllowed: false,
  };
}

export function getSocialOpsDrafts() {
  return {
    ok: true,
    supportedPlatforms: supportedSocialPlatforms,
    drafts: socialOpsDrafts,
    providerCalled: false,
    published: false,
    scheduled: false,
    liveExecutionAllowed: false,
  };
}

export function repurposeSocialDraft(input: { draftId: string }) {
  const draft = socialOpsDrafts.find((item) => item.id === input.draftId) ?? socialOpsDrafts[0];

  return {
    ok: true,
    sourceDraftId: draft.id,
    variants: [
      { platform: "linkedin", format: "thought_leadership_post", copy: `${draft.title}: review the approved source, keep it educational, and include a clear source label.` },
      { platform: "facebook", format: "educational_post", copy: draft.draftCopy },
      { platform: "x", format: "thread_outline", copy: "Thread outline: problem, context, practical questions, no-pressure CTA." },
      { platform: "youtube", format: "short_script", copy: "Short script: introduce the owner question, explain practical next steps, invite private review." },
    ],
    approvalRequired: true,
    providerCalled: false,
    published: false,
    scheduled: false,
    liveExecutionAllowed: false,
  };
}

export function createSocialExecutionPlan(input: { draftId: string; connectorId?: string; actionKey?: string }) {
  const draft = socialOpsDrafts.find((item) => item.id === input.draftId) ?? socialOpsDrafts[0];
  const connectorId = input.connectorId ?? draft.connectorId;
  const actionKey = input.actionKey ?? (draft.platform === "google_business_profile" ? "prepare_gbp_post" : "create_social_asset_brief");
  const connectorPlan = evaluateConnectorAction({ connectorId, actionKey, module: "Social Media Operations" });

  return {
    ok: true,
    draft,
    connectorPlan,
    executionStatus: connectorPlan.decision === "blocked" || connectorPlan.decision === "fallback_required" ? "blocked_or_fallback" : "approval_required",
    providerCalled: false,
    published: false,
    scheduled: false,
    liveExecutionAllowed: false,
  };
}

export function getAutomationPolicies() {
  return {
    ok: true,
    policies: automationPolicies,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function getLearningOutcomes() {
  return {
    ok: true,
    outcomes: learningOutcomes,
    autonomousSelfModification: false,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function createMobileCommandCenter() {
  const briefing = createExecutiveBriefing("daily");
  const market = createMarketIntelligenceReport();
  const demand = createDemandDiscoveryReport();
  const approvals = getUnifiedApprovalQueue();
  const safeBriefing = evaluateSafeAutomation({
    requestedAction: "score_roi_opportunity",
    module: "Mobile Command Center",
    expectedRoi: "high",
  });

  return {
    ok: true,
    pwaReady: true,
    panels: {
      executiveBriefing: briefing.priorities,
      revenueSpine: { status: "source-aware", nextAction: "Review high-priority leads and approval queue." },
      crm: { status: "lead-source-required", nextAction: "Keep follow-up tasks internal until approved." },
      taskCenter: { openTasks: approvals.items.length, providerCalled: false },
      approvalCenter: approvals.items,
      connectorHealth: getConnectorHealth(),
      marketingQueue: socialOpsDrafts,
      marketIntelligence: market.signals,
      demandDiscovery: demand.opportunities,
      notifications: [
        "Live connector execution remains blocked by default.",
        "Approval decisions are audit events, not automatic send/publish authority.",
        safeBriefing.reason,
      ],
    },
    providerCalled: false,
    sent: false,
    published: false,
    liveExecutionAllowed: false,
  };
}

export function createVerticalSliceSimulation() {
  const leadSource = "website_form";
  const score = {
    score: 72,
    confidence: 68,
    explanation: "Lead source is present and the internal workflow can prepare review tasks. No enrichment provider was called.",
    sourceLabel: leadSource,
  };
  const followUpTask = {
    title: "Review seller follow-up",
    status: "needs_review",
    providerCalled: false,
    sent: false,
  };
  const socialPlan = createSocialExecutionPlan({ draftId: "gbp-educational-owner-options" });

  return {
    ok: true,
    lead: { source: leadSource, sourcePreserved: true },
    score,
    followUpTask,
    contentDrafts: socialOpsDrafts,
    approvalQueue: getUnifiedApprovalQueue().items,
    executionPlan: socialPlan.connectorPlan,
    executiveBriefing: createExecutiveBriefing("daily").priorities,
    auditTrail: ["lead_source_preserved", "score_explained", "task_created_internal", "drafts_prepared", "approval_required", "execution_blocked_until_policy_enabled"],
    providerCalled: false,
    sent: false,
    published: false,
    liveExecutionAllowed: false,
  };
}
