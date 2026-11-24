#!/usr/bin/env node
/**
 * Minimal static server for `dist/` that reproduces GitHub Pages project-site
 * behaviour: files are served under a base path (`/portfolio/`), unknown paths
 * return `404.html` with status 404, and directories resolve to `index.html`.
 *
 * Used by Playwright (tests/e2e) and Lighthouse CI, because `astro preview`
 * daemonises and exits, which breaks process-based test harnesses.
 *
 *   node scripts/serve-dist.mjs --port 4322 --base /portfolio
 */
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index], process.argv[index + 1]);
}

const port = Number(args.get('--port') ?? 4322);
const base = `/${(args.get('--base') ?? '/portfolio').replace(/^\/+|\/+$/g, '')}`.replace(
  /\/$/,
  '',
);
const root = resolve(fileURLToPath(new URL('../dist', import.meta.url)));

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

async function resolveFile(pathname) {
  const relative = decodeURIComponent(pathname).replace(/^\/+/, '');
  const target = normalize(join(root, relative));
  if (!target.startsWith(root + sep) && target !== root) return null;

  try {
    const info = await stat(target);
    if (info.isDirectory()) {
      const index = join(target, 'index.html');
      const indexInfo = await stat(index);
      return indexInfo.isFile() ? index : null;
    }
    return info.isFile() ? target : null;
  } catch {
    return null;
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://localhost:${port}`);
  let pathname = url.pathname;

  if (base && pathname === base) {
    response.writeHead(301, { location: `${base}/` });
    response.end();
    return;
  }

  if (base) {
    if (!pathname.startsWith(`${base}/`)) {
      const notFound = join(root, '404.html');
      response.writeHead(404, { 'content-type': TYPES['.html'] });
      createReadStream(notFound).pipe(response);
      return;
    }
    pathname = pathname.slice(base.length) || '/';
  }

  const file = await resolveFile(pathname);
  if (!file) {
    const notFound = join(root, '404.html');
    response.writeHead(404, { 'content-type': TYPES['.html'] });
    createReadStream(notFound).pipe(response);
    return;
  }

  response.writeHead(200, {
    'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
    'cache-control': 'no-store',
  });
  createReadStream(file).pipe(response);
});

server.listen(port, () => {
  console.log(`serving ${root} at http://localhost:${port}${base}/ — listening on ${port}`);
});
