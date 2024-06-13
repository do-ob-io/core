import { test, expect, beforeEach, afterEach, vi } from 'vitest';
import { dateNumeric } from './date';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

test('should return a correct numeric date value', () => {
  const now = new Date().getTime();
  expect(dateNumeric('1d')).toBe(now + 86400000);
  expect(dateNumeric('1h3m')).toBe(now + (1 * 3600000) + (3 * 60000));
  expect(dateNumeric('1h3m2s')).toBe(now + (1 * 3600000) + (3 * 60000) + (2 * 1000));
  expect(dateNumeric('2s8h3m')).toBe(now + (2 * 1000) + (8 * 3600000) + (3 * 60000));
  expect(dateNumeric('1d1h1m1s')).toBe(now + 86400000 + 3600000 + 60000 + 1000);
});
