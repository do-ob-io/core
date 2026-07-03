import { describe, it, expect } from 'vitest';

import { deobfuscate } from '../deobfuscate/deobfuscate.js';
import { obfuscate } from './obfuscate.js';

describe('obfuscate', () => {
  it('should prepend a 16-byte salt to the output', () => {
    const data = new Uint8Array([1, 2, 3, 4]);
    const result = obfuscate(data);
    expect(result.length).toBe(data.length + 16);
  });

  it('should produce different outputs for the same input across calls', () => {
    const data = new Uint8Array([10, 20, 30, 40, 50]);
    const a = obfuscate(data);
    const b = obfuscate(data);
    expect(a).not.toEqual(b);
  });

  it('should round-trip with deobfuscate using the default key', () => {
    const data = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 255, 128, 64]);
    const restored = deobfuscate(obfuscate(data));
    expect(restored).toEqual(data);
  });

  it('should round-trip with deobfuscate using a custom key', () => {
    const data = new Uint8Array([100, 101, 102, 103]);
    const restored = deobfuscate(obfuscate(data, 0xa5), 0xa5);
    expect(restored).toEqual(data);
  });

  it('should handle an empty input', () => {
    const data = new Uint8Array(0);
    const result = obfuscate(data);
    expect(result.length).toBe(16);
    expect(deobfuscate(result)).toEqual(data);
  });

  it('should handle large buffers efficiently', () => {
    const data = new Uint8Array(1024 * 1024);
    for (let i = 0; i < data.length; i += 65_536) {
      crypto.getRandomValues(data.subarray(i, i + 65_536));
    }
    const restored = deobfuscate(obfuscate(data));
    expect(restored).toEqual(data);
  });
});
