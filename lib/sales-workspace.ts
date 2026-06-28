import { prisma } from "@/lib/prisma";
import {
  buildSalesWorkspaceAudit,
  getLatestSalesWorkspaceOutcome,
  getSalesWorkspaceMissingFacts,
  getSalesWorkspaceNextManualAction,
  getSalesWorkspaceRank,
  salesWorkspaceSafetyFlags,
  type SalesWorkspaceOutcomeInput,
} from "@/lib/sales-workspace-core";

type LeadForSalesWorkspace = {
  id: string;
  name: string;
  phone: string;
  propertyAddress: string;
  source: string;
  status: string;
  score: number;
  priority: string;
  approvalStatus: string;
  doNotContact: boolean;
  nextFollowUpAt: Date | null;
  createdAt: Date;
  payload: string | null;
};

type SalesWorkspaceAssistInput = {
  id: string;
  leadId: string;
  nextSalesAction: string;
  callOpener: string;
  manualApprovalStatus: string;
  createdAt: Date;
};

type SalesWorkspaceAttributionInput = {
  id: string;
  leadId: string;
  channel: string;
  sourceLabel: string;
  topic: string;
  attributionStatus: string;
  createdAt: Date;
};

type SalesWorkspaceManualIntakeInput = {
  id: string;
  leadId: string | null;
  source: string;
  sourceLabel: string;
  intakeStatus: string;
  manualReviewStatus: string;
  createdAt: Date;
};

function daysOld(createdAt: Date) {
  return Math.max(0, Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)));
}

function summarizeBySource(leads: LeadForSalesWorkspace[]) {
  return leads.reduce<Record<string, number>>((summary, lead) => {
    const source = lead.source || "unknown";
    summary[source] = (summary[source] ?? 0) + 1;
    return summary;
  }, {});
}

function summarizeByStatus(leads: LeadForSalesWorkspace[]) {
  return leads.reduce<Record<string, number>>((summary, lead) => {
    summary[lead.status] = (summary[lead.status] ?? 0) + 1;
    return summary;
  }, {});
}

export async function getSalesWorkspace() {
  const [leads, outcomes, assists, attributions, manualIntakes] = await Promise.all([
    prisma.lead.findMany({
      orderBy: [{ score: "desc" }, { createdAt: "desc" }],
      take: 100,
    }),
    prisma.sellerCallOutcome.findMany({
      orderBy: [{ callCompletedAt: "desc" }, { createdAt: "desc" }],
      take: 200,
    }),
    prisma.salesConversionAssist.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    }),
    prisma.marketingSalesAttribution.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 200,
    }),
    prisma.manualLeadIntake.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 200,
    }),
  ]);

  const outcomesByLead = new Map<string, SalesWorkspaceOutcomeInput[]>();
  outcomes.forEach((outcome) => {
    outcomesByLead.set(outcome.leadId, [...(outcomesByLead.get(outcome.leadId) ?? []), outcome]);
  });

  const assistsByLead = new Map<string, SalesWorkspaceAssistInput[]>();
  assists.forEach((assist) => {
    assistsByLead.set(assist.leadId, [...(assistsByLead.get(assist.leadId) ?? []), assist]);
  });

  const attributionsByLead = new Map<string, SalesWorkspaceAttributionInput[]>();
  attributions.forEach((attribution) => {
    attributionsByLead.set(attribution.leadId, [...(attributionsByLead.get(attribution.leadId) ?? []), attribution]);
  });

  const manualIntakesByLead = new Map<string, SalesWorkspaceManualIntakeInput[]>();
  manualIntakes.forEach((intake) => {
    if (!intake.leadId) return;
    manualIntakesByLead.set(intake.leadId, [...(manualIntakesByLead.get(intake.leadId) ?? []), intake]);
  });

  const queue = leads
    .map((lead) => {
      const leadOutcomes = outcomesByLead.get(lead.id) ?? [];
      const latestOutcome = getLatestSalesWorkspaceOutcome(leadOutcomes);
      const leadAssists = assistsByLead.get(lead.id) ?? [];
      const leadAttributions = attributionsByLead.get(lead.id) ?? [];
      const leadManualIntakes = manualIntakesByLead.get(lead.id) ?? [];
      const missingFacts = getSalesWorkspaceMissingFacts(lead, latestOutcome);
      const rank = getSalesWorkspaceRank({
        lead,
        missingFacts,
        latestOutcome,
        attributionCount: leadAttributions.length,
        manualIntakeCount: leadManualIntakes.length,
      });

      return {
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        propertyAddress: lead.propertyAddress,
        source: lead.source,
        status: lead.status,
        score: lead.score,
        priority: lead.priority,
        ageDays: daysOld(lead.createdAt),
        rank,
        blocked: rank === 0,
        missingFacts,
        latestOutcome,
        latestAssist: leadAssists[0] ?? null,
        attributions: leadAttributions.slice(0, 3),
        manualIntakes: leadManualIntakes.slice(0, 3),
        nextManualAction: getSalesWorkspaceNextManualAction({
          lead,
          missingFacts,
          latestOutcome,
        }),
      };
    })
    .sort((a, b) => b.rank - a.rank || b.score - a.score)
    .slice(0, 30);

  const missingFactCount = queue.reduce((total, lead) => total + lead.missingFacts.length, 0);
  const blockedCount = queue.filter((lead) => lead.blocked).length;

  return {
    queue,
    roi: {
      totalLeads: leads.length,
      activeQueue: queue.filter((lead) => !lead.blocked).length,
      blockedQueue: blockedCount,
      sourceCounts: summarizeBySource(leads),
      pipelineCounts: summarizeByStatus(leads),
      sellerCallOutcomes: outcomes.length,
      salesAssists: assists.length,
      attributedLeads: new Set(attributions.map((attribution) => attribution.leadId)).size,
      manualSourceCaptures: manualIntakes.length,
    },
    audit: buildSalesWorkspaceAudit({
      totalLeads: leads.length,
      queueCount: queue.filter((lead) => !lead.blocked).length,
      blockedCount,
      missingFactCount,
      outcomeCount: outcomes.length,
    }),
    safetyFlags: salesWorkspaceSafetyFlags,
  };
}
