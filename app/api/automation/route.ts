import { NextResponse } from "next/server";

import { runAutomationCycle } from "@/lib/automation-agent";

export async function GET() {
  const result = await runAutomationCycle();

  return NextResponse.json(result);
}

export async function POST() {
  const result = await runAutomationCycle();

  return NextResponse.json(result);
}