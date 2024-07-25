import {
  clsx,
  clmg,
  memoize,
  nop,
  nanoid,
  fasthash,
} from '@do-ob/core/utility';

import type {
  Arguments,
} from '@do-ob/core/types';

import {
  Adapter,
  adaptify,
  Context,
  contextify,
} from '@do-ob/core/io';

import { Input, Action, Ambit, Rate } from '@do-ob/core/io';

export type {
  Arguments,

  Input,
  Action,
  Ambit,
  Rate,
  
  Adapter,
  Context,
};


export {
  clsx,
  clmg,
  memoize,
  nop,
  nanoid,
  fasthash,

  adaptify,
  contextify,
};
