"use client";

import { useEffect, useState } from "react";

import { reviewAcquisitionIntake, type AcquisitionIntakeReview } from "@/lib/acquisition-intake-review";
import { createImportedLeads, fetchLeads } from "@/lib/leads-api";
import { formatLeadSourceTag, LEAD_SOURCE_TAGS, type LeadSourceTag } from "@/lib/lead-source";
import type { StoredLead } from "@/lib/leads-storage";
import { hasRequiredImportedLeadFields, parseLeadImportCsv, type ImportedLeadPreview } from "@/lib/list-importer";

function getImportLeadStatus(lead: ImportedLeadPreview) {
  if (lead.validationErrors.length > 0) {
    return "Invalid";
  }

  return lead.duplicate ? "Duplicate" : "Ready";
}

function getImportLeadStatusClass(lead: ImportedLeadPreview) {
  if (lead.validationErrors.length > 0) {
    return "bg-[#f8d7da] text-[#9f1d2f]";
  }

  return lead.duplicate ? "bg-[#f6e8cc] text-[#9a6a1a]" : "bg-[#dcefe3] text-[#2d6a4f]";
}

function getReadinessClass(value: AcquisitionIntakeReview["acquisitionReadiness"]) {
  if (value === "ready_for_manual_import_review") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (value === "needs_duplicate_review") return "border-amber-200 bg-amber-50 text-amber-900";
  if (value === "needs_cleanup") return "border-orange-200 bg-orange-50 text-orange-900";
  return "border-slate-200 bg-slate-50 text-slate-800";
}

