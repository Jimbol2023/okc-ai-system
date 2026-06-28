CREATE TABLE "MarketingCanvaAssetAssist" (
  "id" TEXT NOT NULL,
  "draftId" TEXT NOT NULL,
  "recommendedFormat" TEXT NOT NULL,
  "designBrief" TEXT NOT NULL,
  "brandSafeCopyBlocks" JSONB NOT NULL,
  "assetNotes" TEXT,
  "manualApprovalStatus" TEXT NOT NULL DEFAULT 'pending_manual_asset_approval',
  "safetyFlags" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MarketingCanvaAssetAssist_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MarketingCanvaAssetAssist_draftId_idx" ON "MarketingCanvaAssetAssist"("draftId");
CREATE INDEX "MarketingCanvaAssetAssist_recommendedFormat_idx" ON "MarketingCanvaAssetAssist"("recommendedFormat");
CREATE INDEX "MarketingCanvaAssetAssist_manualApprovalStatus_idx" ON "MarketingCanvaAssetAssist"("manualApprovalStatus");
CREATE INDEX "MarketingCanvaAssetAssist_createdAt_idx" ON "MarketingCanvaAssetAssist"("createdAt");

ALTER TABLE "MarketingCanvaAssetAssist"
  ADD CONSTRAINT "MarketingCanvaAssetAssist_draftId_fkey"
  FOREIGN KEY ("draftId") REFERENCES "MarketingDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;
