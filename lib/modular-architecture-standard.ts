import type { FeatureFlagKey } from "@/lib/feature-flags";

export type ArchitectureLayer = "ai_core" | "business_module" | "connector_plugin";

export type ExtensionPoint =
  | "capability"
  | "workflow"
  | "permission"
  | "ui_surface"
  | "connector"
  | "audit_event"
  | "schema"
  | "analytics"
  | "document"
  | "notification";

export type GovernanceControlKey =
  | "safeAutoMode"
  | "featureFlags"
  | "auditLogs"
  | "approvalWorkflows"
  | "aiPermissions"
  | "connectorHealth"
  | "rateLimits"
  | "officialApis"
  | "failClosed";

export type GovernanceControlSet = Record<GovernanceControlKey, true>;

export type FeatureArchitectureReviewInput = {
  featureName: string;
  description: string;
  businessDomain?: string;
  reusableAcrossIndustries?: boolean;
  requiresBusinessSpecificSchema?: boolean;
  industrySpecificTerms?: string[];
  requestedExternalActions?: string[];
  connectorKeys?: string[];
  leadLikeRecordCreated?: boolean;
  sourceTrackingPlanned?: boolean;
  extensionPoints?: ExtensionPoint[];
};

export type FeatureArchitectureReview = {
  featureName: string;
  recommendedLayer: ArchitectureLayer;
  recommendedOwner: string;
  reusableAcrossIndustries: boolean;
  pluginCapable: true;
  governanceControls: GovernanceControlSet;
  extensionPoints: ExtensionPoint[];
  requiresSourceTracking: boolean;
  sourceTrackingPlanned: boolean;
  externalActionsBlockedByDefault: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  approvalRequiredForExternalActions: true;
  implementationNotes: string[];
  assumptions: string[];
};

export type BusinessModuleDefinition = {
  moduleKey: string;
  displayName: string;
  industry: string;
  version: string;
  owns: Array<"schemas" | "scoring_rules" | "terminology" | "workflows" | "views" | "integrations">;
  extensionPoints: ExtensionPoint[];
  requiredFeatureFlags: FeatureFlagKey[];
  connectorKeys: string[];
  governanceControls: GovernanceControlSet;
  sourceTrackingRequired: boolean;
  status: "planning" | "installed" | "enabled" | "disabled";
};

export type BusinessModuleRegistration = {
  ok: boolean;
  moduleKey: string;
  layer: "business_module";
  inheritedConstitution: true;
  pluginCapable: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  blockedReasons: string[];
};

export const requiredGovernanceControls: GovernanceControlSet = {
  safeAutoMode: true,
  featureFlags: true,
  auditLogs: true,
  approvalWorkflows: true,
  aiPermissions: true,
  connectorHealth: true,
  rateLimits: true,
  officialApis: true,
  failClosed: true,
};

export const aiCoreServices = [
  "Executive AI",
  "Revenue Engine",
  "CRM primitives",
  "Workflow Engine",
  "Automation Engine",
  "Connector Platform",
  "AI Agent Framework",
  "Knowledge Base",
  "Document Engine",
  "Analytics",
  "Notifications",
  "Security",
  "Governance",
  "Audit",
  "AI Permissions",
  "Feature Flags",
] as const;

export const businessModuleExamples = [
  "Real Estate",
  "E-commerce",
  "Trucking",
  "Healthcare",
  "Consulting",
] as const;

export const realEstateBusinessModule: BusinessModuleDefinition = {
  moduleKey: "real_estate",
  displayName: "Real Estate Business Module",
  industry: "Real Estate",
  version: "1.0.0",
  owns: ["schemas", "scoring_rules", "terminology", "workflows", "views", "integrations"],
  extensionPoints: ["capability", "workflow", "permission", "ui_surface", "connector", "audit_event", "schema", "analytics"],
  requiredFeatureFlags: ["connector_property_data", "market_intelligence", "demand_discovery"],
  connectorKeys: ["county_assessor", "attom", "property_data"],
  governanceControls: requiredGovernanceControls,
  sourceTrackingRequired: true,
  status: "planning",
};

const externalActionPattern = /publish|send|sms|email|call|scrape|crawl|spend|budget|activate|execute|trigger|webhook|post/i;

