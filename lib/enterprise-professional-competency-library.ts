import { propertyIntelligenceProfessionalProfiles, type ProfessionalProfileV1 } from "@/lib/enterprise-professional-workforce";
import {
  assertValidProfessionalOperatingSystem,
  industryProfessionalizationPacks,
  professionalCapabilityQualifications,
  professionalCompetencyContracts,
  professionalDeliverableContracts,
  professionalEvidenceContracts,
  professionalProfileContracts,
  professionalPromotionContracts,
  professionalQaContracts,
  professionalScorecardMetrics,
  professionalSopContracts,
  type ProfessionalLifecycleState,
} from "@/lib/enterprise-professional-operating-system";

export type EpcDepartment = "Property Intelligence" | "Revenue Operations" | "Marketing Intelligence" | "Finance and Executive Analytics" | "Creative Studio";
export type EpcDefinitionClassification = "enterprise_shared" | "department_specific";
export type EpcDefinitionLifecycle = "draft" | "approved" | "active" | "superseded" | "suspended" | "retired";
export type EpcProficiency = "working" | "advanced" | "reviewer";
export type EpcCertificationState = "draft" | "assessment_required" | "assessment_failed" | "certified_internal" | "suspended" | "recertification_required" | "expired" | "retired";
export type EpcOperationalStage = "technically_implemented" | "internally_certified" | "pilot_validated" | "operationally_proven" | "suspended" | "expired";

export type EnterpriseCompetencyDefinitionV1 = {
  id: string;
  version: string;
  owner: string;
  approvingAuthority: "Professional Standards / Approval Safety";
  purpose: string;
  expectedBusinessValue: string;
  classification: EpcDefinitionClassification;
  applicableDepartments: EpcDepartment[];
  applicableBusinessModules: string[];
  lifecycle: EpcDefinitionLifecycle;
  proficiencyLevels: EpcProficiency[];
  assessmentMethod: string;
  passingConditions: string[];
  acceptableCertificationEvidence: string[];
  dependencyIds: string[];
  prohibitedActivities: string[];
  escalationRule: string;
  humanReviewRequired: true;
  kpiIds: string[];
  outcomeContractRequired: true;
  expirationPolicy: string;
  suspensionTriggers: string[];
  recertificationTriggers: string[];
};

export type ProfessionalCompetencyRequirementV1 = {
  competencyId: string;
  competencyVersion: string;
  requiredLevel: EpcProficiency;
  mandatory: true;
};

export type ProfessionalAssessmentRecordV1 = {
  recordId: string;
  tenantId: string;
  professionalId: string;
  profileVersion: string;
  competencyId: string;
  competencyVersion: string;
  assessmentMethod: string;
  evidenceReferences: string[];
  result: "passed" | "failed";
  assessorId: string;
  assessedAt: string;
  advisoryOnly: true;
};

export type ProfessionalCertificationScopeV1 = {
  tenantId: string;
  professionalId: string;
  profileVersion: string;
  competencyId: string;
  competencyVersion: string;
  sopId: string;
  sopVersion: string;
  deliverableId: string;
  deliverableVersion: string;
  businessModule: string;
};

export type ProfessionalCertificationRecordV1 = ProfessionalCertificationScopeV1 & {
  certificationId: string;
  state: EpcCertificationState;
  assessmentRecordIds: string[];
  reason: string;
  certifiedBy: string | null;
  effectiveAt: string;
  expiresAt: string | null;
  providerAccessGranted: false;
  approvalAuthorityGranted: false;
  externalExecutionGranted: false;
};

export type EnterpriseSopDefinitionV1 = {
  id: string;
  version: string;
  title: string;
  owner: string;
  lifecycle: EpcDefinitionLifecycle;
  steps: string[];
  evidenceStandardIds: string[];
  prohibitedActivities: string[];
  materialChangeRequiresRecertification: true;
};

export type ProfessionalQualityRubricV1 = {
  id: string;
  version: string;
  lifecycle: EpcDefinitionLifecycle;
  checks: string[];
  independentReviewerRequired: true;
  failedSafetyCheckBlocksCertification: true;
};

export type ProfessionalDeliverableDefinitionV1 = {
  id: string;
  version: string;
  department: EpcDepartment;
  executiveConsumer: string;
  purpose: string;
  requiredSections: string[];
  evidenceStandardIds: string[];
  qualityRubricId: string;
  advisoryOnly: true;
  humanReviewRequired: true;
  providerCalled: false;
  externalWritesAllowed: false;
};

