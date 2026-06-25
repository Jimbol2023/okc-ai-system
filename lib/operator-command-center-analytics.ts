import { formatLeadSourceTag, normalizeLeadSourceTag } from "@/lib/lead-source";
import type { StoredLead } from "@/lib/leads-storage";

export const OPERATOR_ANALYTICS_SNAPSHOTS_KEY = "jcapitalOperatorAnalyticsSnapshotsV1";
export const OPERATOR_ANALYTICS_SNAPSHOTS_EVENT = "jcapital-operator-analytics-snapshots-change";
const EMPTY_OPERATOR_ANALYTICS_SNAPSHOTS: OperatorAnalyticsSnapshot[] = [];

let cachedSnapshotsRaw: string | null = null;
let cachedSnapshots: OperatorAnalyticsSnapshot[] = EMPTY_OPERATOR_ANALYTICS_SNAPSHOTS;

export type EducationalPageSnapshot = {
  title: string;
  path: string;
  views: number;
};

export type OperatorAnalyticsSnapshot = {
  id: string;
  snapshotDate: string;
  websiteSessions: number;
  ga4Conversions: number;
  gbpCalls: number;
  contactFormSubmissions: number;
  youtubeViews: number;
  youtubeEngagement: number;
  topEducationalPages: EducationalPageSnapshot[];
};

export type OperatorAnalyticsSnapshotDraft = Omit<OperatorAnalyticsSnapshot, "id" | "topEducationalPages"> & {
  topEducationalPagesText: string;
};

export type SnapshotValidationResult = {
  valid: boolean;
  errors: string[];
  snapshot?: OperatorAnalyticsSnapshot;
};

export type TrendPoint = {
  label: string;
  value: number;
};

export type SourceTrendRow = {
  source: string;
  sourceLabel: string;
  total: number;
  points: TrendPoint[];
};

export type OperatorCommandCenterModel = {
  sourceTrends: SourceTrendRow[];
  websiteSessionsTrend: TrendPoint[];
  ga4ConversionsTrend: TrendPoint[];
  gbpCallsTrend: TrendPoint[];
  contactFormTrend: TrendPoint[];
  youtubeViewsTrend: TrendPoint[];
  youtubeEngagementTrend: TrendPoint[];
  topEducationalPages: EducationalPageSnapshot[];
  latestSnapshot: OperatorAnalyticsSnapshot | null;
  snapshotCount: number;
};

const NUMBER_FIELDS: Array<keyof Omit<OperatorAnalyticsSnapshotDraft, "snapshotDate" | "topEducationalPagesText">> = [
  "websiteSessions",
  "ga4Conversions",
  "gbpCalls",
  "contactFormSubmissions",
  "youtubeViews",
  "youtubeEngagement",
];

const DEFAULT_SOURCE_BUCKETS = 6;

function parseDate(value: string) {
  const timestamp = new Date(`${value}T00:00:00`).getTime();

  return Number.isNaN(timestamp) ? null : new Date(timestamp);
}

function toMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "2-digit" }).format(date);
}

function getLeadDate(lead: StoredLead) {
  const timestamp = new Date(lead.timestamp).getTime();

  return Number.isNaN(timestamp) ? new Date() : new Date(timestamp);
}

function normalizeNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.floor(parsed));
    }
  }

  return 0;
}

