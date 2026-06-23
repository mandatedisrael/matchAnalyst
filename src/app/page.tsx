"use client";

import { useCallback, useEffect, useState } from "react";

import { MatchFeedCard } from "@/components/match-feed-card";
import { MatchSearchHeader } from "@/components/match-search-header";
import { SavedAnalyses } from "@/components/saved-analyses";
import { ServiceStatus } from "@/components/service-status";
import { useSavedAnalyses } from "@/hooks/use-local-store";
import { deleteSavedAnalysis } from "@/lib/client/local-store";
import { WORLD_CUP_LEAGUE_ID } from "@/lib/leagues";
import type { SupportedLeague } from "@/lib/leagues";
import type { AnalysisResult } from "@/types/analysis";
import type { FixtureSummary } from "@/types/fixture";
import type { PolymarketMarketContext } from "@/types/polymarket";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [leagues, setLeagues] = useState<SupportedLeague[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState<number>(
    WORLD_CUP_LEAGUE_ID,
  );
  const [fixtures, setFixtures] = useState<FixtureSummary[]>([]);
  const [markets, setMarkets] = useState<
    Record<number, PolymarketMarketContext>
  >({});
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const savedItems = useSavedAnalyses();

  const loadMarkets = useCallback(async (items: FixtureSummary[]) => {
    const entries = await Promise.all(
      items.slice(0, 12).map(async (fixture) => {
        try {
          const response = await fetch(`/api/fixtures/${fixture.id}/market`);
          const data = await response.json();
          return [fixture.id, data.market] as const;
        } catch {
          return [fixture.id, null] as const;
        }
      }),
    );

    setMarkets(Object.fromEntries(entries));
  }, []);

  const searchFixtures = useCallback(async () => {
    setIsSearching(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("query", query.trim());
      params.set("leagueId", String(selectedLeagueId));

      const response = await fetch(`/api/fixtures/search?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Fixture search failed");
      }

      const nextFixtures: FixtureSummary[] = data.fixtures ?? [];
      setFixtures(nextFixtures);
      void loadMarkets(nextFixtures);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fixture search failed");
    } finally {
      setIsSearching(false);
    }
  }, [query, selectedLeagueId, loadMarkets]);

  const handleDeleteSaved = useCallback((id: string) => {
    deleteSavedAnalysis(id);
  }, []);

  const handleLoadSaved = useCallback((saved: AnalysisResult) => {
    window.location.href = `/match/${saved.fixtureId}`;
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
      setError(null);
      try {
        const response = await fetch(
          `/api/fixtures/search?leagueId=${WORLD_CUP_LEAGUE_ID}`,
        );
        const data = await response.json();
        if (!cancelled) {
          if (!response.ok) {
            throw new Error(data.error ?? "Fixture search failed");
          }
          const nextFixtures: FixtureSummary[] = data.fixtures ?? [];
          setFixtures(nextFixtures);
          void loadMarkets(nextFixtures);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Fixture search failed",
          );
        }
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }

    void loadInitialFixtures();
    return () => {
      cancelled = true;
    };
  }, [loadMarkets]);

  const sectionTitle =
    selectedLeagueId === WORLD_CUP_LEAGUE_ID
      ? "World Cup 2026"
      : leagues.find((l) => l.id === selectedLeagueId)?.name ?? "Matches";

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-10 sm:px-8">
      <MatchSearchHeader
        query={query}
        leagues={leagues}
        selectedLeagueId={selectedLeagueId}
        isSearching={isSearching}
        onQueryChange={setQuery}
        onLeagueChange={(id) => setSelectedLeagueId(id ?? WORLD_CUP_LEAGUE_ID)}
        onSearch={searchFixtures}
      />

      <ServiceStatus />

      {error && (
        <div className="card text-negative mt-4 p-4 text-sm">{error}</div>
      )}

      <section className="mt-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {isSearching ? "Loading matches…" : sectionTitle}
          </h2>
          {!isSearching && fixtures.length > 0 && (
            <span className="text-muted text-sm">{fixtures.length} fixtures</span>
          )}
        </div>

        {fixtures.length === 0 && !isSearching && !error && (
          <div className="card py-16 text-center">
            <p className="text-muted text-sm">
              No fixtures found for this league. Try another search.
            </p>
          </div>
        )}

        {isSearching && fixtures.length === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="card h-52 animate-pulse bg-surface-elevated/30"
              />
            ))}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {fixtures.map((fixture) => (
            <MatchFeedCard
              key={fixture.id}
              fixture={fixture}
              market={markets[fixture.id]}
            />
          ))}
        </div>
      </section>

      {savedItems.length > 0 && (
        <div className="mt-12">
          <SavedAnalyses
            items={savedItems}
            onLoad={handleLoadSaved}
            onDelete={handleDeleteSaved}
          />
        </div>
      )}
    </main>
  );
}