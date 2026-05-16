CREATE TABLE "AiLearningRecommendation" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "recommendationData" JSONB,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "AiLearningRecommendation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AiLearningRecommendation_type_idx" ON "AiLearningRecommendation"("type");
CREATE INDEX "AiLearningRecommendation_status_idx" ON "AiLearningRecommendation"("status");
CREATE INDEX "AiLearningRecommendation_createdAt_idx" ON "AiLearningRecommendation"("createdAt");
