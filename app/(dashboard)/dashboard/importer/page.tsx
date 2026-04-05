"use client";

import { useEffect, useState } from "react";

import { createImportedLeads, fetchLeads } from "@/lib/leads-api";
import type { StoredLead } from "@/lib/leads-storage";
import { parseLeadImportCsv, type ImportedLeadPreview } from "@/lib/list-importer";

export default function DashboardImporterPage() {
  const [fileName, setFileName] = useState("");
  const [previewLeads, setPreviewLeads] = useState<ImportedLeadPreview[]>([]);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [existingLeads, setExistingLeads] = useState<StoredLead[]>([]);

  useEffect(() => {
    async function loadLeads() {
      const leads = await fetchLeads();
      setExistingLeads(leads);
    }

    void loadLeads();
  }, []);

  const duplicateCount = previewLeads.filter((lead) => lead.duplicate).length;
  const importableLeads = previewLeads.filter((lead) => !lead.duplicate);

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
      const parsedLeads = parseLeadImportCsv(csvText, existingLeads);

      setFileName(file.name);
      setPreviewLeads(parsedLeads);

      if (parsedLeads.length === 0) {
        setFormError("No usable rows were found in that CSV file.");
      }
    } catch {
      setFormError("Unable to read that CSV file. Please try another file.");
      setPreviewLeads([]);
      setFileName("");
    }
  }

  async function handleImportLeads() {
    if (importableLeads.length === 0) {
      setFormError("There are no importable leads in the current preview.");
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

        {fileName ? <p className="mt-3 text-sm text-[#173447]">Loaded file: {fileName}</p> : null}
        {formError ? <p className="mt-3 text-sm text-red-700">{formError}</p> : null}
        {importMessage ? <p className="mt-3 text-sm text-success">{importMessage}</p> : null}
      </section>

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
                      <td className="px-4 py-3">{lead.phone || "—"}</td>
                      <td className="px-4 py-3">{lead.email || "—"}</td>
                      <td className="px-4 py-3">{lead.propertyAddress || "—"}</td>
                      <td className="px-4 py-3">{[lead.city, lead.state].filter(Boolean).join(", ") || "—"}</td>
                      <td className="px-4 py-3">{lead.county || "—"}</td>
                      <td className="px-4 py-3">{lead.parcelId || "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                            lead.duplicate ? "bg-[#f6e8cc] text-[#9a6a1a]" : "bg-[#dcefe3] text-[#2d6a4f]"
                          }`}
                        >
                          {lead.duplicate ? "Duplicate" : "Ready"}
                        </span>
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
                      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                        lead.duplicate ? "bg-[#f6e8cc] text-[#9a6a1a]" : "bg-[#dcefe3] text-[#2d6a4f]"
                      }`}
                    >
                      {lead.duplicate ? "Duplicate" : "Ready"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-[#173447]">
                    <p>
                      <span className="font-semibold">Phone:</span> {lead.phone || "—"}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span> {lead.email || "—"}
                    </p>
                    <p>
                      <span className="font-semibold">Location:</span> {[lead.city, lead.state, lead.zipCode].filter(Boolean).join(" ") || "—"}
                    </p>
                    <p>
                      <span className="font-semibold">County:</span> {lead.county || "—"}
                    </p>
                    <p>
                      <span className="font-semibold">Parcel ID:</span> {lead.parcelId || "—"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

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
