/**
 * Source format classification types and deterministic metadata.
 * This module provides foundational types and metadata for classifying
 * county/public-record source formats for future ingestion planning.
 *
 * Strictly metadata and deterministic planning info only.
 *
 * Source formats classified:
 * - pdf
 * - csv
 * - html_table
 * - scanned_image
 * - spreadsheet
 * - manual_entry
 * - mixed_source
 * - unknown
 *
 * Metadata:
 * - confidence: number representing confidence score (0-1 about format determination)
 * - requiresHumanReview: whether source requires human to review before ingestion
 * - requiresOCR: whether OCR is needed
 * - structuredDataLikelihood: likelihood (0-1) that structured data exists for direct parsing
 * - normalizationReadiness: score (0-1) how ready source is for normalization
 * - ingestionBlockedByDefault: boolean indicating if ingestion is blocked by default
 * - automationBlockedByDefault: boolean indicating if ingestion automation is blocked by default
 * - parserPlanningOnly: boolean marking if used only for planning parser design, no runtime effect
 */

export type SourceFormat =
  | "pdf"
  | "csv"
  | "html_table"
  | "scanned_image"
  | "spreadsheet"
  | "manual_entry"
  | "mixed_source"
  | "unknown";

export interface SourceFormatClassification {
  format: SourceFormat;
  confidence: number; // 0 to 1
  requiresHumanReview: boolean;
  requiresOCR: boolean;
  structuredDataLikelihood: number; // 0 to 1
  normalizationReadiness: number; // 0 to 1
  ingestionBlockedByDefault: boolean;
  automationBlockedByDefault: boolean;
  parserPlanningOnly: boolean;
}

export interface SourceFormatClassificationInput {
  filename?: string | null;
  fileExtension?: string | null;
  declaredContentType?: string | null;
  sourceLabel?: string | null;
  notes?: string | null;
  description?: string | null;
}

// Deterministic static metadata defaults for source formats
export const SourceFormatMetadata: Record<SourceFormat, Omit<SourceFormatClassification, "format">> = {
  pdf: {
    confidence: 0.95,
    requiresHumanReview: true,
    requiresOCR: true,
    structuredDataLikelihood: 0.2,
    normalizationReadiness: 0.1,
    ingestionBlockedByDefault: true,
    automationBlockedByDefault: true,
    parserPlanningOnly: false,
  },
  csv: {
    confidence: 0.99,
    requiresHumanReview: false,
    requiresOCR: false,
    structuredDataLikelihood: 0.95,
    normalizationReadiness: 0.9,
    ingestionBlockedByDefault: false,
    automationBlockedByDefault: false,
    parserPlanningOnly: false,
  },
  html_table: {
    confidence: 0.85,
    requiresHumanReview: true,
    requiresOCR: false,
    structuredDataLikelihood: 0.7,
    normalizationReadiness: 0.7,
    ingestionBlockedByDefault: true,
    automationBlockedByDefault: true,
    parserPlanningOnly: true,
  },
  scanned_image: {
    confidence: 0.75,
    requiresHumanReview: true,
    requiresOCR: true,
    structuredDataLikelihood: 0.05,
    normalizationReadiness: 0.05,
    ingestionBlockedByDefault: true,
    automationBlockedByDefault: true,
    parserPlanningOnly: false,
  },
  spreadsheet: {
    confidence: 0.9,
    requiresHumanReview: true,
    requiresOCR: false,
    structuredDataLikelihood: 0.9,
    normalizationReadiness: 0.85,
    ingestionBlockedByDefault: false,
    automationBlockedByDefault: false,
    parserPlanningOnly: false,
  },
  manual_entry: {
    confidence: 0.95,
    requiresHumanReview: true,
    requiresOCR: false,
    structuredDataLikelihood: 0.0,
    normalizationReadiness: 0.1,
    ingestionBlockedByDefault: true,
    automationBlockedByDefault: true,
    parserPlanningOnly: false,
  },
  mixed_source: {
    confidence: 0.7,
    requiresHumanReview: true,
    requiresOCR: false,
    structuredDataLikelihood: 0.5,
    normalizationReadiness: 0.4,
    ingestionBlockedByDefault: true,
    automationBlockedByDefault: true,
    parserPlanningOnly: true,
  },
  unknown: {
    confidence: 0.0,
    requiresHumanReview: true,
    requiresOCR: false,
    structuredDataLikelihood: 0.0,
    normalizationReadiness: 0.0,
    ingestionBlockedByDefault: true,
    automationBlockedByDefault: true,
    parserPlanningOnly: false,
  },
};

type FormatSignal = {
  format: SourceFormat;
  strength: number;
};

const extensionFormatMap: Record<string, SourceFormat> = {
  ".csv": "csv",
  ".htm": "html_table",
  ".html": "html_table",
  ".jpeg": "scanned_image",
  ".jpg": "scanned_image",
  ".pdf": "pdf",
  ".png": "scanned_image",
  ".tif": "scanned_image",
  ".tiff": "scanned_image",
  ".xls": "spreadsheet",
  ".xlsm": "spreadsheet",
  ".xlsx": "spreadsheet",
};

