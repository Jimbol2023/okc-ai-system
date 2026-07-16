import type { AcquisitionDecisionBriefV1 } from "@/lib/enterprise-professional-workforce";
import {
  createGovernedProfessionalDeliverable,
  professionalDeliverableContracts,
  type GovernedEvidenceItemV1,
  type ProfessionalDepartment,
} from "@/lib/enterprise-professional-operating-system";
import type { RevenuePipelineDecisionBriefV1 } from "@/lib/enterprise-professional-competency-library";

export type CompanyCaseMode = "calibration" | "blind_validation" | "operational";
export type DepartmentWorkState = "assigned" | "working" | "waiting_dependency" | "qa_required" | "blocked" | "ready_for_executive_review" | "complete";
export type ExecutiveDecision = "approve_manual_internal_step" | "request_more_evidence" | "return_for_remediation" | "defer" | "prioritize_connector_intake" | "request_separate_execution_proposal";

export type DepartmentWorkAssignmentV1 = {
  assignmentId: string;
  caseId: string;
  department: ProfessionalDepartment;
  accountableProfessionalId: string;
  independentReviewerId: string;
  deliverableId: string;
  deliverableVersion: "1.0.0";
  certificationEligibility: "eligible" | "calibration_only" | "blocked";
  workState: DepartmentWorkState;
  serviceTarget: string;
  inputDependencies: string[];
  handoffDestination: string;
  blockers: string[];
  mode: CompanyCaseMode;
  providerAuthorityGranted: false;
  externalExecutionGranted: false;
};

export type DepartmentContributionV1 = {
  contributionId: string;
  caseId: string;
  department: ProfessionalDepartment;
  deliverableId: string;
  deliverableVersion: "1.0.0";
  inputSnapshotVersion: string;
  accountableProfessionalId: string;
  independentReviewerId: string;
  executiveSummary: string;
  verifiedFindings: string[];
  assumptions: string[];
  conflicts: string[];
  missingData: string[];
  risks: string[];
  recommendedManualDecision: string;
  qaStatus: "ready_for_internal_executive_review" | "blocked_remediation_required";
  certificationEligibility: DepartmentWorkAssignmentV1["certificationEligibility"];
  executiveUseEligible: boolean;
  output: unknown;
  advisoryOnly: true;
  humanReviewRequired: true;
  providerCalled: false;
  externalWritesAllowed: false;
};

export type CompanyOutcomeCaseV1 = {
  schemaVersion: "company-outcome-case-v1";
  tenantId: string;
  caseId: string;
  leadId: string;
  opportunityId: string | null;
  correlationId: string;
  businessQuestion: string;
  intendedOutcome: string;
  leadSource: string;
  inputSnapshotVersion: string;
  observationCutoff: string;
  mode: CompanyCaseMode;
  evidence: GovernedEvidenceItemV1[];
  assumptions: string[];
  conflicts: string[];
  uncertainty: string[];
  missingData: string[];
  assignments: DepartmentWorkAssignmentV1[];
  contributions: DepartmentContributionV1[];
  approvalSafetyEscalations: string[];
  ceoDecision: { decision: ExecutiveDecision; rationale: string; decidedBy: string; decidedAt: string } | null;
  verifiedOutcome: string | null;
  kpiContribution: string[];
  auditTimeline: Array<{ eventId: string; eventType: string; actorId: string; occurredAt: string; evidenceReferences: string[] }>;
  immutableSnapshot: true;
  advisoryOnly: true;
  providerCalled: false;
  externalWritesAllowed: false;
};

export type RevenuePipelineItemV1 = {
  leadId: string;
  source: string;
  stage: string;
  priority: string;
  score: number;
  updatedAt: string | null;
  responsibleHumanOwner: string;
  missingData: string[];
  buyerDemandAlignment: string;
  revenueDelayFactors: string[];
  evidenceIds: string[];
};

export type RevenueProfessionalInputSnapshotV1 = {
  tenantId: string;
  snapshotVersion: string;
  observedAt: string;
  staleAfterHours: number;
  pipelineItems: RevenuePipelineItemV1[];
  evidence: GovernedEvidenceItemV1[];
  connectorHealthMetadata: string[];
  assumptions: string[];
};

