"use client";

import {
  detectDistressFlags,
  getLeadPriority,
  getLeadScore,
  getLeadScoreBreakdown,
  getOpportunityScore,
  normalizeDistressFlags,
  type DistressFlags
} from "@/lib/distress-flags";
import type { GeneratedLeadInput } from "@/lib/lead-generator";
import type { ImportedLeadDraft } from "@/lib/list-importer";
import type { LeadIntakeInput } from "@/lib/validations/lead";

export const OKC_WHOLESALE_LEADS_KEY = "okcWholesaleLeads";

export type LeadStatus =
  | "new"
  | "contacted"
  | "negotiating"
  | "under_contract"
  | "closed";

export type LeadNote = {
  id: string;
  body: string;
  timestamp: string;
};

export type LeadFollowUp = {
  id: string;
  date: string;
  type: "sms" | "email" | "call";
  message: string;
  status: "pending" | "completed";
  completedAt?: string;
};

export type LeadAnalyzer = {
  arv: string;
  estimatedRepairs: string;
  desiredProfit: string;
};

export type StoredLead = {
  id: string;
  timestamp: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyAddress: string;
  city: string;
  state: string;
  zipCode: string;
  ownerName: string;
  mailingAddress: string;
  county: string;
  parcelId: string;
  situationDetails: string;
  source: string;
  status: LeadStatus;
  notes: LeadNote[];
  followUps: LeadFollowUp[];
  analyzer: LeadAnalyzer;
  distressFlags: DistressFlags;
  opportunityScore: "Low" | "Medium" | "High";
  score: number;
  priority: "High" | "Medium" | "Low";
  scoreBreakdown: string;
};

const ALLOWED_LEAD_STATUSES: readonly LeadStatus[] = [
  "new",
  "contacted",
  "negotiating",
  "under_contract",
  "closed"
] as const;

function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === "string" && ALLOWED_LEAD_STATUSES.includes(value as LeadStatus);
}

function normalizeLeadStatus(value: unknown): LeadStatus {
  return isLeadStatus(value) ? value : "new";
}

function writeStoredLeads(leads: StoredLead[]) {
  if (typeof window === "undefined") {
    return leads;
  }

  window.localStorage.setItem(OKC_WHOLESALE_LEADS_KEY, JSON.stringify(leads));

  return leads;
}

function readStoredLeads(): StoredLead[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawLeads = window.localStorage.getItem(OKC_WHOLESALE_LEADS_KEY);

  if (!rawLeads) {
    return [];
  }

  try {
    const parsedLeads = JSON.parse(rawLeads) as Array<
      StoredLead & {
        notes?: LeadNote[];
        followUps?: LeadFollowUp[];
        analyzer?: Partial<LeadAnalyzer>;
        distressFlags?: Partial<DistressFlags>;
        status?: unknown;
      }
    >;

    if (!Array.isArray(parsedLeads)) {
      return [];
    }

    return parsedLeads.map((lead) => {
      const mailingAddress = lead.mailingAddress ?? "";
      const distressFlags = normalizeDistressFlags(
        lead.distressFlags ??
          detectDistressFlags({
            situationDetails: lead.situationDetails ?? "",
            source: lead.source ?? "",
            mailingAddress,
            propertyState: lead.state ?? ""
          })
      );
      const score = getLeadScore(distressFlags);

      return {
        ...lead,
        status: normalizeLeadStatus(lead.status),
        ownerName: lead.ownerName ?? "",
        mailingAddress,
        county: lead.county ?? "",
        parcelId: lead.parcelId ?? "",
        notes: Array.isArray(lead.notes) ? lead.notes : [],
        followUps: Array.isArray(lead.followUps) ? lead.followUps : [],
        analyzer: {
          arv: lead.analyzer?.arv ?? "",
          estimatedRepairs: lead.analyzer?.estimatedRepairs ?? "",
          desiredProfit: lead.analyzer?.desiredProfit ?? "20000"
        },
        distressFlags,
        opportunityScore: getOpportunityScore(distressFlags),
        score,
        priority: getLeadPriority(score),
        scoreBreakdown: getLeadScoreBreakdown(distressFlags)
      };
    });
  } catch {
    return [];
  }
}

