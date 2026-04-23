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
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        const data = await fetchLeads();
        setLeads(data);
      } catch {
        setError("Failed to load leads.");
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, []);

  async function handleDelete(id: string) {
    try {
      setLeads(await deleteLead(id));
    } catch {
      alert("Delete failed");
    }
  }

  async function handleAdvance(lead: StoredLead) {
    const next = getNextPipelineStatus(lead.status);

    try {
      setUpdatingId(lead.id);
      const updated = await patchLeadStatus(lead.id, next);

      setLeads((prev) =>
        prev.map((l) => (l.id === updated.id ? updated : l))
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : "Update failed");
    } finally {
      setUpdatingId(null);
    }
  }

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Leads</h1>

      {leads.length === 0 ? (
        <div>No leads yet.</div>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="border-b text-xs uppercase text-gray-500">
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Address</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => {
              const isUpdating = updatingId === lead.id;
              const isClosed = lead.status === "closed";

              return (
                <tr key={lead.id} className="border-b">
                  <td className="p-3 font-semibold">
                    <Link href={`/dashboard/leads/${lead.id}` as Route}>
                      {lead.firstName} {lead.lastName}
                    </Link>
                  </td>

                  <td className="p-3">{lead.phone}</td>
                  <td className="p-3">{lead.propertyAddress}</td>

                  <td className="p-3">
                    <StatusBadge status={lead.status} />
                  </td>

                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleAdvance(lead)}
                      disabled={isUpdating || isClosed}
                      className="border px-2 py-1 text-xs rounded disabled:opacity-50"
                    >
                      {isUpdating
                        ? "Updating..."
                        : getPipelineButtonLabel(lead.status)}
                    </button>

                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="border px-2 py-1 text-xs text-red-600 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}