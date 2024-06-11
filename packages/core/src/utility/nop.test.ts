import { test, expect } from 'vitest';
import { nop } from './nop';

test('nop', () => {
  expect(nop).not.toThrow();
});
