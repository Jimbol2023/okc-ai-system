"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardList, FileUp, Home, MapPinned, ShieldAlert, Users } from "lucide-react";

import { fetchLeads } from "@/lib/leads-api";
import {
  createDashboardPropertyRecords,
  isSocialOrInboundProperty,
  type DashboardPropertyRecord,
  type PropertyContactReadiness,
  type PropertyRecordSignal,
  type PropertyReviewLane,
} from "@/lib/property-records";
import type { StoredLead } from "@/lib/leads-storage";

type PropertyFilter =
  | "all"
  | "property_only"
  | "source_cleanup"
  | "probate"
  | "d4d"
  | "tax_county"
  | "out_of_state"
  | "social";

const PROPERTY_FILTERS: Array<{ value: PropertyFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "property_only", label: "Property Only" },
  { value: "source_cleanup", label: "Source Cleanup" },
  { value: "probate", label: "Probate / Inherited" },
  { value: "d4d", label: "D4D" },
  { value: "tax_county", label: "Tax / County" },
  { value: "out_of_state", label: "Out-of-State" },
  { value: "social", label: "Social / Inbound" },
];

const SIGNAL_LABELS: Record<PropertyRecordSignal, string> = {
  out_of_state_owner_signal: "Out-of-state signal",
  probate_or_inherited_signal: "Probate/inherited signal",
  driving_for_dollars_observation: "D4D observation",
  tax_or_county_list_signal: "Tax/county signal",
  vacant_property_signal: "Vacant signal",
  social_or_inbound_source: "Social/inbound",
};

const READINESS_LABELS: Record<PropertyContactReadiness, string> = {
  contact_ready: "Contact ready",
  property_only_review: "Property-only review",
  blocked_dnc: "Blocked / DNC",
};

const REVIEW_LANE_LABELS: Record<PropertyReviewLane, string> = {
  source_cleanup: "Verify source",
  owner_cleanup: "Owner cleanup",
  contact_cleanup: "Contact cleanup",
  property_review: "Human review",
  lead_ready: "Lead ready",
};

function matchesFilter(record: DashboardPropertyRecord, filter: PropertyFilter) {
  if (filter === "property_only") return record.contactReadiness === "property_only_review";
  if (filter === "source_cleanup") return record.reviewLane === "source_cleanup";
  if (filter === "probate") return record.signals.includes("probate_or_inherited_signal");
  if (filter === "d4d") return record.signals.includes("driving_for_dollars_observation");
  if (filter === "tax_county") return record.signals.includes("tax_or_county_list_signal");
  if (filter === "out_of_state") return record.signals.includes("out_of_state_owner_signal");
  if (filter === "social") return isSocialOrInboundProperty(record);

  return true;
}

function getReadinessClass(readiness: PropertyContactReadiness) {
  if (readiness === "contact_ready") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (readiness === "blocked_dnc") return "border-red-200 bg-red-50 text-red-800";
  return "border-amber-200 bg-amber-50 text-amber-800";
}

