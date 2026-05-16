"use client";

import { useEffect, useState } from "react";

type AiMemoryEvent = {
  id: string;
  leadId: string | null;
  eventType: string;
  source: string;
  sellerReply: string | null;
  aiSuggestedReply: string | null;
  humanFinalReply: string | null;
  approvalDecision: string | null;
  messageStatus: string | null;
  outcome: string | null;
  createdAt: string;
};

type AiMemoryResponse = {
  success?: boolean;
  events?: AiMemoryEvent[];
  error?: string;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function getSummary(event: AiMemoryEvent) {
  if (event.humanFinalReply) {
    return event.humanFinalReply;
  }

  if (event.aiSuggestedReply) {
    return event.aiSuggestedReply;
  }

  if (event.sellerReply) {
    return event.sellerReply;
  }

  if (event.approvalDecision) {
    return `Decision: ${event.approvalDecision}`;
  }

  if (event.messageStatus) {
    return `Message status: ${event.messageStatus}`;
  }

  return event.outcome || "Memory event recorded.";
}

function shorten(value: string | null) {
  if (!value) {
    return "No lead";
  }

  return value.slice(0, 8);
}

export default function AiMemoryPanel() {
  const [events, setEvents] = useState<AiMemoryEvent[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMemoryEvents() {
      try {
        const res = await fetch("/api/ai-memory?limit=10", {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });
        const data = (await res.json()) as AiMemoryResponse;

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to load AI memory events.");
        }

        setEvents(data.events ?? []);
        setError("");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load AI memory events.",
        );
      }
    }

    loadMemoryEvents();
  }, []);

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">AI Memory / Learning Events</h2>
      <p className="mt-2 text-sm text-slate-600">
        Recent structured learning events from replies, approvals, sends, and outcomes.
      </p>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {events.length > 0 ? (
        <div className="mt-4 space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    {event.eventType}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Lead {shorten(event.leadId)} · {event.source}
                  </p>
                </div>
                <p className="text-xs text-slate-500">{formatDateTime(event.createdAt)}</p>
              </div>
              <p className="mt-3 text-sm text-slate-700">{getSummary(event)}</p>
              {event.outcome ? (
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  Outcome: {event.outcome}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-600">
          No AI memory events have been recorded yet.
        </p>
      )}
    </section>
  );
}
