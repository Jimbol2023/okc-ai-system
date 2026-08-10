import { prisma } from "@/lib/prisma";
import type { CreateFinanceEntryInput } from "@/lib/validations/finance";

export type FinanceEntryRecord = {
  id: string;
  tenantId: string;
  entryType: string;
  category: string;
  source: string;
  amountCents: number;
  entryDate: Date;
  notes: string;
  leadId: string | null;
  dealReference: string | null;
  assumption: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type FinanceKpiSummary = {
  totalMarketingSpendCents: number;
  totalDealRevenueCents: number;
  totalDealExpenseCents: number;
  grossProfitCents: number;
  cashFlowCents: number;
  costPerLeadCents: number | null;
  costPerAcquisitionCents: number | null;
  grossProfitPerDealCents: number | null;
  acquisitionCount: number;
  leadCount: number;
  missingData: string[];
  safetyFlags: {
    manualOnly: true;
    accountingSystem: false;
    providerCalled: false;
    spendAutomated: false;
  };
};

type FinanceEntryDelegate = {
  findMany(args?: unknown): Promise<FinanceEntryRecord[]>;
  create(args: unknown): Promise<FinanceEntryRecord>;
};

function getFinanceEntryDelegate() {
  return (prisma as unknown as { financeEntry: FinanceEntryDelegate }).financeEntry;
}

export function dollarsToCents(amount: number) {
  return Math.round(amount * 100);
}

export function formatFinanceDollars(cents: number | null) {
  if (cents === null) return "Unavailable";

  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(cents / 100);
}

export function calculateFinanceKpis({
  entries,
  leadCount,
}: {
  entries: Array<Pick<FinanceEntryRecord, "entryType" | "amountCents" | "dealReference" | "leadId">>;
  leadCount: number;
}): FinanceKpiSummary {
  const totalMarketingSpendCents = entries
    .filter((entry) => entry.entryType === "marketing_spend")
    .reduce((sum, entry) => sum + entry.amountCents, 0);
  const totalDealRevenueCents = entries
    .filter((entry) => entry.entryType === "deal_revenue")
    .reduce((sum, entry) => sum + entry.amountCents, 0);
  const totalDealExpenseCents = entries
    .filter((entry) => entry.entryType === "deal_expense")
    .reduce((sum, entry) => sum + entry.amountCents, 0);
  const acquisitionKeys = new Set(
    entries
      .filter((entry) => entry.entryType === "deal_revenue")
      .map((entry) => entry.leadId || entry.dealReference)
      .filter((value): value is string => Boolean(value)),
  );
  const acquisitionCount = acquisitionKeys.size;
  const grossProfitCents = totalDealRevenueCents - totalDealExpenseCents;
  const cashFlowCents = grossProfitCents - totalMarketingSpendCents;

  return {
    totalMarketingSpendCents,
    totalDealRevenueCents,
    totalDealExpenseCents,
    grossProfitCents,
    cashFlowCents,
    costPerLeadCents: leadCount > 0 && totalMarketingSpendCents > 0 ? Math.round(totalMarketingSpendCents / leadCount) : null,
    costPerAcquisitionCents:
      acquisitionCount > 0 && totalMarketingSpendCents > 0 ? Math.round(totalMarketingSpendCents / acquisitionCount) : null,
    grossProfitPerDealCents: acquisitionCount > 0 ? Math.round(grossProfitCents / acquisitionCount) : null,
    acquisitionCount,
    leadCount,
    missingData: [
      entries.length === 0 ? "No manual finance entries have been recorded yet." : "",
      totalMarketingSpendCents === 0 ? "Marketing spend is missing or zero." : "",
      acquisitionCount === 0 ? "No closed/paid deal revenue entries are linked yet." : "",
      leadCount === 0 ? "No leads are available for cost-per-lead calculation." : "",
    ].filter(Boolean),
    safetyFlags: {
      manualOnly: true,
      accountingSystem: false,
      providerCalled: false,
      spendAutomated: false,
    },
  };
}

export async function listFinanceEntries(tenantId: string) {
  return getFinanceEntryDelegate().findMany({
    where: { tenantId },
    orderBy: [{ entryDate: "desc" }, { createdAt: "desc" }],
  });
}

export async function createFinanceEntry(tenantId: string, input: CreateFinanceEntryInput) {
  if (input.leadId) {
    const lead = await prisma.lead.findUnique({ where: { id_tenantId: { id: input.leadId, tenantId } } });
    if (!lead) throw new Error("Lead not found for authenticated tenant.");
  }

  return getFinanceEntryDelegate().create({
    data: {
      tenantId,
      entryType: input.entryType,
      category: input.category,
      source: input.source,
      amountCents: dollarsToCents(input.amount),
      entryDate: new Date(input.entryDate),
      notes: input.notes,
      leadId: input.leadId || null,
      dealReference: input.dealReference || null,
      assumption: input.assumption || null,
    },
  });
}
