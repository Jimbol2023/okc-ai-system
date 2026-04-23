"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";

import { deleteLead, fetchLeads } from "@/lib/leads-api";
import type { LeadStatus, StoredLead } from "@/lib/leads-storage";

function getLeadNextAction(lead: StoredLead) {
  if (lead.priority === "High" && lead.status === "new") return "Call Now";
  if (lead.status === "contacted") return "Follow Up";
  if (lead.status === "negotiating") return "Negotiate";
  if (lead.status === "under_contract") return "Close Deal";
  if (lead.status === "closed") return "Closed";

  return "Monitor";
}

function getPipelineButtonLabel(status: LeadStatus) {
  if (status === "new") return "Mark Contacted";
  if (status === "contacted") return "Start Negotiation";
  if (status === "negotiating") return "Mark Under Contract";
  if (status === "under_contract") return "Mark Closed";

  return "Closed";
}

function getNextPipelineStatus(status: LeadStatus): LeadStatus {
  if (status === "new") return "contacted";
  if (status === "contacted") return "negotiating";
  if (status === "negotiating") return "under_contract";
  if (status === "under_contract") return "closed";

  return "closed";
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

function StatusBadge({ status }: { status: LeadStatus }) {
  const color =
    status === "closed"
      ? "bg-green-100 text-green-700"
      : status === "under_contract"
        ? "bg-blue-100 text-blue-700"
        : status === "negotiating"
          ? "bg-purple-100 text-purple-700"
          : status === "contacted"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-gray-100 text-gray-700";

  return (
    <span className={`rounded px-2 py-1 text-xs font-bold ${color}`}>
      {status.replace("_", " ")}
    </span>
  );
}

async function patchLeadStatus(id: string, status: LeadStatus) {
  const res = await fetch(`/api/leads/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status }),
    credentials: "include"
  });

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
  return data.lead as StoredLead;
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

  async function handleAdvancePipeline(lead: StoredLead) {
    const nextStatus = getNextPipelineStatus(lead.status);

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
                  {hotLeads.map((lead) => {
                    const isUpdating = updatingLeadId === lead.id;

                    return (
                      <div
                        key={lead.id}
                        className="flex items-center justify-between rounded border bg-white p-3"
                      >
                        <div>
                          <p className="font-semibold">
                            {lead.firstName} {lead.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {lead.propertyAddress}
                          </p>
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
                            onClick={() => void handleAdvancePipeline(lead)}
                            disabled={isUpdating || lead.status === "closed"}
                            className="rounded bg-red-600 px-2 py-1 text-xs text-white disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isUpdating ? "Updating..." : "Call Now"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
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
                      const isClosed = lead.status === "closed";

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
                            <StatusBadge status={lead.status} />
                          </td>

                          <td className="p-4">
                            <span className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                              {action}
                            </span>
                          </td>

                          <td className="space-x-2 p-4 text-right">
                            <button
                              onClick={() => void handleAdvancePipeline(lead)}
                              disabled={isUpdating || isClosed}
                              className="rounded border px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isUpdating
                                ? "Updating..."
                                : getPipelineButtonLabel(lead.status)}
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