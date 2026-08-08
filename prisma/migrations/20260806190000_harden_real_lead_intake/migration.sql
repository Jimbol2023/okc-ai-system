-- Additive governed intake hardening. No existing lead, intake, task, or approval data is rewritten.
ALTER TABLE "Lead"
  ADD COLUMN "consentStatus" TEXT NOT NULL DEFAULT 'unknown',
  ADD COLUMN "contactPermission" TEXT NOT NULL DEFAULT 'internal_review_only',
  ADD COLUMN "consentSource" TEXT,
  ADD COLUMN "consentAt" TIMESTAMP(3);

ALTER TABLE "ManualLeadIntake"
  ADD COLUMN "idempotencyKey" TEXT,
  ADD COLUMN "consentStatus" TEXT NOT NULL DEFAULT 'unknown',
  ADD COLUMN "contactPermission" TEXT NOT NULL DEFAULT 'internal_review_only',
  ADD COLUMN "doNotContact" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "optOutReason" TEXT,
  ADD COLUMN "consentSource" TEXT,
  ADD COLUMN "consentAt" TIMESTAMP(3);

ALTER TABLE "UnifiedApprovalItem" ADD COLUMN "idempotencyKey" TEXT;

CREATE TABLE "PublicIntakeRateLimit" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "fingerprint" TEXT NOT NULL,
  "windowStart" TIMESTAMP(3) NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 1,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PublicIntakeRateLimit_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ManualLeadIntake_tenantId_idempotencyKey_key" ON "ManualLeadIntake"("tenantId", "idempotencyKey");
CREATE UNIQUE INDEX "UnifiedApprovalItem_tenantId_idempotencyKey_key" ON "UnifiedApprovalItem"("tenantId", "idempotencyKey");
CREATE UNIQUE INDEX "PublicIntakeRateLimit_tenantId_fingerprint_windowStart_key" ON "PublicIntakeRateLimit"("tenantId", "fingerprint", "windowStart");
CREATE INDEX "PublicIntakeRateLimit_tenantId_windowStart_idx" ON "PublicIntakeRateLimit"("tenantId", "windowStart");
