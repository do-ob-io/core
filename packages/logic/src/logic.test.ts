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



test('should cope with a rejected promise from a thrown error in a process agent', async () => {

  const context = contextify({});

  const processOkay = processify(
    context,
    [ register, async () => {
      return {
        username: 'test'
      };
    } ]
  );

  const processThrowError = processify(
    context,
    [ register, async () => {
      throw new Error('A thrown error from the "processThrowError" process agent');
    } ]
  );

  const { dispatch } = logician({
    cope: (rejection) => {
      expect(rejection.key).toBe('throwError');
      expect(rejection.error).toBeInstanceOf(Error);
      expect(rejection.error.message).toBe('A thrown error from the "processThrowError" process agent');
    },
    pool: {
      okay: processOkay,
      throwError: processThrowError
    }
  });
  
  const data = await dispatch(register.act({
    type: 'webauthn',
    handle: '',
    credential: '',
    client: '',
    authenticator: ''
  }));

  expect(data).toBeDefined();
});
