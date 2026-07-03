/**
 * Class Variance Authority implementation for creating type-safe variant class name generators.
 *
 * This module provides utilities for creating reusable component variants with type safety,
 * inspired by the class-variance-authority library.
 *
 * @example
 * ```typescript
 * const buttonVariants = cva('base-button-classes', {
 *   variants: {
 *     variant: {
 *       primary: 'bg-blue-500 text-white',
 *       secondary: 'bg-gray-200 text-gray-900'
 *     },
 *     size: {
 *       sm: 'px-2 py-1 text-sm',
 *       lg: 'px-4 py-2 text-lg'
 *     }
 *   },
 *   defaultVariants: {
 *     variant: 'primary',
 *     size: 'sm'
 *   }
 * });
 *
 * buttonVariants({ variant: 'secondary', size: 'lg' });
 * // Returns: 'base-button-classes bg-gray-200 text-gray-900 px-4 py-2 text-lg'
 * ```
 */

import { type ClassValue, clsx } from './clsx.js';

/**
 * Configuration object for defining component variants.
 */
export interface VariantsConfig<T = Record<string, Record<string, ClassValue>>> {
  variants?: T;
  defaultVariants?: {
    [K in keyof T]?: keyof T[K];
  };
}

/**
 * Extracts variant prop types from a CVA function.
 *
 * @example
 * ```typescript
 * const buttonVariants = cva('btn', { variants: { size: { sm: '', lg: '' } } });
 * type ButtonProps = VariantProps<typeof buttonVariants>; // { size?: 'sm' | 'lg' }
 * ```
 */
export type VariantProps<TFunction extends (...args: any) => any> =
  TFunction extends CVAFunction<infer TVariants>
    ? {
        [K in keyof TVariants]?: keyof TVariants[K];
      } & { className?: ClassValue }
    : { className?: ClassValue };

/**
 * Type for a CVA function with specific variant configuration.
 */
export type CVAFunction<TVariants extends Record<string, Record<string, ClassValue>>> = (
  props?: {
    [K in keyof TVariants]?: keyof TVariants[K];
  } & { className?: ClassValue },
) => string;

/**
 * Creates a class variance authority function for generating component class names
 * based on variants.
 *
 * This function accepts a base class string and a configuration object defining
 * variants and their corresponding class names. It returns a function that can
 * be called with variant props to generate the appropriate class name string.
 *
 * @param base - The base class names applied to all variants
 * @param config - Configuration object containing variants and default values
 * @returns A function that accepts variant props and returns a combined class string
 *
 * @example
 * ```typescript
 * const alertVariants = cva('alert rounded p-4', {
 *   variants: {
 *     variant: {
 *       info: 'bg-blue-100 text-blue-800',
 *       success: 'bg-green-100 text-green-800',
 *       warning: 'bg-yellow-100 text-yellow-800',
 *       error: 'bg-red-100 text-red-800'
 *     },
 *     size: {
 *       sm: 'text-sm px-3 py-2',
 *       md: 'text-base px-4 py-3',
 *       lg: 'text-lg px-6 py-4'
 *     }
 *   },
 *   defaultVariants: {
 *     variant: 'info',
 *     size: 'md'
 *   }
 * });
 *
 * // Usage examples:
 * alertVariants() // Uses defaults: 'alert rounded p-4 bg-blue-100 text-blue-800 text-base px-4 py-3'
 * alertVariants({ variant: 'success' }) // 'alert rounded p-4 bg-green-100 text-green-800 text-base px-4 py-3'
 * alertVariants({ variant: 'error', size: 'lg', className: 'custom-class' })
 * // 'alert rounded p-4 bg-red-100 text-red-800 text-lg px-6 py-4 custom-class'
 * ```
 */
export function cva<TVariants extends Record<string, Record<string, ClassValue>>>(
  base: ClassValue,
  config?: VariantsConfig<TVariants>,
): CVAFunction<TVariants> {
  return ((
    props?: {
      [K in keyof TVariants]?: keyof TVariants[K];
    } & { className?: ClassValue },
  ) => {
    if (!config) {
      return clsx(base, props?.className);
    }

    const { variants, defaultVariants } = config;

    if (!variants) {
      return clsx(base, props?.className);
    }

    // Collect variant classes
    const variantClasses: ClassValue[] = [base];

    // Apply variant classes based on props and defaults
    for (const [variantName, variantOptions] of Object.entries(variants)) {
      const variantValue =
        props?.[variantName as keyof typeof props] ??
        defaultVariants?.[variantName as keyof typeof defaultVariants];

      if (variantValue && variantOptions[variantValue as string]) {
        variantClasses.push(variantOptions[variantValue as string]);
      }
    }

    // Add custom className if provided
    if (props?.className) {
      variantClasses.push(props.className);
    }

    return clsx(variantClasses);
  }) as CVAFunction<TVariants>;
}
