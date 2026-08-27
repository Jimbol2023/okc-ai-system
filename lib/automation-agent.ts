import { evaluateOperationalEvidence, operationalEvidenceFromLead } from "@/lib/operational-evidence-guard";
import { prisma } from "@/lib/prisma";
import { requireTenantId } from "@/lib/tenant-context";

export type AutomationCycleResult = {
  ranAt: string;
  addedCount: number;
  skippedCount: number;
  highPriorityCount: number;
  overdueFollowUpCount: number;
  safeFollowUpCount: number;
  skippedUnsafeFollowUpCount: number;
  processedFollowUpCount: number;
  smsSentCount: number;
  smsFailedCount: number;
  summary: string;
};

export async function findOverdueFollowUpLeads(tenantIdValue: string) {
  const tenantId = requireTenantId(tenantIdValue, "automation_follow_up_inventory");
  return prisma.lead.findMany({
    where: { tenantId, automationStatus: "scheduled", doNotContact: false, nextFollowUpAt: { lte: new Date() } },
    include: { revenueLeadSources: { orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 1 } },
    orderBy: { nextFollowUpAt: "asc" },
    take: 25,
  });
}

export async function runAutomationCycle(tenantIdValue: string): Promise<AutomationCycleResult> {
  const tenantId = requireTenantId(tenantIdValue, "automation_cycle");
  const overdueLeads = await findOverdueFollowUpLeads(tenantId);
  const eligibleLeads = overdueLeads.filter((lead) =>
    evaluateOperationalEvidence(operationalEvidenceFromLead(lead)).allowed,
  );
  const result = {
    ranAt: new Date().toISOString(),
    addedCount: 0,
    skippedCount: 0,
    highPriorityCount: eligibleLeads.filter((lead) => lead.priority === "High").length,
    overdueFollowUpCount: overdueLeads.length,
    safeFollowUpCount: eligibleLeads.length,
    skippedUnsafeFollowUpCount: overdueLeads.length - eligibleLeads.length,
    processedFollowUpCount: 0,
    smsSentCount: 0,
    smsFailedCount: 0,
  };
  return {
    ...result,
    summary: `${result.overdueFollowUpCount} overdue follow-ups reviewed. ${result.safeFollowUpCount} provenance-complete leads eligible for human review. ${result.skippedUnsafeFollowUpCount} unsafe leads excluded. No leads created and no outreach executed.`,
  };
}
