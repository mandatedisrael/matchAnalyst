import type { AnalysisResult } from "@/types/analysis";

export function isTeeVerified(result: Pick<AnalysisResult, "teeVerified" | "source">) {
  return result.teeVerified ?? result.source === "0g-compute";
}