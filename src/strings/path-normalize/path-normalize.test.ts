import { describe, expect, it } from 'vitest';

import { pathNormalize } from './path-normalize.js';

describe('pathNormalize', () => {
  it('trims whitespace and strips query/hash', () => {
    expect(pathNormalize('  /foo/bar?x=1#hash  ')).toBe('foo/bar');
  });

  it('normalizes slashes and removes redundant separators', () => {
    expect(pathNormalize(String.raw`foo//bar\baz`)).toBe('foo/bar/baz');
  });

  it('removes leading and trailing slashes', () => {
    expect(pathNormalize('/foo/bar/')).toBe('foo/bar');
  });

  it('collapses dot segments and strips traversal', () => {
    expect(pathNormalize('foo/./bar/../baz')).toBe('foo/bar/baz');
  });

  it('sanitizes scheme prefixes and drive letters', () => {
    expect(pathNormalize('http://example.com/path/file.txt')).toBe('example.com/path/file.txt');
    expect(pathNormalize(String.raw`C:\Temp\file.txt`)).toBe('Temp/file.txt');
  });

  it('removes null bytes and handles encoded separators', () => {
    expect(pathNormalize('safe\0name%2fdir%5cfile.txt')).toBe('safename/dir/file.txt');
  });

  it('drops encoded traversal segments including double-encoding', () => {
    expect(pathNormalize('%2e%2e/secret')).toBe('secret');
    expect(pathNormalize('%252e%252e/secret')).toBe('secret');
  });
});
