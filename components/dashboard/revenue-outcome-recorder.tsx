"use client";

import { FormEvent, useMemo, useState } from "react";
import { Save, ShieldCheck } from "lucide-react";

type LeadOption = {
  id: string;
  label: string;
  propertyAddress: string;
  source: string;
  referralCode?: string | null;
  referralCampaign?: string | null;
  referralLandingPage?: string | null;
};

type RecordKind = "source_spend" | "lead_outcome" | "appointment_outcome" | "contract_outcome" | "closed_revenue";

const recordKinds: Array<{ value: RecordKind; label: string }> = [
  { value: "source_spend", label: "Source Spend" },
  { value: "lead_outcome", label: "Lead" },
  { value: "appointment_outcome", label: "Appointment" },
  { value: "contract_outcome", label: "Contract" },
  { value: "closed_revenue", label: "Closed Revenue" },
];

function cents(value: FormDataEntryValue | null) {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? Math.round(amount * 100) : 0;
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function nullableText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value || null;
}

function isoDate(value: string) {
  return new Date(value || Date.now()).toISOString();
}

export function RevenueOutcomeRecorder({ leads }: { leads: LeadOption[] }) {
  const [kind, setKind] = useState<RecordKind>("lead_outcome");
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id ?? "");
  const [status, setStatus] = useState<{ tone: "idle" | "success" | "error"; message: string }>({
    tone: "idle",
    message: "Manual internal recording only. No providers are called.",
  });
  const selectedLead = useMemo(() => leads.find((lead) => lead.id === selectedLeadId) ?? leads[0], [leads, selectedLeadId]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (kind !== "source_spend" && !selectedLeadId) {
      setStatus({ tone: "error", message: "Lead-linked outcomes need an existing lead first." });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const sourceDetail = selectedLead?.source || text(formData, "source") || "manual";
    const sourceType = sourceDetail.toLowerCase().includes("referral") ? "referral" : "manual_internal";
    const commonLeadFields = {
      leadId: selectedLeadId,
      sourceType,
      sourceDetail,
      campaignId: selectedLead?.referralCampaign || null,
      referralCode: selectedLead?.referralCode || null,
      landingPage: selectedLead?.referralLandingPage || null,
      evidence: {
        recordedVia: "revenue_command_center",
        evidenceNote: text(formData, "evidenceNote"),
      },
      verificationStatus: String(formData.get("verificationStatus") || "PARTIAL"),
      businessContext: "real_business",
      isTestRecord: false,
    };

    const record =
      kind === "source_spend"
        ? {
            kind,
            source: text(formData, "source"),
            campaign: nullableText(formData, "campaign"),
            periodStart: isoDate(text(formData, "periodStart")),
            periodEnd: isoDate(text(formData, "periodEnd")),
            providerFeesCents: cents(formData.get("providerFees")),
            mailSpendCents: cents(formData.get("mailSpend")),
            adSpendCents: cents(formData.get("adSpend")),
            otherSpendCents: cents(formData.get("otherSpend")),
            creditsConsumed: Number(formData.get("creditsConsumed") || 0),
            evidenceSource: text(formData, "evidenceSource"),
            verificationStatus: String(formData.get("verificationStatus") || "PARTIAL"),
            businessContext: "real_business",
            isTestRecord: false,
          }
        : kind === "lead_outcome"
          ? {
              ...commonLeadFields,
              kind,
              outcome: text(formData, "leadOutcome"),
              occurredAt: isoDate(text(formData, "occurredAt")),
            }
          : kind === "appointment_outcome"
            ? {
                ...commonLeadFields,
                kind,
                appointmentReference: text(formData, "appointmentReference"),
                scheduledAt: nullableText(formData, "scheduledAt") ? isoDate(text(formData, "scheduledAt")) : null,
                completedAt: nullableText(formData, "completedAt") ? isoDate(text(formData, "completedAt")) : null,
                outcome: text(formData, "appointmentOutcome"),
              }
            : kind === "contract_outcome"
              ? {
                  ...commonLeadFields,
                  kind,
                  contractReference: text(formData, "contractReference"),
                  outcome: text(formData, "contractOutcome"),
                  signedAt: nullableText(formData, "signedAt") ? isoDate(text(formData, "signedAt")) : null,
                  expectedValueCents: cents(formData.get("expectedValue")),
                }
              : {
                  kind,
                  leadId: selectedLeadId || null,
                  sourceType,
                  sourceDetail,
                  campaignId: selectedLead?.referralCampaign || null,
                  referralCode: selectedLead?.referralCode || null,
                  landingPage: selectedLead?.referralLandingPage || null,
                  contractReference: nullableText(formData, "contractReference"),
                  closingReference: text(formData, "closingReference"),
                  revenueType: text(formData, "revenueType"),
                  grossRevenueCents: cents(formData.get("grossRevenue")),
                  directCostCents: cents(formData.get("directCost")),
                  netRevenueCents: cents(formData.get("grossRevenue")) - cents(formData.get("directCost")),
                  closedAt: isoDate(text(formData, "closedAt")),
                  verificationSource: text(formData, "verificationSource"),
                  verificationStatus: "VERIFIED",
                  financeEntryId: nullableText(formData, "financeEntryId"),
                  businessContext: "real_business",
                  isTestRecord: false,
                  projectedRevenue: false,
                };

    setStatus({ tone: "idle", message: "Recording internal outcome..." });
    const response = await fetch("/api/revenue/attribution-ledger/record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ record }),
    });
    const result = await response.json();

    setStatus({
      tone: response.ok ? "success" : "error",
      message: response.ok ? "Recorded. Provider calls stayed disabled." : result.error || "Recording failed.",
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {recordKinds.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setKind(item.value)}
            className={`rounded border px-3 py-2 text-xs font-bold ${kind === item.value ? "border-accent bg-accent text-white" : "border-border bg-white text-primary"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {kind !== "source_spend" ? (
        <label className="block text-sm font-semibold text-primary">
          Lead
          <select required value={selectedLeadId} onChange={(event) => setSelectedLeadId(event.target.value)} className="mt-1 w-full rounded border border-border bg-white p-2 text-sm">
            {leads.length === 0 ? <option value="">Create or import a lead first</option> : null}
            {leads.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.label} - {lead.propertyAddress || "No address"} - {lead.source || "Unknown source"}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {kind === "source_spend" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <TextInput name="source" label="Source" required defaultValue="manual" />
          <TextInput name="campaign" label="Campaign" />
          <TextInput name="periodStart" label="Period Start" type="date" required />
          <TextInput name="periodEnd" label="Period End" type="date" required />
          <TextInput name="providerFees" label="Provider Fees" type="number" min="0" step="0.01" />
          <TextInput name="mailSpend" label="Mail Spend" type="number" min="0" step="0.01" />
          <TextInput name="adSpend" label="Ad Spend" type="number" min="0" step="0.01" />
          <TextInput name="otherSpend" label="Other Spend" type="number" min="0" step="0.01" />
          <TextInput name="creditsConsumed" label="Credits Consumed" type="number" min="0" step="1" />
          <TextInput name="evidenceSource" label="Evidence Source" required />
        </div>
      ) : null}

      {kind === "lead_outcome" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <SelectInput name="leadOutcome" label="Outcome" options={["qualified", "disqualified", "human_review_required", "appointment_scheduled", "appointment_completed", "no_show", "offer_prepared", "contract_pending", "contract_signed", "lost", "closed"]} />
          <TextInput name="occurredAt" label="Occurred At" type="datetime-local" required />
        </div>
      ) : null}

      {kind === "appointment_outcome" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <TextInput name="appointmentReference" label="Appointment Reference" required />
          <SelectInput name="appointmentOutcome" label="Outcome" options={["scheduled", "completed", "cancelled", "no_show"]} />
          <TextInput name="scheduledAt" label="Scheduled At" type="datetime-local" />
          <TextInput name="completedAt" label="Completed At" type="datetime-local" />
        </div>
      ) : null}

      {kind === "contract_outcome" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <TextInput name="contractReference" label="Contract Reference" required />
          <SelectInput name="contractOutcome" label="Outcome" options={["prepared", "review_pending", "signed", "cancelled", "failed"]} />
          <TextInput name="signedAt" label="Signed At" type="datetime-local" />
          <TextInput name="expectedValue" label="Expected Value" type="number" min="0" step="0.01" />
        </div>
      ) : null}

      {kind === "closed_revenue" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <TextInput name="closingReference" label="Closing Reference" required />
          <SelectInput name="revenueType" label="Revenue Type" options={["assignment_fee", "wholesale_spread", "referral_fee", "other_governed_real_estate_revenue"]} />
          <TextInput name="grossRevenue" label="Gross Revenue" type="number" min="0.01" step="0.01" required />
          <TextInput name="directCost" label="Direct Cost" type="number" min="0" step="0.01" />
          <TextInput name="closedAt" label="Closed At" type="datetime-local" required />
          <TextInput name="verificationSource" label="Verification Source" required />
          <TextInput name="contractReference" label="Contract Reference" />
          <TextInput name="financeEntryId" label="Finance Entry Reference" />
        </div>
      ) : null}

      {kind !== "closed_revenue" ? <SelectInput name="verificationStatus" label="Verification" options={["PARTIAL", "VERIFIED", "ESTIMATED", "INSUFFICIENT_DATA"]} /> : null}
      {kind !== "source_spend" ? <TextInput name="evidenceNote" label="Evidence Note" required /> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className={`text-sm ${status.tone === "error" ? "text-red-700" : status.tone === "success" ? "text-green-700" : "text-muted"}`}>{status.message}</p>
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded bg-primary px-4 py-2 text-sm font-bold text-white">
          <Save className="h-4 w-4" aria-hidden="true" />
          Record
        </button>
      </div>

      <div className="flex items-center gap-2 rounded border border-border bg-white p-3 text-xs font-semibold text-muted">
        <ShieldCheck className="h-4 w-4 text-green-700" aria-hidden="true" />
        providerCalled:false; sent:false; published:false; liveExecutionAllowed:false
      </div>
    </form>
  );
}

function TextInput(props: { name: string; label: string; type?: string; required?: boolean; defaultValue?: string; min?: string; step?: string }) {
  return (
    <label className="block text-sm font-semibold text-primary">
      {props.label}
      <input {...props} className="mt-1 w-full rounded border border-border bg-white p-2 text-sm" />
    </label>
  );
}

function SelectInput({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <label className="block text-sm font-semibold text-primary">
      {label}
      <select name={name} className="mt-1 w-full rounded border border-border bg-white p-2 text-sm">
        {options.map((option) => (
          <option key={option} value={option}>
            {option.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </label>
  );
}
