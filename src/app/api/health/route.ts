import { NextResponse } from "next/server";

import {
  hasApiFootball,
  hasOpenWeather,
  hasZerogCompute,
} from "@/lib/env";

export async function GET() {
  const apiFootball = hasApiFootball();
  const zerogCompute = hasZerogCompute();

  return NextResponse.json({
    status: "ok",
    storage: "browser-local",
    services: {
      apiFootball,
      zerogCompute,
      openWeather: hasOpenWeather(),
      polymarket: true,
    },
    mode:
      apiFootball && zerogCompute
        ? "live"
        : apiFootball
          ? "football-only"
          : zerogCompute
            ? "compute-only"
            : "unconfigured",
  });
}