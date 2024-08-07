import { test, expectTypeOf } from 'vitest';
import { contextify } from './context';
import { adaptify } from './adapter';

type User = {
  id: string;
  name: string;
};

type Profle = {
  id: string;
  user_id: string;
  email: string;
};

type SchemaInsert = {
  user: User;
  profile: Profle;
};

const storageMocked = {
  user: [] as User[],
  profile: [] as Profle[],
} as const;

const databaseMocked = {
  query: async () => [],
  insert: async <K extends keyof SchemaInsert>(table: K, values: SchemaInsert[K][]) => {
    // @ts-expect-error: TS2345
    storageMocked[table].push(...values);
    return values;
  },
};

test('should create a context', () => {
  const databaseAdapter = adaptify({
    driver: () => () => databaseMocked,
    insert: ({ ambit }) => async <K extends keyof SchemaInsert, S extends SchemaInsert>(table: K, values: S[K][]) => {
      if (ambit === 0) {
        return [] as S[K][];
      }
      return databaseMocked.insert(table, values);
    }
  });
  const context = contextify({
    meta: async () => ({
      scope: 'none',
    }),
    adapter: {
      db: databaseAdapter
    }
  });

  expectTypeOf(context).toBeObject();
  expectTypeOf(context.meta).toBeFunction();
  expectTypeOf(context.adapter).toBeObject();
  expectTypeOf(context.adapter.db).toBeObject();
  expectTypeOf(context.adapter.db.driver).toBeFunction();

});
