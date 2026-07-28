CREATE TABLE "ProfessionalCase" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "caseType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "sourceLabel" TEXT NOT NULL,
    "sourceReference" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'intake',
    "leadProfessionalId" TEXT NOT NULL,
    "independentReviewerId" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "businessModule" TEXT NOT NULL DEFAULT 'ai-core',
    "evidenceSnapshot" JSONB NOT NULL,
    "limitations" JSONB NOT NULL,
    "dueAt" TIMESTAMP(3),
    "outcomeDueAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProfessionalCase_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProfessionalAssignment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "professionalId" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "assignmentRole" TEXT NOT NULL,
    "dependencyType" TEXT,
    "dependencyData" JSONB,
    "status" TEXT NOT NULL DEFAULT 'assigned',
    "claimedBy" TEXT,
    "claimedAt" TIMESTAMP(3),
    "leaseExpiresAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProfessionalAssignment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProfessionalContribution" (
    "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "caseId" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL, "version" INTEGER NOT NULL DEFAULT 1,
    "professionalId" TEXT NOT NULL, "department" TEXT NOT NULL,
    "contributionType" TEXT NOT NULL, "sourceLabel" TEXT NOT NULL,
    "sourceReferences" JSONB NOT NULL, "content" JSONB NOT NULL,
    "dataGap" BOOLEAN NOT NULL DEFAULT false, "limitations" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProfessionalContribution_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProfessionalReview" (
    "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "caseId" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL, "version" INTEGER NOT NULL DEFAULT 1,
    "deliverableId" TEXT NOT NULL, "generatorId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL, "status" TEXT NOT NULL,
    "rubricVersion" TEXT NOT NULL, "checks" JSONB NOT NULL,
    "blockingDefects" JSONB NOT NULL, "rationale" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProfessionalReview_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProfessionalDecision" (
    "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "caseId" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL, "version" INTEGER NOT NULL DEFAULT 1,
    "actorId" TEXT NOT NULL, "decision" TEXT NOT NULL, "rationale" TEXT NOT NULL,
    "evidenceReferences" JSONB NOT NULL, "executionAuthorized" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProfessionalDecision_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProfessionalOutcome" (
    "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "caseId" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL, "version" INTEGER NOT NULL DEFAULT 1,
    "recordedBy" TEXT NOT NULL, "sourceLabel" TEXT NOT NULL,
    "evidenceReferences" JSONB NOT NULL, "metrics" JSONB NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false, "learningApplied" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProfessionalOutcome_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProfessionalCaseEvent" (
    "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "caseId" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL, "version" INTEGER NOT NULL DEFAULT 1,
    "actorId" TEXT NOT NULL, "eventType" TEXT NOT NULL, "sourceLabel" TEXT NOT NULL,
    "sanitizedData" JSONB NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProfessionalCaseEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProfessionalCase_tenantId_idempotencyKey_key" ON "ProfessionalCase"("tenantId", "idempotencyKey");
CREATE UNIQUE INDEX "ProfessionalCase_id_tenantId_key" ON "ProfessionalCase"("id", "tenantId");
CREATE INDEX "ProfessionalCase_tenantId_status_createdAt_idx" ON "ProfessionalCase"("tenantId", "status", "createdAt");
CREATE INDEX "ProfessionalCase_tenantId_department_status_idx" ON "ProfessionalCase"("tenantId", "department", "status");
CREATE INDEX "ProfessionalCase_tenantId_leadProfessionalId_idx" ON "ProfessionalCase"("tenantId", "leadProfessionalId");

CREATE UNIQUE INDEX "ProfessionalAssignment_tenantId_idempotencyKey_key" ON "ProfessionalAssignment"("tenantId", "idempotencyKey");
CREATE INDEX "ProfessionalAssignment_tenantId_caseId_status_idx" ON "ProfessionalAssignment"("tenantId", "caseId", "status");
CREATE INDEX "ProfessionalAssignment_tenantId_professionalId_status_idx" ON "ProfessionalAssignment"("tenantId", "professionalId", "status");
CREATE INDEX "ProfessionalAssignment_tenantId_status_leaseExpiresAt_idx" ON "ProfessionalAssignment"("tenantId", "status", "leaseExpiresAt");

CREATE UNIQUE INDEX "ProfessionalContribution_tenantId_idempotencyKey_key" ON "ProfessionalContribution"("tenantId", "idempotencyKey");
CREATE INDEX "ProfessionalContribution_tenantId_caseId_createdAt_idx" ON "ProfessionalContribution"("tenantId", "caseId", "createdAt");
CREATE INDEX "ProfessionalContribution_tenantId_professionalId_createdAt_idx" ON "ProfessionalContribution"("tenantId", "professionalId", "createdAt");

CREATE UNIQUE INDEX "ProfessionalReview_tenantId_idempotencyKey_key" ON "ProfessionalReview"("tenantId", "idempotencyKey");
CREATE INDEX "ProfessionalReview_tenantId_caseId_createdAt_idx" ON "ProfessionalReview"("tenantId", "caseId", "createdAt");
CREATE INDEX "ProfessionalReview_tenantId_reviewerId_createdAt_idx" ON "ProfessionalReview"("tenantId", "reviewerId", "createdAt");

CREATE UNIQUE INDEX "ProfessionalDecision_tenantId_idempotencyKey_key" ON "ProfessionalDecision"("tenantId", "idempotencyKey");
CREATE INDEX "ProfessionalDecision_tenantId_caseId_createdAt_idx" ON "ProfessionalDecision"("tenantId", "caseId", "createdAt");
CREATE INDEX "ProfessionalDecision_tenantId_actorId_createdAt_idx" ON "ProfessionalDecision"("tenantId", "actorId", "createdAt");

CREATE UNIQUE INDEX "ProfessionalOutcome_tenantId_idempotencyKey_key" ON "ProfessionalOutcome"("tenantId", "idempotencyKey");
CREATE INDEX "ProfessionalOutcome_tenantId_caseId_createdAt_idx" ON "ProfessionalOutcome"("tenantId", "caseId", "createdAt");
CREATE INDEX "ProfessionalOutcome_tenantId_verified_createdAt_idx" ON "ProfessionalOutcome"("tenantId", "verified", "createdAt");

CREATE UNIQUE INDEX "ProfessionalCaseEvent_tenantId_idempotencyKey_key" ON "ProfessionalCaseEvent"("tenantId", "idempotencyKey");
CREATE INDEX "ProfessionalCaseEvent_tenantId_caseId_createdAt_idx" ON "ProfessionalCaseEvent"("tenantId", "caseId", "createdAt");
CREATE INDEX "ProfessionalCaseEvent_tenantId_eventType_createdAt_idx" ON "ProfessionalCaseEvent"("tenantId", "eventType", "createdAt");

ALTER TABLE "ProfessionalAssignment" ADD CONSTRAINT "ProfessionalAssignment_caseId_tenantId_fkey" FOREIGN KEY ("caseId", "tenantId") REFERENCES "ProfessionalCase"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProfessionalContribution" ADD CONSTRAINT "ProfessionalContribution_caseId_tenantId_fkey" FOREIGN KEY ("caseId", "tenantId") REFERENCES "ProfessionalCase"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProfessionalReview" ADD CONSTRAINT "ProfessionalReview_caseId_tenantId_fkey" FOREIGN KEY ("caseId", "tenantId") REFERENCES "ProfessionalCase"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProfessionalDecision" ADD CONSTRAINT "ProfessionalDecision_caseId_tenantId_fkey" FOREIGN KEY ("caseId", "tenantId") REFERENCES "ProfessionalCase"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProfessionalOutcome" ADD CONSTRAINT "ProfessionalOutcome_caseId_tenantId_fkey" FOREIGN KEY ("caseId", "tenantId") REFERENCES "ProfessionalCase"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProfessionalCaseEvent" ADD CONSTRAINT "ProfessionalCaseEvent_caseId_tenantId_fkey" FOREIGN KEY ("caseId", "tenantId") REFERENCES "ProfessionalCase"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
