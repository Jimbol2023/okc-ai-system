"use client";

import { generateLeads } from "@/lib/lead-generator";
import { createGeneratedLeads } from "@/lib/leads-api";
import { fetchRealLeads } from "@/lib/real-leads";

export type AutomationCycleResult = {
  ranAt: string;
  addedCount: number;
  skippedCount: number;
  highPriorityCount: number;
  summary: string;
};

export async function runAutomationCycle(): Promise<AutomationCycleResult> {
  const generatedLeads = generateLeads();
  let externalLeads = [] as ReturnType<typeof generateLeads>;

  try {
    externalLeads = await fetchRealLeads();
  } catch {
    externalLeads = [];
  }

  const generatedResult = await createGeneratedLeads(generatedLeads);
  const externalResult = await createGeneratedLeads(externalLeads);
  const addedLeads = [...generatedResult.addedLeads, ...externalResult.addedLeads];
  const addedCount = generatedResult.addedCount + externalResult.addedCount;
  const skippedCount = generatedResult.skippedCount + externalResult.skippedCount;
  const highPriorityCount = addedLeads.filter((lead) => lead.priority === "High").length;
  const summary =
    highPriorityCount > 0
      ? `${addedCount} leads added. ${highPriorityCount} high-priority opportunities found.`
      : `${addedCount} leads added. ${skippedCount} duplicates skipped.`;

  return {
    ranAt: new Date().toISOString(),
    addedCount,
    skippedCount,
    highPriorityCount,
    summary
  };
}
