// Core
import * as action from './schema/action.ts';
import * as amit from './schema/ambit.ts';
import * as dispatch from './schema/dispatch.ts';
import * as mutate from './schema/mutate.ts';
import * as session from './schema/session.ts';
import * as storage from './schema/storage.ts';
import * as system from './schema/system.ts';

// Entities
import * as credential from './schema/entity/credential.ts';
import * as entity from './schema/entity/entity.ts';
import * as email from './schema/entity/email.ts';
import * as locale from './schema/entity/locale.ts';
import * as phone from './schema/entity/phone.ts';
import * as profile from './schema/entity/profile.ts';
import * as role from './schema/entity/role.ts';
import * as user from './schema/entity/user.ts';

// Entity -> Files
import * as audio from './schema/entity/file/audio.ts';
import * as file from './schema/entity/file/file.ts';
import * as image from './schema/entity/file/image.ts';
import * as video from './schema/entity/file/video.ts';

// Join Tables
import * as assignment from './schema/join/assignment.ts';
import * as entitle from './schema/join/entitle.ts';
import * as permit from './schema/join/permit.ts';

export {
  action,
  amit,
  dispatch,
  mutate,
  session,
  storage,
  system,
  entity,
  credential,
  email,
  locale,
  phone,
  profile,
  role,
  user,
  file,
  audio,
  image,
  video,
  assignment,
  entitle,
  permit,
};

/**
 * A schema item module.
 */
type SchemaItem = {
  table: {
    $inferInsert: unknown;
    $inferSelect: unknown;
  };
  relates: unknown;
};

/**
 * Flattens a schema item group into a table and relates object.
 */
export type SchemaGroupFlat<G extends Record<string, { table: unknown; relates?: unknown }>> = {
  [K in keyof G as `${Extract<K, string>}`]: G[K]['table'];
} & {
  [K in keyof G as `${Extract<K, string>}Relates`]: G[K]['relates'];
};

/**
 * Flattens a schema item group into a table and relates object.
 */
function schemaGroupFlatten<G extends Record<string, { table: unknown; relates?: unknown }>>(
  group: G
): SchemaGroupFlat<G> {
  return Object.keys(group).reduce(
    (acc, key) => {
      const value = group[key as keyof typeof group];
      if(value.table) {
        acc[key] = value.table;
      }
      if('relates' in value) {
        acc[`${key}Relates`] = value.relates;
      }
      return acc;
    },
    {} as Record<string, unknown>
  ) as SchemaGroupFlat<G>;
}

/**
 * Core tables
 */
export const core = {
  action,
  amit,
  dispatch,
  mutate,
  session,
  storage,
  system,
  entity,
};

export type CoreInsert = {
  [K in keyof typeof core]: typeof core[K] extends SchemaItem
    ? typeof core[K]['table']['$inferInsert']
    : never;
};

export type CoreSelect = {
  [K in keyof typeof core]: typeof core[K] extends SchemaItem
    ? typeof core[K]['table']['$inferSelect']
    : never;
};

/**
 * Entity tables
 */
export const core_entity = {
  credential,
  email,
  locale,
  phone,
  profile,
  role,
  user,
  file,
};

export type CoreEntityInsert = {
  [K in keyof typeof core_entity]: typeof core_entity[K] extends SchemaItem
    ? typeof core_entity[K]['table']['$inferInsert']
    : never;
};

export type CoreEntitySelect = {
  [K in keyof typeof core_entity]: typeof core_entity[K] extends SchemaItem
    ? typeof core_entity[K]['table']['$inferSelect']
    : never;
};

/**
 * Entity File tables
 */
export const core_entity_file = {
  audio,
  image,
  video,
};

export type CoreEntityFileInsert = {
  [K in keyof typeof core_entity_file]: typeof core_entity_file[K] extends SchemaItem
    ? typeof core_entity_file[K]['table']['$inferInsert']
    : never;
};

export type CoreEntityFileSelect = {
  [K in keyof typeof core_entity_file]: typeof core_entity_file[K] extends SchemaItem
    ? typeof core_entity_file[K]['table']['$inferSelect']
    : never;
};

/**
 * Join tables
 */
export const join = {
  assignment,
  entitle,
  permit,
};

/**
 * All schema definitions.
 */
export const schema = {
  ...schemaGroupFlatten(core),
  ...schemaGroupFlatten(core_entity),
  ...schemaGroupFlatten(core_entity_file),
  ...schemaGroupFlatten(join),
};

export type SchemaInsert = {
  [K in keyof typeof schema]: typeof schema[K] extends SchemaItem['table']
    ? typeof schema[K]['$inferInsert']
    : never;
};

export type SchemaSelect = {
  [K in keyof typeof schema]: typeof schema[K] extends SchemaItem['table']
    ? typeof schema[K]['$inferSelect']
    : never;
};
