import type { Transaction } from './transaction.types';
import { getTableName, sql, SQL, type TableConfig } from 'drizzle-orm';
import type { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { scope } from '@do-ob/data/scope';
import { type Input } from '@do-ob/core';
import * as dataFilter from '@do-ob/data/filter';
import * as dataOrder from '@do-ob/data/order';
import { schema } from '@do-ob/data/schema';

export interface QueryOptions<C extends TableConfig> {
  filter?: (tables: { table: PgTableWithColumns<C>, entity: typeof schema['entity'] }, filters: typeof dataFilter) => SQL;
  order?: (tables: { table: PgTableWithColumns<C>, entity: typeof schema['entity'] }, order: typeof dataOrder) => SQL[];
  limit?: number;
  offset?: number;
}

export function query<
  C extends TableConfig,
> (
  input: Input,
  table: PgTableWithColumns<C>,
  options: QueryOptions<C> = {},
) {

  const {
    filter = () => sql`true`,
    limit = 100,
    offset = 0,
    order = () => [ dataOrder.asc(table.$id) ],
  } = options;

  return async (tx: Transaction): Promise<PgTableWithColumns<C>['$inferSelect'][]> => {
    const { ambit, $subject } = input;

    if (!$subject) {
      throw new Error('Unauthorized. No subject provided for the query operation.');
    }

    const tableName = getTableName(table);

    const builder = tx.select().from(table);

    if(tableName.startsWith('entity_')) {
      builder.leftJoin(schema.entity, dataFilter.eq(table.$id, schema.entity.$id));
    }

    const result = await builder.limit(limit).offset(offset)
      .orderBy(...order({ table, entity: schema.entity }, dataOrder))
      .where(dataFilter.and(
        scope($subject, ambit),
        filter({ table, entity: schema.entity }, dataFilter),
      )) as PgTableWithColumns<C>['$inferSelect'][];

    return result;
  };
}
