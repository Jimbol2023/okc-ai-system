import {
  dbLeadToStoredLead,
  importedLeadToStoredLead,
  leadIntakeToStoredLead,
  storedLeadToDbData
} from "@/lib/lead-record";
import { prisma } from "@/lib/prisma";
import { assertOperationalEvidenceAllowed, operationalEvidenceFromLead, operationalEvidenceFromStoredLead } from "@/lib/operational-evidence-guard";
import { logRevenueAuditEvent, syncLeadRevenueSpine } from "@/lib/revenue-spine";
import type { ImportedLeadDraft } from "@/lib/list-importer";
import type { LeadStatus, StoredLead } from "@/lib/leads-storage";
import { requireTenantId, type TenantIdentity } from "@/lib/tenant-context";
import { leadIntakeSchema, type LeadIntakeInput } from "@/lib/validations/lead";

type AutomationStoredLead = StoredLead & {
  lastContactedAt?: Date | string | null;
  nextFollowUpAt?: Date | string | null;
  followUpCount?: number;
  lastFollowUpMessage?: string | null;
  automationStatus?: string | null;
  isHot?: boolean;
};

let leadDb = prisma;
let leadAudit = logRevenueAuditEvent;
let leadRevenueSync = syncLeadRevenueSpine;

export function setLeadDatabaseDependenciesForTest(input: {
  db?: typeof prisma;
  audit?: typeof logRevenueAuditEvent;
  sync?: typeof syncLeadRevenueSpine;
}) {
  if (input.db) leadDb = input.db;
  if (input.audit) leadAudit = input.audit;
  if (input.sync) leadRevenueSync = input.sync;
  return () => {
    leadDb = prisma;
    leadAudit = logRevenueAuditEvent;
    leadRevenueSync = syncLeadRevenueSpine;
  };
}

function isPrismaUniqueError(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "P2002");
}

function toDateOrNull(value: Date | string | null | undefined) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getDefaultNextFollowUpAt() {
  return new Date(Date.now() + 5 * 60 * 1000);
}

function getPropertyFirstPhoneKey(lead: Pick<StoredLead, "propertyAddress" | "source" | "parcelId" | "county">) {
  return [
    "property_only",
    lead.source.trim().toLowerCase() || "unknown_source",
    lead.propertyAddress.trim().toLowerCase(),
    lead.parcelId.trim().toLowerCase() || lead.county.trim().toLowerCase() || "no_parcel",
  ]
    .join(":")
    .replace(/\s+/g, "_");
}

async function findExistingLead(context: TenantIdentity, lead: Pick<StoredLead, "propertyAddress" | "phone" | "source" | "parcelId" | "county">) {
  const tenantId = requireTenantId(context.tenantId, "lead_deduplication");
  return leadDb.lead.findFirst({
    where: {
      tenantId,
      propertyAddress: lead.propertyAddress,
      phone: lead.phone || getPropertyFirstPhoneKey(lead),
    }
  });
}

export async function listDbLeads(context: TenantIdentity) {
  const tenantId = requireTenantId(context.tenantId, "lead_list");
  const leads = await leadDb.lead.findMany({
    where: { tenantId },
    orderBy: [{ score: "desc" }, { createdAt: "desc" }]
  });

  return leads.map(dbLeadToStoredLead);
}

export async function getDbLeadById(context: TenantIdentity, leadId: string) {
  const tenantId = requireTenantId(context.tenantId, "lead_read");
  const lead = await leadDb.lead.findFirst({
    where: {
      id: leadId,
      tenantId,
    }
  });

  return lead ? dbLeadToStoredLead(lead) : null;
}

export async function createDbLead(context: TenantIdentity, storedLead: StoredLead) {
  const tenantId = requireTenantId(context.tenantId, "lead_create");
  const evidence = operationalEvidenceFromStoredLead(tenantId, storedLead);
  assertOperationalEvidenceAllowed(evidence, "lead_persistence");
  const existingLead = await findExistingLead({ tenantId }, storedLead);

  if (existingLead) {
    const duplicateStoredLead = dbLeadToStoredLead(existingLead);

    await leadAudit({
      tenantId,
      action: "dedupe_warning",
      targetType: "lead",
      targetId: existingLead.id,
      source: "lead_create",
      metadata: {
        incomingSource: storedLead.source,
        duplicateRule: "propertyAddress_phone",
        providerCalled: false,
        outreachSent: false
      }
    });

    return {
      lead: duplicateStoredLead,
      created: false
    };
  }

  try {
    const dbData = storedLeadToDbData(storedLead);
    const leadWithAutomation = storedLead as AutomationStoredLead;

    const createdLead = await leadDb.lead.create({
      data: {
        tenantId,
        ...dbData,

        lastContactedAt: toDateOrNull(leadWithAutomation.lastContactedAt),
        nextFollowUpAt:
          leadWithAutomation.nextFollowUpAt === null
            ? null
            : toDateOrNull(leadWithAutomation.nextFollowUpAt) ?? getDefaultNextFollowUpAt(),
        followUpCount: leadWithAutomation.followUpCount ?? 0,
        lastFollowUpMessage: leadWithAutomation.lastFollowUpMessage ?? null,
        automationStatus: leadWithAutomation.automationStatus ?? "scheduled",
        isHot: leadWithAutomation.isHot ?? false,
        revenueLeadSources: {
          create: {
            tenantId,
            source: storedLead.source,
            sourceType: storedLead.source,
            sourceDetail: String(evidence.sourceReference),
            sourceRecordId: storedLead.id,
            confidence: 60,
            verified: false,
            importedBy: "lead_create",
          }
        }
      }
    });

    const storedCreatedLead = dbLeadToStoredLead(createdLead);

  await leadRevenueSync({
      tenantId,
      lead: storedCreatedLead,
      action: "lead_created",
      source: "lead_create"
    });

    return {
      lead: storedCreatedLead,
      created: true
    };
  } catch (error) {
    if (!isPrismaUniqueError(error)) {
      throw error;
    }

    const duplicateLead = await findExistingLead({ tenantId }, storedLead);

    await leadAudit({
      tenantId,
      action: "dedupe_warning",
      targetType: "lead",
      targetId: duplicateLead?.id ?? storedLead.id,
      source: "lead_create_unique_constraint",
      metadata: {
        incomingSource: storedLead.source,
        duplicateRule: "unique_constraint",
        providerCalled: false,
        outreachSent: false
      }
    });

    return {
      lead: duplicateLead ? dbLeadToStoredLead(duplicateLead) : storedLead,
      created: false
    };
  }
}

