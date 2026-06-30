CREATE TABLE "ConnectorInstallationState" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "connectorId" TEXT NOT NULL,
    "installationState" TEXT NOT NULL DEFAULT 'available',
    "configurationState" TEXT NOT NULL DEFAULT 'not_configured',
    "authenticationState" TEXT NOT NULL DEFAULT 'not_authenticated',
    "sandboxMode" BOOLEAN NOT NULL DEFAULT true,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "enableApprovalStatus" TEXT NOT NULL DEFAULT 'pending_manual_approval',
    "credentialReferenceId" TEXT,
    "requiredScopes" JSONB NOT NULL,
    "grantedScopes" JSONB,
    "permissionValidation" JSONB,
    "lastTestResultId" TEXT,
    "rollbackVersion" TEXT,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ConnectorInstallationState_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ConnectorCredentialReference" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "connectorId" TEXT NOT NULL,
    "referenceKey" TEXT NOT NULL,
    "secretStorageProvider" TEXT NOT NULL,
    "secretPathReference" TEXT NOT NULL,
    "rotationStatus" TEXT NOT NULL DEFAULT 'not_started',
    "lastRotatedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "rawSecretStored" BOOLEAN NOT NULL DEFAULT false,
    "rawSecretRendered" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ConnectorCredentialReference_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ConnectorTestResult" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "connectorId" TEXT NOT NULL,
    "testType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'prepared',
    "message" TEXT NOT NULL,
    "requiredApproval" BOOLEAN NOT NULL DEFAULT true,
    "latencyMs" INTEGER,
    "safeMetadata" JSONB,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConnectorTestResult_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AiPermissionPolicy" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "subjectType" TEXT NOT NULL,
    "subjectKey" TEXT NOT NULL,
    "connectorId" TEXT,
    "actionKey" TEXT NOT NULL,
    "effect" TEXT NOT NULL DEFAULT 'deny',
    "scope" TEXT NOT NULL DEFAULT 'internal',
    "approvalRequired" BOOLEAN NOT NULL DEFAULT true,
    "riskLevel" TEXT NOT NULL DEFAULT 'medium',
    "environment" TEXT NOT NULL DEFAULT 'production',
    "reason" TEXT NOT NULL,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AiPermissionPolicy_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UnifiedApprovalItem" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "itemType" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT,
    "title" TEXT NOT NULL,
    "sourceLabel" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending_review',
    "riskLevel" TEXT NOT NULL DEFAULT 'medium',
    "requiredApprovals" JSONB NOT NULL,
    "connectorId" TEXT,
    "executionBlockedReason" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UnifiedApprovalItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UnifiedApprovalDecision" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "approvalItemId" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "note" TEXT,
    "decidedBy" TEXT,
    "delegatedTo" TEXT,
    "rescheduledFor" TIMESTAMP(3),
    "auditEventId" TEXT,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UnifiedApprovalDecision_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SocialContentSource" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "sourceType" TEXT NOT NULL,
    "sourceLabel" TEXT NOT NULL,
    "sourceId" TEXT,
    "approvalStatus" TEXT NOT NULL DEFAULT 'approved_for_drafting',
    "containsPrivateFacts" BOOLEAN NOT NULL DEFAULT false,
    "provenance" TEXT NOT NULL,
    "assumptions" JSONB NOT NULL,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SocialContentSource_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SocialContentDraft" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "sourceId" TEXT,
    "platform" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "draftCopy" TEXT NOT NULL,
    "assumptions" JSONB NOT NULL,
    "approvalStatus" TEXT NOT NULL DEFAULT 'pending_review',
    "connectorId" TEXT,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "scheduled" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SocialContentDraft_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SocialContentVariant" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "draftId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "copy" TEXT NOT NULL,
    "sourceLabel" TEXT NOT NULL,
    "approvalStatus" TEXT NOT NULL DEFAULT 'pending_review',
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "scheduled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SocialContentVariant_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SocialSchedulePlan" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "draftId" TEXT NOT NULL,
    "intendedPublishAt" TIMESTAMP(3),
    "scheduleStatus" TEXT NOT NULL DEFAULT 'plan_only',
    "approvalStatus" TEXT NOT NULL DEFAULT 'pending_review',
    "connectorId" TEXT,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "scheduled" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SocialSchedulePlan_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SocialExecutionPlan" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "draftId" TEXT NOT NULL,
    "connectorId" TEXT,
    "actionKey" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "requiredApprovals" JSONB NOT NULL,
    "fallbackConnectorId" TEXT,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "scheduled" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SocialExecutionPlan_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SocialPerformanceSnapshot" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "draftId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "metrics" JSONB NOT NULL,
    "sourceLabel" TEXT NOT NULL,
    "snapshotStatus" TEXT NOT NULL DEFAULT 'placeholder',
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SocialPerformanceSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AutomationPolicyRecord" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "policyKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "workflow" TEXT NOT NULL,
    "featureFlag" TEXT NOT NULL,
    "approvalRequirement" TEXT NOT NULL,
    "rollbackPlan" TEXT NOT NULL,
    "environmentScope" TEXT NOT NULL DEFAULT 'all',
    "safeAutoCompatible" BOOLEAN NOT NULL DEFAULT true,
    "externalExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AutomationPolicyRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AutomationRunRecord" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "policyId" TEXT NOT NULL,
    "runStatus" TEXT NOT NULL DEFAULT 'prepared',
    "triggerSource" TEXT NOT NULL,
    "approvalStatus" TEXT NOT NULL DEFAULT 'pending_review',
    "rollbackAvailable" BOOLEAN NOT NULL DEFAULT true,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "safeMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AutomationRunRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "NotificationRecord" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "channel" TEXT NOT NULL DEFAULT 'in_app',
    "severity" TEXT NOT NULL DEFAULT 'info',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT,
    "acknowledgedAt" TIMESTAMP(3),
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "sentExternally" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NotificationRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LearningOutcomeEvent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "source" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "recommendationImpact" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "explainabilityNote" TEXT NOT NULL,
    "autonomousSelfModification" BOOLEAN NOT NULL DEFAULT false,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LearningOutcomeEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DailyBriefingSnapshot" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "briefingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "panels" JSONB NOT NULL,
    "verticalSlice" JSONB NOT NULL,
    "approvalSummary" JSONB NOT NULL,
    "connectorSummary" JSONB NOT NULL,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DailyBriefingSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ConnectorInstallationState_tenantId_connectorId_key" ON "ConnectorInstallationState"("tenantId", "connectorId");
