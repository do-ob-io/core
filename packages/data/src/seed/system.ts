import { SchemaInsert } from '../schema';

export const records: Array<SchemaInsert['system']> = [
  {
    $id: 'NAME',
    type: 'string',
    value: 'My Application',
    description: 'The name of this web application.',
  },
  {
    $id: 'DESCRIPTION',
    type: 'string',
    value: 'A web application for my users.',
    description: 'A description of The web application purpose or mission.',
  },
  {
    $id: 'VERSION',
    type: 'string',
    value: '1.0.0',
    description: 'The current version of this web application deployment.',
  },
  {
    $id: 'REGISTRATION_OPEN',
    type: 'boolean',
    value: 'false',
    description: 'Convenient flag to enable clients to register new user accounts if assigned with the registration actions.',
  },
  {
    $id: 'ANONYMOUS_ROLE',
    type: 'string',
    value: 'Anonymous',
    description: 'The role assigned to unauthenticated users. This allows anonymous clients to perform actions that are assigned to this role; like registering a new account.',
  }
];
