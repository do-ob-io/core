/**
 * Obfuscates a byte buffer using a fast, salted XOR transform.
 *
 * A 16-byte random salt is generated and prepended to the output. Each byte of
 * the input is XOR-ed with the provided key byte and the corresponding salt
 * byte (cycled every 16 bytes). The transform runs in O(n) with a single pass
 * over the data, making it suitable for large payloads such as images or
 * binary blobs where speed matters more than cryptographic strength.
 *
 * This is **not** a cryptographic primitive. It hides data from casual
 * inspection but must not be used to protect secrets.
 *
 * @param data - The raw bytes to obfuscate
 * @param keyByte - A single-byte key mixed into every output byte. Defaults to `0x5a`
 * @returns A new `Uint8Array` of length `data.length + 16` containing the salt followed by the obfuscated bytes
 *
 * @example
 * ```ts
 * const bytes = new Uint8Array([1, 2, 3, 4]);
 * const hidden = obfuscate(bytes);
 * const restored = deobfuscate(hidden);
 * ```
 */
export function obfuscate(
  data: Uint8Array,
  keyByte: number = 0x5A,
): Uint8Array {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const out = new Uint8Array(salt.length + data.length);

  out.set(salt, 0);

  for (const [ i, element ] of data.entries()) {
    out[salt.length + i] = element ^ keyByte ^ salt[i & 15];
  }

  return out;
}
