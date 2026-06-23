import { NextResponse } from "next/server";

export const maxDuration = 30;

import { chatRequestSchema } from "@/lib/schemas/chat";
import { answerFollowUp } from "@/services/zerog/chat";
import type { AnalysisResult } from "@/types/analysis";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const answer = await answerFollowUp(
      parsed.data.question,
      parsed.data.result as unknown as AnalysisResult,
    );
    return NextResponse.json({ answer });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Chat request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}