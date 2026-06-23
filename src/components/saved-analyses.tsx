"use client";

import { formatPercent } from "@/lib/probability";
import type { AnalysisResult, SavedAnalysis } from "@/types/analysis";

interface SavedAnalysesProps {
  items: SavedAnalysis[];
  onLoad: (result: AnalysisResult) => void;
  onDelete: (id: string) => void;
}

export function SavedAnalyses({ items, onLoad, onDelete }: SavedAnalysesProps) {
  return (
    <section className="card p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Saved research</h2>
        <p className="text-muted text-sm">
          Stored locally in your browser
        </p>
      </div>

      {items.length === 0 && (
        <p className="text-muted text-sm">
          No saved analyses yet. Run an analysis and click Save.
        </p>
      )}

      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const fixture = item.result.matchData.fixture;
          return (
            <li
              key={item.id}
              className="bg-surface-elevated/50 hover:border-accent/30 rounded-xl border border-transparent p-4 transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onLoad(item.result)}
                  className="hover:text-accent text-left font-medium transition"
                >
                  {fixture.homeTeam.name} vs {fixture.awayTeam.name}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="text-muted hover:text-negative text-xs transition"
                >
                  Delete
                </button>
              </div>
              <button
                type="button"
                onClick={() => onLoad(item.result)}
                className="text-muted hover:text-foreground mt-2 block text-left font-mono text-xs transition"
              >
                H {formatPercent(item.result.probabilities.home)} · D{" "}
                {formatPercent(item.result.probabilities.draw)} · A{" "}
                {formatPercent(item.result.probabilities.away)}
              </button>
              <p className="text-muted mt-1 text-xs">
                {new Date(item.savedAt).toLocaleString()}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}