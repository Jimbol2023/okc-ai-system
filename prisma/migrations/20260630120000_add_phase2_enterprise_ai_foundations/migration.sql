CREATE TABLE "EnterpriseConnectorRegistry" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "connectorId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "authenticationType" TEXT NOT NULL,
    "oauthSupported" BOOLEAN NOT NULL DEFAULT false,
    "requiredPermissions" JSONB NOT NULL,
    "supportedActions" JSONB NOT NULL,
    "readCapabilities" JSONB NOT NULL,
    "writeCapabilities" JSONB NOT NULL,
    "humanApprovalRequirements" JSONB NOT NULL,
    "safeAutoEligibility" TEXT NOT NULL DEFAULT 'internal_only',
    "rateLimits" JSONB NOT NULL,
    "usageQuotas" JSONB NOT NULL,
    "estimatedCost" TEXT,
    "healthStatus" TEXT NOT NULL DEFAULT 'readiness_only',
    "lastSuccessfulSync" TIMESTAMP(3),
    "lastFailedSync" TIMESTAMP(3),
    "retryPolicy" TEXT NOT NULL,
    "timeoutPolicy" TEXT NOT NULL,
    "circuitBreakerState" TEXT NOT NULL DEFAULT 'not_applicable',
    "loggingConfiguration" TEXT NOT NULL,
    "auditConfiguration" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL DEFAULT 'medium',
    "environmentSupport" JSONB NOT NULL,
    "featureFlags" JSONB NOT NULL,
    "dependencies" JSONB NOT NULL,
    "owner" TEXT NOT NULL,
    "credentialReference" TEXT,
    "lifecycleState" TEXT NOT NULL DEFAULT 'available',
    "providerCallsAllowed" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EnterpriseConnectorRegistry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EnterpriseConnectorHealthEvent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "connectorId" TEXT NOT NULL,
    "healthStatus" TEXT NOT NULL,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSuccessfulSync" TIMESTAMP(3),
    "lastFailedSync" TIMESTAMP(3),
    "failureReason" TEXT,
    "latencyMs" INTEGER,
    "rateLimitRemaining" INTEGER,
    "costObservedCents" INTEGER,
    "circuitBreakerState" TEXT NOT NULL DEFAULT 'not_applicable',
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "safeMetadata" JSONB,
    CONSTRAINT "EnterpriseConnectorHealthEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EnterpriseConnectorLifecycleEvent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "connectorId" TEXT NOT NULL,
    "lifecycleAction" TEXT NOT NULL,
    "fromState" TEXT,
    "toState" TEXT NOT NULL,
    "actorId" TEXT,
    "approvalStatus" TEXT NOT NULL DEFAULT 'pending_manual_approval',
    "result" TEXT NOT NULL DEFAULT 'prepared',
    "reason" TEXT NOT NULL,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "safeMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EnterpriseConnectorLifecycleEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EnterpriseConnectorExecutionDecision" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "connectorId" TEXT,
    "requestingModule" TEXT NOT NULL,
    "requestedAction" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "requiredApprovals" JSONB NOT NULL,
    "fallbackConnectorId" TEXT,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "auditRequired" BOOLEAN NOT NULL DEFAULT true,
    "safeMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EnterpriseConnectorExecutionDecision_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FeatureFlagRecord" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "flagKey" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requiresAdminApproval" BOOLEAN NOT NULL DEFAULT true,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "FeatureFlagRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MarketIntelligenceSignal" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sourceLabel" TEXT NOT NULL,
    "provenance" TEXT NOT NULL,
    "geography" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "marketImpact" TEXT NOT NULL,
    "businessImplication" TEXT NOT NULL,
    "missingData" JSONB NOT NULL,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MarketIntelligenceSignal_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DemandDiscoveryOpportunity" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "audience" TEXT NOT NULL,
    "geography" TEXT NOT NULL,
    "unmetNeed" TEXT NOT NULL,
    "opportunityScore" INTEGER NOT NULL,
    "confidence" INTEGER NOT NULL,
    "revenuePotential" TEXT NOT NULL,
    "sourceLabel" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "requiredReview" JSONB NOT NULL,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DemandDiscoveryOpportunity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GrowthEngineDraft" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "engine" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sourceLabel" TEXT NOT NULL,
    "draftType" TEXT NOT NULL,
    "draftContent" TEXT,
    "approvalStatus" TEXT NOT NULL DEFAULT 'needs_review',
    "safetyBoundary" TEXT NOT NULL,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GrowthEngineDraft_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExecutiveBriefingSnapshot" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'default',
    "cadence" TEXT NOT NULL,
    "priorities" JSONB NOT NULL,
    "connectorHealth" JSONB NOT NULL,
    "marketSignals" JSONB NOT NULL,
    "demandOpportunities" JSONB NOT NULL,
    "growthDrafts" JSONB NOT NULL,
    "featureFlags" JSONB NOT NULL,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExecutiveBriefingSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EnterpriseConnectorRegistry_connectorId_key" ON "EnterpriseConnectorRegistry"("connectorId");
