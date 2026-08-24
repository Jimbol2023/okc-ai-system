"use client";

import { deleteLeadFromLocalStorage, replaceLeadsInLocalStorage, type StoredLead, upsertLeadInLocalStorage } from "@/lib/leads-storage";
import { importedLeadToStoredLead } from "@/lib/lead-record";
import {
  getImportedLeadImportBlockers,
  sanitizeImportedLeadPhone,
  validateImportedLeadDraft,
  type ImportedLeadDraft,
} from "@/lib/list-importer";
import type { LeadIntakeInput } from "@/lib/validations/lead";

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error("Request failed.");
  }

  return response.json() as Promise<T>;
}

export async function fetchLeads() {
  const response = await fetch("/api/leads", {
    method: "GET",
    cache: "no-store"
  });
  const result = await parseJsonResponse<{ leads: StoredLead[] }>(response);

  replaceLeadsInLocalStorage(result.leads);

  return result.leads;
}

export async function fetchLeadById(leadId: string) {
  const response = await fetch(`/api/leads/${leadId}`, {
    method: "GET",
    cache: "no-store"
  });
  const result = await parseJsonResponse<{ lead: StoredLead }>(response);

  upsertLeadInLocalStorage(result.lead);

  return result.lead;
}

export async function createLeadFromIntake(lead: LeadIntakeInput) {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(lead)
  });
  const result = await parseJsonResponse<{ lead: StoredLead }>(response);

  upsertLeadInLocalStorage(result.lead);

  return result.lead;
}

export async function createStoredLeadRecord(lead: StoredLead) {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(lead)
  });
  const result = await parseJsonResponse<{ lead: StoredLead; created: boolean }>(response);

  upsertLeadInLocalStorage(result.lead);

  return result;
}

export async function createImportedLeads(importedLeads: ImportedLeadDraft[]) {
  const sanitizedLeads = importedLeads.map((lead) => ({
    ...lead,
    phone: sanitizeImportedLeadPhone(lead.phone),
    propertyAddress: lead.propertyAddress.trim()
  }));
  const invalidLeads = sanitizedLeads.filter((lead) => {
    const blockers = getImportedLeadImportBlockers(lead);

    return validateImportedLeadDraft(lead).length > 0 || blockers.length > 0;
  });

  if (invalidLeads.length > 0) {
    throw new Error("Imported leads must include a property address and known source.");
  }

  const payload = sanitizedLeads.map((lead) => importedLeadToStoredLead(lead));

  return createLeadBatch(payload);
}

async function createLeadBatch(leads: StoredLead[]) {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(leads)
  });
  const result = await parseJsonResponse<{
    leads: StoredLead[];
    addedLeads: StoredLead[];
    addedCount: number;
    skippedCount: number;
  }>(response);
  const nextLeads = await fetchLeads();

  return {
    leads: nextLeads,
    addedCount: result.addedCount,
    skippedCount: result.skippedCount,
    addedLeads: result.addedLeads
  };
}

export async function updateLead(lead: StoredLead) {
  const response = await fetch(`/api/leads/${lead.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(lead)
  });
  const result = await parseJsonResponse<{ lead: StoredLead }>(response);

  upsertLeadInLocalStorage(result.lead);

  return result.lead;
}

export async function deleteLead(leadId: string) {
  const response = await fetch(`/api/leads/${leadId}`, {
    method: "DELETE"
  });
  const result = await parseJsonResponse<{ leads: StoredLead[] }>(response);

  replaceLeadsInLocalStorage(result.leads);
  deleteLeadFromLocalStorage(leadId);

  return result.leads;
}
