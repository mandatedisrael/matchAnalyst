import type { FootballNewsItem } from "@/types/news";

const RSS_FEEDS = [
  { url: "https://feeds.bbci.co.uk/sport/football/rss.xml", source: "BBC Sport" },
  {
    url: "https://www.theguardian.com/football/rss",
    source: "The Guardian",
  },
] as const;

const FALLBACK_HEADLINES: FootballNewsItem[] = [
  {
    id: "fallback-1",
    title: "Search any team to find their next fixture and AI breakdown",
    url: "https://aiballanalysis.vercel.app/",
    source: "ai.ball",
  },
  {
    id: "fallback-2",
    title: "TEE-verified match analysis powered by 0G compute",
    url: "https://aiballanalysis.vercel.app/",
    source: "ai.ball",
  },
  {
    id: "fallback-3",
    title: "Compare AI probabilities with Polymarket and Kalshi prices",
    url: "https://aiballanalysis.vercel.app/",
    source: "ai.ball",
  },
];

function decodeXmlText(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .trim();
}

function extractTag(block: string, tag: string): string | null {
  const cdata = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i");
  const plain = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = block.match(cdata) ?? block.match(plain);
  return match?.[1] ? decodeXmlText(match[1]) : null;
}

function parseRssItems(xml: string, source: string): FootballNewsItem[] {
  const items: FootballNewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = extractTag(block, "title");
    const link = extractTag(block, "link");
    const guid = extractTag(block, "guid");
    const pubDate = extractTag(block, "pubDate");

    if (!title || !link) continue;

    items.push({
      id: guid ?? link,
      title,
      url: link,
      source,
      publishedAt: pubDate ?? undefined,
    });

    if (items.length >= 12) break;
  }

  return items;
}

async function fetchFeed(
  feed: (typeof RSS_FEEDS)[number],
): Promise<FootballNewsItem[]> {
  const response = await fetch(feed.url, {
    headers: { Accept: "application/rss+xml, application/xml, text/xml" },
    next: { revalidate: 900 },
  });

  if (!response.ok) {
    throw new Error(`RSS feed failed: ${feed.source}`);
  }

  const xml = await response.text();
  return parseRssItems(xml, feed.source);
}

export async function fetchFootballNews(): Promise<FootballNewsItem[]> {
  for (const feed of RSS_FEEDS) {
    try {
      const items = await fetchFeed(feed);
      if (items.length > 0) return items;
    } catch {
      continue;
    }
  }

  return FALLBACK_HEADLINES;
}