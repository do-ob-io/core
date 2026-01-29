# @do-ob/core Library

Foundational utilities shared across all do-ob projects. Zero runtime dependencies, runs in both Node.js and browsers.

## Quality Instructions

- **Typecheck**: `tsc --noEmit`
- **Lint**: `eslint --fix`
- **Test**: `vitest run`
- **Build**: `pnpm build`

## Structure

- `src/strings/` — String mutation, encoding/decoding, normalization
- `src/web` - Website oriented utilities
- `src/node` - Node.js-only utilities
- `src/browser/` — Browser-only utilities

## Technical Stack

- **Language**: TypeScript
- **Runtime**: Node.js + Browser (isomorphic)
- **Test Framework**: Vitest

## Rules

- Code must run in both Node.js and modern browsers environment or apply polyfills
- If code cannot be build for both Node.js and Browser, the code must be placed in the repective `src/node` or `src/browser` module
- Create new modules if necessary to keep utilities organized
- No dependencies may be added to the published package
