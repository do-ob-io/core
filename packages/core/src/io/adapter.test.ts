import { test, expect } from 'vitest';
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
  const adapter = adaptify({
    driver: () => () => databaseMocked,
    insert: ({ ambit }) => async <K extends keyof SchemaInsert, S extends SchemaInsert>(table: K, values: S[K][]) => {
      if (ambit === 0) {
        return [] as S[K][];
      }
      return databaseMocked.insert(table, values);
    }
  });

  expect(adapter).toBeDefined();
});
