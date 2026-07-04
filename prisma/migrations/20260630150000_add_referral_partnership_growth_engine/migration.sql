-- Phase 4A Referral & Partnership Growth Engine.
-- Attribution-only foundation: no outreach, payouts, provider calls, scraping, or publishing.

CREATE TABLE "ReferralPartner" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "name" TEXT NOT NULL,
    "partnerType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferralPartner_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReferralLink" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "partnerId" TEXT,
    "referralCode" TEXT NOT NULL,
    "landingPage" TEXT NOT NULL,
    "campaign" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "leadCount" INTEGER NOT NULL DEFAULT 0,
    "qualifiedLeadCount" INTEGER NOT NULL DEFAULT 0,
    "closedDealCount" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferralLink_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReferralAttributionEvent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "partnerId" TEXT,
    "referralLinkId" TEXT,
    "leadId" TEXT,
    "eventType" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "landingPage" TEXT,
    "campaign" TEXT,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'tracked',
    "duplicateKey" TEXT,
    "safeMetadata" JSONB,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "outreachSent" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralAttributionEvent_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "MarketingDraft" ADD COLUMN "referralLink" TEXT;

CREATE UNIQUE INDEX "ReferralLink_referralCode_key" ON "ReferralLink"("referralCode");
CREATE UNIQUE INDEX "ReferralAttributionEvent_duplicateKey_key" ON "ReferralAttributionEvent"("duplicateKey");

CREATE INDEX "ReferralPartner_tenantId_idx" ON "ReferralPartner"("tenantId");
CREATE INDEX "ReferralPartner_partnerType_idx" ON "ReferralPartner"("partnerType");
CREATE INDEX "ReferralPartner_status_idx" ON "ReferralPartner"("status");
CREATE INDEX "ReferralPartner_createdAt_idx" ON "ReferralPartner"("createdAt");

CREATE INDEX "ReferralLink_tenantId_idx" ON "ReferralLink"("tenantId");
CREATE INDEX "ReferralLink_partnerId_idx" ON "ReferralLink"("partnerId");
CREATE INDEX "ReferralLink_status_idx" ON "ReferralLink"("status");
CREATE INDEX "ReferralLink_campaign_idx" ON "ReferralLink"("campaign");
CREATE INDEX "ReferralLink_createdAt_idx" ON "ReferralLink"("createdAt");

CREATE INDEX "ReferralAttributionEvent_tenantId_idx" ON "ReferralAttributionEvent"("tenantId");
CREATE INDEX "ReferralAttributionEvent_partnerId_idx" ON "ReferralAttributionEvent"("partnerId");
CREATE INDEX "ReferralAttributionEvent_referralLinkId_idx" ON "ReferralAttributionEvent"("referralLinkId");
CREATE INDEX "ReferralAttributionEvent_leadId_idx" ON "ReferralAttributionEvent"("leadId");
CREATE INDEX "ReferralAttributionEvent_eventType_idx" ON "ReferralAttributionEvent"("eventType");
CREATE INDEX "ReferralAttributionEvent_referralCode_idx" ON "ReferralAttributionEvent"("referralCode");
CREATE INDEX "ReferralAttributionEvent_campaign_idx" ON "ReferralAttributionEvent"("campaign");
CREATE INDEX "ReferralAttributionEvent_source_idx" ON "ReferralAttributionEvent"("source");
CREATE INDEX "ReferralAttributionEvent_status_idx" ON "ReferralAttributionEvent"("status");
CREATE INDEX "ReferralAttributionEvent_createdAt_idx" ON "ReferralAttributionEvent"("createdAt");

CREATE INDEX "MarketingDraft_referralLink_idx" ON "MarketingDraft"("referralLink");

ALTER TABLE "ReferralLink" ADD CONSTRAINT "ReferralLink_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "ReferralPartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ReferralAttributionEvent" ADD CONSTRAINT "ReferralAttributionEvent_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "ReferralPartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ReferralAttributionEvent" ADD CONSTRAINT "ReferralAttributionEvent_referralLinkId_fkey" FOREIGN KEY ("referralLinkId") REFERENCES "ReferralLink"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ReferralAttributionEvent" ADD CONSTRAINT "ReferralAttributionEvent_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
