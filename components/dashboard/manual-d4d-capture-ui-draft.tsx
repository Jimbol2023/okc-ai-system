"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { AlertTriangle, ClipboardCheck, Lock, ShieldCheck } from "lucide-react";

const sourceLabel = "manual D4D draft";
const nextStage = "A3.8 Manual D4D Capture Persistence And Lead Creation Gate";

const distressTagOptions = [
  "vacancy signal",
  "deferred maintenance",
  "overgrown yard",
  "boarded opening",
  "visible exterior concern",
] as const;

const reviewStatusOptions = [
  "needs manual review",
  "needs address cleanup",
  "needs duplicate review",
  "needs owner research",
] as const;

const safetyBadges = [
  { label: "Draft only", Icon: ShieldCheck },
  { label: "No record creation", Icon: Lock },
  { label: "Manual review", Icon: ClipboardCheck },
  { label: "No maps or GPS", Icon: AlertTriangle },
] as const;

type DraftState = {
  propertyAddress: string;
  city: string;
  state: string;
  zip: string;
  observationDate: string;
  fieldNote: string;
  distressTags: string[];
  operatorNote: string;
  reviewStatus: string;
  provenanceNote: string;
};

const initialDraft: DraftState = {
  propertyAddress: "",
  city: "",
  state: "",
  zip: "",
  observationDate: "",
  fieldNote: "",
  distressTags: [],
  operatorNote: "",
  reviewStatus: reviewStatusOptions[0],
  provenanceNote: "",
};

function isBlank(value: string) {
  return value.trim().length === 0;
}

function FieldGuidance({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="mt-1 text-xs leading-5 text-muted">
      {message}
    </p>
  );
}

function FieldShell({
  children,
  label,
  htmlFor,
  guidanceId,
  guidance,
  required,
}: {
  children: ReactNode;
  label: string;
  htmlFor: string;
  guidanceId: string;
  guidance: string;
  required?: boolean;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-primary">
        {label}
        {required ? <span className="ml-1 text-xs font-bold text-red-700">(required for review)</span> : null}
      </label>
      {children}
      <FieldGuidance id={guidanceId} message={guidance} />
    </div>
  );
}

function getRequiredReviewMessages(draft: DraftState) {
  return [
    isBlank(draft.propertyAddress) ? "Property address is required for review." : "",
    isBlank(draft.city) ? "City is required for review." : "",
    isBlank(draft.state) ? "State is required as a two-letter abbreviation." : "",
    isBlank(draft.zip) ? "ZIP is required as a 5-digit ZIP." : "",
    isBlank(draft.observationDate) ? "Observation date is required for review." : "",
    isBlank(draft.fieldNote) ? "Field note is required for review." : "",
    isBlank(draft.provenanceNote) ? "Provenance note is required for review." : "",
    isBlank(draft.reviewStatus) ? "Review status is required for review." : "",
  ].filter(Boolean);
}

