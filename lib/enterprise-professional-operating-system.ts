import { aiWorkforceEmployees } from "@/lib/ai-workforce";
import { listUniversalConnectorManifests } from "@/lib/universal-enterprise-integration-platform";

export const professionalDepartments = ["Property Intelligence", "Revenue Operations", "Marketing Intelligence", "Finance and Executive Analytics", "Creative Studio"] as const;
export type ProfessionalDepartment = (typeof professionalDepartments)[number];
export type CompanyOrgUnitKind = "command" | "control" | "operating";
export type CompanyOrgUnitV1 = {
  id: string;
  name: string;
  kind: CompanyOrgUnitKind;
  legacyAliases: readonly string[];
};

export const companyOrgUnitRegistry = [
  { id: "executive-command", name: "Executive Command", kind: "command", legacyAliases: ["CEO Office"] },
  { id: "ai-coo-company-operations", name: "AI COO and Company Operations", kind: "command", legacyAliases: ["AI COO", "Operations"] },
  { id: "professional-standards-independent-qa", name: "Professional Standards and Independent QA", kind: "control", legacyAliases: ["Professional Standards & QA"] },
  { id: "knowledge-evidence-learning", name: "Knowledge, Evidence, and Learning", kind: "control", legacyAliases: ["Knowledge / Memory", "Data, Knowledge & Learning"] },
  { id: "integration-operations", name: "Integration Operations", kind: "control", legacyAliases: [] },
  { id: "security-privacy-approval-risk", name: "Security, Privacy, Approval, and Risk", kind: "control", legacyAliases: ["Approval / Safety", "Security & Privacy"] },
  { id: "search-market-intelligence", name: "Search and Market Intelligence", kind: "operating", legacyAliases: ["Marketing Intelligence", "SEO"] },
  { id: "property-intelligence", name: "Property Intelligence", kind: "operating", legacyAliases: ["County Intelligence", "Acquisitions"] },
  { id: "sales-revenue-operations", name: "Sales and Revenue Operations", kind: "operating", legacyAliases: ["Revenue Operations", "Seller Acquisition", "CRM"] },
  { id: "marketing-growth", name: "Marketing and Growth", kind: "operating", legacyAliases: ["Marketing", "Content", "Social Media", "Lead Generation"] },
  { id: "creative-design-studio", name: "Creative and Design Studio", kind: "operating", legacyAliases: ["Creative Studio", "Design"] },
  { id: "finance-executive-analytics", name: "Finance and Executive Analytics", kind: "operating", legacyAliases: ["Finance & Executive Analytics", "Finance"] },
  { id: "customer-experience-reputation", name: "Customer Experience and Reputation", kind: "operating", legacyAliases: [] },
  { id: "product-engineering-reliability", name: "Product, Engineering, and Reliability", kind: "operating", legacyAliases: [] },
] as const satisfies readonly CompanyOrgUnitV1[];

const orgUnitByLabel = new Map(companyOrgUnitRegistry.flatMap((unit) => [unit.name, ...unit.legacyAliases].map((label) => [label.toLowerCase(), unit] as const)));

export function resolveCanonicalCompanyOrgUnit(value: string): CompanyOrgUnitV1 | null {
  return orgUnitByLabel.get(value.trim().toLowerCase()) ?? null;
}
export type ProfessionalLevel = "associate" | "professional" | "senior" | "principal" | "executive";
export type ProfessionalProficiency = "working" | "advanced" | "reviewer" | "principal";
export type ProfessionalLifecycleState = "candidate" | "training" | "assessment_required" | "certified_internal" | "pilot_validated" | "operationally_proven" | "suspended" | "remediation_required" | "reassessment_required" | "recertified" | "expired" | "retired";
export type DefinitionLifecycle = "draft" | "approved" | "active" | "superseded" | "suspended" | "retired";
export type CompetencyLayer = "enterprise_core" | "functional" | "industry";

type DefinitionEnvelopeV1 = {
  id: string;
  version: string;
  owner: string;
  approvingAuthority: "Professional Standards / Approval Safety";
  lifecycle: DefinitionLifecycle;
  applicableDepartments: ProfessionalDepartment[];
  applicableBusinessModules: string[];
  dependencyIds: string[];
  effectiveAt: string;
  supersedes: string | null;
};

export type ProfessionalCompetencyContractV1 = DefinitionEnvelopeV1 & {
  layer: CompetencyLayer;
  purpose: string;
  businessOutcome: string;
  proficiencyCriteria: Record<ProfessionalProficiency, string[]>;
  assessmentMethod: string;
  acceptableEvidence: string[];
  kpiIds: string[];
  suspensionTriggers: string[];
  recertificationTriggers: string[];
  humanReviewRequired: true;
};

export type ProfessionalSopContractV1 = DefinitionEnvelopeV1 & {
  title: string;
  inputs: string[];
  steps: string[];
  outputs: string[];
  evidenceContractIds: string[];
  controls: string[];
  handoffs: string[];
  exceptionEscalation: string;
  prohibitedSteps: string[];
  materialChangeRequiresRecertification: true;
};

export type ProfessionalEvidenceContractV1 = DefinitionEnvelopeV1 & {
  provenanceRequired: true;
  freshnessRequired: true;
  confidenceRequired: true;
  assumptionsLabeled: true;
  conflictsVisible: true;
  missingDataVisible: true;
  sensitivityRequired: true;
  permittedUseRequired: true;
  rawProviderPayloadAllowed: false;
};

export type ProfessionalQaContractV1 = DefinitionEnvelopeV1 & {
  checks: string[];
  blockingDefects: string[];
  acceptanceThreshold: "all_critical_checks_pass";
  independentReviewerRequired: true;
  threeLinesOfDefense: true;
  humanOverrideRequiresAudit: true;
  prohibitedAuthorityOverrideAllowed: false;
  remediationRequiredOnFailure: true;
};

export type ProfessionalDeliverableContractV1 = DefinitionEnvelopeV1 & {
  department: ProfessionalDepartment;
  title: string;
  executiveConsumer: string;
  accountableOwnerRole: string;
  independentReviewerRole: string;
  purpose: string;
  schemaVersion: "1.0.0";
  requiredSections: string[];
  evidenceContractId: string;
  qaContractId: string;
  serviceLevel: string;
  acceptanceCriteria: string[];
  advisoryOnly: true;
  humanReviewRequired: true;
  providerAuthorityGranted: false;
  externalExecutionGranted: false;
};

export type BalancedScorecardMetricV1 = {
  id: string;
  category: "quality" | "speed" | "financial_value" | "risk" | "stakeholder_value";
  measure: string;
  direction: "increase" | "decrease";
  outcomeEvidenceRequired: true;
};

export type ProfessionalCapabilityQualificationV1 = {
  id: string;
  version: "1.0.0";
  professionalId: string;
  profileVersion: "1.0.0";
  connectorId: string;
  capabilityKey: string;
  capabilityVersion: "1.0.0";
  operationClass: "read" | "prepare";
  requiredCompetencyId: string;
  requiredProficiency: ProfessionalProficiency;
  approvedEvidenceType: string;
  assessmentRequired: true;
  expiresAfter: string;
  deliverableIds: string[];
  permittedEnvironments: Array<"development" | "preview" | "production">;
  permittedUse: "normalized_internal_evidence_only";
  registrationState: "registered" | "planned";
  providerAuthorityGranted: false;
  externalExecutionGranted: false;
};

