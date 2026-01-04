# AGENT.md — do-ob Core Node.js Library

## Project Overview

The **do-ob Core** package provides foundational utilities shared across all do-ob projects.  
It is intentionally small, dependency-free, and environment-agnostic.

All source code lives under `src/` and is organized into focused submodules:

- **strings** — String mutation, encoding/decoding, and normalization utilities
- **structs** — Reusable TypeScript types, interfaces, and structural helpers
- **crypto** — Lightweight cryptographic helpers (hashing, structuring, encrypt/decrypt)
- **web** — Browser-only utilities (fetch wrappers, URL manipulation, HTML class helpers)

This package is a *low-level dependency*. Changes here ripple outward—treat modifications with care.

## Development Constraints (Hard Rules)

AI agents **must comply with all of the following**:

1. **Environment Compatibility**
   - Code **must run in both Node.js and modern browsers**
   - Avoid Node-only APIs (`fs`, `crypto` Node module, etc.)
   - Use polyfills **only if absolutely unavoidable**, and prefer standards-based APIs

2. **Zero Runtime Dependencies**
   - **No dependencies** may be added to the published package
   - Do not introduce transitive dependencies via helpers or build artifacts
   - Dev-only tooling changes are acceptable only if explicitly requested

3. **Minimal Surface Area**
   - Prefer small, composable utilities
   - Avoid clever abstractions or over-generalization
   - Public APIs should remain stable unless explicitly instructed otherwise

## Testing & Validation Requirements

This project uses **Vitest** for unit testing. Before considering any change complete, AI agents **must ensure**:

1. **All tests pass**
   ```bash
   pnpm test
   ```

2. **A test exists for every new utility**
   - New functions/classes **must have corresponding tests** in `*.test.ts` files
   - Tests should cover typical use cases, edge cases, and error conditions

### Test Files
- Tests must be written in files suffixed with `*.test.ts`
- Tests execute in a **Node.js environment**
- Test files should be colocated near the code they validate when practical


