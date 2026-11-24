// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ---------------------------------------------------------------------------
// Deployment target: GitHub Pages, project site at
//   https://megaficer.github.io/portfolio/
//
// If the site ever moves (custom domain, user site, renamed repo), change
// SITE and BASE here only. See docs/adr/ADR-0005-url-and-base-path-strategy.md
// ---------------------------------------------------------------------------
const SITE = 'https://megaficer.github.io';
const BASE = '/portfolio';

export default defineConfig({
  site: SITE,
  base: BASE,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // `trailingSlash: 'ignore'` makes Astro emit both /portfolio and
      // /portfolio/ for the homepage; keep only the canonical form and never
      // list the 404 page.
      filter: (page) => {
        if (/\/404\/?$/.test(page)) return false;
        try {
          const { pathname } = new URL(page);
          return pathname === '/' || pathname.endsWith('/');
        } catch {
          return false;
        }
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  devToolbar: {
    enabled: false,
  },
});
