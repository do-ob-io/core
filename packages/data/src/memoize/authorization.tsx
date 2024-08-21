import { Ambit, memoize, Rate, type Input } from '@do-ob/core';

/**
 * Gets authorization values based on an IO Input.
 */
export const authorization = memoize(async (input: Input) => {

  if (!input.$subject) {
    return [ Ambit.None, Rate.None ];
  }

  return [ Ambit.Public, Rate.Regular ];
});
