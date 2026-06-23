import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { saveAnalysis, listSavedAnalyses } from "@/services/zerog/storage";
import type { AnalysisResult } from "@/types/analysis";

export async function GET() {
  const items = await listSavedAnalyses();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  let body: { result?: AnalysisResult };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.result) {
    return NextResponse.json({ error: "Missing result payload" }, { status: 400 });
  }

  const saved = await saveAnalysis({
    id: randomUUID(),
    result: body.result,
    polymarketSnapshot: body.result.polymarket,
    savedAt: new Date().toISOString(),
  });

  return NextResponse.json({ saved }, { status: 201 });
}