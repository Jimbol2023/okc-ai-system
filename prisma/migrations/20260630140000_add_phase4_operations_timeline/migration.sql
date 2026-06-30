CREATE TABLE "OperationsTimelineEvent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "eventType" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "leadId" TEXT,
    "propertyAddress" TEXT,
    "campaignId" TEXT,
    "userId" TEXT,
    "aiAgent" TEXT,
    "connectorId" TEXT,
    "status" TEXT NOT NULL,
    "sourceLabel" TEXT NOT NULL,
    "reasonCodes" JSONB NOT NULL,
    "safeMetadata" JSONB NOT NULL,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OperationsTimelineEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "OperationsTimelineEvent_tenantId_idx" ON "OperationsTimelineEvent"("tenantId");
CREATE INDEX "OperationsTimelineEvent_eventType_idx" ON "OperationsTimelineEvent"("eventType");
CREATE INDEX "OperationsTimelineEvent_entityType_idx" ON "OperationsTimelineEvent"("entityType");
CREATE INDEX "OperationsTimelineEvent_entityId_idx" ON "OperationsTimelineEvent"("entityId");
CREATE INDEX "OperationsTimelineEvent_leadId_idx" ON "OperationsTimelineEvent"("leadId");
CREATE INDEX "OperationsTimelineEvent_propertyAddress_idx" ON "OperationsTimelineEvent"("propertyAddress");
CREATE INDEX "OperationsTimelineEvent_campaignId_idx" ON "OperationsTimelineEvent"("campaignId");
CREATE INDEX "OperationsTimelineEvent_userId_idx" ON "OperationsTimelineEvent"("userId");
CREATE INDEX "OperationsTimelineEvent_aiAgent_idx" ON "OperationsTimelineEvent"("aiAgent");
CREATE INDEX "OperationsTimelineEvent_connectorId_idx" ON "OperationsTimelineEvent"("connectorId");
CREATE INDEX "OperationsTimelineEvent_status_idx" ON "OperationsTimelineEvent"("status");
CREATE INDEX "OperationsTimelineEvent_sourceLabel_idx" ON "OperationsTimelineEvent"("sourceLabel");
CREATE INDEX "OperationsTimelineEvent_providerCalled_idx" ON "OperationsTimelineEvent"("providerCalled");
CREATE INDEX "OperationsTimelineEvent_sent_idx" ON "OperationsTimelineEvent"("sent");
CREATE INDEX "OperationsTimelineEvent_published_idx" ON "OperationsTimelineEvent"("published");
CREATE INDEX "OperationsTimelineEvent_liveExecutionAllowed_idx" ON "OperationsTimelineEvent"("liveExecutionAllowed");
CREATE INDEX "OperationsTimelineEvent_createdAt_idx" ON "OperationsTimelineEvent"("createdAt");
