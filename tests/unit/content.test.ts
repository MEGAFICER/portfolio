import { describe, expect, it } from 'vitest';
import {
  caseStudies,
  education,
  engagements,
  experience,
  leadership,
  profile,
  skills,
} from '@/data';
import {
  caseStudiesSchema,
  educationSchema,
  engagementsSchema,
  experienceSchema,
  leadershipSchema,
  profileSchema,
  skillsSchema,
} from '@/data/schema';

/**
 * Content tests. These are the guardrails that keep a build honest:
 *  - every file satisfies its schema
 *  - no client name leaks (anonymisation is a hard requirement, see ADR-0011)
 *  - the facts other pages assume are actually present
 */

const allContent = JSON.stringify({
  profile,
  experience,
  caseStudies,
  engagements,
  skills,
  education,
  leadership,
});

describe('schemas', () => {
  it.each([
    ['profile', profileSchema, profile],
    ['experience', experienceSchema, experience],
    ['case studies', caseStudiesSchema, caseStudies],
    ['engagements', engagementsSchema, engagements],
    ['skills', skillsSchema, skills],
    ['education', educationSchema, education],
    ['leadership', leadershipSchema, leadership],
  ])('%s content parses', (_name, schema, value) => {
    expect(() => schema.parse(value)).not.toThrow();
  });

  it('rejects a profile without an email', () => {
    const broken = { ...profile, email: 'not-an-email' };
    expect(() => profileSchema.parse(broken)).toThrow();
  });

  it('rejects a phone href containing formatting characters', () => {
    const broken = { ...profile, phone: { ...profile.phone, href: '+1 (942) 588-2707' } };
    expect(() => profileSchema.parse(broken)).toThrow();
  });

  it('rejects a case study with an unsafe id', () => {
    const first = caseStudies.studies[0];
    if (!first) throw new Error('fixture missing');
    const broken = { ...caseStudies, studies: [{ ...first, id: 'Not A Slug' }] };
    expect(() => caseStudiesSchema.parse(broken)).toThrow();
  });
});

describe('anonymisation', () => {
  const clientNames = [
    'TSMC',
    'Intel',
    'Samsung',
    'GlobalFoundries',
    'UMC',
    'NVIDIA',
    'AMD',
    'Qualcomm',
    'MediaTek',
    'Broadcom',
    'Marvell',
    'Apple',
    'Rambus',
    'Alchip',
  ];

  it.each(clientNames)('does not name %s anywhere in the content', (client) => {
    expect(allContent.toLowerCase()).not.toContain(client.toLowerCase());
  });

  it('describes nodes generically', () => {
    expect(allContent).toContain('7nm-class');
    expect(allContent).toContain('16nm-class');
    expect(allContent).toContain('14nm-class');
  });
});

describe('profile', () => {
  it('states the name, role and availability terms the site promises', () => {
    expect(profile.name).toBe('Khang Nguyen Tran');
    expect(profile.role).toBe('Physical Design Engineer');
    expect(profile.availability.status).toMatch(/Winter 2027/);
    expect(profile.availability.status).toMatch(/Summer 2027/);
    expect(profile.availability.terms.map((term) => term.term)).toEqual([
      'Winter 2027',
      'Summer 2027',
    ]);
  });

  it('covers the three target cities and all working modes', () => {
    expect(profile.availability.regions).toEqual(['Ottawa', 'Montréal', 'Toronto']);
    expect(profile.availability.modes).toEqual(['On-site', 'Hybrid', 'Remote']);
  });

  it('targets physical design, STA and PV roles', () => {
    const roles = profile.targetRoles.join(' ').toLowerCase();
    expect(roles).toContain('physical design');
    expect(roles).toContain('static timing');
    expect(roles).toContain('physical verification');
  });

  it('publishes the contact routes used by the contact section', () => {
    expect(profile.email).toBe('ktran037@uottawa.ca');
    expect(profile.phone.href).toBe('+19425882707');
    expect(profile.links.linkedin).toContain('linkedin.com/in/');
    expect(profile.links.github).toContain('github.com/');
  });

  it('carries five quantified impact facts', () => {
    expect(profile.impact).toHaveLength(5);
    for (const item of profile.impact) {
      expect(item.value).toMatch(/[0-9]/);
    }
  });
});

