import { describe, expect, it } from 'vitest';
import { formatDisplayDate, formatFilenameStamp, pad2 } from '@/lib/datetime';

const local = (iso: string) => new Date(iso);

describe('pad2', () => {
  it('pads single digits and leaves larger numbers alone', () => {
    expect(pad2(0)).toBe('00');
    expect(pad2(7)).toBe('07');
    expect(pad2(10)).toBe('10');
    expect(pad2(59)).toBe('59');
  });
});

describe('formatFilenameStamp', () => {
  it('produces YYYY-MM-DD-HHmm', () => {
    expect(formatFilenameStamp(local('2026-11-23T14:30:00'))).toBe('2026-11-23-1430');
  });

  it('zero-pads month, day, hour and minute', () => {
    expect(formatFilenameStamp(local('2027-01-02T03:04:00'))).toBe('2027-01-02-0304');
  });

  it('handles midnight and late evening', () => {
    expect(formatFilenameStamp(local('2027-06-30T00:00:00'))).toBe('2027-06-30-0000');
    expect(formatFilenameStamp(local('2027-06-30T23:59:00'))).toBe('2027-06-30-2359');
  });

  it('is stable within the same minute', () => {
    const first = formatFilenameStamp(local('2027-03-01T08:15:01'));
    const second = formatFilenameStamp(local('2027-03-01T08:15:59'));
    expect(first).toBe(second);
  });

  it('refuses invalid dates instead of emitting NaN', () => {
    expect(() => formatFilenameStamp(new Date('nope'))).toThrow(/invalid date/i);
  });
});

describe('formatDisplayDate', () => {
  it('formats a human-readable date in UTC', () => {
    expect(formatDisplayDate(new Date(Date.UTC(2026, 10, 23)))).toBe('23 November 2026');
  });

  it('rejects invalid dates', () => {
    expect(() => formatDisplayDate(new Date(Number.NaN))).toThrow(/invalid date/i);
  });
});
