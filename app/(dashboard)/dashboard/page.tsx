"use client";

import { useEffect, useState } from "react";

import { runAutomationCycle } from "@/lib/automation-agent";
import { generateLeads } from "@/lib/lead-generator";
import { createGeneratedLeads, fetchLeads } from "@/lib/leads-api";
import { fetchRealLeads } from "@/lib/real-leads";
import type { StoredLead } from "@/lib/leads-storage";
import { StatCard } from "@/components/shared/stat-card";
import SystemReadinessPanel from "@/components/dashboard/system-readiness-panel";
import BuyerIntelligencePanel from "@/components/dashboard/buyer-intelligence-panel";

const queue = [
  "Review new seller leads and assign an owner.",
  "Import tax delinquent list and flag out-of-state owners.",
  "Score new opportunities with the deal analyzer.",
  "Create follow-up tasks for inactive prospects."
];

function getPendingFollowUpCount(leads: StoredLead[]) {
  return leads.reduce(
    (count, lead) => count + lead.followUps.filter((followUp) => followUp.status === "pending").length,
    0
  );
}

export default function DashboardPage() {
  const [openLeadCount, setOpenLeadCount] = useState(0);
  const [pendingFollowUpCount, setPendingFollowUpCount] = useState(0);
  const [dealFinderMessage, setDealFinderMessage] = useState<string | null>(null);
  const [isRunningDealFinder, setIsRunningDealFinder] = useState(false);
  const [realLeadsMessage, setRealLeadsMessage] = useState<string | null>(null);
  const [realLeadsError, setRealLeadsError] = useState<string | null>(null);
  const [isFetchingRealLeads, setIsFetchingRealLeads] = useState(false);
  const [isAutomationRunning, setIsAutomationRunning] = useState(false);
  const [automationLastRun, setAutomationLastRun] = useState<string | null>(null);
  const [automationAddedCount, setAutomationAddedCount] = useState(0);
  const [automationStatusMessage, setAutomationStatusMessage] = useState<string | null>(null);
  const [automationHighPriorityCount, setAutomationHighPriorityCount] = useState(0);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);

  async function refreshLeadCounts() {
    const leads = await fetchLeads();

    setOpenLeadCount(leads.length);
    setPendingFollowUpCount(getPendingFollowUpCount(leads));
    setIsLoadingLeads(false);

    return leads;
  }

  async function handleRunDealFinder() {
    setIsRunningDealFinder(true);
    setRealLeadsError(null);

    try {
      const generatedLeads = generateLeads();
      const result = await createGeneratedLeads(generatedLeads);

      setOpenLeadCount(result.leads.length);
      setPendingFollowUpCount(getPendingFollowUpCount(result.leads));
      setDealFinderMessage(
        result.skippedCount > 0
          ? `${result.addedCount} new leads found. ${result.skippedCount} duplicates skipped.`
          : `${result.addedCount} new leads found.`
      );
    } finally {
      setIsRunningDealFinder(false);
    }
  }

  async function handleFetchRealLeads() {
    setIsFetchingRealLeads(true);
    setRealLeadsError(null);

    try {
      const fetchedLeads = await fetchRealLeads();
      const result = await createGeneratedLeads(fetchedLeads);

      setOpenLeadCount(result.leads.length);
      setPendingFollowUpCount(getPendingFollowUpCount(result.leads));
      setRealLeadsMessage(
        result.skippedCount > 0
          ? `${result.addedCount} real leads fetched. ${result.skippedCount} duplicates skipped.`
          : `${result.addedCount} real leads fetched.`
      );
    } catch {
      setRealLeadsError("Failed to fetch leads.");
    } finally {
      setIsFetchingRealLeads(false);
    }
  }

  useEffect(() => {
    void refreshLeadCounts();
  }, []);

  useEffect(() => {
    if (!isAutomationRunning) {
      return;
    }

    async function runCycle() {
      const result = await runAutomationCycle();
      const leads = await refreshLeadCounts();

      setOpenLeadCount(leads.length);
      setPendingFollowUpCount(getPendingFollowUpCount(leads));
      setAutomationLastRun(result.ranAt);
      setAutomationAddedCount(result.addedCount);
      setAutomationHighPriorityCount(result.highPriorityCount);
      setAutomationStatusMessage(result.summary);
    }

    void runCycle();

    const intervalId = window.setInterval(() => {
      void runCycle();
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [isAutomationRunning]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Internal Dashboard</p>
          <h1 className="text-3xl font-semibold text-primary md:text-4xl">Operations overview</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted md:text-base">
            This internal area is structured for CRM activity, property review, underwriting, and future list-management workflows.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsAutomationRunning((current) => !current)}
            className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              isAutomationRunning
                ? "border border-[#e8b7ae] bg-white text-[#9f3a22] hover:border-[#d19a8f]"
                : "border border-border bg-white text-primary hover:border-primary/30 hover:text-primary-strong"
            }`}
          >
            {isAutomationRunning ? "Stop Automation" : "Start Automation"}
          </button>
          <button
            type="button"
            onClick={() => void handleFetchRealLeads()}
            disabled={isFetchingRealLeads}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/30 hover:text-primary-strong disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isFetchingRealLeads ? "Fetching..." : "Fetch Real Leads"}
          </button>
          <button
            type="button"
            onClick={() => void handleRunDealFinder()}
            disabled={isRunningDealFinder || isLoadingLeads}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#d89a42] px-5 py-2.5 text-sm font-bold text-[#102437] transition hover:bg-[#e5a64f] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isRunningDealFinder ? "Running..." : "Run Deal Finder"}
          </button>
        </div>
      </div>

      {dealFinderMessage ? <p className="text-sm font-medium text-success">{dealFinderMessage}</p> : null}
      {realLeadsMessage ? <p className="text-sm font-medium text-success">{realLeadsMessage}</p> : null}
      {realLeadsError ? <p className="text-sm font-medium text-red-700">{realLeadsError}</p> : null}

      <SystemReadinessPanel />

      <section className="rounded-[1.5rem] border border-border bg-surface p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-primary">Automation Agent</h2>
            <p className="text-sm leading-6 text-muted">
              Simulated background task runner for lead discovery and prioritization on a repeating cycle.
            </p>
          </div>
          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
              isAutomationRunning ? "bg-[#dcefe3] text-[#2d6a4f]" : "bg-[#e7eef5] text-[#355066]"
            }`}
          >
            {isAutomationRunning ? "Automation Running..." : "Automation Stopped"}
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <StatCard
            label="Last Run"
            value={automationLastRun ? new Intl.DateTimeFormat("en-US", { dateStyle: "short", timeStyle: "short" }).format(new Date(automationLastRun)) : "Not yet"}
            helper="Most recent automation cycle"
          />
          <StatCard label="Leads Added" value={String(automationAddedCount)} helper="Added on the most recent cycle" />
          <StatCard label="High Priority" value={String(automationHighPriorityCount)} helper="High-priority leads found last cycle" />
        </div>

        {automationStatusMessage ? <p className="mt-4 text-sm font-medium text-success">{automationStatusMessage}</p> : null}
        {automationHighPriorityCount > 0 ? (
          <p className="mt-2 text-sm font-medium text-[#9f3a22]">High-priority opportunities were detected in the latest cycle.</p>
        ) : null}
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open leads" value={String(openLeadCount)} helper="Includes submitted, imported, and AI-generated leads" />
        <StatCard label="Follow-up tasks" value={String(pendingFollowUpCount)} helper="Pending scheduled outreach items" />
        <StatCard label="Tracked properties" value={String(openLeadCount)} helper="Lead-linked opportunities under review" />
        <StatCard label="Lead sources" value="6" helper="Website, imports, and AI-generated discovery" />
      </div>

      <BuyerIntelligencePanel />

      <section className="rounded-[1.5rem] border border-border bg-surface p-6">
        <h2 className="text-xl font-semibold text-primary">Suggested operator workflow</h2>
        <div className="mt-4 grid gap-3">
          {queue.map((item) => (
            <div key={item} className="rounded-2xl border border-border bg-white px-4 py-3 text-sm text-muted">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
