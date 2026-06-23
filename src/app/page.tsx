"use client";

import { useCallback, useEffect, useState } from "react";

import { AnalysisStream } from "@/components/analysis-stream";
import { Disclaimer } from "@/components/disclaimer";
import { MatchInput } from "@/components/match-input";
import { ProbabilityBreakdown } from "@/components/probability-breakdown";
import { TradingInsight } from "@/components/trading-insight";
import type { AnalysisResult } from "@/types/analysis";
import type { FixtureSummary } from "@/types/fixture";
import type { PolymarketMarketContext } from "@/types/polymarket";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [fixtures, setFixtures] = useState<FixtureSummary[]>([]);
  const [selectedFixture, setSelectedFixture] = useState<FixtureSummary | null>(
    null,
  );
  const [market, setMarket] = useState<PolymarketMarketContext | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchFixtures = useCallback(async () => {
    setIsSearching(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("query", query.trim());

      const response = await fetch(`/api/fixtures/search?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Fixture search failed");
      }

      setFixtures(data.fixtures ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fixture search failed");
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const loadMarket = useCallback(async (fixtureId: number) => {
    try {
      const response = await fetch(`/api/fixtures/${fixtureId}/market`);
      const data = await response.json();
      if (response.ok) {
        setMarket(data.market ?? null);
      }
    } catch {
      setMarket(null);
    }
  }, []);

  const handleSelectFixture = useCallback(
    (fixture: FixtureSummary) => {
      setSelectedFixture(fixture);
      setResult(null);
      setSaveMessage(null);
      void loadMarket(fixture.id);
    },
    [loadMarket],
  );

  const runAnalysis = useCallback(async () => {
    if (!selectedFixture) return;

    setIsAnalyzing(true);
    setError(null);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fixtureId: selectedFixture.id }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Analysis failed");
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedFixture]);

  const saveAnalysis = useCallback(async () => {
    if (!result) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Save failed");
      }

      setSaveMessage("Analysis saved with Polymarket snapshot.");
    } catch (err) {
      setSaveMessage(
        err instanceof Error ? err.message : "Could not save analysis",
      );
    } finally {
      setIsSaving(false);
    }
  }, [result]);

  useEffect(() => {
    void searchFixtures();
  }, [searchFixtures]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <p className="text-accent text-sm font-medium uppercase tracking-[0.2em]">
          Match Analyst
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Polymarket Football AI Analyst
        </h1>
        <p className="text-muted max-w-3xl text-sm leading-7">
          Research upcoming matches with structured football data, model
          probabilities, and Polymarket market context when available.
        </p>
      </header>

      {error && (
        <div className="border-negative/40 bg-negative/10 text-negative rounded-xl border px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <MatchInput
        query={query}
        fixtures={fixtures}
        selectedFixture={selectedFixture}
        market={market}
        isSearching={isSearching}
        onQueryChange={setQuery}
        onSearch={searchFixtures}
        onSelectFixture={handleSelectFixture}
        onAnalyze={runAnalysis}
        isAnalyzing={isAnalyzing}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AnalysisStream result={result} isLoading={isAnalyzing} />
        <ProbabilityBreakdown result={result} />
      </div>

      <TradingInsight
        result={result}
        onSave={saveAnalysis}
        isSaving={isSaving}
        saveMessage={saveMessage}
      />

      <Disclaimer />
    </main>
  );
}