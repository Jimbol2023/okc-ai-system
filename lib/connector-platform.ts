import { getFeatureFlagSnapshot, isFeatureEnabled, type FeatureFlagKey } from "@/lib/feature-flags";
import { evaluateSafeAutomation } from "@/lib/safe-auto-mode";
import { getToolReadiness, selectToolForAction, type ToolActionRisk, type ToolCategory } from "@/lib/tool-capability-manager";

export type ConnectorLifecycleAction =
  | "install"
  | "configure"
  | "authenticate"
  | "test"
  | "enable"
  | "disable"
  | "upgrade"
  | "rollback"
  | "remove"
  | "monitor";

export type ConnectorLifecycleState =
  | "available"
  | "installed"
  | "configured"
  | "authenticated"
  | "tested"
  | "enabled"
  | "disabled"
  | "upgrade_available"
  | "rolled_back"
  | "removed"
  | "monitor_only";

export type ConnectorHealthStatus = "healthy" | "degraded" | "rate_limited" | "unavailable" | "readiness_only";

export type CircuitBreakerState = "closed" | "open" | "half_open" | "not_applicable";

export type ConnectorAction = {
  actionKey: string;
  /** Canonical UEIP semantic capability. Falls back to actionKey derivation for legacy actions. */
  capabilityKey?: string;
  label: string;
  type: "read" | "write" | "prepare" | "monitor";
  risk: ToolActionRisk;
  approvalRequired: boolean;
  safeAutoEligible: boolean;
  liveExecutionAllowed: false;
};

