// import postgres from 'postgres';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { schema } from '@do-ob/data/schema';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION || 'memory://local';

export type Database = PostgresJsDatabase<typeof schema>;

declare global {
  // eslint-disable-next-line no-var
  var doob_database_instance: Database;
}

/**
 * Singleton database instance to prevent multiple connections.
 */
globalThis.doob_database_instance = globalThis.doob_database_instance || null;

export async function database(connection?: string): Promise<Database> {
  if (globalThis.doob_database_instance !== null) {
    return globalThis.doob_database_instance;
  }

  if (process.env.NODE_ENV === 'production') {
    const { drizzle } = await import('drizzle-orm/postgres-js');
    const { default: postgres } = await import('postgres');
    const sql = postgres(connection ?? DATABASE_CONNECTION);
    globalThis.doob_database_instance =  drizzle(sql, { schema });
  } else {
    const { drizzle } = await import('drizzle-orm/pglite');
    const { PGlite } = await import('@electric-sql/pglite');
    const sql = new PGlite(connection ?? DATABASE_CONNECTION);
    const sqlFile = readFileSync(resolve(import.meta.dirname, '../scripts/data.sql'), 'utf8');
    sql.exec(sqlFile);
    globalThis.doob_database_instance = drizzle(sql, { schema }) as unknown as Database;
  }

  return globalThis.doob_database_instance;
};