export type CompanyDecisionPacketV1 = {
  schemaVersion: "company-decision-packet-v1";
  tenantId: string;
  caseId: string;
  correlationId: string;
  inputSnapshotVersion: string;
  businessQuestion: string;
  executiveSummary: string;
  sharedVerifiedFacts: string[];
  departmentContributions: Array<{ department: ProfessionalDepartment; deliverableId: string; summary: string; qaStatus: DepartmentContributionV1["qaStatus"]; certificationEligibility: DepartmentContributionV1["certificationEligibility"] }>;
  visibleDisagreements: string[];
  missingEvidence: string[];
  uncertainty: string[];
  revenueImplications: string[];
  financialImplications: string[];
  connectorGaps: string[];
  governanceRisks: string[];
  prioritizedCeoDecision: ExecutiveDecision;
  decisionReason: string;
  responsibleHumanOwner: string;
  expectedOutcome: string;
  measurementDate: string | null;
  executiveReady: boolean;
  blockingReasons: string[];
  advisoryOnly: true;
  humanReviewRequired: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalWritesAllowed: false;
};

export type OperatingCompanyPilotCaseV1 = {
  caseId: string;
  cohort: "calibration" | "blind_validation";
  baselineReviewMinutes: number;
  assistedReviewMinutes: number;
  usefulnessRating: 1 | 2 | 3 | 4 | 5;
  inventedFacts: number;
  crossPropertyLeaks: number;
  unauthorizedActions: number;
  seededCriticalDefects: number;
  detectedSeededCriticalDefects: number;
  falseHighPriorityIncreased: boolean;
  leadSourceVisible: boolean;
  materialClaimsWithProvenance: boolean;
  assumptionsConflictsAndGapsVisible: boolean;
  responsibleHumanOwnerPresent: boolean;
  evidenceReferences: string[];
};

export type OperatingCompanyPilotResultV1 = {
  status: "calibration_required" | "blind_validation_required" | "ready_for_human_promotion_review";
  criteria: Record<string, boolean>;
  metrics: { calibrationCases: number; blindValidationCases: number; medianReviewTimeImprovementPercent: number; usefulOrBetterPercent: number; seededDefectDetectionPercent: number };
  failures: string[];
  promotionAutomatic: false;
  providerCalled: false;
  externalWritesAllowed: false;
};

export type OperatingCompanyScorecardV1 = {
  generatedAt: string;
  cases: number;
  executiveReadyCases: number;
  departmentCoverage: Record<ProfessionalDepartment, number>;
  qaFailures: number;
  sourceAttributionCoveragePercent: number;
  evidenceProvenanceCoveragePercent: number;
  unresolvedConflicts: number;
  providerCalled: false;
  externalWritesAllowed: false;
};

const departmentDefaults: Record<ProfessionalDepartment, { professional: string; reviewer: string; deliverable: string; dependencies: string[] }> = {
  "Property Intelligence": { professional: "chief-property-intelligence-officer", reviewer: "property-intelligence-quality-reviewer", deliverable: "acquisition-decision-brief", dependencies: [] },
  "Revenue Operations": { professional: "senior-revenue-analyst", reviewer: "revenue-quality-reviewer", deliverable: "revenue-pipeline-decision-brief", dependencies: ["Property Intelligence evidence when a property is involved"] },
  "Marketing Intelligence": { professional: "marketing-intelligence-director", reviewer: "marketing-quality-reviewer", deliverable: "marketing-performance-decision-brief", dependencies: ["lead source attribution"] },
  "Finance and Executive Analytics": { professional: "finance-analytics-director", reviewer: "financial-data-reviewer", deliverable: "executive-financial-decision-brief", dependencies: ["source-qualified revenue and cost evidence"] },
  "Creative Studio": { professional: "creative-director-professional", reviewer: "creative-quality-reviewer", deliverable: "creative-campaign-package", dependencies: ["approved internal Marketing or Revenue business brief"] },
};

function slug(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90) || "case"; }
function unique(values: string[]) { return [...new Set(values.filter((value) => value.trim().length > 0))]; }
function validIso(value: string | null) { if (!value) return null; const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date; }

