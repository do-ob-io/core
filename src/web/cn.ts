/**
 * Class Name utility that combines clsx and twMerge for intelligent class merging.
 *
 * This utility combines the conditional class joining capabilities of clsx with
 * the Tailwind-aware conflict resolution of twMerge, making it perfect for
 * component libraries and design systems using Tailwind CSS.
 *
 * @example
 * ```typescript
 * // Basic usage
 * cn('px-4 py-2', 'px-6'); // 'py-2 px-6'
 *
 * // Conditional classes
 * cn('base-class', isActive && 'active-class'); // 'base-class active-class' or 'base-class'
 *
 * // Object syntax
 * cn('btn', { 'btn-primary': isPrimary, 'btn-disabled': isDisabled });
 *
 * // Array syntax
 * cn(['p-4', 'm-2'], 'p-2'); // 'm-2 p-2'
 *
 * // Complex component pattern
 * cn(
 *   'inline-flex items-center justify-center rounded-md',
 *   variants[variant],
 *   sizes[size],
 *   className
 * );
 * ```
 */

import { type ClassValue, clsx } from './clsx.js';
import { twMerge } from './tw-merge.js';

/**
 * Combines class names with conditional support and Tailwind conflict resolution.
 *
 * This function first processes inputs through clsx to handle conditional values,
 * arrays, and objects, then passes the result through twMerge to intelligently
 * resolve Tailwind CSS class conflicts.
 *
 * @param inputs - Class values to merge (strings, arrays, objects, or conditionals)
 * @returns A merged class string with Tailwind conflicts resolved
 *
 * @example
 * ```typescript
 * // Basic merging with conflict resolution
 * cn('px-4 py-2', 'px-6'); // 'py-2 px-6'
 *
 * // Conditional classes
 * cn('btn', isLoading && 'opacity-50', !isLoading && 'hover:bg-blue-600');
 *
 * // Object syntax for toggling classes
 * cn('input', {
 *   'border-red-500': hasError,
 *   'border-gray-300': !hasError,
 *   'bg-gray-100': isDisabled
 * });
 *
 * // Combining base styles with overrides
 * const buttonBase = 'px-4 py-2 rounded bg-blue-500 text-white';
 * cn(buttonBase, className); // User's className wins for conflicts
 *
 * // Arrays for grouping related classes
 * cn(['flex', 'items-center'], ['gap-2', 'gap-4']); // 'flex items-center gap-4'
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
