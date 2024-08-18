import { type Action, Ambit, Rate } from '@do-ob/core/io';

/**
 * Returns the account of a subject's user.
 */
export type Payload = undefined;

export const type = 'my_account';

export function act(payload?: Payload): Action<typeof type, Payload> {
  return {
    type,
    payload,
  };
};

export const ambit: Ambit = Ambit.Owned;

export const rate: Rate = Rate.Regular;
