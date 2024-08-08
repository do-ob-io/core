import { adaptify } from '@do-ob/core';
import { Database } from '@do-ob/data/database';
import { PgTableWithColumns, TableConfig } from 'drizzle-orm/pg-core';
import { getTableName } from 'drizzle-orm';
import { insert, update, query, type QueryOptions, remove, insertMany } from '@do-ob/data/transaction';


export function adapter<
  D extends Database,
>(database: D | Promise<D>) {

  return adaptify({

    driver: () => async () => await database,

    /**
     * Safely inserts a new entity into the database with authorization controls and audits.
     */
    insert: (input) => async <
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
    },

    /**
     * Safely inserts a new entity into the database with authorization controls and audits.
     */
    insertMany: (input) => async <
      C extends TableConfig,
    >(
      table: PgTableWithColumns<C>,
      values: Omit<PgTableWithColumns<C>['$inferInsert'], '$id'>[],
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
        throw new Error('Only self-declared entity tables, prefixed with "entity_", can be logically inserted.');
      }
      
      const result = await db.transaction(
        insertMany(
          input,
          table,
          values,
        ),
      );

      return result;
    },

    /**
     * Safely queries entities from the database with authorization controls and audits.
     */
    query: (input) => async <
      C extends TableConfig,
    >(
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
      
      const result = await db.transaction(
        query(
          input,
          table,
          options,
          clairvoyance,
        ),
      );

      return result;
    },

    /**
     * Safely updates an entity in the database with authorization controls and audits.
     */
    update: (input) => async <
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
    },

    /**
     * Safely removes an entity from the database with authorization controls and audits.
     */
    remove: (input) => async <
      C extends TableConfig,
    >(
      table: PgTableWithColumns<C>,
      $id: string,
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
        throw new Error('Only self-declared entity tables, prefixed with "entity_", can be logically removed.');
      }
      
      const [ result ] = await db.transaction(
        remove(
          input,
          table,
          $id,
        ),
      );

      return result;
    },
  });
}
