CREATE TABLE "UeipGatewayAuditEvent" (
    "id" TEXT NOT NULL,
    "traceId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "installationId" TEXT,
    "connectorId" TEXT NOT NULL,
    "capabilityKey" TEXT NOT NULL,
    "manifestVersion" TEXT NOT NULL,
    "policyVersion" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL DEFAULT 0,
    "endpointId" TEXT,
    "latencyMs" INTEGER,
    "providerAttempted" BOOLEAN NOT NULL DEFAULT false,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "auditComplete" BOOLEAN NOT NULL DEFAULT true,
    "reasonCodes" JSONB NOT NULL,
    "safeMetadata" JSONB,
    "sequenceNumber" INTEGER NOT NULL DEFAULT 1,
    "previousEventDigest" TEXT,
    "eventDigest" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UeipGatewayAuditEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "UeipGatewayAuditEvent_tenantId_idx" ON "UeipGatewayAuditEvent"("tenantId");
CREATE INDEX "UeipGatewayAuditEvent_traceId_idx" ON "UeipGatewayAuditEvent"("traceId");
CREATE INDEX "UeipGatewayAuditEvent_connectorId_idx" ON "UeipGatewayAuditEvent"("connectorId");
CREATE INDEX "UeipGatewayAuditEvent_capabilityKey_idx" ON "UeipGatewayAuditEvent"("capabilityKey");
CREATE INDEX "UeipGatewayAuditEvent_installationId_idx" ON "UeipGatewayAuditEvent"("installationId");
CREATE INDEX "UeipGatewayAuditEvent_actorId_idx" ON "UeipGatewayAuditEvent"("actorId");
CREATE INDEX "UeipGatewayAuditEvent_stage_idx" ON "UeipGatewayAuditEvent"("stage");
CREATE INDEX "UeipGatewayAuditEvent_decision_idx" ON "UeipGatewayAuditEvent"("decision");
CREATE INDEX "UeipGatewayAuditEvent_providerCalled_idx" ON "UeipGatewayAuditEvent"("providerCalled");
CREATE INDEX "UeipGatewayAuditEvent_createdAt_idx" ON "UeipGatewayAuditEvent"("createdAt");
CREATE UNIQUE INDEX "UeipGatewayAuditEvent_traceId_sequenceNumber_key" ON "UeipGatewayAuditEvent"("traceId", "sequenceNumber");

CREATE TABLE "UeipEnvironmentIdentity" (
    "id" TEXT NOT NULL,
    "environmentId" TEXT NOT NULL,
    "environmentType" TEXT NOT NULL,
    "databaseFingerprint" TEXT NOT NULL,
    "productionProhibited" BOOLEAN NOT NULL DEFAULT true,
    "verifiedBy" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UeipEnvironmentIdentity_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UeipEnvironmentIdentity_environmentId_key" ON "UeipEnvironmentIdentity"("environmentId");
CREATE INDEX "UeipEnvironmentIdentity_environmentType_idx" ON "UeipEnvironmentIdentity"("environmentType");
CREATE INDEX "UeipEnvironmentIdentity_databaseFingerprint_idx" ON "UeipEnvironmentIdentity"("databaseFingerprint");
CREATE INDEX "UeipEnvironmentIdentity_productionProhibited_idx" ON "UeipEnvironmentIdentity"("productionProhibited");

CREATE TABLE "UeipPilotAuthorization" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "connectorId" TEXT NOT NULL,
    "capabilityKey" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "approvingActorId" TEXT NOT NULL,
    "nonceHash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'approved',
    "maximumProviderCalls" INTEGER NOT NULL DEFAULT 1,
    "providerCallCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "lockedAt" TIMESTAMP(3),
    "traceId" TEXT,
    "resultStatus" TEXT,
    "auditReferenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UeipPilotAuthorization_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UeipPilotAuthorization_nonceHash_key" ON "UeipPilotAuthorization"("nonceHash");
CREATE INDEX "UeipPilotAuthorization_tenantId_idx" ON "UeipPilotAuthorization"("tenantId");
CREATE INDEX "UeipPilotAuthorization_connectorId_idx" ON "UeipPilotAuthorization"("connectorId");
CREATE INDEX "UeipPilotAuthorization_capabilityKey_idx" ON "UeipPilotAuthorization"("capabilityKey");
CREATE INDEX "UeipPilotAuthorization_environment_idx" ON "UeipPilotAuthorization"("environment");
CREATE INDEX "UeipPilotAuthorization_status_idx" ON "UeipPilotAuthorization"("status");
CREATE INDEX "UeipPilotAuthorization_expiresAt_idx" ON "UeipPilotAuthorization"("expiresAt");
CREATE INDEX "UeipPilotAuthorization_traceId_idx" ON "UeipPilotAuthorization"("traceId");

CREATE TABLE "UeipPilotControlEvent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "connectorId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "reasonCodes" JSONB NOT NULL,
    "safeMetadata" JSONB,
    "providerCalled" BOOLEAN NOT NULL DEFAULT false,
    "liveExecutionAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UeipPilotControlEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "UeipPilotControlEvent_tenantId_idx" ON "UeipPilotControlEvent"("tenantId");
CREATE INDEX "UeipPilotControlEvent_connectorId_idx" ON "UeipPilotControlEvent"("connectorId");
CREATE INDEX "UeipPilotControlEvent_eventType_idx" ON "UeipPilotControlEvent"("eventType");
CREATE INDEX "UeipPilotControlEvent_decision_idx" ON "UeipPilotControlEvent"("decision");
CREATE INDEX "UeipPilotControlEvent_createdAt_idx" ON "UeipPilotControlEvent"("createdAt");