CREATE INDEX "ConnectorInstallationState_tenantId_idx" ON "ConnectorInstallationState"("tenantId");
CREATE INDEX "ConnectorInstallationState_connectorId_idx" ON "ConnectorInstallationState"("connectorId");
CREATE INDEX "ConnectorInstallationState_installationState_idx" ON "ConnectorInstallationState"("installationState");
CREATE INDEX "ConnectorInstallationState_authenticationState_idx" ON "ConnectorInstallationState"("authenticationState");
CREATE INDEX "ConnectorInstallationState_enabled_idx" ON "ConnectorInstallationState"("enabled");
CREATE INDEX "ConnectorInstallationState_providerCalled_idx" ON "ConnectorInstallationState"("providerCalled");
CREATE INDEX "ConnectorInstallationState_liveExecutionAllowed_idx" ON "ConnectorInstallationState"("liveExecutionAllowed");

CREATE UNIQUE INDEX "ConnectorCredentialReference_tenantId_referenceKey_key" ON "ConnectorCredentialReference"("tenantId", "referenceKey");
CREATE INDEX "ConnectorCredentialReference_tenantId_idx" ON "ConnectorCredentialReference"("tenantId");
CREATE INDEX "ConnectorCredentialReference_connectorId_idx" ON "ConnectorCredentialReference"("connectorId");
CREATE INDEX "ConnectorCredentialReference_rotationStatus_idx" ON "ConnectorCredentialReference"("rotationStatus");
CREATE INDEX "ConnectorCredentialReference_rawSecretStored_idx" ON "ConnectorCredentialReference"("rawSecretStored");
CREATE INDEX "ConnectorCredentialReference_rawSecretRendered_idx" ON "ConnectorCredentialReference"("rawSecretRendered");

