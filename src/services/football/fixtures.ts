import {
  getSeasonForLeague,
  SUPPORTED_LEAGUES,
  WORLD_CUP_LEAGUE_ID,
} from "@/lib/leagues";
import type { FixtureSummary } from "@/types/fixture";
import { footballFetch } from "@/services/football/client";

interface ApiFootballFixture {
  fixture: {
    id: number;
    date: string;
    venue?: { name?: string };
    status: { short: string };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo?: string;
  };
  teams: {
    home: { id: number; name: string; logo?: string };
    away: { id: number; name: string; logo?: string };
  };
}

interface FixturesResponse {
  response: ApiFootballFixture[];
}

const LIVE_STATUSES = new Set([
  "LIVE",
  "1H",
  "HT",
  "2H",
  "ET",
  "BT",
  "P",
  "INT",
]);

function mapFixture(item: ApiFootballFixture): FixtureSummary {
  return {
    id: item.fixture.id,
    date: item.fixture.date,
    league: {
      id: item.league.id,
      name: item.league.name,
      country: item.league.country,
      logo: item.league.logo,
    },
    homeTeam: {
      id: item.teams.home.id,
      name: item.teams.home.name,
      logo: item.teams.home.logo,
    },
    awayTeam: {
      id: item.teams.away.id,
      name: item.teams.away.name,
      logo: item.teams.away.logo,
    },
    venue: item.fixture.venue?.name,
    status: item.fixture.status.short,
  };
}

async function fetchLiveFixtures(leagueId?: number): Promise<FixtureSummary[]> {
  const data = await footballFetch<FixturesResponse>("/fixtures", {
    live: "all",
  });

  let fixtures = data.response.map(mapFixture);
  if (leagueId) {
    fixtures = fixtures.filter((fixture) => fixture.league.id === leagueId);
  }

  return fixtures;
}

async function fetchLeagueFixtures(
  leagueId: number,
  from: string,
  to: string,
): Promise<FixtureSummary[]> {
  const season = getSeasonForLeague(leagueId);
  const data = await footballFetch<FixturesResponse>("/fixtures", {
    league: leagueId,
    season,
    from,
    to,
    timezone: "UTC",
  });

  return data.response.map(mapFixture);
}

function dedupeFixtures(fixtures: FixtureSummary[]): FixtureSummary[] {
  const byId = new Map<number, FixtureSummary>();
  for (const fixture of fixtures) {
    byId.set(fixture.id, fixture);
  }
  return [...byId.values()];
}

function sortFixtures(fixtures: FixtureSummary[]): FixtureSummary[] {
  return fixtures.sort((a, b) => {
    const aLive = LIVE_STATUSES.has(a.status) ? 0 : 1;
    const bLive = LIVE_STATUSES.has(b.status) ? 0 : 1;
    if (aLive !== bLive) return aLive - bLive;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}

function filterFixtures(
  fixtures: FixtureSummary[],
  query?: string,
  leagueId?: number,
): FixtureSummary[] {
  let filtered = fixtures;

  if (leagueId) {
    filtered = filtered.filter((fixture) => fixture.league.id === leagueId);
  }

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (fixture) =>
        fixture.homeTeam.name.toLowerCase().includes(q) ||
        fixture.awayTeam.name.toLowerCase().includes(q) ||
        fixture.league.name.toLowerCase().includes(q),
    );
  }

  return sortFixtures(filtered).slice(0, 40);
}

export async function searchFixtures(options: {
  query?: string;
  leagueId?: number;
  days?: number;
}): Promise<FixtureSummary[]> {
  const days = options.days ?? 14;
  const from = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const to = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const defaultToWorldCup = !options.query && !options.leagueId;
  const leagueIds = options.leagueId
    ? [options.leagueId]
    : options.query
      ? SUPPORTED_LEAGUES.map((league) => league.id)
      : [WORLD_CUP_LEAGUE_ID];

  const liveLeagueFilter = defaultToWorldCup ? WORLD_CUP_LEAGUE_ID : options.leagueId;

  const [liveFixtures, ...batches] = await Promise.all([
    fetchLiveFixtures(liveLeagueFilter).catch(() => []),
    ...leagueIds.map((leagueId) =>
      fetchLeagueFixtures(leagueId, from, to).catch(() => []),
    ),
  ]);

  const merged = dedupeFixtures([...liveFixtures, ...batches.flat()]);
  return filterFixtures(
    merged,
    options.query,
    options.leagueId ?? (defaultToWorldCup ? WORLD_CUP_LEAGUE_ID : undefined),
  );
}

export async function getFixtureById(
  fixtureId: number,
): Promise<FixtureSummary | null> {
  const data = await footballFetch<FixturesResponse>("/fixtures", {
    id: fixtureId,
  });

  const item = data.response[0];
  return item ? mapFixture(item) : null;
}