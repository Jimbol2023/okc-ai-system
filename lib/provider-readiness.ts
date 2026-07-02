export type ProviderReadinessGroup = "lead_enrichment" | "marketing_ads" | "ops_tooling";

export type ProviderReadinessStatus =
  | "configured"
  | "partial"
  | "missing"
  | "no_credentials_required";

export type ProviderActivationState = "blocked_readiness_only";

export type ProviderConnectionState = "connected" | "not_connected" | "not_required";

export type ProviderReadinessDefinition = {
  id: string;
  label: string;
  icon?: string;
  group: ProviderReadinessGroup;
  roiPriority: number;
  requiredEnvKeys: string[];
  optionalEnvKeys?: string[];
  statusOverride?: ProviderReadinessStatus;
  readiness?: string;
  connectionState?: ProviderConnectionState;
  publicProfileUrl?: string;
  authenticationRequired?: boolean;
  supportedCapabilities?: string[];
  governanceLevel?: string;
  permissionsRequired?: string[];
  safeNextAction: string;
};

export type ProviderReadinessItem = ProviderReadinessDefinition & {
  status: ProviderReadinessStatus;
  configuredEnvKeys: string[];
  missingEnvKeys: string[];
  activationState: ProviderActivationState;
  readiness: string;
  connectionState: ProviderConnectionState;
  authenticationRequired: boolean;
  supportedCapabilities: string[];
  governanceLevel: string;
  permissionsRequired: string[];
  publicProfileUrl?: string;
  providerCalled: false;
  liveExecutionAllowed: false;
  liveCallsAllowed: false;
  oauthStarted: false;
  published: false;
  scheduled: false;
  connectorWrite: false;
  adsCreated: false;
  enrichmentWritten: false;
};

export type ProviderReadinessReport = {
  ok: true;
  providers: ProviderReadinessItem[];
  roiPriority: string[];
  liveCallsAllowed: false;
  providerCalled: false;
  recommendedNextActions: string[];
  safety: {
    readinessOnly: true;
    noLiveExternalFetches: true;
    noOAuthStarts: true;
    noAds: true;
    noPosting: true;
    noScraping: true;
    noEnrichmentWrites: true;
    noAutomatedOutreach: true;
  };
};

const placeholderFragments = [
  "replace-with",
  "your-",
  "PROJECT_ID",
  "USER:PASSWORD",
  "localhost-placeholder",
  "example",
];

