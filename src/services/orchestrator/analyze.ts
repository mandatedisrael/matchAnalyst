import { hasZerogCompute } from "@/lib/env";
import {
  buildComparisons,
  normalizeProbabilities,
} from "@/lib/probability";
import { getFixtureById } from "@/services/football/fixtures";
import { buildMatchDataBundle } from "@/services/football/match-data";
import { resolvePolymarketMarket } from "@/services/polymarket/markets";
import { fetchWeatherForVenue } from "@/services/weather/openweather";
import {
  runDemoAnalysis,
  runZerogAnalysis,
} from "@/services/zerog/compute";
import type { AnalysisResult } from "@/types/analysis";
import type { AnalysisProgressStep } from "@/types/stream";

export type ProgressCallback = (
  step: AnalysisProgressStep,
  message: string,
) => void;

export async function analyzeFixture(
  fixtureId: number,
  onProgress?: ProgressCallback,
): Promise<AnalysisResult> {
  onProgress?.("fixture", "Resolving fixture…");
  const fixture = await getFixtureById(fixtureId);
  if (!fixture) {
    throw new Error(`Fixture ${fixtureId} not found`);
  }

  onProgress?.("football", "Fetching form, H2H, injuries, and standings…");
  const matchData = await buildMatchDataBundle(fixture);

  onProgress?.("polymarket", "Checking Polymarket for market context…");
  const polymarket = await resolvePolymarketMarket(fixture);

  if (fixture.venue) {
    onProgress?.("weather", "Loading venue weather context…");
    matchData.weather = await fetchWeatherForVenue(fixture.venue);
  }

  onProgress?.(
    "inference",
    hasZerogCompute()
      ? "Running 0G Compute analyst…"
      : "Generating demo analysis…",
  );

  const analystOutput = hasZerogCompute()
    ? await runZerogAnalysis(matchData, polymarket)
    : runDemoAnalysis(matchData, polymarket);

  const probabilities = normalizeProbabilities(analystOutput.probabilities);

  onProgress?.("complete", "Analysis complete.");

  return {
    fixtureId,
    probabilities,
    confidence: analystOutput.confidence,
    narrative: analystOutput.narrative,
    keyFactors: analystOutput.key_factors,
    risks: analystOutput.risks,
    tradingInsight: analystOutput.trading_insight,
    comparisons: buildComparisons(probabilities, polymarket),
    matchData,
    polymarket: polymarket.found ? polymarket : undefined,
    analyzedAt: new Date().toISOString(),
    source: hasZerogCompute() ? "0g-compute" : "demo",
  };
}