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
    'test',
    context,
    [ register, async () => {
      console.log('HANDLING REGISTER ACTION');
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

  const data = await dispatch(register.act({
    type: 'webauthn',
    handle: '',
    credential: '',
    client: '',
    authenticator: ''
  }));

  const data2 = await dispatch({
    type: 'something else',
    payload: {},
  });

  data.test;

  data2.test;

  expect(dispatch).toBeDefined();
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
