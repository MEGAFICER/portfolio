import { describe, expect, it } from 'vitest';
import { buildPageMeta, buildPersonJsonLd, joinUrl } from '@/lib/seo';
import { profile } from '@/data';

describe('joinUrl', () => {
  it('produces a trailing-slash page URL', () => {
    expect(joinUrl('https://megaficer.github.io', '/portfolio')).toBe(
      'https://megaficer.github.io/portfolio/',
    );
  });

  it('appends a path segment', () => {
    expect(joinUrl('https://megaficer.github.io', '/portfolio/', '404')).toBe(
      'https://megaficer.github.io/portfolio/404/',
    );
  });

  it('tolerates messy slashes and a root base', () => {
    expect(joinUrl('https://example.com/', '/', '/')).toBe('https://example.com/');
    expect(joinUrl('https://example.com', '', 'resume')).toBe('https://example.com/resume/');
  });
});

describe('buildPageMeta', () => {
  const base = {
    site: 'https://megaficer.github.io',
    base: '/portfolio',
    title: 'Khang Nguyen Tran — Physical Design Engineer',
    description: 'Portfolio of Khang Nguyen Tran.',
    siteName: 'Khang Nguyen Tran — Physical Design Engineer',
  };

  it('builds canonical, image and robots defaults', () => {
    const meta = buildPageMeta(base);
    expect(meta.canonical).toBe('https://megaficer.github.io/portfolio/');
    expect(meta.image).toBe('https://megaficer.github.io/portfolio/og/og.png');
    expect(meta.type).toBe('profile');
    expect(meta.twitterCard).toBe('summary_large_image');
    expect(meta.robots).toContain('index');
    expect(meta.robots).toContain('max-image-preview:large');
  });

  it('marks non-home paths as website type', () => {
    const meta = buildPageMeta({ ...base, path: '404' });
    expect(meta.canonical).toBe('https://megaficer.github.io/portfolio/404/');
    expect(meta.type).toBe('website');
  });

  it('can no-index a page', () => {
    const meta = buildPageMeta({ ...base, path: '404', noIndex: true });
    expect(meta.robots).toBe('noindex, nofollow');
  });

  it('keeps the description within a search-friendly length', () => {
    const meta = buildPageMeta(base);
    expect(meta.description.length).toBeLessThanOrEqual(160);
  });
});

describe('buildPersonJsonLd', () => {
  const jsonLd = buildPersonJsonLd(profile, 'https://megaficer.github.io/portfolio/');

  it('describes the person with schema.org Person', () => {
    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe('Person');
    expect(jsonLd.name).toBe(profile.name);
    expect(jsonLd.jobTitle).toBe('Physical Design Engineer');
    expect(jsonLd.url).toBe('https://megaficer.github.io/portfolio/');
  });

  it('publishes contact and profile links', () => {
    expect(jsonLd.email).toBe(`mailto:${profile.email}`);
    expect(jsonLd.telephone).toBe(profile.phone.display);
    expect(jsonLd.sameAs).toEqual([profile.links.linkedin, profile.links.github]);
  });

  it('lists both universities and the languages', () => {
    const alumni = jsonLd.alumniOf as { name: string }[];
    expect(alumni.map((school) => school.name)).toEqual([
      'University of Ottawa',
      'Ho Chi Minh City University of Technology',
    ]);
    expect(jsonLd.knowsLanguage).toEqual(['en', 'vi']);
  });

  it('serialises without undefined values', () => {
    const serialised = JSON.stringify(jsonLd);
    expect(serialised).not.toContain('undefined');
    expect(serialised).not.toContain('[object Object]');
  });
});
