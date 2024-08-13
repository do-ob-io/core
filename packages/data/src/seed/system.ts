import type { SchemaCore } from '@do-ob/data/schema';

export const records: Array<SchemaCore['system']['$inferInsert']> = [
  {
    $id: 'NAME',
    type: 'string',
    value: 'My Application',
    description: 'The name of this web application.',
  },
  {
    $id: 'DESCRIPTION',
    type: 'string',
    value: 'A web application for the world.',
    description: 'A description of The web application purpose or mission.',
  },
  {
    $id: 'VERSION',
    type: 'string',
    value: '1.0.0',
    description: 'The current version of this web application deployment.',
  },
  {
    $id: 'SYSTEM_SUBJECT',
    type: 'string',
    value: '00000000-0000-0000-0000-000000000000',
    description: 'The subject identifier for the system to carry out unrestricted operations.',
  },
  {
    $id: 'SEEDED',
    type: 'boolean',
    value: 'true',
    description: 'Flag to indicate if the system has been seeded with initial data.',
  },
  {
    $id: 'REGISTRATION_OPEN',
    type: 'boolean',
    value: 'false',
    description: 'Convenient flag to enable clients to register new user accounts if assigned with the registration actions.',
  },
  {
    $id: 'ANONYMOUS_ROLE_NAME',
    type: 'string',
    value: 'Anonymous',
    description: 'The role assigned to unauthenticated users. This allows anonymous clients to perform actions that are assigned to this role; like registering a new account.',
  },
  {
    $id: 'INITIAL_ROLE_NAME',
    type: 'string',
    value: 'Base',
    description: 'The role assigned to when a user account is created. This allows new users to perform actions that are assigned to this role; like updating their own profile.',
  }
];
