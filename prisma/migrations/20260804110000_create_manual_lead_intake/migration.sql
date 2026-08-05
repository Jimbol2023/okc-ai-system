-- Repair the historical migration gap introduced when ManualLeadIntake was added
-- to the Prisma schema without a corresponding database migration.
-- This prerequisite intentionally creates the pre-tenant shape. The immediately
-- following tenant migration adds the required tenantId column and index.
BEGIN;

CREATE TABLE "ManualLeadIntake" (
    "id" TEXT NOT NULL,
    "leadId" TEXT,
    "source" TEXT NOT NULL,
    "sourceLabel" TEXT NOT NULL,
    "sellerName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "socialHandle" TEXT,
    "propertyAddress" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "notes" TEXT NOT NULL,
    "captureContext" TEXT NOT NULL,
    "intakeStatus" TEXT NOT NULL DEFAULT 'pending_review',
    "manualReviewStatus" TEXT NOT NULL DEFAULT 'needs_manual_review',
    "safetyFlags" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManualLeadIntake_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ManualLeadIntake_leadId_idx" ON "ManualLeadIntake"("leadId");
CREATE INDEX "ManualLeadIntake_source_idx" ON "ManualLeadIntake"("source");
CREATE INDEX "ManualLeadIntake_sourceLabel_idx" ON "ManualLeadIntake"("sourceLabel");
CREATE INDEX "ManualLeadIntake_intakeStatus_idx" ON "ManualLeadIntake"("intakeStatus");
CREATE INDEX "ManualLeadIntake_manualReviewStatus_idx" ON "ManualLeadIntake"("manualReviewStatus");
CREATE INDEX "ManualLeadIntake_createdAt_idx" ON "ManualLeadIntake"("createdAt");

ALTER TABLE "ManualLeadIntake"
    ADD CONSTRAINT "ManualLeadIntake_leadId_fkey"
    FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT;
