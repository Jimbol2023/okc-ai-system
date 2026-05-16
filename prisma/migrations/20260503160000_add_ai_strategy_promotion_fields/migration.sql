ALTER TABLE "AiLearningRecommendation"
ADD COLUMN "autoPromotable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "promotedAt" TIMESTAMP(3);

CREATE INDEX "AiLearningRecommendation_promotedAt_idx" ON "AiLearningRecommendation"("promotedAt");
