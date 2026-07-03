import { deobfuscate, obfuscate } from '../../data/index.js';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Encodes a string to UTF-8 and obfuscates the resulting bytes using a fast,
 * salted XOR transform.
 *
 * A 16-byte random salt is prepended to the output. To recover the original
 * string, pass the result to {@link deobfuscateString} using the same key byte.
 *
 * This is **not** a cryptographic primitive. It hides data from casual
 * inspection but must not be used to protect secrets.
 *
 * @param text - The string to obfuscate
 * @param keyByte - A single-byte key mixed into every output byte. Defaults to `0x5a`
 * @returns A `Uint8Array` containing the 16-byte salt followed by the obfuscated UTF-8 bytes
 *
 * @example
 * ```ts
 * const hidden = obfuscateString('hello world');
 * const text = deobfuscateString(hidden); // 'hello world'
 * ```
 */
export function obfuscateString(text: string, keyByte: number = 0x5a): Uint8Array {
  const bytes = encoder.encode(text);
  return obfuscate(bytes, keyByte);
}

/**
 * Reverses {@link obfuscateString}, recovering the original UTF-8 string.
 *
 * @param data - The obfuscated buffer produced by `obfuscateString`. Must be at least 16 bytes long
 * @param keyByte - The same single-byte key used to obfuscate the data. Defaults to `0x5a`
 * @returns The recovered string
 * @throws {RangeError} If `data` is shorter than the 16-byte salt header
 *
 * @example
 * ```ts
 * const hidden = obfuscateString('hello world');
 * const text = deobfuscateString(hidden); // 'hello world'
 * ```
 */
export function deobfuscateString(data: Uint8Array, keyByte: number = 0x5a): string {
  return decoder.decode(deobfuscate(data, keyByte));
}