describe('experience', () => {
  it('is ordered most recent first', () => {
    expect(experience.roles.map((role) => role.company)).toEqual([
      'Faraday Technology',
      'Uniquify Vietnam',
      'Synopsys',
    ]);
  });

  it('gives every role a period, summary and at least one highlight', () => {
    for (const role of experience.roles) {
      expect(role.period).toMatch(/\d{4}/);
      expect(role.summary.length).toBeGreaterThan(40);
      expect(role.highlights.length).toBeGreaterThan(0);
      expect(role.technologies.length).toBeGreaterThan(0);
    }
  });

  it('does not claim Faraday is current', () => {
    const faraday = experience.roles[0];
    expect(faraday?.period).toContain('2026');
    expect(faraday?.period).not.toMatch(/present/i);
  });
});

describe('case studies', () => {
  it('has three studies with unique ids', () => {
    const ids = caseStudies.studies.map((study) => study.id);
    expect(ids).toEqual(['noc', 'wrapper', 'ddr-phy']);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives each study a scale block, problem, actions and outcome', () => {
    for (const study of caseStudies.studies) {
      expect(study.scale.length).toBeGreaterThanOrEqual(4);
      expect(study.problem.length).toBeGreaterThan(80);
      expect(study.approach.length).toBeGreaterThanOrEqual(3);
      expect(study.outcome.length).toBeGreaterThan(40);
      expect(study.tags.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('keeps the strongest project first with its real numbers', () => {
    const noc = caseStudies.studies[0];
    expect(noc?.name).toContain('3.7M');
    expect(noc?.scale.some((metric) => metric.value === '801 MHz')).toBe(true);
  });
});

describe('skills', () => {
  it('lists the signoff and toolchain claims the copy makes', () => {
    const flat = skills.groups.flatMap((group) => group.items).join(' | ');
    for (const tool of ['Innovus', 'PrimeTime', 'PrimeClosure', 'Calibre', 'Voltus', 'Thunder']) {
      expect(flat).toContain(tool);
    }
    for (const item of ['DRC', 'LVS', 'FPPG', 'ERC', 'PERC']) {
      expect(flat).toContain(item);
    }
  });

  it('has a group for scripting and one for timing', () => {
    const names = skills.groups.map((group) => group.name);
    expect(names).toContain('Scripting');
    expect(names).toContain('Timing and constraints');
  });
});

describe('education', () => {
  it('records uOttawa as in progress with an expected graduation', () => {
    const uottawa = education.degrees[0];
    expect(uottawa?.school).toBe('University of Ottawa');
    expect(uottawa?.period).toContain('2028');
  });

  it('keeps the thesis and the fertigation research', () => {
    const titles = education.research.map((project) => project.title).join(' ');
    expect(titles).toContain('flip-flop');
    expect(titles.toLowerCase()).toContain('fertigation');
  });

  it('lists the two certificates', () => {
    expect(education.awards).toHaveLength(2);
    expect(education.awards[0]?.title).toContain('Synopsys');
  });

  it('does not publish an IELTS score', () => {
    expect(allContent.toLowerCase()).not.toContain('ielts');
  });

  it('does not publish the presentation contest', () => {
    expect(allContent.toLowerCase()).not.toContain('presentation contest');
  });
});

describe('leadership', () => {
  it('mentions the interns and the mentor-lead role', () => {
    const text = leadership.items.map((item) => `${item.title} ${item.detail}`).join(' ');
    expect(text).toMatch(/2 interns/);
    expect(text.toLowerCase()).toContain('mentor lead');
  });
});
