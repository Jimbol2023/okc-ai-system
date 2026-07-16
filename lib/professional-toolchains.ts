import {
  createGovernedProfessionalDeliverable,
  professionalCapabilityQualifications,
  professionalDeliverableContracts,
  professionalProfileContracts,
  type GovernedEvidenceItemV1,
} from "@/lib/enterprise-professional-operating-system";
import type { BusinessDataSnapshotRecord } from "@/lib/read-only-business-connections";
import { listUniversalConnectorManifests } from "@/lib/universal-enterprise-integration-platform";

export type ProfessionalControlUnit =
  | "Executive Command"
  | "Professional Standards & QA"
  | "Approval, Safety & Risk"
  | "Data, Knowledge & Learning"
  | "Integration Operations"
  | "Security & Privacy";

export type ExpertiseScope = "enterprise" | "functional" | "industry" | "regional";
export type ToolchainOperationClass = "read" | "prepare" | "review";
export type ToolchainReadiness = "defined" | "staged" | "calibration" | "pilot_validated" | "operationally_proven" | "suspended";
export type ConnectorIntakeStatus =
  | "ineligible"
  | "business_case_required"
  | "professional_certification_required"
  | "capability_registration_required"
  | "security_review_required"
  | "calibration_only"
  | "ready_for_governed_enablement";

export type ProfessionalExpertisePackV1 = {
  id: string;
  version: "1.0.0";
  title: string;
  scope: ExpertiseScope;
  owner: string;
  applicableProfessionalIds: string[];
  applicableDeliverableIds: string[];
  applicableBusinessModules: string[];
  knowledgeDomains: string[];
  approvedSourceHierarchy: string[];
  regionalSpecialization: string | null;
  prohibitedConclusions: string[];
  assessmentCases: string[];
  proficiencyRubric: string[];
  knowledgeFreshness: string;
  recertificationTriggers: string[];
  providerAuthorityGranted: false;
  externalExecutionGranted: false;
};

export type ToolchainCapabilityV1 = {
  connectorId: string;
  capabilityKey: string;
  qualificationId: string;
  operationClass: ToolchainOperationClass;
  runtimeState: "registered" | "staged";
  required: boolean;
};

export type ProfessionalToolchainContractV1 = {
  id: string;
  version: "1.0.0";
  title: string;
  department: string;
  businessModule: string;
  accountableProfessionalId: string;
  independentReviewerId: string;
  expertisePackIds: string[];
  competencyIds: string[];
  sopIds: string[];
  internalTools: string[];
  capabilities: ToolchainCapabilityV1[];
  deliverableIds: string[];
  evidenceRequirements: string[];
  freshnessRequirement: string;
  privacyControls: string[];
  securityControls: string[];
  licensingControls: string[];
  safeFallback: string;
  dataGapBehavior: string;
  supportedEnvironments: Array<"development" | "preview" | "production">;
  featureFlags: string[];
  killSwitch: string;
  expectedBusinessValue: {
    timeSaved: string;
    riskReduced: string;
    revenueOpportunity: string;
    measurableMetricIds: string[];
  };
  approvedBusinessCase: boolean;
  readiness: ToolchainReadiness;
  providerAuthorityGranted: false;
  externalExecutionGranted: false;
};

export type CertificationWaveContractV1 = {
  id: string;
  version: "1.0.0";
  wave: number;
  title: string;
  objective: string;
  businessHypothesis: string;
  professionalIds: string[];
  toolchainIds: string[];
  deliverableIds: string[];
  prerequisites: string[];
  calibrationMinimum: number;
  blindValidationMinimum: number;
  exitCriteria: string[];
  lifecycle: "active" | "planned";
  blockers: string[];
  humanPromotionRequired: true;
  providerAuthorityGranted: false;
  externalExecutionGranted: false;
};

export type ConnectorIntakeDecisionV1 = {
  toolchainId: string;
  connectorId: string;
  status: ConnectorIntakeStatus;
  eligible: boolean;
  reasons: string[];
  nextSafeAction: string;
  professionalId: string;
  qualificationIds: string[];
  deliverableIds: string[];
  measurableMetricIds: string[];
  connectorActivated: false;
  providerAuthorityGranted: false;
  externalExecutionGranted: false;
};

export const professionalControlUnits = [
  { unit: "Executive Command", professionals: ["CEO Executive Assistant", "Company Orchestrator", "Executive Intelligence Director"], accountableOutput: "Cross-Department Decision Packet", independent: false },
  { unit: "Professional Standards & QA", professionals: ["Chief Professional Standards Officer", "Certification Manager", "Independent Quality Reviewers"], accountableOutput: "Certification and Quality Decision", independent: true },
  { unit: "Approval, Safety & Risk", professionals: ["Approval Gatekeeper", "Governance Analyst", "Compliance Reviewer"], accountableOutput: "Approval or Risk Decision", independent: true },
  { unit: "Data, Knowledge & Learning", professionals: ["Chief Knowledge Officer", "Data Steward", "Outcome Learning Analyst"], accountableOutput: "Institutional Learning Brief", independent: true },
  { unit: "Integration Operations", professionals: ["Connector Reliability Engineer", "Credential Steward", "Integration Auditor"], accountableOutput: "Toolchain Readiness Report", independent: true },
  { unit: "Security & Privacy", professionals: ["Security Analyst", "Privacy Steward"], accountableOutput: "Security and Privacy Review", independent: true },
] as const satisfies ReadonlyArray<{ unit: ProfessionalControlUnit; professionals: readonly string[]; accountableOutput: string; independent: boolean }>;

