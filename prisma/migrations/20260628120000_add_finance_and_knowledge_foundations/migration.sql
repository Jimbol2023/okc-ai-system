-- Finance and Knowledge foundations for manual executive operating system visibility.
-- These tables do not authorize provider calls, outreach, ads, scraping, or automated decisions.

CREATE TABLE "FinanceEntry" (
    "id" TEXT NOT NULL,
    "entryType" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT NOT NULL,
    "leadId" TEXT,
    "dealReference" TEXT,
    "assumption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "KnowledgeItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "FinanceEntry_entryType_idx" ON "FinanceEntry"("entryType");
CREATE INDEX "FinanceEntry_category_idx" ON "FinanceEntry"("category");
CREATE INDEX "FinanceEntry_source_idx" ON "FinanceEntry"("source");
CREATE INDEX "FinanceEntry_entryDate_idx" ON "FinanceEntry"("entryDate");
CREATE INDEX "FinanceEntry_leadId_idx" ON "FinanceEntry"("leadId");
CREATE INDEX "FinanceEntry_createdAt_idx" ON "FinanceEntry"("createdAt");

CREATE INDEX "KnowledgeItem_category_idx" ON "KnowledgeItem"("category");
CREATE INDEX "KnowledgeItem_status_idx" ON "KnowledgeItem"("status");
CREATE INDEX "KnowledgeItem_source_idx" ON "KnowledgeItem"("source");
CREATE INDEX "KnowledgeItem_createdAt_idx" ON "KnowledgeItem"("createdAt");
