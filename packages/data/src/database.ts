// import postgres from 'postgres';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@do-ob/data/schema';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const POSTGRES_URL = process.env.POSTGRES_URL || 'memory://local';

export type Database = PostgresJsDatabase<typeof schema>;

let dbInstance: Database;

export async function database(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  if (process.env.NODE_ENV === 'production') {
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const { default: postgres } = await import('postgres');
    const sql = postgres(POSTGRES_URL);
    return drizzle(sql, { schema });
  } else {
    const { drizzle } = await import('drizzle-orm/pglite');
    const { PGlite } = await import('@electric-sql/pglite');
    const sql = new PGlite(POSTGRES_URL);
    const sqlFile = readFileSync(resolve(import.meta.dirname, '../scripts/data.sql'), 'utf8');
    sql.exec(sqlFile);
    return drizzle(sql, { schema }) as unknown as Database;
  }
};

export {
  schema,
};
