import { prisma } from "@/lib/prisma";
import {
  assertCertificationTransition,
  resolveProfessionalCompetencyDefinition,
  resolveProfessionalDeliverableDefinition,
  resolveProfessionalSopDefinition,
  validatePropertyIntelligenceProofGate,
  type EpcCertificationState,
  type ProfessionalOutcomeContractV1,
} from "@/lib/enterprise-professional-competency-library";
import {
  evaluateDepartmentPromotion,
  professionalCapabilityQualifications,
  professionalDepartments,
  professionalProfileContracts,
  type DepartmentProofMetricsV1,
  type ProfessionalDepartment,
} from "@/lib/enterprise-professional-operating-system";
import { listUniversalConnectorManifests } from "@/lib/universal-enterprise-integration-platform";
import { evaluateOperatingCompanyPilot, type ExecutiveDecision, type OperatingCompanyPilotCaseV1 } from "@/lib/enterprise-operating-company";

type TrustedActor = { tenantId: string; actorId: string };

function requiredText(value: unknown, field: string, max = 300) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) throw new Error(`invalid_${field}`);
  return value.trim();
}

function stringList(value: unknown, field: string, maxItems = 20) {
  if (!Array.isArray(value) || value.length > maxItems || value.some((item) => typeof item !== "string" || !item.trim() || item.length > 300)) throw new Error(`invalid_${field}`);
  return value.map((item) => item.trim());
}

function assertIdempotencyKey(value: string) {
  if (!/^[A-Za-z0-9._:-]{12,120}$/.test(value)) throw new Error("invalid_idempotency_key");
  return value;
}

export async function listTenantProfessionalRecords(tenantId: string) {
  const [assessments, certifications, outcomes, governance] = await Promise.all([
    prisma.epcAssessmentRecord.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.epcCertificationRecord.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.epcOutcomeEvent.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.epcGovernanceEvent.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" }, take: 200 }),
  ]);
  return { assessments, certifications, outcomes, governance };
}

export async function appendAssessmentRecord(input: { actor: TrustedActor; idempotencyKey: string; professionalId: unknown; profileVersion: unknown; competencyId: unknown; competencyVersion: unknown; assessmentMethod: unknown; evidenceReferences: unknown; result: unknown; reason: unknown }) {
  const idempotencyKey = assertIdempotencyKey(input.idempotencyKey);
  const professionalId = requiredText(input.professionalId, "professional_id");
  const profileVersion = requiredText(input.profileVersion, "profile_version", 40);
  const competencyId = requiredText(input.competencyId, "competency_id");
  const competencyVersion = requiredText(input.competencyVersion, "competency_version", 40);
  const assessmentMethod = requiredText(input.assessmentMethod, "assessment_method");
  const evidenceReferences = stringList(input.evidenceReferences, "evidence_references");
  const reason = requiredText(input.reason, "reason", 1000);
  if (input.result !== "passed" && input.result !== "failed") throw new Error("invalid_assessment_result");
  const result = input.result as "passed" | "failed";
  const definition = resolveProfessionalCompetencyDefinition(competencyId, competencyVersion);
  if (!definition) throw new Error("active_competency_definition_not_found");
  if (evidenceReferences.length === 0) throw new Error("assessment_evidence_required");
  return prisma.$transaction(async (tx) => {
    const record = await tx.epcAssessmentRecord.create({ data: { tenantId: input.actor.tenantId, professionalId, profileVersion, competencyId, competencyVersion, assessmentMethod, evidenceReferences, result, assessorId: input.actor.actorId, idempotencyKey } });
    await tx.epcGovernanceEvent.create({ data: { tenantId: input.actor.tenantId, actorId: input.actor.actorId, eventType: "assessment_recorded", subjectType: "professional_assessment", subjectId: record.id, reason, idempotencyKey: `${idempotencyKey}:audit`, sanitizedData: { professionalId, competencyId, competencyVersion, result, evidenceReferenceCount: evidenceReferences.length } } });
    return record;
  });
}

