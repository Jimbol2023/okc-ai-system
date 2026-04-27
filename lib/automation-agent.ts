import { generateLeads } from "@/lib/lead-generator";
import { createDbLeadFromGenerated } from "@/lib/leads-db";
import { prisma } from "@/lib/prisma";
import { fetchRealLeads } from "@/lib/real-leads";

export type AutomationCycleResult = {
  ranAt: string;
  addedCount: number;
  skippedCount: number;
  highPriorityCount: number;
  overdueFollowUpCount: number;
  summary: string;
};

export async function findOverdueFollowUpLeads() {
  const now = new Date();

  return prisma.lead.findMany({
    where: {
      automationStatus: "scheduled",
      nextFollowUpAt: {
        lte: now
      }
    },
    orderBy: {
      nextFollowUpAt: "asc"
    },
    take: 25
  });
}

export async function runAutomationCycle(): Promise<AutomationCycleResult> {
  const generatedLeads = generateLeads();
  let externalLeads: ReturnType<typeof generateLeads> = [];

  try {
    externalLeads = await fetchRealLeads();
  } catch {
    externalLeads = [];
  }

  const allLeads = [...generatedLeads, ...externalLeads];

  const results = await Promise.all(allLeads.map((lead) => createDbLeadFromGenerated(lead)));

  const addedLeads = results.filter((result) => result.created).map((result) => result.lead);
  const addedCount = results.filter((result) => result.created).length;
  const skippedCount = results.filter((result) => !result.created).length;
  const highPriorityCount = addedLeads.filter((lead) => lead.priority === "High").length;

  const overdueFollowUpLeads = await findOverdueFollowUpLeads();
  const overdueFollowUpCount = overdueFollowUpLeads.length;

  const summaryParts = [
    `${addedCount} leads added`,
    `${skippedCount} duplicates skipped`,
    `${highPriorityCount} high-priority opportunities found`,
    `${overdueFollowUpCount} overdue follow-ups detected`
  ];

  return {
    ranAt: new Date().toISOString(),
    addedCount,
    skippedCount,
    highPriorityCount,
    overdueFollowUpCount,
    summary: summaryParts.join(". ") + "."
  };
}
