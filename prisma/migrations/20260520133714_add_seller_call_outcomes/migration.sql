-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('new', 'contacted', 'negotiating', 'under_contract', 'closed');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "propertyAddress" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'new',
    "score" INTEGER NOT NULL DEFAULT 0,
    "priority" TEXT NOT NULL DEFAULT 'Low',
    "notes" TEXT,
    "payload" TEXT,
    "lastContactedAt" TIMESTAMP(3),
    "nextFollowUpAt" TIMESTAMP(3),
    "followUpCount" INTEGER NOT NULL DEFAULT 0,
    "lastFollowUpMessage" TEXT,
    "automationStatus" TEXT NOT NULL DEFAULT 'idle',
    "approvalStatus" TEXT NOT NULL DEFAULT 'pending_review',
    "isHot" BOOLEAN NOT NULL DEFAULT false,
    "lastSellerReply" TEXT,
    "lastSellerReplyAt" TIMESTAMP(3),
    "lastSellerReplyIntent" TEXT,
    "lastSellerReplyConfidence" DOUBLE PRECISION,
    "suggestedReply" TEXT,
    "requiresHumanApproval" BOOLEAN NOT NULL DEFAULT false,
    "doNotContact" BOOLEAN NOT NULL DEFAULT false,
    "optOutReason" TEXT,
    "optOutAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerCallOutcome" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "callCompletedAt" TIMESTAMP(3) NOT NULL,
    "operatorSummary" TEXT NOT NULL,
    "sellerMotivationSignal" TEXT NOT NULL,
    "sellerTimelineSignal" TEXT NOT NULL,
    "propertyConditionSignal" TEXT NOT NULL,
    "priceExpectationSignal" TEXT NOT NULL,
    "manualNextStep" TEXT NOT NULL,
    "safetyFlags" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SellerCallOutcome_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_score_createdAt_idx" ON "Lead"("score", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_nextFollowUpAt_idx" ON "Lead"("nextFollowUpAt");

-- CreateIndex
CREATE INDEX "Lead_approvalStatus_idx" ON "Lead"("approvalStatus");

-- CreateIndex
CREATE INDEX "Lead_isHot_idx" ON "Lead"("isHot");

-- CreateIndex
CREATE INDEX "Lead_doNotContact_idx" ON "Lead"("doNotContact");

-- CreateIndex
CREATE INDEX "Lead_lastSellerReplyIntent_idx" ON "Lead"("lastSellerReplyIntent");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_propertyAddress_phone_key" ON "Lead"("propertyAddress", "phone");

-- CreateIndex
CREATE INDEX "SellerCallOutcome_leadId_idx" ON "SellerCallOutcome"("leadId");

-- CreateIndex
CREATE INDEX "SellerCallOutcome_outcome_idx" ON "SellerCallOutcome"("outcome");

-- CreateIndex
CREATE INDEX "SellerCallOutcome_callCompletedAt_idx" ON "SellerCallOutcome"("callCompletedAt");

-- CreateIndex
CREATE INDEX "SellerCallOutcome_createdAt_idx" ON "SellerCallOutcome"("createdAt");