const contentTypeFormatMap: Record<string, SourceFormat> = {
  "application/csv": "csv",
  "application/excel": "spreadsheet",
  "application/pdf": "pdf",
  "application/vnd.ms-excel": "spreadsheet",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "spreadsheet",
  "image/jpeg": "scanned_image",
  "image/png": "scanned_image",
  "image/tiff": "scanned_image",
  "text/csv": "csv",
  "text/html": "html_table",
};

const keywordFormatRules: ReadonlyArray<{
  format: SourceFormat;
  keywords: readonly string[];
  strength: number;
}> = [
  {
    format: "csv",
    keywords: ["csv", "comma separated", "comma-separated"],
    strength: 0.78,
  },
  {
    format: "spreadsheet",
    keywords: ["spreadsheet", "excel", "xlsx", "workbook"],
    strength: 0.74,
  },
  {
    format: "pdf",
    keywords: ["pdf"],
    strength: 0.72,
  },
  {
    format: "html_table",
    keywords: ["html table", "web table", "online table", "table on page"],
    strength: 0.68,
  },
  {
    format: "scanned_image",
    keywords: ["scan", "scanned", "image", "photo", "jpeg", "png", "tiff"],
    strength: 0.66,
  },
  {
    format: "manual_entry",
    keywords: ["manual entry", "manual notes", "typed manually", "operator notes"],
    strength: 0.66,
  },
];

function normalizeText(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function normalizeExtension(value?: string | null) {
  const normalized = normalizeText(value);

  if (!normalized) return "";

  return normalized.startsWith(".") ? normalized : `.${normalized}`;
}

function getExtensionFromFilename(filename?: string | null) {
  const normalized = normalizeText(filename);
  const extensionStart = normalized.lastIndexOf(".");

  if (extensionStart < 0) return "";

  return normalized.slice(extensionStart);
}

function getUniqueFormats(signals: readonly FormatSignal[]) {
  return Array.from(new Set(signals.map((signal) => signal.format)));
}

function getHighestConfidenceSignal(signals: readonly FormatSignal[]) {
  return signals.reduce<FormatSignal | null>((highest, signal) => {
    if (!highest || signal.strength > highest.strength) return signal;

    return highest;
  }, null);
}

function buildClassification(format: SourceFormat, confidence?: number): SourceFormatClassification {
  const metadata = SourceFormatMetadata[format];

  return {
    format,
    ...metadata,
    confidence: confidence ?? metadata.confidence,
  };
}

function collectFormatSignals(input: SourceFormatClassificationInput): FormatSignal[] {
  const signals: FormatSignal[] = [];
  const filenameExtension = getExtensionFromFilename(input.filename);
  const explicitExtension = normalizeExtension(input.fileExtension);
  const contentType = normalizeText(input.declaredContentType);
  const searchableText = [
    input.filename,
    input.sourceLabel,
    input.notes,
    input.description,
  ]
    .map((value) => normalizeText(value))
    .filter(Boolean)
    .join(" ");

  const filenameFormat = extensionFormatMap[filenameExtension];
  const explicitExtensionFormat = extensionFormatMap[explicitExtension];
  const contentTypeFormat = contentTypeFormatMap[contentType];

  if (filenameFormat) signals.push({ format: filenameFormat, strength: 0.92 });
  if (explicitExtensionFormat) signals.push({ format: explicitExtensionFormat, strength: 0.96 });
  if (contentTypeFormat) signals.push({ format: contentTypeFormat, strength: 0.9 });

  for (const rule of keywordFormatRules) {
    if (rule.keywords.some((keyword) => searchableText.includes(keyword))) {
      signals.push({ format: rule.format, strength: rule.strength });
    }
  }

  return signals;
}

export function getSourceFormatMetadata(format: SourceFormat): SourceFormatClassification {
  return buildClassification(format);
}

export function isStructuredSourceFormat(format: SourceFormat): boolean {
  const metadata = SourceFormatMetadata[format];

  return metadata.structuredDataLikelihood >= 0.7 && !metadata.requiresOCR;
}

export function requiresHumanSourceReview(format: SourceFormat): boolean {
  return SourceFormatMetadata[format].requiresHumanReview;
}

export function isParserPlanningOnly(classification: SourceFormatClassification): boolean {
  return classification.parserPlanningOnly || classification.ingestionBlockedByDefault;
}

export function classifySourceFormat(
  input: SourceFormatClassificationInput,
): SourceFormatClassification {
  const signals = collectFormatSignals(input);

  if (signals.length === 0) {
    return buildClassification("unknown", 0);
  }

  const uniqueFormats = getUniqueFormats(signals);

  if (uniqueFormats.length > 1) {
    return buildClassification("mixed_source", 0.6);
  }

  const highestSignal = getHighestConfidenceSignal(signals);

  if (!highestSignal || highestSignal.strength < 0.65) {
    return buildClassification("unknown", 0.25);
  }

  return buildClassification(highestSignal.format, highestSignal.strength);
}
