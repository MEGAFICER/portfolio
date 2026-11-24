import { describe, expect, it } from 'vitest';
import { SECTIONS } from '@/lib/nav';

describe('navigation registry', () => {
  it('lists the five navigable sections in reading order', () => {
    expect(SECTIONS.map((section) => section.id)).toEqual([
      'about',
      'work',
      'experience',
      'skills',
      'contact',
    ]);
  });

  it('uses unique, anchor-safe ids', () => {
    const ids = SECTIONS.map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z][a-z0-9-]*$/);
  });

  it('gives every section a human label', () => {
    for (const section of SECTIONS) {
      expect(section.label.length).toBeGreaterThan(2);
      expect(section.label.trim()).toBe(section.label);
    }
  });
});
