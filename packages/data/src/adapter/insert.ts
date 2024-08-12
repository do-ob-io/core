import { Input } from '@do-ob/core';
import { Database } from '@do-ob/data/database';
import { PgTableWithColumns, TableConfig } from 'drizzle-orm/pg-core';
import { getTableName } from 'drizzle-orm';
import { insert } from '@do-ob/data/transaction';

export default <
  D extends Database,
>(database: D | Promise<D>) => 
  /**
   * Safely inserts a new entity into the database with authorization controls and audits.
   */
  (input: Input) => async <
    C extends TableConfig,
  >(
    table: PgTableWithColumns<C>,
    value: Omit<PgTableWithColumns<C>['$inferInsert'], '$id'>,
  ) => {
    if(!input.$subject) {
      return;
    }

    const db = await database;

    /**
 * The table must declare itself an extension of the entity table.
 */
    const tableName = getTableName(table);
    if(!tableName.startsWith('entity_')) {
      throw new Error('Only self-declared entity tables, prefixed with "entity_", can be logically inserted.');
    }

    const [ result ] = await db.transaction(
      insert(
        input,
        table,
        value,
      ),
    );

    return result;
  };
