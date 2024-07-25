import { test, expect } from 'vitest';
import { adapter, database, schema } from '@do-ob/data';
import { inputify } from '@do-ob/core';
import { randomUUID } from 'node:crypto';

test('should insert a new entity into the database', async () => {
  const db = database();
  const dbAdapter = adapter(db);

  const input = inputify({
    $dispatch: randomUUID(),
    $subject: randomUUID(),
  });
  const result = await dbAdapter.insert(input)(schema.locale, {
    name: 'my_locale',
    code: 'en-US'
  });

  expect(result).toBeDefined();
  expect(result).toMatchObject({
    name: 'my_locale',
    code: 'en-US',
    entity: expect.any(Object),
  });
  
});