export type ProfessionalEvidenceStandardV1 = {
  id: string;
  version: string;
  provenanceRequired: true;
  freshnessRequired: true;
  assumptionsLabeled: true;
  conflictsVisible: true;
  missingDataVisible: true;
  rawProviderPayloadAllowed: false;
};

export type DepartmentProfessionalizationProfileV1 = {
  department: EpcDepartment;
  primaryDeliverableId: string;
  professionalIds: string[];
  competencyRequirements: ProfessionalCompetencyRequirementV1[];
  roiMeasures: string[];
  prohibitedActivities: string[];
  operationalStage: EpcOperationalStage;
  promotionGate: "not_validated" | "failed" | "passed";
  nextDepartmentBlockedUntilPassed: true;
};

export type ProfessionalOutcomeContractV1 = {
  outcomeId: string;
  tenantId: string;
  department: EpcDepartment;
  professionalId: string;
  profileVersion: string;
  competencyVersions: string[];
  sopVersions: string[];
  rubricVersion: string;
  deliverableId: string;
  deliverableVersion: string;
  evidenceCompleteness: number;
  conflictsDetected: number;
  initialHumanDecision: string | null;
  finalHumanDecision: string | null;
  overrideReason: string | null;
  workMinutes: number | null;
  usefulnessRating: 1 | 2 | 3 | 4 | 5 | null;
  sourceContributions: Array<{ sourceId: string; uniqueFacts: number; conflictsResolved: number }>;
  connectorReliability: Array<{ connectorId: string; status: string }>;
  verifiedOutcome: string | null;
  observedAt: string;
  learningMayRecommendOnly: true;
};

export type ProfessionalPortfolioReportV1 = {
  generatedAt: string;
  definitions: { active: number; departmentSpecific: number; enterpriseShared: number };
  departments: Array<{ department: EpcDepartment; stage: EpcOperationalStage; promotionGate: DepartmentProfessionalizationProfileV1["promotionGate"]; primaryDeliverableId: string }>;
  certificationCoverage: { certified: number; total: number; percentage: number };
  risks: string[];
  ueipCapabilityExposure: "metadata_only_no_authority";
  sprint15Ready: boolean;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalWritesAllowed: false;
};

export type ProfessionalDefinitionRegistryV1 = {
  schemaVersion: "enterprise-professional-definition-registry-v1";
  profiles: typeof professionalProfileContracts;
  competencies: typeof professionalCompetencyContracts;
  sops: typeof professionalSopContracts;
  evidence: typeof professionalEvidenceContracts;
  qa: typeof professionalQaContracts;
  deliverables: typeof professionalDeliverableContracts;
  promotions: typeof professionalPromotionContracts;
  capabilityQualifications: typeof professionalCapabilityQualifications;
  scorecards: typeof professionalScorecardMetrics;
  industryPacks: typeof industryProfessionalizationPacks;
  propertyCompatibilityProfiles: ReturnType<typeof adaptPropertyIntelligenceProfile>[];
  graphValidation: { valid: boolean; failures: string[] };
  providerAuthorityGranted: false;
  externalExecutionGranted: false;
};

export type ProfessionalLifecycleDerivationV1 = {
  professionalId: string;
  state: ProfessionalLifecycleState;
  reasons: string[];
  certificationCoverage: { certified: number; required: number };
  remediationOpen: boolean;
  promotionPassed: boolean;
  providerAuthorityGranted: false;
  externalExecutionGranted: false;
};

type GovernedProfessionalOutputV1 = {
  deliverableId: string;
  deliverableVersion: "1.0.0";
  tenantId: string;
  inputSnapshotVersion: string;
  generatedAt: string;
  evidenceReferences: string[];
  assumptions: string[];
  conflicts: string[];
  missingData: string[];
  generatorProfessionalId: string;
  reviewerProfessionalId: string;
  independentReviewPassed: boolean;
  permittedUse: "internal_executive_review_only";
  advisoryOnly: true;
  humanReviewRequired: true;
  providerCalled: false;
  externalWritesAllowed: false;
};

export type RevenuePipelineDecisionBriefV1 = GovernedProfessionalOutputV1 & {
  deliverableId: "revenue-pipeline-decision-brief";
  pipelineExceptions: string[];
  stalledOpportunities: string[];
  dataFreshness: string;
  buyerDemandAlignment: string;
  revenueDelayFactors: string[];
  responsibleHumanOwner: string;
  recommendedManualAction: string;
};

export type MarketingPerformanceDecisionBriefV1 = GovernedProfessionalOutputV1 & {
  deliverableId: "marketing-performance-decision-brief";
  verifiedSignals: string[];
  attributionConfidence: number;
  attributionLimitations: string[];
  connectorHealth: string[];
  channelAndContentGaps: string[];
  expectedAndObservedOutcomes: string[];
  recommendedManualExperiment: string;
};

