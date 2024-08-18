import type { Transaction } from './transaction.types';
import { and, eq, SQL, sql, type TableConfig } from 'drizzle-orm';
import type { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { scope } from '@do-ob/data/scope';
import { schemaCore } from '@do-ob/data/schema';
import { auditMutation } from './audit';
import { type Input } from '@do-ob/core';
import type { RowList } from 'postgres';

export function update<
  C extends TableConfig,
> (
  input: Input,
  table: PgTableWithColumns<C>,
  value: Partial<PgTableWithColumns<C>['$inferSelect']> & { $id: string },

  /**
   * If true, deleted records will be included in the result.
   */
  clairvoyance: boolean = false,
) {
  return async (tx: Transaction): Promise<[PgTableWithColumns<C>['$inferSelect']]> => {
    const { $id, ...next } = value;
    const { ambit, $subject, $dispatch } = input;

    if (!$subject) {
      throw new Error('Unauthorized. No subject provided for the update operation.');
    }
        
    /**
     * Drizzle ORM does not have the `from` clause for the update builder...
     * so we have to build the SQL until then.
     * 
     * See issue for updates: https://github.com/drizzle-team/drizzle-orm/issues/2304
     */
    const chunks: SQL[] = [];
    chunks.push(tx.update(table).set(next as object).getSQL());
    chunks.push(sql`from ${schemaCore.entity}`);
    chunks.push(sql`where ${and(
      eq(table.$id, $id),
      eq(table.$id, schemaCore.entity.$id),
      eq(schemaCore.entity.deleted, clairvoyance),
      scope($subject, ambit),
    )}`);
    chunks.push(sql`returning *`);
    const updateSql = sql.join(chunks, sql.raw(' '));

    const { rows } = (await tx.execute(updateSql)) as unknown as { rows: RowList<object[]> };

    /**
     * Rollback if the update failed or it updated more than one record somehow.
     */
    if(rows.length === 0 || rows.length > 1) {
      tx.rollback();
    }

    /**
     * Remove this select statement once the `from` method is available in drizzle-orm.
     */
    const [ result ] = await tx.select().from(table).where(eq(table.$id, $id)) as [PgTableWithColumns<C>['$inferSelect'] & { $id: string }];

    /**
     * Rollback if the updated record failed to return anything.
     */
    if(!result) {
      tx.rollback();
    }

    if ($dispatch) {
      await tx.transaction(auditMutation($dispatch, [
        {
          type: 'update',
          table,
          value: result,
        },
      ]));
    }

    return [
      result,
    ];
  };
}
