# do-ob Core Node.js Library

The Core packages defines common functions, constants, types, and regular expressions for re-use across all other do-ob projects. The source is organized into sub-modules under the `src` folder:

- **strings**: Common utilities for mutating, encoding, and decoding string types.
- **structs**: TypeScript interfaces and types for common data structures.
- **crypto**: Simple cryptographic algorithms for hashing, structuring, and encrypting/decrypting data.

## Devlopment Instructions
- New code should work for both a browser and Node.js environment only using polyfils if absolutely necessary.
- This package should rely on zero dependencies in its release.

## Testing instructions
- From the package root you can call `pnpm test`. Updates/additions should pass all tests.
- To focus on one step, add the Vitest pattern: `pnpm vitest run -t "<test name>"`.
- Fix any test or type errors until the whole suite is green.
- After moving files or changing imports, run `pnpm lint` from this directory to be sure ESLint and TypeScript rules still pass.
- Add or update tests for the code you change, even if nobody asked.

## PR instructions
- Title format: <Title>
- Always run `pnpm lint` and `pnpm test` before committing.