export const operatingCompanyDepartmentRoadmap = [
  { department: "Property Intelligence", lifecycle: "implemented", primaryDeliverable: "Acquisition Intelligence Package" },
  { department: "Revenue Operations", lifecycle: "implemented", primaryDeliverable: "Revenue Action Plan" },
  { department: "Marketing Intelligence", lifecycle: "active_wave_1", primaryDeliverable: "Executive Growth Intelligence Brief" },
  { department: "Creative Studio", lifecycle: "implemented", primaryDeliverable: "Campaign Package" },
  { department: "Finance & Executive Analytics", lifecycle: "implemented", primaryDeliverable: "Executive Financial Decision Brief" },
  { department: "Customer Experience", lifecycle: "planned", primaryDeliverable: "Customer Experience Improvement Plan" },
  { department: "Product & Engineering", lifecycle: "planned", primaryDeliverable: "Platform Capability Plan" },
] as const;

export const plannedCreativeDesignToolchainCandidates = [
  { toolId: "canva", role: "campaign and social asset preparation", authority: "planned_read_or_prepare_only", providerCallsAllowed: false, publishingAllowed: false },
  { toolId: "adobe_express", role: "governed campaign asset preparation", authority: "planned_prepare_only", providerCallsAllowed: false, publishingAllowed: false },
  { toolId: "figma", role: "product, website, and dashboard design specifications", authority: "design_reference_only", providerCallsAllowed: false, publishingAllowed: false },
  { toolId: "storybook", role: "internal component catalog, accessibility, and visual regression", authority: "internal_tool_only", providerCallsAllowed: false, publishingAllowed: false },
] as const;

export const professionalExpertisePacks: ProfessionalExpertisePackV1[] = [
  {
    id: "enterprise-evidence-governance",
    version: "1.0.0",
    title: "Enterprise Evidence, QA, and Authority Boundaries",
    scope: "enterprise",
    owner: "Professional Standards & QA",
    applicableProfessionalIds: professionalProfileContracts.map((profile) => profile.professionalId),
    applicableDeliverableIds: professionalDeliverableContracts.map((deliverable) => deliverable.id),
    applicableBusinessModules: ["ai-core", "real-estate"],
    knowledgeDomains: ["evidence provenance", "freshness", "confidence", "assumption labeling", "independent QA", "approval boundaries", "privacy"],
    approvedSourceHierarchy: ["governed internal records", "normalized provider evidence", "approved human evidence", "explicitly labeled assumptions"],
    regionalSpecialization: null,
    prohibitedConclusions: ["unsupported fact", "hidden conflict", "approval-as-execution", "provider readiness as authority"],
    assessmentCases: ["seeded missing provenance", "seeded self-review", "seeded unauthorized action", "conflicting evidence"],
    proficiencyRubric: ["detect every critical defect", "preserve material disagreement", "escalate prohibited authority", "produce decision-ready evidence"],
    knowledgeFreshness: "Review after every material evidence, QA, privacy, or authority-policy change.",
    recertificationTriggers: ["evidence contract change", "QA rubric change", "authority-policy change", "critical defect escape"],
    providerAuthorityGranted: false,
    externalExecutionGranted: false,
  },
  {
    id: "search-market-intelligence",
    version: "1.0.0",
    title: "Search and Market Intelligence",
    scope: "functional",
    owner: "Marketing Intelligence",
    applicableProfessionalIds: ["marketing-intelligence-director", "senior-seo-director", "senior-analytics-specialist", "local-visibility-specialist", "marketing-quality-reviewer"],
    applicableDeliverableIds: ["executive-seo-brief", "local-visibility-report", "content-opportunity-report"],
    applicableBusinessModules: ["ai-core"],
    knowledgeDomains: ["search intent", "customer journey", "technical crawl and indexing analysis", "content clusters", "topical authority", "E-E-A-T and source-quality boundaries", "schema and entity SEO", "local SEO", "CTR and content-decay analysis", "attribution limitations", "experiment design", "unsupported-forecast detection", "AI search visibility"],
    approvedSourceHierarchy: ["normalized Search Console evidence", "normalized GA4 evidence", "normalized GBP evidence", "approved website inventory", "approved knowledge sources"],
    regionalSpecialization: null,
    prohibitedConclusions: ["unsupported traffic forecast", "unsupported revenue attribution", "invented ranking", "invented local visibility metric", "unverified competitor claim"],
    assessmentCases: ["search opportunity with missing attribution", "local profile data gap", "technical indexing conflict", "high-impression low-evidence page"],
    proficiencyRubric: ["separate observation from recommendation", "state attribution limits", "prioritize by business relevance", "expose missing data"],
    knowledgeFreshness: "Search evidence must expose its observation cutoff; methods are reviewed quarterly or after material platform change.",
    recertificationTriggers: ["provider adapter change", "search methodology change", "report schema change", "attribution defect"],
    providerAuthorityGranted: false,
    externalExecutionGranted: false,
  },
  {
    id: "oklahoma-county-property-intelligence",
    version: "1.0.0",
    title: "Oklahoma County Property Intelligence",
    scope: "regional",
    owner: "Real Estate Business Module",
    applicableProfessionalIds: ["property-records-gis-analyst", "market-valuation-analyst", "investment-acquisition-analyst"],
    applicableDeliverableIds: ["acquisition-decision-brief"],
    applicableBusinessModules: ["real-estate"],
    knowledgeDomains: ["property identity", "county records", "parcel evidence", "tax evidence", "flood and GIS limitations", "market evidence boundaries"],
    approvedSourceHierarchy: ["official county records", "official GIS", "official FEMA evidence", "licensed market data", "seller-reported information"],
    regionalSpecialization: "Oklahoma County, Oklahoma",
    prohibitedConclusions: ["invented ownership", "cross-property evidence", "appraisal", "title opinion", "tax or legal advice"],
    assessmentCases: ["ambiguous parcel", "conflicting ownership source", "stale flood evidence", "unlicensed comparable"],
    proficiencyRubric: ["resolve canonical identity", "preserve jurisdiction", "label seller-reported claims", "reject unsupported value conclusions"],
    knowledgeFreshness: "Source-specific freshness and jurisdiction rules apply to every admitted property fact.",
    recertificationTriggers: ["county source change", "property schema change", "licensing change", "cross-property defect"],
    providerAuthorityGranted: false,
    externalExecutionGranted: false,
  },
];

