"use client";

import { useEffect, useState } from "react";

import type { AnalysisProgressStep } from "@/types/stream";

const STEPS: Array<{
  id: AnalysisProgressStep;
  label: string;
  icon: string;
}> = [
  { id: "fixture", label: "Fixture", icon: "🏟️" },
  { id: "football", label: "Form & H2H", icon: "📋" },
  { id: "polymarket", label: "Markets", icon: "📊" },
  { id: "weather", label: "Weather", icon: "🌤️" },
  { id: "inference", label: "AI analyst", icon: "🧠" },
  { id: "complete", label: "Kick off", icon: "⚽" },
];

const STEP_HINTS: Record<AnalysisProgressStep, string[]> = {
  fixture: [
    "Locking in kickoff details…",
    "Plotting the tactical board…",
    "Marking the center circle…",
  ],
  football: [
    "Reviewing recent form tables…",
    "Tracing head-to-head history…",
    "Checking injury reports…",
  ],
  polymarket: [
    "Scanning prediction markets…",
    "Comparing crowd odds…",
    "Mapping market sentiment…",
  ],
  weather: [
    "Reading pitch-side conditions…",
    "Factoring wind and humidity…",
    "Checking match-day forecast…",
  ],
  inference: [
    "Running the AI analyst…",
    "Crunching win probabilities…",
    "Writing the match narrative…",
  ],
  complete: [
    "Final whistle — packaging insights…",
    "Polishing charts and trends…",
    "Almost ready…",
  ],
};

interface AnalysisResearchStageProps {
  activeStep: AnalysisProgressStep | null;
  message?: string | null;
  homeTeam?: string;
  awayTeam?: string;
}

export function AnalysisResearchStage({
  activeStep,
  message,
  homeTeam = "Home",
  awayTeam = "Away",
}: AnalysisResearchStageProps) {
  const step = activeStep ?? "fixture";
  const activeIndex = Math.max(0, STEPS.findIndex((s) => s.id === step));
  const progress = ((activeIndex + 0.55) / (STEPS.length - 1)) * 100;
  const hints = STEP_HINTS[step];
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    setHintIndex(0);
  }, [step, message]);

  useEffect(() => {
    if (message) return;
    const interval = window.setInterval(() => {
      setHintIndex((current) => (current + 1) % hints.length);
    }, 2800);
    return () => window.clearInterval(interval);
  }, [message, hints]);

  const hint = message ?? hints[hintIndex];

  return (
    <section className="space-y-5" aria-live="polite" aria-busy="true">
      <div className="card overflow-hidden p-0">
        <PitchAnimation
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          progress={progress}
        />

        <div className="border-border border-t px-5 py-5 sm:px-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="analysis-live-dot" aria-hidden />
              <div>
                <p className="text-sm font-semibold">Match research in progress</p>
                <p className="text-muted text-xs">AI scout on the pitch</p>
              </div>
            </div>
            <span className="bg-accent/10 text-accent rounded-full px-3 py-1 font-mono text-xs font-semibold">
              {Math.min(90, Math.round(progress * 0.9))}&apos;
            </span>
          </div>

          <div className="bg-surface-elevated/70 relative mb-5 h-2 overflow-hidden rounded-full">
            <div
              className="analysis-progress-fill absolute inset-y-0 left-0 rounded-full"
              style={{ width: `${progress}%` }}
            />
            <div className="analysis-progress-shine absolute inset-0" aria-hidden />
          </div>

          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {STEPS.map((stepItem, index) => {
              const done = index < activeIndex;
              const active = stepItem.id === step;

              return (
                <li
                  key={stepItem.id}
                  className={`analysis-step rounded-xl border px-3 py-2.5 text-center transition-all duration-500 ${
                    active
                      ? "analysis-step-active border-accent/40 bg-accent/10"
                      : done
                        ? "border-positive/25 bg-positive/8"
                        : "border-border bg-surface-elevated/40"
                  }`}
                >
                  <span
                    className={`mb-1 block text-base ${active ? "analysis-step-icon-active" : ""}`}
                    aria-hidden
                  >
                    {stepItem.icon}
                  </span>
                  <p
                    className={`text-[0.65rem] font-semibold tracking-wide uppercase ${
                      active ? "text-accent" : done ? "text-positive" : "text-muted"
                    }`}
                  >
                    {stepItem.label}
                  </p>
                </li>
              );
            })}
          </ol>

          <p className="text-muted mt-4 text-sm">
            <span className="text-accent mr-1.5 inline-block animate-pulse" aria-hidden>
              ▸
            </span>
            <span className="analysis-message-fade" key={hint}>
              {hint}
            </span>
          </p>
        </div>
      </div>

      <ChartSkeletonGrid homeTeam={homeTeam} awayTeam={awayTeam} />
    </section>
  );
}