export type ProfessionalProfileContractV1 = DefinitionEnvelopeV1 & {
  professionalId: string;
  authoritativeWorkforceIds: string[];
  jobFamily: string;
  department: ProfessionalDepartment;
  businessModule: string;
  title: string;
  level: ProfessionalLevel;
  manager: string;
  executiveSponsor: string;
  rolePurpose: string;
  businessOutcome: string;
  decisionRights: string[];
  accountabilities: string[];
  primaryDeliverableId: string;
  supportingDeliverableIds: string[];
  competencyRequirements: Array<{ competencyId: string; requiredProficiency: ProfessionalProficiency }>;
  sopIds: string[];
  qaObligations: string[];
  scorecardMetricIds: string[];
  capabilityQualificationIds: string[];
  prohibitedActivities: string[];
  escalationPaths: string[];
  workloadLimit: string;
  reviewerSeparationRequired: true;
  lifecycleState: ProfessionalLifecycleState;
  successionCoverage: string[];
  expertisePackIds: string[];
  internalToolIds: string[];
  requiredCollaboratorIds: string[];
  handoffContracts: Array<{ target: string; requiredInput: string; expectedOutput: string }>;
  safeFallback: string;
  readinessDimensions: {
    professionalExpertise: "assessment_required";
    deliverableCertification: "assessment_required";
    collaborationCertification: "assessment_required";
    capabilityQualification: "not_qualified";
    tenantConnectorEnablement: "not_enabled";
    externalExecutionAuthorization: "blocked";
  };
  titleDoesNotImplyHumanLicensure: true;
  providerAuthorityGranted: false;
  externalExecutionGranted: false;
};

export type ProfessionalPromotionContractV1 = DefinitionEnvelopeV1 & {
  department: ProfessionalDepartment;
  predecessorDepartment: ProfessionalDepartment | null;
  calibrationMinimum: 10;
  blindValidationMinimum: 20;
  minimumMedianTimeImprovementPercent: 25;
  minimumUsefulOrBetterPercent: 80;
  maximumInventedFacts: 0;
  maximumUnauthorizedActions: 0;
  allSeededCriticalDefectsDetected: true;
  harmfulErrorMustNotIncrease: true;
  requiredOutcomeEvidence: string[];
  passedStage: "pilot_validated";
  automaticPromotionAllowed: false;
};

const effectiveAt = "2026-07-12T00:00:00.000Z";
const enterpriseDepartments = [...professionalDepartments];
const envelope = (id: string, owner: string, departments: ProfessionalDepartment[], modules = ["ai-core"]): DefinitionEnvelopeV1 => ({ id, version: "1.0.0", owner, approvingAuthority: "Professional Standards / Approval Safety", lifecycle: "active", applicableDepartments: departments, applicableBusinessModules: modules, dependencyIds: [], effectiveAt, supersedes: null });
const proficiency = (subject: string): Record<ProfessionalProficiency, string[]> => ({ working: [`Performs bounded ${subject} under review.`], advanced: [`Prepares scoped ${subject} independently with visible evidence.`], reviewer: [`Detects critical defects in ${subject} and blocks unsafe output.`], principal: [`Designs standards for ${subject} and recommends versioned changes without autonomous modification.`] });

const coreCompetencies: ProfessionalCompetencyContractV1[] = [
  ["evidence-qualified-analysis", "Evidence-qualified analysis", "Reduce unsupported executive claims."], ["structured-problem-solving", "Structured problem solving", "Improve repeatable decision quality."], ["executive-communication", "Executive communication", "Reduce executive interpretation time."], ["independent-quality-review", "Independent quality review", "Prevent unsafe or misleading deliverables."], ["risk-identification", "Risk identification", "Expose material risk before decisions."], ["data-privacy-security", "Data privacy and security", "Protect sensitive business information."], ["authority-bound-judgment", "Ethical and authority-bound judgment", "Prevent unauthorized execution."],
].map(([id, purpose, outcome]) => ({ ...envelope(id, "Professional Standards", enterpriseDepartments), layer: "enterprise_core", purpose, businessOutcome: outcome, proficiencyCriteria: proficiency(purpose.toLowerCase()), assessmentMethod: "seeded evidence, judgment, and authority-boundary evaluation", acceptableEvidence: ["versioned assessment result", "independent reviewer record"], kpiIds: ["quality", "risk", "stakeholder-usefulness"], suspensionTriggers: ["invented fact", "hidden evidence conflict", "prohibited execution"], recertificationTriggers: ["material SOP change", "rubric change", "deliverable schema change"], humanReviewRequired: true }));

const functionalSpecs: Array<[string, ProfessionalDepartment, string]> = [
  ["revenue-pipeline-analysis", "Revenue Operations", "Pipeline integrity, freshness, exception, buyer-demand, and revenue-delay analysis."],
  ["marketing-attribution-analysis", "Marketing Intelligence", "Attribution, search performance, connector-health, and experiment analysis."],
  ["financial-reconciliation-analysis", "Finance and Executive Analytics", "Source reconciliation, variance, unit economics, scenario, and uncertainty analysis."],
  ["creative-brand-production", "Creative Studio", "Brief, claims, brand, rights, accessibility, reputation, and publishing-readiness analysis."],
];
const functionalCompetencies: ProfessionalCompetencyContractV1[] = functionalSpecs.map(([id, department, purpose]) => ({ ...envelope(id, department, [department]), layer: "functional", purpose, businessOutcome: `Improve ${department} decision quality.`, proficiencyCriteria: proficiency(purpose), assessmentMethod: "department-specific blind case and seeded defect evaluation", acceptableEvidence: ["versioned assessment result", "independent QA evidence"], kpiIds: [`${id}-quality`, `${id}-time`, `${id}-usefulness`], suspensionTriggers: ["critical QA failure", "unsupported claim", "prohibited execution"], recertificationTriggers: ["material method change", "data contract change", "quality threshold failure"], humanReviewRequired: true }));

const industryCompetencies: ProfessionalCompetencyContractV1[] = ["property-identity-analysis", "acquisition-analysis", "county-record-analysis", "valuation-boundary", "seller-context-analysis", "buyer-demand-interpretation"].map((id) => ({ ...envelope(id, "Property Intelligence", ["Property Intelligence"], ["real-estate"]), layer: "industry", purpose: id.replaceAll("-", " "), businessOutcome: "Improve real-estate acquisition research without inventing property facts.", proficiencyCriteria: proficiency(id.replaceAll("-", " ")), assessmentMethod: "ambiguous property evidence and authority-boundary evaluation", acceptableEvidence: ["property cohort result", "independent QA evidence"], kpiIds: ["property-decision-quality"], suspensionTriggers: ["cross-property leakage", "invented property fact"], recertificationTriggers: ["property evidence schema change"], humanReviewRequired: true }));

export const professionalCompetencyContracts = [...coreCompetencies, ...functionalCompetencies, ...industryCompetencies];

export const professionalEvidenceContracts: ProfessionalEvidenceContractV1[] = [{ ...envelope("enterprise-professional-evidence", "Professional Standards", enterpriseDepartments, ["ai-core", "real-estate"]), provenanceRequired: true, freshnessRequired: true, confidenceRequired: true, assumptionsLabeled: true, conflictsVisible: true, missingDataVisible: true, sensitivityRequired: true, permittedUseRequired: true, rawProviderPayloadAllowed: false }];

