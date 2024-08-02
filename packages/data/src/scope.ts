import { Ambit } from '@do-ob/core';
import { sql, SQL, eq } from 'drizzle-orm';
import { schema } from '@do-ob/data/schema';

/**
 * Builds an sql filter based on an ambit.
 */
export function scope(
  $subject: string,
  ambit: Ambit,
): SQL {
  switch(ambit) {
    case Ambit.Global:
      return sql`true`;
    case Ambit.Owned:
      return eq(schema.entity.$owner, $subject);
    case Ambit.Created:
      return eq(schema.entity.$creator, $subject);
    case Ambit.Member:
      return sql`false`; // TODO: Implement member scope.
    case Ambit.None:
    default:
      return sql`false`;
  }
}
