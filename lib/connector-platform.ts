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
    requiredPermissions: ["Business profile manager access"],
    supportedActions: [
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
    readCapabilities: ["profile readiness", "manual performance snapshot"],
    writeCapabilities: ["blocked until publishing policy exists"],
    humanApprovalRequirements: ["Publish approval", "Profile ownership verification"],
    safeAutoEligibility: "internal_only",
    rateLimits: "Not connected in Phase 2 foundation",
    usageQuotas: "None consumed",
    estimatedCost: "No live cost in v1",
    healthStatus: "readiness_only",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Do not retry live calls; keep manual publish assist.",
    timeoutPolicy: "No live timeout in foundation mode.",
    circuitBreakerState: "not_applicable",
    loggingConfiguration: "Safe metadata only",
    auditConfiguration: "Audit tool decision and approval state",
    riskLevel: "medium",
    environmentSupport: ["development", "preview", "production"],
    featureFlags: ["connector_google", "connector_marketing"],
    dependencies: ["tool_registry", "safe_auto_internal"],
    owner: "Marketing",
    credentialReference: "GOOGLE_BUSINESS_PROFILE_OAUTH_REFERENCE",
    lifecycleState: "monitor_only",
  },
  {
    connectorId: "gmail",
    displayName: "Gmail",
    category: "communication",
    provider: "Google",
    version: "1.0.0",
    authenticationType: "oauth",
    oauthSupported: true,
    requiredPermissions: ["mail compose/send scopes after approval"],
    supportedActions: [
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
    readCapabilities: ["manual account readiness"],
    writeCapabilities: ["blocked email sending"],
    humanApprovalRequirements: ["Human send approval", "Consent validation"],
    safeAutoEligibility: "internal_only",
    rateLimits: "Not connected",
    usageQuotas: "None consumed",
    estimatedCost: "No live cost in v1",
    healthStatus: "readiness_only",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Create internal draft only.",
    timeoutPolicy: "No live timeout in foundation mode.",
    circuitBreakerState: "not_applicable",
    loggingConfiguration: "No message body in audit summaries",
    auditConfiguration: "Audit draft decision and approval requirement",
    riskLevel: "high",
    environmentSupport: ["development", "preview", "production"],
    featureFlags: ["connector_google", "connector_communication"],
    dependencies: ["consent_policy", "safe_auto_internal"],
    owner: "Revenue Operations",
    credentialReference: "GMAIL_OAUTH_REFERENCE",
    lifecycleState: "available",
  },
  {
    connectorId: "google_calendar",
    displayName: "Google Calendar",
    category: "productivity",
    provider: "Google",
    version: "1.0.0",
    authenticationType: "oauth",
    oauthSupported: true,
    requiredPermissions: ["calendar event scopes after approval"],
    supportedActions: [
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
    readCapabilities: ["manual calendar readiness"],
    writeCapabilities: ["blocked calendar invite creation"],
    humanApprovalRequirements: ["Meeting scheduling approval"],
    safeAutoEligibility: "internal_only",
    rateLimits: "Not connected",
    usageQuotas: "None consumed",
    estimatedCost: "No live cost in v1",
    healthStatus: "readiness_only",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Prepare internal meeting brief only.",
    timeoutPolicy: "No live timeout in foundation mode.",
    circuitBreakerState: "not_applicable",
    loggingConfiguration: "Safe metadata only",
    auditConfiguration: "Audit meeting-prep recommendation",
    riskLevel: "medium",
    environmentSupport: ["development", "preview", "production"],
    featureFlags: ["connector_google"],
    dependencies: ["relationship_engine"],
    owner: "Business Development",
    credentialReference: "GOOGLE_CALENDAR_OAUTH_REFERENCE",
    lifecycleState: "available",
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
    requiredPermissions: ["Brand kit and design permissions after approval"],
    supportedActions: [
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
    readCapabilities: ["manual brand/design readiness"],
    writeCapabilities: ["blocked design creation and exports"],
    humanApprovalRequirements: ["Brand approval", "Content approval"],
    safeAutoEligibility: "internal_only",
    rateLimits: "Not connected",
    usageQuotas: "None consumed",
    estimatedCost: "No live cost in v1",
    healthStatus: "readiness_only",
    lastSuccessfulSync: null,
    lastFailedSync: null,
    retryPolicy: "Use manual design brief fallback.",
    timeoutPolicy: "No live timeout in foundation mode.",
    circuitBreakerState: "not_applicable",
    loggingConfiguration: "Brand-safe copy blocks only",
    auditConfiguration: "Audit design brief and approval requirement",
    riskLevel: "medium",
    environmentSupport: ["development", "preview", "production"],
    featureFlags: ["connector_marketing"],
    dependencies: ["marketing_workflow", "tool_registry"],
    owner: "Marketing",
    credentialReference: "CANVA_OAUTH_REFERENCE",
    lifecycleState: "monitor_only",
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
