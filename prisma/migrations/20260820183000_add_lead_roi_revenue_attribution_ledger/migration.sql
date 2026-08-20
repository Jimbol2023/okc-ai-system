CREATE TABLE "RevenueAttributionChain" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL DEFAULT 'default',
  "chainKey" TEXT NOT NULL,
  "sourceType" TEXT NOT NULL,
  "sourceDetail" TEXT NOT NULL,
  "campaignId" TEXT,
  "referralCode" TEXT,
  "landingPage" TEXT,
  "leadId" TEXT,
  "propertyCandidateId" TEXT,
  "propertyOpportunityId" TEXT,
  "appointmentReference" TEXT,
  "contractReference" TEXT,
  "closingReference" TEXT,
  "financeEntryId" TEXT,
  "businessOutcomeEventId" TEXT,
  "attributionStatus" TEXT NOT NULL DEFAULT 'active',
  "dataQualityStatus" TEXT NOT NULL DEFAULT 'PARTIAL',
  "evidenceSource" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RevenueAttributionChain_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SourceSpend" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL DEFAULT 'default',
  "idempotencyKey" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "campaign" TEXT,
  "periodStart" TIMESTAMP(3) NOT NULL,
  "periodEnd" TIMESTAMP(3) NOT NULL,
  "spendCents" INTEGER NOT NULL DEFAULT 0,
  "creditsConsumed" INTEGER NOT NULL DEFAULT 0,
  "providerFeesCents" INTEGER NOT NULL DEFAULT 0,
  "mailSpendCents" INTEGER NOT NULL DEFAULT 0,
  "adSpendCents" INTEGER NOT NULL DEFAULT 0,
  "otherSpendCents" INTEGER NOT NULL DEFAULT 0,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "recordedBy" TEXT NOT NULL,
  "evidenceSource" TEXT NOT NULL,
  "verificationStatus" TEXT NOT NULL DEFAULT 'PARTIAL',
  "businessContext" TEXT NOT NULL DEFAULT 'real_business',
  "isTestRecord" BOOLEAN NOT NULL DEFAULT false,
  "correctedById" TEXT,
  "correctionReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SourceSpend_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LeadOutcomeEvent" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL DEFAULT 'default',
  "idempotencyKey" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "propertyCandidateId" TEXT,
  "propertyOpportunityId" TEXT,
  "outcome" TEXT NOT NULL,
  "occurredAt" TIMESTAMP(3) NOT NULL,
  "actorId" TEXT NOT NULL,
  "evidence" JSONB NOT NULL,
  "sourceType" TEXT NOT NULL,
  "sourceDetail" TEXT NOT NULL,
  "campaignId" TEXT,
  "referralCode" TEXT,
  "landingPage" TEXT,
  "attributionChainKey" TEXT NOT NULL,
  "businessOutcomeEventId" TEXT,
  "verificationStatus" TEXT NOT NULL DEFAULT 'PARTIAL',
  "businessContext" TEXT NOT NULL DEFAULT 'real_business',
  "isTestRecord" BOOLEAN NOT NULL DEFAULT false,
  "correctedById" TEXT,
  "correctionReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LeadOutcomeEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AppointmentOutcomeEvent" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL DEFAULT 'default',
  "idempotencyKey" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "propertyOpportunityId" TEXT,
  "appointmentReference" TEXT NOT NULL,
  "scheduledAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "outcome" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "evidence" JSONB NOT NULL,
  "sourceType" TEXT NOT NULL,
  "sourceDetail" TEXT NOT NULL,
  "campaignId" TEXT,
  "referralCode" TEXT,
  "landingPage" TEXT,
  "attributionChainKey" TEXT NOT NULL,
  "businessOutcomeEventId" TEXT,
  "verificationStatus" TEXT NOT NULL DEFAULT 'PARTIAL',
  "businessContext" TEXT NOT NULL DEFAULT 'real_business',
  "isTestRecord" BOOLEAN NOT NULL DEFAULT false,
  "correctedById" TEXT,
  "correctionReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AppointmentOutcomeEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContractOutcomeEvent" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL DEFAULT 'default',
  "idempotencyKey" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "propertyOpportunityId" TEXT,
  "contractReference" TEXT NOT NULL,
  "outcome" TEXT NOT NULL,
  "signedAt" TIMESTAMP(3),
  "expectedValueCents" INTEGER,
  "actorId" TEXT NOT NULL,
  "evidence" JSONB NOT NULL,
  "sourceType" TEXT NOT NULL,
  "sourceDetail" TEXT NOT NULL,
  "campaignId" TEXT,
  "referralCode" TEXT,
  "landingPage" TEXT,
  "attributionChainKey" TEXT NOT NULL,
  "businessOutcomeEventId" TEXT,
  "verificationStatus" TEXT NOT NULL DEFAULT 'PARTIAL',
  "businessContext" TEXT NOT NULL DEFAULT 'real_business',
  "isTestRecord" BOOLEAN NOT NULL DEFAULT false,
  "correctedById" TEXT,
  "correctionReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ContractOutcomeEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClosedRevenueOutcomeEvent" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL DEFAULT 'default',
  "idempotencyKey" TEXT NOT NULL,
  "leadId" TEXT,
  "propertyOpportunityId" TEXT,
  "contractReference" TEXT,
  "closingReference" TEXT NOT NULL,
  "revenueType" TEXT NOT NULL,
  "grossRevenueCents" INTEGER NOT NULL,
  "directCostCents" INTEGER NOT NULL DEFAULT 0,
  "netRevenueCents" INTEGER NOT NULL,
  "closedAt" TIMESTAMP(3) NOT NULL,
  "verificationSource" TEXT NOT NULL,
  "financeEntryId" TEXT,
  "businessOutcomeEventId" TEXT,
  "sourceType" TEXT NOT NULL,
  "sourceDetail" TEXT NOT NULL,
  "campaignId" TEXT,
  "referralCode" TEXT,
  "landingPage" TEXT,
  "attributionChainKey" TEXT NOT NULL,
  "verificationStatus" TEXT NOT NULL DEFAULT 'VERIFIED',
  "businessContext" TEXT NOT NULL DEFAULT 'real_business',
  "isTestRecord" BOOLEAN NOT NULL DEFAULT false,
  "correctedById" TEXT,
  "correctionReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ClosedRevenueOutcomeEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RevenueAttributionChain_tenantId_chainKey_key" ON "RevenueAttributionChain"("tenantId", "chainKey");
