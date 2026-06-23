import { NextResponse } from "next/server";

import { FootballApiError } from "@/services/football/client";
import { getFixtureById } from "@/services/football/fixtures";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const fixtureId = Number(id);

  if (!Number.isFinite(fixtureId) || fixtureId <= 0) {
    return NextResponse.json({ error: "Invalid fixture id" }, { status: 400 });
  }

  try {
    const fixture = await getFixtureById(fixtureId);
    if (!fixture) {
      return NextResponse.json({ error: "Fixture not found" }, { status: 404 });
    }

    return NextResponse.json({ fixture });
  } catch (error) {
    if (error instanceof FootballApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    const message =
      error instanceof Error ? error.message : "Fixture lookup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}