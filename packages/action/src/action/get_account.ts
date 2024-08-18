import { type Action, Ambit, Rate } from '@do-ob/core/io';

/**
 * A user handle or uuid v4.
 */
export type Payload = string;

export const type = 'get_account';

export function act(payload: Payload): Action<typeof type, Payload> {
  return {
    type,
    payload,
  };
};

export const ambit: Ambit = Ambit.Owned;

export const rate: Rate = Rate.Regular;
