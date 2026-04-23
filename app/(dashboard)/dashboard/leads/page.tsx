"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";

import { deleteLead, fetchLeads } from "@/lib/leads-api";
import type { StoredLead } from "@/lib/leads-storage";

function getLeadNextAction(lead: StoredLead) {
  if (lead.priority === "High" && lead.status === "new") {
    return "Call Now";
  }

  if (lead.status === "contacted") {
    return "Follow Up";
  }

  return "Monitor";
}

function getLeadDetailHref(id: string) {
  return `/dashboard/leads/${id}` as Route;
}

function formatLeadTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString();
}

function PriorityBadge({ priority }: { priority: string }) {
  const color =
    priority === "High"
      ? "text-red-600"
      : priority === "Medium"
        ? "text-yellow-600"
        : "text-gray-500";

  return <span className={`text-xs font-bold ${color}`}>{priority}</span>;
}

type LeadStatus = "new" | "contacted" | "negotiating" | "under_contract" | "closed";

async function patchLeadStatus(id: string, status: LeadStatus) {
  const payload = { status };

  // Try the dedicated status route first
  let res = await fetch(`/api/leads/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  // Fallback in case your project is using PATCH /api/leads/[id]
  if (res.status === 404) {
    res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
  }

  if (!res.ok) {
    let message = "Failed to update lead status.";

    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore json parse failure
    }

    throw new Error(message);
  }

  const data = await res.json();

  // Support either { lead: ... } or direct object return shapes
  return (data?.lead ?? data) as StoredLead;
}

export default function DashboardLeadsPage() {
  const [leads, setLeads] = useState<StoredLead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLeads() {
      try {
        setPageError(null);
        const data = await fetchLeads();
        setLeads(data);
      } catch (error) {
        console.error("Failed to load leads:", error);
        setPageError("Unable to load leads right now.");
      } finally {
        setIsLoadingLeads(false);
      }
    }

    void loadLeads();
  }, []);

  async function handleDeleteLead(id: string) {
    try {
      setLeads(await deleteLead(id));
    } catch (error) {
      console.error("Delete lead error:", error);
      alert("Failed to delete lead.");
    }
  }

  async function handleToggleStatus(lead: StoredLead) {
    const nextStatus: LeadStatus = lead.status === "new" ? "contacted" : "new";

    try {
      setUpdatingLeadId(lead.id);

      const updatedLead = await patchLeadStatus(lead.id, nextStatus);

      setLeads((prev) =>
        prev.map((l) => (l.id === updatedLead.id ? updatedLead : l))
      );
    } catch (error) {
      console.error("Status update error:", error);
      alert(error instanceof Error ? error.message : "Failed to update lead status.");
    } finally {
      setUpdatingLeadId(null);
    }
  }

  const hotLeads = leads.filter(
    (lead) => lead.priority === "High" && lead.status === "new"
  );

  return (
    <div className="p-6">
      <section>
        <h1 className="mb-4 text-2xl font-semibold">Leads</h1>

        {isLoadingLeads ? (
          <div className="p-6 text-gray-500">Loading leads...</div>
        ) : pageError ? (
          <div className="p-6 text-red-600">{pageError}</div>
        ) : (
          <>
            {hotLeads.length > 0 && (
              <div className="mb-6 rounded-lg border bg-red-50 p-4">
                <h2 className="text-lg font-semibold text-red-600">🔥 Hot Leads</h2>
                <p className="mb-3 text-sm text-gray-600">
                  High-priority leads that need immediate action
                </p>

                <div className="space-y-2">
                  {hotLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-center justify-between rounded border bg-white p-3"
                    >
                      <div>
                        <p className="font-semibold">
                          {lead.firstName} {lead.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{lead.propertyAddress}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <PriorityBadge priority={lead.priority} />

                        <Link
                          href={getLeadDetailHref(lead.id)}
                          className="text-xs underline"
                        >
                          View
                        </Link>

                        <button
                          onClick={() => void handleToggleStatus(lead)}
                          disabled={updatingLeadId === lead.id}
                          className="rounded bg-red-600 px-2 py-1 text-xs text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingLeadId === lead.id ? "Updating..." : "Call Now"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {leads.length === 0 ? (
              <div className="p-6 text-gray-500">No leads yet.</div>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b text-xs uppercase text-gray-500">
                      <th className="p-4">Name</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Address</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Score</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Next Action</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {leads.map((lead) => {
                      const action = getLeadNextAction(lead);
                      const isUpdating = updatingLeadId === lead.id;

                      return (
                        <tr key={lead.id} className="border-b">
                          <td className="p-4 font-semibold">
                            <Link href={getLeadDetailHref(lead.id)}>
                              {lead.firstName} {lead.lastName}
                            </Link>
                          </td>

                          <td className="p-4">{lead.phone}</td>
                          <td className="p-4">{lead.email}</td>
                          <td className="p-4">{lead.propertyAddress}</td>

                          <td className="p-4">{formatLeadTimestamp(lead.timestamp)}</td>

                          <td className="p-4">
                            <PriorityBadge priority={lead.priority} />
                          </td>

                          <td className="p-4">
                            <span className="text-xs font-bold">{lead.status}</span>
                          </td>

                          <td className="p-4">
                            <span
                              className={`rounded px-2 py-1 text-xs font-semibold ${
                                action === "Call Now"
                                  ? "bg-red-100 text-red-700"
                                  : action === "Follow Up"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {action}
                            </span>
                          </td>

                          <td className="space-x-2 p-4 text-right">
                            <button
                              onClick={() => void handleToggleStatus(lead)}
                              disabled={isUpdating}
                              className="rounded border px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isUpdating
                                ? "Updating..."
                                : lead.status === "new"
                                  ? "Mark Contacted"
                                  : "Mark New"}
                            </button>

                            <button
                              onClick={() => void handleDeleteLead(lead.id)}
                              disabled={isUpdating}
                              className="rounded border px-2 py-1 text-xs text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}