const prohibited = ["provider calls", "external writes", "outreach", "publishing", "spending", "CRM mutation", "approval-as-execution", "autonomous execution"];
export const professionalSopContracts: ProfessionalSopContractV1[] = professionalDepartments.map((department) => ({ ...envelope(`${department.toLowerCase().replaceAll(" ", "-")}-evidence-to-decision-sop`, department, [department], department === "Property Intelligence" ? ["real-estate"] : ["ai-core"]), title: `${department} Evidence-to-Decision SOP`, inputs: ["versioned internal snapshot", "business question", "authorized evidence"], steps: ["resolve trusted context", "admit source-qualified evidence", "expose assumptions, gaps, and conflicts", "prepare advisory deliverable", "run generator completeness checks", "run independent functional QA", "escalate critical risk to Approval / Safety", "record human decision and verified outcome"], outputs: ["versioned executive advisory deliverable", "independent QA record", "outcome capture contract"], evidenceContractIds: ["enterprise-professional-evidence"], controls: ["tenant scope", "version validation", "reviewer separation", "human review"], handoffs: ["professional to independent reviewer", "reviewer to executive consumer"], exceptionEscalation: "Escalate unresolved evidence, authority, legal, financial, privacy, or reputation risk to Approval / Safety.", prohibitedSteps: prohibited, materialChangeRequiresRecertification: true }));

const departmentChecks: Record<ProfessionalDepartment, string[]> = {
  "Property Intelligence": ["canonical property identity", "no cross-property evidence", "valuation boundary"],
  "Revenue Operations": ["pipeline freshness", "supported priority", "responsible human owner", "no false urgency"],
  "Marketing Intelligence": ["attribution limitations", "connector-health visibility", "supported performance claims", "safe experiment"],
  "Finance and Executive Analytics": ["source reconciliation", "visible uncertainty", "supported scenario", "professional-advice boundary"],
  "Creative Studio": ["permitted claims", "rights metadata", "brand conformance", "accessibility", "reputation", "manual publishing boundary"],
};
export const professionalQaContracts: ProfessionalQaContractV1[] = professionalDepartments.map((department) => ({ ...envelope(`${department.toLowerCase().replaceAll(" ", "-")}-independent-qa`, "Approval / Safety", [department], department === "Property Intelligence" ? ["real-estate"] : ["ai-core"]), checks: ["claim provenance", "freshness", "assumption labels", "visible conflicts", "visible missing data", "generator completeness", "reviewer independence", "authority boundary", ...departmentChecks[department]], blockingDefects: ["invented fact", "missing material provenance", "self-review", "hidden critical conflict", "prohibited authority or execution"], acceptanceThreshold: "all_critical_checks_pass", independentReviewerRequired: true, threeLinesOfDefense: true, humanOverrideRequiresAudit: true, prohibitedAuthorityOverrideAllowed: false, remediationRequiredOnFailure: true }));

const commonSections = ["business question", "accountable owner", "input snapshot and observation cutoff", "executive summary", "source-qualified findings", "assumptions, conflicts, missing data, and uncertainty", "KPI impact and expected value", "risks and prohibited interpretations", "prioritized manual decision", "professional and definition versions", "independent QA", "human decision and outcome capture"];
const deliverableSpecs: Array<[string, ProfessionalDepartment, string, string, string]> = [
  ["acquisition-decision-brief", "Property Intelligence", "Acquisition Decision Brief", "Chief Property Intelligence Officer", "Property Intelligence Quality Reviewer"],
  ["revenue-pipeline-decision-brief", "Revenue Operations", "Revenue Pipeline Decision Brief", "Senior Revenue Analyst", "Independent Revenue Quality Reviewer"],
  ["marketing-performance-decision-brief", "Marketing Intelligence", "Marketing Performance Decision Brief", "Marketing Intelligence Director", "Independent Marketing Quality Reviewer"],
  ["seo-optimization-plan", "Marketing Intelligence", "SEO Optimization Plan", "Senior SEO Director", "Independent Marketing Quality Reviewer"],
  ["seo-growth-plan", "Marketing Intelligence", "SEO Growth Plan", "Senior SEO Director", "Independent Marketing Quality Reviewer"],
  ["executive-seo-brief", "Marketing Intelligence", "Executive SEO Brief", "Senior SEO Director", "Independent Marketing Quality Reviewer"],
  ["local-visibility-report", "Marketing Intelligence", "Local Visibility Report", "Local Visibility Specialist", "Independent Marketing Quality Reviewer"],
  ["content-opportunity-report", "Marketing Intelligence", "Content Opportunity Report", "Senior Analytics Specialist", "Independent Marketing Quality Reviewer"],
  ["content-opportunity-portfolio", "Marketing Intelligence", "Content Opportunity Portfolio", "Content Intelligence Strategist", "Independent Marketing Quality Reviewer"],
  ["measurement-limitations-brief", "Marketing Intelligence", "Measurement Limitations Brief", "Senior Analytics Specialist", "Independent Marketing Quality Reviewer"],
  ["monday-search-market-intelligence-packet", "Marketing Intelligence", "Monday Search and Market Intelligence Packet", "Marketing Intelligence Director", "Independent Marketing Quality Reviewer"],
  ["executive-financial-decision-brief", "Finance and Executive Analytics", "Executive Financial Decision Brief", "Finance Analytics Director", "Independent Financial Data Reviewer"],
  ["creative-campaign-package", "Creative Studio", "Creative Campaign Package", "Creative Director", "Independent Creative Quality Reviewer"],
];
export const professionalDeliverableContracts: ProfessionalDeliverableContractV1[] = deliverableSpecs.map(([id, department, title, owner, reviewer]) => ({ ...envelope(id, department, [department], department === "Property Intelligence" ? ["real-estate"] : ["ai-core"]), department, title, executiveConsumer: department === "Property Intelligence" || department === "Finance and Executive Analytics" ? "CEO" : "CEO / Department Director", accountableOwnerRole: owner, independentReviewerRole: reviewer, purpose: `Provide decision-ready ${department} analysis with visible evidence and uncertainty.`, schemaVersion: "1.0.0", requiredSections: commonSections, evidenceContractId: "enterprise-professional-evidence", qaContractId: `${department.toLowerCase().replaceAll(" ", "-")}-independent-qa`, serviceLevel: "Prepared from the supplied versioned snapshot; no freshness is implied beyond the observation cutoff.", acceptanceCriteria: ["all required sections present", "all material claims source-qualified or labeled assumptions", "all critical QA checks pass", "human review remains required"], advisoryOnly: true, humanReviewRequired: true, providerAuthorityGranted: false, externalExecutionGranted: false }));

