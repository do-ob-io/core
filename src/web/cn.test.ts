import { describe, expect, it } from 'vitest';

import { cn } from './cn.js';

describe('cn', () => {
  describe('basic functionality', () => {
    it('should return empty string for no arguments', () => {
      expect(cn()).toBe('');
    });

    it('should return empty string for falsy arguments', () => {
      expect(cn(null, undefined, false)).toBe('');
    });

    it('should return single class unchanged', () => {
      expect(cn('px-4')).toBe('px-4');
    });

    it('should join multiple non-conflicting classes', () => {
      expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
    });
  });

  describe('clsx features - conditional classes', () => {
    it('should handle truthy conditional classes', () => {
      const isActive = true;
      expect(cn('base', isActive && 'active')).toBe('base active');
    });

    it('should handle falsy conditional classes', () => {
      const isActive = false;
      expect(cn('base', isActive && 'active')).toBe('base');
    });

    it('should handle mixed conditionals', () => {
      const isActive = true;
      const isDisabled = false;
      expect(cn('btn', isActive && 'btn-active', isDisabled && 'btn-disabled')).toBe(
        'btn btn-active',
      );
    });
  });

  describe('clsx features - object syntax', () => {
    it('should handle object with truthy values', () => {
      expect(cn({ foo: true, bar: true })).toBe('foo bar');
    });

    it('should handle object with falsy values', () => {
      expect(cn({ foo: true, bar: false })).toBe('foo');
    });

    it('should handle mixed string and object', () => {
      expect(cn('base', { active: true, disabled: false })).toBe('base active');
    });

    it('should handle object with null/undefined values', () => {
      expect(cn({ foo: null, bar: undefined, baz: true })).toBe('baz');
    });
  });

  describe('clsx features - array syntax', () => {
    it('should handle array of strings', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar');
    });

    it('should handle nested arrays', () => {
      expect(cn(['foo', ['bar', 'baz']])).toBe('foo bar baz');
    });

    it('should handle array with objects', () => {
      expect(cn(['foo', { bar: true }])).toBe('foo bar');
    });

    it('should handle array with conditionals', () => {
      const showBar = false;
      expect(cn(['foo', showBar && 'bar', 'baz'])).toBe('foo baz');
    });
  });

  describe('function arguments', () => {
    it('should handle a function that returns a class string', () => {
      expect(cn('base', () => 'active')).toBe('base active');
    });

    it('should accept a function with arguments as long as it returns a string', () => {
      expect(cn('base', (variant: string): string => variant ?? 'active')).toBe('base active');
    });

    it('should accept a function with arguments that returns undefined', () => {
      expect(cn('base', (_state: string): string | undefined => undefined)).toBe('base');
    });

    it('should support conflict resolution for function return values', () => {
      expect(cn('px-4', () => 'px-2')).toBe('px-2');
    });
  });

  describe('twMerge features - conflict resolution', () => {
    it('should resolve padding conflicts', () => {
      expect(cn('px-4', 'px-2')).toBe('px-2');
    });

    it('should resolve margin conflicts', () => {
      expect(cn('m-4', 'm-2')).toBe('m-2');
    });

    it('should resolve text color conflicts', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('should resolve background color conflicts', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    it('should resolve display conflicts', () => {
      expect(cn('block', 'flex')).toBe('flex');
    });

    it('should resolve position conflicts', () => {
      expect(cn('relative', 'absolute')).toBe('absolute');
    });
  });

  describe('combined clsx + twMerge functionality', () => {
    it('should merge conditional classes with conflict resolution', () => {
      const isError = true;
      expect(cn('border-gray-200', isError && 'border-red-500')).toBe('border-red-500');
    });

    it('should merge object syntax with conflict resolution', () => {
      expect(cn('px-4', { 'px-2': true })).toBe('px-2');
    });

    it('should merge array syntax with conflict resolution', () => {
      expect(cn(['px-4', 'py-2'], 'px-6')).toBe('py-2 px-6');
    });

    it('should handle complex component pattern', () => {
      const variant = 'primary';
      const variants = {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-gray-200 text-gray-900',
      };
      const result = cn('rounded-sm px-4 py-2', variants[variant], 'px-6');
      expect(result).toBe('rounded-sm py-2 bg-blue-500 text-white px-6');
    });

    it('should handle button component with conditional disabled state', () => {
      const isDisabled = true;
      const result = cn(
        'inline-flex items-center justify-center',
        `
          bg-blue-500
          hover:bg-blue-600
        `,
        isDisabled && 'cursor-not-allowed opacity-50',
        isDisabled &&
          `
          bg-gray-400
          hover:bg-gray-400
        `,
      );
      expect(result).toContain('opacity-50');
      expect(result).toContain('cursor-not-allowed');
      expect(result).toContain('bg-gray-400');
    });

    it('should handle responsive variants with conditionals', () => {
      const shouldOverride = true;
      const result = cn('sm:p-4', shouldOverride && 'sm:p-2');
      expect(result).toBe('sm:p-2');
    });

    it('should handle state variants with conditionals', () => {
      const shouldOverride = true;
      const result = cn(
        'hover:bg-red-500',
        shouldOverride &&
          `
        hover:bg-blue-500
      `,
      );
      expect(result).toBe('hover:bg-blue-500');
    });
  });

  describe('real-world component patterns', () => {
    it('should work with cva-like variant patterns', () => {
      const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium';
      const variants = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      };
      const sizes = {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      };

      const result = cn(base, variants['default'], sizes['sm'], 'bg-red-500');
      expect(result).toContain('bg-red-500');
      expect(result).toContain('h-9');
      expect(result).toContain('px-3');
    });

    it('should work with input component pattern', () => {
      const hasError = true;
      const result = cn(
        `
          flex h-10 w-full rounded-md border border-input bg-background px-3
          py-2
        `,
        `
          text-sm
          placeholder:text-muted-foreground
        `,
        'focus-visible:ring-2 focus-visible:outline-none',
        hasError &&
          `
          border-red-500
          focus-visible:ring-red-500
        `,
      );
      expect(result).toContain('border-red-500');
      expect(result).toContain('focus-visible:ring-red-500');
    });

    it('should work with card component pattern', () => {
      const className = 'rounded-xl shadow-lg';
      const result = cn('rounded-lg border bg-card text-card-foreground shadow-sm', className);
      expect(result).toContain('shadow-lg');
      expect(result).toContain('rounded-xl');
      expect(result).not.toContain('shadow-sm');
      expect(result).not.toContain('rounded-lg');
    });
  });

  describe('edge cases', () => {
    it('should handle numbers in arrays', () => {
      expect(cn(['foo', 123])).toBe('foo 123');
    });

    it('should handle empty strings', () => {
      expect(cn('', 'foo', '')).toBe('foo');
    });

    it('should handle deeply nested arrays', () => {
      expect(cn([[['foo']]], [['bar']])).toBe('foo bar');
    });

    it('should handle mixed complex inputs', () => {
      const showConditionalFalse = false;
      const showConditionalTrue = true;
      const result = cn(
        'base',
        ['array-class', { 'object-class': true }],
        showConditionalFalse && 'conditional-false',
        showConditionalTrue && 'conditional-true',
        null,
        undefined,
        { 'object-true': true, 'object-false': false },
      );
      // Verify all expected classes are present
      expect(result).toContain('base');
      expect(result).toContain('array-class');
      expect(result).toContain('object-class');
      expect(result).toContain('conditional-true');
      expect(result).toContain('object-true');
      // Verify excluded classes are not present
      expect(result).not.toContain('conditional-false');
      expect(result).not.toContain('object-false');
    });
  });
});
