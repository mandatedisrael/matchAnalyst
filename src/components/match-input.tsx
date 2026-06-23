"use client";

import type { FixtureSummary } from "@/types/fixture";
import type { PolymarketMarketContext } from "@/types/polymarket";

interface MatchInputProps {
  query: string;
  fixtures: FixtureSummary[];
  selectedFixture: FixtureSummary | null;
  market: PolymarketMarketContext | null;
  isSearching: boolean;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onSelectFixture: (fixture: FixtureSummary) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function MatchInput({
  query,
  fixtures,
  selectedFixture,
  market,
  isSearching,
  onQueryChange,
  onSearch,
  onSelectFixture,
  onAnalyze,
  isAnalyzing,
}: MatchInputProps) {
  return (
    <section className="bg-surface border-border rounded-2xl border p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Match Input</h2>
          <p className="text-muted text-sm">
            Search upcoming fixtures across major leagues
          </p>
        </div>
        {market && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              market.found
                ? "bg-accent-soft text-accent"
                : "bg-surface-elevated text-muted"
            }`}
          >
            {market.found ? "Polymarket ✓" : "No Polymarket market"}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder="Arsenal, Real Madrid, Champions League…"
          className="bg-surface-elevated border-border focus:border-accent w-full rounded-xl border px-4 py-3 text-sm outline-none"
        />
        <button
          type="button"
          onClick={onSearch}
          disabled={isSearching}
          className="bg-surface-elevated border-border hover:border-accent rounded-xl border px-5 py-3 text-sm font-medium transition disabled:opacity-60"
        >
          {isSearching ? "Searching…" : "Search"}
        </button>
      </div>

      {fixtures.length > 0 && (
        <ul className="mt-4 grid gap-2">
          {fixtures.map((fixture) => {
            const selected = selectedFixture?.id === fixture.id;
            return (
              <li key={fixture.id}>
                <button
                  type="button"
                  onClick={() => onSelectFixture(fixture)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    selected
                      ? "border-accent bg-accent-soft/40"
                      : "border-border bg-surface-elevated hover:border-accent/60"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">
                      {fixture.homeTeam.name} vs {fixture.awayTeam.name}
                    </span>
                    <span className="text-muted text-xs">
                      {new Date(fixture.date).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-muted mt-1 text-xs">
                    {fixture.league.name} · {fixture.venue ?? "Venue TBD"}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {selectedFixture && market?.found && (
        <p className="text-muted mt-4 text-sm">
          Match Winner
          {market.volumeUsd
            ? ` · $${market.volumeUsd.toLocaleString()} volume`
            : ""}
          {market.lowLiquidity ? " · Low liquidity" : ""}
        </p>
      )}

      <button
        type="button"
        onClick={onAnalyze}
        disabled={!selectedFixture || isAnalyzing}
        className="bg-accent hover:bg-accent/90 mt-5 w-full rounded-xl px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {isAnalyzing ? "Analyzing match…" : "Run AI Analysis"}
      </button>
    </section>
  );
}