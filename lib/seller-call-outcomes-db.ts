import { prisma } from "@/lib/prisma";
import type { ValidatedSellerCallOutcomeInput } from "@/lib/seller-call-outcome-validation";

export type SellerCallOutcomeRecord = {
  id: string;
  leadId: string;
  outcome: string;
  callCompletedAt: Date;
  operatorSummary: string;
  sellerMotivationSignal: string;
  sellerTimelineSignal: string;
  propertyConditionSignal: string;
  priceExpectationSignal: string;
  manualNextStep: string;
  safetyFlags: string[];
  createdAt: Date;
};

type SellerCallOutcomeDelegateRecord = Omit<SellerCallOutcomeRecord, "safetyFlags"> & {
  safetyFlags: unknown;
};

type SellerCallOutcomeDelegate = {
  create(args: {
    data: {
      leadId: string;
      outcome: string;
      callCompletedAt: Date;
      operatorSummary: string;
      sellerMotivationSignal: string;
      sellerTimelineSignal: string;
      propertyConditionSignal: string;
      priceExpectationSignal: string;
      manualNextStep: string;
      safetyFlags: string[];
    };
  }): Promise<SellerCallOutcomeDelegateRecord>;
  findMany(args: {
    where: {
      leadId: string;
    };
    orderBy: Array<{
      callCompletedAt?: "asc" | "desc";
      createdAt?: "asc" | "desc";
    }>;
  }): Promise<SellerCallOutcomeDelegateRecord[]>;
};

type SellerCallOutcomePrismaClient = typeof prisma & {
  sellerCallOutcome?: SellerCallOutcomeDelegate;
};

function getSellerCallOutcomeDelegate() {
  const delegate = (prisma as SellerCallOutcomePrismaClient).sellerCallOutcome;

  if (!delegate) {
    throw new Error("SellerCallOutcome Prisma delegate is unavailable. Regenerate the Prisma client after applying the schema.");
  }

  return delegate;
}

function normalizeSafetyFlags(value: unknown) {
  return Array.isArray(value) ? value.filter((flag): flag is string => typeof flag === "string") : [];
}

function serializeOutcome(record: SellerCallOutcomeDelegateRecord): SellerCallOutcomeRecord {
  return {
    ...record,
    safetyFlags: normalizeSafetyFlags(record.safetyFlags),
  };
}

export async function createSellerCallOutcome(leadId: string, input: ValidatedSellerCallOutcomeInput) {
  const outcome = await getSellerCallOutcomeDelegate().create({
    data: {
      leadId,
      outcome: input.outcome,
      callCompletedAt: input.callCompletedAt,
      operatorSummary: input.operatorSummary,
      sellerMotivationSignal: input.sellerMotivationSignal,
      sellerTimelineSignal: input.sellerTimelineSignal,
      propertyConditionSignal: input.propertyConditionSignal,
      priceExpectationSignal: input.priceExpectationSignal,
      manualNextStep: input.manualNextStep,
      safetyFlags: input.safetyFlags,
    },
  });

  return serializeOutcome(outcome);
}

export async function listSellerCallOutcomesByLeadId(leadId: string) {
  const outcomes = await getSellerCallOutcomeDelegate().findMany({
    where: {
      leadId,
    },
    orderBy: [{ callCompletedAt: "desc" }, { createdAt: "desc" }],
  });

  return outcomes.map(serializeOutcome);
}
