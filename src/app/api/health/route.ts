import { NextResponse } from "next/server";

import {
  hasApiFootball,
  hasOpenWeather,
  hasZerogCompute,
} from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    storage: "browser-local",
    services: {
      apiFootball: hasApiFootball(),
      zerogCompute: hasZerogCompute(),
      openWeather: hasOpenWeather(),
      polymarket: true,
    },
    mode:
      hasApiFootball() && hasZerogCompute()
        ? "live"
        : hasApiFootball()
          ? "football-only"
          : "demo",
  });
}