const commonPrivacy = ["tenant-scoped evidence", "aggregate marketing metrics only", "no credentials or raw provider payloads in client responses"];
const commonSecurity = ["least privilege", "feature flag", "audit evidence", "fail closed", "kill switch", "no provider writes"];

export const professionalToolchainContracts: ProfessionalToolchainContractV1[] = [
  {
    id: "seo-director-search-intelligence-toolchain",
    version: "1.0.0",
    title: "SEO Director Search Intelligence Toolchain",
    department: "Marketing Intelligence",
    businessModule: "ai-core",
    accountableProfessionalId: "senior-seo-director",
    independentReviewerId: "marketing-quality-reviewer",
    expertisePackIds: ["enterprise-evidence-governance", "search-market-intelligence"],
    competencyIds: ["evidence-qualified-analysis", "marketing-attribution-analysis"],
    sopIds: ["marketing-intelligence-evidence-to-decision-sop"],
    internalTools: ["website inventory", "knowledge platform", "internal experiment planner"],
    capabilities: [
      { connectorId: "google_search_console", capabilityKey: "seo.page.performance.read", qualificationId: "senior-seo-search-console-performance", operationClass: "read", runtimeState: "registered", required: true },
      { connectorId: "google_search_console", capabilityKey: "seo.query.performance.read", qualificationId: "senior-seo-search-console-query", operationClass: "read", runtimeState: "registered", required: true },
    ],
    deliverableIds: ["seo-growth-plan", "executive-seo-brief", "seo-optimization-plan"],
    evidenceRequirements: ["normalized search evidence", "source label", "observation cutoff", "query or page scope", "visible attribution limitation"],
    freshnessRequirement: "Report states the Search Console date range and snapshot observation cutoff.",
    privacyControls: commonPrivacy,
    securityControls: [...commonSecurity, "UEIP Preview runtime gateway"],
    licensingControls: ["Google API terms", "approved Search Console property"],
    safeFallback: "Use the latest stored normalized snapshot or return a data-gap report.",
    dataGapBehavior: "Do not infer rankings, traffic, conversions, or revenue.",
    supportedEnvironments: ["preview"],
    featureFlags: ["connector_live_reads", "connector_google", "ueip_gateway_enforcement", "ueip_search_console_runtime"],
    killSwitch: "ueip_search_console_runtime",
    expectedBusinessValue: { timeSaved: "Reduce manual search-performance review time.", riskReduced: "Prevent unsupported search and attribution claims.", revenueOpportunity: "Identify source-qualified seller-intent content opportunities.", measurableMetricIds: ["decision-ready-analysis-time", "unsupported-attribution-rate", "experiment-usefulness"] },
    approvedBusinessCase: true,
    readiness: "calibration",
    providerAuthorityGranted: false,
    externalExecutionGranted: false,
  },
  {
    id: "analytics-content-intelligence-toolchain",
    version: "1.0.0",
    title: "Analytics Content Intelligence Toolchain",
    department: "Marketing Intelligence",
    businessModule: "ai-core",
    accountableProfessionalId: "senior-analytics-specialist",
    independentReviewerId: "marketing-quality-reviewer",
    expertisePackIds: ["enterprise-evidence-governance", "search-market-intelligence"],
    competencyIds: ["evidence-qualified-analysis", "marketing-attribution-analysis"],
    sopIds: ["marketing-intelligence-evidence-to-decision-sop"],
    internalTools: ["website inventory", "knowledge platform", "internal content planner"],
    capabilities: [
      { connectorId: "google_search_console", capabilityKey: "seo.page.performance.read", qualificationId: "analytics-specialist-search-content", operationClass: "read", runtimeState: "registered", required: true },
      { connectorId: "google_analytics", capabilityKey: "ga4.traffic.read", qualificationId: "analytics-specialist-ga4-content", operationClass: "read", runtimeState: "staged", required: false },
    ],
    deliverableIds: ["content-opportunity-report", "measurement-limitations-brief"],
    evidenceRequirements: ["normalized page or query evidence", "business relevance", "approved website inventory", "attribution limitations"],
    freshnessRequirement: "Every report states the date range and does not imply freshness beyond its observation cutoff.",
    privacyControls: commonPrivacy,
    securityControls: commonSecurity,
    licensingControls: ["Google API terms", "aggregate analytics only"],
    safeFallback: "Use Search Console evidence alone and mark GA4 as a visible data gap.",
    dataGapBehavior: "Do not forecast traffic, conversions, or revenue from incomplete evidence.",
    supportedEnvironments: ["development", "preview"],
    featureFlags: ["connector_google", "executive_briefings"],
    killSwitch: "connector_live_reads",
    expectedBusinessValue: { timeSaved: "Reduce manual content-opportunity discovery time.", riskReduced: "Make attribution limits visible.", revenueOpportunity: "Prioritize evidence-backed content experiments.", measurableMetricIds: ["decision-ready-analysis-time", "attribution-completeness", "experiment-usefulness"] },
    approvedBusinessCase: true,
    readiness: "staged",
    providerAuthorityGranted: false,
    externalExecutionGranted: false,
  },
  {
    id: "content-strategist-search-demand-toolchain",
    version: "1.0.0",
    title: "Content Strategist Search Demand Toolchain",
    department: "Marketing Intelligence",
    businessModule: "ai-core",
    accountableProfessionalId: "content-intelligence-strategist",
    independentReviewerId: "marketing-quality-reviewer",
    expertisePackIds: ["enterprise-evidence-governance", "search-market-intelligence"],
    competencyIds: ["evidence-qualified-analysis", "marketing-attribution-analysis"],
    sopIds: ["marketing-intelligence-evidence-to-decision-sop"],
    internalTools: ["approved website inventory", "knowledge platform", "internal content planner"],
    capabilities: [{ connectorId: "google_search_console", capabilityKey: "seo.query.performance.read", qualificationId: "content-strategist-search-query", operationClass: "read", runtimeState: "registered", required: true }],
    deliverableIds: ["content-opportunity-portfolio"],
    evidenceRequirements: ["normalized bounded query evidence", "approved website inventory", "source labels", "visible attribution limits"],
    freshnessRequirement: "Every portfolio states its current and comparison observation windows.",
    privacyControls: commonPrivacy,
    securityControls: [...commonSecurity, "UEIP Preview runtime gateway"],
    licensingControls: ["Google API terms", "approved Search Console property"],
    safeFallback: "Use approved internal inventories and return a visible search-demand data gap.",
    dataGapBehavior: "Do not invent search demand, traffic, conversions, rankings, or revenue.",
    supportedEnvironments: ["preview"],
    featureFlags: ["ueip_gateway_enforcement", "ueip_search_console_runtime"],
    killSwitch: "ueip_search_console_runtime",
    expectedBusinessValue: { timeSaved: "Reduce manual content-demand research time.", riskReduced: "Prevent unsupported content and attribution claims.", revenueOpportunity: "Prioritize bounded content experiments without forecasting outcomes.", measurableMetricIds: ["decision-ready-analysis-time", "experiment-usefulness", "unsupported-attribution-rate"] },
    approvedBusinessCase: true,
    readiness: "calibration",
    providerAuthorityGranted: false,
    externalExecutionGranted: false,
  },
  {
    id: "local-visibility-intelligence-toolchain",
    version: "1.0.0",
    title: "Local Visibility Intelligence Toolchain",
    department: "Marketing Intelligence",
    businessModule: "ai-core",
    accountableProfessionalId: "local-visibility-specialist",
    independentReviewerId: "marketing-quality-reviewer",
    expertisePackIds: ["enterprise-evidence-governance", "search-market-intelligence"],
    competencyIds: ["evidence-qualified-analysis", "marketing-attribution-analysis"],
    sopIds: ["marketing-intelligence-evidence-to-decision-sop"],
    internalTools: ["approved business profile inventory", "knowledge platform", "local trust checklist"],
    capabilities: [{ connectorId: "google_business_profile", capabilityKey: "gbp.performance.read", qualificationId: "local-visibility-gbp-performance", operationClass: "read", runtimeState: "staged", required: true }],
    deliverableIds: ["local-visibility-report"],
    evidenceRequirements: ["normalized GBP evidence", "approved location identity", "observation cutoff", "profile and review data gaps"],
    freshnessRequirement: "Local visibility findings state the location and observation cutoff.",
    privacyControls: commonPrivacy,
    securityControls: commonSecurity,
    licensingControls: ["Google Business Profile API terms", "verified profile ownership"],
    safeFallback: "Return a local visibility data-gap report from approved stored profile evidence.",
    dataGapBehavior: "Never infer calls, searches, reviews, direction requests, rankings, or profile completeness.",
    supportedEnvironments: ["development", "preview"],
    featureFlags: ["connector_google", "executive_briefings"],
    killSwitch: "connector_live_reads",
    expectedBusinessValue: { timeSaved: "Reduce manual local-profile review time.", riskReduced: "Prevent invented local visibility and reputation claims.", revenueOpportunity: "Identify verified local trust and profile improvements.", measurableMetricIds: ["decision-ready-analysis-time", "connector-data-reliability", "unsupported-attribution-rate"] },
    approvedBusinessCase: true,
    readiness: "staged",
    providerAuthorityGranted: false,
    externalExecutionGranted: false,
  },
];