function hasExternalActions(input: FeatureArchitectureReviewInput) {
  return (input.requestedExternalActions ?? []).some((action) => externalActionPattern.test(action));
}

function hasIndustrySpecificScope(input: FeatureArchitectureReviewInput) {
  return Boolean(
    input.requiresBusinessSpecificSchema ||
      input.businessDomain ||
      (input.industrySpecificTerms?.length ?? 0) > 0,
  );
}

function uniqueExtensionPoints(input: FeatureArchitectureReviewInput): ExtensionPoint[] {
  const defaults: ExtensionPoint[] = ["capability", "permission", "audit_event"];

  if (input.connectorKeys?.length) defaults.push("connector");
  if (input.leadLikeRecordCreated) defaults.push("schema");

  return Array.from(new Set([...(input.extensionPoints ?? []), ...defaults]));
}

export function classifyFeatureArchitecture(input: FeatureArchitectureReviewInput): FeatureArchitectureReview {
  const externalActionsRequested = hasExternalActions(input);
  const connectorRequested = (input.connectorKeys?.length ?? 0) > 0;
  const industrySpecific = hasIndustrySpecificScope(input);
  const reusableAcrossIndustries = input.reusableAcrossIndustries ?? !industrySpecific;
  const requiresSourceTracking = input.leadLikeRecordCreated === true;
  const recommendedLayer: ArchitectureLayer = connectorRequested
    ? "connector_plugin"
    : industrySpecific && !reusableAcrossIndustries
      ? "business_module"
      : "ai_core";
  const recommendedOwner =
    recommendedLayer === "ai_core"
      ? "AI Core"
      : recommendedLayer === "connector_plugin"
        ? "Connector Platform"
        : `${input.businessDomain ?? "Business"} Module`;

  return {
    featureName: input.featureName,
    recommendedLayer,
    recommendedOwner,
    reusableAcrossIndustries,
    pluginCapable: true,
    governanceControls: requiredGovernanceControls,
    extensionPoints: uniqueExtensionPoints(input),
    requiresSourceTracking,
    sourceTrackingPlanned: requiresSourceTracking ? input.sourceTrackingPlanned === true : true,
    externalActionsBlockedByDefault: true,
    providerCalled: false,
    liveExecutionAllowed: false,
    approvalRequiredForExternalActions: true,
    implementationNotes: [
      `${input.featureName} must register through ${recommendedOwner} and preserve shared governance controls.`,
      externalActionsRequested
        ? "Requested external actions must stay blocked until explicit approval policy, connector health, feature flags, audit, and Safe Auto Mode all pass."
        : "No external action is authorized by this architecture review.",
      requiresSourceTracking
        ? "Lead-like intake records must validate source attribution before persistence."
        : "No lead-like intake record is required by this review.",
    ],
    assumptions: [
      "This review classifies architecture placement only; it does not execute providers, workflows, outreach, publishing, scraping, spending, or connector activation.",
      ...(industrySpecific ? ["Industry-specific behavior belongs outside AI Core unless extracted into reusable primitives."] : []),
    ],
  };
}

export function registerBusinessModuleDefinition(module: BusinessModuleDefinition): BusinessModuleRegistration {
  const blockedReasons: string[] = [];

  if (module.owns.length === 0) blockedReasons.push("module_must_own_business_specific_artifacts");
  if (!module.extensionPoints.includes("capability")) blockedReasons.push("capability_extension_point_required");
  if (!module.extensionPoints.includes("permission")) blockedReasons.push("permission_extension_point_required");
  if (!module.extensionPoints.includes("audit_event")) blockedReasons.push("audit_event_extension_point_required");

  for (const key of Object.keys(requiredGovernanceControls) as GovernanceControlKey[]) {
    if (module.governanceControls[key] !== true) blockedReasons.push(`${key}_governance_required`);
  }

  return {
    ok: blockedReasons.length === 0,
    moduleKey: module.moduleKey,
    layer: "business_module",
    inheritedConstitution: true,
    pluginCapable: true,
    providerCalled: false,
    liveExecutionAllowed: false,
    blockedReasons,
  };
}
