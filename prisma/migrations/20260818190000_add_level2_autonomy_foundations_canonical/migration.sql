CREATE TABLE "AutonomyPolicy" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "policyKey" TEXT NOT NULL,
  "lane" TEXT NOT NULL,
  "subjectType" TEXT NOT NULL,
  "subjectKey" TEXT NOT NULL,
  "actionKey" TEXT NOT NULL,
  "maxAutonomyLevel" INTEGER NOT NULL DEFAULT 0,
  "effect" TEXT NOT NULL DEFAULT 'deny',
  "approvalRequired" BOOLEAN NOT NULL DEFAULT true,
  "quotaPerDay" INTEGER,
  "killSwitchEnabled" BOOLEAN NOT NULL DEFAULT true,
  "allowedActions" JSONB NOT NULL DEFAULT '[]',
  "blockedActions" JSONB NOT NULL DEFAULT '[]',
  "requiredEvidence" JSONB NOT NULL DEFAULT '[]',
  "escalationRules" JSONB NOT NULL DEFAULT '[]',
  "safetyNotes" TEXT NOT NULL,
  "providerCalled" BOOLEAN NOT NULL DEFAULT false,
  "sent" BOOLEAN NOT NULL DEFAULT false,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AutonomyPolicy_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ConnectorExecutionAttempt" (
  "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "traceId" TEXT NOT NULL,
  "connectorId" TEXT NOT NULL, "capabilityKey" TEXT NOT NULL, "actionKey" TEXT NOT NULL,
  "actorId" TEXT NOT NULL, "requestingModule" TEXT NOT NULL, "policyDecision" TEXT NOT NULL,
  "reason" TEXT NOT NULL, "normalizedResult" JSONB, "redactionApplied" BOOLEAN NOT NULL DEFAULT true,
  "auditEventId" TEXT, "outcomeEventId" TEXT, "providerCalled" BOOLEAN NOT NULL DEFAULT false,
  "providerWrite" BOOLEAN NOT NULL DEFAULT false, "sent" BOOLEAN NOT NULL DEFAULT false,
  "published" BOOLEAN NOT NULL DEFAULT false, "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ConnectorExecutionAttempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BusinessOutcomeEvent" (
  "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "outcomeKey" TEXT NOT NULL,
  "sourceType" TEXT NOT NULL, "sourceId" TEXT, "leadId" TEXT, "taskId" TEXT, "runId" TEXT,
  "actionKey" TEXT NOT NULL, "expectedOutcome" TEXT NOT NULL, "actualOutcome" TEXT NOT NULL DEFAULT 'pending',
  "kpiAffected" JSONB NOT NULL DEFAULT '[]', "revenueImpactEstimate" TEXT, "confidence" INTEGER NOT NULL DEFAULT 70,
  "nextRecommendation" TEXT NOT NULL, "safeMetadata" JSONB, "providerCalled" BOOLEAN NOT NULL DEFAULT false,
  "sent" BOOLEAN NOT NULL DEFAULT false, "published" BOOLEAN NOT NULL DEFAULT false,
  "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BusinessOutcomeEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AutonomousRunRecord" (
  "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "runKey" TEXT NOT NULL, "businessDate" TEXT NOT NULL,
  "pipelineVersion" TEXT NOT NULL, "lane" TEXT NOT NULL, "triggeredBy" TEXT NOT NULL,
  "state" TEXT NOT NULL DEFAULT 'started', "phaseSummary" JSONB NOT NULL DEFAULT '[]',
  "workCreated" INTEGER NOT NULL DEFAULT 0, "workExecuted" INTEGER NOT NULL DEFAULT 0,
  "workSkipped" INTEGER NOT NULL DEFAULT 0, "exceptions" JSONB NOT NULL DEFAULT '[]', "safetyFlags" JSONB NOT NULL,
  "healthCertified" BOOLEAN NOT NULL DEFAULT false, "providerCalled" BOOLEAN NOT NULL DEFAULT false,
  "sent" BOOLEAN NOT NULL DEFAULT false, "published" BOOLEAN NOT NULL DEFAULT false,
  "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false, "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AutonomousRunRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DepartmentSLA" (
  "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "department" TEXT NOT NULL, "owner" TEXT NOT NULL,
  "lane" TEXT NOT NULL, "maxAutonomyLevel" INTEGER NOT NULL DEFAULT 1, "staleAfterHours" INTEGER NOT NULL DEFAULT 24,
  "expectedDailyOutputs" JSONB NOT NULL DEFAULT '[]', "escalationTarget" TEXT NOT NULL,
  "blockingConditions" JSONB NOT NULL DEFAULT '[]', "safetyNotes" TEXT NOT NULL,
  "providerCalled" BOOLEAN NOT NULL DEFAULT false, "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DepartmentSLA_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AutonomyPolicy_tenantId_policyKey_key" ON "AutonomyPolicy"("tenantId", "policyKey");
CREATE INDEX "AutonomyPolicy_tenantId_idx" ON "AutonomyPolicy"("tenantId");
CREATE INDEX "AutonomyPolicy_tenantId_lane_actionKey_idx" ON "AutonomyPolicy"("tenantId", "lane", "actionKey");
CREATE INDEX "AutonomyPolicy_maxAutonomyLevel_idx" ON "AutonomyPolicy"("maxAutonomyLevel");
CREATE INDEX "AutonomyPolicy_effect_idx" ON "AutonomyPolicy"("effect");
CREATE INDEX "AutonomyPolicy_killSwitchEnabled_idx" ON "AutonomyPolicy"("killSwitchEnabled");
CREATE UNIQUE INDEX "ConnectorExecutionAttempt_tenantId_traceId_key" ON "ConnectorExecutionAttempt"("tenantId", "traceId");
CREATE INDEX "ConnectorExecutionAttempt_tenantId_idx" ON "ConnectorExecutionAttempt"("tenantId");
CREATE INDEX "ConnectorExecutionAttempt_tenantId_actionKey_createdAt_idx" ON "ConnectorExecutionAttempt"("tenantId", "actionKey", "createdAt");
CREATE INDEX "ConnectorExecutionAttempt_policyDecision_idx" ON "ConnectorExecutionAttempt"("policyDecision");
CREATE INDEX "ConnectorExecutionAttempt_providerCalled_idx" ON "ConnectorExecutionAttempt"("providerCalled");
CREATE INDEX "ConnectorExecutionAttempt_liveExecutionAllowed_idx" ON "ConnectorExecutionAttempt"("liveExecutionAllowed");
CREATE UNIQUE INDEX "BusinessOutcomeEvent_tenantId_outcomeKey_key" ON "BusinessOutcomeEvent"("tenantId", "outcomeKey");
CREATE INDEX "BusinessOutcomeEvent_tenantId_idx" ON "BusinessOutcomeEvent"("tenantId");
CREATE INDEX "BusinessOutcomeEvent_tenantId_actualOutcome_createdAt_idx" ON "BusinessOutcomeEvent"("tenantId", "actualOutcome", "createdAt");
CREATE INDEX "BusinessOutcomeEvent_leadId_idx" ON "BusinessOutcomeEvent"("leadId");
CREATE INDEX "BusinessOutcomeEvent_runId_idx" ON "BusinessOutcomeEvent"("runId");
CREATE INDEX "BusinessOutcomeEvent_actionKey_idx" ON "BusinessOutcomeEvent"("actionKey");
CREATE UNIQUE INDEX "AutonomousRunRecord_tenantId_runKey_key" ON "AutonomousRunRecord"("tenantId", "runKey");
CREATE INDEX "AutonomousRunRecord_tenantId_idx" ON "AutonomousRunRecord"("tenantId");
CREATE INDEX "AutonomousRunRecord_tenantId_lane_createdAt_idx" ON "AutonomousRunRecord"("tenantId", "lane", "createdAt");
CREATE INDEX "AutonomousRunRecord_state_idx" ON "AutonomousRunRecord"("state");
CREATE INDEX "AutonomousRunRecord_healthCertified_idx" ON "AutonomousRunRecord"("healthCertified");
CREATE UNIQUE INDEX "DepartmentSLA_tenantId_department_key" ON "DepartmentSLA"("tenantId", "department");
CREATE INDEX "DepartmentSLA_tenantId_idx" ON "DepartmentSLA"("tenantId");
CREATE INDEX "DepartmentSLA_tenantId_lane_idx" ON "DepartmentSLA"("tenantId", "lane");
CREATE INDEX "DepartmentSLA_maxAutonomyLevel_idx" ON "DepartmentSLA"("maxAutonomyLevel");

INSERT INTO "AutonomyPolicy" (
  "id", "tenantId", "policyKey", "lane", "subjectType", "subjectKey", "actionKey", "maxAutonomyLevel",
  "effect", "approvalRequired", "quotaPerDay", "killSwitchEnabled", "allowedActions", "blockedActions",
  "requiredEvidence", "escalationRules", "safetyNotes", "updatedAt"
) VALUES (
  'level2-default-policy-disabled', 'default', 'lead-intake-qualification:create-crm-task:v1',
  'lead_intake_qualification', 'business_module', 'real_estate', 'create_internal_crm_task', 2,
  'deny', true, 50, true, '["create_internal_crm_task"]',
  '["send_sms","send_email","publish_content","scrape","paid_property_enrichment"]',
  '["stored_lead","source_attribution","revenue_score","no_dnc_or_opt_out"]',
  '["missing_source","dnc_or_opt_out","quota_exhausted","policy_kill_switch"]',
  'Disabled foundation only. Explicit governed Preview or Production authorization is required before internal writes.',
  CURRENT_TIMESTAMP
);

INSERT INTO "DepartmentSLA" (
  "id", "tenantId", "department", "owner", "lane", "maxAutonomyLevel", "staleAfterHours",
  "expectedDailyOutputs", "escalationTarget", "blockingConditions", "safetyNotes", "updatedAt"
) VALUES (
  'level2-default-revenue-operations-sla', 'default', 'Revenue Operations', 'Autonomous Operations Supervisor AI',
  'lead_intake_qualification', 1, 24, '["qualified lead review task","outcome and audit evidence"]',
  'CEO', '["policy_not_authorized","tenant_mismatch","dnc_or_opt_out","quota_exhausted"]',
  'Foundation is disabled at Level 1 until separately governed Level-2 activation.', CURRENT_TIMESTAMP
);
