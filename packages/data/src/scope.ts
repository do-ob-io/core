import { Ambit } from '@do-ob/core';
import { sql, SQL, eq, or } from 'drizzle-orm';
import { schema } from '@do-ob/data/schema';

/**
 * Builds an sql filter based on an ambit.
 */
export function scope(
  $subject: string,
  ambit: Ambit,
): SQL | undefined {
  const conditions: SQL[] = [];

  if (ambit & Ambit.Global) {
    conditions.push(sql`true`);
  }

  if (ambit & Ambit.Public) {
    conditions.push(eq(schema.entity.public, true));
  }

  if (ambit & Ambit.Owned) {
    conditions.push(eq(schema.entity.$owner, $subject));
  }

  if (ambit & Ambit.Created) {
    conditions.push(eq(schema.entity.$creator, $subject));
  }

  if (ambit & Ambit.Member) {
    conditions.push(sql`false`); // TODO: Implement member scope.
  }

  if (conditions.length === 0) {
    return sql`false`;
  }

  if (conditions.length === 1) {
    return conditions[0];
  }

  return or(...conditions);
}