CREATE INDEX "EnterpriseConnectorRegistry_tenantId_idx" ON "EnterpriseConnectorRegistry"("tenantId");
CREATE INDEX "EnterpriseConnectorRegistry_connectorId_idx" ON "EnterpriseConnectorRegistry"("connectorId");
CREATE INDEX "EnterpriseConnectorRegistry_category_idx" ON "EnterpriseConnectorRegistry"("category");
CREATE INDEX "EnterpriseConnectorRegistry_provider_idx" ON "EnterpriseConnectorRegistry"("provider");
CREATE INDEX "EnterpriseConnectorRegistry_healthStatus_idx" ON "EnterpriseConnectorRegistry"("healthStatus");
CREATE INDEX "EnterpriseConnectorRegistry_lifecycleState_idx" ON "EnterpriseConnectorRegistry"("lifecycleState");
CREATE INDEX "EnterpriseConnectorRegistry_providerCallsAllowed_idx" ON "EnterpriseConnectorRegistry"("providerCallsAllowed");
CREATE INDEX "EnterpriseConnectorRegistry_liveExecutionAllowed_idx" ON "EnterpriseConnectorRegistry"("liveExecutionAllowed");

CREATE INDEX "EnterpriseConnectorHealthEvent_tenantId_idx" ON "EnterpriseConnectorHealthEvent"("tenantId");
CREATE INDEX "EnterpriseConnectorHealthEvent_connectorId_idx" ON "EnterpriseConnectorHealthEvent"("connectorId");
CREATE INDEX "EnterpriseConnectorHealthEvent_healthStatus_idx" ON "EnterpriseConnectorHealthEvent"("healthStatus");
CREATE INDEX "EnterpriseConnectorHealthEvent_checkedAt_idx" ON "EnterpriseConnectorHealthEvent"("checkedAt");
CREATE INDEX "EnterpriseConnectorHealthEvent_providerCalled_idx" ON "EnterpriseConnectorHealthEvent"("providerCalled");

CREATE INDEX "EnterpriseConnectorLifecycleEvent_tenantId_idx" ON "EnterpriseConnectorLifecycleEvent"("tenantId");
CREATE INDEX "EnterpriseConnectorLifecycleEvent_connectorId_idx" ON "EnterpriseConnectorLifecycleEvent"("connectorId");
CREATE INDEX "EnterpriseConnectorLifecycleEvent_lifecycleAction_idx" ON "EnterpriseConnectorLifecycleEvent"("lifecycleAction");
CREATE INDEX "EnterpriseConnectorLifecycleEvent_approvalStatus_idx" ON "EnterpriseConnectorLifecycleEvent"("approvalStatus");
CREATE INDEX "EnterpriseConnectorLifecycleEvent_result_idx" ON "EnterpriseConnectorLifecycleEvent"("result");
CREATE INDEX "EnterpriseConnectorLifecycleEvent_createdAt_idx" ON "EnterpriseConnectorLifecycleEvent"("createdAt");

CREATE INDEX "EnterpriseConnectorExecutionDecision_tenantId_idx" ON "EnterpriseConnectorExecutionDecision"("tenantId");
CREATE INDEX "EnterpriseConnectorExecutionDecision_connectorId_idx" ON "EnterpriseConnectorExecutionDecision"("connectorId");
CREATE INDEX "EnterpriseConnectorExecutionDecision_requestingModule_idx" ON "EnterpriseConnectorExecutionDecision"("requestingModule");
CREATE INDEX "EnterpriseConnectorExecutionDecision_requestedAction_idx" ON "EnterpriseConnectorExecutionDecision"("requestedAction");
CREATE INDEX "EnterpriseConnectorExecutionDecision_decision_idx" ON "EnterpriseConnectorExecutionDecision"("decision");
CREATE INDEX "EnterpriseConnectorExecutionDecision_providerCalled_idx" ON "EnterpriseConnectorExecutionDecision"("providerCalled");
CREATE INDEX "EnterpriseConnectorExecutionDecision_createdAt_idx" ON "EnterpriseConnectorExecutionDecision"("createdAt");

CREATE UNIQUE INDEX "FeatureFlagRecord_tenantId_flagKey_key" ON "FeatureFlagRecord"("tenantId", "flagKey");
CREATE INDEX "FeatureFlagRecord_tenantId_idx" ON "FeatureFlagRecord"("tenantId");
CREATE INDEX "FeatureFlagRecord_flagKey_idx" ON "FeatureFlagRecord"("flagKey");
CREATE INDEX "FeatureFlagRecord_enabled_idx" ON "FeatureFlagRecord"("enabled");

