"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { AnalysisProgress } from "@/components/analysis-progress";
import { AnalysisStream } from "@/components/analysis-stream";
import { AskAnalyst } from "@/components/ask-analyst";
import { FactorChart } from "@/components/charts/factor-chart";
import { FormTrendChart } from "@/components/charts/form-trend-chart";
import { H2HChart } from "@/components/charts/h2h-chart";
import { ProbabilityChart } from "@/components/charts/probability-chart";
import { TradingInsight } from "@/components/trading-insight";
import { runAnalysisStream } from "@/lib/client/analyze-stream";
import { saveAnalysisResult } from "@/lib/client/local-store";
import {
  buildMatchPreview,
  isFixtureLive,
  isFixtureUpcoming,
} from "@/lib/match-preview";
import type { AnalysisResult } from "@/types/analysis";
import type { FixtureSummary } from "@/types/fixture";
import type { PolymarketMarketContext } from "@/types/polymarket";
import type { AnalysisProgressStep } from "@/types/stream";

export default function MatchDetailPage() {
  const params = useParams<{ id: string }>();
  const fixtureId = Number(params.id);

  const [fixture, setFixture] = useState<FixtureSummary | null>(null);
  const [market, setMarket] = useState<PolymarketMarketContext | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [progressStep, setProgressStep] = useState<AnalysisProgressStep | null>(
    null,
  );
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const saveAnalysis = useCallback(() => {
    if (!result) return;
    setIsSaving(true);
    try {
      saveAnalysisResult(result);
      setSaveMessage("Analysis saved in your browser.");
    } finally {
      setIsSaving(false);
    }
  }, [result]);

  useEffect(() => {
    if (!Number.isFinite(fixtureId)) return;

    let cancelled = false;

    async function loadAndAnalyze() {
      try {
        const fixtureRes = await fetch(`/api/fixtures/${fixtureId}`);
        const fixtureData = await fixtureRes.json();
        if (!fixtureRes.ok) {
          throw new Error(fixtureData.error ?? "Fixture not found");
        }
        if (cancelled) return;
        setFixture(fixtureData.fixture);

        const marketRes = await fetch(`/api/fixtures/${fixtureId}/market`);
        const marketData = await marketRes.json();
        if (!cancelled && marketRes.ok) {
          setMarket(marketData.market ?? null);
        }

        setIsAnalyzing(true);
        setProgressStep("fixture");
        setProgressMessage("Starting in-depth analysis…");

        await runAnalysisStream(fixtureId, {
          onProgress: (step, message) => {
            if (cancelled) return;
            setProgressStep(step);
            setProgressMessage(message);
          },
          onResult: (analysis) => {
            if (!cancelled) setResult(analysis);
          },
          onError: (message) => {
            throw new Error(message);
          },
        });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Analysis failed");
        }
      } finally {
        if (!cancelled) {
          setIsAnalyzing(false);
          setProgressStep(null);
          setProgressMessage(null);
        }
      }
    }

    void loadAndAnalyze();
    return () => {
      cancelled = true;
    };
  }, [fixtureId]);

  const preview = fixture ? buildMatchPreview(fixture) : null;
  const live = fixture ? isFixtureLive(fixture) : false;
  const upcoming = fixture ? isFixtureUpcoming(fixture) : false;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-8 sm:px-8">
      <Link
        href="/"
        className="editorial-label text-muted hover:text-foreground mb-8 inline-block"
      >
        ← Back to matches
      </Link>

      {fixture && (
        <header className="border-border mb-8 border-b pb-8">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {fixture.homeTeam.name} v {fixture.awayTeam.name}
              {live && <span className="text-muted ml-2 text-lg">• LIVE</span>}
            </h1>
            {upcoming && !live && (
              <span className="editorial-label text-muted">Upcoming</span>
            )}
          </div>

          <p className="text-muted mb-6 text-sm">
            {fixture.league.name} ·{" "}
            {new Date(fixture.date).toLocaleString()} ·{" "}
            {fixture.venue ?? "Venue TBD"}
          </p>

          {preview && !result && (
            <div className="grid grid-cols-3 gap-4">
              <PreviewMetric label="Win Prob." value={`${preview.winProbability}%`} />
              <PreviewMetric label="Volatility" value={preview.volatility} />
              <PreviewMetric
                label="Confidence"
                value={preview.confidence.toUpperCase()}
              />
            </div>
          )}
        </header>
      )}

      {(isAnalyzing || progressStep) && (
        <div className="mb-6">
          <AnalysisProgress
            activeStep={progressStep}
            message={progressMessage}
          />
        </div>
      )}

      {error && <p className="text-negative mb-4 text-sm">{error}</p>}

      {result && (
        <div className="space-y-8">
          <div className="grid grid-cols-3 gap-4">
            <PreviewMetric
              label="Win Prob."
              value={`${(Math.max(result.probabilities.home, result.probabilities.away) * 100).toFixed(1)}%`}
            />
            <PreviewMetric label="Volatility" value={preview?.volatility ?? "MED"} />
            <PreviewMetric
              label="Confidence"
              value={result.confidence.toUpperCase()}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ProbabilityChart comparisons={result.comparisons} />
            <FormTrendChart
              homeTeam={result.matchData.fixture.homeTeam.name}
              awayTeam={result.matchData.fixture.awayTeam.name}
              homeForm={result.matchData.homeForm}
              awayForm={result.matchData.awayForm}
            />
            <FactorChart factors={result.keyFactors} />
            <H2HChart
              matches={result.matchData.headToHead}
              homeTeam={result.matchData.fixture.homeTeam.name}
              awayTeam={result.matchData.fixture.awayTeam.name}
            />
          </div>

          {market?.found && market.outcomes[0] && (
            <div className="bg-foreground text-background inline-block px-4 py-3 text-sm">
              <p className="editorial-label mb-1 text-background/70">
                Polymarket Odds
              </p>
              <p className="font-medium">
                {market.outcomes[0].label} / $
                {market.outcomes[0].price.toFixed(2)}
              </p>
            </div>
          )}

          <AnalysisStream
            result={result}
            isLoading={false}
            progressMessage={null}
          />

          <TradingInsight
            result={result}
            onSave={saveAnalysis}
            isSaving={isSaving}
            saveMessage={saveMessage}
          />

          <AskAnalyst result={result} />
        </div>
      )}

      {!result && isAnalyzing && (
        <p className="text-muted text-sm">Building charts and trends…</p>
      )}
    </main>
  );
}

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="metric-label mb-1">{label}</p>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}