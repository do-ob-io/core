import { test, expect } from 'vitest';
import { logic } from '@do-ob/logic/logic';
import { database } from '@do-ob/data';
import { register } from '@do-ob/action';

test('should initialize a logic dispatch from the logic function', () => {
  const dispatch = logic();

  expect(dispatch).toBeDefined();
});

test('should be able to use a custom database initializer', () => {
  const dispatch = logic({
    database: () => {
      return database('memory://alternative');
    },
  });

  expect(dispatch).toBeDefined();
});

test('should dispatch an action to the logic for processing', async () => {
  const dispatch = logic();
  
  const data = await dispatch(register.action({
    type: 'webauthn',
    handle: '',
    credential: '',
    client: '',
    authenticator: ''
  }));

  expect(data).toBeDefined();
});
