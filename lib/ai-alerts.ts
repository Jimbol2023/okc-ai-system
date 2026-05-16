import { getLatestAiPerformanceMetric } from "@/lib/ai-performance";

export type AiAlert = {
  id: string;
  type: string;
  severity: "info" | "medium" | "warning" | "high" | "critical";
  title: string;
  message: string;
  count: number;
  recommendedAction: string;
  actionUrl?: string;
  createdAt: string;
};

export async function getAiAlerts(): Promise<AiAlert[]> {
  const latest = await getLatestAiPerformanceMetric();
  const createdAt = new Date().toISOString();

  if (!latest) {
    return [
      {
        id: "no-ai-performance-snapshot",
        type: "no_snapshot",
        severity: "info",
        title: "No AI Performance Snapshot",
        message: "No AI performance snapshot exists yet.",
        count: 0,
        recommendedAction:
          "No AI performance snapshot is available yet. Generate metrics only through an explicitly authorized admin/maintenance workflow.",
        actionUrl: "/dashboard/ai-performance",
        createdAt,
      },
    ];
  }

  const alerts: AiAlert[] = [];

  if (latest.staleNewLeads > 0) {
    alerts.push({
      id: "stale-new-leads",
      type: "stale_new_leads",
      severity: "warning",
      title: "Stale New Leads",
      message: `${latest.staleNewLeads} new lead(s) are older than 24 hours.`,
      count: latest.staleNewLeads,
      recommendedAction:
        "Review new leads older than 24 hours and contact the highest-priority sellers first.",
      actionUrl: "/dashboard/leads",
      createdAt,
    });
  }

  if (latest.overdueFollowUps > 0) {
    alerts.push({
      id: "overdue-follow-ups",
      type: "overdue_followups",
      severity: "high",
      title: "Overdue Follow-Ups",
      message: `${latest.overdueFollowUps} follow-up(s) are overdue.`,
      count: latest.overdueFollowUps,
      recommendedAction:
        "Open the follow-up queue and contact overdue sellers before new cold outreach.",
      actionUrl: "/dashboard/leads",
      createdAt,
    });
  }

  if (latest.humanApprovalsNeeded > 0) {
    alerts.push({
      id: "ai-replies-waiting-approval",
      type: "ai_replies_waiting_approval",
      severity: "medium",
      title: "AI Replies Waiting for Approval",
      message: `${latest.humanApprovalsNeeded} AI suggested reply/replies need approval.`,
      count: latest.humanApprovalsNeeded,
      recommendedAction:
        "Review AI suggested replies and send approved responses.",
      actionUrl: "/dashboard/leads",
      createdAt,
    });
  }

  if (latest.dncCount > 0) {
    alerts.push({
      id: "dnc-records-present",
      type: "dnc_records_present",
      severity: "info",
      title: "DNC Records Present",
      message: `${latest.dncCount} lead(s) are marked Do Not Contact.`,
      count: latest.dncCount,
      recommendedAction:
        "Keep these records protected from outbound automation and audit compliance regularly.",
      actionUrl: "/dashboard/leads",
      createdAt,
    });
  }

  if (
    latest.totalLeads > 0 &&
    latest.automationIdle / latest.totalLeads > 0.5
  ) {
    alerts.push({
      id: "high-idle-automation",
      type: "high_idle_automation",
      severity: "warning",
      title: "High Idle Automation",
      message: `${latest.automationIdle} lead(s) are currently idle in automation.`,
      count: latest.automationIdle,
      recommendedAction:
        "Review why many leads are idle and decide if they need follow-up scheduling.",
      actionUrl: "/dashboard/ai-performance",
      createdAt,
    });
  }

  if (latest.aiClassifications > 0 && latest.avgConfidence < 0.65) {
    alerts.push({
      id: "low-ai-confidence",
      type: "low_ai_confidence",
      severity: "critical",
      title: "Low AI Confidence",
      message: `Average AI confidence is ${Math.round(
        latest.avgConfidence * 100
      )}%.`,
      count: latest.aiClassifications,
      recommendedAction:
        "Review seller reply classifications and improve prompt logic or manual review rules.",
      actionUrl: "/dashboard/ai-performance",
      createdAt,
    });
  }

  return alerts;
}