const scorecardSpecs: Record<Exclude<ProfessionalDepartment, "Property Intelligence">, string[]> = {
  "Revenue Operations": ["pipeline-review-time", "stale-opportunity-detection", "false-priority-rate", "data-completeness", "forecast-calibration", "ceo-usefulness", "unauthorized-actions"],
  "Marketing Intelligence": ["decision-ready-analysis-time", "attribution-completeness", "unsupported-attribution-rate", "experiment-usefulness", "qualified-lead-impact", "connector-data-reliability", "brand-compliance-defects"],
  "Finance and Executive Analytics": ["reconciliation-time", "reconciliation-coverage", "material-variance-detection", "unsupported-financial-claims", "forecast-calibration", "decision-usefulness", "critical-qa-failures"],
  "Creative Studio": ["production-cycle-time", "revision-cycles", "first-review-acceptance", "brand-compliance", "accessibility-compliance", "rights-completeness", "unsupported-claims", "publishing-boundary-violations"],
};
export const professionalScorecardMetrics: Record<string, BalancedScorecardMetricV1[]> = Object.fromEntries(Object.entries(scorecardSpecs).map(([department, ids]) => [department, ids.map((id, index) => ({ id, category: (["speed", "quality", "risk", "financial_value", "stakeholder_value"] as const)[index % 5], measure: id.replaceAll("-", " "), direction: /time|rate|defect|failure|cycle|unauthorized|unsupported|violation/.test(id) ? "decrease" : "increase", outcomeEvidenceRequired: true }))]));

const workforceIds = new Set(aiWorkforceEmployees.map((employee) => employee.id));
const roleSpecs: Array<[ProfessionalDepartment, string, string, ProfessionalLevel, string[], string, string]> = [
  ["Property Intelligence", "chief-property-intelligence-officer", "Chief Property Intelligence Officer", "executive", ["county-records-analyst"], "property evidence is triaged into accountable, identity-safe professional work", "acquisition-decision-brief"],
  ["Property Intelligence", "dfd-virtual-property-scout", "DFD AI Virtual Property Scout", "professional", ["lead-research-analyst"], "source-attributed field observations become governed property research requests", "acquisition-decision-brief"],
  ["Property Intelligence", "property-records-gis-analyst", "Senior GIS and Property Research Analyst", "senior", ["property-signal-analyst"], "property identity and public-record evidence remain jurisdiction-safe", "acquisition-decision-brief"],
  ["Property Intelligence", "market-valuation-analyst", "Senior Market Analyst", "senior", ["offer-recommendation"], "market evidence and value ranges preserve appraisal and licensing boundaries", "acquisition-decision-brief"],
  ["Property Intelligence", "investment-acquisition-analyst", "Senior Acquisition Analyst", "senior", ["deal-analyst"], "acquisition priorities preserve evidence lineage and decision uncertainty", "acquisition-decision-brief"],
  ["Property Intelligence", "property-intelligence-quality-reviewer", "Independent Property Intelligence Reviewer", "senior", ["compliance-reviewer"], "cross-property, unsupported, and authority-violating conclusions are rejected", "acquisition-decision-brief"],
  ["Revenue Operations", "crm-manager-professional", "CRM Manager", "senior", ["crm-manager"], "pipeline records remain complete and source-qualified", "revenue-pipeline-decision-brief"],
  ["Revenue Operations", "pipeline-coordinator-professional", "Pipeline Coordinator", "professional", ["pipeline-coordinator"], "pipeline exceptions receive a responsible human owner", "revenue-pipeline-decision-brief"],
  ["Revenue Operations", "senior-revenue-analyst", "Senior Revenue Analyst", "senior", ["revenue-analyst"], "revenue delay and priority are explainable", "revenue-pipeline-decision-brief"],
  ["Revenue Operations", "revenue-quality-reviewer", "Independent Revenue Quality Reviewer", "senior", ["data-quality-specialist"], "unsafe or unsupported revenue priorities are rejected", "revenue-pipeline-decision-brief"],
  ["Marketing Intelligence", "marketing-intelligence-director", "Marketing Intelligence Director", "executive", ["marketing-director"], "marketing decisions are attributable and brand-safe", "marketing-performance-decision-brief"],
  ["Marketing Intelligence", "senior-seo-director", "Senior SEO Director", "senior", ["seo-director"], "search opportunities are evidence-qualified", "executive-seo-brief"],
  ["Marketing Intelligence", "search-performance-analyst", "Search Performance Analyst", "professional", ["search-console-analyst"], "search evidence remains normalized and source-qualified", "seo-optimization-plan"],
  ["Marketing Intelligence", "content-intelligence-strategist", "Content Intelligence Strategist", "senior", ["content-director"], "content opportunities connect verified search demand to approved knowledge and website inventories", "content-opportunity-portfolio"],
  ["Marketing Intelligence", "senior-analytics-specialist", "Senior Analytics Specialist", "senior", ["search-console-analyst", "marketing-director"], "content opportunities preserve attribution limitations and business relevance", "content-opportunity-report"],
  ["Marketing Intelligence", "local-visibility-specialist", "Local Visibility Specialist", "senior", ["local-seo-gbp-specialist"], "local visibility findings are source-qualified and never inferred from missing profile data", "local-visibility-report"],
  ["Marketing Intelligence", "marketing-attribution-analyst", "Marketing Attribution Analyst", "senior", ["marketing-director"], "attribution confidence and limitations remain visible", "marketing-performance-decision-brief"],
  ["Marketing Intelligence", "marketing-quality-reviewer", "Independent Marketing Quality Reviewer", "senior", ["compliance-reviewer"], "unsupported attribution and claims are rejected", "marketing-performance-decision-brief"],
  ["Finance and Executive Analytics", "finance-analytics-director", "Finance Analytics Director", "executive", ["roi-analyst"], "executives receive reconciled and bounded financial context", "executive-financial-decision-brief"],
  ["Finance and Executive Analytics", "finance-senior-revenue-analyst", "Senior Revenue Analyst", "senior", ["revenue-analyst"], "revenue variance has visible lineage", "executive-financial-decision-brief"],
  ["Finance and Executive Analytics", "roi-analyst-professional", "ROI Analyst", "senior", ["roi-analyst"], "unit economics and ROI remain assumption-aware", "executive-financial-decision-brief"],
  ["Finance and Executive Analytics", "scenario-planning-analyst", "Scenario Planning Analyst", "senior", ["roi-analyst"], "scenarios disclose sensitivity and uncertainty", "executive-financial-decision-brief"],
  ["Finance and Executive Analytics", "financial-data-reviewer", "Independent Financial Data Reviewer", "senior", ["data-quality-specialist"], "unreconciled and advice-like claims are rejected", "executive-financial-decision-brief"],
  ["Creative Studio", "creative-director-professional", "Creative Director", "executive", ["creative-director"], "creative work answers an approved business brief", "creative-campaign-package"],
  ["Creative Studio", "brand-strategist-professional", "Brand Strategist", "senior", ["brand-asset-manager"], "brand choices are consistent and evidence-backed", "creative-campaign-package"],
  ["Creative Studio", "senior-designer-professional", "Senior Designer", "senior", ["canva-designer"], "asset specifications are accessible and production-ready", "creative-campaign-package"],
  ["Creative Studio", "copywriter-professional", "Copywriter", "professional", ["creative-director"], "copy uses only permitted claims", "creative-campaign-package"],
  ["Creative Studio", "brand-asset-manager-professional", "Brand Asset Manager", "senior", ["brand-asset-manager"], "rights and source metadata remain complete", "creative-campaign-package"],
  ["Creative Studio", "creative-quality-reviewer", "Independent Creative Quality Reviewer", "senior", ["compliance-reviewer"], "brand, rights, accessibility, and reputation defects are rejected", "creative-campaign-package"],
];
export const professionalProfileContracts: ProfessionalProfileContractV1[] = roleSpecs.map(([department, id, title, level, workforce, outcome, deliverable]) => {
  const functionalId = functionalSpecs.find(([, candidate]) => candidate === department)?.[0] ?? "evidence-qualified-analysis";
  const reviewer = title.includes("Reviewer");
  const departmentDeliverableIds = professionalDeliverableContracts.filter((item) => item.department === department).map((item) => item.id);
  const supportingDeliverableIds = reviewer
    ? departmentDeliverableIds.filter((deliverableId) => deliverableId !== deliverable)
    : id === "senior-seo-director"
      ? ["seo-optimization-plan", "content-opportunity-report"]
      : [];
  const propertyProfessional = department === "Property Intelligence";
  const requiredCollaboratorIds = reviewer
    ? roleSpecs.filter(([candidateDepartment, , candidateTitle]) => candidateDepartment === department && !candidateTitle.includes("Reviewer")).map(([, professionalId]) => professionalId)
    : department === "Property Intelligence"
      ? ["property-intelligence-quality-reviewer"]
      : [];
  return { ...envelope(id, department, [department], propertyProfessional ? ["real-estate"] : ["ai-core"]), professionalId: id, authoritativeWorkforceIds: workforce, jobFamily: department, department, businessModule: propertyProfessional ? "real-estate" : "ai-core", title, level, manager: reviewer ? "Approval / Safety" : `${department} Director / AI COO`, executiveSponsor: "CEO", rolePurpose: `Prepare or independently review ${department} work for internal executive decisions.`, businessOutcome: outcome, decisionRights: [reviewer ? "block executive-ready status on failed QA" : "prepare internal advisory analysis", "escalate unresolved risk"], accountabilities: [outcome, "visible provenance, assumptions, conflicts, and missing data", "no prohibited execution"], primaryDeliverableId: deliverable, supportingDeliverableIds, competencyRequirements: [{ competencyId: "evidence-qualified-analysis", requiredProficiency: reviewer ? "reviewer" : "advanced" }, { competencyId: reviewer ? "independent-quality-review" : functionalId, requiredProficiency: reviewer ? "reviewer" : "advanced" }], sopIds: [`${department.toLowerCase().replaceAll(" ", "-")}-evidence-to-decision-sop`], qaObligations: reviewer ? ["independent functional QA", "Approval / Safety escalation"] : ["generator completeness checks"], scorecardMetricIds: professionalScorecardMetrics[department]?.map((metric) => metric.id) ?? [], capabilityQualificationIds: [], prohibitedActivities: prohibited, escalationPaths: ["Department Director", "Approval / Safety", "CEO for material decision risk"], workloadLimit: "One accountable primary deliverable per review cycle; no self-review.", reviewerSeparationRequired: true, lifecycleState: "assessment_required", successionCoverage: workforce, expertisePackIds: propertyProfessional ? ["enterprise-evidence-governance", "oklahoma-county-property-intelligence"] : ["enterprise-evidence-governance"], internalToolIds: propertyProfessional ? ["knowledge_base", "lead_database", "property_pipeline", "buyer_demand"] : ["knowledge_base"], requiredCollaboratorIds, handoffContracts: [{ target: reviewer ? "Executive Intelligence" : requiredCollaboratorIds[0] ?? "Approval / Safety", requiredInput: "versioned source-qualified evidence snapshot", expectedOutput: reviewer ? "independent QA decision" : "reviewed professional contribution" }], safeFallback: "Use approved internal evidence and produce a visible data-gap report; connector availability never creates expertise, facts, certification, or execution authority.", readinessDimensions: { professionalExpertise: "assessment_required", deliverableCertification: "assessment_required", collaborationCertification: "assessment_required", capabilityQualification: "not_qualified", tenantConnectorEnablement: "not_enabled", externalExecutionAuthorization: "blocked" }, titleDoesNotImplyHumanLicensure: true, providerAuthorityGranted: false, externalExecutionGranted: false };
});

