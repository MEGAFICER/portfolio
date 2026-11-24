import { defineConfig, devices } from '@playwright/test';

const PORT = 4322;
const BASE_PATH = '/portfolio/';

/**
 * E2E and accessibility tests run against the real production build served by
 * `astro preview`, so base-path, asset and PDF behaviour is exercised the same
 * way GitHub Pages serves it.
 */
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: `http://localhost:${PORT}${BASE_PATH}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'desktop-dark',
      use: { ...devices['Desktop Chrome'], colorScheme: 'dark' },
    },
    {
      name: 'desktop-light',
      use: { ...devices['Desktop Chrome'], colorScheme: 'light' },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], colorScheme: 'dark' },
    },
  ],
  webServer: {
    command: `npm run build && node scripts/serve-dist.mjs --port ${PORT} --base ${BASE_PATH}`,
    url: `http://localhost:${PORT}${BASE_PATH}`,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