export const certificationWaveContracts: CertificationWaveContractV1[] = [
  { id: "wave-0-company-foundation", version: "1.0.0", wave: 0, title: "Company Foundation", objective: "Make every professional, toolchain, capability, deliverable, reviewer, and outcome traceable.", businessHypothesis: "Governed professional standards improve decision quality without expanding execution authority.", professionalIds: ["marketing-quality-reviewer"], toolchainIds: [], deliverableIds: [], prerequisites: ["AI Workforce", "Department OS", "EPC", "UEIP", "Approval / Safety"], calibrationMinimum: 10, blindValidationMinimum: 20, exitCriteria: ["no orphan registry references", "independent review enforced", "append-only evidence", "zero unauthorized actions"], lifecycle: "active", blockers: ["human cohort evidence not yet inferred"], humanPromotionRequired: true, providerAuthorityGranted: false, externalExecutionGranted: false },
  { id: "wave-1-search-market-intelligence", version: "1.0.0", wave: 1, title: "Search & Market Intelligence", objective: "Produce source-qualified search, content, and local visibility decisions.", businessHypothesis: "Read-only search evidence reduces research time and identifies useful growth experiments.", professionalIds: ["marketing-intelligence-director", "senior-seo-director", "senior-analytics-specialist", "search-performance-analyst", "local-visibility-specialist", "content-intelligence-strategist", "marketing-quality-reviewer"], toolchainIds: professionalToolchainContracts.map((toolchain) => toolchain.id), deliverableIds: ["seo-growth-plan", "executive-seo-brief", "local-visibility-report", "content-opportunity-portfolio", "measurement-limitations-brief", "monday-search-market-intelligence-packet"], prerequisites: ["wave-0-company-foundation", "Search Console Preview gateway", "independent marketing QA"], calibrationMinimum: 10, blindValidationMinimum: 20, exitCriteria: ["zero invented metrics", "zero unauthorized actions", "100% seeded critical defects detected", "at least 25% median time improvement", "at least 80% useful-or-better"], lifecycle: "active", blockers: ["GA4 runtime staged", "GBP runtime staged", "human validation evidence required"], humanPromotionRequired: true, providerAuthorityGranted: false, externalExecutionGranted: false },
  { id: "wave-2-property-intelligence", version: "1.0.0", wave: 2, title: "Property Intelligence", objective: "Produce identity-safe acquisition, neighborhood, ownership, market, and risk intelligence.", businessHypothesis: "Source-qualified property evidence improves acquisition decisions per CEO research hour.", professionalIds: ["property-records-gis-analyst", "market-valuation-analyst", "investment-acquisition-analyst", "property-intelligence-quality-reviewer"], toolchainIds: [], deliverableIds: ["acquisition-decision-brief"], prerequisites: ["Real Estate Business Module", "canonical property identity"], calibrationMinimum: 10, blindValidationMinimum: 20, exitCriteria: ["zero cross-property leakage", "zero invented property facts", "complete provenance"], lifecycle: "planned", blockers: ["source capability intake remains governed separately"], humanPromotionRequired: true, providerAuthorityGranted: false, externalExecutionGranted: false },
  { id: "wave-3-creative-studio", version: "1.0.0", wave: 3, title: "Creative Studio", objective: "Prepare brand-safe campaign packages from approved internal briefs.", businessHypothesis: "Professional creative toolchains reduce production time without autonomous publishing.", professionalIds: ["creative-director-professional", "brand-strategist-professional", "copywriter-professional", "senior-designer-professional", "brand-asset-manager-professional", "creative-quality-reviewer"], toolchainIds: [], deliverableIds: ["creative-campaign-package"], prerequisites: ["approved internal Marketing or Revenue brief"], calibrationMinimum: 10, blindValidationMinimum: 20, exitCriteria: ["brand compliance", "rights completeness", "accessibility", "zero publishing violations"], lifecycle: "planned", blockers: ["toolchain definition and operational proof required"], humanPromotionRequired: true, providerAuthorityGranted: false, externalExecutionGranted: false },
  { id: "wave-4-revenue-operations", version: "1.0.0", wave: 4, title: "Revenue Operations", objective: "Prepare source-qualified pipeline, follow-up, meeting, and communication decisions.", businessHypothesis: "Read and prepare-only revenue toolchains improve follow-up readiness without unauthorized contact.", professionalIds: ["crm-manager-professional", "pipeline-coordinator-professional", "senior-revenue-analyst", "revenue-quality-reviewer"], toolchainIds: [], deliverableIds: ["revenue-pipeline-decision-brief"], prerequisites: ["source-attributed CRM evidence", "contact-safety controls"], calibrationMinimum: 10, blindValidationMinimum: 20, exitCriteria: ["zero sends", "zero CRM mutations", "supported priority", "responsible human owner"], lifecycle: "planned", blockers: ["draft-only toolchain definition and proof required"], humanPromotionRequired: true, providerAuthorityGranted: false, externalExecutionGranted: false },
  ...[5, 6, 7, 8].map((wave) => ({ id: `wave-${wave}-${["finance-risk", "customer-experience", "product-engineering", "multi-business"][wave - 5]}`, version: "1.0.0" as const, wave, title: ["Finance, Forecasting & Risk", "Customer Experience & Reputation", "Product, Engineering & Reliability", "Multi-Business Expansion"][wave - 5], objective: "Define and validate the next governed professionalization stage.", businessHypothesis: "Expansion occurs only after demonstrated operating value and safety.", professionalIds: [], toolchainIds: [], deliverableIds: [], prerequisites: ["prior human promotion decision"], calibrationMinimum: 10, blindValidationMinimum: 20, exitCriteria: ["governed definitions", "independent QA", "verified outcomes"], lifecycle: "planned" as const, blockers: ["future architecture and business-case approval required"], humanPromotionRequired: true as const, providerAuthorityGranted: false as const, externalExecutionGranted: false as const })),
];

