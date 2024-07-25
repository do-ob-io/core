import postgres from 'postgres';
import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzlePostgres, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { drizzle as drizzlePGlite } from 'drizzle-orm/pglite';
import { schema, Schema } from '@do-ob/data/schema';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION || 'memory://local';

export type Database<S extends Record<string, unknown> = Schema> = PostgresJsDatabase<S>;

declare global {
  // eslint-disable-next-line no-var
  var doob_database_instance: Database;
}

/**
 * Singleton database instance to prevent multiple connections.
 */
globalThis.doob_database_instance = globalThis.doob_database_instance || null;

export function database(connection?: string): Database {
  if (globalThis.doob_database_instance !== null) {
    return globalThis.doob_database_instance;
  }

  if (process.env.NODE_ENV === 'production') {
    const sql = postgres(connection ?? DATABASE_CONNECTION);
    globalThis.doob_database_instance =  drizzlePostgres(sql, { schema });
  } else {
    const sql = new PGlite(connection ?? DATABASE_CONNECTION);
    const sqlFile = readFileSync(resolve(import.meta.dirname, '../scripts/data.sql'), 'utf8');
    sql.exec(sqlFile);
    globalThis.doob_database_instance = drizzlePGlite(sql, { schema }) as unknown as Database;
  }

  return globalThis.doob_database_instance;
};
