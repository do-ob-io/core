import { test, expect } from 'vitest';
import { uuidv4 } from './uuid';

test('uuid', () => {
  expect(uuidv4()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});
