"use client";

import { createStoredLead, deleteLeadFromLocalStorage, replaceLeadsInLocalStorage, type StoredLead, upsertLeadInLocalStorage } from "@/lib/leads-storage";
import type { GeneratedLeadInput } from "@/lib/lead-generator";
import type { ImportedLeadDraft } from "@/lib/list-importer";
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
  const response = await fetch("/api/public/leads", {
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

export async function createGeneratedLeads(generatedLeads: GeneratedLeadInput[]) {
  const payload = generatedLeads.map((lead) =>
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

  return createLeadBatch(payload);
}

export async function createImportedLeads(importedLeads: ImportedLeadDraft[]) {
  const payload = importedLeads.map((lead) =>
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
  );

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
