import { test, expect } from 'vitest';
import { nanoid } from './nanoid';

test('should generate a random string with a fixed length', () => {
  const id = nanoid(10);
  expect(id).toHaveLength(10);
});

test('should generate a random string with the default length', () => {
  const id = nanoid();
  expect(id).toHaveLength(21);
});

test('should generate a random string with a length of 0', () => {
  const id = nanoid(0);
  expect(id).toHaveLength(0);
});

test('should generate a random string with a negative length', () => {
  const id = nanoid(-1);
  expect(id).toHaveLength(0);
});
