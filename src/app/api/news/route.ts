import { NextResponse } from "next/server";

import { fetchFootballNews } from "@/services/news/rss";

export const revalidate = 900;

export async function GET() {
  try {
    const items = await fetchFootballNews();
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json(
      { error: "Could not load football news", items: [] },
      { status: 500 },
    );
  }
}