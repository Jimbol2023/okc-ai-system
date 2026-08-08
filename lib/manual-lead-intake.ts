import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createDbLead } from "@/lib/leads-db";
import type { StoredLead } from "@/lib/leads-storage";
import { manualLeadSourceLabels, manualLeadSources } from "@/lib/manual-lead-sources";
import { requireTenantId } from "@/lib/tenant-context";

export const manualLeadIntakeSchema = z.object({
  source: z.enum(manualLeadSources),
  sellerName: z.string().trim().min(2, "Seller name or contact label is required.").max(120),
  phone: z.string().trim().max(25).optional().or(z.literal("")),
  email: z.email("Enter a valid email address.").optional().or(z.literal("")),
  socialHandle: z.string().trim().max(120).optional().or(z.literal("")),
  propertyAddress: z.string().trim().max(180).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  state: z.string().trim().length(2, "Use a two-letter state abbreviation.").optional().or(z.literal("")),
  zipCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Use a valid 5-digit ZIP code.")
    .optional()
    .or(z.literal("")),
  notes: z.string().trim().min(5, "Manual context notes are required.").max(1500),
  captureContext: z.string().trim().max(500).optional().or(z.literal("")),
  createLead: z.boolean().optional().default(false),
  idempotencyKey: z.uuid(),
  consentStatus: z.enum(["affirmed", "not_granted", "unknown"]),
  contactPermission: z.enum(["contact_requested", "internal_review_only"]),
  doNotContact: z.boolean(),
  optOutReason: z.string().trim().max(240).optional().or(z.literal("")),
  consentSource: z.string().trim().min(2).max(120),
  consentTimestamp: z.iso.datetime().nullable(),
});

export type ManualLeadIntakeInput = z.infer<typeof manualLeadIntakeSchema>;

function cleanOptional(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function splitSellerName(name: string) {
  const [firstName = "Manual", ...lastNameParts] = name.trim().split(/\s+/);
  return {
    firstName,
    lastName: lastNameParts.join(" ") || "Lead",
  };
}

function createStoredLeadFromManualIntake(input: ManualLeadIntakeInput): StoredLead {
  const { firstName, lastName } = splitSellerName(input.sellerName);

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    firstName,
    lastName,
    email: cleanOptional(input.email) ?? "",
    phone: cleanOptional(input.phone) ?? "",
    propertyAddress: cleanOptional(input.propertyAddress) ?? "",
    city: cleanOptional(input.city) ?? "",
    state: cleanOptional(input.state) ?? "OK",
    zipCode: cleanOptional(input.zipCode) ?? "",
    ownerName: input.sellerName,
    mailingAddress: "",
    county: "",
    parcelId: "",
    situationDetails: input.notes,
    source: input.source,
    sourceDetail: `${manualLeadSourceLabels[input.source]} | ${cleanOptional(input.captureContext) ?? "Manual operator source capture."}`,
    status: "new",
    notes: [
      {
        id: crypto.randomUUID(),
        body: `Manual source capture: ${manualLeadSourceLabels[input.source]}\n${input.notes}`,
        timestamp: new Date().toISOString(),
      },
    ],
    followUps: [],
    analyzer: {
      arv: "",
      estimatedRepairs: "",
      desiredProfit: "20000",
    },
    distressFlags: {
      taxDelinquent: false,
      inheritedProperty: false,
      vacantProperty: false,
      foreclosureRisk: false,
      majorRepairs: false,
      tiredLandlord: false,
      urgentTimeline: false,
      outOfStateOwner: false,
    },
    opportunityScore: "Low",
    score: 0,
    priority: "Low",
    scoreBreakdown: "Manual lead intake created with source captured. Property facts require human verification.",
    requiresHumanApproval: true,
    approvalStatus: "needs_human_review",
    automationStatus: "idle",
    nextFollowUpAt: null,
    doNotContact: input.doNotContact,
    optOutReason: input.doNotContact ? cleanOptional(input.optOutReason) ?? "Operator recorded do not contact." : null,
    consentStatus: input.consentStatus,
    contactPermission: input.doNotContact ? "internal_review_only" : input.contactPermission,
    consentSource: input.consentSource,
    consentAt: input.consentTimestamp,
  };
}

