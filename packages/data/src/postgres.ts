import postgres from 'postgres';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { schema, type Schema } from '@do-ob/data/schema';

const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION || 'memory://local';

export type Database = PostgresJsDatabase<Schema>;

declare global {
  // eslint-disable-next-line no-var
  var doob_postgres_database_instance: Database;
}

/**
 * Singleton database instance to prevent multiple connections.
 */
globalThis.doob_postgres_database_instance = globalThis.doob_postgres_database_instance || null;

export function database(connection?: string) {
  if (globalThis.doob_postgres_database_instance !== null) {
    return globalThis.doob_postgres_database_instance;
  }

  const sql = postgres(connection ?? DATABASE_CONNECTION);
  globalThis.doob_postgres_database_instance =  drizzle(sql, { schema: schema() });

  return globalThis.doob_postgres_database_instance;
};
