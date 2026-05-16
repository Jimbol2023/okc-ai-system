CREATE TYPE "BuyerActivityEventType" AS ENUM (
  'deal_sent',
  'deal_opened',
  'responded',
  'offer_made',
  'deal_closed'
);

CREATE TABLE "Buyer" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "preferredLocations" JSONB,
  "priceRangeMin" INTEGER,
  "priceRangeMax" INTEGER,
  "propertyTypes" JSONB,
  "financingType" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Buyer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BuyerActivity" (
  "id" TEXT NOT NULL,
  "buyerId" TEXT NOT NULL,
  "dealId" TEXT NOT NULL,
  "eventType" "BuyerActivityEventType" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "BuyerActivity_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Buyer_createdAt_idx" ON "Buyer"("createdAt");
CREATE INDEX "Buyer_priceRangeMin_priceRangeMax_idx" ON "Buyer"("priceRangeMin", "priceRangeMax");
CREATE INDEX "Buyer_financingType_idx" ON "Buyer"("financingType");
CREATE INDEX "BuyerActivity_buyerId_idx" ON "BuyerActivity"("buyerId");
CREATE INDEX "BuyerActivity_dealId_idx" ON "BuyerActivity"("dealId");
CREATE INDEX "BuyerActivity_eventType_idx" ON "BuyerActivity"("eventType");
CREATE INDEX "BuyerActivity_createdAt_idx" ON "BuyerActivity"("createdAt");

ALTER TABLE "BuyerActivity"
  ADD CONSTRAINT "BuyerActivity_buyerId_fkey"
  FOREIGN KEY ("buyerId") REFERENCES "Buyer"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
