import type { AnalysisStreamEvent } from "@/types/stream";

export function encodeSseEvent(event: AnalysisStreamEvent): string {
  const eventName = event.type;
  return `event: ${eventName}\ndata: ${JSON.stringify(event)}\n\n`;
}

export function createSseStream(
  handler: (
    emit: (event: AnalysisStreamEvent) => void,
  ) => Promise<void>,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      const emit = (event: AnalysisStreamEvent) => {
        controller.enqueue(encoder.encode(encodeSseEvent(event)));
      };

      try {
        await handler(emit);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Stream failed unexpectedly";
        emit({ type: "error", message });
      } finally {
        controller.close();
      }
    },
  });
}