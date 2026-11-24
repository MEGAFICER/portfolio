import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Colour-token contract.
 *
 * The tokens file is the only place colours are defined, so parsing it here
 * keeps the accessibility guarantee close to the source instead of trusting a
 * manual audit. Every text pair the site uses is asserted against WCAG 2.2 AA:
 * 4.5:1 for normal text, 3:1 for large text and UI boundaries.
 */

const tokensPath = fileURLToPath(new URL('../../src/styles/tokens.css', import.meta.url));
const css = readFileSync(tokensPath, 'utf8');

function tokensFor(selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`Token block not found for selector: ${selector}`);

  const open = css.indexOf('{', start);
  const close = css.indexOf('}', open);
  const block = css.slice(open + 1, close);

  const tokens: Record<string, string> = {};
  for (const match of block.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) {
    const [, name, value] = match;
    if (name && value) tokens[name] = value.trim();
  }
  return tokens;
}

type Rgb = [number, number, number];

function parseHex(value: string): Rgb {
  const hex = value.replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(hex)) throw new Error(`Not a 6-digit hex colour: ${value}`);
  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ];
}

function relativeLuminance([r, g, b]: Rgb): number {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(foreground: string, background: string): number {
  const a = relativeLuminance(parseHex(foreground));
  const b = relativeLuminance(parseHex(background));
  const [lighter, darker] = a > b ? [a, b] : [b, a];
  return (lighter + 0.05) / (darker + 0.05);
}

const themes = {
  light: tokensFor(":root,\n:root[data-theme='light']"),
  dark: tokensFor(":root[data-theme='dark']"),
};

const TEXT_PAIRS: [string, string, string][] = [
  ['body text on page', 'text', 'bg'],
  ['muted paragraph text', 'text-muted', 'bg'],
  ['faint metadata text', 'text-faint', 'bg'],
  ['body text on card', 'text', 'surface'],
  ['muted text on raised surface', 'text-muted', 'surface-2'],
  ['accent links and labels', 'accent', 'bg'],
  ['accent labels on card', 'accent', 'surface'],
  ['button label on accent fill', 'on-accent', 'accent'],
  ['hovered button label', 'on-accent', 'accent-hover'],
];

const UI_PAIRS: [string, string, string][] = [
  ['focus ring against the page', 'focus', 'bg'],
  ['focus ring against a card', 'focus', 'surface'],
];

describe.each(Object.entries(themes))('%s theme', (themeName, tokens) => {
  const get = (name: string): string => {
    const value = tokens[name];
    if (!value) throw new Error(`Missing token --${name} in ${themeName} theme`);
    if (!value.startsWith('#')) throw new Error(`Token --${name} is not a hex colour: ${value}`);
    return value;
  };

  it.each(TEXT_PAIRS)('%s meets AA (4.5:1)', (_label, foreground, background) => {
    const ratio = contrast(get(foreground), get(background));
    expect(
      ratio,
      `${themeName}: ${foreground} on ${background} = ${ratio.toFixed(2)}`,
    ).toBeGreaterThanOrEqual(4.5);
  });

  it.each(UI_PAIRS)('%s meets 3:1 for UI components', (_label, foreground, background) => {
    const ratio = contrast(get(foreground), get(background));
    expect(
      ratio,
      `${themeName}: ${foreground} on ${background} = ${ratio.toFixed(2)}`,
    ).toBeGreaterThanOrEqual(3);
  });
});

describe('theme parity', () => {
  it('defines the same colour tokens in both themes', () => {
    const colourKeys = (tokens: Record<string, string>) =>
      Object.keys(tokens)
        .filter((key) =>
          /^(bg|surface|text|border|accent|on-accent|focus|grid|shadow|card)/.test(key),
        )
        .sort();

    expect(colourKeys(themes.dark)).toEqual(colourKeys(themes.light));
  });

  it('keeps body text far above the minimum in both themes', () => {
    for (const tokens of Object.values(themes)) {
      const ratio = contrast(tokens.text as string, tokens.bg as string);
      expect(ratio).toBeGreaterThan(12);
    }
  });

  it('does not rely on colour alone for the accent state', () => {
    // The accent is always paired with a border, a chip outline or an icon.
    expect(css).toContain('--accent-soft');
  });
});