export type ExecutiveFinancialDecisionBriefV1 = GovernedProfessionalOutputV1 & {
  deliverableId: "executive-financial-decision-brief";
  sourceQualifiedMetrics: string[];
  revenueExpenseCashVariance: string[];
  reconciliationStatus: "reconciled" | "partially_reconciled" | "unreconciled";
  scenarios: string[];
  uncertainty: string[];
  operationalRisks: string[];
  recommendedManualReview: string;
  professionalAdviceDisclaimer: true;
};

export type CreativeCampaignPackageV1 = GovernedProfessionalOutputV1 & {
  deliverableId: "creative-campaign-package";
  approvedBusinessBriefReference: string;
  audience: string;
  permittedClaims: string[];
  brandSystemReferences: string[];
  assetSpecifications: string[];
  sourceAndRightsMetadata: string[];
  accessibilityReview: string[];
  reputationReview: string[];
  manualPublishingReadinessChecklist: string[];
};

const enterpriseProhibitions = ["provider access", "external writes", "outreach", "publishing", "spending", "approval-as-execution", "autonomous execution"];

export const professionalEvidenceStandards: ProfessionalEvidenceStandardV1[] = [
  { id: "epc-evidence-standard", version: "1.0.0", provenanceRequired: true, freshnessRequired: true, assumptionsLabeled: true, conflictsVisible: true, missingDataVisible: true, rawProviderPayloadAllowed: false },
];

export const professionalQualityRubrics: ProfessionalQualityRubricV1[] = [
  { id: "epc-independent-evidence-qa", version: "1.0.0", lifecycle: "active", checks: ["claim provenance", "freshness", "assumption labels", "visible conflicts", "visible missing data", "authority boundary", "prohibited execution"], independentReviewerRequired: true, failedSafetyCheckBlocksCertification: true },
];

export const enterpriseSopDefinitions: EnterpriseSopDefinitionV1[] = [
  { id: "epc-evidence-to-decision-sop", version: "1.0.0", title: "Evidence-to-Decision SOP", owner: "Professional Standards", lifecycle: "active", steps: ["resolve trusted context", "assemble versioned evidence", "expose gaps and conflicts", "prepare advisory deliverable", "run independent QA", "record human decision and outcome"], evidenceStandardIds: ["epc-evidence-standard"], prohibitedActivities: enterpriseProhibitions, materialChangeRequiresRecertification: true },
];

export const enterpriseCompetencyDefinitions: EnterpriseCompetencyDefinitionV1[] = [
  {
    id: "evidence-qualified-analysis", version: "1.0.0", owner: "AI Workforce Platform Engineering", approvingAuthority: "Professional Standards / Approval Safety", purpose: "Turn versioned, attributable evidence into clearly bounded internal analysis.", expectedBusinessValue: "Reduce executive verification time and unsupported claims.", classification: "enterprise_shared", applicableDepartments: ["Property Intelligence", "Revenue Operations", "Marketing Intelligence", "Finance and Executive Analytics", "Creative Studio"], applicableBusinessModules: ["real-estate", "ai-core"], lifecycle: "active", proficiencyLevels: ["working", "advanced", "reviewer"], assessmentMethod: "seeded evidence and authority-boundary evaluation", passingConditions: ["all material claims traceable", "assumptions and gaps visible", "no invented facts"], acceptableCertificationEvidence: ["versioned test result", "independent assessment record"], dependencyIds: ["epc-evidence-standard", "epc-evidence-to-decision-sop"], prohibitedActivities: enterpriseProhibitions, escalationRule: "Escalate unresolved evidence or authority conflicts to Approval / Safety.", humanReviewRequired: true, kpiIds: ["decision-quality", "review-time"], outcomeContractRequired: true, expirationPolicy: "Reassess after a material dependency change or quality failure.", suspensionTriggers: ["invented fact", "missing provenance", "prohibited execution"], recertificationTriggers: ["SOP change", "rubric change", "deliverable schema change", "capability change"],
  },
  {
    id: "independent-quality-review", version: "1.0.0", owner: "Approval / Safety", approvingAuthority: "Professional Standards / Approval Safety", purpose: "Independently reject unsupported, unsafe, or misleading professional output.", expectedBusinessValue: "Prevent costly executive decisions based on unreliable output.", classification: "enterprise_shared", applicableDepartments: ["Property Intelligence", "Revenue Operations", "Marketing Intelligence", "Finance and Executive Analytics", "Creative Studio"], applicableBusinessModules: ["real-estate", "ai-core"], lifecycle: "active", proficiencyLevels: ["reviewer"], assessmentMethod: "seeded defect detection", passingConditions: ["generator and reviewer differ", "all seeded safety defects detected"], acceptableCertificationEvidence: ["independent QA test result"], dependencyIds: ["epc-independent-evidence-qa"], prohibitedActivities: [...enterpriseProhibitions, "self-review"], escalationRule: "Failed safety or independence checks block executive certification.", humanReviewRequired: true, kpiIds: ["qa-detection", "false-certification-rate"], outcomeContractRequired: true, expirationPolicy: "Reassess after rubric or regulatory-boundary changes.", suspensionTriggers: ["missed prohibited claim", "self-review"], recertificationTriggers: ["rubric change", "regulatory-boundary change"],
  },
  {
    id: "property-identity-analysis", version: "1.0.0", owner: "Property Intelligence", approvingAuthority: "Professional Standards / Approval Safety", purpose: "Resolve canonical property identity and prevent cross-property evidence leakage.", expectedBusinessValue: "Improve acquisition research accuracy.", classification: "department_specific", applicableDepartments: ["Property Intelligence"], applicableBusinessModules: ["real-estate"], lifecycle: "active", proficiencyLevels: ["advanced", "reviewer"], assessmentMethod: "ambiguous identity and leakage test", passingConditions: ["zero cross-property leakage"], acceptableCertificationEvidence: ["Property Intelligence validation result"], dependencyIds: ["epc-evidence-standard"], prohibitedActivities: enterpriseProhibitions, escalationRule: "Ambiguous identity requires human verification.", humanReviewRequired: true, kpiIds: ["identity-accuracy"], outcomeContractRequired: true, expirationPolicy: "Reassess after identity schema changes.", suspensionTriggers: ["cross-property leakage"], recertificationTriggers: ["identity schema change"],
  },
];

