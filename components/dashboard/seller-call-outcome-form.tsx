"use client";

import { useMemo, useState, type FormEvent } from "react";

import { getSellerCallOutcomePlan, type SellerCallOutcomeId, type SellerCallSafetyFlag, type SellerCallSignalStrength } from "@/lib/seller-call-outcome-plan";
import {
  sellerCallManualNextSteps,
  sellerCallSignalStrengths,
  type SellerCallManualNextStep,
} from "@/lib/seller-call-outcome-validation";
import type { SellerCallOutcomeUsabilityModel } from "@/lib/seller-call-outcome-usability";
import type { SellerCallOutcomeHistoryItem } from "@/components/dashboard/seller-call-outcome-history";

type SellerCallOutcomeFormProps = {
  leadId: string;
  usability?: SellerCallOutcomeUsabilityModel;
  onOutcomeSaved: (outcome: SellerCallOutcomeHistoryItem) => void;
};

type SaveResponse = {
  ok: boolean;
  outcome?: SellerCallOutcomeHistoryItem;
  errors?: string[];
  error?: string;
  sent: false;
  wouldSend: false;
  automationTriggered: false;
  providerCalled: false;
};

const manualNextStepByOutcome: Record<SellerCallOutcomeId, SellerCallManualNextStep> = {
  no_answer: "manual_follow_up_review",
  left_voicemail: "manual_follow_up_review",
  wrong_number: "verify_contact_info",
  disconnected: "verify_contact_info",
  not_interested: "manual_closeout_review",
  call_back_requested: "manual_follow_up_review",
  interested: "operator_review",
  wants_offer: "manual_offer_readiness_review",
  appointment_set: "manual_appointment_review",
  already_sold: "manual_closeout_review",
  do_not_contact: "dnc_manual_review",
  needs_manual_review: "sensitive_manual_review",
};

function formatLabel(value?: string) {
  return value ? value.replaceAll("_", " ") : "Unknown";
}

function getDefaultCallCompletedAt() {
  const now = new Date();
  const offsetDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);

  return offsetDate.toISOString().slice(0, 16);
}

