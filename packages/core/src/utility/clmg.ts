/**
 * Ensures a class name string only contains unique class names.
 */
export function clmg(className: string) {
  return className.split(' ').filter((value, index, self) => self.indexOf(value) === index).join(' ');
}
