import { Input } from '@do-ob/core';
import { Database } from '@do-ob/data/database';
import { PgTableWithColumns, TableConfig } from 'drizzle-orm/pg-core';
import { getTableName } from 'drizzle-orm';
import { update } from '@do-ob/data/transaction';

export default <
  D extends Database,
>(database: D | Promise<D>) =>
  /**
   * Safely updates an entity in the database with authorization controls and audits.
   */  
  (input: Input) => async <
    C extends TableConfig,
  >(
    table: PgTableWithColumns<C>,
    value: Partial<PgTableWithColumns<C>['$inferSelect']> & { $id: string },
    clairvoyance?: boolean,
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
      throw new Error('Only self-declared entity tables, prefixed with "entity_", can be logically updated.');
    }

    /**
     * Begin the database transaction.
     */
    const [ result ] = await db.transaction(update(
      input,
      table,
      value,
      clairvoyance,
    ));

    // const [ result ] = await tx.select().from(table).limit(1).where(eq(table.$id, $id));
    return result;
  };
