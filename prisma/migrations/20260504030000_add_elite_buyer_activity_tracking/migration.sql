ALTER TYPE "BuyerActivityEventType" ADD VALUE IF NOT EXISTS 'deal_viewed';
ALTER TYPE "BuyerActivityEventType" ADD VALUE IF NOT EXISTS 'link_clicked';
ALTER TYPE "BuyerActivityEventType" ADD VALUE IF NOT EXISTS 'replied';
ALTER TYPE "BuyerActivityEventType" ADD VALUE IF NOT EXISTS 'requested_details';
ALTER TYPE "BuyerActivityEventType" ADD VALUE IF NOT EXISTS 'deal_passed';
ALTER TYPE "BuyerActivityEventType" ADD VALUE IF NOT EXISTS 'unsubscribed_or_inactive';

ALTER TABLE "Buyer"
  ADD COLUMN "qualityReasons" JSONB;

ALTER TABLE "BuyerActivity"
  ALTER COLUMN "dealId" DROP NOT NULL,
  ADD COLUMN "metadata" JSONB;
