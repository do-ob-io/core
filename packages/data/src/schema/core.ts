export { table as action } from './core/action.ts';
export { table as dispatch, relates as dispatchRelates } from './core/dispatch.ts';

export { table as entity_credential, relates as entity_credentialRelates } from './core/entity_credential.ts';
export { table as entity_document } from './core/entity_document.ts';
export { table as entity_email, relates as entity_emailRelates } from './core/entity_email.ts';

export { table as entity_file_audio, relates as entity_file_audioRelates } from './core/entity_file_audio.ts';
export { table as entity_file_image, relates as entity_file_imageRelates } from './core/entity_file_image.ts';
export { table as entity_file_video, relates as entity_file_videoRelates } from './core/entity_file_video.ts';
export { table as entity_file, relates as entity_fileRelates } from './core/entity_file.ts';

export { table as entity_locale } from './core/entity_locale.ts';
export { table as entity_permit, relates as entity_permitRelates } from './core/entity_permit.ts';
export { table as entity_phone, relates as entity_phoneRelates } from './core/entity_phone.ts';
export { table as entity_profile, relates as entity_profileRelates } from './core/entity_profile.ts';
export { table as entity_role, relates as entity_roleRelates } from './core/entity_role.ts';
export { table as entity_user, relates as entity_userRelates } from './core/entity_user.ts';
export { table as entity, relates as entityRelates } from './core/entity.ts';

export { table as join_assignment, relates as join_assignmentRelates } from './core/join_assignment.ts';
export { table as join_entitle, relates as join_entitleRelates } from './core/join_entitle.ts';

export { table as mutate, relates as mutateRelates } from './core/mutate.ts';
export { table as session } from './core/session.ts';
export { table as storage } from './core/storage.ts';
export { table as system } from './core/system.ts';
