import { Ambit, Rate } from '@do-ob/core';
import { Transaction } from './transaction.types';
import { cache, cacheKey } from '@do-ob/data/cache';
import { schemaCore } from '@do-ob/data/schema';
import { eq, inArray } from '@do-ob/data/filter';

export interface PermitData {
  /**
   * The action that the permit allows.
   */
  $action: string;

  /**
   * The scope of allowances.
   */
  scope: [ Ambit, Rate ];

  /**
   * Entities that provide permites for the given action.
   */
  $entities: string[];
}

export function permits(
  $subject?: string,
) {
  return async (tx: Transaction): Promise<Record<string, PermitData>> => {

    if(!$subject) {
      throw new Error('Unauthorized. No subject provided for the insert operation.');
    }

    const $assignments = await cache.memo(
      cacheKey.assignments($subject),
      async () => {
        const results = await tx.select({ $role: schemaCore.join_assignment.$role })
          .from(schemaCore.join_assignment)
          .where(eq(schemaCore.join_assignment.$entity, $subject));
        return results.map(({ $role }) => $role);
      }
    );

    /**
     * Get the permits for the subject and its roles.
     */
    const permits = await cache.memo<Promise<Record<string, PermitData>>>(
      cacheKey.permits($subject),
      async () => {
        /**
         * Store the consolidated permits in this object.
         */
        const consolidated: Record<string, PermitData> = {};

        /**
         * Get all permits assigned to the subject and its roles.
         */
        const assigned = await tx.select().from(schemaCore.entity_permit).where(inArray(schemaCore.entity_permit.$entity, [ $subject, ...$assignments ]));

        /**
         * Loop through the assigned permits and consolidate them, combining or overriding less permissive permits with more permissive ones.
         */
        for(const permit of assigned) {
          const { $entity, $action, ambit, rate } = permit;

          /**
           * If the permit is already defined, combine the bitwise flag ambits and take the highest rate.
           */
          if(consolidated[$action]) {
            const [ ambitCurrent, rateCurrent ] = consolidated[$action].scope;
            consolidated[$action].scope = [ ambitCurrent | ambit, rateCurrent > rate ? rateCurrent : rate ];

            // Add the $entity to the permit's $entities array if it is not already present.
            if(!consolidated[$action].$entities.includes($entity)) {
              consolidated[$action].$entities.push($entity);
            }
            continue;
          }

          consolidated[$action] = {
            $action,
            scope: [ ambit, rate ],
            $entities: [ $entity ],
          };
        }

        return consolidated;
      }
    );

    return permits;
  };
}
