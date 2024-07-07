import {
  test, expect, beforeAll, describe
} from 'vitest';
import { database, Database } from '@do-ob/data/database';
import { schema } from '@do-ob/data/schema';

let db: Database;
let $owner: string;
let $creator: string;

describe.sequential('create entity with owner', () => {
  beforeAll(async () => {
    db = await database();
    // Ensure all rows in the entity table are deleted.
    await db.delete(schema.entity);
  });

  /**
 * Should insert a new entity into the database.
 */
  test('should insert entity', async () => {
    const resultInsert = await db.insert(schema.entity).values({}).returning();

    // The result should be an array with a single object.
    expect(resultInsert).toHaveLength(1);

    // The object should be the entity that was inserted.
    const resultInsertEntity0 = resultInsert[0];

    // Expect the result to be and object with an id property of a UUIDv4 string.
    expect(resultInsertEntity0).toMatchObject({
      $id: expect.stringMatching(/^[0-9a-f-]{36}$/),
      // The created, updated, and publish properties should be a Date object.
      created: expect.any(Date),
      updated: expect.any(Date),
      // The deleted property should be a boolean set to false.
      deleted: false,
      // The $owner property should be null.
      $owner: null,
      // The $creator property should be null.
      $creator: null,
    });

    // Assign the owner id for use in other tests.
    $owner = resultInsertEntity0.$id;

    // Assign the creator id for use in other tests.
    $creator = resultInsertEntity0.$id;
  });

  /**
 * Should insert a new entity with an owner and creator into the database.
 */
  test('should insert new entity with previous entity as owner', async () => {
    const resultInsert = await db.insert(schema.entity).values({ $owner, $creator }).returning();

    // The result should be an array with a single object.
    expect(resultInsert).toHaveLength(1);

    // The object should be the entity that was inserted.
    const resultInsertEntity0 = resultInsert[0];

    // Expect the result to be and object with an id property of a UUIDv4 string.
    expect(resultInsertEntity0).toMatchObject({
      $id: expect.stringMatching(/^[0-9a-f-]{36}$/),
      // The created, updated, and publish properties should be a Date object.
      created: expect.any(Date),
      updated: expect.any(Date),
      // The deleted property should be a boolean set to false.
      deleted: false,
      // The $owner property should be the same as the previously inserted entity id.
      $owner,
      // The $creator property should be the same as the previously inserted entity id.
      $creator,
    });
  });
});