export const professionalDeliverableDefinitions: ProfessionalDeliverableDefinitionV1[] = [
  { id: "acquisition-decision-brief", version: "1.0.0", department: "Property Intelligence", executiveConsumer: "CEO", purpose: "Prioritize manual acquisition research with visible evidence and uncertainty.", requiredSections: ["identity", "evidence", "economics", "risks", "manual next action"], evidenceStandardIds: ["epc-evidence-standard"], qualityRubricId: "epc-independent-evidence-qa", advisoryOnly: true, humanReviewRequired: true, providerCalled: false, externalWritesAllowed: false },
  { id: "revenue-pipeline-decision-brief", version: "1.0.0", department: "Revenue Operations", executiveConsumer: "CEO / Revenue Director", purpose: "Surface pipeline exceptions and one manual next action.", requiredSections: ["exceptions", "freshness", "missing evidence", "buyer demand", "delay factors", "human owner", "manual action", "QA"], evidenceStandardIds: ["epc-evidence-standard"], qualityRubricId: "epc-independent-evidence-qa", advisoryOnly: true, humanReviewRequired: true, providerCalled: false, externalWritesAllowed: false },
  { id: "marketing-performance-decision-brief", version: "1.0.0", department: "Marketing Intelligence", executiveConsumer: "CEO / Marketing Director", purpose: "Explain verified marketing performance and recommend one manual experiment.", requiredSections: ["signals", "attribution limits", "connector health", "gaps", "outcomes", "manual experiment", "QA"], evidenceStandardIds: ["epc-evidence-standard"], qualityRubricId: "epc-independent-evidence-qa", advisoryOnly: true, humanReviewRequired: true, providerCalled: false, externalWritesAllowed: false },
  { id: "executive-financial-decision-brief", version: "1.0.0", department: "Finance and Executive Analytics", executiveConsumer: "CEO", purpose: "Expose reconciled operating variance and one manual review.", requiredSections: ["source-qualified metrics", "variance", "reconciliation", "assumptions", "uncertainty", "risks", "manual review"], evidenceStandardIds: ["epc-evidence-standard"], qualityRubricId: "epc-independent-evidence-qa", advisoryOnly: true, humanReviewRequired: true, providerCalled: false, externalWritesAllowed: false },
  { id: "creative-campaign-package", version: "1.0.0", department: "Creative Studio", executiveConsumer: "CEO / Creative Director", purpose: "Prepare a brand-safe internal creative package for manual approval.", requiredSections: ["business brief", "audience", "claims", "brand references", "asset specifications", "rights", "accessibility", "QA", "manual readiness"], evidenceStandardIds: ["epc-evidence-standard"], qualityRubricId: "epc-independent-evidence-qa", advisoryOnly: true, humanReviewRequired: true, providerCalled: false, externalWritesAllowed: false },
];