export function createDepartmentWorkAssignments(input: { caseId: string; mode: CompanyCaseMode; certifiedProfessionalIds?: string[]; approvedCreativeBriefReference?: string | null }) {
  const certified = new Set(input.certifiedProfessionalIds ?? []);
  return (Object.entries(departmentDefaults) as Array<[ProfessionalDepartment, typeof departmentDefaults[ProfessionalDepartment]]>).map(([department, defaults]) => {
    const blockers: string[] = [];
    if (department === "Creative Studio" && !input.approvedCreativeBriefReference) blockers.push("approved_internal_business_brief_required");
    const certificationEligibility: DepartmentWorkAssignmentV1["certificationEligibility"] = certified.has(defaults.professional) && certified.has(defaults.reviewer) ? "eligible" : input.mode === "operational" ? "blocked" : "calibration_only";
    if (certificationEligibility === "blocked") blockers.push("required_professional_certification_missing");
    return { assignmentId: `assignment:${slug(`${input.caseId}:${department}`)}`, caseId: input.caseId, department, accountableProfessionalId: defaults.professional, independentReviewerId: defaults.reviewer, deliverableId: defaults.deliverable, deliverableVersion: "1.0.0" as const, certificationEligibility, workState: blockers.length ? "blocked" as const : "assigned" as const, serviceTarget: "Complete from the immutable case snapshot before the next CEO review cycle.", inputDependencies: defaults.dependencies, handoffDestination: "Executive Intelligence", blockers, mode: input.mode, providerAuthorityGranted: false as const, externalExecutionGranted: false as const };
  });
}

export function createRevenuePipelineDecisionBrief(input: { snapshot: RevenueProfessionalInputSnapshotV1; assignment: DepartmentWorkAssignmentV1; generatedAt?: string }): RevenuePipelineDecisionBriefV1 {
  if (input.assignment.department !== "Revenue Operations") throw new Error("revenue_assignment_required");
  if (input.assignment.accountableProfessionalId === input.assignment.independentReviewerId) throw new Error("independent_revenue_reviewer_required");
  const generatedAt = input.generatedAt ?? input.snapshot.observedAt;
  const observed = validIso(input.snapshot.observedAt);
  const stalled: string[] = [];
  const exceptions: string[] = [];
  const missing: string[] = [];
  const delayFactors: string[] = [];
  for (const item of input.snapshot.pipelineItems) {
    const updated = validIso(item.updatedAt);
    const ageHours = observed && updated ? (observed.getTime() - updated.getTime()) / 3_600_000 : null;
    if (!item.source.trim()) exceptions.push(`${item.leadId}:missing_source_attribution`);
    if (!updated) exceptions.push(`${item.leadId}:freshness_unknown`);
    else if (ageHours !== null && ageHours > input.snapshot.staleAfterHours) stalled.push(item.leadId);
    if (!item.responsibleHumanOwner.trim()) exceptions.push(`${item.leadId}:responsible_human_owner_missing`);
    missing.push(...item.missingData.map((value) => `${item.leadId}:${value}`));
    delayFactors.push(...item.revenueDelayFactors.map((value) => `${item.leadId}:${value}`));
  }
  const evidenceReferences = unique(input.snapshot.evidence.map((item) => item.sourceReference));
  const conflicts = unique(input.snapshot.evidence.flatMap((item) => item.conflicts));
  const qaPassed = exceptions.length === 0 && evidenceReferences.length > 0 && input.assignment.certificationEligibility !== "blocked";
  const owner = input.snapshot.pipelineItems.find((item) => item.responsibleHumanOwner.trim())?.responsibleHumanOwner ?? "CEO / Revenue Director";
  const manualAction = stalled.length ? `Manually review the oldest stalled opportunity: ${stalled[0]}.` : exceptions.length ? `Resolve the first pipeline exception: ${exceptions[0]}.` : "Manually review the highest-priority source-qualified pipeline opportunity.";
  return { deliverableId: "revenue-pipeline-decision-brief", deliverableVersion: "1.0.0", tenantId: input.snapshot.tenantId, inputSnapshotVersion: input.snapshot.snapshotVersion, generatedAt, evidenceReferences, assumptions: input.snapshot.assumptions, conflicts, missingData: unique(missing), generatorProfessionalId: input.assignment.accountableProfessionalId, reviewerProfessionalId: input.assignment.independentReviewerId, independentReviewPassed: qaPassed, permittedUse: "internal_executive_review_only", advisoryOnly: true, humanReviewRequired: true, providerCalled: false, externalWritesAllowed: false, pipelineExceptions: unique(exceptions), stalledOpportunities: unique(stalled), dataFreshness: observed ? `Evaluated at ${observed.toISOString()} with a ${input.snapshot.staleAfterHours}-hour stale threshold.` : "Observation cutoff is invalid; freshness is unavailable.", buyerDemandAlignment: input.snapshot.pipelineItems.map((item) => `${item.leadId}:${item.buyerDemandAlignment}`).join("; ") || "Buyer-demand alignment is unavailable.", revenueDelayFactors: unique(delayFactors), responsibleHumanOwner: owner, recommendedManualAction: manualAction };
}

