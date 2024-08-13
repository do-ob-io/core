// import postgres from 'postgres';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { schemaCore, type SchemaCore } from '@do-ob/data/schema';
import { drizzle } from 'drizzle-orm/pglite';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION || 'memory://local';

export type Database = PostgresJsDatabase<SchemaCore>;

declare global {
  // eslint-disable-next-line no-var
  var doob_pglite_database_instance: Database;
}

/**
 * Singleton database instance to prevent multiple connections.
 */
globalThis.doob_pglite_database_instance = globalThis.doob_pglite_database_instance || null;

export function database(connection?: string): Database {
  const sql = new PGlite(connection ?? DATABASE_CONNECTION);
  const sqlFile = readFileSync(resolve(import.meta.dirname, '../scripts/data.sql'), 'utf8');
  sql.exec(sqlFile);
  globalThis.doob_pglite_database_instance = drizzle(sql, { schema: schemaCore }) as unknown as Database;

  return globalThis.doob_pglite_database_instance;
};