CREATE INDEX "RevenueAttributionChain_tenantId_idx" ON "RevenueAttributionChain"("tenantId");
CREATE INDEX "RevenueAttributionChain_sourceType_idx" ON "RevenueAttributionChain"("sourceType");
CREATE INDEX "RevenueAttributionChain_sourceDetail_idx" ON "RevenueAttributionChain"("sourceDetail");
CREATE INDEX "RevenueAttributionChain_campaignId_idx" ON "RevenueAttributionChain"("campaignId");
CREATE INDEX "RevenueAttributionChain_referralCode_idx" ON "RevenueAttributionChain"("referralCode");
CREATE INDEX "RevenueAttributionChain_landingPage_idx" ON "RevenueAttributionChain"("landingPage");
CREATE INDEX "RevenueAttributionChain_leadId_idx" ON "RevenueAttributionChain"("leadId");
CREATE INDEX "RevenueAttributionChain_propertyCandidateId_idx" ON "RevenueAttributionChain"("propertyCandidateId");
CREATE INDEX "RevenueAttributionChain_propertyOpportunityId_idx" ON "RevenueAttributionChain"("propertyOpportunityId");
CREATE INDEX "RevenueAttributionChain_appointmentReference_idx" ON "RevenueAttributionChain"("appointmentReference");
CREATE INDEX "RevenueAttributionChain_contractReference_idx" ON "RevenueAttributionChain"("contractReference");
CREATE INDEX "RevenueAttributionChain_closingReference_idx" ON "RevenueAttributionChain"("closingReference");
CREATE INDEX "RevenueAttributionChain_financeEntryId_idx" ON "RevenueAttributionChain"("financeEntryId");
CREATE INDEX "RevenueAttributionChain_businessOutcomeEventId_idx" ON "RevenueAttributionChain"("businessOutcomeEventId");
CREATE INDEX "RevenueAttributionChain_attributionStatus_idx" ON "RevenueAttributionChain"("attributionStatus");
CREATE INDEX "RevenueAttributionChain_dataQualityStatus_idx" ON "RevenueAttributionChain"("dataQualityStatus");
CREATE INDEX "RevenueAttributionChain_createdAt_idx" ON "RevenueAttributionChain"("createdAt");

