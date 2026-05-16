ALTER TABLE "Buyer"
  ADD COLUMN "buyerQualityScore" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lastActiveAt" TIMESTAMP(3),
  ADD COLUMN "activityCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "Buyer_buyerQualityScore_idx" ON "Buyer"("buyerQualityScore");
CREATE INDEX "Buyer_lastActiveAt_idx" ON "Buyer"("lastActiveAt");
CREATE INDEX "Buyer_isActive_idx" ON "Buyer"("isActive");
