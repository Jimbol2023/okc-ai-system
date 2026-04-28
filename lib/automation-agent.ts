import twilio from "twilio";

import { generateLeads } from "@/lib/lead-generator";
import { createDbLeadFromGenerated } from "@/lib/leads-db";
import { prisma } from "@/lib/prisma";
import { fetchRealLeads } from "@/lib/real-leads";

// =====================================================
// STEP 2B.4 — OUTREACH SAFETY + THROTTLE AGENT
// =====================================================

const MAX_OUTREACH_PER_CYCLE = 5;
const MIN_HOURS_BETWEEN_CONTACT = 12;

// Prevents over-texting one lead
const MAX_FOLLOW_UP_ATTEMPTS = 4;

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

type SmsResult = {
  success: boolean;
  mocked?: boolean;
  sentCount: number;
  failedCount: number;
};

type FollowUpLead = Awaited<ReturnType<typeof findOverdueFollowUpLeads>>[number];

// =====================================================
// STEP 2B.1 — FIND OVERDUE FOLLOW-UP LEADS
// =====================================================

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

// =====================================================
// SAFETY HELPERS
// =====================================================

function isValidPhone(phone: string | null) {
  if (!phone) return false;

  // E.164 phone format, example: +14051234567
  return /^\+\d{10,15}$/.test(phone);
}

function wasContactedTooRecently(lastContactedAt: Date | string | null) {
  if (!lastContactedAt) return false;

  const now = new Date();
  const lastContactedDate =
    lastContactedAt instanceof Date ? lastContactedAt : new Date(lastContactedAt);

  if (Number.isNaN(lastContactedDate.getTime())) return false;

  const hoursSinceLastContact =
    (now.getTime() - lastContactedDate.getTime()) / (1000 * 60 * 60);

  return hoursSinceLastContact < MIN_HOURS_BETWEEN_CONTACT;
}

function filterSafeLeads(leads: FollowUpLead[]) {
  return leads.filter((lead) => {
    if (!isValidPhone(lead.phone)) return false;

    if (wasContactedTooRecently(lead.lastContactedAt)) return false;

    if ((lead.followUpCount ?? 0) >= MAX_FOLLOW_UP_ATTEMPTS) return false;

    return true;
  });
}

// =====================================================
// STEP 2B.5 — MULTI-STAGE MESSAGE ENGINE
// =====================================================

function buildFollowUpMessage(lead: {
  name: string | null;
  propertyAddress: string;
  followUpCount?: number | null;
}) {
  const firstName = lead.name?.split(" ")[0] || "";
  const followUpCount = lead.followUpCount ?? 0;

  // Hard stop after max follow-ups
  if (followUpCount >= MAX_FOLLOW_UP_ATTEMPTS) {
    return null;
  }

  // First message
  if (followUpCount === 0) {
    return `Hi ${firstName}, I came across your property at ${lead.propertyAddress}. Would you consider an offer if it made sense?`;
  }

  // Friendly reminder
  if (followUpCount === 1) {
    return `Hey ${firstName}, just following up on ${lead.propertyAddress}. Let me know if you'd be open to discussing a possible offer.`;
  }

  // Value-driven follow-up
  if (followUpCount === 2) {
    return `Hi ${firstName}, I wanted to reach out again about ${lead.propertyAddress}. I can put together a quick offer if you're even slightly considering selling.`;
  }

  // Final soft exit
  if (followUpCount === 3) {
    return `Hey ${firstName}, I haven’t heard back regarding ${lead.propertyAddress}, so I’ll assume it’s not a good time. If anything changes, feel free to reach out anytime.`;
  }

  return null;
}

// =====================================================
// SMS SENDER — MOCK SAFE + TWILIO SAFE
// =====================================================

