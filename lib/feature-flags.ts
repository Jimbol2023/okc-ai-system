export type FeatureFlagKey =
  | "connector_platform"
  | "connector_live_reads"
  | "connector_google"
  | "connector_microsoft"
  | "connector_meta"
  | "connector_marketing"
  | "connector_communication"
  | "connector_property_data"
  | "market_intelligence"
  | "demand_discovery"
  | "personal_brand"
  | "relationship_engine"
  | "executive_briefings"
  | "safe_auto_internal"
  | "safe_auto_limited"
  | "connector_marketplace"
  | "connector_installation_wizard"
  | "ai_permission_center"
  | "unified_approval_center"
  | "social_media_ops"
  | "mobile_command_center"
  | "automation_policy_center"
  | "learning_loop"
  | "phase4_production_readiness"
  | "phase4_operations_timeline"
  | "phase4_executive_assistant"
  | "phase4_controlled_live_sms"
  | "ueip_gateway_enforcement"
  | "ueip_search_console_runtime"
  | "ueip_search_console_rollback"
  | "professional_case_runtime"
  | "search_market_intelligence_runtime"
  | "search_market_intelligence_scheduling"
  | "search_console_query_performance";

export type FeatureFlag = {
  key: FeatureFlagKey;
  enabled: boolean;
  category: "connector" | "intelligence" | "growth" | "automation";
  description: string;
  requiresAdminApproval: boolean;
};

