import { test, expect } from 'vitest';
import { memoize } from './memoize';

test('should memoize a function', () => {
  let count = 0;
  const fn = memoize((a: number, b: number) => {
    count++;
    return a + b;
  });

  expect(fn(1, 2)).toEqual(3);
  expect(count).toEqual(1);

  expect(fn(1, 2)).toEqual(3);
  expect(count).toEqual(1);

  expect(fn(2, 3)).toEqual(5);
  expect(count).toEqual(2);

  expect(fn(2, 3)).toEqual(5);
  expect(count).toEqual(2);
});

test('should memoize a function with a custom ttl', () => {
  let count = 0;
  const fn = memoize((a: number, b: number) => {
    count++;
    return a + b;
  }, { ttl: 100 });

  expect(fn(1, 2)).toEqual(3);
  expect(count).toEqual(1);

  expect(fn(1, 2)).toEqual(3);
  expect(count).toEqual(1);

  setTimeout(() => {
    expect(fn(1, 2)).toEqual(3);
    expect(count).toEqual(2);
  }, 200);
});
