/**
 * Tailwind Merge - A highly optimized utility for merging Tailwind CSS classes.
 *
 * This module intelligently merges Tailwind CSS classes by understanding class conflicts
 * and resolving them in favor of the last specified class. This is essential for component
 * libraries where users need to override default styles.
 *
 * @example
 * ```typescript
 * twMerge('px-2 py-1', 'px-4'); // 'py-1 px-4'
 * twMerge('text-red-500', 'text-blue-500'); // 'text-blue-500'
 * twMerge('bg-red-500 bg-opacity-50', 'bg-blue-500'); // 'bg-opacity-50 bg-blue-500'
 * ```
 */

/**
 * Map of Tailwind class prefixes to their conflict groups.
 * Classes in the same group conflict with each other.
 */
const CONFLICT_GROUPS: Record<string, string> = {
  // Spacing - Padding
  p: 'padding',
  px: 'padding-x',
  py: 'padding-y',
  pt: 'padding-top',
  pr: 'padding-right',
  pb: 'padding-bottom',
  pl: 'padding-left',
  ps: 'padding-start',
  pe: 'padding-end',

  // Spacing - Margin
  m: 'margin',
  mx: 'margin-x',
  my: 'margin-y',
  mt: 'margin-top',
  mr: 'margin-right',
  mb: 'margin-bottom',
  ml: 'margin-left',
  ms: 'margin-start',
  me: 'margin-end',

  // Spacing - Space between
  'space-x': 'space-x',
  'space-y': 'space-y',

  // Spacing - Gap
  gap: 'gap',
  'gap-x': 'gap-x',
  'gap-y': 'gap-y',

  // Sizing
  w: 'width',
  'min-w': 'min-width',
  'max-w': 'max-width',
  h: 'height',
  'min-h': 'min-height',
  'max-h': 'max-height',
  size: 'size',

  // Typography
  text: 'text-size',
  'font-size': 'text-size',
  font: 'font-family',
  'font-weight': 'font-weight',
  'font-style': 'font-style',
  tracking: 'letter-spacing',
  leading: 'line-height',
  'text-align': 'text-align',
  'text-decoration': 'text-decoration',
  'text-transform': 'text-transform',
  'text-overflow': 'text-overflow',
  whitespace: 'whitespace',
  break: 'word-break',

  // Colors
  'text-color': 'text-color',
  'bg-color': 'bg-color',
  'border-color': 'border-color',
  'ring-color': 'ring-color',
  'outline-color': 'outline-color',
  'shadow-color': 'shadow-color',
  'accent-color': 'accent-color',
  'caret-color': 'caret-color',
  'fill-color': 'fill-color',
  'stroke-color': 'stroke-color',
  'placeholder-color': 'placeholder-color',
  'divide-color': 'divide-color',

  // Background
  bg: 'background',
  'bg-opacity': 'bg-opacity',
  'bg-gradient': 'bg-gradient',
  'bg-position': 'bg-position',
  'bg-size': 'bg-size',
  'bg-repeat': 'bg-repeat',
  'bg-attachment': 'bg-attachment',
  'bg-clip': 'bg-clip',
  'bg-origin': 'bg-origin',

  // Borders
  border: 'border-width',
  'border-t': 'border-top-width',
  'border-r': 'border-right-width',
  'border-b': 'border-bottom-width',
  'border-l': 'border-left-width',
  'border-x': 'border-x-width',
  'border-y': 'border-y-width',
  'border-s': 'border-start-width',
  'border-e': 'border-end-width',
  'border-style': 'border-style',
  'border-collapse': 'border-collapse',
  rounded: 'border-radius',
  'rounded-t': 'border-radius-top',
  'rounded-r': 'border-radius-right',
  'rounded-b': 'border-radius-bottom',
  'rounded-l': 'border-radius-left',
  'rounded-tl': 'border-radius-tl',
  'rounded-tr': 'border-radius-tr',
  'rounded-bl': 'border-radius-bl',
  'rounded-br': 'border-radius-br',
  'rounded-s': 'border-radius-start',
  'rounded-e': 'border-radius-end',
  'rounded-ss': 'border-radius-ss',
  'rounded-se': 'border-radius-se',
  'rounded-es': 'border-radius-es',
  'rounded-ee': 'border-radius-ee',

  // Effects
  shadow: 'shadow',
  opacity: 'opacity',
  'mix-blend': 'mix-blend',
  'bg-blend': 'bg-blend',
  blur: 'blur',
  brightness: 'brightness',
  contrast: 'contrast',
  'drop-shadow': 'drop-shadow',
  grayscale: 'grayscale',
  'hue-rotate': 'hue-rotate',
  invert: 'invert',
  saturate: 'saturate',
  sepia: 'sepia',
  'backdrop-blur': 'backdrop-blur',
  'backdrop-brightness': 'backdrop-brightness',
  'backdrop-contrast': 'backdrop-contrast',
  'backdrop-grayscale': 'backdrop-grayscale',
  'backdrop-hue-rotate': 'backdrop-hue-rotate',
  'backdrop-invert': 'backdrop-invert',
  'backdrop-opacity': 'backdrop-opacity',
  'backdrop-saturate': 'backdrop-saturate',
  'backdrop-sepia': 'backdrop-sepia',

  // Layout
  display: 'display',
  position: 'position',
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
  inset: 'inset',
  'inset-x': 'inset-x',
  'inset-y': 'inset-y',
  start: 'start',
  end: 'end',
  z: 'z-index',
  visible: 'visibility',
  invisible: 'visibility',
  float: 'float',
  clear: 'clear',
  // Note: object-fit uses standalone classes only (object-contain, object-cover, etc.)
  // object: is not a prefix that takes arbitrary values in Tailwind
  'object-position': 'object-position',
  overflow: 'overflow',
  'overflow-x': 'overflow-x',
  'overflow-y': 'overflow-y',
  overscroll: 'overscroll',
  'overscroll-x': 'overscroll-x',
  'overscroll-y': 'overscroll-y',
  isolation: 'isolation',

  // Flexbox
  flex: 'flex',
  'flex-direction': 'flex-direction',
  'flex-wrap': 'flex-wrap',
  'flex-grow': 'flex-grow',
  'flex-shrink': 'flex-shrink',
  basis: 'flex-basis',
  order: 'order',
  justify: 'justify-content',
  'justify-items': 'justify-items',
  'justify-self': 'justify-self',
  items: 'align-items',
  content: 'align-content',
  self: 'align-self',
  'place-content': 'place-content',
  'place-items': 'place-items',
  'place-self': 'place-self',

  // Grid
  grid: 'grid',
  'grid-cols': 'grid-cols',
  'grid-rows': 'grid-rows',
  'grid-flow': 'grid-flow',
  'auto-cols': 'auto-cols',
  'auto-rows': 'auto-rows',
  col: 'grid-column',
  'col-span': 'grid-column-span',
  'col-start': 'grid-column-start',
  'col-end': 'grid-column-end',
  row: 'grid-row',
  'row-span': 'grid-row-span',
  'row-start': 'grid-row-start',
  'row-end': 'grid-row-end',

  // Ring
  ring: 'ring-width',
  'ring-offset': 'ring-offset-width',
  'ring-inset': 'ring-inset',
  'ring-offset-color': 'ring-offset-color',

  // Outline
  outline: 'outline',
  'outline-offset': 'outline-offset',

  // Transform
  scale: 'scale',
  'scale-x': 'scale-x',
  'scale-y': 'scale-y',
  rotate: 'rotate',
  translate: 'translate',
  'translate-x': 'translate-x',
  'translate-y': 'translate-y',
  skew: 'skew',
  'skew-x': 'skew-x',
  'skew-y': 'skew-y',
  origin: 'transform-origin',

  // Transition & Animation
  transition: 'transition',
  duration: 'duration',
  ease: 'timing-function',
  delay: 'delay',
  animate: 'animation',

  // Interactivity
  cursor: 'cursor',
  touch: 'touch-action',
  select: 'user-select',
  resize: 'resize',
  'scroll-behavior': 'scroll-behavior',
  'scroll-m': 'scroll-margin',
  'scroll-mx': 'scroll-margin-x',
  'scroll-my': 'scroll-margin-y',
  'scroll-mt': 'scroll-margin-top',
  'scroll-mr': 'scroll-margin-right',
  'scroll-mb': 'scroll-margin-bottom',
  'scroll-ml': 'scroll-margin-left',
  'scroll-ms': 'scroll-margin-start',
  'scroll-me': 'scroll-margin-end',
  'scroll-p': 'scroll-padding',
  'scroll-px': 'scroll-padding-x',
  'scroll-py': 'scroll-padding-y',
  'scroll-pt': 'scroll-padding-top',
  'scroll-pr': 'scroll-padding-right',
  'scroll-pb': 'scroll-padding-bottom',
  'scroll-pl': 'scroll-padding-left',
  'scroll-ps': 'scroll-padding-start',
  'scroll-pe': 'scroll-padding-end',
  'snap-align': 'scroll-snap-align',
  'snap-stop': 'scroll-snap-stop',
  'snap-type': 'scroll-snap-type',
  'snap-strictness': 'scroll-snap-strictness',
  pointer: 'pointer-events',
  appearance: 'appearance',
  accent: 'accent-color',
  caret: 'caret-color',
  'will-change': 'will-change',

  // Tables
  'table-layout': 'table-layout',
  'border-spacing': 'border-spacing',
  'border-spacing-x': 'border-spacing-x',
  'border-spacing-y': 'border-spacing-y',
  caption: 'caption-side',

  // SVG
  fill: 'fill',
  stroke: 'stroke',
  'stroke-w': 'stroke-width',

  // Divide
  divide: 'divide-width',
  'divide-x': 'divide-x-width',
  'divide-y': 'divide-y-width',
  'divide-style': 'divide-style',

  // Container
  container: 'container',

  // Columns
  columns: 'columns',

  // Break
  'break-before': 'break-before',
  'break-after': 'break-after',
  'break-inside': 'break-inside',

  // Box
  box: 'box-sizing',
  'box-decoration': 'box-decoration-break',

  // Aspect Ratio
  aspect: 'aspect-ratio',

  // Line Clamp
  'line-clamp': 'line-clamp',

  // Hyphens
  hyphens: 'hyphens',

  // List
  list: 'list-style-type',
  'list-image': 'list-style-image',
  'list-position': 'list-style-position',

  // SR only
  sr: 'screen-reader',
  'not-sr': 'screen-reader',
};

