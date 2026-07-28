CREATE TABLE "EpcAssessmentRecord" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "professionalId" TEXT NOT NULL,
  "profileVersion" TEXT NOT NULL,
  "competencyId" TEXT NOT NULL,
  "competencyVersion" TEXT NOT NULL,
  "assessmentMethod" TEXT NOT NULL,
  "evidenceReferences" JSONB NOT NULL,
  "result" TEXT NOT NULL,
  "assessorId" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EpcAssessmentRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EpcCertificationRecord" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "professionalId" TEXT NOT NULL,
  "profileVersion" TEXT NOT NULL,
  "competencyId" TEXT NOT NULL,
  "competencyVersion" TEXT NOT NULL,
  "sopId" TEXT NOT NULL,
  "sopVersion" TEXT NOT NULL,
  "deliverableId" TEXT NOT NULL,
  "deliverableVersion" TEXT NOT NULL,
  "businessModule" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "assessmentRecordIds" JSONB NOT NULL,
  "reason" TEXT NOT NULL,
  "certifiedBy" TEXT,
  "effectiveAt" TIMESTAMP(3) NOT NULL,
  "expiresAt" TIMESTAMP(3),
  "idempotencyKey" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EpcCertificationRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EpcOutcomeEvent" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "department" TEXT NOT NULL,
  "professionalId" TEXT NOT NULL,
  "profileVersion" TEXT NOT NULL,
  "deliverableId" TEXT NOT NULL,
  "deliverableVersion" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EpcOutcomeEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EpcGovernanceEvent" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "subjectType" TEXT NOT NULL,
  "subjectId" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "sanitizedData" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EpcGovernanceEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EpcAssessmentRecord_tenantId_idempotencyKey_key" ON "EpcAssessmentRecord"("tenantId", "idempotencyKey");
CREATE INDEX "EpcAssessmentRecord_tenantId_professionalId_competencyId_idx" ON "EpcAssessmentRecord"("tenantId", "professionalId", "competencyId");
CREATE INDEX "EpcAssessmentRecord_createdAt_idx" ON "EpcAssessmentRecord"("createdAt");
CREATE UNIQUE INDEX "EpcCertificationRecord_tenantId_idempotencyKey_key" ON "EpcCertificationRecord"("tenantId", "idempotencyKey");
CREATE INDEX "EpcCertificationRecord_tenantId_professionalId_competencyId_createdAt_idx" ON "EpcCertificationRecord"("tenantId", "professionalId", "competencyId", "createdAt");
CREATE INDEX "EpcCertificationRecord_state_idx" ON "EpcCertificationRecord"("state");
CREATE UNIQUE INDEX "EpcOutcomeEvent_tenantId_idempotencyKey_key" ON "EpcOutcomeEvent"("tenantId", "idempotencyKey");
CREATE INDEX "EpcOutcomeEvent_tenantId_department_createdAt_idx" ON "EpcOutcomeEvent"("tenantId", "department", "createdAt");
CREATE INDEX "EpcOutcomeEvent_professionalId_idx" ON "EpcOutcomeEvent"("professionalId");
CREATE UNIQUE INDEX "EpcGovernanceEvent_tenantId_idempotencyKey_key" ON "EpcGovernanceEvent"("tenantId", "idempotencyKey");
CREATE INDEX "EpcGovernanceEvent_tenantId_eventType_createdAt_idx" ON "EpcGovernanceEvent"("tenantId", "eventType", "createdAt");
CREATE INDEX "EpcGovernanceEvent_subjectType_subjectId_idx" ON "EpcGovernanceEvent"("subjectType", "subjectId");