const certificationStates: EpcCertificationState[] = ["draft", "assessment_required", "assessment_failed", "certified_internal", "suspended", "recertification_required", "expired", "retired"];

export async function appendCertificationRecord(input: { actor: TrustedActor; idempotencyKey: string; professionalId: unknown; profileVersion: unknown; competencyId: unknown; competencyVersion: unknown; sopId: unknown; sopVersion: unknown; deliverableId: unknown; deliverableVersion: unknown; businessModule: unknown; state: unknown; assessmentRecordIds: unknown; reason: unknown; expiresAt?: unknown }) {
  const idempotencyKey = assertIdempotencyKey(input.idempotencyKey);
  const professionalId = requiredText(input.professionalId, "professional_id");
  const profileVersion = requiredText(input.profileVersion, "profile_version", 40);
  const competencyId = requiredText(input.competencyId, "competency_id");
  const competencyVersion = requiredText(input.competencyVersion, "competency_version", 40);
  const sopId = requiredText(input.sopId, "sop_id");
  const sopVersion = requiredText(input.sopVersion, "sop_version", 40);
  const deliverableId = requiredText(input.deliverableId, "deliverable_id");
  const deliverableVersion = requiredText(input.deliverableVersion, "deliverable_version", 40);
  const businessModule = requiredText(input.businessModule, "business_module");
  const assessmentRecordIds = stringList(input.assessmentRecordIds, "assessment_record_ids");
  const reason = requiredText(input.reason, "reason", 1000);
  if (!certificationStates.includes(input.state as EpcCertificationState)) throw new Error("invalid_certification_state");
  const state = input.state as EpcCertificationState;
  if (!resolveProfessionalCompetencyDefinition(competencyId, competencyVersion)) throw new Error("active_competency_definition_not_found");
  if (!resolveProfessionalSopDefinition(sopId, sopVersion)) throw new Error("active_sop_not_found");
  if (!resolveProfessionalDeliverableDefinition(deliverableId, deliverableVersion)) throw new Error("deliverable_definition_not_found");
  const expiresAt = input.expiresAt == null ? null : new Date(requiredText(input.expiresAt, "expires_at", 50));
  if (expiresAt && Number.isNaN(expiresAt.getTime())) throw new Error("invalid_expires_at");
  return prisma.$transaction(async (tx) => {
    const latest = await tx.epcCertificationRecord.findFirst({ where: { tenantId: input.actor.tenantId, professionalId, profileVersion, competencyId, competencyVersion, sopId, sopVersion, deliverableId, deliverableVersion, businessModule }, orderBy: { createdAt: "desc" } });
    if (latest) assertCertificationTransition(latest.state as EpcCertificationState, state);
    else if (state !== "draft" && state !== "assessment_required") throw new Error("initial_certification_state_must_require_assessment");
    if (state === "certified_internal") {
      if (assessmentRecordIds.length === 0) throw new Error("passing_assessment_required");
      const passed = await tx.epcAssessmentRecord.count({ where: { id: { in: assessmentRecordIds }, tenantId: input.actor.tenantId, professionalId, profileVersion, competencyId, competencyVersion, result: "passed" } });
      if (passed !== assessmentRecordIds.length) throw new Error("passing_assessment_scope_mismatch");
    }
    const record = await tx.epcCertificationRecord.create({ data: { tenantId: input.actor.tenantId, professionalId, profileVersion, competencyId, competencyVersion, sopId, sopVersion, deliverableId, deliverableVersion, businessModule, state, assessmentRecordIds, reason, certifiedBy: state === "certified_internal" ? input.actor.actorId : null, effectiveAt: new Date(), expiresAt, idempotencyKey } });
    await tx.epcGovernanceEvent.create({ data: { tenantId: input.actor.tenantId, actorId: input.actor.actorId, eventType: `certification_${state}`, subjectType: "professional_certification", subjectId: record.id, reason, idempotencyKey: `${idempotencyKey}:audit`, sanitizedData: { professionalId, competencyId, competencyVersion, sopId, sopVersion, deliverableId, deliverableVersion, businessModule, state } } });
    return record;
  });
}