const sharedRequirements: ProfessionalCompetencyRequirementV1[] = [
  { competencyId: "evidence-qualified-analysis", competencyVersion: "1.0.0", requiredLevel: "advanced", mandatory: true },
  { competencyId: "independent-quality-review", competencyVersion: "1.0.0", requiredLevel: "reviewer", mandatory: true },
];

export const departmentProfessionalizationProfiles: DepartmentProfessionalizationProfileV1[] = [
  { department: "Property Intelligence", primaryDeliverableId: "acquisition-decision-brief", professionalIds: ["chief-property-intelligence-officer", "property-records-gis-analyst", "market-valuation-analyst", "investment-acquisition-analyst", "property-intelligence-quality-reviewer"], competencyRequirements: [...sharedRequirements, { competencyId: "property-identity-analysis", competencyVersion: "1.0.0", requiredLevel: "advanced", mandatory: true }], roiMeasures: ["CEO research time", "brief usefulness", "false high-priority rate"], prohibitedActivities: ["outreach", "offers", "CRM mutation", "provider calls"], operationalStage: "technically_implemented", promotionGate: "not_validated", nextDepartmentBlockedUntilPassed: true },
  { department: "Revenue Operations", primaryDeliverableId: "revenue-pipeline-decision-brief", professionalIds: ["crm-manager", "pipeline-coordinator", "revenue-analyst"], competencyRequirements: sharedRequirements, roiMeasures: ["pipeline review time", "exception detection", "false-priority rate"], prohibitedActivities: ["outreach", "CRM mutation", "task creation", "offers", "provider calls"], operationalStage: "technically_implemented", promotionGate: "not_validated", nextDepartmentBlockedUntilPassed: true },
  { department: "Marketing Intelligence", primaryDeliverableId: "marketing-performance-decision-brief", professionalIds: ["marketing-director", "seo-director", "search-console-analyst"], competencyRequirements: sharedRequirements, roiMeasures: ["analysis time", "useful decisions", "attribution error"], prohibitedActivities: ["publishing", "campaign mutation", "ad spending", "provider writes"], operationalStage: "technically_implemented", promotionGate: "not_validated", nextDepartmentBlockedUntilPassed: true },
  { department: "Finance and Executive Analytics", primaryDeliverableId: "executive-financial-decision-brief", professionalIds: ["revenue-analyst", "roi-analyst"], competencyRequirements: sharedRequirements, roiMeasures: ["reconciliation time", "variance detection", "decision usefulness"], prohibitedActivities: ["accounting certification", "tax advice", "investment advice", "unreconciled claims", "provider calls"], operationalStage: "technically_implemented", promotionGate: "not_validated", nextDepartmentBlockedUntilPassed: true },
  { department: "Creative Studio", primaryDeliverableId: "creative-campaign-package", professionalIds: ["creative-director", "canva-designer", "brand-asset-manager"], competencyRequirements: sharedRequirements, roiMeasures: ["production time", "revision cycles", "brand compliance", "accessibility"], prohibitedActivities: ["publishing", "uploading", "scheduling", "provider generation", "spending"], operationalStage: "technically_implemented", promotionGate: "not_validated", nextDepartmentBlockedUntilPassed: true },
];

export function assertValidEnterpriseCompetencyDefinition(definition: EnterpriseCompetencyDefinitionV1) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(definition.id)) throw new Error("invalid_competency_id");
  if (!/^\d+\.\d+\.\d+$/.test(definition.version)) throw new Error("invalid_semantic_version");
  if (definition.classification === "enterprise_shared" && definition.applicableDepartments.length < 2) throw new Error("enterprise_shared_requires_demonstrated_multi_department_scope");
  if (definition.classification === "department_specific" && definition.applicableDepartments.length !== 1) throw new Error("department_specific_requires_one_department");
  if (!definition.humanReviewRequired || !definition.outcomeContractRequired) throw new Error("governance_invariant_missing");
  return definition;
}

export function certificationScopeKey(scope: ProfessionalCertificationScopeV1) {
  return [scope.tenantId, scope.professionalId, scope.profileVersion, scope.competencyId, scope.competencyVersion, scope.sopId, scope.sopVersion, scope.deliverableId, scope.deliverableVersion, scope.businessModule].join("::");
}

const allowedCertificationTransitions: Record<EpcCertificationState, EpcCertificationState[]> = {
  draft: ["assessment_required", "retired"], assessment_required: ["assessment_failed", "certified_internal", "retired"], assessment_failed: ["assessment_required", "retired"], certified_internal: ["suspended", "recertification_required", "expired", "retired"], suspended: ["assessment_required", "retired"], recertification_required: ["assessment_required", "suspended", "retired"], expired: ["assessment_required", "retired"], retired: [],
};

