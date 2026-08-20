import { randomUUID } from "node:crypto";

import type { PrismaClient } from "@/generated/prisma";
import type { PropertyCandidateDb, PropertyCandidateRecord } from "@/lib/property-candidate-foundation";

type RawPrisma = Pick<PrismaClient, "$queryRawUnsafe"> & Pick<PrismaClient, "lead" | "revenueAuditEvent">;

function first<T>(rows: T[]) {
  return rows[0] ?? null;
}

export function createPrismaPropertyCandidateDb(prisma: RawPrisma): PropertyCandidateDb {
  return {
    propertyCandidate: {
      async findMany(args: { where?: { tenantId?: string } }) {
        return prisma.$queryRawUnsafe<PropertyCandidateRecord[]>(
          `
            SELECT *
            FROM "PropertyCandidate"
            WHERE "tenantId" = $1
            ORDER BY "createdAt" DESC
          `,
          args.where?.tenantId ?? "default",
        );
      },
      async findFirst(args: { where?: { id?: string; tenantId?: string; duplicateKey?: string } }) {
        const where = args.where ?? {};

        if (where.id) {
          return first(await prisma.$queryRawUnsafe<PropertyCandidateRecord[]>(
            `
              SELECT *
              FROM "PropertyCandidate"
              WHERE "id" = $1 AND "tenantId" = $2
              LIMIT 1
            `,
            where.id,
            where.tenantId ?? "default",
          ));
        }

        if (where.duplicateKey) {
          return first(await prisma.$queryRawUnsafe<PropertyCandidateRecord[]>(
            `
              SELECT *
              FROM "PropertyCandidate"
              WHERE "tenantId" = $1 AND "duplicateKey" = $2
              LIMIT 1
            `,
            where.tenantId ?? "default",
            where.duplicateKey,
          ));
        }

        return null;
      },
      async create(args: { data: Omit<PropertyCandidateRecord, "id" | "createdAt" | "updatedAt"> }) {
        const data = args.data;

        return first(await prisma.$queryRawUnsafe<PropertyCandidateRecord[]>(
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
              $1, $2, $3, $4, $5, $6, $7,
              $8, $9, $10, $11, $12, $13, $14, $15,
              $16, $17, $18::jsonb, $19::jsonb, $20::jsonb, $21,
              $22, $23, $24, $25, $26, $27,
              $28, $29, $30, false, false, false, false,
              false, false, false, false, false,
              false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
            RETURNING *
          `,
          randomUUID(),
          data.tenantId,
          data.source,
          data.sourceDetail,
          data.sourceRecordId,
          data.propertyAddress,
          data.normalizedAddress,
          data.city,
          data.state,
          data.zipCode,
          data.county,
          data.parcelId,
          data.latitude,
          data.longitude,
          data.coordinateSource,
          data.ownerName,
          data.mailingAddress,
          JSON.stringify(data.sourceEvidence),
          JSON.stringify(data.observations),
          JSON.stringify(data.distressIndicators),
          data.confidence,
          data.duplicateKey,
          data.duplicateStatus,
          data.providerName,
          data.providerRequestId,
          data.retrievedAt,
          data.costCents,
          data.creditsUsed,
          data.reviewStatus,
          data.createdBy,
        )) as PropertyCandidateRecord;
      },
      async update(args: { where: { id: string; tenantId: string }; data: Partial<PropertyCandidateRecord> }) {
        return first(await prisma.$queryRawUnsafe<PropertyCandidateRecord[]>(
          `
            UPDATE "PropertyCandidate"
            SET
              "reviewStatus" = COALESCE($3, "reviewStatus"),
              "duplicateStatus" = COALESCE($4, "duplicateStatus"),
              "providerCalled" = false,
              "providerWrite" = false,
              "sent" = false,
              "published" = false,
              "outreach" = false,
              "crmMutated" = false,
              "skipTracePerformed" = false,
              "directMailSent" = false,
              "externalExecutionAllowed" = false,
              "liveExecutionAllowed" = false,
              "updatedAt" = CURRENT_TIMESTAMP
            WHERE "id" = $1 AND "tenantId" = $2
            RETURNING *
          `,
          args.where.id,
          args.where.tenantId,
          args.data.reviewStatus ?? null,
          args.data.duplicateStatus ?? null,
        )) as PropertyCandidateRecord;
      },
    },
    lead: {
      async findFirst(args: { where?: { tenantId?: string; propertyAddress?: string } }) {
        if (!args.where?.propertyAddress) return null;

        return prisma.lead.findFirst({
          where: {
            propertyAddress: args.where.propertyAddress,
          },
          select: {
            id: true,
            propertyAddress: true,
            source: true,
          },
        });
      },
      async create(args: { data: Record<string, unknown> }) {
        const leadData = { ...args.data };
        delete leadData.tenantId;

        return prisma.lead.create({
          data: leadData as never,
          select: { id: true },
        });
      },
    },
    propertyOpportunity: {
      async findFirst(args: { where?: { tenantId?: string; duplicateKey?: string; propertyAddress?: string } }) {
        if (args.where?.duplicateKey) {
          return first(await prisma.$queryRawUnsafe<Array<{ id: string; duplicateKey: string; propertyAddress: string; parcelId: string | null; county: string | null }>>(
            `
              SELECT "id", "duplicateKey", "propertyAddress", "parcelId", "county"
              FROM "PropertyOpportunity"
              WHERE "tenantId" = $1 AND "duplicateKey" = $2
              LIMIT 1
            `,
            args.where.tenantId ?? "default",
            args.where.duplicateKey,
          ));
        }

        if (args.where?.propertyAddress) {
          return first(await prisma.$queryRawUnsafe<Array<{ id: string; duplicateKey: string; propertyAddress: string; parcelId: string | null; county: string | null }>>(
            `
              SELECT "id", "duplicateKey", "propertyAddress", "parcelId", "county"
              FROM "PropertyOpportunity"
              WHERE "tenantId" = $1 AND "propertyAddress" = $2
              LIMIT 1
            `,
            args.where.tenantId ?? "default",
            args.where.propertyAddress,
          ));
        }

        return null;
      },
    },
    revenueAuditEvent: prisma.revenueAuditEvent,
  };
}
