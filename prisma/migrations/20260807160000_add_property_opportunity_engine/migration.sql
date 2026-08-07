-- J Capital Property Opportunity Engine MVP.
-- Schema artifact only; applying this migration is a separate governed database operation.

CREATE TABLE "PropertyOpportunity" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL DEFAULT 'default',
  "canonicalAddress" TEXT NOT NULL,
  "propertyAddress" TEXT NOT NULL,
  "city" TEXT,
  "state" TEXT,
  "zipCode" TEXT,
  "county" TEXT,
  "parcelId" TEXT,
  "ownerName" TEXT,
  "mailingAddress" TEXT,
  "source" TEXT NOT NULL,
  "sourceDetail" TEXT,
  "evidence" JSONB NOT NULL,
  "distressIndicators" JSONB NOT NULL,
  "observations" JSONB NOT NULL,
  "photoMetadata" JSONB NOT NULL,
  "opportunityScore" INTEGER NOT NULL,
  "opportunityPriority" TEXT NOT NULL,
  "confidence" INTEGER NOT NULL,
  "duplicateKey" TEXT NOT NULL,
  "duplicateRisk" BOOLEAN NOT NULL DEFAULT false,
  "missingEvidence" JSONB NOT NULL,
  "recommendedAction" TEXT NOT NULL,
  "safetyFlags" JSONB NOT NULL,
  "providerCalled" BOOLEAN NOT NULL DEFAULT false,
  "sent" BOOLEAN NOT NULL DEFAULT false,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "crmMutated" BOOLEAN NOT NULL DEFAULT false,
  "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
  "createdBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PropertyOpportunity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PropertyOpportunitySavedFilter" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL DEFAULT 'default',
  "name" TEXT NOT NULL,
  "filterKey" TEXT NOT NULL,
  "criteria" JSONB NOT NULL,
  "safetyFlags" JSONB NOT NULL,
  "providerCalled" BOOLEAN NOT NULL DEFAULT false,
  "sent" BOOLEAN NOT NULL DEFAULT false,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "crmMutated" BOOLEAN NOT NULL DEFAULT false,
  "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
  "createdBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PropertyOpportunitySavedFilter_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PropertyOpportunity_tenantId_duplicateKey_key" ON "PropertyOpportunity"("tenantId", "duplicateKey");
CREATE INDEX "PropertyOpportunity_tenantId_idx" ON "PropertyOpportunity"("tenantId");
CREATE INDEX "PropertyOpportunity_canonicalAddress_idx" ON "PropertyOpportunity"("canonicalAddress");
CREATE INDEX "PropertyOpportunity_parcelId_idx" ON "PropertyOpportunity"("parcelId");
CREATE INDEX "PropertyOpportunity_source_idx" ON "PropertyOpportunity"("source");
CREATE INDEX "PropertyOpportunity_opportunityScore_idx" ON "PropertyOpportunity"("opportunityScore");
CREATE INDEX "PropertyOpportunity_opportunityPriority_idx" ON "PropertyOpportunity"("opportunityPriority");
CREATE INDEX "PropertyOpportunity_duplicateRisk_idx" ON "PropertyOpportunity"("duplicateRisk");
CREATE INDEX "PropertyOpportunity_providerCalled_idx" ON "PropertyOpportunity"("providerCalled");
CREATE INDEX "PropertyOpportunity_sent_idx" ON "PropertyOpportunity"("sent");
CREATE INDEX "PropertyOpportunity_published_idx" ON "PropertyOpportunity"("published");
CREATE INDEX "PropertyOpportunity_crmMutated_idx" ON "PropertyOpportunity"("crmMutated");
CREATE INDEX "PropertyOpportunity_liveExecutionAllowed_idx" ON "PropertyOpportunity"("liveExecutionAllowed");
CREATE INDEX "PropertyOpportunity_createdAt_idx" ON "PropertyOpportunity"("createdAt");

CREATE UNIQUE INDEX "PropertyOpportunitySavedFilter_tenantId_filterKey_key" ON "PropertyOpportunitySavedFilter"("tenantId", "filterKey");
CREATE INDEX "PropertyOpportunitySavedFilter_tenantId_idx" ON "PropertyOpportunitySavedFilter"("tenantId");
CREATE INDEX "PropertyOpportunitySavedFilter_filterKey_idx" ON "PropertyOpportunitySavedFilter"("filterKey");
CREATE INDEX "PropertyOpportunitySavedFilter_providerCalled_idx" ON "PropertyOpportunitySavedFilter"("providerCalled");
CREATE INDEX "PropertyOpportunitySavedFilter_sent_idx" ON "PropertyOpportunitySavedFilter"("sent");
CREATE INDEX "PropertyOpportunitySavedFilter_published_idx" ON "PropertyOpportunitySavedFilter"("published");
CREATE INDEX "PropertyOpportunitySavedFilter_crmMutated_idx" ON "PropertyOpportunitySavedFilter"("crmMutated");
CREATE INDEX "PropertyOpportunitySavedFilter_liveExecutionAllowed_idx" ON "PropertyOpportunitySavedFilter"("liveExecutionAllowed");
CREATE INDEX "PropertyOpportunitySavedFilter_createdAt_idx" ON "PropertyOpportunitySavedFilter"("createdAt");
