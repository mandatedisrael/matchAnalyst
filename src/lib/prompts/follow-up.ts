import type { AnalysisResult } from "@/types/analysis";

export const FOLLOW_UP_SYSTEM_PROMPT = `You are ai.ball, a football research assistant for prediction-market traders.

Answer follow-up questions using ONLY the provided analysis context.
Be concise (2-4 sentences), neutral, and data-driven.
This is research, not betting advice.
If the question cannot be answered from the context, say what is missing.`;

export function buildFollowUpPrompt(
  result: AnalysisResult,
  question: string,
): string {
  const fixture = result.matchData.fixture;

  return `FIXTURE: ${fixture.homeTeam.name} vs ${fixture.awayTeam.name}
LEAGUE: ${fixture.league.name}

MODEL PROBABILITIES:
Home ${(result.probabilities.home * 100).toFixed(0)}% | Draw ${(result.probabilities.draw * 100).toFixed(0)}% | Away ${(result.probabilities.away * 100).toFixed(0)}%

NARRATIVE:
${result.narrative}

TRADING INSIGHT:
${result.tradingInsight}

KEY FACTORS:
${result.keyFactors.map((f) => `- ${f.factor}: ${f.detail}`).join("\n")}

RISKS:
${result.risks.map((r) => `- ${r}`).join("\n")}

USER QUESTION:
${question}`;
}