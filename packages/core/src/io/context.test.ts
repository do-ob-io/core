import { test, expect } from 'vitest';
import { contextify } from './context';

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
  const context = contextify({
    meta: async () => ({
      scope: 'none',
    }),
    insert: (_, { scope }) => async <K extends keyof SchemaInsert, S extends SchemaInsert>(table: K, values: S[K][]) => {
      if (scope === 'none') {
        return [] as S[K][];
      }
      return databaseMocked.insert(table, values);
    }
  });

  expect(context).toBeDefined();
});