/**
 * Standalone classes that map to specific conflict groups.
 */
const STANDALONE_CLASSES: Record<string, string> = {
  // Display
  block: 'display',
  'inline-block': 'display',
  inline: 'display',
  hidden: 'display',
  flex: 'display',
  'inline-flex': 'display',
  grid: 'display',
  'inline-grid': 'display',
  contents: 'display',
  'flow-root': 'display',
  table: 'display',
  'inline-table': 'display',
  'table-caption': 'display',
  'table-cell': 'display',
  'table-column': 'display',
  'table-column-group': 'display',
  'table-footer-group': 'display',
  'table-header-group': 'display',
  'table-row-group': 'display',
  'table-row': 'display',
  'list-item': 'display',

  // Position
  static: 'position',
  fixed: 'position',
  absolute: 'position',
  relative: 'position',
  sticky: 'position',

  // Visibility
  visible: 'visibility',
  invisible: 'visibility',
  collapse: 'visibility',

  // Flex direction
  'flex-row': 'flex-direction',
  'flex-row-reverse': 'flex-direction',
  'flex-col': 'flex-direction',
  'flex-col-reverse': 'flex-direction',

  // Flex wrap
  'flex-wrap': 'flex-wrap',
  'flex-wrap-reverse': 'flex-wrap',
  'flex-nowrap': 'flex-wrap',

  // Flex grow/shrink
  'flex-1': 'flex',
  'flex-auto': 'flex',
  'flex-initial': 'flex',
  'flex-none': 'flex',
  grow: 'flex-grow',
  'grow-0': 'flex-grow',
  shrink: 'flex-shrink',
  'shrink-0': 'flex-shrink',

  // Text align
  'text-left': 'text-align',
  'text-center': 'text-align',
  'text-right': 'text-align',
  'text-justify': 'text-align',
  'text-start': 'text-align',
  'text-end': 'text-align',

  // Text decoration
  underline: 'text-decoration',
  overline: 'text-decoration',
  'line-through': 'text-decoration',
  'no-underline': 'text-decoration',

  // Text transform
  uppercase: 'text-transform',
  lowercase: 'text-transform',
  capitalize: 'text-transform',
  'normal-case': 'text-transform',

  // Font style
  italic: 'font-style',
  'not-italic': 'font-style',

  // Font weight
  'font-thin': 'font-weight',
  'font-extralight': 'font-weight',
  'font-light': 'font-weight',
  'font-normal': 'font-weight',
  'font-medium': 'font-weight',
  'font-semibold': 'font-weight',
  'font-bold': 'font-weight',
  'font-extrabold': 'font-weight',
  'font-black': 'font-weight',

  // Antialiased
  antialiased: 'font-smoothing',
  'subpixel-antialiased': 'font-smoothing',

  // Overflow
  'overflow-auto': 'overflow',
  'overflow-hidden': 'overflow',
  'overflow-clip': 'overflow',
  'overflow-visible': 'overflow',
  'overflow-scroll': 'overflow',
  'overflow-x-auto': 'overflow-x',
  'overflow-x-hidden': 'overflow-x',
  'overflow-x-clip': 'overflow-x',
  'overflow-x-visible': 'overflow-x',
  'overflow-x-scroll': 'overflow-x',
  'overflow-y-auto': 'overflow-y',
  'overflow-y-hidden': 'overflow-y',
  'overflow-y-clip': 'overflow-y',
  'overflow-y-visible': 'overflow-y',
  'overflow-y-scroll': 'overflow-y',

  // Object fit
  'object-contain': 'object-fit',
  'object-cover': 'object-fit',
  'object-fill': 'object-fit',
  'object-none': 'object-fit',
  'object-scale-down': 'object-fit',

  // Truncate
  truncate: 'text-overflow',

  // Whitespace
  'whitespace-normal': 'whitespace',
  'whitespace-nowrap': 'whitespace',
  'whitespace-pre': 'whitespace',
  'whitespace-pre-line': 'whitespace',
  'whitespace-pre-wrap': 'whitespace',
  'whitespace-break-spaces': 'whitespace',

  // Word break
  'break-normal': 'word-break',
  'break-words': 'word-break',
  'break-all': 'word-break',
  'break-keep': 'word-break',

  // Isolation
  isolate: 'isolation',
  'isolation-auto': 'isolation',

  // Float
  'float-left': 'float',
  'float-right': 'float',
  'float-none': 'float',
  'float-start': 'float',
  'float-end': 'float',

  // Clear
  'clear-left': 'clear',
  'clear-right': 'clear',
  'clear-both': 'clear',
  'clear-none': 'clear',
  'clear-start': 'clear',
  'clear-end': 'clear',

  // Box sizing
  'box-border': 'box-sizing',
  'box-content': 'box-sizing',

  // Table layout
  'table-auto': 'table-layout',
  'table-fixed': 'table-layout',

  // Border collapse
  'border-collapse': 'border-collapse',
  'border-separate': 'border-collapse',

  // Caption side
  'caption-top': 'caption-side',
  'caption-bottom': 'caption-side',

  // Border style
  'border-solid': 'border-style',
  'border-dashed': 'border-style',
  'border-dotted': 'border-style',
  'border-double': 'border-style',
  'border-hidden': 'border-style',
  'border-none': 'border-style',

  // Divide style
  'divide-solid': 'divide-style',
  'divide-dashed': 'divide-style',
  'divide-dotted': 'divide-style',
  'divide-double': 'divide-style',
  'divide-none': 'divide-style',

  // Outline style
  'outline-none': 'outline',
  'outline-solid': 'outline',
  'outline-dashed': 'outline',
  'outline-dotted': 'outline',
  'outline-double': 'outline',

  // Ring inset
  'ring-inset': 'ring-inset',

  // Screen reader
  'sr-only': 'screen-reader',
  'not-sr-only': 'screen-reader',

  // Pointer events
  'pointer-events-none': 'pointer-events',
  'pointer-events-auto': 'pointer-events',

  // Resize
  'resize-none': 'resize',
  'resize-y': 'resize',
  'resize-x': 'resize',
  resize: 'resize',

  // User select
  'select-none': 'user-select',
  'select-text': 'user-select',
  'select-all': 'user-select',
  'select-auto': 'user-select',

  // Touch action
  'touch-auto': 'touch-action',
  'touch-none': 'touch-action',
  'touch-pan-x': 'touch-action',
  'touch-pan-left': 'touch-action',
  'touch-pan-right': 'touch-action',
  'touch-pan-y': 'touch-action',
  'touch-pan-up': 'touch-action',
  'touch-pan-down': 'touch-action',
  'touch-pinch-zoom': 'touch-action',
  'touch-manipulation': 'touch-action',

  // Snap align
  'snap-start': 'scroll-snap-align',
  'snap-end': 'scroll-snap-align',
  'snap-center': 'scroll-snap-align',
  'snap-align-none': 'scroll-snap-align',

  // Snap stop
  'snap-normal': 'scroll-snap-stop',
  'snap-always': 'scroll-snap-stop',

  // Snap type
  'snap-none': 'scroll-snap-type',
  'snap-x': 'scroll-snap-type',
  'snap-y': 'scroll-snap-type',
  'snap-both': 'scroll-snap-type',

  // Snap strictness
  'snap-mandatory': 'scroll-snap-strictness',
  'snap-proximity': 'scroll-snap-strictness',

  // Scroll behavior
  'scroll-auto': 'scroll-behavior',
  'scroll-smooth': 'scroll-behavior',

  // Appearance
  'appearance-none': 'appearance',
  'appearance-auto': 'appearance',

  // Will change
  'will-change-auto': 'will-change',
  'will-change-scroll': 'will-change',
  'will-change-contents': 'will-change',
  'will-change-transform': 'will-change',

  // Hyphens
  'hyphens-none': 'hyphens',
  'hyphens-manual': 'hyphens',
  'hyphens-auto': 'hyphens',

  // Content (align-content)
  'content-normal': 'align-content',
  'content-center': 'align-content',
  'content-start': 'align-content',
  'content-end': 'align-content',
  'content-between': 'align-content',
  'content-around': 'align-content',
  'content-evenly': 'align-content',
  'content-baseline': 'align-content',
  'content-stretch': 'align-content',

  // Items (align-items)
  'items-start': 'align-items',
  'items-end': 'align-items',
  'items-center': 'align-items',
  'items-baseline': 'align-items',
  'items-stretch': 'align-items',

  // Self (align-self)
  'self-auto': 'align-self',
  'self-start': 'align-self',
  'self-end': 'align-self',
  'self-center': 'align-self',
  'self-stretch': 'align-self',
  'self-baseline': 'align-self',

  // Justify (justify-content)
  'justify-normal': 'justify-content',
  'justify-start': 'justify-content',
  'justify-end': 'justify-content',
  'justify-center': 'justify-content',
  'justify-between': 'justify-content',
  'justify-around': 'justify-content',
  'justify-evenly': 'justify-content',
  'justify-stretch': 'justify-content',

  // Justify items
  'justify-items-start': 'justify-items',
  'justify-items-end': 'justify-items',
  'justify-items-center': 'justify-items',
  'justify-items-stretch': 'justify-items',

  // Justify self
  'justify-self-auto': 'justify-self',
  'justify-self-start': 'justify-self',
  'justify-self-end': 'justify-self',
  'justify-self-center': 'justify-self',
  'justify-self-stretch': 'justify-self',

  // Place content
  'place-content-center': 'place-content',
  'place-content-start': 'place-content',
  'place-content-end': 'place-content',
  'place-content-between': 'place-content',
  'place-content-around': 'place-content',
  'place-content-evenly': 'place-content',
  'place-content-baseline': 'place-content',
  'place-content-stretch': 'place-content',

  // Place items
  'place-items-start': 'place-items',
  'place-items-end': 'place-items',
  'place-items-center': 'place-items',
  'place-items-baseline': 'place-items',
  'place-items-stretch': 'place-items',

  // Place self
  'place-self-auto': 'place-self',
  'place-self-start': 'place-self',
  'place-self-end': 'place-self',
  'place-self-center': 'place-self',
  'place-self-stretch': 'place-self',

  // Grid flow
  'grid-flow-row': 'grid-flow',
  'grid-flow-col': 'grid-flow',
  'grid-flow-dense': 'grid-flow',
  'grid-flow-row-dense': 'grid-flow',
  'grid-flow-col-dense': 'grid-flow',
};