export type CanonicalProfessionalIdentityV1 = {
  workforceId: string;
  professionalProfileIds: string[];
  mappingStatus: "specialized_profile" | "canonical_workforce_profile";
  certificationSource: "persisted_assessment_and_human_decision_only";
  connectorReadinessDefinesCertification: false;
  providerAuthorityGranted: false;
  externalExecutionGranted: false;
};

export type CanonicalWorkforceProfessionalProfileV1 = {
  professionalId: string;
  workforceId: string;
  title: string;
  canonicalOrgUnitId: string;
  profileKind: "canonical_workforce_profile";
  certificationSource: "persisted_assessment_and_human_decision_only";
  lifecycleState: "assessment_required";
  providerAuthorityGranted: false;
  externalExecutionGranted: false;
};

const specializedProfileIds = new Set(professionalProfileContracts.map((profile) => profile.professionalId));
export const canonicalWorkforceProfessionalProfiles: CanonicalWorkforceProfessionalProfileV1[] = aiWorkforceEmployees.flatMap((employee) => {
  const specialized = professionalProfileContracts.some((profile) => profile.authoritativeWorkforceIds.includes(employee.id));
  if (specialized) return [];
  const orgUnit = resolveCanonicalCompanyOrgUnit(employee.department) ?? companyOrgUnitRegistry.find((unit) => unit.id === "ai-coo-company-operations")!;
  return [{ professionalId: `workforce-profile:${employee.id}`, workforceId: employee.id, title: employee.name, canonicalOrgUnitId: orgUnit.id, profileKind: "canonical_workforce_profile", certificationSource: "persisted_assessment_and_human_decision_only", lifecycleState: "assessment_required", providerAuthorityGranted: false, externalExecutionGranted: false }];
});

export const canonicalProfessionalProfileIds = new Set([...specializedProfileIds, ...canonicalWorkforceProfessionalProfiles.map((profile) => profile.professionalId)]);

export const canonicalProfessionalIdentityRegistry: CanonicalProfessionalIdentityV1[] = aiWorkforceEmployees.map((employee) => {
  const professionalProfileIds = professionalProfileContracts.filter((profile) => profile.authoritativeWorkforceIds.includes(employee.id)).map((profile) => profile.professionalId);
  return { workforceId: employee.id, professionalProfileIds: professionalProfileIds.length ? professionalProfileIds : [`workforce-profile:${employee.id}`], mappingStatus: professionalProfileIds.length ? "specialized_profile" : "canonical_workforce_profile", certificationSource: "persisted_assessment_and_human_decision_only", connectorReadinessDefinesCertification: false, providerAuthorityGranted: false, externalExecutionGranted: false };
});