export type ConnectorIntakeEvidence = {
  activeCertifiedProfessionalIds: string[];
  activeCertificationScopes: Array<{ professionalId: string; competencyId: string; deliverableId: string }>;
  activeQualificationIds: string[];
  securityApprovedConnectorIds: string[];
  businessCaseApprovedToolchainIds?: string[];
  calibrationByToolchainId?: Record<string, { calibrationCases: number; blindValidationCases: number; allSeededCriticalDefectsDetected: boolean; zeroUnauthorizedActions: boolean; humanPromotionApproved: boolean }>;
};

export function createConnectorIntakeEvidenceFromRecords(records: {
  certifications: Array<{ professionalId: string; competencyId: string; deliverableId: string; state: string; expiresAt?: Date | string | null; createdAt?: Date | string }>;
  governance: Array<{ eventType: string; subjectId: string; sanitizedData: unknown; createdAt?: Date | string }>;
}, now = new Date()): ConnectorIntakeEvidence {
  const latestCertificationState = new Map<string, { state: string; expiresAt: Date | string | null | undefined }>();
  for (const record of records.certifications) {
    const key = `${record.professionalId}:${record.competencyId}:${record.deliverableId}`;
    if (!latestCertificationState.has(key)) latestCertificationState.set(key, { state: record.state, expiresAt: record.expiresAt });
  }
  const activeCertifiedProfessionalIds = [...new Set(records.certifications.filter((record) => {
    const latest = latestCertificationState.get(`${record.professionalId}:${record.competencyId}:${record.deliverableId}`);
    if (latest?.state !== "certified_internal") return false;
    if (!latest.expiresAt) return true;
    return new Date(latest.expiresAt).getTime() > now.getTime();
  }).map((record) => record.professionalId))];
  const activeCertificationScopes = records.certifications.filter((record) => {
    const latest = latestCertificationState.get(`${record.professionalId}:${record.competencyId}:${record.deliverableId}`);
    if (latest?.state !== "certified_internal") return false;
    return !latest.expiresAt || new Date(latest.expiresAt).getTime() > now.getTime();
  }).map((record) => ({ professionalId: record.professionalId, competencyId: record.competencyId, deliverableId: record.deliverableId }));
  const activeQualificationIds: string[] = [];
  const securityApprovedConnectorIds: string[] = [];
  for (const event of records.governance) {
    if (!event.sanitizedData || typeof event.sanitizedData !== "object" || Array.isArray(event.sanitizedData)) continue;
    const data = event.sanitizedData as Record<string, unknown>;
    if (event.eventType === "professional_capability_qualified" && typeof data.qualificationId === "string") activeQualificationIds.push(data.qualificationId);
    if (event.eventType === "connector_security_review_approved" && typeof data.connectorId === "string") securityApprovedConnectorIds.push(data.connectorId);
  }
  return { activeCertifiedProfessionalIds, activeCertificationScopes, activeQualificationIds: [...new Set(activeQualificationIds)], securityApprovedConnectorIds: [...new Set(securityApprovedConnectorIds)] };
}

