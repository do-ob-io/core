import { describe, it, expect } from 'vitest';

import { cva } from './cva.js';

describe('cva', () => {
  describe('basic functionality', () => {
    it('should return base class when called with no config', () => {
      const variants = cva('btn');
      expect(variants()).toBe('btn');
    });

    it('should return base class with custom className', () => {
      const variants = cva('btn');
      expect(variants({ className: 'custom' })).toBe('btn custom');
    });

    it('should return base class when config has no variants', () => {
      const variants = cva('btn', {});
      expect(variants()).toBe('btn');
    });
  });

  describe('simple variants', () => {
    const buttonVariants = cva('btn', {
      variants: {
        variant: {
          primary: 'bg-blue-500',
          secondary: 'bg-gray-500',
        },
      },
    });

    it('should apply variant classes', () => {
      expect(buttonVariants({ variant: 'primary' })).toBe('btn bg-blue-500');
      expect(buttonVariants({ variant: 'secondary' })).toBe('btn bg-gray-500');
    });

    it('should return base class when no variant is specified', () => {
      expect(buttonVariants()).toBe('btn');
    });

    it('should ignore invalid variant values', () => {
      expect(buttonVariants({ variant: 'invalid' as any })).toBe('btn');
    });
  });

  describe('multiple variants', () => {
    const buttonVariants = cva('btn', {
      variants: {
        variant: {
          primary: 'bg-blue-500',
          secondary: 'bg-gray-500',
        },
        size: {
          sm: 'px-2 py-1',
          lg: 'px-4 py-2',
        },
      },
    });

    it('should apply multiple variant classes', () => {
      expect(buttonVariants({ variant: 'primary', size: 'sm' }))
        .toBe('btn bg-blue-500 px-2 py-1');

      expect(buttonVariants({ variant: 'secondary', size: 'lg' }))
        .toBe('btn bg-gray-500 px-4 py-2');
    });

    it('should apply partial variant classes', () => {
      expect(buttonVariants({ variant: 'primary' })).toBe('btn bg-blue-500');
      expect(buttonVariants({ size: 'lg' })).toBe('btn px-4 py-2');
    });
  });

  describe('default variants', () => {
    const buttonVariants = cva('btn', {
      variants: {
        variant: {
          primary: 'bg-blue-500',
          secondary: 'bg-gray-500',
        },
        size: {
          sm: 'px-2 py-1',
          lg: 'px-4 py-2',
        },
      },
      defaultVariants: {
        variant: 'primary',
        size: 'sm',
      },
    });

    it('should apply default variants when no props provided', () => {
      expect(buttonVariants()).toBe('btn bg-blue-500 px-2 py-1');
    });

    it('should override default variants with provided props', () => {
      expect(buttonVariants({ variant: 'secondary' }))
        .toBe('btn bg-gray-500 px-2 py-1');

      expect(buttonVariants({ size: 'lg' }))
        .toBe('btn bg-blue-500 px-4 py-2');
    });

    it('should override all defaults with provided props', () => {
      expect(buttonVariants({ variant: 'secondary', size: 'lg' }))
        .toBe('btn bg-gray-500 px-4 py-2');
    });
  });

  describe('className handling', () => {
    const buttonVariants = cva('btn', {
      variants: {
        variant: {
          primary: 'bg-blue-500',
        },
      },
      defaultVariants: {
        variant: 'primary',
      },
    });

    it('should append custom className', () => {
      expect(buttonVariants({ className: 'custom-class' }))
        .toBe('btn bg-blue-500 custom-class');
    });

    it('should handle complex className values', () => {
      expect(buttonVariants({ className: 'custom multiple classes' }))
        .toBe('btn bg-blue-500 custom multiple classes');
    });

    it('should handle className with variant override', () => {
      expect(buttonVariants({ variant: 'primary', className: 'custom' }))
        .toBe('btn bg-blue-500 custom');
    });

    it('should handle className as array', () => {
      expect(buttonVariants({ className: [ 'custom', 'array' ] }))
        .toBe('btn bg-blue-500 custom array');
    });

    it('should handle className as object', () => {
      expect(buttonVariants({ className: { custom: true, hidden: false } }))
        .toBe('btn bg-blue-500 custom');
    });
  });

  describe('complex variants with different ClassValue types', () => {
    const alertVariants = cva('alert rounded p-4', {
      variants: {
        variant: {
          info: [ 'bg-blue-100', 'text-blue-800' ],
          success: { 'bg-green-100': true, 'text-green-800': true },
          warning: 'bg-yellow-100 text-yellow-800',
        },
        size: {
          sm: 'text-sm px-3 py-2',
          md: [ 'text-base', 'px-4', 'py-3' ],
          lg: { 'text-lg': true, 'px-6': true, 'py-4': true },
        },
      },
      defaultVariants: {
        variant: 'info',
        size: 'md',
      },
    });

    it('should handle array ClassValues', () => {
      expect(alertVariants({ variant: 'info' }))
        .toBe('alert rounded p-4 bg-blue-100 text-blue-800 text-base px-4 py-3');
    });

    it('should handle object ClassValues', () => {
      expect(alertVariants({ variant: 'success' }))
        .toBe('alert rounded p-4 bg-green-100 text-green-800 text-base px-4 py-3');
    });

    it('should handle string ClassValues', () => {
      expect(alertVariants({ variant: 'warning' }))
        .toBe('alert rounded p-4 bg-yellow-100 text-yellow-800 text-base px-4 py-3');
    });

    it('should handle mixed ClassValue types', () => {
      expect(alertVariants({ variant: 'success', size: 'lg' }))
        .toBe('alert rounded p-4 bg-green-100 text-green-800 text-lg px-6 py-4');
    });
  });

  describe('edge cases', () => {
    it('should handle empty base class', () => {
      const variants = cva('', {
        variants: { color: { red: 'text-red-500' } },
      });
      expect(variants({ color: 'red' })).toBe('text-red-500');
    });

    it('should handle base class as array', () => {
      const variants = cva([ 'btn', 'rounded' ], {
        variants: { size: { sm: 'px-2' } },
      });
      expect(variants({ size: 'sm' })).toBe('btn rounded px-2');
    });

    it('should handle base class as object', () => {
      const variants = cva({ btn: true, disabled: false }, {
        variants: { size: { sm: 'px-2' } },
      });
      expect(variants({ size: 'sm' })).toBe('btn px-2');
    });

    it('should handle null/undefined variant values gracefully', () => {
      const variants = cva('btn', {
        variants: {
          variant: {
            primary: 'bg-blue-500',
            secondary: null as any,
          },
        },
      });

      expect(variants({ variant: 'primary' })).toBe('btn bg-blue-500');
      expect(variants({ variant: 'secondary' })).toBe('btn');
    });

    it('should handle empty variant definitions', () => {
      const variants = cva('btn', {
        variants: {
          size: {},
        },
      });
      expect(variants()).toBe('btn');
      expect(variants({ size: 'nonexistent' as any })).toBe('btn');
    });
  });

  describe('real-world usage patterns', () => {
    const cardVariants = cva(
      'rounded-lg border border-gray-200 shadow-sm',
      {
        variants: {
          variant: {
            default: 'bg-white',
            destructive: 'border-red-200 bg-red-50',
            outline: 'bg-transparent',
          },
          size: {
            default: 'p-4',
            sm: 'p-2 text-sm',
            lg: 'p-6 text-lg',
          },
          shadow: {
            none: 'shadow-none',
            sm: 'shadow-sm',
            md: 'shadow-md',
            lg: 'shadow-lg',
          },
        },
        defaultVariants: {
          variant: 'default',
          size: 'default',
          shadow: 'sm',
        },
      },
    );

    it('should work with realistic component patterns', () => {
      expect(cardVariants())
        .toBe('rounded-lg border border-gray-200 shadow-sm bg-white p-4 shadow-sm');

      expect(cardVariants({
        variant: 'destructive',
        size: 'lg',
        shadow: 'lg',
        className: 'my-4',
      }))
        .toBe('rounded-lg border border-gray-200 shadow-sm border-red-200 bg-red-50 p-6 text-lg shadow-lg my-4');
    });

    it('should handle partial overrides', () => {
      expect(cardVariants({ variant: 'outline' }))
        .toBe('rounded-lg border border-gray-200 shadow-sm bg-transparent p-4 shadow-sm');

      expect(cardVariants({ size: 'sm', shadow: 'none' }))
        .toBe('rounded-lg border border-gray-200 shadow-sm bg-white p-2 text-sm shadow-none');
    });
  });
});