export const professionalCapabilityQualifications: ProfessionalCapabilityQualificationV1[] = [
  { id: "senior-seo-search-console-performance", version: "1.0.0", professionalId: "senior-seo-director", profileVersion: "1.0.0", connectorId: "google_search_console", capabilityKey: "seo.page.performance.read", capabilityVersion: "1.0.0", operationClass: "read", requiredCompetencyId: "marketing-attribution-analysis", requiredProficiency: "advanced", approvedEvidenceType: "normalized search performance evidence", assessmentRequired: true, expiresAfter: "material adapter, scope, or competency change", deliverableIds: ["executive-seo-brief", "content-opportunity-report", "seo-optimization-plan"], permittedEnvironments: ["preview"], permittedUse: "normalized_internal_evidence_only", registrationState: "registered", providerAuthorityGranted: false, externalExecutionGranted: false },
  { id: "senior-seo-search-console-query", version: "1.0.0", professionalId: "senior-seo-director", profileVersion: "1.0.0", connectorId: "google_search_console", capabilityKey: "seo.query.performance.read", capabilityVersion: "1.0.0", operationClass: "read", requiredCompetencyId: "marketing-attribution-analysis", requiredProficiency: "advanced", approvedEvidenceType: "normalized bounded search-query evidence", assessmentRequired: true, expiresAfter: "material adapter, scope, or competency change", deliverableIds: ["seo-growth-plan", "executive-seo-brief"], permittedEnvironments: ["preview"], permittedUse: "normalized_internal_evidence_only", registrationState: "registered", providerAuthorityGranted: false, externalExecutionGranted: false },
  { id: "search-analyst-indexing-summary", version: "1.0.0", professionalId: "search-performance-analyst", profileVersion: "1.0.0", connectorId: "google_search_console", capabilityKey: "seo.indexing.summary.read", capabilityVersion: "1.0.0", operationClass: "read", requiredCompetencyId: "marketing-attribution-analysis", requiredProficiency: "advanced", approvedEvidenceType: "normalized indexing evidence", assessmentRequired: true, expiresAfter: "material adapter, scope, or competency change", deliverableIds: ["seo-growth-plan", "executive-seo-brief"], permittedEnvironments: ["preview"], permittedUse: "normalized_internal_evidence_only", registrationState: "registered", providerAuthorityGranted: false, externalExecutionGranted: false },
  { id: "content-strategist-search-query", version: "1.0.0", professionalId: "content-intelligence-strategist", profileVersion: "1.0.0", connectorId: "google_search_console", capabilityKey: "seo.query.performance.read", capabilityVersion: "1.0.0", operationClass: "read", requiredCompetencyId: "marketing-attribution-analysis", requiredProficiency: "advanced", approvedEvidenceType: "normalized bounded content-demand evidence", assessmentRequired: true, expiresAfter: "material adapter, scope, or competency change", deliverableIds: ["content-opportunity-portfolio"], permittedEnvironments: ["preview"], permittedUse: "normalized_internal_evidence_only", registrationState: "registered", providerAuthorityGranted: false, externalExecutionGranted: false },
  { id: "analytics-specialist-search-content", version: "1.0.0", professionalId: "senior-analytics-specialist", profileVersion: "1.0.0", connectorId: "google_search_console", capabilityKey: "seo.page.performance.read", capabilityVersion: "1.0.0", operationClass: "read", requiredCompetencyId: "marketing-attribution-analysis", requiredProficiency: "advanced", approvedEvidenceType: "normalized search content evidence", assessmentRequired: true, expiresAfter: "material adapter, scope, attribution, or competency change", deliverableIds: ["content-opportunity-report"], permittedEnvironments: ["preview"], permittedUse: "normalized_internal_evidence_only", registrationState: "registered", providerAuthorityGranted: false, externalExecutionGranted: false },
  { id: "gis-maps-neighborhood-intelligence", version: "1.0.0", professionalId: "property-records-gis-analyst", profileVersion: "1.0.0", connectorId: "google_maps", capabilityKey: "maps.neighborhood.read", capabilityVersion: "1.0.0", operationClass: "read", requiredCompetencyId: "property-identity-analysis", requiredProficiency: "advanced", approvedEvidenceType: "normalized geospatial evidence", assessmentRequired: true, expiresAfter: "material adapter, licensing, or competency change", deliverableIds: ["neighborhood-intelligence"], permittedEnvironments: ["development", "preview"], permittedUse: "normalized_internal_evidence_only", registrationState: "planned", providerAuthorityGranted: false, externalExecutionGranted: false },
  { id: "marketing-ga4-attribution", version: "1.0.0", professionalId: "marketing-attribution-analyst", profileVersion: "1.0.0", connectorId: "google_analytics", capabilityKey: "analytics.attribution.read", capabilityVersion: "1.0.0", operationClass: "read", requiredCompetencyId: "marketing-attribution-analysis", requiredProficiency: "advanced", approvedEvidenceType: "normalized aggregate analytics evidence", assessmentRequired: true, expiresAfter: "material adapter, attribution, or competency change", deliverableIds: ["marketing-performance-decision-brief"], permittedEnvironments: ["development", "preview"], permittedUse: "normalized_internal_evidence_only", registrationState: "planned", providerAuthorityGranted: false, externalExecutionGranted: false },
  { id: "analytics-specialist-ga4-content", version: "1.0.0", professionalId: "senior-analytics-specialist", profileVersion: "1.0.0", connectorId: "google_analytics", capabilityKey: "ga4.traffic.read", capabilityVersion: "1.0.0", operationClass: "read", requiredCompetencyId: "marketing-attribution-analysis", requiredProficiency: "advanced", approvedEvidenceType: "normalized aggregate traffic evidence", assessmentRequired: true, expiresAfter: "material adapter, attribution, scope, or competency change", deliverableIds: ["content-opportunity-report"], permittedEnvironments: ["development", "preview"], permittedUse: "normalized_internal_evidence_only", registrationState: "planned", providerAuthorityGranted: false, externalExecutionGranted: false },
  { id: "local-visibility-gbp-performance", version: "1.0.0", professionalId: "local-visibility-specialist", profileVersion: "1.0.0", connectorId: "google_business_profile", capabilityKey: "gbp.performance.read", capabilityVersion: "1.0.0", operationClass: "read", requiredCompetencyId: "marketing-attribution-analysis", requiredProficiency: "advanced", approvedEvidenceType: "normalized local visibility evidence", assessmentRequired: true, expiresAfter: "material adapter, location, scope, or competency change", deliverableIds: ["local-visibility-report"], permittedEnvironments: ["development", "preview"], permittedUse: "normalized_internal_evidence_only", registrationState: "planned", providerAuthorityGranted: false, externalExecutionGranted: false },
];

const sequence: ProfessionalDepartment[] = ["Property Intelligence", "Revenue Operations", "Marketing Intelligence", "Finance and Executive Analytics", "Creative Studio"];
export const professionalPromotionContracts: ProfessionalPromotionContractV1[] = sequence.map((department, index) => ({ ...envelope(`${department.toLowerCase().replaceAll(" ", "-")}-promotion`, "Professional Standards", [department], department === "Property Intelligence" ? ["real-estate"] : ["ai-core"]), department, predecessorDepartment: sequence[index - 1] ?? null, calibrationMinimum: 10, blindValidationMinimum: 20, minimumMedianTimeImprovementPercent: 25, minimumUsefulOrBetterPercent: 80, maximumInventedFacts: 0, maximumUnauthorizedActions: 0, allSeededCriticalDefectsDetected: true, harmfulErrorMustNotIncrease: true, requiredOutcomeEvidence: ["case identifiers", "baseline and assisted time", "human usefulness rating", "seeded defect results", "harmful-error comparison", "unauthorized action count"], passedStage: "pilot_validated", automaticPromotionAllowed: false }));

