import type { FixtureSummary } from "@/types/fixture";

const STORAGE_KEY = "match-analyst:fixture";

export function stashFixtureForNavigation(fixture: FixtureSummary): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ id: fixture.id, fixture }),
    );
  } catch {
    // Ignore quota or privacy-mode errors.
  }
}

export function readStashedFixture(fixtureId: number): FixtureSummary | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { id: number; fixture: FixtureSummary };
    return parsed.id === fixtureId ? parsed.fixture : null;
  } catch {
    return null;
  }
}