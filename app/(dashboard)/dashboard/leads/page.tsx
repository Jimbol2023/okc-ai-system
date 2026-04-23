"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";

import { deleteLead, fetchLeads } from "@/lib/leads-api";
import type { LeadStatus, StoredLead } from "@/lib/leads-storage";

/* =========================
   PIPELINE LOGIC
========================= */

function getNextPipelineStatus(status: LeadStatus): LeadStatus {
  if (status === "new") return "contacted";
  if (status === "contacted") return "negotiating";
  if (status === "negotiating") return "under_contract";
  if (status === "under_contract") return "closed";
  return "closed";
}

function getPipelineButtonLabel(status: LeadStatus) {
  if (status === "new") return "Mark Contacted";
  if (status === "contacted") return "Start Negotiation";
  if (status === "negotiating") return "Mark Under Contract";
  if (status === "under_contract") return "Mark Closed";
  return "Closed";
}

function getLeadNextAction(lead: StoredLead) {
  if (lead.priority === "High" && lead.status === "new") return "Call Now";
  if (lead.status === "contacted") return "Follow Up";
  if (lead.status === "negotiating") return "Negotiate";
  if (lead.status === "under_contract") return "Close Deal";
  if (lead.status === "closed") return "Closed";
  return "Monitor";
}

/* =========================
   HELPERS
========================= */

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

/* =========================
   API
========================= */

async function patchLeadStatus(id: string, status: LeadStatus) {
  const res = await fetch(`/api/leads/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    credentials: "include"
  });

  if (!res.ok) {
    let message = "Failed to update lead status.";

    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {}

    throw new Error(message);
  }

  const data = await res.json();
  return data.lead as StoredLead;
}

/* =========================
   MAIN COMPONENT
========================= */

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
        console.error(error);
        setPageError("Unable to load leads.");
      } finally {
        setIsLoadingLeads(false);
      }
    }

    void loadLeads();
  }, []);

  async function handleDeleteLead(id: string) {
    try {
      setLeads(await deleteLead(id));
    } catch {
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
      alert(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setUpdatingLeadId(null);
    }
  }

  const hotLeads = leads.filter(
    (lead) => lead.priority === "High" && lead.status === "new"
  );

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Leads</h1>

      {isLoadingLeads ? (
        <div>Loading leads...</div>
      ) : pageError ? (
        <div className="text-red-600">{pageError}</div>
      ) : (
        <>
          {/* HOT LEADS */}
          {hotLeads.length > 0 && (
            <div className="mb-6 rounded border bg-red-50 p-4">
              <h2 className="text-red-600 font-semibold">🔥 Hot Leads</h2>

              {hotLeads.map((lead) => {
                const isUpdating = updatingLeadId === lead.id;

                return (
                  <div key={lead.id} className="flex justify-between p-2">
                    <div>
                      {lead.firstName} {lead.lastName}
                    </div>

                    <button
                      onClick={() => handleAdvancePipeline(lead)}
                      disabled={isUpdating}
                      className="bg-red-600 text-white px-2 py-1 text-xs rounded"
                    >
                      {isUpdating ? "Updating..." : "Call Now"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* TABLE */}
          <table className="w-full border">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {leads.map((lead) => {
                const isUpdating = updatingLeadId === lead.id;
                const isClosed = lead.status === "closed";

                return (
                  <tr key={lead.id}>
                    <td>
                      <Link href={getLeadDetailHref(lead.id)}>
                        {lead.firstName} {lead.lastName}
                      </Link>
                    </td>

                    <td>
                      <StatusBadge status={lead.status} />
                    </td>

                    <td>
                      <button
                        onClick={() => handleAdvancePipeline(lead)}
                        disabled={isUpdating || isClosed}
                      >
                        {isUpdating
                          ? "Updating..."
                          : getPipelineButtonLabel(lead.status)}
                      </button>

                      <button onClick={() => handleDeleteLead(lead.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}