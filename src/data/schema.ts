import { z } from 'zod';

/**
 * Runtime contracts for every piece of content on the site. The JSON files in
 * this directory are the single source of truth for the page, the generated
 * PDF and the JSON-LD. `src/data/index.ts` parses them at build time, so a
 * malformed entry fails the build instead of shipping.
 */

const nonEmpty = z.string().trim().min(1);
const url = z.url();

export const profileSchema = z.object({
  name: nonEmpty,
  preferredName: nonEmpty,
  role: nonEmpty,
  headline: nonEmpty,
  summary: nonEmpty,
  location: z.object({
    city: nonEmpty,
    region: nonEmpty,
    country: nonEmpty,
    display: nonEmpty,
  }),
  email: z.email(),
  phone: z.object({
    display: nonEmpty,
    href: z.string().regex(/^\+?[0-9]{7,15}$/, 'phone href must be digits only'),
  }),
  availability: z.object({
    status: nonEmpty,
    note: nonEmpty,
    terms: z
      .array(
        z.object({
          term: nonEmpty,
          detail: nonEmpty,
        }),
      )
      .min(1),
    regions: z.array(nonEmpty).min(1),
    modes: z.array(nonEmpty).min(1),
  }),
  targetRoles: z.array(nonEmpty).min(1),
  links: z.object({
    linkedin: url,
    github: url,
  }),
  languages: z.array(z.object({ name: nonEmpty, level: nonEmpty })).min(1),
  impact: z
    .array(
      z.object({
        value: nonEmpty,
        unit: nonEmpty,
        label: nonEmpty,
      }),
    )
    .min(3),
});

export const experienceSchema = z.object({
  intro: nonEmpty,
  roles: z
    .array(
      z.object({
        company: nonEmpty,
        formerName: nonEmpty.optional(),
        role: nonEmpty,
        period: nonEmpty,
        duration: nonEmpty,
        location: nonEmpty,
        type: nonEmpty,
        summary: nonEmpty,
        highlights: z.array(nonEmpty).min(1),
        technologies: z.array(nonEmpty).min(1),
      }),
    )
    .min(1),
});

export const caseStudiesSchema = z.object({
  intro: nonEmpty,
  studies: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]+$/, 'id must be a url-safe slug'),
        name: nonEmpty,
        context: nonEmpty,
        scale: z
          .array(z.object({ value: nonEmpty, label: nonEmpty }))
          .min(2)
          .max(6),
        problem: nonEmpty,
        approach: z.array(nonEmpty).min(2),
        outcome: nonEmpty,
        tags: z.array(nonEmpty).min(1),
      }),
    )
    .min(1),
});

export const engagementsSchema = z.object({
  intro: nonEmpty,
  items: z
    .array(
      z.object({
        name: nonEmpty,
        meta: z.array(nonEmpty).min(1),
        body: nonEmpty,
      }),
    )
    .min(1),
});

export const skillsSchema = z.object({
  intro: nonEmpty,
  groups: z
    .array(
      z.object({
        name: nonEmpty,
        items: z.array(nonEmpty).min(1),
      }),
    )
    .min(1),
});

export const educationSchema = z.object({
  degrees: z
    .array(
      z.object({
        degree: nonEmpty,
        school: nonEmpty,
        location: nonEmpty,
        period: nonEmpty,
        detail: nonEmpty,
      }),
    )
    .min(1),
  research: z
    .array(
      z.object({
        title: nonEmpty,
        kind: nonEmpty,
        period: nonEmpty,
        detail: nonEmpty,
      }),
    )
    .min(1),
  awards: z.array(z.object({ title: nonEmpty, year: nonEmpty })).min(1),
});

export const leadershipSchema = z.object({
  intro: nonEmpty,
  items: z.array(z.object({ title: nonEmpty, detail: nonEmpty })).min(1),
});

export type Profile = z.infer<typeof profileSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type CaseStudies = z.infer<typeof caseStudiesSchema>;
export type Engagements = z.infer<typeof engagementsSchema>;
export type Skills = z.infer<typeof skillsSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Leadership = z.infer<typeof leadershipSchema>;