export function ManualD4dCaptureUiDraft() {
  const [draft, setDraft] = useState<DraftState>(initialDraft);

  const requiredReviewMessages = useMemo(() => getRequiredReviewMessages(draft), [draft]);
  const selectedDistressSummary =
    draft.distressTags.length > 0 ? draft.distressTags.join(", ") : "No optional distress tags selected.";
  const isPropertyAddressInvalid = isBlank(draft.propertyAddress);
  const isCityInvalid = isBlank(draft.city);
  const isStateInvalid = isBlank(draft.state);
  const isZipInvalid = isBlank(draft.zip);
  const isObservationDateInvalid = isBlank(draft.observationDate);
  const isFieldNoteInvalid = isBlank(draft.fieldNote);
  const isReviewStatusInvalid = isBlank(draft.reviewStatus);
  const isProvenanceNoteInvalid = isBlank(draft.provenanceNote);

  function updateField(field: keyof Omit<DraftState, "distressTags">, value: string) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleDistressTag(tag: string) {
    setDraft((current) => {
      const selected = current.distressTags.includes(tag);
      return {
        ...current,
        distressTags: selected
          ? current.distressTags.filter((item) => item !== tag)
          : [...current.distressTags, tag],
      };
    });
  }

  return (
    <section
      aria-labelledby="manual-d4d-draft-heading"
      className="overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">A3.6 UI draft</p>
          <h2 id="manual-d4d-draft-heading" className="break-words text-2xl font-semibold text-primary">
            Manual D4D property review draft
          </h2>
          <p className="max-w-3xl break-words text-sm leading-6 text-muted">
            Draft only. This surface helps an operator shape manual property observations for review. It does not
            create records, write storage, use maps or GPS, trigger outreach, or change CRM data.
          </p>
        </div>
        <div className="grid gap-2 text-xs font-bold uppercase tracking-[0.1em] sm:grid-cols-2 lg:min-w-80">
          {safetyBadges.map(({ label, Icon }) => (
            <span
              key={label}
              className="inline-flex min-w-0 items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-primary"
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="break-words">{label}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.78fr)]">
        <div className="grid gap-4 rounded-xl border border-border bg-white p-4 sm:grid-cols-2">
          <FieldShell
            label="Property address"
            htmlFor="manual-d4d-property-address"
            guidanceId="manual-d4d-property-address-guidance"
            guidance={isPropertyAddressInvalid ? "Required for review." : "Typed locally for this draft only."}
            required
          >
            <input
              id="manual-d4d-property-address"
              value={draft.propertyAddress}
              onChange={(event) => updateField("propertyAddress", event.target.value)}
              aria-invalid={isPropertyAddressInvalid}
              aria-describedby="manual-d4d-property-address-guidance"
              className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-primary outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </FieldShell>

          <FieldShell
            label="City"
            htmlFor="manual-d4d-city"
            guidanceId="manual-d4d-city-guidance"
            guidance={isCityInvalid ? "Required for review." : "Typed locally for this draft only."}
            required
          >
            <input
              id="manual-d4d-city"
              value={draft.city}
              onChange={(event) => updateField("city", event.target.value)}
              aria-invalid={isCityInvalid}
              aria-describedby="manual-d4d-city-guidance"
              className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-primary outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </FieldShell>

          <FieldShell
            label="State"
            htmlFor="manual-d4d-state"
            guidanceId="manual-d4d-state-guidance"
            guidance="Use a two-letter abbreviation. This draft does not run schema validation."
            required
          >
            <input
              id="manual-d4d-state"
              value={draft.state}
              onChange={(event) => updateField("state", event.target.value.toUpperCase().slice(0, 2))}
              aria-invalid={isStateInvalid}
              aria-describedby="manual-d4d-state-guidance"
              className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-primary outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </FieldShell>

          <FieldShell
            label="ZIP"
            htmlFor="manual-d4d-zip"
            guidanceId="manual-d4d-zip-guidance"
            guidance="Use a 5-digit ZIP. This guidance is display-only."
            required
          >
            <input
              id="manual-d4d-zip"
              inputMode="numeric"
              value={draft.zip}
              onChange={(event) => updateField("zip", event.target.value.replace(/\D/g, "").slice(0, 5))}
              aria-invalid={isZipInvalid}
              aria-describedby="manual-d4d-zip-guidance"
              className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-primary outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </FieldShell>

          <FieldShell
            label="Source"
            htmlFor="manual-d4d-source"
            guidanceId="manual-d4d-source-guidance"
            guidance="Source stays visible and fixed for this draft."
            required
          >
            <input
              id="manual-d4d-source"
              value={sourceLabel}
              readOnly
              aria-describedby="manual-d4d-source-guidance"
              className="mt-2 w-full rounded-lg border border-border bg-[#f8fafc] px-3 py-2 text-sm font-semibold text-primary"
            />
          </FieldShell>

          <FieldShell
            label="Observation date"
            htmlFor="manual-d4d-observation-date"
            guidanceId="manual-d4d-observation-date-guidance"
            guidance={isObservationDateInvalid ? "Required for review." : "Typed locally for this draft only."}
            required
          >
            <input
              id="manual-d4d-observation-date"
              type="date"
              value={draft.observationDate}
              onChange={(event) => updateField("observationDate", event.target.value)}
              aria-invalid={isObservationDateInvalid}
              aria-describedby="manual-d4d-observation-date-guidance"
              className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-primary outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </FieldShell>

          <div className="sm:col-span-2">
            <FieldShell
              label="Field note"
              htmlFor="manual-d4d-field-note"
              guidanceId="manual-d4d-field-note-guidance"
              guidance={isFieldNoteInvalid ? "Required for review. Do not invent property facts." : "Human-entered observation only."}
              required
            >
              <textarea
                id="manual-d4d-field-note"
                value={draft.fieldNote}
                onChange={(event) => updateField("fieldNote", event.target.value)}
                aria-invalid={isFieldNoteInvalid}
                aria-describedby="manual-d4d-field-note-guidance"
                rows={4}
                className="mt-2 w-full resize-y rounded-lg border border-border bg-white px-3 py-2 text-sm text-primary outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </FieldShell>
          </div>

          <fieldset className="sm:col-span-2">
            <legend className="text-sm font-semibold text-primary">Optional distress tags</legend>
            <p className="mt-1 text-xs leading-5 text-muted">
              Tags require human verification and do not infer owner intent, value, condition, or acquisition readiness.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {distressTagOptions.map((tag) => (
                <label
                  key={tag}
                  className="flex min-w-0 items-start gap-3 rounded-lg border border-border bg-[#f8fafc] px-3 py-2 text-sm text-primary"
                >
                  <input
                    type="checkbox"
                    checked={draft.distressTags.includes(tag)}
                    onChange={() => toggleDistressTag(tag)}
                    className="mt-1 h-4 w-4 shrink-0"
                  />
                  <span className="break-words">{tag}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="sm:col-span-2">
            <FieldShell
              label="Operator note"
              htmlFor="manual-d4d-operator-note"
              guidanceId="manual-d4d-operator-note-guidance"
              guidance="Optional bounded note for manual review context."
            >
              <textarea
                id="manual-d4d-operator-note"
                value={draft.operatorNote}
                onChange={(event) => updateField("operatorNote", event.target.value.slice(0, 500))}
                aria-describedby="manual-d4d-operator-note-guidance"
                rows={3}
                className="mt-2 w-full resize-y rounded-lg border border-border bg-white px-3 py-2 text-sm text-primary outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </FieldShell>
          </div>

          <FieldShell
            label="Review status"
            htmlFor="manual-d4d-review-status"
            guidanceId="manual-d4d-review-status-guidance"
            guidance="Review status is a label only and does not approve action."
            required
          >
            <select
              id="manual-d4d-review-status"
              value={draft.reviewStatus}
              onChange={(event) => updateField("reviewStatus", event.target.value)}
              aria-invalid={isReviewStatusInvalid}
              aria-describedby="manual-d4d-review-status-guidance"
              className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-primary outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {reviewStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </FieldShell>

          <FieldShell
            label="Provenance note"
            htmlFor="manual-d4d-provenance-note"
            guidanceId="manual-d4d-provenance-note-guidance"
            guidance={isProvenanceNoteInvalid ? "Required for review." : "Human-entered source context only."}
            required
          >
            <input
              id="manual-d4d-provenance-note"
              value={draft.provenanceNote}
              onChange={(event) => updateField("provenanceNote", event.target.value)}
              aria-invalid={isProvenanceNoteInvalid}
              aria-describedby="manual-d4d-provenance-note-guidance"
              className="mt-2 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-primary outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </FieldShell>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4" aria-live="polite">
            <h3 className="text-sm font-semibold text-blue-950">Draft review preview</h3>
            <dl className="mt-3 space-y-2 text-sm leading-6 text-blue-950">
              <div>
                <dt className="font-semibold">Property</dt>
                <dd className="break-words">
                  {[draft.propertyAddress, draft.city, draft.state, draft.zip].filter(Boolean).join(", ") ||
                    "Address details not entered."}
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Source</dt>
                <dd>{sourceLabel}</dd>
              </div>
              <div>
                <dt className="font-semibold">Review status</dt>
                <dd className="break-words">{draft.reviewStatus}</dd>
              </div>
              <div>
                <dt className="font-semibold">Distress tag review</dt>
                <dd className="break-words">{selectedDistressSummary}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            <h3 className="font-semibold">Manual blockers stay visible</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Property-first review remains required.</li>
              <li>Duplicate property review remains required.</li>
              <li>Missing owner or seller details remain review blockers.</li>
              <li>Distress tags need human verification.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-white p-4" aria-live="polite">
            <h3 className="text-sm font-semibold text-primary">Required for review</h3>
            {requiredReviewMessages.length > 0 ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">
                {requiredReviewMessages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm leading-6 text-muted">
                Draft fields look review-shaped, but this still does not create records or authorize action.
              </p>
            )}
          </div>

          <button
            type="button"
            disabled
            aria-describedby="manual-d4d-draft-locked-guidance"
            className="w-full cursor-not-allowed rounded-lg border border-border bg-[#f1f5f9] px-4 py-3 text-sm font-bold text-muted"
          >
            Draft locked
          </button>

          <p id="manual-d4d-draft-locked-guidance" className="text-xs leading-5 text-muted">
            Next stage: {nextStage}. This draft is local screen state only and must pass a separate future gate before
            any later capability is considered.
          </p>
        </aside>
      </div>
    </section>
  );
}
