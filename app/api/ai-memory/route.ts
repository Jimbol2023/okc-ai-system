import { NextResponse, type NextRequest } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getLimit(value: string | null) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 20;
  }

  return Math.min(Math.floor(parsed), 50);
}

function getDateParam(value: string | null, endOfDay = false) {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  if (endOfDay && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    date.setUTCHours(23, 59, 59, 999);
  }

  return date;
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = getLimit(searchParams.get("limit"));
    const eventType = searchParams.get("eventType")?.trim();
    const leadId = searchParams.get("leadId")?.trim();
    const source = searchParams.get("source")?.trim();
    const dateFrom = getDateParam(searchParams.get("dateFrom"));
    const dateTo = getDateParam(searchParams.get("dateTo"), true);

    const where: {
      eventType?: string;
      leadId?: string;
      source?: string;
      createdAt?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};

    if (eventType) {
      where.eventType = eventType;
    }

    if (leadId) {
      where.leadId = leadId;
    }

    if (source) {
      where.source = source;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};

      if (dateFrom) {
        where.createdAt.gte = dateFrom;
      }

      if (dateTo) {
        where.createdAt.lte = dateTo;
      }
    }

    const events = await prisma.aiMemoryEvent.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      events: events.map((event) => ({
        ...event,
        createdAt: event.createdAt.toISOString(),
      })),
      total: events.length,
      limit,
    });
  } catch (error) {
    console.error("GET /api/ai-memory failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load AI memory events.",
      },
      { status: 500 },
    );
  }
}