export function createRevenueDepartmentContribution(input: { caseId: string; snapshot: RevenueProfessionalInputSnapshotV1; assignment: DepartmentWorkAssignmentV1 }) {
  const brief = createRevenuePipelineDecisionBrief(input);
  const blocked = !brief.independentReviewPassed;
  return { contributionId: `contribution:${slug(`${input.caseId}:revenue`)}`, caseId: input.caseId, department: "Revenue Operations" as const, deliverableId: brief.deliverableId, deliverableVersion: brief.deliverableVersion, inputSnapshotVersion: brief.inputSnapshotVersion, accountableProfessionalId: brief.generatorProfessionalId, independentReviewerId: brief.reviewerProfessionalId, executiveSummary: blocked ? "Revenue contribution is blocked pending pipeline evidence or certification remediation." : "Revenue pipeline exceptions and delay factors are ready for executive review.", verifiedFindings: [...brief.pipelineExceptions, ...brief.stalledOpportunities.map((id) => `${id}:stalled`)], assumptions: brief.assumptions, conflicts: brief.conflicts, missingData: brief.missingData, risks: blocked ? ["Revenue QA did not pass."] : [], recommendedManualDecision: brief.recommendedManualAction, qaStatus: blocked ? "blocked_remediation_required" as const : "ready_for_internal_executive_review" as const, certificationEligibility: input.assignment.certificationEligibility, executiveUseEligible: !blocked && input.assignment.certificationEligibility === "eligible", output: brief, advisoryOnly: true as const, humanReviewRequired: true as const, providerCalled: false as const, externalWritesAllowed: false as const } satisfies DepartmentContributionV1;
}

export function createPropertyDepartmentContribution(input: { caseId: string; assignment: DepartmentWorkAssignmentV1; brief: AcquisitionDecisionBriefV1 }) {
  const ready = input.brief.qa.status === "certified_for_internal_executive_review";
  return { contributionId: `contribution:${slug(`${input.caseId}:property`)}`, caseId: input.caseId, department: "Property Intelligence" as const, deliverableId: "acquisition-decision-brief", deliverableVersion: "1.0.0" as const, inputSnapshotVersion: input.brief.inputSnapshotVersion, accountableProfessionalId: input.assignment.accountableProfessionalId, independentReviewerId: input.brief.qa.reviewerProfessionalId, executiveSummary: input.brief.executiveSummary, verifiedFindings: input.brief.sections.filter((item) => item.status === "verified").map((item) => item.summary), assumptions: input.brief.sections.flatMap((item) => item.assumptions), conflicts: input.brief.sections.flatMap((item) => item.conflicts), missingData: input.brief.missingInformation, risks: input.brief.risks, recommendedManualDecision: input.brief.recommendedManualResearchAction.action, qaStatus: ready ? "ready_for_internal_executive_review" as const : "blocked_remediation_required" as const, certificationEligibility: input.assignment.certificationEligibility, executiveUseEligible: ready && input.assignment.certificationEligibility === "eligible", output: input.brief, advisoryOnly: true as const, humanReviewRequired: true as const, providerCalled: false as const, externalWritesAllowed: false as const } satisfies DepartmentContributionV1;
}