function canCreateLead(input: ManualLeadIntakeInput) {
  return Boolean(cleanOptional(input.propertyAddress) && cleanOptional(input.phone));
}

export async function listManualLeadIntakes(tenantIdValue: string) {
  const tenantId = requireTenantId(tenantIdValue, "manual_lead_intake_list");
  return prisma.manualLeadIntake.findMany({
    where: { tenantId },
    orderBy: {
      createdAt: "desc",
    },
    take: 25,
    include: {
      lead: {
        select: {
          id: true,
          name: true,
          propertyAddress: true,
          source: true,
          status: true,
        },
      },
    },
  });
}

export async function createManualLeadIntake(tenantIdValue: string, input: ManualLeadIntakeInput) {
  const tenantId = requireTenantId(tenantIdValue, "manual_lead_intake_create");
  const existing = await prisma.manualLeadIntake.findUnique({ where: { tenantId_idempotencyKey: { tenantId, idempotencyKey: input.idempotencyKey } }, include: { lead: true } });
  if (existing) return { intake: existing, leadCreated: false, leadId: existing.leadId, canCreateLead: canCreateLead(input), reused: true };
  const sourceLabel = manualLeadSourceLabels[input.source];
  let leadId: string | null = null;
  let leadCreated = false;
  let intakeStatus = "pending_review";

  if (input.createLead && canCreateLead(input)) {
    const result = await createDbLead({ tenantId }, createStoredLeadFromManualIntake(input));
    leadId = result.lead.id;
    leadCreated = result.created;
    intakeStatus = result.created ? "lead_created" : "matched_existing_lead";
  } else if (input.createLead) {
    intakeStatus = "needs_required_lead_fields";
  }

  let intake;
  try {
    intake = await prisma.manualLeadIntake.create({
    data: {
      tenantId,
      leadId,
      source: input.source,
      sourceLabel,
      sellerName: input.sellerName.trim(),
      phone: cleanOptional(input.phone),
      email: cleanOptional(input.email),
      socialHandle: cleanOptional(input.socialHandle),
      propertyAddress: cleanOptional(input.propertyAddress),
      city: cleanOptional(input.city),
      state: cleanOptional(input.state) ?? "OK",
      zipCode: cleanOptional(input.zipCode),
      notes: input.notes.trim(),
      captureContext: cleanOptional(input.captureContext) ?? "Manual operator source capture.",
      intakeStatus,
      manualReviewStatus: leadId ? "lead_review_required" : "needs_manual_review",
      safetyFlags: {
        manualOnly: true,
        externalProviderCalled: false,
        messageSent: false,
        scrapingUsed: false,
        leadCreated,
        sourceCaptured: true,
        propertyFactsInvented: false,
      },
      idempotencyKey: input.idempotencyKey,
      consentStatus: input.consentStatus,
      contactPermission: input.doNotContact ? "internal_review_only" : input.contactPermission,
      doNotContact: input.doNotContact,
      optOutReason: input.doNotContact ? cleanOptional(input.optOutReason) ?? "Operator recorded do not contact." : null,
      consentSource: input.consentSource,
      consentAt: input.consentTimestamp ? new Date(input.consentTimestamp) : null,
    },
    include: {
      lead: {
        select: {
          id: true,
          name: true,
          propertyAddress: true,
          source: true,
          status: true,
        },
      },
    },
    });
  } catch (error) {
    if (!(error && typeof error === "object" && "code" in error && error.code === "P2002")) throw error;
    const winner = await prisma.manualLeadIntake.findUnique({ where: { tenantId_idempotencyKey: { tenantId, idempotencyKey: input.idempotencyKey } }, include: { lead: true } });
    if (!winner) throw error;
    return { intake: winner, leadCreated: false, leadId: winner.leadId, canCreateLead: canCreateLead(input), reused: true };
  }

  return {
    intake,
    leadCreated,
    leadId,
    canCreateLead: canCreateLead(input),
    reused: false,
  };
}
