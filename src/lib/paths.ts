/**
 * Base-path helpers.
 *
 * GitHub Pages serves this project site from `/portfolio/`, so every internal
 * URL must be prefixed with `import.meta.env.BASE_URL`. Keeping the join logic
 * in one tested function is the cheapest way to avoid the classic
 * "works locally, 404 on Pages" asset bug.
 */

export function withBase(base: string, path: string): string {
  const normalizedBase = base === '' || base === '/' ? '' : `/${base.replace(/^\/+|\/+$/g, '')}`;
  if (path.startsWith('#')) return `${normalizedBase}/${path}`;
  return `${normalizedBase}/${path.replace(/^\/+/, '')}`;
}