function createLeadId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `lead-${Date.now()}`;
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function normalizeAddress(address: string) {
  return address.trim().toLowerCase();
}

function isDuplicateLead(existingLeads: StoredLead[], lead: { propertyAddress: string; phone: string }) {
  const normalizedAddress = normalizeAddress(lead.propertyAddress);
  const normalizedPhone = normalizePhone(lead.phone);

  if (!normalizedAddress || !normalizedPhone) {
    return false;
  }

  return existingLeads.some(
    (existingLead) =>
      normalizeAddress(existingLead.propertyAddress) === normalizedAddress &&
      normalizePhone(existingLead.phone) === normalizedPhone
  );
}

export function createStoredLead({
  firstName,
  lastName,
  email,
  phone,
  propertyAddress,
  city,
  state,
  zipCode,
  ownerName,
  mailingAddress,
  county,
  parcelId,
  situationDetails,
  source
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyAddress: string;
  city: string;
  state: string;
  zipCode: string;
  ownerName?: string;
  mailingAddress?: string;
  county?: string;
  parcelId?: string;
  situationDetails: string;
  source: string;
}): StoredLead {
  const nextDistressFlags = detectDistressFlags({
    situationDetails,
    source,
    mailingAddress: mailingAddress ?? "",
    propertyState: state
  });
  const score = getLeadScore(nextDistressFlags);

  return {
    id: createLeadId(),
    timestamp: new Date().toISOString(),
    firstName,
    lastName,
    email,
    phone,
    propertyAddress,
    city,
    state,
    zipCode,
    ownerName: ownerName ?? "",
    mailingAddress: mailingAddress ?? "",
    county: county ?? "",
    parcelId: parcelId ?? "",
    situationDetails,
    source,
    status: "new",
    notes: [],
    followUps: [],
    analyzer: {
      arv: "",
      estimatedRepairs: "",
      desiredProfit: "20000"
    },
    distressFlags: nextDistressFlags,
    opportunityScore: getOpportunityScore(nextDistressFlags),
    score,
    priority: getLeadPriority(score),
    scoreBreakdown: getLeadScoreBreakdown(nextDistressFlags)
  };
}

export function replaceLeadsInLocalStorage(leads: StoredLead[]) {
  return writeStoredLeads(leads);
}

export function upsertLeadInLocalStorage(nextLead: StoredLead) {
  const existingLeads = readStoredLeads();
  const nextLeads = existingLeads.some((lead) => lead.id === nextLead.id)
    ? existingLeads.map((lead) => (lead.id === nextLead.id ? nextLead : lead))
    : [nextLead, ...existingLeads];

  return writeStoredLeads(nextLeads);
}

export function saveLeadToLocalStorage(lead: LeadIntakeInput): StoredLead[] {
  const existingLeads = readStoredLeads();
  const nextLead = createStoredLead({
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    propertyAddress: lead.propertyAddress,
    city: lead.city,
    state: lead.state,
    zipCode: lead.zipCode,
    situationDetails: lead.message ?? "",
    source: lead.source
  });
  const nextLeads = [...existingLeads, nextLead];

  return writeStoredLeads(nextLeads);
}

export function getSavedLeadsFromLocalStorage() {
  return readStoredLeads();
}

export function getLeadByIdFromLocalStorage(leadId: string) {
  return readStoredLeads().find((lead) => lead.id === leadId) ?? null;
}

export function deleteLeadFromLocalStorage(leadId: string) {
  const nextLeads = readStoredLeads().filter((lead) => lead.id !== leadId);

  return writeStoredLeads(nextLeads);
}

export function updateLeadStatusInLocalStorage(leadId: string, status: StoredLead["status"]) {
  const nextLeads = readStoredLeads().map((lead) => (lead.id === leadId ? { ...lead, status } : lead));

  return writeStoredLeads(nextLeads);
}

export function addLeadNoteToLocalStorage(leadId: string, body: string) {
  const nextNote: LeadNote = {
    id: createLeadId(),
    body,
    timestamp: new Date().toISOString()
  };
  const nextLeads = readStoredLeads().map((lead) =>
    lead.id === leadId
      ? {
          ...lead,
          notes: [...lead.notes, nextNote]
        }
      : lead
  );

  writeStoredLeads(nextLeads);
  return nextLeads.find((lead) => lead.id === leadId) ?? null;
}

