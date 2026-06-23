"use client";

import { useCallback, useEffect, useState } from "react";

import { AnalysisProgress } from "@/components/analysis-progress";
import { AnalysisStream } from "@/components/analysis-stream";
import { AskAnalyst } from "@/components/ask-analyst";
import { Disclaimer } from "@/components/disclaimer";
import { MatchInput } from "@/components/match-input";
import { ProbabilityBreakdown } from "@/components/probability-breakdown";
import { SavedAnalyses } from "@/components/saved-analyses";
import { ServiceStatus } from "@/components/service-status";
import { TradingInsight } from "@/components/trading-insight";
import {
  WorkspaceTabs,
  type WorkspaceTab,
} from "@/components/workspace-tabs";
import { runAnalysisStream } from "@/lib/client/analyze-stream";
import {
  deleteSavedAnalysis,
  loadPreferences,
  saveAnalysisResult,
  savePreferences,
} from "@/lib/client/local-store";
import { useFavoriteTeams, useSavedAnalyses } from "@/hooks/use-local-store";
import type { SupportedLeague } from "@/lib/leagues";
import type { AnalysisResult } from "@/types/analysis";
import type { FixtureSummary } from "@/types/fixture";
import type { PolymarketMarketContext } from "@/types/polymarket";
import type { AnalysisProgressStep } from "@/types/stream";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("match");
  const [query, setQuery] = useState("");
  const [leagues, setLeagues] = useState<SupportedLeague[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  const [fixtures, setFixtures] = useState<FixtureSummary[]>([]);
  const [selectedFixture, setSelectedFixture] = useState<FixtureSummary | null>(
    null,
  );
  const [market, setMarket] = useState<PolymarketMarketContext | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const savedItems = useSavedAnalyses();
  const favoriteTeams = useFavoriteTeams();
  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [progressStep, setProgressStep] = useState<AnalysisProgressStep | null>(
    null,
  );
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchFixtures = useCallback(async () => {
    setIsSearching(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("query", query.trim());
      if (selectedLeagueId) params.set("leagueId", String(selectedLeagueId));

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
  }, [query, selectedLeagueId]);

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
      setProgressMessage(null);
      setProgressStep(null);
      setActiveTab("match");
      void loadMarket(fixture.id);
    },
    [loadMarket],
  );

  const toggleFavorite = useCallback((teamName: string) => {
    const prefs = loadPreferences();
    const next = prefs.favoriteTeams.includes(teamName)
      ? prefs.favoriteTeams.filter((team) => team !== teamName)
      : [...prefs.favoriteTeams, teamName];

    savePreferences({ favoriteTeams: next });
  }, []);

  const runAnalysis = useCallback(async () => {
    if (!selectedFixture) return;

    setIsAnalyzing(true);
    setError(null);
    setSaveMessage(null);
    setProgressStep("fixture");
    setProgressMessage("Starting analysis…");
    setResult(null);
    setActiveTab("analysis");

    try {
      await runAnalysisStream(selectedFixture.id, {
        onProgress: (step, message) => {
          setProgressStep(step);
          setProgressMessage(message);
        },
        onResult: (analysis) => {
          setResult(analysis);
          setActiveTab("probabilities");
        },
        onError: (message) => {
          throw new Error(message);
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setActiveTab("match");
    } finally {
      setIsAnalyzing(false);
      setProgressStep(null);
      setProgressMessage(null);
    }
  }, [selectedFixture]);

  const saveAnalysis = useCallback(() => {
    if (!result) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      saveAnalysisResult(result);
      setSaveMessage("Analysis saved locally with Polymarket snapshot.");
    } catch (err) {
      setSaveMessage(
        err instanceof Error ? err.message : "Could not save analysis",
      );
    } finally {
      setIsSaving(false);
    }
  }, [result]);

  const loadSavedResult = useCallback(
    (saved: AnalysisResult) => {
      setResult(saved);
      setSelectedFixture(saved.matchData.fixture);
      setMarket(saved.polymarket ?? null);
      setActiveTab("analysis");
      setSaveMessage(null);
      setError(null);
    },
    [],
  );

  const handleDeleteSaved = useCallback((id: string) => {
    deleteSavedAnalysis(id);
  }, []);

  useEffect(() => {
    void fetch("/api/leagues")
      .then((res) => res.json())
      .then((data) => setLeagues(data.leagues ?? []))
      .catch(() => setLeagues([]));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialFixtures() {
      setIsSearching(true);
      try {
        const params = new URLSearchParams();
        const response = await fetch(`/api/fixtures/search?${params.toString()}`);
        const data = await response.json();
        if (!cancelled && response.ok) {
          setFixtures(data.fixtures ?? []);
        }
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }

    void loadInitialFixtures();
    return () => {
      cancelled = true;
    };
  }, []);

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
          Pick a match, run analysis, compare probabilities to Polymarket, and
          ask follow-up questions — all in one interactive workspace.
        </p>
      </header>

      <ServiceStatus />

      <WorkspaceTabs
        active={activeTab}
        onChange={setActiveTab}
        hasResult={Boolean(result)}
      />

      {(isAnalyzing || progressStep) && (
        <AnalysisProgress
          activeStep={progressStep}
          message={progressMessage}
        />
      )}

      {error && (
        <div className="border-negative/40 bg-negative/10 text-negative rounded-xl border px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {activeTab === "match" && (
        <MatchInput
          query={query}
          leagues={leagues}
          selectedLeagueId={selectedLeagueId}
          fixtures={fixtures}
          selectedFixture={selectedFixture}
          market={market}
          favoriteTeams={favoriteTeams}
          isSearching={isSearching}
          onQueryChange={setQuery}
          onLeagueChange={setSelectedLeagueId}
          onSearch={searchFixtures}
          onSelectFixture={handleSelectFixture}
          onToggleFavorite={toggleFavorite}
          onAnalyze={runAnalysis}
          isAnalyzing={isAnalyzing}
        />
      )}

      {activeTab === "analysis" && (
        <AnalysisStream
          result={result}
          isLoading={isAnalyzing}
          progressMessage={progressMessage}
        />
      )}

      {activeTab === "probabilities" && (
        <ProbabilityBreakdown result={result} />
      )}

      {activeTab === "insight" && (
        <TradingInsight
          result={result}
          onSave={saveAnalysis}
          isSaving={isSaving}
          saveMessage={saveMessage}
        />
      )}

      {activeTab === "ask" && <AskAnalyst result={result} />}

      <SavedAnalyses
        items={savedItems}
        onLoad={loadSavedResult}
        onDelete={handleDeleteSaved}
      />

      <Disclaimer />
    </main>
  );
}