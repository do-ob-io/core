// Core
import * as action from './schema/action.ts';
import * as amit from './schema/ambit.ts';
import * as dispatch from './schema/dispatch.ts';
import * as mutate from './schema/mutate.ts';
import * as session from './schema/session.ts';
import * as storage from './schema/storage.ts';
import * as system from './schema/system.ts';

export type * from './schema/action.ts';
export type * from './schema/ambit.ts';
export type * from './schema/dispatch.ts';
export type * from './schema/mutate.ts';
export type * from './schema/session.ts';
export type * from './schema/storage.ts';
export type * from './schema/system.ts';

// Entities
import * as credential from './schema/entity/credential.ts';
import * as entity from './schema/entity/entity.ts';
import * as email from './schema/entity/email.ts';
import * as locale from './schema/entity/locale.ts';
import * as phone from './schema/entity/phone.ts';
import * as profile from './schema/entity/profile.ts';
import * as role from './schema/entity/role.ts';
import * as user from './schema/entity/user.ts';

export type * from './schema/entity/credential.ts';
export type * from './schema/entity/entity.ts';
export type * from './schema/entity/email.ts';
export type * from './schema/entity/locale.ts';
export type * from './schema/entity/phone.ts';
export type * from './schema/entity/profile.ts';
export type * from './schema/entity/role.ts';
export type * from './schema/entity/user.ts';

// Entity -> Files
import * as audio from './schema/entity/file/audio.ts';
import * as file from './schema/entity/file/file.ts';
import * as image from './schema/entity/file/image.ts';
import * as video from './schema/entity/file/video.ts';

export type * from './schema/entity/file/audio.ts';
export type * from './schema/entity/file/file.ts';
export type * from './schema/entity/file/image.ts';
export type * from './schema/entity/file/video.ts';

// Join Tables
import * as assignment from './schema/join/assignment.ts';
import * as entitle from './schema/join/entitle.ts';
import * as permit from './schema/join/permit.ts';

export type * from './schema/join/assignment.ts';
export type * from './schema/join/entitle.ts';
export type * from './schema/join/permit.ts';

/**
 * Core tables
 */
export const schemaCore = {
  ...action,
  ...amit,
  ...dispatch,
  ...mutate,
  ...session,
  ...storage,
  ...system,
};

/**
 * Entity tables
 */
export const schemaEntity = {
  ...entity,
  ...credential,
  ...email,
  ...locale,
  ...phone,
  ...profile,
  ...role,
  ...user,
};

export type EntityInserts = {
  entity: typeof entity.entity.$inferInsert;
  credential: typeof credential.credential.$inferInsert;
  email: typeof email.email.$inferInsert;
  locale: typeof locale.locale.$inferInsert;
  phone: typeof phone.phone.$inferInsert;
  profile: typeof profile.profile.$inferInsert;
  role: typeof role.role.$inferInsert;
  user: typeof user.user.$inferInsert;
};

export type EntitySelects = {
  entity: typeof entity.entity.$inferSelect;
  credential: typeof credential.credential.$inferSelect;
  email: typeof email.email.$inferSelect;
  locale: typeof locale.locale.$inferSelect;
  phone: typeof phone.phone.$inferSelect;
  profile: typeof profile.profile.$inferSelect;
  role: typeof role.role.$inferSelect;
  user: typeof user.user.$inferSelect;
};

/**
 * Entity File tables
 */
export const schemaEntityFile = {
  ...audio,
  ...file,
  ...image,
  ...video,
};

/**
 * Join tables
 */
export const schemaJoin = {
  ...assignment,
  ...entitle,
  ...permit,
};

/**
 * All schema definitions.
 */
export const schema = {
  ...schemaCore,
  ...schemaEntity,
  ...schemaEntityFile,
  ...schemaJoin,
};
