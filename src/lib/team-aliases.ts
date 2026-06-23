const ALIASES: Record<string, string[]> = {
  arsenal: ["arsenal fc", "ars"],
  chelsea: ["chelsea fc", "che"],
  "manchester united": ["man united", "man utd", "mufc"],
  "manchester city": ["man city", "mcfc"],
  liverpool: ["liverpool fc", "lfc"],
  tottenham: ["tottenham hotspur", "spurs"],
  "real madrid": ["real madrid cf", "madrid"],
  barcelona: ["fc barcelona", "barca"],
  "paris saint germain": ["psg", "paris sg"],
  "bayern munich": ["bayern munchen", "fc bayern"],
  "borussia dortmund": ["bvb", "dortmund"],
  juventus: ["juventus fc"],
  "ac milan": ["milan"],
  inter: ["inter milan", "internazionale"],
  atletico: ["atletico madrid"],
};

export function normalizeTeamName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function teamTokens(name: string): string[] {
  const normalized = normalizeTeamName(name);
  const tokens = new Set<string>([normalized]);

  for (const [canonical, aliases] of Object.entries(ALIASES)) {
    const all = [canonical, ...aliases];
    if (all.some((alias) => normalized.includes(alias) || alias.includes(normalized))) {
      for (const alias of all) tokens.add(alias);
      tokens.add(canonical);
    }
  }

  return Array.from(tokens);
}

export function teamsMatchInText(
  homeTeam: string,
  awayTeam: string,
  text: string,
): boolean {
  const haystack = normalizeTeamName(text);
  const homeHit = teamTokens(homeTeam).some((token) => haystack.includes(token));
  const awayHit = teamTokens(awayTeam).some((token) => haystack.includes(token));
  return homeHit && awayHit;
}

export function buildPolymarketSearchQuery(
  homeTeam: string,
  awayTeam: string,
): string {
  return `${homeTeam} ${awayTeam}`;
}