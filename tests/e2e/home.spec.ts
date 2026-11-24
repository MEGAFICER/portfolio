import { expect, test } from '@playwright/test';

const SECTIONS = ['about', 'work', 'experience', 'skills', 'contact'];

test.describe('home page', () => {
  test('renders the name, role and availability', async ({ page }) => {
    await page.goto('./');

    await expect(page).toHaveTitle(/Khang Nguyen Tran/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Khang Nguyen Tran');
    await expect(
      page.getByText('Open to Winter 2027 internships and Summer 2027 co-op terms').first(),
    ).toBeVisible();

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.length ?? 0).toBeGreaterThan(60);
    expect(description?.length ?? 0).toBeLessThanOrEqual(160);
  });

  test('has exactly one h1 and one main landmark', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByRole('main')).toHaveCount(1);
  });

  test('every navigation link resolves to a real section', async ({ page }) => {
    await page.goto('./');

    for (const id of SECTIONS) {
      const link = page.locator(`header a[href$="#${id}"]`).first();
      await expect(link).toBeAttached();
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test('skip link moves focus into main', async ({ page }) => {
    await page.goto('./');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skip).toBeFocused();

    await page.keyboard.press('Enter');
    const focusedId = await page.evaluate(() => document.activeElement?.id);
    expect(focusedId).toBe('main');
  });

  test('publishes valid Person structured data', async ({ page }) => {
    await page.goto('./');
    const json = await page.locator('script[type="application/ld+json"]').first().textContent();
    const data = JSON.parse(json ?? '{}');

    expect(data['@type']).toBe('Person');
    expect(data.name).toBe('Khang Nguyen Tran');
    expect(data.jobTitle).toBe('Physical Design Engineer');
    expect(data.email).toBe('mailto:ktran037@uottawa.ca');
    expect(data.sameAs).toHaveLength(2);
  });

  test('exposes canonical and social metadata', async ({ page }) => {
    await page.goto('./');
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toMatch(/\/portfolio\/$/);

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toMatch(/og\/og\.png$/);
  });

  test('theme toggle cycles system → light → dark and persists', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('./');

    const html = page.locator('html');
    const toggle = page.getByRole('button', { name: /theme/i }).first();

    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(toggle).toContainText('auto');

    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(toggle).toContainText('light');

    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(toggle).toContainText('dark');

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(toggle).toContainText('dark');

    // dark → system, and the device is still dark, so the resolved theme holds
    await toggle.click();
    await expect(toggle).toContainText('auto');
    await expect(html).toHaveAttribute('data-theme', 'dark');

    // system → light, and the explicit choice survives a reload
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'light');
  });

  test('stays inside the viewport at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto('./');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test.describe('resume delivery', () => {
  test('downloads a timestamped PDF', async ({ page }) => {
    await page.goto('./');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page
        .locator('#top')
        .getByRole('link', { name: /download resume/i })
        .click(),
    ]);

    expect(download.suggestedFilename()).toMatch(
      /^Khang-Nguyen-Tran-Resume-\d{4}-\d{2}-\d{2}-\d{4}\.pdf$/,
    );

    const path = await download.path();
    expect(path).toBeTruthy();
  });

  test('serves the PDF with the right content type', async ({ request }) => {
    const response = await request.get('resume/khang-nguyen-tran-resume.pdf');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');

    const body = await response.body();
    expect(body.subarray(0, 4).toString()).toBe('%PDF');
    expect(body.byteLength).toBeGreaterThan(20_000);
  });
});

test.describe('not found', () => {
  test('unknown paths render the styled 404', async ({ page }) => {
    await page.goto('does-not-exist/');
    await expect(page.getByText('This route does not exist.')).toBeVisible();
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots).toContain('noindex');
  });
});
