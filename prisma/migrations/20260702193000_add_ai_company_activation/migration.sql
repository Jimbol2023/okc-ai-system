CREATE TABLE "AiCompanyExecutiveDirective" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "title" TEXT NOT NULL,
    "businessGoal" TEXT NOT NULL,
    "sourceDepartment" TEXT NOT NULL,
    "assignedDepartments" JSONB NOT NULL,
    "requestedOutputs" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'awaiting_ceo_approval',
    "workflowState" TEXT NOT NULL DEFAULT 'awaiting_ceo_approval',
    "riskLevel" TEXT NOT NULL DEFAULT 'medium',
    "expectedBusinessValue" TEXT NOT NULL,
    "governanceNotes" JSONB NOT NULL,
    "revenuePriorityScore" JSONB NOT NULL,
    "reviewReminderAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiCompanyExecutiveDirective_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiCompanyWorkAssignment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "directiveId" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "assignmentType" TEXT NOT NULL DEFAULT 'department_work',
    "requestedOutputs" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending_internal_work',
    "blocker" TEXT,
    "approvalRequired" BOOLEAN NOT NULL DEFAULT true,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiCompanyWorkAssignment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiCompanyDraftQueueItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "directiveId" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "ownerDepartment" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft_required',
    "sourceLabel" TEXT NOT NULL,
    "approvalRequired" BOOLEAN NOT NULL DEFAULT true,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiCompanyDraftQueueItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiCompanyDecisionLog" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "directiveId" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "note" TEXT,
    "decidedBy" TEXT,
    "previousStatus" TEXT NOT NULL,
    "resultingStatus" TEXT NOT NULL,
    "reviewReminderAt" TIMESTAMP(3),
    "safetyFlags" JSONB NOT NULL,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiCompanyDecisionLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AiCompanyExecutiveDirective_tenantId_idx" ON "AiCompanyExecutiveDirective"("tenantId");
CREATE INDEX "AiCompanyExecutiveDirective_status_idx" ON "AiCompanyExecutiveDirective"("status");
CREATE INDEX "AiCompanyExecutiveDirective_workflowState_idx" ON "AiCompanyExecutiveDirective"("workflowState");
CREATE INDEX "AiCompanyExecutiveDirective_riskLevel_idx" ON "AiCompanyExecutiveDirective"("riskLevel");
CREATE INDEX "AiCompanyExecutiveDirective_providerCalled_idx" ON "AiCompanyExecutiveDirective"("providerCalled");
CREATE INDEX "AiCompanyExecutiveDirective_liveExecutionAllowed_idx" ON "AiCompanyExecutiveDirective"("liveExecutionAllowed");

CREATE INDEX "AiCompanyWorkAssignment_tenantId_idx" ON "AiCompanyWorkAssignment"("tenantId");
CREATE INDEX "AiCompanyWorkAssignment_directiveId_idx" ON "AiCompanyWorkAssignment"("directiveId");
CREATE INDEX "AiCompanyWorkAssignment_department_idx" ON "AiCompanyWorkAssignment"("department");
CREATE INDEX "AiCompanyWorkAssignment_status_idx" ON "AiCompanyWorkAssignment"("status");
CREATE INDEX "AiCompanyWorkAssignment_approvalRequired_idx" ON "AiCompanyWorkAssignment"("approvalRequired");
CREATE UNIQUE INDEX "AiCompanyWorkAssignment_directiveId_department_assignmentType_key" ON "AiCompanyWorkAssignment"("directiveId", "department", "assignmentType");

CREATE INDEX "AiCompanyDraftQueueItem_tenantId_idx" ON "AiCompanyDraftQueueItem"("tenantId");
CREATE INDEX "AiCompanyDraftQueueItem_directiveId_idx" ON "AiCompanyDraftQueueItem"("directiveId");
CREATE INDEX "AiCompanyDraftQueueItem_ownerDepartment_idx" ON "AiCompanyDraftQueueItem"("ownerDepartment");
CREATE INDEX "AiCompanyDraftQueueItem_status_idx" ON "AiCompanyDraftQueueItem"("status");
CREATE INDEX "AiCompanyDraftQueueItem_approvalRequired_idx" ON "AiCompanyDraftQueueItem"("approvalRequired");
CREATE UNIQUE INDEX "AiCompanyDraftQueueItem_directiveId_output_key" ON "AiCompanyDraftQueueItem"("directiveId", "output");

CREATE INDEX "AiCompanyDecisionLog_tenantId_idx" ON "AiCompanyDecisionLog"("tenantId");
CREATE INDEX "AiCompanyDecisionLog_directiveId_idx" ON "AiCompanyDecisionLog"("directiveId");
CREATE INDEX "AiCompanyDecisionLog_decision_idx" ON "AiCompanyDecisionLog"("decision");
CREATE INDEX "AiCompanyDecisionLog_resultingStatus_idx" ON "AiCompanyDecisionLog"("resultingStatus");
CREATE INDEX "AiCompanyDecisionLog_providerCalled_idx" ON "AiCompanyDecisionLog"("providerCalled");
CREATE INDEX "AiCompanyDecisionLog_createdAt_idx" ON "AiCompanyDecisionLog"("createdAt");

ALTER TABLE "AiCompanyWorkAssignment" ADD CONSTRAINT "AiCompanyWorkAssignment_directiveId_fkey" FOREIGN KEY ("directiveId") REFERENCES "AiCompanyExecutiveDirective"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AiCompanyDraftQueueItem" ADD CONSTRAINT "AiCompanyDraftQueueItem_directiveId_fkey" FOREIGN KEY ("directiveId") REFERENCES "AiCompanyExecutiveDirective"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AiCompanyDecisionLog" ADD CONSTRAINT "AiCompanyDecisionLog_directiveId_fkey" FOREIGN KEY ("directiveId") REFERENCES "AiCompanyExecutiveDirective"("id") ON DELETE CASCADE ON UPDATE CASCADE;