export function evaluateConnectorIntake(toolchainId: string, connectorId: string, evidence: ConnectorIntakeEvidence): ConnectorIntakeDecisionV1 {
  const toolchain = professionalToolchainContracts.find((item) => item.id === toolchainId);
  const capabilities = toolchain?.capabilities.filter((item) => item.connectorId === connectorId) ?? [];
  const qualificationIds = capabilities.map((item) => item.qualificationId);
  const base = {
    toolchainId,
    connectorId,
    professionalId: toolchain?.accountableProfessionalId ?? "unassigned",
    qualificationIds,
    deliverableIds: toolchain?.deliverableIds ?? [],
    measurableMetricIds: toolchain?.expectedBusinessValue.measurableMetricIds ?? [],
    connectorActivated: false as const,
    providerAuthorityGranted: false as const,
    externalExecutionGranted: false as const,
  };
  const decision = (status: ConnectorIntakeStatus, reasons: string[], nextSafeAction: string): ConnectorIntakeDecisionV1 => ({ ...base, status, eligible: status === "ready_for_governed_enablement", reasons, nextSafeAction });

  if (!toolchain || capabilities.length === 0) return decision("ineligible", ["No professional toolchain owns this connector capability."], "Define a governed toolchain, accountable professional, independent reviewer, and deliverable before intake.");
  const businessCaseApproved = evidence.businessCaseApprovedToolchainIds?.includes(toolchainId) ?? toolchain.approvedBusinessCase;
  if (!businessCaseApproved || toolchain.expectedBusinessValue.measurableMetricIds.length === 0) return decision("business_case_required", ["An approved measurable business case is required."], "Record the expected time, risk, or revenue metric and obtain business-case approval.");
  const scopedCertificationReady = capabilities.every((capability) => {
    const qualification = professionalCapabilityQualifications.find((item) => item.id === capability.qualificationId);
    return Boolean(qualification) && evidence.activeCertificationScopes.some((scope) => scope.professionalId === toolchain.accountableProfessionalId && scope.competencyId === qualification?.requiredCompetencyId && toolchain.deliverableIds.includes(scope.deliverableId));
  });
  if (!evidence.activeCertifiedProfessionalIds.includes(toolchain.accountableProfessionalId) || !scopedCertificationReady || !evidence.activeQualificationIds.some((id) => qualificationIds.includes(id))) return decision("professional_certification_required", ["The accountable professional needs active competency, deliverable, and capability-scoped certification evidence."], "Complete assessment, internal certification, and exact-capability qualification; do not activate the connector.");

  const manifests = listUniversalConnectorManifests();
  const manifest = manifests.find((item) => item.connectorId === connectorId);
  const unregistered = capabilities.filter((capability) => {
    const qualification = professionalCapabilityQualifications.find((item) => item.id === capability.qualificationId && item.connectorId === connectorId && item.capabilityKey === capability.capabilityKey);
    return capability.runtimeState !== "registered" || qualification?.registrationState !== "registered" || !manifest;
  });
  if (unregistered.length > 0) return decision("capability_registration_required", unregistered.map((item) => `${item.capabilityKey} is staged or absent from the UEIP manifest.`), "Complete UEIP capability registration, normalized evidence, policy, audit, and runtime review.");
  if (!evidence.securityApprovedConnectorIds.includes(connectorId)) return decision("security_review_required", ["Security, privacy, scope, credential, audit, and kill-switch review is not evidenced."], "Complete the independent connector security and privacy review.");

  const proof = evidence.calibrationByToolchainId?.[toolchainId];
  if (!proof || proof.calibrationCases < 10 || proof.blindValidationCases < 20 || !proof.allSeededCriticalDefectsDetected || !proof.zeroUnauthorizedActions || !proof.humanPromotionApproved) return decision("calibration_only", ["Operational proof and a human promotion decision are incomplete."], "Run at least 10 calibration and 20 blind-validation cases, detect every seeded critical defect, record zero unauthorized actions, and request human promotion review.");
  return decision("ready_for_governed_enablement", ["Professional, capability, business-case, security, and proof prerequisites are evidenced."], "Submit a separate governed enablement proposal; this decision did not activate the connector.");
}

function snapshotEvidence(snapshot: BusinessDataSnapshotRecord, evidenceId: string): GovernedEvidenceItemV1 {
  const observedAt = typeof snapshot.snapshotDate === "string" ? snapshot.snapshotDate : snapshot.snapshotDate.toISOString();
  const available = snapshot.status === "fresh" || snapshot.status === "partial" || snapshot.status === "stale";
  return {
    evidenceId,
    sourceReference: snapshot.sourceLabel || `normalized:${snapshot.connectorId}:${snapshot.category}`,
    observedAt: available ? observedAt : null,
    confidence: snapshot.status === "fresh" ? 90 : snapshot.status === "partial" ? 65 : snapshot.status === "stale" ? 45 : 0,
    verificationState: snapshot.status === "fresh" ? "verified" : available ? "partially_verified" : "unavailable",
    claim: available ? snapshot.summary : `No verified ${snapshot.connectorId} evidence is available.`,
    sensitivity: "internal",
    permittedUse: "internal_executive_review_only",
    conflicts: [],
  };
}

