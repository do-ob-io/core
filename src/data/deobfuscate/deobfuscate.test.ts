import { describe, it, expect } from 'vitest';

import { obfuscate } from '../obfuscate/obfuscate.js';
import { deobfuscate } from './deobfuscate.js';

describe('deobfuscate', () => {
  it('should recover the original bytes', () => {
    const data = new Uint8Array([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
    expect(deobfuscate(obfuscate(data))).toEqual(data);
  });

  it('should produce a wrong result when the wrong key is used', () => {
    const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
    const wrong = deobfuscate(obfuscate(data, 0x11), 0x22);
    expect(wrong).not.toEqual(data);
  });

  it('should throw when input is shorter than the salt header', () => {
    const tooShort = new Uint8Array(15);
    expect(() => deobfuscate(tooShort)).toThrow(RangeError);
  });

  it('should return an empty array when only the salt is present', () => {
    const saltOnly = obfuscate(new Uint8Array(0));
    expect(deobfuscate(saltOnly)).toEqual(new Uint8Array(0));
  });
});