function AcquisitionIntakeReviewPanel({ review }: { review: AcquisitionIntakeReview }) {
  return (
    <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Acquisition intake review</p>
          <h2 className="text-2xl font-semibold text-primary">Import readiness</h2>
          <p className="max-w-3xl text-sm leading-6 text-muted">
            Source-labeled review of the current preview. Imported and public-list records require manual review before outreach or seller workflow.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-800">Read only</span>
          <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-red-800">No outreach</span>
        </div>
      </div>

      <div className={`mt-5 rounded-2xl border p-4 text-sm leading-6 ${getReadinessClass(review.acquisitionReadiness)}`}>
        <p className="font-bold">{review.readinessLabel}</p>
        <p className="mt-1">{review.readinessDetail}</p>
        <p className="mt-1 font-semibold">{review.safeNextManualReview}</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Ready</p>
          <p className="mt-1 text-2xl font-semibold text-primary">{review.readyRows}</p>
          <p className="mt-1 text-sm text-muted">Confidence: {review.importConfidence}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Duplicates</p>
          <p className="mt-1 text-2xl font-semibold text-primary">{review.duplicateRows}</p>
          <p className="mt-1 text-sm text-muted">Manual duplicate review</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Invalid</p>
          <p className="mt-1 text-2xl font-semibold text-primary">{review.invalidRows}</p>
          <p className="mt-1 text-sm text-muted">Fix before import</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Source</p>
          <p className="mt-1 text-2xl font-semibold text-primary">{review.missingSourceRows}</p>
          <p className="mt-1 text-sm text-muted">Fallback or missing</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Contact</p>
          <p className="mt-1 text-2xl font-semibold text-primary">{review.missingContactRows}</p>
          <p className="mt-1 text-sm text-muted">Needs seller data</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Address</p>
          <p className="mt-1 text-2xl font-semibold text-primary">{review.missingAddressRows}</p>
          <p className="mt-1 text-sm text-muted">Needs property data</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="font-semibold text-primary">Source mix</p>
          {review.sourceMix.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {review.sourceMix.map((item) => (
                <span key={item.source} className="rounded border border-blue-100 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-900">
                  {item.label}: {item.count}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-muted">No source mix visible until a CSV preview is loaded.</p>
          )}
          <p className="mt-3 leading-6 text-muted">{review.sourceClarity}</p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="font-semibold text-primary">Cleanup needs</p>
          {review.cleanupNeeds.length > 0 ? (
            <ul className="mt-2 space-y-1 leading-6 text-muted">
              {review.cleanupNeeds.slice(0, 5).map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 leading-6 text-muted">No cleanup needs are visible from the current preview.</p>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase leading-5 tracking-[0.1em] text-muted">
        providerCalled:false scrapingTriggered:false outreachCreated:false autonomousCrmMutationAllowed:false storageAuthorizedByReview:false
      </p>
    </section>
  );
}

export default function DashboardImporterPage() {
  const [fileName, setFileName] = useState("");
  const [previewLeads, setPreviewLeads] = useState<ImportedLeadPreview[]>([]);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [existingLeads, setExistingLeads] = useState<StoredLead[]>([]);
  const [defaultSource, setDefaultSource] = useState<LeadSourceTag>("manual_import");

  useEffect(() => {
    async function loadLeads() {
      const leads = await fetchLeads();
      setExistingLeads(leads);
    }

    void loadLeads();
  }, []);

  const duplicateCount = previewLeads.filter((lead) => lead.duplicate).length;
  const invalidCount = previewLeads.filter((lead) => lead.validationErrors.length > 0).length;
  const acquisitionIntakeReview = reviewAcquisitionIntake(previewLeads);
  const importableLeads = previewLeads.filter((lead) => {
    const requiredFields = hasRequiredImportedLeadFields(lead);

    return !lead.duplicate && lead.validationErrors.length === 0 && requiredFields.phone && requiredFields.propertyAddress;
  });

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setImportMessage(null);
    setFormError(null);

    if (!file) {
      setFileName("");
      setPreviewLeads([]);
      return;
    }

    try {
      const csvText = await file.text();
      const parsedLeads = parseLeadImportCsv(csvText, existingLeads).map((lead) => ({
        ...lead,
        source: lead.source === "manual_import" ? defaultSource : lead.source
      }));

      setFileName(file.name);
      setPreviewLeads(parsedLeads);

      if (parsedLeads.length === 0) {
        setFormError("No usable rows were found in that CSV file.");
      } else if (parsedLeads.some((lead) => lead.validationErrors.length > 0)) {
        setFormError("Some rows are missing a property address or phone. Fix those rows before importing them.");
      }
    } catch {
      setFormError("Unable to read that CSV file. Please try another file.");
      setPreviewLeads([]);
      setFileName("");
    }
  }

  async function handleImportLeads() {
    if (importableLeads.length === 0) {
      setFormError("There are no valid importable leads in the current preview.");
      return;
    }

    setIsImporting(true);
    setFormError(null);

    try {
      const result = await createImportedLeads(importableLeads);

      setExistingLeads(result.leads);
      setImportMessage(`Imported ${result.addedCount} leads. Skipped ${result.skippedCount + duplicateCount} duplicate leads.`);
      setPreviewLeads([]);
      setFileName("");
    } catch {
      setFormError("Unable to import leads right now. Please try again.");
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-primary">List Importer</h1>
        <p className="max-w-3xl text-sm leading-6 text-muted md:text-base">
          Upload a county or public-list CSV, preview the records, and import them into the current local lead system.
        </p>
      </div>

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-primary">Upload CSV</h2>
          <p className="text-sm leading-6 text-muted">
            Supported columns include names, contact info, address fields, county details, parcel ID, and situation notes.
          </p>
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-medium text-primary">CSV file</span>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground"
          />
        </label>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-medium text-primary">Default source for rows without a source column</span>
          <select
            value={defaultSource}
            onChange={(event) => setDefaultSource(event.target.value as LeadSourceTag)}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground"
          >
            {LEAD_SOURCE_TAGS.map((source) => (
              <option key={source} value={source}>
                {formatLeadSourceTag(source)}
              </option>
            ))}
          </select>
        </label>

        {fileName ? <p className="mt-3 text-sm text-[#173447]">Loaded file: {fileName}</p> : null}
        {formError ? <p className="mt-3 text-sm text-red-700">{formError}</p> : null}
        {importMessage ? <p className="mt-3 text-sm text-success">{importMessage}</p> : null}
      </section>

      <AcquisitionIntakeReviewPanel review={acquisitionIntakeReview} />

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-primary">Preview</h2>
            <p className="text-sm leading-6 text-muted">
              Review parsed records before importing. Duplicate detection checks `propertyAddress + phone`.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
            <span className="rounded-full bg-[#e7eef5] px-3 py-1 text-[#355066]">Rows: {previewLeads.length}</span>
            <span className="rounded-full bg-[#dcefe3] px-3 py-1 text-[#2d6a4f]">Importing: {importableLeads.length}</span>
            <span className="rounded-full bg-[#f6e8cc] px-3 py-1 text-[#9a6a1a]">Duplicates: {duplicateCount}</span>
            <span className="rounded-full bg-[#f8d7da] px-3 py-1 text-[#9f1d2f]">Invalid: {invalidCount}</span>
          </div>
        </div>

        {previewLeads.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-border bg-white px-4 py-5 text-sm leading-6 text-muted">
            No CSV preview yet. Upload a file to review importable records.
          </div>
        ) : (
          <>
            <div className="mt-5 hidden overflow-x-auto md:block">
              <table className="min-w-full border-collapse overflow-hidden rounded-2xl border border-border bg-white">
                <thead>
                  <tr className="border-b border-border bg-[#f7f3ea] text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#4f6376]">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Property Address</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">City / State</th>
                    <th className="px-4 py-3">County</th>
                    <th className="px-4 py-3">Parcel ID</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {previewLeads.map((lead, index) => (
                    <tr key={`${lead.propertyAddress}-${lead.phone}-${index}`} className="border-b border-border/70 text-sm text-[#173447] last:border-b-0">
                      <td className="px-4 py-3 font-semibold">
                        {`${lead.firstName} ${lead.lastName}`.trim() || lead.ownerName || "Unknown owner"}
                      </td>
                      <td className="px-4 py-3">{lead.phone || "--"}</td>
                      <td className="px-4 py-3">{lead.email || "--"}</td>
                      <td className="px-4 py-3">{lead.propertyAddress || "--"}</td>
                      <td className="px-4 py-3">{formatLeadSourceTag(lead.source)}</td>
                      <td className="px-4 py-3">{[lead.city, lead.state].filter(Boolean).join(", ") || "--"}</td>
                      <td className="px-4 py-3">{lead.county || "--"}</td>
                      <td className="px-4 py-3">{lead.parcelId || "--"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getImportLeadStatusClass(
                            lead
                          )}`}
                        >
                          {getImportLeadStatus(lead)}
                        </span>
                        {lead.validationErrors.length > 0 ? (
                          <ul className="mt-2 space-y-1 text-xs leading-5 text-red-700">
                            {lead.validationErrors.map((error) => (
                              <li key={error}>{error}</li>
                            ))}
                          </ul>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 space-y-4 md:hidden">
              {previewLeads.map((lead, index) => (
                <article key={`${lead.propertyAddress}-${lead.phone}-${index}`} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-primary">
                        {`${lead.firstName} ${lead.lastName}`.trim() || lead.ownerName || "Unknown owner"}
                      </h3>
                      <p className="mt-1 text-sm text-muted">{lead.propertyAddress || "No property address provided"}</p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getImportLeadStatusClass(
                        lead
                      )}`}
                    >
                      {getImportLeadStatus(lead)}
                    </span>
                  </div>
                  {lead.validationErrors.length > 0 ? (
                    <ul className="mt-3 space-y-1 text-xs leading-5 text-red-700">
                      {lead.validationErrors.map((error) => (
                        <li key={error}>{error}</li>
                      ))}
                    </ul>
                  ) : null}

                  <div className="mt-4 space-y-2 text-sm text-[#173447]">
                    <p>
                      <span className="font-semibold">Phone:</span> {lead.phone || "--"}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span> {lead.email || "--"}
                    </p>
                    <p>
                      <span className="font-semibold">Source:</span> {formatLeadSourceTag(lead.source)}
                    </p>
                    <p>
                      <span className="font-semibold">Location:</span> {[lead.city, lead.state, lead.zipCode].filter(Boolean).join(" ") || "--"}
                    </p>
                    <p>
                      <span className="font-semibold">County:</span> {lead.county || "--"}
                    </p>
                    <p>
                      <span className="font-semibold">Parcel ID:</span> {lead.parcelId || "--"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        <p className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-950">
          Import is a user-triggered CRM intake action only. It does not send outreach, call sellers, start automation, create queues, or approve follow-up.
        </p>

        <button
          type="button"
          onClick={handleImportLeads}
          disabled={isImporting || importableLeads.length === 0}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#d89a42] px-5 py-2.5 text-sm font-bold text-[#102437] shadow-[0_10px_25px_rgba(216,154,66,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#e5a64f] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isImporting ? "Importing..." : `Import Leads (${importableLeads.length})`}
        </button>
      </section>
    </div>
  );
}
