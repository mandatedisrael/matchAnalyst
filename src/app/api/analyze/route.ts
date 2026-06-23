import { NextResponse } from "next/server";

import { analyzeRequestSchema } from "@/lib/schemas/analysis";
import { analyzeFixture } from "@/services/orchestrator/analyze";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = analyzeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const result = await analyzeFixture(parsed.data.fixtureId);
    return NextResponse.json({ result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Analysis failed unexpectedly";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}