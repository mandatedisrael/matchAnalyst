"use client";

import { AnalysisResearchStage } from "@/components/analysis-research-stage";
import type { AnalysisProgressStep } from "@/types/stream";

interface AnalysisProgressProps {
  activeStep: AnalysisProgressStep | null;
  message?: string | null;
  homeTeam?: string;
  awayTeam?: string;
}

export function AnalysisProgress({
  activeStep,
  message,
  homeTeam,
  awayTeam,
}: AnalysisProgressProps) {
  return (
    <AnalysisResearchStage
      activeStep={activeStep}
      message={message}
      homeTeam={homeTeam}
      awayTeam={awayTeam}
    />
  );
}