import { randomUUID } from "node:crypto";

import type { PrismaClient } from "@/generated/prisma";

import type {
  PropertyOpportunityDb,
  PropertyOpportunityRecord,
  PropertyOpportunitySavedFilterRecord,
} from "@/lib/property-opportunity-engine";

type RawPrisma = Pick<PrismaClient, "$queryRawUnsafe"> & Pick<PrismaClient, "revenueTask">;

function first<T>(rows: T[]) {
  return rows[0] ?? null;
}

export function createPrismaPropertyOpportunityDb(prisma: RawPrisma): PropertyOpportunityDb {
  return {
    propertyOpportunity: {
      async findMany(args: { where?: { tenantId?: string } }) {
        const tenantId = args.where?.tenantId ?? "default";

        return prisma.$queryRawUnsafe<PropertyOpportunityRecord[]>(
          `
            SELECT *
            FROM "PropertyOpportunity"
            WHERE "tenantId" = $1
            ORDER BY "opportunityScore" DESC, "createdAt" DESC
          `,
          tenantId,
        );
      },
      async findFirst(args: { where?: { id?: string; tenantId?: string; duplicateKey?: string } }) {
        const where = args.where ?? {};

        if (where.id) {
          return first(await prisma.$queryRawUnsafe<PropertyOpportunityRecord[]>(
            `
              SELECT *
              FROM "PropertyOpportunity"
              WHERE "id" = $1 AND "tenantId" = $2
              LIMIT 1
            `,
            where.id,
            where.tenantId ?? "default",
          ));
        }

        if (where.duplicateKey) {
          return first(await prisma.$queryRawUnsafe<PropertyOpportunityRecord[]>(
            `
              SELECT *
              FROM "PropertyOpportunity"
              WHERE "tenantId" = $1 AND "duplicateKey" = $2
              LIMIT 1
            `,
            where.tenantId ?? "default",
            where.duplicateKey,
          ));
        }

        return null;
      },
      async upsert(args: {
        where: { tenantId_duplicateKey: { tenantId: string; duplicateKey: string } };
        update: Partial<PropertyOpportunityRecord>;
        create: Omit<PropertyOpportunityRecord, "id" | "createdAt" | "updatedAt">;
      }) {
        const create = args.create;
        const update = args.update;

        return first(await prisma.$queryRawUnsafe<PropertyOpportunityRecord[]>(
          `
            INSERT INTO "PropertyOpportunity" (
              "id", "tenantId", "canonicalAddress", "propertyAddress", "city", "state", "zipCode", "county", "parcelId",
              "ownerName", "mailingAddress", "source", "sourceDetail", "evidence", "distressIndicators", "observations",
              "photoMetadata", "opportunityScore", "opportunityPriority", "confidence", "duplicateKey", "duplicateRisk",
              "missingEvidence", "recommendedAction", "safetyFlags", "providerCalled", "sent", "published", "crmMutated",
              "liveExecutionAllowed", "createdBy", "createdAt", "updatedAt"
            )
            VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9,
              $10, $11, $12, $13, $14::jsonb, $15::jsonb, $16::jsonb,
              $17::jsonb, $18, $19, $20, $21, $22,
              $23::jsonb, $24, $25::jsonb, false, false, false, false,
              false, $26, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
            ON CONFLICT ("tenantId", "duplicateKey") DO UPDATE SET
              "canonicalAddress" = $27,
              "propertyAddress" = $28,
              "city" = $29,
              "state" = $30,
              "zipCode" = $31,
              "county" = $32,
              "parcelId" = $33,
              "ownerName" = $34,
              "mailingAddress" = $35,
              "source" = $36,
              "sourceDetail" = $37,
              "evidence" = $38::jsonb,
              "distressIndicators" = $39::jsonb,
              "observations" = $40::jsonb,
              "photoMetadata" = $41::jsonb,
              "opportunityScore" = $42,
              "opportunityPriority" = $43,
              "confidence" = $44,
              "duplicateRisk" = $45,
              "missingEvidence" = $46::jsonb,
              "recommendedAction" = $47,
              "safetyFlags" = $48::jsonb,
              "providerCalled" = false,
              "sent" = false,
              "published" = false,
              "crmMutated" = false,
              "liveExecutionAllowed" = false,
              "updatedAt" = CURRENT_TIMESTAMP
            RETURNING *
          `,
          randomUUID(),
          create.tenantId,
          create.canonicalAddress,
          create.propertyAddress,
          create.city,
          create.state,
          create.zipCode,
          create.county,
          create.parcelId,
          create.ownerName,
          create.mailingAddress,
          create.source,
          create.sourceDetail,
          JSON.stringify(create.evidence),
          JSON.stringify(create.distressIndicators),
          JSON.stringify(create.observations),
          JSON.stringify(create.photoMetadata),
          create.opportunityScore,
          create.opportunityPriority,
          create.confidence,
          create.duplicateKey,
          create.duplicateRisk,
          JSON.stringify(create.missingEvidence),
          create.recommendedAction,
          JSON.stringify(create.safetyFlags),
          create.createdBy,
          update.canonicalAddress ?? create.canonicalAddress,
          update.propertyAddress ?? create.propertyAddress,
          update.city ?? create.city,
          update.state ?? create.state,
          update.zipCode ?? create.zipCode,
          update.county ?? create.county,
          update.parcelId ?? create.parcelId,
          update.ownerName ?? create.ownerName,
          update.mailingAddress ?? create.mailingAddress,
          update.source ?? create.source,
          update.sourceDetail ?? null,
          JSON.stringify(update.evidence ?? {}),
          JSON.stringify(update.distressIndicators ?? []),
          JSON.stringify(update.observations ?? []),
          JSON.stringify(update.photoMetadata ?? []),
          update.opportunityScore ?? 0,
          update.opportunityPriority ?? "Low",
          update.confidence ?? 0,
          update.duplicateRisk ?? true,
          JSON.stringify(update.missingEvidence ?? []),
          update.recommendedAction ?? "Review property opportunity manually.",
          JSON.stringify(update.safetyFlags ?? {}),
        )) as PropertyOpportunityRecord;
      },
      async update() {
        throw new Error("PropertyOpportunity raw update is not implemented for the MVP API surface.");
      },
    },
    propertyOpportunitySavedFilter: {
      async findMany(args: { where?: { tenantId?: string } }) {
        return prisma.$queryRawUnsafe<PropertyOpportunitySavedFilterRecord[]>(
          `
            SELECT *
            FROM "PropertyOpportunitySavedFilter"
            WHERE "tenantId" = $1
            ORDER BY "name" ASC
          `,
          args.where?.tenantId ?? "default",
        );
      },
      async upsert(args: {
        where: { tenantId_filterKey: { tenantId: string; filterKey: string } };
        update: Partial<PropertyOpportunitySavedFilterRecord>;
        create: Omit<PropertyOpportunitySavedFilterRecord, "id" | "createdAt" | "updatedAt">;
      }) {
        const create = args.create;
        const update = args.update;

        return first(await prisma.$queryRawUnsafe<PropertyOpportunitySavedFilterRecord[]>(
          `
            INSERT INTO "PropertyOpportunitySavedFilter" (
              "id", "tenantId", "name", "filterKey", "criteria", "safetyFlags", "providerCalled", "sent",
              "published", "crmMutated", "liveExecutionAllowed", "createdBy", "createdAt", "updatedAt"
            )
            VALUES (
              $1, $2, $3, $4, $5::jsonb, $6::jsonb, false, false,
              false, false, false, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
            ON CONFLICT ("tenantId", "filterKey") DO UPDATE SET
              "name" = $8,
              "criteria" = $9::jsonb,
              "safetyFlags" = $10::jsonb,
              "providerCalled" = false,
              "sent" = false,
              "published" = false,
              "crmMutated" = false,
              "liveExecutionAllowed" = false,
              "updatedAt" = CURRENT_TIMESTAMP
            RETURNING *
          `,
          randomUUID(),
          create.tenantId,
          create.name,
          create.filterKey,
          JSON.stringify(create.criteria),
          JSON.stringify(create.safetyFlags),
          create.createdBy,
          update.name ?? create.name,
          JSON.stringify(update.criteria ?? create.criteria),
          JSON.stringify(update.safetyFlags ?? create.safetyFlags),
        )) as PropertyOpportunitySavedFilterRecord;
      },
    },
    revenueTask: prisma.revenueTask,
  };
}
