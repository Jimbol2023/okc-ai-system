export type ToolCategory =
  | "property_data"
  | "marketing"
  | "communication"
  | "analytics"
  | "ai_provider"
  | "workflow"
  | "macro_intelligence";

export type ToolHealthStatus = "healthy" | "degraded" | "rate_limited" | "unavailable" | "readiness_only";

export type ToolActionRisk = "low" | "medium" | "high" | "blocked";

export type ToolSupportedAction = {
  actionKey: string;
  label: string;
  risk: ToolActionRisk;
  approvalRequired: boolean;
  externalAction: boolean;
  liveExecutionAllowed: boolean;
};

export type ToolDefinition = {
  toolKey: string;
  name: string;
  purpose: string;
  category: ToolCategory;
  version: string;
  authenticationMethod: string;
  requiredPermissions: string[];
  healthStatus: ToolHealthStatus;
  supportedActions: ToolSupportedAction[];
  rateLimits: {
    window: string;
    maxRequests: number | null;
    currentRemaining: number | null;
  };
  costPerCallCents: number | null;
  lastSuccessfulRunAt: string | null;
  lastFailureAt: string | null;
  retryPolicy: string;
  owner: string;
  auditHistory: string[];
  approvalRequirements: string[];
  fallbackToolKeys: string[];
  providerCallsAllowed: false;
  safetyNotes: string;
};

export type ToolDecisionInput = {
  requestedAction: string;
  preferredToolKey?: string;
  module?: string;
};

export type ToolDecision = {
  requestingModule: string;
  requestedAction: string;
  selectedToolKey: string | null;
  fallbackToolKey: string | null;
  decision: "selected_draft_only" | "fallback_selected" | "approval_required" | "blocked";
  reason: string;
  confidence: number;
  approvalRequired: boolean;
  blockedReason: string | null;
  providerCalled: false;
  liveExecutionAllowed: false;
};

const sharedBlockedActions: ToolSupportedAction[] = [
  {
    actionKey: "publish",
    label: "Publish externally",
    risk: "blocked",
    approvalRequired: true,
    externalAction: true,
    liveExecutionAllowed: false,
  },
  {
    actionKey: "send_message",
    label: "Send external message",
    risk: "blocked",
    approvalRequired: true,
    externalAction: true,
    liveExecutionAllowed: false,
  },
];

