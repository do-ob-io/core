import {
  test,
  expect,
  beforeAll,
} from 'vitest';
import { database, Database } from '@do-ob/data/database';
// import { schema } from '@do-ob/data/schema';
import { modules, seed } from '@do-ob/data/seed';

let db: Database;

beforeAll(async () => {
  db = database();
  await seed();
});

// Should already have the seeded collection of action records in the database.
test('should have existing action records', async () => {
  const actions = await db.query.action.findMany();
  expect(actions).toHaveLength(modules.action.records.length);
});