function PitchAnimation({
  homeTeam,
  awayTeam,
  progress,
}: {
  homeTeam: string;
  awayTeam: string;
  progress: number;
}) {
  return (
    <div className="analysis-pitch relative overflow-hidden px-4 py-6 sm:px-6 sm:py-8">
      <div className="analysis-pitch-glow pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative mx-auto max-w-3xl">
        <div className="mb-3 flex items-center justify-between gap-3 text-xs font-semibold tracking-wide uppercase">
          <span className="text-foreground/90 max-w-[40%] truncate">{homeTeam}</span>
          <span className="text-muted shrink-0">vs</span>
          <span className="text-foreground/90 max-w-[40%] truncate text-right">
            {awayTeam}
          </span>
        </div>

        <div className="analysis-pitch-surface relative aspect-[16/7] w-full overflow-hidden rounded-2xl border border-white/10">
          <div className="analysis-pitch-stripes absolute inset-0" aria-hidden />
          <div className="analysis-pitch-line absolute top-1/2 right-[8%] left-[8%] h-px -translate-y-1/2 bg-white/25" />
          <div className="analysis-pitch-circle absolute top-1/2 left-1/2 h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
          <div className="absolute top-1/2 left-[8%] h-[34%] w-[12%] -translate-y-1/2 border border-white/20 border-r-0" />
          <div className="absolute top-1/2 right-[8%] h-[34%] w-[12%] -translate-y-1/2 border border-white/20 border-l-0" />
          <div className="analysis-pitch-scan absolute inset-y-0 left-0 w-1/3" aria-hidden />
          <TacticalDots />

          <div
            className="analysis-ball absolute top-1/2 z-10 -translate-y-1/2"
            style={{ left: `${8 + progress * 0.84}%` }}
            aria-hidden
          >
            <span className="analysis-ball-spin block text-2xl sm:text-3xl">⚽</span>
          </div>

          <div className="analysis-radar absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[0.65rem] font-medium text-white/90 backdrop-blur-sm">
            <span className="analysis-live-dot scale-75" />
            Live scan
          </div>
        </div>
      </div>
    </div>
  );
}

const TACTICAL_POSITIONS = [
  { left: "22%", top: "38%", delay: "0ms" },
  { left: "34%", top: "62%", delay: "400ms" },
  { left: "48%", top: "48%", delay: "800ms" },
  { left: "62%", top: "34%", delay: "200ms" },
  { left: "74%", top: "58%", delay: "600ms" },
];

function TacticalDots() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {TACTICAL_POSITIONS.map((pos, index) => (
        <span
          key={index}
          className="analysis-tactical-dot absolute h-2 w-2 rounded-full bg-sky-300/80"
          style={{ left: pos.left, top: pos.top, animationDelay: pos.delay }}
        />
      ))}
    </div>
  );
}

function ChartSkeletonGrid({
  homeTeam,
  awayTeam,
}: {
  homeTeam: string;
  awayTeam: string;
}) {
  const cards = [
    { title: "Win probabilities", subtitle: "Model vs market" },
    { title: "Form trend", subtitle: `${homeTeam} / ${awayTeam}` },
    { title: "Key factors", subtitle: "Weighted drivers" },
    { title: "Head-to-head", subtitle: "Recent meetings" },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className="card analysis-skeleton-card overflow-hidden p-5"
          style={{ animationDelay: `${index * 120}ms` }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="label mb-1">{card.title}</p>
              <p className="text-muted text-xs">{card.subtitle}</p>
            </div>
            <span className="text-lg opacity-60" aria-hidden>
              {index % 2 === 0 ? "📈" : "🎯"}
            </span>
          </div>
          <div className="space-y-3">
            <div className="analysis-shimmer h-3 w-4/5 rounded-full" />
            <div className="analysis-shimmer h-3 w-full rounded-full" />
            <div className="analysis-shimmer h-3 w-11/12 rounded-full" />
            <div className="mt-5 flex items-end gap-2">
              {[48, 72, 55, 80, 62].map((height, barIndex) => (
                <div
                  key={barIndex}
                  className="analysis-bar-pulse bg-accent/25 flex-1 rounded-t-md"
                  style={{
                    height: `${height}px`,
                    animationDelay: `${index * 100 + barIndex * 80}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}