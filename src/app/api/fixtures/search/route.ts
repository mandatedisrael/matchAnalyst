import { NextResponse } from "next/server";

import { fixtureSearchSchema } from "@/lib/schemas/analysis";
import { searchFixtures } from "@/services/football/fixtures";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = fixtureSearchSchema.safeParse({
    query: searchParams.get("query") ?? undefined,
    leagueId: searchParams.get("leagueId") ?? undefined,
    days: searchParams.get("days") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid search parameters", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const fixtures = await searchFixtures(parsed.data);
  return NextResponse.json({ fixtures });
}