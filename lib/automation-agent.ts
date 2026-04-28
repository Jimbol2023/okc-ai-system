import twilio from "twilio";

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

function buildFollowUpMessage(lead: { name: string | null; propertyAddress: string }) {
  const firstName = lead.name?.split(" ")[0] || "";

  const greetings = [`Hi ${firstName},`, `Hey ${firstName},`, "Hi,"];

  const intros = [
    `I was reaching out about the property on ${lead.propertyAddress}.`,
    `Quick question about ${lead.propertyAddress}.`,
    `I came across your property on ${lead.propertyAddress}.`
  ];

  const closings = [
    "Would you consider an offer if it made sense?",
    "Is that something you'd be open to?",
    "Not sure if you’ve thought about selling, but curious.",
    "Any interest in selling it?"
  ];

  const random = (items: string[]) => items[Math.floor(Math.random() * items.length)];

  return `${random(greetings)} ${random(intros)} ${random(closings)}`;
}

async function sendSms({
  phone,
  message
}: {
  phone: string;
  message: string;
}): Promise<SmsResult> {
  if (!phone) {
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

async function processOverdueLeads() {
  const now = new Date();
  const overdueLeads = await findOverdueFollowUpLeads();

  let processedCount = 0;
  let smsSentCount = 0;
  let smsFailedCount = 0;

  for (const lead of overdueLeads) {
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
      propertyAddress: lead.propertyAddress
    });

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
    processedCount,
    smsSentCount,
    smsFailedCount
  };
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
  const { processedCount, smsSentCount, smsFailedCount } = await processOverdueLeads();

  const summaryParts = [
    `${addedCount} leads added`,
    `${skippedCount} duplicates skipped`,
    `${highPriorityCount} high-priority opportunities found`,
    `${overdueFollowUpCount} overdue follow-ups detected`,
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
    processedFollowUpCount: processedCount,
    smsSentCount,
    smsFailedCount,
    summary: summaryParts.join(". ") + "."
  };
}