CREATE UNIQUE INDEX "SourceSpend_tenantId_idempotencyKey_key" ON "SourceSpend"("tenantId", "idempotencyKey");
CREATE UNIQUE INDEX "SourceSpend_tenantId_source_campaign_periodStart_periodEnd_evidenceSource_key" ON "SourceSpend"("tenantId", "source", "campaign", "periodStart", "periodEnd", "evidenceSource");
CREATE INDEX "SourceSpend_tenantId_idx" ON "SourceSpend"("tenantId");
CREATE INDEX "SourceSpend_source_idx" ON "SourceSpend"("source");
CREATE INDEX "SourceSpend_campaign_idx" ON "SourceSpend"("campaign");
CREATE INDEX "SourceSpend_periodStart_periodEnd_idx" ON "SourceSpend"("periodStart", "periodEnd");
CREATE INDEX "SourceSpend_verificationStatus_idx" ON "SourceSpend"("verificationStatus");
CREATE INDEX "SourceSpend_businessContext_idx" ON "SourceSpend"("businessContext");
CREATE INDEX "SourceSpend_isTestRecord_idx" ON "SourceSpend"("isTestRecord");
CREATE INDEX "SourceSpend_createdAt_idx" ON "SourceSpend"("createdAt");

CREATE UNIQUE INDEX "LeadOutcomeEvent_tenantId_idempotencyKey_key" ON "LeadOutcomeEvent"("tenantId", "idempotencyKey");
CREATE INDEX "LeadOutcomeEvent_tenantId_idx" ON "LeadOutcomeEvent"("tenantId");
CREATE INDEX "LeadOutcomeEvent_leadId_idx" ON "LeadOutcomeEvent"("leadId");
CREATE INDEX "LeadOutcomeEvent_propertyCandidateId_idx" ON "LeadOutcomeEvent"("propertyCandidateId");
CREATE INDEX "LeadOutcomeEvent_propertyOpportunityId_idx" ON "LeadOutcomeEvent"("propertyOpportunityId");
CREATE INDEX "LeadOutcomeEvent_outcome_idx" ON "LeadOutcomeEvent"("outcome");
CREATE INDEX "LeadOutcomeEvent_occurredAt_idx" ON "LeadOutcomeEvent"("occurredAt");
CREATE INDEX "LeadOutcomeEvent_sourceType_idx" ON "LeadOutcomeEvent"("sourceType");
CREATE INDEX "LeadOutcomeEvent_sourceDetail_idx" ON "LeadOutcomeEvent"("sourceDetail");
CREATE INDEX "LeadOutcomeEvent_campaignId_idx" ON "LeadOutcomeEvent"("campaignId");
CREATE INDEX "LeadOutcomeEvent_referralCode_idx" ON "LeadOutcomeEvent"("referralCode");
CREATE INDEX "LeadOutcomeEvent_landingPage_idx" ON "LeadOutcomeEvent"("landingPage");
CREATE INDEX "LeadOutcomeEvent_attributionChainKey_idx" ON "LeadOutcomeEvent"("attributionChainKey");
CREATE INDEX "LeadOutcomeEvent_businessOutcomeEventId_idx" ON "LeadOutcomeEvent"("businessOutcomeEventId");
CREATE INDEX "LeadOutcomeEvent_verificationStatus_idx" ON "LeadOutcomeEvent"("verificationStatus");
CREATE INDEX "LeadOutcomeEvent_businessContext_idx" ON "LeadOutcomeEvent"("businessContext");
CREATE INDEX "LeadOutcomeEvent_isTestRecord_idx" ON "LeadOutcomeEvent"("isTestRecord");

