"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, FileUp, MapPinned, Route, ShieldAlert } from "lucide-react";

import {
  parseCountyRecordImportCsv,
  type CountyRecordCsvPreviewRow,
  type PropertyOpportunityWorkbenchReport,
} from "@/lib/property-opportunity-workbench";

type WorkbenchResponse = {
  ok: boolean;
  report?: PropertyOpportunityWorkbenchReport;
  error?: string;
};

function Stat({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <p className="text-xs font-semibold uppercase text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-primary">{value}</p>
      <p className="mt-1 text-sm leading-5 text-muted">{detail}</p>
    </div>
  );
}

function ManualMapBoard({ report }: { report: PropertyOpportunityWorkbenchReport }) {
  const pins = report.mapDiscoveryPins.slice(0, 18);

  return (
    <section className="rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-primary">Map Discovery</h2>
          <p className="text-sm leading-6 text-muted">Manual coordinate board from persisted leads and opportunities.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
          <ShieldAlert aria-hidden className="h-4 w-4" />
          Geocode preview only
        </span>
      </div>

      <div className="mt-4 grid min-h-[320px] grid-cols-1 gap-3 rounded-lg border border-dashed border-border bg-[#f5f8fb] p-3 md:grid-cols-3">
        {pins.length === 0 ? (
          <div className="rounded-lg border border-border bg-white p-4 text-sm text-muted">No property pins available yet.</div>
        ) : (
          pins.map((pin) => (
            <article key={pin.id} className="rounded-lg border border-border bg-white p-3">
              <div className="flex items-start gap-2">
                <MapPinned aria-hidden className="mt-1 h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <h3 className="break-words text-sm font-semibold text-primary">{pin.propertyAddress}</h3>
                  <p className="mt-1 text-xs text-muted">{[pin.county, pin.parcelId].filter(Boolean).join(" / ") || "County/parcel pending"}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded border border-border px-2 py-1 text-primary">Score {pin.opportunityScore}</span>
                <span className="rounded border border-border px-2 py-1 text-primary">{pin.sourceType}</span>
                <span className={`rounded border px-2 py-1 ${pin.geocodeStatus === "manual_coordinates_ready" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
                  {pin.geocodeStatus.replaceAll("_", " ")}
                </span>
              </div>
              {pin.notes.length > 0 ? <p className="mt-3 text-sm leading-5 text-muted">{pin.notes[0]}</p> : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function CsvPreview({ rows, onImportRows, isImporting }: { rows: CountyRecordCsvPreviewRow[]; onImportRows: () => void; isImporting: boolean }) {
  const readyRows = rows.filter((row) => row.importReadiness === "ready");

  return (
    <section className="rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-primary">County CSV Preview</h2>
          <p className="text-sm leading-6 text-muted">Rows become internal county evidence imports. Geocoding stays preview-only.</p>
        </div>
        <button
          type="button"
          onClick={onImportRows}
          disabled={readyRows.length === 0 || isImporting}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FileUp aria-hidden className="h-4 w-4" />
          {isImporting ? "Importing" : `Import ${readyRows.length}`}
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {rows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-white p-4 text-sm text-muted">No CSV preview loaded.</div>
        ) : (
          rows.slice(0, 12).map((row) => (
            <article key={`${row.rowNumber}-${row.propertyAddress}`} className="rounded-lg border border-border bg-white p-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted">Row {row.rowNumber}</p>
                  <h3 className="mt-1 text-sm font-semibold text-primary">{row.propertyAddress || "Missing address"}</h3>
                  <p className="mt-1 text-xs text-muted">{[row.ownerName, row.county, row.parcelId].filter(Boolean).join(" / ") || "Owner/county/parcel pending"}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.importReadiness === "ready" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
                  {row.importReadiness.replaceAll("_", " ")}
                </span>
              </div>
              <p className="mt-2 text-xs font-semibold text-amber-900">{row.geocodePreviewStatus.replaceAll("_", " ")}</p>
              {row.validationErrors.length > 0 ? <p className="mt-2 text-sm text-red-700">{row.validationErrors.join(", ")}</p> : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export function PropertyOpportunityWorkbenchClient() {
  const [report, setReport] = useState<PropertyOpportunityWorkbenchReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [csvRows, setCsvRows] = useState<CountyRecordCsvPreviewRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);

  async function loadWorkbench() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/company/property-opportunities/workbench", { cache: "no-store" });
      const payload = (await response.json()) as WorkbenchResponse;
      if (!response.ok || !payload.ok || !payload.report) throw new Error(payload.error ?? "Unable to load workbench.");
      setReport(payload.report);
    } catch {
      setError("Unable to load the Property Opportunity Workbench.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadWorkbench();
  }, []);

  const readyCsvRows = useMemo(() => csvRows.filter((row) => row.importReadiness === "ready"), [csvRows]);

  async function handleCsvFile(file: File | null) {
    setMessage(null);
    if (!file) {
      setCsvRows([]);
      return;
    }

    try {
      const text = await file.text();
      const rows = parseCountyRecordImportCsv(text);
      setCsvRows(rows);
      setMessage(rows.length > 0 ? `Previewed ${rows.length} county row(s).` : "No usable county rows found.");
    } catch {
      setCsvRows([]);
      setError("Unable to parse that CSV file.");
    }
  }

  async function importRows() {
    setIsImporting(true);
    setError(null);

    try {
      for (const row of readyCsvRows) {
        const response = await fetch("/api/company/property-opportunities/workbench", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(row),
        });
        if (!response.ok) throw new Error("Import failed");
      }
      setMessage(`Imported ${readyCsvRows.length} county evidence row(s).`);
      setCsvRows([]);
      await loadWorkbench();
    } catch {
      setError("Unable to import county evidence rows.");
    } finally {
      setIsImporting(false);
    }
  }

  if (isLoading) {
    return <div className="rounded-lg border border-border bg-surface p-6 text-sm text-muted">Loading Property Opportunity Workbench...</div>;
  }

  if (!report) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">{error ?? "Workbench unavailable."}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Real Leads" value={report.totals.realLeads} detail="Authenticated persisted leads loaded." />
        <Stat label="Map Pins" value={report.totals.mapPins} detail="Manual discovery pins." />
        <Stat label="DFD Routes" value={report.totals.dfdRoutes} detail="Manual route groups." />
        <Stat label="Review Candidates" value={report.totals.acquisitionReviewCandidates} detail="Approval-required acquisition reviews." />
      </div>

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">{error}</div> : null}
      {message ? <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">{message}</div> : null}

      <ManualMapBoard report={report} />

      <section className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-start gap-3">
          <Route aria-hidden className="mt-1 h-5 w-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-primary">DFD Route Tracking</h2>
            <p className="text-sm leading-6 text-muted">Manual route records only. GPS tracking and surveillance remain disabled.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {report.dfdRouteTracking.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-white p-4 text-sm text-muted">No manual DFD route evidence yet.</div>
          ) : (
            report.dfdRouteTracking.map((route) => (
              <article key={route.routeId} className="rounded-lg border border-border bg-white p-3">
                <h3 className="font-semibold text-primary">{route.routeName}</h3>
                <p className="mt-1 text-sm text-muted">{route.stopCount} stop(s), {route.observedStops} observed, {route.photoStops} with photos.</p>
                <p className="mt-2 text-xs font-semibold text-primary">{route.status.replaceAll("_", " ")}</p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle aria-hidden className="mt-1 h-5 w-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-primary">Provider Decision Gate</h2>
            <p className="text-sm leading-6 text-muted">Maps, property data, skip trace, and direct mail stay blocked unless separately approved.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {report.providerDecisionGate.map((item) => (
            <div key={item.source} className="rounded-lg border border-border bg-white p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-primary">{item.source.replaceAll("_", " ")}</p>
                {item.allowedNow ? <CheckCircle2 aria-hidden className="h-4 w-4 text-emerald-700" /> : <ShieldAlert aria-hidden className="h-4 w-4 text-amber-700" />}
              </div>
              <p className="mt-1 text-xs font-semibold uppercase text-muted">{item.decision.replaceAll("_", " ")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-primary">County CSV file</span>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => void handleCsvFile(event.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
          />
        </label>
      </section>

      <CsvPreview rows={csvRows} onImportRows={importRows} isImporting={isImporting} />
    </div>
  );
}
