import type { AnalysisResult } from "@/types/analysis";

export type AnalysisProgressStep =
  | "fixture"
  | "football"
  | "polymarket"
  | "weather"
  | "inference"
  | "complete";

export interface AnalysisProgressEvent {
  type: "progress";
  step: AnalysisProgressStep;
  message: string;
}

export interface AnalysisResultEvent {
  type: "result";
  result: AnalysisResult;
}

export interface AnalysisErrorEvent {
  type: "error";
  message: string;
}

export type AnalysisStreamEvent =
  | AnalysisProgressEvent
  | AnalysisResultEvent
  | AnalysisErrorEvent;