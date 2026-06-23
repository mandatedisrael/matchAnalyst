import { buildPolymarketSearchQuery } from "@/lib/team-aliases";
import type { FixtureSummary } from "@/types/fixture";
import { gammaFetch } from "@/services/polymarket/client";

interface GammaMarket {
  id: string;
  question: string;
  slug: string;
  outcomes: string;
  outcomePrices: string;
  volume?: string;
  liquidity?: string;
  volumeNum?: number;
  liquidityNum?: number;
  active?: boolean;
}

export interface GammaEvent {
  id: string;
  title: string;
  slug: string;
  markets?: GammaMarket[];
  volume?: number;
  liquidity?: number;
  active?: boolean;
  closed?: boolean;
}

interface PublicSearchResponse {
  events?: GammaEvent[];
}

export async function searchPolymarketEvents(
  fixture: FixtureSummary,
): Promise<GammaEvent[]> {
  const query = buildPolymarketSearchQuery(
    fixture.homeTeam.name,
    fixture.awayTeam.name,
  );

  const primary = await gammaFetch<PublicSearchResponse>("/public-search", {
    q: query,
    events_status: "active",
    limit_per_type: 12,
    search_profiles: "false",
    search_tags: "false",
  });

  const events = primary.events ?? [];
  if (events.length > 0) return events;

  const fallback = await gammaFetch<PublicSearchResponse>("/public-search", {
    q: fixture.homeTeam.name,
    events_status: "active",
    limit_per_type: 20,
    search_profiles: "false",
    search_tags: "false",
  });

  return fallback.events ?? [];
}