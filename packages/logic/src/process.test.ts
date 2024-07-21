import { test, expect } from 'vitest';
import { setup } from '@do-ob/logic/process';
import { Database, database } from '@do-ob/data';
import { register } from '@do-ob/action';
import { Context, OutputStatus } from '@do-ob/core/io';

const context: Context<Database> = {
  database: database(),
};

test('should create a process, add a handler, and execute', () => {
  const process = setup('test', context);
  process.handle(register, async (context, payload) => {
    console.log('PAYLOAD', payload);
    return {
      status: OutputStatus.Success,
      payload: {
        username: 'test'
      }
    }
  }
});