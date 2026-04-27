import { describe, it, expect } from 'vitest';

import { deobfuscateString, obfuscateString } from './obfuscate-string.js';

describe('obfuscateString / deobfuscateString', () => {
  it('should round-trip a plain ASCII string', () => {
    const text = 'hello world';
    expect(deobfuscateString(obfuscateString(text))).toBe(text);
  });

  it('should round-trip a unicode string', () => {
    const text = '日本語テスト 🎉';
    expect(deobfuscateString(obfuscateString(text))).toBe(text);
  });

  it('should round-trip an empty string', () => {
    expect(deobfuscateString(obfuscateString(''))).toBe('');
  });

  it('should produce different outputs across calls for the same input', () => {
    const text = 'same input';
    const a = obfuscateString(text);
    const b = obfuscateString(text);
    expect(a).not.toEqual(b);
  });

  it('should round-trip using a custom key byte', () => {
    const text = 'custom key';
    expect(deobfuscateString(obfuscateString(text, 0xA5), 0xA5)).toBe(text);
  });

  it('should produce a wrong result when the wrong key is used', () => {
    const text = 'mismatch';
    const hidden = obfuscateString(text, 0x11);
    expect(deobfuscateString(hidden, 0x22)).not.toBe(text);
  });

  it('should throw when input is shorter than the salt header', () => {
    expect(() => deobfuscateString(new Uint8Array(15))).toThrow(RangeError);
  });
});
