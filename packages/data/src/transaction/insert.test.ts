import { test, expect, assert } from 'vitest';
import { insert } from './insert';
import { schema } from '@do-ob/data/schema';
import { database } from '@do-ob/data/database';
import { inputify } from '@do-ob/core';
import { randomUUID } from 'crypto';

test('should insert a new entity into the database', async () => {
  const db = database();
  const input = inputify({
    $subject: randomUUID(),
  });

  const [ locale, entity ] = await db.transaction(
    insert(
      input,
      schema.locale,
      {
        name: 'my_locale',
        code: 'en-US'
      }
    ),
  );

  assert(locale);
  expect(locale).toMatchObject({
    name: 'my_locale',
    code: 'en-US',
  });

  // Should read the entity from the database.
  const entityResult = await db.query.entity.findFirst({
    where: (table, { eq }) => eq(table.$id, entity.$id),
  });

  assert(entityResult);
  expect(entityResult).toMatchObject({
    type: 'locale',
    $owner: null,
    $creator: null,
  });

  // Should read the locale from the database.
  const localeResult = await db.query.locale.findFirst({
    where: (table, { eq }) => eq(table.$id, locale.$id),
  });

  assert(localeResult);
  expect(localeResult).toMatchObject({
    $id: entityResult.$id,
    name: 'my_locale',
    code: 'en-US',
  });
  
});
