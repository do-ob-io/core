import { type Action, Ambit, Rate } from '@do-ob/core/io';

/**
 * Define a localization dictionary entry.
 */
export type Payload = {
  /**
   * The language code the content is localized for.
   * 
   * @minLength 2
   * @maxLength 8
   */
  code: string;

  /**
   * The name key to reference the localized content.
   * 
   * @minLength 1
   * @maxLength 1024
   */
  name: string;

  /**
   * The localized textual content.
   */
  content: string;
}[];


export const type = 'define';

export function act(payload: Payload): Action<typeof type, Payload> {
  return {
    type,
    payload,
  };
};

export const ambit: Ambit = Ambit.None;

export const rate: Rate = Rate.Regular;