export type ConnectorHealthCheck = {
  connectorId: string;
  status: ConnectorHealthStatus;
  checkedAt: string;
  reason: string;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type EnterpriseConnector = {
  connectorId: string;
  displayName: string;
  category: ToolCategory | "productivity" | "government" | "news";
  provider: string;
  version: string;
  authenticationType: "none" | "api_key" | "oauth" | "service_account" | "manual" | "licensed_feed";
  oauthSupported: boolean;
  requiredPermissions: string[];
  supportedActions: ConnectorAction[];
  readCapabilities: string[];
  writeCapabilities: string[];
  humanApprovalRequirements: string[];
  safeAutoEligibility: "internal_only" | "approval_required" | "blocked";
  rateLimits: string;
  usageQuotas: string;
  estimatedCost: string;
  healthStatus: ConnectorHealthStatus;
  lastSuccessfulSync: string | null;
  lastFailedSync: string | null;
  retryPolicy: string;
  timeoutPolicy: string;
  circuitBreakerState: CircuitBreakerState;
  loggingConfiguration: string;
  auditConfiguration: string;
  riskLevel: "low" | "medium" | "high";
  environmentSupport: Array<"development" | "preview" | "production">;
  featureFlags: FeatureFlagKey[];
  dependencies: string[];
  owner: string;
  credentialReference: string | null;
  lifecycleState: ConnectorLifecycleState;
};

export type ConnectorExecutionPlan = {
  connectorId: string | null;
  requestedAction: string;
  decision: "internal_preparation_allowed" | "approval_required" | "blocked" | "fallback_required";
  reason: string;
  confidence: number;
  requiredApprovals: string[];
  fallbackConnectorId: string | null;
  providerCalled: false;
  liveExecutionAllowed: false;
  auditRequired: true;
};

export type ConnectorResult = {
  ok: boolean;
  connectorId: string | null;
  actionKey: string;
  status: "prepared" | "blocked" | "requires_approval";
  message: string;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ConnectorAdapter = {
  connectorId: string;
  metadata: EnterpriseConnector;
  healthCheck: () => Promise<ConnectorHealthCheck>;
  planAction: (actionKey: string, module?: string) => Promise<ConnectorExecutionPlan>;
  execute: (plan: ConnectorExecutionPlan) => Promise<ConnectorResult>;
};

const blockedWriteAction: ConnectorAction = {
  actionKey: "external_write",
  label: "External write action",
  type: "write",
  risk: "blocked",
  approvalRequired: true,
  safeAutoEligible: false,
  liveExecutionAllowed: false,
};

export const enterpriseConnectors: EnterpriseConnector[] = [
  {
    connectorId: "google_business_profile",
    displayName: "Google Business Profile",
    category: "marketing",
    provider: "Google",
    version: "1.0.0",
    authenticationType: "oauth",
    oauthSupported: true,
    requiredPermissions: ["https://www.googleapis.com/auth/business.manage"],
    supportedActions: [
      {
        actionKey: "read_gbp_performance",
        capabilityKey: "gbp.performance.read",
        label: "Read GBP performance",
        type: "read",
        risk: "low",
        approvalRequired: false,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      {
        actionKey: "read_gbp_reviews",
        capabilityKey: "gbp.reviews.read",
        label: "Read GBP reviews",
        type: "read",
        risk: "medium",
        approvalRequired: false,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      {
        actionKey: "prepare_gbp_post",
        label: "Prepare GBP post",
        type: "prepare",
        risk: "medium",
        approvalRequired: true,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      blockedWriteAction,
    ],
    readCapabilities: ["local visibility performance", "review readiness", "call and direction request context", "sanitized aggregate evidence"],
    writeCapabilities: ["profile updates blocked", "posts blocked", "media uploads blocked", "review replies blocked", "verification and admin changes blocked"],
    humanApprovalRequirements: ["CEO approval required before production provider reads", "Profile ownership verification", "Human approval required before any future publish or reply policy"],
    safeAutoEligibility: "internal_only",
    rateLimits: "Google Business Profile API quotas apply; fail closed on quota errors",
    usageQuotas: "Single governed Preview certification read; production reads remain blocked until promotion approval",
    estimatedCost: "No direct API cost expected",
    healthStatus: "readiness_only",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Record data gap and continue other read-only adapters; no automatic replay outside the one-use Preview pilot.",
    timeoutPolicy: "Bounded UEIP adapter timeout with fail-closed provider behavior.",
    circuitBreakerState: "not_applicable",
    loggingConfiguration: "Sanitized metadata and normalized evidence only; no raw provider payloads or secrets",
    auditConfiguration: "UEIP gateway audit chain with Preview certification closeout evidence",
    riskLevel: "medium",
    environmentSupport: ["development", "preview", "production"],
    featureFlags: ["connector_live_reads", "connector_google", "connector_marketing", "ueip_gateway_enforcement", "ueip_gbp_runtime"],
    dependencies: ["tool_registry", "safe_auto_internal", "read_only_business_connections", "ueip_runtime_gateway"],
    owner: "Marketing",
    credentialReference: "GOOGLE_BUSINESS_PROFILE_OAUTH_REFERENCE",
    lifecycleState: "available",
  },
  {
    connectorId: "gmail",
    displayName: "Gmail",
    category: "communication",
    provider: "Google",
    version: "1.0.0",
    authenticationType: "oauth",
    oauthSupported: true,
    requiredPermissions: ["https://www.googleapis.com/auth/gmail.readonly"],
    supportedActions: [
      {
        actionKey: "read_gmail_inbox",
        label: "Read Gmail inbox metadata",
        type: "read",
        risk: "medium",
        approvalRequired: false,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      {
        actionKey: "draft_email",
        label: "Draft email",
        type: "prepare",
        risk: "medium",
        approvalRequired: true,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      blockedWriteAction,
    ],
    readCapabilities: ["inbox metadata", "message snippets", "sender/subject/date headers"],
    writeCapabilities: ["blocked email sending"],
    humanApprovalRequirements: ["Human send approval", "Consent validation"],
    safeAutoEligibility: "internal_only",
    rateLimits: "Gmail API quotas apply; fail closed on quota errors",
    usageQuotas: "Daily read-only CEO briefing snapshots",
    estimatedCost: "No direct API cost expected",
    healthStatus: "readiness_only",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Record data gap; never draft or send email.",
    timeoutPolicy: "Short server-side read timeout recommended.",
    circuitBreakerState: "not_applicable",
    loggingConfiguration: "No message body in audit summaries",
    auditConfiguration: "Audit draft decision and approval requirement",
    riskLevel: "high",
    environmentSupport: ["development", "preview", "production"],
    featureFlags: ["connector_live_reads", "connector_google", "connector_communication"],
    dependencies: ["consent_policy", "safe_auto_internal", "read_only_business_connections"],
    owner: "Revenue Operations",
    credentialReference: "GMAIL_OAUTH_REFERENCE",
    lifecycleState: "enabled",
  },
  {
    connectorId: "google_calendar",
    displayName: "Google Calendar",
    category: "productivity",
    provider: "Google",
    version: "1.0.0",
    authenticationType: "oauth",
    oauthSupported: true,
    requiredPermissions: ["https://www.googleapis.com/auth/calendar.events.readonly"],
    supportedActions: [
      {
        actionKey: "read_calendar_events",
        label: "Read calendar events",
        type: "read",
        risk: "low",
        approvalRequired: false,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      {
        actionKey: "prepare_meeting_plan",
        label: "Prepare meeting plan",
        type: "prepare",
        risk: "low",
        approvalRequired: true,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      blockedWriteAction,
    ],
    readCapabilities: ["upcoming event metadata"],
    writeCapabilities: ["blocked calendar invite creation"],
    humanApprovalRequirements: ["Meeting scheduling approval"],
    safeAutoEligibility: "internal_only",
    rateLimits: "Google Calendar API quotas apply; fail closed on quota errors",
    usageQuotas: "Daily read-only CEO briefing snapshots",
    estimatedCost: "No direct API cost expected",
    healthStatus: "readiness_only",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Record data gap; never create or update calendar events.",
    timeoutPolicy: "Short server-side read timeout recommended.",
    circuitBreakerState: "not_applicable",
    loggingConfiguration: "Safe metadata only",
    auditConfiguration: "Audit meeting-prep recommendation",
    riskLevel: "medium",
    environmentSupport: ["development", "preview", "production"],
    featureFlags: ["connector_live_reads", "connector_google"],
    dependencies: ["relationship_engine", "read_only_business_connections"],
    owner: "Business Development",
    credentialReference: "GOOGLE_CALENDAR_OAUTH_REFERENCE",
    lifecycleState: "enabled",
  },
  {
    connectorId: "google_drive",
    displayName: "Google Drive",
    category: "productivity",
    provider: "Google",
    version: "1.0.0",
    authenticationType: "oauth",
    oauthSupported: true,
    requiredPermissions: ["https://www.googleapis.com/auth/drive.metadata.readonly"],
    supportedActions: [
      {
        actionKey: "read_drive_documents",
        label: "Read Drive document metadata",
        type: "read",
        risk: "medium",
        approvalRequired: false,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      blockedWriteAction,
    ],
    readCapabilities: ["recent file metadata", "document title", "modified time"],
    writeCapabilities: ["blocked Drive file creation, update, delete, sharing, and export"],
    humanApprovalRequirements: ["Workspace admin approval", "Least-privilege scope verification"],
    safeAutoEligibility: "internal_only",
    rateLimits: "Google Drive API quotas apply; fail closed on quota errors",
    usageQuotas: "Daily read-only CEO briefing snapshots",
    estimatedCost: "No direct API cost expected",
    healthStatus: "readiness_only",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Record data gap; never create, export, share, update, or delete Drive files.",
    timeoutPolicy: "Short server-side read timeout recommended.",
    circuitBreakerState: "not_applicable",
    loggingConfiguration: "Metadata summaries only; no raw document bodies",
    auditConfiguration: "Audit read-only snapshot source, freshness, and data gaps",
    riskLevel: "medium",
    environmentSupport: ["development", "preview", "production"],
    featureFlags: ["connector_live_reads", "connector_google"],
    dependencies: ["safe_auto_internal", "read_only_business_connections"],
    owner: "Operations",
    credentialReference: "GOOGLE_OAUTH_REFRESH_TOKEN_REFERENCE",
    lifecycleState: "enabled",
  },
  {
    connectorId: "google_search_console",
    displayName: "Google Search Console",
    category: "marketing",
    provider: "Google",
    version: "1.0.0",
    authenticationType: "oauth",
    oauthSupported: true,
    requiredPermissions: ["https://www.googleapis.com/auth/webmasters.readonly"],
    supportedActions: [
      {
        actionKey: "read_search_console",
        capabilityKey: "seo.page.performance.read",
        label: "Read Search Console performance and indexing",
        type: "read",
        risk: "low",
        approvalRequired: false,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      {
        actionKey: "read_search_console_indexing",
        capabilityKey: "seo.indexing.summary.read",
        label: "Read Search Console indexing summary",
        type: "read",
        risk: "low",
        approvalRequired: false,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      {
        actionKey: "read_search_console_queries",
        capabilityKey: "seo.query.performance.read",
        label: "Read bounded Search Console query performance",
        type: "read",
        risk: "low",
        approvalRequired: false,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      blockedWriteAction,
    ],
    readCapabilities: ["impressions", "clicks", "bounded top queries", "top pages", "index inspection"],
    writeCapabilities: ["blocked sitemap submission, site mutation, and indexing writes"],
    humanApprovalRequirements: ["Search Console property approval", "Site URL verification"],
    safeAutoEligibility: "internal_only",
    rateLimits: "Search Console API quotas apply; fail closed on quota errors",
    usageQuotas: "Daily read-only CEO briefing snapshots",
    estimatedCost: "No direct API cost expected",
    healthStatus: "readiness_only",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Record data gap and continue other adapters.",
    timeoutPolicy: "Short server-side read timeout recommended.",
    circuitBreakerState: "not_applicable",
    loggingConfiguration: "Page URLs and aggregate metrics only",
    auditConfiguration: "Audit read-only snapshot source, freshness, and data gaps",
    riskLevel: "low",
    environmentSupport: ["development", "preview", "production"],
    featureFlags: ["connector_live_reads", "connector_google", "executive_briefings"],
    dependencies: ["safe_auto_internal", "read_only_business_connections"],
    owner: "SEO",
    credentialReference: "GOOGLE_OAUTH_REFRESH_TOKEN_REFERENCE",
    lifecycleState: "enabled",
  },
  {
    connectorId: "google_analytics",
    displayName: "Google Analytics",
    category: "marketing",
    provider: "Google",
    version: "1.0.0",
    authenticationType: "oauth",
    oauthSupported: true,
    requiredPermissions: ["https://www.googleapis.com/auth/analytics.readonly"],
    supportedActions: [
      {
        actionKey: "read_ga4_traffic",
        label: "Read GA4 traffic",
        type: "read",
        risk: "low",
        approvalRequired: false,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      blockedWriteAction,
    ],
    readCapabilities: ["traffic", "conversions", "top pages"],
    writeCapabilities: ["blocked analytics property, conversion, audience, or tag mutation"],
    humanApprovalRequirements: ["GA4 property approval", "Analytics scope verification"],
    safeAutoEligibility: "internal_only",
    rateLimits: "GA4 Data API quotas apply; fail closed on quota errors",
    usageQuotas: "Daily read-only CEO briefing snapshots",
    estimatedCost: "No direct API cost expected",
    healthStatus: "readiness_only",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Record data gap and continue other adapters.",
    timeoutPolicy: "Short server-side read timeout recommended.",
    circuitBreakerState: "not_applicable",
    loggingConfiguration: "Aggregate metrics and page paths only",
    auditConfiguration: "Audit read-only snapshot source, freshness, and data gaps",
    riskLevel: "low",
    environmentSupport: ["development", "preview", "production"],
    featureFlags: ["connector_live_reads", "connector_google", "executive_briefings"],
    dependencies: ["safe_auto_internal", "read_only_business_connections"],
    owner: "Marketing",
    credentialReference: "GOOGLE_OAUTH_REFRESH_TOKEN_REFERENCE",
    lifecycleState: "enabled",
  },
  {
    connectorId: "meta_pages",
    displayName: "Facebook Pages / Instagram Business",
    category: "marketing",
    provider: "Meta",
    version: "1.0.0",
    authenticationType: "oauth",
    oauthSupported: true,
    requiredPermissions: ["Page read permissions after app review"],
    supportedActions: [
      {
        actionKey: "prepare_social_post",
        label: "Prepare social post",
        type: "prepare",
        risk: "medium",
        approvalRequired: true,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      blockedWriteAction,
    ],
    readCapabilities: ["manual performance snapshot"],
    writeCapabilities: ["blocked social publishing"],
    humanApprovalRequirements: ["Content approval", "Publish approval"],
    safeAutoEligibility: "internal_only",
    rateLimits: "Not connected",
    usageQuotas: "None consumed",
    estimatedCost: "No live cost in v1",
    healthStatus: "readiness_only",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Use manual marketing draft fallback.",
    timeoutPolicy: "No live timeout in foundation mode.",
    circuitBreakerState: "not_applicable",
    loggingConfiguration: "No tokens or private engagement data",
    auditConfiguration: "Audit draft and approval requirement",
    riskLevel: "high",
    environmentSupport: ["development", "preview", "production"],
    featureFlags: ["connector_meta", "connector_marketing"],
    dependencies: ["marketing_workflow"],
    owner: "Marketing",
    credentialReference: "META_OAUTH_REFERENCE",
    lifecycleState: "available",
  },
  {
    connectorId: "microsoft_365",
    displayName: "Microsoft 365",
    category: "productivity",
    provider: "Microsoft",
    version: "1.0.0",
    authenticationType: "oauth",
    oauthSupported: true,
    requiredPermissions: ["Outlook/Teams/OneDrive/SharePoint delegated scopes after approval"],
    supportedActions: [
      {
        actionKey: "prepare_microsoft_workspace_item",
        label: "Prepare Microsoft workspace item",
        type: "prepare",
        risk: "medium",
        approvalRequired: true,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      blockedWriteAction,
    ],
    readCapabilities: ["manual Microsoft account readiness"],
    writeCapabilities: ["blocked Outlook, Teams, OneDrive, Excel, and SharePoint writes"],
    humanApprovalRequirements: ["Workspace admin approval", "Communication/content approval"],
    safeAutoEligibility: "internal_only",
    rateLimits: "Not connected",
    usageQuotas: "None consumed",
    estimatedCost: "No live cost in v1",
    healthStatus: "readiness_only",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Prepare internal workspace instructions only.",
    timeoutPolicy: "No live timeout in foundation mode.",
    circuitBreakerState: "not_applicable",
    loggingConfiguration: "No document or message body logging",
    auditConfiguration: "Audit workspace-prep recommendation",
    riskLevel: "high",
    environmentSupport: ["development", "preview", "production"],
    featureFlags: ["connector_microsoft"],
    dependencies: ["tool_registry", "safe_auto_internal"],
    owner: "Operations",
    credentialReference: "MICROSOFT_365_OAUTH_REFERENCE",
    lifecycleState: "available",
  },
  {
    connectorId: "canva",
    displayName: "Canva",
    category: "marketing",
    provider: "Canva",
    version: "1.0.0",
    authenticationType: "oauth",
    oauthSupported: true,
    requiredPermissions: ["Canva Connect design read permissions"],
    supportedActions: [
      {
        actionKey: "read_canva_designs",
        label: "Read Canva designs",
        type: "read",
        risk: "low",
        approvalRequired: false,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      {
        actionKey: "create_flyer_brief",
        label: "Create flyer brief",
        type: "prepare",
        risk: "low",
        approvalRequired: true,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      {
        actionKey: "create_social_asset_brief",
        label: "Create social asset brief",
        type: "prepare",
        risk: "low",
        approvalRequired: true,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      blockedWriteAction,
    ],
    readCapabilities: ["recent design metadata", "draft asset metadata"],
    writeCapabilities: ["blocked design creation and exports"],
    humanApprovalRequirements: ["Brand approval", "Content approval"],
    safeAutoEligibility: "internal_only",
    rateLimits: "Canva Connect API quotas apply; fail closed on quota errors",
    usageQuotas: "Daily read-only CEO briefing snapshots",
    estimatedCost: "No direct API cost expected",
    healthStatus: "readiness_only",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Record data gap; never create, export, or publish designs.",
    timeoutPolicy: "Short server-side read timeout recommended.",
    circuitBreakerState: "not_applicable",
    loggingConfiguration: "Brand-safe copy blocks only",
    auditConfiguration: "Audit design brief and approval requirement",
    riskLevel: "medium",
    environmentSupport: ["development", "preview", "production"],
    featureFlags: ["connector_live_reads", "connector_marketing"],
    dependencies: ["marketing_workflow", "tool_registry", "read_only_business_connections"],
    owner: "Marketing",
    credentialReference: "CANVA_OAUTH_REFERENCE",
    lifecycleState: "available",
  },
  {
    connectorId: "adobe_express",
    displayName: "Adobe Express",
    category: "marketing",
    provider: "Adobe",
    version: "1.0.0",
    authenticationType: "oauth",
    oauthSupported: true,
    requiredPermissions: ["Adobe Express project metadata and governed draft-preparation scopes"],
    supportedActions: [
      {
        actionKey: "read_adobe_express_projects",
        capabilityKey: "adobe.express.projects.read",
        label: "Read Adobe Express project metadata",
        type: "read",
        risk: "medium",
        approvalRequired: false,
        safeAutoEligible: false,
        liveExecutionAllowed: false,
      },
      {
        actionKey: "prepare_adobe_express_brief",
        capabilityKey: "adobe.express.brief.prepare",
        label: "Prepare Adobe Express brief",
        type: "prepare",
        risk: "low",
        approvalRequired: true,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      blockedWriteAction,
    ],
    readCapabilities: ["project metadata readiness", "brand kit readiness", "draft asset metadata after future Preview certification"],
    writeCapabilities: ["blocked design creation", "blocked export", "blocked publish", "blocked sharing"],
    humanApprovalRequirements: ["Adobe credential owner approval", "Brand approval", "Content approval", "Security and scope review", "Human promotion decision before any provider call"],
    safeAutoEligibility: "internal_only",
    rateLimits: "Adobe API quotas apply after future Preview pilot; fail closed before provider calls.",
    usageQuotas: "None consumed in registry mode; a future Preview pilot must use a single explicit run key.",
    estimatedCost: "Potential Adobe licensing or API cost; paid actions blocked in v1.",
    healthStatus: "readiness_only",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Record data gap and use internal creative brief fallback; never create, export, share, publish, or spend.",
    timeoutPolicy: "No live timeout in registry mode; future Preview probe must be bounded and read-only.",
    circuitBreakerState: "not_applicable",
    loggingConfiguration: "Sanitized connector metadata only; no OAuth tokens, private keys, provider payloads, or asset bodies.",
    auditConfiguration: "Audit Adobe intent, environment, requested scopes, policy decision, and blocked external actions.",
    riskLevel: "high",
    environmentSupport: ["development", "preview", "production"],
    featureFlags: ["connector_adobe", "connector_marketing", "ueip_gateway_enforcement"],
    dependencies: ["marketing_workflow", "tool_registry", "safe_auto_internal", "read_only_business_connections", "ueip_runtime_gateway"],
    owner: "Creative Studio",
    credentialReference: "ADOBE_OAUTH_OR_SERVICE_ACCOUNT_REFERENCE",
    lifecycleState: "available",
  },
  {
    connectorId: "adobe_firefly",
    displayName: "Adobe Firefly",
    category: "marketing",
    provider: "Adobe",
    version: "1.0.0",
    authenticationType: "oauth",
    oauthSupported: true,
    requiredPermissions: ["Adobe Firefly credential and exact approved generation/readiness scopes"],
    supportedActions: [
      {
        actionKey: "prepare_firefly_prompt",
        capabilityKey: "adobe.firefly.prompt.prepare",
        label: "Prepare Adobe Firefly prompt",
        type: "prepare",
        risk: "low",
        approvalRequired: true,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      {
        actionKey: "verify_firefly_credential",
        capabilityKey: "adobe.firefly.credential.verify",
        label: "Verify Adobe Firefly credential readiness",
        type: "monitor",
        risk: "medium",
        approvalRequired: true,
        safeAutoEligible: false,
        liveExecutionAllowed: false,
      },
      blockedWriteAction,
    ],
    readCapabilities: ["credential readiness", "scope readiness", "future Preview-only generation capability check"],
    writeCapabilities: ["blocked image generation", "blocked asset creation", "blocked export", "blocked publish", "blocked paid action"],
    humanApprovalRequirements: ["Adobe credential owner approval", "Exact scope approval", "Cost control approval", "Brand and compliance approval", "Human promotion decision before any provider call"],
    safeAutoEligibility: "internal_only",
    rateLimits: "Adobe Firefly API quotas and cost controls apply after future Preview pilot; fail closed by default.",
    usageQuotas: "None consumed in registry mode; future generation pilot limited to one explicit Preview run key.",
    estimatedCost: "Potential paid provider usage; paid actions blocked in v1.",
    healthStatus: "readiness_only",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Use internal prompt drafts only; never generate, save, export, publish, or spend.",
    timeoutPolicy: "No live timeout in registry mode; future Preview probe must be bounded and non-generating.",
    circuitBreakerState: "not_applicable",
    loggingConfiguration: "Prompt intent and policy metadata only; no secrets, provider payloads, or generated asset bodies.",
    auditConfiguration: "Audit prompt-prep decision, scope review, cost block, and provider-call denial.",
    riskLevel: "high",
    environmentSupport: ["development", "preview"],
    featureFlags: ["connector_adobe", "connector_marketing", "ueip_gateway_enforcement"],
    dependencies: ["marketing_workflow", "tool_registry", "safe_auto_internal", "cost_controls", "ueip_runtime_gateway"],
    owner: "Creative Studio",
    credentialReference: "ADOBE_FIREFLY_CREDENTIAL_REFERENCE",
    lifecycleState: "available",
  },
  {
    connectorId: "adobe_creative_cloud_assets",
    displayName: "Adobe Creative Cloud Assets",
    category: "productivity",
    provider: "Adobe",
    version: "1.0.0",
    authenticationType: "oauth",
    oauthSupported: true,
    requiredPermissions: ["Adobe Creative Cloud asset metadata read scopes"],
    supportedActions: [
      {
        actionKey: "read_adobe_asset_metadata",
        capabilityKey: "adobe.assets.metadata.read",
        label: "Read Adobe asset metadata",
        type: "read",
        risk: "medium",
        approvalRequired: false,
        safeAutoEligible: false,
        liveExecutionAllowed: false,
      },
      blockedWriteAction,
    ],
    readCapabilities: ["asset metadata readiness", "library metadata readiness", "brand asset inventory after future Preview certification"],
    writeCapabilities: ["blocked upload", "blocked edit", "blocked delete", "blocked export", "blocked sharing"],
    humanApprovalRequirements: ["Adobe admin approval", "Least-privilege metadata scope review", "Security and privacy review"],
    safeAutoEligibility: "internal_only",
    rateLimits: "Adobe Creative Cloud API quotas apply after future Preview certification; fail closed before provider calls.",
    usageQuotas: "None consumed in registry mode.",
    estimatedCost: "Potential Adobe licensing or API cost; paid actions blocked in v1.",
    healthStatus: "readiness_only",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Record data gap and use approved manual asset inventory.",
    timeoutPolicy: "No live timeout in registry mode; future Preview metadata reads must be bounded.",
    circuitBreakerState: "not_applicable",
    loggingConfiguration: "Asset metadata summaries only; no raw files, secrets, or provider payloads.",
    auditConfiguration: "Audit metadata-read intent, credential scope, and blocked writes.",
    riskLevel: "high",
    environmentSupport: ["development", "preview"],
    featureFlags: ["connector_adobe", "connector_marketing", "ueip_gateway_enforcement"],
    dependencies: ["document_intelligence", "safe_auto_internal", "read_only_business_connections", "ueip_runtime_gateway"],
    owner: "Creative Studio",
    credentialReference: "ADOBE_CREATIVE_CLOUD_CREDENTIAL_REFERENCE",
    lifecycleState: "available",
  },
  {
    connectorId: "adobe_acrobat",
    displayName: "Adobe Acrobat / PDF Services",
    category: "productivity",
    provider: "Adobe",
    version: "1.0.0",
    authenticationType: "service_account",
    oauthSupported: true,
    requiredPermissions: ["Adobe PDF Services readiness scopes after security review"],
    supportedActions: [
      {
        actionKey: "prepare_pdf_workflow",
        capabilityKey: "adobe.acrobat.workflow.prepare",
        label: "Prepare PDF workflow",
        type: "prepare",
        risk: "medium",
        approvalRequired: true,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      blockedWriteAction,
    ],
    readCapabilities: ["PDF workflow readiness only"],
    writeCapabilities: ["blocked PDF creation", "blocked export", "blocked signing", "blocked sharing"],
    humanApprovalRequirements: ["Document security review", "Template approval", "Credential owner approval", "Human approval before document generation or sharing"],
    safeAutoEligibility: "internal_only",
    rateLimits: "Adobe PDF Services quotas apply only after future governed certification.",
    usageQuotas: "None consumed in registry mode.",
    estimatedCost: "Potential paid provider usage; paid actions blocked in v1.",
    healthStatus: "readiness_only",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Use internal PDF workflow plan only; never create, sign, export, or share documents.",
    timeoutPolicy: "No live timeout in registry mode.",
    circuitBreakerState: "not_applicable",
    loggingConfiguration: "Workflow metadata only; no document bodies, secrets, or provider payloads.",
    auditConfiguration: "Audit document workflow intent, data sensitivity, and blocked execution.",
    riskLevel: "high",
    environmentSupport: ["development", "preview"],
    featureFlags: ["connector_adobe", "connector_marketing", "ueip_gateway_enforcement"],
    dependencies: ["document_intelligence", "safe_auto_internal", "approval_policy", "ueip_runtime_gateway"],
    owner: "Document Intelligence",
    credentialReference: "ADOBE_PDF_SERVICES_CREDENTIAL_REFERENCE",
    lifecycleState: "available",
  },
  {
    connectorId: "youtube",
    displayName: "YouTube",
    category: "marketing",
    provider: "Google",
    version: "1.0.0",
    authenticationType: "oauth",
    oauthSupported: true,
    requiredPermissions: ["https://www.googleapis.com/auth/youtube.readonly", "https://www.googleapis.com/auth/yt-analytics.readonly"],
    supportedActions: [
      {
        actionKey: "read_youtube_channel",
        label: "Read YouTube videos and analytics",
        type: "read",
        risk: "low",
        approvalRequired: false,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      blockedWriteAction,
    ],
    readCapabilities: ["recent videos", "views", "watch time"],
    writeCapabilities: ["blocked upload, update, delete, comment, and publish actions"],
    humanApprovalRequirements: ["YouTube channel owner approval", "Analytics scope verification"],
    safeAutoEligibility: "internal_only",
    rateLimits: "YouTube Data and Analytics API quotas apply; fail closed on quota errors",
    usageQuotas: "Daily read-only CEO briefing snapshots",
    estimatedCost: "No direct API cost expected",
    healthStatus: "readiness_only",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Record data gap; never upload, edit, publish, or comment.",
    timeoutPolicy: "Short server-side read timeout recommended.",
    circuitBreakerState: "not_applicable",
    loggingConfiguration: "Video metadata and aggregate analytics only",
    auditConfiguration: "Audit read-only snapshot source, freshness, and data gaps",
    riskLevel: "low",
    environmentSupport: ["development", "preview", "production"],
    featureFlags: ["connector_live_reads", "connector_google", "connector_marketing"],
    dependencies: ["safe_auto_internal", "read_only_business_connections"],
    owner: "Marketing",
    credentialReference: "GOOGLE_OAUTH_REFRESH_TOKEN_REFERENCE",
    lifecycleState: "enabled",
  },
  {
    connectorId: "twilio",
    displayName: "Twilio",
    category: "communication",
    provider: "Twilio",
    version: "1.0.0",
    authenticationType: "api_key",
    oauthSupported: false,
    requiredPermissions: ["Approved sender identity", "Consent and DNC validation"],
    supportedActions: [
      {
        actionKey: "queue_sms_draft",
        label: "Queue SMS draft",
        type: "prepare",
        risk: "medium",
        approvalRequired: true,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      blockedWriteAction,
    ],
    readCapabilities: ["manual sender readiness"],
    writeCapabilities: ["blocked SMS and voice sending"],
    humanApprovalRequirements: ["Human send approval", "Consent validation", "DNC validation"],
    safeAutoEligibility: "internal_only",
    rateLimits: "Simulated rate-limited in safe mode",
    usageQuotas: "None consumed",
    estimatedCost: "Paid provider; cost controls required before activation",
    healthStatus: "rate_limited",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Queue internal draft and notify operator.",
    timeoutPolicy: "No live timeout in foundation mode.",
    circuitBreakerState: "open",
    loggingConfiguration: "No full message body in audit summaries",
    auditConfiguration: "Audit draft, consent, DNC, and approval status",
    riskLevel: "high",
    environmentSupport: ["development", "preview", "production"],
    featureFlags: ["connector_communication"],
    dependencies: ["consent_policy", "safe_auto_internal"],
    owner: "Revenue Operations",
    credentialReference: "TWILIO_CREDENTIAL_REFERENCE",
    lifecycleState: "disabled",
  },
  {
    connectorId: "county_assessor",
    displayName: "County Assessor",
    category: "property_data",
    provider: "County public records",
    version: "1.0.0",
    authenticationType: "manual",
    oauthSupported: false,
    requiredPermissions: ["Approved public-record source policy"],
    supportedActions: [
      {
        actionKey: "verify_ownership",
        label: "Verify ownership",
        type: "prepare",
        risk: "medium",
        approvalRequired: true,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
    ],
    readCapabilities: ["manual ownership verification", "manual property source review"],
    writeCapabilities: ["none"],
    humanApprovalRequirements: ["Source verification"],
    safeAutoEligibility: "internal_only",
    rateLimits: "Manual review only",
    usageQuotas: "None consumed",
    estimatedCost: "No connector cost",
    healthStatus: "readiness_only",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Use manual record review; never scrape.",
    timeoutPolicy: "Human review timeline",
    circuitBreakerState: "not_applicable",
    loggingConfiguration: "Record source label and confidence only",
    auditConfiguration: "Audit property source decision",
    riskLevel: "medium",
    environmentSupport: ["development", "preview", "production"],
    featureFlags: ["connector_property_data"],
    dependencies: ["property_data_governance"],
    owner: "Property Intelligence",
    credentialReference: null,
    lifecycleState: "monitor_only",
  },
  {
    connectorId: "attom",
    displayName: "ATTOM",
    category: "property_data",
    provider: "ATTOM",
    version: "1.0.0",
    authenticationType: "api_key",
    oauthSupported: false,
    requiredPermissions: ["Licensed API access", "Approved enrichment policy"],
    supportedActions: [
      {
        actionKey: "verify_ownership",
        label: "Verify ownership with licensed data",
        type: "read",
        risk: "high",
        approvalRequired: true,
        safeAutoEligible: false,
        liveExecutionAllowed: false,
      },
      blockedWriteAction,
    ],
    readCapabilities: ["future property data reads"],
    writeCapabilities: ["blocked enrichment writes"],
    humanApprovalRequirements: ["Connector activation approval", "Cost approval"],
    safeAutoEligibility: "approval_required",
    rateLimits: "Unavailable until licensed connector setup",
    usageQuotas: "None consumed",
    estimatedCost: "Paid provider; cost control required",
    healthStatus: "unavailable",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Fallback to county assessor.",
    timeoutPolicy: "No live timeout in foundation mode.",
    circuitBreakerState: "open",
    loggingConfiguration: "No provider payload logging",
    auditConfiguration: "Audit blocked/fallback decision",
    riskLevel: "high",
    environmentSupport: ["development", "preview", "production"],
    featureFlags: ["connector_property_data", "connector_live_reads"],
    dependencies: ["tool_registry", "cost_controls"],
    owner: "Property Intelligence",
    credentialReference: "ATTOM_API_KEY_REFERENCE",
    lifecycleState: "disabled",
  },
  {
    connectorId: "openai",
    displayName: "OpenAI",
    category: "ai_provider",
    provider: "OpenAI",
    version: "1.0.0",
    authenticationType: "api_key",
    oauthSupported: false,
    requiredPermissions: ["Server-side API key reference", "Prompt and cost governance"],
    supportedActions: [
      {
        actionKey: "prepare_ai_summary",
        label: "Prepare AI summary",
        type: "prepare",
        risk: "medium",
        approvalRequired: true,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      blockedWriteAction,
    ],
    readCapabilities: ["none in foundation mode"],
    writeCapabilities: ["blocked model calls until provider policy enables them"],
    humanApprovalRequirements: ["Model usage approval", "Cost approval", "Prompt audit approval"],
    safeAutoEligibility: "approval_required",
    rateLimits: "Not called in foundation mode",
    usageQuotas: "None consumed",
    estimatedCost: "Token cost controls required before activation",
    healthStatus: "readiness_only",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Fallback to deterministic internal templates.",
    timeoutPolicy: "No live timeout in foundation mode.",
    circuitBreakerState: "not_applicable",
    loggingConfiguration: "No secrets or sensitive raw prompt payloads",
    auditConfiguration: "Audit model intent, prompt version, cost estimate, and approval",
    riskLevel: "medium",
    environmentSupport: ["development", "preview", "production"],
    featureFlags: ["connector_live_reads"],
    dependencies: ["safe_auto_internal", "cost_controls"],
    owner: "Executive AI",
    credentialReference: "OPENAI_API_KEY_REFERENCE",
    lifecycleState: "available",
  },
  {
    connectorId: "n8n",
    displayName: "n8n",
    category: "workflow",
    provider: "n8n",
    version: "1.0.0",
    authenticationType: "api_key",
    oauthSupported: false,
    requiredPermissions: ["Self-hosted instance credentials", "Workflow approval policy"],
    supportedActions: [
      {
        actionKey: "prepare_workflow_draft",
        label: "Prepare workflow draft",
        type: "prepare",
        risk: "medium",
        approvalRequired: true,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
      blockedWriteAction,
    ],
    readCapabilities: ["manual workflow readiness"],
    writeCapabilities: ["blocked workflow activation and triggers"],
    humanApprovalRequirements: ["Workflow approval", "Kill-switch review", "Audit review"],
    safeAutoEligibility: "internal_only",
    rateLimits: "Not connected",
    usageQuotas: "None consumed",
    estimatedCost: "Infrastructure cost review required before activation",
    healthStatus: "readiness_only",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Keep workflow as disabled draft.",
    timeoutPolicy: "No live timeout in foundation mode.",
    circuitBreakerState: "not_applicable",
    loggingConfiguration: "Workflow metadata only",
    auditConfiguration: "Audit workflow draft and activation block",
    riskLevel: "high",
    environmentSupport: ["development", "preview"],
    featureFlags: ["connector_platform"],
    dependencies: ["safe_auto_internal", "approval_policy"],
    owner: "Operations",
    credentialReference: "N8N_CREDENTIAL_REFERENCE",
    lifecycleState: "available",
  },
  {
    connectorId: "approved_news_registry",
    displayName: "Approved News / Policy Source Registry",
    category: "macro_intelligence",
    provider: "Manual and approved-source records",
    version: "1.0.0",
    authenticationType: "manual",
    oauthSupported: false,
    requiredPermissions: ["Attribution", "Approved source list"],
    supportedActions: [
      {
        actionKey: "summarize_macro_signal",
        label: "Summarize macro signal",
        type: "prepare",
        risk: "low",
        approvalRequired: false,
        safeAutoEligible: true,
        liveExecutionAllowed: false,
      },
    ],
    readCapabilities: ["manual/imported source analysis"],
    writeCapabilities: ["none"],
    humanApprovalRequirements: ["Source approval before public use"],
    safeAutoEligibility: "internal_only",
    rateLimits: "Manual/import-ready only",
    usageQuotas: "None consumed",
    estimatedCost: "No live cost in foundation",
    healthStatus: "healthy",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Flag missing attribution and block public claims.",
    timeoutPolicy: "Internal processing only",
    circuitBreakerState: "closed",
    loggingConfiguration: "Attribution and signal metadata only",
    auditConfiguration: "Audit source, confidence, and missing data",
    riskLevel: "low",
    environmentSupport: ["development", "preview", "production"],
    featureFlags: ["market_intelligence"],
    dependencies: ["governance_constitution"],
    owner: "Executive AI",
    credentialReference: null,
    lifecycleState: "monitor_only",
  },
];

export function listEnterpriseConnectors() {
  return enterpriseConnectors;
}

export function getEnterpriseConnector(connectorId: string) {
  return enterpriseConnectors.find((connector) => connector.connectorId === connectorId) ?? null;
}

export function getConnectorHealth(connectorId?: string) {
  const connectors = connectorId ? enterpriseConnectors.filter((connector) => connector.connectorId === connectorId) : enterpriseConnectors;

  return connectors.map((connector) => ({
    connectorId: connector.connectorId,
    displayName: connector.displayName,
    healthStatus: connector.healthStatus,
    lastSuccessfulSync: connector.lastSuccessfulSync,
    lastFailedSync: connector.lastFailedSync,
    retryPolicy: connector.retryPolicy,
    timeoutPolicy: connector.timeoutPolicy,
    circuitBreakerState: connector.circuitBreakerState,
    providerCalled: false,
    liveExecutionAllowed: false,
  }));
}

export function evaluateConnectorAction(input: {
  connectorId?: string;
  actionKey: string;
  module?: string;
}): ConnectorExecutionPlan {
  const connector = input.connectorId ? getEnterpriseConnector(input.connectorId) : null;
  const featureSnapshot = getFeatureFlagSnapshot();
  const action = connector?.supportedActions.find((supportedAction) => supportedAction.actionKey === input.actionKey) ?? null;
  const tool = input.connectorId ? getToolReadiness(input.connectorId) : null;
  const toolDecision = selectToolForAction({
    requestedAction: input.actionKey,
    preferredToolKey: tool?.toolKey ?? input.connectorId,
    module: input.module ?? "Executive AI",
  });
  const safeDecision = evaluateSafeAutomation({
    requestedAction: input.actionKey,
    preferredToolKey: tool?.toolKey ?? input.connectorId,
    module: input.module ?? "Executive AI",
  });

  if (!connector) {
    return {
      connectorId: null,
      requestedAction: input.actionKey,
      decision: "blocked",
      reason: "Connector is not registered.",
      confidence: 20,
      requiredApprovals: ["Connector registration"],
      fallbackConnectorId: null,
      providerCalled: false,
      liveExecutionAllowed: false,
      auditRequired: true,
    };
  }

  const disabledFlags = connector.featureFlags.filter((flag) => !isFeatureEnabled(flag));

  if (connector.healthStatus === "unavailable" || connector.circuitBreakerState === "open") {
    return {
      connectorId: connector.connectorId,
      requestedAction: input.actionKey,
      decision: "fallback_required",
      reason: `${connector.displayName} is unavailable or circuit-open. Use an approved fallback and preserve audit history.`,
      confidence: 72,
      requiredApprovals: connector.humanApprovalRequirements,
      fallbackConnectorId: connector.connectorId === "attom" ? "county_assessor" : null,
      providerCalled: false,
      liveExecutionAllowed: false,
      auditRequired: true,
    };
  }

  if (!action) {
    return {
      connectorId: connector.connectorId,
      requestedAction: input.actionKey,
      decision: "blocked",
      reason: `${connector.displayName} does not support ${input.actionKey}.`,
      confidence: 35,
      requiredApprovals: connector.humanApprovalRequirements,
      fallbackConnectorId: null,
      providerCalled: false,
      liveExecutionAllowed: false,
      auditRequired: true,
    };
  }

  if (action.type === "write" || action.risk === "blocked" || safeDecision.status === "blocked") {
    return {
      connectorId: connector.connectorId,
      requestedAction: input.actionKey,
      decision: "blocked",
      reason: "External writes and blocked-risk actions are not allowed in Phase 2 foundation.",
      confidence: 95,
      requiredApprovals: connector.humanApprovalRequirements,
      fallbackConnectorId: null,
      providerCalled: false,
      liveExecutionAllowed: false,
      auditRequired: true,
    };
  }

  if (disabledFlags.length > 0 && action.type === "read") {
    return {
      connectorId: connector.connectorId,
      requestedAction: input.actionKey,
      decision: "approval_required",
      reason: `Live read flags are disabled: ${disabledFlags.join(", ")}. Keep action as readiness/advisory only.`,
      confidence: 78,
      requiredApprovals: connector.humanApprovalRequirements,
      fallbackConnectorId: null,
      providerCalled: false,
      liveExecutionAllowed: false,
      auditRequired: true,
    };
  }

  return {
    connectorId: connector.connectorId,
    requestedAction: input.actionKey,
    decision: action.approvalRequired || toolDecision.approvalRequired ? "approval_required" : "internal_preparation_allowed",
    reason: `${connector.displayName} can support ${action.label} as governed internal preparation. Feature flags enabled: ${featureSnapshot.enabled.join(", ")}.`,
    confidence: action.safeAutoEligible ? 88 : 70,
    requiredApprovals: action.approvalRequired ? connector.humanApprovalRequirements : [],
    fallbackConnectorId: null,
    providerCalled: false,
    liveExecutionAllowed: false,
    auditRequired: true,
  };
}

export function evaluateConnectorLifecycle(input: {
  connectorId: string;
  lifecycleAction: ConnectorLifecycleAction;
}) {
  const connector = getEnterpriseConnector(input.connectorId);

  if (!connector) {
    return {
      ok: false,
      status: "blocked",
      reason: "Connector is not registered.",
      providerCalled: false,
      liveExecutionAllowed: false,
    };
  }

  const allowedInternalLifecycleActions: ConnectorLifecycleAction[] = ["install", "configure", "test", "monitor"];
  const safeInternal = allowedInternalLifecycleActions.includes(input.lifecycleAction);

  return {
    ok: true,
    connectorId: connector.connectorId,
    requestedLifecycleAction: input.lifecycleAction,
    status: safeInternal ? "prepared" : "approval_required",
    reason: safeInternal
      ? `${connector.displayName} lifecycle action can be recorded as internal readiness preparation.`
      : `${connector.displayName} lifecycle action requires administrator approval and remains non-executing.`,
    allowedInternalLifecycleActions,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}
