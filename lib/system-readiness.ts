import { AI_CONFIG } from "@/lib/ai-config";
import {
  AI_OPTIMIZATION_THRESHOLDS,
  getActiveAiStrategies,
  getPromotionCandidates,
} from "@/lib/ai-optimization-engine";
import type { SystemHealth } from "@/lib/system-health";
import { getSystemHealth } from "@/lib/system-health";
import { prisma } from "@/lib/prisma";

export type ReadinessChecklistItem = {
  item: string;
  status: boolean;
};

export type RevenueReadiness = {
  ready: boolean;
  checklist: ReadinessChecklistItem[];
};

export type RiskFlag = {
  type: string;
  severity: "low" | "medium" | "high";
  message: string;
  recommendedAction: string;
};

function hasBuyerListSignal() {
  return Boolean(
    process.env.BUYER_LIST_EXISTS === "true" ||
      process.env.BUYER_LIST_URL ||
      process.env.BUYER_LIST_PATH,
  );
}

async function countRecentLeads() {
  return prisma.lead.count({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
  });
}

async function hasMemoryEvents() {
  const count = await prisma.aiMemoryEvent.count();

  return count > 0;
}

export async function evaluateRevenueReadiness(): Promise<RevenueReadiness> {
  const [
    scheduledFollowUps,
    memoryLoggingActive,
    buyerListExists,
  ] = await Promise.all([
    prisma.lead.count({
      where: {
        automationStatus: {
          in: ["scheduled", "approval_required", "approved_pending_send"],
        },
      },
    }),
    hasMemoryEvents(),
    Promise.resolve(hasBuyerListSignal()),
  ]);

  const checklist: ReadinessChecklistItem[] = [
    { item: "seller_intake", status: true },
    { item: "follow_up_automation", status: scheduledFollowUps > 0 },
    { item: "approval_gate", status: true },
    { item: "sms_sending_controlled", status: true },
    { item: "memory_logging", status: memoryLoggingActive },
    { item: "buyer_list", status: buyerListExists },
    { item: "deal_analyzer", status: true },
    { item: "rollback_capability", status: true },
  ];

  return {
    ready: checklist.every((item) => item.status),
    checklist,
  };
}

export async function generateRiskFlags(
  systemHealth?: SystemHealth,
  revenueReadiness?: RevenueReadiness,
): Promise<RiskFlag[]> {
  const [health, readiness, activeStrategies, candidates, recentLeads] =
    await Promise.all([
      systemHealth ? Promise.resolve(systemHealth) : getSystemHealth(),
      revenueReadiness
        ? Promise.resolve(revenueReadiness)
        : evaluateRevenueReadiness(),
      getActiveAiStrategies().catch(() => []),
      getPromotionCandidates().catch(() => []),
      countRecentLeads().catch(() => 0),
    ]);
  const flags: RiskFlag[] = [];

  if (AI_CONFIG.enableOptimization && recentLeads < 20) {
    flags.push({
      type: "optimization_insufficient_data",
      severity: "high",
      message: "AI optimization is enabled with fewer than 20 recent leads.",
      recommendedAction: "Disable optimization until more lead and outcome data exists.",
    });
  }

  activeStrategies.forEach((strategy) => {
    const candidate = candidates.find((item) => item.recommendationId === strategy.id);

    if (
      candidate &&
      candidate.sampleSize < AI_OPTIMIZATION_THRESHOLDS.minimumSampleSize
    ) {
      flags.push({
        type: "active_strategy_low_sample",
        severity: "high",
        message: `${strategy.title} is active with insufficient sample size.`,
        recommendedAction: "Roll back this strategy until it meets promotion thresholds.",
      });
    }
  });

  if (health.recentFailuresCount >= 5) {
    flags.push({
      type: "high_failed_job_rate",
      severity: "high",
      message: `${health.recentFailuresCount} recent failure event(s) were detected.`,
      recommendedAction: "Review AI job logs and failed message memory before scaling.",
    });
  } else if (health.recentFailuresCount > 0) {
    flags.push({
      type: "recent_failures_present",
      severity: "medium",
      message: `${health.recentFailuresCount} recent failure event(s) were detected.`,
      recommendedAction: "Review recent failures before increasing volume.",
    });
  }

  if (health.twilio !== "configured") {
    flags.push({
      type: "twilio_not_ready",
      severity: health.twilio === "missing" ? "high" : "medium",
      message:
        health.twilio === "missing"
          ? "Twilio credentials are missing."
          : "Twilio credentials are present but not verified by this readiness check.",
      recommendedAction: "Verify Twilio before scaling SMS outreach.",
    });
  }

  if (!readiness.checklist.find((item) => item.item === "buyer_list")?.status) {
    flags.push({
      type: "buyer_data_missing",
      severity: "medium",
      message: "No buyer list signal is configured.",
      recommendedAction: "Upload or build a buyer list.",
    });
  }

  if (recentLeads === 0) {
    flags.push({
      type: "no_recent_leads",
      severity: "medium",
      message: "No leads were created in the last 30 days.",
      recommendedAction: "Add seller leads before evaluating revenue readiness.",
    });
  }

  if (activeStrategies.length > 0) {
    const trackedOverrideCount = await prisma.aiMemoryEvent.count({
      where: {
        eventType: "behavior_override_applied",
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    if (trackedOverrideCount === 0) {
      flags.push({
        type: "override_active_without_tracking",
        severity: "high",
        message: "Active strategies exist but no recent override tracking events were found.",
        recommendedAction: "Roll back active strategies or verify memory logging before scaling.",
      });
    }
  }

  return flags;
}

export function generateNextActions(
  revenueReadiness: RevenueReadiness,
  riskFlags: RiskFlag[],
) {
  const actions = new Set<string>();

  if (riskFlags.some((flag) => flag.type === "optimization_insufficient_data")) {
    actions.add("Add at least 20 leads before enabling optimization.");
    actions.add("Disable optimization until sufficient data exists.");
  }

  if (!revenueReadiness.checklist.find((item) => item.item === "buyer_list")?.status) {
    actions.add("Upload or build a buyer list.");
  }

  if (riskFlags.some((flag) => flag.type === "twilio_not_ready")) {
    actions.add("Verify Twilio before scaling SMS outreach.");
  }

  if (!revenueReadiness.checklist.find((item) => item.item === "memory_logging")?.status) {
    actions.add("Generate memory events through approved workflows before scaling.");
  }

  if (!revenueReadiness.checklist.find((item) => item.item === "follow_up_automation")?.status) {
    actions.add("Add or schedule follow-up-ready leads.");
  }

  riskFlags.forEach((flag) => actions.add(flag.recommendedAction));

  if (actions.size === 0) {
    actions.add("Continue monitoring readiness before increasing lead volume.");
  }

  return Array.from(actions);
}