export const providerReadinessDefinitions: ProviderReadinessDefinition[] = [
  {
    id: "supabase",
    label: "Supabase",
    group: "lead_enrichment",
    roiPriority: 1,
    requiredEnvKeys: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"],
    optionalEnvKeys: ["DATABASE_URL", "DIRECT_URL"],
    safeNextAction: "Connect Supabase/Postgres first so lead capture and CRM storage have a durable database.",
  },
  {
    id: "attom",
    label: "ATTOM",
    group: "lead_enrichment",
    roiPriority: 2,
    requiredEnvKeys: ["ATTOM_API_KEY"],
    safeNextAction: "Prepare ATTOM credentials for future property enrichment, but keep enrichment writes blocked.",
  },
  {
    id: "google_maps",
    label: "Google Maps API",
    group: "lead_enrichment",
    roiPriority: 3,
    requiredEnvKeys: ["GOOGLE_MAPS_API_KEY"],
    safeNextAction: "Prepare Google Maps for future address normalization and route planning after data governance approval.",
  },
  {
    id: "openstreetmap",
    label: "OpenStreetMap",
    group: "lead_enrichment",
    roiPriority: 4,
    requiredEnvKeys: [],
    optionalEnvKeys: ["OPENSTREETMAP_USER_AGENT"],
    safeNextAction: "Use OpenStreetMap as a low-cost future mapping fallback with a clear user agent and rate-limit policy.",
  },
  {
    id: "openai",
    label: "OpenAI API",
    group: "lead_enrichment",
    roiPriority: 5,
    requiredEnvKeys: ["OPENAI_API_KEY"],
    safeNextAction: "Prepare OpenAI for future controlled lead triage and seller conversation assistance.",
  },
  {
    id: "google_gemini",
    label: "Google Gemini API",
    group: "lead_enrichment",
    roiPriority: 6,
    requiredEnvKeys: ["GOOGLE_GEMINI_API_KEY"],
    safeNextAction: "Prepare Gemini as a secondary AI reasoning provider after prompt, audit, and cost controls are defined.",
  },
  {
    id: "xai",
    label: "xAI API",
    group: "lead_enrichment",
    roiPriority: 7,
    requiredEnvKeys: ["XAI_API_KEY"],
    safeNextAction: "Prepare xAI only as an optional model provider; do not route production work until comparison tests exist.",
  },
  {
    id: "n8n",
    label: "Self-hosted n8n",
    group: "lead_enrichment",
    roiPriority: 8,
    requiredEnvKeys: ["N8N_BASE_URL", "N8N_ENCRYPTION_KEY", "N8N_BASIC_AUTH_USER", "N8N_BASIC_AUTH_PASSWORD"],
    optionalEnvKeys: ["N8N_WEBHOOK_SECRET"],
    safeNextAction: "Start n8n locally for manual workflow design only; do not connect live triggers yet.",
  },
  {
    id: "vercel",
    label: "Vercel CLI",
    group: "ops_tooling",
    roiPriority: 9,
    requiredEnvKeys: ["VERCEL_TOKEN", "VERCEL_ORG_ID", "VERCEL_PROJECT_ID"],
    safeNextAction: "Configure Vercel project metadata for deploy readiness without exposing tokens in source control.",
  },
  {
    id: "docker",
    label: "Docker",
    group: "ops_tooling",
    roiPriority: 10,
    requiredEnvKeys: ["N8N_ENCRYPTION_KEY"],
    optionalEnvKeys: ["N8N_BASIC_AUTH_USER", "N8N_BASIC_AUTH_PASSWORD"],
    safeNextAction: "Use Docker Compose for local n8n support; keep infrastructure local until deployment is approved.",
  },
  {
    id: "postman",
    label: "Postman API",
    group: "ops_tooling",
    roiPriority: 11,
    requiredEnvKeys: ["POSTMAN_API_KEY", "POSTMAN_WORKSPACE_ID"],
    safeNextAction: "Prepare Postman workspace publishing for internal API documentation and smoke-test collections.",
  },
  {
    id: "google_calendar",
    label: "Google Calendar API",
    group: "ops_tooling",
    roiPriority: 12,
    requiredEnvKeys: ["GOOGLE_CALENDAR_CLIENT_ID", "GOOGLE_CALENDAR_CLIENT_SECRET", "GOOGLE_CALENDAR_REDIRECT_URI"],
    safeNextAction: "Prepare Calendar OAuth metadata for future manual appointment scheduling after approval gates exist.",
  },
  {
    id: "google_ads",
    label: "Google Ads API",
    group: "marketing_ads",
    roiPriority: 13,
    requiredEnvKeys: ["GOOGLE_ADS_DEVELOPER_TOKEN", "GOOGLE_ADS_CLIENT_ID", "GOOGLE_ADS_CLIENT_SECRET", "GOOGLE_ADS_REFRESH_TOKEN", "GOOGLE_ADS_CUSTOMER_ID"],
    safeNextAction: "Keep Google Ads in planning mode until tracking, budgets, and compliance review are complete.",
  },
  {
    id: "facebook_page",
    label: "Facebook",
    icon: "facebook",
    group: "marketing_ads",
    roiPriority: 14,
    requiredEnvKeys: [],
    statusOverride: "configured",
    readiness: "Configured / Not Connected",
    connectionState: "not_connected",
    authenticationRequired: true,
    supportedCapabilities: ["page_posts", "image_posts", "analytics (future)"],
    governanceLevel: "approval_required_planning_only",
    permissionsRequired: ["planning only", "future OAuth page scope review", "future publish approval"],
    safeNextAction: "Keep Facebook configured as planning metadata only until OAuth, scopes, approval logging, and publishing policy are approved.",
  },
  {
    id: "instagram_business",
    label: "Instagram",
    icon: "instagram",
    group: "marketing_ads",
    roiPriority: 15,
    requiredEnvKeys: [],
    statusOverride: "configured",
    readiness: "Configured / Not Connected",
    connectionState: "not_connected",
    authenticationRequired: true,
    supportedCapabilities: ["image_posts", "caption_planning", "analytics (future)"],
    governanceLevel: "approval_required_planning_only",
    permissionsRequired: ["planning only", "future OAuth business account scope review", "future publish approval"],
    safeNextAction: "Keep Instagram as destination metadata only; no Graph API calls, publishing, scheduling, or connector writes are enabled.",
  },
  {
    id: "google_business_profile",
    label: "Google Business Profile",
    icon: "google",
    group: "marketing_ads",
    roiPriority: 16,
    requiredEnvKeys: [],
    statusOverride: "configured",
    readiness: "Configured / Not Connected",
    connectionState: "not_connected",
    authenticationRequired: true,
    supportedCapabilities: ["business_updates", "image_posts", "analytics (future)"],
    governanceLevel: "approval_required_planning_only",
    permissionsRequired: ["planning only", "future OAuth business profile scope review", "future publish approval"],
    safeNextAction: "Use GBP as a manual planning destination only until ownership, OAuth, approval, audit, and rollback controls exist.",
  },
  {
    id: "ga4",
    label: "GA4",
    icon: "analytics",
    group: "marketing_ads",
    roiPriority: 17,
    requiredEnvKeys: [],
    statusOverride: "configured",
    readiness: "Configured / Not Connected",
    connectionState: "not_connected",
    authenticationRequired: true,
    supportedCapabilities: ["analytics (future)", "traffic_reporting (future)", "conversion_review (future)"],
    governanceLevel: "read_only_planning",
    permissionsRequired: ["planning only", "future read-only analytics scope review"],
    safeNextAction: "Keep GA4 as manual analytics readiness metadata until read-only API access is approved.",
  },
  {
    id: "search_console",
    label: "Search Console",
    icon: "search",
    group: "marketing_ads",
    roiPriority: 18,
    requiredEnvKeys: [],
    statusOverride: "configured",
    readiness: "Configured / Not Connected",
    connectionState: "not_connected",
    authenticationRequired: true,
    supportedCapabilities: ["search_performance (future)", "index_visibility (future)", "query_review (future)"],
    governanceLevel: "read_only_planning",
    permissionsRequired: ["planning only", "future read-only Search Console scope review"],
    safeNextAction: "Keep Search Console as manual SEO readiness metadata until read-only API access is approved.",
  },
  {
    id: "meta_marketing",
    label: "Meta Marketing API",
    group: "marketing_ads",
    roiPriority: 19,
    requiredEnvKeys: ["META_MARKETING_ACCESS_TOKEN", "META_AD_ACCOUNT_ID", "META_APP_ID", "META_APP_SECRET"],
    safeNextAction: "Keep Meta ad operations manual until source attribution and budget controls are verified.",
  },
  {
    id: "linkedin_company_page",
    label: "LinkedIn",
    icon: "linkedin",
    group: "marketing_ads",
    roiPriority: 20,
    requiredEnvKeys: [],
    statusOverride: "configured",
    readiness: "Configured / Not Connected",
    connectionState: "not_connected",
    publicProfileUrl: "https://www.linkedin.com/company/109661667/",
    authenticationRequired: true,
    supportedCapabilities: ["company_posts", "image_posts", "article_posts", "analytics (future)"],
    governanceLevel: "approval_required_planning_only",
    permissionsRequired: ["planning only", "future OAuth organization scope review", "future company-page publishing approval"],
    safeNextAction:
      "Store only the public LinkedIn Company Page metadata for future approval-controlled publishing; do not start OAuth, call LinkedIn, schedule, publish, scrape, or write connector data.",
  },
];

