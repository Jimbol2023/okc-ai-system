import { prisma } from "@/lib/prisma";
import {
  buildOfferReadinessAudit,
  classifyOfferReadiness,
  getOfferReadinessAssumptionRoi,
  getOfferReadinessMissingFacts,
  getOfferReadinessNextAction,
  getOfferReadinessRank,
  offerReadinessSafetyFlags,
  type OfferReadinessOutcomeInput,
} from "@/lib/offer-readiness-core";

function getTime(value: Date | string | null | undefined) {
  if (!value) return 0;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function getLatestOutcome(outcomes: OfferReadinessOutcomeInput[]) {
  return [...outcomes].sort((a, b) => getTime(b.callCompletedAt) - getTime(a.callCompletedAt))[0] ?? null;
}

function summarizeByStatus(queue: Array<{ readinessStatus: string }>) {
  return queue.reduce<Record<string, number>>((summary, item) => {
    summary[item.readinessStatus] = (summary[item.readinessStatus] ?? 0) + 1;
    return summary;
  }, {});
}

function summarizeBySource(queue: Array<{ source: string }>) {
  return queue.reduce<Record<string, number>>((summary, item) => {
    const source = item.source || "unknown";
    summary[source] = (summary[source] ?? 0) + 1;
    return summary;
  }, {});
}

export async function getOfferReadinessWorkspace() {
  const [leads, outcomes, assists, attributions] = await Promise.all([
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
  ]);

  const outcomesByLead = new Map<string, OfferReadinessOutcomeInput[]>();
  outcomes.forEach((outcome) => {
    outcomesByLead.set(outcome.leadId, [...(outcomesByLead.get(outcome.leadId) ?? []), outcome]);
  });

  const assistsByLead = new Map<string, typeof assists>();
  assists.forEach((assist) => {
    assistsByLead.set(assist.leadId, [...(assistsByLead.get(assist.leadId) ?? []), assist]);
  });

  const attributionsByLead = new Map<string, typeof attributions>();
  attributions.forEach((attribution) => {
    attributionsByLead.set(attribution.leadId, [...(attributionsByLead.get(attribution.leadId) ?? []), attribution]);
  });

  const queue = leads
    .map((lead) => {
      const latestOutcome = getLatestOutcome(outcomesByLead.get(lead.id) ?? []);
      const readinessInput = {
        status: lead.status,
        score: lead.score,
        priority: lead.priority,
        doNotContact: lead.doNotContact,
        approvalStatus: lead.approvalStatus,
        payload: lead.payload,
      };
      const missingFacts = getOfferReadinessMissingFacts(readinessInput, latestOutcome);
      const readinessStatus = classifyOfferReadiness(readinessInput, latestOutcome);
      const rank = getOfferReadinessRank({
        status: readinessStatus,
        lead,
        missingFacts,
      });

      return {
        id: lead.id,
        name: lead.name,
        source: lead.source,
        propertyAddress: lead.propertyAddress,
        status: lead.status,
        score: lead.score,
        priority: lead.priority,
        approvalStatus: lead.approvalStatus,
        doNotContact: lead.doNotContact,
        readinessStatus,
        rank,
        missingFacts,
        nextManualAction: getOfferReadinessNextAction(readinessStatus, missingFacts),
        assumptionRoi: getOfferReadinessAssumptionRoi(lead.payload),
        latestOutcome,
        latestAssist: assistsByLead.get(lead.id)?.[0] ?? null,
        attributions: (attributionsByLead.get(lead.id) ?? []).slice(0, 3),
      };
    })
    .sort((a, b) => b.rank - a.rank || b.score - a.score)
    .slice(0, 30);

  const readyCount = queue.filter((item) => item.readinessStatus === "ready_for_manual_offer_review").length;
  const blockedCount = queue.filter((item) => item.readinessStatus === "blocked_or_suppressed").length;
  const missingFactCount = queue.reduce((total, item) => total + item.missingFacts.length, 0);

  return {
    queue,
    summary: {
      totalLeadsReviewed: leads.length,
      readyCount,
      blockedCount,
      statusCounts: summarizeByStatus(queue),
      sourceCounts: summarizeBySource(queue),
      assumptionRoiAvailable: queue.filter((item) => item.assumptionRoi.available).length,
    },
    audit: buildOfferReadinessAudit({
      totalLeads: leads.length,
      readyCount,
      blockedCount,
      missingFactCount,
    }),
    safetyFlags: offerReadinessSafetyFlags,
  };
}