function getLaneClass(lane: PropertyReviewLane) {
  if (lane === "lead_ready") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (lane === "source_cleanup") return "border-orange-200 bg-orange-50 text-orange-800";
  if (lane === "property_review") return "border-blue-200 bg-blue-50 text-blue-800";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: number;
  detail: string;
  icon: typeof Home;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-[0_12px_28px_rgba(17,37,52,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-primary">{value}</p>
        </div>
        <span className="rounded-xl border border-blue-100 bg-blue-50 p-2 text-primary">
          <Icon aria-hidden className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 text-sm leading-5 text-muted">{detail}</p>
    </div>
  );
}

function SignalPills({ signals }: { signals: PropertyRecordSignal[] }) {
  if (signals.length === 0) {
    return <span className="text-sm text-muted">No source signal captured.</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {signals.map((signal) => (
        <span key={signal} className="rounded-full border border-blue-100 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-900">
          {SIGNAL_LABELS[signal]}
        </span>
      ))}
    </div>
  );
}

function PropertyRecordCard({ record }: { record: DashboardPropertyRecord }) {
  const location = [record.city, record.state, record.zipCode].filter(Boolean).join(", ");

  return (
    <article className="rounded-2xl border border-border bg-surface p-4 shadow-[0_12px_28px_rgba(17,37,52,0.05)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{record.sourceLabel}</p>
          <h2 className="mt-1 break-words text-lg font-semibold text-primary">{record.propertyAddress}</h2>
          {location ? <p className="mt-1 text-sm text-muted">{location}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getReadinessClass(record.contactReadiness)}`}>
            {READINESS_LABELS[record.contactReadiness]}
          </span>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getLaneClass(record.reviewLane)}`}>
            {REVIEW_LANE_LABELS[record.reviewLane]}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="font-semibold text-primary">Owner</p>
          <p className="mt-1 text-muted">{record.ownerName || "Needs owner cleanup"}</p>
        </div>
        <div>
          <p className="font-semibold text-primary">Mailing Address</p>
          <p className="mt-1 text-muted">{record.mailingAddress || "Not captured"}</p>
        </div>
        <div>
          <p className="font-semibold text-primary">County / Parcel</p>
          <p className="mt-1 text-muted">{[record.county, record.parcelId].filter(Boolean).join(" / ") || "Not captured"}</p>
        </div>
        <div>
          <p className="font-semibold text-primary">Lead Status</p>
          <p className="mt-1 capitalize text-muted">{record.status.replaceAll("_", " ")}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Review signals</p>
        <SignalPills signals={record.signals} />
      </div>

      {record.missingFields.length > 0 ? (
        <p className="mt-4 text-sm font-semibold text-orange-800">Needs verification: {record.missingFields.join(", ")}</p>
      ) : (
        <p className="mt-4 text-sm font-semibold text-emerald-800">Required property/source basics are captured.</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link
          href={`/dashboard/leads/${record.leadId}`}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#12324e]"
        >
          Open Lead
        </Link>
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Read-only property view</span>
      </div>
    </article>
  );
}

export default function DashboardPropertiesPage() {
  const [leads, setLeads] = useState<StoredLead[]>([]);
  const [filter, setFilter] = useState<PropertyFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLeads() {
      try {
        const nextLeads = await fetchLeads();
        setLeads(nextLeads);
      } catch {
        setError("Unable to load property records from leads right now.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadLeads();
  }, []);

  const propertyRecords = useMemo(() => createDashboardPropertyRecords(leads), [leads]);
  const filteredRecords = useMemo(() => propertyRecords.filter((record) => matchesFilter(record, filter)), [filter, propertyRecords]);
  const stats = useMemo(
    () => ({
      total: propertyRecords.length,
      propertyOnly: propertyRecords.filter((record) => record.contactReadiness === "property_only_review").length,
      outOfState: propertyRecords.filter((record) => record.signals.includes("out_of_state_owner_signal")).length,
      probate: propertyRecords.filter((record) => record.signals.includes("probate_or_inherited_signal")).length,
      d4d: propertyRecords.filter((record) => record.signals.includes("driving_for_dollars_observation")).length,
      social: propertyRecords.filter(isSocialOrInboundProperty).length,
    }),
    [propertyRecords]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Property source review</p>
          <h1 className="text-3xl font-semibold text-primary">Properties</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted md:text-base">
            Review imported property records and source signals from existing leads. Signals require human verification before outreach,
            valuation, or seller workflow decisions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/importer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary"
          >
            <FileUp aria-hidden className="h-4 w-4" />
            Import Lists
          </Link>
          <Link
            href="/dashboard/driving-for-dollars"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary"
          >
            <MapPinned aria-hidden className="h-4 w-4" />
            D4D Review
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Properties" value={stats.total} detail="Lead records with property addresses." icon={Home} />
        <StatCard label="Property Only" value={stats.propertyOnly} detail="Needs contact cleanup before seller workflow." icon={ClipboardList} />
        <StatCard label="Out-of-State" value={stats.outOfState} detail="Source or mailing-address signal." icon={MapPinned} />
        <StatCard label="Probate" value={stats.probate} detail="Probate or inherited-property signal." icon={ShieldAlert} />
        <StatCard label="D4D" value={stats.d4d} detail="Manual driving-for-dollars source." icon={AlertTriangle} />
        <StatCard label="Social" value={stats.social} detail="Social, GBP, or inbound web source." icon={Users} />
      </div>

      <section className="rounded-2xl border border-border bg-surface p-4 shadow-[0_12px_28px_rgba(17,37,52,0.05)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-primary">Review queue</h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              Read-only queue from existing leads. No outreach, scraping, posting, or enrichment is triggered here.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                  filter === item.value
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-white text-primary hover:border-primary"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">{error}</div>
      ) : null}

      {isLoading ? (
        <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">Loading property records...</div>
      ) : null}

      {!isLoading && propertyRecords.length === 0 ? (
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-[0_12px_28px_rgba(17,37,52,0.05)]">
          <div className="flex max-w-3xl flex-col gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-primary">
              <CheckCircle2 aria-hidden className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-primary">No property records yet</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Import a county, probate, tax, Zillow, unlisted-owner, social, or D4D list with property addresses to populate this review workspace.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/dashboard/importer" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                Open Importer
              </Link>
              <Link href="/dashboard/driving-for-dollars" className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-primary">
                Open D4D
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {!isLoading && filteredRecords.length === 0 && propertyRecords.length > 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">No properties match this filter.</div>
      ) : null}

      <div className="grid gap-4">
        {filteredRecords.map((record) => (
          <PropertyRecordCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}