export function createStandardDepartmentContribution(input: { caseId: string; department: Exclude<ProfessionalDepartment, "Property Intelligence" | "Revenue Operations">; assignment: DepartmentWorkAssignmentV1; tenantId: string; businessQuestion: string; snapshotVersion: string; observationCutoff: string; evidence: GovernedEvidenceItemV1[]; assumptions: string[]; missingData: string[]; expectedBusinessValue: string; recommendedManualDecision: string }) {
  const output = createGovernedProfessionalDeliverable({ deliverableId: input.assignment.deliverableId, tenantId: input.tenantId, businessQuestion: input.businessQuestion, accountableOwner: input.assignment.accountableProfessionalId, inputSnapshotVersion: input.snapshotVersion, observationCutoff: input.observationCutoff, evidence: input.evidence, assumptions: input.assumptions, missingData: input.missingData, expectedBusinessValue: input.expectedBusinessValue, recommendedManualDecision: input.recommendedManualDecision, generatorProfessionalId: input.assignment.accountableProfessionalId, reviewerProfessionalId: input.assignment.independentReviewerId });
  const ready = output.qa.status === "ready_for_internal_executive_review";
  return { contributionId: `contribution:${slug(`${input.caseId}:${input.department}`)}`, caseId: input.caseId, department: input.department, deliverableId: input.assignment.deliverableId, deliverableVersion: "1.0.0" as const, inputSnapshotVersion: input.snapshotVersion, accountableProfessionalId: input.assignment.accountableProfessionalId, independentReviewerId: input.assignment.independentReviewerId, executiveSummary: output.executiveSummary, verifiedFindings: output.sourceQualifiedFindings.filter((item) => item.verificationState === "verified").map((item) => item.claim), assumptions: output.assumptions, conflicts: output.conflicts, missingData: output.missingData, risks: output.risks, recommendedManualDecision: output.recommendedManualDecision, qaStatus: output.qa.status, certificationEligibility: input.assignment.certificationEligibility, executiveUseEligible: ready && input.assignment.certificationEligibility === "eligible", output, advisoryOnly: true as const, humanReviewRequired: true as const, providerCalled: false as const, externalWritesAllowed: false as const } satisfies DepartmentContributionV1;
}

export function createCompanyOutcomeCase(input: { tenantId: string; caseId: string; leadId: string; opportunityId?: string | null; correlationId: string; businessQuestion: string; intendedOutcome: string; leadSource: string; inputSnapshotVersion: string; observationCutoff: string; mode: CompanyCaseMode; evidence: GovernedEvidenceItemV1[]; assumptions?: string[]; missingData?: string[]; certifiedProfessionalIds?: string[]; approvedCreativeBriefReference?: string | null; contributions?: DepartmentContributionV1[] }) {
  if (!input.tenantId.trim() || !input.caseId.trim() || !input.leadId.trim() || !input.correlationId.trim()) throw new Error("company_case_identity_required");
  if (!input.leadSource.trim()) throw new Error("lead_source_attribution_required");
  if (!input.inputSnapshotVersion.trim() || !validIso(input.observationCutoff)) throw new Error("valid_immutable_snapshot_required");
  if (input.evidence.some((item) => !item.sourceReference.trim())) throw new Error("evidence_provenance_required");
  const assignments = createDepartmentWorkAssignments({ caseId: input.caseId, mode: input.mode, certifiedProfessionalIds: input.certifiedProfessionalIds, approvedCreativeBriefReference: input.approvedCreativeBriefReference });
  return { schemaVersion: "company-outcome-case-v1", tenantId: input.tenantId, caseId: input.caseId, leadId: input.leadId, opportunityId: input.opportunityId ?? null, correlationId: input.correlationId, businessQuestion: input.businessQuestion, intendedOutcome: input.intendedOutcome, leadSource: input.leadSource, inputSnapshotVersion: input.inputSnapshotVersion, observationCutoff: input.observationCutoff, mode: input.mode, evidence: input.evidence, assumptions: input.assumptions ?? [], conflicts: unique(input.evidence.flatMap((item) => item.conflicts)), uncertainty: input.evidence.filter((item) => item.verificationState !== "verified").map((item) => `${item.evidenceId}:${item.verificationState}`), missingData: input.missingData ?? [], assignments, contributions: input.contributions ?? [], approvalSafetyEscalations: [], ceoDecision: null, verifiedOutcome: null, kpiContribution: [], auditTimeline: [{ eventId: `audit:${slug(`${input.caseId}:created`)}`, eventType: "company_case_created", actorId: "Executive Intelligence", occurredAt: input.observationCutoff, evidenceReferences: input.evidence.map((item) => item.evidenceId) }], immutableSnapshot: true, advisoryOnly: true, providerCalled: false, externalWritesAllowed: false } satisfies CompanyOutcomeCaseV1;
}

