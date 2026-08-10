CREATE TABLE "SecurityRateBucket" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "identifierHash" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "windowStartedAt" TIMESTAMP(3) NOT NULL,
    "blockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SecurityRateBucket_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SecurityEvent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "identifierHash" TEXT,
    "requestId" TEXT,
    "reasonCodes" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SecurityEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WebhookReceipt" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "messageIdHash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'received',
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    CONSTRAINT "WebhookReceipt_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SecurityRateBucket_tenantId_purpose_identifierHash_key" ON "SecurityRateBucket"("tenantId", "purpose", "identifierHash");
CREATE INDEX "SecurityRateBucket_tenantId_purpose_blockedUntil_idx" ON "SecurityRateBucket"("tenantId", "purpose", "blockedUntil");
CREATE INDEX "SecurityRateBucket_updatedAt_idx" ON "SecurityRateBucket"("updatedAt");
CREATE INDEX "SecurityEvent_tenantId_eventType_createdAt_idx" ON "SecurityEvent"("tenantId", "eventType", "createdAt");
CREATE INDEX "SecurityEvent_tenantId_eventType_identifierHash_idx" ON "SecurityEvent"("tenantId", "eventType", "identifierHash");
CREATE INDEX "SecurityEvent_createdAt_idx" ON "SecurityEvent"("createdAt");
CREATE UNIQUE INDEX "WebhookReceipt_tenantId_provider_messageIdHash_key" ON "WebhookReceipt"("tenantId", "provider", "messageIdHash");
CREATE INDEX "WebhookReceipt_tenantId_provider_receivedAt_idx" ON "WebhookReceipt"("tenantId", "provider", "receivedAt");
CREATE INDEX "WebhookReceipt_receivedAt_idx" ON "WebhookReceipt"("receivedAt");
