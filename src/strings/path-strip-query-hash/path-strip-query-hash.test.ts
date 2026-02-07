import { describe, expect, it } from 'vitest';

import { pathStripQueryHash } from './path-strip-query-hash.js';

describe('pathStripQueryHash', () => {
  it('strips query strings and hashes', () => {
    expect(pathStripQueryHash('/assets/bg.webp?x=1#frag')).toBe('/assets/bg.webp');
  });

  it('strips hash when no query is present', () => {
    expect(pathStripQueryHash('/assets/bg.webp#frag')).toBe('/assets/bg.webp');
  });

  it('strips query when no hash is present', () => {
    expect(pathStripQueryHash('/assets/bg.webp?x=1')).toBe('/assets/bg.webp');
  });

  it('trims whitespace', () => {
    expect(pathStripQueryHash('  /assets/bg.webp?x=1  ')).toBe('/assets/bg.webp');
  });

  it('returns empty string for empty input', () => {
    expect(pathStripQueryHash('')).toBe('');
  });
});
