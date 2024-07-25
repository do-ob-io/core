/**
 * Fowler–Noll–Vo (FNV-1a) hash algorithm
 */
export function fasthash(str: string): number {
  const FNV_PRIME = 0x01000193;
  const OFFSET_BASIS = 0x811c9dc5;
  let hash = OFFSET_BASIS;

  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * FNV_PRIME) >>> 0;
  }

  return hash;
}
