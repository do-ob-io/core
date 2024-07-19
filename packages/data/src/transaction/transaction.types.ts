import type { PgTransaction } from 'drizzle-orm/pg-core';
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import type { Schema } from '@do-ob/data/schema';
import type { ExtractTablesWithRelations } from 'drizzle-orm/relations';

export type TransactionResult<R = unknown> = R extends Promise<infer T> ? Promise<T> : Promise<unknown>;

export type Transaction = PgTransaction<PostgresJsQueryResultHKT,Schema, ExtractTablesWithRelations<Schema>>;
