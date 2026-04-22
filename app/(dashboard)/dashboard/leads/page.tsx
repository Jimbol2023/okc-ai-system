"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";

type StoredLead = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  propertyAddress: string;
  timestamp: string;
  priority: "High" | "Medium" | "Low";
  status: "new" | "contacted";
};

// ✅ FIXED (Type-safe + simple)
function getLeadNextAction(lead: StoredLead) {
  if (lead.priority === "High" && lead.status === "new") {
    return "Call Now";
  }

  if (lead.status === "contacted") {
    return "Follow Up";
  }

  return "Monitor";
}

// ✅ FIXED Route typing
function getLeadDetailHref(id: string) {
  return `/dashboard/leads/${id}` as Route;
}

// Mock API (safe placeholders)
async function fetchLeads(): Promise<StoredLead[]> {
  return [];
}

async function deleteLead(id: string): Promise<StoredLead[]> {
  return [];
}

async function updateLead(lead: StoredLead): Promise<StoredLead> {
  return lead;
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

    setLeads((prev) =>
      prev.map((l) => (l.id === updated.id ? updated : l))
    );
  }

  return (
    <div className="p-6">
      <section>
        <h1 className="text-2xl font-semibold mb-4">Leads</h1>

        {isLoadingLeads ? (
          <div className="p-6 text-gray-500">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-6 text-gray-500">No leads yet.</div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full text-sm">

              {/* HEADER */}
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

              {/* BODY */}
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

                    {/* ✅ NEXT ACTION */}
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
        )}
      </section>
    </div>
  );
}