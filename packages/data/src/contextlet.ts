import { contextlet } from '@do-ob/core';
import { type dispatch, entity, mutate } from '@do-ob/data/schema';
import { Database } from '@do-ob/data/database';
import { PgTableWithColumns, TableConfig } from 'drizzle-orm/pg-core';

export function databaseContextlet<
  D extends Database,
>(database: Promise<D>) {

  return contextlet({

    /**
     * Safely inserts a new entity into the database with authorization controls and audits.
     */
    insert: () => async <
      T extends PgTableWithColumns<TableConfig>,
    >(
      /**
       * The dispatch invoking the insert.
       */
      dispatch: dispatch.Dispatch,
      table: T,
      value: T['$inferInsert'],
    ) => {
      const db = await database;
      
      /**
       * The table must declare itself an extension of the entity table.
       */
      const tableName = table._.name;
      if(!tableName.startsWith('entity_')) {
        throw new Error('Only self-declared entity tables, prefixed with "entity_", can be logically inserted.');
      }
      
      /**
       * Begin the database transaction.
       */
      db.transaction(async (tx) => {
        /**
         * Create an entity record.
         */
        const [ entityRecord ] = await tx.insert(entity.table).values({
          type: tableName.replace('entity_', ''),
          $owner: dispatch.$subject,
          $creator: dispatch.$subject,
        }).returning();
  
        /**
         * Create the entity type record.
         */
        const [ typeRecord ] = await tx.insert(table).values({
          ...value,
          $id: entityRecord.$id,
        }).returning();

        /**
         * Create a mutation record.
         */
        tx.insert(mutate.table).values({
          $dispatch: dispatch.$id,
          $entity: entityRecord.$id,
          operation: 'create',
          mutation: {
            entity: entityRecord,
            [tableName]: typeRecord,
          },
        });
  
        return {
          ...typeRecord as T['$inferInsert'],
          entity: entityRecord,
        };
      });
    }
  });
} 
