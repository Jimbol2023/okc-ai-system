import type { RevenueAttributionLedgerReport } from "@/lib/revenue-attribution-ledger";
import { calculateSpeedToLead } from "@/lib/revenue-attribution-recording";
import type { StoredLead } from "@/lib/leads-storage";

export type TodaysRevenueWorkItem = {
  id: string;
  label: string;
  detail: string;
  priority: "urgent" | "watch" | "good";
  category: "hot_new_lead" | "overdue_follow_up" | "missing_outcome_evidence" | "spend_without_contracts";
};

function toDate(value: Date | string | null | undefined) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function leadName(lead: StoredLead) {
  return `${lead.firstName} ${lead.lastName}`.trim() || lead.propertyAddress || lead.id;
}

export function createTodaysRevenueWork(input: {
  leads: StoredLead[];
  ledger: RevenueAttributionLedgerReport;
  now?: Date;
}) {
  const now = input.now ?? new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const items: TodaysRevenueWorkItem[] = [];

  input.leads.forEach((lead) => {
    const createdAt = toDate(lead.timestamp);
    const nextFollowUpAt = toDate(lead.nextFollowUpAt);
    const speed = calculateSpeedToLead({
      leadId: lead.id,
      priority: lead.priority,
      leadReceivedAt: createdAt,
      firstHumanContactAt: lead.lastContactedAt,
      now,
    });

    if (lead.priority === "High" && lead.status === "new") {
      items.push({
        id: `hot:${lead.id}`,
        label: leadName(lead),
        detail: `${lead.propertyAddress || "No property address captured"}; ${speed.slaClassification}`,
        priority: speed.slaClassification === "NO_CONTACT_EVIDENCE" ? "urgent" : "watch",
        category: "hot_new_lead",
      });
    }

    if (nextFollowUpAt && nextFollowUpAt <= now && lead.status !== "closed") {
      items.push({
        id: `follow-up:${lead.id}`,
        label: leadName(lead),
        detail: `Follow-up due ${nextFollowUpAt.toLocaleString("en-US")}; no automated outreach sent.`,
        priority: "urgent",
        category: "overdue_follow_up",
      });
    }

    if (lead.status === "contacted" || lead.status === "negotiating" || lead.status === "under_contract") {
      items.push({
        id: `evidence:${lead.id}`,
        label: leadName(lead),
        detail: `Record the next verified outcome for ${lead.status.replace("_", " ")} lead.`,
        priority: lead.status === "under_contract" ? "urgent" : "watch",
        category: "missing_outcome_evidence",
      });
    }
  });

  input.ledger.summary.spendNoContracts.slice(0, 4).forEach((source) => {
    items.push({
      id: `spend-no-contract:${source}`,
      label: source,
      detail: "Verified spend exists without a recorded signed contract.",
      priority: "watch",
      category: "spend_without_contracts",
    });
  });

  return {
    generatedAt: now.toISOString(),
    items: items.slice(0, 10),
    summary: {
      urgent: items.filter((item) => item.priority === "urgent").length,
      watch: items.filter((item) => item.priority === "watch").length,
      providerCalled: false as const,
      sent: false as const,
      published: false as const,
      liveExecutionAllowed: false as const,
    },
  };
}
