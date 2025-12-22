import { expect, test } from 'vitest';

import { greet } from './strings';

test('greet function', () => {
  expect(greet('hello')).toBe('Hello, World!');
  expect(greet('unknown')).toBe('Greeting not found');
});
