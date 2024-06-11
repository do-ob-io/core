/**
 * Constructs class names conditionally.
 */
export function clsx(...args: unknown[]) {
  let i=0, tmp, str='';
  const len = args.length;
  for (; i < len; i++) {
    tmp = args[i];
    if (typeof tmp === 'string' && tmp) {
      str += (str && ' ') + tmp;
    }
  }
  return str;
}

export default clsx;
