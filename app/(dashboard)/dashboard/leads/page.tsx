"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getActiveDistressFlags } from "@/lib/distress-flags";
import { generateLeads } from "@/lib/lead-generator";
import { createGeneratedLeads, deleteLead, fetchLeads, updateLead } from "@/lib/leads-api";
import { fetchRealLeads } from "@/lib/real-leads";
import type { StoredLead } from "@/lib/leads-storage";

function formatLeadTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function sortLeadsNewestFirst(leads: StoredLead[]) {
  return [...leads].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function sortLeadsByHighestScore(leads: StoredLead[]) {
  return [...leads].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}

function getPendingFollowUps(leads: StoredLead[]) {
  return leads
    .flatMap((lead) =>
      lead.followUps
        .filter((followUp) => followUp.status === "pending")
        .map((followUp) => ({
          leadId: lead.id,
          leadName: `${lead.firstName} ${lead.lastName}`.trim() || "Unknown lead",
          propertyAddress: lead.propertyAddress,
          type: followUp.type,
          date: followUp.date,
          message: followUp.message
        }))
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function isOverdue(date: string) {
  return new Date(date).getTime() < Date.now();
}

function isDueWithinNext72Hours(date: string) {
  const followUpTime = new Date(date).getTime();
  const now = Date.now();
  const seventyTwoHours = 72 * 60 * 60 * 1000;

  return followUpTime >= now && followUpTime <= now + seventyTwoHours;
}

function getLeadDetailHref(leadId: string) {
  return `/dashboard/leads/${leadId}` as Route;
}

export default function DashboardLeadsPage() {
  const [sortMode, setSortMode] = useState<"score" | "newest">("score");
  const [leads, setLeads] = useState<StoredLead[]>([]);
  const [dealFinderMessage, setDealFinderMessage] = useState<string | null>(null);
  const [isRunningDealFinder, setIsRunningDealFinder] = useState(false);
  const [realLeadsMessage, setRealLeadsMessage] = useState<string | null>(null);
  const [realLeadsError, setRealLeadsError] = useState<string | null>(null);
  const [isFetchingRealLeads, setIsFetchingRealLeads] = useState(false);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);

  function sortLeads(leadsToSort: StoredLead[]) {
    return sortMode === "score" ? sortLeadsByHighestScore(leadsToSort) : sortLeadsNewestFirst(leadsToSort);
  }

  async function handleDeleteLead(leadId: string) {
    setLeads(sortLeads(await deleteLead(leadId)));
  }

  async function handleToggleStatus(lead: StoredLead) {
    const nextStatus = lead.status === "new" ? "contacted" : "new";
    setLeads(
      sortLeads(
        leads.map((currentLead) => (currentLead.id === lead.id ? { ...currentLead, status: nextStatus } : currentLead))
      )
    );
    const updatedLead = await updateLead({
      ...lead,
      status: nextStatus
    });

    setLeads((currentLeads) =>
      sortLeads(currentLeads.map((currentLead) => (currentLead.id === updatedLead.id ? updatedLead : currentLead)))
    );
  }

  function handleSortModeChange(nextSortMode: "score" | "newest") {
    setSortMode(nextSortMode);
    setLeads(nextSortMode === "score" ? sortLeadsByHighestScore(leads) : sortLeadsNewestFirst(leads));
  }

  async function handleRunDealFinder() {
    setIsRunningDealFinder(true);
    setRealLeadsError(null);

    try {
      const generatedLeads = generateLeads();
      const result = await createGeneratedLeads(generatedLeads);

      setLeads(sortLeads(result.leads));
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

      setLeads(sortLeads(result.leads));
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
    async function loadInitialLeads() {
      const nextLeads = await fetchLeads();

      setLeads(sortMode === "score" ? sortLeadsByHighestScore(nextLeads) : sortLeadsNewestFirst(nextLeads));
      setIsLoadingLeads(false);
    }

    void loadInitialLeads();
  }, [sortMode]);

  const pendingFollowUps = getPendingFollowUps(leads);
  const highlightedFollowUps = pendingFollowUps.filter((followUp) => isOverdue(followUp.date) || isDueWithinNext72Hours(followUp.date));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-primary">Leads</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted md:text-base">
            Local browser-stored leads ranked with simple opportunity scoring on top of the existing distress signals.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleFetchRealLeads}
            disabled={isFetchingRealLeads || isLoadingLeads}
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary/30 hover:text-primary-strong disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isFetchingRealLeads ? "Fetching..." : "Fetch Real Leads"}
          </button>
          <button
            type="button"
            onClick={() => void handleRunDealFinder()}
            disabled={isRunningDealFinder || isLoadingLeads}
            className="rounded-full bg-[#d89a42] px-4 py-2 text-sm font-semibold text-[#102437] transition hover:bg-[#e5a64f] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isRunningDealFinder ? "Running..." : "Run Deal Finder"}
          </button>
          <button
            type="button"
            onClick={() => handleSortModeChange("score")}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              sortMode === "score"
                ? "border-[#d89a42] bg-[#f6e8cc] text-[#9a6a1a]"
                : "border-border bg-white text-primary hover:border-primary/30 hover:text-primary-strong"
            }`}
          >
            Highest Score
          </button>
          <button
            type="button"
            onClick={() => handleSortModeChange("newest")}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              sortMode === "newest"
                ? "border-[#d89a42] bg-[#f6e8cc] text-[#9a6a1a]"
                : "border-border bg-white text-primary hover:border-primary/30 hover:text-primary-strong"
            }`}
          >
            Newest First
          </button>
        </div>
      </div>

      {dealFinderMessage ? <p className="text-sm font-medium text-success">{dealFinderMessage}</p> : null}
      {realLeadsMessage ? <p className="text-sm font-medium text-success">{realLeadsMessage}</p> : null}
      {realLeadsError ? <p className="text-sm font-medium text-red-700">{realLeadsError}</p> : null}

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-primary">Upcoming Follow-Ups</h2>
          <p className="text-sm leading-6 text-muted">Pending follow-ups due soon in the next 72 hours, plus any that are already overdue.</p>
        </div>

        {highlightedFollowUps.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-border bg-white px-4 py-5 text-sm leading-6 text-muted">
            No upcoming or overdue follow-ups right now.
          </div>
        ) : (
          <div className="mt-5 grid gap-4">
            {highlightedFollowUps.map((followUp, index) => (
              <article
                key={`${followUp.leadId}-${followUp.date}-${index}`}
                className={`rounded-2xl border bg-white px-4 py-4 shadow-sm ${
                  isOverdue(followUp.date) ? "border-[#e8b7ae]" : "border-border"
                }`}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={getLeadDetailHref(followUp.leadId)} className="text-sm font-semibold text-primary transition hover:text-primary-strong hover:underline">
                        {followUp.leadName}
                      </Link>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                          isOverdue(followUp.date) ? "bg-[#f7ddd7] text-[#9f3a22]" : "bg-[#f6e8cc] text-[#9a6a1a]"
                        }`}
                      >
                        {isOverdue(followUp.date) ? "Overdue" : "Due Soon"}
                      </span>
                    </div>
                    <p className="text-sm text-muted">
                      {followUp.type.toUpperCase()} for {followUp.propertyAddress}
                    </p>
                    <p className="text-sm text-muted">{formatLeadTimestamp(followUp.date)}</p>
                    <p className="text-sm leading-6 text-[#173447]">{followUp.message}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {isLoadingLeads ? (
        <div className="rounded-[1.5rem] border border-dashed border-border bg-surface p-6 text-sm leading-6 text-muted">
          Loading leads...
        </div>
      ) : leads.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-border bg-surface p-6 text-sm leading-6 text-muted">
          No leads yet. Submit the homepage form to see new homeowner inquiries here.
        </div>
      ) : (
        <>
          <div className="rounded-[1.5rem] border border-border bg-surface shadow-[0_18px_40px_rgba(17,37,52,0.05)]">
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-border bg-[#f7f3ea] text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#4f6376]">
                    <th className="px-5 py-4">Full Name</th>
                    <th className="px-5 py-4">Phone</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Property Address</th>
                    <th className="px-5 py-4">City / State</th>
                    <th className="px-5 py-4">Submitted</th>
                    <th className="px-5 py-4">Score</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-border/70 text-sm text-[#173447] last:border-b-0">
                      <td className="px-5 py-4 font-semibold">
                        <Link href={getLeadDetailHref(lead.id)} className="transition hover:text-primary-strong hover:underline">
                          {lead.firstName} {lead.lastName}
                        </Link>
                      </td>
                      <td className="px-5 py-4">{lead.phone}</td>
                      <td className="px-5 py-4">{lead.email}</td>
                      <td className="px-5 py-4">{lead.propertyAddress}</td>
                      <td className="px-5 py-4">
                        {lead.city}, {lead.state}
                      </td>
                      <td className="px-5 py-4 text-[#5d6a72]">{formatLeadTimestamp(lead.timestamp)}</td>
                      <td className="px-5 py-4">
                        <div className="space-y-2">
                          <p className="text-base font-bold text-primary">{lead.score}</p>
                          <PriorityBadge priority={lead.priority} />
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                            lead.status === "contacted"
                              ? "bg-[#dcefe3] text-[#2d6a4f]"
                              : "bg-[#f6e8cc] text-[#9a6a1a]"
                          }`}
                        >
                          {lead.status}
                        </span>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {getActiveDistressFlags(lead.distressFlags).length > 0 ? (
                            getActiveDistressFlags(lead.distressFlags).slice(0, 3).map((flag) => (
                              <FlagBadge key={flag.key} label={flag.label} />
                            ))
                          ) : (
                            <span className="text-xs text-muted">No distress signals</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={getLeadDetailHref(lead.id)}
                            className="rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/30 hover:text-primary-strong"
                          >
                            View Lead
                          </Link>
                          <button
                            type="button"
                            onClick={() => void handleToggleStatus(lead)}
                            className="rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/30 hover:text-primary-strong"
                          >
                            {lead.status === "new" ? "Mark Contacted" : "Mark New"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeleteLead(lead.id)}
                            className="rounded-full border border-[#ead7d7] bg-white px-3 py-2 text-xs font-semibold text-[#8a3d3d] transition hover:border-[#d9b0b0] hover:text-[#6d2f2f]"
                          >
                            Delete Lead
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 p-4 md:hidden">
              {leads.map((lead) => (
                <article key={lead.id} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-primary">
                        <Link href={getLeadDetailHref(lead.id)} className="transition hover:text-primary-strong hover:underline">
                          {lead.firstName} {lead.lastName}
                        </Link>
                      </h2>
                      <p className="mt-1 text-sm text-muted">{formatLeadTimestamp(lead.timestamp)}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-primary">Score {lead.score}</span>
                        <PriorityBadge priority={lead.priority} />
                      </div>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                        lead.status === "contacted" ? "bg-[#dcefe3] text-[#2d6a4f]" : "bg-[#f6e8cc] text-[#9a6a1a]"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-[#173447]">
                    <p>
                      <span className="font-semibold">Phone:</span> {lead.phone}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span> {lead.email}
                    </p>
                    <p>
                      <span className="font-semibold">Property:</span> {lead.propertyAddress}
                    </p>
                    <p>
                      <span className="font-semibold">Location:</span> {lead.city}, {lead.state}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {getActiveDistressFlags(lead.distressFlags).length > 0 ? (
                        getActiveDistressFlags(lead.distressFlags).slice(0, 3).map((flag) => (
                          <FlagBadge key={flag.key} label={flag.label} />
                        ))
                      ) : (
                        <span className="text-xs text-muted">No distress signals</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={getLeadDetailHref(lead.id)}
                      className="rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/30 hover:text-primary-strong"
                    >
                      View Lead
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleToggleStatus(lead)}
                      className="rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-primary/30 hover:text-primary-strong"
                    >
                      {lead.status === "new" ? "Mark Contacted" : "Mark New"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDeleteLead(lead.id)}
                      className="rounded-full border border-[#ead7d7] bg-white px-3 py-2 text-xs font-semibold text-[#8a3d3d] transition hover:border-[#d9b0b0] hover:text-[#6d2f2f]"
                    >
                      Delete Lead
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function FlagBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full bg-[#eef3f8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#355066]">
      {label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: StoredLead["priority"] }) {
  const className =
    priority === "High"
      ? "bg-[#f7ddd7] text-[#9f3a22]"
      : priority === "Medium"
        ? "bg-[#f6e8cc] text-[#9a6a1a]"
        : "bg-[#e7eef5] text-[#355066]";
  const label = priority === "High" ? "🔥 High" : priority === "Medium" ? "⚠️ Medium" : "Low";

  return <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${className}`}>{label}</span>;
}