/**
 * Cache for parsed class conflict groups.
 * Using WeakMap-like pattern with string keys for better performance.
 */
const conflictCache = new Map<string, string>();

/**
 * Maximum cache size to prevent memory leaks.
 */
const MAX_CACHE_SIZE = 10_000;

/**
 * Gets the conflict group for a given Tailwind class.
 * Classes in the same conflict group will override each other.
 *
 * @param className - The Tailwind class name to analyze
 * @returns The conflict group identifier, or null if no conflict group applies
 */
function getConflictGroup(className: string): string | null {
  // Check cache first
  const cached = conflictCache.get(className);
  if (cached !== undefined) {
    return cached || null;
  }

  let group: string | null = null;

  // Extract the base class (without responsive/state prefixes)
  // E.g., "sm:hover:bg-red-500" -> "bg-red-500"
  const baseClass = className.includes(':')
    ? className.slice(Math.max(0, className.lastIndexOf(':') + 1))
    : className;

  // Handle negative values (e.g., "-m-4" -> "m")
  const normalizedClass = baseClass.startsWith('-') ? baseClass.slice(1) : baseClass;

  // Check standalone classes first (exact match)
  if (STANDALONE_CLASSES[normalizedClass]) {
    group = STANDALONE_CLASSES[normalizedClass];
  } else {
    // Check prefixed classes
    // Extract prefix by finding the longest matching prefix
    let longestPrefix = '';

    for (const prefix of Object.keys(CONFLICT_GROUPS)) {
      if (
        (normalizedClass === prefix ||
          (normalizedClass.startsWith(prefix) &&
            (normalizedClass[prefix.length] === '-' ||
              normalizedClass.length === prefix.length))) &&
        prefix.length > longestPrefix.length
      ) {
        longestPrefix = prefix;
      }
    }

    if (longestPrefix) {
      // Special handling for color classes
      const prefix = longestPrefix;
      const value = normalizedClass.slice(Math.max(0, prefix.length + 1));

      // Check if this is a color value (contains color name or hex-like pattern)
      group = isColorValue(prefix, value) ? `${prefix}-color` : (CONFLICT_GROUPS[prefix] ?? null);
    }
  }

  // Handle arbitrary values [...]
  if (!group && normalizedClass.includes('[')) {
    const prefix = normalizedClass.slice(0, Math.max(0, normalizedClass.indexOf('[')));
    if (prefix && CONFLICT_GROUPS[prefix.replace(/-$/, '')]) {
      group = CONFLICT_GROUPS[prefix.replace(/-$/, '')];
    }
  }

  // Store in cache with size limit management
  if (conflictCache.size >= MAX_CACHE_SIZE) {
    // Clear oldest entries (simple strategy: clear half the cache)
    const entries = [...conflictCache.keys()];
    for (let i = 0; i < MAX_CACHE_SIZE / 2; i++) {
      conflictCache.delete(entries[i]!);
    }
  }
  conflictCache.set(className, group ?? '');

  return group;
}

