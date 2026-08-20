ALTER TABLE "ConnectorExecutionAttempt"
ADD COLUMN "idempotencyKey" TEXT,
ADD COLUMN "resultClassification" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN "queryCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "costCents" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "creditsUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "completedAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "ConnectorExecutionAttempt_tenantId_idempotencyKey_key" ON "ConnectorExecutionAttempt"("tenantId", "idempotencyKey");
CREATE INDEX "ConnectorExecutionAttempt_idempotencyKey_idx" ON "ConnectorExecutionAttempt"("idempotencyKey");
CREATE INDEX "ConnectorExecutionAttempt_resultClassification_idx" ON "ConnectorExecutionAttempt"("resultClassification");
CREATE INDEX "ConnectorExecutionAttempt_startedAt_idx" ON "ConnectorExecutionAttempt"("startedAt");
CREATE INDEX "ConnectorExecutionAttempt_completedAt_idx" ON "ConnectorExecutionAttempt"("completedAt");