function hasUsableEnvValue(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) return false;

  return !placeholderFragments.some((fragment) => trimmed.includes(fragment));
}

function evaluateProvider(definition: ProviderReadinessDefinition, env: NodeJS.ProcessEnv): ProviderReadinessItem {
  const configuredEnvKeys = definition.requiredEnvKeys.filter((key) => hasUsableEnvValue(env[key]));
  const missingEnvKeys = definition.requiredEnvKeys.filter((key) => !hasUsableEnvValue(env[key]));
  const status: ProviderReadinessStatus =
    definition.statusOverride ??
    (definition.requiredEnvKeys.length === 0
      ? "no_credentials_required"
      : missingEnvKeys.length === 0
        ? "configured"
        : configuredEnvKeys.length > 0
          ? "partial"
          : "missing");

  return {
    ...definition,
    status,
    configuredEnvKeys,
    missingEnvKeys,
    activationState: "blocked_readiness_only",
    readiness: definition.readiness ?? formatReadiness(status),
    connectionState:
      definition.connectionState ?? (definition.requiredEnvKeys.length === 0 ? "not_required" : "not_connected"),
    authenticationRequired: definition.authenticationRequired ?? definition.requiredEnvKeys.length > 0,
    supportedCapabilities: definition.supportedCapabilities ?? [],
    governanceLevel: definition.governanceLevel ?? "readiness_only",
    permissionsRequired: definition.permissionsRequired ?? ["future approval required before external action"],
    providerCalled: false,
    liveExecutionAllowed: false,
    liveCallsAllowed: false,
    oauthStarted: false,
    published: false,
    scheduled: false,
    connectorWrite: false,
    adsCreated: false,
    enrichmentWritten: false,
  };
}

