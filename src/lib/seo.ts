import type { Profile } from '../data/schema';

export interface PageMetaInput {
  site: string;
  base: string;
  path?: string;
  title: string;
  description: string;
  siteName: string;
  imagePath?: string;
  noIndex?: boolean;
}

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  image: string;
  siteName: string;
  type: 'website' | 'profile';
  twitterCard: 'summary_large_image';
  robots: string;
}

function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, '');
}

/** Join site + base + path into one absolute URL, with a trailing slash for pages. */
export function joinUrl(site: string, base: string, path = ''): string {
  const origin = site.replace(/\/+$/, '');
  const basePart = trimSlashes(base);
  const pathPart = trimSlashes(path);
  const segments = [basePart, pathPart].filter(Boolean).join('/');
  return segments ? `${origin}/${segments}/` : `${origin}/`;
}

export function buildPageMeta(input: PageMetaInput): PageMeta {
  const {
    site,
    base,
    path = '',
    title,
    description,
    siteName,
    imagePath = 'og/og.png',
    noIndex,
  } = input;
  const canonical = joinUrl(site, base, path);
  const origin = site.replace(/\/+$/, '');
  const basePart = trimSlashes(base);
  const image = `${origin}/${[basePart, trimSlashes(imagePath)].filter(Boolean).join('/')}`;
  return {
    title,
    description,
    canonical,
    image,
    siteName,
    type: path ? 'website' : 'profile',
    twitterCard: 'summary_large_image',
    robots: noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large',
  };
}

/** schema.org Person, kept intentionally small and factual. */
export function buildPersonJsonLd(profile: Profile, siteUrl: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    alternateName: profile.preferredName,
    jobTitle: profile.role,
    description: profile.summary,
    url: siteUrl,
    email: `mailto:${profile.email}`,
    telephone: profile.phone.display,
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile.location.city,
      addressRegion: profile.location.region,
      addressCountry: 'CA',
    },
    sameAs: [profile.links.linkedin, profile.links.github],
    knowsLanguage: profile.languages.map((language) => (language.name === 'English' ? 'en' : 'vi')),
    knowsAbout: [
      'ASIC physical design',
      'Netlist-to-GDSII implementation',
      'Static timing analysis',
      'Clock tree synthesis',
      'Physical verification',
      'Design rule checking',
      'Layout versus schematic',
      'Electronic design automation',
    ],
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'University of Ottawa',
      },
      {
        '@type': 'CollegeOrUniversity',
        name: 'Ho Chi Minh City University of Technology',
      },
    ],
  };
}