/**
 * Common color names in Tailwind CSS.
 */
const COLOR_NAMES = new Set([
  'inherit',
  'current',
  'transparent',
  'black',
  'white',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
]);

/**
 * Prefixes that commonly use color values.
 */
const COLOR_PREFIXES = new Set([
  'text',
  'bg',
  'border',
  'ring',
  'outline',
  'shadow',
  'accent',
  'caret',
  'fill',
  'stroke',
  'placeholder',
  'divide',
  'decoration',
  'from',
  'via',
  'to',
  'ring-offset',
]);

/**
 * Checks if a value represents a color.
 *
 * @param prefix - The class prefix
 * @param value - The value after the prefix
 * @returns True if the value represents a color
 */
function isColorValue(prefix: string, value: string): boolean {
  if (!COLOR_PREFIXES.has(prefix)) {
    return false;
  }

  if (!value) {
    return false;
  }

  // Check for color name (e.g., "red", "blue-500")
  const colorPart = value.split('-')[0];
  if (colorPart && COLOR_NAMES.has(colorPart)) {
    return true;
  }

  // Check for arbitrary color values
  if (value.startsWith('[') && value.includes('#')) {
    return true;
  }

  return false;
}

/**
 * Gets the variant prefix from a class name.
 * E.g., "sm:hover:bg-red-500" -> "sm:hover:"
 *
 * @param className - The full class name
 * @returns The variant prefix or empty string
 */