export function assertCertificationTransition(from: EpcCertificationState, to: EpcCertificationState) {
  if (!allowedCertificationTransitions[from].includes(to)) throw new Error(`invalid_certification_transition:${from}:${to}`);
  return true;
}

export function evaluateInternalDeliverableEligibility(input: { certification: ProfessionalCertificationRecordV1 | null; expectedScope: ProfessionalCertificationScopeV1; now?: Date }) {
  const reasons: string[] = [];
  if (!input.certification) reasons.push("certification_missing");
  else {
    if (certificationScopeKey(input.certification) !== certificationScopeKey(input.expectedScope)) reasons.push("certification_scope_mismatch");
    if (input.certification.state !== "certified_internal") reasons.push(`certification_${input.certification.state}`);
    if (input.certification.expiresAt && new Date(input.certification.expiresAt) <= (input.now ?? new Date())) reasons.push("certification_expired");
  }
  return { eligible: reasons.length === 0, reasons, internalAdvisoryOnly: true as const, providerAccessGranted: false as const, approvalAuthorityGranted: false as const, externalExecutionGranted: false as const };
}

export function createDependencyImpactPreview(changedDefinitionIds: string[]) {
  const changed = new Set(changedDefinitionIds);
  const competencies = enterpriseCompetencyDefinitions.filter((item) => changed.has(item.id) || item.dependencyIds.some((id) => changed.has(id)));
  const departments = departmentProfessionalizationProfiles.filter((profile) => profile.competencyRequirements.some((requirement) => competencies.some((item) => item.id === requirement.competencyId)));
  const deliverables = professionalDeliverableDefinitions.filter((item) => departments.some((profile) => profile.primaryDeliverableId === item.id) || item.evidenceStandardIds.some((id) => changed.has(id)) || changed.has(item.qualityRubricId));
  return { changedDefinitionIds: [...changed], affectedCompetencyIds: competencies.map((item) => item.id), affectedDepartments: departments.map((item) => item.department), affectedDeliverableIds: deliverables.map((item) => item.id), requiresRecertification: competencies.length > 0 || deliverables.length > 0, providerAuthorityChanged: false, externalExecutionChanged: false };
}

export function adaptPropertyIntelligenceProfile(profile: ProfessionalProfileV1) {
  return {
    workforceProfileIds: profile.sourceWorkforceIds,
    professionalId: profile.id,
    profileVersion: profile.profileVersion,
    department: profile.department as EpcDepartment,
    manager: profile.manager,
    competencyRequirements: profile.competencies.map((item) => ({ competencyId: item.id, competencyVersion: "1.0.0", requiredLevel: item.requiredLevel, mandatory: true as const })),
    sopVersions: profile.sopReferences.map((item) => ({ id: item.id, version: item.version })),
    internalAdvisoryOnly: true as const,
    providerAuthorityGranted: false as const,
    externalExecutionGranted: false as const,
  };
}

export function validatePropertyIntelligenceProofGate(input: { calibrationLeadCount: number; validationLeadCount: number; inventedFacts: number; crossPropertyLeakage: number; seededIssuesDetected: number; seededIssuesTotal: number; medianResearchTimeImprovementPercent: number; usefulOrBetterPercent: number; falseHighPriorityIncreased: boolean; unauthorizedActions: number }) {
  const failures: string[] = [];
  if (input.calibrationLeadCount < 10) failures.push("calibration_cohort_below_10");
  if (input.validationLeadCount < 20) failures.push("blind_validation_cohort_below_20");
  if (input.inventedFacts !== 0) failures.push("invented_facts_detected");
  if (input.crossPropertyLeakage !== 0) failures.push("cross_property_leakage_detected");
  if (input.seededIssuesTotal < 1 || input.seededIssuesDetected !== input.seededIssuesTotal) failures.push("seeded_issue_detection_incomplete");
  if (input.medianResearchTimeImprovementPercent < 25) failures.push("research_time_improvement_below_25_percent");
  if (input.usefulOrBetterPercent < 80) failures.push("usefulness_below_80_percent");
  if (input.falseHighPriorityIncreased) failures.push("false_high_priority_increased");
  if (input.unauthorizedActions !== 0) failures.push("unauthorized_action_detected");
  return { status: failures.length ? "failed" as const : "passed" as const, failures, operationalProofRecorded: true, providerCalled: false as const, externalWritesAllowed: false as const };
}

