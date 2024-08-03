import { test, expect } from 'vitest';
import { logician } from './logic';
import { register, locale_define } from '@do-ob/action';
import { contextify } from '@do-ob/core';
import { processify } from './process';

test('should initialize a logic dispatch from the logic function', () => {
  const dispatch = logician();

  expect(dispatch).toBeDefined();
});

test('should be able to use a custom process', async () => {

  const context = contextify({});

  const processAccount = processify(
    context,
    [ register, async () => {
      return {
        username: 'test'
      };
    } ],
    [ locale_define, async () => {
      return {
        code: 'en-US'
      } as const;
    } ]
  );

  const processSubscription = processify(
    context,
    [ register, async () => {
      return {
        subscription: 'hello_world'
      };
    } ],
  );

  const { dispatch } = logician({
    pool: {
      account: processAccount,
      subscription: processSubscription,
    }
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
  const { dispatch } = logician();
  
  const data = await dispatch(register.act({
    type: 'webauthn',
    handle: '',
    credential: '',
    client: '',
    authenticator: ''
  }));

  expect(data).toBeDefined();
});