export type DepartmentProofMetricsV1 = { calibrationCaseCount: number; blindValidationCaseCount: number; inventedFacts: number; unauthorizedActions: number; seededCriticalDefects: number; detectedSeededCriticalDefects: number; medianTimeImprovementPercent: number; usefulOrBetterPercent: number; harmfulErrorIncreased: boolean; outcomeEvidenceReferences: string[] };
export function evaluateDepartmentPromotion(department: ProfessionalDepartment, metrics: DepartmentProofMetricsV1, passedDepartments: ProfessionalDepartment[] = []) {
  const contract = professionalPromotionContracts.find((item) => item.department === department);
  if (!contract) throw new Error("promotion_contract_not_found");
  const failures: string[] = [];
  if (contract.predecessorDepartment && !passedDepartments.includes(contract.predecessorDepartment)) failures.push(`predecessor_not_passed:${contract.predecessorDepartment}`);
  if (metrics.calibrationCaseCount < contract.calibrationMinimum) failures.push("calibration_cohort_below_10");
  if (metrics.blindValidationCaseCount < contract.blindValidationMinimum) failures.push("blind_validation_cohort_below_20");
  if (metrics.inventedFacts !== 0) failures.push("invented_facts_detected");
  if (metrics.unauthorizedActions !== 0) failures.push("unauthorized_actions_detected");
  if (metrics.seededCriticalDefects < 1 || metrics.detectedSeededCriticalDefects !== metrics.seededCriticalDefects) failures.push("seeded_critical_defect_detection_incomplete");
  if (metrics.medianTimeImprovementPercent < 25) failures.push("time_improvement_below_25_percent");
  if (metrics.usefulOrBetterPercent < 80) failures.push("usefulness_below_80_percent");
  if (metrics.harmfulErrorIncreased) failures.push("harmful_error_increased");
  if (metrics.outcomeEvidenceReferences.length === 0) failures.push("outcome_evidence_required");
  return { department, status: failures.length ? "failed" as const : "passed" as const, failures, resultingStage: failures.length ? "technically_implemented" as const : "pilot_validated" as const, automaticPromotion: false as const, providerAuthorityGranted: false as const, externalExecutionGranted: false as const };
}

export type GovernedEvidenceItemV1 = { evidenceId: string; sourceReference: string; observedAt: string | null; confidence: number; verificationState: "verified" | "partially_verified" | "conflicting" | "unavailable" | "assumption"; claim: string; sensitivity: "internal" | "confidential" | "restricted"; permittedUse: "internal_executive_review_only"; conflicts: string[] };
export type ProfessionalDeliverableInputV1 = { deliverableId: string; tenantId: string; businessQuestion: string; accountableOwner: string; inputSnapshotVersion: string; observationCutoff: string; evidence: GovernedEvidenceItemV1[]; assumptions: string[]; missingData: string[]; expectedBusinessValue: string; recommendedManualDecision: string; generatorProfessionalId: string; reviewerProfessionalId: string; humanDecision?: string | null; verifiedOutcome?: string | null };
export function createGovernedProfessionalDeliverable(input: ProfessionalDeliverableInputV1) {
  const definition = professionalDeliverableContracts.find((item) => item.id === input.deliverableId);
  if (!definition) throw new Error("deliverable_contract_not_found");
  const scopedToDeliverable = (profile: ProfessionalProfileContractV1) => profile.primaryDeliverableId === input.deliverableId || profile.supportingDeliverableIds.includes(input.deliverableId);
  const generator = professionalProfileContracts.find((item) => item.professionalId === input.generatorProfessionalId && scopedToDeliverable(item));
  const reviewer = professionalProfileContracts.find((item) => item.professionalId === input.reviewerProfessionalId && item.title.includes("Reviewer") && scopedToDeliverable(item));
  const checks = [
    { id: "generator-profile", passed: Boolean(generator), reason: generator ? "Generator profile is scoped to the deliverable." : "Generator is not scoped to this deliverable." },
    { id: "independent-reviewer", passed: Boolean(reviewer) && input.generatorProfessionalId !== input.reviewerProfessionalId, reason: reviewer && input.generatorProfessionalId !== input.reviewerProfessionalId ? "Qualified independent reviewer assigned." : "Qualified independent reviewer is required." },
    { id: "claim-provenance", passed: input.evidence.every((item) => item.sourceReference.trim().length > 0), reason: "Every admitted evidence item must contain provenance." },
    { id: "freshness-visible", passed: input.evidence.every((item) => item.observedAt !== null || item.verificationState === "assumption" || item.verificationState === "unavailable"), reason: "Observation time or explicit limitation is required." },
    { id: "conflicts-visible", passed: input.evidence.filter((item) => item.verificationState === "conflicting").every((item) => item.conflicts.length > 0), reason: "Conflicting evidence must expose conflicts." },
    { id: "manual-decision", passed: input.recommendedManualDecision.trim().length > 0, reason: "One prioritized manual decision is required." },
  ];
  const qaPassed = checks.every((check) => check.passed);
  return { schemaVersion: "enterprise-professional-deliverable-v1" as const, deliverableId: definition.id, deliverableVersion: definition.version, tenantId: input.tenantId, businessQuestion: input.businessQuestion, accountableOwner: input.accountableOwner, inputSnapshotVersion: input.inputSnapshotVersion, observationCutoff: input.observationCutoff, executiveSummary: qaPassed ? `${definition.title} is ready for internal executive review.` : `${definition.title} is blocked pending remediation.`, sourceQualifiedFindings: input.evidence.map((item) => ({ claim: item.claim, evidenceId: item.evidenceId, confidence: item.confidence, verificationState: item.verificationState })), assumptions: input.assumptions, conflicts: input.evidence.flatMap((item) => item.conflicts), missingData: input.missingData, uncertainty: input.evidence.filter((item) => item.verificationState !== "verified").map((item) => `${item.evidenceId}:${item.verificationState}`), kpiImpact: "Outcome impact must be verified after the human decision.", expectedBusinessValue: input.expectedBusinessValue, risks: qaPassed ? [] : checks.filter((check) => !check.passed).map((check) => check.reason), prohibitedInterpretations: prohibited, recommendedManualDecision: input.recommendedManualDecision, professionalVersions: [{ professionalId: input.generatorProfessionalId, profileVersion: "1.0.0" }, { professionalId: input.reviewerProfessionalId, profileVersion: "1.0.0" }], competencyVersions: generator?.competencyRequirements.map((item) => ({ id: item.competencyId, version: "1.0.0" })) ?? [], sopVersions: [{ id: `${definition.department.toLowerCase().replaceAll(" ", "-")}-evidence-to-decision-sop`, version: "1.0.0" }], rubricVersion: { id: definition.qaContractId, version: "1.0.0" }, qa: { status: qaPassed ? "ready_for_internal_executive_review" as const : "blocked_remediation_required" as const, generatorCompletenessChecked: true as const, independentReviewer: input.reviewerProfessionalId, checks, approvalSafetyReviewRequired: definition.department === "Finance and Executive Analytics" || definition.department === "Creative Studio", humanOverride: { overridden: false as const, reason: null } }, humanDecision: input.humanDecision ?? null, verifiedOutcome: input.verifiedOutcome ?? null, advisoryOnly: true as const, humanReviewRequired: true as const, providerCalled: false as const, providerAuthorityGranted: false as const, liveExecutionAllowed: false as const, externalWritesAllowed: false as const };
}

