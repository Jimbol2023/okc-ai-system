import type { Lead as PrismaLead } from "@/generated/prisma";

import type { DistressFlags } from "@/lib/distress-flags";
import type { ImportedLeadDraft } from "@/lib/list-importer";
import type { LeadNote, StoredLead } from "@/lib/leads-storage";
import type { LeadIntakeInput } from "@/lib/validations/lead";

type LeadPayload = Omit<StoredLead, "id" | "timestamp"> & {
  timestamp?: string;
};

function emptyDistressFlags(): DistressFlags {
  return {
    taxDelinquent: false,
    inheritedProperty: false,
    vacantProperty: false,
    foreclosureRisk: false,
    majorRepairs: false,
    tiredLandlord: false,
    urgentTimeline: false,
    outOfStateOwner: false
  };
}

function createDefaultStoredLead(record: PrismaLead): StoredLead {
  const [firstName = "", ...rest] = record.name.split(" ");
  const lastName = rest.join(" ");

  return {
    id: record.id,
    timestamp: record.createdAt.toISOString(),
    firstName,
    lastName,
    email: "",
    phone: record.phone,
    propertyAddress: record.propertyAddress,
    city: "",
    state: "OK",
    zipCode: "",
    ownerName: "",
    mailingAddress: "",
    county: "",
    parcelId: "",
    situationDetails: record.notes ?? "",
    source: record.source,
    status: record.status === "contacted" ? "contacted" : "new",
    notes: [],
    followUps: [],
    analyzer: {
      arv: "",
      estimatedRepairs: "",
      desiredProfit: "20000"
    },
    distressFlags: emptyDistressFlags(),
    opportunityScore: "Low",
    score: record.score,
    priority: record.priority === "High" || record.priority === "Medium" ? record.priority : "Low",
    scoreBreakdown: ""
  };
}

export function dbLeadToStoredLead(record: PrismaLead): StoredLead {
  const approvalMetadataFields = {
    suggestedReply: record.suggestedReply,
    approvalStatus: record.approvalStatus,
    doNotContact: record.doNotContact,
    optOutReason: record.optOutReason,
    consentStatus: record.consentStatus,
    contactPermission: record.contactPermission,
    consentSource: record.consentSource,
    consentAt: record.consentAt,
    requiresHumanApproval: record.requiresHumanApproval,
    lastSellerReply: record.lastSellerReply
  };

  if (!record.payload) {
    return {
      ...createDefaultStoredLead(record),
      ...approvalMetadataFields
    };
  }

  try {
    const payload = JSON.parse(record.payload) as LeadPayload;

    return {
      ...createDefaultStoredLead(record),
      ...payload,
      id: record.id,
      timestamp: payload.timestamp ?? record.createdAt.toISOString(),
      source: record.source,
      status: record.status === "contacted" ? "contacted" : "new",
      score: record.score,
      priority: record.priority === "High" || record.priority === "Medium" ? record.priority : "Low",
      ...approvalMetadataFields
    };
  } catch {
    return {
      ...createDefaultStoredLead(record),
      ...approvalMetadataFields
    };
  }
}

function toLeadName(lead: Partial<StoredLead>) {
  const name = `${lead.firstName ?? ""} ${lead.lastName ?? ""}`.trim();
  return name || lead.ownerName || "Unknown Lead";
}

function toSerializedNotes(notes: LeadNote[]) {
  return notes.map((note) => note.body).join("\n\n").trim();
}

function createLeadId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `lead-${Date.now()}`;
}

const PROPERTY_FIRST_IMPORT_NOTE = "Property-first public-list import; contact cleanup required before outreach.";

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

export function storedLeadToDbData(lead: StoredLead) {
  return {
    id: lead.id,
    name: toLeadName(lead),
    phone: lead.phone || getPropertyFirstPhoneKey(lead),
    propertyAddress: lead.propertyAddress,
    source: lead.source,
    status: lead.status,
    score: lead.score,
    priority: lead.priority,
    notes: toSerializedNotes(lead.notes) || lead.situationDetails || null,
    payload: JSON.stringify(lead),
    approvalStatus: lead.approvalStatus ?? undefined,
    requiresHumanApproval: lead.requiresHumanApproval ?? undefined,
    doNotContact: lead.doNotContact ?? undefined,
    optOutReason: lead.optOutReason ?? undefined,
    optOutAt: lead.doNotContact ? new Date() : undefined,
    consentStatus: lead.consentStatus ?? undefined,
    contactPermission: lead.contactPermission ?? undefined,
    consentSource: lead.consentSource ?? undefined,
    consentAt: lead.consentAt ? new Date(lead.consentAt) : undefined,
    suggestedReply: lead.suggestedReply ?? undefined,
    lastSellerReply: lead.lastSellerReply ?? undefined
  };
}

export function leadIntakeToStoredLead(lead: LeadIntakeInput): StoredLead {
  return {
    id: createLeadId(),
    timestamp: new Date().toISOString(),
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    propertyAddress: lead.propertyAddress,
    city: lead.city,
    state: lead.state,
    zipCode: lead.zipCode,
    ownerName: "",
    mailingAddress: "",
    county: "",
    parcelId: "",
    situationDetails: lead.message ?? "",
    source: lead.source,
    status: "new",
    notes: [],
    followUps: [],
    analyzer: {
      arv: "",
      estimatedRepairs: "",
      desiredProfit: "20000"
    },
    distressFlags: emptyDistressFlags(),
    opportunityScore: "Low",
    score: 0,
    priority: "Low",
    scoreBreakdown: "",
    doNotContact: lead.doNotContact,
    optOutReason: lead.optOutReason || null,
    consentStatus: lead.consentStatus,
    contactPermission: lead.contactPermission,
    consentSource: lead.consentSource,
    consentAt: lead.consentTimestamp,
    referralCode: lead.referralCode || null,
    referralCampaign: lead.referralCampaign || null,
    referralSource: lead.referralSource || null,
    referralLandingPage: lead.referralLandingPage || null
  };
}

export function importedLeadToStoredLead(lead: ImportedLeadDraft): StoredLead {
  const isPropertyFirstImport = !lead.phone.trim() && !lead.email.trim();
  const situationDetails = [lead.situationDetails, isPropertyFirstImport ? PROPERTY_FIRST_IMPORT_NOTE : ""]
    .filter(Boolean)
    .join("\n\n");

  return {
    id: createLeadId(),
    timestamp: new Date().toISOString(),
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    propertyAddress: lead.propertyAddress,
    city: lead.city,
    state: lead.state,
    zipCode: lead.zipCode,
    ownerName: lead.ownerName,
    mailingAddress: lead.mailingAddress,
    county: lead.county,
    parcelId: lead.parcelId,
    situationDetails,
    source: lead.source,
    status: "new",
    notes: [],
    followUps: [],
    analyzer: {
      arv: "",
      estimatedRepairs: "",
      desiredProfit: "20000"
    },
    distressFlags: emptyDistressFlags(),
    opportunityScore: "Low",
    score: 0,
    priority: "Low",
    scoreBreakdown: "",
    doNotContact: isPropertyFirstImport ? true : undefined,
    requiresHumanApproval: isPropertyFirstImport ? true : undefined,
    approvalStatus: isPropertyFirstImport ? "needs_human_review" : undefined,
    automationStatus: isPropertyFirstImport ? "idle" : undefined,
    nextFollowUpAt: isPropertyFirstImport ? null : undefined
  };
}