export async function appendProfessionalOutcome(input: { actor: TrustedActor; idempotencyKey: string; outcome: ProfessionalOutcomeContractV1; reason: unknown }) {
  const idempotencyKey = assertIdempotencyKey(input.idempotencyKey);
  const reason = requiredText(input.reason, "reason", 1000);
  if (input.outcome.tenantId !== input.actor.tenantId) throw new Error("cross_tenant_outcome_blocked");
  if (!input.outcome.learningMayRecommendOnly) throw new Error("learning_authority_boundary_required");
  if (input.outcome.evidenceCompleteness < 0 || input.outcome.evidenceCompleteness > 100) throw new Error("invalid_evidence_completeness");
  return prisma.$transaction(async (tx) => {
    const record = await tx.epcOutcomeEvent.create({ data: { tenantId: input.actor.tenantId, department: input.outcome.department, professionalId: input.outcome.professionalId, profileVersion: input.outcome.profileVersion, deliverableId: input.outcome.deliverableId, deliverableVersion: input.outcome.deliverableVersion, payload: input.outcome, idempotencyKey } });
    await tx.epcGovernanceEvent.create({ data: { tenantId: input.actor.tenantId, actorId: input.actor.actorId, eventType: "professional_outcome_recorded", subjectType: "professional_outcome", subjectId: record.id, reason, idempotencyKey: `${idempotencyKey}:audit`, sanitizedData: { department: input.outcome.department, professionalId: input.outcome.professionalId, deliverableId: input.outcome.deliverableId, usefulnessRating: input.outcome.usefulnessRating, verifiedOutcomeRecorded: Boolean(input.outcome.verifiedOutcome) } } });
    return record;
  });
}

export async function appendPropertyProofGateRecord(input: { actor: TrustedActor; idempotencyKey: string; metrics: Parameters<typeof validatePropertyIntelligenceProofGate>[0]; reason: unknown }) {
  const idempotencyKey = assertIdempotencyKey(input.idempotencyKey);
  const reason = requiredText(input.reason, "reason", 1000);
  const result = validatePropertyIntelligenceProofGate(input.metrics);
  const record = await prisma.epcGovernanceEvent.create({ data: { tenantId: input.actor.tenantId, actorId: input.actor.actorId, eventType: "property_intelligence_proof_gate", subjectType: "department_promotion_gate", subjectId: "Property Intelligence", reason, idempotencyKey, sanitizedData: { result: result.status, failures: result.failures, metrics: input.metrics, operationalProofRecorded: true, providerCalled: false, externalWritesAllowed: false } } });
  return { record, result };
}

export async function appendDepartmentProofGateRecord(input: { actor: TrustedActor; idempotencyKey: string; department: unknown; metrics: DepartmentProofMetricsV1; reason: unknown }) {
  const idempotencyKey = assertIdempotencyKey(input.idempotencyKey);
  const reason = requiredText(input.reason, "reason", 1000);
  if (!professionalDepartments.includes(input.department as ProfessionalDepartment)) throw new Error("invalid_professional_department");
  const department = input.department as ProfessionalDepartment;
  if (!input.metrics || !Array.isArray(input.metrics.outcomeEvidenceReferences) || input.metrics.outcomeEvidenceReferences.some((item) => typeof item !== "string" || !item.trim())) throw new Error("invalid_promotion_evidence");
  const priorEvents = await prisma.epcGovernanceEvent.findMany({ where: { tenantId: input.actor.tenantId, eventType: { in: ["property_intelligence_proof_gate", "department_professional_promotion_gate"] } }, orderBy: { createdAt: "desc" } });
  const latestResults = new Map<ProfessionalDepartment, "failed" | "passed">();
  for (const event of priorEvents) {
    const data = event.sanitizedData;
    if (!data || typeof data !== "object" || Array.isArray(data)) continue;
    const result = "result" in data ? data.result : null;
    const recordedDepartment = event.eventType === "property_intelligence_proof_gate" ? "Property Intelligence" : "department" in data ? data.department : null;
    if (professionalDepartments.includes(recordedDepartment as ProfessionalDepartment) && (result === "passed" || result === "failed") && !latestResults.has(recordedDepartment as ProfessionalDepartment)) latestResults.set(recordedDepartment as ProfessionalDepartment, result);
  }
  const passedDepartments = [...latestResults.entries()].filter(([, result]) => result === "passed").map(([recordedDepartment]) => recordedDepartment);
  const result = evaluateDepartmentPromotion(department, input.metrics, passedDepartments);
  const record = await prisma.epcGovernanceEvent.create({ data: { tenantId: input.actor.tenantId, actorId: input.actor.actorId, eventType: "department_professional_promotion_gate", subjectType: "department_promotion_gate", subjectId: department, reason, idempotencyKey, sanitizedData: { department, result: result.status, failures: result.failures, resultingStage: result.resultingStage, metrics: input.metrics, automaticPromotion: false, providerAuthorityGranted: false, externalExecutionGranted: false } } });
  return { record, result };
}

