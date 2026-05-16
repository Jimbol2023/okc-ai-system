CREATE TYPE "BuyerTier" AS ENUM ('A', 'B', 'C', 'D');

ALTER TABLE "Buyer"
  ADD COLUMN "tier" "BuyerTier" NOT NULL DEFAULT 'D',
  ADD COLUMN "preferredDealSize" INTEGER,
  ADD COLUMN "preferredCondition" TEXT;

CREATE INDEX "Buyer_tier_idx" ON "Buyer"("tier");
CREATE INDEX "Buyer_preferredDealSize_idx" ON "Buyer"("preferredDealSize");
