import { getDemoPolymarket } from "@/lib/demo-data";
import { hasApiFootball } from "@/lib/env";
import type { FixtureSummary } from "@/types/fixture";
import type { PolymarketMarketContext } from "@/types/polymarket";
import { gammaFetch } from "@/services/polymarket/client";
import {
  parseMarketOutcomes,
  pickBestEvent,
  pickMatchWinnerMarket,
} from "@/services/polymarket/matching";
import {
  searchPolymarketEvents,
  type GammaEvent,
} from "@/services/polymarket/search";

function emptyMarket(): PolymarketMarketContext {
  return {
    found: false,
    marketType: "match_winner",
    outcomes: [],
    fetchedAt: new Date().toISOString(),
  };
}

function mapEventToMarket(
  event: GammaEvent,
  fixture: FixtureSummary,
): PolymarketMarketContext {
  const market = pickMatchWinnerMarket(event.markets);
  if (!market) return emptyMarket();

  const volumeUsd = Number(
    market.volumeNum ?? market.volume ?? event.volume ?? 0,
  );
  const liquidityUsd = Number(
    market.liquidityNum ?? market.liquidity ?? event.liquidity ?? 0,
  );

  return {
    found: true,
    slug: market.slug,
    title: market.question || event.title,
    marketType: "match_winner",
    volumeUsd,
    liquidityUsd,
    outcomes: parseMarketOutcomes(market),
    fetchedAt: new Date().toISOString(),
    url: `https://polymarket.com/event/${event.slug}`,
    lowLiquidity: liquidityUsd > 0 && liquidityUsd < 5000,
  };
}

async function fetchEventBySlug(slug: string): Promise<GammaEvent | null> {
  try {
    const event = await gammaFetch<GammaEvent>(`/events/slug/${slug}`);
    return event ?? null;
  } catch {
    return null;
  }
}

export async function resolvePolymarketMarket(
  fixture: FixtureSummary,
): Promise<PolymarketMarketContext> {
  if (!hasApiFootball()) {
    return getDemoPolymarket(fixture);
  }

  try {
    const searchResults = await searchPolymarketEvents(fixture);
    let matched = pickBestEvent(searchResults, fixture);

    if (matched?.slug && (!matched.markets || matched.markets.length === 0)) {
      matched = (await fetchEventBySlug(matched.slug)) ?? matched;
    }

    if (!matched) {
      const tagged = await gammaFetch<GammaEvent[]>("/events", {
        active: "true",
        closed: "false",
        limit: 150,
        tag: "soccer",
      });

      matched = pickBestEvent(tagged, fixture);
      if (matched?.slug && (!matched.markets || matched.markets.length === 0)) {
        matched = (await fetchEventBySlug(matched.slug)) ?? matched;
      }
    }

    if (!matched) return emptyMarket();

    return mapEventToMarket(matched, fixture);
  } catch {
    return emptyMarket();
  }
}