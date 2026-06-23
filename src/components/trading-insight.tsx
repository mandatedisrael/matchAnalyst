"use client";

import { formatDelta, formatPercent } from "@/lib/probability";
import type { AnalysisResult } from "@/types/analysis";

interface TradingInsightProps {
  result: AnalysisResult | null;
  onSave: () => void;
  isSaving: boolean;
  saveMessage: string | null;
}

export function TradingInsight({
  result,
  onSave,
  isSaving,
  saveMessage,
}: TradingInsightProps) {
  const largestGap = result?.comparisons
    .filter((c) => c.delta !== undefined)
    .sort((a, b) => Math.abs(b.delta ?? 0) - Math.abs(a.delta ?? 0))[0];

  return (
    <section className="card p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Trading insight</h2>
        <p className="text-muted text-sm">
          Where the model diverges from market pricing
        </p>
      </div>

      {!result && (
        <p className="text-muted text-sm">
          Insight and save actions unlock after analysis.
        </p>
      )}

      {result && (
        <div className="space-y-4">
          <p className="text-sm leading-7 text-foreground/90">
            {result.tradingInsight}
          </p>

          {largestGap && largestGap.delta !== undefined && (
            <div className="bg-accent-soft rounded-xl p-4 text-sm">
              <p className="font-medium">Largest divergence</p>
              <p className="text-muted mt-1">
                {largestGap.label}: model {formatPercent(largestGap.model)} vs
                market {formatPercent(largestGap.polymarket ?? 0)} (
                {formatDelta(largestGap.delta)})
              </p>
            </div>
          )}

          {result.risks.length > 0 && (
            <div>
              <p className="label mb-2">Risks & caveats</p>
              <ul className="text-muted list-disc space-y-1 pl-5 text-sm">
                {result.risks.map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="bg-accent hover:bg-accent/90 rounded-xl px-5 py-2.5 text-sm font-semibold text-zinc-950 transition disabled:opacity-60"
            >
              {isSaving ? "Saving…" : "Save analysis"}
            </button>

            {result.polymarket?.url && (
              <a
                href={result.polymarket.url}
                target="_blank"
                rel="noreferrer"
                className="border-border hover:border-accent/40 rounded-xl border px-5 py-2.5 text-sm font-medium transition"
              >
                View on Polymarket ↗
              </a>
            )}
          </div>

          {saveMessage && (
            <p className="text-positive text-sm">{saveMessage}</p>
          )}
        </div>
      )}
    </section>
  );
}