import { adaptify, Ambit } from '@do-ob/core';
import { entity, mutate } from '@do-ob/data/schema';
import { Database } from '@do-ob/data/database';
import { PgTableWithColumns, TableConfig } from 'drizzle-orm/pg-core';
import { getTableName, eq, SQL, sql, and, getTableColumns } from 'drizzle-orm';
import { RowList } from 'postgres';

/**
 * Builds an sql filter based on an ambit.
 */
function scope(
  $subject: string,
  ambit: Ambit,
): SQL {
  switch(ambit) {
    case Ambit.Global:
      return sql`true`;
    case Ambit.Owned:
      return eq(entity.table.$owner, $subject);
    case Ambit.Created:
      return eq(entity.table.$creator, $subject);
    case Ambit.Member:
      return sql`false`; // TODO: Implement member scope.
    case Ambit.None:
    default:
      return sql`false`;
  }
}


export function adapter<
  D extends Database,
>(database: D | Promise<D>) {

  return adaptify({

    driver: () => async () => await database,

    /**
     * Safely inserts a new entity into the database with authorization controls and audits.
     */
    insert: ({ $dispatch, $subject }) => async <
      C extends TableConfig,
    >(
      table: PgTableWithColumns<C>,
      value: Omit<PgTableWithColumns<C>['$inferInsert'], '$id'>,
    ) => {
      const db = await database;
      
      /**
       * The table must declare itself an extension of the entity table.
       */
      const tableName = getTableName(table);
      if(!tableName.startsWith('entity_')) {
        throw new Error('Only self-declared entity tables, prefixed with "entity_", can be logically inserted.');
      }
      
      /**
       * Begin the database transaction.
       */
      return db.transaction(async (tx) => {
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
          ...value as PgTableWithColumns<C>['$inferInsert'],
          $id: entityRecord.$id,
        }).returning();

        /**
         * Create a mutation record of the insert.
         */
        tx.insert(mutate.table).values([
          {
            $dispatch: $dispatch,
            $entity: entityRecord.$id,
            table: tableName,
            operation: 'create',
            mutation: typeRecord,
          },
          {
            $dispatch: $dispatch,
            $entity: entityRecord.$id,
            table: getTableName(entity.table),
            operation: 'create',
            mutation: entityRecord,
          }
        ]);
  
        return {
          ...typeRecord as PgTableWithColumns<C>['$inferInsert'],
          entity: entityRecord,
        };
      });
    },

    /**
     * Safely updates an entity in the database with authorization controls and audits.
     */
    update: ({ $dispatch, $subject, ambit }) => async <
      C extends TableConfig,
    >(
      table: PgTableWithColumns<C>,
      value: Partial<PgTableWithColumns<C>['$inferSelect']> & { $id: string },
    ) => {
      if(!$subject) {
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
      return db.transaction(async (tx) => {
        const { $id, ...next } = value;
        
        /**
         * Drizzle ORM does not have the from method for the update builder...
         * so we have to build the SQL manually until then.
         * 
         * See issue for updates: https://github.com/drizzle-team/drizzle-orm/issues/2304
         */
        const updateChunks: SQL[] = [];
        updateChunks.push(tx.update(table).set(next as object).getSQL());
        updateChunks.push(sql`from ${entity.table}`);
        updateChunks.push(sql`where ${and(
          eq(table.$id, $id),
          eq(table.$id, entity.table.$id),
          scope($subject, ambit),
        )}`);
        updateChunks.push(sql`returning ${
          sql.join(
            Object.keys(getTableColumns(table)).map((column) => table[column]), sql.raw(', ')
          )
        }`);
        const updateSql = sql.join(updateChunks, sql.raw(' '));

        const { rows } = (await tx.execute(updateSql)) as unknown as { rows: RowList<PgTableWithColumns<C>['$inferSelect'][]> };
        
        /**
         * Rollback if the update failed or it updated more than one record somehow.
         */
        if(rows.length === 0 || rows.length > 1) {
          tx.rollback();
          return;
        }

        const [ result ] = rows;

        /**
         * Rollback if the updated record failed to return anything.
         */
        if(!result) {
          tx.rollback();
          return;
        }

        /**
         * Create the mutation record.
         */
        tx.insert(mutate.table).values({
          $dispatch: $dispatch,
          $entity: $id,
          table: tableName,
          operation: 'update',
          mutation: Object.keys(result).reduce((acc, key) => {
            if (key in next) {
              acc[key] = result[key];
            }
            return acc;
          }, {} as Record<string, unknown>),
        });

        // const [ result ] = await tx.select().from(table).limit(1).where(eq(table.$id, $id));
        return result as PgTableWithColumns<C>['$inferSelect'];

      });
    },
  });
}
