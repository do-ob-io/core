import type { Transaction } from './transaction.types';
import { getTableName, sql, SQL, type TableConfig } from 'drizzle-orm';
import type { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { scope } from '@do-ob/data/scope';
import { Ambit, type Input } from '@do-ob/core';
import * as dataFilter from '@do-ob/data/filter';
import * as dataOrder from '@do-ob/data/order';
import { schemaCore } from '@do-ob/data/schema';

export interface QueryOptions<C extends TableConfig> {
  filter?: (tables: { table: PgTableWithColumns<C>, entity: typeof schemaCore['entity'] }, filters: typeof dataFilter) => SQL;
  order?: (tables: { table: PgTableWithColumns<C>, entity: typeof schemaCore['entity'] }, order: typeof dataOrder) => SQL[];
  limit?: number;
  offset?: number;
}

export function query<
  C extends TableConfig,
> (
  input: Input,
  table: PgTableWithColumns<C>,
  options: QueryOptions<C> = {},

  /**
   * Ambit to scope the query to.
   */
  ambit: Ambit = Ambit.None,

  /**
   * If true, deleted records will be included in the result.
   */
  clairvoyance: boolean = false,
) {

  const {
    filter = () => sql`true`,
    limit = 100,
    offset = 0,
    order = () => [ dataOrder.asc(table.$id) ],
  } = options;

  return async (tx: Transaction): Promise<PgTableWithColumns<C>['$inferSelect'][]> => {
    const { $subject } = input;

    if (!$subject) {
      throw new Error('Unauthorized. No subject provided for the query operation.');
    }

    const isEntity = getTableName(table).startsWith('entity_');

    const builder = tx.select().from(table);

    if(isEntity) {
      builder.leftJoin(schemaCore.entity, dataFilter.eq(table.$id, schemaCore.entity.$id));
    }

    const result = await builder.limit(limit).offset(offset)
      .orderBy(...order({ table, entity: schemaCore.entity }, dataOrder))
      .where(dataFilter.and(
        isEntity ? dataFilter.eq(schemaCore.entity.deleted, clairvoyance) : sql`true`,
        isEntity ? scope($subject, ambit) : (ambit === Ambit.Global ? sql`true` : sql`false`),
        filter({ table, entity: schemaCore.entity }, dataFilter),
      )) as PgTableWithColumns<C>['$inferSelect'][];

    return result;
  };
}