export const phase2FeatureFlags: FeatureFlag[] = [
  {
    key: "search_market_intelligence_runtime",
    enabled: false,
    category: "intelligence",
    description: "Gates tenant-scoped Search and Market Intelligence case preparation from stored normalized evidence.",
    requiresAdminApproval: true,
  },
  {
    key: "search_market_intelligence_scheduling",
    enabled: false,
    category: "automation",
    description: "Gates capped internal delta and Monday packet preparation; no provider or external actions are authorized.",
    requiresAdminApproval: true,
  },
  {
    key: "search_console_query_performance",
    enabled: false,
    category: "connector",
    description: "Gates the bounded Preview-only Search Console query performance capability.",
    requiresAdminApproval: true,
  },
  {
    key: "professional_case_runtime",
    enabled: false,
    category: "automation",
    description: "Gates additive writes to the durable professional case runtime while legacy consumers remain available.",
    requiresAdminApproval: true,
  },
  {
    key: "ueip_gateway_enforcement",
    enabled: true,
    category: "connector",
    description: "Requires migrated provider capabilities to pass through the UEIP runtime gateway.",
    requiresAdminApproval: true,
  },
  {
    key: "ueip_search_console_runtime",
    enabled: true,
    category: "connector",
    description: "Allows the certified Search Console adapter to run only after trusted Preview, tenant, installation, scope, health, and audit gates pass.",
    requiresAdminApproval: true,
  },
  {
    key: "ueip_search_console_rollback",
    enabled: false,
    category: "connector",
    description: "Emergency rollback selector for the Search Console reference migration; it never authorizes Production or writes.",
    requiresAdminApproval: true,
  },
  {
    key: "connector_platform",
    enabled: true,
    category: "connector",
    description: "Enables connector registry, metadata, health, lifecycle, and decision visibility.",
    requiresAdminApproval: false,
  },
  {
    key: "safe_auto_internal",
    enabled: true,
    category: "automation",
    description: "Allows internal analysis, scoring, drafting, organizing, and report preparation only.",
    requiresAdminApproval: false,
  },
  {
    key: "connector_live_reads",
    enabled: true,
    category: "connector",
    description: "Allows Sprint 18 approved connector adapters to perform live read-only calls after governance review.",
    requiresAdminApproval: true,
  },
  {
    key: "connector_google",
    enabled: true,
    category: "connector",
    description: "Enables governed Google connector family read-only telemetry.",
    requiresAdminApproval: true,
  },
  {
    key: "connector_microsoft",
    enabled: false,
    category: "connector",
    description: "Enables Microsoft connector family readiness beyond static registry visibility.",
    requiresAdminApproval: true,
  },
  {
    key: "connector_meta",
    enabled: false,
    category: "connector",
    description: "Enables Meta connector family readiness beyond static registry visibility.",
    requiresAdminApproval: true,
  },
  {
    key: "connector_marketing",
    enabled: true,
    category: "connector",
    description: "Enables governed marketing platform read-only telemetry.",
    requiresAdminApproval: true,
  },
  {
    key: "connector_communication",
    enabled: true,
    category: "connector",
    description: "Enables governed communication platform read-only telemetry.",
    requiresAdminApproval: true,
  },
  {
    key: "connector_property_data",
    enabled: false,
    category: "connector",
    description: "Enables property data connector readiness beyond manual/public source review.",
    requiresAdminApproval: true,
  },
  {
    key: "market_intelligence",
    enabled: false,
    category: "intelligence",
    description: "Enables market intelligence surfaces from approved/manual source records.",
    requiresAdminApproval: true,
  },
  {
    key: "demand_discovery",
    enabled: false,
    category: "intelligence",
    description: "Enables demand discovery opportunity scoring from approved source signals.",
    requiresAdminApproval: true,
  },
  {
    key: "personal_brand",
    enabled: false,
    category: "growth",
    description: "Enables founder/company personal brand draft and repurposing foundations.",
    requiresAdminApproval: true,
  },
  {
    key: "relationship_engine",
    enabled: false,
    category: "growth",
    description: "Enables relationship health and outreach-prep foundations.",
    requiresAdminApproval: true,
  },
  {
    key: "executive_briefings",
    enabled: true,
    category: "intelligence",
    description: "Enables daily, weekly, and monthly executive briefing generation from approved read-only snapshots.",
    requiresAdminApproval: true,
  },
  {
    key: "safe_auto_limited",
    enabled: false,
    category: "automation",
    description: "Future mode for narrowly approved external actions. Disabled in Phase 2 foundation.",
    requiresAdminApproval: true,
  },
  {
    key: "connector_marketplace",
    enabled: true,
    category: "connector",
    description: "Enables internal connector marketplace visibility and readiness actions.",
    requiresAdminApproval: false,
  },
  {
    key: "connector_installation_wizard",
    enabled: true,
    category: "connector",
    description: "Enables guided connector setup planning without authenticating or enabling live providers.",
    requiresAdminApproval: false,
  },
  {
    key: "ai_permission_center",
    enabled: true,
    category: "automation",
    description: "Enables AI agent, connector, role, and action permission policy visibility.",
    requiresAdminApproval: false,
  },
  {
    key: "unified_approval_center",
    enabled: true,
    category: "automation",
    description: "Enables unified approval queue visibility for leads, content, connectors, and recommendations.",
    requiresAdminApproval: false,
  },
  {
    key: "social_media_ops",
    enabled: true,
    category: "growth",
    description: "Enables governed social operations drafts, variants, and execution plans.",
    requiresAdminApproval: false,
  },
  {
    key: "mobile_command_center",
    enabled: true,
    category: "intelligence",
    description: "Enables mobile-first command center summaries for daily operations.",
    requiresAdminApproval: false,
  },
  {
    key: "automation_policy_center",
    enabled: true,
    category: "automation",
    description: "Enables automation policy definitions that remain compatible with Safe Auto Mode.",
    requiresAdminApproval: false,
  },
  {
    key: "learning_loop",
    enabled: true,
    category: "intelligence",
    description: "Enables explainable learning outcome records without autonomous self-modification.",
    requiresAdminApproval: false,
  },
  {
    key: "phase4_production_readiness",
    enabled: true,
    category: "automation",
    description: "Enables production readiness checks, environment validation, and deployment blocker reporting.",
    requiresAdminApproval: false,
  },
  {
    key: "phase4_operations_timeline",
    enabled: true,
    category: "automation",
    description: "Enables auditable operations timeline records and filtered timeline visibility.",
    requiresAdminApproval: false,
  },
  {
    key: "phase4_executive_assistant",
    enabled: true,
    category: "intelligence",
    description: "Enables source-grounded executive Q&A and morning briefing preparation.",
    requiresAdminApproval: false,
  },
  {
    key: "phase4_controlled_live_sms",
    enabled: true,
    category: "connector",
    description: "Allows the Phase 4 Twilio controlled live-test path to be evaluated. Environment gates and approvals still decide execution.",
    requiresAdminApproval: true,
  },
];

export function getFeatureFlag(key: FeatureFlagKey) {
  return phase2FeatureFlags.find((flag) => flag.key === key) ?? null;
}

export function isFeatureEnabled(key: FeatureFlagKey) {
  return getFeatureFlag(key)?.enabled === true;
}

export function getFeatureFlagSnapshot() {
  return {
    flags: phase2FeatureFlags,
    enabled: phase2FeatureFlags.filter((flag) => flag.enabled).map((flag) => flag.key),
    disabled: phase2FeatureFlags.filter((flag) => !flag.enabled).map((flag) => flag.key),
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}
