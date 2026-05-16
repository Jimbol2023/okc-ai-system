ALTER TABLE "Buyer"
  ALTER COLUMN "phone" DROP NOT NULL,
  ADD COLUMN "source" TEXT,
  ADD COLUMN "tags" JSONB;

CREATE INDEX "Buyer_phone_idx" ON "Buyer"("phone");
CREATE INDEX "Buyer_email_idx" ON "Buyer"("email");
CREATE INDEX "Buyer_source_idx" ON "Buyer"("source");
