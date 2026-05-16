"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type BuyerScore = {
  score: number;
  responseRate: number;
  offerRate: number;
  closeRate: number;
  recentActivityScore: number;
  avgDealSizeScore: number;
  demandAlignmentScore: number;
  matchReadinessScore: number;
};

type Buyer = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  preferredLocations: unknown;
  priceRangeMin: number | null;
  priceRangeMax: number | null;
  propertyTypes: unknown;
  financingType: string | null;
  tier: "A" | "B" | "C" | "D";
  preferredDealSize: number | null;
  preferredCondition: string | null;
  source: string | null;
  tags: unknown;
  buyerQualityScore: number;
  qualityReasons: string[];
  isActive: boolean;
  activityCount: number;
  meaningfulActivityCount: number;
  status: "active" | "warm" | "cold" | "dead";
  lastActivityAt: string | null;
  lastActiveAt: string | null;
  score: BuyerScore;
  matchReadinessScore: number;
  recentActivities: Array<{
    id: string;
    eventType: string;
    dealId: string | null;
    metadata: unknown;
    createdAt: string;
  }>;
};

type DemandSignal = {
  label: string;
  count: number;
};

type DemandSignals = {
  hotZips: DemandSignal[];
  hotPriceRanges: DemandSignal[];
  hotPropertyTypes: DemandSignal[];
  byBuyerTier: Record<"A" | "B" | "C" | "D", number>;
};

type ForecastSignal = {
  label: string;
  score: number;
  buyerCount: number;
};

type BuyerTierForecastSignal = {
  activeCount: number;
  topZips: ForecastSignal[];
  topPropertyTypes: ForecastSignal[];
  priceRangeDemand: ForecastSignal[];
};

type BuyerDemandForecast = {
  forecastStatus: "ready" | "not_enough_data";
  confidenceLevel: "low" | "medium" | "high";
  dataSufficiency: {
    enoughData: boolean;
    buyerCount: number;
    activeBuyerCount: number;
    activityCount: number;
    reason: string;
  };
  predictedHotZips: ForecastSignal[];
  predictedHotPropertyTypes: ForecastSignal[];
  predictedPriceRanges: ForecastSignal[];
  buyerTierSignals: Record<"A" | "B" | "C" | "D", BuyerTierForecastSignal>;
  riskWarnings: string[];
  recommendedNextActions: string[];
};

type BuyerFormState = {
  name: string;
  phone: string;
  email: string;
  preferredLocations: string;
  priceRangeMin: string;
  priceRangeMax: string;
  propertyTypes: string;
  financingType: string;
  preferredDealSize: string;
  preferredCondition: string;
  source: string;
  tags: string;
};

const emptyBuyerForm: BuyerFormState = {
  name: "",
  phone: "",
  email: "",
  preferredLocations: "",
  priceRangeMin: "",
  priceRangeMax: "",
  propertyTypes: "",
  financingType: "",
  preferredDealSize: "",
  preferredCondition: "",
  source: "",
  tags: "",
};

const buyerActivityEvents = [
  "deal_viewed",
  "deal_opened",
  "link_clicked",
  "replied",
  "requested_details",
  "offer_made",
  "deal_closed",
  "deal_passed",
  "unsubscribed_or_inactive",
];

function formatCurrency(value: number | null) {
  if (value === null) {
    return null;
  }

  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function formatPriceRange(min: number | null, max: number | null) {
  const formattedMin = formatCurrency(min);
  const formattedMax = formatCurrency(max);

  if (formattedMin && formattedMax) {
    return `${formattedMin} - ${formattedMax}`;
  }

  if (formattedMin) {
    return `${formattedMin}+`;
  }

  if (formattedMax) {
    return `Up to ${formattedMax}`;
  }

  return "No range";
}

function formatDate(value: string | null) {
  if (!value) {
    return "No activity";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
  }).format(new Date(value));
}

