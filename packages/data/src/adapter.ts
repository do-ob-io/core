import { adaptify } from '@do-ob/core';
import { entity, mutate } from '@do-ob/data/schema';
import { Database } from '@do-ob/data/database';
import { PgTableWithColumns, TableConfig } from 'drizzle-orm/pg-core';

export function adapter<
  D extends Database,
>(database: D | Promise<D>) {

  return adaptify({

    driver: () => async () => await database,

    /**
     * Safely inserts a new entity into the database with authorization controls and audits.
     */
    insert: ({ $dispatch, $subject }) => async <
      T extends PgTableWithColumns<TableConfig>,
    >(
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
          $owner: $subject,
          $creator: $subject,
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
          $dispatch: $dispatch,
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
