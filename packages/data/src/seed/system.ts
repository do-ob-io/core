import type { SchemaCore } from '@do-ob/data/schema';

export const records: Array<SchemaCore['system']['$inferInsert']> = [
  {
    $id: 'NAME',
    value: 'My Application',
    description: 'The name of this web application.',
  },
  {
    $id: 'DESCRIPTION',
    value: 'A web application for the world.',
    description: 'A description of The web application purpose or mission.',
  },
  {
    $id: 'VERSION',
    value: '1.0.0',
    pattern: '^\\d+\\.\\d+\\.\\d+$',
    description: 'The current version of this web application deployment.',
  },
  {
    $id: 'SYSTEM_SUBJECT',
    value: '00000000-0000-0000-0000-000000000000',
    pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
    description: 'The subject identifier for the system to carry out unrestricted operations.',
  },
  {
    $id: 'SEEDED',
    value: 'true',
    pattern: '^(true|false)$',
    description: 'Flag to indicate if the system has been seeded with initial data.',
  },
  {
    $id: 'REGISTRATION_OPEN',
    value: 'false',
    pattern: '^(true|false)$',
    description: 'Convenient flag to enable or disable clients to register new user accounts through the register action.',
  },
  {
    $id: 'ADMINISTRATOR_ROLE_NAME',
    value: 'Administrator',
    description: 'The role assigned to administrators. This allows users with this role to perform any actions regardless of permissions.',
  },
  {
    $id: 'ANONYMOUS_ROLE_NAME',
    value: 'Anonymous',
    description: 'The role assigned to unauthenticated users. This allows anonymous clients to perform actions that are assigned to this role; like registering a new account.',
  },
  {
    $id: 'INITIAL_ROLE_NAME',
    value: 'Base',
    description: 'The role assigned to when a user account is created. This allows new users to perform actions that are assigned to this role; like updating their own profile.',
  }
];
