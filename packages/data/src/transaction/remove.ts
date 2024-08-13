import type { Transaction } from './transaction.types';
import { and, eq, SQL, sql, type TableConfig } from 'drizzle-orm';
import type { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { schemaCore } from '@do-ob/data/schema';
import { auditMutation } from './audit';
import { Ambit, type Input } from '@do-ob/core';
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
      return eq(schemaCore.entity.$owner, $subject);
    case Ambit.Created:
      return eq(schemaCore.entity.$creator, $subject);
    case Ambit.Member:
      return sql`false`; // TODO: Implement member scope.
    case Ambit.None:
    default:
      return sql`false`;
  }
}

export function remove<
  C extends TableConfig,
> (
  input: Input,
  table: PgTableWithColumns<C>,
  $id: string,
) {
  return async (tx: Transaction): Promise<[PgTableWithColumns<C>['$inferSelect']]> => {
    const { ambit, $subject, $dispatch } = input;

    if (!$subject) {
      throw new Error('Unauthorized. No subject provided for the remove operation.');
    }

    /**
     * Drizzle ORM does not have the `from` clause for the update builder...
     * so we have to build the SQL until then.
     * 
     * See issue for updates: https://github.com/drizzle-team/drizzle-orm/issues/2304
     */
    const chunks: SQL[] = [];
    chunks.push(tx.update(schemaCore.entity).set({ deleted: true }).getSQL());
    chunks.push(sql`where ${and(
      eq(schemaCore.entity.$id, $id),
      scope($subject, ambit),
    )}`);
    chunks.push(sql`returning *`);
    const removeSql = sql.join(chunks, sql.raw(' '));

    const { rows } = (await tx.execute(removeSql)) as unknown as { rows: RowList<object[]> };

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
          type: 'remove',
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
