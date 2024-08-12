// Core
import * as action from './schema/action.ts';
import * as dispatch from './schema/dispatch.ts';
import * as mutate from './schema/mutate.ts';
import * as session from './schema/session.ts';
import * as storage from './schema/storage.ts';
import * as system from './schema/system.ts';

// Entities
import * as entity_credential from './schema/entity/entity_credential.ts';
import * as entity from './schema/entity/entity.ts';
import * as entity_email from './schema/entity/entity_email.ts';
import * as entity_document from './schema/entity/entity_document.ts';
import * as entity_locale from './schema/entity/entity_locale.ts';
import * as entity_phone from './schema/entity/entity_phone.ts';
import * as entity_profile from './schema/entity/entity_profile.ts';
import * as entity_role from './schema/entity/entity_role.ts';
import * as entity_permit from './schema/entity/entity_permit.ts';
import * as entity_user from './schema/entity/entity_user.ts';

// Entity -> Files
import * as entity_file_audio from './schema/entity/file/entity_file_audio.ts';
import * as entity_file from './schema/entity/file/entity_file.ts';
import * as entity_file_image from './schema/entity/file/entity_file_image.ts';
import * as entity_file_video from './schema/entity/file/entity_file_video.ts';

// Join Tables
import * as join_assignment from './schema/join/join_assignment.ts';
import * as join_entitle from './schema/join/join_entitle.ts';

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
  entity_credential,
  entity_email,
  entity_document,
  entity_locale,
  entity_phone,
  entity_profile,
  entity_role,
  entity_user,
  entity_file,
  entity_file_audio,
  entity_file_image,
  entity_file_video,
  join_assignment,
  join_entitle,
  entity_permit,
});

export {
  action,
  dispatch,
  mutate,
  session,
  storage,
  system,
  entity,
  entity_credential,
  entity_email,
  entity_document,
  entity_locale,
  entity_phone,
  entity_profile,
  entity_role,
  entity_user,
  entity_file,
  entity_file_audio,
  entity_file_image,
  entity_file_video,
  join_assignment,
  join_entitle,
  entity_permit,
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
  entity_credential,
  entity_email,
  entity_document,
  entity_locale,
  entity_phone,
  entity_profile,
  entity_role,
  entity_user,
  entity_permit,
  entity_file,
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
  entity_file_audio,
  entity_file_image,
  entity_file_video,
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
  join_assignment,
  join_entitle,
};
