CREATE TABLE "KnowledgeSearchEmbedding" (
    "id" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "embedding" JSONB NOT NULL,
    "model" TEXT NOT NULL,
    "dimensions" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeSearchEmbedding_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "KnowledgeSearchEmbedding_sourceType_sourceId_key" ON "KnowledgeSearchEmbedding"("sourceType", "sourceId");
CREATE INDEX "KnowledgeSearchEmbedding_sourceType_idx" ON "KnowledgeSearchEmbedding"("sourceType");
CREATE INDEX "KnowledgeSearchEmbedding_sourceId_idx" ON "KnowledgeSearchEmbedding"("sourceId");
CREATE INDEX "KnowledgeSearchEmbedding_model_idx" ON "KnowledgeSearchEmbedding"("model");
CREATE INDEX "KnowledgeSearchEmbedding_createdAt_idx" ON "KnowledgeSearchEmbedding"("createdAt");