export function createCompanyDecisionPacket(input: { companyCase: CompanyOutcomeCaseV1; responsibleHumanOwner: string; expectedOutcome: string; measurementDate?: string | null; connectorGaps?: string[] }) {
  const contributions = input.companyCase.contributions;
  const ready = contributions.filter((item) => item.qaStatus === "ready_for_internal_executive_review");
  const blocked = contributions.filter((item) => item.qaStatus === "blocked_remediation_required");
  const executiveEligible = ready.filter((item) => item.executiveUseEligible);
  const blockingReasons = unique([...(contributions.length === 0 ? ["department_contributions_missing"] : []), ...blocked.map((item) => `${item.department}:qa_blocked`), ...(input.responsibleHumanOwner.trim() ? [] : ["responsible_human_owner_required"])]);
  const prioritizedCeoDecision: ExecutiveDecision = blocked.length || contributions.length === 0 ? "request_more_evidence" : executiveEligible.length === 0 ? "return_for_remediation" : "approve_manual_internal_step";
  const revenue = contributions.find((item) => item.department === "Revenue Operations");
  const finance = contributions.find((item) => item.department === "Finance and Executive Analytics");
  return { schemaVersion: "company-decision-packet-v1", tenantId: input.companyCase.tenantId, caseId: input.companyCase.caseId, correlationId: input.companyCase.correlationId, inputSnapshotVersion: input.companyCase.inputSnapshotVersion, businessQuestion: input.companyCase.businessQuestion, executiveSummary: blockingReasons.length ? `Company case has ${blockingReasons.length} blocking condition(s); executive review must remain remediation-oriented.` : "Cross-department analysis is ready for a manual CEO decision.", sharedVerifiedFacts: unique(contributions.flatMap((item) => item.verifiedFindings)), departmentContributions: contributions.map((item) => ({ department: item.department, deliverableId: item.deliverableId, summary: item.executiveSummary, qaStatus: item.qaStatus, certificationEligibility: item.certificationEligibility })), visibleDisagreements: unique([...input.companyCase.conflicts, ...contributions.flatMap((item) => item.conflicts)]), missingEvidence: unique([...input.companyCase.missingData, ...contributions.flatMap((item) => item.missingData)]), uncertainty: input.companyCase.uncertainty, revenueImplications: revenue ? [revenue.executiveSummary, revenue.recommendedManualDecision] : ["Revenue contribution unavailable."], financialImplications: finance ? [finance.executiveSummary, finance.recommendedManualDecision] : ["Finance contribution unavailable."], connectorGaps: input.connectorGaps ?? [], governanceRisks: unique([...input.companyCase.approvalSafetyEscalations, ...contributions.flatMap((item) => item.risks)]), prioritizedCeoDecision, decisionReason: blockingReasons.length ? blockingReasons.join("; ") : "All admitted contributions passed QA and at least one is certified for executive use.", responsibleHumanOwner: input.responsibleHumanOwner, expectedOutcome: input.expectedOutcome, measurementDate: input.measurementDate ?? null, executiveReady: blockingReasons.length === 0 && executiveEligible.length > 0, blockingReasons, advisoryOnly: true, humanReviewRequired: true, providerCalled: false, liveExecutionAllowed: false, externalWritesAllowed: false } satisfies CompanyDecisionPacketV1;
}

