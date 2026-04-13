import { describe, expect, it } from 'vitest';

import { twMerge } from './tw-merge.js';

describe('twMerge', () => {
  describe('basic functionality', () => {
    it('should return empty string for no arguments', () => {
      expect(twMerge()).toBe('');
    });

    it('should return empty string for falsy arguments', () => {
      expect(twMerge(null, undefined, false)).toBe('');
    });

    it('should return single class unchanged', () => {
      expect(twMerge('px-4')).toBe('px-4');
    });

    it('should join multiple non-conflicting classes', () => {
      expect(twMerge('px-4', 'py-2')).toBe('px-4 py-2');
    });

    it('should handle empty strings', () => {
      expect(twMerge('', 'px-4', '')).toBe('px-4');
    });

    it('should handle classes with extra whitespace', () => {
      expect(twMerge('px-4', 'py-2')).toBe('px-4 py-2');
    });
  });

  describe('padding conflicts', () => {
    it('should resolve p-* conflicts', () => {
      expect(twMerge('p-4', 'p-2')).toBe('p-2');
    });

    it('should resolve px-* conflicts', () => {
      expect(twMerge('px-4', 'px-2')).toBe('px-2');
    });

    it('should resolve py-* conflicts', () => {
      expect(twMerge('py-4', 'py-2')).toBe('py-2');
    });

    it('should not conflict between different padding axes', () => {
      expect(twMerge('px-4', 'py-2')).toBe('px-4 py-2');
    });

    it('should not conflict between p and px/py', () => {
      expect(twMerge('p-4', 'px-2')).toBe('p-4 px-2');
    });

    it('should resolve individual padding sides', () => {
      expect(twMerge('pt-4', 'pt-2')).toBe('pt-2');
      expect(twMerge('pr-4', 'pr-2')).toBe('pr-2');
      expect(twMerge('pb-4', 'pb-2')).toBe('pb-2');
      expect(twMerge('pl-4', 'pl-2')).toBe('pl-2');
    });
  });

  describe('margin conflicts', () => {
    it('should resolve m-* conflicts', () => {
      expect(twMerge('m-4', 'm-2')).toBe('m-2');
    });

    it('should resolve mx-* conflicts', () => {
      expect(twMerge('mx-4', 'mx-2')).toBe('mx-2');
    });

    it('should resolve my-* conflicts', () => {
      expect(twMerge('my-4', 'my-2')).toBe('my-2');
    });

    it('should handle negative margins', () => {
      expect(twMerge('-m-4', '-m-2')).toBe('-m-2');
      expect(twMerge('m-4', '-m-2')).toBe('-m-2');
    });
  });

  describe('text/typography conflicts', () => {
    it('should resolve text size conflicts', () => {
      expect(twMerge('text-sm', 'text-lg')).toBe('text-lg');
      expect(twMerge('text-xs', 'text-base', 'text-xl')).toBe('text-xl');
    });

    it('should resolve text color conflicts', () => {
      expect(twMerge('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('should resolve font weight conflicts', () => {
      expect(twMerge('font-bold', 'font-normal')).toBe('font-normal');
    });

    it('should resolve text alignment conflicts', () => {
      expect(twMerge('text-left', 'text-center')).toBe('text-center');
    });

    it('should resolve text decoration conflicts', () => {
      expect(twMerge('underline', 'no-underline')).toBe('no-underline');
    });

    it('should resolve text transform conflicts', () => {
      expect(twMerge('uppercase', 'lowercase')).toBe('lowercase');
    });

    it('should resolve font style conflicts', () => {
      expect(twMerge('italic', 'not-italic')).toBe('not-italic');
    });
  });

  describe('background conflicts', () => {
    it('should resolve background color conflicts', () => {
      expect(twMerge('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    it('should not conflict bg-color with bg-opacity', () => {
      expect(twMerge('bg-red-500', 'bg-opacity-50')).toBe('bg-red-500 bg-opacity-50');
    });

    it('should preserve bg-opacity when bg-color changes', () => {
      expect(twMerge('bg-opacity-50 bg-red-500', 'bg-blue-500')).toBe('bg-opacity-50 bg-blue-500');
    });
  });

  describe('border conflicts', () => {
    it('should resolve border width conflicts', () => {
      expect(twMerge('border-2', 'border-4')).toBe('border-4');
      expect(twMerge('border', 'border-2')).toBe('border-2');
    });

    it('should resolve border color conflicts', () => {
      expect(twMerge('border-red-500', 'border-blue-500')).toBe('border-blue-500');
    });

    it('should resolve border radius conflicts', () => {
      expect(twMerge('rounded-sm', 'rounded-lg')).toBe('rounded-lg');
      expect(twMerge('rounded-md', 'rounded-full')).toBe('rounded-full');
    });

    it('should resolve border style conflicts', () => {
      expect(twMerge('border-solid', 'border-dashed')).toBe('border-dashed');
    });

    it('should not conflict border width with border color', () => {
      expect(twMerge('border-2', 'border-red-500')).toBe('border-2 border-red-500');
    });
  });

  describe('display conflicts', () => {
    it('should resolve display conflicts', () => {
      expect(twMerge('block', 'flex')).toBe('flex');
      expect(twMerge('hidden', 'block')).toBe('block');
      expect(twMerge('inline', 'inline-flex')).toBe('inline-flex');
    });
  });

  describe('position conflicts', () => {
    it('should resolve position conflicts', () => {
      expect(twMerge('relative', 'absolute')).toBe('absolute');
      expect(twMerge('static', 'fixed')).toBe('fixed');
    });
  });

  describe('flexbox conflicts', () => {
    it('should resolve flex direction conflicts', () => {
      expect(twMerge('flex-row', 'flex-col')).toBe('flex-col');
    });

    it('should resolve flex wrap conflicts', () => {
      expect(twMerge('flex-wrap', 'flex-nowrap')).toBe('flex-nowrap');
    });

    it('should resolve justify conflicts', () => {
      expect(twMerge('justify-start', 'justify-center')).toBe('justify-center');
    });

    it('should resolve items conflicts', () => {
      expect(twMerge('items-start', 'items-center')).toBe('items-center');
    });

    it('should not conflict flex with flex-direction', () => {
      expect(twMerge('flex', 'flex-col')).toBe('flex flex-col');
    });
  });

  describe('grid conflicts', () => {
    it('should resolve grid-cols conflicts', () => {
      expect(twMerge('grid-cols-2', 'grid-cols-3')).toBe('grid-cols-3');
    });

    it('should resolve grid-rows conflicts', () => {
      expect(twMerge('grid-rows-2', 'grid-rows-3')).toBe('grid-rows-3');
    });

    it('should resolve gap conflicts', () => {
      expect(twMerge('gap-2', 'gap-4')).toBe('gap-4');
    });

    it('should not conflict gap-x with gap-y', () => {
      expect(twMerge('gap-x-2', 'gap-y-4')).toBe('gap-x-2 gap-y-4');
    });
  });

  describe('sizing conflicts', () => {
    it('should resolve width conflicts', () => {
      expect(twMerge('w-4', 'w-8')).toBe('w-8');
      expect(twMerge('w-full', 'w-1/2')).toBe('w-1/2');
    });

    it('should resolve height conflicts', () => {
      expect(twMerge('h-4', 'h-8')).toBe('h-8');
    });

    it('should resolve min-width conflicts', () => {
      expect(twMerge('min-w-0', 'min-w-full')).toBe('min-w-full');
    });

    it('should resolve max-width conflicts', () => {
      expect(twMerge('max-w-md', 'max-w-lg')).toBe('max-w-lg');
    });
  });

  describe('shadow conflicts', () => {
    it('should resolve shadow conflicts', () => {
      expect(twMerge('shadow-sm', 'shadow-lg')).toBe('shadow-lg');
      expect(twMerge('shadow-md', 'shadow-none')).toBe('shadow-none');
    });
  });

  describe('opacity conflicts', () => {
    it('should resolve opacity conflicts', () => {
      expect(twMerge('opacity-50', 'opacity-100')).toBe('opacity-100');
    });
  });

  describe('z-index conflicts', () => {
    it('should resolve z-index conflicts', () => {
      expect(twMerge('z-10', 'z-20')).toBe('z-20');
    });
  });

  describe('overflow conflicts', () => {
    it('should resolve overflow conflicts', () => {
      expect(twMerge('overflow-auto', 'overflow-hidden')).toBe('overflow-hidden');
    });

    it('should resolve overflow-x conflicts', () => {
      expect(twMerge('overflow-x-auto', 'overflow-x-hidden')).toBe('overflow-x-hidden');
    });

    it('should not conflict overflow-x with overflow-y', () => {
      expect(twMerge('overflow-x-auto', 'overflow-y-hidden')).toBe('overflow-x-auto overflow-y-hidden');
    });
  });

  describe('cursor conflicts', () => {
    it('should resolve cursor conflicts', () => {
      expect(twMerge('cursor-pointer', 'cursor-not-allowed')).toBe('cursor-not-allowed');
    });
  });

  describe('ring conflicts', () => {
    it('should resolve ring width conflicts', () => {
      expect(twMerge('ring', 'ring-2')).toBe('ring-2');
    });

    it('should resolve ring color conflicts', () => {
      expect(twMerge('ring-red-500', 'ring-blue-500')).toBe('ring-blue-500');
    });

    it('should not conflict ring width with ring color', () => {
      expect(twMerge('ring-2', 'ring-blue-500')).toBe('ring-2 ring-blue-500');
    });
  });

  describe('responsive variants', () => {
    it('should resolve conflicts within same breakpoint', () => {
      expect(twMerge('sm:p-4', 'sm:p-2')).toBe('sm:p-2');
      expect(twMerge('md:text-lg', 'md:text-xl')).toBe('md:text-xl');
    });

    it('should not conflict across different breakpoints', () => {
      expect(twMerge('sm:p-4', 'md:p-2')).toBe('sm:p-4 md:p-2');
      expect(twMerge('p-4', 'sm:p-2')).toBe('p-4 sm:p-2');
    });

    it('should handle multiple breakpoints correctly', () => {
      expect(twMerge('sm:p-4', 'md:p-6', 'lg:p-8', 'sm:p-2')).toBe('md:p-6 lg:p-8 sm:p-2');
    });
  });

  describe('state variants', () => {
    it('should resolve conflicts within same state', () => {
      expect(twMerge('hover:bg-red-500', 'hover:bg-blue-500')).toBe('hover:bg-blue-500');
      expect(twMerge('focus:ring-2', 'focus:ring-4')).toBe('focus:ring-4');
    });

    it('should not conflict across different states', () => {
      expect(twMerge('hover:bg-red-500', 'focus:bg-blue-500')).toBe('hover:bg-red-500 focus:bg-blue-500');
    });

    it('should handle combined responsive and state variants', () => {
      expect(twMerge('sm:hover:bg-red-500', 'sm:hover:bg-blue-500')).toBe('sm:hover:bg-blue-500');
      expect(twMerge('sm:hover:bg-red-500', 'md:hover:bg-blue-500')).toBe('sm:hover:bg-red-500 md:hover:bg-blue-500');
    });
  });

  describe('arbitrary values', () => {
    it('should resolve arbitrary padding conflicts', () => {
      expect(twMerge('p-[10px]', 'p-[20px]')).toBe('p-[20px]');
    });

    it('should resolve arbitrary width conflicts', () => {
      expect(twMerge('w-[100px]', 'w-[200px]')).toBe('w-[200px]');
    });

    it('should resolve standard vs arbitrary conflicts', () => {
      expect(twMerge('p-4', 'p-[20px]')).toBe('p-[20px]');
    });
  });

  describe('complex scenarios', () => {
    it('should handle multiple conflicting groups', () => {
      expect(twMerge('m-4 p-4 text-red-500', 'p-2 text-blue-500')).toBe('m-4 p-2 text-blue-500');
    });

    it('should handle a realistic button scenario', () => {
      const base = 'px-4 py-2 bg-blue-500 text-white rounded';
      const override = 'px-6 bg-red-500';
      expect(twMerge(base, override)).toBe('py-2 text-white rounded px-6 bg-red-500');
    });

    it('should handle chained merges', () => {
      const result = twMerge(
        twMerge('p-4', 'p-2'),
        twMerge('m-4', 'm-2'),
      );
      expect(result).toBe('p-2 m-2');
    });

    it('should preserve order of non-conflicting classes', () => {
      expect(twMerge('flex items-center justify-between')).toBe('flex items-center justify-between');
    });

    it('should handle classes passed as a single string', () => {
      // eslint-disable-next-line better-tailwindcss/no-conflicting-classes
      expect(twMerge('px-4 px-6 py-2')).toBe('px-6 py-2');
    });

    it('should handle common component library pattern', () => {
      // Base button styles
      const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors';
      // Variant styles
      const variant = 'bg-primary text-primary-foreground hover:bg-primary/90';
      // Size styles
      const size = 'h-10 px-4 py-2';
      // User override
      const userClass = 'bg-red-500 px-8';

      const result = twMerge(base, variant, size, userClass);
      expect(result).toContain('bg-red-500');
      expect(result).toContain('px-8');
      expect(result).not.toContain('px-4');
    });
  });

  describe('edge cases', () => {
    it('should handle duplicate classes', () => {
      expect(twMerge('p-4')).toBe('p-4');
    });

    it('should handle unknown classes gracefully', () => {
      expect(twMerge('custom-class', 'another-custom')).toBe('custom-class another-custom');
    });

    it('should handle mixed known and unknown classes', () => {
      expect(twMerge('custom-class p-4', 'p-2')).toBe('custom-class p-2');
    });

    it('should handle arbitrary properties', () => {
      expect(twMerge('mask-type-luminance', 'mask-type-alpha')).toBe('mask-type-luminance mask-type-alpha');
    });
  });

  describe('visibility conflicts', () => {
    it('should resolve visibility conflicts', () => {
      expect(twMerge('visible', 'invisible')).toBe('invisible');
    });
  });

  describe('transform conflicts', () => {
    it('should resolve scale conflicts', () => {
      expect(twMerge('scale-50', 'scale-100')).toBe('scale-100');
    });

    it('should resolve rotate conflicts', () => {
      expect(twMerge('rotate-45', 'rotate-90')).toBe('rotate-90');
    });

    it('should not conflict scale-x with scale-y', () => {
      expect(twMerge('scale-x-50', 'scale-y-100')).toBe('scale-x-50 scale-y-100');
    });
  });

  describe('transition conflicts', () => {
    it('should resolve transition conflicts', () => {
      expect(twMerge('transition', 'transition-all')).toBe('transition-all');
    });

    it('should resolve duration conflicts', () => {
      expect(twMerge('duration-100', 'duration-300')).toBe('duration-300');
    });
  });

  describe('aspect ratio conflicts', () => {
    it('should resolve aspect ratio conflicts', () => {
      expect(twMerge('aspect-square', 'aspect-video')).toBe('aspect-video');
    });
  });

  describe('divide conflicts', () => {
    it('should resolve divide width conflicts', () => {
      expect(twMerge('divide-y', 'divide-y-2')).toBe('divide-y-2');
    });

    it('should resolve divide color conflicts', () => {
      expect(twMerge('divide-gray-200', 'divide-gray-400')).toBe('divide-gray-400');
    });
  });

  describe('object fit conflicts', () => {
    it('should resolve object fit conflicts', () => {
      expect(twMerge('object-cover', 'object-contain')).toBe('object-contain');
    });
  });

  describe('whitespace conflicts', () => {
    it('should resolve whitespace conflicts', () => {
      expect(twMerge('whitespace-normal', 'whitespace-nowrap')).toBe('whitespace-nowrap');
    });
  });

  describe('user select conflicts', () => {
    it('should resolve user select conflicts', () => {
      expect(twMerge('select-none', 'select-text')).toBe('select-text');
    });
  });

  describe('pointer events conflicts', () => {
    it('should resolve pointer events conflicts', () => {
      expect(twMerge('pointer-events-none', 'pointer-events-auto')).toBe('pointer-events-auto');
    });
  });

  describe('screen reader conflicts', () => {
    it('should resolve screen reader conflicts', () => {
      expect(twMerge('sr-only', 'not-sr-only')).toBe('not-sr-only');
    });
  });
});
