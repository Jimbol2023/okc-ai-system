ALTER TABLE "Buyer"
  ADD COLUMN "meaningfulActivityCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lastMeaningfulActivityAt" TIMESTAMP(3);

CREATE INDEX "Buyer_lastMeaningfulActivityAt_idx" ON "Buyer"("lastMeaningfulActivityAt");
