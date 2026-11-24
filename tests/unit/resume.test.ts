import { describe, expect, it } from 'vitest';
import {
  buildResumeFilename,
  RESUME_BASENAME,
  RESUME_FILE,
  RESUME_PATH,
  resumeHref,
} from '@/lib/resume';
import { withBase } from '@/lib/paths';

const at = (iso: string) => new Date(iso);

describe('resume constants', () => {
  it('names the shipped PDF and its public path', () => {
    expect(RESUME_FILE).toBe('khang-nguyen-tran-resume.pdf');
    expect(RESUME_PATH).toBe('resume/khang-nguyen-tran-resume.pdf');
    expect(RESUME_BASENAME).toBe('Khang-Nguyen-Tran-Resume');
  });
});

describe('buildResumeFilename', () => {
  it('stamps the download with name and date-time', () => {
    expect(buildResumeFilename(at('2026-11-23T14:30:00'))).toBe(
      'Khang-Nguyen-Tran-Resume-2026-11-23-1430.pdf',
    );
  });

  it('always ends in .pdf and contains no path separators', () => {
    const name = buildResumeFilename(at('2027-02-09T09:05:00'));
    expect(name.endsWith('.pdf')).toBe(true);
    expect(name).not.toMatch(/[\\/]/);
  });

  it('changes between minutes so repeat downloads are distinguishable', () => {
    const first = buildResumeFilename(at('2027-02-09T09:05:00'));
    const second = buildResumeFilename(at('2027-02-09T09:06:00'));
    expect(first).not.toBe(second);
  });
});

describe('resumeHref', () => {
  it('includes the GitHub Pages base path', () => {
    expect(resumeHref('/portfolio/')).toBe('/portfolio/resume/khang-nguyen-tran-resume.pdf');
    expect(resumeHref('/portfolio')).toBe('/portfolio/resume/khang-nguyen-tran-resume.pdf');
  });

  it('works at the domain root', () => {
    expect(resumeHref('/')).toBe('/resume/khang-nguyen-tran-resume.pdf');
    expect(resumeHref('')).toBe('/resume/khang-nguyen-tran-resume.pdf');
  });
});

describe('withBase', () => {
  it('joins base and path without double slashes', () => {
    expect(withBase('/portfolio/', 'favicon.svg')).toBe('/portfolio/favicon.svg');
    expect(withBase('/portfolio', '/favicon.svg')).toBe('/portfolio/favicon.svg');
  });

  it('turns fragments into in-page links under the base path', () => {
    expect(withBase('/portfolio/', '#work')).toBe('/portfolio/#work');
    expect(withBase('/', '#work')).toBe('/#work');
  });

  it('is idempotent for an empty base', () => {
    expect(withBase('', 'og/og.png')).toBe('/og/og.png');
  });
});
