"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";

import { deleteLead, fetchLeads, updateLead } from "@/lib/leads-api";
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

  const hotLeads = leads.filter(
    (lead) => lead.priority === "High" && lead.status === "new"
  );

  return (
    <div className="p-6">
      <section>
        <h1 className="text-2xl font-semibold mb-4">Leads</h1>

        {isLoadingLeads ? (
          <div className="p-6 text-gray-500">Loading leads...</div>
        ) : (
          <>
            {/* HOT LEADS */}
            {hotLeads.length > 0 && (
              <div className="mb-6 p-4 border rounded-lg bg-red-50">
                <h2 className="text-lg font-semibold text-red-600">
                  🔥 Hot Leads
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  High-priority leads that need immediate action
                </p>

                <div className="space-y-2">
                  {hotLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="flex justify-between items-center p-3 bg-white border rounded"
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
                          onClick={() => void handleToggleStatus(lead)}
                          className="text-xs bg-red-600 text-white px-2 py-1 rounded"
                        >
                          Call Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TABLE */}
            {leads.length === 0 ? (
              <div className="p-6 text-gray-500">No leads yet.</div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-xs uppercase text-gray-500 border-b">
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

                        <td className="p-4">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {getLeadNextAction(lead)}
                          </span>
                        </td>

                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => void handleToggleStatus(lead)}
                            className="text-xs border px-2 py-1 rounded"
                          >
                            {lead.status === "new"
                              ? "Mark Contacted"
                              : "Mark New"}
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
            )}
          </>
        )}
      </section>
    </div>
  );
}