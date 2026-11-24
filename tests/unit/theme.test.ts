import { describe, expect, it, vi } from 'vitest';
import {
  applyTheme,
  nextPreference,
  parsePreference,
  readStoredPreference,
  resolveTheme,
  storePreference,
  THEME_CYCLE,
  THEME_STORAGE_KEY,
  themeShortLabel,
  themeToggleLabel,
} from '@/lib/theme';

describe('parsePreference', () => {
  it('accepts the three valid preferences', () => {
    expect(parsePreference('system')).toBe('system');
    expect(parsePreference('light')).toBe('light');
    expect(parsePreference('dark')).toBe('dark');
  });

  it('falls back to system for anything else', () => {
    expect(parsePreference(null)).toBe('system');
    expect(parsePreference(undefined)).toBe('system');
    expect(parsePreference('')).toBe('system');
    expect(parsePreference('DARK')).toBe('system');
    expect(parsePreference('sepia')).toBe('system');
  });
});

describe('resolveTheme', () => {
  it('honours an explicit preference regardless of the device', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('follows the device when the preference is system', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
  });
});

describe('nextPreference', () => {
  it('cycles system → light → dark → system', () => {
    expect(nextPreference('system')).toBe('light');
    expect(nextPreference('light')).toBe('dark');
    expect(nextPreference('dark')).toBe('system');
  });

  it('visits every state exactly once per cycle', () => {
    const seen: string[] = [];
    let current = THEME_CYCLE[0] ?? 'system';
    for (let step = 0; step < THEME_CYCLE.length; step += 1) {
      seen.push(current);
      current = nextPreference(current);
    }
    expect(new Set(seen).size).toBe(THEME_CYCLE.length);
    expect(current).toBe(THEME_CYCLE[0]);
  });
});

describe('labels', () => {
  it('describes the action for assistive technology in every state', () => {
    expect(themeToggleLabel('system', 'dark')).toContain('currently dark');
    expect(themeToggleLabel('system', 'dark')).toContain('Switch to light');
    expect(themeToggleLabel('light', 'light')).toContain('Switch to dark');
    expect(themeToggleLabel('dark', 'dark')).toContain('following your device');
  });

  it('keeps the visible label short and state-true', () => {
    expect(themeShortLabel('system')).toBe('auto');
    expect(themeShortLabel('light')).toBe('light');
    expect(themeShortLabel('dark')).toBe('dark');
  });
});

describe('storage helpers', () => {
  it('reads a stored preference', () => {
    const storage = { getItem: vi.fn(() => 'dark') };
    expect(readStoredPreference(storage)).toBe('dark');
    expect(storage.getItem).toHaveBeenCalledWith(THEME_STORAGE_KEY);
  });

  it('returns system when storage is unavailable or throws', () => {
    expect(readStoredPreference(null)).toBe('system');
    const broken = {
      getItem: () => {
        throw new Error('blocked');
      },
    };
    expect(readStoredPreference(broken)).toBe('system');
  });

  it('writes the preference and swallows storage failures', () => {
    const storage = { setItem: vi.fn() };
    storePreference(storage, 'light');
    expect(storage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, 'light');

    const broken = {
      setItem: () => {
        throw new Error('quota');
      },
    };
    expect(() => storePreference(broken, 'dark')).not.toThrow();
    expect(() => storePreference(null, 'dark')).not.toThrow();
  });
});

describe('applyTheme', () => {
  it('sets the data attribute and colour-scheme used by CSS', () => {
    const doc = {
      documentElement: {
        dataset: {} as Record<string, string>,
        style: {} as Record<string, string>,
      },
    } as unknown as Document;

    applyTheme(doc, 'dark');
    expect(doc.documentElement.dataset.theme).toBe('dark');
    expect(doc.documentElement.style.colorScheme).toBe('dark');

    applyTheme(doc, 'light');
    expect(doc.documentElement.dataset.theme).toBe('light');
    expect(doc.documentElement.style.colorScheme).toBe('light');
  });
});