function getVariantPrefix(className: string): string {
  const lastColonIndex = className.lastIndexOf(':');
  if (lastColonIndex === -1) {
    return '';
  }
  return className.slice(0, Math.max(0, lastColonIndex + 1));
}

/**
 * Merges Tailwind CSS classes, resolving conflicts by keeping the last specified class.
 *
 * This function intelligently handles Tailwind class conflicts where later classes
 * should override earlier ones. It understands Tailwind's class structure including:
 * - Spacing utilities (padding, margin, gap)
 * - Sizing utilities (width, height)
 * - Typography utilities (text size, font weight, etc.)
 * - Color utilities (text color, background color, border color)
 * - Layout utilities (display, position, flexbox, grid)
 * - And many more...
 *
 * @param classes - One or more class strings to merge
 * @returns A merged class string with conflicts resolved
 *
 * @example
 * ```typescript
 * twMerge('px-2 py-1', 'px-4'); // 'py-1 px-4'
 * twMerge('text-red-500', 'text-blue-500'); // 'text-blue-500'
 * twMerge('p-4', 'p-2'); // 'p-2'
 * twMerge('flex flex-col', 'flex-row'); // 'flex flex-row'
 * twMerge('sm:p-4', 'sm:p-2'); // 'sm:p-2'
 * twMerge('hover:bg-red-500', 'hover:bg-blue-500'); // 'hover:bg-blue-500'
 * ```
 */
