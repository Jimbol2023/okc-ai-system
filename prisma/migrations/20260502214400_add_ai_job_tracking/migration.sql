CREATE TABLE "AiJob" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'started',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiJob_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiJobAction" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiJobAction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiJobLog" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'info',
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiJobLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AiJob_status_idx" ON "AiJob"("status");
CREATE INDEX "AiJob_startedAt_idx" ON "AiJob"("startedAt");
CREATE INDEX "AiJob_completedAt_idx" ON "AiJob"("completedAt");
CREATE INDEX "AiJobAction_jobId_idx" ON "AiJobAction"("jobId");
CREATE INDEX "AiJobAction_action_idx" ON "AiJobAction"("action");
CREATE INDEX "AiJobLog_jobId_idx" ON "AiJobLog"("jobId");
CREATE INDEX "AiJobLog_createdAt_idx" ON "AiJobLog"("createdAt");

ALTER TABLE "AiJobAction"
ADD CONSTRAINT "AiJobAction_jobId_fkey"
FOREIGN KEY ("jobId") REFERENCES "AiJob"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AiJobLog"
ADD CONSTRAINT "AiJobLog_jobId_fkey"
FOREIGN KEY ("jobId") REFERENCES "AiJob"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
