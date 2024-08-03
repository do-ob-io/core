import { test, expect, assert } from 'vitest';
import { processify } from '@do-ob/logic/process';
import { database, adapter as dataAdapter } from '@do-ob/data';
import { register, locale_define } from '@do-ob/action';
import { inputify, OutputStatus } from '@do-ob/core/io';
import { contextify } from '@do-ob/core';

const context = contextify({
  adapter: {
    db: dataAdapter(database()),
  }
});

test('should create a process, add a handler, and execute', async () => {
  const process = processify(
    context,
    [ register, async (_) => {
      return {
        username: 'test'
      };
    } ],
    [ locale_define, async (_) => {
      return {
        locale: 'us'
      };
    } ],
  );

  const input = inputify({
    action: register.act({
      type: 'webauthn',
      handle: '',
      credential: '',
      client: '',
      authenticator: ''
    }),
  });

  const result = await process.execute(input);

  assert(result);

  expect(result).toMatchObject({
    status: OutputStatus.Success,
    payload: {
      username: 'test'
    }
  });
});