export async function appendCapabilityQualificationRecord(input: { actor: TrustedActor; idempotencyKey: string; qualificationId: unknown; professionalId: unknown; evidenceReferences: unknown; expiresAt?: unknown; reason: unknown }) {
  const idempotencyKey = assertIdempotencyKey(input.idempotencyKey);
  const qualificationId = requiredText(input.qualificationId, "qualification_id");
  const professionalId = requiredText(input.professionalId, "professional_id");
  const evidenceReferences = stringList(input.evidenceReferences, "evidence_references");
  const reason = requiredText(input.reason, "reason", 1000);
  const definition = professionalCapabilityQualifications.find((item) => item.id === qualificationId && item.professionalId === professionalId);
  if (!definition) throw new Error("capability_qualification_definition_not_found");
  if (!professionalProfileContracts.some((item) => item.professionalId === professionalId) && professionalId !== "property-records-gis-analyst") throw new Error("professional_profile_not_found");
  if (evidenceReferences.length === 0) throw new Error("qualification_evidence_required");
  if (definition.registrationState !== "registered") throw new Error("planned_capability_cannot_be_qualified");
  const manifest = listUniversalConnectorManifests().find((item) => item.connectorId === definition.connectorId);
  if (!manifest?.capabilities.some((item) => item.capabilityKey === definition.capabilityKey)) throw new Error("ueip_capability_not_registered");
  const activeCertification = await prisma.epcCertificationRecord.findFirst({ where: { tenantId: input.actor.tenantId, professionalId, profileVersion: definition.profileVersion, competencyId: definition.requiredCompetencyId, state: "certified_internal", OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] }, orderBy: { createdAt: "desc" } });
  if (!activeCertification) throw new Error("active_required_competency_certification_missing");
  const expiresAt = input.expiresAt == null ? null : new Date(requiredText(input.expiresAt, "expires_at", 50));
  if (expiresAt && Number.isNaN(expiresAt.getTime())) throw new Error("invalid_expires_at");
  return prisma.epcGovernanceEvent.create({ data: { tenantId: input.actor.tenantId, actorId: input.actor.actorId, eventType: "professional_capability_qualified", subjectType: "professional_capability_qualification", subjectId: qualificationId, reason, idempotencyKey, sanitizedData: { qualificationId, professionalId, profileVersion: definition.profileVersion, connectorId: definition.connectorId, capabilityKey: definition.capabilityKey, evidenceReferences, expiresAt: expiresAt?.toISOString() ?? null, registrationState: definition.registrationState, providerAuthorityGranted: false, externalExecutionGranted: false } } });
}