function formatReadiness(status: ProviderReadinessStatus) {
  if (status === "no_credentials_required") return "No Credentials Required / Readiness Only";
  return status
    .replaceAll("_", " ")
    .split(" ")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

export function createProviderReadinessReport(env: NodeJS.ProcessEnv = process.env): ProviderReadinessReport {
  const providers = providerReadinessDefinitions
    .map((definition) => evaluateProvider(definition, env))
    .sort((a, b) => a.roiPriority - b.roiPriority);

  const missingLeadEnrichmentProviders = providers.filter(
    (provider) => provider.group === "lead_enrichment" && provider.status === "missing",
  );
  const partialProviders = providers.filter((provider) => provider.status === "partial");

  return {
    ok: true,
    providers,
    roiPriority: [
      "Lead capture and enrichment: Supabase/Postgres, ATTOM, Google Maps/OpenStreetMap, OpenAI/Gemini/xAI, and n8n.",
      "Operations tooling: Vercel CLI, Docker, Postman, and Google Calendar.",
      "Marketing providers: Facebook, Instagram, Google Business Profile, GA4, Search Console, and LinkedIn remain configured but not connected until governed OAuth and approval policies exist.",
    ],
    liveCallsAllowed: false,
    providerCalled: false,
    recommendedNextActions: [
      partialProviders.length > 0
        ? "Finish partial provider environment setup before attempting any adapter work."
        : "No partial provider setup detected.",
      missingLeadEnrichmentProviders.length > 0
        ? "Start with missing lead enrichment credentials because they have the clearest near-term ROI."
        : "Lead enrichment provider placeholders are ready for review.",
      "Keep all provider activation blocked until kill switches, audit logging, and explicit operator approvals exist.",
    ],
    safety: {
      readinessOnly: true,
      noLiveExternalFetches: true,
      noOAuthStarts: true,
      noAds: true,
      noPosting: true,
      noScraping: true,
      noEnrichmentWrites: true,
      noAutomatedOutreach: true,
    },
  };
}
