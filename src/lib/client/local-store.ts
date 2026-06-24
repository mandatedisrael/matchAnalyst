import type { AnalysisResult, SavedAnalysis } from "@/types/analysis";
import type { UserPreferences } from "@/types/user";
import { DEFAULT_USER_PREFERENCES } from "@/types/user";

const PREFERENCES_KEY = "ai-ball:preferences";
const SAVED_KEY = "ai-ball:saved";
const MAX_SAVED = 30;

function readStorage<T>(key: string, fallback: T, legacyKey?: string): T {
  if (typeof window === "undefined") return fallback;

  try {
    let raw = window.localStorage.getItem(key);
    if (!raw && legacyKey) {
      raw = window.localStorage.getItem(legacyKey);
      if (raw) writeStorage(key, JSON.parse(raw) as T);
    }
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadPreferences(): UserPreferences {
  return readStorage(
    PREFERENCES_KEY,
    DEFAULT_USER_PREFERENCES,
    "match-analyst:preferences",
  );
}

export function savePreferences(
  patch: Partial<Pick<UserPreferences, "favoriteTeams" | "favoriteLeagues">>,
): UserPreferences {
  const current = loadPreferences();
  const next: UserPreferences = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  writeStorage(PREFERENCES_KEY, next);
  window.dispatchEvent(new Event("ai-ball:store"));
  return next;
}

export function loadSavedAnalyses(): SavedAnalysis[] {
  const items = readStorage<SavedAnalysis[]>(SAVED_KEY, [], "match-analyst:saved");
  return [...items].sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function saveAnalysisResult(result: AnalysisResult): SavedAnalysis {
  const items = loadSavedAnalyses();
  const saved: SavedAnalysis = {
    id: crypto.randomUUID(),
    result,
    polymarketSnapshot: result.polymarket,
    savedAt: new Date().toISOString(),
  };

  const next = [saved, ...items.filter((item) => item.id !== saved.id)].slice(
    0,
    MAX_SAVED,
  );
  writeStorage(SAVED_KEY, next);
  window.dispatchEvent(new Event("ai-ball:store"));
  return saved;
}

export function deleteSavedAnalysis(id: string): void {
  const next = loadSavedAnalyses().filter((item) => item.id !== id);
  writeStorage(SAVED_KEY, next);
  window.dispatchEvent(new Event("ai-ball:store"));
}

export function clearSavedAnalyses(): void {
  writeStorage(SAVED_KEY, []);
  window.dispatchEvent(new Event("ai-ball:store"));
}