export function createProfessionalPortfolioReport(certifications: ProfessionalCertificationRecordV1[] = [], promotionResults: Partial<Record<EpcDepartment, "failed" | "passed">> = {}): ProfessionalPortfolioReportV1 {
  enterpriseCompetencyDefinitions.forEach(assertValidEnterpriseCompetencyDefinition);
  const certified = certifications.filter((item) => item.state === "certified_internal").length;
  const total = departmentProfessionalizationProfiles.reduce((sum, profile) => sum + profile.competencyRequirements.length, 0);
  const propertyResult = promotionResults["Property Intelligence"];
  const risks = [...(!propertyResult ? ["EPC-0 operational cohort evidence has not been recorded."] : []), "Department promotion remains sequential and blocked until the prior proof gate passes."];
  if (certifications.some((item) => item.state === "suspended" || item.state === "expired")) risks.push("One or more certifications are suspended or expired.");
  return { generatedAt: new Date().toISOString(), definitions: { active: enterpriseCompetencyDefinitions.filter((item) => item.lifecycle === "active").length, departmentSpecific: enterpriseCompetencyDefinitions.filter((item) => item.classification === "department_specific").length, enterpriseShared: enterpriseCompetencyDefinitions.filter((item) => item.classification === "enterprise_shared").length }, departments: departmentProfessionalizationProfiles.map((item) => ({ department: item.department, stage: promotionResults[item.department] === "passed" ? "pilot_validated" : item.operationalStage, promotionGate: promotionResults[item.department] ?? item.promotionGate, primaryDeliverableId: item.primaryDeliverableId })), certificationCoverage: { certified, total, percentage: total ? Math.round((certified / total) * 100) : 0 }, risks, ueipCapabilityExposure: "metadata_only_no_authority", sprint15Ready: departmentProfessionalizationProfiles.every((item) => promotionResults[item.department] === "passed"), providerCalled: false, liveExecutionAllowed: false, externalWritesAllowed: false };
}

export function resolveProfessionalCompetencyDefinition(id: string, version: string) {
  return professionalCompetencyContracts.find((item) => item.id === id && item.version === version && item.lifecycle === "active")
    ?? enterpriseCompetencyDefinitions.find((item) => item.id === id && item.version === version && item.lifecycle === "active")
    ?? null;
}

export function resolveProfessionalSopDefinition(id: string, version: string) {
  return professionalSopContracts.find((item) => item.id === id && item.version === version && item.lifecycle === "active")
    ?? enterpriseSopDefinitions.find((item) => item.id === id && item.version === version && item.lifecycle === "active")
    ?? null;
}

export function resolveProfessionalDeliverableDefinition(id: string, version: string) {
  return professionalDeliverableContracts.find((item) => item.id === id && item.version === version && item.lifecycle === "active")
    ?? professionalDeliverableDefinitions.find((item) => item.id === id && item.version === version)
    ?? null;
}

export function validateProfessionalDefinitionGraph() {
  const failures: string[] = [];
  try { assertValidProfessionalOperatingSystem(); } catch (error) { failures.push(error instanceof Error ? error.message : "operating_system_validation_failed"); }
  const competencyIds = new Set(professionalCompetencyContracts.map((item) => item.id));
  const sopIds = new Set(professionalSopContracts.map((item) => item.id));
  const evidenceIds = new Set(professionalEvidenceContracts.map((item) => item.id));
  const qaIds = new Set(professionalQaContracts.map((item) => item.id));
  const deliverableIds = new Set(professionalDeliverableContracts.map((item) => item.id));
  const qualificationIds = new Set(professionalCapabilityQualifications.map((item) => item.id));
  const profileIds = new Set(professionalProfileContracts.map((item) => item.professionalId));
  for (const profile of professionalProfileContracts) {
    for (const requirement of profile.competencyRequirements) if (!competencyIds.has(requirement.competencyId)) failures.push(`profile_competency_missing:${profile.professionalId}:${requirement.competencyId}`);
    for (const id of profile.sopIds) if (!sopIds.has(id)) failures.push(`profile_sop_missing:${profile.professionalId}:${id}`);
    if (!deliverableIds.has(profile.primaryDeliverableId)) failures.push(`profile_deliverable_missing:${profile.professionalId}:${profile.primaryDeliverableId}`);
    for (const id of profile.capabilityQualificationIds) if (!qualificationIds.has(id)) failures.push(`profile_qualification_missing:${profile.professionalId}:${id}`);
    const metrics = new Set((professionalScorecardMetrics[profile.department] ?? []).map((item) => item.id));
    for (const id of profile.scorecardMetricIds) if (!metrics.has(id)) failures.push(`profile_scorecard_metric_missing:${profile.professionalId}:${id}`);
  }
  for (const deliverable of professionalDeliverableContracts) {
    if (!evidenceIds.has(deliverable.evidenceContractId)) failures.push(`deliverable_evidence_missing:${deliverable.id}:${deliverable.evidenceContractId}`);
    if (!qaIds.has(deliverable.qaContractId)) failures.push(`deliverable_qa_missing:${deliverable.id}:${deliverable.qaContractId}`);
  }
  for (const qualification of professionalCapabilityQualifications) {
    if (!competencyIds.has(qualification.requiredCompetencyId)) failures.push(`qualification_competency_missing:${qualification.id}:${qualification.requiredCompetencyId}`);
    if (!profileIds.has(qualification.professionalId) && !propertyIntelligenceProfessionalProfiles.some((item) => item.id === qualification.professionalId)) failures.push(`qualification_profile_missing:${qualification.id}:${qualification.professionalId}`);
    for (const id of qualification.deliverableIds) if (!deliverableIds.has(id) && id !== "neighborhood-intelligence") failures.push(`qualification_deliverable_missing:${qualification.id}:${id}`);
  }
  for (const department of departmentProfessionalizationProfiles) if (!professionalPromotionContracts.some((item) => item.department === department.department)) failures.push(`department_promotion_missing:${department.department}`);
  return { valid: failures.length === 0, failures: [...new Set(failures)] };
}