export const toolRegistry: ToolDefinition[] = [
  {
    toolKey: "canva",
    name: "Canva",
    purpose: "Prepare brand-safe design briefs, copy blocks, and manual design instructions for marketing assets.",
    category: "marketing",
    version: "1.0.0",
    authenticationMethod: "manual_account_or_future_oauth",
    requiredPermissions: ["Brand kit access", "Design edit access"],
    healthStatus: "readiness_only",
    supportedActions: [
      {
        actionKey: "create_flyer_brief",
        label: "Create flyer design brief",
        risk: "low",
        approvalRequired: true,
        externalAction: false,
        liveExecutionAllowed: false,
      },
      {
        actionKey: "create_social_asset_brief",
        label: "Create social asset brief",
        risk: "low",
        approvalRequired: true,
        externalAction: false,
        liveExecutionAllowed: false,
      },
      ...sharedBlockedActions,
    ],
    rateLimits: { window: "manual", maxRequests: null, currentRemaining: null },
    costPerCallCents: null,
    lastSuccessfulRunAt: null,
    lastFailureAt: null,
    retryPolicy: "No live retry in v1. Regenerate internal brief after human review.",
    owner: "Marketing",
    auditHistory: ["manual_canva_asset_assist_ready"],
    approvalRequirements: ["Human content approval", "Brand asset approval"],
    fallbackToolKeys: ["manual_design_brief"],
    providerCallsAllowed: false,
    safetyNotes: "No Canva API calls, exports, publishing, or automatic design creation in v1.",
  },
  {
    toolKey: "google_business_profile",
    name: "Google Business Profile",
    purpose: "Prepare Google Business Profile update drafts and manual posting checklists.",
    category: "marketing",
    version: "1.0.0",
    authenticationMethod: "future_oauth",
    requiredPermissions: ["Business profile owner or manager"],
    healthStatus: "readiness_only",
    supportedActions: [
      {
        actionKey: "prepare_gbp_post",
        label: "Prepare GBP post",
        risk: "medium",
        approvalRequired: true,
        externalAction: false,
        liveExecutionAllowed: false,
      },
      ...sharedBlockedActions,
    ],
    rateLimits: { window: "not_connected", maxRequests: null, currentRemaining: null },
    costPerCallCents: null,
    lastSuccessfulRunAt: null,
    lastFailureAt: null,
    retryPolicy: "Do not retry live calls. Keep post as manual publish assist.",
    owner: "Marketing",
    auditHistory: ["gbp_readiness_manual_only"],
    approvalRequirements: ["Human publish approval", "Profile ownership verification"],
    fallbackToolKeys: ["manual_marketing_draft"],
    providerCallsAllowed: false,
    safetyNotes: "GBP updates are draft-only until profile ownership, audit logging, and publish gates are approved.",
  },
  {
    toolKey: "county_assessor",
    name: "County Assessor Records",
    purpose: "Verify property ownership using approved public county sources or manually imported records.",
    category: "property_data",
    version: "1.0.0",
    authenticationMethod: "public_or_manual_import",
    requiredPermissions: ["Approved source policy", "Source attribution"],
    healthStatus: "readiness_only",
    supportedActions: [
      {
        actionKey: "verify_ownership",
        label: "Verify ownership",
        risk: "medium",
        approvalRequired: true,
        externalAction: false,
        liveExecutionAllowed: false,
      },
    ],
    rateLimits: { window: "manual", maxRequests: null, currentRemaining: null },
    costPerCallCents: 0,
    lastSuccessfulRunAt: null,
    lastFailureAt: null,
    retryPolicy: "Use manual source review; do not scrape or crawl county sites.",
    owner: "Property Intelligence",
    auditHistory: ["county_records_preferred_for_property_verification"],
    approvalRequirements: ["Source verification", "No scraping approval required because scraping is blocked"],
    fallbackToolKeys: ["attom"],
    providerCallsAllowed: false,
    safetyNotes: "No fabricated ownership, no unauthorized scraping, and no property claim without source evidence.",
  },
  {
    toolKey: "attom",
    name: "ATTOM",
    purpose: "Future commercial property data fallback when licensed access is configured and approved.",
    category: "property_data",
    version: "1.0.0",
    authenticationMethod: "api_key",
    requiredPermissions: ["Licensed ATTOM API key", "Approved enrichment policy"],
    healthStatus: "unavailable",
    supportedActions: [
      {
        actionKey: "verify_ownership",
        label: "Verify ownership with commercial data",
        risk: "high",
        approvalRequired: true,
        externalAction: true,
        liveExecutionAllowed: false,
      },
    ],
    rateLimits: { window: "not_configured", maxRequests: null, currentRemaining: null },
    costPerCallCents: null,
    lastSuccessfulRunAt: null,
    lastFailureAt: null,
    retryPolicy: "Fallback to county records when unavailable.",
    owner: "Property Intelligence",
    auditHistory: ["attom_not_activated"],
    approvalRequirements: ["Connector activation approval", "Cost control approval", "Data write approval"],
    fallbackToolKeys: ["county_assessor"],
    providerCallsAllowed: false,
    safetyNotes: "Commercial provider calls and enrichment writes remain blocked in v1.",
  },
  {
    toolKey: "twilio",
    name: "Twilio",
    purpose: "Future SMS/voice provider for approved communication workflows.",
    category: "communication",
    version: "1.0.0",
    authenticationMethod: "api_key",
    requiredPermissions: ["Twilio account", "Approved sender identity", "Consent and DNC checks"],
    healthStatus: "rate_limited",
    supportedActions: [
      {
        actionKey: "queue_sms_draft",
        label: "Queue SMS draft",
        risk: "medium",
        approvalRequired: true,
        externalAction: false,
        liveExecutionAllowed: false,
      },
      {
        actionKey: "send_sms",
        label: "Send SMS",
        risk: "blocked",
        approvalRequired: true,
        externalAction: true,
        liveExecutionAllowed: false,
      },
    ],
    rateLimits: { window: "simulated", maxRequests: 0, currentRemaining: 0 },
    costPerCallCents: null,
    lastSuccessfulRunAt: null,
    lastFailureAt: null,
    retryPolicy: "Queue draft and notify operator when rate-limited. Do not send automatically.",
    owner: "Revenue Operations",
    auditHistory: ["sms_send_blocked_in_safe_auto_internal"],
    approvalRequirements: ["Human send approval", "Consent validation", "DNC validation"],
    fallbackToolKeys: ["manual_follow_up_task"],
    providerCallsAllowed: false,
    safetyNotes: "SMS sending is blocked. Safe mode can prepare drafts and tasks only.",
  },
  {
    toolKey: "manual_marketing_draft",
    name: "Manual Marketing Draft",
    purpose: "Internal fallback for content preparation when platform connectors are unavailable.",
    category: "marketing",
    version: "1.0.0",
    authenticationMethod: "none",
    requiredPermissions: ["Authenticated dashboard access"],
    healthStatus: "healthy",
    supportedActions: [
      {
        actionKey: "prepare_gbp_post",
        label: "Prepare post copy manually",
        risk: "low",
        approvalRequired: true,
        externalAction: false,
        liveExecutionAllowed: false,
      },
      {
        actionKey: "create_social_asset_brief",
        label: "Prepare manual social asset brief",
        risk: "low",
        approvalRequired: true,
        externalAction: false,
        liveExecutionAllowed: false,
      },
    ],
    rateLimits: { window: "internal", maxRequests: null, currentRemaining: null },
    costPerCallCents: 0,
    lastSuccessfulRunAt: null,
    lastFailureAt: null,
    retryPolicy: "Internal draft regeneration allowed after human edits.",
    owner: "Marketing",
    auditHistory: ["manual_fallback_ready"],
    approvalRequirements: ["Human content approval"],
    fallbackToolKeys: [],
    providerCallsAllowed: false,
    safetyNotes: "Internal fallback only; never posts or schedules.",
  },
  {
    toolKey: "manual_follow_up_task",
    name: "Manual Follow-Up Task",
    purpose: "Internal fallback for communication preparation when SMS/email tools are unavailable or blocked.",
    category: "communication",
    version: "1.0.0",
    authenticationMethod: "none",
    requiredPermissions: ["Authenticated dashboard access"],
    healthStatus: "healthy",
    supportedActions: [
      {
        actionKey: "queue_sms_draft",
        label: "Create manual follow-up task",
        risk: "low",
        approvalRequired: true,
        externalAction: false,
        liveExecutionAllowed: false,
      },
    ],
    rateLimits: { window: "internal", maxRequests: null, currentRemaining: null },
    costPerCallCents: 0,
    lastSuccessfulRunAt: null,
    lastFailureAt: null,
    retryPolicy: "Create or revise internal task; no provider retry.",
    owner: "Revenue Operations",
    auditHistory: ["manual_contact_task_ready"],
    approvalRequirements: ["Human contact safety review"],
    fallbackToolKeys: [],
    providerCallsAllowed: false,
    safetyNotes: "Creates internal preparation only. Contact remains human-owned.",
  },
  {
    toolKey: "manual_design_brief",
    name: "Manual Design Brief",
    purpose: "Internal fallback for design instructions when Canva is unavailable.",
    category: "marketing",
    version: "1.0.0",
    authenticationMethod: "none",
    requiredPermissions: ["Authenticated dashboard access"],
    healthStatus: "healthy",
    supportedActions: [
      {
        actionKey: "create_flyer_brief",
        label: "Create manual flyer brief",
        risk: "low",
        approvalRequired: true,
        externalAction: false,
        liveExecutionAllowed: false,
      },
    ],
    rateLimits: { window: "internal", maxRequests: null, currentRemaining: null },
    costPerCallCents: 0,
    lastSuccessfulRunAt: null,
    lastFailureAt: null,
    retryPolicy: "Revise internal design brief after review.",
    owner: "Marketing",
    auditHistory: ["manual_design_fallback_ready"],
    approvalRequirements: ["Brand review"],
    fallbackToolKeys: [],
    providerCallsAllowed: false,
    safetyNotes: "Internal design planning only.",
  },
  {
    toolKey: "approved_news_registry",
    name: "Approved News and Policy Source Registry",
    purpose: "Summarize manually approved macro, news, economic, and policy signals for internal executive review.",
    category: "macro_intelligence",
    version: "1.0.0",
    authenticationMethod: "manual_or_future_licensed_feed",
    requiredPermissions: ["Approved source list", "Attribution notes"],
    healthStatus: "healthy",
    supportedActions: [
      {
        actionKey: "summarize_macro_signal",
        label: "Summarize macro signal",
        risk: "low",
        approvalRequired: false,
        externalAction: false,
        liveExecutionAllowed: false,
      },
    ],
    rateLimits: { window: "internal", maxRequests: null, currentRemaining: null },
    costPerCallCents: 0,
    lastSuccessfulRunAt: null,
    lastFailureAt: null,
    retryPolicy: "Block public use if attribution or source approval is missing.",
    owner: "Executive AI",
    auditHistory: ["macro_source_registry_ready"],
    approvalRequirements: ["Source approval before public use"],
    fallbackToolKeys: [],
    providerCallsAllowed: false,
    safetyNotes: "No live news/API/RSS calls in v1; approved or manual source summaries only.",
  },
];

