"use client";

export const OKC_WHOLESALE_RESEARCH_KEY = "okcWholesaleResearch";

export type ResearchInput = {
  topic: string;
  county: string;
  city: string;
  zipCode: string;
  notes: string;
};

export type ResearchSummary = {
  id: string;
  createdAt: string;
  areaName: string;
  topic: string;
  county: string;
  city: string;
  zipCode: string;
  notes: string;
  opportunityNotes: string[];
  possibleDistressSignals: string[];
  suggestedNextActions: string[];
};

function createResearchId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `research-${Date.now()}`;
}

function readSavedResearch(): ResearchSummary[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawResearch = window.localStorage.getItem(OKC_WHOLESALE_RESEARCH_KEY);

  if (!rawResearch) {
    return [];
  }

  try {
    const parsedResearch = JSON.parse(rawResearch) as ResearchSummary[];
    return Array.isArray(parsedResearch) ? parsedResearch : [];
  } catch {
    return [];
  }
}

function buildAreaName({ county, city, zipCode }: ResearchInput) {
  if (city && county) {
    return `${city}, ${county} County`;
  }

  if (city) {
    return city;
  }

  if (county) {
    return `${county} County`;
  }

  if (zipCode) {
    return `ZIP ${zipCode}`;
  }

  return "General Market Research";
}

function isPresent(value: string | null): value is string {
  return Boolean(value);
}

function buildOpportunityNotes(input: ResearchInput) {
  const notes = [
    input.topic ? `Research focus: ${input.topic}.` : "Research focus is broad and exploratory.",
    input.county ? `County-level list opportunities may be worth reviewing in ${input.county} County.` : null,
    input.city ? `City-level follow-up could focus on seller activity and aging inventory in ${input.city}.` : null,
    input.notes ? `Manual notes suggest: ${input.notes.slice(0, 140)}${input.notes.length > 140 ? "..." : ""}` : null
  ].filter(isPresent);

  return notes;
}

function buildPossibleDistressSignals(input: ResearchInput) {
  const noteText = input.notes.toLowerCase();
  const signals = [
    noteText.includes("tax") ? "Potential tax delinquency or county-driven list opportunity." : null,
    noteText.includes("vacant") || noteText.includes("empty") ? "Possible vacant-property signal in the notes." : null,
    noteText.includes("probate") || noteText.includes("inherit") ? "Possible inherited or probate-driven opportunity." : null,
    noteText.includes("repair") || noteText.includes("damage") ? "Possible major-repair seller motivation." : null
  ].filter(isPresent);

  return signals.length > 0 ? signals : ["No strong distress signal was explicitly mentioned in the current notes."];
}

function buildSuggestedNextActions(input: ResearchInput) {
  return [
    `Review county and city-level lists connected to ${buildAreaName(input)}.`,
    "Import any qualified records into the lead system for scoring and follow-up.",
    "Cross-check addresses for out-of-state ownership, vacancy, and tax-related triggers."
  ];
}

export function generateResearchSummary(input: ResearchInput): ResearchSummary {
  return {
    id: createResearchId(),
    createdAt: new Date().toISOString(),
    areaName: buildAreaName(input),
    topic: input.topic,
    county: input.county,
    city: input.city,
    zipCode: input.zipCode,
    notes: input.notes,
    opportunityNotes: buildOpportunityNotes(input),
    possibleDistressSignals: buildPossibleDistressSignals(input),
    suggestedNextActions: buildSuggestedNextActions(input)
  };
}

export function getSavedResearchSummaries() {
  return readSavedResearch().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function saveResearchSummary(summary: ResearchSummary) {
  const nextResearch = [summary, ...readSavedResearch()];

  window.localStorage.setItem(OKC_WHOLESALE_RESEARCH_KEY, JSON.stringify(nextResearch));

  return nextResearch;
}
