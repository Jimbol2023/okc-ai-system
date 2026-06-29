-- Revenue execution spine: source attribution, advisory scoring, follow-up tasks,
-- pipeline movement, communication approval visibility, connector registry, and audit.

CREATE TABLE "RevenueAuditEvent" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL DEFAULT 'default',
  "actorId" TEXT,
  "action" TEXT NOT NULL,
  "targetType" TEXT NOT NULL,
  "targetId" TEXT,
  "requestId" TEXT,
  "source" TEXT NOT NULL,
  "result" TEXT NOT NULL DEFAULT 'success',
  "safeMetadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RevenueAuditEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RevenueLeadSource" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL DEFAULT 'default',
  "leadId" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "sourceType" TEXT NOT NULL,
  "sourceDetail" TEXT NOT NULL,
  "sourceRecordId" TEXT,
  "campaignName" TEXT,
  "campaignMedium" TEXT,
  "costCents" INTEGER,
  "confidence" INTEGER NOT NULL DEFAULT 60,
  "verified" BOOLEAN NOT NULL DEFAULT false,
  "importedBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RevenueLeadSource_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RevenueLeadScore" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL DEFAULT 'default',
  "leadId" TEXT NOT NULL,
  "score" INTEGER NOT NULL,
  "confidence" INTEGER NOT NULL,
  "priority" TEXT NOT NULL,
  "explanation" TEXT NOT NULL,
  "recommendedNextAction" TEXT NOT NULL,
  "missingData" JSONB NOT NULL,
  "scoreBreakdown" JSONB NOT NULL,
  "assumptions" JSONB NOT NULL,
  "dataUsed" JSONB NOT NULL,
  "advisoryOnly" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RevenueLeadScore_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RevenueTask" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL DEFAULT 'default',
  "leadId" TEXT,
  "title" TEXT NOT NULL,
  "taskType" TEXT NOT NULL,
  "priority" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'open',
  "recommendedAction" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "dueAt" TIMESTAMP(3),
  "assignedTo" TEXT,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT true,
  "source" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "completedAt" TIMESTAMP(3),
  CONSTRAINT "RevenueTask_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RevenuePipelineEvent" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL DEFAULT 'default',
  "leadId" TEXT NOT NULL,
  "fromStage" TEXT,
  "toStage" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "revenueOutcome" TEXT,
  "createdBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RevenuePipelineEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RevenueCommunicationEvent" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL DEFAULT 'default',
  "leadId" TEXT,
  "channel" TEXT NOT NULL,
  "direction" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "approvalStatus" TEXT NOT NULL DEFAULT 'pending_manual_approval',
  "provider" TEXT NOT NULL DEFAULT 'not_called',
  "providerCalled" BOOLEAN NOT NULL DEFAULT false,
  "messageSummary" TEXT,
  "requiresApproval" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RevenueCommunicationEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ConnectorDefinition" (
  "id" TEXT NOT NULL,
  "connectorKey" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'inactive',
  "version" TEXT NOT NULL DEFAULT '1.0.0',
  "supportsDryRun" BOOLEAN NOT NULL DEFAULT true,
  "providerCallsAllowed" BOOLEAN NOT NULL DEFAULT false,
  "requiredApprovals" JSONB NOT NULL,
  "safetyNotes" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ConnectorDefinition_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RevenueLeadSource_leadId_source_sourceDetail_key" ON "RevenueLeadSource"("leadId", "source", "sourceDetail");
CREATE UNIQUE INDEX "ConnectorDefinition_connectorKey_key" ON "ConnectorDefinition"("connectorKey");

CREATE INDEX "RevenueAuditEvent_tenantId_idx" ON "RevenueAuditEvent"("tenantId");
CREATE INDEX "RevenueAuditEvent_action_idx" ON "RevenueAuditEvent"("action");
CREATE INDEX "RevenueAuditEvent_targetType_targetId_idx" ON "RevenueAuditEvent"("targetType", "targetId");
CREATE INDEX "RevenueAuditEvent_source_idx" ON "RevenueAuditEvent"("source");
CREATE INDEX "RevenueAuditEvent_result_idx" ON "RevenueAuditEvent"("result");
CREATE INDEX "RevenueAuditEvent_createdAt_idx" ON "RevenueAuditEvent"("createdAt");