function missingSnapshotEvidence(connectorId: string, category: string, observationCutoff: string): GovernedEvidenceItemV1 {
  return { evidenceId: `data-gap:${connectorId}:${category}`, sourceReference: `data-gap:${connectorId}:${category}`, observedAt: null, confidence: 0, verificationState: "unavailable", claim: `No verified ${connectorId} ${category} snapshot is available as of ${observationCutoff}.`, sensitivity: "internal", permittedUse: "internal_executive_review_only", conflicts: [] };
}

export type WaveOneReportBundleV1 = ReturnType<typeof createWaveOneIntelligenceReports>;

export function createWaveOneIntelligenceReports(input: {
  tenantId: string;
  inputSnapshotVersion: string;
  observationCutoff: string;
  snapshots: BusinessDataSnapshotRecord[];
  activeCertifiedProfessionalIds?: string[];
  activeQualificationIds?: string[];
}) {
  const certified = new Set(input.activeCertifiedProfessionalIds ?? []);
  const qualified = new Set(input.activeQualificationIds ?? []);
  const find = (connectorId: string, categories: string[]) => input.snapshots.find((snapshot) => snapshot.connectorId === connectorId && categories.includes(snapshot.category));
  const gsc = find("google_search_console", ["search_console_performance", "search_console_indexing"]);
  const ga4 = find("google_analytics", ["google_analytics_traffic"]);
  const gbp = find("google_business_profile", ["google_business_profile_performance", "google_business_profile_reviews"]);
  const gscEvidence = gsc ? snapshotEvidence(gsc, "wave1:gsc") : missingSnapshotEvidence("google_search_console", "performance", input.observationCutoff);
  const ga4Evidence = ga4 ? snapshotEvidence(ga4, "wave1:ga4") : missingSnapshotEvidence("google_analytics", "traffic", input.observationCutoff);
  const gbpEvidence = gbp ? snapshotEvidence(gbp, "wave1:gbp") : missingSnapshotEvidence("google_business_profile", "performance", input.observationCutoff);

  const build = (definition: { deliverableId: string; generatorProfessionalId: string; accountableOwner: string; evidence: GovernedEvidenceItemV1[]; requiredEvidence: GovernedEvidenceItemV1[]; qualificationIds: string[]; question: string; expectedValue: string; decision: string }) => {
    const missingData = definition.evidence.filter((item) => item.verificationState === "unavailable").map((item) => item.claim);
    const deliverable = createGovernedProfessionalDeliverable({ deliverableId: definition.deliverableId, tenantId: input.tenantId, businessQuestion: definition.question, accountableOwner: definition.accountableOwner, inputSnapshotVersion: input.inputSnapshotVersion, observationCutoff: input.observationCutoff, evidence: definition.evidence, assumptions: ["No traffic, ranking, conversion, or revenue outcome is forecast from incomplete evidence."], missingData, expectedBusinessValue: definition.expectedValue, recommendedManualDecision: definition.decision, generatorProfessionalId: definition.generatorProfessionalId, reviewerProfessionalId: "marketing-quality-reviewer" });
    const evidenceReady = definition.requiredEvidence.every((item) => item.verificationState === "verified" || item.verificationState === "partially_verified");
    const certificationReady = certified.has(definition.generatorProfessionalId) && certified.has("marketing-quality-reviewer") && definition.qualificationIds.every((id) => qualified.has(id));
    return { ...deliverable, evidenceReadiness: evidenceReady ? "evidence_available" as const : "partial_data_gap" as const, certificationReadiness: certificationReady ? "eligible" as const : "calibration_only" as const, executiveUseEligible: evidenceReady && certificationReady && deliverable.qa.status === "ready_for_internal_executive_review", providerCalledByReportAssembly: false as const };
  };

  const reports = [
    build({ deliverableId: "executive-seo-brief", generatorProfessionalId: "senior-seo-director", accountableOwner: "Senior SEO Director", evidence: [gscEvidence], requiredEvidence: [gscEvidence], qualificationIds: ["senior-seo-search-console-performance"], question: "Which verified search signals deserve the CEO's manual attention?", expectedValue: "Reduce search-performance research time and unsupported SEO prioritization.", decision: "Review the highest-value source-qualified SEO opportunity; do not publish or change the website from this brief." }),
    build({ deliverableId: "local-visibility-report", generatorProfessionalId: "local-visibility-specialist", accountableOwner: "Local Visibility Specialist", evidence: [gbpEvidence], requiredEvidence: [gbpEvidence], qualificationIds: ["local-visibility-gbp-performance"], question: "Which verified local visibility gaps deserve manual review?", expectedValue: "Reduce local-profile review time without inventing GBP performance or reputation facts.", decision: "Request verified GBP evidence when missing; any profile change requires a separate governed proposal." }),
    build({ deliverableId: "content-opportunity-report", generatorProfessionalId: "senior-analytics-specialist", accountableOwner: "Senior Analytics Specialist", evidence: [gscEvidence, ga4Evidence], requiredEvidence: [gscEvidence], qualificationIds: ["analytics-specialist-search-content"], question: "Which source-qualified content opportunity merits a bounded experiment?", expectedValue: "Reduce content research time while preserving attribution limitations.", decision: "Review a source-qualified content experiment; do not forecast traffic or revenue and do not publish." }),
  ];

  return {
    schemaVersion: "wave-one-intelligence-bundle-v1" as const,
    tenantId: input.tenantId,
    inputSnapshotVersion: input.inputSnapshotVersion,
    observationCutoff: input.observationCutoff,
    reports,
    summary: { total: reports.length, executiveUseEligible: reports.filter((report) => report.executiveUseEligible).length, partialDataGap: reports.filter((report) => report.evidenceReadiness === "partial_data_gap").length, calibrationOnly: reports.filter((report) => report.certificationReadiness === "calibration_only").length },
    dataGaps: [...new Set(reports.flatMap((report) => report.missingData))],
    learningAuthority: "recommend_versioned_changes_only" as const,
    providerCalled: input.snapshots.some((snapshot) => snapshot.providerCalled),
    reportAssemblyProviderCalled: false as const,
    liveExecutionAllowed: false as const,
    externalWritesAllowed: false as const,
  };
}