CREATE INDEX "ConnectorTestResult_tenantId_idx" ON "ConnectorTestResult"("tenantId");
CREATE INDEX "ConnectorTestResult_connectorId_idx" ON "ConnectorTestResult"("connectorId");
CREATE INDEX "ConnectorTestResult_testType_idx" ON "ConnectorTestResult"("testType");
CREATE INDEX "ConnectorTestResult_status_idx" ON "ConnectorTestResult"("status");
CREATE INDEX "ConnectorTestResult_providerCalled_idx" ON "ConnectorTestResult"("providerCalled");
CREATE INDEX "ConnectorTestResult_createdAt_idx" ON "ConnectorTestResult"("createdAt");

CREATE INDEX "AiPermissionPolicy_tenantId_idx" ON "AiPermissionPolicy"("tenantId");
CREATE INDEX "AiPermissionPolicy_subjectType_idx" ON "AiPermissionPolicy"("subjectType");
CREATE INDEX "AiPermissionPolicy_subjectKey_idx" ON "AiPermissionPolicy"("subjectKey");
CREATE INDEX "AiPermissionPolicy_connectorId_idx" ON "AiPermissionPolicy"("connectorId");
CREATE INDEX "AiPermissionPolicy_actionKey_idx" ON "AiPermissionPolicy"("actionKey");
CREATE INDEX "AiPermissionPolicy_effect_idx" ON "AiPermissionPolicy"("effect");
CREATE INDEX "AiPermissionPolicy_approvalRequired_idx" ON "AiPermissionPolicy"("approvalRequired");

CREATE INDEX "UnifiedApprovalItem_tenantId_idx" ON "UnifiedApprovalItem"("tenantId");
CREATE INDEX "UnifiedApprovalItem_itemType_idx" ON "UnifiedApprovalItem"("itemType");
CREATE INDEX "UnifiedApprovalItem_sourceType_idx" ON "UnifiedApprovalItem"("sourceType");
CREATE INDEX "UnifiedApprovalItem_status_idx" ON "UnifiedApprovalItem"("status");
CREATE INDEX "UnifiedApprovalItem_riskLevel_idx" ON "UnifiedApprovalItem"("riskLevel");
CREATE INDEX "UnifiedApprovalItem_connectorId_idx" ON "UnifiedApprovalItem"("connectorId");
CREATE INDEX "UnifiedApprovalItem_providerCalled_idx" ON "UnifiedApprovalItem"("providerCalled");
CREATE INDEX "UnifiedApprovalItem_liveExecutionAllowed_idx" ON "UnifiedApprovalItem"("liveExecutionAllowed");

CREATE INDEX "UnifiedApprovalDecision_tenantId_idx" ON "UnifiedApprovalDecision"("tenantId");
CREATE INDEX "UnifiedApprovalDecision_approvalItemId_idx" ON "UnifiedApprovalDecision"("approvalItemId");
CREATE INDEX "UnifiedApprovalDecision_decision_idx" ON "UnifiedApprovalDecision"("decision");
CREATE INDEX "UnifiedApprovalDecision_providerCalled_idx" ON "UnifiedApprovalDecision"("providerCalled");
CREATE INDEX "UnifiedApprovalDecision_createdAt_idx" ON "UnifiedApprovalDecision"("createdAt");

CREATE INDEX "SocialContentSource_tenantId_idx" ON "SocialContentSource"("tenantId");
CREATE INDEX "SocialContentSource_sourceType_idx" ON "SocialContentSource"("sourceType");
CREATE INDEX "SocialContentSource_sourceLabel_idx" ON "SocialContentSource"("sourceLabel");
CREATE INDEX "SocialContentSource_approvalStatus_idx" ON "SocialContentSource"("approvalStatus");
CREATE INDEX "SocialContentSource_containsPrivateFacts_idx" ON "SocialContentSource"("containsPrivateFacts");