export async function appendProfessionalRemediationRecord(input: { actor: TrustedActor; idempotencyKey: string; professionalId: unknown; failureCategory: unknown; rootCause: unknown; affectedDefinitionIds: unknown; correctiveAction: unknown; residualRisk: unknown; reason: unknown }) {
  const idempotencyKey = assertIdempotencyKey(input.idempotencyKey);
  const professionalId = requiredText(input.professionalId, "professional_id");
  if (!professionalProfileContracts.some((item) => item.professionalId === professionalId) && !professionalId.startsWith("property-")) throw new Error("professional_profile_not_found");
  const failureCategory = requiredText(input.failureCategory, "failure_category");
  const rootCause = requiredText(input.rootCause, "root_cause", 1000);
  const affectedDefinitionIds = stringList(input.affectedDefinitionIds, "affected_definition_ids");
  const correctiveAction = requiredText(input.correctiveAction, "corrective_action", 1000);
  const residualRisk = requiredText(input.residualRisk, "residual_risk", 1000);
  const reason = requiredText(input.reason, "reason", 1000);
  return prisma.epcGovernanceEvent.create({ data: { tenantId: input.actor.tenantId, actorId: input.actor.actorId, eventType: "professional_remediation_required", subjectType: "professional_remediation", subjectId: professionalId, reason, idempotencyKey, sanitizedData: { professionalId, lifecycleState: "remediation_required", failureCategory, rootCause, affectedDefinitionIds, correctiveAction, residualRisk, historicalEvidenceImmutable: true, autonomousDefinitionChangeAllowed: false } } });
}

const executiveDecisions: ExecutiveDecision[] = ["approve_manual_internal_step", "request_more_evidence", "return_for_remediation", "defer", "prioritize_connector_intake", "request_separate_execution_proposal"];

export async function appendCompanyDecisionEvidence(input: { actor: TrustedActor; idempotencyKey: string; caseId: unknown; inputSnapshotVersion: unknown; decision: unknown; rationale: unknown; evidenceReferences: unknown; reason: unknown }) {
  const idempotencyKey = assertIdempotencyKey(input.idempotencyKey);
  const caseId = requiredText(input.caseId, "case_id");
  const inputSnapshotVersion = requiredText(input.inputSnapshotVersion, "input_snapshot_version");
  if (!executiveDecisions.includes(input.decision as ExecutiveDecision)) throw new Error("invalid_executive_decision");
  const decision = input.decision as ExecutiveDecision;
  const rationale = requiredText(input.rationale, "rationale", 1000);
  const evidenceReferences = stringList(input.evidenceReferences, "evidence_references", 100);
  if (evidenceReferences.length === 0) throw new Error("company_decision_evidence_required");
  const reason = requiredText(input.reason, "reason", 1000);
  return prisma.epcGovernanceEvent.create({ data: { tenantId: input.actor.tenantId, actorId: input.actor.actorId, eventType: "operating_company_ceo_decision", subjectType: "company_outcome_case", subjectId: caseId, reason, idempotencyKey, sanitizedData: { caseId, inputSnapshotVersion, decision, rationale, evidenceReferences, decisionIsExecution: false, separateExecutionGateRequired: decision === "request_separate_execution_proposal", providerCalled: false, externalWritesAllowed: false } } });
}

export async function appendOperatingCompanyPilotEvidence(input: { actor: TrustedActor; idempotencyKey: string; records: OperatingCompanyPilotCaseV1[]; reason: unknown }) {
  const idempotencyKey = assertIdempotencyKey(input.idempotencyKey);
  if (!Array.isArray(input.records) || input.records.length > 100) throw new Error("invalid_operating_company_pilot_records");
  const reason = requiredText(input.reason, "reason", 1000);
  const result = evaluateOperatingCompanyPilot(input.records);
  const record = await prisma.epcGovernanceEvent.create({ data: { tenantId: input.actor.tenantId, actorId: input.actor.actorId, eventType: "operating_company_pilot_evidence", subjectType: "operating_company_promotion_readiness", subjectId: "J Capital Property Group", reason, idempotencyKey, sanitizedData: { result: result.status, criteria: result.criteria, metrics: result.metrics, failures: result.failures, caseIds: input.records.map((item) => item.caseId), promotionAutomatic: false, providerCalled: false, externalWritesAllowed: false } } });
  return { record, result };
}
