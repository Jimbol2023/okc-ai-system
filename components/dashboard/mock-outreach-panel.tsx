"use client";

import { useState } from "react";

type MockOutreachHistoryItem = {
  id: string;
  at: string;
  provider: "mock" | "not_called";
  mode: "simulation" | "live_disabled";
  simulated: boolean;
  blocked: boolean;
  sent: false;
  wouldSend: false;
  providerCalled?: false;
  targetPhone?: string | null;
  messagePreview?: string | null;
  reasonCodes: string[];
  reasons: string[];
  missingRequirements: string[];
};

type MockOutreachLeadSummary = {
  id: string;
  phone?: string | null;
  latestMockOutreachAt?: string | null;
  latestMockOutreachResult?: string | null;
  latestMockOutreachMessage?: string | null;
  latestMockOutreachBlockedReasons?: string[];
  mockOutreachHistory?: MockOutreachHistoryItem[];
};

type MockOutreachLeadUpdate = Omit<Partial<MockOutreachLeadSummary>, "phone"> & {
  phone?: string;
};

type MockOutreachPanelProps = {
  lead: MockOutreachLeadSummary;
  compact?: boolean;
  onLeadUpdate?: (lead: MockOutreachLeadUpdate) => void;
};

type MockOutreachApiResponse = {
  ok: boolean;
  lead?: MockOutreachLeadUpdate;
  result?: MockOutreachHistoryItem & {
    safetyCopy?: string[];
  };
  error?: string;
};

function formatDate(value?: string | null) {
  if (!value) return "No simulation recorded";
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "Unknown time" : date.toLocaleString();
}

function getHistory(lead: MockOutreachPanelProps["lead"]) {
  return Array.isArray(lead.mockOutreachHistory) ? lead.mockOutreachHistory.slice(0, 4) : [];
}

export function MockOutreachPanel({ lead, compact = false, onLeadUpdate }: MockOutreachPanelProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<MockOutreachApiResponse["result"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runSimulation() {
    try {
      setIsRunning(true);
      setError(null);
      const response = await fetch(`/api/leads/${lead.id}/mock-outreach`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });
      const data = (await response.json()) as MockOutreachApiResponse;

      if (!response.ok || !data.ok || !data.result) {
        throw new Error(data.error || "Mock outreach simulation failed.");
      }

      setResult(data.result);
      if (data.lead && onLeadUpdate) {
        onLeadUpdate(data.lead);
      }
    } catch (simulationError) {
      setError(simulationError instanceof Error ? simulationError.message : "Mock outreach simulation failed.");
    } finally {
      setIsRunning(false);
    }
  }

  const history = getHistory(lead);

  return (
    <div className="rounded border bg-white p-3 text-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-gray-500">Mock outreach testing</p>
          <p className="mt-1 font-bold text-gray-950">Mock simulation only</p>
          <p className="mt-1 text-gray-600">No SMS or email was sent. Live outreach remains disabled.</p>
        </div>
        <button
          type="button"
          onClick={runSimulation}
          disabled={isRunning}
          className="rounded border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRunning ? "Simulating..." : "Simulate Mock Outreach"}
        </button>
      </div>

      {error ? <p className="mt-3 rounded border border-red-200 bg-red-50 p-2 font-semibold text-red-700">{error}</p> : null}

      {result ? (
        <div className="mt-3 rounded border bg-gray-50 p-3">
          <div className="flex flex-wrap gap-2">
            <span className="rounded border bg-white px-2 py-1 text-xs font-bold">provider: {result.provider}</span>
            <span className="rounded border bg-white px-2 py-1 text-xs font-bold">sent:false</span>
            <span className="rounded border bg-white px-2 py-1 text-xs font-bold">wouldSend:false</span>
            <span className="rounded border bg-white px-2 py-1 text-xs font-bold">providerCalled:false</span>
            <span className="rounded border bg-white px-2 py-1 text-xs font-bold">{result.blocked ? "blocked" : "simulated result"}</span>
          </div>
          {result.messagePreview ? (
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase text-gray-500">Message preview</p>
              <p className="mt-1 text-gray-700">{result.messagePreview}</p>
            </div>
          ) : null}
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase text-gray-500">Reason codes</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {result.reasonCodes.map((code) => (
                <span key={code} className="rounded border bg-white px-2 py-1 text-xs font-semibold text-gray-700">
                  {code}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-3 rounded border bg-gray-50 p-3">
        <p className="text-xs font-semibold uppercase text-gray-500">Latest simulation</p>
        <p className="mt-1 font-semibold text-gray-900">{lead.latestMockOutreachResult ?? "No mock outreach simulation yet"}</p>
        <p className="text-gray-600">{formatDate(lead.latestMockOutreachAt)}</p>
        {lead.latestMockOutreachMessage && !compact ? <p className="mt-2 text-gray-700">{lead.latestMockOutreachMessage}</p> : null}
        {lead.latestMockOutreachBlockedReasons && lead.latestMockOutreachBlockedReasons.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {lead.latestMockOutreachBlockedReasons.slice(0, compact ? 3 : 8).map((reason) => (
              <span key={reason} className="rounded border bg-white px-2 py-1 text-xs font-semibold text-gray-700">
                {reason}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {!compact && history.length > 0 ? (
        <div className="mt-3 rounded border bg-white p-3">
          <p className="text-xs font-semibold uppercase text-gray-500">Recent mock outreach activity</p>
          <div className="mt-2 space-y-2">
            {history.map((item) => (
              <div key={item.id} className="rounded border bg-gray-50 p-2">
                <p className="font-semibold text-gray-900">{item.blocked ? "Blocked simulation" : "Mock simulation result"}</p>
                <p className="text-xs text-gray-500">{formatDate(item.at)}</p>
                <p className="mt-1 text-gray-700">provider: {item.provider}; sent:false; wouldSend:false; providerCalled:false</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