export function createProfessionalDefinitionRegistry(): ProfessionalDefinitionRegistryV1 {
  return { schemaVersion: "enterprise-professional-definition-registry-v1", profiles: professionalProfileContracts, competencies: professionalCompetencyContracts, sops: professionalSopContracts, evidence: professionalEvidenceContracts, qa: professionalQaContracts, deliverables: professionalDeliverableContracts, promotions: professionalPromotionContracts, capabilityQualifications: professionalCapabilityQualifications, scorecards: professionalScorecardMetrics, industryPacks: industryProfessionalizationPacks, propertyCompatibilityProfiles: propertyIntelligenceProfessionalProfiles.map(adaptPropertyIntelligenceProfile), graphValidation: validateProfessionalDefinitionGraph(), providerAuthorityGranted: false, externalExecutionGranted: false };
}

export function deriveProfessionalLifecycle(input: { professionalId: string; requiredCompetencyIds: string[]; certifications: ProfessionalCertificationRecordV1[]; remediationOpen: boolean; promotionPassed: boolean; now?: Date }): ProfessionalLifecycleDerivationV1 {
  const now = input.now ?? new Date();
  const activeCertified = new Set(input.certifications.filter((item) => item.professionalId === input.professionalId && item.state === "certified_internal" && (!item.expiresAt || new Date(item.expiresAt) > now)).map((item) => item.competencyId));
  const certified = input.requiredCompetencyIds.filter((id) => activeCertified.has(id)).length;
  let state: ProfessionalLifecycleState = certified === input.requiredCompetencyIds.length && input.requiredCompetencyIds.length > 0 ? "certified_internal" : "assessment_required";
  const reasons: string[] = [];
  if (certified < input.requiredCompetencyIds.length) reasons.push("required_certification_coverage_incomplete");
  if (input.remediationOpen) { state = "remediation_required"; reasons.push("open_remediation"); }
  else if (input.promotionPassed && state === "certified_internal") state = "pilot_validated";
  return { professionalId: input.professionalId, state, reasons, certificationCoverage: { certified, required: input.requiredCompetencyIds.length }, remediationOpen: input.remediationOpen, promotionPassed: input.promotionPassed, providerAuthorityGranted: false, externalExecutionGranted: false };
}

export function createEnterpriseProfessionalCompetencyLibraryReport() {
  return { initiative: "Enterprise Professional Competency Library", architectureAuthority: { workforce: "AI Workforce", missions: "Department OS", providers: "UEIP", execution: "Approval / Safety" }, registry: createProfessionalDefinitionRegistry(), competencies: enterpriseCompetencyDefinitions, sops: enterpriseSopDefinitions, evidenceStandards: professionalEvidenceStandards, qualityRubrics: professionalQualityRubrics, deliverables: professionalDeliverableDefinitions, compatibilityDefinitions: { competencies: enterpriseCompetencyDefinitions, sops: enterpriseSopDefinitions, evidenceStandards: professionalEvidenceStandards, qualityRubrics: professionalQualityRubrics, deliverables: professionalDeliverableDefinitions }, departments: departmentProfessionalizationProfiles, propertyIntelligenceCompatibilityProfiles: propertyIntelligenceProfessionalProfiles.map(adaptPropertyIntelligenceProfile), portfolio: createProfessionalPortfolioReport(), providerCalled: false, liveExecutionAllowed: false, externalWritesAllowed: false };
}
