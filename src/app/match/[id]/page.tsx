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
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-8 sm:px-8">
      <Link
        href="/"
        className="text-muted hover:text-accent mb-8 inline-flex items-center gap-1.5 text-sm font-medium"
      >
        ← Back to matches
      </Link>

      {fixture && (
        <header className="card mb-8 p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-muted mb-2 text-sm">{fixture.league.name}</p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {fixture.homeTeam.name}
                <span className="text-muted mx-2 font-normal">vs</span>
                {fixture.awayTeam.name}
              </h1>
            </div>
            <div className="flex gap-2">
              {live && (
                <span className="bg-negative/15 text-negative live-pulse flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
                  <span className="bg-negative h-1.5 w-1.5 rounded-full" />
                  LIVE
                </span>
              )}
              {upcoming && !live && (
                <span className="bg-accent-soft text-accent rounded-full px-3 py-1 text-xs font-medium">
                  Upcoming
                </span>
              )}
            </div>
          </div>

          <p className="text-muted text-sm">
            {new Date(fixture.date).toLocaleString()} ·{" "}
            {fixture.venue ?? "Venue TBD"}
          </p>

          {preview && !result && (
            <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
              <MetricCard label="Win prob" value={`${preview.winProbability}%`} />
              <MetricCard label="Volatility" value={preview.volatility} />
              <MetricCard label="Confidence" value={preview.confidence} />
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

      {error && (
        <div className="card text-negative mb-4 p-4 text-sm">{error}</div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3 sm:max-w-lg">
            <MetricCard
              label="Win prob"
              value={`${(Math.max(result.probabilities.home, result.probabilities.away) * 100).toFixed(1)}%`}
            />
            <MetricCard label="Volatility" value={preview?.volatility ?? "MED"} />
            <MetricCard label="Confidence" value={result.confidence} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
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
            <div className="card flex items-center justify-between p-4">
              <div>
                <p className="label mb-1">Polymarket odds</p>
                <p className="font-medium">{market.outcomes[0].label}</p>
              </div>
              <p className="text-accent font-mono text-2xl font-bold">
                ${market.outcomes[0].price.toFixed(2)}
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

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-elevated/60 rounded-xl px-4 py-3 text-center">
      <p className="label mb-1">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}