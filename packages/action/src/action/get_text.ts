import { type Action, Ambit, Rate } from '@do-ob/core/io';

/**
 * Array dictionary entry names.
 */
export type Payload = string[];

export const type = 'get_text';

export function act(payload: Payload): Action<typeof type, Payload> {
  return {
    type,
    payload,
  };
};

export const ambit: Ambit = Ambit.Public | Ambit.Owned;

export const rate: Rate = Rate.Regular;
