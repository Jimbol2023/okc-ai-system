import { createCreativeStudioPlatformReport } from "@/lib/ai-creative-growth-studio";
import { getCompanyDepartmentRegistry, type CompanyDepartment } from "@/lib/company-orchestrator";
import { createDocumentIntelligencePlatformReport } from "@/lib/document-intelligence-platform";
import { createEnterpriseSecurityPlatformReport } from "@/lib/enterprise-security-platform";
import { getFeatureFlagSnapshot, type FeatureFlagKey } from "@/lib/feature-flags";
import { createMarketingPlatformRegistryReport, type MarketingPlatformReadiness, type MarketingPlatformStatus } from "@/lib/marketing-platform-registry";
import {
  realEstateBusinessModule,
  registerBusinessModuleDefinition,
  requiredGovernanceControls,
  type BusinessModuleDefinition,
  type ExtensionPoint,
} from "@/lib/modular-architecture-standard";
import { createToolRegistrySummary } from "@/lib/tool-capability-manager";

export type CorePlatformStatus = "ready" | "partial" | "planned" | "blocked";

export type CorePlatformRegistryItem = {
  key: string;
  name: string;
  category:
    | "executive"
    | "revenue"
    | "crm"
    | "workflow"
    | "automation"
    | "connector"
    | "agents"
    | "analytics"
    | "security"
    | "governance"
    | "knowledge"
    | "documents"
    | "creative"
    | "notifications";
  status: CorePlatformStatus;
  route: string | null;
  purpose: string;
  capabilities: string[];
  dependencies: string[];
  highRoiReason: string;
  governance: {
    safeAutoMode: true;
    featureFlags: true;
    approvals: true;
    auditLogs: true;
    aiPermissions: true;
    connectorHealth: true;
    securityReview: true;
  };
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type BusinessModuleMarketplaceItem = {
  moduleKey: string;
  displayName: string;
  industry: string;
  status: "installed" | "planned" | "disabled";
  route: string | null;
  capabilities: string[];
  requiredConnectors: string[];
  requiredPermissions: string[];
  requiredFeatureFlags: FeatureFlagKey[];
  safetyStatus: "governed" | "planning_only" | "blocked";
  highRoiReason: string;
  extensionPoints: ExtensionPoint[];
  approvalRequiredForExternalActions: true;
  sourceTrackingRequired: boolean;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type CoreProviderRegistryEntry = {
  providerId: string;
  displayName: string;
  icon: string;
  status: MarketingPlatformStatus;
  readiness: string;
  publicProfileUrl?: string;
  readinessScore: number;
  manualPublishing: true;
  publishingMode: "MANUAL";
  approvalRequired: "CEO APPROVAL REQUIRED";
  futureProviderSupport: boolean;
  providerCalled: false;
  liveExecutionAllowed: false;
  authenticationRequired: boolean;
  supportedCapabilities: string[];
  governanceLevel: "approval_required_planning_only" | "read_only_planning";
  permissionsRequired: string[];
};

export type AiDepartmentRegistryEntry = CompanyDepartment;

export type CorePlatformRegistryReport = {
  ok: true;
  title: "J Capital AI OS Core Platform Registry";
  summary: string;
  corePlatforms: CorePlatformRegistryItem[];
  businessModules: BusinessModuleMarketplaceItem[];
  providerRegistry: CoreProviderRegistryEntry[];
  aiDepartments: AiDepartmentRegistryEntry[];
  totals: {
    corePlatforms: number;
    readyCorePlatforms: number;
    businessModules: number;
    installedBusinessModules: number;
    plannedBusinessModules: number;
    aiDepartments: number;
  };
  nextHighRoiMoves: string[];
  providerCalled: false;
  liveExecutionAllowed: false;
};

const governance = {
  safeAutoMode: true,
  featureFlags: true,
  approvals: true,
  auditLogs: true,
  aiPermissions: true,
  connectorHealth: true,
  securityReview: true,
} as const;

function createCorePlatformItems(): CorePlatformRegistryItem[] {
  const security = createEnterpriseSecurityPlatformReport();
  const creative = createCreativeStudioPlatformReport();
  const documents = createDocumentIntelligencePlatformReport();
  const tools = createToolRegistrySummary();

  return [
    {
      key: "executive_ai",
      name: "Executive AI",
      category: "executive",
      status: "partial",
      route: "/dashboard",
      purpose: "Converts system intelligence into operator-ready priorities, briefings, and decisions.",
      capabilities: ["morning briefings", "priority synthesis", "risk summaries", "operator recommendations"],
      dependencies: ["Revenue Engine", "Security Platform", "Connector Platform", "Audit Logs"],
      highRoiReason: "Keeps the operator focused on the highest-leverage work each day.",
      governance,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    {
      key: "revenue_engine",
      name: "Revenue Engine",
      category: "revenue",
      status: "partial",
      route: "/dashboard/revenue",
      purpose: "Prioritizes sourced opportunities, pipeline risk, attribution, and follow-up readiness.",
      capabilities: ["lead scoring", "source attribution", "pipeline risk", "decision logs"],
      dependencies: ["CRM Engine", "Approvals", "Audit Logs"],
      highRoiReason: "Improves revenue focus without increasing unsafe outreach volume.",
      governance,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    {
      key: "crm_engine",
      name: "CRM Engine",
      category: "crm",
      status: "partial",
      route: "/dashboard/leads",
      purpose: "Stores and reviews sourced customer, lead, relationship, and activity records.",
      capabilities: ["lead records", "source tracking", "manual review", "follow-up context"],
      dependencies: ["Data Protection", "Approval Center", "Audit Logs"],
      highRoiReason: "Creates reusable customer memory for every business module.",
      governance,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    {
      key: "workflow_engine",
      name: "Workflow Engine",
      category: "workflow",
      status: "planned",
      route: "/dashboard/operations",
      purpose: "Plans governed business workflows while blocking live triggers by default.",
      capabilities: ["workflow readiness", "manual sequences", "n8n readiness", "blocked trigger review"],
      dependencies: ["Automation Engine", "Approval Center", "Security Platform"],
      highRoiReason: "Standardizes repeatable work before enabling automation.",
      governance,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    {
      key: "automation_engine",
      name: "Automation Engine",
      category: "automation",
      status: "partial",
      route: "/dashboard/safety",
      purpose: "Evaluates Safe Auto Mode decisions for internal prep and blocks high-risk actions.",
      capabilities: ["safe auto internal", "approval-required decisions", "blocked external action review"],
      dependencies: ["Tool Registry", "Feature Flags", "AI Security"],
      highRoiReason: "Allows safe internal leverage without reputational or operational shortcuts.",
      governance,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    {
      key: "connector_platform",
      name: "Connector Platform",
      category: "connector",
      status: tools.blockedOrUnavailableTools > 0 ? "partial" : "ready",
      route: "/dashboard/tools",
      purpose: "Registers tools, connector health, approvals, fallbacks, and live-execution boundaries.",
      capabilities: ["tool registry", "connector health", "fallbacks", "approval requirements"],
      dependencies: ["Security Platform", "Feature Flags", "Approval Center"],
      highRoiReason: "Prevents brittle one-off integrations and keeps provider work governed.",
      governance,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    {
      key: "ai_agents",
      name: "AI Agent Framework",
      category: "agents",
      status: "partial",
      route: "/dashboard/enterprise-ai",
      purpose: "Coordinates specialized AI agents under governance and human review.",
      capabilities: ["agent roles", "tool-use review", "advisory recommendations", "human approval"],
      dependencies: ["AI Security", "Tool Registry", "Audit Logs"],
      highRoiReason: "Gives reusable agent labor without granting autonomous execution.",
      governance,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    {
      key: "analytics",
      name: "Analytics",
      category: "analytics",
      status: "partial",
      route: "/dashboard/research",
      purpose: "Surfaces performance, market, demand, and growth signals with assumptions labeled.",
      capabilities: ["market intelligence", "demand discovery", "performance summaries", "data gaps"],
      dependencies: ["Knowledge Base", "Revenue Engine", "Security Platform"],
      highRoiReason: "Turns raw signals into reusable decisions across modules.",
      governance,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    {
      key: "security",
      name: "Security Platform",
      category: "security",
      status: security.productionActivationGate.blockers.length > 0 ? "partial" : "ready",
      route: "/dashboard/security-platform",
      purpose: security.summary,
      capabilities: security.aiSecurityAgent.monitoredRisks,
      dependencies: ["Identity", "Audit Logs", "Connector Platform", "Approval Center"],
      highRoiReason: "Blocks live-connector risk before it can damage customers, data, or brand trust.",
      governance,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    {
      key: "governance",
      name: "Governance, Permissions & Audit",
      category: "governance",
      status: "partial",
      route: "/dashboard/approvals",
      purpose: "Centralizes approval boundaries, permission visibility, and audit-ready decisions.",
      capabilities: ["approval queues", "policy visibility", "audit-ready events", "permission review"],
      dependencies: ["Security Platform", "Feature Flags", "Safe Auto Mode"],
      highRoiReason: "Makes every future automation easier to trust and review.",
      governance,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    {
      key: "knowledge_base",
      name: "Knowledge Base",
      category: "knowledge",
      status: "partial",
      route: "/dashboard/knowledge",
      purpose: "Stores internal SOPs, approved context, searchable knowledge, and source-grounded references.",
      capabilities: ["knowledge items", "internal search", "approved references", "source labels"],
      dependencies: ["Document Engine", "Security Platform", "Audit Logs"],
      highRoiReason: "Reduces repeated decisions and keeps AI outputs grounded.",
      governance,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    {
      key: "creative_growth_studio",
      name: "Creative Growth Studio",
      category: "creative",
      status: "ready",
      route: "/dashboard/creative-studio",
      purpose: creative.summary,
      capabilities: [...creative.capabilities],
      dependencies: ["Approval Center", "Security Platform", "Connector Platform", "Knowledge Base"],
      highRoiReason: "Creates reusable, reputation-safe marketing leverage across every business module.",
      governance,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    {
      key: "document_intelligence",
      name: "Document Intelligence",
      category: "documents",
      status: "ready",
      route: "/dashboard/document-intelligence",
      purpose: documents.summary,
      capabilities: [...documents.capabilities],
      dependencies: ["Knowledge Base", "Approval Center", "Security Platform", "Connector Platform"],
      highRoiReason: "Turns document work into reusable templates and governed workflows.",
      governance,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    {
      key: "notification_engine",
      name: "Notification Engine",
      category: "notifications",
      status: "planned",
      route: "/dashboard/mobile-command",
      purpose: "Routes internal alerts, reminders, risks, and executive notifications without external messaging by default.",
      capabilities: ["internal notifications", "risk alerts", "mobile command signals", "operator reminders"],
      dependencies: ["Security Platform", "Approval Center", "Audit Logs"],
      highRoiReason: "Keeps operators responsive without unsafe automated outreach.",
      governance,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
  ];
}

const futureModuleExtensionPoints: ExtensionPoint[] = ["capability", "workflow", "permission", "ui_surface", "connector", "audit_event", "schema", "analytics", "document"];

function providerIdForPlatform(platform: MarketingPlatformReadiness) {
  if (platform.id === "facebook_business") return "facebook_page";
  if (platform.id === "linkedin_company") return "linkedin_company_page";

  return platform.id;
}

function iconForPlatform(platform: MarketingPlatformReadiness) {
  if (platform.id === "google_business_profile") return "google";
  if (platform.id === "facebook_business") return "facebook";
  if (platform.id === "instagram_business") return "instagram";
  if (platform.id === "linkedin_company") return "linkedin";
  if (platform.id === "youtube") return "youtube";
  if (platform.id === "x") return "x";
  if (platform.id === "tiktok") return "tiktok";
  if (platform.id === "pinterest_business") return "pinterest";

  return "website";
}

function capabilitiesForPlatform(platform: MarketingPlatformReadiness) {
  if (platform.id === "website") return ["owned content", "lead capture", "authority pages"];
  if (platform.id === "youtube") return ["video education", "descriptions", "chapters", "analytics (future)"];
  if (platform.id === "pinterest_business") return ["visual education", "pin planning", "analytics (future)"];
  if (platform.id === "x") return ["short posts", "market commentary", "analytics (future)"];
  if (platform.id === "tiktok") return ["short-form video", "caption planning", "analytics (future)"];
  if (platform.id === "google_business_profile") return ["business_updates", "image_posts", "analytics (future)"];
  if (platform.id === "linkedin_company") return ["company_posts", "image_posts", "article_posts", "analytics (future)"];
  if (platform.id === "instagram_business") return ["image_posts", "caption_planning", "analytics (future)"];

  return ["page_posts", "image_posts", "analytics (future)"];
}

function createCoreProviderRegistryEntries(): CoreProviderRegistryEntry[] {
  return createMarketingPlatformRegistryReport().platforms.map((platform) => ({
    providerId: providerIdForPlatform(platform),
    displayName: platform.id === "linkedin_company" ? "LinkedIn" : platform.label,
    icon: iconForPlatform(platform),
    status: platform.status,
    readiness: platform.status === "configured" ? "Configured / Not Connected" : platform.readiness,
    readinessScore: platform.readinessScore,
    manualPublishing: true,
    publishingMode: platform.publishingMode,
    approvalRequired: platform.approvalRequired,
    futureProviderSupport: platform.futureProviderSupport,
    publicProfileUrl: platform.id === "linkedin_company" ? "https://www.linkedin.com/company/109661667/" : undefined,
    providerCalled: false,
    liveExecutionAllowed: false,
    authenticationRequired: platform.futureProviderSupport,
    supportedCapabilities: capabilitiesForPlatform(platform),
    governanceLevel: platform.id === "website" ? "read_only_planning" : "approval_required_planning_only",
    permissionsRequired: ["planning only", "CEO approval required", "future provider scope review before activation"],
  }));
}

function createAiDepartmentRegistryEntries(): AiDepartmentRegistryEntry[] {
  return getCompanyDepartmentRegistry();
}

function moduleDefinition(input: {
  moduleKey: string;
  displayName: string;
  industry: string;
  status: BusinessModuleDefinition["status"];
  connectorKeys: string[];
  requiredFeatureFlags?: FeatureFlagKey[];
}): BusinessModuleDefinition {
  return {
    moduleKey: input.moduleKey,
    displayName: input.displayName,
    industry: input.industry,
    version: "0.1.0",
    owns: ["schemas", "scoring_rules", "terminology", "workflows", "views", "integrations"],
    extensionPoints: futureModuleExtensionPoints,
    requiredFeatureFlags: input.requiredFeatureFlags ?? [],
    connectorKeys: input.connectorKeys,
    governanceControls: requiredGovernanceControls,
    sourceTrackingRequired: true,
    status: input.status,
  };
}

function marketplaceItem(module: BusinessModuleDefinition, options: {
  route: string | null;
  capabilities: string[];
  requiredPermissions: string[];
  highRoiReason: string;
}): BusinessModuleMarketplaceItem {
  const registration = registerBusinessModuleDefinition(module);
  const status = module.status === "installed" || module.moduleKey === "real_estate" ? "installed" : module.status === "disabled" ? "disabled" : "planned";

  return {
    moduleKey: module.moduleKey,
    displayName: module.displayName,
    industry: module.industry,
    status,
    route: options.route,
    capabilities: options.capabilities,
    requiredConnectors: module.connectorKeys,
    requiredPermissions: options.requiredPermissions,
    requiredFeatureFlags: module.requiredFeatureFlags,
    safetyStatus: registration.ok ? (status === "installed" ? "governed" : "planning_only") : "blocked",
    highRoiReason: options.highRoiReason,
    extensionPoints: module.extensionPoints,
    approvalRequiredForExternalActions: true,
    sourceTrackingRequired: module.sourceTrackingRequired,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

function createBusinessModuleItems(): BusinessModuleMarketplaceItem[] {
  return [
    marketplaceItem({ ...realEstateBusinessModule, status: "installed" }, {
      route: "/dashboard/properties",
      capabilities: ["lead intake", "property review", "deal analyzer", "tax list importer", "driving for dollars", "out-of-state owner detection"],
      requiredPermissions: ["CRM access", "Property data review", "Approval center access"],
      highRoiReason: "Installed first because it powers the current revenue workflow and validates the platform model.",
    }),
    marketplaceItem(moduleDefinition({ moduleKey: "ecommerce", displayName: "E-commerce Business Module", industry: "E-commerce", status: "planning", connectorKeys: ["shopify", "woocommerce", "stripe", "mailchimp"] }), {
      route: null,
      capabilities: ["product catalog", "campaign planning", "retention workflows", "sales reporting"],
      requiredPermissions: ["Product data access", "Marketing review", "Customer data review"],
      highRoiReason: "High reuse with Creative Studio, Document Intelligence, Revenue Engine, and connector infrastructure.",
    }),
    marketplaceItem(moduleDefinition({ moduleKey: "trucking", displayName: "Trucking Business Module", industry: "Trucking", status: "planning", connectorKeys: ["google_workspace", "quickbooks", "fleet_management"] }), {
      route: null,
      capabilities: ["dispatch workflows", "load documents", "fleet reporting", "customer follow-up"],
      requiredPermissions: ["Operations access", "Document review", "Customer data review"],
      highRoiReason: "Operational workflows and documents can reuse AI Core without new architecture.",
    }),
    marketplaceItem(moduleDefinition({ moduleKey: "healthcare", displayName: "Healthcare Business Module", industry: "Healthcare", status: "planning", connectorKeys: ["google_workspace", "microsoft_365"] }), {
      route: null,
      capabilities: ["compliance workflows", "document review", "patient-safe communications planning", "analytics"],
      requiredPermissions: ["Restricted data review", "Compliance approval", "Security review"],
      highRoiReason: "Strong future market, but requires security and compliance gates before activation.",
    }),
    marketplaceItem(moduleDefinition({ moduleKey: "property_management", displayName: "Property Management Business Module", industry: "Property Management", status: "planning", connectorKeys: ["google_workspace", "property_data"] }), {
      route: null,
      capabilities: ["tenant workflows", "maintenance documents", "owner reports", "leasing support"],
      requiredPermissions: ["Property records", "Document review", "Approval center access"],
      highRoiReason: "Adjacent to Real Estate and can reuse existing property and CRM foundations.",
    }),
    marketplaceItem(moduleDefinition({ moduleKey: "lending", displayName: "Lending Business Module", industry: "Lending", status: "planning", connectorKeys: ["microsoft_365", "google_workspace"] }), {
      route: null,
      capabilities: ["loan document planning", "risk review", "borrower communications prep", "portfolio reporting"],
      requiredPermissions: ["Financial data review", "Compliance approval", "Security review"],
      highRoiReason: "High-value document and approval workflows, blocked until stronger compliance persistence exists.",
    }),
    marketplaceItem(moduleDefinition({ moduleKey: "consulting", displayName: "Consulting Business Module", industry: "Consulting", status: "planning", connectorKeys: ["google_workspace", "microsoft_365", "hubspot"] }), {
      route: null,
      capabilities: ["proposal generation", "client delivery workflows", "sales enablement", "knowledge packaging"],
      requiredPermissions: ["Client data review", "Document approval", "CRM access"],
      highRoiReason: "Fastest future module to monetize with Document Intelligence and Creative Studio.",
    }),
    marketplaceItem(moduleDefinition({ moduleKey: "ai_agency", displayName: "AI Agency Business Module", industry: "AI Agency", status: "planning", connectorKeys: ["openai", "hubspot", "google_workspace"] }), {
      route: null,
      capabilities: ["client onboarding", "AI service packages", "delivery templates", "growth reporting"],
      requiredPermissions: ["Client workspace review", "AI permission review", "Security review"],
      highRoiReason: "Turns the OS itself into a service-delivery engine without duplicating core platforms.",
    }),
  ];
}

export function createCorePlatformRegistryReport(): CorePlatformRegistryReport {
  const corePlatforms = createCorePlatformItems();
  const businessModules = createBusinessModuleItems();
  const providerRegistry = createCoreProviderRegistryEntries();
  const aiDepartments = createAiDepartmentRegistryEntries();
  const flags = getFeatureFlagSnapshot();

  return {
    ok: true,
    title: "J Capital AI OS Core Platform Registry",
    summary:
      "Single read-only registry for AI Core subsystems and installable Business Modules. It organizes the OS around reusable platforms, governed modules, and high-ROI next moves.",
    corePlatforms,
    businessModules,
    providerRegistry,
    aiDepartments,
    totals: {
      corePlatforms: corePlatforms.length,
      readyCorePlatforms: corePlatforms.filter((platform) => platform.status === "ready").length,
      businessModules: businessModules.length,
      installedBusinessModules: businessModules.filter((module) => module.status === "installed").length,
      plannedBusinessModules: businessModules.filter((module) => module.status === "planned").length,
      aiDepartments: aiDepartments.length,
    },
    nextHighRoiMoves: [
      "Persist audit, security, creative, document, connector, and approval events.",
      "Upgrade the unified Approval Center to cover every module and AI Core action.",
      "Add tenant, organization, team, role, and service-account foundations before live connectors.",
      "Implement encrypted connector credential vault and scope validation.",
      "Use Content Intelligence to decide what Marketing AI should create, refresh, or repurpose next.",
      "Raise Brand Health by completing manual platform readiness gaps before expanding publishing volume.",
      "Route every campaign, design brief, and platform update through approval-first governance.",
      "Connect source labels to lead quality before investing more time in any channel.",
      `Keep disabled live flags blocked until security and approval evidence is complete: ${flags.disabled.slice(0, 6).join(", ")}.`,
    ],
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}
