import { NextResponse } from "next/server";

import { getFixtureById } from "@/services/football/fixtures";
import { resolvePolymarketMarket } from "@/services/polymarket/markets";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const fixtureId = Number(id);

  if (!Number.isFinite(fixtureId)) {
    return NextResponse.json({ error: "Invalid fixture id" }, { status: 400 });
  }

  const fixture = await getFixtureById(fixtureId);
  if (!fixture) {
    return NextResponse.json({ error: "Fixture not found" }, { status: 404 });
  }

  const market = await resolvePolymarketMarket(fixture);
  return NextResponse.json({ market });
}