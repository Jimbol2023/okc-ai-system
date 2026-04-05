import type { Lead as PrismaLead } from "@/generated/prisma";

import type { DistressFlags } from "@/lib/distress-flags";
import type { GeneratedLeadInput } from "@/lib/lead-generator";
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
  if (!record.payload) {
    return createDefaultStoredLead(record);
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
      priority: record.priority === "High" || record.priority === "Medium" ? record.priority : "Low"
    };
  } catch {
    return createDefaultStoredLead(record);
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

export function storedLeadToDbData(lead: StoredLead) {
  return {
    id: lead.id,
    name: toLeadName(lead),
    phone: lead.phone,
    propertyAddress: lead.propertyAddress,
    source: lead.source,
    status: lead.status,
    score: lead.score,
    priority: lead.priority,
    notes: toSerializedNotes(lead.notes) || lead.situationDetails || null,
    payload: JSON.stringify(lead)
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
    scoreBreakdown: ""
  };
}

export function generatedLeadToStoredLead(lead: GeneratedLeadInput): StoredLead {
  const [firstName = "", ...rest] = `${lead.firstName} ${lead.lastName}`.trim().split(" ");

  return {
    id: createLeadId(),
    timestamp: new Date().toISOString(),
    firstName,
    lastName: rest.join(" "),
    email: "",
    phone: lead.phone,
    propertyAddress: lead.propertyAddress,
    city: lead.city,
    state: lead.state,
    zipCode: lead.zipCode,
    ownerName: "",
    mailingAddress: "",
    county: "",
    parcelId: "",
    situationDetails: lead.situationDetails,
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
    scoreBreakdown: ""
  };
}

export function importedLeadToStoredLead(lead: ImportedLeadDraft): StoredLead {
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
    situationDetails: lead.situationDetails,
    source: "county-import",
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
    scoreBreakdown: ""
  };
}