CREATE INDEX "MarketIntelligenceSignal_tenantId_idx" ON "MarketIntelligenceSignal"("tenantId");
CREATE INDEX "MarketIntelligenceSignal_category_idx" ON "MarketIntelligenceSignal"("category");
CREATE INDEX "MarketIntelligenceSignal_sourceLabel_idx" ON "MarketIntelligenceSignal"("sourceLabel");
CREATE INDEX "MarketIntelligenceSignal_geography_idx" ON "MarketIntelligenceSignal"("geography");
CREATE INDEX "MarketIntelligenceSignal_confidence_idx" ON "MarketIntelligenceSignal"("confidence");
CREATE INDEX "MarketIntelligenceSignal_marketImpact_idx" ON "MarketIntelligenceSignal"("marketImpact");
CREATE INDEX "MarketIntelligenceSignal_createdAt_idx" ON "MarketIntelligenceSignal"("createdAt");

CREATE INDEX "DemandDiscoveryOpportunity_tenantId_idx" ON "DemandDiscoveryOpportunity"("tenantId");
CREATE INDEX "DemandDiscoveryOpportunity_audience_idx" ON "DemandDiscoveryOpportunity"("audience");
CREATE INDEX "DemandDiscoveryOpportunity_geography_idx" ON "DemandDiscoveryOpportunity"("geography");
CREATE INDEX "DemandDiscoveryOpportunity_opportunityScore_idx" ON "DemandDiscoveryOpportunity"("opportunityScore");
CREATE INDEX "DemandDiscoveryOpportunity_confidence_idx" ON "DemandDiscoveryOpportunity"("confidence");
CREATE INDEX "DemandDiscoveryOpportunity_revenuePotential_idx" ON "DemandDiscoveryOpportunity"("revenuePotential");
CREATE INDEX "DemandDiscoveryOpportunity_createdAt_idx" ON "DemandDiscoveryOpportunity"("createdAt");

CREATE INDEX "GrowthEngineDraft_tenantId_idx" ON "GrowthEngineDraft"("tenantId");
CREATE INDEX "GrowthEngineDraft_engine_idx" ON "GrowthEngineDraft"("engine");
CREATE INDEX "GrowthEngineDraft_sourceLabel_idx" ON "GrowthEngineDraft"("sourceLabel");
CREATE INDEX "GrowthEngineDraft_approvalStatus_idx" ON "GrowthEngineDraft"("approvalStatus");
CREATE INDEX "GrowthEngineDraft_providerCalled_idx" ON "GrowthEngineDraft"("providerCalled");
CREATE INDEX "GrowthEngineDraft_sent_idx" ON "GrowthEngineDraft"("sent");
CREATE INDEX "GrowthEngineDraft_published_idx" ON "GrowthEngineDraft"("published");
CREATE INDEX "GrowthEngineDraft_createdAt_idx" ON "GrowthEngineDraft"("createdAt");

CREATE INDEX "ExecutiveBriefingSnapshot_tenantId_idx" ON "ExecutiveBriefingSnapshot"("tenantId");
CREATE INDEX "ExecutiveBriefingSnapshot_cadence_idx" ON "ExecutiveBriefingSnapshot"("cadence");
CREATE INDEX "ExecutiveBriefingSnapshot_providerCalled_idx" ON "ExecutiveBriefingSnapshot"("providerCalled");
CREATE INDEX "ExecutiveBriefingSnapshot_liveExecutionAllowed_idx" ON "ExecutiveBriefingSnapshot"("liveExecutionAllowed");
CREATE INDEX "ExecutiveBriefingSnapshot_createdAt_idx" ON "ExecutiveBriefingSnapshot"("createdAt");

ALTER TABLE "EnterpriseConnectorHealthEvent" ADD CONSTRAINT "EnterpriseConnectorHealthEvent_connectorId_fkey" FOREIGN KEY ("connectorId") REFERENCES "EnterpriseConnectorRegistry"("connectorId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EnterpriseConnectorLifecycleEvent" ADD CONSTRAINT "EnterpriseConnectorLifecycleEvent_connectorId_fkey" FOREIGN KEY ("connectorId") REFERENCES "EnterpriseConnectorRegistry"("connectorId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EnterpriseConnectorExecutionDecision" ADD CONSTRAINT "EnterpriseConnectorExecutionDecision_connectorId_fkey" FOREIGN KEY ("connectorId") REFERENCES "EnterpriseConnectorRegistry"("connectorId") ON DELETE SET NULL ON UPDATE CASCADE;

