import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Guardrails for the two stylesheet rules that are easy to "improve" and
 * catastrophic to get wrong.
 */

const read = (file: string) =>
  readFileSync(fileURLToPath(new URL(`../../src/styles/${file}`, import.meta.url)), 'utf8');

const baseCss = read('base.css');
const motionCss = read('motion.css');

function blockFor(css: string, selector: string): string {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`Rule not found: ${selector}`);
  const end = css.indexOf('\n}', start);
  return css.slice(start, end);
}

describe('theme switching', () => {
  it('does not transition background or colour on body', () => {
    // A transitioned body colour is inherited by every child, so half the page
    // stays dark while the other half turns light — unreadable for ~380 ms.
    const body = blockFor(baseCss, 'body');
    expect(body).not.toMatch(/transition\s*:/);
    expect(body).toMatch(/background-color:\s*var\(--bg\)/);
    expect(body).toMatch(/color:\s*var\(--text\)/);
  });

  it('still animates interactive elements', () => {
    expect(baseCss).toMatch(/transition:\s*color var\(--dur-1\)/);
    expect(baseCss).toMatch(/text-underline-offset/);
  });
});

describe('reduced motion', () => {
  it('neutralises animation and smooth scrolling for reduced-motion users', () => {
    expect(baseCss).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(baseCss).toMatch(/animation-duration:\s*0\.01ms !important/);
    expect(baseCss).toMatch(/scroll-behavior:\s*auto/);
  });

  it('gates every scroll-driven reveal behind support and preference queries', () => {
    expect(motionCss).toMatch(/@supports \(animation-timeline: view\(\)\)/);
    const revealIndex = motionCss.indexOf('.reveal {');
    const supportsIndex = motionCss.indexOf('@supports (animation-timeline: view())');
    const preferenceIndex = motionCss.indexOf('@media (prefers-reduced-motion: no-preference)');
    expect(revealIndex).toBeGreaterThan(supportsIndex);
    expect(preferenceIndex).toBeGreaterThan(-1);
    expect(revealIndex).toBeGreaterThan(preferenceIndex);
  });

  it('animates only compositor-friendly properties', () => {
    const keyframes = motionCss.match(/@keyframes[\s\S]*?\n}/g)?.join('\n') ?? '';
    expect(keyframes).not.toMatch(/(^|\s)(width|height|margin|padding|top|left):/m);
    expect(keyframes).toMatch(/opacity/);
    expect(keyframes).toMatch(/transform/);
  });
});
