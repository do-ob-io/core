const strings: Record<string, string> = {
  'hello': 'Hello, World!',
};

export function greet(key: string): string {
  return strings[key] || 'Greeting not found';
}
