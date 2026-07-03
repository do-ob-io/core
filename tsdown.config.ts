import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/data/index.ts', 'src/strings/index.ts', 'src/web/index.ts'],
  exports: true,
  minify: true,
  dts: true,
});
