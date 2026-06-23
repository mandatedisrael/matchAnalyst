import { teamsMatchInText } from "@/lib/team-aliases";
import type { FixtureSummary } from "@/types/fixture";
import type { GammaEvent } from "@/services/polymarket/search";

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
}

export function scoreEventForFixture(
  event: GammaEvent,
  fixture: FixtureSummary,
): number {
  const title = event.title ?? "";
  const slug = event.slug ?? "";
  const combined = `${title} ${slug}`;

  if (!teamsMatchInText(fixture.homeTeam.name, fixture.awayTeam.name, combined)) {
    return 0;
  }

  let score = 10;

  if (title.toLowerCase().includes(" vs ")) score += 4;
  if (slug.includes("epl") && fixture.league.name.includes("Premier")) score += 2;
  if (slug.includes("ucl") && fixture.league.name.includes("Champions")) score += 2;
  if (slug.includes("lal") && fixture.league.name.includes("La Liga")) score += 2;

  const volume = event.volume ?? 0;
  if (volume > 10000) score += 2;
  if (volume > 50000) score += 1;

  if (event.closed) score -= 20;
  if (event.active === false) score -= 10;

  return score;
}

export function pickBestEvent(
  events: GammaEvent[],
  fixture: FixtureSummary,
): GammaEvent | null {
  const ranked = events
    .map((event) => ({ event, score: scoreEventForFixture(event, fixture) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.event ?? null;
}

export function pickMatchWinnerMarket(markets: GammaMarket[] = []): GammaMarket | null {
  const threeWay = markets.find((market) => {
    try {
      const labels: string[] = JSON.parse(market.outcomes || "[]");
      return labels.length === 3;
    } catch {
      return false;
    }
  });

  if (threeWay) return threeWay;

  const winner = markets.find((m) => {
    const q = m.question.toLowerCase();
    return (
      q.includes("win") ||
      q.includes("winner") ||
      q.includes("match result") ||
      q.includes("beat")
    );
  });

  return winner ?? markets[0] ?? null;
}

export function parseMarketOutcomes(market: GammaMarket) {
  const labels: string[] = JSON.parse(market.outcomes || "[]");
  const prices: string[] = JSON.parse(market.outcomePrices || "[]");

  return labels.map((label, index) => {
    const price = Number(prices[index] ?? 0);
    return {
      label,
      price,
      impliedProbability: price,
    };
  });
}