export function assertValidProfessionalToolchainRegistry() {
  const expertiseIds = new Set(professionalExpertisePacks.map((pack) => pack.id));
  const profileIds = new Set(professionalProfileContracts.map((profile) => profile.professionalId));
  const deliverableIds = new Set(professionalDeliverableContracts.map((deliverable) => deliverable.id));
  const qualificationIds = new Set(professionalCapabilityQualifications.map((qualification) => qualification.id));
  const reviewerIds = new Set(professionalProfileContracts.filter((profile) => profile.title.includes("Reviewer")).map((profile) => profile.professionalId));
  const toolchainIds = new Set<string>();
  const manifests = new Map(listUniversalConnectorManifests().map((manifest) => [manifest.connectorId, manifest]));

  for (const toolchain of professionalToolchainContracts) {
    if (toolchainIds.has(toolchain.id)) throw new Error(`duplicate_toolchain:${toolchain.id}`);
    toolchainIds.add(toolchain.id);
    if (!profileIds.has(toolchain.accountableProfessionalId)) throw new Error(`unknown_toolchain_professional:${toolchain.id}`);
    if (!reviewerIds.has(toolchain.independentReviewerId) || toolchain.independentReviewerId === toolchain.accountableProfessionalId) throw new Error(`invalid_independent_reviewer:${toolchain.id}`);
    if (!toolchain.expertisePackIds.every((id) => expertiseIds.has(id))) throw new Error(`unknown_expertise_pack:${toolchain.id}`);
    if (!toolchain.deliverableIds.every((id) => deliverableIds.has(id))) throw new Error(`unknown_toolchain_deliverable:${toolchain.id}`);
    if (!toolchain.capabilities.every((capability) => qualificationIds.has(capability.qualificationId))) throw new Error(`unknown_capability_qualification:${toolchain.id}`);
    for (const capability of toolchain.capabilities) {
      const qualification = professionalCapabilityQualifications.find((item) => item.id === capability.qualificationId);
      if (!qualification || qualification.professionalId !== toolchain.accountableProfessionalId || qualification.connectorId !== capability.connectorId || qualification.capabilityKey !== capability.capabilityKey) {
        throw new Error(`toolchain_qualification_scope_mismatch:${toolchain.id}:${capability.qualificationId}`);
      }
      if (capability.runtimeState === "registered") {
        const manifest = manifests.get(capability.connectorId);
        if (!manifest?.capabilities.some((item) => item.capabilityKey === capability.capabilityKey)) {
          throw new Error(`registered_ueip_capability_missing:${toolchain.id}:${capability.connectorId}:${capability.capabilityKey}`);
        }
        if (qualification.registrationState !== "registered") throw new Error(`registered_qualification_required:${toolchain.id}:${capability.qualificationId}`);
      }
    }
    if (toolchain.expectedBusinessValue.measurableMetricIds.length === 0) throw new Error(`unmeasurable_toolchain_value:${toolchain.id}`);
    if (toolchain.providerAuthorityGranted || toolchain.externalExecutionGranted) throw new Error(`toolchain_authority_boundary:${toolchain.id}`);
  }
  for (const wave of certificationWaveContracts) if (!wave.toolchainIds.every((id) => toolchainIds.has(id))) throw new Error(`unknown_wave_toolchain:${wave.id}`);
  return true;
}

export function createProfessionalToolchainsReport(evidence: ConnectorIntakeEvidence = { activeCertifiedProfessionalIds: [], activeCertificationScopes: [], activeQualificationIds: [], securityApprovedConnectorIds: [] }) {
  assertValidProfessionalToolchainRegistry();
  const intakeDecisions = professionalToolchainContracts.flatMap((toolchain) => [...new Set(toolchain.capabilities.map((capability) => capability.connectorId))].map((connectorId) => evaluateConnectorIntake(toolchain.id, connectorId, evidence)));
  return {
    initiative: "J Capital AI Operating Company — Professional Toolchains",
    company: "J Capital Property Group",
    operatingChain: "CEO Objective -> AI COO Case -> Department Mandate -> Professional Assignment -> Expertise + Toolchain -> Evidence -> Deliverable -> Independent QA -> CEO Decision -> Approved Action -> Verified Outcome -> Institutional Learning",
    controlUnits: professionalControlUnits,
    departments: operatingCompanyDepartmentRoadmap,
    expertisePacks: professionalExpertisePacks,
    toolchains: professionalToolchainContracts,
    certificationWaves: certificationWaveContracts,
    intakeDecisions,
    summary: { activeWaves: certificationWaveContracts.filter((wave) => wave.lifecycle === "active").length, professionals: new Set(certificationWaveContracts.flatMap((wave) => wave.professionalIds)).size, toolchains: professionalToolchainContracts.length, governedDeliverables: new Set(professionalToolchainContracts.flatMap((toolchain) => toolchain.deliverableIds)).size, enablementReady: intakeDecisions.filter((decision) => decision.eligible).length },
    safety: { advisoryOnly: true as const, humanReviewRequired: true as const, providerAuthorityGranted: false as const, connectorActivationAllowed: false as const, liveExecutionAllowed: false as const, externalWritesAllowed: false as const, autonomousLearningAllowed: false as const },
  };
}
