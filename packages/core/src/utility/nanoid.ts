const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

/**
 * Generate a random string with a fixed length.
 * @param size The length of the generated string.
 * @returns A random string.
 */
export function nanoid(size: number = 21): string {
  let id = '';
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    id += alphabet[randomIndex];
  }
  return id;
}
