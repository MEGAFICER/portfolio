/**
 * Theme preference logic.
 *
 * Three states, in the order the toggle cycles through them:
 *   system → light → dark → system
 *
 * "system" follows `prefers-color-scheme` and updates live; the explicit
 * states override it and persist. All of this is pure so it can be unit
 * tested without a DOM.
 */

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'knt-theme';
export const THEME_CYCLE: readonly ThemePreference[] = ['system', 'light', 'dark'] as const;

export function parsePreference(raw: string | null | undefined): ThemePreference {
  return raw === 'light' || raw === 'dark' || raw === 'system' ? raw : 'system';
}

export function resolveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): ResolvedTheme {
  if (preference === 'light' || preference === 'dark') return preference;
  return systemPrefersDark ? 'dark' : 'light';
}

export function nextPreference(current: ThemePreference): ThemePreference {
  const index = THEME_CYCLE.indexOf(current);
  return THEME_CYCLE[(index + 1) % THEME_CYCLE.length] ?? 'system';
}

/** Accessible name for the toggle button: starts with the visible label so
 *  WCAG 2.5.3 (label in name) holds, then states what pressing it does. */
export function themeToggleLabel(preference: ThemePreference, resolved: ResolvedTheme): string {
  const visible = themeShortLabel(preference);
  if (preference === 'system') {
    return `${visible} theme — following your device (currently ${resolved}). Switch to light theme.`;
  }
  if (preference === 'light') {
    return `${visible} theme is on. Switch to dark theme.`;
  }
  return `${visible} theme is on. Switch back to following your device.`;
}

/** Short visible label for the control. */
export function themeShortLabel(preference: ThemePreference): string {
  return preference === 'system' ? 'auto' : preference;
}

/** Applies a resolved theme to a document element. */
export function applyTheme(doc: Document, theme: ResolvedTheme): void {
  doc.documentElement.dataset.theme = theme;
  doc.documentElement.style.colorScheme = theme;
}

export function readStoredPreference(storage: Pick<Storage, 'getItem'> | null): ThemePreference {
  try {
    return parsePreference(storage?.getItem(THEME_STORAGE_KEY));
  } catch {
    return 'system';
  }
}

export function storePreference(
  storage: Pick<Storage, 'setItem'> | null,
  preference: ThemePreference,
): void {
  try {
    storage?.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    /* storage can be unavailable (private mode, blocked cookies) — theme still applies for the session */
  }
}
