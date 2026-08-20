CREATE TABLE "PropertyCandidate" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL DEFAULT 'default',
  "source" TEXT NOT NULL,
  "sourceDetail" TEXT,
  "sourceRecordId" TEXT,
  "propertyAddress" TEXT NOT NULL,
  "normalizedAddress" TEXT NOT NULL,
  "city" TEXT,
  "state" TEXT,
  "zipCode" TEXT,
  "county" TEXT,
  "parcelId" TEXT,
  "latitude" DOUBLE PRECISION,
  "longitude" DOUBLE PRECISION,
  "coordinateSource" TEXT,
  "ownerName" TEXT,
  "mailingAddress" TEXT,
  "sourceEvidence" JSONB NOT NULL,
  "observations" JSONB NOT NULL,
  "distressIndicators" JSONB NOT NULL,
  "confidence" INTEGER NOT NULL DEFAULT 50,
  "duplicateKey" TEXT NOT NULL,
  "duplicateStatus" TEXT NOT NULL DEFAULT 'unique',
  "providerName" TEXT,
  "providerRequestId" TEXT,
  "retrievedAt" TIMESTAMP(3),
  "costCents" INTEGER NOT NULL DEFAULT 0,
  "creditsUsed" INTEGER NOT NULL DEFAULT 0,
  "reviewStatus" TEXT NOT NULL DEFAULT 'new',
  "createdBy" TEXT,
  "providerCalled" BOOLEAN NOT NULL DEFAULT false,
  "providerWrite" BOOLEAN NOT NULL DEFAULT false,
  "sent" BOOLEAN NOT NULL DEFAULT false,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "outreach" BOOLEAN NOT NULL DEFAULT false,
  "crmMutated" BOOLEAN NOT NULL DEFAULT false,
  "skipTracePerformed" BOOLEAN NOT NULL DEFAULT false,
  "directMailSent" BOOLEAN NOT NULL DEFAULT false,
  "externalExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
  "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PropertyCandidate_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PropertyCandidate_tenantId_idx" ON "PropertyCandidate"("tenantId");
CREATE INDEX "PropertyCandidate_tenantId_duplicateKey_idx" ON "PropertyCandidate"("tenantId", "duplicateKey");
CREATE INDEX "PropertyCandidate_tenantId_reviewStatus_idx" ON "PropertyCandidate"("tenantId", "reviewStatus");
CREATE INDEX "PropertyCandidate_tenantId_duplicateStatus_idx" ON "PropertyCandidate"("tenantId", "duplicateStatus");
CREATE INDEX "PropertyCandidate_source_idx" ON "PropertyCandidate"("source");
CREATE INDEX "PropertyCandidate_normalizedAddress_idx" ON "PropertyCandidate"("normalizedAddress");
CREATE INDEX "PropertyCandidate_parcelId_idx" ON "PropertyCandidate"("parcelId");
CREATE INDEX "PropertyCandidate_county_idx" ON "PropertyCandidate"("county");
CREATE INDEX "PropertyCandidate_providerCalled_idx" ON "PropertyCandidate"("providerCalled");
CREATE INDEX "PropertyCandidate_providerWrite_idx" ON "PropertyCandidate"("providerWrite");
CREATE INDEX "PropertyCandidate_sent_idx" ON "PropertyCandidate"("sent");
CREATE INDEX "PropertyCandidate_published_idx" ON "PropertyCandidate"("published");
CREATE INDEX "PropertyCandidate_outreach_idx" ON "PropertyCandidate"("outreach");
CREATE INDEX "PropertyCandidate_crmMutated_idx" ON "PropertyCandidate"("crmMutated");
CREATE INDEX "PropertyCandidate_skipTracePerformed_idx" ON "PropertyCandidate"("skipTracePerformed");
CREATE INDEX "PropertyCandidate_directMailSent_idx" ON "PropertyCandidate"("directMailSent");
CREATE INDEX "PropertyCandidate_externalExecutionAllowed_idx" ON "PropertyCandidate"("externalExecutionAllowed");
CREATE INDEX "PropertyCandidate_liveExecutionAllowed_idx" ON "PropertyCandidate"("liveExecutionAllowed");
CREATE INDEX "PropertyCandidate_createdAt_idx" ON "PropertyCandidate"("createdAt");