function SignalList({ label, signals }: { label: string; signals: DemandSignal[] }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <p className="text-sm font-semibold text-primary">{label}</p>
      <div className="mt-3 space-y-2">
        {signals.length > 0 ? (
          signals.map((signal) => (
            <div key={signal.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-muted">{signal.label}</span>
              <span className="shrink-0 rounded-full bg-[#eef2f3] px-2.5 py-1 text-xs font-semibold text-primary">
                {signal.count}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted">No activity yet</p>
        )}
      </div>
    </div>
  );
}

function ForecastSignalList({ label, signals }: { label: string; signals: ForecastSignal[] }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <p className="text-sm font-semibold text-primary">{label}</p>
      <div className="mt-3 space-y-2">
        {signals.length > 0 ? (
          signals.map((signal) => (
            <div key={signal.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-muted">{signal.label}</span>
              <span className="shrink-0 rounded-full bg-[#eef2f3] px-2.5 py-1 text-xs font-semibold text-primary">
                {signal.score}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted">No forecast yet</p>
        )}
      </div>
    </div>
  );
}

function parseListInput(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function optionalNumber(value: string) {
  return value.trim() ? Number(value) : undefined;
}

function buildBuyerPayload(form: BuyerFormState) {
  return {
    name: form.name,
    phone: form.phone || undefined,
    email: form.email || undefined,
    preferredLocations: parseListInput(form.preferredLocations),
    priceRangeMin: optionalNumber(form.priceRangeMin),
    priceRangeMax: optionalNumber(form.priceRangeMax),
    propertyTypes: parseListInput(form.propertyTypes),
    financingType: form.financingType || undefined,
    preferredDealSize: optionalNumber(form.preferredDealSize),
    preferredCondition: form.preferredCondition || undefined,
    source: form.source || "dashboard",
    tags: parseListInput(form.tags),
  };
}

export default function BuyerIntelligencePanel() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [demandSignals, setDemandSignals] = useState<DemandSignals>({
    hotZips: [],
    hotPriceRanges: [],
    hotPropertyTypes: [],
    byBuyerTier: { A: 0, B: 0, C: 0, D: 0 },
  });
  const [forecast, setForecast] = useState<BuyerDemandForecast | null>(null);
  const [buyerForm, setBuyerForm] = useState<BuyerFormState>(emptyBuyerForm);
  const [importText, setImportText] = useState("");
  const [activityBuyerId, setActivityBuyerId] = useState("");
  const [activityEventType, setActivityEventType] = useState("deal_viewed");
  const [activityDealId, setActivityDealId] = useState("");
  const [activityNotes, setActivityNotes] = useState("");
  const [intakeMessage, setIntakeMessage] = useState<string | null>(null);
  const [intakeError, setIntakeError] = useState<string | null>(null);
  const [isSavingBuyer, setIsSavingBuyer] = useState(false);
  const [isLoggingActivity, setIsLoggingActivity] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const averageScore = useMemo(() => {
    if (buyers.length === 0) {
      return 0;
    }

    return Math.round(
      buyers.reduce((total, buyer) => total + buyer.score.score, 0) / buyers.length,
    );
  }, [buyers]);

  const loadBuyerIntelligence = useCallback(async () => {
    try {
      const [buyersResponse, demandResponse, forecastResponse] = await Promise.all([
        fetch("/api/buyers"),
        fetch("/api/buyer-demand"),
        fetch("/api/buyer-demand-forecast"),
      ]);

      if (!buyersResponse.ok || !demandResponse.ok || !forecastResponse.ok) {
        throw new Error("Unable to load buyer intelligence.");
      }

      const buyersPayload = (await buyersResponse.json()) as {
        success: boolean;
        buyers?: Buyer[];
      };
      const demandPayload = (await demandResponse.json()) as {
        success: boolean;
        demandSignals?: DemandSignals;
      };
      const forecastPayload = (await forecastResponse.json()) as {
        success: boolean;
        forecast?: BuyerDemandForecast;
      };

      setBuyers(buyersPayload.buyers ?? []);
      setDemandSignals(
        demandPayload.demandSignals ?? {
          hotZips: [],
          hotPriceRanges: [],
          hotPropertyTypes: [],
          byBuyerTier: { A: 0, B: 0, C: 0, D: 0 },
        },
      );
      setForecast(forecastPayload.forecast ?? null);
      setError(null);
    } catch {
      setError("Buyer intelligence is unavailable right now.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBuyerIntelligence();
  }, [loadBuyerIntelligence]);

  useEffect(() => {
    if (!activityBuyerId && buyers[0]) {
      setActivityBuyerId(buyers[0].id);
    }
  }, [activityBuyerId, buyers]);

  async function handleCreateBuyer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingBuyer(true);
    setIntakeError(null);
    setIntakeMessage(null);

    try {
      const response = await fetch("/api/buyers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildBuyerPayload(buyerForm)),
      });
      const payload = await response.json() as { success: boolean; error?: string };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Unable to add buyer.");
      }

      setBuyerForm(emptyBuyerForm);
      setIntakeMessage("Buyer added.");
      await loadBuyerIntelligence();
    } catch (createError) {
      setIntakeError(createError instanceof Error ? createError.message : "Unable to add buyer.");
    } finally {
      setIsSavingBuyer(false);
    }
  }

  async function handleImportBuyers() {
    setIsSavingBuyer(true);
    setIntakeError(null);
    setIntakeMessage(null);

    try {
      const parsedImport = JSON.parse(importText) as unknown;

      if (!Array.isArray(parsedImport)) {
        throw new Error("Import must be a JSON array.");
      }

      const response = await fetch("/api/buyers/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedImport),
      });
      const payload = await response.json() as {
        success: boolean;
        created?: number;
        skippedDuplicates?: number;
        errors?: unknown[];
        error?: string;
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Unable to import buyers.");
      }

      setImportText("");
      setIntakeMessage(
        `Import complete: ${payload.created ?? 0} created, ${payload.skippedDuplicates ?? 0} duplicates skipped, ${payload.errors?.length ?? 0} errors.`,
      );
      await loadBuyerIntelligence();
    } catch (importError) {
      setIntakeError(importError instanceof Error ? importError.message : "Unable to import buyers.");
    } finally {
      setIsSavingBuyer(false);
    }
  }

  async function handleLogBuyerActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activityBuyerId) {
      setIntakeError("Select a buyer before logging activity.");
      return;
    }

    setIsLoggingActivity(true);
    setIntakeError(null);
    setIntakeMessage(null);

    try {
      const response = await fetch(`/api/buyers/${activityBuyerId}/activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: activityEventType,
          dealId: activityDealId || undefined,
          metadata: activityNotes ? { notes: activityNotes } : undefined,
        }),
      });
      const payload = await response.json() as { success: boolean; error?: string };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Unable to log buyer activity.");
      }

      setActivityDealId("");
      setActivityNotes("");
      setIntakeMessage("Buyer activity logged.");
      await loadBuyerIntelligence();
    } catch (activityError) {
      setIntakeError(activityError instanceof Error ? activityError.message : "Unable to log buyer activity.");
    } finally {
      setIsLoggingActivity(false);
    }
  }

  return (
    <section className="rounded-[1.5rem] border border-border bg-surface p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">Buyer Intelligence</h2>
          <p className="text-sm leading-6 text-muted">
            Read-only demand tracking for buyer behavior, activity quality, and market signals.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full bg-[#e7eef5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#355066]">
          Read Only
        </span>
      </div>

      {error ? <p className="mt-4 text-sm font-medium text-red-700">{error}</p> : null}

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="text-sm text-muted">Tracked buyers</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{isLoading ? "..." : buyers.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="text-sm text-muted">Average buyer score</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{isLoading ? "..." : averageScore}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4">
          <p className="text-sm text-muted">Active buyers</p>
          <p className="mt-2 text-3xl font-semibold text-primary">
            {isLoading ? "..." : buyers.filter((buyer) => buyer.status === "active").length}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <SignalList label="Hot zips" signals={demandSignals.hotZips} />
        <SignalList label="Hot price ranges" signals={demandSignals.hotPriceRanges} />
        <SignalList label="Hot property types" signals={demandSignals.hotPropertyTypes} />
      </div>

      <div className="mt-4 grid grid-cols-4 gap-3">
        {(["A", "B", "C", "D"] as const).map((tier) => (
          <div key={tier} className="rounded-2xl border border-border bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Tier {tier}</p>
            <p className="mt-1 text-2xl font-semibold text-primary">{demandSignals.byBuyerTier[tier]}</p>
          </div>
        ))}
      </div>

      <section className="mt-5 rounded-2xl border border-border bg-white p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary">Add Buyer / Import Buyers</h3>
            <p className="mt-1 text-sm leading-6 text-muted">
              Data intake only. New buyer records update intelligence, but do not trigger outreach.
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full bg-[#e7eef5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#355066]">
            Intake Only
          </span>
        </div>

        {intakeMessage ? <p className="mt-3 text-sm font-medium text-success">{intakeMessage}</p> : null}
        {intakeError ? <p className="mt-3 text-sm font-medium text-red-700">{intakeError}</p> : null}

        <form onSubmit={(event) => void handleCreateBuyer(event)} className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="text-sm font-medium text-primary">
            Name
            <input
              required
              value={buyerForm.name}
              onChange={(event) => setBuyerForm((current) => ({ ...current, name: event.target.value }))}
              className="mt-1 min-h-11 w-full rounded-2xl border border-border px-3 text-sm text-primary outline-none focus:border-primary/40"
            />
          </label>
          <label className="text-sm font-medium text-primary">
            Phone
            <input
              value={buyerForm.phone}
              onChange={(event) => setBuyerForm((current) => ({ ...current, phone: event.target.value }))}
              className="mt-1 min-h-11 w-full rounded-2xl border border-border px-3 text-sm text-primary outline-none focus:border-primary/40"
            />
          </label>
          <label className="text-sm font-medium text-primary">
            Email
            <input
              type="email"
              value={buyerForm.email}
              onChange={(event) => setBuyerForm((current) => ({ ...current, email: event.target.value }))}
              className="mt-1 min-h-11 w-full rounded-2xl border border-border px-3 text-sm text-primary outline-none focus:border-primary/40"
            />
          </label>
          <label className="text-sm font-medium text-primary">
            Preferred zips
            <input
              value={buyerForm.preferredLocations}
              onChange={(event) => setBuyerForm((current) => ({ ...current, preferredLocations: event.target.value }))}
              placeholder="73112, 73118"
              className="mt-1 min-h-11 w-full rounded-2xl border border-border px-3 text-sm text-primary outline-none focus:border-primary/40"
            />
          </label>
          <label className="text-sm font-medium text-primary">
            Min price
            <input
              type="number"
              min="0"
              value={buyerForm.priceRangeMin}
              onChange={(event) => setBuyerForm((current) => ({ ...current, priceRangeMin: event.target.value }))}
              className="mt-1 min-h-11 w-full rounded-2xl border border-border px-3 text-sm text-primary outline-none focus:border-primary/40"
            />
          </label>
          <label className="text-sm font-medium text-primary">
            Max price
            <input
              type="number"
              min="0"
              value={buyerForm.priceRangeMax}
              onChange={(event) => setBuyerForm((current) => ({ ...current, priceRangeMax: event.target.value }))}
              className="mt-1 min-h-11 w-full rounded-2xl border border-border px-3 text-sm text-primary outline-none focus:border-primary/40"
            />
          </label>
          <label className="text-sm font-medium text-primary">
            Property types
            <input
              value={buyerForm.propertyTypes}
              onChange={(event) => setBuyerForm((current) => ({ ...current, propertyTypes: event.target.value }))}
              placeholder="single_family, duplex"
              className="mt-1 min-h-11 w-full rounded-2xl border border-border px-3 text-sm text-primary outline-none focus:border-primary/40"
            />
          </label>
          <label className="text-sm font-medium text-primary">
            Financing
            <input
              value={buyerForm.financingType}
              onChange={(event) => setBuyerForm((current) => ({ ...current, financingType: event.target.value }))}
              className="mt-1 min-h-11 w-full rounded-2xl border border-border px-3 text-sm text-primary outline-none focus:border-primary/40"
            />
          </label>
          <label className="text-sm font-medium text-primary">
            Preferred deal size
            <input
              type="number"
              min="0"
              value={buyerForm.preferredDealSize}
              onChange={(event) => setBuyerForm((current) => ({ ...current, preferredDealSize: event.target.value }))}
              className="mt-1 min-h-11 w-full rounded-2xl border border-border px-3 text-sm text-primary outline-none focus:border-primary/40"
            />
          </label>
          <label className="text-sm font-medium text-primary">
            Condition
            <input
              value={buyerForm.preferredCondition}
              onChange={(event) => setBuyerForm((current) => ({ ...current, preferredCondition: event.target.value }))}
              className="mt-1 min-h-11 w-full rounded-2xl border border-border px-3 text-sm text-primary outline-none focus:border-primary/40"
            />
          </label>
          <label className="text-sm font-medium text-primary">
            Source
            <input
              value={buyerForm.source}
              onChange={(event) => setBuyerForm((current) => ({ ...current, source: event.target.value }))}
              placeholder="referral, meetup, dispo_list"
              className="mt-1 min-h-11 w-full rounded-2xl border border-border px-3 text-sm text-primary outline-none focus:border-primary/40"
            />
          </label>
          <label className="text-sm font-medium text-primary">
            Tags
            <input
              value={buyerForm.tags}
              onChange={(event) => setBuyerForm((current) => ({ ...current, tags: event.target.value }))}
              placeholder="landlord, cash"
              className="mt-1 min-h-11 w-full rounded-2xl border border-border px-3 text-sm text-primary outline-none focus:border-primary/40"
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSavingBuyer}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#d89a42] px-5 py-2.5 text-sm font-bold text-[#102437] transition hover:bg-[#e5a64f] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSavingBuyer ? "Saving..." : "Add Buyer"}
            </button>
          </div>
        </form>

        <div className="mt-5">
          <label className="text-sm font-medium text-primary">
            JSON import
            <textarea
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
              rows={6}
              placeholder='[{"name":"Buyer","email":"buyer@example.com","preferredLocations":["73112"],"propertyTypes":["single_family"]}]'
              className="mt-1 w-full rounded-2xl border border-border px-3 py-3 text-sm text-primary outline-none focus:border-primary/40"
            />
          </label>
          <button
            type="button"
            onClick={() => void handleImportBuyers()}
            disabled={isSavingBuyer || !importText.trim()}
            className="mt-3 inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/30 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Import Buyers
          </button>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-border bg-[#f8faf9] p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary">Predictive Buyer Demand</h3>
            <p className="mt-1 text-sm leading-6 text-muted">
              Read-only forecast based on buyer profiles, recent behavior, tiers, and demand signals.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              {forecast?.forecastStatus ?? "loading"}
            </span>
            <span className="inline-flex w-fit rounded-full bg-[#e7eef5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#355066]">
              {forecast?.confidenceLevel ?? "low"} confidence
            </span>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-white p-4">
            <p className="text-sm text-muted">Data sufficiency</p>
            <p className="mt-2 text-xl font-semibold text-primary">
              {forecast?.dataSufficiency.enoughData ? "Enough data" : "Not enough data"}
            </p>
            <p className="mt-1 text-xs text-muted">{forecast?.dataSufficiency.reason ?? "Loading forecast"}</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-4">
            <p className="text-sm text-muted">Buyer activity</p>
            <p className="mt-2 text-xl font-semibold text-primary">{forecast?.dataSufficiency.activityCount ?? 0}</p>
            <p className="mt-1 text-xs text-muted">
              {forecast?.dataSufficiency.activeBuyerCount ?? 0} active of {forecast?.dataSufficiency.buyerCount ?? 0} buyers
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-4">
            <p className="text-sm text-muted">Forecast confidence</p>
            <p className="mt-2 text-xl font-semibold capitalize text-primary">{forecast?.confidenceLevel ?? "low"}</p>
            <p className="mt-1 text-xs text-muted">Prediction only</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <ForecastSignalList label="Predicted hot zips" signals={forecast?.predictedHotZips ?? []} />
          <ForecastSignalList label="Predicted property types" signals={forecast?.predictedHotPropertyTypes ?? []} />
          <ForecastSignalList label="Predicted price ranges" signals={forecast?.predictedPriceRanges ?? []} />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {(["A", "B", "C", "D"] as const).map((tier) => (
            <div key={tier} className="rounded-2xl border border-border bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Tier {tier} signal</p>
              <p className="mt-1 text-2xl font-semibold text-primary">
                {forecast?.buyerTierSignals[tier].activeCount ?? 0}
              </p>
              <p className="mt-1 truncate text-xs text-muted">
                {forecast?.buyerTierSignals[tier].topZips[0]?.label ?? "No zip signal"}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-4">
            <p className="text-sm font-semibold text-primary">Risk warnings</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(forecast?.riskWarnings.length ? forecast.riskWarnings : ["none"]).map((warning) => (
                <span key={warning} className="rounded-full bg-[#f5dfdc] px-2.5 py-1 text-xs font-semibold text-[#9f3a22]">
                  {warning}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-white p-4">
            <p className="text-sm font-semibold text-primary">Recommended next actions</p>
            <div className="mt-3 space-y-2">
              {(forecast?.recommendedNextActions.length ? forecast.recommendedNextActions : ["Loading forecast"]).map((action) => (
                <p key={action} className="text-sm text-muted">{action}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-border bg-white p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary">Log Buyer Activity</h3>
            <p className="mt-1 text-sm leading-6 text-muted">
              Tracks buyer behavior and recalculates quality. This does not send messages or route deals.
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full bg-[#e7eef5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#355066]">
            Tracking Only
          </span>
        </div>

        <form onSubmit={(event) => void handleLogBuyerActivity(event)} className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="text-sm font-medium text-primary">
            Buyer
            <select
              value={activityBuyerId}
              onChange={(event) => setActivityBuyerId(event.target.value)}
              className="mt-1 min-h-11 w-full rounded-2xl border border-border bg-white px-3 text-sm text-primary outline-none focus:border-primary/40"
            >
              {buyers.length > 0 ? (
                buyers.map((buyer) => (
                  <option key={buyer.id} value={buyer.id}>
                    {buyer.name}
                  </option>
                ))
              ) : (
                <option value="">No buyers available</option>
              )}
            </select>
          </label>
          <label className="text-sm font-medium text-primary">
            Event type
            <select
              value={activityEventType}
              onChange={(event) => setActivityEventType(event.target.value)}
              className="mt-1 min-h-11 w-full rounded-2xl border border-border bg-white px-3 text-sm text-primary outline-none focus:border-primary/40"
            >
              {buyerActivityEvents.map((eventType) => (
                <option key={eventType} value={eventType}>
                  {eventType}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-primary">
            Deal ID
            <input
              value={activityDealId}
              onChange={(event) => setActivityDealId(event.target.value)}
              className="mt-1 min-h-11 w-full rounded-2xl border border-border px-3 text-sm text-primary outline-none focus:border-primary/40"
            />
          </label>
          <label className="text-sm font-medium text-primary">
            Notes
            <input
              value={activityNotes}
              onChange={(event) => setActivityNotes(event.target.value)}
              className="mt-1 min-h-11 w-full rounded-2xl border border-border px-3 text-sm text-primary outline-none focus:border-primary/40"
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isLoggingActivity || buyers.length === 0}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/30 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoggingActivity ? "Logging..." : "Log Activity"}
            </button>
          </div>
        </form>

        <div className="mt-5 grid gap-3">
          {buyers.flatMap((buyer) =>
            buyer.recentActivities.map((activity) => (
              <div key={activity.id} className="rounded-2xl border border-border bg-[#f8faf9] px-4 py-3 text-sm">
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <p className="font-semibold text-primary">{buyer.name}</p>
                  <p className="text-xs text-muted">{formatDate(activity.createdAt)}</p>
                </div>
                <p className="mt-1 text-muted">
                  {activity.eventType}{activity.dealId ? ` | ${activity.dealId}` : ""}
                </p>
              </div>
            )),
          ).slice(0, 5)}
          {buyers.every((buyer) => buyer.recentActivities.length === 0) ? (
            <p className="text-sm text-muted">No recent buyer activity yet.</p>
          ) : null}
        </div>
      </section>

      <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-white">
        <div className="grid grid-cols-[1.2fr_0.65fr_0.65fr_0.8fr] gap-3 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted md:grid-cols-[1.3fr_0.65fr_0.65fr_0.85fr_0.85fr_1fr]">
          <span>Buyer</span>
          <span>Quality</span>
          <span>Tier</span>
          <span>Active</span>
          <span className="hidden md:block">Activity</span>
          <span className="hidden md:block">Budget</span>
        </div>
        {buyers.length > 0 ? (
          buyers.map((buyer) => (
            <div
              key={buyer.id}
              className="grid grid-cols-[1.2fr_0.65fr_0.65fr_0.8fr] gap-3 border-b border-border px-4 py-3 text-sm last:border-b-0 md:grid-cols-[1.3fr_0.65fr_0.65fr_0.85fr_0.85fr_1fr]"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-primary">{buyer.name}</p>
                <p className="truncate text-xs text-muted">{buyer.email ?? buyer.phone}</p>
              </div>
              <div>
                <p className="font-semibold text-primary">{buyer.buyerQualityScore}</p>
                <p className="text-xs text-muted">{buyer.score.score} score</p>
              </div>
              <div>
                <span className="inline-flex rounded-full bg-[#eef2f3] px-2.5 py-1 text-xs font-semibold text-primary">
                  {buyer.tier}
                </span>
              </div>
              <div>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${buyer.isActive ? "bg-[#dcefe3] text-[#2d6a4f]" : "bg-[#f5dfdc] text-[#9f3a22]"}`}>
                  {buyer.isActive ? "active" : "inactive"}
                </span>
              </div>
              <p className="hidden text-sm text-muted md:block">
                {buyer.meaningfulActivityCount} meaningful | {formatDate(buyer.lastActiveAt)}
              </p>
              <p className="hidden text-sm text-muted md:block">
                {formatPriceRange(buyer.priceRangeMin, buyer.priceRangeMax)}
              </p>
            </div>
          ))
        ) : (
          <p className="px-4 py-5 text-sm text-muted">
            {isLoading ? "Loading buyer intelligence..." : "No buyer profiles have been added yet."}
          </p>
        )}
      </div>
    </section>
  );
}
