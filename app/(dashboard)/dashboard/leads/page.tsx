"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult
} from "@hello-pangea/dnd";

import { deleteLead, fetchLeads } from "@/lib/leads-api";
import type { LeadStatus, StoredLead } from "@/lib/leads-storage";

const PIPELINE_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "negotiating",
  "under_contract",
  "closed"
];

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

function formatStatus(status: LeadStatus) {
  return status.replace("_", " ");
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
      {formatStatus(status)}
    </span>
  );
}

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

export default function DashboardLeadsPage() {
  const [leads, setLeads] = useState<StoredLead[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "pipeline">("table");
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

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return;

    const leadId = result.draggableId;
    const nextStatus = result.destination.droppableId as LeadStatus;

    const lead = leads.find((item) => item.id === leadId);
    if (!lead || lead.status === nextStatus) return;

    try {
      setUpdatingId(leadId);
      const updated = await patchLeadStatus(leadId, nextStatus);

      setLeads((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
    } catch {
      alert("Drag update failed.");
    } finally {
      setUpdatingId(null);
    }
  }

  const groupedLeads = PIPELINE_STATUSES.map((status) => ({
    status,
    leads: leads.filter((lead) => lead.status === status)
  }));

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Leads</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("table")}
            className={`rounded border px-3 py-1 text-xs ${
              viewMode === "table" ? "bg-gray-900 text-white" : "bg-white"
            }`}
          >
            Table View
          </button>

          <button
            onClick={() => setViewMode("pipeline")}
            className={`rounded border px-3 py-1 text-xs ${
              viewMode === "pipeline" ? "bg-gray-900 text-white" : "bg-white"
            }`}
          >
            Pipeline View
          </button>
        </div>
      </div>

      {leads.length === 0 ? (
        <div>No leads yet.</div>
      ) : viewMode === "pipeline" ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {groupedLeads.map((group) => (
              <Droppable droppableId={group.status} key={group.status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-w-[240px] rounded border bg-gray-50 p-3"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="text-sm font-bold capitalize">
                        {formatStatus(group.status)}
                      </h2>
                      <span className="rounded bg-white px-2 py-1 text-xs font-semibold">
                        {group.leads.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {group.leads.length === 0 && (
                        <div className="rounded border border-dashed bg-white p-3 text-xs text-gray-400">
                          No leads
                        </div>
                      )}

                      {group.leads.map((lead, index) => {
                        const isUpdating = updatingId === lead.id;
                        const isClosed = lead.status === "closed";

                        return (
                          <Draggable
                            key={lead.id}
                            draggableId={lead.id}
                            index={index}
                          >
                            {(dragProvided) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                className="rounded border bg-white p-3 shadow-sm"
                              >
                                <Link
                                  href={`/dashboard/leads/${lead.id}` as Route}
                                  className="font-semibold"
                                >
                                  {lead.firstName} {lead.lastName}
                                </Link>

                                <p className="mt-1 text-xs text-gray-500">
                                  {lead.propertyAddress}
                                </p>

                                <div className="mt-3">
                                  <StatusBadge status={lead.status} />
                                </div>

                                <button
                                  onClick={() => handleAdvance(lead)}
                                  disabled={isUpdating || isClosed}
                                  className="mt-3 w-full rounded border px-2 py-1 text-xs disabled:opacity-50"
                                >
                                  {isUpdating
                                    ? "Updating..."
                                    : getPipelineButtonLabel(lead.status)}
                                </button>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}

                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
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

                  <td className="space-x-2 p-3 text-right">
                    <button
                      onClick={() => handleAdvance(lead)}
                      disabled={isUpdating || isClosed}
                      className="rounded border px-2 py-1 text-xs disabled:opacity-50"
                    >
                      {isUpdating
                        ? "Updating..."
                        : getPipelineButtonLabel(lead.status)}
                    </button>

                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="rounded border px-2 py-1 text-xs text-red-600"
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