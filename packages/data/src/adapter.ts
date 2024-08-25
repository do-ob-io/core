import { adaptify } from '@do-ob/core';
import { Database } from '@do-ob/data/database';

import * as cache from './cache';

import insert from './adapter/insert';
import insertMany from './adapter/insert';
import query from './adapter/query';
import update from './adapter/update';
import remove from './adapter/remove';
import authorization from './adapter/authorization';


export function adapter<
  D extends Database,
>(database: D | Promise<D>) {
  
  return adaptify({

    /**
     * Cache for memoization.
     */
    cache: () => cache,

    /**
     * The database driver.
     */
    driver: async () => await database,

    /**
     * Safely inserts a new entity into the database with authorization controls and audits.
     */
    insert: insert(database),

    /**
     * Safely inserts a new entity into the database with authorization controls and audits.
     */
    insertMany: insertMany(database),

    /**
     * Safely queries entities from the database with authorization controls and audits.
     */
    query: query(database),

    /**
     * Safely updates an entity in the database with authorization controls and audits.
     */
    update: update(database),

    /**
     * Safely removes an entity from the database with authorization controls and audits.
     */
    remove: remove(database),

    /**
     * Gets authorization values based on an IO Input.
     */
    authorization: authorization(database),
  });
};