CREATE INDEX "RevenueLeadSource_tenantId_idx" ON "RevenueLeadSource"("tenantId");
CREATE INDEX "RevenueLeadSource_leadId_idx" ON "RevenueLeadSource"("leadId");
CREATE INDEX "RevenueLeadSource_source_idx" ON "RevenueLeadSource"("source");
CREATE INDEX "RevenueLeadSource_sourceType_idx" ON "RevenueLeadSource"("sourceType");
CREATE INDEX "RevenueLeadSource_campaignName_idx" ON "RevenueLeadSource"("campaignName");
CREATE INDEX "RevenueLeadSource_createdAt_idx" ON "RevenueLeadSource"("createdAt");

CREATE INDEX "RevenueLeadScore_tenantId_idx" ON "RevenueLeadScore"("tenantId");
CREATE INDEX "RevenueLeadScore_leadId_idx" ON "RevenueLeadScore"("leadId");
CREATE INDEX "RevenueLeadScore_score_idx" ON "RevenueLeadScore"("score");
CREATE INDEX "RevenueLeadScore_confidence_idx" ON "RevenueLeadScore"("confidence");
CREATE INDEX "RevenueLeadScore_priority_idx" ON "RevenueLeadScore"("priority");
CREATE INDEX "RevenueLeadScore_createdAt_idx" ON "RevenueLeadScore"("createdAt");

CREATE INDEX "RevenueTask_tenantId_idx" ON "RevenueTask"("tenantId");
CREATE INDEX "RevenueTask_leadId_idx" ON "RevenueTask"("leadId");
CREATE INDEX "RevenueTask_taskType_idx" ON "RevenueTask"("taskType");
CREATE INDEX "RevenueTask_priority_idx" ON "RevenueTask"("priority");
CREATE INDEX "RevenueTask_status_idx" ON "RevenueTask"("status");
CREATE INDEX "RevenueTask_dueAt_idx" ON "RevenueTask"("dueAt");
CREATE INDEX "RevenueTask_createdAt_idx" ON "RevenueTask"("createdAt");

CREATE INDEX "RevenuePipelineEvent_tenantId_idx" ON "RevenuePipelineEvent"("tenantId");
CREATE INDEX "RevenuePipelineEvent_leadId_idx" ON "RevenuePipelineEvent"("leadId");
CREATE INDEX "RevenuePipelineEvent_fromStage_idx" ON "RevenuePipelineEvent"("fromStage");
CREATE INDEX "RevenuePipelineEvent_toStage_idx" ON "RevenuePipelineEvent"("toStage");
CREATE INDEX "RevenuePipelineEvent_source_idx" ON "RevenuePipelineEvent"("source");
CREATE INDEX "RevenuePipelineEvent_createdAt_idx" ON "RevenuePipelineEvent"("createdAt");

CREATE INDEX "RevenueCommunicationEvent_tenantId_idx" ON "RevenueCommunicationEvent"("tenantId");
CREATE INDEX "RevenueCommunicationEvent_leadId_idx" ON "RevenueCommunicationEvent"("leadId");
CREATE INDEX "RevenueCommunicationEvent_channel_idx" ON "RevenueCommunicationEvent"("channel");
CREATE INDEX "RevenueCommunicationEvent_status_idx" ON "RevenueCommunicationEvent"("status");
CREATE INDEX "RevenueCommunicationEvent_approvalStatus_idx" ON "RevenueCommunicationEvent"("approvalStatus");
CREATE INDEX "RevenueCommunicationEvent_providerCalled_idx" ON "RevenueCommunicationEvent"("providerCalled");
CREATE INDEX "RevenueCommunicationEvent_createdAt_idx" ON "RevenueCommunicationEvent"("createdAt");

CREATE INDEX "ConnectorDefinition_category_idx" ON "ConnectorDefinition"("category");
CREATE INDEX "ConnectorDefinition_status_idx" ON "ConnectorDefinition"("status");
CREATE INDEX "ConnectorDefinition_providerCallsAllowed_idx" ON "ConnectorDefinition"("providerCallsAllowed");

ALTER TABLE "RevenueLeadSource" ADD CONSTRAINT "RevenueLeadSource_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RevenueLeadScore" ADD CONSTRAINT "RevenueLeadScore_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RevenueTask" ADD CONSTRAINT "RevenueTask_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RevenuePipelineEvent" ADD CONSTRAINT "RevenuePipelineEvent_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RevenueCommunicationEvent" ADD CONSTRAINT "RevenueCommunicationEvent_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