export function addLeadFollowUpToLocalStorage(
  leadId: string,
  followUp: Omit<LeadFollowUp, "id" | "status" | "completedAt">
) {
  const nextFollowUp: LeadFollowUp = {
    id: createLeadId(),
    date: followUp.date,
    type: followUp.type,
    message: followUp.message,
    status: "pending"
  };
  const nextLeads = readStoredLeads().map((lead) =>
    lead.id === leadId
      ? {
          ...lead,
          followUps: [...lead.followUps, nextFollowUp]
        }
      : lead
  );

  writeStoredLeads(nextLeads);
  return nextLeads.find((lead) => lead.id === leadId) ?? null;
}

export function deleteLeadNoteFromLocalStorage(leadId: string, noteId: string) {
  const nextLeads = readStoredLeads().map((lead) =>
    lead.id === leadId
      ? {
          ...lead,
          notes: lead.notes.filter((note) => note.id !== noteId)
        }
      : lead
  );

  writeStoredLeads(nextLeads);
  return nextLeads.find((lead) => lead.id === leadId) ?? null;
}

export function updateLeadFollowUpStatusInLocalStorage(
  leadId: string,
  followUpId: string,
  status: LeadFollowUp["status"]
) {
  const nextLeads = readStoredLeads().map((lead) =>
    lead.id === leadId
      ? {
          ...lead,
          followUps: lead.followUps.map((followUp) =>
            followUp.id === followUpId
              ? {
                  ...followUp,
                  status,
                  completedAt: status === "completed" ? new Date().toISOString() : undefined
                }
              : followUp
          )
        }
      : lead
  );

  writeStoredLeads(nextLeads);
  return nextLeads.find((lead) => lead.id === leadId) ?? null;
}

export function logSentFollowUpToLocalStorage(
  leadId: string,
  followUp: Omit<LeadFollowUp, "id" | "status" | "completedAt">
) {
  const completedAt = new Date().toISOString();
  const nextFollowUp: LeadFollowUp = {
    id: createLeadId(),
    date: followUp.date,
    type: followUp.type,
    message: followUp.message,
    status: "completed",
    completedAt
  };
  const nextLeads = readStoredLeads().map((lead) =>
    lead.id === leadId
      ? {
          ...lead,
          followUps: [...lead.followUps, nextFollowUp]
        }
      : lead
  );

  writeStoredLeads(nextLeads);
  return nextLeads.find((lead) => lead.id === leadId) ?? null;
}

export function updateLeadAnalyzerInLocalStorage(leadId: string, analyzer: LeadAnalyzer) {
  const nextLeads = readStoredLeads().map((lead) => (lead.id === leadId ? { ...lead, analyzer } : lead));

  writeStoredLeads(nextLeads);
  return nextLeads.find((lead) => lead.id === leadId) ?? null;
}

export function importLeadsToLocalStorage(importedLeads: ImportedLeadDraft[]) {
  const existingLeads = readStoredLeads();
  const nextLeads = [
    ...existingLeads,
    ...importedLeads.map((lead) =>
      createStoredLead({
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
        source: "county-import"
      })
    )
  ];

  return writeStoredLeads(nextLeads);
}

export function addGeneratedLeadsToLocalStorage(generatedLeads: GeneratedLeadInput[]) {
  const existingLeads = readStoredLeads();
  const uniqueGeneratedLeads = generatedLeads.filter((lead) => !isDuplicateLead(existingLeads, lead));
  const addedLeads = uniqueGeneratedLeads.map((lead) =>
    createStoredLead({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: "",
      phone: lead.phone,
      propertyAddress: lead.propertyAddress,
      city: lead.city,
      state: lead.state,
      zipCode: lead.zipCode,
      situationDetails: lead.situationDetails,
      source: lead.source
    })
  );
  const nextLeads = [...existingLeads, ...addedLeads];

  writeStoredLeads(nextLeads);
  return {
    leads: nextLeads,
    addedLeads,
    addedCount: uniqueGeneratedLeads.length,
    skippedCount: generatedLeads.length - uniqueGeneratedLeads.length
  };
}