export function SellerCallOutcomeForm({ leadId, usability, onOutcomeSaved }: SellerCallOutcomeFormProps) {
  const plan = useMemo(() => getSellerCallOutcomePlan(), []);
  const [outcome, setOutcome] = useState<SellerCallOutcomeId>(usability?.recommendedDefaults.outcome ?? "no_answer");
  const [callCompletedAt, setCallCompletedAt] = useState(getDefaultCallCompletedAt());
  const [operatorSummary, setOperatorSummary] = useState("");
  const [sellerMotivationSignal, setSellerMotivationSignal] = useState<SellerCallSignalStrength>(usability?.recommendedDefaults.sellerMotivationSignal ?? "not_captured");
  const [sellerTimelineSignal, setSellerTimelineSignal] = useState<SellerCallSignalStrength>(usability?.recommendedDefaults.sellerTimelineSignal ?? "not_captured");
  const [propertyConditionSignal, setPropertyConditionSignal] = useState<SellerCallSignalStrength>(usability?.recommendedDefaults.propertyConditionSignal ?? "not_captured");
  const [priceExpectationSignal, setPriceExpectationSignal] = useState<SellerCallSignalStrength>(usability?.recommendedDefaults.priceExpectationSignal ?? "not_captured");
  const [manualNextStep, setManualNextStep] = useState<SellerCallManualNextStep>(usability?.recommendedDefaults.manualNextStep ?? manualNextStepByOutcome.no_answer);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const outcomeDefinition = plan.outcomeDefinitions.find((definition) => definition.id === outcome);
  const safetyFlags = outcomeDefinition?.safetyFlags ?? ["no_execution"];

  function handleOutcomeChange(value: SellerCallOutcomeId) {
    setOutcome(value);
    setManualNextStep(manualNextStepByOutcome[value]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaveState("saving");
      setError(null);
      setStatusMessage(null);

      const response = await fetch(`/api/leads/${leadId}/seller-call-outcomes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          outcome,
          callCompletedAt,
          operatorSummary,
          sellerMotivationSignal,
          sellerTimelineSignal,
          propertyConditionSignal,
          priceExpectationSignal,
          manualNextStep,
          safetyFlags,
        }),
      });
      const data = (await response.json()) as SaveResponse;

      if (!response.ok || !data.ok || !data.outcome) {
        setError(data.errors?.join(" ") || data.error || "Unable to save seller call outcome.");
        setSaveState("idle");
        return;
      }

      onOutcomeSaved(data.outcome);
      setOperatorSummary("");
      setSaveState("saved");
      setStatusMessage("Outcome captured. No outreach, provider call, automation, approval, or DNC mutation occurred.");
    } catch (saveError) {
      console.error("Failed to save seller call outcome:", saveError);
      setError(saveError instanceof Error ? saveError.message : "Unable to save seller call outcome.");
      setSaveState("idle");
    }
  }

  return (
    <section className="rounded-xl border bg-white p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Seller call outcome capture</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manual capture only. No outreach is sent, no provider is called, no automation is triggered, no approval is granted, and no DNC state is changed.
          </p>
        </div>
        <span className="w-fit rounded border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase text-emerald-800">
          Append-only
        </span>
      </div>

      {usability ? (
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1.2fr]">
          <div className="rounded border border-blue-100 bg-blue-50 p-3 text-sm leading-6 text-blue-950">
            <p className="font-bold">Capture state: {formatLabel(usability.captureState)}</p>
            <p className="mt-1">{usability.operatorGuidance}</p>
          </div>
          <div className="rounded border border-amber-100 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
            <p className="font-bold">Before saving</p>
            <p className="mt-1">
              Summary is required. Keep it internal and factual; avoid send, call, schedule, approval, DNC override, provider, credential, or contract instructions.
            </p>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block text-sm font-semibold text-gray-700">
            Completed manual call outcome
            <select
              value={outcome}
              onChange={(event) => handleOutcomeChange(event.target.value as SellerCallOutcomeId)}
              className="mt-1 w-full rounded border px-3 py-2"
            >
              {plan.outcomeDefinitions.map((definition) => (
                <option key={definition.id} value={definition.id}>
                  {definition.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold text-gray-700">
            Manual call completed at
            <input
              type="datetime-local"
              value={callCompletedAt}
              onChange={(event) => setCallCompletedAt(event.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
              required
            />
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {[
            ["Seller motivation", sellerMotivationSignal, setSellerMotivationSignal],
            ["Seller timeline", sellerTimelineSignal, setSellerTimelineSignal],
            ["Property condition", propertyConditionSignal, setPropertyConditionSignal],
            ["Price expectation", priceExpectationSignal, setPriceExpectationSignal],
          ].map(([label, value, setValue]) => (
            <label key={label as string} className="block text-sm font-semibold text-gray-700">
              {label as string}
              <select
                value={value as string}
                onChange={(event) => (setValue as (nextValue: SellerCallSignalStrength) => void)(event.target.value as SellerCallSignalStrength)}
                className="mt-1 w-full rounded border px-3 py-2"
              >
                {sellerCallSignalStrengths.map((signal) => (
                  <option key={signal} value={signal}>
                    {formatLabel(signal)}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <label className="block text-sm font-semibold text-gray-700">
          Safe manual next review
          <select
            value={manualNextStep}
            onChange={(event) => setManualNextStep(event.target.value as SellerCallManualNextStep)}
            className="mt-1 w-full rounded border px-3 py-2"
          >
            {sellerCallManualNextSteps.map((step) => (
              <option key={step} value={step}>
                {formatLabel(step)}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold text-gray-700">
          Internal operator summary
          <textarea
            value={operatorSummary}
            onChange={(event) => setOperatorSummary(event.target.value)}
            rows={4}
            maxLength={700}
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder="Short internal summary from the completed manual call. Do not enter send, call, schedule, approval, DNC override, provider, credential, or contract instructions."
            required
          />
          <span className="mt-1 block text-xs font-medium text-gray-500">
            Required. 700 characters max. This text is context only and cannot authorize execution.
          </span>
        </label>

        <div className="rounded border border-red-100 bg-red-50 p-3">
          <p className="text-xs font-bold uppercase text-red-800">Safety flags</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {safetyFlags.map((flag: SellerCallSafetyFlag) => (
              <span key={flag} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-red-800">
                {formatLabel(flag)}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={saveState === "saving"}
            className="rounded border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saveState === "saving" ? "Saving..." : "Save manual outcome"}
          </button>
          <p className="text-xs font-semibold text-gray-500">Save only. No send, schedule, approval, or DNC mutation action exists here.</p>
        </div>

        {error ? <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
        {statusMessage ? <p className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">{statusMessage}</p> : null}
      </form>
    </section>
  );
}
