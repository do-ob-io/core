/**
 * Reverses the {@link obfuscate} transform, recovering the original bytes.
 *
 * Reads the leading 16-byte salt from the input and applies the inverse XOR
 * pass using the same key byte. Runs in O(n) with a single pass over the
 * payload.
 *
 * @param data - The obfuscated buffer produced by `obfuscate`. Must be at least 16 bytes long
 * @param keyByte - The same single-byte key used to obfuscate the data. Defaults to `0x5a`
 * @returns A new `Uint8Array` containing the recovered original bytes
 * @throws {RangeError} If `data` is shorter than the 16-byte salt header
 *
 * @example
 * ```ts
 * const bytes = new Uint8Array([1, 2, 3, 4]);
 * const hidden = obfuscate(bytes);
 * const restored = deobfuscate(hidden);
 * // restored is structurally equal to bytes
 * ```
 */
export function deobfuscate(data: Uint8Array, keyByte: number = 0x5a): Uint8Array {
  const saltLength = 16;

  if (data.length < saltLength) {
    throw new RangeError(`Obfuscated data must be at least ${saltLength} bytes long`);
  }

  const salt = data.subarray(0, saltLength);
  const payload = data.subarray(saltLength);
  const out = new Uint8Array(payload.length);

  for (const [i, element] of payload.entries()) {
    out[i] = element ^ keyByte ^ salt[i & 15];
  }

  return out;
}