export function createConnectorDemandPortfolio() {
  const manifests = listUniversalConnectorManifests();
  const demands = professionalCapabilityQualifications.map((qualification) => {
    const manifest = manifests.find((item) => item.connectorId === qualification.connectorId);
    const registered = Boolean(manifest?.capabilities.some((item) => item.capabilityKey === qualification.capabilityKey));
    const consumers = professionalProfileContracts.filter((profile) => profile.professionalId === qualification.professionalId || qualification.deliverableIds.includes(profile.primaryDeliverableId));
    const value = qualification.deliverableIds.length * 20 + consumers.length * 10 + (registered ? 20 : 0);
    const risk = qualification.registrationState === "planned" ? 20 : 5;
    return { qualificationId: qualification.id, connectorId: qualification.connectorId, capabilityKey: qualification.capabilityKey, professionalId: qualification.professionalId, deliverableIds: qualification.deliverableIds, ueipRegistration: registered ? "registered" as const : "planned" as const, qualifiedConsumerCount: consumers.length, intakePriorityScore: Math.max(0, Math.min(100, value - risk)), providerAuthorityGranted: false as const, providerCalled: false as const };
  }).sort((a, b) => b.intakePriorityScore - a.intakePriorityScore);
  return { demands, recommendation: demands[0] ? `Review ${demands[0].connectorId}/${demands[0].capabilityKey} first; no connector was activated.` : "No capability demand recorded.", providerCalled: false as const, connectorActivationAllowed: false as const };
}

export type IndustryProfessionalizationPackV1 = DefinitionEnvelopeV1 & { businessModule: string; moduleCompatibilityVersion: string; profileIds: string[]; competencyIds: string[]; sopIds: string[]; evidenceContractIds: string[]; qaContractIds: string[]; deliverableIds: string[]; capabilityQualificationIds: string[]; promotionContractIds: string[]; dataSensitivity: string[]; retentionRequirement: string; prohibitedActivities: string[]; disclaimers: string[]; installationState: "installed" | "planned"; externalExecutionGranted: false };
export const industryProfessionalizationPacks: IndustryProfessionalizationPackV1[] = [{ ...envelope("real-estate-professionalization-pack", "Real Estate Business Module", ["Property Intelligence"], ["real-estate"]), businessModule: "real-estate", moduleCompatibilityVersion: "1.0.0", profileIds: ["chief-property-intelligence-officer", "property-records-gis-analyst", "market-valuation-analyst", "investment-acquisition-analyst", "property-intelligence-quality-reviewer"], competencyIds: industryCompetencies.map((item) => item.id), sopIds: ["property-intelligence-evidence-to-decision-sop"], evidenceContractIds: ["enterprise-professional-evidence"], qaContractIds: ["property-intelligence-independent-qa"], deliverableIds: ["acquisition-decision-brief"], capabilityQualificationIds: ["gis-maps-neighborhood-intelligence"], promotionContractIds: ["property-intelligence-promotion"], dataSensitivity: ["property", "seller", "financial"], retentionRequirement: "Business Module and tenant retention policy required.", prohibitedActivities: prohibited, disclaimers: ["Not an appraisal, legal opinion, title opinion, tax opinion, or offer."], installationState: "installed", externalExecutionGranted: false }];

export function assertValidProfessionalOperatingSystem() {
  const ids = new Set<string>();
  const definitions = [...professionalCompetencyContracts, ...professionalSopContracts, ...professionalEvidenceContracts, ...professionalQaContracts, ...professionalDeliverableContracts, ...professionalPromotionContracts, ...industryProfessionalizationPacks];
  for (const definition of definitions) { if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(definition.id)) throw new Error(`invalid_definition_id:${definition.id}`); if (!/^\d+\.\d+\.\d+$/.test(definition.version)) throw new Error(`invalid_definition_version:${definition.id}`); const key = `${definition.id}@${definition.version}`; if (ids.has(key)) throw new Error(`duplicate_definition:${key}`); ids.add(key); }
  for (const profile of professionalProfileContracts) { if (!profile.authoritativeWorkforceIds.every((id) => workforceIds.has(id))) throw new Error(`unknown_workforce_reference:${profile.professionalId}`); if (profile.providerAuthorityGranted || profile.externalExecutionGranted) throw new Error("professional_authority_boundary_violated"); }
  if (canonicalProfessionalIdentityRegistry.length !== aiWorkforceEmployees.length || new Set(canonicalProfessionalIdentityRegistry.map((identity) => identity.workforceId)).size !== aiWorkforceEmployees.length) throw new Error("canonical_workforce_identity_mapping_incomplete");
  if (canonicalProfessionalIdentityRegistry.some((identity) => identity.connectorReadinessDefinesCertification || identity.providerAuthorityGranted || identity.externalExecutionGranted)) throw new Error("workforce_identity_authority_boundary_violated");
  for (const qualification of professionalCapabilityQualifications) if (qualification.providerAuthorityGranted || qualification.externalExecutionGranted) throw new Error("qualification_authority_boundary_violated");
  return true;
}

export function createExecutiveProfessionalPortfolio(promotionResults: Partial<Record<ProfessionalDepartment, "failed" | "passed">> = {}) {
  assertValidProfessionalOperatingSystem();
  const departments = professionalDepartments.map((department) => { const profiles = professionalProfileContracts.filter((item) => item.department === department); const promotion = professionalPromotionContracts.find((item) => item.department === department)!; return { department, objective: professionalDeliverableContracts.find((item) => item.department === department)?.purpose ?? "Property Intelligence compatibility scope", accountableLeaders: profiles.filter((item) => item.level === "executive").map((item) => item.title), professionalCount: profiles.length, scorecard: professionalScorecardMetrics[department] ?? [], promotionResult: promotionResults[department] ?? "not_validated", predecessorBlocker: promotion.predecessorDepartment && promotionResults[promotion.predecessorDepartment] !== "passed" ? promotion.predecessorDepartment : null }; });
  return { operatingChain: "Business Outcome -> Department Mandate -> Professional Profile -> Competencies -> SOPs -> Evidence -> Deliverable -> Independent QA -> Executive Decision -> Verified Outcome -> Promotion or Remediation", departments, connectorDemand: createConnectorDemandPortfolio(), risks: ["No department promotion is inferred without persisted cohort evidence.", "Capability qualification grants no connector authority."], recommendedCeoDecisions: ["Review calibration readiness", "Request missing evidence", "Prioritize UEIP intake by verified deliverable value", "Defer promotion when predecessor or proof thresholds fail"], learningAuthority: "recommend_versioned_changes_only" as const, providerCalled: false as const, externalWritesAllowed: false as const };
}

export function createEnterpriseProfessionalOperatingSystemReport() { return { initiative: "Enterprise Professional Operating System", architectureAuthority: { workforce: "AI Workforce", departments: "Department OS", providers: "UEIP", execution: "Approval / Safety", industryBehavior: "Business Modules" }, contracts: { profiles: professionalProfileContracts, competencies: professionalCompetencyContracts, sops: professionalSopContracts, evidence: professionalEvidenceContracts, qa: professionalQaContracts, deliverables: professionalDeliverableContracts, promotions: professionalPromotionContracts }, capabilityQualifications: professionalCapabilityQualifications, industryPacks: industryProfessionalizationPacks, executivePortfolio: createExecutiveProfessionalPortfolio(), providerCalled: false as const, liveExecutionAllowed: false as const, externalWritesAllowed: false as const }; }