export function listToolCapabilities() {
  return toolRegistry;
}

export function getToolReadiness(toolKey: string) {
  return toolRegistry.find((tool) => tool.toolKey === toolKey) ?? null;
}

function findSupportedAction(tool: ToolDefinition, actionKey: string) {
  return tool.supportedActions.find((action) => action.actionKey === actionKey) ?? null;
}

function isToolSelectable(tool: ToolDefinition, actionKey: string) {
  const action = findSupportedAction(tool, actionKey);

  return Boolean(action && action.risk !== "blocked" && tool.healthStatus !== "unavailable" && tool.healthStatus !== "rate_limited");
}

export function getFallbackTool(toolKey: string, actionKey: string) {
  const tool = getToolReadiness(toolKey);

  if (!tool) return null;

  return tool.fallbackToolKeys
    .map((fallbackKey) => getToolReadiness(fallbackKey))
    .find((fallback): fallback is ToolDefinition => Boolean(fallback && isToolSelectable(fallback, actionKey))) ?? null;
}

export function selectToolForAction(input: ToolDecisionInput): ToolDecision {
  const requestingModule = input.module?.trim() || "Executive AI";
  const preferredTool = input.preferredToolKey ? getToolReadiness(input.preferredToolKey) : null;
  const candidate = preferredTool ?? toolRegistry.find((tool) => isToolSelectable(tool, input.requestedAction)) ?? null;

  if (preferredTool) {
    const action = findSupportedAction(preferredTool, input.requestedAction);
    const fallback = getFallbackTool(preferredTool.toolKey, input.requestedAction);

    if (!action) {
      return {
        requestingModule,
        requestedAction: input.requestedAction,
        selectedToolKey: fallback?.toolKey ?? null,
        fallbackToolKey: fallback?.toolKey ?? null,
        decision: fallback ? "fallback_selected" : "blocked",
        reason: fallback
          ? `${preferredTool.name} does not support this action. Use ${fallback.name} as the internal fallback.`
          : `${preferredTool.name} does not support this action and no safe fallback is registered.`,
        confidence: fallback ? 74 : 35,
        approvalRequired: true,
        blockedReason: fallback ? null : "unsupported_action",
        providerCalled: false,
        liveExecutionAllowed: false,
      };
    }

    if (action.risk === "blocked" || preferredTool.healthStatus === "unavailable" || preferredTool.healthStatus === "rate_limited") {
      return {
        requestingModule,
        requestedAction: input.requestedAction,
        selectedToolKey: fallback?.toolKey ?? null,
        fallbackToolKey: fallback?.toolKey ?? null,
        decision: fallback ? "fallback_selected" : "blocked",
        reason: fallback
          ? `${preferredTool.name} is ${preferredTool.healthStatus}; use ${fallback.name} and keep the work internal.`
          : `${preferredTool.name} cannot be used because it is ${preferredTool.healthStatus}.`,
        confidence: fallback ? 82 : 40,
        approvalRequired: true,
        blockedReason: fallback ? null : preferredTool.healthStatus,
        providerCalled: false,
        liveExecutionAllowed: false,
      };
    }
  }

  if (!candidate) {
    return {
      requestingModule,
      requestedAction: input.requestedAction,
      selectedToolKey: null,
      fallbackToolKey: null,
      decision: "blocked",
      reason: "No approved tool supports this action in safe mode.",
      confidence: 30,
      approvalRequired: true,
      blockedReason: "no_supported_tool",
      providerCalled: false,
      liveExecutionAllowed: false,
    };
  }

  const action = findSupportedAction(candidate, input.requestedAction);

  return {
    requestingModule,
    requestedAction: input.requestedAction,
    selectedToolKey: candidate.toolKey,
    fallbackToolKey: null,
    decision: action?.approvalRequired ? "approval_required" : "selected_draft_only",
    reason: `${candidate.name} can support ${action?.label ?? input.requestedAction} as internal preparation only. Live execution remains blocked.`,
    confidence: candidate.healthStatus === "healthy" ? 92 : 78,
    approvalRequired: action?.approvalRequired ?? true,
    blockedReason: null,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function createToolRegistrySummary() {
  const tools = listToolCapabilities();

  return {
    totalTools: tools.length,
    healthyTools: tools.filter((tool) => tool.healthStatus === "healthy").length,
    readinessOnlyTools: tools.filter((tool) => tool.healthStatus === "readiness_only").length,
    blockedOrUnavailableTools: tools.filter((tool) => tool.healthStatus === "unavailable" || tool.healthStatus === "rate_limited").length,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}