export function twMerge(...classes: (string | undefined | null | false)[]): string {
  // Filter and join all class strings
  const allClasses = classes
    .filter((c): c is string => typeof c === 'string' && c.length > 0)
    .join(' ');

  if (!allClasses) {
    return '';
  }

  // Split into individual classes and filter empty strings
  const classList = allClasses.split(/\s+/).filter(Boolean);

  if (classList.length === 0) {
    return '';
  }

  if (classList.length === 1) {
    return classList[0]!;
  }

  // Track which conflict groups have been seen, keyed by variant prefix + group
  // This allows sm:p-4 and p-2 to coexist, but sm:p-4 and sm:p-2 to conflict
  const seenGroups = new Map<string, number>();
  const result: string[] = [];

  // Process classes in reverse order to identify which ones to keep
  for (let i = classList.length - 1; i >= 0; i--) {
    const cls = classList[i]!;
    const variantPrefix = getVariantPrefix(cls);
    const conflictGroup = getConflictGroup(cls);

    if (conflictGroup) {
      // Create a unique key combining variant prefix and conflict group
      const groupKey = `${variantPrefix}${conflictGroup}`;

      if (!seenGroups.has(groupKey)) {
        seenGroups.set(groupKey, i);
        result.unshift(cls);
      }
      // Skip this class if we've already seen a later class in the same group
    } else {
      // No conflict group, always include
      result.unshift(cls);
    }
  }

  return result.join(' ');
}