CREATE UNIQUE INDEX "AppointmentOutcomeEvent_tenantId_idempotencyKey_key" ON "AppointmentOutcomeEvent"("tenantId", "idempotencyKey");
CREATE UNIQUE INDEX "AppointmentOutcomeEvent_tenantId_appointmentReference_outcome_key" ON "AppointmentOutcomeEvent"("tenantId", "appointmentReference", "outcome");
CREATE INDEX "AppointmentOutcomeEvent_tenantId_idx" ON "AppointmentOutcomeEvent"("tenantId");
CREATE INDEX "AppointmentOutcomeEvent_leadId_idx" ON "AppointmentOutcomeEvent"("leadId");
CREATE INDEX "AppointmentOutcomeEvent_propertyOpportunityId_idx" ON "AppointmentOutcomeEvent"("propertyOpportunityId");
CREATE INDEX "AppointmentOutcomeEvent_appointmentReference_idx" ON "AppointmentOutcomeEvent"("appointmentReference");
CREATE INDEX "AppointmentOutcomeEvent_scheduledAt_idx" ON "AppointmentOutcomeEvent"("scheduledAt");
CREATE INDEX "AppointmentOutcomeEvent_completedAt_idx" ON "AppointmentOutcomeEvent"("completedAt");
CREATE INDEX "AppointmentOutcomeEvent_outcome_idx" ON "AppointmentOutcomeEvent"("outcome");
CREATE INDEX "AppointmentOutcomeEvent_sourceType_idx" ON "AppointmentOutcomeEvent"("sourceType");
CREATE INDEX "AppointmentOutcomeEvent_sourceDetail_idx" ON "AppointmentOutcomeEvent"("sourceDetail");
CREATE INDEX "AppointmentOutcomeEvent_campaignId_idx" ON "AppointmentOutcomeEvent"("campaignId");
CREATE INDEX "AppointmentOutcomeEvent_referralCode_idx" ON "AppointmentOutcomeEvent"("referralCode");
CREATE INDEX "AppointmentOutcomeEvent_landingPage_idx" ON "AppointmentOutcomeEvent"("landingPage");
CREATE INDEX "AppointmentOutcomeEvent_attributionChainKey_idx" ON "AppointmentOutcomeEvent"("attributionChainKey");
CREATE INDEX "AppointmentOutcomeEvent_businessOutcomeEventId_idx" ON "AppointmentOutcomeEvent"("businessOutcomeEventId");
CREATE INDEX "AppointmentOutcomeEvent_verificationStatus_idx" ON "AppointmentOutcomeEvent"("verificationStatus");
CREATE INDEX "AppointmentOutcomeEvent_businessContext_idx" ON "AppointmentOutcomeEvent"("businessContext");
CREATE INDEX "AppointmentOutcomeEvent_isTestRecord_idx" ON "AppointmentOutcomeEvent"("isTestRecord");

CREATE UNIQUE INDEX "ContractOutcomeEvent_tenantId_idempotencyKey_key" ON "ContractOutcomeEvent"("tenantId", "idempotencyKey");
CREATE UNIQUE INDEX "ContractOutcomeEvent_tenantId_contractReference_outcome_key" ON "ContractOutcomeEvent"("tenantId", "contractReference", "outcome");
CREATE INDEX "ContractOutcomeEvent_tenantId_idx" ON "ContractOutcomeEvent"("tenantId");
CREATE INDEX "ContractOutcomeEvent_leadId_idx" ON "ContractOutcomeEvent"("leadId");
CREATE INDEX "ContractOutcomeEvent_propertyOpportunityId_idx" ON "ContractOutcomeEvent"("propertyOpportunityId");
CREATE INDEX "ContractOutcomeEvent_contractReference_idx" ON "ContractOutcomeEvent"("contractReference");
CREATE INDEX "ContractOutcomeEvent_outcome_idx" ON "ContractOutcomeEvent"("outcome");
CREATE INDEX "ContractOutcomeEvent_signedAt_idx" ON "ContractOutcomeEvent"("signedAt");
CREATE INDEX "ContractOutcomeEvent_sourceType_idx" ON "ContractOutcomeEvent"("sourceType");
CREATE INDEX "ContractOutcomeEvent_sourceDetail_idx" ON "ContractOutcomeEvent"("sourceDetail");
CREATE INDEX "ContractOutcomeEvent_campaignId_idx" ON "ContractOutcomeEvent"("campaignId");
CREATE INDEX "ContractOutcomeEvent_referralCode_idx" ON "ContractOutcomeEvent"("referralCode");
CREATE INDEX "ContractOutcomeEvent_landingPage_idx" ON "ContractOutcomeEvent"("landingPage");
CREATE INDEX "ContractOutcomeEvent_attributionChainKey_idx" ON "ContractOutcomeEvent"("attributionChainKey");
CREATE INDEX "ContractOutcomeEvent_businessOutcomeEventId_idx" ON "ContractOutcomeEvent"("businessOutcomeEventId");
CREATE INDEX "ContractOutcomeEvent_verificationStatus_idx" ON "ContractOutcomeEvent"("verificationStatus");
CREATE INDEX "ContractOutcomeEvent_businessContext_idx" ON "ContractOutcomeEvent"("businessContext");
CREATE INDEX "ContractOutcomeEvent_isTestRecord_idx" ON "ContractOutcomeEvent"("isTestRecord");

