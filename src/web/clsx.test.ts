/* eslint-disable no-constant-binary-expression */
import { describe, it, expect } from 'vitest';

import { clsx } from './clsx.js';

describe('clsx', () => {
  it('should return empty string for no arguments', () => {
    expect(clsx()).toBe('');
  });

  it('should handle string arguments', () => {
    expect(clsx('foo')).toBe('foo');
    expect(clsx('foo', 'bar')).toBe('foo bar');
    expect(clsx('foo', 'bar', 'baz')).toBe('foo bar baz');
  });

  it('should handle number arguments', () => {
    expect(clsx(1)).toBe('1');
    expect(clsx(0)).toBe('');
    expect(clsx('foo', 1, 'bar')).toBe('foo 1 bar');
    expect(clsx('foo', 0, 'bar')).toBe('foo bar');
  });

  it('should handle boolean arguments', () => {
    expect(clsx(true)).toBe('');
    expect(clsx(false)).toBe('');
    expect(clsx('foo', true && 'bar')).toBe('foo bar');
    expect(clsx('foo', false && 'bar')).toBe('foo');
  });

  it('should handle null and undefined arguments', () => {
    expect(clsx(null)).toBe('');
    expect(clsx()).toBe('');
    expect(clsx('foo', null, 'bar')).toBe('foo bar');
    expect(clsx('foo', undefined, 'bar')).toBe('foo bar');
  });

  it('should handle object arguments', () => {
    expect(clsx({ foo: true })).toBe('foo');
    expect(clsx({ foo: false })).toBe('');
    expect(clsx({ foo: true, bar: false })).toBe('foo');
    expect(clsx({ foo: true, bar: true })).toBe('foo bar');
    expect(clsx({ foo: null, bar: undefined })).toBe('');
  });

  it('should handle array arguments', () => {
    expect(clsx(['foo'])).toBe('foo');
    expect(clsx(['foo', 'bar'])).toBe('foo bar');
    expect(clsx(['foo', ['bar']])).toBe('foo bar');
    expect(clsx(['foo', ['bar', 'baz']])).toBe('foo bar baz');
  });

  it('should handle nested arrays', () => {
    expect(clsx(['foo', ['bar', ['baz']]])).toBe('foo bar baz');
    expect(clsx([['foo'], 'bar'])).toBe('foo bar');
    expect(clsx([[['foo']], 'bar'])).toBe('foo bar');
  });

  it('should handle mixed arrays with objects', () => {
    expect(clsx(['foo', { bar: true }])).toBe('foo bar');
    expect(clsx(['foo', { bar: false }])).toBe('foo');
    expect(clsx([{ foo: true }, 'bar'])).toBe('foo bar');
    expect(clsx([{ foo: true }, { bar: false }, 'baz'])).toBe('foo baz');
  });

  it('should handle complex mixed arguments', () => {
    expect(clsx('foo', 'bar', { baz: true, qux: false }, ['hello', { world: true }])).toBe(
      'foo bar baz hello world',
    );

    expect(clsx('foo', null, undefined, '', 0, false, { bar: true }, ['baz', { qux: false }])).toBe(
      'foo bar baz',
    );
  });

  it('should handle empty arrays and empty objects', () => {
    expect(clsx([])).toBe('');
    expect(clsx({})).toBe('');
    expect(clsx('foo', [], 'bar')).toBe('foo bar');
    expect(clsx('foo', {}, 'bar')).toBe('foo bar');
  });

  it('should handle edge cases with falsy values in arrays', () => {
    expect(clsx(['foo', null, undefined, false, 0, ''])).toBe('foo');
    expect(clsx([null, 'foo', false, 'bar', undefined])).toBe('foo bar');
  });

  it('should handle nested objects in arrays', () => {
    expect(clsx([{ foo: true, bar: false }, { baz: true }])).toBe('foo baz');
    expect(clsx(['hello', { foo: true, bar: false }, { baz: true }, 'world'])).toBe(
      'hello foo baz world',
    );
  });

  it('should preserve original order of classes', () => {
    expect(clsx('z', 'a', 'b')).toBe('z a b');
    expect(clsx({ z: true, a: true, b: true })).toBe('z a b');
  });

  it('should handle whitespace in class names', () => {
    expect(clsx('foo bar')).toBe('foo bar');
    expect(clsx('foo bar', 'baz')).toBe('foo bar baz');
  });
});
