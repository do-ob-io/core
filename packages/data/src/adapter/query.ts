import { Input } from '@do-ob/core';
import { Database } from '@do-ob/data/database';
import { PgTableWithColumns, TableConfig } from 'drizzle-orm/pg-core';
import { getTableName } from 'drizzle-orm';
import { query, QueryOptions } from '@do-ob/data/transaction';
import authorization from './authorization';

export default <
  D extends Database,
>(database: D | Promise<D>) =>
  /**
   * Safely queries entities from the database with authorization controls and audits.
   */  
  async <
    C extends TableConfig,
  >(
    input: Input,
    table: PgTableWithColumns<C>,
    options: QueryOptions<C>,
    clairvoyance?: boolean,
  ) => {
    if(!input.$subject) {
      return [];
    }

    const db = await database;

    /**
   * The table must declare itself an extension of the entity table.
   */
    const tableName = getTableName(table);
    if(!tableName.startsWith('entity_')) {
      throw new Error('Only self-declared entity tables, prefixed with "entity_", can be logically queried.');
    }

    const [ ambit ] = await authorization(db)(input);

    const result = await db.transaction(
      query(
        input,
        table,
        options,
        ambit,
        clairvoyance,
      ),
    );

    return result;
  };