CREATE INDEX "SocialContentDraft_tenantId_idx" ON "SocialContentDraft"("tenantId");
CREATE INDEX "SocialContentDraft_sourceId_idx" ON "SocialContentDraft"("sourceId");
CREATE INDEX "SocialContentDraft_platform_idx" ON "SocialContentDraft"("platform");
CREATE INDEX "SocialContentDraft_contentType_idx" ON "SocialContentDraft"("contentType");
CREATE INDEX "SocialContentDraft_approvalStatus_idx" ON "SocialContentDraft"("approvalStatus");
CREATE INDEX "SocialContentDraft_connectorId_idx" ON "SocialContentDraft"("connectorId");
CREATE INDEX "SocialContentDraft_providerCalled_idx" ON "SocialContentDraft"("providerCalled");
CREATE INDEX "SocialContentDraft_published_idx" ON "SocialContentDraft"("published");

CREATE INDEX "SocialContentVariant_tenantId_idx" ON "SocialContentVariant"("tenantId");
CREATE INDEX "SocialContentVariant_draftId_idx" ON "SocialContentVariant"("draftId");
CREATE INDEX "SocialContentVariant_platform_idx" ON "SocialContentVariant"("platform");
CREATE INDEX "SocialContentVariant_format_idx" ON "SocialContentVariant"("format");
CREATE INDEX "SocialContentVariant_approvalStatus_idx" ON "SocialContentVariant"("approvalStatus");

CREATE INDEX "SocialSchedulePlan_tenantId_idx" ON "SocialSchedulePlan"("tenantId");
CREATE INDEX "SocialSchedulePlan_draftId_idx" ON "SocialSchedulePlan"("draftId");
CREATE INDEX "SocialSchedulePlan_scheduleStatus_idx" ON "SocialSchedulePlan"("scheduleStatus");
CREATE INDEX "SocialSchedulePlan_approvalStatus_idx" ON "SocialSchedulePlan"("approvalStatus");
CREATE INDEX "SocialSchedulePlan_connectorId_idx" ON "SocialSchedulePlan"("connectorId");
CREATE INDEX "SocialSchedulePlan_scheduled_idx" ON "SocialSchedulePlan"("scheduled");

CREATE INDEX "SocialExecutionPlan_tenantId_idx" ON "SocialExecutionPlan"("tenantId");
CREATE INDEX "SocialExecutionPlan_draftId_idx" ON "SocialExecutionPlan"("draftId");
CREATE INDEX "SocialExecutionPlan_connectorId_idx" ON "SocialExecutionPlan"("connectorId");
CREATE INDEX "SocialExecutionPlan_actionKey_idx" ON "SocialExecutionPlan"("actionKey");
CREATE INDEX "SocialExecutionPlan_decision_idx" ON "SocialExecutionPlan"("decision");
CREATE INDEX "SocialExecutionPlan_providerCalled_idx" ON "SocialExecutionPlan"("providerCalled");
CREATE INDEX "SocialExecutionPlan_liveExecutionAllowed_idx" ON "SocialExecutionPlan"("liveExecutionAllowed");

CREATE INDEX "SocialPerformanceSnapshot_tenantId_idx" ON "SocialPerformanceSnapshot"("tenantId");
CREATE INDEX "SocialPerformanceSnapshot_draftId_idx" ON "SocialPerformanceSnapshot"("draftId");
CREATE INDEX "SocialPerformanceSnapshot_platform_idx" ON "SocialPerformanceSnapshot"("platform");
CREATE INDEX "SocialPerformanceSnapshot_snapshotStatus_idx" ON "SocialPerformanceSnapshot"("snapshotStatus");
CREATE INDEX "SocialPerformanceSnapshot_providerCalled_idx" ON "SocialPerformanceSnapshot"("providerCalled");

CREATE UNIQUE INDEX "AutomationPolicyRecord_tenantId_policyKey_key" ON "AutomationPolicyRecord"("tenantId", "policyKey");
CREATE INDEX "AutomationPolicyRecord_tenantId_idx" ON "AutomationPolicyRecord"("tenantId");
CREATE INDEX "AutomationPolicyRecord_featureFlag_idx" ON "AutomationPolicyRecord"("featureFlag");
CREATE INDEX "AutomationPolicyRecord_safeAutoCompatible_idx" ON "AutomationPolicyRecord"("safeAutoCompatible");
CREATE INDEX "AutomationPolicyRecord_externalExecutionAllowed_idx" ON "AutomationPolicyRecord"("externalExecutionAllowed");

