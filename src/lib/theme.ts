export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "ai-ball-theme";

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored =
    localStorage.getItem(THEME_STORAGE_KEY) ??
    localStorage.getItem("matchanalyst-theme");
  if (stored === "light" || stored === "dark") {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      localStorage.setItem(THEME_STORAGE_KEY, stored);
    }
    return stored;
  }
  return null;
}

export function resolveTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = getStoredTheme();
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
}