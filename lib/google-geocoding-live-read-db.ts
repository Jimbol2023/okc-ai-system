import type { PrismaClient } from "@/generated/prisma";
import type { GoogleGeocodeExecutionAttempt, GoogleGeocodeStagedCandidate, GoogleGeocodingRuntimeDb } from "@/lib/google-geocoding-live-read";

type RawPrisma = Pick<PrismaClient, "$queryRawUnsafe" | "$executeRawUnsafe">;

function first<T>(rows: T[]) {
  return rows[0] ?? null;
}

export function createPrismaGoogleGeocodingRuntimeDb(prisma: RawPrisma): GoogleGeocodingRuntimeDb {
  return {
    async countProviderCallsToday(input) {
      const rows = await prisma.$queryRawUnsafe<Array<{ count: bigint | number }>>(
        `
          SELECT COUNT(*) AS count
          FROM "ConnectorExecutionAttempt"
          WHERE "tenantId" = $1
            AND "connectorId" = $2
            AND "actionKey" = $3
            AND "providerCalled" = true
            AND "createdAt" >= $4::timestamp
        `,
        input.tenantId,
        input.connectorId,
        input.actionKey,
        input.since,
      );
      const count = first(rows)?.count ?? 0;

      return typeof count === "bigint" ? Number(count) : count;
    },
    async findAttemptByIdempotencyKey(input) {
      return first(await prisma.$queryRawUnsafe<GoogleGeocodeExecutionAttempt[]>(
        `
          SELECT *
          FROM "ConnectorExecutionAttempt"
          WHERE "tenantId" = $1 AND "idempotencyKey" = $2
          ORDER BY "createdAt" DESC
          LIMIT 1
        `,
        input.tenantId,
        input.idempotencyKey,
      ));
    },
    async recordExecutionAttempt(input) {
      return first(await prisma.$queryRawUnsafe<GoogleGeocodeExecutionAttempt[]>(
        `
          INSERT INTO "ConnectorExecutionAttempt" (
            "id", "tenantId", "traceId", "idempotencyKey", "connectorId", "capabilityKey", "actionKey",
            "actorId", "requestingModule", "policyDecision", "reason", "resultClassification",
            "queryCount", "costCents", "creditsUsed", "normalizedResult", "redactionApplied",
            "auditEventId", "outcomeEventId", "providerCalled", "providerWrite", "sent", "published",
            "liveExecutionAllowed", "startedAt", "completedAt", "createdAt"
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10, $11, $12,
            $13, $14, $15, $16::jsonb, true,
            NULL, NULL, $17, false, false, false,
            false, $18::timestamp, $19::timestamp, CURRENT_TIMESTAMP
          )
          ON CONFLICT ("tenantId", "traceId") DO UPDATE SET
            "reason" = EXCLUDED."reason",
            "resultClassification" = EXCLUDED."resultClassification",
            "normalizedResult" = EXCLUDED."normalizedResult",
            "completedAt" = EXCLUDED."completedAt"
          RETURNING *
        `,
        input.id,
        input.tenantId,
        input.traceId,
        input.idempotencyKey,
        input.connectorId,
        input.capabilityKey,
        input.actionKey,
        input.actorId,
        input.requestingModule,
        input.policyDecision,
        input.reason,
        input.resultClassification,
        input.queryCount,
        input.costCents,
        input.creditsUsed,
        JSON.stringify(input.normalizedResult ?? {}),
        input.providerCalled,
        input.startedAt,
        input.completedAt,
      )) as GoogleGeocodeExecutionAttempt;
    },
    async findCandidateByDuplicateKey(input) {
      return first(await prisma.$queryRawUnsafe<Array<{ id: string; duplicateKey: string }>>(
        `
          SELECT "id", "duplicateKey"
          FROM "PropertyCandidate"
          WHERE "tenantId" = $1 AND "duplicateKey" = $2
          LIMIT 1
        `,
        input.tenantId,
        input.duplicateKey,
      ));
    },
    async createPropertyCandidate(input: GoogleGeocodeStagedCandidate) {
      const data = input.propertyCandidateInput;
      const reviewStatus = input.duplicateStatus === "unique" ? "new" : "needs_verification";

      return first(await prisma.$queryRawUnsafe<Array<{ id: string; duplicateStatus: string; reviewStatus: string }>>(
        `
          INSERT INTO "PropertyCandidate" (
            "id", "tenantId", "source", "sourceDetail", "sourceRecordId", "propertyAddress", "normalizedAddress",
            "city", "state", "zipCode", "county", "parcelId", "latitude", "longitude", "coordinateSource",
            "ownerName", "mailingAddress", "sourceEvidence", "observations", "distressIndicators", "confidence",
            "duplicateKey", "duplicateStatus", "providerName", "providerRequestId", "retrievedAt", "costCents",
            "creditsUsed", "reviewStatus", "createdBy", "providerCalled", "providerWrite", "sent", "published",
            "outreach", "crmMutated", "skipTracePerformed", "directMailSent", "externalExecutionAllowed",
            "liveExecutionAllowed", "createdAt", "updatedAt"
          )
          VALUES (
            $1, $2, 'google_geocode', $3, $4, $5, $6,
            $7, $8, $9, $10, $11, $12, $13, $14,
            NULL, NULL, $15::jsonb, $16::jsonb, '[]'::jsonb, $17,
            $18, $19, 'Google Maps Platform', $20, $21::timestamp, $22,
            $23, $24, $25, true, false, false, false,
            false, false, false, false, false,
            false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          )
          RETURNING "id", "duplicateStatus", "reviewStatus"
        `,
        input.id,
        input.tenantId,
        data.sourceDetail,
        data.sourceRecordId,
        data.propertyAddress,
        input.normalizedAddress,
        data.city || null,
        data.state || null,
        data.zipCode || null,
        data.county || null,
        data.parcelId || null,
        typeof data.latitude === "number" ? data.latitude : null,
        typeof data.longitude === "number" ? data.longitude : null,
        data.coordinateSource || null,
        JSON.stringify(data.sourceEvidence),
        JSON.stringify(data.observations),
        data.confidence,
        input.duplicateKey,
        input.duplicateStatus,
        data.providerRequestId || null,
        data.retrievedAt ?? new Date().toISOString(),
        data.costCents,
        data.creditsUsed,
        reviewStatus,
        "google_geocode_runtime",
      )) as { id: string; duplicateStatus: string; reviewStatus: string };
    },
  };
}