export function evaluateOperatingCompanyPilot(records: OperatingCompanyPilotCaseV1[]): OperatingCompanyPilotResultV1 {
  const calibration = records.filter((item) => item.cohort === "calibration");
  const validation = records.filter((item) => item.cohort === "blind_validation");
  const improvements = validation.map((item) => item.baselineReviewMinutes > 0 ? ((item.baselineReviewMinutes - item.assistedReviewMinutes) / item.baselineReviewMinutes) * 100 : 0).sort((a, b) => a - b);
  const median = improvements.length ? improvements[Math.floor(improvements.length / 2)] : 0;
  const useful = validation.length ? validation.filter((item) => item.usefulnessRating >= 4).length / validation.length * 100 : 0;
  const seeded = records.reduce((sum, item) => sum + item.seededCriticalDefects, 0);
  const detected = records.reduce((sum, item) => sum + item.detectedSeededCriticalDefects, 0);
  const criteria = { calibrationAtLeast10: calibration.length >= 10, blindValidationAtLeast20: validation.length >= 20, medianReviewTimeImprovementAtLeast25: median >= 25, usefulnessAtLeast80: useful >= 80, zeroInventedFacts: records.every((item) => item.inventedFacts === 0), zeroCrossPropertyLeaks: records.every((item) => item.crossPropertyLeaks === 0), zeroUnauthorizedActions: records.every((item) => item.unauthorizedActions === 0), allSeededCriticalDefectsDetected: seeded > 0 && detected === seeded, noFalseHighPriorityIncrease: records.every((item) => !item.falseHighPriorityIncreased), sourceAttributionVisible: records.every((item) => item.leadSourceVisible), materialClaimProvenanceComplete: records.every((item) => item.materialClaimsWithProvenance), assumptionsConflictsAndGapsVisible: records.every((item) => item.assumptionsConflictsAndGapsVisible), responsibleHumanOwnerPresent: records.every((item) => item.responsibleHumanOwnerPresent), outcomeEvidencePresent: records.every((item) => item.evidenceReferences.length > 0) };
  const failures = Object.entries(criteria).filter(([, passed]) => !passed).map(([id]) => id);
  const status = !criteria.calibrationAtLeast10 ? "calibration_required" : !Object.values(criteria).every(Boolean) ? "blind_validation_required" : "ready_for_human_promotion_review";
  return { status, criteria, metrics: { calibrationCases: calibration.length, blindValidationCases: validation.length, medianReviewTimeImprovementPercent: Math.round(median), usefulOrBetterPercent: Math.round(useful), seededDefectDetectionPercent: seeded ? Math.round(detected / seeded * 100) : 0 }, failures, promotionAutomatic: false, providerCalled: false, externalWritesAllowed: false };
}

export function createOperatingCompanyScorecard(cases: CompanyOutcomeCaseV1[]): OperatingCompanyScorecardV1 {
  const contributions = cases.flatMap((item) => item.contributions);
  const evidence = cases.flatMap((item) => item.evidence);
  const departmentCoverage = Object.fromEntries((["Property Intelligence", "Revenue Operations", "Marketing Intelligence", "Finance and Executive Analytics", "Creative Studio"] as ProfessionalDepartment[]).map((department) => [department, contributions.filter((item) => item.department === department).length])) as Record<ProfessionalDepartment, number>;
  return { generatedAt: new Date().toISOString(), cases: cases.length, executiveReadyCases: cases.filter((item) => item.contributions.some((contribution) => contribution.executiveUseEligible)).length, departmentCoverage, qaFailures: contributions.filter((item) => item.qaStatus === "blocked_remediation_required").length, sourceAttributionCoveragePercent: cases.length ? Math.round(cases.filter((item) => item.leadSource.trim()).length / cases.length * 100) : 0, evidenceProvenanceCoveragePercent: evidence.length ? Math.round(evidence.filter((item) => item.sourceReference.trim()).length / evidence.length * 100) : 0, unresolvedConflicts: cases.reduce((sum, item) => sum + item.conflicts.length, 0), providerCalled: false, externalWritesAllowed: false };
}

export function createEnterpriseOperatingCompanyReport() {
  return { initiative: "Enterprise Operating Company Pilot", primaryOutcome: "qualified seller-opportunity decision quality per CEO review hour", operatingChain: "Business Outcome -> Executive Intake -> Department Mandates -> Professional Analysis -> Evidence -> Independent QA -> Executive Synthesis -> CEO Decision -> Verified Outcome -> Promotion or Remediation", departments: Object.entries(departmentDefaults).map(([department, value]) => ({ department, primaryDeliverableId: value.deliverable, accountableProfessionalId: value.professional, independentReviewerId: value.reviewer })), deliverableContracts: professionalDeliverableContracts, companyCaseSchemaVersion: "company-outcome-case-v1", decisionPacketSchemaVersion: "company-decision-packet-v1", pilot: { calibrationCases: 10, blindValidationCases: 20, automaticPromotion: false }, providerCalled: false, liveExecutionAllowed: false, externalWritesAllowed: false };
}
