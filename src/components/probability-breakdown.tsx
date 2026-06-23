"use client";

import { formatDelta, formatPercent } from "@/lib/probability";
import type { AnalysisResult } from "@/types/analysis";

interface ProbabilityBreakdownProps {
  result: AnalysisResult | null;
}

function BarPair({
  model,
  market,
}: {
  model: number;
  market?: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className="text-muted w-14 text-xs">Model</span>
        <div className="bg-surface-elevated h-2 flex-1 overflow-hidden rounded-full">
          <div
            className="bg-accent h-full rounded-full"
            style={{ width: `${model * 100}%` }}
          />
        </div>
        <span className="w-12 text-right font-mono text-xs">
          {formatPercent(model)}
        </span>
      </div>
      {market !== undefined && (
        <div className="flex items-center gap-3">
          <span className="text-muted w-14 text-xs">Market</span>
          <div className="bg-surface-elevated h-2 flex-1 overflow-hidden rounded-full">
            <div
              className="bg-warning/80 h-full rounded-full"
              style={{ width: `${market * 100}%` }}
            />
          </div>
          <span className="w-12 text-right font-mono text-xs">
            {formatPercent(market)}
          </span>
        </div>
      )}
    </div>
  );
}

export function ProbabilityBreakdown({ result }: ProbabilityBreakdownProps) {
  const hasMarket = Boolean(result?.polymarket?.found);

  return (
    <section className="bg-surface border-border rounded-2xl border p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Probability Breakdown</h2>
        <p className="text-muted text-sm">
          Model estimates vs Polymarket when a market exists
        </p>
      </div>

      {!result && (
        <p className="text-muted text-sm">
          Probabilities appear here after analysis completes.
        </p>
      )}

      {result && (
        <div className="space-y-5">
          {!hasMarket && (
            <p className="text-muted rounded-xl border border-dashed px-4 py-3 text-sm">
              No active Polymarket market for this fixture.
            </p>
          )}

          {result.comparisons.map((row) => (
            <div
              key={row.outcome}
              className="bg-surface-elevated border-border rounded-xl border p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-medium">{row.label}</h3>
                {row.delta !== undefined && (
                  <span
                    className={`font-mono text-xs ${
                      row.delta > 0
                        ? "text-positive"
                        : row.delta < 0
                          ? "text-negative"
                          : "text-muted"
                    }`}
                  >
                    {formatDelta(row.delta)}
                  </span>
                )}
              </div>
              <BarPair model={row.model} market={row.polymarket} />
            </div>
          ))}

          <p className="text-muted font-mono text-sm">
            Home {formatPercent(result.probabilities.home)} | Draw{" "}
            {formatPercent(result.probabilities.draw)} | Away{" "}
            {formatPercent(result.probabilities.away)}
          </p>
        </div>
      )}
    </section>
  );
}