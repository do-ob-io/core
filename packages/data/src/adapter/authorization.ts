import { Ambit, Input, Rate } from '@do-ob/core';
import type { Database } from '@do-ob/data/database';
import { cache, CACHE } from '@do-ob/data/cache';

const noauth = [ Ambit.None, Rate.None ] as const;

/**
 * Gets authorization values based on an IO Input.
 */
export default <
  D extends Database,
>(database: D | Promise<D>) =>
  async (input: Input): Promise<readonly [ Ambit, Rate ]> => {
    const db = await database;
    const { $subject, action } = input;

    /**
     * If the subject is not provided, attempt to get the permission from
     * the System Anonymous role.
     */
    if (!$subject) {

      /**
       * Get the system registry.
       */
      const systemRegistry = await cache.memo(CACHE.SYSTEM, async (): Promise<Record<string, string>> => {
        const results = await db.query.system.findMany();
        if (!results.length) {
          return {};
        }
        return results.reduce((acc, { $id, value }) => ({ ...acc, [$id]: value }), {});
      });

      if (!systemRegistry['ANONYMOUS_ROLE_NAME']) {
        return noauth;
      }

      /**
       * Get the anonymous subject's permits.
       */
      const permits = await cache.memo(`${CACHE.PERMIT_PREFIX}${systemRegistry['ANONYMOUS_ROLE_NAME']}`, async (): Promise<Record<string, [ Ambit, Rate ]>> => {
        const results = await db.query.entity_permit.findMany({
          where: (table, { eq }) => eq(table.$entity, systemRegistry['ANONYMOUS_ROLE_NAME']),
        });
        if (!results.length) {
          return {};
        }

        return results.reduce((acc, { $action, ambit, rate }) => ({ ...acc, [$action]: [ ambit, rate ] }), {});
      });

      const permit = permits[action.type];

      if(!permit) {
        return noauth;
      }

      return permit;

    }

    /**
     * Get the subject's permits.
     */
    const permits = await cache.memo(`${CACHE.PERMIT_PREFIX}${$subject}`, async (): Promise<Record<string, [ Ambit, Rate ]>> => {
      const results = await db.query.entity_permit.findMany({
        where: (table, { eq }) => eq(table.$entity, $subject),
      });
      if (!results.length) {
        return {};
      }

      return {};
    });

    return results.reduce((acc, { $action, ambit, rate }) => ({ ...acc, [$action]: [ ambit, rate ] }), {});

    return [ Ambit.Public, Rate.Unlimited ];
  };