CREATE INDEX "AutomationRunRecord_tenantId_idx" ON "AutomationRunRecord"("tenantId");
CREATE INDEX "AutomationRunRecord_policyId_idx" ON "AutomationRunRecord"("policyId");
CREATE INDEX "AutomationRunRecord_runStatus_idx" ON "AutomationRunRecord"("runStatus");
CREATE INDEX "AutomationRunRecord_approvalStatus_idx" ON "AutomationRunRecord"("approvalStatus");
CREATE INDEX "AutomationRunRecord_providerCalled_idx" ON "AutomationRunRecord"("providerCalled");

CREATE INDEX "NotificationRecord_tenantId_idx" ON "NotificationRecord"("tenantId");
CREATE INDEX "NotificationRecord_channel_idx" ON "NotificationRecord"("channel");
CREATE INDEX "NotificationRecord_severity_idx" ON "NotificationRecord"("severity");
CREATE INDEX "NotificationRecord_sourceType_idx" ON "NotificationRecord"("sourceType");
CREATE INDEX "NotificationRecord_acknowledgedAt_idx" ON "NotificationRecord"("acknowledgedAt");
CREATE INDEX "NotificationRecord_providerCalled_idx" ON "NotificationRecord"("providerCalled");
CREATE INDEX "NotificationRecord_sentExternally_idx" ON "NotificationRecord"("sentExternally");

CREATE INDEX "LearningOutcomeEvent_tenantId_idx" ON "LearningOutcomeEvent"("tenantId");
CREATE INDEX "LearningOutcomeEvent_source_idx" ON "LearningOutcomeEvent"("source");
CREATE INDEX "LearningOutcomeEvent_confidence_idx" ON "LearningOutcomeEvent"("confidence");
CREATE INDEX "LearningOutcomeEvent_autonomousSelfModification_idx" ON "LearningOutcomeEvent"("autonomousSelfModification");
CREATE INDEX "LearningOutcomeEvent_providerCalled_idx" ON "LearningOutcomeEvent"("providerCalled");
CREATE INDEX "LearningOutcomeEvent_createdAt_idx" ON "LearningOutcomeEvent"("createdAt");

CREATE INDEX "DailyBriefingSnapshot_tenantId_idx" ON "DailyBriefingSnapshot"("tenantId");
CREATE INDEX "DailyBriefingSnapshot_briefingDate_idx" ON "DailyBriefingSnapshot"("briefingDate");
CREATE INDEX "DailyBriefingSnapshot_providerCalled_idx" ON "DailyBriefingSnapshot"("providerCalled");
CREATE INDEX "DailyBriefingSnapshot_liveExecutionAllowed_idx" ON "DailyBriefingSnapshot"("liveExecutionAllowed");
CREATE INDEX "DailyBriefingSnapshot_createdAt_idx" ON "DailyBriefingSnapshot"("createdAt");

ALTER TABLE "UnifiedApprovalDecision" ADD CONSTRAINT "UnifiedApprovalDecision_approvalItemId_fkey" FOREIGN KEY ("approvalItemId") REFERENCES "UnifiedApprovalItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SocialContentDraft" ADD CONSTRAINT "SocialContentDraft_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "SocialContentSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SocialContentVariant" ADD CONSTRAINT "SocialContentVariant_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "SocialContentDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SocialSchedulePlan" ADD CONSTRAINT "SocialSchedulePlan_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "SocialContentDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SocialExecutionPlan" ADD CONSTRAINT "SocialExecutionPlan_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "SocialContentDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SocialPerformanceSnapshot" ADD CONSTRAINT "SocialPerformanceSnapshot_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "SocialContentDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AutomationRunRecord" ADD CONSTRAINT "AutomationRunRecord_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "AutomationPolicyRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
