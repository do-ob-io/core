import { describe, it, expect } from 'vitest';

import { breakLines } from './break-lines.js';

describe('breakLines', () => {
  it('should break string into lines based on max length', () => {
    expect(breakLines('hello world', 5)).toEqual(['hello', 'world']);
    expect(breakLines('the quick brown fox', 10)).toEqual(['the quick', 'brown fox']);
  });

  it('should handle strings shorter than max length', () => {
    expect(breakLines('short', 20)).toEqual(['short']);
    expect(breakLines('hello', 10)).toEqual(['hello']);
  });

  it('should handle empty strings', () => {
    expect(breakLines('', 10)).toEqual([]);
  });

  it('should handle single word that exceeds max length', () => {
    expect(breakLines('verylongword', 5)).toEqual(['verylongword']);
    expect(breakLines('supercalifragilisticexpialidocious', 10)).toEqual([
      'supercalifragilisticexpialidocious',
    ]);
  });

  it('should handle multiple spaces between words', () => {
    expect(breakLines('hello    world', 10)).toEqual(['hello', 'world']);
    expect(breakLines('one  two  three', 8)).toEqual(['one two', 'three']);
  });

  it('should break at exact max length when possible', () => {
    expect(breakLines('hello world', 11)).toEqual(['hello world']);
    expect(breakLines('hello world', 10)).toEqual(['hello', 'world']);
  });

  it('should handle multiple lines needed', () => {
    expect(breakLines('the quick brown fox jumps over the lazy dog', 10)).toEqual([
      'the quick',
      'brown fox',
      'jumps over',
      'the lazy',
      'dog',
    ]);
  });

  it('should handle words that are exactly max length', () => {
    expect(breakLines('hello world', 5)).toEqual(['hello', 'world']);
  });

  it('should handle zero or negative max length', () => {
    expect(breakLines('hello', 0)).toEqual([]);
    expect(breakLines('hello', -5)).toEqual([]);
  });

  it('should trim whitespace from resulting lines', () => {
    expect(breakLines('  hello   world  ', 10)).toEqual(['hello', 'world']);
  });

  it('should handle mixed long and short words', () => {
    expect(breakLines('a verylongword b', 5)).toEqual(['a', 'verylongword', 'b']);
  });
});
