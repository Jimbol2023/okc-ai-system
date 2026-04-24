import { Prisma } from "@/generated/prisma";

import {
  dbLeadToStoredLead,
  generatedLeadToStoredLead,
  importedLeadToStoredLead,
  leadIntakeToStoredLead,
  storedLeadToDbData
} from "@/lib/lead-record";
import { prisma } from "@/lib/prisma";
import type { GeneratedLeadInput } from "@/lib/lead-generator";
import type { ImportedLeadDraft } from "@/lib/list-importer";
import type { LeadStatus, StoredLead } from "@/lib/leads-storage";
import { leadIntakeSchema, type LeadIntakeInput } from "@/lib/validations/lead";

function isPrismaUniqueError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

async function findExistingLead(lead: Pick<StoredLead, "propertyAddress" | "phone">) {
  return prisma.lead.findUnique({
    where: {
      propertyAddress_phone: {
        propertyAddress: lead.propertyAddress,
        phone: lead.phone
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
    return {
      lead: dbLeadToStoredLead(existingLead),
      created: false
    };
  }

  try {
    const dbData = storedLeadToDbData(storedLead);

    const createdLead = await prisma.lead.create({
      data: {
        ...dbData,

        // IMPORTANT: preserve automation values passed from route.ts
        lastContactedAt: storedLead.lastContactedAt ?? null,
        nextFollowUpAt: storedLead.nextFollowUpAt ?? null,
        followUpCount: storedLead.followUpCount ?? 0,
        lastFollowUpMessage: storedLead.lastFollowUpMessage ?? null,
        automationStatus: storedLead.automationStatus ?? "idle",
        isHot: storedLead.isHot ?? false
      }
    });

    return {
      lead: dbLeadToStoredLead(createdLead),
      created: true
    };
  } catch (error) {
    if (!isPrismaUniqueError(error)) {
      throw error;
    }

    const duplicateLead = await findExistingLead(storedLead);

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

  const updatedLead = await prisma.lead.update({
    where: {
      id: storedLead.id
    },
    data: {
      ...dbData,

      lastContactedAt: storedLead.lastContactedAt ?? null,
      nextFollowUpAt: storedLead.nextFollowUpAt ?? null,
      followUpCount: storedLead.followUpCount ?? 0,
      lastFollowUpMessage: storedLead.lastFollowUpMessage ?? null,
      automationStatus: storedLead.automationStatus ?? "idle",
      isHot: storedLead.isHot ?? false
    }
  });

  return dbLeadToStoredLead(updatedLead);
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

  return dbLeadToStoredLead(updatedLead);
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