CREATE UNIQUE INDEX "ClosedRevenueOutcomeEvent_tenantId_idempotencyKey_key" ON "ClosedRevenueOutcomeEvent"("tenantId", "idempotencyKey");
CREATE UNIQUE INDEX "ClosedRevenueOutcomeEvent_tenantId_closingReference_revenueType_key" ON "ClosedRevenueOutcomeEvent"("tenantId", "closingReference", "revenueType");
CREATE INDEX "ClosedRevenueOutcomeEvent_tenantId_idx" ON "ClosedRevenueOutcomeEvent"("tenantId");
CREATE INDEX "ClosedRevenueOutcomeEvent_leadId_idx" ON "ClosedRevenueOutcomeEvent"("leadId");
CREATE INDEX "ClosedRevenueOutcomeEvent_propertyOpportunityId_idx" ON "ClosedRevenueOutcomeEvent"("propertyOpportunityId");
CREATE INDEX "ClosedRevenueOutcomeEvent_contractReference_idx" ON "ClosedRevenueOutcomeEvent"("contractReference");
CREATE INDEX "ClosedRevenueOutcomeEvent_closingReference_idx" ON "ClosedRevenueOutcomeEvent"("closingReference");
CREATE INDEX "ClosedRevenueOutcomeEvent_revenueType_idx" ON "ClosedRevenueOutcomeEvent"("revenueType");
CREATE INDEX "ClosedRevenueOutcomeEvent_closedAt_idx" ON "ClosedRevenueOutcomeEvent"("closedAt");
CREATE INDEX "ClosedRevenueOutcomeEvent_financeEntryId_idx" ON "ClosedRevenueOutcomeEvent"("financeEntryId");
CREATE INDEX "ClosedRevenueOutcomeEvent_businessOutcomeEventId_idx" ON "ClosedRevenueOutcomeEvent"("businessOutcomeEventId");
CREATE INDEX "ClosedRevenueOutcomeEvent_sourceType_idx" ON "ClosedRevenueOutcomeEvent"("sourceType");
CREATE INDEX "ClosedRevenueOutcomeEvent_sourceDetail_idx" ON "ClosedRevenueOutcomeEvent"("sourceDetail");
CREATE INDEX "ClosedRevenueOutcomeEvent_campaignId_idx" ON "ClosedRevenueOutcomeEvent"("campaignId");
CREATE INDEX "ClosedRevenueOutcomeEvent_referralCode_idx" ON "ClosedRevenueOutcomeEvent"("referralCode");
CREATE INDEX "ClosedRevenueOutcomeEvent_landingPage_idx" ON "ClosedRevenueOutcomeEvent"("landingPage");
CREATE INDEX "ClosedRevenueOutcomeEvent_attributionChainKey_idx" ON "ClosedRevenueOutcomeEvent"("attributionChainKey");
CREATE INDEX "ClosedRevenueOutcomeEvent_verificationStatus_idx" ON "ClosedRevenueOutcomeEvent"("verificationStatus");
CREATE INDEX "ClosedRevenueOutcomeEvent_businessContext_idx" ON "ClosedRevenueOutcomeEvent"("businessContext");
CREATE INDEX "ClosedRevenueOutcomeEvent_isTestRecord_idx" ON "ClosedRevenueOutcomeEvent"("isTestRecord");

ALTER TABLE "LeadOutcomeEvent" ADD CONSTRAINT "LeadOutcomeEvent_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AppointmentOutcomeEvent" ADD CONSTRAINT "AppointmentOutcomeEvent_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContractOutcomeEvent" ADD CONSTRAINT "ContractOutcomeEvent_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClosedRevenueOutcomeEvent" ADD CONSTRAINT "ClosedRevenueOutcomeEvent_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
