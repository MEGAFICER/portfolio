import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Accessibility gate.
 *
 * Runs the axe-core WCAG 2.0/2.1/2.2 A + AA rule sets against the real build in
 * every viewport/browser project the config defines (desktop dark, desktop
 * light, iPhone). A violation fails CI.
 *
 * Automated rules cannot catch everything in WCAG 2.2 AA (e.g. meaningful
 * reading order), so docs/prd/PRD-005-accessibility.md carries the manual
 * checklist that accompanies this gate.
 */

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

test.describe('accessibility', () => {
  test('home page has no axe violations', async ({ page }) => {
    await page.goto('./');
    await page.waitForLoadState('load');

    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();

    const summary = results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.map((node) => node.target.join(' ')),
    }));

    expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
  });

  test('both themes are accessible', async ({ page }) => {
    await page.goto('./');
    const toggle = page.getByRole('button', { name: /theme/i }).first();

    for (const expected of ['light', 'dark']) {
      await toggle.click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', expected);
      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      expect(
        results.violations.map((violation) => violation.id),
        expected,
      ).toEqual([]);
    }
  });

  test('keyboard path reaches every section without a mouse', async ({ page, isMobile }) => {
    test.skip(Boolean(isMobile), 'the mobile navigation lives in a collapsed details menu');

    await page.goto('./');

    const visited = new Set<string>();
    for (let press = 0; press < 40; press += 1) {
      await page.keyboard.press('Tab');
      const href = await page.evaluate(() => {
        const active = document.activeElement as HTMLAnchorElement | null;
        return active?.getAttribute('href') ?? '';
      });
      if (href.includes('#')) visited.add(href.split('#')[1] ?? '');
    }

    for (const id of ['about', 'work', 'experience', 'skills', 'contact']) {
      expect(visited.has(id), `keyboard never reached #${id}`).toBe(true);
    }
  });
});
