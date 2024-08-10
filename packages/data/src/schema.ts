// Core
import * as action from './schema/action.ts';
import * as dispatch from './schema/dispatch.ts';
import * as mutate from './schema/mutate.ts';
import * as session from './schema/session.ts';
import * as storage from './schema/storage.ts';
import * as system from './schema/system.ts';

// Entities
import * as credential from './schema/entity/entity_credential.ts';
import * as entity from './schema/entity/entity.ts';
import * as email from './schema/entity/entity_email.ts';
import * as locale from './schema/entity/entity_locale.ts';
import * as phone from './schema/entity/entity_phone.ts';
import * as profile from './schema/entity/entity_profile.ts';
import * as role from './schema/entity/entity_role.ts';
import * as permit from './schema/entity/entity_permit.ts';
import * as user from './schema/entity/entity_user.ts';

// Entity -> Files
import * as audio from './schema/entity/file/entity_file_audio.ts';
import * as file from './schema/entity/file/entity_file.ts';
import * as image from './schema/entity/file/entity_file_image.ts';
import * as video from './schema/entity/file/entity_file_video.ts';

// Join Tables
import * as assignment from './schema/join/join_assignment.ts';
import * as entitle from './schema/join/join_entitle.ts';

/**
 * Flattens a schema item group into a table and relates object.
 */
export function schemaFlatten<G extends Record<string, { table: unknown; relates?: unknown }>>(
  group: G
): {
  [K in keyof G as `${Extract<K, string>}`]: G[K]['table'];
} & {
  [K in keyof G as `${Extract<K, string>}Relates`]: G[K]['relates'];
} {
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
  ) as {
    [K in keyof G as `${Extract<K, string>}`]: G[K]['table'];
  } & {
    [K in keyof G as `${Extract<K, string>}Relates`]: G[K]['relates'];
  };
}

export const schema = schemaFlatten({
  action,
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
});

export {
  action,
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

export type Schema = typeof schema;

/**
 * A schema item module.
 */
export type SchemaItem = {
  table: {
    $inferInsert: unknown;
    $inferSelect: unknown;
  };
  relates?: unknown;
};

export type SchemaInsert = {
  [K in keyof Schema]: Schema[K] extends SchemaItem['table']
    ? Schema[K]['$inferInsert']
    : never;
};

export type SchemaSelect = {
  [K in keyof Schema]: Schema[K] extends SchemaItem['table']
    ? Schema[K]['$inferSelect']
    : never;
};

/**
 * Core tables
 */
export const core = {
  action,
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
  permit,
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
};
