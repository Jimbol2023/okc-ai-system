CREATE TABLE "MarketingSalesAttribution" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "marketingDraftId" TEXT,
  "canvaAssetAssistId" TEXT,
  "publishAssistId" TEXT,
  "channel" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "sourceLabel" TEXT NOT NULL,
  "manualPostUrl" TEXT,
  "attributionStatus" TEXT NOT NULL DEFAULT 'manual_review',
  "attributionNote" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MarketingSalesAttribution_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SalesConversionAssist" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "assistType" TEXT NOT NULL DEFAULT 'manual_sales_conversion',
  "nextSalesAction" TEXT NOT NULL,
  "callOpener" TEXT NOT NULL,
  "sellerQuestions" JSONB NOT NULL,
  "objectionNotes" JSONB NOT NULL,
  "followUpDrafts" JSONB NOT NULL,
  "offerReadiness" JSONB NOT NULL,
  "roiSignals" JSONB NOT NULL,
  "safetyFlags" JSONB NOT NULL,
  "manualApprovalStatus" TEXT NOT NULL DEFAULT 'pending_manual_review',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SalesConversionAssist_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MarketingSalesAttribution_leadId_idx" ON "MarketingSalesAttribution"("leadId");
CREATE INDEX "MarketingSalesAttribution_marketingDraftId_idx" ON "MarketingSalesAttribution"("marketingDraftId");
CREATE INDEX "MarketingSalesAttribution_canvaAssetAssistId_idx" ON "MarketingSalesAttribution"("canvaAssetAssistId");
CREATE INDEX "MarketingSalesAttribution_publishAssistId_idx" ON "MarketingSalesAttribution"("publishAssistId");
CREATE INDEX "MarketingSalesAttribution_channel_idx" ON "MarketingSalesAttribution"("channel");
CREATE INDEX "MarketingSalesAttribution_sourceLabel_idx" ON "MarketingSalesAttribution"("sourceLabel");
CREATE INDEX "MarketingSalesAttribution_attributionStatus_idx" ON "MarketingSalesAttribution"("attributionStatus");
CREATE INDEX "MarketingSalesAttribution_createdAt_idx" ON "MarketingSalesAttribution"("createdAt");

CREATE INDEX "SalesConversionAssist_leadId_idx" ON "SalesConversionAssist"("leadId");
CREATE INDEX "SalesConversionAssist_assistType_idx" ON "SalesConversionAssist"("assistType");
CREATE INDEX "SalesConversionAssist_manualApprovalStatus_idx" ON "SalesConversionAssist"("manualApprovalStatus");
CREATE INDEX "SalesConversionAssist_createdAt_idx" ON "SalesConversionAssist"("createdAt");

ALTER TABLE "MarketingSalesAttribution"
  ADD CONSTRAINT "MarketingSalesAttribution_leadId_fkey"
  FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MarketingSalesAttribution"
  ADD CONSTRAINT "MarketingSalesAttribution_marketingDraftId_fkey"
  FOREIGN KEY ("marketingDraftId") REFERENCES "MarketingDraft"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "MarketingSalesAttribution"
  ADD CONSTRAINT "MarketingSalesAttribution_canvaAssetAssistId_fkey"
  FOREIGN KEY ("canvaAssetAssistId") REFERENCES "MarketingCanvaAssetAssist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "MarketingSalesAttribution"
  ADD CONSTRAINT "MarketingSalesAttribution_publishAssistId_fkey"
  FOREIGN KEY ("publishAssistId") REFERENCES "MarketingPublishAssist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SalesConversionAssist"
  ADD CONSTRAINT "SalesConversionAssist_leadId_fkey"
  FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
