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
  if (Number.isNaN(date.getTime())) return "Unknown date";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getLeadDetailHref(leadId: string) {
  return `/dashboard/leads/${leadId}` as Route;
}

export default function DashboardLeadsPage() {
  const [leads, setLeads] = useState<StoredLead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);

  useEffect(() => {
    async function loadLeads() {
      const data = await fetchLeads();
      setLeads(data);
      setIsLoadingLeads(false);
    }
    void loadLeads();
  }, []);

  async function handleDeleteLead(id: string) {
    setLeads(await deleteLead(id));
  }

  async function handleToggleStatus(lead: StoredLead) {
    const updated = await updateLead({
      ...lead,
      status: lead.status === "new" ? "contacted" : "new",
    });
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">Leads</h1>
      </div>

      {/* MAIN LEADS SECTION */}
      <section className="space-y-4">

        {isLoadingLeads ? (
          <div className="p-6 text-sm text-muted border border-dashed rounded-xl">
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="p-6 text-sm text-muted border border-dashed rounded-xl">
            No leads yet.
          </div>
        ) : (
          <div className="border rounded-xl shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full">

                <thead>
                  <tr className="text-xs uppercase text-gray-500 border-b">
                    <th className="p-4">Name</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Address</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b">

                      <td className="p-4 font-semibold">
                        <Link href={getLeadDetailHref(lead.id)}>
                          {lead.firstName} {lead.lastName}
                        </Link>
                      </td>

                      <td className="p-4">{lead.phone}</td>
                      <td className="p-4">{lead.email}</td>
                      <td className="p-4">{lead.propertyAddress}</td>

                      <td className="p-4">
                        {formatLeadTimestamp(lead.timestamp)}
                      </td>

                      <td className="p-4">
                        <PriorityBadge priority={lead.priority} />
                      </td>

                      <td className="p-4">
                        <span className="text-xs font-bold">
                          {lead.status}
                        </span>
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => void handleToggleStatus(lead)}
                          className="text-xs border px-2 py-1 rounded"
                        >
                          Toggle
                        </button>

                        <button
                          onClick={() => void handleDeleteLead(lead.id)}
                          className="text-xs border px-2 py-1 rounded text-red-600"
                        >
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}

      </section>

    </div>
  );
}

/* BADGES */

function FlagBadge({ label }: { label: string }) {
  return (
    <span className="px-2 py-1 text-xs rounded bg-gray-100">
      {label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: StoredLead["priority"] }) {
  const color =
    priority === "High"
      ? "text-red-600"
      : priority === "Medium"
      ? "text-yellow-600"
      : "text-gray-600";

  return <span className={`text-sm font-bold ${color}`}>{priority}</span>;
}