export async function createDbLeadFromIntake(context: TenantIdentity, leadIntake: LeadIntakeInput) {
  return createDbLead(context, leadIntakeToStoredLead(leadIntake));
}

export async function createDbLeadFromImport(context: TenantIdentity, lead: ImportedLeadDraft) {
  return createDbLead(context, importedLeadToStoredLead(lead));
}

export async function createManyDbLeads(context: TenantIdentity, leads: StoredLead[]) {
  const tenantId = requireTenantId(context.tenantId, "lead_bulk_create");
  const results = await Promise.all(leads.map((lead) => createDbLead({ tenantId }, lead)));

  return {
    leads: await listDbLeads({ tenantId }),
    addedLeads: results.filter((result) => result.created).map((result) => result.lead),
    addedCount: results.filter((result) => result.created).length,
    skippedCount: results.filter((result) => !result.created).length
  };
}

export async function updateDbLead(context: TenantIdentity, storedLead: StoredLead) {
  const tenantId = requireTenantId(context.tenantId, "lead_update");
  assertOperationalEvidenceAllowed(operationalEvidenceFromStoredLead(tenantId, storedLead), "lead_mutation");
  const ownedLead = await leadDb.lead.findFirst({ where: { id: storedLead.id, tenantId } });
  if (!ownedLead) throw new Error("tenant_scoped_lead_not_found");
  const dbData = storedLeadToDbData(storedLead);
  const leadWithAutomation = storedLead as AutomationStoredLead;

  const updatedLead = await leadDb.lead.update({
    where: {
      id_tenantId: { id: storedLead.id, tenantId }
    },
    data: {
      ...dbData,

      lastContactedAt: toDateOrNull(leadWithAutomation.lastContactedAt),
      nextFollowUpAt: toDateOrNull(leadWithAutomation.nextFollowUpAt),
      followUpCount: leadWithAutomation.followUpCount ?? 0,
      lastFollowUpMessage: leadWithAutomation.lastFollowUpMessage ?? null,
      automationStatus: leadWithAutomation.automationStatus ?? "idle",
      isHot: leadWithAutomation.isHot ?? false
    }
  });

  const storedUpdatedLead = dbLeadToStoredLead(updatedLead);

    await leadRevenueSync({
    tenantId,
    lead: storedUpdatedLead,
    action: "lead_updated",
    source: "lead_update"
  });

  return storedUpdatedLead;
}

export async function updateDbLeadStatus(context: TenantIdentity, leadId: string, status: LeadStatus) {
  const tenantId = requireTenantId(context.tenantId, "lead_status_update");
  let nextFollowUpAt: Date | null = null;
  let automationStatus = "idle";

  if (status === "new") {
    nextFollowUpAt = new Date(Date.now() + 5 * 60 * 1000);
    automationStatus = "scheduled";
  }

  if (status === "contacted") {
    nextFollowUpAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    automationStatus = "scheduled";
  }

  if (status === "negotiating") {
    nextFollowUpAt = new Date(Date.now() + 12 * 60 * 60 * 1000);
    automationStatus = "scheduled";
  }

  if (status === "under_contract" || status === "closed") {
    nextFollowUpAt = null;
    automationStatus = "idle";
  }

  const currentLead = await leadDb.lead.findFirst({
    where: {
      id: leadId,
      tenantId,
    },
    include: { revenueLeadSources: { orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 1 } },
  });
  if (!currentLead) throw new Error("tenant_scoped_lead_not_found");
  assertOperationalEvidenceAllowed(operationalEvidenceFromLead(currentLead), "lead_mutation");
  const updatedLead = await leadDb.lead.update({
    where: {
      id_tenantId: { id: leadId, tenantId }
    },
    data: {
      status,
      lastContactedAt: new Date(),
      nextFollowUpAt,
      followUpCount: {
        increment: 1
      },
      automationStatus
    }
  });

  const storedUpdatedLead = dbLeadToStoredLead(updatedLead);

  await leadRevenueSync({
    tenantId,
    lead: storedUpdatedLead,
    action: "status_changed",
    previousStatus: currentLead?.status as LeadStatus | undefined,
    source: "lead_status_update"
  });

  return storedUpdatedLead;
}

export async function deleteDbLead(context: TenantIdentity, leadId: string) {
  const tenantId = requireTenantId(context.tenantId, "lead_delete");
  const ownedLead = await leadDb.lead.findFirst({ where: { id: leadId, tenantId }, select: { id: true } });
  if (!ownedLead) throw new Error("tenant_scoped_lead_not_found");
  await leadDb.lead.delete({
    where: {
      id_tenantId: { id: leadId, tenantId }
    }
  });

  return listDbLeads({ tenantId });
}

export function parseLeadIntakePayload(payload: unknown) {
  return leadIntakeSchema.safeParse(payload);
}
