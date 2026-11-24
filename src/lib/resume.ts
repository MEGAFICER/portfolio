import { formatFilenameStamp } from './datetime';
import { withBase } from './paths';

/** Name of the PDF shipped in `public/resume/`, generated at build time. */
export const RESUME_FILE = 'khang-nguyen-tran-resume.pdf';
export const RESUME_PATH = `resume/${RESUME_FILE}`;
export const RESUME_BASENAME = 'Khang-Nguyen-Tran-Resume';

/**
 * Filename the browser suggests when the visitor downloads the resume:
 * `Khang-Nguyen-Tran-Resume-2026-11-23-1430.pdf`.
 *
 * The timestamp is added at click time, so a recruiter who downloads twice
 * gets two identifiable files instead of an ambiguous "(1)" suffix.
 */
export function buildResumeFilename(date: Date): string {
  return `${RESUME_BASENAME}-${formatFilenameStamp(date)}.pdf`;
}

/** Root-relative URL for the resume PDF, base path included. */
export function resumeHref(base: string): string {
  return withBase(base, RESUME_PATH);
}
