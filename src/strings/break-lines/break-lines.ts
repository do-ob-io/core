/**
 * Breaks a string into an array of strings based on maximum line length.
 *
 * Breaks the input string into multiple lines, ensuring that no line exceeds
 * the specified maximum length. The function breaks at word boundaries to avoid
 * splitting words apart.
 *
 * @param str - The string to break into lines
 * @param length - The maximum length for each line
 * @returns An array of strings, each respecting the maximum line length
 *
 * @example
 * ```ts
 * breakLines('hello world', 5) // ['hello', 'world']
 * breakLines('the quick brown fox jumps', 10) // ['the quick', 'brown fox', 'jumps']
 * breakLines('short', 20) // ['short']
 * ```
 */
export function breakLines(str: string, length: number): string[] {
  if (!str || length <= 0) {
    return [];
  }

  const words = str.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    // If the word itself is longer than the max length, add it on its own line
    if (word.length > length) {
      if (currentLine) {
        lines.push(currentLine.trim());
        currentLine = '';
      }
      lines.push(word);
      continue;
    }

    // Check if adding this word would exceed the max length
    const testLine = currentLine ? `${currentLine} ${word}` : word;

    if (testLine.length > length) {
      // Current line is full, push it and start a new line with this word
      if (currentLine) {
        lines.push(currentLine.trim());
      }
      currentLine = word;
    } else {
      // Add word to current line
      currentLine = testLine;
    }
  }

  // Don't forget the last line
  if (currentLine) {
    lines.push(currentLine.trim());
  }

  return lines;
}
