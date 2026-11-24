/** Deterministic date formatting used in the resume download filename. */

export function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function assertValid(date: Date): void {
  if (Number.isNaN(date.getTime())) {
    throw new Error('formatFilenameStamp received an invalid date');
  }
}

/**
 * `2026-11-23-1430` — local visitor time, safe inside a filename.
 * Milliseconds and timezone are deliberately excluded: the name identifies
 * *when the download was requested*, not a machine-readable instant.
 */
export function formatFilenameStamp(date: Date): string {
  assertValid(date);
  return [
    date.getFullYear(),
    pad2(date.getMonth() + 1),
    pad2(date.getDate()),
    `${pad2(date.getHours())}${pad2(date.getMinutes())}`,
  ].join('-');
}

/** Human-readable date used in page copy, e.g. "23 November 2026". */
export function formatDisplayDate(date: Date): string {
  assertValid(date);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