function createSnapshotId(snapshotDate: string) {
  return `snapshot-${snapshotDate}-${Date.now()}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function normalizeEducationalPages(value: unknown): EducationalPageSnapshot[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((page) => {
      if (!isRecord(page)) {
        return null;
      }

      const title = typeof page.title === "string" ? page.title.trim() : "";
      const path = typeof page.path === "string" ? page.path.trim() : "";

      if (!title || !path.startsWith("/")) {
        return null;
      }

      return {
        title,
        path,
        views: normalizeNumber(page.views),
      };
    })
    .filter((page): page is EducationalPageSnapshot => page !== null)
    .slice(0, 8);
}

function normalizeOperatorAnalyticsSnapshot(value: unknown): OperatorAnalyticsSnapshot | null {
  if (!isRecord(value)) {
    return null;
  }

  const snapshotDate = typeof value.snapshotDate === "string" ? value.snapshotDate.trim() : "";

  if (!snapshotDate || !parseDate(snapshotDate)) {
    return null;
  }

  return {
    id: typeof value.id === "string" && value.id.trim() ? value.id : `snapshot-${snapshotDate}`,
    snapshotDate,
    websiteSessions: normalizeNumber(value.websiteSessions),
    ga4Conversions: normalizeNumber(value.ga4Conversions),
    gbpCalls: normalizeNumber(value.gbpCalls),
    contactFormSubmissions: normalizeNumber(value.contactFormSubmissions),
    youtubeViews: normalizeNumber(value.youtubeViews),
    youtubeEngagement: normalizeNumber(value.youtubeEngagement),
    topEducationalPages: normalizeEducationalPages(value.topEducationalPages),
  };
}

function normalizeOperatorAnalyticsSnapshots(value: unknown): OperatorAnalyticsSnapshot[] {
  if (!Array.isArray(value)) {
    return EMPTY_OPERATOR_ANALYTICS_SNAPSHOTS;
  }

  const normalized = value
    .map(normalizeOperatorAnalyticsSnapshot)
    .filter((snapshot): snapshot is OperatorAnalyticsSnapshot => snapshot !== null)
    .sort((a, b) => a.snapshotDate.localeCompare(b.snapshotDate));

  return normalized.length === 0 ? EMPTY_OPERATOR_ANALYTICS_SNAPSHOTS : normalized;
}

function parseTopEducationalPages(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title = "", path = "", views = "0"] = line.split("|").map((part) => part.trim());

      return {
        title,
        path,
        views: normalizeNumber(views),
      };
    })
    .filter((page) => page.title && page.path.startsWith("/") && page.views >= 0)
    .slice(0, 8);
}

export function validateOperatorAnalyticsSnapshotDraft(draft: OperatorAnalyticsSnapshotDraft): SnapshotValidationResult {
  const errors: string[] = [];
  const snapshotDate = draft.snapshotDate.trim();

  if (!snapshotDate || !parseDate(snapshotDate)) {
    errors.push("Snapshot date is required.");
  }

  NUMBER_FIELDS.forEach((field) => {
    const value = draft[field];

    if (!Number.isFinite(value) || value < 0) {
      errors.push(`${field} must be a non-negative number.`);
    }
  });

  const topEducationalPages = parseTopEducationalPages(draft.topEducationalPagesText);

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    snapshot: {
      id: createSnapshotId(snapshotDate),
      snapshotDate,
      websiteSessions: normalizeNumber(draft.websiteSessions),
      ga4Conversions: normalizeNumber(draft.ga4Conversions),
      gbpCalls: normalizeNumber(draft.gbpCalls),
      contactFormSubmissions: normalizeNumber(draft.contactFormSubmissions),
      youtubeViews: normalizeNumber(draft.youtubeViews),
      youtubeEngagement: normalizeNumber(draft.youtubeEngagement),
      topEducationalPages,
    },
  };
}

export function readOperatorAnalyticsSnapshots() {
  if (typeof window === "undefined") {
    return EMPTY_OPERATOR_ANALYTICS_SNAPSHOTS;
  }

  try {
    const rawSnapshots = window.localStorage.getItem(OPERATOR_ANALYTICS_SNAPSHOTS_KEY);

    if (!rawSnapshots) {
      cachedSnapshotsRaw = null;
      cachedSnapshots = EMPTY_OPERATOR_ANALYTICS_SNAPSHOTS;

      return cachedSnapshots;
    }

    if (rawSnapshots === cachedSnapshotsRaw) {
      return cachedSnapshots;
    }

    const parsed = JSON.parse(rawSnapshots) as unknown;
    const parsedSnapshots = normalizeOperatorAnalyticsSnapshots(parsed);

    cachedSnapshotsRaw = rawSnapshots;
    cachedSnapshots = parsedSnapshots;

    return cachedSnapshots;
  } catch {
    cachedSnapshotsRaw = null;
    cachedSnapshots = EMPTY_OPERATOR_ANALYTICS_SNAPSHOTS;

    return cachedSnapshots;
  }
}

export function saveOperatorAnalyticsSnapshots(snapshots: OperatorAnalyticsSnapshot[]) {
  if (typeof window === "undefined") {
    return snapshots;
  }

  const nextSnapshots = normalizeOperatorAnalyticsSnapshots(snapshots).slice(-24);
  const nextRawSnapshots = JSON.stringify(nextSnapshots);

  window.localStorage.setItem(OPERATOR_ANALYTICS_SNAPSHOTS_KEY, nextRawSnapshots);
  cachedSnapshotsRaw = nextRawSnapshots;
  cachedSnapshots = nextSnapshots;
  window.dispatchEvent(new Event(OPERATOR_ANALYTICS_SNAPSHOTS_EVENT));

  return nextSnapshots;
}

export function subscribeToOperatorAnalyticsSnapshots(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(OPERATOR_ANALYTICS_SNAPSHOTS_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(OPERATOR_ANALYTICS_SNAPSHOTS_EVENT, onStoreChange);
  };
}

function getSourceTrendRows(leads: StoredLead[], bucketCount = DEFAULT_SOURCE_BUCKETS): SourceTrendRow[] {
  const now = new Date();
  const bucketDates = Array.from({ length: bucketCount }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (bucketCount - index - 1), 1);

    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: toMonthLabel(date),
    };
  });
  const sourceMap = new Map<string, Map<string, number>>();

  leads.forEach((lead) => {
    const leadDate = getLeadDate(lead);
    const key = `${leadDate.getFullYear()}-${String(leadDate.getMonth() + 1).padStart(2, "0")}`;
    const source = normalizeLeadSourceTag(lead.source);
    const current = sourceMap.get(source) ?? new Map<string, number>();

    current.set(key, (current.get(key) ?? 0) + 1);
    sourceMap.set(source, current);
  });

  return [...sourceMap.entries()]
    .map(([source, values]) => {
      const points = bucketDates.map((bucket) => ({
        label: bucket.label,
        value: values.get(bucket.key) ?? 0,
      }));

      return {
        source,
        sourceLabel: formatLeadSourceTag(source),
        total: points.reduce((sum, point) => sum + point.value, 0),
        points,
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);
}

function getSnapshotTrend(snapshots: OperatorAnalyticsSnapshot[], field: keyof OperatorAnalyticsSnapshot) {
  return snapshots.slice(-8).map((snapshot) => ({
    label: snapshot.snapshotDate.slice(5),
    value: normalizeNumber(snapshot[field]),
  }));
}

function getTopEducationalPages(snapshots: OperatorAnalyticsSnapshot[]) {
  const pageMap = new Map<string, EducationalPageSnapshot>();

  snapshots.forEach((snapshot) => {
    (snapshot.topEducationalPages ?? []).forEach((page) => {
      const current = pageMap.get(page.path);

      pageMap.set(page.path, {
        title: current?.title ?? page.title,
        path: page.path,
        views: (current?.views ?? 0) + page.views,
      });
    });
  });

  return [...pageMap.values()].sort((a, b) => b.views - a.views).slice(0, 8);
}

export function createOperatorCommandCenterModel(
  leads: StoredLead[],
  snapshots: OperatorAnalyticsSnapshot[]
): OperatorCommandCenterModel {
  const safeLeads = Array.isArray(leads) ? leads : [];
  const sortedSnapshots = normalizeOperatorAnalyticsSnapshots(snapshots);

  return {
    sourceTrends: getSourceTrendRows(safeLeads),
    websiteSessionsTrend: getSnapshotTrend(sortedSnapshots, "websiteSessions"),
    ga4ConversionsTrend: getSnapshotTrend(sortedSnapshots, "ga4Conversions"),
    gbpCallsTrend: getSnapshotTrend(sortedSnapshots, "gbpCalls"),
    contactFormTrend: getSnapshotTrend(sortedSnapshots, "contactFormSubmissions"),
    youtubeViewsTrend: getSnapshotTrend(sortedSnapshots, "youtubeViews"),
    youtubeEngagementTrend: getSnapshotTrend(sortedSnapshots, "youtubeEngagement"),
    topEducationalPages: getTopEducationalPages(sortedSnapshots),
    latestSnapshot: sortedSnapshots.at(-1) ?? null,
    snapshotCount: sortedSnapshots.length,
  };
}
