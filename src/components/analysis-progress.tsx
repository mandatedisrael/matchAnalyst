"use client";

import type { AnalysisProgressStep } from "@/types/stream";

const STEPS: Array<{ id: AnalysisProgressStep; label: string }> = [
  { id: "fixture", label: "Fixture" },
  { id: "football", label: "Football data" },
  { id: "polymarket", label: "Polymarket" },
  { id: "weather", label: "Weather" },
  { id: "inference", label: "AI analyst" },
  { id: "complete", label: "Done" },
];

interface AnalysisProgressProps {
  activeStep: AnalysisProgressStep | null;
  message?: string | null;
}

export function AnalysisProgress({
  activeStep,
  message,
}: AnalysisProgressProps) {
  if (!activeStep) return null;

  const activeIndex = STEPS.findIndex((step) => step.id === activeStep);

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="bg-accent h-2 w-2 animate-pulse rounded-full" />
        <p className="text-sm font-medium">Running analysis</p>
      </div>
      <ol className="flex flex-wrap gap-2">
        {STEPS.map((step, index) => {
          const done = index < activeIndex;
          const active = step.id === activeStep;

          return (
            <li
              key={step.id}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                active
                  ? "bg-accent text-zinc-950"
                  : done
                    ? "bg-positive/15 text-positive"
                    : "bg-surface-elevated text-muted"
              }`}
            >
              {done ? "✓ " : ""}
              {step.label}
            </li>
          );
        })}
      </ol>
      {message && (
        <p className="text-muted mt-3 text-sm">{message}</p>
      )}
    </div>
  );
}