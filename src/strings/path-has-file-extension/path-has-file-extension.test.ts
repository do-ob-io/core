import { describe, expect, it } from 'vitest';

import { pathHasFileExtension } from './path-has-file-extension.js';

describe('pathHasFileExtension', () => {
  it('matches extensions case-insensitively', () => {
    expect(pathHasFileExtension('/videos/intro.MP4', 'mp4')).toBe(true);
  });

  it('accepts extension arrays with and without dots', () => {
    expect(pathHasFileExtension('/videos/intro.webm', ['.mp4', 'webm'])).toBe(true);
  });

  it('returns false when there is no extension', () => {
    expect(pathHasFileExtension('/assets/readme', 'md')).toBe(false);
  });

  it('normalizes paths before checking', () => {
    expect(pathHasFileExtension(' /assets/bg.webm?x=1 ', 'webm')).toBe(true);
  });

  it('returns false for empty extension inputs', () => {
    expect(pathHasFileExtension('/assets/bg.webm', ' ')).toBe(false);
  });
});
