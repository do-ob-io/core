import { test, expect } from 'vitest';
import { logic } from '@do-ob/logic/logic';
import { register } from '@do-ob/action';
import { contextify } from '@do-ob/core';
import { processify } from './process';

test('should initialize a logic dispatch from the logic function', () => {
  const dispatch = logic();

  expect(dispatch).toBeDefined();
});

test('should be able to use a custom process', async () => {

  const context = contextify({});

  const processTest = processify(
    'account',
    context,
    [ register, async () => {
      return {
        status: 1,
        payload: {
          username: 'test'
        }
      };
    } ]
  );

  const { dispatch } = logic({
    processes: [ processTest ]
  });

  expect(dispatch).toBeDefined();

  const data = await dispatch(register.act({
    type: 'webauthn',
    handle: '',
    credential: '',
    client: '',
    authenticator: ''
  }));

  expect(data).toBeDefined();
  expect(data.account).toBeDefined();
  expect(data.account).toEqual({
    status: 1,
    payload: {
      username: 'test'
    }
  });

});

test('should dispatch an action to the logic for processing', async () => {
  const { dispatch } = logic();
  
  const data = await dispatch(register.act({
    type: 'webauthn',
    handle: '',
    credential: '',
    client: '',
    authenticator: ''
  }));

  expect(data).toBeDefined();
});
