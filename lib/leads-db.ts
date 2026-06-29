import { Prisma } from "@/generated/prisma";

import {
  dbLeadToStoredLead,
  generatedLeadToStoredLead,
  importedLeadToStoredLead,
  leadIntakeToStoredLead,
  storedLeadToDbData
} from "@/lib/lead-record";
import { prisma } from "@/lib/prisma";
import { logRevenueAuditEvent, syncLeadRevenueSpine } from "@/lib/revenue-spine";
import type { GeneratedLeadInput } from "@/lib/lead-generator";
import type { ImportedLeadDraft } from "@/lib/list-importer";
import type { LeadStatus, StoredLead } from "@/lib/leads-storage";
import { leadIntakeSchema, type LeadIntakeInput } from "@/lib/validations/lead";

type AutomationStoredLead = StoredLead & {
  lastContactedAt?: Date | string | null;
  nextFollowUpAt?: Date | string | null;
  followUpCount?: number;
  lastFollowUpMessage?: string | null;
  automationStatus?: string | null;
  isHot?: boolean;
};

function isPrismaUniqueError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
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

async function findExistingLead(lead: Pick<StoredLead, "propertyAddress" | "phone" | "source" | "parcelId" | "county">) {
  return prisma.lead.findUnique({
    where: {
      propertyAddress_phone: {
        propertyAddress: lead.propertyAddress,
        phone: lead.phone || getPropertyFirstPhoneKey(lead)
      }
    }
  });
}

export async function listDbLeads() {
  const leads = await prisma.lead.findMany({
    orderBy: [{ score: "desc" }, { createdAt: "desc" }]
  });

  return leads.map(dbLeadToStoredLead);
}

export async function getDbLeadById(leadId: string) {
  const lead = await prisma.lead.findUnique({
    where: {
      id: leadId
    }
  });

  return lead ? dbLeadToStoredLead(lead) : null;
}

export async function createDbLead(storedLead: StoredLead) {
  const existingLead = await findExistingLead(storedLead);

  if (existingLead) {
    const duplicateStoredLead = dbLeadToStoredLead(existingLead);

    await logRevenueAuditEvent({
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

    const createdLead = await prisma.lead.create({
      data: {
        ...dbData,

        lastContactedAt: toDateOrNull(leadWithAutomation.lastContactedAt),
        nextFollowUpAt:
          leadWithAutomation.nextFollowUpAt === null
            ? null
            : toDateOrNull(leadWithAutomation.nextFollowUpAt) ?? getDefaultNextFollowUpAt(),
        followUpCount: leadWithAutomation.followUpCount ?? 0,
        lastFollowUpMessage: leadWithAutomation.lastFollowUpMessage ?? null,
        automationStatus: leadWithAutomation.automationStatus ?? "scheduled",
        isHot: leadWithAutomation.isHot ?? false
      }
    });

    const storedCreatedLead = dbLeadToStoredLead(createdLead);

    await syncLeadRevenueSpine({
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

    const duplicateLead = await findExistingLead(storedLead);

    await logRevenueAuditEvent({
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

export async function createDbLeadFromIntake(leadIntake: LeadIntakeInput) {
  return createDbLead(leadIntakeToStoredLead(leadIntake));
}

export async function createDbLeadFromGenerated(lead: GeneratedLeadInput) {
  return createDbLead(generatedLeadToStoredLead(lead));
}

export async function createDbLeadFromImport(lead: ImportedLeadDraft) {
  return createDbLead(importedLeadToStoredLead(lead));
}

export async function createManyDbLeads(leads: StoredLead[]) {
  const results = await Promise.all(leads.map((lead) => createDbLead(lead)));

  return {
    leads: await listDbLeads(),
    addedLeads: results.filter((result) => result.created).map((result) => result.lead),
    addedCount: results.filter((result) => result.created).length,
    skippedCount: results.filter((result) => !result.created).length
  };
}

export async function updateDbLead(storedLead: StoredLead) {
  const dbData = storedLeadToDbData(storedLead);
  const leadWithAutomation = storedLead as AutomationStoredLead;

  const updatedLead = await prisma.lead.update({
    where: {
      id: storedLead.id
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

  await syncLeadRevenueSpine({
    lead: storedUpdatedLead,
    action: "lead_updated",
    source: "lead_update"
  });

  return storedUpdatedLead;
}

export async function updateDbLeadStatus(leadId: string, status: LeadStatus) {
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

  const currentLead = await prisma.lead.findUnique({
    where: {
      id: leadId
    }
  });
  const updatedLead = await prisma.lead.update({
    where: {
      id: leadId
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

  await syncLeadRevenueSpine({
    lead: storedUpdatedLead,
    action: "status_changed",
    previousStatus: currentLead?.status as LeadStatus | undefined,
    source: "lead_status_update"
  });

  return storedUpdatedLead;
}

export async function deleteDbLead(leadId: string) {
  await prisma.lead.delete({
    where: {
      id: leadId
    }
  });

  return listDbLeads();
}

export function parseLeadIntakePayload(payload: unknown) {
  return leadIntakeSchema.safeParse(payload);
}