async function sendSms({
  phone,
  message
}: {
  phone: string;
  message: string;
}): Promise<SmsResult> {
  if (!phone || !isValidPhone(phone)) {
    return {
      success: false,
      sentCount: 0,
      failedCount: 1
    };
  }

  const hasTwilioConfig =
    Boolean(process.env.TWILIO_ACCOUNT_SID) &&
    Boolean(process.env.TWILIO_AUTH_TOKEN) &&
    Boolean(process.env.TWILIO_PHONE_NUMBER);

  if (!hasTwilioConfig) {
    console.log("Mock-safe SMS prepared:", {
      phone,
      message
    });

    return {
      success: true,
      mocked: true,
      sentCount: 1,
      failedCount: 0
    };
  }

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    console.log("Twilio SMS sent:", {
      phone
    });

    return {
      success: true,
      mocked: false,
      sentCount: 1,
      failedCount: 0
    };
  } catch (error) {
    console.error("Twilio SMS failed:", error);

    return {
      success: false,
      mocked: false,
      sentCount: 0,
      failedCount: 1
    };
  }
}

// =====================================================
// STEP 2B.2 — PROCESS OVERDUE LEADS SAFELY
// =====================================================

async function processOverdueLeads() {
  const now = new Date();

  const overdueLeads = await findOverdueFollowUpLeads();
  const safeLeads = filterSafeLeads(overdueLeads);
  const leadsToProcess = safeLeads.slice(0, MAX_OUTREACH_PER_CYCLE);

  let processedCount = 0;
  let smsSentCount = 0;
  let smsFailedCount = 0;

  for (const lead of leadsToProcess) {
    await prisma.lead.update({
      where: {
        id: lead.id
      },
      data: {
        automationStatus: "processing"
      }
    });

    const message = buildFollowUpMessage({
      name: lead.name,
      propertyAddress: lead.propertyAddress,
      followUpCount: lead.followUpCount
    });

    if (!message) {
      await prisma.lead.update({
        where: {
          id: lead.id
        },
        data: {
          automationStatus: "idle"
        }
      });

      continue;
    }

    const smsResult = await sendSms({
      phone: lead.phone,
      message
    });

    smsSentCount += smsResult.sentCount;
    smsFailedCount += smsResult.failedCount;

    const nextFollowUpAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    await prisma.lead.update({
      where: {
        id: lead.id
      },
      data: {
        lastContactedAt: now,
        nextFollowUpAt,
        followUpCount: {
          increment: 1
        },
        lastFollowUpMessage: message,
        automationStatus: "scheduled"
      }
    });

    processedCount++;
  }

  return {
    overdueFollowUpCount: overdueLeads.length,
    safeFollowUpCount: safeLeads.length,
    skippedUnsafeFollowUpCount: overdueLeads.length - safeLeads.length,
    processedCount,
    smsSentCount,
    smsFailedCount
  };
}

// =====================================================
// MAIN AUTOMATION CYCLE
// =====================================================

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

  const {
    overdueFollowUpCount,
    safeFollowUpCount,
    skippedUnsafeFollowUpCount,
    processedCount,
    smsSentCount,
    smsFailedCount
  } = await processOverdueLeads();

  const summaryParts = [
    `${addedCount} leads added`,
    `${skippedCount} duplicates skipped`,
    `${highPriorityCount} high-priority opportunities found`,
    `${overdueFollowUpCount} overdue follow-ups detected`,
    `${safeFollowUpCount} safe follow-ups eligible`,
    `${skippedUnsafeFollowUpCount} unsafe follow-ups skipped`,
    `${processedCount} follow-ups processed`,
    `${smsSentCount} SMS messages sent or prepared`,
    `${smsFailedCount} SMS messages failed`
  ];

  return {
    ranAt: new Date().toISOString(),
    addedCount,
    skippedCount,
    highPriorityCount,
    overdueFollowUpCount,
    safeFollowUpCount,
    skippedUnsafeFollowUpCount,
    processedFollowUpCount: processedCount,
    smsSentCount,
    smsFailedCount,
    summary: summaryParts.join(". ") + "."
  };
}